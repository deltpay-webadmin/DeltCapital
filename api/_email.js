// Shared Microsoft Graph email helper. Underscore prefix keeps Vercel from
// exposing this as an HTTP endpoint.
//
// Sends through a licensed mailbox (OUTLOOK_FROM_EMAIL) using the
// client-credentials flow against Graph's /sendMail endpoint. Same
// pattern api/book.js and api/leads.js have used since launch — this
// module exists so api/sms-nudge can reuse it without duplicating the
// auth + send logic.
//
// Required env vars:
//   OUTLOOK_TENANT_ID
//   OUTLOOK_CLIENT_ID
//   OUTLOOK_CLIENT_SECRET
//   OUTLOOK_FROM_EMAIL    — licensed sender mailbox (used as the path
//                            in /users/{mailbox}/sendMail). Send-As on
//                            noreply@deltpay.com is handled via opts.from.

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

module.exports = { getAccessToken, sendMail };
