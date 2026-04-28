// POST /api/plaid-create-link-token
//   body: { clientUserId: string, productKind: 'bank' | 'idv' }
//   → { link_token, hosted_link_url, expiration }
//
// Mints a Plaid link_token tuned to the requested product. `hosted_link`
// is enabled on every token so the same token can be opened in either the
// embedded Link SDK on desktop OR in Plaid's mobile-optimized hosted page
// (used for the QR-code phone handoff).

const { plaidFetch, plaidCountryCodes, plaidProducts, requireMethod, readJsonBody } = require('./_plaid');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const { clientUserId, productKind } = readJsonBody(req);
  if (!clientUserId || typeof clientUserId !== 'string') {
    res.status(400).json({ error: 'clientUserId is required' });
    return;
  }
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
    const templateId = process.env.PLAID_IDV_TEMPLATE_ID;
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
    });
  }
};
