// GET /api/admin-logout
// Clears the session cookie and redirects to /admin.

const { clearCookieHeader } = require('./_admin-auth');

module.exports = async function handler(req, res) {
  res.statusCode = 302;
  res.setHeader('Set-Cookie', clearCookieHeader());
  res.setHeader('Location', '/admin');
  res.end();
};
