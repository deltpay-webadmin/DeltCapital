// POST /api/plaid-link-event
//   body: { event: 'opened' | 'exit' | 'error', linkSessionId?, errorCode?,
//           institution?, email? }
//   → { ok: true } (always — telemetry must never break the applicant flow)
//
// Forwards Plaid Link funnel events from the apply flow to the Delt Backend
// edge function, which records them in the CRM's plaid_link_events ledger.
// Uses the same forward wiring (service-role JWT to pass platform checks,
// x-apply-secret as the real gate) as api/plaid-exchange-token.js. When the
// wiring is unconfigured this is a silent no-op.

const { requireMethod, readJsonBody } = require('./_plaid');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const APPLY_SECRET = (process.env.APPLY_EXCHANGE_SECRET || '').trim();

const ALLOWED = new Set(['opened', 'exit', 'error']);

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const body = readJsonBody(req);
  const event = typeof body.event === 'string' ? body.event : '';
  if (!ALLOWED.has(event)) {
    res.status(400).json({ error: 'event must be one of: opened | exit | error' });
    return;
  }

  if (SUPABASE_URL && SUPABASE_KEY && APPLY_SECRET) {
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/make-server-940653c6/apply/plaid-link-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'x-apply-secret': APPLY_SECRET,
        },
        body: JSON.stringify({
          event,
          linkSessionId: typeof body.linkSessionId === 'string' ? body.linkSessionId : undefined,
          errorCode: typeof body.errorCode === 'string' ? body.errorCode : undefined,
          institution: typeof body.institution === 'string' ? body.institution : undefined,
          email: typeof body.email === 'string' ? body.email : undefined,
        }),
      });
    } catch (err) {
      console.warn('plaid-link-event forward failed:', err && err.message);
    }
  }

  res.status(200).json({ ok: true });
};
