-- Migration: real offers, acceptance records, and verified bank metrics
--
-- Apply this to an EXISTING DeltCapital Supabase project (jdsgipshgnwaxtbdernk).
-- docs/SUPABASE_SCHEMA.sql is the full from-scratch schema and already
-- includes everything below; this file is the incremental version for a
-- database that already has `leads` and `apply_progress`.
--
-- Run in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Idempotent — safe to re-run.
--
-- Why: the apply flow's offer screen priced advances in the browser from
-- hardcoded constants, minted its offer ID with Math.random() on every
-- render, and "accepted" offers with a bare setStep(4) — no signature, no
-- record, nothing persisted. These tables are where the real thing lives.
-- See api/_offer-terms.js, api/offer-create.js, api/offer-accept.js, and
-- api/_bank-metrics.js.

begin;

-- 1. Widen the apply_progress event vocabulary.
--    The CHECK in SUPABASE_SCHEMA.sql only applies on a fresh create, so an
--    existing database needs the constraint replaced. Without this,
--    /api/offer-create and /api/offer-accept fail to record milestones.
alter table public.apply_progress
  drop constraint if exists apply_progress_event_check;

alter table public.apply_progress
  add constraint apply_progress_event_check
  check (event in ('modal_opened', 'plaid_connected', 'idv_done',
                   'offer_presented', 'offer_accepted', 'submitted'));

-- 2. Verified bank deposit aggregates, used to price offers.
--    Aggregates only — the Plaid access_token is deliberately never stored
--    in this database. See api/_bank-metrics.js.
alter table public.leads
  add column if not exists bank_metrics jsonb;

-- 3. Offers — what we actually quoted, and when it expires.
create table if not exists public.offers (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid not null references public.leads(id) on delete cascade,
  offer_code      text not null unique,
  advance_amount  numeric(12,2) not null,
  factor_rate     numeric(6,4)  not null,
  term_months     int           not null,
  total_repayment numeric(12,2) not null,
  weekly_debit    numeric(12,2) not null,
  terms_version   text          not null,
  status          text not null default 'presented',
  expires_at      timestamptz   not null,
  created_at      timestamptz   not null default now(),
  accepted_at     timestamptz,
  meta            jsonb,
  constraint offers_status_check
    check (status in ('presented', 'accepted', 'expired', 'withdrawn'))
);

create index if not exists offers_lead_idx on public.offers (lead_id, created_at desc);
create index if not exists offers_open_idx on public.offers (lead_id, expires_at)
  where status = 'presented';

-- 4. Acceptances — the signature record. Append-only.
--    contract_snapshot freezes the terms as displayed at signing. Read that
--    for any question about what was agreed; never re-derive from `offers`,
--    which can be re-priced or superseded.
create table if not exists public.offer_acceptances (
  id                bigserial primary key,
  offer_id          uuid not null references public.offers(id),
  lead_id           uuid not null references public.leads(id),
  typed_signature   text not null,
  signer_email      text not null,
  terms_version     text not null,
  ip                text,
  user_agent        text,
  accepted_at       timestamptz not null default now(),
  contract_snapshot jsonb not null
);

create index if not exists offer_acceptances_offer_idx
  on public.offer_acceptances (offer_id);

-- 5. RLS on, no policies — same posture as leads/apply_progress. Everything
--    reaches these tables through the service role key, which bypasses RLS;
--    this makes the anon key useless against them if it ever leaks.
alter table public.offers            enable row level security;
alter table public.offer_acceptances enable row level security;

commit;

-- ─── Optional one-off cleanup, unrelated to offers ───
--
-- Existing lead rows may hold literal junk in first_name ("Null Null",
-- "undefined", "N/A") from browser autofill and half-finished forms. New
-- writes are sanitized by api/_name.js and the emails sanitize at render
-- time, so this is housekeeping rather than a fix — but it cleans up the
-- admin dashboard and the CRM mirror.
--
--   update public.leads set first_name = null
--   where first_name ~* '^\s*(null|undefined|n/?a|none)(\s+(null|undefined|n/?a|none))*\s*$';
