// GET /api/admin-callback?t=<magic-token>
// Verifies the one-time magic-link token, sets a session cookie,
// redirects to /admin/leads. Bad/expired tokens land on /admin?error=1.

const {
  consumeMagicToken,
  issueSession,
  sessionCookieHeader,
  SESSION_TTL_HOURS,
} = require('./_admin-auth');

module.exports = async function handler(req, res) {
  const url = new URL(req.url || '/', 'http://x');
  const token = url.searchParams.get('t');
  const claim = token ? consumeMagicToken(token) : null;

  if (!claim) {
    res.statusCode = 302;
    res.setHeader('Location', '/admin?error=expired');
    res.end();
    return;
  }

  const session = issueSession(claim.email);
  res.setHeader('Set-Cookie', sessionCookieHeader(session, {
    maxAgeSeconds: SESSION_TTL_HOURS * 3600,
  }));
  res.statusCode = 302;
  res.setHeader('Location', '/admin/leads');
  res.end();
};
