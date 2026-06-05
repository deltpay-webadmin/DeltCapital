// Shared Supabase auth helper. Underscore prefix keeps Vercel from exposing
// this file as an HTTP endpoint — it's importable from sibling api/ functions.
//
// Verifies a caller's Supabase access token (the JWT the browser holds after
// signing in) by asking Supabase's GoTrue endpoint who it belongs to. We never
// trust a user_id sent from the client; the row we read/write is always keyed
// by the id GoTrue returns for the presented token.
//
// Required env vars:
//   SUPABASE_URL        — https://<project>.supabase.co
//   SUPABASE_ANON_KEY   — public anon key (safe to use as the apikey here)
//
// Matches the hand-rolled-fetch, zero-SDK pattern in api/_plaid.js / _store.js.

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Pull a Bearer token out of the Authorization header.
function readBearer(req) {
  const h = (req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
  const m = /^Bearer\s+(.+)$/i.exec(String(h).trim());
  return m ? m[1].trim() : null;
}

// Resolve { id, email } for a presented access token, or null if it's missing,
// invalid, expired, or Supabase isn't configured. Never throws.
async function getUserFromRequest(req) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const token = readBearer(req);
  if (!token) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const user = await res.json().catch(() => null);
    if (!user || !user.id) return null;
    return { id: user.id, email: user.email || null };
  } catch (_) {
    return null;
  }
}

// ─── Admin allowlist ───
// Who counts as an admin in the Supabase-login admin view. carlos@deltpay.com is
// a built-in default so the admin works without extra config; ADMIN_ALLOWED_EMAILS
// (comma-separated, shared with the magic-link admin) can add more.
const DEFAULT_ADMIN_EMAILS = ['carlos@deltpay.com'];

function adminEmailSet() {
  const env = String(process.env.ADMIN_ALLOWED_EMAILS || '')
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  return new Set([...DEFAULT_ADMIN_EMAILS, ...env]);
}

function isAdminEmail(email) {
  return adminEmailSet().has(String(email || '').trim().toLowerCase());
}

// Resolve the caller and confirm they're an admin, else null. Use to gate the
// admin endpoints — never trust a client-asserted role.
async function getAdminFromRequest(req) {
  const user = await getUserFromRequest(req);
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

module.exports = { getUserFromRequest, readBearer, isAdminEmail, getAdminFromRequest, DEFAULT_ADMIN_EMAILS };
