// Vercel serverless function — booking notifier.
//
// Sends two emails via Microsoft Graph (client_credentials):
//   1. Internal notification → david@deltpay.com
//   2. Confirmation         → the booker's email
//
// Required Vercel env vars (Microsoft Graph app registration):
//   OUTLOOK_TENANT_ID     — Azure AD tenant id
//   OUTLOOK_CLIENT_ID     — App registration (client) id
//   OUTLOOK_CLIENT_SECRET — App registration client secret
//   OUTLOOK_FROM_EMAIL    — Mailbox to send from (must have Mail.Send app permission granted with admin consent)
//
// Optional:
//   BOOKING_NOTIFY_EMAIL  — overrides the default david@deltpay.com recipient

const NOTIFY_TO = process.env.BOOKING_NOTIFY_EMAIL || 'david@deltpay.com';

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

async function sendMail(token, fromMailbox, to, subject, html) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(fromMailbox)}/sendMail`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: 'HTML', content: html },
        toRecipients: [{ emailAddress: { address: to } }],
      },
      saveToSentItems: true,
    }),
  });
  if (r.status !== 202) {
    const text = await r.text().catch(() => '');
    throw new Error(`sendMail to ${to} failed (${r.status}): ${text.slice(0, 400)}`);
  }
}

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]); }

function internalEmail({ fullName, email, specialistName, specialistTitle, dateLabel, time }) {
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.5;">
      <h2 style="margin:0 0 8px;font-size:18px;">New 30-minute call booked</h2>
      <p style="margin:0 0 16px;color:#5A6577;font-size:13px;">Auto-generated from the deltcapital.com booking flow.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">With</td><td style="padding:6px 0;">${esc(specialistName)} · ${esc(specialistTitle)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Day</td><td style="padding:6px 0;">${esc(dateLabel)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Time</td><td style="padding:6px 0;">${esc(time)} ET · 30 min</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Booker</td><td style="padding:6px 0;">${esc(fullName)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
      </table>
    </div>
  `;
}

function bookerEmail({ firstName, specialistName, specialistTitle, dateLabel, time }) {
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.55;">
      <h2 style="margin:0 0 12px;font-size:20px;">Your call is booked.</h2>
      <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
      <p style="margin:0 0 12px;">
        You're confirmed for a 30-minute call with <strong>${esc(specialistName)}</strong>
        (${esc(specialistTitle)}) on <strong>${esc(dateLabel)}</strong> at
        <strong>${esc(time)} ET</strong>.
      </p>
      <p style="margin:0 0 12px;">
        A Zoom link will arrive ahead of the call. If you need to reschedule or cancel,
        just reply to this email.
      </p>
      <p style="margin:24px 0 0;color:#5A6577;font-size:13px;">— Delt Capital</p>
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
      firstName, lastName, email,
      specialistName, specialistTitle,
      dateLabel, time,
    } = body;

    if (!firstName || !lastName || !email || !specialistName || !dateLabel || !time) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }

    const fromMailbox = process.env.OUTLOOK_FROM_EMAIL;
    if (!fromMailbox) {
      console.error('OUTLOOK_FROM_EMAIL is not set');
      res.status(500).json({ error: 'Server is not configured' });
      return;
    }

    const token = await getAccessToken();

    const fullName = `${firstName} ${lastName}`.trim();
    const ctx = { fullName, firstName, email, specialistName, specialistTitle, dateLabel, time };

    const internalSubject = `New booking: ${fullName} → ${specialistName} on ${dateLabel} ${time}`;
    const bookerSubject   = `You're booked with ${specialistName} — ${dateLabel} at ${time} ET`;

    // Send sequentially so a partial failure still returns a useful error.
    await sendMail(token, fromMailbox, NOTIFY_TO, internalSubject, internalEmail(ctx));
    await sendMail(token, fromMailbox, email,    bookerSubject,   bookerEmail(ctx));

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('book api error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Booking failed. Please try again or email us directly.' });
  }
};
