// POST /api/admin-approve
//   body: { leadId: uuid, status: 'pending' | 'approved' | 'denied' }
// Admin-only (verifySession cookie). Sets approval_status on the lead row
// so the customer portal flips state on the next /api/customer-status poll.

const { verifySession } = require('./_admin-auth');
const store = require('./_store');

const VALID = new Set(['pending', 'approved', 'denied']);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }

  const session = verifySession(req.headers.cookie);
  if (!session) { res.status(401).json({ error: 'unauthorized' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  body = body || {};
  const leadId = String(body.leadId || '').trim();
  const status = String(body.status || '').trim().toLowerCase();
  if (!leadId) { res.status(400).json({ error: 'missing_leadId' }); return; }
  if (!VALID.has(status)) { res.status(400).json({ error: 'invalid_status' }); return; }

  if (!store.ENABLED) {
    res.status(503).json({ error: 'store_unavailable' });
    return;
  }

  try {
    const updated = await store.setApprovalStatus(leadId, status, session.email);
    if (!updated) { res.status(404).json({ error: 'not_found' }); return; }
    res.status(200).json({
      ok: true,
      leadId: updated.id,
      status: updated.approval_status,
      decidedAt: updated.approval_decided_at,
      decidedBy: updated.approval_decided_by,
    });
  } catch (err) {
    console.error('[admin-approve] failed:', err && err.message);
    res.status(500).json({ error: 'server_error', detail: String(err && err.message) });
  }
};
