// ============================================================================
// Delt Capital — Plaid-structured homepage sections (3 through 9).
//
// These sections mirror Plaid.com's section rhythm but are skinned in Delt's
// warm-paper + indigo palette and populated with Delt content. They assume
// the Babel-standalone runtime, so there are no imports — React, DELT,
// DeltContent, fmt, Btn, Arr, useV1InView, V1CountUp, etc. are all read from
// window globals. Everything is exported via Object.assign at the bottom.
//
// Design constraints honoured throughout:
//  - Strict Delt indigo palette (#4945FF), never Plaid mint/teal.
//  - No external images/deps — every UI mock is inline SVG/HTML.
//  - Every animation is CSS keyframes or RAF, gated on prefers-reduced-motion.
//  - Every section collapses to a single column at <=768px via a shared
//    responsive hook (useIsMobile) + inline conditionals.
// ============================================================================

// Literal palette echoes of the brief. We read the shared DELT tokens for the
// brand-managed values, but the DNA/banner want specific hues (violet #8B5CF6,
// cyan #7DD3FC) that differ from DELT.colors.violet (which is aliased to
// indigo in shared.jsx), so we keep those as locals here.
const PLX = {
  navy: '#041E42',       // deep hero navy — dark bands only
  navyMid: '#0A1A6E',    // gradient partner for the dark banner
  indigo: '#4945FF',
  indigoDeep: '#3730A3',
  softIndigo: '#7C6BFF',
  violet: '#8B5CF6',     // DNA strand B (brief-specified, not DELT.colors.violet)
  cyan: '#7DD3FC',       // accent glow, DNA strand A
  ink: '#0F0E17',
};

// One shared responsive signal. Inline styles can't use media queries, so we
// branch layout on this boolean. Updates live on resize so a device rotation
// or a Playwright viewport change re-lays-out without a reload.
function useIsMobile(bp = 768) {
  const [m, setM] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(`(max-width:${bp}px)`).matches : false
  );
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(`(max-width:${bp}px)`);
    const on = (e) => setM(e.matches);
    // addEventListener is the modern API; addListener is the Safari<14 fallback.
    if (mq.addEventListener) mq.addEventListener('change', on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);
      else mq.removeListener(on);
    };
  }, [bp]);
  return m;
}

// Reduced-motion signal — used to statically render the DNA + marquees.
const PLX_REDUCED = typeof window !== 'undefined' && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A small circular "→" affordance shared by the product cards (top-right of
// each card in Plaid's grid). Kept local so cards stay self-contained.
function PlxArrowCircle({ dark = false }) {
  return (
    <span style={{
      width: 34, height: 34, borderRadius: 999, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: `1px solid ${dark ? 'rgba(247,245,240,0.25)' : DELT.colors.line}`,
      color: dark ? '#F7F5F0' : DELT.colors.ink,
      transition: 'background .15s, transform .15s',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6"
          fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// ============================================================================
// SECTION 3 — V1LogoMarquee
// Auto-scrolling monotone wordmarks on the hero's dark navy, so the eye reads
// hero → "trusted by" as one continuous dark band before the paper begins.
// ============================================================================
function V1LogoMarquee() {
  // Processor / partner brands. Rendered as monospace wordmarks (no logo files)
  // to match Plaid's monotone treatment.
  const brands = ['Paysafe', 'NMI', 'Global Payments', 'Goat Payments', 'PAX',
    'Verifone', 'Landi', 'Korona', 'Plaid', 'Supabase'];
  // Duplicate the array so the -50% translate loops seamlessly.
  const loop = [...brands, ...brands];

  return (
    <section aria-label="Trusted by leading payment processors" style={{
      background: PLX.navy, padding: '30px 0 34px', overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <style>{`
        @keyframes plxMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .plx-marquee-track { animation: plxMarquee 60s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .plx-marquee-track { animation: none; } }
      `}</style>

      {/* Eyebrow */}
      <div style={{
        textAlign: 'center', fontFamily: DELT.font.mono, fontSize: 11,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(247,245,240,0.5)', marginBottom: 18,
      }}>Trusted across the payments stack</div>

      {/* Fade-out edges keep wordmarks from hard-clipping at the viewport edge. */}
      <div style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
        maskImage: 'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
      }}>
        <div className="plx-marquee-track" style={{
          display: 'flex', width: 'max-content', gap: 56, alignItems: 'center',
          height: 32, whiteSpace: 'nowrap',
        }}>
          {loop.map((b, i) => (
            <span key={i} style={{
              fontFamily: DELT.font.mono, fontSize: 14, fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(247,245,240,0.55)',
            }}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 4 — V1ProductGrid ("Built for every operator")
// Plaid's 2-large-over-3-medium card grid on warm paper. Each card carries a
// tiny hand-built UI mock so the grid reads like real product surfaces, not
// marketing filler.
// ============================================================================

// A generic hoverable card shell — the lift/shadow on hover is the Plaid tell.
function PlxProductCard({ title, desc, children, large, mobile }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: DELT.colors.card, border: `1px solid ${DELT.colors.line}`,
        borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column',
        // Larger top-row cards get more breathing room for their bigger mocks.
        minHeight: large ? 300 : 240,
        transform: hover && !mobile ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover && !mobile ? '0 20px 40px rgba(15,14,23,0.08)' : '0 1px 2px rgba(15,14,23,0.03)',
        transition: 'transform .18s cubic-bezier(0.22,1,0.36,1), box-shadow .18s',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
        <div>
          <h3 style={{
            margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
            fontSize: large ? 24 : 20, letterSpacing: '-0.02em', color: DELT.colors.ink,
          }}>{title}</h3>
          <p style={{
            margin: '8px 0 0', fontFamily: DELT.font.body, fontSize: 14.5,
            lineHeight: 1.5, color: DELT.colors.inkMute, maxWidth: 320,
          }}>{desc}</p>
        </div>
        <PlxArrowCircle />
      </div>
      {/* Mock lives at the bottom, pushed down so cards align their tops. */}
      <div style={{ marginTop: 'auto', paddingTop: 22 }}>{children}</div>
    </div>
  );
}

// ---- Card mocks (pure SVG/HTML) --------------------------------------------

// 1. Revenue-based funding — a compact offer tile.
function PlxMockOffer() {
  return (
    <div style={{
      background: DELT.colors.paperWarm, border: `1px solid ${DELT.colors.line}`,
      borderRadius: 12, padding: 16,
    }}>
      <div style={{ fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.12em', color: DELT.colors.inkMute, textTransform: 'uppercase', marginBottom: 8 }}>Offer · ready</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: DELT.font.display, fontSize: 30, fontWeight: 700, color: DELT.colors.indigo, letterSpacing: '-0.02em' }}>$95,000</span>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 14, color: DELT.colors.ink, fontWeight: 500 }}>1.16×</span>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 12, color: DELT.colors.ok, background: 'rgba(15,122,90,0.10)', padding: '3px 9px', borderRadius: 999 }}>24h to funds</span>
      </div>
    </div>
  );
}

// 2. Instant approvals — soft-pull → range → offer progress rail.
function PlxMockApprovals() {
  const steps = ['Soft pull', 'Range', 'Offer'];
  return (
    <div style={{ background: DELT.colors.paperWarm, border: `1px solid ${DELT.colors.line}`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        {steps.map((s, i) => (
          <span key={s} style={{
            fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.06em',
            textTransform: 'uppercase', fontWeight: i < 2 ? 600 : 400,
            color: i < 2 ? DELT.colors.indigo : DELT.colors.inkMute,
          }}>{s}</span>
        ))}
      </div>
      {/* 80% progress rail. */}
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(73,69,255,0.12)', overflow: 'hidden' }}>
        <div style={{ width: '80%', height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})` }} />
      </div>
      <div style={{ marginTop: 10, fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute }}>Ranged in <strong style={{ color: DELT.colors.ink }}>60 seconds</strong></div>
    </div>
  );
}

// 3. Agent portal — commissions tile with a small line chart.
function PlxMockCommissions() {
  // Hand-plotted sparkline points (0..100 domain), rising trend.
  const pts = '2,40 16,36 30,38 44,28 58,30 72,18 86,20 100,10';
  return (
    <div style={{ background: DELT.colors.paperWarm, border: `1px solid ${DELT.colors.line}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Commissions this month</div>
      <div style={{ fontFamily: DELT.font.display, fontSize: 26, fontWeight: 700, color: DELT.colors.ink, letterSpacing: '-0.02em', margin: '4px 0 8px' }}>$12,480</div>
      <svg width="100%" height="46" viewBox="0 0 100 46" preserveAspectRatio="none">
        <polyline points={pts} fill="none" stroke={DELT.colors.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <polyline points={`${pts} 100,46 2,46`} fill="rgba(73,69,255,0.08)" stroke="none" />
      </svg>
    </div>
  );
}

// 4. Merchant processing — processor chips + board time.
function PlxMockProcessors() {
  const procs = ['Paysafe', 'NMI', 'Global', 'Goat'];
  return (
    <div style={{ background: DELT.colors.paperWarm, border: `1px solid ${DELT.colors.line}`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {procs.map((p) => (
          <span key={p} style={{
            fontFamily: DELT.font.mono, fontSize: 11.5, color: DELT.colors.inkSoft,
            border: `1px solid ${DELT.colors.line}`, background: '#fff',
            padding: '5px 10px', borderRadius: 8,
          }}>{p}</span>
        ))}
      </div>
      <span style={{ fontFamily: DELT.font.mono, fontSize: 12, color: DELT.colors.indigo, background: 'rgba(73,69,255,0.08)', padding: '4px 10px', borderRadius: 999 }}>Board in 48h</span>
    </div>
  );
}

// 5. Terminal financing — three terminal glyphs + $0 down.
function PlxMockTerminals() {
  const Term = () => (
    <svg width="30" height="42" viewBox="0 0 30 42" fill="none">
      <rect x="1.5" y="1.5" width="27" height="39" rx="4" stroke={DELT.colors.inkSoft} strokeWidth="1.4" />
      <rect x="6" y="6" width="18" height="11" rx="1.5" fill="rgba(73,69,255,0.14)" stroke={DELT.colors.indigo} strokeWidth="1" />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <circle key={`${r}-${c}`} cx={9 + c * 6} cy={24 + r * 5} r="1.4" fill={DELT.colors.inkMute} />
      )))}
    </svg>
  );
  return (
    <div style={{ background: DELT.colors.paperWarm, border: `1px solid ${DELT.colors.line}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: 14 }}><Term /><Term /><Term /></div>
      <span style={{ fontFamily: DELT.font.display, fontSize: 20, fontWeight: 700, color: DELT.colors.indigo }}>$0 down</span>
    </div>
  );
}

function V1ProductGrid() {
  const mobile = useIsMobile();
  return (
    <section data-v1-section style={{ background: DELT.colors.paper, padding: mobile ? '64px 0' : '120px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px' }}>
        {/* Header row */}
        <V1Reveal>
          <h2 data-v1-section-title style={{
            margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
            fontSize: mobile ? 34 : 72, letterSpacing: '-0.03em',
            lineHeight: 1.0, color: DELT.colors.ink, maxWidth: 780,
          }}>Built for every operator, every stage.</h2>
          <p style={{
            margin: '20px 0 0', fontFamily: DELT.font.body, fontSize: mobile ? 16 : 18,
            lineHeight: 1.55, color: DELT.colors.inkSoft, maxWidth: 560,
          }}>Revenue-based capital that adapts to your book — merchant, agent, or ISO.</p>
          <div style={{ marginTop: 24 }}>
            <a href="#how" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontFamily: DELT.font.body, fontSize: 15, fontWeight: 500,
              color: DELT.colors.indigo,
            }}>See how it works <Arr /></a>
          </div>
        </V1Reveal>

        {/* Top row — 2 large cards */}
        <div data-v1-grid-2col style={{
          display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 16 : 24, marginTop: mobile ? 40 : 56,
        }}>
          <PlxProductCard large mobile={mobile} title="Revenue-based funding" desc="Underwritten off deposits, not FICO."><PlxMockOffer /></PlxProductCard>
          <PlxProductCard large mobile={mobile} title="Instant approvals" desc="Ranged offers in 60 seconds."><PlxMockApprovals /></PlxProductCard>
        </div>

        {/* Bottom row — 3 medium cards */}
        <div data-v1-grid-3col style={{
          display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: mobile ? 16 : 24, marginTop: mobile ? 16 : 24,
        }}>
          <PlxProductCard mobile={mobile} title="Agent portal" desc="Route your book, keep 100% of the residual."><PlxMockCommissions /></PlxProductCard>
          <PlxProductCard mobile={mobile} title="Merchant processing" desc="ISO-friendly rates across the top 12 processors."><PlxMockProcessors /></PlxProductCard>
          <PlxProductCard mobile={mobile} title="Terminal financing" desc="PAX, Verifone, Landi. Own or lease."><PlxMockTerminals /></PlxProductCard>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 5 — V1IntelligentBanner (dark card + animated DNA double-helix)
// The signature moment: two interlacing sine strands rotating slowly, nodes
// pulsing at the cross-over points, all softly glowing. Pure inline SVG.
// ============================================================================

// The DNA helix, isolated so its keyframes live with it. Built parametrically:
// two vertical sine strands 180° out of phase, sampled into cubic-Bezier paths,
// with nodes where the strands cross (i.e. where the sine == the axis).
function PlxDnaHelix({ size = 400 }) {
  // Geometry: strands run top→bottom along a central axis, waving left/right.
  const H = 420, W = 260, cx = W / 2;      // logical SVG canvas
  const amp = 78;                           // horizontal wave amplitude
  const turns = 3.2;                        // number of full sine cycles
  const samples = 48;                       // path smoothness

  // Build a smooth path for a strand at a given phase offset (radians).
  const strandPath = (phase) => {
    let d = '';
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const y = t * H;
      const x = cx + amp * Math.sin(t * turns * Math.PI * 2 + phase);
      d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  };

  // Cross-over points: where the two strands (phase 0 and phase π) meet, i.e.
  // where sin(θ) == sin(θ+π) → only where both are ~0 (the axis crossings).
  // We instead place nodes at every half-turn where the strands are closest,
  // linking them with short "rungs" like a ladder — the classic helix read.
  const rungs = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const theta = t * turns * Math.PI * 2;
    const xA = cx + amp * Math.sin(theta);
    const xB = cx + amp * Math.sin(theta + Math.PI);
    const y = t * H;
    // A rung is meaningful roughly every half cycle where strands are spread;
    // sample every ~4th point to avoid clutter (~10 rungs total).
    if (i % 4 === 0) rungs.push({ xA, xB, y, k: i });
  }

  return (
    <div aria-hidden style={{ width: size, maxWidth: '100%', margin: '0 auto' }}>
      <style>{`
        @keyframes dnaRotate { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes dnaPulse  { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes dnaFloat  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .plx-dna-spin { transform-box: fill-box; transform-origin: center; animation: dnaRotate 30s linear infinite; }
        .plx-dna-node { animation: dnaPulse 3s ease-in-out infinite; }
        .plx-dna-float { animation: dnaFloat 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .plx-dna-spin, .plx-dna-node, .plx-dna-float { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {/* Luminous soft-glow filter applied to strands + nodes. */}
          <filter id="plxDnaGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="plxStrandA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PLX.cyan} />
            <stop offset="100%" stopColor={PLX.indigo} />
          </linearGradient>
          <linearGradient id="plxStrandB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PLX.violet} />
            <stop offset="100%" stopColor={PLX.softIndigo} />
          </linearGradient>
        </defs>

        {/* The whole helix spins as a unit (Y-axis rotation reads as 3D twist). */}
        <g className="plx-dna-spin" style={{ transformOrigin: `${cx}px ${H / 2}px` }} filter="url(#plxDnaGlow)">
          {/* Ladder rungs behind the strands. */}
          {rungs.map((r) => (
            <line key={`rung-${r.k}`} x1={r.xA} y1={r.y} x2={r.xB} y2={r.y}
              stroke="rgba(125,211,252,0.35)" strokeWidth="1.5" />
          ))}
          {/* The two strands. */}
          <path d={strandPath(0)} fill="none" stroke="url(#plxStrandA)" strokeWidth="3.5" strokeLinecap="round" />
          <path d={strandPath(Math.PI)} fill="none" stroke="url(#plxStrandB)" strokeWidth="3.5" strokeLinecap="round" />
          {/* Nodes at both ends of every rung, pulsing (staggered by index). */}
          {rungs.map((r, i) => (
            <g key={`nodes-${r.k}`}>
              <circle className="plx-dna-node" cx={r.xA} cy={r.y} r="5.5" fill={PLX.indigo}
                style={{ animationDelay: `${(i % 5) * 0.35}s` }} />
              <circle className="plx-dna-node" cx={r.xB} cy={r.y} r="5.5" fill={PLX.indigo}
                style={{ animationDelay: `${(i % 5) * 0.35 + 0.5}s` }} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

// A network-globe on the left of the banner, echoing Plaid's Lincoln composition.
// Wireframe latitude/longitude lines + orbiting nodes. Static SVG, cheap.
function PlxNetworkGlobe({ size = 380 }) {
  const R = 160;
  const lats = [ -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9 ];
  const lons = [ -60, -30, 0, 30, 60 ];
  const nodes = [
    { x: -0.55, y: -0.40 }, { x:  0.20, y: -0.55 }, { x:  0.60, y: -0.15 },
    { x: -0.30, y:  0.10 }, { x:  0.45, y:  0.30 }, { x: -0.65, y:  0.35 },
    { x:  0.05, y:  0.55 }, { x: -0.10, y: -0.20 }, { x:  0.35, y: -0.05 },
  ];
  return (
    <svg aria-hidden viewBox={`-${R + 40} -${R + 40} ${(R + 40) * 2} ${(R + 40) * 2}`} width={size} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="plxGlobeFade" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(125,211,252,0.28)" />
          <stop offset="70%" stopColor="rgba(125,211,252,0.05)" />
          <stop offset="100%" stopColor="rgba(4,30,66,0)" />
        </radialGradient>
        <filter id="plxGlobeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <circle cx="0" cy="0" r={R + 30} fill="url(#plxGlobeFade)" />
      <g className="plx-globe-spin" style={{ transformOrigin: '0 0' }}>
        {lats.map((y, i) => (
          <ellipse key={`lat-${i}`} cx="0" cy={y * R} rx={Math.sqrt(1 - y * y) * R} ry={4}
            fill="none" stroke="rgba(125,211,252,0.30)" strokeWidth="1" />
        ))}
        {lons.map((a) => (
          <ellipse key={`lon-${a}`} cx="0" cy="0" rx={Math.abs(Math.sin(a * Math.PI / 180)) * R || 1} ry={R}
            fill="none" stroke="rgba(125,211,252,0.25)" strokeWidth="1" />
        ))}
        <circle cx="0" cy="0" r={R} fill="none" stroke="rgba(125,211,252,0.50)" strokeWidth="1.25" />
        <g filter="url(#plxGlobeGlow)">
          {nodes.map((n, i) => (
            <circle key={`nGlow-${i}`} cx={n.x * R} cy={n.y * R} r="6" fill={PLX.cyan} opacity="0.55" />
          ))}
        </g>
        {nodes.map((n, i) => (
          <circle key={`n-${i}`} cx={n.x * R} cy={n.y * R} r="3" fill={PLX.cyan}
            className="plx-dna-node" style={{ animationDelay: `${(i % 5) * 0.4}s` }} />
        ))}
        {[[0,4],[1,7],[3,6],[2,8]].map(([a,b], i) => {
          const A = nodes[a], B = nodes[b];
          const mx = (A.x + B.x) / 2 * R;
          const my = (A.y + B.y) / 2 * R - 30;
          return (
            <path key={`link-${i}`}
              d={`M ${A.x*R} ${A.y*R} Q ${mx} ${my} ${B.x*R} ${B.y*R}`}
              fill="none" stroke="rgba(125,211,252,0.45)" strokeWidth="1" strokeDasharray="2 4" />
          );
        })}
      </g>
    </svg>
  );
}

function V1IntelligentBanner() {
  const mobile = useIsMobile();
  return (
    <section style={{ background: DELT.colors.paper, padding: mobile ? '20px 0 64px' : '40px 0 120px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 24, minHeight: mobile ? 'auto' : 460,
          background: `radial-gradient(70% 100% at 100% 50%, rgba(125,211,252,0.28) 0%, rgba(4,30,66,0) 55%), radial-gradient(45% 70% at 5% 100%, rgba(139,92,246,0.22) 0%, rgba(4,30,66,0) 60%), linear-gradient(120deg, ${PLX.navy} 0%, ${PLX.navyMid} 55%, ${PLX.indigoDeep} 100%)`,
          border: '1px solid rgba(125,211,252,0.10)',
          boxShadow: '0 40px 100px rgba(4,30,66,0.35)',
        }}>
          <style>{`
            @keyframes plxGlobeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .plx-globe-spin { animation: plxGlobeSpin 90s linear infinite; transform-origin: center; }
            @keyframes plxGeorgeFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            .plx-george-float { animation: plxGeorgeFloat 8s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) {
              .plx-globe-spin, .plx-george-float { animation: none !important; }
            }
          `}</style>

          {/* George portrait — anchored to the right, bleeding off the bottom
             like Plaid's Lincoln. */}
          {!mobile && (
            <div className="plx-george-float" style={{
              position: 'absolute', right: -20, bottom: 0, top: 0,
              width: '55%', pointerEvents: 'none',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            }}>
              <img src="app/assets/washington.png" alt="" aria-hidden
                style={{
                  height: '115%', width: 'auto', maxWidth: '100%',
                  objectFit: 'contain', objectPosition: 'right bottom',
                  opacity: 0.92,
                  filter: 'drop-shadow(0 20px 40px rgba(4,30,66,0.5))',
                }} />
            </div>
          )}

          {/* Network globe — floats between the copy and George. */}
          {!mobile && (
            <div style={{
              position: 'absolute', right: '32%', top: '50%',
              transform: 'translate(50%, -50%)', pointerEvents: 'none', opacity: 0.9,
            }}>
              <PlxNetworkGlobe size={340} />
            </div>
          )}

          {/* Left — copy */}
          <div style={{
            position: 'relative', zIndex: 2, maxWidth: mobile ? '100%' : '52%',
            padding: mobile ? '48px 24px 40px' : '96px 64px',
          }}>
            <div style={{
              fontFamily: DELT.font.mono, fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: PLX.cyan, marginBottom: 20,
            }}>The Delt Engine</div>
            <h2 style={{
              margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
              fontSize: mobile ? 32 : 52, letterSpacing: '-0.025em',
              lineHeight: 1.05, color: '#fff',
            }}>The AI infrastructure behind smarter capital.</h2>
            <p style={{
              margin: '20px 0 0', fontFamily: DELT.font.body, fontSize: 17,
              lineHeight: 1.55, color: 'rgba(247,245,240,0.75)', maxWidth: 440,
            }}>Real-time deposit signals, pattern-of-life scoring, and merchant risk models — running on every application, every renewal, every draw.</p>
            <a href="#how" style={{
              marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: DELT.font.body, fontSize: 15, fontWeight: 500, color: DELT.colors.ink,
              background: '#fff', borderRadius: 999, padding: '13px 24px',
              boxShadow: `0 0 0 4px rgba(125,211,252,0.25), 0 10px 24px rgba(4,30,66,0.35)`,
            }}>Explore intelligent capital <Arr /></a>
          </div>

          {/* Mobile fallback — stacked DNA. */}
          {mobile && (
            <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 40px', display: 'flex', justifyContent: 'center' }}>
              <PlxDnaHelix size={220} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 6 — V1NetworkStats ("A book that gets smarter")
// Layered "funded" notification cards on the left, headline + count-up stat
// grid on the right. Numbers animate in via the shared V1CountUp helper.
// ============================================================================

// A single funded-event notification card. Sizing is uniform; the offset comes
// from an absolute-positioned wrapper so we can pin the card to a spine anchor.
function PlxFundedCard({ name, detail, ago }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '14px 20px', width: 300, maxWidth: '100%',
      boxShadow: '0 14px 34px rgba(15,14,23,0.10)', border: `1px solid ${DELT.colors.line}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ width: 9, height: 9, borderRadius: 999, background: DELT.colors.ok, flexShrink: 0, boxShadow: '0 0 0 3px rgba(15,122,90,0.12)' }} />
        <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 15, color: DELT.colors.ink }}>{name}</span>
        <span style={{ marginLeft: 'auto', fontFamily: DELT.font.mono, fontSize: 11, color: DELT.colors.inkMute }}>{ago}</span>
      </div>
      <div style={{ fontFamily: DELT.font.body, fontSize: 13.5, color: DELT.colors.inkSoft, paddingLeft: 19 }}>{detail}</div>
    </div>
  );
}

// The flowing spine that threads the notification cards — Plaid's signature
// wavy-line motif. Rendered as a single SVG cubic path with a gradient stroke;
// a subtler mirrored path adds the "double ribbon" feel.
function PlxNetworkSpine() {
  // Three braided ribbons of variable opacity for a Plaid-style flowing spine.
  // A wide viewBox lets the spine sweep left-right across the whole left column.
  return (
    <svg aria-hidden viewBox="0 0 480 560" width="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="plxSpineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(125,211,252,0.95)" />
          <stop offset="45%" stopColor="rgba(139,92,246,0.85)" />
          <stop offset="100%" stopColor="rgba(73,69,255,0.65)" />
        </linearGradient>
        <linearGradient id="plxSpineGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.70)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0.45)" />
        </linearGradient>
      </defs>
      <path d="M 80 10 C 320 100, 100 180, 340 260 S 60 380, 380 460 S 140 560, 320 560"
        fill="none" stroke="url(#plxSpineGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 110 10 C 340 100, 130 180, 360 260 S 80 380, 400 460 S 160 560, 340 560"
        fill="none" stroke="url(#plxSpineGrad2)" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <path d="M 50 10 C 290 100, 70 180, 310 260 S 30 380, 350 460 S 110 560, 290 560"
        fill="none" stroke="url(#plxSpineGrad2)" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

function V1NetworkStats() {
  const mobile = useIsMobile();
  const [ref, inView] = useV1InView(0.3);

  // Card anchors along the spine, laid out visually top→bottom to trace it.
  // Each card is ~62px tall, so we space them ~140px apart within a 560px column.
  const cards = [
    { top: 10,  left: 10,  name: 'Bloom Beauty',         detail: 'Funded $65,000 · 1.19× · 24h', ago: '2 min ago' },
    { top: 160, left: 70,  name: 'La Rosa Restaurant',   detail: 'Funded $110,000 · 1.16×',       ago: '1h ago'    },
    { top: 310, left: 30,  name: 'Rosario Construction', detail: 'Wired $180,000 · 1.14×',        ago: 'Now'       },
    { top: 460, left: 90,  name: 'Ward Market',          detail: 'Funded $50,000 · 1.18×',        ago: 'Now'       },
  ];

  return (
    <section data-v1-section ref={ref} style={{ background: DELT.colors.card, padding: mobile ? '64px 0' : '120px 0' }}>
      <div data-v1-grid-2col style={{
        maxWidth: 1200, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px',
        display: 'grid', gridTemplateColumns: mobile ? '1fr' : '45% 55%',
        gap: mobile ? 40 : 64, alignItems: 'center',
      }}>
        {/* Left — spine + threaded notification cards. */}
        {mobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {cards.map((c) => (
              <PlxFundedCard key={c.name} name={c.name} detail={c.detail} ago={c.ago} />
            ))}
          </div>
        ) : (
          <div style={{ position: 'relative', height: 560, width: '100%' }}>
            <PlxNetworkSpine />
            {cards.map((c) => (
              <div key={c.name} style={{
                position: 'absolute', top: c.top, left: c.left,
                filter: 'drop-shadow(0 6px 14px rgba(15,14,23,0.04))',
              }}>
                <PlxFundedCard name={c.name} detail={c.detail} ago={c.ago} />
              </div>
            ))}
          </div>
        )}

        {/* Right — headline + stat grid */}
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: DELT.colors.indigo, marginBottom: 16 }}>The Numbers</div>
          <h2 data-v1-section-title style={{
            margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
            fontSize: mobile ? 30 : 56, letterSpacing: '-0.025em', lineHeight: 1.05, color: DELT.colors.ink,
          }}>A book that gets smarter with every funding.</h2>
          <p style={{ margin: '20px 0 0', fontFamily: DELT.font.body, fontSize: 17, lineHeight: 1.6, color: DELT.colors.inkSoft, maxWidth: 460 }}>
            2,850+ businesses. $200M+ deployed. Every offer we make today is priced on data we've been collecting since 2019.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: mobile ? 24 : 36, marginTop: 40 }}>
            {DeltContent.stats.map((s, i) => (
              <div key={s.l}>
                <div style={{
                  fontFamily: DELT.font.display, fontWeight: 700,
                  fontSize: mobile ? 44 : 64, letterSpacing: '-0.03em', lineHeight: 1,
                  color: i % 2 === 0 ? DELT.colors.indigo : PLX.violet,
                }}>
                  {inView ? <V1CountUp value={s.v} /> : s.v}
                </div>
                <div style={{ marginTop: 8, fontFamily: DELT.font.mono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 7 — V1ProductTabs (dark tabbed "product screenshot" section)
// Three tabs (Capital / Payments / Portal), each cross-fading a hand-built
// mock UI. Adapts Plaid's code-block section to Delt's products.
// ============================================================================

// --- Tab mocks --------------------------------------------------------------

// Capital: an offer screen.
function PlxTabCapital() {
  const rows = [
    { d: 'Weeks 1–8', amt: '$1,240 / wk' },
    { d: 'Weeks 9–16', amt: '$1,240 / wk' },
    { d: 'Weeks 17–24', amt: '$1,240 / wk' },
  ];
  return (
    <div style={{ background: '#fff', color: DELT.colors.ink, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${DELT.colors.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 15 }}>Delt Capital · Offer #10482</span>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 12, color: DELT.colors.ok, background: 'rgba(15,122,90,0.10)', padding: '4px 10px', borderRadius: 999 }}>Ready</span>
      </div>
      <div style={{ padding: 24, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: DELT.colors.inkMute }}>Advance</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 48, fontWeight: 700, color: DELT.colors.indigo, letterSpacing: '-0.03em', lineHeight: 1 }}>$125,000</div>
        </div>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: DELT.colors.inkMute }}>Factor</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 48, fontWeight: 700, color: DELT.colors.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>1.16×</div>
        </div>
      </div>
      <div style={{ padding: '0 24px' }}>
        {rows.map((r) => (
          <div key={r.d} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${DELT.colors.lineSoft}`, fontFamily: DELT.font.body, fontSize: 14 }}>
            <span style={{ color: DELT.colors.inkSoft }}>{r.d}</span>
            <span style={{ fontFamily: DELT.font.mono, color: DELT.colors.ink }}>{r.amt}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: 24, marginTop: 'auto' }}>
        <div style={{ background: DELT.colors.indigo, color: '#fff', textAlign: 'center', borderRadius: 8, padding: '13px 0', fontFamily: DELT.font.body, fontWeight: 600, fontSize: 15 }}>Accept offer →</div>
      </div>
    </div>
  );
}

// Payments: a processing dashboard with a 7-day volume line chart.
function PlxTabPayments() {
  // Daily volume (relative heights 0..40) for a rising week.
  const vol = [22, 26, 20, 30, 28, 36, 34];
  const pts = vol.map((v, i) => `${(i / (vol.length - 1)) * 100},${44 - v}`).join(' ');
  return (
    <div style={{ background: '#fff', color: DELT.colors.ink, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${DELT.colors.line}`, fontFamily: DELT.font.display, fontWeight: 600, fontSize: 15 }}>Delt Payments · Volume</div>
      <div style={{ padding: 24 }}>
        <svg width="100%" height="120" viewBox="0 0 100 48" preserveAspectRatio="none" style={{ display: 'block' }}>
          <polyline points={`0,48 ${pts} 100,48`} fill="rgba(73,69,255,0.08)" stroke="none" />
          <polyline points={pts} fill="none" stroke={DELT.colors.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, padding: '0 24px 24px' }}>
        {[['Volume today', '$42,180'], ['Batches', '3'], ['Approval rate', '96.8%']].map(([l, v]) => (
          <div key={l} style={{ border: `1px solid ${DELT.colors.line}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontFamily: DELT.font.mono, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: DELT.colors.inkMute }}>{l}</div>
            <div style={{ fontFamily: DELT.font.display, fontWeight: 700, fontSize: 22, color: DELT.colors.ink, marginTop: 4, letterSpacing: '-0.02em' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Portal: agent commission table.
function PlxTabPortal() {
  const rows = [
    { m: 'Bloom Beauty', f: '$65,000', r: '1.19×', res: '$1,430' },
    { m: 'La Rosa Restaurant', f: '$110,000', r: '1.16×', res: '$2,640' },
    { m: 'Rosario Construction', f: '$180,000', r: '1.14×', res: '$4,320' },
    { m: 'Ward Market', f: '$50,000', r: '1.18×', res: '$1,100' },
  ];
  return (
    <div style={{ background: '#fff', color: DELT.colors.ink, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${DELT.colors.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 15 }}>Agent Portal · Residuals</span>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 12.5, color: DELT.colors.indigo }}>Commissions this month: <strong>$12,480</strong></span>
      </div>
      <div style={{ padding: '8px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 0', fontFamily: DELT.font.mono, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: DELT.colors.inkMute, borderBottom: `1px solid ${DELT.colors.line}` }}>
          <span>Merchant</span><span>Funded</span><span>Factor</span><span style={{ textAlign: 'right' }}>Residual</span>
        </div>
        {rows.map((r) => (
          <div key={r.m} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '13px 0', borderBottom: `1px solid ${DELT.colors.lineSoft}`, fontFamily: DELT.font.body, fontSize: 14, alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{r.m}</span>
            <span style={{ fontFamily: DELT.font.mono }}>{r.f}</span>
            <span style={{ fontFamily: DELT.font.mono }}>{r.r}</span>
            <span style={{ fontFamily: DELT.font.mono, textAlign: 'right', color: DELT.colors.indigo, fontWeight: 600 }}>{r.res}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function V1ProductTabs() {
  const mobile = useIsMobile();
  const [tab, setTab] = React.useState('Capital');
  const tabs = ['Capital', 'Payments', 'Portal'];
  // Wrap each mock so it stretches to fill the 800px card (flex child).
  const mockInner = tab === 'Capital' ? <PlxTabCapital /> : tab === 'Payments' ? <PlxTabPayments /> : <PlxTabPortal />;
  const mock = <div style={{ width: '100%' }}>{mockInner}</div>;

  return (
    <section data-v1-section style={{ background: DELT.colors.ink, padding: mobile ? '64px 0' : '120px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px', textAlign: 'center' }}>
        <V1Reveal>
          <h2 data-v1-section-title style={{
            margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
            fontSize: mobile ? 32 : 72, letterSpacing: '-0.03em', lineHeight: 1.02, color: '#fff',
          }}>One platform. Three products. Zero busywork.</h2>
          <p style={{ margin: '20px auto 0', fontFamily: DELT.font.body, fontSize: mobile ? 16 : 18, color: 'rgba(247,245,240,0.65)', maxWidth: 560 }}>
            Capital, payments, and a portal your agents actually use.
          </p>
        </V1Reveal>

        {/* Pill tab bar */}
        <div style={{
          display: 'inline-flex', gap: 4, marginTop: 40, padding: 5,
          background: 'rgba(247,245,240,0.06)', borderRadius: 999,
          border: '1px solid rgba(247,245,240,0.10)',
        }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              border: 'none', cursor: 'pointer', borderRadius: 999, padding: '10px 20px',
              fontFamily: DELT.font.body, fontSize: 14, fontWeight: 600,
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? DELT.colors.ink : 'rgba(247,245,240,0.55)',
              transition: 'background .18s, color .18s',
            }}>{t}</button>
          ))}
        </div>

        {/* Mock card — cross-fade on tab change via keyed remount. */}
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
          <style>{`
            @keyframes plxTabIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            .plx-tab-mock { animation: plxTabIn 220ms cubic-bezier(0.22,1,0.36,1); }
            @media (prefers-reduced-motion: reduce) { .plx-tab-mock { animation: none; } }
          `}</style>
          <div key={tab} className="plx-tab-mock" style={{
            width: '100%', maxWidth: 800, minHeight: mobile ? 'auto' : 480,
            borderRadius: 18, overflow: 'hidden', textAlign: 'left',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45)', border: '1px solid rgba(247,245,240,0.10)',
            display: 'flex',
          }}>
            {mock}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 8 — V1CaseStudyStrip (auto-scrolling operator-story cards)
// ============================================================================

// A single operator-story card: hero photo (with subject-right composition),
// wordmark overlay at top-left, headline + "Read the story" below.
function PlxStoryCard({ img, wordmark, headline }) {
  return (
    <div style={{
      width: 320, flexShrink: 0, borderRadius: 18, overflow: 'hidden',
      background: '#fff', border: `1px solid ${DELT.colors.line}`,
      boxShadow: '0 18px 40px rgba(15,14,23,0.06)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Photo panel with subtle indigo gradient overlay for the wordmark. */}
      <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
        <img src={img} alt="" loading="lazy"
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        {/* Left-side ink gradient so the white wordmark stays legible on any subject. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(15,14,23,0.55) 0%, rgba(15,14,23,0.15) 45%, rgba(15,14,23,0) 65%)',
        }} />
        <div style={{
          position: 'absolute', top: 18, left: 18,
          fontFamily: DELT.font.display, fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em',
          color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.35)',
        }}>{wordmark}</div>
      </div>
      {/* Copy panel */}
      <div style={{ padding: '22px 22px 26px' }}>
        <p style={{ margin: 0, fontFamily: DELT.font.display, fontWeight: 600, fontSize: 19, lineHeight: 1.28, letterSpacing: '-0.015em', color: DELT.colors.ink }}>{headline}</p>
        <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DELT.font.body, fontSize: 14, fontWeight: 500, color: DELT.colors.indigo }}>
          <span style={{ display: 'inline-flex', width: 20, height: 20, borderRadius: 999, border: `1px solid ${DELT.colors.indigo}`, alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 14 14"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          Read the story
        </div>
      </div>
    </div>
  );
}

function V1CaseStudyStrip() {
  const mobile = useIsMobile();
  const stories = [
    { img: 'app/assets/cases/01_ward.jpg',     wordmark: 'Ward Market',          headline: "Ward Market's CFO said: \u2018take it, I can\u2019t beat that.\u2019" },
    { img: 'app/assets/cases/02_roberts.jpg',  wordmark: 'Roberts Auto',         headline: 'Roberts Auto: our underwriter knew the book, not a call center.' },
    { img: 'app/assets/cases/03_bloom.jpg',    wordmark: 'Bloom Beauty',         headline: 'Bloom Beauty grew revenue 40% on $65K of working capital.' },
    { img: 'app/assets/cases/04_larosa.jpg',   wordmark: 'La Rosa Restaurant',   headline: 'La Rosa Restaurant closed in 19 hours — not 19 days.' },
    { img: 'app/assets/cases/05_rosario.jpg',  wordmark: 'Rosario Construction', headline: 'Rosario’s 3rd draw — each rate lower than the last.' },
    { img: 'app/assets/cases/06_williams.jpg', wordmark: 'Williams Logistics',   headline: 'Williams paid early — Delt rebated the unearned factor.' },
  ];
  const loop = [...stories, ...stories];

  return (
    <section data-v1-section style={{ background: DELT.colors.paperWarm, padding: mobile ? '64px 0' : '120px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px', marginBottom: mobile ? 32 : 56, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: DELT.colors.indigo, marginBottom: 16 }}>Operator Stories</div>
          <h2 data-v1-section-title style={{ margin: 0, fontFamily: DELT.font.display, fontWeight: 600, fontSize: mobile ? 30 : 48, letterSpacing: '-0.025em', color: DELT.colors.ink }}>See what’s possible with Delt.</h2>
        </div>
      </div>

      <style>{`
        @keyframes plxStoryScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .plx-story-track { animation: plxStoryScroll 80s linear infinite; }
        .plx-story-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .plx-story-track { animation: none; } }
      `}</style>
      <div style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, black 5%, black 95%, transparent 100%)',
        maskImage: 'linear-gradient(90deg, transparent 0, black 5%, black 95%, transparent 100%)',
      }}>
        <div className="plx-story-track" style={{ display: 'flex', gap: 24, width: 'max-content', padding: '4px 24px' }}>
          {loop.map((s, i) => (
            <PlxStoryCard key={i} img={s.img} wordmark={s.wordmark} headline={s.headline} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 9 — V1LeadFormSection ("Let's get started")
// Split: dark gradient headline (echoing the hero's topography rings) + white
// form card. Submitting prefills and opens the existing application modal.
// ============================================================================
function V1LeadFormSection({ onApply }) {
  const mobile = useIsMobile();
  const [form, setForm] = React.useState({
    firstName: '', lastName: '', email: '', businessName: '',
    revenue: '', tib: '', phone: '',
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // Build the prefill shape the apply modal expects (see variation-1-apply.jsx:
    // prefill.lead.{firstName,businessName,email,phone} + calc + high/factor).
    const rev = Number(String(form.revenue).replace(/[^\d.]/g, '')) || 0;
    const est = calcEstimate({ revenue: rev, tib: form.tib, cards: null, cardSales: 0 });
    const prefill = {
      low: est.low, high: est.high, factor: est.factor, ok: est.ok,
      lead: {
        firstName: form.firstName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
      },
      calc: { revenue: rev, tib: form.tib, acceptsCards: null, cardSales: 0, boosted: false },
    };
    // Route through the same openApp mechanism the hero CTA uses.
    if (onApply) onApply(null, prefill);
  };

  const inputStyle = {
    width: '100%', fontFamily: DELT.font.body, fontSize: 15, color: DELT.colors.ink,
    background: '#fff', border: `1px solid ${DELT.colors.line}`, borderRadius: 8,
    padding: '12px 14px', outline: 'none',
  };
  const labelStyle = { display: 'block', fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: DELT.colors.inkMute, marginBottom: 7 };

  return (
    <section data-v1-section style={{ background: DELT.colors.paper, padding: 0 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', minHeight: mobile ? 'auto' : 640,
      }}>
        {/* Left — dark gradient + topography rings (echoes the hero). */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: `linear-gradient(135deg, ${PLX.navy} 0%, ${PLX.navyMid} 60%, ${PLX.indigoDeep} 100%)`,
          padding: mobile ? '56px 24px' : '96px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {/* Decorative concentric rings, same motif as the hero's top-left. */}
          <svg aria-hidden width="620" height="620" viewBox="0 0 620 620" style={{ position: 'absolute', right: -160, bottom: -160, opacity: 0.3, pointerEvents: 'none' }}>
            <defs>
              <radialGradient id="plxLeadFade" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(125,211,252,0.55)" />
                <stop offset="100%" stopColor="rgba(4,30,66,0)" />
              </radialGradient>
              <mask id="plxLeadMask"><rect width="620" height="620" fill="url(#plxLeadFade)" /></mask>
            </defs>
            <g mask="url(#plxLeadMask)" fill="none" stroke="#7DD3FC" strokeWidth="1">
              {Array.from({ length: 20 }, (_, i) => <circle key={i} cx="360" cy="300" r={40 + i * 22} />)}
            </g>
          </svg>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
              fontSize: mobile ? 40 : 96, letterSpacing: '-0.035em', lineHeight: 0.95, color: '#fff',
            }}>Start building better working capital.</h2>
            <p style={{ margin: '24px 0 0', fontFamily: DELT.font.body, fontSize: 18, lineHeight: 1.55, color: 'rgba(247,245,240,0.72)', maxWidth: 420 }}>
              Get a real range in 60 seconds. Talk to an underwriter, not a call center.
            </p>
          </div>
        </div>

        {/* Right — form card */}
        <div style={{ background: DELT.colors.paper, display: 'flex', alignItems: 'center', padding: mobile ? '40px 20px' : '64px 56px' }}>
          <form onSubmit={submit} style={{
            width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20,
            padding: mobile ? 28 : 40, boxShadow: '0 24px 60px rgba(15,14,23,0.10)', border: `1px solid ${DELT.colors.line}`,
          }}>
            <h3 style={{ margin: '0 0 24px', fontFamily: DELT.font.display, fontWeight: 600, fontSize: 28, letterSpacing: '-0.02em', color: DELT.colors.ink }}>Let's get started</h3>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              <div><label style={labelStyle}>First name</label><input style={inputStyle} value={form.firstName} onChange={set('firstName')} required /></div>
              <div><label style={labelStyle}>Last name</label><input style={inputStyle} value={form.lastName} onChange={set('lastName')} /></div>
              <div><label style={labelStyle}>Business email</label><input type="email" style={inputStyle} value={form.email} onChange={set('email')} required /></div>
              <div><label style={labelStyle}>Business name</label><input style={inputStyle} value={form.businessName} onChange={set('businessName')} required /></div>
              <div>
                <label style={labelStyle}>Monthly revenue</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: DELT.colors.inkMute, fontSize: 15 }}>$</span>
                  <input inputMode="numeric" style={{ ...inputStyle, paddingLeft: 26 }} value={form.revenue} onChange={set('revenue')} placeholder="50,000" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Time in business</label>
                <select style={inputStyle} value={form.tib} onChange={set('tib')} required>
                  <option value="" disabled>Select…</option>
                  <option value="<6mo">&lt;6 months</option>
                  <option value="6-12mo">6–12 months</option>
                  <option value="1-2yr">1–2 years</option>
                  <option value="2yr+">2+ years</option>
                </select>
              </div>
              <div style={{ gridColumn: mobile ? 'auto' : '1 / -1' }}>
                <label style={labelStyle}>Phone (optional)</label><input type="tel" style={inputStyle} value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <p style={{ margin: '18px 0 16px', fontFamily: DELT.font.body, fontSize: 12, lineHeight: 1.5, color: DELT.colors.inkMute }}>
              By submitting, I confirm I've read Delt's Privacy Policy.
            </p>
            <button type="submit" style={{
              width: '100%', border: 'none', cursor: 'pointer', borderRadius: 999,
              background: DELT.colors.indigo, color: '#fff', padding: '14px 0',
              fontFamily: DELT.font.body, fontSize: 15, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>Get my range <Arr /></button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Exports — every component attached to window for the Babel-standalone runtime.
// ============================================================================
Object.assign(window, {
  V1LogoMarquee, V1ProductGrid, V1IntelligentBanner, V1NetworkStats,
  V1ProductTabs, V1CaseStudyStrip, V1LeadFormSection,
});
