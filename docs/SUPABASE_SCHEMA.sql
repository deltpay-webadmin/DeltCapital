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
  estimate      jsonb,
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
    check (event in ('modal_opened', 'plaid_connected', 'idv_done', 'submitted'))
);

create index if not exists apply_progress_lead_idx
  on public.apply_progress (lead_id, created_at desc);

-- ─── Applications: one row per account that opts into approval tracking ───
-- Created when an applicant finishes the apply flow and creates an account to
-- track their approval status. Keyed by the Supabase auth user id (one row per
-- user). Status starts at 'in_review'; the Approve/Deny transition is performed
-- later from the admin view (server-side, service role). The status tracker page
-- polls this row so an admin decision shows up "in real time".
create table if not exists public.applications (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  user_id        uuid not null,                 -- Supabase auth user id (the account)
  email          text,
  lead_id        uuid references public.leads(id) on delete set null,  -- when known
  ref            text,                          -- display ref e.g. DLT-2026-xxxxxx
  status         text not null default 'in_review'
                 check (status in ('applied','in_review','approved','denied')),
  business_name  text,
  offer          jsonb,                         -- { amount, factor, term }
  plaid          jsonb,                         -- { institution, accounts, idVerified }
  decided_at     timestamptz,
  decline_reason text
);

-- One application per account. createApplication upserts on this constraint.
create unique index if not exists applications_user_idx on public.applications (user_id);

-- ─── Row-level security ───
-- We only ever talk to these tables from server-side code using the
-- service role key (which bypasses RLS by design). Enabling RLS with no
-- policies means anyone with the public anon key cannot read or write —
-- defense in depth in case the anon key leaks into client code.
alter table public.leads          enable row level security;
alter table public.apply_progress enable row level security;
alter table public.applications   enable row level security;
