// POST /api/plaid-get-link-status
//   body: { link_token: string }
//   → { status: 'pending' | 'success', public_token?, institution_name? }
//
// Polled every ~3s by the desktop modal while the applicant completes the
// bank connection on their phone via Plaid's hosted_link page (the "Use my
// phone instead" QR handoff). Until hosted_link existed the desktop had no
// way to learn the phone had finished, so the modal sat on the QR forever.
//
// Plaid's /link/token/get returns the link_sessions opened against this
// token. Once the applicant completes Link in the hosted page, the session's
// results carry a public_token we can hand back for the normal exchange.

const { plaidFetch, readJsonBody } = require('./_plaid');

// Walk the (somewhat nested + version-dependent) /link/token/get response
// and pull out the first public_token a completed session produced, plus a
// best-effort institution name for the read-back card.
function extractCompletion(data) {
  const sessions = Array.isArray(data.link_sessions) ? data.link_sessions : [];
  for (const s of sessions) {
    const results = s && s.results;
    if (!results) continue;
    const adds = Array.isArray(results.item_add_results) ? results.item_add_results : [];
    for (const a of adds) {
      if (a && a.public_token) {
        return {
          public_token: a.public_token,
          institution_name: (a.institution && a.institution.name) || '',
        };
      }
    }
  }
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { link_token } = readJsonBody(req);
  if (!link_token || typeof link_token !== 'string') {
    res.status(400).json({ error: 'link_token is required' });
    return;
  }

  try {
    const data = await plaidFetch('/link/token/get', { link_token });
    // Don't cache — the whole point is to observe state changes quickly.
    res.setHeader('Cache-Control', 'no-store');

    const completion = extractCompletion(data);
    if (completion) {
      res.status(200).json({
        status: 'success',
        public_token: completion.public_token,
        institution_name: completion.institution_name,
      });
      return;
    }
    res.status(200).json({ status: 'pending' });
  } catch (err) {
    console.error('plaid-get-link-status error:', err && err.stack ? err.stack : err);
    res.status(err.status || 500).json({
      error: 'Could not fetch link session status',
      code: err.plaidErrorCode || null,
      error_message: err.message || null,
      error_type: err.plaidErrorType || null,
    });
  }
};
