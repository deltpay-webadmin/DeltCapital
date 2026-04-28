// V1 Polish — design polish layer.
//
// This file is purely ADDITIVE. It introduces:
//   1. An "obsessive" spacing/whitespace scale + utilities (DeltSpace, V1Spacer)
//   2. Grain / noise / texture overlays (V1Grain, mounted once globally)
//   3. New scroll-triggered animation primitives (V1ScrollFade, V1Parallax,
//      V1ScrollProgress) — additive to the existing motion module
//   4. Micro-interactions & functional motion (auto-enhanced <a> + <button>
//      hover/press feedback, focus rings, link hover-underline)
//   5. Magnetic / elastic interactive elements (V1Magnetic + a global
//      auto-enhancer that finds `data-magnetic`, hero CTAs, and the get-funded
//      button by selector — also adds soft elastic press to all <button>s)
//
// Nothing here mutates existing component code. Everything attaches via a
// single <V1Polish /> root component mounted at the end of <Variation1>.
// Reduced-motion preference is honored everywhere.

const V1P_PRM = typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ────────────────────────────────────────────────────────────
// 1. OBSESSIVE SPACING / WHITESPACE SYSTEM
// ────────────────────────────────────────────────────────────
//
// A single source of truth for vertical rhythm. All values are derived from a
// base unit (4px) so everything composes on a shared grid. Exposed on
// window.DeltSpace so any component can opt-in without changes elsewhere.
const DELT_BASE = 4;
const DeltSpace = {
  base: DELT_BASE,
  // Micro → macro scale. Use the named slots, not raw numbers.
  px:   1,
  hair: DELT_BASE * 0.5,   //  2  — hairline gap
  xxs:  DELT_BASE,         //  4
  xs:   DELT_BASE * 2,     //  8
  sm:   DELT_BASE * 3,     // 12
  md:   DELT_BASE * 4,     // 16
  lg:   DELT_BASE * 6,     // 24
  xl:   DELT_BASE * 8,     // 32
  '2xl': DELT_BASE * 12,   // 48
  '3xl': DELT_BASE * 16,   // 64
  '4xl': DELT_BASE * 24,   // 96
  '5xl': DELT_BASE * 32,   // 128
  '6xl': DELT_BASE * 48,   // 192
  '7xl': DELT_BASE * 64,   // 256

  // Section rhythm — for first-class vertical breathing room.
  section: { tight: 64, default: 96, generous: 128, editorial: 160 },

  // Container widths — match existing 1280 maxWidth used across sections.
  container: { narrow: 720, prose: 880, default: 1180, wide: 1280, full: 1440 },

  // Optical-correction nudges. Real designers tweak by 1–2px when something
  // "looks off." Codify the most common ones so they stop being magic numbers.
  optical: {
    headlineNudge: -2,        // tighten cap-height-leading visual gap
    iconBaseline: 1,          // most 14–16px icons sit 1px high vs text baseline
    capLineHeight: 0.95,      // for display caps (matches hero h1)
  },
};

// Named line-height pairs for readable-vs-display contexts. Use these instead
// of inventing fresh decimals each time.
DeltSpace.leading = {
  display: 0.96,    // huge display caps, tightly stacked
  headline: 1.08,   // mid-scale headers
  prose: 1.55,      // body copy
  ui: 1.35,         // labels / inputs / buttons
};

// Tracking presets to match brand voice.
DeltSpace.tracking = {
  display: '-0.045em', // hero
  heading: '-0.02em',  // section heads
  body: '0',
  caps:    '0.08em',   // SMALL CAPS, KICKERS
  capsLg:  '0.14em',   // larger eyebrow / dateline kickers
};

// V1Spacer — drop a sized vertical gap that respects the scale. Avoids the
// usual "marginTop: 47" guesswork.
function V1Spacer({ size = 'lg', axis = 'y', style, ...rest }) {
  const v = typeof size === 'number' ? size : (DeltSpace[size] ?? DeltSpace.lg);
  const dim = axis === 'y' ? { height: v, width: '100%' } : { width: v, height: '100%' };
  return <div aria-hidden="true" style={{ ...dim, flexShrink: 0, ...style }} {...rest} />;
}

// V1Container — opinionated max-width box with the standard 32px gutter.
function V1Container({ size = 'wide', style, children, ...rest }) {
  const w = typeof size === 'number' ? size : (DeltSpace.container[size] ?? DeltSpace.container.wide);
  return (
    <div style={{ maxWidth: w, margin: '0 auto', padding: '0 32px', ...style }} {...rest}>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 2. GRAIN / NOISE / TEXTURE OVERLAYS
// ────────────────────────────────────────────────────────────
//
// Two layers, mounted once globally:
//   • A fine, monochrome SVG turbulence noise — fixed-position, viewport-sized,
//     ~3% opacity, mix-blend-mode: overlay. Adds tactile film grain.
//   • A subtle radial vignette gradient — softens the edges of the viewport
//     without dimming the center.
// Both are pointer-events: none and zero-impact on layout. Repaint cost is
// trivial because we use a static <svg> + <feTurbulence> baked once.

function V1GlobalTexture() {
  // A stable seed keeps the noise pattern from re-rolling on each mount.
  const noiseSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='7'/>
      <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)'/>
  </svg>`;
  const noiseUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(noiseSvg)}")`;

  return (
    <>
      {/* Fine film-grain noise layer */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0,
        backgroundImage: noiseUrl,
        backgroundSize: '220px 220px',
        opacity: 0.045,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: 9998,
        // Subtle drift so the grain doesn't feel printed-on. Disabled when
        // reduced motion is requested.
        animation: V1P_PRM ? 'none' : 'v1grainDrift 9s steps(8) infinite',
      }} />
      {/* Edge vignette — only ~6% darker at the corners. */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(15,14,23,0.06) 100%)',
        pointerEvents: 'none',
        zIndex: 9997,
      }} />
      <style>{`
        @keyframes v1grainDrift {
          0%   { transform: translate(0, 0); }
          12%  { transform: translate(-8px, 4px); }
          25%  { transform: translate(6px, -7px); }
          37%  { transform: translate(-3px, 9px); }
          50%  { transform: translate(9px, 2px); }
          62%  { transform: translate(-7px, -5px); }
          75%  { transform: translate(4px, 8px); }
          87%  { transform: translate(-9px, -3px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </>
  );
}

// V1Grain — section-scoped grain overlay. Use inside any section that wants
// extra texture without inheriting the page-wide noise. Honors reduced-motion.
function V1Grain({ opacity = 0.06, blend = 'overlay', tone = 'mono', style, ...rest }) {
  const fill = tone === 'warm' ? '0.5 0.4 0.2 0' : tone === 'cool' ? '0.2 0.3 0.5 0' : '0 0 0 0';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
    <filter id='g'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch' seed='3'/>
      <feColorMatrix values='${fill} 0  ${fill} 0  ${fill} 0  0 0 0 0.6 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#g)'/>
  </svg>`;
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
      backgroundSize: '200px 200px',
      opacity,
      mixBlendMode: blend,
      pointerEvents: 'none',
      ...style,
    }} {...rest} />
  );
}

// ────────────────────────────────────────────────────────────
// 3. SCROLL-TRIGGERED ANIMATION PRIMITIVES (additive)
// ────────────────────────────────────────────────────────────

// V1ScrollFade — a more nuanced reveal than V1Reveal: supports `from`
// directions (up/down/left/right/scale/blur), latched-once-in-view, and a
// distance prop. Won't conflict with the existing V1Reveal — additive only.
function V1ScrollFade({
  children, from = 'up', distance = 24, duration = 800, delay = 0, blur = false,
  threshold = 0.12, as: Tag = 'div', style, ...rest
}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(V1P_PRM);
  React.useEffect(() => {
    if (V1P_PRM || !ref.current || inView) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold, rootMargin: '0px 0px -40px 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [inView, threshold]);

  const offset = (() => {
    switch (from) {
      case 'down':  return `translate3d(0, ${-distance}px, 0)`;
      case 'left':  return `translate3d(${-distance}px, 0, 0)`;
      case 'right': return `translate3d(${distance}px, 0, 0)`;
      case 'scale': return 'scale(0.96)';
      case 'up':
      default:      return `translate3d(0, ${distance}px, 0)`;
    }
  })();

  const style0 = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translate3d(0,0,0) scale(1)' : offset,
    filter: blur && !inView ? 'blur(6px)' : 'blur(0)',
    transition: V1P_PRM ? 'none' : [
      `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      blur ? `filter ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms` : null,
    ].filter(Boolean).join(', '),
    willChange: inView ? 'auto' : 'opacity, transform',
  };
  return <Tag ref={ref} style={{ ...style0, ...style }} {...rest}>{children}</Tag>;
}

// V1Parallax — moves children at a fraction of the page scroll. Uses the
// existing useV1ScrollY hook so it shares the same rAF tick.
function V1Parallax({ speed = 0.15, axis = 'y', clamp = 600, children, style, ...rest }) {
  const y = (typeof useV1ScrollY === 'function') ? useV1ScrollY() : 0;
  const ref = React.useRef(null);
  // Compute element offset from top of page once on mount + on resize, so the
  // parallax is relative to the element entering the viewport, not page top.
  const [base, setBase] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) return undefined;
    const measure = () => {
      const r = ref.current.getBoundingClientRect();
      setBase((window.scrollY || 0) + r.top);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const local = Math.max(-clamp, Math.min(clamp, (y - base) * speed));
  const transform = V1P_PRM ? 'none'
    : axis === 'x' ? `translate3d(${local}px, 0, 0)` : `translate3d(0, ${local}px, 0)`;
  return (
    <div ref={ref} style={{ transform, willChange: V1P_PRM ? 'auto' : 'transform', ...style }} {...rest}>
      {children}
    </div>
  );
}

// V1ScrollProgress — fixed top progress bar tied to documentElement scroll.
// Lives in the global polish layer, not in any individual section.
function V1ScrollProgress({ color }) {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    if (V1P_PRM) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const max = (doc.scrollHeight - window.innerHeight) || 1;
        const next = Math.max(0, Math.min(1, (window.scrollY || 0) / max));
        setPct(next);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const accent = color || (window.DELT && DELT.colors.indigo) || '#4945FF';
  return (
    <div aria-hidden="true" style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 2,
      pointerEvents: 'none', zIndex: 10000,
    }}>
      <div style={{
        height: '100%',
        width: `${pct * 100}%`,
        background: `linear-gradient(90deg, ${accent} 0%, #818CF8 100%)`,
        boxShadow: `0 0 8px ${accent}80`,
        transition: V1P_PRM ? 'none' : 'width 80ms linear',
        willChange: 'width',
      }} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 4. MICRO-INTERACTIONS & FUNCTIONAL MOTION
// ────────────────────────────────────────────────────────────
//
// Auto-enhances every <button> and <a> on the page (post-mount, MutationObserver-
// backed) with:
//   • A subtle hover lift on buttons (translateY(-1px) + soft shadow)
//   • A "press" indent on mousedown (translateY(1px))
//   • A focus-visible ring matching brand indigo
//   • A hover underline-grow on links inside paragraph copy
// Components that already implement their own micro-interactions are left
// alone (we check for data-no-polish and the existing inline transform handler
// pattern).

function V1MicroInjectStyles() {
  // Inject one stylesheet block and forget. CSS-only enhancements — cheap and
  // can't double-apply.
  return (
    <style>{`
      /* Keyboard focus ring — replaces browser default with brand ring. */
      :focus-visible {
        outline: 2px solid #4945FF;
        outline-offset: 2px;
        border-radius: 4px;
      }
      /* Buttons lift gently on hover, press inward on click. We scope this
         to buttons WITHOUT data-no-polish so individual components can opt
         out. The :not([disabled]) avoids zombie-state fights. */
      button:not([disabled]):not([data-no-polish]) {
        transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1),
                    background-color 180ms ease,
                    border-color 180ms ease,
                    color 180ms ease,
                    filter 180ms ease;
      }
      button:not([disabled]):not([data-no-polish]):hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 18px -8px rgba(15,14,23,0.22),
                    0 2px 4px -2px rgba(15,14,23,0.10);
        filter: brightness(1.04);
      }
      button:not([disabled]):not([data-no-polish]):active {
        transform: translateY(0.5px) scale(0.985);
        transition-duration: 80ms;
      }

      /* Anchor links inside running prose get a hover underline-grow. */
      a:not([data-no-polish]) {
        transition: color 160ms ease, opacity 160ms ease;
      }

      /* Hairline link underline that animates on hover for any anchor that
         opts in via data-magnetic-link or class .v1-magnetic-link. Non-
         destructive: only activates where flagged. */
      a.v1-magnetic-link, a[data-magnetic-link] {
        position: relative;
        display: inline-block;
      }
      a.v1-magnetic-link::after, a[data-magnetic-link]::after {
        content: '';
        position: absolute;
        left: 0; right: 0; bottom: -2px;
        height: 1px;
        background: currentColor;
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      a.v1-magnetic-link:hover::after, a[data-magnetic-link]:hover::after {
        transform: scaleX(1);
      }

      /* Selection color uses brand indigo with low alpha. */
      ::selection {
        background: rgba(73, 69, 255, 0.22);
        color: inherit;
      }

      /* Smooth scrolling for anchor jumps. Disabled under reduced-motion via
         the prefers-reduced-motion query. */
      html { scroll-behavior: smooth; }
      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        button:not([disabled]):not([data-no-polish]):hover { transform: none; }
        button:not([disabled]):not([data-no-polish]):active { transform: none; }
        a.v1-magnetic-link::after, a[data-magnetic-link]::after { transition: none; }
      }

      /* Cursor for video and image figures invites engagement. */
      figure[data-cursor="zoom"], video[data-cursor="zoom"] { cursor: zoom-in; }

      /* Tabular numerics anywhere we set a class — handy for stat blocks. */
      .v1-tnum { font-variant-numeric: tabular-nums; }
    `}</style>
  );
}

// ────────────────────────────────────────────────────────────
// 5. MAGNETIC / ELASTIC INTERACTIVE ELEMENTS
// ────────────────────────────────────────────────────────────
//
// V1Magnetic wraps any child and gently pulls it toward the cursor. The
// strength is small by default (8px max travel) so it reads as polish, not
// gimmick. A "release" ease bounces back when the cursor leaves.
//
// V1MagneticAuto is a global side-effect component that finds high-signal
// CTAs (buttons that look like primary calls to action) and wraps their
// behavior at the DOM level via mousemove listeners — without touching the
// React tree. This keeps the existing components untouched.

function V1Magnetic({ children, strength = 0.28, max = 10, radius = 120, as: Tag = 'span', style, ...rest }) {
  const ref = React.useRef(null);
  const raf = React.useRef(0);
  const target = React.useRef({ x: 0, y: 0 });
  const current = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    if (V1P_PRM) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const tick = () => {
      // Spring lerp — exponential ease toward target
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      const dx = current.current.x;
      const dy = current.current.y;
      el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
      const moving = Math.abs(target.current.x - current.current.x) > 0.1
                   || Math.abs(target.current.y - current.current.y) > 0.1;
      if (moving) raf.current = requestAnimationFrame(tick);
      else raf.current = 0;
    };
    const start = () => { if (!raf.current) raf.current = requestAnimationFrame(tick); };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        target.current = { x: 0, y: 0 };
      } else {
        // Falloff: stronger near center, gentler at the edge of the radius
        const k = 1 - dist / radius;
        target.current = {
          x: Math.max(-max, Math.min(max, dx * strength * k)),
          y: Math.max(-max, Math.min(max, dy * strength * k)),
        };
      }
      start();
    };
    const onLeave = () => { target.current = { x: 0, y: 0 }; start(); };

    // Listen on window so the magnet kicks in BEFORE the cursor reaches the
    // element — the "pull" is what makes it feel magnetic.
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      el.style.transform = '';
    };
  }, [strength, max, radius]);

  return (
    <Tag ref={ref} style={{
      display: 'inline-block', willChange: V1P_PRM ? 'auto' : 'transform',
      transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
      ...style,
    }} {...rest}>
      {children}
    </Tag>
  );
}

// V1MagneticAuto — finds primary CTAs on the page and attaches the same
// magnetic behavior at the DOM level, so existing components don't need any
// edits. Selectors are conservative: only buttons that already look "primary"
// (filled background containing brand indigo or pure black) plus anything
// explicitly tagged with [data-magnetic].
function V1MagneticAuto() {
  React.useEffect(() => {
    if (V1P_PRM) return undefined;
    const cleanups = new WeakMap();

    const isPrimaryCTA = (btn) => {
      if (btn.dataset && btn.dataset.magnetic === 'off') return false;
      if (btn.dataset && btn.dataset.magnetic === 'on') return true;
      // Heuristic: filled buttons whose background is brand-ink or brand-indigo
      const cs = window.getComputedStyle(btn);
      const bg = cs.backgroundColor || '';
      // Match the brand ink (#0F0E17 → rgb(15,14,23)) or indigo (#4945FF → rgb(73,69,255))
      const inkMatch = /rgb\((1[0-9]|2[0-9]),\s*(1[0-9]|2[0-9]),\s*(2[0-9]|3[0-9])/.test(bg);
      const indigoMatch = /rgb\(7[0-9],\s*6[0-9],\s*25[0-5]/.test(bg);
      const text = (btn.textContent || '').trim().toLowerCase();
      const isCTA = ['get funded', 'apply now', 'start now', 'book a call', 'talk to us'].some((k) => text.includes(k));
      return indigoMatch || (inkMatch && isCTA);
    };

    const attach = (el) => {
      if (cleanups.has(el)) return;
      // Wrap the inner content so we can transform the button without fighting
      // hover styles set on the button itself. Skip if the button already has
      // a magnetic-inner wrapper.
      let inner = el.querySelector(':scope > .v1-magnetic-inner');
      if (!inner) {
        // Move children into a span without disrupting the React tree. We
        // reparent at the DOM level only — React will overwrite this on
        // re-render. To survive re-renders, we re-attach via the observer.
        // Actually, simpler + safer: don't reparent. Just transform the
        // button itself. Hover styles live at :hover so they compose fine.
        inner = el;
      }

      const max = 8;
      const radius = 110;
      const strength = 0.22;
      const state = { tx: 0, ty: 0, cx: 0, cy: 0, raf: 0 };

      const tick = () => {
        state.cx += (state.tx - state.cx) * 0.2;
        state.cy += (state.ty - state.cy) * 0.2;
        // Use a CSS variable so we don't fight inline style="" set elsewhere.
        el.style.setProperty('--v1m-x', `${state.cx.toFixed(2)}px`);
        el.style.setProperty('--v1m-y', `${state.cy.toFixed(2)}px`);
        const moving = Math.abs(state.tx - state.cx) > 0.1 || Math.abs(state.ty - state.cy) > 0.1;
        if (moving) state.raf = requestAnimationFrame(tick);
        else state.raf = 0;
      };
      const start = () => { if (!state.raf) state.raf = requestAnimationFrame(tick); };
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > radius) state.tx = state.ty = 0;
        else {
          const k = 1 - dist / radius;
          state.tx = Math.max(-max, Math.min(max, dx * strength * k));
          state.ty = Math.max(-max, Math.min(max, dy * strength * k));
        }
        start();
      };
      const onLeave = () => { state.tx = state.ty = 0; start(); };

      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseleave', onLeave);

      // Compose the magnetic translate on top of any existing transform via
      // a CSS custom property + a stylesheet rule. We register it as a class
      // and stack with the existing button:hover transform.
      el.classList.add('v1-magnetic-target');

      cleanups.set(el, () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseleave', onLeave);
        if (state.raf) cancelAnimationFrame(state.raf);
        el.classList.remove('v1-magnetic-target');
        el.style.removeProperty('--v1m-x');
        el.style.removeProperty('--v1m-y');
      });
    };

    const detach = (el) => {
      const fn = cleanups.get(el);
      if (fn) { fn(); cleanups.delete(el); }
    };

    const scan = () => {
      // Scan all buttons + elements opted in via data-magnetic
      document.querySelectorAll('button, [data-magnetic]').forEach((el) => {
        if (el.dataset && el.dataset.magnetic === 'off') return;
        if (el.tagName === 'BUTTON' && !isPrimaryCTA(el) && !(el.dataset && el.dataset.magnetic === 'on')) return;
        attach(el);
      });
    };

    // Initial scan after first paint, plus a MutationObserver for dynamically-
    // mounted CTAs (page swaps in Variation1, the application flow modal, etc).
    const initial = setTimeout(scan, 80);
    const mo = new MutationObserver(() => { scan(); });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(initial);
      mo.disconnect();
      // Best-effort cleanup of any still-attached listeners
      document.querySelectorAll('.v1-magnetic-target').forEach(detach);
    };
  }, []);

  // The composing rule: combine button:hover (translateY(-1px)) with the
  // magnetic translate via a CSS variable. Specificity is matched on the
  // class so we cleanly override the generic button:hover transform.
  return (
    <style>{`
      .v1-magnetic-target {
        --v1m-x: 0px;
        --v1m-y: 0px;
        transform: translate3d(var(--v1m-x), var(--v1m-y), 0);
        transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 200ms ease, filter 200ms ease;
      }
      button.v1-magnetic-target:not([disabled]):hover {
        transform: translate3d(var(--v1m-x), calc(var(--v1m-y) - 1px), 0);
      }
      button.v1-magnetic-target:not([disabled]):active {
        transform: translate3d(var(--v1m-x), calc(var(--v1m-y) + 0.5px), 0) scale(0.985);
        transition-duration: 80ms;
      }
      @media (prefers-reduced-motion: reduce) {
        .v1-magnetic-target { transform: none !important; transition: none; }
      }
    `}</style>
  );
}

// V1ElasticPress — wrap a child to give it an elastic squash on press. Used
// e.g. for primary CTAs that want a tactile click feel beyond the global
// button styles. Additive — opt-in only.
function V1ElasticPress({ children, scale = 0.94, duration = 480, style, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  const onDown = () => setPressed(true);
  const onUp = () => setPressed(false);
  return (
    <span
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchEnd={onUp}
      style={{
        display: 'inline-block',
        transform: pressed ? `scale(${scale})` : 'scale(1)',
        transition: V1P_PRM ? 'none' : `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

// ────────────────────────────────────────────────────────────
// 6. ROOT COMPONENT — mounts everything once at app root
// ────────────────────────────────────────────────────────────
//
// Mount <V1Polish /> once anywhere inside <Variation1>. It renders only
// position:fixed overlays + style tags + side-effect components, so it has
// no impact on layout.

function V1Polish() {
  return (
    <>
      <V1MicroInjectStyles />
      <V1MagneticAuto />
      <V1GlobalTexture />
      <V1ScrollProgress />
    </>
  );
}

// ────────────────────────────────────────────────────────────
// EXPORTS
// ────────────────────────────────────────────────────────────
Object.assign(window, {
  DeltSpace,
  V1Spacer,
  V1Container,
  V1Grain,
  V1ScrollFade,
  V1Parallax,
  V1ScrollProgress,
  V1Magnetic,
  V1MagneticAuto,
  V1ElasticPress,
  V1MicroInjectStyles,
  V1GlobalTexture,
  V1Polish,
});
