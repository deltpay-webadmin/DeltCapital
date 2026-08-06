// Vercel serverless function — early lead capture from the apply modal.
//
// Fires when a user completes the Business step (step 1 of 5) of the
// funding application. That's the earliest moment we have contact info,
// and most drop-off happens after it — so this is what turns an
// abandoned application into a workable lead instead of nothing.
//
// The inserted row lands in the same `leads` table as calculator
// lead-gate submissions, which mirrors automatically into the Delt
// Backend CRM (leads → crm_leads → pipeline_leads, deduplicated at
// every hop). No CRM-specific code needed here.
//
// Best-effort by design: a failure returns { ok: false } and the modal
// carries on — lead capture must never block an applicant.
//
// Request shape:
//   POST /api/apply-lead
//   {
//     businessName, ein, legalForm, state,
//     firstName, lastName, email, phone,
//     existingLeadId   // set when the modal was opened from an email
//   }                  // deep link or calculator gate — already captured
//
// Response: { ok: true, leadId } — leadId is the existing one when
// provided, else the freshly created row's id. The modal uses it to key
// /api/apply-progress beacons for organic visitors.

const store = require('./_store');
const { cleanName } = require('./_name');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'method_not_allowed' }); return; }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const existingLeadId = String(body.existingLeadId || '').trim();
  if (existingLeadId) {
    // Lead already exists (calculator gate or email deep link created it,
    // and the CRM mirror has already fired). Nothing to insert.
    res.status(200).json({ ok: true, leadId: existingLeadId });
    return;
  }

  const email = String(body.email || '').trim();
  if (!email) { res.status(400).json({ error: 'email_required' }); return; }

  // The `leads` table has no last_name column (see docs/SUPABASE_SCHEMA.sql),
  // so both halves are joined into first_name here. That's deliberate, not
  // an accident — but it means junk in either field ends up in the one
  // value every lead-facing email greets people by. cleanName drops the
  // literal "null"/"undefined"/"N/A" tokens that browser autofill and
  // half-finished forms push through, so "Null" + "Null" stores as NULL
  // rather than producing "Hey Null Null,". See api/_name.js.
  const firstName = cleanName(body.firstName);
  const lastName  = cleanName(body.lastName);
  const fullName  = [firstName, lastName].filter(Boolean).join(' ');

  try {
    const row = await store.createLead({
      firstName: fullName || null,
      businessName: String(body.businessName || '').trim() || null,
      email,
      phone: String(body.phone || '').trim() || null,
      source: 'apply_form',
      // Extra Business-step fields ride along in the jsonb column; the
      // CRM mirror keeps the full row in crm_leads.raw.
      estimate: {
        ein: String(body.ein || '').trim() || null,
        legalForm: String(body.legalForm || '').trim() || null,
        state: String(body.state || '').trim() || null,
        capturedAt: 'apply_step_business',
      },
    });
    res.status(200).json({ ok: true, leadId: (row && row.id) || null });
  } catch (err) {
    console.error('[apply-lead] insert failed:', err.message || err);
    res.status(200).json({ ok: false, leadId: null });
  }
};
