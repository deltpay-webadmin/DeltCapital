# DeltCapital Design Spec

A pre-redesign audit of the current DeltCapital site plus the target design language for the Atlassian-inspired refresh shipped on `claude/redesign-preview-atlassian`.

---

## 1. Current Design Audit

### 1.1 Tech & Styling Stack

- **Framework:** React 18 + TypeScript + Vite 6
- **Styling:** Tailwind 4 via `@tailwindcss/vite`, design tokens in `src/styles/colors.css`, global overrides in `src/styles/globals.css`, Tailwind entry at `src/index.css`
- **Component library:** 30+ Radix UI primitives under `src/components/ui/`
- **Animation:** Motion + Anime.js (both present)
- **Routing:** None — `src/App.tsx` is a 608-line state machine with 15+ overlay booleans

### 1.2 Current Color Palette

| Token | Hex | Where used |
|---|---|---|
| `--color-primary-blue` | `#1B17FF` | CTAs, progress bars |
| `--primary` (globals) | `#4945ff` | Actual buttons (diverges from the token file) |
| `--color-primary-navy` | `#041E42` | Headlines, navbar bg, footer bg |
| `--color-secondary-blue` | `#0052FF` | Links, secondary actions |
| `--color-accent-blue` | `#E6EDFF` | Hover states |
| `--color-gray-50` | `#ededf5` | Page background (pale lavender) |
| Text primary | `#041E42` | Body text |
| Text secondary | `#52606D` | Muted copy |
| Border default | `#E4E7EB` | Card borders |

**Observed issues**
- `colors.css` declares `--color-primary-blue: #1B17FF`, but `globals.css` ships `--primary: #4945ff` — two "primary" values in the codebase. Button components use `#4945ff`. Navbar and Hero hardcode `#4945ff` inline.
- 50+ hardcoded hex values scattered across components (not consumed via CSS variables). Grep: `grep -rE '#[0-9A-Fa-f]{6}' src/components | wc -l`.
- Dark mode is partially implemented: `colors.css` and `globals.css` each define a `.dark` block, but many components hardcode light-mode hexes that don't swap.

### 1.3 Typography

- **Display font:** `"Codec Pro"` (loaded from `fonts.cdnfonts.com`)
- **Body / UI font:** `"Open Sauce Sans"` (loaded from `fonts.cdnfonts.com`)
- **Scale:** `--text-xs` (0.75rem) → `--text-6xl` (3.75rem)
- **Heading weights:** `h1`–`h4` all share `var(--font-weight-medium)` (500) with `line-height: 1.5` — same weight for all, limited hierarchy
- **Base size:** `--font-size: 16px`

### 1.4 Spacing, Radius, Shadow

- **Radius:** `--radius: 0.75rem` (12px). Button uses `rounded-md` (`--radius - 2px` = 10px). Navbar CTA hardcodes `8px`.
- **Shadows:** Four tiers (`--shadow-sm`/`md`/`lg`/`xl`), all tinted with navy `rgba(4, 30, 66, …)`
- **Containers:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` is the de-facto standard
- **`zoom: 0.9` on `body`** — coarse scaling hack applied globally (`globals.css:154`)

### 1.5 Components & Patterns

| Component | Current styling |
|---|---|
| Navbar | Fixed, navy `#041E42`, white text, blurred backdrop, purple `#4945ff` CTA, hardcoded colors inline |
| Hero | Fixed background image (`businessPeopleImg`), dark gradient overlay, scroll-linked opacity fade over 50vh, 7-second "initial hover" animation + 3s bounce loop on CTA |
| Buttons | `bg-primary` (#4945ff) / outline / ghost / secondary / destructive / link variants |
| Cards | White, `rounded-xl` (12px), hairline `border`, flat (no shadow by default) |
| Inputs | `h-9 rounded-md border`, transparent `--input`, 3px focus ring |
| Tables (ComparisonTable) | Feature rows, Delt vs. Traditional columns, green checkmarks |
| Footer | Navy `#041E42`, gradient CTA band on `#4945ff → #7B77FF`, 4-column grid |

### 1.6 Animation Inventory

- Page overlay transitions: `{ opacity: 0→1, y: 8→0, duration: 0.22 }` (`App.tsx:286-291`)
- Hero gradient text sweep: 16s linear infinite (`.hero-speed-text`)
- Hero CTA: 7s initial auto-animation on mount, then bounce every 3s (`HeroSection.tsx:32-66`) — fires even when user isn't engaging
- Navbar login link: animated gradient text while scrolling (`Navbar.tsx:129-143`)
- Footer CTA band: blurred radial lights, subtle parallax
- Keyframes: `fadeIn`, `slideUp`, `gradientWave` in `globals.css`

### 1.7 Overall Mood

Institutional, trust-forward, navy-and-purple-blue. Reads as "enterprise fintech" but leans corporate/traditional. The `zoom: 0.9` hack and the 7-second CTA auto-animation are rough edges.

---

## 2. Chosen Reference & Rationale

Picked from the **Styleguide and Branding** section of `awesome-design.md`.

**Reference: Atlassian Design System** — https://atlassian.design

| Candidate | Verdict |
|---|---|
| **Atlassian** | Fintech-grade trust palette with a distinctly different blue (`#0C66E4`) from Delt's current (`#1B17FF` / `#4945ff`). Documented tokens (palette, radii, shadows, type scale) that map cleanly to CSS variables. Strong table and form patterns — match our calculator + application flows. **Chosen.** |
| Ant Design | Great enterprise density, but its blue (`#1677FF`) is near-identical to Delt's — redesign wouldn't feel new. Runner-up. |
| IBM Carbon | Too austere/industrial for a consumer-facing funding product. |
| Uber | Bold mono aesthetic clashes with the trust signals a funding product needs. |
| Material / Buffer | Too generic / too casual-startup. |

Stripe — the obvious fintech benchmark — is not in the awesome-design list, so Atlassian is the closest documented system that fits.

### 2.1 Why Atlassian fits a modern payment processing site

1. **Trust through restraint.** Hairline borders, layered shadows, purposeful color use.
2. **Distinct blue.** `#0C66E4` is clearly different from today's palette, making the redesign visually obvious without abandoning financial-blue convention.
3. **Warm neutrals** (`#172B4D`/`#44546F`) replace the cool industrial grays, softening the corporate feel.
4. **Data-dense friendly.** Their table and form patterns handle dense comparison and application UIs gracefully.
5. **Tokenized.** Drop-in replacement of CSS variables cascades across all 136 components.

---

## 3. Token Mapping (Old → New)

| Purpose | Old | New |
|---|---|---|
| Primary | `#4945ff` / `#1B17FF` | **`#0C66E4`** |
| Primary hover | `#1510DD` | **`#0055CC`** |
| Primary subtle | `#E6EDFF` | **`#E9F2FF`** |
| Text primary | `#041E42` | **`#172B4D`** |
| Text secondary | `#52606D` | **`#44546F`** |
| Text tertiary | `#9AA5B1` | **`#758195`** |
| Border default | `#E4E7EB` | **`#DCDFE4`** |
| Border strong | `#CBD2D9` | **`#C1C7D0`** |
| Background | `#ededf5` | **`#FAFBFC`** |
| Surface card | `#FFFFFF` | `#FFFFFF` |
| Surface muted | `#F5F7FA` | **`#F1F2F4`** |
| Success | `#00875A` | **`#1F845A`** |
| Warning | `#FF991F` | **`#B65C02`** |
| Danger | `#DE350B` | **`#C9372C`** |
| Accent | — | **`#6E5DC6`** (new purple) |
| Radius base | `0.75rem` (12px) | **`0.5rem` (8px)** |
| Radius sm | 4px | **3px** |
| Radius lg | 12px | **8px** |
| Shadow raised | navy-tinted | **`0 1px 1px rgba(9,30,66,.25), 0 0 1px rgba(9,30,66,.31)`** |
| Shadow overlay | navy-tinted | **`0 8px 12px rgba(9,30,66,.15), 0 0 1px rgba(9,30,66,.31)`** |
| Display font | `"Codec Pro"` | `"Inter", "Codec Pro", …` (Inter primary, Codec Pro fallback) |
| Body font | `"Open Sauce Sans"` | `"Inter", "Open Sauce Sans", …` |

---

## 4. Component Redesign Plan

### Tier 1 — Tokens & primitives (cascades everywhere)

| File | Change |
|---|---|
| `src/styles/colors.css` | Full token rewrite per §3 |
| `src/styles/globals.css` | Sync `--primary` etc. to new tokens, **remove `zoom: 0.9`**, add Inter font import, keep keyframes |
| `src/components/ui/button.tsx` | Radius `rounded-md` → `rounded-lg` (8px), add subtle shadow on default, tighten padding |
| `src/components/ui/card.tsx` | Radius `rounded-xl` → `rounded-lg` (8px), add `shadow-[var(--shadow-raised)]` |
| `src/components/ui/input.tsx` | 2px focus ring instead of 3px, borders via `--color-border`, subtle background on focus |

### Tier 2 — High-traffic pages

| File | Change |
|---|---|
| `Navbar.tsx` | Hairline bottom border, softer navy `#172B4D`, swap inline `#4945ff` → `#0C66E4`, simpler sticky behavior |
| `HeroSection.tsx` | **Remove 7-second initial auto-animation** and 3-second bounce loop (distracting), tone gradient text to single primary, crisper CTA on `#0C66E4`, lighter typography |
| `Footer.tsx` | CTA band gradient restyled on new primary, swap `#4945ff` → `#0C66E4`, hairline section dividers instead of `border-gray-700` |
| `CapitalCostAnalyzer.tsx` | Slider track `#0C66E4`, result card uses new shadow token, remove inline hardcoded hexes |
| `ComparisonTable.tsx` | Hairline rows, reduce zebra, status colors aligned to new palette |
| `ApplicationPage.tsx` | Tighter form spacing, phase indicator uses new primary |

### Tier 3 — Inherit

PreQualificationGame.tsx (3838 lines — do not hand-edit), Blog, Legal, Wins, About, Reviews, FAQ, Support, Booking, Login, Dashboard. These inherit the new tokens/primitives automatically.

---

## 5. Migration Strategy

1. Branch off `claude/clone-awesome-design-or7G5` into `claude/redesign-preview-atlassian` (done).
2. Write this spec (done).
3. Tier 1: token rewrite in one commit. Cascades immediately.
4. Tier 1: primitive restyles in one commit.
5. Tier 2: page-level sweeps in one commit, focused on removing hardcoded hexes and replacing rough animation.
6. Verify build + types. Push.

---

## 6. Verification

- `npm run build` — production build succeeds
- `npx tsc --noEmit` — no new type errors
- `grep -rE '#(4945ff|1B17FF|041E42|ededf5)' src/` — zero results in Tier 2 files (Tier 3 files may still contain these and will inherit new palette via tokens)
- Visual pass on Home/Hero, Calculator overlay, ComparisonTable, Application, Navbar, Footer at 375/768/1280
- Confirm push landed on `claude/redesign-preview-atlassian` and the awesome-design clone branch is unchanged

---

## 7. Known Risks

- **Removing `zoom: 0.9`** reflows every page; paired with new type scale and visual QA on Tier 2.
- **Hardcoded hexes in Tier 3 components** — out of scope; they keep their old look but benefit from the new background/text tokens.
- **Font swap** — `Inter` is loaded with `Codec Pro`/`Open Sauce Sans` as fallbacks, so a slow CDN won't break rendering.
- **Two animation libraries** (Motion + Anime.js) retained; only tuning timings, not removing.
