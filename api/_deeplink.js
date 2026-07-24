// Shared apply-deep-link builder. Underscore-prefix so Vercel doesn't
// expose it as an HTTP endpoint.
//
// Used by:
//   - api/leads.js          → builds the link emailed to the lead
//   - api/sms-nudge.js      → builds the link sent in the T+45 nudge
//   - api/r.js              → resolves a short /r/<prefix> to the full link
//
// The payload is a URL-safe base64-encoded JSON object that the client
// (app/variation-1.jsx) decodes to pre-fill the apply modal.

const SITE_ORIGIN = (() => {
  const explicit = process.env.PUBLIC_SITE_ORIGIN;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return /^https?:\/\//i.test(vercel) ? vercel : `https://${vercel}`;
  return 'https://deltcapital.com';
})();

function b64url(obj) {
  const json = JSON.stringify(obj);
  return Buffer.from(json, 'utf8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Build the full /apply?d=<base64> deep link from a lead row (or any
// {firstName, businessName, email, phone, estimate, leadId} object).
function buildApplyUrl({ leadId, firstName, businessName, email, phone, estimate }) {
  const e = estimate || {};
  const payload = {
    v: 1,
    t: Date.now(),
    leadId: leadId ? String(leadId) : undefined,
    firstName: String(firstName || '').trim(),
    businessName: String(businessName || '').trim(),
    email: String(email || '').trim(),
    phone: String(phone || '').trim(),
    low: Number(e.low) || 0,
    high: Number(e.high) || 0,
    revenue: Number(e.revenue) || 0,
    tib: String(e.tib || ''),
    acceptsCards: e.acceptsCards === true ? 1 : (e.acceptsCards === false ? 0 : null),
    cardSales: Number(e.cardSales) || 0,
    boosted: !!e.boosted,
  };
  return `${SITE_ORIGIN.replace(/\/$/, '')}/apply?d=${b64url(payload)}`;
}

// Convert a Supabase lead row (snake_case) into the camelCase shape the
// builder expects. Centralized so sms-nudge.js + r.js stay in sync.
function buildApplyUrlFromRow(row) {
  if (!row) return null;
  return buildApplyUrl({
    leadId: row.id,
    firstName: row.first_name,
    businessName: row.business_name,
    email: row.email,
    phone: row.phone,
    estimate: row.estimate || {},
  });
}

// Append UTM (or any tracking) params to an already-built URL. The apply
// deep link's `d` payload is read via URLSearchParams client-side, so
// extra params ride along harmlessly. Skips null/empty values.
function withUtm(url, params) {
  if (!url) return url;
  const qs = Object.entries(params || {})
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  if (!qs) return url;
  return url + (url.includes('?') ? '&' : '?') + qs;
}

// Short link (`/r/<8-char-prefix>`) for use in SMS bodies where the full
// base64 payload would blow past 160 chars.
function buildShortUrl(leadId) {
  if (!leadId) return null;
  const prefix = String(leadId).replace(/-/g, '').slice(0, 8).toLowerCase();
  if (prefix.length < 6) return null;
  return `${SITE_ORIGIN.replace(/\/$/, '')}/r/${prefix}`;
}

module.exports = {
  SITE_ORIGIN,
  buildApplyUrl,
  buildApplyUrlFromRow,
  buildShortUrl,
  withUtm,
};
