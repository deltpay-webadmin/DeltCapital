// V1 Auth — thin Supabase client + helpers for the login flow.
//
// No build step here: the Supabase SDK is loaded from a CDN in index.html and
// exposed as the global `supabase` (the UMD `createClient` factory). This file
// is loaded as a plain text/babel script, so the functions below land on the
// global scope and are callable from variation-1-login.jsx / variation-1.jsx.
//
// The URL + publishable key are fetched once from /api/public-config (which
// reads them from Vercel env vars) so we never commit keys to git. The client
// persists the session in localStorage by default, so logins survive reloads.

let _v1SupabasePromise = null;

// Returns a promise that resolves to a memoized Supabase client, or null if the
// project isn't configured yet (missing env vars / SDK failed to load).
function getV1Supabase() {
  if (_v1SupabasePromise) return _v1SupabasePromise;
  _v1SupabasePromise = (async () => {
    if (typeof supabase === 'undefined' || !supabase.createClient) {
      console.error('[v1-auth] Supabase SDK not loaded');
      return null;
    }
    let cfg;
    try {
      const res = await fetch('/api/public-config');
      cfg = await res.json();
    } catch (err) {
      console.error('[v1-auth] failed to load /api/public-config', err);
      return null;
    }
    if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
      console.error('[v1-auth] missing Supabase config (SUPABASE_URL / SUPABASE_ANON_KEY)');
      return null;
    }
    return supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  })();
  return _v1SupabasePromise;
}

// All helpers return { data, error } so the UI can show a friendly message.
// When the client can't be created we surface a synthetic error rather than throw.
const V1_NO_CLIENT_ERR = { message: 'Authentication is temporarily unavailable. Please try again later.' };

async function v1SignIn(email, password) {
  const client = await getV1Supabase();
  if (!client) return { data: null, error: V1_NO_CLIENT_ERR };
  return client.auth.signInWithPassword({ email, password });
}

async function v1SignUp(email, password) {
  const client = await getV1Supabase();
  if (!client) return { data: null, error: V1_NO_CLIENT_ERR };
  return client.auth.signUp({ email, password });
}

async function v1SignOut() {
  const client = await getV1Supabase();
  if (!client) return { error: V1_NO_CLIENT_ERR };
  return client.auth.signOut();
}

async function v1GetSession() {
  const client = await getV1Supabase();
  if (!client) return { data: { session: null }, error: V1_NO_CLIENT_ERR };
  return client.auth.getSession();
}

// Admin allowlist for client-side routing/UI only — the real gate lives on the
// server (api/_supabase-auth.js). Keep this in sync with DEFAULT_ADMIN_EMAILS.
const V1_ADMIN_EMAILS = ['carlos@deltpay.com'];
function v1IsAdminEmail(email) {
  return V1_ADMIN_EMAILS.includes(String(email || '').trim().toLowerCase());
}

// Bare access token for the current session, or null. Used to authenticate
// calls to our own /api/* endpoints (e.g. /api/application) which verify the
// token server-side via Supabase GoTrue.
async function v1GetAccessToken() {
  try {
    const { data } = await v1GetSession();
    return (data && data.session && data.session.access_token) || null;
  } catch (_) {
    return null;
  }
}
