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

function round(n, to) {
  return Math.round(Number(n) / to) * to;
}

// Advance amount. Prefers the calculator's own high estimate when we have
// one (the lead has already been shown that number, and quoting less than
// they were promised is the fastest way to lose a deal). Otherwise falls
// back to a multiple of monthly revenue.
function advanceFor(estimate) {
  const e = estimate || {};
  const high = Number(e.high) || 0;
  if (high > 0) return round(high, 500);
  const revenue = Number(e.revenue) || 0;
  if (revenue > 0) return round(Math.min(revenue * 1.1, 250000), 500);
  return 0;
}

// Price an offer for a lead.
//
// Pure and deterministic: same estimate in, same terms out. That matters
// because /api/offer-create is idempotent — re-pricing an existing offer
// must produce the same numbers, or a lead who reloads the page sees their
// terms move under them.
//
// Returns null when we don't have enough to quote anything, so callers can
// refuse rather than invent a number.
function priceOffer(estimate) {
  const e = estimate || {};
  const advanceAmount = advanceFor(e);
  if (!advanceAmount) return null;

  let tier = TIB_TIER[e.tib];
  if (!Number.isInteger(tier)) tier = 1; // unknown time-in-business → conservative

  // Card-accepting merchants repay through a channel we can see daily, so
  // they earn the next band down. Never past the best band.
  if (e.acceptsCards === true && Number(e.cardSales) > 0) {
    tier = Math.min(BANDS.length - 1, tier + 1);
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
  BANDS,
  priceOffer,
  expiryFrom,
  mintOfferCode,
};
