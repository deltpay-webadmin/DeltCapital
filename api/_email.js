// Shared email transport. Underscore prefix keeps Vercel from exposing
// this as an HTTP endpoint.
//
// TRANSPORT SELECTION (Aug 2026 consolidation):
//   • When RESEND_API_KEY *and* RESEND_FROM_EMAIL are both set, mail goes
//     out through Resend (https://resend.com). RESEND_FROM_EMAIL must be
//     an address on a domain verified in the Resend account — we gate on
//     its presence so a half-configured env never silently breaks sends.
//   • Otherwise we fall back to the original Microsoft Graph flow through
//     the licensed OUTLOOK_FROM_EMAIL mailbox. Same behavior as launch.
//
// The public surface is unchanged — getAccessToken() + sendMail(...) —
// so api/leads.js, api/book.js, and api/sms-nudge.js need no edits.
//
// Graph env vars (fallback path):
//   OUTLOOK_TENANT_ID, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET,
//   OUTLOOK_FROM_EMAIL
// Resend env vars (primary path):
//   RESEND_API_KEY, RESEND_FROM_EMAIL (e.g. "david@deltcapital.com")
//   RESEND_FROM_NAME (optional, defaults to "Delt Capital")

const RESEND_READY = !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);

// ── Resend path ──────────────────────────────────────────────────────

async function resendSend(to, subject, html, opts = {}) {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const fromName = opts.fromName || process.env.RESEND_FROM_NAME || 'Delt Capital';
  const payload = {
    from: `${fromName} <${fromEmail}>`,
    to: [to],
    subject,
    html,
  };
  if (opts.replyTo && opts.replyTo.length) payload.reply_to = opts.replyTo;
  if (opts.bcc && opts.bcc.length) payload.bcc = opts.bcc;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`resend send to ${to} failed (${r.status}): ${text.slice(0, 400)}`);
  }
}

// ── Microsoft Graph path (legacy fallback) ───────────────────────────

async function graphAccessToken() {
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

async function graphSend(token, senderMailbox, to, subject, html, opts = {}) {
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

// ── Public surface (unchanged signatures) ────────────────────────────

// With Resend there is no token dance; return a marker so existing
// callers (`const token = await getAccessToken()`) keep working.
async function getAccessToken() {
  if (RESEND_READY) return 'resend';
  return graphAccessToken();
}

async function sendMail(token, senderMailbox, to, subject, html, opts = {}) {
  if (RESEND_READY) return resendSend(to, subject, html, opts);
  return graphSend(token, senderMailbox, to, subject, html, opts);
}

module.exports = { getAccessToken, sendMail };
