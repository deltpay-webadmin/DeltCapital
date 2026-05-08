// POST /api/plaid-create-idv
//   body: { clientUserId: string }
//   → { identity_verification_id, shareable_url, status }
//
// Creates an Identity Verification session and returns Plaid's
// mobile-optimized shareable_url. The frontend renders this URL as a QR
// code so the applicant can scan with their phone and complete ID + selfie
// capture there. Desktop polls /api/plaid-get-idv-status until status flips
// to "success".

const QRCode = require('qrcode');
const { plaidFetch, requireMethod, readJsonBody } = require('./_plaid');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const { clientUserId } = readJsonBody(req);
  if (!clientUserId || typeof clientUserId !== 'string') {
    res.status(400).json({ error: 'clientUserId is required' });
    return;
  }

  const rawTemplateId = process.env.PLAID_IDV_TEMPLATE_ID || '';
  const templateId = rawTemplateId.trim();
  if (!templateId) {
    res.status(500).json({ error: 'PLAID_IDV_TEMPLATE_ID is not set' });
    return;
  }
  // TEMP: dev-only diagnostic — remove once IDV is green. Logs the trimmed
  // template id length, raw length (catches hidden chars that survive .trim
  // for things like ​ zero-width spaces), prefix and last-4 so we can
  // compare against the dashboard without leaking the full id.
  console.log(
    'plaid-create-idv templateId diagnostic: ' +
    `raw.length=${rawTemplateId.length} ` +
    `trimmed.length=${templateId.length} ` +
    `prefix=${JSON.stringify(templateId.slice(0, 7))} ` +
    `last4=${JSON.stringify(templateId.slice(-4))}`
  );

  try {
    const data = await plaidFetch('/identity_verification/create', {
      is_shareable: true,
      template_id: templateId,
      gave_consent: true,
      user: { client_user_id: clientUserId },
    });
    // Render the QR server-side so the IDV shareable_url stays inside our
    // infrastructure (mirrors api/plaid-create-link-token.js — see the
    // matching comment there for rationale). Non-fatal on failure.
    let shareableUrlQr = null;
    if (data.shareable_url) {
      try {
        shareableUrlQr = await QRCode.toDataURL(data.shareable_url, { width: 392, margin: 0 });
      } catch (qrErr) {
        console.warn('plaid-create-idv QR render failed:', qrErr && qrErr.message);
      }
    }
    res.status(200).json({
      identity_verification_id: data.id,
      shareable_url: data.shareable_url,
      shareable_url_qr: shareableUrlQr,
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
