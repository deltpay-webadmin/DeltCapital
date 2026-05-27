// POST /api/customer-login
//   body: { email: string }
// Sends the customer a Supabase Auth magic-link via our Outlook mailbox.
// Always returns { ok: true } regardless of whether the email matched a
// lead row — no enumeration. The real signal is whether a link arrives.
//
// Flow:
//   1. Generate a magic-link URL via Supabase admin API (creates the
//      auth.users row on first sign-in via type=signup; reuses it on
//      subsequent visits via type=magiclink).
//   2. Email that URL to the customer through OUTLOOK_FROM_EMAIL.
//   3. When they click, Supabase verifies and 302s to
//      {SITE_ORIGIN}/?portal=1 with #access_token=… in the fragment.
//      Variation1's mount effect picks that up and lands on /#portal.

const { generateMagicLink, ENABLED: AUTH_ENABLED } = require('./_supabase-auth');
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
    <div style="font-size:12px;color:#6B6877;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:14px;font-weight:600;">Delt Capital</div>
    <h1 style="font-size:22px;margin:0 0 12px;font-weight:700;letter-spacing:-0.01em;">Sign in to your portal</h1>
    <p style="font-size:14.5px;line-height:1.55;margin:0 0 22px;color:#425466;">Tap the button below to open your funding status. This link signs you in on this device and expires in 1 hour.</p>
    <p style="margin:18px 0;">
      <a href="${link}" style="display:inline-block;padding:14px 24px;background:#4945FF;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">Open my portal</a>
    </p>
    <p style="font-size:12.5px;color:#6B6877;margin-top:24px;line-height:1.55;">If you didn't request this, you can ignore the email — no account changes happen until you click the link.</p>
    <p style="font-size:11px;color:#9D99AC;margin-top:18px;line-height:1.55;word-break:break-all;">Or paste this URL into your browser:<br/>${link}</p>
  </div>
</body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  body = body || {};
  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // Still 200 — no enumeration. Bad-format emails are a client-side bug.
    res.status(200).json({ ok: true });
    return;
  }

  if (!AUTH_ENABLED) {
    console.warn('[customer-login] Supabase not configured — cannot send magic link');
    res.status(200).json({ ok: true });
    return;
  }
  if (!FROM_MAILBOX) {
    console.warn('[customer-login] OUTLOOK_FROM_EMAIL not set — cannot send magic link');
    res.status(200).json({ ok: true });
    return;
  }

  // After Supabase verifies, it redirects here. The `?portal=1` query string
  // tells the client router to navigate to the portal page once the access
  // tokens land in the URL fragment.
  const redirectTo = `${SITE_ORIGIN.replace(/\/$/, '')}/?portal=1`;

  let link;
  try {
    link = await generateMagicLink({ email, redirectTo });
  } catch (err) {
    console.error('[customer-login] generateMagicLink failed:', err && err.message);
    // Still 200 — enumeration protection. Operator should check function logs.
    res.status(200).json({ ok: true });
    return;
  }

  try {
    const accessToken = await getAccessToken();
    await sendMail(
      accessToken, FROM_MAILBOX, email,
      'Your Delt Capital sign-in link',
      magicLinkEmail({ link }),
      { from: FROM_MAILBOX, fromName: 'Delt Capital' }
    );
  } catch (err) {
    console.error('[customer-login] sendMail failed:', err && err.message);
    // Still 200 — enumeration protection.
  }
  res.status(200).json({ ok: true });
};
