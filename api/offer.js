// GET /api/offer?leadId=<uuid>  or  /api/offer?code=<offer_code>
//   → { ok: true, offer: {...} } | { ok: true, offer: null }
//
// Read-only lookup for an existing offer. /api/offer-create is what the
// apply modal calls (it issues-or-returns in one round trip); this exists
// for the cases where you want to look at a quote without the possibility
// of minting one:
//   • the nudge cron quoting a lead's real terms and real expiry
//   • the admin dashboard
//   • checking whether a link in an old email still points at a live offer
//
// Deliberately returns no lead PII — just the terms — so it stays safe to
// call with an offer code from an email.

const store = require('./_store');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function present(row) {
  if (!row) return null;
  const expired = new Date(row.expires_at).getTime() <= Date.now();
  return {
    offerCode:      row.offer_code,
    advanceAmount:  Number(row.advance_amount),
    factorRate:     Number(row.factor_rate),
    termMonths:     Number(row.term_months),
    totalRepayment: Number(row.total_repayment),
    weeklyDebit:    Number(row.weekly_debit),
    termsVersion:   row.terms_version,
    expiresAt:      row.expires_at,
    // The stored status is only updated when something acts on the offer,
    // so a 'presented' row can be past its expiry. Report what's true now
    // rather than what was written.
    status:         row.status === 'presented' && expired ? 'expired' : row.status,
  };
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET')     { res.status(405).json({ error: 'method_not_allowed' }); return; }

  if (!store.ENABLED) { res.status(503).json({ error: 'offers_unavailable' }); return; }

  const url = new URL(req.url || '/', 'http://x');
  const leadId = (url.searchParams.get('leadId') || '').trim();
  const code   = (url.searchParams.get('code') || '').trim();
  if (!leadId && !code) { res.status(400).json({ error: 'lead_id_or_code_required' }); return; }

  try {
    const row = code
      ? await store.getOfferByCode(code)
      : await store.findOpenOffer(leadId);
    res.status(200).json({ ok: true, offer: present(row) });
  } catch (err) {
    console.error('[offer] lookup failed:', err && err.message);
    res.status(500).json({ error: 'offer_lookup_failed' });
  }
};

module.exports.__test = { present };
