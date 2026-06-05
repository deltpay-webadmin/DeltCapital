// Vercel serverless function — per-account application status.
//
//   POST /api/application   — create (idempotent) the signed-in user's
//     application row so they can track approval. Body:
//       { offer: {amount,factor,term}, plaid: {...}, businessName, leadId, ref }
//     Status is set server-side to 'in_review'; the client cannot choose it.
//
//   GET  /api/application    — return the signed-in user's application, or 404.
//     Polled by the status tracker so an admin decision shows up in real time.
//
// Auth: the browser sends its Supabase access token as `Authorization: Bearer`.
// We resolve the user from that token (never from a client-sent id) and key the
// row on it. All DB access uses the service-role key (bypasses RLS), matching
// the existing server-side-only data pattern in api/_store.js.

const store = require('./_store');
const { getUserFromRequest } = require('./_supabase-auth');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Only surface the fields the client needs — never the raw row internals.
function publicShape(row) {
  if (!row) return null;
  return {
    status: row.status,
    ref: row.ref || null,
    offer: row.offer || null,
    business_name: row.business_name || null,
    email: row.email || null,
    created_at: row.created_at || null,
    decided_at: row.decided_at || null,
    decline_reason: row.decline_reason || null,
    // Admin-entered servicing data for the dashboard (null until filled).
    dashboard: row.dashboard || null,
  };
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  if (!store.ENABLED) { res.status(503).json({ error: 'store_unavailable' }); return; }

  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: 'unauthorized' }); return; }

  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const row = await store.getApplicationByUser(user.id);
      if (!row) { res.status(404).json({ error: 'not_found' }); return; }
      res.status(200).json({ application: publicShape(row) });
      return;
    }

    // POST — create (idempotent).
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
    body = body || {};

    const offer = (body.offer && typeof body.offer === 'object') ? body.offer : null;
    const plaid = (body.plaid && typeof body.plaid === 'object') ? body.plaid : null;
    const businessName = body.businessName ? String(body.businessName).slice(0, 200) : null;
    const ref = body.ref ? String(body.ref).slice(0, 64) : null;
    // lead_id is only stored when it looks like a uuid (the FK is nullable).
    const leadId = (typeof body.leadId === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.leadId))
      ? body.leadId : null;

    const row = await store.createApplication({
      userId: user.id,
      email: user.email,
      leadId, ref, businessName, offer, plaid,
    });
    res.status(200).json({ application: publicShape(row) });
  } catch (err) {
    console.error('[application] failed:', err && err.message);
    res.status(500).json({ error: 'server_error' });
  }
};
