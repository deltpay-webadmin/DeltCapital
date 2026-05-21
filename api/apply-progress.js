// Vercel serverless function — apply-flow milestone beacon.
//
// The application modal POSTs here as the user moves through the flow.
// Each event becomes a row in apply_progress so /admin/leads can show
// where each lead got stuck, and /api/sms-nudge can decide who to
// re-engage.
//
// Best-effort by design: if Supabase isn't configured (or is down), we
// 204 the request so the modal never blocks on us. Lead capture and
// underwriting do not depend on this signal — it's pure analytics +
// reactivation fuel.
//
// Request shape:
//   POST /api/apply-progress
//   { leadId: "<uuid>", event: "plaid_connected", meta: { institution: "..." } }
//
// Accepted events (mirrors VALID_EVENTS in api/_store.js):
//   modal_opened    — user landed in the modal (with or without email deep link)
//   plaid_connected — Plaid Link returned success
//   idv_done        — IDV completed
//   submitted       — user clicked "Submit application"
//
// Response: { ok: true } or 204 when store is disabled. Errors only on
// malformed input (400) — never on transient backend failures.

const store = require('./_store');

function setCors(res) {
  // Same-origin in production; permissive here so preview deploys (which
  // can run on a different host than the email's deep link) still ping.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'method_not_allowed' }); return; }

  let body = req.body;
  // Vercel parses application/json automatically, but be defensive — a
  // beacon called via navigator.sendBeacon() arrives as a Blob with
  // application/json mime, and some older client paths POST as a string.
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const leadId = String(body.leadId || '').trim();
  const event  = String(body.event  || '').trim();
  const meta   = (body.meta && typeof body.meta === 'object') ? body.meta : null;

  // Shape check: leadId must look like a uuid, event must be in the
  // allowlist. We don't 400 on missing leadId because legacy clients
  // (no lead_id in the deep link, e.g. user opened the app from the
  // marketing nav instead of the email) will lack one — just no-op.
  if (!leadId) { res.status(204).end(); return; }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId)) {
    res.status(400).json({ error: 'invalid_lead_id' });
    return;
  }
  if (!store.VALID_EVENTS.has(event)) {
    res.status(400).json({ error: 'invalid_event', accepted: [...store.VALID_EVENTS] });
    return;
  }
  if (!store.ENABLED) { res.status(204).end(); return; }

  try {
    await store.recordEvent({ leadId, event, meta });
    res.status(200).json({ ok: true });
  } catch (err) {
    // Log but don't fail the client — beacons are fire-and-forget.
    console.error('[apply-progress] store.recordEvent failed:', err && err.message);
    res.status(204).end();
  }
};
