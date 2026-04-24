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
