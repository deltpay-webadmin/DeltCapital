// POST /api/admin-login
//   body: { email: string, password?: string }
//
// Two login modes share this endpoint:
//   \u2022 Password \u2014 when `password` is supplied we verify it against the SHARED
//     Supabase Auth (the same auth.users that back Delt Pay), require the
//     email to be on ADMIN_ALLOWED_EMAILS (authorization gate, so Delt Pay
//     end-users can't reach the admin dash), then set the session cookie
//     directly and return { ok: true, redirect }. No email round-trip.
//   \u2022 Magic link \u2014 when no password is supplied we fall back to emailing a
//     one-time sign-in link (the original flow). Always returns { ok: true }
//     regardless of whether the email matches \u2014 no enumeration.

const {
  isEmailAllowed,
  issueMagicToken,
  issueSession,
  sessionCookieHeader,
  SESSION_TTL_HOURS,
} = require('./_admin-auth');
const { verifyPassword } = require('./_supabase-auth');
const { getAccessToken, sendMail } = require('./_email');

const FROM_MAILBOX = process.env.OUTLOOK_FROM_EMAIL;
const SITE_ORIGIN = (() => {
  const explicit = process.env.PUBLIC_SITE_ORIGIN;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return /^https?:\/\//i.test(vercel) ? vercel : `https://${vercel}`;
  return 'https://deltcapital.com';
})();

function magicLinkEmail({ link }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F8F7FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1A1A1F;">
  <div style="max-width:480px;margin:32px auto;background:#fff;border-radius:14px;padding:32px 36px;box-shadow:0 8px 24px -12px rgba(31,28,80,0.18);">
    <div style="font-size:13px;color:#6B6877;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:14px;">Delt Capital Admin</div>
    <h1 style="font-size:20px;margin:0 0 14px;font-weight:600;">Your sign-in link</h1>
    <p style="font-size:14.5px;line-height:1.55;margin:0 0 22px;">Tap below to open the admin dashboard. This link works once and expires in 15 minutes.</p>
    <p style="margin:18px 0;">
      <a href="${link}" style="display:inline-block;padding:13px 22px;background:#1A1A1F;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14.5px;">Open admin dashboard</a>
    </p>
    <p style="font-size:12px;color:#6B6877;margin-top:24px;line-height:1.5;">If you didn't request this, you can ignore the email. The link is only valid for your account.</p>
  </div>
</body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  body = body || {};
  const email = String(body.email || '').trim().toLowerCase();
  const password = body.password ? String(body.password) : '';

  // \u2500\u2500\u2500 Password mode: verify against shared Supabase Auth, no email \u2500\u2500\u2500
  if (password) {
    // Authorization gate first: only allow-listed emails may reach the
    // admin dash, even with otherwise-valid platform credentials. Generic
    // error so we don't reveal whether the email or the password was wrong.
    if (!email || !isEmailAllowed(email)) {
      res.status(401).json({ error: 'invalid_credentials' });
      return;
    }
    const user = await verifyPassword(email, password);
    if (!user) {
      res.status(401).json({ error: 'invalid_credentials' });
      return;
    }
    let session;
    try {
      session = issueSession(email);
    } catch (err) {
      console.error('[admin-login] issueSession failed:', err && err.message);
      res.status(500).json({ error: 'config_error', detail: String(err && err.message) });
      return;
    }
    res.setHeader('Set-Cookie', sessionCookieHeader(session, {
      maxAgeSeconds: SESSION_TTL_HOURS * 3600,
    }));
    res.status(200).json({ ok: true, redirect: '/admin/leads' });
    return;
  }

  // \u2500\u2500\u2500 Magic-link mode (fallback) \u2500\u2500\u2500
  // Always 200 \u2014 don't leak which emails are on the allow-list.
  if (!email || !isEmailAllowed(email)) {
    res.status(200).json({ ok: true });
    return;
  }
  if (!FROM_MAILBOX) {
    console.warn('[admin-login] OUTLOOK_FROM_EMAIL not set \u2014 cannot send magic link');
    res.status(200).json({ ok: true });
    return;
  }

  let token, link;
  try {
    token = issueMagicToken(email);
    link = `${SITE_ORIGIN.replace(/\/$/, '')}/api/admin-callback?t=${encodeURIComponent(token)}`;
  } catch (err) {
    console.error('[admin-login] issueMagicToken failed:', err && err.message);
    res.status(500).json({ error: 'config_error', detail: String(err && err.message) });
    return;
  }

  try {
    const accessToken = await getAccessToken();
    await sendMail(
      accessToken, FROM_MAILBOX, email,
      'Your Delt Capital admin sign-in link',
      magicLinkEmail({ link }),
      { from: FROM_MAILBOX, fromName: 'Delt Capital' }
    );
  } catch (err) {
    console.error('[admin-login] sendMail failed:', err && err.message);
    // Still 200 \u2014 enumeration protection. Operator should check logs.
  }
  res.status(200).json({ ok: true });
};
