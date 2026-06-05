// Vercel serverless function — admin application management (Supabase-login gated).
//
//   GET  /api/admin-applications
//     → { applications: [ ...full rows... ] } newest first. Optional ?status=in_review.
//
//   POST /api/admin-applications
//     body { id, decision?: { status, reason }, dashboard?: { ...servicing fields... } }
//     → { application: <updated row> }
//
// Auth: the admin's Supabase access token (Authorization: Bearer). The caller's
// email must be in the admin allowlist (api/_supabase-auth.js). All DB access
// uses the service-role key (bypasses RLS), so admins read/write any row while
// regular users never can.

const store = require('./_store');
const { getAdminFromRequest } = require('./_supabase-auth');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Admins see the operational fields, including the stored dashboard data so the
// editor can prefill. (No secrets live on these rows.)
function adminShape(row) {
  if (!row) return null;
  return {
    id: row.id,
    user_id: row.user_id,
    email: row.email || null,
    business_name: row.business_name || null,
    ref: row.ref || null,
    status: row.status,
    offer: row.offer || null,
    plaid: row.plaid || null,
    dashboard: row.dashboard || null,
    created_at: row.created_at || null,
    decided_at: row.decided_at || null,
    decline_reason: row.decline_reason || null,
  };
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET' && req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }
  if (!store.ENABLED) { res.status(503).json({ error: 'store_unavailable' }); return; }

  const admin = await getAdminFromRequest(req);
  if (!admin) { res.status(403).json({ error: 'forbidden' }); return; }

  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const status = (req.query && req.query.status) || undefined;
      const rows = await store.listApplications({ status });
      res.status(200).json({ applications: rows.map(adminShape) });
      return;
    }

    // POST — update decision and/or dashboard data for one application.
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
    body = body || {};

    const id = String(body.id || '').trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      res.status(400).json({ error: 'invalid_id' });
      return;
    }
    const existing = await store.getApplicationById(id);
    if (!existing) { res.status(404).json({ error: 'not_found' }); return; }

    const patch = {};

    if (body.decision && typeof body.decision === 'object') {
      const status = String(body.decision.status || '').trim();
      if (!store.VALID_APP_STATUS.has(status)) {
        res.status(400).json({ error: 'invalid_status', accepted: [...store.VALID_APP_STATUS] });
        return;
      }
      patch.status = status;
      patch.decline_reason = status === 'denied' ? (String(body.decision.reason || '').slice(0, 500) || null) : null;
      patch.decided_at = (status === 'approved' || status === 'denied') ? new Date().toISOString() : null;
    }

    if (body.dashboard && typeof body.dashboard === 'object' && !Array.isArray(body.dashboard)) {
      // Stored verbatim as JSONB. The client owns the shape (mirrors the
      // dashboard fields); we don't need to validate every key.
      patch.dashboard = body.dashboard;
    }

    if (!Object.keys(patch).length) { res.status(400).json({ error: 'nothing_to_update' }); return; }

    const updated = await store.updateApplicationById(id, patch);
    res.status(200).json({ application: adminShape(updated) });
  } catch (err) {
    console.error('[admin-applications] failed:', err && err.message);
    res.status(500).json({ error: 'server_error' });
  }
};
