// Supabase Auth helper for the customer portal.
// Underscore prefix keeps Vercel from exposing this as an HTTP endpoint.
//
// Why this exists:
//   The customer portal (V1PortalPage) is gated by Supabase Auth's magic-link
//   flow, but we send the email ourselves through Outlook (api/_email.js) so
//   the message is on-brand and goes through the same mailbox as every other
//   transactional email. To do that we:
//     1. Generate the magic-link URL via Supabase's `/auth/v1/admin/generate_link`
//        admin API (requires SUPABASE_SERVICE_ROLE_KEY). This returns the
//        action_link the customer clicks — Supabase doesn't send anything.
//     2. Drop that URL into our own branded email and send via Outlook.
//     3. When the customer clicks, Supabase verifies and redirects to our
//        origin with #access_token=… in the fragment. The Variation1 router
//        picks that up, stores tokens in localStorage, and navigates to
//        /#portal.
//
// Server-side JWT validation:
//   `verifyAccessToken` calls Supabase's `/auth/v1/user` with the JWT as a
//   Bearer header. Supabase does the signature + expiry check for us and
//   returns the user object (id, email, …). This avoids a JWT library and
//   keeps the trust boundary at Supabase.
//
// Required env vars:
//   SUPABASE_URL                — https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   — admin key (server-only, never expose to client)

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const ENABLED = !!(SUPABASE_URL && SUPABASE_KEY);

function headers() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
}

// Look up an auth.users row by email. Returns null if not found.
// We need this because generate_link with type=magiclink requires the user
// to already exist — if it doesn't, we create one with type=signup instead.
async function findUserByEmail(email) {
  if (!ENABLED) return null;
  const e = String(email || '').trim().toLowerCase();
  if (!e) return null;
  // Admin list-users endpoint supports a `filter` query that does a substring
  // match on the email column.
  const url = `${SUPABASE_URL}/auth/v1/admin/users?filter=${encodeURIComponent(e)}`;
  const r = await fetch(url, { headers: headers() });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`supabase admin list-users ${r.status}: ${text.slice(0, 200)}`);
  }
  const data = await r.json().catch(() => null);
  if (!data || !Array.isArray(data.users)) return null;
  // Filter is substring — confirm exact (lowercased) match.
  return data.users.find((u) => String(u.email || '').toLowerCase() === e) || null;
}

// Generate a magic-link URL for `email`. If the user doesn't exist yet, we
// use type=signup so Supabase creates the auth.users row as part of the flow.
// The returned link points at {SUPABASE_URL}/auth/v1/verify?token=…; clicking
// it lands on `redirectTo` with #access_token=… in the fragment.
async function generateMagicLink({ email, redirectTo }) {
  if (!ENABLED) {
    throw new Error('Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)');
  }
  const e = String(email || '').trim().toLowerCase();
  if (!e) throw new Error('email required');

  let type = 'magiclink';
  const existing = await findUserByEmail(e);
  if (!existing) type = 'signup';

  const body = {
    type,
    email: e,
    options: { redirect_to: redirectTo },
  };
  const r = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`supabase generate_link ${r.status}: ${text.slice(0, 300)}`);
  }
  const data = await r.json().catch(() => null);
  // Newer GoTrue returns { action_link, … } at the top level; older versions
  // nest it under `properties`. Handle both.
  const link = (data && (data.action_link || (data.properties && data.properties.action_link))) || null;
  if (!link) throw new Error('supabase generate_link: missing action_link in response');
  return link;
}

// Validate a JWT issued by Supabase Auth. Returns { id, email } on success,
// null on any failure (expired, malformed, signature mismatch). We delegate
// the actual crypto to Supabase via the /auth/v1/user endpoint — cheaper
// than pulling in a JWT lib and matches the rest of this codebase's
// "REST calls, no SDKs" pattern.
async function verifyAccessToken(jwt) {
  if (!ENABLED || !jwt || typeof jwt !== 'string') return null;
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!r.ok) return null;
    const u = await r.json().catch(() => null);
    if (!u || !u.id || !u.email) return null;
    return { id: u.id, email: String(u.email).toLowerCase() };
  } catch (_) {
    return null;
  }
}

// Parse the Authorization header from a request and verify the bearer token.
async function verifyRequest(req) {
  const h = req.headers && (req.headers.authorization || req.headers.Authorization);
  if (!h || typeof h !== 'string') return null;
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  if (!m) return null;
  return verifyAccessToken(m[1]);
}

module.exports = {
  ENABLED,
  generateMagicLink,
  verifyAccessToken,
  verifyRequest,
};
