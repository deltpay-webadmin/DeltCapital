// POST /api/plaid-create-link-token
//   body: { clientUserId: string, productKind: 'bank' | 'idv' }
//   → { link_token, hosted_link_url, expiration }
//
// Mints a Plaid link_token tuned to the requested product. `hosted_link`
// is enabled on every token so the same token can be opened in either the
// embedded Link SDK on desktop OR in Plaid's mobile-optimized hosted page
// (used for the QR-code phone handoff).

const QRCode = require('qrcode');
const { plaidFetch, plaidCountryCodes, plaidProducts, requireMethod, readJsonBody } = require('./_plaid');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const { clientUserId, productKind } = readJsonBody(req);
  if (!clientUserId || typeof clientUserId !== 'string') {
    res.status(400).json({ error: 'clientUserId is required' });
    return;
  }
  const kind = productKind === 'idv' ? 'idv' : 'bank';

  // Transactions consent is what Delt underwrites on. Guarantee it is
  // requested on every bank token regardless of the PLAID_PRODUCTS env —
  // items minted without it land in the CRM vault as unusable
  // ADDITIONAL_CONSENT_REQUIRED errors (the exact production incident
  // this guard was added for).
  const bankProducts = plaidProducts();
  if (!bankProducts.includes('transactions')) bankProducts.push('transactions');

  const body = {
    user: { client_user_id: clientUserId },
    client_name: 'Delt Capital',
    language: 'en',
    country_codes: plaidCountryCodes(),
    products: kind === 'idv' ? ['identity_verification'] : bankProducts,
    hosted_link: { url_lifetime_seconds: 3600 },
  };

  // Attach the CRM's webhook receiver so items created here get
  // webhook-driven syncs (INITIAL_UPDATE etc.) and error/repair signals.
  // Without it the vault only learns about new data on the nightly cron.
  const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  if (kind === 'bank' && supabaseUrl) {
    body.webhook = `${supabaseUrl}/functions/v1/plaid-webhook`;
  }

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
    // Render the QR server-side as a base64 PNG so the Plaid hosted_link
    // URL never leaves our infrastructure (the in-browser qrcode UMD
    // bundle was unreliable, and routing through a third-party QR service
    // would leak the URL). Failures here are non-fatal — the frontend
    // falls back to the "Or open the link here" anchor.
    let hostedLinkQr = null;
    if (data.hosted_link_url) {
      try {
        hostedLinkQr = await QRCode.toDataURL(data.hosted_link_url, { width: 392, margin: 0 });
      } catch (qrErr) {
        console.warn('plaid-create-link-token QR render failed:', qrErr && qrErr.message);
      }
    }
    res.status(200).json({
      link_token: data.link_token,
      hosted_link_url: data.hosted_link_url,
      hosted_link_qr: hostedLinkQr,
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
