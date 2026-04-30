// POST /api/plaid-create-link-token
//   Authorization: Bearer <Auth0 access token>
//   body: { productKind: 'bank' | 'idv' }
//   → { link_token, hosted_link_url, expiration }
//
// Mints a Plaid link_token tuned to the requested product. `hosted_link`
// is enabled on every token so the same token can be opened in either the
// embedded Link SDK on desktop OR in Plaid's mobile-optimized hosted page
// (used for the QR-code phone handoff).
//
// The Plaid `client_user_id` is the verified `sub` from the bearer token —
// not a value the client supplies. This keeps Plaid records keyed off the
// same identity as Auth0, and prevents one customer from impersonating
// another by passing a different clientUserId.

const { plaidFetch, plaidCountryCodes, plaidProducts, requireMethod, readJsonBody } = require('./_plaid');
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

  const { productKind } = readJsonBody(req);
  const clientUserId = sub;
  const kind = productKind === 'idv' ? 'idv' : 'bank';

  const body = {
    user: { client_user_id: clientUserId },
    client_name: 'Delt Capital',
    language: 'en',
    country_codes: plaidCountryCodes(),
    products: kind === 'idv' ? ['identity_verification'] : plaidProducts(),
    hosted_link: { url_lifetime_seconds: 3600 },
  };

  if (kind === 'idv') {
    const templateId = (process.env.PLAID_IDV_TEMPLATE_ID || '').trim();
    if (!templateId) {
      res.status(500).json({ error: 'PLAID_IDV_TEMPLATE_ID is not set' });
      return;
    }
    body.identity_verification = { template_id: templateId };
  }

  try {
    const data = await plaidFetch('/link/token/create', body);
    res.status(200).json({
      link_token: data.link_token,
      hosted_link_url: data.hosted_link_url,
      expiration: data.expiration,
    });
  } catch (err) {
    console.error('plaid-create-link-token error:', err && err.stack ? err.stack : err);
    res.status(err.status || 500).json({
      error: 'Could not create Plaid link token',
      code: err.plaidErrorCode || null,
      error_message: err.message || null,
      error_type: err.plaidErrorType || null,
    });
  }
};
