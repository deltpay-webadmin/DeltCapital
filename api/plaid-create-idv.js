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
    // We send a stable client_user_id per browser, so a session for this
    // (client_user_id, template_id) pair often already exists from a prior
    // attempt or page load. Without is_idempotent Plaid rejects the second
    // create with INVALID_FIELD ("session already exists"); is_idempotent
    // makes Plaid return the existing session instead of erroring.
    let data = await plaidFetch('/identity_verification/create', {
      is_shareable: true,
      template_id: templateId,
      gave_consent: true,
      is_idempotent: true,
      user: { client_user_id: clientUserId },
    });

    // If the existing session is in a terminal state (e.g. the applicant
    // failed a prior attempt and tapped "Try again"), the idempotent create
    // just hands back that dead session. Start a fresh attempt via /retry so
    // the user actually gets a new shareable_url to scan.
    const terminal = ['failed', 'expired', 'canceled'];
    if (data && terminal.includes(String(data.status || '').toLowerCase())) {
      try {
        data = await plaidFetch('/identity_verification/retry', {
          client_user_id: clientUserId,
          template_id: templateId,
          strategy: 'reset',
          is_shareable: true,
          gave_consent: true,
        });
      } catch (retryErr) {
        // Non-fatal — fall back to the (terminal) session we already have so
        // we never regress to a 500. The frontend surfaces the failed state.
        console.warn('plaid-create-idv retry failed:', retryErr && retryErr.message);
      }
    }
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
