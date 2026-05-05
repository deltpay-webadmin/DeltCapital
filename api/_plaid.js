// Shared Plaid helper. Underscore prefix keeps Vercel from exposing this
// file as an HTTP endpoint — it's importable from sibling api/ functions.
//
// Mirrors the hand-rolled fetch pattern in api/book.js (no `plaid` npm
// dependency — we POST JSON to https://{env}.plaid.com directly).
//
// Required Vercel env vars:
//   PLAID_CLIENT_ID         — from dashboard.plaid.com → Team Settings → Keys
//   PLAID_SECRET            — sandbox secret (or production, matched to PLAID_ENV)
//   PLAID_ENV               — sandbox | development | production  (default: sandbox)
// Used by specific endpoints:
//   PLAID_IDV_TEMPLATE_ID   — Identity Verification template id (api/plaid-create-idv)
//   PLAID_PRODUCTS          — comma-separated, e.g. "auth,transactions"
//                             (api/plaid-create-link-token, productKind=bank)
//   PLAID_COUNTRY_CODES     — comma-separated, e.g. "US"  (default: "US")

const PLAID_HOSTS = {
  sandbox: 'https://sandbox.plaid.com',
  development: 'https://development.plaid.com',
  production: 'https://production.plaid.com',
};

const PLAID_ENV = (process.env.PLAID_ENV || 'sandbox').trim().toLowerCase();
// Fail loudly on a misconfigured PLAID_ENV. Falling back to sandbox silently
// hides a real configuration bug — and pasting a secret here (a real,
// observed mistake) used to silently route a production secret to the
// sandbox host, which Plaid rejects as INVALID_API_KEYS with no clue why.
if (!Object.prototype.hasOwnProperty.call(PLAID_HOSTS, PLAID_ENV)) {
  throw new Error(
    `PLAID_ENV must be one of: sandbox | development | production. ` +
    `Got ${PLAID_ENV.length} chars; expected the literal env name, not a secret.`
  );
}
const PLAID_BASE = PLAID_HOSTS[PLAID_ENV];

function plaidCountryCodes() {
  return (process.env.PLAID_COUNTRY_CODES || 'US')
    .split(',').map((s) => s.trim()).filter(Boolean);
}

function plaidProducts() {
  return (process.env.PLAID_PRODUCTS || 'auth,transactions')
    .split(',').map((s) => s.trim()).filter(Boolean);
}

// POST JSON to a Plaid REST path with client_id + secret injected from env.
// Throws an Error with Plaid's error_code/error_message when present, so
// handlers can surface a useful message rather than a generic 500.
async function plaidFetch(path, body) {
  // Defensive .trim() — pasting a secret into the Vercel UI sometimes brings
  // along a trailing newline, which Plaid then rejects as INVALID_API_KEYS
  // with no UI feedback indicating the cause.
  const clientId = (process.env.PLAID_CLIENT_ID || '').trim();
  const secret = (process.env.PLAID_SECRET || '').trim();
  if (!clientId || !secret) {
    throw new Error('Missing PLAID_CLIENT_ID / PLAID_SECRET');
  }
  const url = `${PLAID_BASE}${path}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, secret, ...body }),
  });
  const text = await r.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; }
  catch (_) { throw new Error(`Plaid ${path} returned non-JSON (${r.status}): ${text.slice(0, 300)}`); }
  if (!r.ok || data.error_code) {
    const code = data.error_code || `HTTP_${r.status}`;
    const msg = data.error_message || data.display_message || text.slice(0, 300);
    // INVALID_API_KEYS almost always means PLAID_ENV doesn't match the
    // secret. Surface the env + credential lengths (not values) in the log
    // so the operator can spot the mismatch in Vercel logs.
    if (code === 'INVALID_API_KEYS') {
      console.error(
        `Plaid INVALID_API_KEYS at ${path} — env=${PLAID_ENV}, ` +
        `clientId.length=${clientId.length}, secret.length=${secret.length}. ` +
        `Verify PLAID_SECRET is the ${PLAID_ENV} secret (Plaid issues one per env).`
      );
    }
    const err = new Error(`Plaid ${path} failed: ${code} — ${msg}`);
    err.plaidErrorCode = code;
    err.plaidErrorType = data.error_type;
    err.status = r.status;
    throw err;
  }
  return data;
}

// Tiny method guard mirroring the inline check in api/availability.js.
function requireMethod(req, res, method) {
  if (req.method !== method) {
    res.setHeader('Allow', method);
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  return true;
}

// Vercel parses JSON bodies for /api/* by default, but be tolerant of raw
// strings just in case (useful when curling without -H Content-Type).
function readJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return req.body;
}

module.exports = {
  PLAID_BASE,
  PLAID_ENV,
  plaidFetch,
  plaidCountryCodes,
  plaidProducts,
  requireMethod,
  readJsonBody,
};
