// GET /api/plaid-get-idv-status?id=<identity_verification_id>
//   → { status, completed_at, steps }
//
// Polled every ~3s by the desktop modal while the applicant completes ID +
// selfie capture on their phone. Plaid's status values: "active" (still in
// progress), "success", "failed", "expired", "canceled".

const { plaidFetch, readJsonBody } = require('./_plaid');
const { verifyAuth0Token, AuthError } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await verifyAuth0Token(req);
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(401).json({ error: err.message });
      return;
    }
    throw err;
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
