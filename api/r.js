// Short-link redirector: /r/<8-char-prefix> → /apply?d=<full-payload>
//
// Why this exists: the apply deep-link is a base64-encoded JSON
// payload, typically ~450–520 characters. That's fine for an email
// CTA button (the URL is hidden behind anchor text), but it blows
// past the 160-char SMS limit by a huge margin and looks like spam
// when copy-pasted into a text message.
//
// The /api/r endpoint takes an 8-character hex prefix (the first 8
// characters of the lead's UUID), looks the lead up in Supabase, and
// 302-redirects to the fully-built /apply?d=... URL — same prefill
// the email button uses.
//
// vercel.json rewrites `/r/:code` → `/api/r?c=:code` so the public
// URL stays clean (deltcapital.com/r/41f025d4 — ~38 chars total).
//
// Fail-safe: if the prefix doesn't resolve (expired, deleted, or
// Supabase down), we redirect to the homepage instead of returning a
// 404 page — the lead is still on a working URL and our brand stays
// in front of them.

const store = require('./_store');
const { buildApplyUrlFromRow, SITE_ORIGIN } = require('./_deeplink');

module.exports = async function handler(req, res) {
  try {
    // Rewrite passes the prefix as ?c=...; manual visits may use /r/<prefix>
    // (Vercel serves the rewrite) — both go through req.query.c.
    const code = String((req.query && req.query.c) || '').trim();

    if (!store.ENABLED) {
      // No DB → can't resolve. Send to homepage instead of error page.
      res.statusCode = 302;
      res.setHeader('Location', `${SITE_ORIGIN}/`);
      res.end();
      return;
    }

    const row = await store.getLeadByPrefix(code);
    if (!row) {
      res.statusCode = 302;
      res.setHeader('Location', `${SITE_ORIGIN}/?utm_source=sms&utm_medium=short&utm_campaign=expired`);
      res.end();
      return;
    }

    const applyUrl = buildApplyUrlFromRow(row);
    if (!applyUrl) {
      res.statusCode = 302;
      res.setHeader('Location', `${SITE_ORIGIN}/`);
      res.end();
      return;
    }

    // Use 302 (Found) rather than 301 (Permanent) so we can change
    // the resolution behavior later without poisoning client caches.
    // No-store header on top — we want every click to re-resolve so a
    // refreshed lead row (e.g., updated phone) is picked up.
    res.statusCode = 302;
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('Location', applyUrl);
    res.end();
  } catch (err) {
    console.error('[r] redirector error:', err && err.message);
    res.statusCode = 302;
    res.setHeader('Location', `${SITE_ORIGIN}/`);
    res.end();
  }
};
