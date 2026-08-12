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
      first_name: firstName || null,
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

// Find leads that submitted N+ minutes ago but never reached the
// 'plaid_connected' milestone and haven't been nudged yet. Used by the
// /api/sms-nudge cron.
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
  return Array.isArray(rows) ? rows : [];
}

// Find leads for the email lifecycle cron (api/email-lifecycle.js):
// never submitted, have an email, created 24h–14d ago, and behind on the
// email sequence (email_nudge_count 0 → DC-3 at 24h, 1 → DC-4 at 72h).
// Selection is deliberately independent of the 45-min SMS nudge — both
// sequences can touch the same lead on different clocks.
async function findEmailLifecycleLeads() {
  if (!ENABLED) return [];
  const dayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
  const path = `/leads?` + [
    `created_at=lte.${dayAgo}`,
    `created_at=gte.${twoWeeksAgo}`,
    `completed_at=is.null`,
    `email=not.is.null`,
    `email_nudge_count=lt.2`,
    `select=*`,
    `order=created_at.asc`,
    `limit=50`,
  ].join('&');
  const rows = await pgFetch(path, { method: 'GET' });
  return Array.isArray(rows) ? rows : [];
}

async function markEmailNudged(leadId, count) {
  if (!ENABLED || !leadId) return;
  await pgFetch(`/leads?id=eq.${encodeURIComponent(leadId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ email_nudge_count: count, email_nudged_at: new Date().toISOString() }),
  });
}

async function markReviewEmailed(leadId) {
  if (!ENABLED || !leadId) return;
  await pgFetch(`/leads?id=eq.${encodeURIComponent(leadId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ review_emailed_at: new Date().toISOString() }),
  });
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
  // Fetch the latest event per lead in a single round trip. We grab all
  // events for these leads and reduce client-side; for a small admin
  // dashboard this is cheaper than a PG function.
  const ids = rows.map((r) => r.id);
  const inList = ids.map((i) => `"${i}"`).join(',');
  const events = await pgFetch(
    `/apply_progress?lead_id=in.(${inList})&select=lead_id,event,created_at&order=created_at.desc&limit=1000`,
    { method: 'GET' }
  );
  const latestByLead = new Map();
  (events || []).forEach((e) => {
    if (!latestByLead.has(e.lead_id)) latestByLead.set(e.lead_id, e);
  });
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
  'submitted',
]);

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

module.exports = {
  ENABLED,
  createLead,
  getLead,
  getLeadByPrefix,
  findStaleLeads,
  findEmailLifecycleLeads,
  markEmailNudged,
  markReviewEmailed,
  markNudged,
  markCompleted,
  listLeads,
  recordEvent,
  VALID_EVENTS,
};
