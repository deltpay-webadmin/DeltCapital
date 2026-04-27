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
  return (
    <div style={{ background: '#000', color: '#E9E7DF', padding: '6px 0', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{
        display: 'flex', gap: 40, whiteSpace: 'nowrap',
        animation: 'v1ticker 40s linear infinite', fontFamily: DELT.font.mono, fontSize: 11.5,
      }}>
        {all.map((row, i) => (
          <span key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ color: 'rgba(233,231,223,0.5)' }}>{row[0]}</span>
            <span>{row[1]}</span>
            <span style={{ color: accent }}>{row[2]}</span>
            <span style={{ color: DELT.colors.ok, fontSize: 10 }}>● {row[3]}</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes v1ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

function V1Chrome({ page, navTo, accent, openApp }) {
  const links = [
    { k: 'how',     l: 'How It Works' },
    { k: 'calc',    l: 'Calculator' },
    { k: 'about',   l: 'About' },
    { k: 'reviews', l: 'Operators' },
    { k: 'faq',     l: 'FAQ' },
    { k: 'talk',    l: 'Talk' },
  ];
  const handleNav = (k) => { navTo(k); };
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
        <nav style={{ display: 'flex', gap: 28 }}>
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
          <a onClick={() => navTo('login')} style={{ fontFamily: DELT.font.body, fontSize: 13.5, color: page === 'login' ? '#F7F5F0' : 'rgba(247,245,240,0.75)', cursor: 'pointer' }}>Login</a>
          <Btn variant="indigo" size="sm" onClick={openApp} style={{ background: accent, borderColor: accent }}>Get Funded</Btn>
        </div>
      </div>
    </header>
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

function V1Hero({ accent, onApply }) {
  const mounted = useV1Mounted(80);
  const scrollY = useV1ScrollY();
  // Parallax: only active while the hero is on screen (roughly first 900px).
  const py = Math.min(scrollY, 900);
  const videoShift = -py * 0.12;
  const videoScale = 1 + Math.min(py, 600) * 0.00018;
  const enter = (base) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0, 14px, 0)',
    transition: `opacity 820ms cubic-bezier(0.22, 1, 0.36, 1) ${base}ms, transform 820ms cubic-bezier(0.22, 1, 0.36, 1) ${base}ms`,
  });

  return (
    <section style={{
      background: '#041E42',
      color: '#F7F5F0',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <style>{`
        @keyframes v1heroPulse { 0% { transform: translate(-50%,-50%) scale(1); opacity: 0.55; } 70% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; } 100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; } }
        @keyframes v1heroBob { 0%, 100% { transform: translateY(0); opacity: 0.55; } 50% { transform: translateY(5px); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .v1hero-pulse, .v1hero-bob { animation: none !important; }
        }
      `}</style>

      {/* Dateline */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '20px 32px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: DELT.font.mono, fontSize: 11.5, color: 'rgba(247,245,240,0.5)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        position: 'relative', zIndex: 3,
        ...enter(0),
      }}>
        <span>Vol. VII · Q1 2026</span>
        <span>Direct lender · Est. 2019</span>
        <span style={{ color: accent, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ position: 'relative', width: 7, height: 7 }}>
            <span style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 7, height: 7, borderRadius: 999,
              background: accent, boxShadow: `0 0 10px ${accent}`,
              zIndex: 1,
            }} />
            <span className="v1hero-pulse" style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 7, height: 7, borderRadius: 999,
              background: accent,
              animation: 'v1heroPulse 2.2s cubic-bezier(0.22, 1, 0.36, 1) infinite',
              willChange: 'transform, opacity',
            }} />
          </span>
          Quoting now
        </span>
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '56px 32px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
        alignItems: 'center', position: 'relative', zIndex: 2,
        minHeight: 680,
      }}>
        {/* Left: copy */}
        <div>
          <h1 style={{
            fontFamily: DELT.font.display, fontSize: 92, fontWeight: 600,
            letterSpacing: '-0.045em', color: '#F7F5F0', lineHeight: 0.95,
            margin: 0,
          }}>
            <V1LineMask ready={mounted} delay={120}>You built the</V1LineMask>
            <V1LineMask ready={mounted} delay={230}>business.</V1LineMask>
            <V1LineMask ready={mounted} delay={340}>
              We{' '}
              <em style={{
                // Manrope/Codec Pro have no italic; switch to Source Serif Pro
                // Italic to match the prior "yourself." treatment.
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                color: accent,
                background: `linear-gradient(90deg, ${accent}, #818CF8)`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>fund</em>{' '}it.
            </V1LineMask>
          </h1>

          <p style={{
            fontFamily: DELT.font.body, fontSize: 18, lineHeight: 1.55,
            color: 'rgba(247,245,240,0.75)', margin: '32px 0 0', maxWidth: 520,
            ...enter(560),
          }}>
            Revenue-based funding from <span style={{ color: '#F7F5F0', fontWeight: 500 }}>$5,000 to $500,000</span>, underwritten off deposits — not your FICO, not your collateral, not a call center's script. Median factor <span style={{ color: '#F7F5F0', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>1.18×</span>. Median time to funds, <span style={{ color: '#F7F5F0', fontWeight: 500 }}>24 hours</span>.
          </p>

          <div style={{
            display: 'flex', gap: 12, marginTop: 36, alignItems: 'center', flexWrap: 'wrap',
            ...enter(700),
          }}>
            <Btn variant="indigo" size="lg" onClick={onApply} style={{ background: accent, borderColor: accent }}>Get Funded <Arr /></Btn>
            <Btn variant="ghost" size="lg" style={{ background: 'transparent', color: '#F7F5F0', borderColor: 'rgba(247,245,240,0.2)' }}>See how pricing works</Btn>
          </div>

          <div style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(247,245,240,0.1)',
            display: 'flex', gap: 36, flexWrap: 'wrap',
          }}>
            {[
              ['Today\'s median', '1.18×', 'factor'],
              ['Time to funds', '24h', 'median'],
              ['Soft-pull', 'Yes', 'only'],
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

        {/* Right: video, bleeding to the right edge */}
        <div style={{
          position: 'relative',
          alignSelf: 'stretch',
          marginRight: -32,
          marginTop: -32,
          marginBottom: -32,
          overflow: 'hidden',
          clipPath: mounted ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
          transition: 'clip-path 1100ms cubic-bezier(0.76, 0, 0.24, 1) 160ms',
          willChange: mounted ? 'auto' : 'clip-path',
        }}>
          <video
            src="app/assets/hero.mp4"
            autoPlay loop muted playsInline
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: `translate3d(0, ${videoShift}px, 0) scale(${videoScale})`,
              transformOrigin: 'center center',
              willChange: 'transform',
              // Brand tint (step 1 of 2): rotate the baked-in violet ~25° back
              // toward Electric Indigo, with a gentle saturation/brightness
              // lift so the shift doesn't flatten the scene.
              filter: 'hue-rotate(-25deg) saturate(1.08) brightness(1.02)',
            }}
          />
          {/* Brand tint (step 2 of 2): Electric Indigo `mix-blend-mode: color`
              overlay at ~14% pulls any remaining chroma toward #4945FF while
              preserving luminance (motion, highlights, shadows intact). */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: '#4945FF',
            mixBlendMode: 'color',
            opacity: 0.14,
            pointerEvents: 'none',
          }} />
          {/* Midnight Steel soft-light pass for overall brand cohesion with
              the Midnight Steel hero background. */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: '#041E42',
            mixBlendMode: 'soft-light',
            opacity: 0.35,
            pointerEvents: 'none',
          }} />
          {/* Left-edge fade so video melts into the copy column */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #041E42 0%, rgba(4,30,66,0.6) 12%, rgba(4,30,66,0) 32%)',
            pointerEvents: 'none',
          }} />
          {/* Top/bottom subtle fades to help the band read as a hero */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(4,30,66,0.25) 0%, transparent 15%, transparent 85%, rgba(4,30,66,0.4) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Floating card caption — subtle, editorial */}
          <div style={{
            position: 'absolute', bottom: 28, right: 28,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
            pointerEvents: 'none',
            ...enter(1100),
          }}>
            <div style={{
              fontFamily: DELT.font.mono, fontSize: 10.5, color: 'rgba(247,245,240,0.55)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>Fig. 01 — The offer, in motion</div>
            <div style={{
              width: 40, height: 1, background: 'rgba(247,245,240,0.25)',
            }} />
          </div>
        </div>
      </div>

      {/* Bottom rule with scroll cue */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '48px 32px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(247,245,240,0.08)', marginTop: 32,
        fontFamily: DELT.font.mono, fontSize: 11, color: 'rgba(247,245,240,0.45)',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        position: 'relative', zIndex: 2,
        ...enter(1000),
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          Scroll — the numbers
          <span className="v1hero-bob" style={{
            display: 'inline-block',
            animation: 'v1heroBob 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite',
            willChange: 'transform, opacity',
          }}>
            <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
              <path d="M5 1v9M1.5 7.5 5 11l3.5-3.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
        <span>$200M+ deployed · 2,850+ funded · since 2019</span>
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
const V1_PAGES = new Set(['home', 'about', 'how', 'reviews', 'calc', 'talk', 'support', 'faq', 'blog', 'login', 'terms', 'privacy', 'eca']);
function readPageFromHash() {
  if (typeof window === 'undefined') return 'home';
  const h = (window.location.hash || '').replace(/^#\/?/, '');
  return V1_PAGES.has(h) ? h : 'home';
}

function Variation1() {
  const accent = V1.blue; // Atlassian-preview blue for V1
  const [page, setPage] = React.useState(readPageFromHash);
  const [transitioning, setTransitioning] = React.useState(false);
  const [appOpen, setAppOpen] = React.useState(false);
  const [calcState, setCalcState] = React.useState({ revenue: 0, tib: '', cards: null, cardSales: 0 });
  const [appPrefill, setAppPrefill] = React.useState(null);

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
  const openApp = (c, est) => { if (est) setAppPrefill(est); setAppOpen(true); };

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
      <V1Hero accent={accent} onApply={() => openApp(null, null)} />
      <V1CompareSection />
      <V1UseCasesSection />
      <V1CalcSection calcState={calcState} setCalcState={setCalcState} onApply={openApp} onNavHow={() => navTo('how')} />
      <V1CTASection onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} />
    </>
  );

  const body =
    page === 'about'   ? <V1AboutPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'how'     ? <HowItWorksPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'reviews' ? <V1ReviewsPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'calc'    ? <V1CalculatorPage accent={accent} onApply={(data) => openApp(null, data)} onNavHow={() => navTo('how')} /> :
    page === 'talk'    ? <V1BookingPage accent={accent} onApply={() => openApp(null, null)} /> :
    page === 'support' ? <V1SupportPage accent={accent} onTalk={() => navTo('talk')} onApply={() => openApp(null, null)} /> :
    page === 'faq'     ? <V1FAQPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'blog'    ? <V1BlogPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'login'   ? <V1LoginPage onClose={() => navTo('home')} onApply={() => openApp(null, null)} onSignIn={() => {}} onNavLegal={navTo} /> :
    page === 'terms'   ? <V1TermsOfUse onBack={() => navTo('home')} onNavPrivacy={() => navTo('privacy')} /> :
    page === 'privacy' ? <V1PrivacyPolicy onBack={() => navTo('home')} onNavTerms={() => navTo('terms')} /> :
    page === 'eca'     ? <V1ElectronicCommunications onBack={() => navTo('home')} /> :
    home;

  return (
    <>
      {V1Chrome({ page, navTo, accent, openApp: () => openApp(null, null) })}
      <div style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {body}
      </div>
      <FooterBlock accent={accent} brand={V1Chrome.brand} onNav={navTo} />
      <V1ApplicationFlow open={appOpen} onClose={() => setAppOpen(false)} prefill={appPrefill} accent={accent} />
    </>
  );
}

Object.assign(window, { Variation1, V1Chrome, V1Hero });
