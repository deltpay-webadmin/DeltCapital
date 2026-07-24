// Outreach event logger — writes email touchpoints (sent / opened /
// clicked) to the `outreach_events` table in the Delt Backend Supabase
// project so the backend's Outreach page shows real campaign numbers.
//
// Uses the same Supabase REST credentials as api/_store.js (the site
// already points at the Delt Backend database). Best-effort by design:
// every call swallows errors — outreach telemetry must never block or
// fail an email send, a redirect, or a beacon.
//
// Event vocabulary (mirrors the outreach_events_event_check constraint):
//   sent     — an email left our hands (recorded by leads.js / sms-nudge.js)
//   opened   — the tracking pixel in the email was fetched (api/o.js)
//   clicked  — the lead followed a tracked link (short-link redirect in
//              api/r.js, or a utm-tagged /apply visit reported by the
//              modal_opened beacon in api/apply-progress.js)

const { SITE_ORIGIN } = require('./_deeplink');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ENABLED = !!(SUPABASE_URL && SUPABASE_KEY);

// b64url helpers for smuggling an email address through pixel URLs
// without tripping querystring parsing on '+' or '@'.
function b64urlEncode(s) {
  return Buffer.from(String(s || ''), 'utf8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s) {
  try {
    const b64 = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch (_) { return ''; }
}

// Fire-and-forget insert. Never throws, never blocks callers that don't
// await it. Returns true when the row was accepted.
async function recordOutreach({ leadId, leadEmail, leadName, campaign, channel, event, variant, utm, meta }) {
  if (!ENABLED || !campaign || !event) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/outreach_events`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([{
        lead_id: leadId ? String(leadId) : null,
        lead_email: leadEmail || null,
        lead_name: leadName || null,
        campaign: String(campaign),
        channel: channel || 'email',
        event: String(event),
        variant: variant || null,
        utm: utm || null,
        meta: meta || null,
      }]),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[outreach] insert failed:', res.status, body.slice(0, 200));
      return false;
    }
    return true;
  } catch (err) {
    console.error('[outreach] insert error:', err && err.message);
    return false;
  }
}

// URL for the 1×1 open-tracking pixel embedded in lead emails.
// Served by api/o.js.
function openPixelUrl({ leadId, email, campaign, variant }) {
  const params = new URLSearchParams();
  if (leadId)  params.set('l', String(leadId));
  if (email)   params.set('m', b64urlEncode(email));
  if (campaign) params.set('c', campaign);
  if (variant)  params.set('v', variant);
  return `${SITE_ORIGIN.replace(/\/$/, '')}/api/o?${params.toString()}`;
}

module.exports = {
  ENABLED,
  recordOutreach,
  openPixelUrl,
  b64urlDecode,
};
