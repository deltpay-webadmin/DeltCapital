// Deposit metrics — turning a lead's real bank activity into the numbers we
// price an advance from.
//
// Why this exists: api/_offer-terms.js could only size an advance from the
// calculator's estimate, which is whatever the applicant typed into a slider.
// Leads who came through the apply form never touched the calculator, so
// there was nothing to price on at all and they could not be quoted. Meanwhile
// the offer card told everyone their terms were "priced against your connected
// account", which was not true of anybody.
//
// This module makes that sentence true.
//
// ── A deliberate constraint ──
// This app does NOT hold Plaid access tokens. api/plaid-exchange-token.js
// forwards them to the CRM's Plaid Data Vault and discards its local copy;
// that is an existing architectural decision by the owners and this module
// respects it. So everything here is a PURE FUNCTION over transaction data
// that a caller already has in hand, and the only thing persisted is the
// derived aggregate. No token reaches this file, the leads table, or any log.
//
// Everything below is deterministic: same transactions in, same metrics out.
// That matters because offers are idempotent — a lead who reloads must not
// see their terms move.

const METRICS_VERSION = '2026-08-01';

// How much history we want, and the least we'll accept before calling the
// result usable for pricing. Three complete months is the floor most MCA
// underwriting uses; below that a single good or bad month dominates.
const LOOKBACK_DAYS = 180;
const MIN_MONTHS_FOR_PRICING = 3;

// ── Plaid's sign convention ──
//
// For depository accounts Plaid reports `amount` as POSITIVE when money
// leaves the account and NEGATIVE when money enters it. So a deposit is a
// NEGATIVE amount. This is the single easiest thing in this file to get
// backwards, and getting it backwards would silently price advances off the
// merchant's spending instead of their revenue — a number that looks
// plausible and is completely wrong.
//
// It is isolated here, and covered directly by the tests, so it can never be
// quietly inverted somewhere in the middle of a reduce().
function isDeposit(txn) {
  return Number(txn.amount) < 0;
}
function depositAmount(txn) {
  return Math.abs(Number(txn.amount));
}

// ── What must not count as revenue ──
//
// Plaid runs TWO live personal_finance_category taxonomies, and loan proceeds
// moved between them. Integrations enabled before 2025-12-03 get v1 by
// default; anything newer only ever receives v2. We therefore match BOTH,
// because guessing wrong here is not a crash — it is an inflated advance.
//
//   money in, loan/advance proceeds   v2: LOAN_DISBURSEMENTS
//                                     v1: TRANSFER_IN
//                                         (TRANSFER_IN_CASH_ADVANCES_AND_LOANS)
//   money in, own other account       both: TRANSFER_IN
//
// Excluding these is the single most important rule in this file. An MCA
// advance landing in the account looks exactly like a great sales month;
// counting it as revenue would size the next advance on top of the last one,
// which is the stacking spiral that buries merchants. When in doubt we
// exclude, and record what we held out.
const EXCLUDED_PRIMARY = new Set(['TRANSFER_IN', 'LOAN_DISBURSEMENTS']);

// Legacy category fallback, matched case-insensitively against any element.
// Only consulted when personal_finance_category is absent entirely.
const EXCLUDED_LEGACY = ['transfer', 'loan', 'internal account transfer'];

function excludedReason(txn) {
  const pfc = txn.personal_finance_category;
  const primary = pfc && typeof pfc.primary === 'string' ? pfc.primary.toUpperCase() : '';
  if (primary && EXCLUDED_PRIMARY.has(primary)) return primary;

  // Only consult the legacy taxonomy when the modern one is absent —
  // otherwise a correctly-categorised INCOME transaction could be dropped
  // because its legacy array happens to mention "Transfer".
  if (!primary && Array.isArray(txn.category)) {
    // Normalised, so the excludedBy audit tally doesn't split the same
    // reason across "Transfer" and "transfer".
    const hit = txn.category
      .map((c) => String(c || '').trim().toLowerCase())
      .find((c) => EXCLUDED_LEGACY.includes(c));
    if (hit) return `legacy:${hit}`;
  }
  return null;
}

// Signs of an advance the merchant is already carrying, in either taxonomy.
// Not used to adjust the revenue figure — it's an underwriting signal, and
// the person pricing the deal should see it rather than have it silently
// baked into a number.
function isExistingAdvanceSignal(txn) {
  const pfc = txn.personal_finance_category;
  const detailed = pfc && typeof pfc.detailed === 'string' ? pfc.detailed.toUpperCase() : '';
  if (detailed.includes('CASH_ADVANCES')) return true;
  const primary = pfc && typeof pfc.primary === 'string' ? pfc.primary.toUpperCase() : '';
  return primary === 'LOAN_DISBURSEMENTS';
}

// NSF and overdraft fees. A merchant paying these regularly is a merchant
// whose account runs dry, which is the clearest risk signal available from
// transactions alone.
function isNsfFee(txn) {
  const pfc = txn.personal_finance_category;
  const detailed = pfc && typeof pfc.detailed === 'string' ? pfc.detailed.toUpperCase() : '';
  if (detailed.includes('OVERDRAFT') || detailed.includes('INSUFFICIENT')) return true;
  const name = String(txn.name || txn.merchant_name || '').toLowerCase();
  return /\b(nsf|overdraft|insufficient funds|returned item)\b/.test(name);
}

// YYYY-MM bucket key. Plaid dates are 'YYYY-MM-DD' strings in the item's
// timezone; we slice rather than parse to avoid a UTC round-trip silently
// moving a transaction across a month boundary.
function monthKey(date) {
  return String(date || '').slice(0, 7);
}

function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

// Compute deposit metrics.
//
//   transactions — Plaid transaction objects (/transactions/get or /sync)
//   accounts     — Plaid account objects, used to restrict to depository
//                  accounts; pass none to accept every transaction
//   asOf         — the "today" to measure the window against. Explicit so
//                  the function stays pure and testable.
//
// Returns null when there is nothing usable, so callers can fall back rather
// than act on a zeroed-out object.
function computeBankMetrics({ transactions, accounts, asOf }) {
  const txns = Array.isArray(transactions) ? transactions : [];
  if (!txns.length) return null;

  const now = asOf ? new Date(asOf) : new Date();
  const windowStart = new Date(now.getTime() - LOOKBACK_DAYS * 86400000);
  const windowStartStr = windowStart.toISOString().slice(0, 10);
  const nowStr = now.toISOString().slice(0, 10);

  // Restrict to depository accounts. A credit card's "deposits" are payments
  // toward the card, not revenue.
  let depositoryIds = null;
  if (Array.isArray(accounts) && accounts.length) {
    depositoryIds = new Set(
      accounts
        .filter((a) => String(a.type || '').toLowerCase() === 'depository')
        .map((a) => a.account_id)
        .filter(Boolean)
    );
    // If the caller gave us accounts but none were depository, we have no
    // business inferring revenue from what's left.
    if (!depositoryIds.size) return null;
  }

  const byMonth = new Map(); // 'YYYY-MM' -> { total, count }
  let nsfCount = 0;
  let existingAdvanceSignals = 0;
  let excludedCount = 0;
  let excludedTotal = 0;
  const excludedBy = {};

  for (const t of txns) {
    if (t.pending) continue;
    if (depositoryIds && t.account_id && !depositoryIds.has(t.account_id)) continue;

    const date = t.date || t.authorized_date;
    if (!date || date < windowStartStr || date > nowStr) continue;

    // Counted over ALL transactions, not just deposits — an existing advance
    // shows up as proceeds coming in AND as repayments going out.
    if (isNsfFee(t)) nsfCount += 1;
    if (isExistingAdvanceSignal(t)) existingAdvanceSignals += 1;

    if (!isDeposit(t)) continue;

    const reason = excludedReason(t);
    if (reason) {
      excludedCount += 1;
      excludedTotal += depositAmount(t);
      excludedBy[reason] = (excludedBy[reason] || 0) + 1;
      continue;
    }

    const k = monthKey(date);
    const bucket = byMonth.get(k) || { total: 0, count: 0 };
    bucket.total += depositAmount(t);
    bucket.count += 1;
    byMonth.set(k, bucket);
  }

  if (!byMonth.size) return null;

  // Drop the current, partial month — it is by definition incomplete and
  // would drag every average down for anyone applying mid-month.
  const currentMonth = monthKey(nowStr);
  const complete = [...byMonth.entries()]
    .filter(([k]) => k !== currentMonth)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1));

  if (!complete.length) return null;

  const totals = complete.map(([, v]) => v.total);
  const counts = complete.map(([, v]) => v.count);
  const monthsCovered = complete.length;

  const avgMonthlyDeposits = totals.reduce((a, b) => a + b, 0) / monthsCovered;
  const medianMonthlyDeposits = median(totals);
  const lowestMonthlyDeposits = Math.min(...totals);
  const avgMonthlyDepositCount = counts.reduce((a, b) => a + b, 0) / monthsCovered;

  // Volatility as a fraction of the median. High values mean lumpy revenue —
  // a few big contracts rather than steady daily takings — which repays a
  // fixed weekly debit far less comfortably.
  const spread = medianMonthlyDeposits > 0
    ? (Math.max(...totals) - lowestMonthlyDeposits) / medianMonthlyDeposits
    : 0;

  const flags = [];
  if (monthsCovered < MIN_MONTHS_FOR_PRICING) flags.push('insufficient_history');
  if (nsfCount >= 3) flags.push('frequent_nsf');
  if (spread > 1.5) flags.push('volatile_deposits');
  if (avgMonthlyDepositCount < 5) flags.push('sparse_deposits');
  if (existingAdvanceSignals > 0) flags.push('existing_advance_detected');

  return {
    version: METRICS_VERSION,
    source: 'plaid_transactions',
    // Aggregates only — see the header note. Nothing identifying a single
    // transaction, counterparty or account number is retained.
    monthsCovered,
    monthsIncluded: complete.map(([k]) => k),
    avgMonthlyDeposits: round2(avgMonthlyDeposits),
    medianMonthlyDeposits: round2(medianMonthlyDeposits),
    lowestMonthlyDeposits: round2(lowestMonthlyDeposits),
    avgMonthlyDepositCount: round2(avgMonthlyDepositCount),
    depositVolatility: round2(spread),
    nsfCount,
    existingAdvanceSignals,
    // Kept so an underwriter can see how much was held out and why, rather
    // than wondering why our revenue figure is below the account's inflows.
    excludedCount,
    excludedTotal: round2(excludedTotal),
    excludedBy,
    windowStart: windowStartStr,
    windowEnd: nowStr,
    computedAt: now.toISOString(),
    flags,
    // The one field pricing actually consumes. Median rather than mean, so a
    // single unusually large month cannot inflate an advance.
    pricingRevenue: round2(medianMonthlyDeposits),
    usableForPricing: monthsCovered >= MIN_MONTHS_FOR_PRICING && medianMonthlyDeposits > 0,
  };
}

module.exports = {
  METRICS_VERSION,
  LOOKBACK_DAYS,
  MIN_MONTHS_FOR_PRICING,
  computeBankMetrics,
  // Exported for tests — the sign convention and exclusion rules are the two
  // things worth pinning down directly.
  __test: {
    isDeposit, depositAmount, excludedReason, isNsfFee,
    isExistingAdvanceSignal, monthKey, median,
  },
};
