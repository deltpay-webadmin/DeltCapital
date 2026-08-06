-- Delt Capital — Supabase schema for lead capture + apply-flow analytics.
--
-- Already applied to the DeltCapital Supabase project (jdsgipshgnwaxtbdernk)
-- via the Supabase API on 2026-05-21. This file is the source of truth in
-- case you ever need to re-apply it to a new project / restore / branch.
--
-- Run this in your Supabase project's SQL Editor (Dashboard →
-- SQL Editor → New query → paste → Run). Idempotent — safe to re-run.

-- ─── Leads: one row per calculator lead-gate submission ───
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  first_name    text,
  business_name text,
  email         text not null,
  phone         text,
  source        text,
  -- What the applicant TOLD us, via the calculator. Self-reported, unverified.
  estimate      jsonb,
  -- What their BANK told us: monthly deposit aggregates derived from Plaid
  -- transactions (see api/_bank-metrics.js). Verified, and preferred over
  -- `estimate` when pricing an offer.
  --
  -- Aggregates only. The Plaid access_token is deliberately NOT stored here
  -- or anywhere else in this database — it lives in the CRM's Plaid Data
  -- Vault, and this app holds only derived numbers.
  bank_metrics  jsonb,
  -- set by the /api/sms-nudge cron once we've sent the T+45min reminder
  nudged_at     timestamptz,
  -- set when apply-progress sees the 'submitted' event
  completed_at  timestamptz
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_open_idx       on public.leads (created_at)
  where completed_at is null;

-- ─── Apply progress: append-only event log keyed by lead_id ───
create table if not exists public.apply_progress (
  id         bigserial primary key,
  lead_id    uuid not null references public.leads(id) on delete cascade,
  event      text not null,
  created_at timestamptz not null default now(),
  meta       jsonb,
  -- Guard against typos. Update this list if you add a new milestone.
  constraint apply_progress_event_check
    check (event in ('modal_opened', 'plaid_connected', 'idv_done',
                     'offer_presented', 'offer_accepted', 'submitted'))
);

create index if not exists apply_progress_lead_idx
  on public.apply_progress (lead_id, created_at desc);

-- Re-applying over an existing database? The event CHECK above only takes
-- effect on a fresh create. Run this to widen it in place:
--
--   alter table public.apply_progress drop constraint apply_progress_event_check;
--   alter table public.apply_progress add constraint apply_progress_event_check
--     check (event in ('modal_opened','plaid_connected','idv_done',
--                      'offer_presented','offer_accepted','submitted'));

-- ─── Offers: what we actually quoted, and when it expires ───
--
-- Before this table existed the offer screen computed its own terms in the
-- browser (factor rate and term were hardcoded, the offer ID was
-- Math.random() regenerated on every render, and "Locked 72h" was static
-- text with no expiry behind it). Nothing was persisted, so there was no
-- record of what any applicant was shown.
--
-- Pricing now happens server-side in api/_offer-terms.js and lands here.
create table if not exists public.offers (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid not null references public.leads(id) on delete cascade,
  -- Human-readable reference shown to the applicant, e.g. DLT-2026-418223.
  offer_code      text not null unique,
  advance_amount  numeric(12,2) not null,
  factor_rate     numeric(6,4)  not null,
  term_months     int           not null,
  total_repayment numeric(12,2) not null,
  weekly_debit    numeric(12,2) not null,
  -- Pricing/agreement version this quote was generated under.
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
-- Supports the idempotency lookup in /api/offer-create ("does this lead
-- already have a live quote?").
create index if not exists offers_open_idx on public.offers (lead_id, expires_at)
  where status = 'presented';

-- ─── Offer acceptances: the signature record ───
--
-- Append-only and never updated. `contract_snapshot` freezes every term
-- exactly as displayed at the moment of signing — do NOT reconstruct terms
-- by joining back to offers, which can be re-priced or superseded. This
-- row is the evidence of what the applicant agreed to.
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

-- ─── Row-level security ───
-- We only ever talk to these tables from server-side code using the
-- service role key (which bypasses RLS by design). Enabling RLS with no
-- policies means anyone with the public anon key cannot read or write —
-- defense in depth in case the anon key leaks into client code.
alter table public.leads             enable row level security;
alter table public.apply_progress    enable row level security;
alter table public.offers            enable row level security;
alter table public.offer_acceptances enable row level security;
