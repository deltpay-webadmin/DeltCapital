// Shared Supabase store. Underscore prefix keeps Vercel from exposing this
// file as an HTTP endpoint — it's importable from sibling api/ functions.
//
// Two tables back this module:
//   leads             — one row per calculator lead-gate submission
//   apply_progress    — append-only event log keyed by lead_id
//
// Schema (run once in Supabase SQL editor — see /docs/SUPABASE_SCHEMA.sql
// in this repo for the exact DDL):
//
//   create table leads (
//     id            uuid primary key default gen_random_uuid(),
//     created_at    timestamptz not null default now(),
//     first_name    text,
//     business_name text,
//     email         text not null,
//     phone         text,
//     source        text,
//     estimate      jsonb,
//     nudged_at     timestamptz,        -- set by api/sms-nudge cron
//     completed_at  timestamptz         -- set when apply-progress sees 'submitted'
//   );
//   create index on leads (created_at);
//   create index on leads (completed_at) where completed_at is null;
//
//   create table apply_progress (
//     id         bigserial primary key,
//     lead_id    uuid not null references leads(id) on delete cascade,
//     event      text not null,        -- modal_opened | plaid_connected | idv_done | submitted
//     created_at timestamptz not null default now(),
//     meta       jsonb
//   );
//   create index on apply_progress (lead_id, created_at desc);
//
// Required env vars:
//   SUPABASE_URL                  — https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY     — service role key (server-only, NEVER expose to client)
//
// We use the REST endpoint directly (PostgREST) instead of @supabase/supabase-js
// to keep the dependency footprint at zero and match the existing pattern in
// api/_plaid.js (hand-rolled fetch, no SDK).

const { cleanName } = require('./_name');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Best-effort mode: when Supabase isn't configured we no-op all writes and
// return empty reads. This keeps the lead-capture flow working even if the
// operator hasn't finished setting up the database yet — emails still fire,
// the deep link still works, we just don't persist for the admin/cron.
const ENABLED = !!(SUPABASE_URL && SUPABASE_KEY);

function headers(extra) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...(extra || {}),
  };
}

async function pgFetch(path, init) {
  if (!ENABLED) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: { ...headers(init && init.headers), ...((init && init.headers) || {}) },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    // Throw a structured error so callers can decide whether to fail or
    // swallow. /api/leads swallows (lead capture must never block), the
    // cron and admin endpoints propagate.
    const err = new Error(`Supabase ${res.status}: ${body.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  // Some calls (DELETE, PATCH with Prefer: return=minimal) return no body.
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch (_) { return text; }
}

// ─── Leads ───

async function createLead({ firstName, businessName, email, phone, source, estimate }) {
  if (!ENABLED) return null;
  const rows = await pgFetch('/leads', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify([{
      // Last line of defence for the name column. api/leads.js only checks
      // that firstName is truthy before inserting, so "null" sails through
      // its validation — catch it here so no writer can dirty the column.
      first_name: cleanName(firstName),
      business_name: businessName || null,
      email: email || '',
      phone: phone || null,
      source: source || null,
      estimate: estimate || null,
    }]),
  });
  return Array.isArray(rows) ? rows[0] : null;
}

async function getLead(leadId) {
  if (!ENABLED || !leadId) return null;
  const rows = await pgFetch(
    `/leads?id=eq.${encodeURIComponent(leadId)}&select=*`,
    { method: 'GET' }
  );
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

// Lookup by the first 8 characters of a lead's UUID. Used by the
// /api/r short-link redirector so SMS bodies stay under 160 chars.
// We require the prefix to be at least 6 hex chars to keep collisions
// effectively impossible (16^8 = ~4.3B possible 8-char prefixes vs.
// realistic lead volume of < 1M lifetime).
async function getLeadByPrefix(prefix) {
  if (!ENABLED) return null;
  const p = String(prefix || '').toLowerCase().replace(/[^a-f0-9]/g, '');
  if (p.length < 6) return null;
  // PostgREST `like` filter — case-insensitive via `ilike`. We anchor
  // with `*` (PostgREST wildcard) at the end so 'abc12345' matches
  // 'abc12345-...'.
  const path = `/leads?id=ilike.${encodeURIComponent(p + '*')}&select=*&limit=2`;
  const rows = await pgFetch(path, { method: 'GET' });
  if (!Array.isArray(rows) || rows.length === 0) return null;
  // If more than one row matches, be safe and return null — the operator
  // can lengthen the prefix. (Vanishingly unlikely at our scale.)
  if (rows.length > 1) return null;
  return rows[0];
}

// Latest apply_progress event per lead, in a single round trip.
//
// Shared by listLeads (the admin dashboard) and findStaleLeads (the nudge
// cron), which both need "where is this lead up to?" for a batch of ids.
// For a dataset this size that's cheaper than a PG function.
//
// `meta` is in the select because plaid_connected carries { institution }
// (see app/variation-1-apply.jsx fireBeacon) and the nudge copy names the
// bank the applicant actually linked.
//
// The limit=1000 is deliberately far above what either caller can need:
// findStaleLeads caps at 50 leads and there are only 4 milestone events,
// so 200 rows is the realistic worst case. Revisit if either cap moves.
async function latestEventsFor(leadIds) {
  const latest = new Map();
  if (!ENABLED || !Array.isArray(leadIds) || !leadIds.length) return latest;
  const inList = leadIds.map((i) => `"${i}"`).join(',');
  const events = await pgFetch(
    `/apply_progress?lead_id=in.(${inList})&select=lead_id,event,created_at,meta&order=created_at.desc&limit=1000`,
    { method: 'GET' }
  );
  (events || []).forEach((e) => {
    if (!latest.has(e.lead_id)) latest.set(e.lead_id, e);
  });
  return latest;
}

// Find leads that submitted N+ minutes ago but never reached the
// 'plaid_connected' milestone and haven't been nudged yet. Used by the
// /api/sms-nudge cron.
//
// Each returned row carries `latest_event` so the nudge can address the
// step the lead actually stopped on instead of sending everyone the same
// "pick up where you left off". If the progress lookup fails we return the
// leads anyway with latest_event: null — a generic nudge beats no nudge.
async function findStaleLeads({ minMinutes = 45, maxMinutes = 24 * 60 } = {}) {
  if (!ENABLED) return [];
  const cutoffMin = new Date(Date.now() - minMinutes * 60 * 1000).toISOString();
  const cutoffMax = new Date(Date.now() - maxMinutes * 60 * 1000).toISOString();
  // We want: created_at <= cutoffMin AND created_at >= cutoffMax AND
  //          nudged_at IS NULL AND completed_at IS NULL
  // PostgREST: gte/lte with logical AND via separate query params.
  const path = `/leads?` + [
    `created_at=lte.${cutoffMin}`,
    `created_at=gte.${cutoffMax}`,
    `nudged_at=is.null`,
    `completed_at=is.null`,
    `select=*`,
    `order=created_at.asc`,
    `limit=50`,
  ].join('&');
  const rows = await pgFetch(path, { method: 'GET' });
  if (!Array.isArray(rows) || !rows.length) return [];

  let latest = new Map();
  try {
    latest = await latestEventsFor(rows.map((r) => r.id));
  } catch (err) {
    console.error('[store] findStaleLeads progress lookup failed:', err && err.message);
  }
  return rows.map((r) => ({ ...r, latest_event: latest.get(r.id) || null }));
}

async function markNudged(leadId) {
  if (!ENABLED || !leadId) return;
  await pgFetch(`/leads?id=eq.${encodeURIComponent(leadId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ nudged_at: new Date().toISOString() }),
  });
}

async function markCompleted(leadId) {
  if (!ENABLED || !leadId) return;
  await pgFetch(`/leads?id=eq.${encodeURIComponent(leadId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ completed_at: new Date().toISOString() }),
  });
}

// Paginated lead list for /admin/leads. Returns most recent first with a
// rolled-up `latest_event` column joined from apply_progress.
async function listLeads({ limit = 100, offset = 0 } = {}) {
  if (!ENABLED) return [];
  const rows = await pgFetch(
    `/leads?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`,
    { method: 'GET' }
  );
  if (!Array.isArray(rows) || !rows.length) return [];
  const latestByLead = await latestEventsFor(rows.map((r) => r.id));
  return rows.map((r) => ({
    ...r,
    latest_event: latestByLead.get(r.id) || null,
  }));
}

// ─── Progress events ───

const VALID_EVENTS = new Set([
  'modal_opened',
  'plaid_connected',
  'idv_done',
  'offer_presented',
  'offer_accepted',
  'submitted',
]);

// How far through the application is this lead?
//
// Derived, not stored — the same ladder api/admin-leads.js statusFor()
// walks for the dashboard, expressed as a machine-readable stage so the
// nudge cron can branch its copy on it. Expects a row from findStaleLeads
// or listLeads (i.e. one carrying `latest_event`).
//
// Order matters: completed_at wins over everything, then the milestone.
function applyStage(lead) {
  if (!lead) return 'new';
  if (lead.completed_at) return 'submitted';
  const event = lead.latest_event && lead.latest_event.event;
  switch (event) {
    case 'submitted':       return 'submitted';
    case 'offer_accepted':  return 'submitted';
    case 'offer_presented': return 'offer_presented';
    case 'idv_done':        return 'idv_done';
    case 'plaid_connected': return 'bank_linked';
    case 'modal_opened':    return 'opened';
    default:                return 'new';
  }
}

async function recordEvent({ leadId, event, meta }) {
  if (!ENABLED || !leadId) return null;
  if (!VALID_EVENTS.has(event)) {
    throw new Error(`Unknown apply-progress event: ${event}`);
  }
  await pgFetch('/apply_progress', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify([{
      lead_id: leadId,
      event,
      meta: meta || null,
    }]),
  });
  // Side-effect: when the lead reaches the submitted milestone we mark the
  // lead row completed so cron stops considering them for nudges.
  if (event === 'submitted') {
    try { await markCompleted(leadId); } catch (_) { /* swallow */ }
  }
  return { ok: true };
}

// ─── Offers ───

// The lead's current live quote, if any: status 'presented' and not yet
// expired. /api/offer-create uses this to stay idempotent — a lead who
// reloads the offer screen must see the same offer_code and the same
// numbers, not a freshly minted quote each time.
async function findOpenOffer(leadId) {
  if (!ENABLED || !leadId) return null;
  const path = `/offers?` + [
    `lead_id=eq.${encodeURIComponent(leadId)}`,
    `status=eq.presented`,
    `expires_at=gt.${new Date().toISOString()}`,
    `select=*`,
    `order=created_at.desc`,
    `limit=1`,
  ].join('&');
  const rows = await pgFetch(path, { method: 'GET' });
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function getOfferByCode(offerCode) {
  if (!ENABLED || !offerCode) return null;
  const rows = await pgFetch(
    `/offers?offer_code=eq.${encodeURIComponent(offerCode)}&select=*&limit=1`,
    { method: 'GET' }
  );
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function createOffer(offer) {
  if (!ENABLED) return null;
  const rows = await pgFetch('/offers', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify([{
      lead_id:         offer.leadId,
      offer_code:      offer.offerCode,
      advance_amount:  offer.advanceAmount,
      factor_rate:     offer.factorRate,
      term_months:     offer.termMonths,
      total_repayment: offer.totalRepayment,
      weekly_debit:    offer.weeklyDebit,
      terms_version:   offer.termsVersion,
      status:          'presented',
      expires_at:      offer.expiresAt,
      meta:            offer.meta || null,
    }]),
  });
  return Array.isArray(rows) ? rows[0] : null;
}

// Flip an offer to accepted, but only from 'presented'. The status filter
// is the concurrency guard: two submits racing the same offer both PATCH,
// and whichever loses matches zero rows and gets null back, so we never
// record two acceptances for one offer.
async function markOfferAccepted(offerId) {
  if (!ENABLED || !offerId) return null;
  const rows = await pgFetch(
    `/offers?id=eq.${encodeURIComponent(offerId)}&status=eq.presented`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      }),
    }
  );
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

// The signature record. Append-only — never updated, never deleted.
async function recordAcceptance(acceptance) {
  if (!ENABLED) return null;
  const rows = await pgFetch('/offer_acceptances', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify([{
      offer_id:          acceptance.offerId,
      lead_id:           acceptance.leadId,
      typed_signature:   acceptance.typedSignature,
      signer_email:      acceptance.signerEmail,
      terms_version:     acceptance.termsVersion,
      ip:                acceptance.ip || null,
      user_agent:        acceptance.userAgent || null,
      contract_snapshot: acceptance.contractSnapshot,
    }]),
  });
  return Array.isArray(rows) ? rows[0] : null;
}

module.exports = {
  ENABLED,
  pgFetch,
  createLead,
  getLead,
  getLeadByPrefix,
  findStaleLeads,
  latestEventsFor,
  applyStage,
  markNudged,
  markCompleted,
  listLeads,
  recordEvent,
  findOpenOffer,
  getOfferByCode,
  createOffer,
  markOfferAccepted,
  recordAcceptance,
  VALID_EVENTS,
};
