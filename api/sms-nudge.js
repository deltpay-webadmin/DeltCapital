// Vercel cron — T+45min reactivation nudge for leads that bounced.
//
// Selection criteria (see api/_store.findStaleLeads):
//   created_at between 45min and 24hr ago
//   nudged_at IS NULL          (one nudge per lead, ever)
//   completed_at IS NULL       (submitted leads are off-limits)
//
// What we send:
//   • A short follow-up email to the lead with the same deep link the
//     original confirmation carried. Re-uses Microsoft Graph send-as.
//   • An internal heads-up to LEADS_NOTIFY_EMAIL with a "click to text"
//     mailto link generated from the same deep link — David can fire
//     the SMS manually from Google Voice in <5 seconds.
//
// Quiet hours:
//   We do not nudge between 9pm and 8am Eastern (the operator's tz),
//   and we skip weekends entirely. The cron schedule itself (every
//   15min) keeps running so caught-up leads get caught up as soon as
//   the window re-opens.
//
// Cron schedule lives in vercel.json:
//   { "path": "/api/sms-nudge", "schedule": "*/15 * * * *" }
//
// Auth: Vercel sets the request header `x-vercel-cron: 1` for cron
// invocations. We accept any request without that header only when a
// shared secret matches \u2014 lets the operator trigger it manually for
// testing without exposing a public endpoint.

const store = require('./_store');
const { getAccessToken, sendMail } = require('./_email');
const { buildApplyUrlFromRow, buildShortUrl } = require('./_deeplink');
const { renderEmail, esc: layoutEsc } = require('./_email-layout');

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'info@deltpay.com';

const FROM_MAILBOX = process.env.OUTLOOK_FROM_EMAIL;

// Operator's number for the click-to-text mailto link. Google Voice
// inbound texting accepts mailto:<10digits>@txt.voice.google.com but
// that's flaky; we instead generate an https://voice.google.com/u/0/messages
// link which opens the GV web UI pre-filtered to the lead's number.
// Operator clicks → number is pre-typed → paste body → send.
function googleVoiceLink({ phone, body }) {
  const digits = String(phone || '').replace(/\D+/g, '');
  // The query string isn't officially supported but the GV web UI does
  // honor a phone fragment in the URL via its own router. The body has
  // to be pasted manually \u2014 we include it next to the link in the email
  // so the operator can hit copy then paste.
  return `https://voice.google.com/u/0/messages?itemId=t.%2B1${digits}`;
}

// SMS body. We use the branded short link (/r/<8-char>) rather than the
// raw /apply?d=<base64> payload so the message stays well under 160
// chars AND looks like a real link a human would send. The short link
// 302s through api/r.js back to the same payloaded /apply URL.
function smsTemplate({ firstName, shortUrl }) {
  const name = firstName ? String(firstName).trim() : 'Hey';
  return `${name}, this is David at Delt Capital. Saw you started the funding calculator earlier \u2014 here's your offer link, takes 2 min: ${shortUrl}`;
}

// HTML-escape — shared with _email-layout so we don't drift between modules.
const esc = layoutEsc;
function fmtMoney(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return '$0';
  return '$' + Math.round(v).toLocaleString();
}

function nudgeEmailBody({ firstName, estimate, applyUrl }) {
  const range = (estimate && estimate.low && estimate.high)
    ? `${fmtMoney(estimate.low)}\u2013${fmtMoney(estimate.high)}`
    : 'your pre-qualified offer';
  return `
      <p style="margin:0 0 6px;font-size:13px;color:#6B6877;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;">Your offer is still open</p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:#0A1133;letter-spacing:-0.01em;">
        ${esc(firstName ? `${firstName}, your ${range} range is ready when you are.` : `Your ${range} range is ready when you are.`)}
      </h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        You started the funding calculator earlier today and we've held your
        ${esc(range)} pre-qualification open. It takes about 2 minutes to claim,
        there's no credit pull until you accept terms, and bank verification
        runs through Plaid \u2014 read-only, never your password.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 22px;color:#0F0E17;">
        If there's anything I can answer first, just reply to this email \u2014
        it goes straight to my inbox.
      </p>
      <p style="margin:0 0 18px;">
        <a href="${esc(applyUrl)}"
           style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#5B5BD6 0%,#6366F1 50%,#5B5BD6 100%);color:#FFFFFF;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.01em;">
          Continue my application &rarr;
        </a>
      </p>
      <p style="margin:22px 0 0;color:#0A1133;font-size:13.5px;line-height:1.55;">
        \u2014 David Hazday<br/>
        <span style="color:#6B6877;font-weight:500;">Founder, Delt Capital</span>
      </p>
  `;
}

function nudgeEmail({ firstName, estimate, applyUrl, leadEmail, leadPhone }) {
  const range = (estimate && estimate.low && estimate.high)
    ? `${fmtMoney(estimate.low)}\u2013${fmtMoney(estimate.high)}`
    : 'your funding offer';
  return renderEmail({
    body: nudgeEmailBody({ firstName, estimate, applyUrl }),
    audience: 'lead',
    includeTrustStrip: true,
    recipientEmail: leadEmail,
    recipientPhone: leadPhone,
    preheader: `Pick up where you left off. Your ${range} range is still good \u2014 2-min application, no credit pull.`,
  });
}

function internalNudgeBody({ lead, applyUrl, shortUrl, smsBody, gvLink }) {
  return `
      <h2 style="margin:0 0 12px;font-size:18px;">T+45min nudge fired</h2>
      <p style="margin:6px 0;font-size:14px;"><b>Lead:</b> ${esc(lead.first_name || '')} \u2014 ${esc(lead.business_name || '')}</p>
      <p style="margin:6px 0;font-size:14px;"><b>Email:</b> ${esc(lead.email || '')}</p>
      <p style="margin:6px 0;font-size:14px;"><b>Phone:</b> ${esc(lead.phone || '')}</p>
      <hr style="border:none;border-top:1px solid #EEE;margin:18px 0;" />
      <p style="margin:6px 0;font-size:14px;font-weight:600;">Send the SMS yourself from Google Voice:</p>
      <p style="margin:8px 0;">
        <a href="${esc(gvLink)}" style="color:#5B5BD6;font-weight:600;">Open Google Voice \u2192 ${esc(lead.phone || '')}</a>
      </p>
      <p style="margin:12px 0 6px;font-size:13px;color:#555;">Copy this body:</p>
      <div style="background:#F4F4F8;border-radius:8px;padding:14px;font-family:Menlo,monospace;font-size:13px;line-height:1.45;white-space:pre-wrap;">${esc(smsBody)}</div>
      <p style="margin:18px 0 0;font-size:12.5px;color:#6B6877;">Short link in SMS: <a href="${esc(shortUrl)}">${esc(shortUrl)}</a></p>
      <p style="margin:6px 0 0;font-size:12.5px;color:#6B6877;">Full deep link (302 target): <a href="${esc(applyUrl)}">${esc(applyUrl)}</a></p>
  `;
}

function internalNudgeNote(ctx) {
  return renderEmail({
    body: internalNudgeBody(ctx),
    audience: 'operator',
    includeTrustStrip: false,
  });
}

// Quiet hours: don't fire between 9pm and 8am Eastern, and skip
// weekends. We compute "now in Eastern" via Intl rather than relying on
// the serverless container's TZ (Vercel defaults to UTC).
function inQuietHours(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short', hour: 'numeric', hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === 'weekday')?.value || '';
  const hourStr = parts.find((p) => p.type === 'hour')?.value || '0';
  const hour = parseInt(hourStr, 10);
  if (weekday === 'Sat' || weekday === 'Sun') return true;
  if (hour < 8 || hour >= 21) return true;
  return false;
}

function isAuthorized(req) {
  // Vercel cron invocations carry x-vercel-cron. For manual testing we
  // also accept ?token=<CRON_SECRET> or an Authorization: Bearer header.
  if (req.headers['x-vercel-cron']) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization || '';
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(req.url || '/', 'http://x');
  if (url.searchParams.get('token') === secret) return true;
  return false;
}

module.exports = async function handler(req, res) {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  if (!store.ENABLED) {
    res.status(200).json({ ok: true, skipped: 'store_disabled' });
    return;
  }
  if (!FROM_MAILBOX) {
    res.status(200).json({ ok: true, skipped: 'outlook_not_configured' });
    return;
  }
  // Operators sometimes want to test outside quiet hours \u2014 a ?force=1
  // query param bypasses the check. Cron itself never passes this.
  const url = new URL(req.url || '/', 'http://x');
  const force = url.searchParams.get('force') === '1';
  if (!force && inQuietHours()) {
    res.status(200).json({ ok: true, skipped: 'quiet_hours' });
    return;
  }

  let stale;
  try {
    stale = await store.findStaleLeads({ minMinutes: 45, maxMinutes: 24 * 60 });
  } catch (err) {
    console.error('[sms-nudge] findStaleLeads failed:', err && err.message);
    res.status(500).json({ error: 'store_error', detail: String(err && err.message) });
    return;
  }
  if (!stale.length) {
    res.status(200).json({ ok: true, nudged: 0 });
    return;
  }

  let token;
  try {
    token = await getAccessToken();
  } catch (err) {
    console.error('[sms-nudge] getAccessToken failed:', err && err.message);
    res.status(500).json({ error: 'graph_auth_failed' });
    return;
  }

  const results = [];
  for (const lead of stale) {
    const applyUrl = buildApplyUrlFromRow(lead);
    const shortUrl = buildShortUrl(lead.id) || applyUrl;
    const smsBody  = smsTemplate({
      firstName: lead.first_name,
      shortUrl,
    });
    const gvLink = googleVoiceLink({ phone: lead.phone, body: smsBody });

    // Email the lead first (the automation half of the hybrid).
    try {
      await sendMail(
        token, FROM_MAILBOX, lead.email,
        `Still want that funding offer?`,
        nudgeEmail({
          firstName: lead.first_name,
          estimate: lead.estimate || {},
          applyUrl,
          leadEmail: lead.email,
          leadPhone: lead.phone,
        }),
        {
          from: FROM_MAILBOX,
          fromName: 'David @ Delt Capital',
          replyTo: [NOTIFY_TO],
          bcc: [NOTIFY_TO],
        }
      );
    } catch (err) {
      console.error(`[sms-nudge] lead email failed for ${lead.email}:`, err && err.message);
      results.push({ id: lead.id, ok: false, reason: 'lead_email_failed' });
      continue;
    }

    // Then send the operator the SMS-ready note (the manual half).
    try {
      await sendMail(
        token, FROM_MAILBOX, NOTIFY_TO,
        `[Delt SMS nudge] ${lead.first_name || ''} \u2014 ${lead.business_name || ''}`,
        internalNudgeNote({ lead, applyUrl, shortUrl, smsBody, gvLink }),
        { from: FROM_MAILBOX, fromName: 'Delt Capital Bot' }
      );
    } catch (err) {
      // Operator note is best-effort \u2014 the lead nudge already shipped.
      console.error(`[sms-nudge] operator note failed for ${lead.id}:`, err && err.message);
    }

    // Mark the lead so we never re-nudge them. We do this last so a
    // failed lead-email above leaves the lead eligible on the next run.
    try {
      await store.markNudged(lead.id);
      results.push({ id: lead.id, ok: true });
    } catch (err) {
      console.error(`[sms-nudge] markNudged failed for ${lead.id}:`, err && err.message);
      results.push({ id: lead.id, ok: true, mark_failed: true });
    }
  }

  res.status(200).json({ ok: true, nudged: results.filter((r) => r.ok).length, results });
};
