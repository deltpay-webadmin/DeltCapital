// Offer pricing — the single source of truth for what we quote.
//
// This exists because pricing used to live in the browser. app/variation-1-apply.jsx
// hardcoded `const factor = prefill?.factor || 1.18` and `const term = 8`,
// computed the repayment client-side, and minted the offer ID with
// Math.random() on every render. Anybody with devtools could re-price their
// own advance, and the "offer" changed identity each time React re-rendered.
//
// Pricing now happens here, server-side, and nowhere else. The client
// renders what /api/offer-create returns and has no say in the numbers.
//
// The bands below reproduce today's quoted terms (1.18x over 8 months) as
// the middle band so existing offers don't move, with adjacent bands for
// stronger and weaker files. They are a starting structure, not a
// credit policy — see the note in the PR about getting these reviewed by
// whoever owns the lending side before this goes live.

// Bump when the bands, the fee structure, or the agreement text changes.
// Every accepted offer records the version it was signed under, so a later
// repricing can never retroactively change what somebody agreed to.
const TERMS_VERSION = '2026-08-01';

// Months in business → risk tier. Matches the `tib` values the calculator
// collects (app/variation-1-calculator.jsx).
const TIB_TIER = {
  '<6mo': 0,
  '6-12mo': 1,
  '1-2yr': 2,
  '2yr+': 3,
};

// [factorRate, termMonths] by tier. Longer term + lower factor as the file
// gets stronger. Tier 2 is the current production quote.
const BANDS = [
  [1.32, 6],
  [1.24, 7],
  [1.18, 8],
  [1.12, 10],
];

// Ceiling on any single advance, verified or not.
const MAX_ADVANCE = 250000;

// Share of one month's verified deposits we'll advance. Deliberately at the
// conservative end — this multiplies a number we trust, so the failure mode
// is quoting slightly under rather than over.
const VERIFIED_ADVANCE_MULTIPLE = 1.0;

function round(n, to) {
  return Math.round(Number(n) / to) * to;
}

// ── Where the advance amount comes from ──
//
// Two sources, and the difference matters:
//
//   VERIFIED   — bank_metrics, derived from the merchant's actual deposits
//                (api/_bank-metrics.js). What their bank says.
//   SELF-REPORTED — the calculator estimate. What they typed into a slider.
//
// Verified wins whenever it's usable. Beyond being the better number, it's
// the only thing that makes the offer card's "priced against your connected
// account" true, and it's what lets apply-form leads — who never touch the
// calculator and previously could not be quoted at all — get an offer.
function advanceFrom({ metrics, estimate }) {
  if (metrics && metrics.usableForPricing && Number(metrics.pricingRevenue) > 0) {
    const revenue = Number(metrics.pricingRevenue);
    let amount = revenue * VERIFIED_ADVANCE_MULTIPLE;

    // The merchant is already carrying an advance. We don't refuse — that's
    // an underwriter's call, and the flag rides along on the offer for them
    // to see — but we don't stack at full size either.
    if (Array.isArray(metrics.flags) && metrics.flags.includes('existing_advance_detected')) {
      amount *= 0.6;
    }
    // Lumpy revenue repays a fixed weekly debit far less comfortably, so
    // size against the worst month we saw rather than the median.
    if (Array.isArray(metrics.flags) && metrics.flags.includes('volatile_deposits')) {
      amount = Math.min(amount, Number(metrics.lowestMonthlyDeposits) || amount);
    }
    return { advanceAmount: round(Math.min(amount, MAX_ADVANCE), 500), basis: 'verified_deposits' };
  }

  const e = estimate || {};
  const high = Number(e.high) || 0;
  if (high > 0) {
    // The lead has already been shown this number by the calculator, and
    // quoting under what they were promised loses the deal.
    return { advanceAmount: round(Math.min(high, MAX_ADVANCE), 500), basis: 'self_reported' };
  }
  const revenue = Number(e.revenue) || 0;
  if (revenue > 0) {
    return { advanceAmount: round(Math.min(revenue * 1.1, MAX_ADVANCE), 500), basis: 'self_reported' };
  }
  return { advanceAmount: 0, basis: null };
}

// Price an offer for a lead.
//
// Pure and deterministic: same inputs, same terms out. That matters because
// /api/offer-create is idempotent — re-pricing an existing offer must
// produce the same numbers, or a lead who reloads sees their terms move.
//
// Accepts either priceOffer(estimate) or priceOffer({ estimate, metrics }).
// The positional form is kept because it's how the earlier offer code called
// this, and silently changing that would have been a trap.
//
// Returns null when there's nothing to quote on, so callers refuse rather
// than invent a number.
function priceOffer(input) {
  const arg = input || {};
  // Distinguish a wrapper object from a bare estimate. A bare estimate never
  // carries `estimate`/`metrics` keys.
  const wrapped = Object.prototype.hasOwnProperty.call(arg, 'estimate')
    || Object.prototype.hasOwnProperty.call(arg, 'metrics');
  const estimate = wrapped ? (arg.estimate || {}) : arg;
  const metrics = wrapped ? (arg.metrics || null) : null;

  const { advanceAmount, basis } = advanceFrom({ metrics, estimate });
  if (!advanceAmount) return null;

  let tier = TIB_TIER[estimate.tib];
  if (!Number.isInteger(tier)) tier = 1; // unknown time-in-business → conservative

  // Card-accepting merchants repay through a channel we can see daily, so
  // they earn the next band down. Never past the best band.
  if (estimate.acceptsCards === true && Number(estimate.cardSales) > 0) {
    tier = Math.min(BANDS.length - 1, tier + 1);
  }

  if (basis === 'verified_deposits') {
    // Verified deposit history is worth a band on its own — we're pricing
    // against something we can see rather than something we were told.
    tier = Math.min(BANDS.length - 1, tier + 1);
    // ...and the risk signals give it back.
    const flags = (metrics && metrics.flags) || [];
    if (flags.includes('frequent_nsf')) tier = Math.max(0, tier - 1);
    if (flags.includes('existing_advance_detected')) tier = Math.max(0, tier - 1);
  }

  const [factorRate, termMonths] = BANDS[tier];
  const totalRepayment = round(advanceAmount * factorRate, 1);
  // 4.33 weeks per month — the same divisor the offer screen has always
  // used, kept so the weekly figure doesn't shift under existing leads.
  const weeklyDebit = round(totalRepayment / (termMonths * 4.33), 1);

  return {
    advanceAmount,
    factorRate,
    termMonths,
    totalRepayment,
    weeklyDebit,
    termsVersion: TERMS_VERSION,
    // Recorded on the offer so an underwriter can tell at a glance whether
    // these terms rest on bank data or on a slider.
    pricingBasis: basis,
  };
}

// How long a quote stands. Priced against live bank data, so it has to
// expire — this is the real deadline the nudge email now quotes instead of
// the "Locked 72h" text that was hardcoded into the UI.
const OFFER_TTL_HOURS = 72;

function expiryFrom(date = new Date()) {
  return new Date(date.getTime() + OFFER_TTL_HOURS * 60 * 60 * 1000);
}

// Human-readable offer code. Random, but minted once and persisted, unlike
// the per-render Math.random() it replaces.
function mintOfferCode(now = new Date()) {
  const year = now.getUTCFullYear();
  const n = Math.floor(100000 + Math.random() * 900000);
  return `DLT-${year}-${n}`;
}

module.exports = {
  TERMS_VERSION,
  OFFER_TTL_HOURS,
  MAX_ADVANCE,
  BANDS,
  priceOffer,
  expiryFrom,
  mintOfferCode,
  __test: { advanceFrom },
};
