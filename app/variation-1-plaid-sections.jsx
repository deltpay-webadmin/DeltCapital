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
// each card in Plaid's grid). Two variants: default is a dark filled circle
// (Plaid's actual case-study style), `dark=true` inverts to a light outline
// on the dark AI banner.
function PlxArrowCircle({ dark = false, active = false }) {
  // Three visual states:
  //   - dark (on dark backgrounds): thin ivory outline, always visible.
  //   - default (card not hovered): thin ink-tinted outline, ~50% opacity.
  //     Sits quietly in the corner instead of competing with the mock.
  //   - active (card hovered): fills to solid ink + white icon, translates
  //     a couple of px → reads as "this whole card is clickable."
  const filled = dark ? false : active;
  return (
    <span style={{
      width: 40, height: 40, borderRadius: 999, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: filled ? '#0F0E17' : 'transparent',
      border: filled
        ? '1px solid #0F0E17'
        : (dark ? '1px solid rgba(247,245,240,0.25)' : '1px solid rgba(15,14,23,0.18)'),
      color: filled ? '#FFFFFF' : (dark ? '#F7F5F0' : '#0F0E17'),
      opacity: dark ? 1 : (active ? 1 : 0.7),
      transform: active ? 'translate(2px, -2px)' : 'translate(0, 0)',
      transition: 'background .22s ease, border-color .22s ease, color .22s ease, opacity .22s ease, transform .22s cubic-bezier(0.22,1,0.36,1)',
      boxShadow: filled ? '0 4px 10px rgba(15,14,23,0.15)' : 'none',
    }}>
      <svg width="16" height="16" viewBox="0 0 14 14">
        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8"
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

// The Plaid hover signature: on hover, a rainbow conic-gradient "glow border"
// appears just outside the card, matching the lead-form treatment. This lives
// as an absolutely-positioned aria-hidden div behind the card content, fading
// opacity from 0 → ~0.55 over 240ms. Cards themselves keep their solid tinted
// background and elevate slightly.
function PlxProductCard({ title, desc, children, large, mobile, tint, onClick }) {
  const [hover, setHover] = React.useState(false);
  // When an onClick is supplied the whole card becomes an activatable button:
  // pointer cursor, keyboard-focusable, and Enter/Space trigger navigation so
  // the arrow-circle affordance is honored for keyboard + assistive-tech users.
  const clickable = typeof onClick === 'function';
  const activate = clickable ? (e) => { if (e) e.preventDefault(); onClick(); } : undefined;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={activate}
      role={clickable ? 'link' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? title : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') activate(e); } : undefined}
      style={{ position: 'relative', display: 'flex', cursor: clickable ? 'pointer' : 'default' }}
    >
      {/* Soft indigo→cyan glow, revealed on hover. Toned down from the old
          5-stop rainbow conic: on an editorial palette that read arcade-y,
          especially with five cards in view at once. A 2-stop diagonal blur
          at 35% opacity gives the same "card lifts off the page" feeling
          without the color show. */}
      <div aria-hidden style={{
        position: 'absolute', inset: -6, borderRadius: 26,
        background: 'linear-gradient(135deg, rgba(124,107,255,0.55), rgba(125,211,252,0.55))',
        filter: 'blur(18px)',
        opacity: hover && !mobile ? 0.35 : 0,
        transition: 'opacity .28s ease-out',
        pointerEvents: 'none',
      }} />
      {/* The card itself. */}
      <div style={{
        position: 'relative', width: '100%',
        background: tint || DELT.colors.card,
        borderRadius: 20,
        // On hover we swap the flat border for a thin cyan-tinted one to
        // reinforce the glow border reveal.
        border: hover && !mobile
          ? '1px solid rgba(125,211,252,0.55)'
          : `1px solid ${DELT.colors.line}`,
        padding: mobile ? 24 : 32,
        display: 'flex', flexDirection: 'column',
        // Plaid-scale card canvases (large=460, medium=380).
        minHeight: large ? (mobile ? 380 : 460) : (mobile ? 320 : 380),
        transform: hover && !mobile ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover && !mobile
          ? '0 28px 56px rgba(15,14,23,0.10), 0 4px 10px rgba(15,14,23,0.04)'
          : '0 1px 2px rgba(15,14,23,0.04)',
        transition: 'transform .22s cubic-bezier(0.22,1,0.36,1), box-shadow .22s, border-color .22s',
        overflow: 'hidden',
      }}>
        {/* Subtle radial fade inside the card so the mock sits on a soft
            atmosphere instead of a flat panel. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(80% 60% at 50% 100%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)',
        }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
          <div>
            <h3 style={{
              margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
              fontSize: large ? 28 : 22, letterSpacing: '-0.02em', color: DELT.colors.ink, lineHeight: 1.15,
            }}>{title}</h3>
            <p style={{
              margin: '10px 0 0', fontFamily: DELT.font.body, fontSize: 15,
              lineHeight: 1.5, color: DELT.colors.inkMute, maxWidth: 360,
            }}>{desc}</p>
          </div>
          <PlxArrowCircle active={hover && !mobile} />
        </div>
        {/* Hero visual — floats large in the bottom half, no bordered sub-tile. */}
        <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 26, display: 'flex', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ---- Card mocks (pure SVG/HTML) --------------------------------------------
// Each mock is a rich, Plaid-scale hero visual — phone mockup, gauge, chart,
// etc. — that floats directly on the card's tinted gradient background.

// 1. Revenue-based funding — polished Nano Banana Pro phone mockup.
function PlxMockOffer_OLD() {
  return (
    <div style={{
      width: 240, height: 320, borderRadius: 34, background: '#0F0E17',
      padding: 9, boxShadow: '0 30px 60px rgba(15,14,23,0.25), 0 4px 12px rgba(15,14,23,0.12)',
      position: 'relative',
    }}>
      {/* Screen */}
      <div style={{
        width: '100%', height: '100%', borderRadius: 26, background: '#FFFFFF',
        overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 66, height: 6, borderRadius: 999, background: '#0F0E17' }} />
        {/* Header */}
        <div style={{ padding: '30px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: DELT.font.display, fontWeight: 700, fontSize: 14, color: DELT.colors.indigo, letterSpacing: '-0.01em' }}>DELT</span>
          <span style={{ fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.14em', color: DELT.colors.inkMute, textTransform: 'uppercase' }}>Offer</span>
        </div>
        {/* Big amount */}
        <div style={{ padding: '4px 20px 0' }}>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Ready to fund</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 38, fontWeight: 700, color: DELT.colors.ink, letterSpacing: '-0.03em', marginTop: 6 }}>$95,000</div>
          <div style={{ fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute, marginTop: 2 }}>1.16× · 8 months</div>
        </div>
        {/* Progress rail */}
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ height: 7, borderRadius: 999, background: 'rgba(73,69,255,0.10)', overflow: 'hidden' }}>
            <div style={{ width: '82%', height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})` }} />
          </div>
          <div style={{ marginTop: 9, fontFamily: DELT.font.mono, fontSize: 10.5, color: DELT.colors.ok }}>Approved · 24h to wire</div>
        </div>
        {/* CTA */}
        <div style={{ marginTop: 'auto', padding: 18 }}>
          <div style={{
            width: '100%', height: 44, borderRadius: 12, background: DELT.colors.indigo,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: DELT.font.body, fontSize: 13, fontWeight: 600, color: '#fff',
          }}>Accept offer</div>
        </div>
      </div>
    </div>
  );
}

function PlxMockApprovals_OLD() {
  const start = 160; const end = 380; const pct = 0.82;
  const R = 108; const cx = 130; const cy = 125;
  const rad = (a) => (a * Math.PI) / 180;
  const arcPath = (a0, a1) => {
    const x0 = cx + R * Math.cos(rad(a0));
    const y0 = cy + R * Math.sin(rad(a0));
    const x1 = cx + R * Math.cos(rad(a1));
    const y1 = cy + R * Math.sin(rad(a1));
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
  };
  const fillEnd = start + (end - start) * pct;
  return (
    <div style={{ position: 'relative', width: 260, height: 240 }}>
      {/* Soft radial halo behind the gauge — pastel rainbow, Plaid style. */}
      <div aria-hidden style={{
        position: 'absolute', inset: -20, borderRadius: '50%',
        background: 'conic-gradient(from 220deg at 50% 50%, rgba(125,211,252,0.35), rgba(139,92,246,0.30), rgba(219,243,255,0.35), rgba(124,107,255,0.30), rgba(125,211,252,0.35))',
        filter: 'blur(24px)', opacity: 0.7,
      }} />
      <svg viewBox="0 0 260 240" width="100%" height="100%" style={{ position: 'relative' }}>
        <defs>
          <linearGradient id="plxGaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PLX.cyan} />
            <stop offset="55%" stopColor={DELT.colors.indigo} />
            <stop offset="100%" stopColor={PLX.violet} />
          </linearGradient>
        </defs>
        <path d={arcPath(start, end)} stroke="rgba(73,69,255,0.10)" strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d={arcPath(start, fillEnd)} stroke="url(#plxGaugeGrad)" strokeWidth="20" strokeLinecap="round" fill="none" />
      </svg>
      {/* Center label */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 12 }}>
        <div style={{ fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: DELT.colors.inkMute, fontWeight: 500 }}>Approved</div>
        <div style={{ fontFamily: DELT.font.display, fontSize: 72, fontWeight: 700, color: DELT.colors.ink, letterSpacing: '-0.045em', lineHeight: 1, marginTop: 4 }}>82</div>
        <div style={{ fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute, marginTop: 8 }}>Soft pull · 60s</div>
      </div>
      {/* Range chip anchored bottom */}
      <div style={{ position: 'absolute', left: '50%', bottom: 4, transform: 'translateX(-50%)', fontFamily: DELT.font.mono, fontSize: 10.5, color: DELT.colors.indigo, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', padding: '5px 12px', borderRadius: 999, border: `1px solid rgba(73,69,255,0.15)` }}>
        $85k – $110k
      </div>
    </div>
  );
}

function PlxMockCommissions_OLD() {
  const bars = [42, 55, 48, 68, 78, 92];
  const max = 100;
  return (
    <div style={{
      width: '100%', maxWidth: 280,
      background: '#FFFFFF', borderRadius: 14, padding: 22,
      boxShadow: '0 20px 44px rgba(15,14,23,0.12), 0 2px 6px rgba(15,14,23,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Commissions · YTD</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 32, fontWeight: 700, color: DELT.colors.ink, letterSpacing: '-0.03em', margin: '4px 0 2px' }}>$74,820</div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 11, color: DELT.colors.ok }}>▲ 34% vs last year</div>
        </div>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 10.5, color: DELT.colors.indigo, background: 'rgba(73,69,255,0.10)', padding: '4px 9px', borderRadius: 999 }}>100% residual</span>
      </div>
      {/* Chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 84 }}>
        {bars.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: '100%', height: `${(v / max) * 100}%`, minHeight: 8,
              borderRadius: 6,
              background: i === bars.length - 1
                ? `linear-gradient(180deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`
                : 'rgba(73,69,255,0.20)',
            }} />
            <span style={{ fontFamily: DELT.font.mono, fontSize: 9, color: DELT.colors.inkMute }}>{['J','F','M','A','M','J'][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlxMockProcessors_OLD() {
  const procs = [
    { n: 'Paysafe',  c: '#0057B7' },
    { n: 'NMI',      c: '#00A651' },
    { n: 'Global',   c: '#E42527' },
    { n: 'Goat',     c: '#8B5CF6' },
  ];
  return (
    <div style={{
      width: '100%', maxWidth: 280,
      background: '#FFFFFF', borderRadius: 14, padding: 22,
      boxShadow: '0 20px 44px rgba(15,14,23,0.12), 0 2px 6px rgba(15,14,23,0.04)',
    }}>
      <div style={{ fontFamily: DELT.font.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute, marginBottom: 12 }}>Board across processors</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {procs.map((p) => (
          <div key={p.n} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', border: `1px solid ${DELT.colors.line}`, borderRadius: 10,
          }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: p.c, flexShrink: 0 }} />
            <span style={{ fontFamily: DELT.font.body, fontSize: 12.5, fontWeight: 500, color: DELT.colors.ink }}>{p.n}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: 'rgba(73,69,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 10.5, color: DELT.colors.inkSoft, letterSpacing: '0.06em' }}>Settlement · T+1</span>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 11, fontWeight: 600, color: DELT.colors.indigo }}>Board in 48h</span>
      </div>
    </div>
  );
}

function PlxMockTerminals_OLD() {
  const Term = ({ label, accent, tilt }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transform: `rotate(${tilt}deg)` }}>
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" style={{ filter: 'drop-shadow(0 12px 20px rgba(15,14,23,0.15))' }}>
        <rect x="3" y="3" width="66" height="90" rx="9" fill="#fff" stroke={DELT.colors.inkSoft} strokeWidth="1.6" />
        <rect x="10" y="10" width="52" height="26" rx="4" fill={`${accent}22`} stroke={accent} strokeWidth="1.2" />
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
          <circle key={`${r}-${c}`} cx={20 + c * 16} cy={52 + r * 10} r="2.8" fill={DELT.colors.inkMute} />
        )))}
      </svg>
      <span style={{ fontFamily: DELT.font.mono, fontSize: 10, color: DELT.colors.inkSoft }}>{label}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 6 }}>
        <Term label="PAX A920" accent={DELT.colors.indigo} tilt={-6} />
        <Term label="Verifone" accent={PLX.violet} tilt={0} />
        <Term label="Landi" accent={PLX.cyan} tilt={6} />
      </div>
      <div style={{ padding: '10px 18px', borderRadius: 999, background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 20px rgba(73,69,255,0.30)' }}>
        <span style={{ fontFamily: DELT.font.body, fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.005em' }}>$0 down</span>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Own or lease</span>
      </div>
    </div>
  );
}

// ============================================================================
// PREMIUM BENTO MOCKS — unified design language
// ============================================================================
// All product-surface mocks share:
//   • White canvas, 18px radius, 1px hairline border, layered soft shadow
//   • DELT.font.display for hero numbers (tabular-nums, tight tracking)
//   • DELT.font.mono uppercase 10px/0.14em label style
//   • Green status pill: bg rgba(15,169,104,0.10), text #0FA968
//   • One indigo→softIndigo gradient accent per mock (never two competing)
//
// Card frame primitive — identical chrome across every product surface so the
// section reads as one design system instead of five separate illustrations.
function PlxSurface({ width = 300, children, style }) {
  return (
    <div style={{
      width, maxWidth: '100%', borderRadius: 18, padding: 20,
      background: '#FFFFFF',
      border: '1px solid rgba(15,14,23,0.06)',
      boxShadow: '0 24px 48px rgba(15,14,23,0.10), 0 2px 6px rgba(15,14,23,0.04)',
      fontFamily: DELT.font.body,
      ...style,
    }}>{children}</div>
  );
}

// Small helpers to keep type consistent across mocks.
const PlxLabel = ({ children, color }) => (
  <div style={{
    fontFamily: DELT.font.mono, fontSize: 10, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: color || DELT.colors.inkMute,
  }}>{children}</div>
);

const PlxPill = ({ children, tone = 'green' }) => {
  const tones = {
    green:  { bg: 'rgba(15,169,104,0.10)',  fg: '#0FA968' },
    indigo: { bg: 'rgba(73,69,255,0.10)',   fg: DELT.colors.indigo },
  };
  const t = tones[tone];
  return (
    <span style={{
      fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: t.fg, background: t.bg,
      padding: '4px 9px', borderRadius: 999, fontWeight: 600,
    }}>{children}</span>
  );
};

// 1. Revenue-based funding — iPhone-frame with fully-designed Delt Capital
//    offer UI. No JPG; everything is a coded surface so it stays razor-sharp
//    on retina and can be tweaked without re-rendering an image.
function PlxMockOffer() {
  return (
    <div style={{
      // Outer phone frame — 220×450 chosen so the mock's total height stays
      // in line with the neighbor gauge card, keeping the top-row grid rows
      // visually balanced instead of one card ballooning past the other.
      width: 220, height: 450, borderRadius: 40, padding: 7,
      background: 'linear-gradient(160deg, #1B1A24 0%, #0F0E17 60%, #1B1A24 100%)',
      boxShadow: '0 40px 70px rgba(15,14,23,0.28), 0 6px 14px rgba(15,14,23,0.14), inset 0 0 0 1px rgba(255,255,255,0.06)',
      position: 'relative',
    }}>
      {/* Side buttons — tiny detail that sells the "real device" read */}
      <div style={{ position: 'absolute', left: -2, top: 98, width: 3, height: 26, borderRadius: 2, background: '#2A2933' }} />
      <div style={{ position: 'absolute', left: -2, top: 138, width: 3, height: 48, borderRadius: 2, background: '#2A2933' }} />
      <div style={{ position: 'absolute', left: -2, top: 195, width: 3, height: 48, borderRadius: 2, background: '#2A2933' }} />
      <div style={{ position: 'absolute', right: -2, top: 158, width: 3, height: 72, borderRadius: 2, background: '#2A2933' }} />
      {/* Screen */}
      <div style={{
        width: '100%', height: '100%', borderRadius: 33,
        background: 'linear-gradient(180deg, #FAFAFB 0%, #F4F4F8 100%)',
        overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)',
          width: 76, height: 22, borderRadius: 999, background: '#0F0E17',
        }} />
        {/* Status bar */}
        <div style={{
          padding: '16px 22px 0', display: 'flex', justifyContent: 'space-between',
          fontFamily: DELT.font.mono, fontSize: 9.5, fontWeight: 600, color: '#0F0E17',
        }}>
          <span>9:41</span>
          <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
            <svg width="14" height="9" viewBox="0 0 14 9"><path d="M0 8h2V6H0v2zm4 0h2V4H4v4zm4 0h2V2H8v6zm4 0h2V0h-2v8z" fill="#0F0E17"/></svg>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5a6 6 0 0112 0M3 6a4 4 0 018 0M5 7a2 2 0 014 0" stroke="#0F0E17" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span style={{ position: 'relative', display: 'inline-block', width: 20, height: 9 }}>
              <span style={{ position: 'absolute', inset: 0, border: '1px solid #0F0E17', borderRadius: 2, opacity: 0.4 }} />
              <span style={{ position: 'absolute', top: 1.5, left: 1.5, width: 14, height: 6, background: '#0F0E17', borderRadius: 1 }} />
            </span>
          </span>
        </div>
        {/* App header */}
        <div style={{ padding: '44px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: DELT.font.display, fontWeight: 700, fontSize: 13,
            letterSpacing: '-0.02em',
            background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>DELT</span>
          <PlxPill tone="indigo">Offer</PlxPill>
        </div>
        {/* Ready-to-fund block */}
        <div style={{ padding: '14px 18px 0' }}>
          <PlxLabel>Ready to fund</PlxLabel>
          <div style={{
            fontFamily: DELT.font.display, fontSize: 36, fontWeight: 700,
            color: DELT.colors.ink, letterSpacing: '-0.035em',
            marginTop: 4, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          }}>$95,000</div>
        </div>
        {/* Offer breakdown — 4 rows, tabular for clean alignment */}
        <div style={{
          margin: '14px 14px 0', padding: '10px 14px',
          background: '#FFFFFF', borderRadius: 12,
          border: '1px solid rgba(15,14,23,0.05)',
          boxShadow: '0 1px 2px rgba(15,14,23,0.03)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {/* MCAs are revenue-tied — no fixed term. Payback is expressed as the
              factor × total repay + a holdback (percentage of daily card
              settlements), never as a duration. */}
          {[
            ['Advance',     '$95,000'],
            ['Factor',      '1.16×'],
            ['Total repay', '$110,200'],
            ['Holdback',    '9% of sales'],
          ].map((row, i, arr) => (
            <div key={row[0]} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '5px 0',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(15,14,23,0.04)' : 'none',
              fontFamily: DELT.font.body, fontSize: 11,
            }}>
              <span style={{ color: DELT.colors.inkMute }}>{row[0]}</span>
              <span style={{ color: DELT.colors.ink, fontWeight: 600 }}>{row[1]}</span>
            </div>
          ))}
        </div>
        {/* Progress + status */}
        <div style={{ padding: '12px 18px 0' }}>
          <div style={{
            height: 5, borderRadius: 999, background: 'rgba(73,69,255,0.10)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '82%', height: '100%', borderRadius: 999,
              background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
            }} />
          </div>
          <div style={{
            marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: DELT.font.mono, fontSize: 9.5, color: '#0FA968',
            fontWeight: 600, letterSpacing: '0.02em',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: '#0FA968' }} />
            Approved · funds in 24h
          </div>
        </div>
        {/* CTA */}
        <div style={{ marginTop: 'auto', padding: '0 14px 16px' }}>
          <div style={{
            width: '100%', height: 40, borderRadius: 12,
            background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: DELT.font.body, fontSize: 12.5, fontWeight: 600, color: '#fff',
            letterSpacing: '-0.005em',
            boxShadow: '0 8px 18px rgba(73,69,255,0.30)',
          }}>Accept offer →</div>
          {/* Home indicator */}
          <div style={{
            width: 88, height: 4, borderRadius: 999, background: '#0F0E17',
            opacity: 0.3, margin: '8px auto 0',
          }} />
        </div>
      </div>
    </div>
  );
}

// 2. Instant approvals — replaces the arbitrary "82" gauge with a coherent
//    60-second countdown story: circular progress arc showing what actually
//    happens during the soft-pull, with three timestamped checks below.
function PlxMockApprovals() {
  // Arc geometry — sweeps ~270° from 135° (bottom-left) to 45° (bottom-right).
  // Fill = 68% of the way through underwriting (softened from instant/60s
  // framing — MCAs are faster than banks but not literally instant).
  const start = 135; const end = 405; const pct = 0.68;
  const R = 68; const cx = 90; const cy = 90;
  const rad = (a) => (a * Math.PI) / 180;
  const arcPath = (a0, a1) => {
    const x0 = cx + R * Math.cos(rad(a0));
    const y0 = cy + R * Math.sin(rad(a0));
    const x1 = cx + R * Math.cos(rad(a1));
    const y1 = cy + R * Math.sin(rad(a1));
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
  };
  const fillEnd = start + (end - start) * pct;
  return (
    <PlxSurface width={300}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 13, color: DELT.colors.indigo, letterSpacing: '-0.005em' }}>Approval · live</span>
        <PlxPill tone="green">Soft pull</PlxPill>
      </div>
      {/* Ring + center timer */}
      <div style={{ position: 'relative', width: 180, height: 180, margin: '4px auto 0' }}>
        <svg viewBox="0 0 180 180" width="100%" height="100%">
          <defs>
            <linearGradient id="plxApprovalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={DELT.colors.indigo} />
              <stop offset="100%" stopColor={PLX.softIndigo} />
            </linearGradient>
          </defs>
          <path d={arcPath(start, end)} stroke="rgba(73,69,255,0.10)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d={arcPath(start, fillEnd)} stroke="url(#plxApprovalGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: DELT.font.display, fontSize: 40, fontWeight: 700,
            color: DELT.colors.ink, letterSpacing: '-0.045em', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>Live</div>
          <div style={{
            marginTop: 6, fontFamily: DELT.font.mono, fontSize: 9.5,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: DELT.colors.inkMute,
          }}>underwriting</div>
        </div>
      </div>
      {/* Live checklist */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['Deposits verified',   'Done'],
          ['Ownership matched',   'Done'],
          ['Offer ranged',        'Done'],
        ].map((row) => (
          /* Steps not stopwatch times — Delt underwrites in minutes to hours,
             not seconds. Signal the process, not a false clock. */
          <div key={row[0]} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px', background: 'rgba(15,169,104,0.06)',
            border: '1px solid rgba(15,169,104,0.15)', borderRadius: 10,
            fontFamily: DELT.font.body, fontSize: 12,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: DELT.colors.ink }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.5" fill="#0FA968" />
                <path d="M3.5 6.2l1.7 1.7L8.7 4.3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              {row[0]}
            </span>
            <span style={{
              fontFamily: DELT.font.mono, fontSize: 11, color: '#0FA968', fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}>{row[1]}</span>
          </div>
        ))}
      </div>
    </PlxSurface>
  );
}

// (Legacy) Commissions mock — unused since the "Agent portal" bento was
// replaced with Lines-of-credit. Kept here for reference in case an
// agent-only variant is spun up later.
function PlxMockCommissions() {
  const bars = [42, 55, 48, 68, 78, 92];
  const max = 100;
  return (
    <PlxSurface width={280}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <PlxLabel>Commissions · YTD</PlxLabel>
          <div style={{ fontFamily: DELT.font.display, fontSize: 30, fontWeight: 700, color: DELT.colors.ink, letterSpacing: '-0.03em', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>$74,820</div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 11, color: '#0FA968' }}>▲ 34% vs last year</div>
        </div>
        <PlxPill tone="indigo">100% residual</PlxPill>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 84 }}>
        {bars.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: '100%', height: `${(v / max) * 100}%`, minHeight: 8, borderRadius: 6,
              background: i === bars.length - 1
                ? `linear-gradient(180deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`
                : 'rgba(73,69,255,0.20)',
            }} />
            <span style={{ fontFamily: DELT.font.mono, fontSize: 9, color: DELT.colors.inkMute }}>{['J','F','M','A','M','J'][i]}</span>
          </div>
        ))}
      </div>
    </PlxSurface>
  );
}

// 3. Line of credit — already the strongest mock in the section; small
//    refinements to match the new shared surface primitive and add a subtle
//    12-week draw sparkline so the card has one more micro-detail without
//    getting noisy.
function PlxMockLineOfCredit() {
  const limit = 250000;
  const drawn = 92500;
  const available = limit - drawn;
  const pct = (drawn / limit) * 100;
  const fmt = (n) => `$${n.toLocaleString('en-US')}`;
  // Deterministic sparkline shape — 12 weekly draw touches ranging 0.15–0.90.
  const spark = [0.20, 0.35, 0.28, 0.52, 0.44, 0.60, 0.55, 0.72, 0.68, 0.80, 0.75, 0.90];
  const sparkW = 260; const sparkH = 24;
  const points = spark.map((v, i) => {
    const x = (i / (spark.length - 1)) * sparkW;
    const y = sparkH - v * sparkH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <PlxSurface width={300}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 13, color: DELT.colors.indigo, letterSpacing: '-0.005em' }}>Delt Credit Line</span>
        <PlxPill tone="green">Open</PlxPill>
      </div>
      <PlxLabel>Available to draw</PlxLabel>
      <div style={{ fontFamily: DELT.font.display, fontSize: 32, fontWeight: 700, color: DELT.colors.ink, letterSpacing: '-0.035em', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{fmt(available)}</div>
      <div style={{ marginTop: 14, height: 7, borderRadius: 999, background: 'rgba(73,69,255,0.10)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: DELT.font.mono, fontSize: 10.5, color: DELT.colors.inkMute, fontVariantNumeric: 'tabular-nums' }}>
        <span>{fmt(drawn)} drawn</span>
        <span>{fmt(limit)} limit</span>
      </div>
      {/* Sparkline — last 12 weeks of draw activity, indigo→cyan gradient */}
      <div style={{ marginTop: 14 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 4,
        }}>
          <span style={{ fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Draws · 12wk</span>
          <span style={{ fontFamily: DELT.font.mono, fontSize: 10, color: '#0FA968', fontWeight: 600 }}>▲ 22%</span>
        </div>
        <svg viewBox={`0 0 ${sparkW} ${sparkH}`} width="100%" height={sparkH} preserveAspectRatio="none">
          <defs>
            <linearGradient id="plxLocSpark" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={DELT.colors.indigo} />
              <stop offset="100%" stopColor={PLX.softIndigo} />
            </linearGradient>
          </defs>
          <polyline points={points} fill="none" stroke="url(#plxLocSpark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{
        marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(15,14,23,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Bank line</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 14, fontWeight: 600, color: DELT.colors.inkMute, textDecoration: 'line-through' }}>12.5% APR</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.indigo }}>Your rate</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 18, fontWeight: 700, color: DELT.colors.ink, fontVariantNumeric: 'tabular-nums' }}>8.9% APR</div>
        </div>
      </div>
    </PlxSurface>
  );
}

// 4. Merchant processing — rebuilt from scratch. The old floating-chip
//    diagram carried no information. New mock is a rate-comparison stack:
//    current processor rate vs Delt rate, with the monthly savings computed
//    prominently in the same visual family as the credit-line card.
function PlxMockProcessors() {
  return (
    <PlxSurface width={300}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 13, color: DELT.colors.indigo, letterSpacing: '-0.005em' }}>Rate comparison</span>
        <PlxPill tone="green">Live quote</PlxPill>
      </div>

      {/* Current processor row — Square as the reference merchant is on now.
          Square in-person is 2.6% + $0.15 per transaction (Free plan, verified
          against Square's published pricing). On $100K/month volume with a
          typical ~$50 avg ticket (≈2,000 txns), that's an effective ~2.9%
          all-in — or roughly $2,900/mo in processing fees. */}
      <div style={{
        padding: '12px 14px', borderRadius: 12,
        background: 'rgba(15,14,23,0.03)',
        border: '1px solid rgba(15,14,23,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Current · Square</div>
          <div style={{ fontFamily: DELT.font.body, fontSize: 11, color: DELT.colors.inkMute, marginTop: 2 }}>2.6% + $0.15 per swipe</div>
        </div>
        <div style={{
          fontFamily: DELT.font.display, fontSize: 22, fontWeight: 600,
          color: DELT.colors.inkMute, letterSpacing: '-0.02em',
          textDecoration: 'line-through', textDecorationThickness: '1px',
          fontVariantNumeric: 'tabular-nums',
        }}>~2.9%</div>
      </div>

      {/* Delt row — cash discount program. Merchant nets 0% because the
          non-cash adjustment is passed to the cardholder. Fits retail,
          service, QSR — the categories David flagged. */}
      <div style={{
        marginTop: 8, padding: '14px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(73,69,255,0.08), rgba(124,107,255,0.05))',
        border: '1px solid rgba(73,69,255,0.20)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.indigo, fontWeight: 600 }}>Delt · cash discount</div>
          <div style={{ fontFamily: DELT.font.body, fontSize: 11, color: DELT.colors.inkSoft, marginTop: 2 }}>Retail, service, QSR</div>
        </div>
        <div style={{
          fontFamily: DELT.font.display, fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.03em',
          background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontVariantNumeric: 'tabular-nums',
        }}>0% net</div>
      </div>

      {/* Savings summary — Square math on $100K/mo, ~$50 avg ticket:
          2.6% × $100K + $0.15 × 2,000 txns = $2,600 + $300 = $2,900/mo.
          With cash discount the customer covers the fee, so the merchant
          keeps essentially the full $2,900. */}
      <div style={{
        marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(15,14,23,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>You keep</div>
          <div style={{ fontFamily: DELT.font.body, fontSize: 11, color: DELT.colors.inkMute, marginTop: 2 }}>on $100K/month volume</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: DELT.font.mono, fontSize: 12, color: '#0FA968', fontWeight: 700 }}>▲</span>
          <span style={{
            fontFamily: DELT.font.display, fontSize: 22, fontWeight: 700,
            color: '#0FA968', letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}>$2,900</span>
          <span style={{ fontFamily: DELT.font.mono, fontSize: 10.5, color: DELT.colors.inkMute, marginLeft: 2 }}>/mo</span>
        </div>
      </div>
    </PlxSurface>
  );
}

// 5. Terminal financing — hero photograph (Nano Banana Pro editorial render:
//    three POS terminals on a soft lavender studio background matching the
//    #F5F1FF card tint). Below the image: a compact spec strip in the same
//    mono-caps style used across the section, plus a small "Certified" chip
//    to signal the terminals are pre-boarded and ready.
function PlxMockTerminals() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      width: '100%',
    }}>
      <img
        src="app/assets/mocks/delt_mock_terminals.jpg"
        alt="Delt payment terminals"
        style={{
          width: 320, maxWidth: '100%', height: 'auto', objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 12px 24px rgba(15,14,23,0.08))',
        }}
      />
      {/* Terminal-agnostic caption — no manufacturer names. Delt boards any
          major terminal, so lock-in to specific brands would misrepresent the
          product. */}
      <div style={{
        fontFamily: DELT.font.mono, fontSize: 9.5, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: DELT.colors.inkMute, fontWeight: 500,
        textAlign: 'center',
      }}>
        Countertop · handheld · mobile
      </div>
      {/* Spec strip — same visual language as the other mocks. Two facts,
          separated by a divider dot. "Certified" chip on the right signals
          the whole line is pre-boarded / no compatibility risk. */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        marginTop: 2,
        fontFamily: DELT.font.mono, fontSize: 11, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: DELT.colors.inkMute,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span><span style={{ color: DELT.colors.ink, fontWeight: 700 }}>$0</span> down</span>
        <span style={{ opacity: 0.3 }}>•</span>
        <span>Own or lease</span>
        <span style={{ opacity: 0.3 }}>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0FA968', fontWeight: 700 }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5.5" fill="#0FA968" />
            <path d="M3.5 6.2l1.7 1.7L8.7 4.3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          Same-day board
        </span>
      </div>
    </div>
  );
}

function V1ProductGrid({ onNav }) {
  const mobile = useIsMobile();
  const go = (page) => (typeof onNav === 'function' ? () => onNav(page) : undefined);
  return (
    <section data-v1-section style={{ background: '#EEF3FA', padding: mobile ? '64px 0' : '120px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px' }}>
        {/* Header row */}
        <V1Reveal>
          <h2 data-v1-section-title style={{
            margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
            fontSize: mobile ? 34 : 72, letterSpacing: '-0.03em',
            lineHeight: 1.0, color: DELT.colors.ink, maxWidth: 820,
          }}>Don't wait on the bank.</h2>
          <p style={{
            margin: '20px 0 0', fontFamily: DELT.font.body, fontSize: mobile ? 16 : 18,
            lineHeight: 1.55, color: DELT.colors.inkSoft, maxWidth: 560,
          }}>Every day you wait is revenue you don't book. Capital wired in 24 hours — priced off your deposits, not your paperwork.</p>
          <div style={{ marginTop: 24 }}>
            <a href="#how" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontFamily: DELT.font.body, fontSize: 15, fontWeight: 500,
              color: DELT.colors.indigo,
            }}>See how it works <Arr /></a>
          </div>
        </V1Reveal>

        {/* Top row — 2 large cards with tinted interiors. */}
        <div data-v1-grid-2col style={{
          display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 16 : 24, marginTop: mobile ? 40 : 56,
        }}>
          <PlxProductCard large mobile={mobile}
            tint="#EEF0FF"
            title="Revenue-based funding"
            desc="Underwritten off your deposits, not FICO. Wired in 24 hours."
            onClick={go('how')}>
            <PlxMockOffer />
          </PlxProductCard>
          <PlxProductCard large mobile={mobile}
            tint="#F0F7FE"
            title="Faster than the bank"
            desc="Ranged offers in minutes. Soft pull, no callbacks."
            onClick={go('speed')}>
            <PlxMockApprovals />
          </PlxProductCard>
        </div>

        {/* Bottom row — 3 medium cards */}
        <div data-v1-grid-3col style={{
          display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: mobile ? 16 : 24, marginTop: mobile ? 16 : 24,
        }}>
          <PlxProductCard mobile={mobile}
            tint="#F5F1FF"
            title="Lines, loans & more"
            desc="Revolving credit, term loans with simple interest, and SBA-style options — all priced below the bank."
            onClick={go('lending')}>
            <PlxMockLineOfCredit />
          </PlxProductCard>
          <PlxProductCard mobile={mobile}
            tint="#FFFFFF"
            title="Card processing"
            desc="We beat your current rate in writing. Same terminals, next-day deposits."
            onClick={go('processing')}>
            <PlxMockProcessors />
          </PlxProductCard>
          <PlxProductCard mobile={mobile}
            tint="#EEF7FB"
            title="Terminal financing"
            desc="Own or lease. Same-day board."
            onClick={go('terminals')}>
            <PlxMockTerminals />
          </PlxProductCard>
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

function V1IntelligentBanner({ onNav }) {
  const mobile = useIsMobile();
  return (
    <section style={{ background: '#EEF3FA', padding: mobile ? '40px 0 64px' : '80px 0 120px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 28, minHeight: mobile ? 'auto' : 480,
          background: `radial-gradient(100% 120% at 100% 50%, #2FA9E6 0%, #1F6CB8 30%, #123A82 60%, #0B2C5C 100%)`,
          border: '1px solid rgba(125,211,252,0.14)',
          boxShadow: '0 60px 120px rgba(4,30,66,0.30), 0 0 0 1px rgba(125,211,252,0.08)',
        }}>
          <style>{`
            @keyframes plxGlobeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .plx-globe-spin { animation: plxGlobeSpin 90s linear infinite; transform-origin: center; }
            @keyframes plxTopoDrift { 0% { transform: translateX(0); } 100% { transform: translateX(-24px); } }
            .plx-topo-drift { animation: plxTopoDrift 24s ease-in-out infinite alternate; }
            @media (prefers-reduced-motion: reduce) {
              .plx-globe-spin, .plx-topo-drift { animation: none !important; }
            }
          `}</style>

          {/* Wispy left-side topography lines — Plaid uses these to fill negative
             space on the copy side of the banner. Very subtle, cyan on navy. */}
          {!mobile && (
            <svg aria-hidden viewBox="0 0 600 480" width="600" height="480" preserveAspectRatio="none"
              className="plx-topo-drift"
              style={{ position: 'absolute', left: 0, top: 0, opacity: 0.28, pointerEvents: 'none' }}>
              {Array.from({ length: 22 }, (_, i) => (
                <path key={i}
                  d={`M ${-40 + i*4} 0 Q ${140 + i*8} ${140 + i*6}, ${80 + i*6} ${320 - i*4} T ${-20 + i*2} 480`}
                  fill="none" stroke="rgba(125,211,252,0.55)" strokeWidth="0.6" />
              ))}
            </svg>
          )}

          {/* George portrait — blue engraving on the right, no purple.
             The image itself carries the navy fade on its left edge so it
             blends directly into the banner background. */}
          {!mobile && (
            <div style={{
              position: 'absolute', right: 0, bottom: 0, top: 0,
              width: '60%', pointerEvents: 'none',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            }}>
              <img src="app/assets/washington-blue.jpg" alt="" aria-hidden
                style={{
                  height: '108%', width: 'auto', maxWidth: '100%',
                  objectFit: 'cover', objectPosition: 'right bottom',
                  mixBlendMode: 'screen', opacity: 0.95,
                }} />
              {/* Left-edge fade so George dissolves into the banner instead of hard-cutting. */}
              <div aria-hidden style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(11,44,92,1) 0%, rgba(11,44,92,0.35) 22%, rgba(11,44,92,0) 45%)',
              }} />
              {/* Right-side cyan bloom, matches Plaid's Lincoln edge glow. */}
              <div aria-hidden style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: '18%',
                background: 'linear-gradient(90deg, rgba(47,169,230,0) 0%, rgba(47,169,230,0.35) 100%)',
                mixBlendMode: 'screen',
              }} />
            </div>
          )}

          {/* Left — copy */}
          <div style={{
            position: 'relative', zIndex: 3, maxWidth: mobile ? '100%' : '50%',
            padding: mobile ? '48px 24px 40px' : '110px 64px',
          }}>
            <h2 style={{
              margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
              fontSize: mobile ? 34 : 56, letterSpacing: '-0.028em',
              lineHeight: 1.02, color: '#fff',
            }}>Underwriting that reads your revenue, not only your credit.</h2>
            <p style={{
              margin: '20px 0 0', fontFamily: DELT.font.body,
              fontSize: mobile ? 15.5 : 17, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.78)', maxWidth: 440,
            }}>A holistic review — live deposits, cash flow, and time in business weighed alongside credit, not a single score deciding your fate.</p>
            <a
              onClick={(e) => { e.preventDefault(); if (onNav) onNav('how'); }}
              href="#how"
              style={{
                marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: DELT.font.body, fontSize: 15, fontWeight: 500, color: DELT.colors.ink,
                background: '#fff', borderRadius: 999, padding: '13px 26px', cursor: 'pointer',
                boxShadow: `0 0 0 3px rgba(125,211,252,0.35), 0 0 0 6px rgba(47,169,230,0.15), 0 10px 24px rgba(4,30,66,0.35)`,
              }}>See how we underwrite</a>
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

// A single funded-event notification card, styled like a real mobile app push:
// colored rounded-square icon, brand name, short message, timestamp on the right.
// This mirrors Plaid's floating Venmo/Robinhood/Carvana notification chips.
function PlxFundedCard({ icon, iconBg, iconFg, name, msg, ago }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '12px 14px 12px 12px', width: 300, maxWidth: '100%',
      boxShadow: '0 20px 44px rgba(15,14,23,0.10), 0 2px 6px rgba(15,14,23,0.05)',
      border: `1px solid ${DELT.colors.line}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        flexShrink: 0, width: 40, height: 40, borderRadius: 11, background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: iconFg, fontFamily: DELT.font.display, fontWeight: 700, fontSize: 18,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
      }}>{icon}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 13, color: DELT.colors.ink, letterSpacing: '-0.005em' }}>{name}</span>
          <span style={{ marginLeft: 'auto', fontFamily: DELT.font.body, fontSize: 11, color: DELT.colors.inkMute }}>{ago}</span>
        </div>
        <div style={{ marginTop: 2, fontFamily: DELT.font.body, fontSize: 14, color: DELT.colors.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg}</div>
      </div>
    </div>
  );
}

// A colored "story pill" — wider, holds a small hero-image thumb + brand tag.
// Used to break up the notification cards along the spine (Plaid does this too).
function PlxStoryPill({ img, tag, tagBg }) {
  return (
    <div style={{
      width: 208, borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 20px 44px rgba(15,14,23,0.10)',
      background: tagBg, position: 'relative',
    }}>
      <div style={{ aspectRatio: '16 / 8', position: 'relative', overflow: 'hidden' }}>
        <img src={img} alt="" aria-hidden loading="lazy"
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0) 40%, ${tagBg} 100%)` }} />
        <span style={{
          position: 'absolute', bottom: 8, left: 10, fontFamily: DELT.font.display,
          fontWeight: 700, fontSize: 11, letterSpacing: '0.04em', color: '#fff',
          textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}>{tag}</span>
      </div>
    </div>
  );
}

// The flowing spine that threads the notification cards — Plaid's signature
// wavy-line motif. Rendered as a single SVG cubic path with a gradient stroke;
// a subtler mirrored path adds the "double ribbon" feel.
function PlxNetworkSpine() {
  // A wide braid of thin lines, Plaid-style. We render ~14 offset copies of a
  // single serpentine path so the spine reads as a soft "waterfall" ribbon
  // instead of two lonely lines. Colors cycle indigo → violet → cyan
  // (Delt palette — no mint/teal).
  const lines = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    // Interpolate between three brand colors as a smooth ramp.
    const stops = [
      [125, 211, 252],   // cyan
      [124, 107, 255],   // softIndigo
      [139,  92, 246],   // violet
    ];
    const seg = t * (stops.length - 1);
    const idx = Math.min(Math.floor(seg), stops.length - 2);
    const f = seg - idx;
    const a = stops[idx], b = stops[idx + 1];
    const rgb = [
      Math.round(a[0] + (b[0] - a[0]) * f),
      Math.round(a[1] + (b[1] - a[1]) * f),
      Math.round(a[2] + (b[2] - a[2]) * f),
    ];
    const dx = -30 + i * 4;
    lines.push({ dx, rgb, alpha: 0.42 + 0.12 * Math.sin(i * 0.9) });
  }
  return (
    <svg aria-hidden viewBox="0 0 480 600" width="100%" preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', pointerEvents: 'none' }}>
      {lines.map((l, i) => (
        <path key={i}
          d={`M ${80 + l.dx} 0
              C ${340 + l.dx} 120, ${110 + l.dx} 220, ${360 + l.dx} 320
              S ${70 + l.dx} 460, ${350 + l.dx} 560
              S ${140 + l.dx} 620, ${320 + l.dx} 620`}
          fill="none"
          stroke={`rgba(${l.rgb[0]},${l.rgb[1]},${l.rgb[2]},${l.alpha.toFixed(2)})`}
          strokeWidth="1"
          strokeLinecap="round" />
      ))}
    </svg>
  );
}

function V1NetworkStats() {
  const mobile = useIsMobile();
  const [ref, inView] = useV1InView(0.3);

  // A mix of push-notification cards (Plaid uses Venmo/Robinhood/Carvana pills)
  // and small "story pill" thumbnails. Each anchors to a point along the spine.
  const items = [
    { kind: 'card', top:  10, left:  50,
      icon: 'D',  iconBg: '#4945FF', iconFg: '#fff',
      name: 'Delt Capital', ago: '2m ago', msg: 'Bloom Beauty funded · $65K' },
    { kind: 'pill', top: 130, left: 130,
      img: 'app/assets/cases/04_larosa.jpg', tag: 'La Rosa', tagBg: '#0B2C5C' },
    { kind: 'card', top: 250, left:  30,
      icon: 'R',  iconBg: '#0F7A5A', iconFg: '#fff',
      name: 'Rosario Const.', ago: 'now',   msg: 'Wired $180,000 · 1.14×' },
    { kind: 'pill', top: 370, left: 170,
      img: 'app/assets/cases/03_bloom.jpg', tag: 'Bloom Beauty', tagBg: '#4945FF' },
    { kind: 'card', top: 490, left:  60,
      icon: 'W',  iconBg: '#7DD3FC', iconFg: '#041E42',
      name: 'Ward Market',    ago: '1h ago', msg: 'Funded $50,000 · 1.18×' },
  ];

  return (
    <section data-v1-section ref={ref} style={{ background: '#F5F7FB', padding: mobile ? '64px 0' : '120px 0' }}>
      <div data-v1-grid-2col style={{
        maxWidth: 1200, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px',
        display: 'grid', gridTemplateColumns: mobile ? '1fr' : '45% 55%',
        gap: mobile ? 40 : 64, alignItems: 'center',
      }}>
        {/* Left — spine + threaded notification cards + story pills. */}
        {mobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.filter(i => i.kind === 'card').map((c) => (
              <PlxFundedCard key={c.name} icon={c.icon} iconBg={c.iconBg} iconFg={c.iconFg}
                name={c.name} msg={c.msg} ago={c.ago} />
            ))}
          </div>
        ) : (
          <div style={{ position: 'relative', height: 620, width: '100%' }}>
            <PlxNetworkSpine />
            {items.map((it, i) => (
              <div key={i} style={{
                position: 'absolute', top: it.top, left: it.left,
                filter: 'drop-shadow(0 6px 14px rgba(15,14,23,0.06))',
              }}>
                {it.kind === 'card'
                  ? <PlxFundedCard icon={it.icon} iconBg={it.iconBg} iconFg={it.iconFg} name={it.name} msg={it.msg} ago={it.ago} />
                  : <PlxStoryPill img={it.img} tag={it.tag} tagBg={it.tagBg} />}
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
          }}>Sharper offers, every year we've been at it.</h2>
          <p style={{ margin: '20px 0 0', fontFamily: DELT.font.body, fontSize: 17, lineHeight: 1.6, color: DELT.colors.inkSoft, maxWidth: 460 }}>
            2,850+ businesses funded. $200M+ deployed since 2019. That track record is why your offer lands faster and priced better.
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

// Capital: a simple, plain-English offer card. Big amount, clear repayment,
// obvious CTA — nothing that requires industry knowledge to understand.
function PlxTabCapital() {
  return (
    <div style={{ background: '#fff', color: DELT.colors.ink, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '22px 28px', borderBottom: `1px solid ${DELT.colors.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 15, color: DELT.colors.indigo }}>Your funding offer</span>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0FA968', background: 'rgba(15,169,104,0.10)', padding: '5px 12px', borderRadius: 999 }}>Ready to fund</span>
      </div>
      <div style={{ padding: '36px 28px 12px', textAlign: 'center' }}>
        <div style={{ fontFamily: DELT.font.mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>You get today</div>
        <div style={{ fontFamily: DELT.font.display, fontSize: 68, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, marginTop: 8, background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$125,000</div>
        <div style={{ fontFamily: DELT.font.body, fontSize: 15, color: DELT.colors.inkSoft, marginTop: 14 }}>Wired to your account within 24 hours.</div>
      </div>
      <div style={{ padding: '28px 28px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* MCA framing — no fixed term. Holdback (percentage of daily card
            settlements) replaces a weekly duration; total repaid is factor
            × advance. Payback duration flexes with revenue. */}
        {[
          ['Holdback',    '9% of sales'],
          ['Factor',      '1.16×'],
          ['Total repaid','$145,000'],
        ].map(([l, v]) => (
          <div key={l} style={{ textAlign: 'center', padding: 14, borderRadius: 12, background: 'rgba(73,69,255,0.04)', border: `1px solid ${DELT.colors.lineSoft}` }}>
            <div style={{ fontFamily: DELT.font.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>{l}</div>
            <div style={{ fontFamily: DELT.font.display, fontSize: 18, fontWeight: 700, color: DELT.colors.ink, marginTop: 6, letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 28, marginTop: 'auto' }}>
        <div style={{ background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`, color: '#fff', textAlign: 'center', borderRadius: 12, padding: '15px 0', fontFamily: DELT.font.body, fontWeight: 600, fontSize: 16, boxShadow: '0 12px 24px rgba(73,69,255,0.25)' }}>Accept offer →</div>
        <div style={{ marginTop: 14, textAlign: 'center', fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute }}>No collateral. No hidden fees. Pay early, pay less.</div>
      </div>
    </div>
  );
}
function PlxTabCapital_OLD() {
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

// Payments: a clean rate-card layout. "You pay less. You get paid faster."
// Two big numbers with a supporting proof point — no jargon.
function PlxTabPayments() {
  return (
    <div style={{ background: '#fff', color: DELT.colors.ink, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '22px 28px', borderBottom: `1px solid ${DELT.colors.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 15, color: DELT.colors.indigo }}>Your processing rate</span>
        <span style={{ fontFamily: DELT.font.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Monthly savings</span>
      </div>
      <div style={{ padding: '30px 28px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 22, borderRadius: 14, border: `1px solid ${DELT.colors.lineSoft}`, background: 'rgba(15,14,23,0.02)' }}>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Old processor</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 40, fontWeight: 700, color: DELT.colors.inkMute, marginTop: 8, letterSpacing: '-0.025em', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>2.90%</div>
          <div style={{ fontFamily: DELT.font.body, fontSize: 13, color: DELT.colors.inkMute, marginTop: 4 }}>+ $0.30 per swipe</div>
        </div>
        <div style={{ padding: 22, borderRadius: 14, border: `1px solid ${DELT.colors.indigo}`, background: 'rgba(73,69,255,0.06)', position: 'relative' }}>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.indigo }}>With Delt</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 40, fontWeight: 700, marginTop: 8, letterSpacing: '-0.025em', background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontVariantNumeric: 'tabular-nums' }}>1.79%</div>
          <div style={{ fontFamily: DELT.font.body, fontSize: 13, color: DELT.colors.ink, marginTop: 4 }}>+ $0.10 per swipe</div>
        </div>
      </div>
      <div style={{ margin: '4px 28px 0', padding: 18, borderRadius: 14, background: `linear-gradient(90deg, rgba(73,69,255,0.08), rgba(125,211,252,0.10))`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>You save every month</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 28, fontWeight: 700, color: DELT.colors.ink, letterSpacing: '-0.02em', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>$1,240</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: DELT.font.mono, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Deposits arrive</div>
          <div style={{ fontFamily: DELT.font.display, fontSize: 22, fontWeight: 700, color: DELT.colors.indigo, letterSpacing: '-0.02em', marginTop: 2 }}>Next day</div>
        </div>
      </div>
      <div style={{ padding: 28, marginTop: 'auto', textAlign: 'center', fontFamily: DELT.font.body, fontSize: 13, color: DELT.colors.inkMute }}>
        Works with your existing terminals. We’ll beat any rate in writing.
      </div>
    </div>
  );
}
function PlxTabPayments_OLD() {
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

function PlxTabPortal() {
  return (
    <img
      src="app/assets/mocks/delt_tabs_portal_polished.jpg"
      alt="Delt Portal agent commissions and merchants"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
}
function PlxTabPortal_OLD() {
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
  const tabs = ['Capital', 'Payments'];
  // Wrap each mock so it stretches to fill the 800px card (flex child).
  const mockInner = tab === 'Capital' ? <PlxTabCapital /> : <PlxTabPayments />;
  const mock = <div style={{ width: '100%' }}>{mockInner}</div>;

  return (
    <section data-v1-section style={{ background: `radial-gradient(80% 100% at 50% 0%, #0A1A6E 0%, #041E42 55%, #030F26 100%)`, padding: mobile ? '64px 0' : '120px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: mobile ? '0 20px' : '0 32px', textAlign: 'center' }}>
        <V1Reveal>
          <h2 data-v1-section-title style={{
            margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
            fontSize: mobile ? 32 : 72, letterSpacing: '-0.03em', lineHeight: 1.02, color: '#fff',
          }}>Capital and payments, working together.</h2>
          <p style={{ margin: '20px auto 0', fontFamily: DELT.font.body, fontSize: mobile ? 16 : 18, color: 'rgba(247,245,240,0.65)', maxWidth: 560 }}>
            Get the money you need. Keep more of every sale. That’s it.
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
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column' }}
    >
      {/* Image panel with rainbow-glow hover border (Plaid's signature). */}
      <div style={{ position: 'relative' }}>
        {/* Glow border — appears only on hover. */}
        <div aria-hidden style={{
          position: 'absolute', inset: -6, borderRadius: 22,
          background: 'conic-gradient(from 200deg at 50% 50%, #7DD3FC, #7C6BFF, #8B5CF6, #DBF3FF, #7DD3FC)',
          filter: 'blur(16px)',
          opacity: hover ? 0.6 : 0,
          transition: 'opacity .28s ease-out',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden',
          borderRadius: 16, background: '#fff',
          border: hover ? '1px solid rgba(125,211,252,0.55)' : `1px solid ${DELT.colors.line}`,
          transition: 'border-color .28s',
        }}>
          <img src={img} alt="" loading="lazy"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          {/* Left-side ink gradient for the white wordmark. */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(15,14,23,0.55) 0%, rgba(15,14,23,0.15) 45%, rgba(15,14,23,0) 65%)',
          }} />
          <div style={{
            position: 'absolute', top: 20, left: 22,
            fontFamily: DELT.font.display, fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em',
            color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.35)',
          }}>{wordmark}</div>
        </div>
      </div>
      {/* Copy — sits directly on the section bg (NO wrapping card). */}
      <div style={{ padding: '22px 2px 4px' }}>
        <p style={{ margin: 0, fontFamily: DELT.font.display, fontWeight: 600, fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.02em', color: DELT.colors.ink }}>{headline}</p>
        <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: DELT.font.body, fontSize: 15, fontWeight: 500, color: DELT.colors.indigo }}>
          <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: 999, border: `1px solid ${DELT.colors.indigo}`, alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 14 14"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
    { img: 'app/assets/cases/02_roberts.jpg',  wordmark: 'Roberts Auto',         headline: 'Roberts Auto: a real underwriter knew my file, not a call center.' },
    { img: 'app/assets/cases/03_bloom.jpg',    wordmark: 'Bloom Beauty',         headline: 'Bloom Beauty grew revenue 40% on $65K of working capital.' },
    { img: 'app/assets/cases/04_larosa.jpg',   wordmark: 'La Rosa Restaurant',   headline: 'La Rosa Restaurant closed in 19 hours — not 19 days.' },
    { img: 'app/assets/cases/05_rosario.jpg',  wordmark: 'Rosario Construction', headline: 'Rosario’s 3rd draw — each rate lower than the last.' },
    { img: 'app/assets/cases/06_williams.jpg', wordmark: 'Williams Logistics',   headline: 'Williams paid early — Delt rebated the unearned factor.' },
  ];
  const loop = [...stories, ...stories];

  return (
    <section data-v1-section style={{ background: '#F5F7FB', padding: mobile ? '64px 0' : '120px 0', overflow: 'hidden' }}>
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
    <section data-v1-section style={{
      position: 'relative', overflow: 'hidden',
      background: `radial-gradient(80% 100% at 100% 50%, #1FA9E6 0%, #1F6CB8 30%, #123A82 60%, #0B2C5C 90%, #041E42 100%)`,
      padding: mobile ? '72px 0 96px' : '140px 0 180px',
    }}>
      {/* Ambient topography lines on the left half, echoes the AI banner. */}
      {!mobile && (
        <svg aria-hidden viewBox="0 0 700 700" width="700" height="700" preserveAspectRatio="none"
          style={{ position: 'absolute', left: -80, top: 40, opacity: 0.28, pointerEvents: 'none' }}>
          {Array.from({ length: 26 }, (_, i) => (
            <path key={i}
              d={`M ${-40 + i*4} 0 Q ${180 + i*8} ${160 + i*6}, ${100 + i*6} ${380 - i*4} T ${-20 + i*2} 700`}
              fill="none" stroke="rgba(125,211,252,0.55)" strokeWidth="0.6" />
          ))}
        </svg>
      )}

      <div style={{
        position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto',
        padding: mobile ? '0 20px' : '0 32px',
        display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
        gap: mobile ? 40 : 56, alignItems: 'center',
      }}>
        {/* Left — large white headline over the gradient. */}
        <div>
          <h2 style={{
            margin: 0, fontFamily: DELT.font.display, fontWeight: 600,
            fontSize: mobile ? 44 : 88, letterSpacing: '-0.035em',
            lineHeight: 0.95, color: '#fff',
          }}>
            <span style={{ color: '#7DD3FC' }}>Built for the</span><br/>
            <span style={{ color: '#B6E9FF' }}>business you</span><br/>
            <span style={{ color: '#DBF3FF' }}>built.</span>
          </h2>
        </div>

        {/* Right — white floating form card with rainbow-glow border. */}
        <div style={{ position: 'relative' }}>
          {/* Rainbow glow border — a slightly larger blurred rounded rect behind the card. */}
          <div aria-hidden style={{
            position: 'absolute', inset: -6, borderRadius: 26,
            background: 'conic-gradient(from 200deg at 50% 50%, #7DD3FC, #7C6BFF, #8B5CF6, #DBF3FF, #7DD3FC)',
            filter: 'blur(14px)', opacity: 0.55, pointerEvents: 'none',
          }} />
          <form onSubmit={submit} style={{
            position: 'relative',
            width: '100%', background: '#fff', borderRadius: 22,
            padding: mobile ? 28 : 40,
            boxShadow: '0 40px 80px rgba(4,30,66,0.35), 0 0 0 1px rgba(125,211,252,0.4)',
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
              background: 'linear-gradient(90deg, #7DD3FC 0%, #7C6BFF 100%)', color: '#041E42',
              padding: '14px 0',
              fontFamily: DELT.font.body, fontSize: 15, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>Talk with our team</button>
          </form>
        </div>
      </div>

      {/* Bottom pill — Plaid's "Manage your connections" style callout. */}
      <div style={{
        position: 'relative', zIndex: 1, maxWidth: 1136, margin: mobile ? '48px 20px 0' : '80px auto 0',
        background: '#F0E8FF', borderRadius: 999,
        padding: mobile ? '14px 18px' : '18px 28px',
        display: 'flex', alignItems: 'center', gap: mobile ? 12 : 24, flexWrap: 'wrap',
        boxShadow: '0 10px 32px rgba(4,30,66,0.20)',
      }}>
        <span aria-hidden style={{
          display: 'inline-flex', width: 32, height: 32, borderRadius: 8,
          background: '#4945FF', color: '#fff',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontFamily: DELT.font.display, fontWeight: 700, fontSize: 15,
        }}>🔒</span>
        <span style={{ fontFamily: DELT.font.body, fontSize: mobile ? 13 : 15, color: '#041E42', flex: 1, minWidth: 200 }}>
          When you fund with Delt, you keep control of the deposits, the terminals, and the customer list.
        </span>
        <a href="#about" style={{
          fontFamily: DELT.font.body, fontSize: mobile ? 13 : 15, fontWeight: 600,
          color: '#4945FF', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>Read our operator promise &raquo;</a>
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
