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
const outreach = require('./_outreach');
const { getAccessToken, sendMail } = require('./_email');
const { renderEmail, esc } = require('./_email-layout');

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'david@deltpay.com';

// DC-8 — "in review" confirmation, sent once when the lead reaches the
// submitted milestone. Best-effort: a failed send never blocks the beacon.
function inReviewBody(firstName) {
  const name = firstName ? String(firstName).trim() : '';
  return `
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:#0A1133;">
        Application complete — your offer is being built.
      </h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">${name ? `Hi ${esc(name)},` : 'Hi,'}</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        Your bank connection came through and your file is complete. Here's what's happening now:
      </p>
      <p style="margin:0 0 10px;font-size:14.5px;line-height:1.55;color:#0F0E17;"><span style="color:#5B5BD6;font-weight:700;">&bull;</span>&nbsp;Our underwriting looks at your <strong style="color:#0A1133;">actual cash flow</strong> — deposits, balance patterns, revenue trend. Not just a credit score.</p>
      <p style="margin:0 0 10px;font-size:14.5px;line-height:1.55;color:#0F0E17;"><span style="color:#5B5BD6;font-weight:700;">&bull;</span>&nbsp;<strong style="color:#0A1133;">You'll have a decision within 1 business day</strong>, usually faster.</p>
      <p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:#0F0E17;"><span style="color:#5B5BD6;font-weight:700;">&bull;</span>&nbsp;No credit pull happens unless you accept an offer.</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        Nothing to do but keep your phone handy. Talk soon.
      </p>
      <p style="margin:22px 0 0;color:#0A1133;font-size:13.5px;line-height:1.55;">
        — David Hazday<br/>
        <span style="color:#6B6877;font-weight:500;">Director, Delt Capital</span>
      </p>`;
}

async function sendInReview(leadId) {
  const lead = await store.getLead(leadId);
  if (!lead || !lead.email || lead.review_emailed_at) return;
  let token = null;
  try { token = await getAccessToken(); } catch (_) { /* Resend path needs no token */ }
  const html = renderEmail({
    body: inReviewBody(lead.first_name),
    audience: 'lead',
    includeTrustStrip: true,
    recipientEmail: lead.email,
    recipientPhone: lead.phone,
    preheader: 'Decision within 1 business day. No action needed.',
    openPixelUrl: outreach.openPixelUrl({ leadId, email: lead.email, campaign: 'in-review' }),
  });
  await sendMail(token, process.env.OUTLOOK_FROM_EMAIL, lead.email,
    'Application received — your offer is being built', html, {
      fromName: 'Delt Capital',
      replyTo: [NOTIFY_TO],
    });
  await store.markReviewEmailed(leadId);
  outreach.recordOutreach({
    leadId, leadEmail: lead.email, leadName: lead.first_name,
    campaign: 'in-review', event: 'sent',
  }).catch(() => {});
  // Internal heads-up — a completed file is the hottest moment in the funnel.
  sendMail(token, process.env.OUTLOOK_FROM_EMAIL, NOTIFY_TO,
    `🔥 Capital application submitted: ${lead.business_name || lead.first_name || leadId}`,
    renderEmail({
      body: `<h2 style="margin:0 0 12px;font-size:18px;">File complete — underwrite now</h2>
        <p style="margin:6px 0;font-size:14px;"><b>Lead:</b> ${esc(lead.first_name || '')} — ${esc(lead.business_name || '')}</p>
        <p style="margin:6px 0;font-size:14px;"><b>Email:</b> ${esc(lead.email || '')}</p>
        <p style="margin:6px 0;font-size:14px;"><b>Phone:</b> ${esc(lead.phone || '')}</p>
        <p style="margin:12px 0 0;font-size:13px;color:#555;">The lead was told: decision within 1 business day.</p>`,
      audience: 'operator',
      includeTrustStrip: false,
    }),
    { fromName: 'Delt Capital' },
  ).catch(() => {});
}

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
    // DC-8: confirmation + internal alert on the submitted milestone.
    if (event === 'submitted') {
      sendInReview(leadId).catch((err) =>
        console.error('[apply-progress] in-review email failed:', err && err.message));
    }
    // A modal_opened beacon carrying utm params means the lead arrived
    // via a tracked email/SMS link — record the click against the lead
    // so the backend's Outreach page can attribute it to a campaign
    // (and, via utm_content, to a subject-line variant). Best-effort.
    if (event === 'modal_opened' && meta && meta.utm && typeof meta.utm === 'object') {
      const variant = String(meta.utm.utm_content || '').replace(/^subj-/, '') || null;
      outreach.recordOutreach({
        leadId,
        campaign: meta.utm.utm_campaign || 'untagged',
        event: 'clicked',
        variant,
        utm: meta.utm,
      }).catch(() => {});
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    // Log but don't fail the client — beacons are fire-and-forget.
    console.error('[apply-progress] store.recordEvent failed:', err && err.message);
    res.status(204).end();
  }
};
