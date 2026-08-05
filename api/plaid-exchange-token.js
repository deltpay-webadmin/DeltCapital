// POST /api/plaid-exchange-token
//   body: { public_token: string, applicant?: { email, fullName, businessName, leadId } }
//   → { success: true, item_id, institution_name, accounts: [{ name, mask, subtype }], persisted }
//
// Exchanges a Link public_token for an access_token. Two paths:
//
// 1. PERSISTING (preferred): when APPLY_EXCHANGE_SECRET is set and the
//    frontend supplied the applicant's email, the exchange is forwarded to
//    the Delt Backend edge function
//    (${SUPABASE_URL}/functions/v1/make-server-940653c6/apply/plaid-exchange),
//    which exchanges the token with the same Plaid credentials, stores the
//    item + access_token in the CRM's Plaid Data Vault (matched to the
//    pipeline lead by email, creating one if needed) and runs a full data
//    sync — so underwriting sees the connection immediately.
//    NOTE: the public_token is env-bound. If this site's PLAID_ENV differs
//    from the edge functions' PLAID_ENV, the forward fails with
//    INVALID_PUBLIC_TOKEN (token not consumed) and we fall back to path 2.
//
// 2. LOCAL (fallback / legacy): exchange here and immediately fetch account
//    metadata for the friendly summary. The access_token is discarded —
//    nothing persists. This keeps the applicant flow working even when the
//    vault wiring is unconfigured or down.

const { plaidFetch, requireMethod, readJsonBody } = require('./_plaid');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
// Any valid project JWT passes Supabase's platform verification; the edge
// function's real gate is the x-apply-secret header. Reuse the key the
// api/ functions already hold rather than introducing another env var.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const APPLY_SECRET = (process.env.APPLY_EXCHANGE_SECRET || '').trim();

function canForward(applicant) {
  return Boolean(
    SUPABASE_URL && SUPABASE_KEY && APPLY_SECRET &&
    applicant && typeof applicant.email === 'string' && applicant.email.includes('@')
  );
}

async function forwardToVault(publicToken, applicant) {
  const url = `${SUPABASE_URL}/functions/v1/make-server-940653c6/apply/plaid-exchange`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'x-apply-secret': APPLY_SECRET,
    },
    body: JSON.stringify({
      public_token: publicToken,
      applicant: {
        email: applicant.email,
        fullName: applicant.fullName || undefined,
        businessName: applicant.businessName || undefined,
        leadId: applicant.leadId || undefined,
      },
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.ok) {
    const err = new Error(data.error || `apply-exchange forward failed (${r.status})`);
    err.plaidErrorCode = data.plaid_error_code || null;
    throw err;
  }
  return data; // { item_id, institution_name, accounts, lead_id }
}

async function localExchange(publicToken) {
  const exchange = await plaidFetch('/item/public_token/exchange', { public_token: publicToken });
  const accessToken = exchange.access_token;
  const itemId = exchange.item_id;

  const accountsResp = await plaidFetch('/accounts/get', { access_token: accessToken });
  const accounts = (accountsResp.accounts || []).map((a) => ({
    name: a.name || a.official_name || 'Account',
    mask: a.mask || '',
    subtype: a.subtype || a.type || '',
  }));

  let institutionName = '';
  const institutionId = accountsResp.item && accountsResp.item.institution_id;
  if (institutionId) {
    try {
      const inst = await plaidFetch('/institutions/get_by_id', {
        institution_id: institutionId,
        country_codes: ['US'],
      });
      institutionName = (inst.institution && inst.institution.name) || '';
    } catch (e) {
      // Non-fatal — fall back to the empty string and let the UI still render.
      console.warn('institutions/get_by_id failed:', e.plaidErrorCode || e.message);
    }
  }

  return { item_id: itemId, institution_name: institutionName, accounts };
}

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const body = readJsonBody(req);
  const { public_token, applicant } = body;
  if (!public_token || typeof public_token !== 'string') {
    res.status(400).json({ error: 'public_token is required' });
    return;
  }

  // Path 1 — persist into the CRM vault via the Delt Backend edge function.
  if (canForward(applicant)) {
    try {
      const data = await forwardToVault(public_token, applicant);
      res.status(200).json({
        success: true,
        item_id: data.item_id,
        institution_name: data.institution_name || '',
        accounts: data.accounts || [],
        persisted: true,
      });
      return;
    } catch (err) {
      // Usual failures (bad secret, env mismatch, network) happen before the
      // token is consumed, so the local fallback still works. If the edge
      // function exchanged the token but died mid-store (rare), the fallback
      // fails with INVALID_PUBLIC_TOKEN and the applicant just retries Link.
      console.warn(
        'apply-exchange forward failed — falling back to local (non-persisting) exchange:',
        err.plaidErrorCode || '', err.message
      );
    }
  }

  // Path 2 — legacy local exchange (nothing persists).
  try {
    const data = await localExchange(public_token);
    res.status(200).json({ success: true, ...data, persisted: false });
  } catch (err) {
    console.error('plaid-exchange-token error:', err && err.stack ? err.stack : err);
    res.status(err.status || 500).json({
      error: 'Could not exchange Plaid token',
      code: err.plaidErrorCode || null,
    });
  }
};
