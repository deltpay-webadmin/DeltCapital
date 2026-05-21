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

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'david@deltpay.com';

const FROM_MAILBOX = process.env.OUTLOOK_FROM_EMAIL;

const SITE_ORIGIN = (() => {
  const explicit = process.env.PUBLIC_SITE_ORIGIN;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return /^https?:\/\//i.test(vercel) ? vercel : `https://${vercel}`;
  return 'https://deltcapital.com';
})();

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

function smsTemplate({ firstName, low, high, applyUrl }) {
  const greet = firstName ? `${firstName}, ` : '';
  const range = (low && high)
    ? `$${low.toLocaleString()}\u2013$${high.toLocaleString()}`
    : 'your funding offer';
  // Keep under 160 chars to avoid multi-segment SMS billing on the
  // operator's eventual Twilio migration. Current count: ~140.
  return `${greet}this is David at Delt Capital. Your ${range} offer is still open \u2014 takes 2 min to claim: ${applyUrl}`;
}

function buildApplyDeepLink({ leadId, lead, estimate }) {
  const e = estimate || {};
  const payload = {
    v: 1, t: Date.now(),
    leadId: leadId || undefined,
    firstName: String((lead && lead.first_name) || '').trim(),
    businessName: String((lead && lead.business_name) || '').trim(),
    email: String((lead && lead.email) || '').trim(),
    phone: String((lead && lead.phone) || '').trim(),
    low: Number(e.low) || 0,
    high: Number(e.high) || 0,
    revenue: Number(e.revenue) || 0,
    tib: String(e.tib || ''),
    acceptsCards: e.acceptsCards === true ? 1 : (e.acceptsCards === false ? 0 : null),
    cardSales: Number(e.cardSales) || 0,
    boosted: !!e.boosted,
  };
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, 'utf8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${SITE_ORIGIN.replace(/\/$/, '')}/apply?d=${b64}`;
}

// HTML-escape so a malicious business_name can't inject markup into our
// internal email.
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]); }
function fmtMoney(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return '$0';
  return '$' + Math.round(v).toLocaleString();
}

function nudgeEmail({ firstName, estimate, applyUrl }) {
  const range = (estimate && estimate.low && estimate.high)
    ? `${fmtMoney(estimate.low)}\u2013${fmtMoney(estimate.high)}`
    : 'your pre-qualified offer';
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F8F7FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1A1A1F;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:14px;padding:36px 40px;box-shadow:0 8px 24px -12px rgba(31,28,80,0.18);">
    <div style="font-size:13px;color:#6B6877;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:14px;">Delt Capital</div>
    <h1 style="font-size:22px;line-height:1.25;margin:0 0 16px;font-weight:600;color:#1A1A1F;">${esc(firstName ? `${firstName}, your offer is still open` : 'Your offer is still open')}</h1>
    <p style="font-size:15px;line-height:1.55;margin:0 0 14px;">You looked at your ${esc(range)} funding range earlier today. The offer's still good \u2014 it takes about 2 minutes to claim and there's no impact to your credit.</p>
    <p style="font-size:15px;line-height:1.55;margin:0 0 22px;">If there's anything I can answer for you, just reply to this email.</p>
    <p style="margin:24px 0;">
      <a href="${esc(applyUrl)}" style="display:inline-block;padding:14px 26px;background:linear-gradient(135deg,#5B5BD6 0%,#6366F1 50%,#5B5BD6 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">Continue my application</a>
    </p>
    <p style="font-size:12.5px;color:#6B6877;line-height:1.5;margin-top:28px;">\u2014 David Hazday, Delt Capital</p>
  </div>
</body></html>`;
}

function internalNudgeNote({ lead, applyUrl, smsBody, gvLink }) {
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1A1A1F;background:#F8F7FB;padding:24px;">
  <div style="max-width:600px;background:#fff;border-radius:12px;padding:28px;box-shadow:0 4px 18px -8px rgba(0,0,0,0.12);">
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
    <p style="margin:18px 0 0;font-size:12.5px;color:#6B6877;">Deep link (already in the SMS body): <a href="${esc(applyUrl)}">${esc(applyUrl)}</a></p>
  </div>
</body></html>`;
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
    const ctx = {
      leadId: lead.id,
      lead,
      estimate: lead.estimate || {},
    };
    const applyUrl = buildApplyDeepLink(ctx);
    const smsBody  = smsTemplate({
      firstName: lead.first_name,
      low: lead.estimate && lead.estimate.low,
      high: lead.estimate && lead.estimate.high,
      applyUrl,
    });
    const gvLink = googleVoiceLink({ phone: lead.phone, body: smsBody });

    // Email the lead first (the automation half of the hybrid).
    try {
      await sendMail(
        token, FROM_MAILBOX, lead.email,
        `Still want that funding offer?`,
        nudgeEmail({ firstName: lead.first_name, estimate: lead.estimate || {}, applyUrl }),
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
        internalNudgeNote({ lead, applyUrl, smsBody, gvLink }),
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
