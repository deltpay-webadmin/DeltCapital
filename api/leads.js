// Vercel serverless function — calculator lead capture.
//
// Fires when a user submits the lead-gate form in V1CalcAnalyzer
// (deltcapital.com calculator). Two things happen:
//   1. Internal notification → david@deltpay.com with the lead's contact
//      info and the funding estimate that triggered the gate.
//   2. Branded confirmation → the lead, with the funding range we
//      pre-qualified them for and a CTA back to the application.
//
// Best-effort by design: if either email fails, we still 200 so the
// front-end can unblur the result. We never want to block a user from
// seeing their number because of an SMTP hiccup; the front-end also
// posts the same data into the apply form, so the lead is captured
// downstream regardless.
//
// Required env vars (same set as /api/book):
//   OUTLOOK_TENANT_ID, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET,
//   OUTLOOK_FROM_EMAIL
// Optional:
//   LEADS_NOTIFY_EMAIL   — internal recipient (defaults to BOOKING_NOTIFY_EMAIL
//                           or david@deltpay.com)

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'david@deltpay.com';

async function getAccessToken() {
  const tenant = process.env.OUTLOOK_TENANT_ID;
  const clientId = process.env.OUTLOOK_CLIENT_ID;
  const secret = process.env.OUTLOOK_CLIENT_SECRET;
  if (!tenant || !clientId || !secret) {
    throw new Error('Missing OUTLOOK_TENANT_ID / OUTLOOK_CLIENT_ID / OUTLOOK_CLIENT_SECRET');
  }
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: secret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });
  const r = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`Token request failed (${r.status}): ${text.slice(0, 400)}`);
  }
  const data = await r.json();
  if (!data.access_token) throw new Error('Token response missing access_token');
  return data.access_token;
}

// Send through David's licensed mailbox with Send-As on the noreply
// shared mailbox — identical pattern to /api/book.
async function sendMail(token, senderMailbox, to, subject, html, opts = {}) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderMailbox)}/sendMail`;
  const message = {
    subject,
    body: { contentType: 'HTML', content: html },
    toRecipients: [{ emailAddress: { address: to } }],
  };
  if (opts.from) {
    const fromAddr = { address: opts.from };
    if (opts.fromName) fromAddr.name = opts.fromName;
    message.from = { emailAddress: fromAddr };
  }
  if (opts.replyTo && opts.replyTo.length) {
    message.replyTo = opts.replyTo.map((addr) => ({ emailAddress: { address: addr } }));
  }
  if (opts.bcc && opts.bcc.length) {
    message.bccRecipients = opts.bcc.map((addr) => ({ emailAddress: { address: addr } }));
  }
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, saveToSentItems: true }),
  });
  if (r.status !== 202) {
    const text = await r.text().catch(() => '');
    throw new Error(`sendMail to ${to} failed (${r.status}): ${text.slice(0, 400)}`);
  }
}

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]); }

function fmtMoney(n) {
  if (!Number.isFinite(n) || n <= 0) return '$0';
  if (n >= 1000) return `$${Math.round(n / 1000).toLocaleString()}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function tibLabel(t) {
  if (t === '<6mo')   return 'Less than 6 months';
  if (t === '6-12mo') return '6–12 months';
  if (t === '1-2yr')  return '1–2 years';
  if (t === '2yr+')   return '2+ years';
  return String(t || 'Unknown');
}

function internalEmail({ firstName, businessName, email, phone, source, estimate }) {
  const e = estimate || {};
  const range = (e.low && e.high) ? `${fmtMoney(e.low)} – ${fmtMoney(e.high)}` : '—';
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.5;">
      <h2 style="margin:0 0 8px;font-size:18px;">New calculator lead</h2>
      <p style="margin:0 0 16px;color:#5A6577;font-size:13px;">
        ${esc(firstName)} from ${esc(businessName)} requested their funding range
        via the calculator on deltcapital.com.
      </p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Name</td><td style="padding:6px 0;">${esc(firstName)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Business</td><td style="padding:6px 0;">${esc(businessName)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Phone</td><td style="padding:6px 0;"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Source</td><td style="padding:6px 0;">${esc(source || 'calculator-gate')}</td></tr>
      </table>
      <h3 style="margin:18px 0 6px;font-size:15px;">Pre-qualified estimate</h3>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Funding range</td><td style="padding:6px 0;"><strong>${esc(range)}</strong>${e.boosted ? ' <span style="color:#5B5BD6;font-size:11px;font-weight:600;">(WITH DELT BOOST)</span>' : ''}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Monthly revenue</td><td style="padding:6px 0;">${esc(fmtMoney(e.revenue))}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Time in business</td><td style="padding:6px 0;">${esc(tibLabel(e.tib))}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Accepts cards</td><td style="padding:6px 0;">${e.acceptsCards === true ? 'Yes' : (e.acceptsCards === false ? 'No' : '—')}</td></tr>
        ${e.acceptsCards === true ? `<tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Monthly card sales</td><td style="padding:6px 0;">${esc(fmtMoney(e.cardSales))}</td></tr>` : ''}
      </table>
      <p style="margin:24px 0 0;color:#5A6577;font-size:12.5px;">
        Specialist follow-up window: <strong>within 1 business hour</strong>.
      </p>
    </div>
  `;
}

function leadEmail({ firstName, businessName, estimate }) {
  const e = estimate || {};
  const range = (e.low && e.high) ? `${fmtMoney(e.low)} – ${fmtMoney(e.high)}` : 'your custom amount';
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.55;max-width:560px;">
      <h2 style="margin:0 0 14px;font-size:22px;letter-spacing:-0.01em;">
        Your pre-qualified funding range is <span style="color:#5B5BD6;">${esc(range)}</span>.
      </h2>
      <p style="margin:0 0 14px;">Hi ${esc(firstName)},</p>
      <p style="margin:0 0 14px;">
        Based on what you told us about <strong>${esc(businessName)}</strong>, we've
        pre-qualified you for between <strong>${esc(range)}</strong> in working
        capital${e.boosted ? ' — that\'s the boosted estimate that comes with switching processing to Delt' : ''}.
      </p>
      <p style="margin:0 0 14px;">
        A funding specialist will reach out within the next business hour to
        confirm the exact offer and walk you through next steps. If you'd rather
        keep moving now, the application takes about 2 minutes:
      </p>
      <p style="margin:0 0 20px;">
        <a href="https://deltcapital.com/#calc"
           style="display:inline-block;background:#5B5BD6;color:#fff;text-decoration:none;
                  padding:12px 22px;border-radius:10px;font-family:Arial,sans-serif;
                  font-size:14.5px;font-weight:700;">
          Continue my application
        </a>
      </p>
      <p style="margin:0 0 14px;color:#5A6577;font-size:13.5px;">
        No credit pull until you accept an offer. Most operators get a final
        number back the same day.
      </p>
      <p style="margin:24px 0 0;color:#5A6577;font-size:13px;">— Delt Capital</p>
      <p style="margin:18px 0 0;color:#9aa3ad;font-size:11.5px;line-height:1.5;border-top:1px solid #e7e3da;padding-top:12px;">
        You're receiving this because you used the funding calculator on
        deltcapital.com. Reply to unsubscribe.
      </p>
    </div>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      firstName, businessName, email, phone,
      source, estimate,
    } = body;

    if (!firstName || !businessName || !email || !phone) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }

    const fromMailbox = process.env.OUTLOOK_FROM_EMAIL;
    if (!fromMailbox) {
      // Even if email isn't configured, accept the lead — front-end has
      // it in state and will re-submit through the apply flow.
      console.warn('OUTLOOK_FROM_EMAIL not set — lead recorded without email notification');
      res.status(200).json({ ok: true, emailed: false });
      return;
    }

    const ctx = { firstName, businessName, email, phone, source, estimate };

    let token;
    try {
      token = await getAccessToken();
    } catch (err) {
      console.error('leads getAccessToken failed:', err && err.stack ? err.stack : err);
      // Still 200 — the lead is captured in our front-end state.
      res.status(200).json({ ok: true, emailed: false });
      return;
    }

    const internalSubject = `New calc lead: ${firstName} @ ${businessName} — ${(estimate && estimate.low && estimate.high) ? `${fmtMoney(estimate.low)}–${fmtMoney(estimate.high)}` : 'no range'}`;
    const leadSubject     = `Your pre-qualified funding range — Delt Capital`;

    try {
      await sendMail(token, NOTIFY_TO, NOTIFY_TO, internalSubject, internalEmail(ctx), {
        from: fromMailbox,
        fromName: 'Delt Capital',
        replyTo: [email],
      });
    } catch (err) {
      console.error('leads internal sendMail failed:', err && err.stack ? err.stack : err);
    }
    try {
      await sendMail(token, NOTIFY_TO, email, leadSubject, leadEmail(ctx), {
        from: fromMailbox,
        fromName: 'Delt Capital',
        replyTo: [NOTIFY_TO],
        bcc: [NOTIFY_TO],
      });
    } catch (err) {
      console.error('leads booker sendMail failed:', err && err.stack ? err.stack : err);
    }

    res.status(200).json({ ok: true, emailed: true });
  } catch (err) {
    console.error('leads api error:', err && err.stack ? err.stack : err);
    // Soft-fail: front-end already has the data and will retry via apply form.
    res.status(200).json({ ok: true, emailed: false });
  }
};
