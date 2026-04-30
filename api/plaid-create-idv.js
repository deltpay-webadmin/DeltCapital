// POST /api/plaid-create-idv
//   Authorization: Bearer <Auth0 access token>
//   body: {} (no clientUserId — pulled from the verified token)
//   → { identity_verification_id, shareable_url, status }
//
// Creates an Identity Verification session and returns Plaid's
// mobile-optimized shareable_url. The frontend renders this URL as a QR
// code so the applicant can scan with their phone and complete ID + selfie
// capture there. Desktop polls /api/plaid-get-idv-status until status flips
// to "success".
//
// `client_user_id` is the verified `sub` from the bearer token, not a
// client-supplied value — keeps IDV records keyed off Auth0 identity and
// blocks one customer from minting an IDV session against another's id.

const { plaidFetch, requireMethod } = require('./_plaid');
const { verifyAuth0Token, AuthError } = require('./_auth');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  let sub;
  try {
    ({ sub } = await verifyAuth0Token(req));
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(401).json({ error: err.message });
      return;
    }
    throw err;
  }
  const clientUserId = sub;

  const templateId = (process.env.PLAID_IDV_TEMPLATE_ID || '').trim();
  if (!templateId) {
    res.status(500).json({ error: 'PLAID_IDV_TEMPLATE_ID is not set' });
    return;
  }

  try {
    const data = await plaidFetch('/identity_verification/create', {
      client_user_id: clientUserId,
      template_id: templateId,
      is_shareable: true,
      gave_consent: true,
    });
    res.status(200).json({
      identity_verification_id: data.id,
      shareable_url: data.shareable_url,
      status: data.status,
    });
  } catch (err) {
    console.error('plaid-create-idv error:', err && err.stack ? err.stack : err);
    res.status(err.status || 500).json({
      error: 'Could not create identity verification',
      code: err.plaidErrorCode || null,
      error_message: err.message || null,
      error_type: err.plaidErrorType || null,
    });
  }
};
