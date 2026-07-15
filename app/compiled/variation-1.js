function V1Ticker({
  accent
}) {
  const rows = [['LA ROSA REST.', '$110K', '1.16×', 'CLOSED'], ['ROSARIO CON.', '$180K', '1.14×', 'WIRED'], ['BLOOM BTY.', '$65K', '1.19×', 'FUNDED'], ['WILLIAMS LOG.', '$80K', '1.17×', 'CLOSED'], ['WARD MKT.', '$50K', '1.18×', 'WIRED'], ['ROBERTS AUTO', '$95K', '1.15×', 'FUNDED'], ['NORTHGATE CAFE', '$42K', '1.20×', 'APPRVD'], ['SILVER FORK', '$220K', '1.13×', 'WIRED']];
  const all = [...rows, ...rows];
  const statusColor = s => {
    if (s === 'FUNDED' || s === 'WIRED') return '#22C55E';
    if (s === 'APPRVD') return '#F59E0B';
    return '#8B8A94';
  };
  return React.createElement("div", {
    "data-v1-ticker": true,
    "data-v1-ticker-bar": true,
    "data-no-i18n": true,
    style: {
      background: '#000',
      color: '#E9E7DF',
      padding: '10px 0 14px',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      whiteSpace: 'nowrap',
      animation: 'v1ticker 48s linear infinite',
      fontFamily: DELT.font.mono,
      fontSize: 11.5
    }
  }, all.map((row, i) => React.createElement("span", {
    key: i,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      marginRight: 40
    }
  }, React.createElement("span", {
    style: {
      color: 'rgba(233,231,223,0.5)'
    }
  }, row[0]), React.createElement("span", null, row[1]), React.createElement("span", {
    style: {
      color: accent
    }
  }, row[2]), React.createElement("span", {
    style: {
      color: statusColor(row[3]),
      fontSize: 10
    }
  }, "\u25CF ", row[3])))), React.createElement("style", null, `@keyframes v1ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`));
}
function V1Chrome({
  page,
  navTo,
  accent,
  openApp
}) {
  useLang();
  const links = [{
    k: 'how',
    l: t('nav.how')
  }, {
    k: 'calc',
    l: t('nav.calc')
  }, {
    k: 'processing',
    l: t('nav.processing')
  }, {
    k: 'about',
    l: t('nav.about')
  }, {
    k: 'reviews',
    l: t('nav.reviews')
  }, {
    k: 'faq',
    l: t('nav.faq')
  }, {
    k: 'talk',
    l: t('nav.contact')
  }];
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleNav = k => {
    setMenuOpen(false);
    navTo(k);
  };
  React.useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : prev || '';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [menuOpen]);
  return React.createElement(React.Fragment, null, React.createElement(V1Ticker, {
    accent: accent
  }), React.createElement("header", {
    style: {
      background: DELT.colors.ink,
      borderBottom: `1px solid rgba(255,255,255,0.08)`,
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, React.createElement("div", {
    onClick: () => navTo('home'),
    style: {
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, React.createElement("img", {
    src: "app/assets/logo-white.png",
    alt: "Delt Capital",
    style: {
      height: 28,
      width: 'auto',
      display: 'block'
    }
  })), React.createElement("nav", {
    "data-v1-desktop-nav": true,
    style: {
      display: 'flex',
      gap: 28
    }
  }, links.map(ln => React.createElement("a", {
    key: ln.k,
    onClick: () => handleNav(ln.k),
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13.5,
      color: page === ln.k ? '#F7F5F0' : 'rgba(247,245,240,0.65)',
      fontWeight: page === ln.k ? 500 : 400,
      cursor: 'pointer',
      paddingBottom: 2,
      borderBottom: page === ln.k ? `1px solid #F7F5F0` : '1px solid transparent'
    }
  }, ln.l))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, React.createElement("a", {
    "data-v1-desktop-nav": true,
    onClick: () => navTo('login'),
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13.5,
      color: page === 'login' ? '#F7F5F0' : 'rgba(247,245,240,0.75)',
      cursor: 'pointer'
    }
  }, t('nav.login')), React.createElement(V1LangToggle, {
    compact: true
  }), React.createElement(Btn, {
    variant: "ghost",
    size: "sm",
    onClick: openApp,
    style: {
      background: 'transparent',
      color: '#F7F5F0',
      borderColor: 'rgba(247,245,240,0.2)'
    }
  }, t('cta.getFunded')), React.createElement("button", {
    "data-v1-mobile-nav-toggle": true,
    "aria-label": "Open menu",
    "aria-expanded": menuOpen,
    onClick: () => setMenuOpen(true),
    style: {
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      width: 44,
      height: 44,
      background: 'transparent',
      border: '1px solid rgba(247,245,240,0.2)',
      borderRadius: 8,
      cursor: 'pointer',
      padding: 0,
      color: '#F7F5F0'
    }
  }, React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    "aria-hidden": "true"
  }, React.createElement("path", {
    d: "M3 6h16M3 11h16M3 16h16",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  })))))), React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-hidden": !menuOpen,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: DELT.colors.ink,
      opacity: menuOpen ? 1 : 0,
      pointerEvents: menuOpen ? 'auto' : 'none',
      transition: 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 20px 32px'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, React.createElement("img", {
    src: "app/assets/logo-white.png",
    alt: "Delt Capital",
    style: {
      height: 28,
      width: 'auto'
    }
  }), React.createElement("button", {
    "aria-label": "Close menu",
    onClick: () => setMenuOpen(false),
    style: {
      width: 44,
      height: 44,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: '1px solid rgba(247,245,240,0.2)',
      borderRadius: 8,
      cursor: 'pointer',
      padding: 0,
      color: '#F7F5F0'
    }
  }, React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    "aria-hidden": "true"
  }, React.createElement("path", {
    d: "M4 4l12 12M16 4L4 16",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  })))), React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 32
    }
  }, links.map(ln => React.createElement("a", {
    key: ln.k,
    onClick: () => handleNav(ln.k),
    style: {
      fontFamily: DELT.font.display,
      fontSize: 28,
      fontWeight: 600,
      color: page === ln.k ? '#F7F5F0' : 'rgba(247,245,240,0.78)',
      cursor: 'pointer',
      padding: '12px 4px',
      borderBottom: '1px solid rgba(247,245,240,0.08)'
    }
  }, ln.l)), React.createElement("a", {
    onClick: () => handleNav('login'),
    style: {
      fontFamily: DELT.font.display,
      fontSize: 28,
      fontWeight: 600,
      color: page === 'login' ? '#F7F5F0' : 'rgba(247,245,240,0.78)',
      cursor: 'pointer',
      padding: '12px 4px',
      borderBottom: '1px solid rgba(247,245,240,0.08)'
    }
  }, t('nav.login'))), React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'center'
    }
  }, React.createElement(V1LangToggle, null), React.createElement(Btn, {
    variant: "indigo",
    size: "lg",
    onClick: () => {
      setMenuOpen(false);
      openApp();
    },
    style: {
      background: accent,
      borderColor: accent,
      width: '100%'
    }
  }, t('cta.getFunded')))));
}
V1Chrome.brand = React.createElement("div", {
  style: {
    display: 'inline-flex',
    alignItems: 'center'
  }
}, React.createElement("img", {
  src: "app/assets/logo-white.png",
  alt: "Delt Capital",
  style: {
    height: 32,
    width: 'auto',
    display: 'block'
  }
}));
function V1Hero({
  accent,
  onApply,
  onNav
}) {
  const mounted = useV1Mounted(80);
  useLang();
  const [pricingHover, setPricingHover] = React.useState(false);
  const heroRef = React.useRef(null);
  const headlineRef = React.useRef(null);
  React.useEffect(() => {
    const el = heroRef.current;
    if (!el) return undefined;
    const OP_MAX = 0.155;
    const sec = {
      x: 50,
      y: 40
    };
    const head = {
      x: -30,
      y: -30
    };
    const curSec = {
      x: 50,
      y: 40
    };
    const curHead = {
      x: -30,
      y: -30
    };
    let targetOp = 0;
    let curOp = 0;
    let raf = 0;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      sec.x = (e.clientX - r.left) / r.width * 100;
      sec.y = (e.clientY - r.top) / r.height * 100;
      const h = headlineRef.current;
      if (h) {
        const hr = h.getBoundingClientRect();
        head.x = (e.clientX - hr.left) / hr.width * 100;
        head.y = (e.clientY - hr.top) / hr.height * 100;
      }
      targetOp = OP_MAX;
    };
    const onEnter = () => {
      targetOp = OP_MAX;
    };
    const onLeave = () => {
      targetOp = 0;
      head.x = -30;
      head.y = -30;
    };
    const tick = () => {
      curSec.x += (sec.x - curSec.x) * 0.15;
      curSec.y += (sec.y - curSec.y) * 0.15;
      curHead.x += (head.x - curHead.x) * 0.15;
      curHead.y += (head.y - curHead.y) * 0.15;
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
  const enter = base => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0, 14px, 0)',
    transition: `opacity 820ms cubic-bezier(0.22, 1, 0.36, 1) ${base}ms, transform 820ms cubic-bezier(0.22, 1, 0.36, 1) ${base}ms`
  });
  return React.createElement("section", {
    ref: heroRef,
    style: {
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
      flexDirection: 'column'
    }
  }, React.createElement("style", null, `
        @keyframes v1heroPulse { 0% { transform: translate(-50%,-50%) scale(1); opacity: 0.55; } 70% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; } 100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; } }
        @keyframes v1heroBob { 0%, 100% { transform: translateY(0); opacity: 0.55; } 50% { transform: translateY(5px); opacity: 1; } }
        @keyframes v1heroGlow { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .v1hero-pulse, .v1hero-bob, .v1hero-float, .v1hero-glow { animation: none !important; }
        }
      `), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
      background: 'repeating-linear-gradient(180deg, rgba(125,160,205,0.10) 0px, rgba(125,160,205,0.10) 1px, transparent 1px, transparent 4px)',
      WebkitMaskImage: 'radial-gradient(90% 120% at 74% 52%, black 40%, rgba(0,0,0,0.45) 64%, rgba(0,0,0,0.05) 90%, transparent 100%)',
      maskImage: 'radial-gradient(90% 120% at 74% 52%, black 40%, rgba(0,0,0,0.45) 64%, rgba(0,0,0,0.05) 90%, transparent 100%)'
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
      opacity: 'var(--illum-op, 0)',
      background: 'linear-gradient(105deg, #6EE7F9 0%, #7DD3FC 25%, #A5B4FC 55%, #C7D2FE 78%, #F7F5F0 100%)',
      WebkitMaskImage: 'repeating-linear-gradient(180deg, #000 0px, #000 1px, transparent 1px, transparent 4px), radial-gradient(circle 640px at var(--mx, 50%) var(--my, 40%), #000 0%, rgba(0,0,0,0.82) 32%, rgba(0,0,0,0.4) 62%, rgba(0,0,0,0.12) 84%, transparent 100%)',
      WebkitMaskRepeat: 'repeat, no-repeat',
      WebkitMaskComposite: 'source-in',
      maskImage: 'repeating-linear-gradient(180deg, #000 0px, #000 1px, transparent 1px, transparent 4px), radial-gradient(circle 640px at var(--mx, 50%) var(--my, 40%), #000 0%, rgba(0,0,0,0.82) 32%, rgba(0,0,0,0.4) 62%, rgba(0,0,0,0.12) 84%, transparent 100%)',
      maskRepeat: 'repeat, no-repeat',
      maskComposite: 'intersect'
    }
  }), React.createElement("style", null, `
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
        }
        @media (max-width: 1200px) {
          .v1hero-washington { right: 0; }
        }
        /* Mobile: the Washington + $95K-offer cutout IS the ad creative, so it
           must stay prominent (paid clicks are mostly mobile). Center it at the
           bottom at near-full opacity and let the copy sit above it, rather
           than dimming it to a ghost off the right edge. A scrim (below) keeps
           the headline legible where they meet. */
        @media (max-width: 900px) {
          .v1hero-washington { right: 50%; transform: translateX(50%); bottom: 0; height: 60%; max-height: 560px; }
          .v1hero-washington img { opacity: 0.92; animation: none; }
        }
        @media (max-width: 560px) {
          .v1hero-washington { right: 50%; transform: translateX(50%); bottom: 0; height: 50%; max-height: 430px; }
          .v1hero-washington img { opacity: 0.95; }
        }
        /* On mobile, stack the copy at the top so it clears the centered
           portrait below; drop the desktop vertical-centering + tall min-height. */
        @media (max-width: 768px) {
          [data-v1-hero-grid] {
            align-items: start !important;
            min-height: auto !important;
            padding: 36px 20px 0 !important;
          }
        }
        /* Mobile legibility scrim — darkens the upper area (where the copy
           sits) over the centered portrait. Desktop is unaffected. */
        .v1hero-mobile-scrim { display: none; }
        @media (max-width: 768px) {
          .v1hero-mobile-scrim {
            display: block;
            position: absolute; inset: 0; z-index: 2; pointer-events: none;
            background: linear-gradient(180deg, rgba(12,26,42,0.92) 0%, rgba(12,26,42,0.85) 40%, rgba(12,26,42,0.55) 60%, rgba(12,26,42,0) 78%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .v1hero-washington img { animation: none; }
        }
      `), React.createElement("div", {
    className: "v1hero-washington",
    "aria-hidden": true,
    style: {
      opacity: mounted ? 1 : 0,
      transition: 'opacity 1100ms ease-out 200ms'
    }
  }, React.createElement("div", {
    className: "v1hero-glow",
    style: {
      position: 'absolute',
      left: '-7%',
      top: '16%',
      width: '46%',
      height: '72%',
      background: 'radial-gradient(50% 42% at 42% 50%, rgba(129,140,248,0.28) 0%, rgba(73,69,255,0.10) 48%, rgba(12,26,42,0) 74%)',
      filter: 'blur(18px)',
      animation: 'v1heroGlow 5.5s ease-in-out infinite',
      pointerEvents: 'none'
    }
  }), React.createElement("img", {
    src: "app/assets/washington-cutout.webp",
    alt: ""
  })), React.createElement("div", {
    className: "v1hero-mobile-scrim",
    "aria-hidden": true
  }), React.createElement("div", {
    "data-v1-grid-2col": true,
    "data-v1-hero-grid": true,
    style: {
      width: '100%',
      maxWidth: 1280,
      margin: '0 auto',
      padding: '76px 32px 0',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center',
      position: 'relative',
      zIndex: 2,
      minHeight: 680,
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 3
    }
  }, React.createElement("style", null, `
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
          `), React.createElement("h1", {
    ref: headlineRef,
    className: "v1hero-h1",
    "data-v1-hero-title": true,
    style: {
      fontFamily: DELT.font.display,
      fontSize: 92,
      fontWeight: 600,
      letterSpacing: '-0.045em',
      lineHeight: 0.95,
      margin: 0
    }
  }, React.createElement(V1LineMask, {
    ready: mounted,
    delay: 120
  }, t('hero.line1')), React.createElement(V1LineMask, {
    ready: mounted,
    delay: 230
  }, React.createElement("span", null, t('hero.line2'))), React.createElement(V1LineMask, {
    ready: mounted,
    delay: 340
  }, t('hero.line3.we'), ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      verticalAlign: 'baseline',
      whiteSpace: 'nowrap',
      background: 'none',
      WebkitTextFillColor: accent,
      color: accent,
      paddingBlockEnd: '0.12em',
      display: 'inline-block'
    }
  }, t('hero.line3.fund')), React.createElement("span", {
    style: {
      marginInlineStart: '0.08em'
    }
  }, t('hero.line3.it')))), React.createElement("p", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 18,
      lineHeight: 1.55,
      color: 'rgba(247,245,240,0.75)',
      margin: '32px 0 0',
      maxWidth: 520,
      ...enter(560)
    }
  }, t('hero.subhead.a'), React.createElement("span", {
    style: {
      color: '#F7F5F0',
      fontWeight: 500
    }
  }, "$5K\u2013$500K"), t('hero.subhead.b'), React.createElement("span", {
    style: {
      color: '#F7F5F0',
      fontWeight: 500
    }
  }, t('hero.24h')), t('hero.subhead.c')), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 36,
      alignItems: 'center',
      flexWrap: 'wrap',
      ...enter(700)
    }
  }, React.createElement(Btn, {
    variant: "indigo",
    size: "lg",
    onClick: onApply,
    style: {
      background: accent,
      borderColor: accent
    }
  }, t('cta.getFunded'), " ", React.createElement(Arr, null)), React.createElement("button", {
    onClick: () => onNav && onNav('lending'),
    onMouseEnter: () => setPricingHover(true),
    onMouseLeave: () => setPricingHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: pricingHover ? 'rgba(247,245,240,0.10)' : 'transparent',
      color: '#F7F5F0',
      border: `1px solid ${pricingHover ? 'rgba(247,245,240,0.5)' : 'rgba(247,245,240,0.2)'}`,
      borderRadius: 6,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      padding: '13px 22px',
      fontFamily: DELT.font.body,
      fontSize: 15,
      fontWeight: 500,
      transform: pricingHover ? 'translateY(-1px)' : 'translateY(0)',
      boxShadow: pricingHover ? '0 8px 22px rgba(4,15,40,0.35)' : '0 0 0 rgba(0,0,0,0)',
      transition: 'background .2s ease, border-color .2s ease, transform .2s cubic-bezier(0.22,1,0.36,1), box-shadow .2s ease'
    }
  }, t('cta.seePricing'), React.createElement("span", {
    style: {
      display: 'inline-flex',
      transform: pricingHover ? 'translateX(3px)' : 'translateX(0)',
      transition: 'transform .22s cubic-bezier(0.22,1,0.36,1)'
    }
  }, React.createElement(Arr, null)))), React.createElement("div", {
    "data-v1-hero-substats": true,
    style: {
      marginTop: 32,
      paddingTop: 24,
      borderTop: '1px solid rgba(247,245,240,0.1)',
      display: 'flex',
      gap: 36,
      flexWrap: 'wrap'
    }
  }, [[t('hero.stat.range'), '$5K–$500K', t('hero.stat.range.sub')], [t('hero.stat.time'), '24h', t('hero.stat.time.sub')], [t('hero.stat.credit'), t('hero.stat.credit.v'), t('hero.stat.credit.sub')]].map(([l, v, s], i) => React.createElement("div", {
    key: l,
    style: enter(820 + i * 90)
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(247,245,240,0.45)'
    }
  }, l), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 26,
      fontWeight: 600,
      color: '#F7F5F0',
      letterSpacing: '-0.02em',
      marginTop: 4,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v, React.createElement("span", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 12,
      color: 'rgba(247,245,240,0.45)',
      fontWeight: 400,
      marginLeft: 6
    }
  }, s)))))), React.createElement("div", {
    "aria-hidden": true
  })));
}
const V1_PAGES = new Set(['home', 'about', 'how', 'reviews', 'calc', 'talk', 'support', 'faq', 'blog', 'login', 'terms', 'privacy', 'eca', 'funding-flow', 'processing', 'speed', 'lending', 'terminals']);
function readPageFromHash() {
  if (typeof window === 'undefined') return 'home';
  const path = (window.location.pathname || '').replace(/\/+$/, '');
  if (path === '/apply') return 'home';
  const h = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0];
  if (h === 'apply') return 'home';
  return V1_PAGES.has(h) ? h : 'home';
}
function readApplyDeepLinkPayload() {
  if (typeof window === 'undefined') return null;
  let raw = null;
  if ((window.location.pathname || '').replace(/\/+$/, '') === '/apply') {
    const sp = new URLSearchParams(window.location.search || '');
    raw = sp.get('d');
  }
  if (!raw) {
    const h = (window.location.hash || '').replace(/^#\/?/, '');
    const q = h.indexOf('?');
    if (q >= 0 && h.slice(0, q) === 'apply') {
      raw = new URLSearchParams(h.slice(q + 1)).get('d');
    }
  }
  if (!raw) return null;
  try {
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/').padEnd(raw.length + (4 - raw.length % 4) % 4, '=');
    const json = atob(b64);
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== 'object') return null;
    return obj;
  } catch (_) {
    return null;
  }
}
const APPLY_LS_KEY = 'deltcap:apply:v1';
function loadApplyDraft() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(APPLY_LS_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.t || Date.now() - obj.t > 30 * 24 * 60 * 60 * 1000) {
      window.localStorage.removeItem(APPLY_LS_KEY);
      return null;
    }
    return obj;
  } catch (_) {
    return null;
  }
}
function saveApplyDraft(prefill) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(APPLY_LS_KEY, JSON.stringify({
      t: Date.now(),
      prefill
    }));
  } catch (_) {}
}
function clearApplyDraft() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(APPLY_LS_KEY);
  } catch (_) {}
}
function Variation1() {
  const accent = V1.blue;
  const [page, setPage] = React.useState(readPageFromHash);
  const [transitioning, setTransitioning] = React.useState(false);
  const [appOpen, setAppOpen] = React.useState(false);
  const [calcState, setCalcState] = React.useState({
    revenue: 0,
    tib: '',
    cards: null,
    cardSales: 0
  });
  const [appPrefill, setAppPrefill] = React.useState(null);
  const [appFromEmail, setAppFromEmail] = React.useState(false);
  const swapPage = React.useCallback((p, pushUrl) => {
    if (!V1_PAGES.has(p) || p === page) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setPage(p);
      if (pushUrl) {
        const nextHash = p === 'home' ? ' ' : `#${p}`;
        window.history.pushState({
          page: p
        }, '', nextHash);
      }
      window.scrollTo(0, 0);
      requestAnimationFrame(() => setTransitioning(false));
    }, 200);
  }, [page]);
  const navTo = React.useCallback(p => swapPage(p, true), [swapPage]);
  const openApp = (c, est, opts) => {
    if (est) setAppPrefill(est);
    setAppFromEmail(!!(opts && opts.fromEmail));
    setAppOpen(true);
  };
  React.useEffect(() => {
    const payload = readApplyDeepLinkPayload();
    if (payload) {
      const prefill = {
        low: Number(payload.low) || 0,
        high: Number(payload.high) || 0,
        factor: 1.18,
        ok: true,
        leadId: payload.leadId || null,
        lead: {
          firstName: payload.firstName || '',
          businessName: payload.businessName || '',
          email: payload.email || '',
          phone: payload.phone || ''
        },
        calc: {
          revenue: Number(payload.revenue) || 0,
          tib: payload.tib || '',
          acceptsCards: payload.acceptsCards === 1 ? true : payload.acceptsCards === 0 ? false : null,
          cardSales: Number(payload.cardSales) || 0,
          boosted: !!payload.boosted
        },
        fromEmail: true
      };
      setAppPrefill(prefill);
      setAppFromEmail(true);
      setAppOpen(true);
      saveApplyDraft(prefill);
      try {
        window.history.replaceState({
          page: 'home'
        }, '', '/apply');
      } catch (_) {}
      return;
    }
    const draft = loadApplyDraft();
    if (draft && draft.prefill) setAppPrefill(draft.prefill);
  }, []);
  React.useEffect(() => {
    const onPop = () => {
      const next = readPageFromHash();
      if (next !== page) swapPage(next, false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [page, swapPage]);
  React.useEffect(() => {
    if (!window.history.state || !window.history.state.page) {
      window.history.replaceState({
        page
      }, '', page === 'home' ? ' ' : `#${page}`);
    }
  }, []);
  const home = React.createElement(React.Fragment, null, React.createElement(V1Hero, {
    accent: accent,
    onApply: () => openApp(null, null),
    onNav: navTo
  }), React.createElement(V1ProductGrid, {
    onNav: navTo
  }), React.createElement(V1IntelligentBanner, {
    onNav: navTo
  }), React.createElement(V1NetworkStats, null), React.createElement(V1ProductTabs, null), React.createElement(V1CaseStudyStrip, null), React.createElement(V1CompareSection, null), React.createElement(V1LeadFormSection, {
    onApply: openApp
  }));
  const body = page === 'about' ? React.createElement(V1AboutPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onTalk: () => navTo('talk')
  }) : page === 'how' ? React.createElement(HowItWorksPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onTalk: () => navTo('talk')
  }) : page === 'reviews' ? React.createElement(V1ReviewsPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onTalk: () => navTo('talk')
  }) : page === 'calc' ? React.createElement(V1CalculatorPage, {
    accent: accent,
    onApply: data => openApp(null, data),
    onNavHow: () => navTo('funding-flow'),
    onNavProcessing: () => navTo('processing')
  }) : page === 'talk' ? React.createElement(V1BookingPage, {
    accent: accent,
    onApply: () => openApp(null, null)
  }) : page === 'support' ? React.createElement(V1SupportPage, {
    accent: accent,
    onTalk: () => navTo('talk'),
    onApply: () => openApp(null, null)
  }) : page === 'faq' ? React.createElement(V1FAQPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onTalk: () => navTo('talk')
  }) : page === 'blog' ? React.createElement(V1BlogPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onTalk: () => navTo('talk')
  }) : page === 'login' ? React.createElement(V1LoginPage, {
    onClose: () => navTo('home'),
    onApply: () => openApp(null, null),
    onSignIn: () => {},
    onNavLegal: navTo
  }) : page === 'terms' ? React.createElement(V1TermsOfUse, {
    onBack: () => navTo('home'),
    onNavPrivacy: () => navTo('privacy')
  }) : page === 'privacy' ? React.createElement(V1PrivacyPolicy, {
    onBack: () => navTo('home'),
    onNavTerms: () => navTo('terms')
  }) : page === 'eca' ? React.createElement(V1ElectronicCommunications, {
    onBack: () => navTo('home')
  }) : page === 'funding-flow' ? React.createElement(V1FundingFlowPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onCalc: () => navTo('calc')
  }) : page === 'processing' ? React.createElement(V1ProcessingPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onCalc: () => navTo('calc')
  }) : page === 'speed' ? React.createElement(V1SpeedPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onCalc: () => navTo('calc')
  }) : page === 'lending' ? React.createElement(V1LendingPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onTalk: () => navTo('talk')
  }) : page === 'terminals' ? React.createElement(V1TerminalsPage, {
    accent: accent,
    onApply: () => openApp(null, null),
    onTalk: () => navTo('talk')
  }) : home;
  return React.createElement(React.Fragment, null, React.createElement(V1Chrome, {
    page: page,
    navTo: navTo,
    accent: accent,
    openApp: () => openApp(null, null)
  }), React.createElement("div", {
    style: {
      opacity: transitioning ? 0 : 1,
      transform: transitioning ? 'translateY(6px)' : 'translateY(0)',
      transition: 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)'
    }
  }, body), React.createElement(FooterBlock, {
    accent: accent,
    brand: V1Chrome.brand,
    onNav: navTo
  }), React.createElement(V1ApplicationFlow, {
    open: appOpen,
    onClose: () => {
      setAppOpen(false);
      setAppFromEmail(false);
    },
    prefill: appPrefill,
    accent: accent,
    startStep: appFromEmail ? 1 : 0,
    autoOpenPlaid: appFromEmail,
    onDraftChange: saveApplyDraft,
    onComplete: clearApplyDraft
  }), React.createElement(V1CookieConsent, {
    onNav: navTo
  }));
}
Object.assign(window, {
  Variation1,
  V1Chrome,
  V1Hero
});