// POST /api/offer-create
//   body: { leadId }
//   → { ok: true, offer: { offerCode, advanceAmount, factorRate, termMonths,
//                          totalRepayment, weeklyDebit, termsVersion,
//                          expiresAt, status } }
//
// Issues (or re-returns) the funding offer shown on step 4 of the apply
// modal.
//
// Two properties matter here:
//
//   IDEMPOTENT. If the lead already has a live quote we return that one
//   rather than minting a new one. The offer screen used to generate its
//   identity with Math.random() inside a useMemo, so the "offer ID" changed
//   whenever React re-rendered and nothing was ever persisted. An applicant
//   who reloads must see the same reference and the same numbers.
//
//   GATED ON BANK DATA. We refuse to quote a lead who hasn't reached
//   plaid_connected. Pricing is supposed to be against real deposits; a
//   number invented before the bank link is a number we can't stand behind.
//
// Pricing itself lives in api/_offer-terms.js and never runs client-side.

const store = require('./_store');
const { priceOffer, expiryFrom, mintOfferCode } = require('./_offer-terms');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Shape a DB row into the camelCase payload the client renders.
function present(row) {
  return {
    offerCode:      row.offer_code,
    advanceAmount:  Number(row.advance_amount),
    factorRate:     Number(row.factor_rate),
    termMonths:     Number(row.term_months),
    totalRepayment: Number(row.total_repayment),
    weeklyDebit:    Number(row.weekly_debit),
    termsVersion:   row.terms_version,
    expiresAt:      row.expires_at,
    status:         row.status,
  };
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'method_not_allowed' }); return; }

  if (!store.ENABLED) {
    // No database means no offer we could stand behind. Say so plainly
    // rather than letting the client fall back to inventing terms.
    res.status(503).json({ error: 'offers_unavailable' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const leadId = String(body.leadId || '').trim();
  if (!leadId) { res.status(400).json({ error: 'lead_id_required' }); return; }

  try {
    const lead = await store.getLead(leadId);
    if (!lead) { res.status(404).json({ error: 'lead_not_found' }); return; }

    // Already quoted and still live → return it unchanged.
    const open = await store.findOpenOffer(leadId);
    if (open) { res.status(200).json({ ok: true, offer: present(open) }); return; }

    // Gate: no bank connection, no quote.
    const latest = await store.latestEventsFor([leadId]);
    const stage = store.applyStage({ ...lead, latest_event: latest.get(leadId) || null });
    if (stage === 'new' || stage === 'opened') {
      res.status(409).json({
        error: 'bank_connection_required',
        message: 'Connect your bank account so we can price your offer against real deposits.',
      });
      return;
    }

    const terms = priceOffer(lead.estimate || {});
    if (!terms) {
      // We have bank data but nothing to size the advance from. Better to
      // hand this to a human than to guess at a number.
      res.status(409).json({
        error: 'insufficient_data',
        message: "We need a little more information before we can price this. We'll call you shortly.",
      });
      return;
    }

    const created = await store.createOffer({
      leadId,
      offerCode: mintOfferCode(),
      expiresAt: expiryFrom().toISOString(),
      meta: { stage, source: lead.source || null },
      ...terms,
    });
    if (!created) { res.status(500).json({ error: 'offer_create_failed' }); return; }

    // Best-effort milestone — a failure here must not cost the applicant
    // their offer.
    try {
      await store.recordEvent({
        leadId,
        event: 'offer_presented',
        meta: { offerCode: created.offer_code },
      });
    } catch (err) {
      console.error('[offer-create] recordEvent failed:', err && err.message);
    }

    res.status(200).json({ ok: true, offer: present(created) });
  } catch (err) {
    console.error('[offer-create] failed:', err && err.message);
    res.status(500).json({ error: 'offer_create_failed' });
  }
};

module.exports.__test = { present };
