-- Delt Capital — Supabase schema for lead capture + apply-flow analytics.
--
-- IMPORTANT: Delt Capital now runs on the SHARED "Delt Pay Database"
-- Supabase project (ytemrmpnwmzqeradbeoa) — NOT its own project. The point
-- of sharing the project is a single platform-user identity (Supabase Auth,
-- `auth.users`) across Delt Pay and Delt Capital. Each product keeps its
-- own data isolated in its own schema and shares only through explicit
-- views.
--
--   • Delt Capital's tables live in the dedicated `delt_capital` schema.
--   • The app reaches them through views in `public` (PostgREST only
--     exposes `public`), which keep the exact table names the API code
--     already uses (`leads`, `apply_progress`).
--   • `public.platform_users` is the shared user directory both products
--     can read.
--
-- Applied to the Delt Pay Database project on 2026-06-18 via the Supabase
-- migration API (migration: delt_capital_schema_and_shared_views). This
-- file is the source of truth if you ever need to re-apply / restore.
--
-- Idempotent — safe to re-run in the SQL Editor.

create schema if not exists delt_capital;

-- ─── Leads: one row per calculator lead-gate submission ───
create table if not exists delt_capital.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  -- Shared platform user (Supabase Auth in this same DB). Links a Delt
  -- Capital lead to the same person in Delt Pay. Nullable: leads usually
  -- start anonymous and may never authenticate.
  user_id       uuid references auth.users(id) on delete set null,
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

create index if not exists leads_created_at_idx on delt_capital.leads (created_at desc);
create index if not exists leads_open_idx        on delt_capital.leads (created_at)
  where completed_at is null;
create index if not exists leads_user_id_idx      on delt_capital.leads (user_id);
create index if not exists leads_email_idx         on delt_capital.leads (lower(email));

-- ─── Apply progress: append-only event log keyed by lead_id ───
create table if not exists delt_capital.apply_progress (
  id         bigserial primary key,
  lead_id    uuid not null references delt_capital.leads(id) on delete cascade,
  event      text not null,
  created_at timestamptz not null default now(),
  meta       jsonb,
  -- Guard against typos. Update this list if you add a new milestone.
  constraint apply_progress_event_check
    check (event in ('modal_opened', 'plaid_connected', 'idv_done', 'submitted'))
);

create index if not exists apply_progress_lead_idx
  on delt_capital.apply_progress (lead_id, created_at desc);

-- ─── Row-level security ───
-- We only ever talk to these tables from server-side code using the
-- service role key (which bypasses RLS by design). RLS enabled with no
-- policies means anon/authenticated callers get nothing — defense in depth
-- in case the anon key ever reaches client code.
alter table delt_capital.leads          enable row level security;
alter table delt_capital.apply_progress enable row level security;

-- ─── Server-only privileges on the base tables ───
grant usage on schema delt_capital to service_role;
grant select, insert, update, delete on delt_capital.leads          to service_role;
grant select, insert, update, delete on delt_capital.apply_progress to service_role;
grant usage, select on sequence delt_capital.apply_progress_id_seq  to service_role;

-- ─── Public views the app + cron talk to ───
-- PostgREST only exposes `public`, so these views are how the API code
-- reaches the delt_capital tables. They keep the names the code already
-- uses. `security_invoker = true` keeps base-table RLS in force for
-- anon/authenticated; service_role bypasses RLS. Simple projections, so
-- they stay auto-updatable (INSERT/UPDATE/DELETE pass straight through).
create or replace view public.leads
  with (security_invoker = true) as
  select id, created_at, user_id, first_name, business_name, email, phone,
         source, estimate, nudged_at, completed_at
  from delt_capital.leads;

create or replace view public.apply_progress
  with (security_invoker = true) as
  select id, lead_id, event, created_at, meta
  from delt_capital.apply_progress;

revoke all on public.leads          from anon, authenticated;
revoke all on public.apply_progress from anon, authenticated;
grant select, insert, update, delete on public.leads          to service_role;
grant select, insert, update, delete on public.apply_progress to service_role;

-- ─── Shared platform-user directory (Delt Pay ↔ Delt Capital) ───
-- The shared "users" surface both products read. SECURITY DEFINER (default)
-- so it can read auth.users; locked to service_role only.
create or replace view public.platform_users as
  select u.id, u.email, u.phone, u.created_at, u.last_sign_in_at
  from auth.users u;
revoke all on public.platform_users from anon, authenticated;
grant select on public.platform_users to service_role;

-- Tell PostgREST to pick up the new objects immediately.
notify pgrst, 'reload schema';
