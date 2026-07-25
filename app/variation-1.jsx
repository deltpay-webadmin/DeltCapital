// Variation 1 — "Ledger" — editorial hero with video centerpiece.
// Dark-gradient hero section to match the floating-card/dock video.
// Left: oversized display type + CTAs. Right: video, bleeding to the edge.

function V1Ticker({ accent }) {
  const rows = [
    ['LA ROSA REST.', '$110K', '1.16×', 'CLOSED'],
    ['ROSARIO CON.', '$180K', '1.14×', 'WIRED'],
    ['BLOOM BTY.', '$65K', '1.19×', 'FUNDED'],
    ['WILLIAMS LOG.', '$80K', '1.17×', 'CLOSED'],
    ['WARD MKT.', '$50K', '1.18×', 'WIRED'],
    ['ROBERTS AUTO', '$95K', '1.15×', 'FUNDED'],
    ['NORTHGATE CAFE', '$42K', '1.20×', 'APPRVD'],
    ['SILVER FORK', '$220K', '1.13×', 'WIRED'],
  ];
  const all = [...rows, ...rows];
  // Status color map — tuned for the black ticker background. The global
  // DELT.colors.ok/warn are calibrated for light paper and read muddy on #000,
  // so we use brighter ticker-specific values instead. FUNDED/WIRED = green,
  // APPRVD = amber, CLOSED = neutral gray.
  const statusColor = (s) => {
    if (s === 'FUNDED' || s === 'WIRED') return '#22C55E';
    if (s === 'APPRVD') return '#F59E0B';
    return '#8B8A94'; // CLOSED + anything else
  };
  return (
    <div data-v1-ticker data-v1-ticker-bar data-no-i18n style={{ background: '#000', color: '#E9E7DF', padding: '10px 0 14px', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{
        display: 'flex', whiteSpace: 'nowrap',
        animation: 'v1ticker 48s linear infinite', fontFamily: DELT.font.mono, fontSize: 11.5,
      }}>
        {/* marginRight on every row (incl. last) so total width = 2× one copy
            exactly. translateX(-50%) then lines up pixel-perfect at loop. */}
        {all.map((row, i) => (
          <span key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginRight: 40 }}>
            <span style={{ color: 'rgba(233,231,223,0.5)' }}>{row[0]}</span>
            <span>{row[1]}</span>
            <span style={{ color: accent }}>{row[2]}</span>
            <span style={{ color: statusColor(row[3]), fontSize: 10 }}>● {row[3]}</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes v1ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

function V1Chrome({ page, navTo, accent, openApp }) {
  // Subscribe to language changes so nav labels re-render on toggle.
  useLang();
  const links = [
    { k: 'how',         l: t('nav.how') },
    { k: 'calc',        l: t('nav.calc') },
    { k: 'processing',  l: t('nav.processing') },
    { k: 'about',       l: t('nav.about') },
    { k: 'reviews',     l: t('nav.reviews') },
    { k: 'faq',         l: t('nav.faq') },
    { k: 'talk',        l: t('nav.contact') },
  ];
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleNav = (k) => { setMenuOpen(false); navTo(k); };
  // Lock body scroll while mobile menu is open.
  React.useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : prev || '';
    return () => { document.body.style.overflow = prev || ''; };
  }, [menuOpen]);
  return (
    <>
    <V1Ticker accent={accent} />
    <header style={{
      background: DELT.colors.ink,
      borderBottom: `1px solid rgba(255,255,255,0.08)`,
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navTo('home')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
          <img
            src="app/assets/logo-white.png"
            alt="Delt Capital"
            style={{ height: 28, width: 'auto', display: 'block' }}
          />
        </div>
        <nav data-v1-desktop-nav style={{ display: 'flex', gap: 28 }}>
          {links.map(ln => (
            <a key={ln.k} onClick={() => handleNav(ln.k)} style={{
              fontFamily: DELT.font.body, fontSize: 13.5,
              color: page === ln.k ? '#F7F5F0' : 'rgba(247,245,240,0.65)',
              fontWeight: page === ln.k ? 500 : 400, cursor: 'pointer', paddingBottom: 2,
              borderBottom: page === ln.k ? `1px solid #F7F5F0` : '1px solid transparent',
            }}>{ln.l}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a data-v1-desktop-nav onClick={() => navTo('login')} style={{ fontFamily: DELT.font.body, fontSize: 13.5, color: page === 'login' ? '#F7F5F0' : 'rgba(247,245,240,0.75)', cursor: 'pointer' }}>{t('nav.login')}</a>
          <V1LangToggle compact />
          <Btn variant="ghost" size="sm" onClick={openApp} style={{ background: 'transparent', color: '#F7F5F0', borderColor: 'rgba(247,245,240,0.2)' }}>{t('cta.getFunded')}</Btn>
          {/* Mobile hamburger — hidden on desktop via CSS, shown <= 768px */}
          <button
            data-v1-mobile-nav-toggle
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            style={{
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44,
              background: 'transparent', border: '1px solid rgba(247,245,240,0.2)',
              borderRadius: 8, cursor: 'pointer', padding: 0,
              color: '#F7F5F0',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
    {/* Mobile full-screen overlay menu */}
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!menuOpen}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: DELT.colors.ink,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'auto' : 'none',
        transition: 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex', flexDirection: 'column',
        padding: '20px 20px 32px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="app/assets/logo-white.png" alt="Delt Capital" style={{ height: 28, width: 'auto' }} />
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          style={{
            width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: '1px solid rgba(247,245,240,0.2)', borderRadius: 8,
            cursor: 'pointer', padding: 0, color: '#F7F5F0',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 32 }}>
        {links.map(ln => (
          <a key={ln.k} onClick={() => handleNav(ln.k)} style={{
            fontFamily: DELT.font.display, fontSize: 28, fontWeight: 600,
            color: page === ln.k ? '#F7F5F0' : 'rgba(247,245,240,0.78)',
            cursor: 'pointer', padding: '12px 4px',
            borderBottom: '1px solid rgba(247,245,240,0.08)',
          }}>{ln.l}</a>
        ))}
        <a onClick={() => handleNav('login')} style={{
          fontFamily: DELT.font.display, fontSize: 28, fontWeight: 600,
          color: page === 'login' ? '#F7F5F0' : 'rgba(247,245,240,0.78)',
          cursor: 'pointer', padding: '12px 4px',
          borderBottom: '1px solid rgba(247,245,240,0.08)',
        }}>{t('nav.login')}</a>
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <V1LangToggle />
        <Btn variant="indigo" size="lg" onClick={() => { setMenuOpen(false); openApp(); }} style={{ background: accent, borderColor: accent, width: '100%' }}>{t('cta.getFunded')}</Btn>
      </div>
    </div>
    </>
  );
}
V1Chrome.brand = (
  <div style={{ display: 'inline-flex', alignItems: 'center' }}>
    <img
      src="app/assets/logo-white.png"
      alt="Delt Capital"
      style={{ height: 32, width: 'auto', display: 'block' }}
    />
  </div>
);

function V1Hero({ accent, onApply, onNav }) {
  const mounted = useV1Mounted(80);
  // Subscribe to language changes so the hero copy swaps on toggle.
  useLang();
  // Hover state for the secondary "See how pricing works" CTA.
  const [pricingHover, setPricingHover] = React.useState(false);

  // Cursor-tracked spotlight on the background lines and cursor-tracked
  // gradient on the headline (both Plaid-style). The section receives CSS
  // custom properties --mx / --my (section-relative %) and --hx / --hy
  // (headline-relative %). Both are updated via a single requestAnimationFrame
  // loop with a 15% lerp so the light glides smoothly to the cursor.
  const heroRef = React.useRef(null);
  const headlineRef = React.useRef(null);
  React.useEffect(() => {
    const el = heroRef.current;
    if (!el) return undefined;
    // Idle: the lines layer starts fully faded out (--illum-op 0). The
    // position starts centered so that when it does fade in it isn't parked
    // in a corner. The headline hotspot starts off-screen (-30%) — the
    // headline has no opacity dial, so we hide/reveal it purely by position.
    const OP_MAX = 0.155;                 // matches the layer's target opacity
    const sec = { x: 50, y: 40 };         // background-lines spotlight target
    const head = { x: -30, y: -30 };      // headline hotspot target
    const curSec = { x: 50, y: 40 };
    const curHead = { x: -30, y: -30 };
    let targetOp = 0;                     // 0 when cursor outside, OP_MAX when inside
    let curOp = 0;
    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      sec.x = ((e.clientX - r.left) / r.width) * 100;
      sec.y = ((e.clientY - r.top) / r.height) * 100;
      const h = headlineRef.current;
      if (h) {
        const hr = h.getBoundingClientRect();
        head.x = ((e.clientX - hr.left) / hr.width) * 100;
        head.y = ((e.clientY - hr.top) / hr.height) * 100;
      }
      targetOp = OP_MAX;
    };
    const onEnter = () => { targetOp = OP_MAX; };
    // On leave we DON'T move the lines spotlight — we leave --mx/--my exactly
    // where the cursor last was and gently fade the whole layer out in place,
    // so it never darts to a corner. Only the headline hotspot glides off
    // (it can't fade), which is imperceptible over the text.
    const onLeave = () => {
      targetOp = 0;
      head.x = -30; head.y = -30;
    };
    const tick = () => {
      curSec.x  += (sec.x  - curSec.x)  * 0.15;
      curSec.y  += (sec.y  - curSec.y)  * 0.15;
      curHead.x += (head.x - curHead.x) * 0.15;
      curHead.y += (head.y - curHead.y) * 0.15;
      // Slow, symmetric opacity lerp so the fade in/out reads as a soft
      // dissolve rather than a snap.
      curOp += (targetOp - curOp) * 0.055;
      el.style.setProperty('--mx', curSec.x.toFixed(2) + '%');
      el.style.setProperty('--my', curSec.y.toFixed(2) + '%');
      el.style.setProperty('--hx', curHead.x.toFixed(2) + '%');
      el.style.setProperty('--hy', curHead.y.toFixed(2) + '%');
      el.style.setProperty('--illum-op', curOp.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Hero portrait is static — no parallax / scroll animation, per stakeholder.
  const enter = (base) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0, 14px, 0)',
    transition: `opacity 820ms cubic-bezier(0.22, 1, 0.36, 1) ${base}ms, transform 820ms cubic-bezier(0.22, 1, 0.36, 1) ${base}ms`,
  });

  // Hero verb is a static "fund" — rotator was removed per stakeholder
  // request so the headline reads as a definitive statement, not a demo.
  // paddingBlockEnd on the inline container adds room for the italic
  // descender ("d" in Source Serif Pro Italic sits below the baseline)
  // so line-height:0.95 on the h1 no longer clips it.

  // Hero graphic — static George Washington cutout (transparent WebP,
  // phone held screen-toward-George). No parallax; the portrait is anchored
  // at the right edge and stays put as the page scrolls.

  return (
    <section ref={heroRef} style={{
      // Engraving-plate dark: deep slate navy (#0c1a2a, banknote-reference)
      // with a soft steel bloom behind the portrait and a whisper of indigo
      // low-left. The loud cyan wash is gone — the portrait and the offer
      // screen carry the light now.
      backgroundColor: '#0c1a2a',
      backgroundImage: 'radial-gradient(85% 90% at 74% 34%, rgba(43,74,114,0.42) 0%, rgba(12,26,42,0) 62%), radial-gradient(60% 70% at 8% 96%, rgba(73,69,255,0.10) 0%, rgba(12,26,42,0) 60%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: '#F7F5F0',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      minHeight: 'calc(100vh - 82px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @keyframes v1heroPulse { 0% { transform: translate(-50%,-50%) scale(1); opacity: 0.55; } 70% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; } 100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; } }
        @keyframes v1heroBob { 0%, 100% { transform: translateY(0); opacity: 0.55; } 50% { transform: translateY(5px); opacity: 1; } }
        @keyframes v1heroGlow { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .v1hero-pulse, .v1hero-bob, .v1hero-float, .v1hero-glow { animation: none !important; }
        }
      `}</style>

      {/* Banknote scanlines — fine horizontal security linework, like the
          field behind a portrait on a bill (matches the engraving reference).
          Two layers, Plaid-style: a dim base always on, plus a brighter copy
          revealed through a radial mask that follows the cursor (--mx / --my
          custom properties set on the <section> by the mousemove effect).
          Pure CSS repeating gradients — far cheaper to composite than the
          previous 60-path SVG wave field. */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(180deg, rgba(125,160,205,0.10) 0px, rgba(125,160,205,0.10) 1px, transparent 1px, transparent 4px)',
        // Lines halo around George (right of center) and fade toward the
        // copy column and corners, matching the reference plate — the
        // cursor-spotlight layer below still reveals them anywhere.
        WebkitMaskImage: 'radial-gradient(90% 120% at 74% 52%, black 40%, rgba(0,0,0,0.45) 64%, rgba(0,0,0,0.05) 90%, transparent 100%)',
        maskImage: 'radial-gradient(90% 120% at 74% 52%, black 40%, rgba(0,0,0,0.45) 64%, rgba(0,0,0,0.05) 90%, transparent 100%)',
      }} />
      {/* Cursor-revealed illumination. The lines themselves carry the same
          cyan→sky→indigo→ivory gradient as the "You built the business. We
          fund it." headline (105deg to match). Two mask layers are composited
          with `intersect`: the 1px line pattern AND a large, soft regional
          glow that follows the cursor — so the illuminated area reads as a
          broad wash over the linework rather than a tight spotlight. */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        // Opacity is driven by the rAF loop (--illum-op, 0 → 0.155) so the
        // lit lines fade in/out in place instead of snapping when the cursor
        // enters or leaves the hero.
        opacity: 'var(--illum-op, 0)',
        background: 'linear-gradient(105deg, #6EE7F9 0%, #7DD3FC 25%, #A5B4FC 55%, #C7D2FE 78%, #F7F5F0 100%)',
        WebkitMaskImage: 'repeating-linear-gradient(180deg, #000 0px, #000 1px, transparent 1px, transparent 4px), radial-gradient(circle 640px at var(--mx, 50%) var(--my, 40%), #000 0%, rgba(0,0,0,0.82) 32%, rgba(0,0,0,0.4) 62%, rgba(0,0,0,0.12) 84%, transparent 100%)',
        WebkitMaskRepeat: 'repeat, no-repeat',
        WebkitMaskComposite: 'source-in',
        maskImage: 'repeating-linear-gradient(180deg, #000 0px, #000 1px, transparent 1px, transparent 4px), radial-gradient(circle 640px at var(--mx, 50%) var(--my, 40%), #000 0%, rgba(0,0,0,0.82) 32%, rgba(0,0,0,0.4) 62%, rgba(0,0,0,0.12) 84%, transparent 100%)',
        maskRepeat: 'repeat, no-repeat',
        maskComposite: 'intersect',
      }} />

      {/* Washington cutout — transparent WebP, absolutely positioned on the right.
          Anchored to the section's right edge (right:0) with a small inner
          pad so the full portrait — including the phone — stays on screen.
          On narrow viewports we push it partially off-screen and dim it so
          the copy stays readable (media query in <style> below).
          No parallax / scroll transform — the portrait sits static, per
          stakeholder direction. */}
      <style>{`
        /* Franklin-ratio portrait: anchored to the right so his head sits
           in the upper-right quadrant and coat/shoulders spread down and
           to the left. The wrapper shrink-wraps the img, so the phone-glow
           child can use % coordinates that track the portrait at any size.
           Mobile dim lives on the img (not the wrapper) because the wrapper
           carries an inline entrance opacity that would win otherwise. */
        .v1hero-washington {
          position: absolute;
          right: 0; bottom: 0;
          height: 75%; max-height: 675px;
          z-index: 2; pointer-events: none;
        }
        .v1hero-washington img {
          height: 100%; width: auto; display: block;
          filter: drop-shadow(0 8px 22px rgba(0,0,0,0.28));
          /* Slightly faded so the portrait supports the copy instead of
             competing with it; mobile queries below override with deeper dims. */
          opacity: 0.85;
        }
        @media (max-width: 1200px) {
          .v1hero-washington { right: 0; }
        }
        @media (max-width: 900px) {
          .v1hero-washington { right: -8%; bottom: 0; height: 82%; max-height: 620px; }
          .v1hero-washington img { opacity: 0.45; animation: none; }
        }
        @media (max-width: 560px) {
          .v1hero-washington { right: -20%; bottom: 0; height: 68%; }
          .v1hero-washington img { opacity: 0.28; }
        }
        @media (prefers-reduced-motion: reduce) {
          .v1hero-washington img { animation: none; }
        }
      `}</style>
      <div
        className="v1hero-washington"
        aria-hidden
        style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1100ms ease-out 200ms',
        }}
      >
        {/* Breathing glow around the phone — the screen faces George in this
            pose, so the light reads as spill escaping past the phone's edges.
            Positioned in % of the portrait so it stays glued to the phone at
            every viewport. */}
        <div className="v1hero-glow" style={{
          position: 'absolute', left: '-3%', top: '32%', width: '46%', height: '58%',
          background: 'radial-gradient(50% 42% at 42% 50%, rgba(129,140,248,0.28) 0%, rgba(73,69,255,0.10) 48%, rgba(12,26,42,0) 74%)',
          filter: 'blur(18px)',
          animation: 'v1heroGlow 5.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <img src="app/assets/washington-cutout-forward.webp" alt="" />
      </div>

      <div data-v1-grid-2col style={{
        width: '100%',
        maxWidth: 1280, margin: '0 auto', padding: '76px 32px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
        alignItems: 'center', position: 'relative', zIndex: 2,
        minHeight: 680, flex: 1,
      }}>
        {/* Left: copy */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          {/* Headline gets a cursor-tracked radial gradient via a plain
             CSS class so we can cascade the background-clip:text treatment
             down to every descendant span/em (V1LineMask wraps each line
             in inline-block spans, so applying clip:text on the H1 alone
             wouldn't reach them). --hx / --hy come from the mousemove
             effect; they sit off-screen when the cursor is not in the hero,
             so the fallback is a soft brand tint at the top-left. */}
          <style>{`
            /* Plaid-parity: text always shows a wide cyan→indigo→white
               gradient across the whole headline. The cursor adds a brighter
               spotlight on top via a second layered background — both
               background layers are clipped to the text so the effect reads
               as a subtle highlight that follows the mouse, not a full
               recolor. --hx/--hy are updated on mousemove; when the cursor
               is outside the hero they sit off-screen (-30%) and the
               spotlight disappears, leaving the static gradient. */
            .v1hero-h1, .v1hero-h1 * {
              background:
                radial-gradient(circle 620px at var(--hx, -30%) var(--hy, -30%),
                  #FFFFFF 0%,
                  #7DD3FC 22%,
                  #A5B4FC 42%,
                  rgba(165,180,252,0.0) 70%),
                linear-gradient(105deg, #6EE7F9 0%, #7DD3FC 25%, #A5B4FC 55%, #C7D2FE 78%, #F7F5F0 100%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
            }
            /* The italic "fund" <em> is a solid brand-indigo fill (set
               inline on the element) so the action word reads as one clean
               accent color instead of a gradient that clashes with the
               cursor-tracked field behind it. */
          `}</style>
          <h1 ref={headlineRef} className="v1hero-h1" data-v1-hero-title style={{
            fontFamily: DELT.font.display, fontSize: 92, fontWeight: 600,
            letterSpacing: '-0.045em', lineHeight: 0.95,
            margin: 0,
          }}>
            <V1LineMask ready={mounted} delay={120}>{t('hero.line1')}</V1LineMask>
            <V1LineMask ready={mounted} delay={230}>
              <span>{t('hero.line2')}</span>
            </V1LineMask>
            <V1LineMask ready={mounted} delay={340}>
              {t('hero.line3.we')}{' '}
              <em style={{
                // Manrope/Codec Pro have no italic; switch to Source Serif Pro
                // Italic to match the prior "yourself." treatment.
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                verticalAlign: 'baseline',
                whiteSpace: 'nowrap',
                // Solid brand-indigo fill — the accent word is one flat
                // color, not a gradient, so it doesn't clash with the
                // cyan→white headline gradient behind it. Overrides the
                // transparent text-fill set by the .v1hero-h1 * cascade.
                background: 'none',
                WebkitTextFillColor: accent,
                color: accent,
                // Give the italic "d" descender breathing room so line-height
                // 0.95 on the h1 doesn't clip it.
                paddingBlockEnd: '0.12em',
                display: 'inline-block',
              }}>{t('hero.line3.fund')}</em><span style={{ marginInlineStart: '0.08em' }}>{t('hero.line3.it')}</span>
            </V1LineMask>
          </h1>

          <p style={{
            fontFamily: DELT.font.body, fontSize: 18, lineHeight: 1.55,
            color: 'rgba(247,245,240,0.75)', margin: '32px 0 0', maxWidth: 520,
            ...enter(560),
          }}>
            {t('hero.subhead.a')}<span style={{ color: '#F7F5F0', fontWeight: 500 }}>$5K–$500K</span>{t('hero.subhead.b')}<span style={{ color: '#F7F5F0', fontWeight: 500 }}>{t('hero.24h')}</span>{t('hero.subhead.c')}
          </p>

          <div style={{
            display: 'flex', gap: 12, marginTop: 36, alignItems: 'center', flexWrap: 'wrap',
            ...enter(700),
          }}>
            <Btn variant="indigo" size="lg" onClick={onApply} style={{ background: accent, borderColor: accent }}>{t('cta.getFunded')} <Arr /></Btn>
            {/* Secondary CTA → lending / pricing overview page. Custom button
                (not <Btn/>) so it can carry its own hover animation: the
                border and fill brighten, it lifts a hair, and the arrow slides. */}
            <button
              onClick={() => onNav && onNav('lending')}
              onMouseEnter={() => setPricingHover(true)}
              onMouseLeave={() => setPricingHover(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: pricingHover ? 'rgba(247,245,240,0.10)' : 'transparent',
                color: '#F7F5F0',
                border: `1px solid ${pricingHover ? 'rgba(247,245,240,0.5)' : 'rgba(247,245,240,0.2)'}`,
                borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap',
                padding: '13px 22px', fontFamily: DELT.font.body, fontSize: 15, fontWeight: 500,
                transform: pricingHover ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: pricingHover ? '0 8px 22px rgba(4,15,40,0.35)' : '0 0 0 rgba(0,0,0,0)',
                transition: 'background .2s ease, border-color .2s ease, transform .2s cubic-bezier(0.22,1,0.36,1), box-shadow .2s ease',
              }}
            >
              {t('cta.seePricing')}
              <span style={{
                display: 'inline-flex',
                transform: pricingHover ? 'translateX(3px)' : 'translateX(0)',
                transition: 'transform .22s cubic-bezier(0.22,1,0.36,1)',
              }}><Arr /></span>
            </button>
          </div>

          <div data-v1-hero-substats style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(247,245,240,0.1)',
            display: 'flex', gap: 36, flexWrap: 'wrap',
          }}>
            {[
              [t('hero.stat.range'),  '$5K–$500K',        t('hero.stat.range.sub')],
              [t('hero.stat.time'),   '24h',              t('hero.stat.time.sub')],
              [t('hero.stat.credit'), t('hero.stat.credit.v'), t('hero.stat.credit.sub')],
            ].map(([l, v, s], i) => (
              <div key={l} style={enter(820 + i * 90)}>
                <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.45)' }}>{l}</div>
                <div style={{ fontFamily: DELT.font.display, fontSize: 26, fontWeight: 600, color: '#F7F5F0', letterSpacing: '-0.02em', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                  {v}
                  <span style={{ fontFamily: DELT.font.body, fontSize: 12, color: 'rgba(247,245,240,0.45)', fontWeight: 400, marginLeft: 6 }}>{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column spacer — Washington image is absolutely positioned
            on the section so it can bleed edge-to-edge, Plaid-style. */}
        <div aria-hidden />
      </div>



    </section>
  );
}

// V1 has a fully bespoke home layout. We reuse DeltApp's chrome + ApplicationFlow
// but compose the body sections ourselves using the V1Section components.
//
// Router: URL hash (#about, #privacy, …) is the source of truth, so the
// browser's Back/Forward buttons work and deep links resolve on reload. Every
// navTo() fades the body out for ~200ms before swapping content so page
// changes feel like a transition rather than a hard snap.
const V1_PAGES = new Set(['home', 'about', 'how', 'reviews', 'calc', 'talk', 'support', 'faq', 'blog', 'login', 'terms', 'privacy', 'eca', 'funding-flow', 'processing', 'speed', 'lending', 'terminals']);
function readPageFromHash() {
  if (typeof window === 'undefined') return 'home';
  // Apply is special-cased: it's a route that opens the modal rather than
  // swapping the body content. We surface 'home' as the underlying page so
  // the marketing layout stays intact behind the modal, then read the
  // apply payload from a separate helper below.
  const path = (window.location.pathname || '').replace(/\/+$/, '');
  if (path === '/apply') return 'home';
  const h = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0];
  if (h === 'apply') return 'home';
  return V1_PAGES.has(h) ? h : 'home';
}

// Decode a base64url(JSON) payload from either a `?d=` query param on
// /apply or a `#apply?d=` fragment. Returns null when the URL doesn't
// carry one (or the payload is malformed/old). The shape mirrors
// api/leads.js's buildApplyDeepLink output — keep them in sync.
function readApplyDeepLinkPayload() {
  if (typeof window === 'undefined') return null;
  let raw = null;
  // 1) Modern /apply?d=… path (preferred — survives clients that strip fragments).
  if ((window.location.pathname || '').replace(/\/+$/, '') === '/apply') {
    const sp = new URLSearchParams(window.location.search || '');
    raw = sp.get('d');
  }
  // 2) Legacy hash form: #apply?d=…
  if (!raw) {
    const h = (window.location.hash || '').replace(/^#\/?/, '');
    const q = h.indexOf('?');
    if (q >= 0 && h.slice(0, q) === 'apply') {
      raw = new URLSearchParams(h.slice(q + 1)).get('d');
    }
  }
  if (!raw) return null;
  try {
    // base64url → base64 → JSON. Pad with '=' to a multiple of 4.
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/')
                   .padEnd(raw.length + (4 - raw.length % 4) % 4, '=');
    const json = atob(b64);
    const obj = JSON.parse(json);
    // Light sanity checks — we never trust the URL for money decisions,
    // we only use it to pre-fill the visible form. Underwriting always
    // re-reads deposits via Plaid on the server.
    if (!obj || typeof obj !== 'object') return null;
    return obj;
  } catch (_) {
    return null;
  }
}

// Persist + restore in-progress apply form across sessions / devices that
// share the same browser. Keyed by email to keep one merchant's data from
// bleeding into another's when multiple leads use the same machine
// (rare, but happens at brokerages).
const APPLY_LS_KEY = 'deltcap:apply:v1';
function loadApplyDraft() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(APPLY_LS_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    // Expire drafts older than 30 days — stale form state is worse than no state.
    if (!obj || !obj.t || (Date.now() - obj.t) > 30 * 24 * 60 * 60 * 1000) {
      window.localStorage.removeItem(APPLY_LS_KEY);
      return null;
    }
    return obj;
  } catch (_) { return null; }
}
function saveApplyDraft(prefill) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(APPLY_LS_KEY, JSON.stringify({
      t: Date.now(),
      prefill,
    }));
  } catch (_) { /* quota / private-mode — silent */ }
}
function clearApplyDraft() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try { window.localStorage.removeItem(APPLY_LS_KEY); } catch (_) {}
}

function Variation1() {
  const accent = V1.blue; // Atlassian-preview blue for V1
  const [page, setPage] = React.useState(readPageFromHash);
  const [transitioning, setTransitioning] = React.useState(false);
  const [appOpen, setAppOpen] = React.useState(false);
  const [calcState, setCalcState] = React.useState({ revenue: 0, tib: '', cards: null, cardSales: 0 });
  const [appPrefill, setAppPrefill] = React.useState(null);
  // True when the modal was opened via an email deep-link — we use this
  // signal to (a) jump past the business/contact step and (b) auto-open
  // Plaid Link so the user only sees the friction they haven't passed.
  const [appFromEmail, setAppFromEmail] = React.useState(false);

  // Core page swap: fade the body, swap page, scroll to top, fade back in.
  // `pushUrl` is false when we're responding to a popstate so we don't
  // re-push the URL the browser just navigated to.
  const swapPage = React.useCallback((p, pushUrl) => {
    if (!V1_PAGES.has(p) || p === page) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setPage(p);
      if (pushUrl) {
        const nextHash = p === 'home' ? ' ' : `#${p}`;
        window.history.pushState({ page: p }, '', nextHash);
      }
      window.scrollTo(0, 0);
      // Let React commit the new page before we fade back in.
      requestAnimationFrame(() => setTransitioning(false));
    }, 200);
  }, [page]);

  const navTo = React.useCallback((p) => swapPage(p, true), [swapPage]);
  const openApp = (c, est, opts) => {
    if (est) setAppPrefill(est);
    setAppFromEmail(!!(opts && opts.fromEmail));
    setAppOpen(true);
  };

  // On first mount, check the URL for an email deep-link payload. When
  // one is present we hydrate `appPrefill` from it, open the modal, and
  // normalize the URL back to /#apply (without the payload) so a refresh
  // doesn't carry the long token around in the address bar. If there's
  // no URL payload, fall back to a locally-saved draft so users who
  // bounced mid-application can pick up where they left off.
  React.useEffect(() => {
    const payload = readApplyDeepLinkPayload();
    if (payload) {
      const prefill = {
        low:    Number(payload.low)  || 0,
        high:   Number(payload.high) || 0,
        factor: 1.18,
        ok:     true,
        // leadId comes from api/leads.js when the lead row landed in
        // Supabase. It rides through the apply modal so each milestone
        // beacon (api/apply-progress) ties back to the original lead row.
        // Optional — deep links built before Supabase wiring won't have one.
        leadId: payload.leadId || null,
        lead: {
          firstName:    payload.firstName    || '',
          businessName: payload.businessName || '',
          email:        payload.email        || '',
          phone:        payload.phone        || '',
        },
        calc: {
          revenue:      Number(payload.revenue) || 0,
          tib:          payload.tib || '',
          acceptsCards: payload.acceptsCards === 1 ? true
                       : payload.acceptsCards === 0 ? false : null,
          cardSales:    Number(payload.cardSales) || 0,
          boosted:      !!payload.boosted,
        },
        fromEmail: true,
      };
      setAppPrefill(prefill);
      setAppFromEmail(true);
      setAppOpen(true);
      saveApplyDraft(prefill);
      // Strip the payload so refreshes don't carry it. We keep #apply so
      // popstate still resolves the modal-open state.
      try {
        window.history.replaceState({ page: 'home' }, '', '/apply');
      } catch (_) { /* old browsers */ }
      return;
    }
    // No URL payload — if the user has a saved draft, restore it but
    // *don't* auto-open the modal (they might be browsing other pages).
    const draft = loadApplyDraft();
    if (draft && draft.prefill) setAppPrefill(draft.prefill);
  }, []);

  // Sync with Back / Forward buttons.
  React.useEffect(() => {
    const onPop = () => {
      const next = readPageFromHash();
      if (next !== page) swapPage(next, false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [page, swapPage]);

  // Make sure the initial URL has a history entry so the first Back works.
  React.useEffect(() => {
    if (!window.history.state || !window.history.state.page) {
      window.history.replaceState({ page }, '', page === 'home' ? ' ' : `#${page}`);
    }
  }, []);

  const home = (
    <>
      {/* Plaid-structured homepage flow — Delt-skinned. Hero stays untouched;
          new sections mirror Plaid.com's rhythm (marquee → product grid →
          dark engine banner → network stats → product tabs → case studies),
          keep V1CompareSection as a final skeptic's look before the lead form. */}
      <V1Hero accent={accent} onApply={() => openApp(null, null)} onNav={navTo} />
      <V1ProductGrid onNav={navTo} />
      <V1IntelligentBanner onNav={navTo} />
      <V1NetworkStats />
      <V1ProductTabs />
      <V1CaseStudyStrip />
      <V1CompareSection />
      <V1LeadFormSection onApply={openApp} />
    </>
  );

  const body =
    page === 'about'   ? <V1AboutPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'how'     ? <HowItWorksPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'reviews' ? <V1ReviewsPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'calc'    ? <V1CalculatorPage accent={accent} onApply={(data) => openApp(null, data)} onNavHow={() => navTo('funding-flow')} onNavProcessing={() => navTo('processing')} /> :
    page === 'talk'    ? <V1BookingPage accent={accent} onApply={() => openApp(null, null)} /> :
    page === 'support' ? <V1SupportPage accent={accent} onTalk={() => navTo('talk')} onApply={() => openApp(null, null)} /> :
    page === 'faq'     ? <V1FAQPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'blog'    ? <V1BlogPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'login'   ? <V1LoginPage onClose={() => navTo('home')} onApply={() => openApp(null, null)} onSignIn={() => {}} onNavLegal={navTo} /> :
    page === 'terms'   ? <V1TermsOfUse onBack={() => navTo('home')} onNavPrivacy={() => navTo('privacy')} /> :
    page === 'privacy' ? <V1PrivacyPolicy onBack={() => navTo('home')} onNavTerms={() => navTo('terms')} /> :
    page === 'eca'     ? <V1ElectronicCommunications onBack={() => navTo('home')} /> :
    page === 'funding-flow' ? <V1FundingFlowPage accent={accent} onApply={() => openApp(null, null)} onCalc={() => navTo('calc')} /> :
    page === 'processing' ? <V1ProcessingPage accent={accent} onApply={() => openApp(null, null)} onCalc={() => navTo('calc')} /> :
    page === 'speed'    ? <V1SpeedPage accent={accent} onApply={() => openApp(null, null)} onCalc={() => navTo('calc')} /> :
    page === 'lending'  ? <V1LendingPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'terminals' ? <V1TerminalsPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    home;

  return (
    <>
      <V1Chrome page={page} navTo={navTo} accent={accent} openApp={() => openApp(null, null)} />
      <div style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {body}
      </div>
      <FooterBlock accent={accent} brand={V1Chrome.brand} onNav={navTo} />
      <V1ApplicationFlow
        open={appOpen}
        onClose={() => { setAppOpen(false); setAppFromEmail(false); }}
        prefill={appPrefill}
        accent={accent}
        startStep={appFromEmail ? 1 : 0}
        autoOpenPlaid={appFromEmail}
        onDraftChange={saveApplyDraft}
        onComplete={clearApplyDraft}
      />
      <V1CookieConsent onNav={navTo} />
    </>
  );
}

Object.assign(window, { Variation1, V1Chrome, V1Hero });
