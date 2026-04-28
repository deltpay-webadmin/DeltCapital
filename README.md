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

## Vercel environment variables

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
