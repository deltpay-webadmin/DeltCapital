// GET /api/plaid-get-idv-status?id=<identity_verification_id>
//   → { status, completed_at, steps }
//
// Polled every ~3s by the desktop modal while the applicant completes ID +
// selfie capture on their phone. Plaid's status values: "active" (still in
// progress), "success", "failed", "expired", "canceled".

const { plaidFetch, readJsonBody } = require('./_plaid');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const id = (req.query && req.query.id) || readJsonBody(req).id;
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'id is required' });
    return;
  }

  try {
    const data = await plaidFetch('/identity_verification/get', {
      identity_verification_id: id,
    });
    // Diagnostic: when Plaid returns a terminal non-success status, log which
    // named check(s) it failed. Plaid's IDV decision lives in `steps` (e.g.
    // documentary_verification, selfie_check, kyc_check, watchlist_screening,
    // risk_check) — the app otherwise collapses everything to a single "failed"
    // state, which hides *why* Plaid rejected the session. Step names only (no
    // applicant PII) so this is safe to keep in Vercel logs.
    const statusLc = String(data.status || '').toLowerCase();
    if (['failed', 'expired', 'canceled'].includes(statusLc) && data.steps) {
      const PASSING = ['success', 'skipped', 'manually_approved', 'not_applicable', 'waiting', 'active'];
      const failedSteps = Object.entries(data.steps)
        .filter(([, v]) => v && !PASSING.includes(String(v).toLowerCase()))
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      console.log(
        `plaid-get-idv-status terminal: id=${id} status=${data.status} ` +
        `non_success_steps=[${failedSteps}]`
      );
    }
    // Don't cache — the whole point is to observe state changes quickly.
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      status: data.status,
      completed_at: data.completed_at || null,
      steps: data.steps || null,
    });
  } catch (err) {
    console.error('plaid-get-idv-status error:', err && err.stack ? err.stack : err);
    res.status(err.status || 500).json({
      error: 'Could not fetch identity verification status',
      code: err.plaidErrorCode || null,
    });
  }
};
