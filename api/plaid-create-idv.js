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

// Normalize a free-form phone string to E.164 (Plaid requires it). Returns null
// when we can't form a plausible number so we omit it rather than send invalid
// data (which Plaid rejects with INVALID_FIELD).
function toE164(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith('+')) {
    const d = trimmed.slice(1).replace(/\D/g, '');
    return d.length >= 8 ? '+' + d : null;
  }
  const d = trimmed.replace(/\D/g, '');
  if (d.length === 10) return '+1' + d;           // US 10-digit
  if (d.length === 11 && d[0] === '1') return '+' + d;
  if (d.length >= 11) return '+' + d;             // already includes country code
  return null;
}

// Build Plaid's IDV `user` object from the optional PII the client forwards, so
// Plaid can pre-fill / streamline the identity + phone-verification steps. Only
// includes fields we actually have; never sends empty values.
function buildIdvUser(clientUserId, info) {
  const user = { client_user_id: clientUserId };
  if (info && typeof info === 'object') {
    const phone = toE164(info.phone);
    if (phone) user.phone_number = phone;
    const email = (info.email || '').trim();
    if (email) user.email_address = email;
    const given = (info.firstName || '').trim();
    const family = (info.lastName || '').trim();
    if (given && family) user.name = { given_name: given, family_name: family };
  }
  return user;
}

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const { clientUserId, user: userInfo } = readJsonBody(req);
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
      is_shareable: true,
      template_id: templateId,
      gave_consent: true,
      // Idempotent create: if a verification already exists for this
      // client_user_id + template_id, Plaid returns it instead of failing
      // with INVALID_FIELD ("session already exists"). The frontend inspects
      // the returned `status` to resume, short-circuit (already success), or
      // start fresh (terminal/failed) as appropriate.
      is_idempotent: true,
      // Forward any collected PII so Plaid pre-fills the identity + phone steps
      // (a returned existing idempotent session keeps its original data).
      user: buildIdvUser(clientUserId, userInfo),
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
