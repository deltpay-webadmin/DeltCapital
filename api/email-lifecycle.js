// Vercel cron — email lifecycle for stalled applications (DC-3 / DC-4).
//
// Runs hourly (vercel.json). For every lead that ran the calculator but
// never submitted:
//   • DC-3 at ≥24h  — "your estimate is still on the table"
//   • DC-4 at ≥72h  — "closing your file" (final; BCCs the operator)
//
// Complements — does not replace — the 45-minute nudge in api/sms-nudge.js.
// Tracking columns on leads: email_nudge_count / email_nudged_at (see
// DeltPay repo migration 20260811_10_lifecycle.sql — shared database).
//
// Quiet hours: same convention as sms-nudge — no sends 9pm–8am ET, no
// weekends. The hourly cadence just means a lead crosses its threshold
// and gets the email within the hour (or at 8am if it crossed overnight).
//
// Auth: x-vercel-cron header, or CRON_SECRET via ?token= / Bearer.

const store = require('./_store');
const { getAccessToken, sendMail } = require('./_email');
const { buildApplyUrlFromRow, withUtm } = require('./_deeplink');
const { renderEmail, esc, COMPANY } = require('./_email-layout');
const outreach = require('./_outreach');

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'david@deltpay.com';

function fmtK(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v < 1000) return '$' + Math.round(v).toLocaleString();
  return '$' + Math.round(v / 1000) + 'K';
}

function rangeLabel(estimate) {
  const low = fmtK(estimate && estimate.low);
  const high = fmtK(estimate && estimate.high);
  if (low && high) return `${low}\u2013${high}`;
  return null;
}

// ── DC-3 · 24h ──────────────────────────────────────────────────────

function stall24Body({ firstName, range, ctaUrl }) {
  const name = firstName ? String(firstName).trim() : '';
  const rangeLine = range
    ? `Yesterday we pre-qualified your business for <strong style="color:#0A1133;">${esc(range)}</strong> in working capital.`
    : 'Yesterday we pre-qualified your business for working capital.';
  return `
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:#0A1133;">
        ${range ? `Your ${esc(range)} estimate is still on the table.` : 'Your estimate is still on the table.'}
      </h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">${name ? `Hi ${esc(name)},` : 'Hi,'}</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        ${rangeLine} Your application is saved — you're about two minutes from the finish line.
      </p>
      <p style="margin:0 0 8px;">
        <a href="${esc(ctaUrl)}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#5B5BD6 0%,#6366F1 50%,#5B5BD6 100%);color:#FFFFFF;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">Continue my application &rarr;</a>
      </p>
      <p style="margin:0 0 20px;font-size:12.5px;color:#6B6877;">Resumes exactly where you left off.</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        The only step left is connecting your bank through Plaid so we can verify revenue —
        that's what turns the estimate into a real offer. No credit pull until you accept terms.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        If you stopped because of a question — about the cost, the daily payment, anything —
        reply and ask me directly. You'll get a straight answer, not a pitch.
      </p>
      <p style="margin:22px 0 0;color:#0A1133;font-size:13.5px;line-height:1.55;">
        — David Hazday<br/>
        <span style="color:#6B6877;font-weight:500;">Director, Delt Capital</span>
      </p>`;
}

// ── DC-4 · 72h (final) ──────────────────────────────────────────────

function stall72Body({ firstName, range, ctaUrl }) {
  const name = firstName ? String(firstName).trim() : '';
  return `
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:#0A1133;">
        Closing your file this week — unless you want the number.
      </h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">${name ? `Hi ${esc(name)},` : 'Hi,'}</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        I'm cleaning up open files this week and yours is one of them. Before I close it:
        ${range ? `your <strong style="color:#0A1133;">${esc(range)}</strong> pre-qualification is still valid,` : 'your pre-qualification is still valid,'}
        and finishing takes about two minutes.
      </p>
      <p style="margin:0 0 8px;">
        <a href="${esc(ctaUrl)}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#5B5BD6 0%,#6366F1 50%,#5B5BD6 100%);color:#FFFFFF;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">Finish and see my real offer &rarr;</a>
      </p>
      <p style="font-size:15px;line-height:1.6;margin:20px 0 14px;color:#0F0E17;">
        If the timing is wrong, reply "later" and I'll check in next quarter instead.
        If the answer is "no," that's fine too — one line and I'll leave you alone.
      </p>
      <p style="margin:22px 0 0;color:#0A1133;font-size:13.5px;line-height:1.55;">
        — David Hazday<br/>
        <span style="color:#6B6877;font-weight:500;">Director, Delt Capital</span>
      </p>`;
}

function inQuietHours(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short', hour: 'numeric', hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === 'weekday')?.value || '';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
  if (weekday === 'Sat' || weekday === 'Sun') return true;
  if (hour < 8 || hour >= 21) return true;
  return false;
}

function isAuthorized(req) {
  if (req.headers['x-vercel-cron']) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization || '';
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(req.url || '/', 'http://x');
  return url.searchParams.get('token') === secret;
}

module.exports = async function handler(req, res) {
  if (!isAuthorized(req)) { res.status(401).json({ error: 'unauthorized' }); return; }
  if (!store.ENABLED)     { res.status(200).json({ ok: true, skipped: 'store_disabled' }); return; }

  const url = new URL(req.url || '/', 'http://x');
  const force = url.searchParams.get('force') === '1';
  if (!force && inQuietHours()) {
    res.status(200).json({ ok: true, skipped: 'quiet_hours' });
    return;
  }

  let leads;
  try {
    leads = await store.findEmailLifecycleLeads();
  } catch (err) {
    console.error('[email-lifecycle] find failed:', err && err.message);
    res.status(500).json({ error: 'store_error', detail: String(err && err.message) });
    return;
  }
  if (!leads.length) { res.status(200).json({ ok: true, sent: 0 }); return; }

  // Resend-first: token only matters on the legacy Graph fallback path.
  let token = null;
  try { token = await getAccessToken(); } catch (_) { /* Resend path needs no token */ }

  const results = [];
  const now = Date.now();
  for (const lead of leads) {
    const count = lead.email_nudge_count || 0;
    const ageH = (now - new Date(lead.created_at).getTime()) / 3600000;
    let due = null;
    if (count === 0 && ageH >= 24) due = 1;
    else if (count === 1 && ageH >= 72) due = 2;
    if (!due || !lead.email) continue;

    const campaign = due === 1 ? 'stall-24h' : 'stall-72h';
    const applyUrl = buildApplyUrlFromRow(lead);
    const ctaUrl = withUtm(applyUrl, {
      utm_source: 'email',
      utm_medium: 'lifecycle',
      utm_campaign: campaign,
    });
    const range = rangeLabel(lead.estimate || {});
    const subject = due === 1
      ? (range ? `Your ${range} estimate is still on the table` : 'Your funding estimate is still on the table')
      : 'Closing your file this week — unless you want the number';
    const bodyFn = due === 1 ? stall24Body : stall72Body;
    const html = renderEmail({
      body: bodyFn({ firstName: lead.first_name, range, ctaUrl }),
      audience: 'lead',
      includeTrustStrip: true,
      recipientEmail: lead.email,
      recipientPhone: lead.phone,
      preheader: due === 1
        ? 'Application saved. Two minutes to the bank-link step.'
        : 'No pressure. One click keeps it open.',
      openPixelUrl: outreach.openPixelUrl({
        leadId: lead.id, email: lead.email, campaign,
      }),
    });

    try {
      await sendMail(token, process.env.OUTLOOK_FROM_EMAIL, lead.email, subject, html, {
        fromName: 'David Hazday',
        replyTo: [NOTIFY_TO],
        ...(due === 2 ? { bcc: [NOTIFY_TO] } : {}),
      });
    } catch (err) {
      console.error(`[email-lifecycle] send failed for ${lead.email}:`, err && err.message);
      results.push({ id: lead.id, ok: false });
      continue;
    }

    await outreach.recordOutreach({
      leadId: lead.id, leadEmail: lead.email, leadName: lead.first_name,
      campaign, event: 'sent',
      utm: { utm_source: 'email', utm_medium: 'lifecycle', utm_campaign: campaign },
    }).catch(() => {});
    try { await store.markEmailNudged(lead.id, due); } catch (_) {}
    results.push({ id: lead.id, ok: true, step: campaign });
  }

  res.status(200).json({ ok: true, sent: results.filter((r) => r.ok).length, results });
};
