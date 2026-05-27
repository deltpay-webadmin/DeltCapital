# Delt-Capital

Delt Capital homepage — static prototype.

V1 Ledger flow — editorial, oversized type. Full marketing site: hero, live calculator, how-it-works, reviews, about, booking, support, FAQ, blog, apply modal.

## Running locally

No build step. Serve the directory with any static HTTP server:

```sh
python3 -m http.server 3000
# or
npx serve .
```

Then open `http://localhost:3000`.

## Deploying

Zero-config Vercel static deploy — `index.html` is the entry, `app/*.jsx` load in-browser via `@babel/standalone`.

## Layout

- `index.html` — entry, loads React/ReactDOM/Babel from CDN and mounts `<Variation1 />`
- `app/shared.jsx` — shared tokens, primitives, `window.DELT`
- `app/app.jsx` — shared primitives (footer, etc.)
- `app/variation-1.jsx` — V1 Ledger router + chrome
- `app/variation-1-*.jsx` — V1 pages/sections (motion, sections, calculator, how-it-works, reviews, about, booking, support, FAQ, blog, apply)
- `app/assets/hero.mp4` — V1 hero loop

## Customer portal

After applying, customers can sign in at `/portal` (or via the "Login" link in
the header) to see their underwriting status.

Flow:
1. Customer enters their email on `/#login`. `app/variation-1-login.jsx` POSTs
   to `/api/customer-login`, which calls Supabase Auth's admin
   `generate_link` API to mint a magic-link URL, then emails it via Outlook.
2. Customer clicks the link → Supabase verifies → redirects to
   `${SITE_ORIGIN}/?portal=1#access_token=…&refresh_token=…&expires_at=…`.
3. The inline bootstrap script in `index.html` pulls those tokens out of the
   fragment, stores them in `localStorage` under `deltcap:sb:*` keys, and
   strips the fragment before React mounts.
4. `app/variation-1-portal.jsx` (V1PortalPage) reads the access token and
   calls `/api/customer-status` with `Authorization: Bearer …`. The server
   validates the JWT against Supabase's `/auth/v1/user` endpoint, looks up
   the lead by email, and returns `{ status, firstName, businessName,
   estimate, … }`. The page renders one of four states keyed off
   `approval_status`: `approved`, `pending`, `denied`, `no_application`.

Admins flip the verdict from `/admin/leads` — each row has Approve / Deny
buttons that POST to `/api/admin-approve` (gated by the existing admin
session cookie).

## Vercel environment variables

### Supabase — used by the customer portal + lead store

```
SUPABASE_URL                https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY   server-only admin key (Project Settings → API)
```

The portal magic-link flow also requires the Outlook env vars below — that's
how the actual email goes out. The schema is in `docs/SUPABASE_SCHEMA.sql`.

### Booking (Outlook / Microsoft Graph) — used by `api/book.js`, `api/availability.js`

```
OUTLOOK_TENANT_ID
OUTLOOK_CLIENT_ID
OUTLOOK_CLIENT_SECRET
OUTLOOK_FROM_EMAIL
BOOKING_NOTIFY_EMAIL    (optional, default david@deltpay.com)
BOOKING_TIMEZONE        (optional, default "Eastern Standard Time")
OUTLOOK_CALENDAR_USER   (optional)
OUTLOOK_TEAMS_HOST      (optional)
OUTLOOK_AVAILABILITY_USER (optional)
```

### Plaid sandbox — used by `api/plaid-*.js` and `app/variation-1-plaid.jsx`

```
PLAID_CLIENT_ID         from dashboard.plaid.com → Team Settings → Keys
PLAID_SECRET            sandbox secret (or production, matched to PLAID_ENV)
PLAID_ENV               sandbox | development | production   (default: sandbox)
PLAID_IDV_TEMPLATE_ID   Identity Verification template id
PLAID_PRODUCTS          comma list, e.g. auth,transactions   (default: auth,transactions)
PLAID_COUNTRY_CODES     comma list, e.g. US                  (default: US)
```

Sandbox test creds for Plaid Link bank flow: `user_good` / `pass_good` (any institution). For IDV in sandbox, follow the prompts on the mobile-optimized URL — Plaid accepts test images.

### Plaid troubleshooting

When the bank or IDV modal shows `Could not reach Plaid (CODE)`, the suffix is Plaid's `error_code`. Common ones:

| Code | Fix |
|------|-----|
| `INVALID_API_KEYS` | Re-paste `PLAID_CLIENT_ID` and `PLAID_SECRET` in Vercel — make sure no trailing whitespace landed. Confirm `PLAID_SECRET` was copied from the env (sandbox / development / production) that matches `PLAID_ENV`; Plaid issues a separate secret per env. |
| `INVALID_PRODUCT` / `PRODUCTS_NOT_SUPPORTED` | Narrow `PLAID_PRODUCTS` to products enabled on your Plaid account (sandbox has all by default; production accounts often start with just `auth`). |
| `INVALID_FIELD` | Your `PLAID_ENV` value doesn't match the secret's environment, or a bad value in `PLAID_COUNTRY_CODES`. |
| `INVALID_INPUT` on `/identity_verification/create` | `PLAID_IDV_TEMPLATE_ID` doesn't match a template in dashboard.plaid.com → Identity Verification → Templates (or the template is in a different env than your secret). |

Vercel function logs (Deployments → latest → Functions → `/api/plaid-*` → Logs) always have the full server-side stack with Plaid's `error_message`.
