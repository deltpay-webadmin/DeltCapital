// GET /api/customer-status
//   header: Authorization: Bearer <supabase access_token>
// Returns the signed-in customer's portal payload — approval verdict plus
// enough lead context to render the page header. The bearer token is
// validated against Supabase's /auth/v1/user endpoint (see
// api/_supabase-auth.js#verifyAccessToken), which gives us back the trusted
// email. We then look up the most recent lead row for that email.
//
// Response shapes:
//   200 { ok: true, status: 'pending'|'approved'|'denied'|'no_application',
//         email, firstName, businessName, estimate, decidedAt, submittedAt }
//   401 { error: 'unauthorized' }   — missing / invalid / expired JWT

const { verifyRequest } = require('./_supabase-auth');
const store = require('./_store');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'method_not_allowed' }); return; }
  res.setHeader('Cache-Control', 'no-store');

  const user = await verifyRequest(req);
  if (!user) { res.status(401).json({ error: 'unauthorized' }); return; }

  let lead = null;
  if (store.ENABLED) {
    try {
      lead = await store.getLeadByEmail(user.email);
    } catch (err) {
      console.error('[customer-status] getLeadByEmail failed:', err && err.message);
      res.status(500).json({ error: 'store_unavailable' });
      return;
    }
  }

  if (!lead) {
    // Authenticated, but no lead exists for this email yet (e.g. signed in
    // before applying). Surface a soft state the portal can route on.
    res.status(200).json({
      ok: true,
      status: 'no_application',
      email: user.email,
    });
    return;
  }

  res.status(200).json({
    ok: true,
    status: lead.approval_status || 'pending',
    email: user.email,
    firstName: lead.first_name || '',
    businessName: lead.business_name || '',
    estimate: lead.estimate || null,
    decidedAt: lead.approval_decided_at || null,
    submittedAt: lead.completed_at || null,
    createdAt: lead.created_at || null,
  });
};
