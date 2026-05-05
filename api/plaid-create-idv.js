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
