// Verifies a platform user's email + password against the SHARED Supabase
// Auth (GoTrue) instance — the same auth.users that back Delt Pay. The admin
// dash uses this so the same shared credentials work across both products.
//
// Underscore prefix keeps Vercel from exposing this as an HTTP endpoint.
//
// We call the GoTrue token endpoint directly (no @supabase/supabase-js) to
// match the hand-rolled-fetch pattern used in api/_store.js and api/_plaid.js.
//
// Required env vars (point at the Delt Pay Database project):
//   SUPABASE_URL                  — https://ytemrmpnwmzqeradbeoa.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY     — also serves as the apikey for GoTrue here

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const ENABLED = !!(SUPABASE_URL && SUPABASE_KEY);

// Returns the GoTrue user object on success, or null on bad credentials /
// misconfiguration. Never throws — callers treat null as "denied".
async function verifyPassword(email, password) {
  if (!ENABLED || !email || !password) return null;
  let res;
  try {
    res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    console.error('[supabase-auth] token request failed:', err && err.message);
    return null;
  }
  // 400 = invalid grant (bad password / no such user); anything non-2xx = deny.
  if (!res.ok) return null;
  let data;
  try { data = await res.json(); } catch (_) { return null; }
  if (!data || !data.access_token) return null;
  return data.user || { email };
}

module.exports = { ENABLED, verifyPassword };
