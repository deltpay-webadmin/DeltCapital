// Magic-link auth for /admin pages.
//
// Flow:
//   1. Operator hits /admin or /api/admin-* without a session cookie.
//      They get a tiny "enter your email" form.
//   2. POST /api/admin-login with { email } → if the email is in
//      ADMIN_ALLOWED_EMAILS (comma-separated env var), we email them
//      a one-time link with a signed HMAC token good for 15 minutes.
//   3. Operator clicks link → /api/admin-callback?t=<token> → we verify
//      the token, set an HttpOnly cookie (signed JWT-ish), redirect to
//      /admin/leads.
//   4. Server pages check the cookie via verifySession().
//
// We don't use a third-party auth library here \u2014 the surface area is
// tiny (one admin user) and bringing in NextAuth/Lucia would dwarf the
// app. Tokens are HS256-signed with ADMIN_SESSION_SECRET.
//
// Required env vars:
//   ADMIN_ALLOWED_EMAILS    — comma-separated list (e.g. "david@deltpay.com")
//   ADMIN_SESSION_SECRET    — 32+ random bytes. Used to sign magic-link
//                             tokens AND session cookies.
// Optional:
//   ADMIN_SESSION_TTL_HOURS — how long a session lasts after login (default 168 = 7d)

const crypto = require('crypto');

const SESSION_TTL_HOURS = Number(process.env.ADMIN_SESSION_TTL_HOURS) || 168;
const SESSION_COOKIE = 'delt_admin';
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

function allowedEmails() {
  return String(process.env.ADMIN_ALLOWED_EMAILS || '')
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

function isEmailAllowed(email) {
  const list = allowedEmails();
  if (!list.length) return false;
  return list.includes(String(email || '').trim().toLowerCase());
}

function getSecret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET missing or too short (need 16+ chars).');
  }
  return s;
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

// Sign a payload (object) → "<b64url(payload)>.<b64url(hmac)>"
function signToken(payload) {
  const json = JSON.stringify(payload);
  const body = b64url(Buffer.from(json, 'utf8'));
  const mac = crypto.createHmac('sha256', getSecret()).update(body).digest();
  return `${body}.${b64url(mac)}`;
}

function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest();
  const got = fromB64url(sig);
  if (got.length !== expected.length || !crypto.timingSafeEqual(got, expected)) return null;
  try {
    return JSON.parse(fromB64url(body).toString('utf8'));
  } catch (_) { return null; }
}

// \u2500\u2500\u2500 Magic-link tokens (short-lived, single purpose) \u2500\u2500\u2500
function issueMagicToken(email) {
  return signToken({
    kind: 'magic',
    email: String(email || '').trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + MAGIC_LINK_TTL_MS,
  });
}
function consumeMagicToken(token) {
  const payload = verifyToken(token);
  if (!payload) return null;
  if (payload.kind !== 'magic') return null;
  if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
  if (!isEmailAllowed(payload.email)) return null;
  return { email: payload.email };
}

// \u2500\u2500\u2500 Session cookies (longer-lived, reused across pages) \u2500\u2500\u2500
function issueSession(email) {
  return signToken({
    kind: 'session',
    email: String(email || '').trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_HOURS * 3600 * 1000,
  });
}
function verifySession(cookieHeader) {
  if (!cookieHeader) return null;
  const cookies = parseCookies(cookieHeader);
  const raw = cookies[SESSION_COOKIE];
  if (!raw) return null;
  const payload = verifyToken(raw);
  if (!payload || payload.kind !== 'session') return null;
  if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
  if (!isEmailAllowed(payload.email)) return null;
  return { email: payload.email };
}

function parseCookies(header) {
  const out = {};
  String(header || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i < 0) return;
    const k = p.slice(0, i).trim();
    const v = p.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function sessionCookieHeader(value, { maxAgeSeconds } = {}) {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
  ];
  if (maxAgeSeconds != null) parts.push(`Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`);
  return parts.join('; ');
}

function clearCookieHeader() {
  return sessionCookieHeader('', { maxAgeSeconds: 0 });
}

module.exports = {
  SESSION_COOKIE,
  SESSION_TTL_HOURS,
  isEmailAllowed,
  allowedEmails,
  issueMagicToken,
  consumeMagicToken,
  issueSession,
  verifySession,
  parseCookies,
  sessionCookieHeader,
  clearCookieHeader,
};
