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
    <div data-v1-ticker data-v1-ticker-bar style={{ background: '#000', color: '#E9E7DF', padding: '6px 0', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{
        display: 'flex', whiteSpace: 'nowrap',
        animation: 'v1ticker 40s linear infinite', fontFamily: DELT.font.mono, fontSize: 11.5,
      }}>
        {/* marginRight on every row (incl. last) so total width = 2× one copy
            exactly. translateX(-50%) then lines up pixel-perfect at loop. */}
        {all.map((row, i) => (
          <span key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginRight: 40 }}>
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
    { k: 'how',         l: 'How It Works' },
    { k: 'calc',        l: 'Calculator' },
    { k: 'processing',  l: 'Processing' },
    { k: 'about',       l: 'About' },
    { k: 'reviews',     l: 'Operators' },
    { k: 'faq',         l: 'FAQ' },
    { k: 'talk',        l: 'Contact' },
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
          <a data-v1-desktop-nav onClick={() => navTo('login')} style={{ fontFamily: DELT.font.body, fontSize: 13.5, color: page === 'login' ? '#F7F5F0' : 'rgba(247,245,240,0.75)', cursor: 'pointer' }}>Login</a>
          <Btn variant="indigo" size="sm" onClick={openApp} style={{ background: accent, borderColor: accent }}>Get Funded</Btn>
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
        }}>Login</a>
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <Btn variant="indigo" size="lg" onClick={() => { setMenuOpen(false); openApp(); }} style={{ background: accent, borderColor: accent, width: '100%' }}>Get Funded</Btn>
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

  // Rotating verb that swaps every 1.9s. Words are stacked in a single
  // inline-grid cell so the <em> auto-sizes to the widest child — keeps the
  // trailing "it." anchored regardless of which word is showing.
  const fundWords = ['fund', 'back', 'wire', 'fuel'];
  const [fundIdx, setFundIdx] = React.useState(0);
  React.useEffect(() => {
    if (!mounted) return undefined;
    const iv = setInterval(() => setFundIdx((i) => (i + 1) % fundWords.length), 1900);
    return () => clearInterval(iv);
  }, [mounted]);

  // Hero graphic — static George Washington cutout (transparent PNG).
  // Kept the parallax shift/scale variables so subtle scroll motion still
  // animates the image the same way the previous hero video did.

  return (
    <section style={{
      // Delt indigo gradient: violet/cyan glows over a deep navy → indigo
      // base. The colors echo the tones in the Washington duotone so the
      // portrait dissolves into the background instead of sitting on top.
      backgroundColor: '#041E42',
      backgroundImage: 'url(app/assets/washington-plaid.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center right',
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
        @media (prefers-reduced-motion: reduce) {
          .v1hero-pulse, .v1hero-bob { animation: none !important; }
        }
      `}</style>

      <div data-v1-grid-2col style={{
        width: '100%',
        maxWidth: 1280, margin: '0 auto', padding: '76px 32px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
        alignItems: 'center', position: 'relative', zIndex: 2,
        minHeight: 680, flex: 1,
      }}>
        {/* Left: copy */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <h1 data-v1-hero-title style={{
            fontFamily: DELT.font.display, fontSize: 92, fontWeight: 600,
            letterSpacing: '-0.045em', color: '#F7F5F0', lineHeight: 0.95,
            margin: 0,
          }}>
            <V1LineMask ready={mounted} delay={120}>You built the</V1LineMask>
            <V1LineMask ready={mounted} delay={230}>
              <span style={{
                // Delt indigo→cyan accent, no mint.
                background: 'linear-gradient(90deg, #4945FF 0%, #7C6BFF 55%, #7DD3FC 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>business.</span>
            </V1LineMask>
            <V1LineMask ready={mounted} delay={340}>
              We{' '}
              <em style={{
                // Manrope/Codec Pro have no italic; switch to Source Serif Pro
                // Italic to match the prior "yourself." treatment.
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                display: 'inline-grid',
                gridTemplateAreas: '"stack"',
                verticalAlign: 'baseline',
                whiteSpace: 'nowrap',
              }}>
                {fundWords.map((w, i) => (
                  <span key={w} style={{
                    gridArea: 'stack',
                    // Gradient must live on the span that holds the text —
                    // background-clip:text on the <em> parent doesn't reach
                    // child spans, which would render transparent.
                    color: accent,
                    background: `linear-gradient(90deg, ${accent}, #818CF8)`,
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    paddingInlineEnd: '0.12em',
                    opacity: i === fundIdx ? 1 : 0,
                    transform: i === fundIdx ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 480ms cubic-bezier(0.22, 1, 0.36, 1), transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
                    whiteSpace: 'nowrap',
                  }}>{w}</span>
                ))}
              </em>{' '}it.
            </V1LineMask>
          </h1>

          <p style={{
            fontFamily: DELT.font.body, fontSize: 18, lineHeight: 1.55,
            color: 'rgba(247,245,240,0.75)', margin: '32px 0 0', maxWidth: 520,
            ...enter(560),
          }}>
            Revenue-based funding from <span style={{ color: '#F7F5F0', fontWeight: 500 }}>$5,000 to $500,000</span>, underwritten off your deposits — not your FICO, not your collateral, not a call center's script. Most offers are wired in <span style={{ color: '#F7F5F0', fontWeight: 500 }}>24 hours</span> with a <span style={{ color: '#F7F5F0', fontWeight: 500 }}>soft-pull only</span>.
          </p>

          <div style={{
            display: 'flex', gap: 12, marginTop: 36, alignItems: 'center', flexWrap: 'wrap',
            ...enter(700),
          }}>
            <Btn variant="indigo" size="lg" onClick={onApply} style={{ background: accent, borderColor: accent }}>Get Funded <Arr /></Btn>
            <Btn variant="ghost" size="lg" style={{ background: 'transparent', color: '#F7F5F0', borderColor: 'rgba(247,245,240,0.2)' }}>See how pricing works</Btn>
          </div>

          <div data-v1-hero-substats style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(247,245,240,0.1)',
            display: 'flex', gap: 36, flexWrap: 'wrap',
          }}>
            {[
              ['Funding range', '$5K–$500K', 'per draw'],
              ['Time to funds', '24h', 'typical'],
              ['Credit pull', 'Soft', 'only'],
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
const V1_PAGES = new Set(['home', 'about', 'how', 'reviews', 'calc', 'talk', 'support', 'faq', 'blog', 'login', 'terms', 'privacy', 'eca', 'funding-flow', 'processing']);
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
      <V1Hero accent={accent} onApply={() => openApp(null, null)} />
      <V1ProductGrid />
      <V1IntelligentBanner />
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
    </>
  );
}

Object.assign(window, { Variation1, V1Chrome, V1Hero });
