# Admin dashboard, cron nudge, and lead-flow analytics

This doc covers the second wave of changes: persistent lead storage in
Supabase, the apply-flow funnel beacons, the T+45min reactivation
nudge cron, and the magic-link gated `/admin/leads` console.

## What got built

| Endpoint / page          | Purpose |
|--------------------------|---------|
| `/admin`                 | Login form. Enter your email → magic link is mailed to you. |
| `/admin/leads`           | Server-rendered lead list with status, range, and one-click GV SMS. |
| `/api/admin-login`       | POST `{ email }`; emails a one-time link. |
| `/api/admin-callback`    | Verifies the link, sets a session cookie, redirects. |
| `/api/admin-logout`      | Clears the cookie. |
| `/api/apply-progress`    | Fire-and-forget beacon the apply modal pings on milestones. |
| `/api/sms-nudge`         | Cron-driven T+45min reactivation. Emails the lead and emails the operator with a ready-to-send SMS body. |

Cron runs every 15 minutes (`*/15 * * * *`). Quiet hours: 21:00–08:00
America/New_York and weekends are skipped.

## Required Vercel env vars

| Var | Where it comes from | Required for |
|-----|---------------------|--------------|
| `SUPABASE_URL`                 | **Delt Pay Database** project → Project Settings → Data API (`https://ytemrmpnwmzqeradbeoa.supabase.co`) | All lead persistence, admin, cron |
| `SUPABASE_SERVICE_ROLE_KEY`    | **Delt Pay Database** project → Project Settings → API Keys → service_role | Same |
| `OUTLOOK_TENANT_ID`            | Existing — already set for `/api/book` | Magic-link email, cron nudge |
| `OUTLOOK_CLIENT_ID`            | Existing                              | Same |
| `OUTLOOK_CLIENT_SECRET`        | Existing                              | Same |
| `OUTLOOK_FROM_EMAIL`           | Existing — your licensed mailbox      | Same |
| `ADMIN_ALLOWED_EMAILS`         | Comma-separated. e.g. `david@deltpay.com` | Admin login |
| `ADMIN_SESSION_SECRET`         | Any random 32+ char string (run `openssl rand -hex 32`) | Admin session cookies |
| `CRON_SECRET`                  | Random string. Optional but lets you manually trigger `/api/sms-nudge?token=...` for testing | Manual cron test |
| `PUBLIC_SITE_ORIGIN`           | e.g. `https://deltcapital.com`. Optional — falls back to Vercel's bare host. | Deep-link URL building |

## SMS workflow (the hybrid part)

1. Lead submits the calculator's lead-gate.
2. `/api/leads` creates a row in Supabase, builds the deep link with the
   row's `leadId`, sends the confirmation email.
3. If the lead doesn't reach `plaid_connected` within 45min:
   - The cron emails the lead a follow-up with the same deep link.
   - The cron emails **you** at `LEADS_NOTIFY_EMAIL` with a tap-to-text
     Google Voice link + a copy-ready SMS body.
4. You tap the GV link from your phone → paste body → send. ~5 seconds.

The cron marks `nudged_at` once, so you never get duplicate notes.
A lead that completes (`submitted` beacon fires) is marked
`completed_at` and removed from the cron's eligibility set.

## Schema

Delt Capital shares the **Delt Pay Database** Supabase project
(`ytemrmpnwmzqeradbeoa`) so that platform users (Supabase Auth,
`auth.users`) are shared with Delt Pay. Delt Capital's own tables live in a
dedicated `delt_capital` schema and are reached through views in `public`
(`leads`, `apply_progress`), with `public.platform_users` as the shared
cross-product user directory. The schema is already applied; SQL source of
truth lives at `docs/SUPABASE_SCHEMA.sql` if you ever need to re-apply.

## How to test

1. Submit the calculator's lead-gate on a deploy with all env vars set.
2. Open `/admin` → enter your email → click the link in your inbox.
3. You should see the lead at the top of the list with status
   "No reply" (no funnel events yet).
4. Click the deep link → status flips to "Opened app" within seconds.
5. Connect Plaid in the modal → status flips to "Bank linked".
6. Wait 45min (or manually hit `/api/sms-nudge?token=<CRON_SECRET>&force=1`)
   to fire the nudge.

## Generating ADMIN_SESSION_SECRET

```bash
openssl rand -hex 32
```

Or any 32+ character random string. Paste into Vercel env vars under
`ADMIN_SESSION_SECRET` for all three environments.
