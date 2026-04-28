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
