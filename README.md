# Delt-Capital

Delt Capital homepage redesign — static prototype.

The site renders a design canvas with four homepage directions (editorial, institutional, split/dark, terminal) plus the full V1 flow (hero, live calculator, how-it-works, reviews, about, booking, support, FAQ, blog, apply modal).

## Running locally

No build step. Serve the directory with any static HTTP server:

```sh
python3 -m http.server 3000
# or
npx serve .
```

Then open `http://localhost:3000`.

## Deploying

Zero-config Vercel static deploy — `index.html` is the entry, `design-canvas.jsx` and `app/*.jsx` load in-browser via `@babel/standalone`.

## Layout

- `index.html` — entry, loads React/ReactDOM/Babel from CDN and mounts the canvas
- `design-canvas.jsx` — artboard frame + canvas shell
- `app/shared.jsx` — shared tokens, primitives, `window.DELT`
- `app/app.jsx` — shared homepage primitives (nav, hero, etc.)
- `app/variation-1*.jsx` — V1 (Ledger) full flow, split by section
- `app/variation-2.jsx`, `variation-3.jsx`, `variation-4.jsx` — alt directions
- `app/assets/hero.mp4` — V1 hero loop
