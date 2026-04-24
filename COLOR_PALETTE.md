# Delt Pay — Brand Color Palette

From the 2025 Brand Guidelines, §3.1–3.2.

## §3.1 — Primary Colors

### Electric Indigo

The primary accent. Used for CTAs, active states, gradient partners, data-viz accents, and decorative indigo blooms.

| | |
|---|---|
| **HEX** | `#4945FF` |
| **RGB** | `73, 69, 255` |
| **CMYK** | `78, 71, 0, 0` |

### Midnight Steel

The deep brand color. Used for dark feature backgrounds (hero, CTA closing spread, ticker bar context), the navy header chrome, and the nav ink text color in light sections.

| | |
|---|---|
| **HEX** | `#041E42` |
| **RGB** | `4, 30, 66` |
| **CMYK** | `100, 88, 42, 51` |

## §3.2 — Neutral Colors

### Pure White

The default light surface. Used for the page background, card backgrounds, and any inverse text on dark features.

| | |
|---|---|
| **HEX** | `#FFFFFF` |
| **RGB** | `255, 255, 255` |
| **CMYK** | `0, 0, 0, 0` |

### Pure Black

Used sparingly — the ticker bar strip above the nav, and as a ground for high-contrast display moments.

| | |
|---|---|
| **HEX** | `#000000` |
| **RGB** | `0, 0, 0` |
| **CMYK** | `75, 68, 67, 90` |

## Implementation neutrals (not brand-controlled)

The brand guide defines only the four colors above. A functional marketing site needs a few utility neutrals that fall outside the brand's direct control (hairlines, muted labels, paper bands between sections). These are used consistently but aren't brand tokens:

| Role                           | HEX       | Notes                                                 |
|--------------------------------|-----------|-------------------------------------------------------|
| Body text near-black           | `#0F0E17` | Auxiliary near-black; more readable than pure `#000`. |
| Section paper canvas           | `#F6F9FC` | Cool paper used to differentiate V1 sections.         |
| Hairline border                | `#DCDFE4` | 1px rules and dividers.                               |
| Muted label / caption          | `#697386` | Mono eyebrows, inactive labels.                       |
| Supporting body text           | `#425466` | Paragraph body text when not on dark surfaces.        |

These stay untouched by a pure brand-palette pass but are documented here for transparency.

## Where it's wired

All four brand colors route through the central design tokens. One string edit recolors the whole site.

| File                           | Token / usage                                                    |
|--------------------------------|------------------------------------------------------------------|
| `app/shared.jsx`               | `DELT.colors.indigo` = `#4945FF`, `DELT.colors.violet` = `#4945FF` (same, for legacy names) |
| `app/variation-1-sections.jsx` | `V1.blue` = `#4945FF` (Electric Indigo), `V1.ink` = `#041E42` (Midnight Steel), `V1.white` = `#FFFFFF` |
| `app/variation-1.jsx`          | Hero dark background = `#041E42`, matching left-fade gradient overlay uses `rgba(4, 30, 66, …)` |
| `index.html`                   | `html, body { background: #FFFFFF }` (Pure White page ground)    |

## Data-viz and avatar ramps

Two places use an indigo *ramp* derived from Electric Indigo for visual variety (budget allocation bars, reviewer avatar tints). They aren't brand-controlled but are tuned to complement Electric Indigo:

- `UC_COLORS` (budget bars): `['#3730A3', '#4945FF', '#6366F1', '#818CF8', '#1F845A']` — deep → mid → light indigo, with the terminal green kept for contrast
- Reviewer hues: `['#4945FF', '#4338CA', '#6366F1', '#818CF8', '#3730A3', '#6D6BF5']`

The `#1F845A` green and the `#C9372C` red (destructive state) are retained from the functional palette for success / error semantics; they aren't in the brand guide.
