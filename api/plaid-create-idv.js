// POST /api/plaid-create-idv
//   body: { clientUserId: string, user?: { name?, email_address?, phone_number? } }
//   → { identity_verification_id, shareable_url, status }
//
// Creates an Identity Verification session and returns Plaid's
// mobile-optimized shareable_url. The frontend renders this URL as a QR
// code so the applicant can scan with their phone and complete ID + selfie
// capture there. Desktop polls /api/plaid-get-idv-status until status flips
// to "success".
//
// Pre-filling the `user` object (name/email/phone we already collected at
// Step 01) is recommended by Plaid — it skips the equivalent screens in
// the IDV UI and runs anti-fraud checks against the email. Plaid accepts
// fully-omitted optional sub-fields, so we sanitize per-field rather than
// sending half-formed values that fail input validation.

const QRCode = require('qrcode');
const { plaidFetch, requireMethod, readJsonBody } = require('./_plaid');

// Plaid wants E.164 (e.g. "+12345678909"). The frontend collects "(555)
// 555-0199"; strip non-digits, prepend "+1" for plain 10-digit US numbers,
// "+" for an 11-digit number that already has a country code, otherwise
// drop the field rather than risk an INVALID_FIELD error.
function normalizePhone(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const digits = raw.replace(/\D+/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  if (digits.length > 10 && raw.trim().startsWith('+')) return '+' + digits;
  return null;
}

function sanitizeUser(input) {
  if (!input || typeof input !== 'object') return null;
  const out = {};
  if (typeof input.email_address === 'string' && /\S+@\S+\.\S+/.test(input.email_address)) {
    out.email_address = input.email_address.trim();
  }
  const phone = normalizePhone(input.phone_number);
  if (phone) out.phone_number = phone;
  if (input.name && typeof input.name === 'object'
      && typeof input.name.given_name === 'string' && input.name.given_name.trim()
      && typeof input.name.family_name === 'string' && input.name.family_name.trim()) {
    out.name = {
      given_name: input.name.given_name.trim(),
      family_name: input.name.family_name.trim(),
    };
  }
  return Object.keys(out).length ? out : null;
}

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const body = readJsonBody(req);
  const { clientUserId, user } = body;
  if (!clientUserId || typeof clientUserId !== 'string') {
    res.status(400).json({ error: 'clientUserId is required' });
    return;
  }

  const templateId = (process.env.PLAID_IDV_TEMPLATE_ID || '').trim();
  if (!templateId) {
    res.status(500).json({ error: 'PLAID_IDV_TEMPLATE_ID is not set' });
    return;
  }

  const sanitizedUser = sanitizeUser(user);

  try {
    const data = await plaidFetch('/identity_verification/create', {
      client_user_id: clientUserId,
      template_id: templateId,
      is_shareable: true,
      gave_consent: true,
      ...(sanitizedUser ? { user: sanitizedUser } : {}),
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
