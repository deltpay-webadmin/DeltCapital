// POST /api/plaid-exchange-token
//   body: { public_token: string }
//   → { success: true, item_id, institution_name, accounts: [{ name, mask, subtype }] }
//
// Exchanges a Link public_token for an access_token, then immediately
// fetches account metadata so we can hand a friendly summary back to the
// frontend. The access_token itself never leaves this function — for the
// sandbox demo we only need to prove the exchange round-trips and surface
// the bank/account names that V1StepBank renders.

const { plaidFetch, requireMethod, readJsonBody } = require('./_plaid');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const { public_token } = readJsonBody(req);
  if (!public_token || typeof public_token !== 'string') {
    res.status(400).json({ error: 'public_token is required' });
    return;
  }

  try {
    const exchange = await plaidFetch('/item/public_token/exchange', { public_token });
    const accessToken = exchange.access_token;
    const itemId = exchange.item_id;

    const accountsResp = await plaidFetch('/accounts/get', { access_token: accessToken });
    const accounts = (accountsResp.accounts || []).map((a) => ({
      name: a.name || a.official_name || 'Account',
      mask: a.mask || '',
      subtype: a.subtype || a.type || '',
    }));

    let institutionName = '';
    const institutionId = accountsResp.item && accountsResp.item.institution_id;
    if (institutionId) {
      try {
        const inst = await plaidFetch('/institutions/get_by_id', {
          institution_id: institutionId,
          country_codes: ['US'],
        });
        institutionName = (inst.institution && inst.institution.name) || '';
      } catch (e) {
        // Non-fatal — fall back to the empty string and let the UI still render.
        console.warn('institutions/get_by_id failed:', e.plaidErrorCode || e.message);
      }
    }

    res.status(200).json({
      success: true,
      item_id: itemId,
      institution_name: institutionName,
      accounts,
    });
  } catch (err) {
    console.error('plaid-exchange-token error:', err && err.stack ? err.stack : err);
    res.status(err.status || 500).json({
      error: 'Could not exchange Plaid token',
      code: err.plaidErrorCode || null,
    });
  }
};
