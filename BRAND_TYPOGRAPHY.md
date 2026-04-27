# Delt Pay — Brand Typography

From the 2025 Brand Guidelines, §4.1–4.3.

## 4.1 — Primary Font: Codec Pro

Display face. Used for all headlines (H1–H4) and call-to-action labels.

| Weight      | Usage                   |
|-------------|-------------------------|
| Regular     | Supporting display text |
| Bold        | H4, CTA buttons         |
| Extra Bold  | H3                      |
| Heavy       | H2                      |
| Ultra       | H1                      |

## 4.2 — Secondary Font: Inter

Body face. Used for paragraph text and long-form copy.

| Weight      | Usage                    |
|-------------|--------------------------|
| Regular     | Body text, paragraphs    |
| Semi Bold   | Inline emphasis, labels  |
| Bold        | Strong emphasis          |
| Extra Bold  | Small caps / all-caps UI |

## 4.3 — Hierarchy

Brand guide sizes are in print **pt**; the site is in screen **px**. `pt → px` below uses `1pt ≈ 1.333px` and is *rounded to typographic-friendly values* for the web.

| Token      | Font                   | Brand spec     | Web translation               |
|------------|------------------------|----------------|-------------------------------|
| H1         | Codec Pro Ultra        | 70pt / 0pt LH  | 56px / 1.02 line-height       |
| H2         | Codec Pro Heavy        | 60pt / 0pt LH  | 48px / 1.05 line-height       |
| H3         | Codec Pro Extra Bold   | 50pt / 0pt LH  | 40px / 1.05 line-height       |
| H4         | Codec Pro Bold         | 40pt / 0pt LH  | 32px / 1.1 line-height        |
| Body       | Codec Pro Regular      | 25pt / 30pt LH | 16–17px / 1.55 line-height    |
| CTA        | Codec Pro Bold         | 20pt / 0pt LH  | 15px / 1 line-height          |

The brand guide presents an Inter-based hierarchy alongside Codec Pro (H1 = Inter Black, H2 = Inter Extra Bold, …). On the web it's used as a fallback chain when Codec Pro isn't licensed on the serving surface.

## Implementation on this site

### Font stack

```
display:  "Codec Pro", "Manrope", "Inter Tight", ui-sans-serif, system-ui, sans-serif
body:     "Inter", ui-sans-serif, system-ui, sans-serif
mono:     "JetBrains Mono", ui-monospace, Menlo, monospace
italic:   "Source Serif Pro", Georgia, serif   ← editorial pull-quotes only
```

- **Codec Pro** is served via `@font-face` declarations in `index.html` that point at `/fonts/CodecPro-{Regular,Bold,ExtraBold,Heavy,Ultra}.woff2`. Drop licensed files at those paths and they activate automatically.
- **Manrope** is loaded from Google Fonts as the closest free stand-in while Codec Pro files aren't present — similar geometric sans proportions and weight range.
- **Inter Tight** sits third in the stack as a last fallback (it's already loaded via Google Fonts).
- **JetBrains Mono** and **Source Serif Pro** aren't in the brand guide but are used across V1 for mono editorial eyebrows (`01 · CH I · …`) and italic pull-quotes. Kept intentionally to preserve the editorial voice. If brand strictness is required, they can be removed, and mono/italic roles can degrade to weights of Inter.

### Where it's wired

| File                           | Token                   |
|--------------------------------|-------------------------|
| `index.html`                   | `@font-face` block for Codec Pro, plus Google Fonts `<link>` for Manrope/Inter/Inter Tight/JetBrains Mono/Source Serif Pro |
| `app/shared.jsx`               | `DELT.font.display`, `DELT.font.body`, `DELT.font.mono` |
| `app/variation-1-sections.jsx` | `V1.fontDisplay`, `V1.fontBody`, `V1.fontMono` |

Every display heading on the site reads from one of those two `display` tokens, so swapping one string swaps the entire hierarchy.

### Expected font files

Drop the following licensed `.woff2` files at `/fonts/` to activate Codec Pro:

- `CodecPro-Regular.woff2`
- `CodecPro-Bold.woff2`
- `CodecPro-ExtraBold.woff2`
- `CodecPro-Heavy.woff2`
- `CodecPro-Ultra.woff2`
