// POST /api/bank-metrics-ingest
//   headers: x-apply-secret: <APPLY_EXCHANGE_SECRET>
//   body: { leadId?, email?, transactions: [...], accounts?: [...] }
//   → { ok: true, metrics: { monthsCovered, pricingRevenue, usableForPricing, flags } }
//
// Accepts Plaid transaction data from whoever holds the access token, derives
// deposit metrics, and stores the aggregates against the lead so offers can
// be priced against verified revenue.
//
// ── Why this endpoint exists ──
//
// This app deliberately does not hold Plaid access tokens.
// api/plaid-exchange-token.js forwards the public token to the CRM's Plaid
// Data Vault, which exchanges it, stores the item, and runs a full data sync.
// That is the preferred path, and on it no token ever exists in this
// codebase — so we cannot fetch transactions ourselves.
//
// It also could not be done at exchange time even if we held the token.
// Plaid prepares transaction history asynchronously: /transactions/sync
// returns HTTP 200 with empty arrays until the historical pull completes,
// and the completion signal is the SYNC_UPDATES_AVAILABLE webhook with
// historical_update_complete: true.
//
// So the correct trigger is: token-holder waits for that webhook, pulls
// transactions, POSTs them here. This endpoint is the seam.
//
// ── For whoever wires up the caller ──
//
// Send raw Plaid transactions rather than your own pre-computed summary.
// The sign convention (deposits are NEGATIVE amounts) and the loan-proceeds
// exclusion (v2 LOAN_DISBURSEMENTS / v1 TRANSFER_IN — counting an existing
// advance as revenue is how merchants get stacked into a spiral) both live
// in api/_bank-metrics.js and should exist in exactly one place.
//
// Gate your call on historical_update_complete. Sending a partial pull
// produces a real but understated revenue figure, which is worse than
// sending nothing — we refuse to price on missing data, but we cannot detect
// data that merely looks complete.

const store = require('./_store');
const { computeBankMetrics } = require('./_bank-metrics');

const APPLY_SECRET = (process.env.APPLY_EXCHANGE_SECRET || '').trim();

// Constant-time-ish comparison. These are short shared secrets over TLS so
// timing analysis is not a realistic threat here, but length-independent
// comparison costs nothing.
function secretMatches(provided) {
  const a = String(provided || '');
  const b = APPLY_SECRET;
  if (!b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-apply-secret');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'method_not_allowed' }); return; }

  // Server-to-server only. Without a configured secret this endpoint stays
  // shut rather than falling open — it writes the number we lend against.
  if (!APPLY_SECRET) {
    console.error('[bank-metrics-ingest] APPLY_EXCHANGE_SECRET is not set — refusing');
    res.status(503).json({ error: 'ingest_not_configured' });
    return;
  }
  if (!secretMatches(req.headers['x-apply-secret'])) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  if (!store.ENABLED) { res.status(503).json({ error: 'store_unavailable' }); return; }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const leadId = String(body.leadId || '').trim() || null;
  const email = String(body.email || '').trim() || null;
  if (!leadId && !email) { res.status(400).json({ error: 'lead_id_or_email_required' }); return; }

  const transactions = Array.isArray(body.transactions) ? body.transactions : null;
  if (!transactions) { res.status(400).json({ error: 'transactions_required' }); return; }
  if (!transactions.length) {
    // Almost always an ungated call made before Plaid's historical pull
    // finished. Storing a $0 revenue figure from it would be far worse than
    // storing nothing, so say what happened and write nothing.
    res.status(400).json({
      error: 'no_transactions',
      message: 'Empty transaction list. Gate this call on the SYNC_UPDATES_AVAILABLE webhook with historical_update_complete: true.',
    });
    return;
  }

  try {
    const metrics = computeBankMetrics({
      transactions,
      accounts: Array.isArray(body.accounts) ? body.accounts : null,
    });
    if (!metrics) {
      res.status(422).json({
        error: 'no_usable_deposits',
        message: 'No complete month of qualifying deposits in the supplied transactions.',
      });
      return;
    }

    const updated = await store.setBankMetrics({ leadId, email, metrics });
    if (!updated) { res.status(404).json({ error: 'lead_not_found' }); return; }

    // Echo the summary, not the whole snapshot — the caller sent us the raw
    // data, so what's useful back is our verdict on it.
    res.status(200).json({
      ok: true,
      leadId: updated.id,
      metrics: {
        monthsCovered:    metrics.monthsCovered,
        pricingRevenue:   metrics.pricingRevenue,
        usableForPricing: metrics.usableForPricing,
        excludedCount:    metrics.excludedCount,
        flags:            metrics.flags,
      },
    });
  } catch (err) {
    console.error('[bank-metrics-ingest] failed:', err && err.message);
    res.status(500).json({ error: 'ingest_failed' });
  }
};

module.exports.__test = { secretMatches };
