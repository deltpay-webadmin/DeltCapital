// POST /api/plaid-get-link-status
//   body: { link_token: string }
//   → { status: 'pending' | 'completed' | 'expired', public_token?, institution_name?, accounts? }
//
// Polled by the desktop modal while the user connects their bank on their phone
// via the hosted-link QR handoff (V1PlaidLink mobile stage). Plaid's
// /link/token/get returns the link's sessions; once the user finishes on their
// phone, a session carries an item_add_result with a public_token, which the
// frontend then exchanges exactly like the desktop SDK's onSuccess.

const { plaidFetch, requireMethod, readJsonBody } = require('./_plaid');

// Find the first completed bank-add result (with a public_token) across all the
// hosted-link sessions, newest first. Returns the result object or null.
function findCompletedItemAdd(linkSessions) {
  if (!Array.isArray(linkSessions)) return null;
  const sorted = linkSessions.slice().sort((a, b) =>
    String(b.finished_at || b.created_at || '').localeCompare(String(a.finished_at || a.created_at || '')));
  for (const s of sorted) {
    const adds = s && s.results && s.results.item_add_results;
    if (Array.isArray(adds)) {
      const hit = adds.find((r) => r && r.public_token);
      if (hit) return hit;
    }
  }
  return null;
}

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const { link_token: linkToken } = readJsonBody(req);
  if (!linkToken || typeof linkToken !== 'string') {
    res.status(400).json({ error: 'link_token is required' });
    return;
  }

  try {
    const data = await plaidFetch('/link/token/get', { link_token: linkToken });
    res.setHeader('Cache-Control', 'no-store');

    const completed = findCompletedItemAdd(data.link_sessions);
    if (completed) {
      const institution = completed.institution || {};
      const accounts = (completed.accounts || []).map((a) => ({
        name: a.name || a.official_name || 'Account',
        mask: a.mask || '',
      }));
      res.status(200).json({
        status: 'completed',
        public_token: completed.public_token,
        institution_name: institution.name || '',
        accounts,
      });
      return;
    }

    // Not done yet — pending, unless the token has expired.
    const expired = data.expiration && Date.parse(data.expiration) < Date.now();
    res.status(200).json({ status: expired ? 'expired' : 'pending' });
  } catch (err) {
    console.error('plaid-get-link-status error:', err && err.stack ? err.stack : err);
    res.status(err.status || 500).json({
      error: 'Could not fetch link status',
      code: err.plaidErrorCode || null,
    });
  }
};
