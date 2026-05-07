// V1 How It Works — bespoke, sleek, stylized page with animation.
// Structure:
//   1. Oversized hero with animated timeline preview
//   2. Four sticky scroll-scrubbed steps, each with a mock UI animation:
//      • 01 Apply — form autocompleting
//      • 02 Connect — bank accounts linking
//      • 03 Offer — factor rate spinning into place
//      • 04 Funded — wire confirmation
//   3. Time-to-funds comparison strip
//   4. Under the hood (what happens on our side)
//   5. CTA

const { useState: hwUseState, useEffect: hwUseEffect, useRef: hwUseRef } = React;

// ─── Small inline icons ───
function HwIcon({ kind, size = 14 }) {
  const p = { width: size, height: size, viewBox: '0 0 14 14', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'check')   return <svg {...p}><path d="M2.5 7.2L5.3 10 11.5 3.8" /></svg>;
  if (kind === 'arr')     return <svg {...p}><path d="M3 7h8M8 4l3 3-3 3" /></svg>;
  if (kind === 'lock')    return <svg {...p}><rect x="3" y="6" width="8" height="6" rx="1"/><path d="M5 6V4.5a2 2 0 014 0V6"/></svg>;
  if (kind === 'dot')     return <svg {...p} fill="currentColor" stroke="none"><circle cx="7" cy="7" r="3"/></svg>;
  if (kind === 'zap')     return <svg {...p} fill="currentColor" stroke="none"><path d="M8 1L2 8h4l-1 5 6-7H7l1-5z"/></svg>;
  if (kind === 'clock')   return <svg {...p}><circle cx="7" cy="7" r="5.5"/><path d="M7 4v3l2 1.5"/></svg>;
  if (kind === 'wire')    return <svg {...p}><path d="M2 7h10M10 4l2 3-2 3"/></svg>;
  if (kind === 'spark')   return <svg {...p}><path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M3 11l2-2M9 5l2-2"/></svg>;
  return null;
}

// ═══════════════════════════════════════════════════════════════
// HERO — oversized type with animated timeline preview
// ═══════════════════════════════════════════════════════════════
function HwHero({ accent, onApply }) {
  return (
    <section data-v1-section style={{
      position: 'relative', overflow: 'hidden',
      background: V1.bg, padding: '120px 40px 100px',
      borderBottom: `1px solid ${V1.line}`,
    }}>
      {/* Subtle radial gradient */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 800px 400px at 50% 0%, ${V1.blue}12 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 920, margin: '0 auto' }}>
          <V1Eyebrow>How it works</V1Eyebrow>
          <h1 data-v1-section-title style={{
            fontFamily: V1.fontDisplay,
            fontSize: 'clamp(3rem, 7.5vw, 5.75rem)',
            fontWeight: 600, letterSpacing: '-0.045em',
            lineHeight: 0.98, color: V1.ink,
            margin: '28px 0 0',
          }}>
            From application<br/>to{' '}
            <em style={{
              display: 'inline-block',
              fontStyle: 'italic', fontFamily: '"Source Serif Pro", Georgia, serif',
              fontWeight: 400, letterSpacing: '-0.02em',
              background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              paddingRight: '0.18em', marginRight: '-0.04em',
            }}>wire</em> in 24 hours.
          </h1>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 19, lineHeight: 1.55,
            color: V1.text, margin: '32px auto 0', maxWidth: 620,
          }}>
            Four steps. No paperwork. No phone tag. A direct-lender model that
            cuts three weeks off the way banks do this.
          </p>
        </div>

        {/* Animated timeline preview */}
        <HwTimelinePreview accent={accent} />
      </div>
    </section>
  );
}

// ─── Animated dot-to-dot timeline ───
function HwTimelinePreview({ accent }) {
  const [progress, setProgress] = hwUseState(0);
  hwUseEffect(() => {
    let raf, start = null;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 3000, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(step);
      else setTimeout(() => { start = null; setProgress(0); raf = requestAnimationFrame(step); }, 1500);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const steps = [
    { t: 'Apply',   m: '2 min',  sub: 'Soft pull only' },
    { t: 'Connect', m: '60 sec', sub: 'Plaid → bank' },
    { t: 'Offer',   m: '< 4 hr', sub: 'Human underwriter' },
    { t: 'Funded',  m: '24 hr',  sub: 'ACH to your account' },
  ];

  return (
    <div style={{
      marginTop: 72, padding: '48px 32px 36px',
      background: V1.white, border: `1px solid ${V1.line}`,
      borderRadius: 24,
      boxShadow: '0 1px 2px rgba(10,37,64,0.03), 0 30px 60px -40px rgba(10,37,64,0.18)',
      maxWidth: 980, marginLeft: 'auto', marginRight: 'auto',
    }}>
      <div style={{ position: 'relative', padding: '0 28px' }}>
        {/* Track */}
        <div style={{
          position: 'absolute', top: 18, left: 28 + 16, right: 28 + 16, height: 2,
          background: V1.line,
          zIndex: 0,
        }} />
        {/* Fill */}
        <div style={{
          position: 'absolute', top: 18, left: 28 + 16, height: 2,
          width: `calc((100% - ${(28 + 16) * 2}px) * ${progress})`,
          background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
          transition: 'width .1s linear',
          zIndex: 0,
        }} />

        <div data-v1-grid-4col style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative', zIndex: 1 }}>
          {steps.map((s, i) => {
            const reached = progress >= i / (steps.length - 1);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{
                  position: 'relative', zIndex: 2,
                  width: 36, height: 36, borderRadius: 999,
                  background: reached ? V1.blue : V1.white,
                  border: `2px solid ${reached ? V1.blue : V1.line}`,
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: V1.fontMono, fontSize: 11.5, fontWeight: 600,
                  transition: 'all .3s',
                  boxShadow: reached ? `0 0 0 6px ${V1.blue}1A` : 'none',
                }}>
                  {reached ? <HwIcon kind="check" size={14} /> : <span style={{ color: V1.muted }}>{String(i + 1).padStart(2, '0')}</span>}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600, color: V1.ink, letterSpacing: '-0.015em' }}>
                    {s.t}
                  </div>
                  <div style={{
                    fontFamily: V1.fontMono, fontSize: 11, color: V1.blue,
                    fontWeight: 600, marginTop: 4, letterSpacing: '0.05em',
                  }}>{s.m}</div>
                  <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 2 }}>
                    {s.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCROLL-SCRUBBED STEP SECTION
// Each step = left sticky explainer, right sticky mock-UI animation
// ═══════════════════════════════════════════════════════════════
function HwStep({ num, label, title, body, bullets, mockKind, accent }) {
  const [active, setActive] = hwUseState(false);
  const [progress, setProgress] = hwUseState(0);
  const sectionRef = hwUseRef(null);

  hwUseEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress across section, 0 when top hits bottom of viewport, 1 when bottom hits top
      const totalTravel = r.height + vh;
      const scrolled = Math.max(0, Math.min(totalTravel, vh - r.top));
      setProgress(scrolled / totalTravel);
      setActive(r.top < vh * 0.6 && r.bottom > vh * 0.4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section data-v1-section ref={sectionRef} style={{
      padding: '120px 40px',
      borderBottom: `1px solid ${V1.line}`,
      background: V1.bg,
    }}>
      <div data-v1-grid-2col style={{
        maxWidth: 1240, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 80,
        alignItems: 'center',
      }}>
        {/* LEFT — explainer */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
            <div style={{
              fontFamily: V1.fontDisplay,
              fontSize: 'clamp(4rem, 9vw, 7rem)',
              fontWeight: 600, letterSpacing: '-0.05em',
              lineHeight: 0.9,
              background: `linear-gradient(135deg, ${V1.blue}, #818CF8 70%, ${V1.blue})`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {num}
            </div>
            <V1Eyebrow>{label}</V1Eyebrow>
          </div>

          <h2 data-v1-section-title style={{
            ...v1H2,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            lineHeight: 1.08, marginBottom: 20,
          }}>
            {title}
          </h2>

          <p style={{
            fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.6,
            color: V1.text, margin: 0, maxWidth: 500,
          }}>
            {body}
          </p>

          {bullets && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '32px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{
                    flexShrink: 0, marginTop: 3, width: 18, height: 18, borderRadius: 999,
                    background: `${V1.blue}18`, color: V1.blue,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <HwIcon kind="check" size={11} />
                  </span>
                  <span style={{ fontFamily: V1.fontBody, fontSize: 15, color: V1.text, lineHeight: 1.55 }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT — mock UI */}
        <div style={{ position: 'relative' }}>
          {mockKind === 'apply'   && <HwMockApply progress={progress} active={active} />}
          {mockKind === 'connect' && <HwMockConnect progress={progress} active={active} />}
          {mockKind === 'offer'   && <HwMockOffer progress={progress} active={active} />}
          {mockKind === 'funded'  && <HwMockFunded progress={progress} active={active} />}
        </div>
      </div>
    </section>
  );
}

// ─── Mock 1: Form autocompleting ───
function HwMockApply({ progress, active }) {
  const fields = [
    { l: 'Legal business name', v: "Ruby's Roast & Grind, LLC", r: 0.05, e: 0.25 },
    { l: 'EIN',                 v: '84-2158972',                r: 0.25, e: 0.40 },
    { l: 'Monthly revenue',     v: '$86,400',                   r: 0.40, e: 0.60 },
    { l: 'Time in business',    v: '3 years, 2 months',         r: 0.60, e: 0.78 },
    { l: 'Requested amount',    v: '$120,000',                  r: 0.78, e: 0.95 },
  ];

  return (
    <MockFrame title="application.delt.co" progress={progress}>
      <div style={{ padding: 28 }}>
        <div style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.18em', color: V1.muted, textTransform: 'uppercase',
        }}>Step 1 of 4</div>
        <div style={{
          fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
          color: V1.ink, letterSpacing: '-0.02em', marginTop: 10, marginBottom: 22,
        }}>
          Tell us about your business
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map((f, i) => {
            const typeProg = Math.max(0, Math.min(1, (progress - f.r) / (f.e - f.r)));
            const chars = Math.floor(f.v.length * typeProg);
            const typedText = f.v.slice(0, chars);
            const isTyping = typeProg > 0 && typeProg < 1;
            const isDone = typeProg >= 1;
            return (
              <div key={i} style={{
                background: isDone ? `${V1.blue}06` : V1.white,
                border: `1px solid ${isTyping ? V1.blue : isDone ? `${V1.blue}33` : V1.line}`,
                borderRadius: 10, padding: '10px 14px',
                transition: 'all .3s',
              }}>
                <div style={{
                  fontFamily: V1.fontMono, fontSize: 9.5, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.14em',
                  color: V1.muted, marginBottom: 3,
                }}>{f.l}</div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                  fontFamily: V1.fontBody, fontSize: 14, fontWeight: 500,
                  color: typedText ? V1.ink : V1.muted, minHeight: 20,
                }}>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {typedText || '—'}
                    {isTyping && <span style={{ color: V1.blue, animation: 'hwBlink 1s infinite' }}>|</span>}
                  </span>
                  {isDone && <span style={{ color: V1.blue }}><HwIcon kind="check" size={14} /></span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MockFrame>
  );
}

// ─── Mock 2: Bank linking via Plaid-style modal ───
function HwMockConnect({ progress, active }) {
  const banks = [
    { n: 'Chase Business Checking',      l: '••5821', r: 0.1, e: 0.35, color: '#117ACA' },
    { n: 'Amex Business Blue',           l: '••3142', r: 0.35, e: 0.60, color: '#2E77BB' },
    { n: 'Square — Daily Deposits',      l: '••7731', r: 0.60, e: 0.85, color: '#3e4348' },
  ];

  return (
    <MockFrame title="secure.plaid.delt.co" progress={progress} secure>
      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${V1.blue}12`, color: V1.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HwIcon kind="lock" size={20} />
          </div>
          <div>
            <div style={{ fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 600, color: V1.ink, letterSpacing: '-0.015em' }}>
              Link your accounts
            </div>
            <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted, marginTop: 2 }}>
              Read-only. 256-bit encryption. Plaid partner.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {banks.map((b, i) => {
            const bp = Math.max(0, Math.min(1, (progress - b.r) / (b.e - b.r)));
            const state = bp === 0 ? 'idle' : bp < 0.5 ? 'linking' : bp < 1 ? 'verifying' : 'linked';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                background: V1.white,
                border: `1px solid ${state === 'linked' ? `${V1.blue}44` : V1.line}`,
                borderRadius: 12, transition: 'all .3s',
                boxShadow: state === 'linking' || state === 'verifying' ? `0 0 0 3px ${V1.blue}12` : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: b.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontFamily: V1.fontDisplay, fontSize: 14, fontWeight: 700,
                }}>
                  {b.n[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600, color: V1.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.n}
                  </div>
                  <div style={{ fontFamily: V1.fontMono, fontSize: 11.5, color: V1.muted, marginTop: 2 }}>
                    {b.l} · {
                      state === 'idle'      ? 'Waiting' :
                      state === 'linking'   ? 'Authenticating…' :
                      state === 'verifying' ? 'Reading 90-day history' :
                                              'Linked · 90 days verified'
                    }
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {state === 'idle' && (
                    <div style={{ width: 18, height: 18, borderRadius: 999, background: V1.line }} />
                  )}
                  {(state === 'linking' || state === 'verifying') && (
                    <div style={{
                      width: 18, height: 18, borderRadius: 999,
                      border: `2px solid ${V1.blue}22`, borderTopColor: V1.blue,
                      animation: 'hwSpin 0.8s linear infinite',
                    }} />
                  )}
                  {state === 'linked' && (
                    <div style={{
                      width: 18, height: 18, borderRadius: 999, background: V1.blue,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <HwIcon kind="check" size={11} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 20, padding: '12px 14px', borderRadius: 10,
          background: `${V1.blue}06`, fontFamily: V1.fontMono, fontSize: 11.5,
          color: V1.muted, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <HwIcon kind="lock" size={13} />
          We see balances, not credentials. Revoke anytime.
        </div>
      </div>
    </MockFrame>
  );
}

// ─── Mock 3: Offer "spinning" into place ───
function HwMockOffer({ progress, active }) {
  // Factor rate animates from 1.45 → 1.18 as progress goes 0 → 1
  const factor = 1.45 - (1.45 - 1.18) * Math.min(1, progress * 1.5);
  const amount = Math.floor(120000 * Math.min(1, progress * 1.3));
  const payment = Math.floor(5842 * Math.min(1, progress * 1.4));
  const fmt$ = (n) => '$' + n.toLocaleString();
  const locked = progress > 0.75;

  return (
    <MockFrame title="offer.delt.co/RR-87421" progress={progress}>
      <div style={{ padding: 0 }}>
        {/* Top banner */}
        <div style={{
          padding: '14px 28px',
          background: locked ? `linear-gradient(90deg, ${V1.blue}, #818CF8)` : V1.bgWarm,
          color: locked ? '#fff' : V1.muted,
          fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all .4s',
        }}>
          <span>{locked ? 'Offer ready' : 'Underwriting · Live'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: locked ? '#fff' : V1.blue,
              animation: locked ? 'none' : 'hwPulse 1.4s ease-in-out infinite',
            }} />
            {locked ? 'Expires in 72h' : 'Analyst #E2 on file'}
          </span>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', color: V1.muted, textTransform: 'uppercase',
          }}>Approved advance</div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 56, fontWeight: 700,
            color: V1.ink, letterSpacing: '-0.04em', lineHeight: 1,
            marginTop: 8, fontVariantNumeric: 'tabular-nums',
          }}>
            {fmt$(amount)}
          </div>

          <div data-v1-grid-2col style={{
            marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            border: `1px solid ${V1.line}`, borderRadius: 14, overflow: 'hidden',
          }}>
            <OfferCell label="Factor rate" value={`${factor.toFixed(3).replace(/0$/, '')}×`} emphasis />
            <OfferCell label="Total payback" value={fmt$(Math.floor(amount * factor))} />
            <OfferCell label="Daily debit" value={fmt$(payment / 20) + '/bd'} />
            <OfferCell label="Term" value="8 months" />
          </div>

          {/* Compare chip */}
          <div style={{
            marginTop: 16, padding: '10px 14px',
            background: `${V1.green}10`, border: `1px solid ${V1.green}33`,
            borderRadius: 10,
            fontFamily: V1.fontBody, fontSize: 12.5, color: V1.green, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <HwIcon kind="spark" size={13} />
            {locked ? '19% below your average competing quote' : 'Scoring against 6 competing quotes…'}
          </div>

          {/* Sign row */}
          <div style={{
            marginTop: 20, padding: '14px 18px', borderRadius: 12,
            background: locked ? V1.ink : V1.bgWarm, color: locked ? '#fff' : V1.muted,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
            transition: 'all .4s',
          }}>
            <span>{locked ? 'E-sign to lock your funds' : 'Calculating your rate…'}</span>
            {locked && <HwIcon kind="arr" size={14} />}
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

function OfferCell({ label, value, emphasis }) {
  return (
    <div style={{
      padding: '16px 18px',
      borderRight: `1px solid ${V1.line}`,
      borderBottom: `1px solid ${V1.line}`,
      background: emphasis ? `${V1.blue}06` : V1.white,
    }}>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
      }}>{label}</div>
      <div style={{
        fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 700,
        color: emphasis ? V1.blue : V1.ink, letterSpacing: '-0.02em', marginTop: 4,
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
    </div>
  );
}

// ─── Mock 4: Wire confirmation ───
function HwMockFunded({ progress, active }) {
  const ticks = [
    { l: 'Offer signed',         r: 0.05 },
    { l: 'ACH initiated',        r: 0.22 },
    { l: 'Routing verified',     r: 0.40 },
    { l: 'In transit to Chase',  r: 0.60 },
    { l: 'Funds available',      r: 0.85 },
  ];

  return (
    <MockFrame title="delt.co/receipts/RR-87421" progress={progress}>
      <div style={{ padding: 28 }}>
        <div style={{
          padding: '18px 20px', borderRadius: 14,
          background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
          color: '#fff',
        }}>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85,
          }}>Wire confirmed</div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 44, fontWeight: 700,
            letterSpacing: '-0.035em', lineHeight: 1, marginTop: 8,
            fontVariantNumeric: 'tabular-nums',
          }}>
            $120,000.00
          </div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13, marginTop: 8, opacity: 0.9,
          }}>
            Chase Business Checking ••5821 · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
            marginBottom: 14,
          }}>Timeline</div>

          <div style={{ position: 'relative', paddingLeft: 22 }}>
            {/* Vertical track */}
            <div style={{
              position: 'absolute', left: 7, top: 6, bottom: 6, width: 2,
              background: V1.line,
            }} />
            <div style={{
              position: 'absolute', left: 7, top: 6, width: 2,
              height: `calc((100% - 12px) * ${Math.min(1, progress * 1.1)})`,
              background: `linear-gradient(180deg, ${V1.blue}, #818CF8)`,
              transition: 'height .3s',
            }} />

            {ticks.map((t, i) => {
              const done = progress > t.r;
              return (
                <div key={i} style={{
                  position: 'relative', padding: '7px 0',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{
                    position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)',
                    width: 16, height: 16, borderRadius: 999,
                    background: done ? V1.blue : V1.white,
                    border: `2px solid ${done ? V1.blue : V1.line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .3s',
                    boxShadow: done ? `0 0 0 4px ${V1.blue}14` : 'none',
                  }}>
                    {done && <span style={{ width: 6, height: 6, borderRadius: 999, background: '#fff' }} />}
                  </div>
                  <span style={{
                    fontFamily: V1.fontBody, fontSize: 13.5,
                    color: done ? V1.ink : V1.muted, fontWeight: done ? 500 : 400,
                  }}>
                    {t.l}
                  </span>
                  <span style={{
                    fontFamily: V1.fontMono, fontSize: 11,
                    color: done ? V1.blue : V1.muted, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {done ? 'Done' : '— —'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

// ─── Browser-frame wrapper for mocks ───
function MockFrame({ title, children, progress, secure }) {
  return (
    <div style={{
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(10,37,64,0.04), 0 40px 80px -40px rgba(10,37,64,0.22)',
    }}>
      {/* Fake chrome */}
      <div style={{
        padding: '11px 14px', borderBottom: `1px solid ${V1.line}`,
        background: V1.bgWarm,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#FF5F57' }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#FEBC2E' }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#28C840' }} />
        </div>
        <div style={{
          flex: 1, padding: '5px 12px', background: V1.white,
          border: `1px solid ${V1.line}`, borderRadius: 6,
          fontFamily: V1.fontMono, fontSize: 11.5, color: V1.muted,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          {secure && <HwIcon kind="lock" size={10} />}
          {title}
        </div>
      </div>
      {/* Body */}
      <div>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SPEED STRIP — how we compare
// ═══════════════════════════════════════════════════════════════
function HwSpeedStrip() {
  const rows = [
    { who: 'Delt',           days: 1,  value: '< 24 hr', color: V1.blue, emphasis: true },
    { who: 'Online broker',  days: 5,  value: '3–5 days', color: V1.muted },
    { who: 'SBA loan',       days: 18, value: '2–4 wks',  color: V1.muted },
    { who: 'Regional bank',  days: 32, value: '4–6 wks',  color: V1.muted },
  ];
  const maxDays = 35;

  return (
    <section data-v1-section style={{ padding: '120px 40px', background: V1.white, borderBottom: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div data-v1-grid-2col style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
          alignItems: 'end', marginBottom: 56,
        }}>
          <div>
            <V1Eyebrow>Time to funds</V1Eyebrow>
            <h2 data-v1-section-title style={{ ...v1H2, marginTop: 18 }}>
              Faster because<br/>we <em style={{
                display: 'inline-block',
                fontStyle: 'italic', fontFamily: '"Source Serif Pro", Georgia, serif',
                fontWeight: 400, letterSpacing: '-0.015em',
                background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                paddingRight: '0.18em', marginRight: '-0.04em',
              }}>are</em> the lender.
            </h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 16, color: V1.text,
            lineHeight: 1.6, maxWidth: 480, justifySelf: 'end', margin: 0,
          }}>
            No broker hand-off. No second-look committee. Your application goes
            straight to a Delt underwriter — every step below happens on a single desk.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {rows.map((r, i) => (
            <div data-v1-grid-3col key={i} style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 110px',
              alignItems: 'center', gap: 24,
            }}>
              <div style={{
                fontFamily: V1.fontDisplay,
                fontSize: r.emphasis ? 22 : 17,
                fontWeight: r.emphasis ? 700 : 500,
                letterSpacing: '-0.02em',
                color: r.emphasis ? V1.ink : V1.muted,
              }}>
                {r.who}
              </div>
              <div style={{
                position: 'relative', height: r.emphasis ? 32 : 22,
                background: r.emphasis ? 'transparent' : '#EEF1F6',
                border: r.emphasis ? 'none' : `1px solid ${V1.line}`,
                borderRadius: 6,
                overflow: 'visible',
              }}>
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: 0,
                  width: `${(r.days / maxDays) * 100}%`,
                  background: r.emphasis
                    ? `linear-gradient(90deg, ${V1.blue}, #818CF8)`
                    : '#B8C0CC',
                  borderRadius: 6,
                  boxShadow: r.emphasis ? `0 4px 16px ${V1.blue}55` : 'none',
                }} />
                {r.emphasis && (
                  <span style={{
                    position: 'absolute',
                    left: `calc(${(r.days / maxDays) * 100}% + 12px)`,
                    top: '50%', transform: 'translateY(-50%)',
                    fontFamily: V1.fontMono, fontSize: 11, fontWeight: 700,
                    color: V1.blue, letterSpacing: '0.08em', textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    We're here
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 13, fontWeight: 600,
                color: r.emphasis ? V1.blue : V1.muted,
                fontVariantNumeric: 'tabular-nums', textAlign: 'right',
              }}>
                {r.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNDER THE HOOD — what happens on our side
// ═══════════════════════════════════════════════════════════════
function HwUnderTheHood() {
  const items = [
    { k: '01', t: 'Deposit analysis',  d: 'We read 90 days of your business deposits via Plaid. Volume, consistency, and seasonality set the base advance range.' },
    { k: '02', t: 'Identity + KYB',    d: 'Entity resolution against Sec of State, EIN verification, UCC lien check, principal KYC — all on one screen.' },
    { k: '03', t: 'Capital stack',     d: 'We check open positions with other lenders so the payment schedule we size actually fits your cash flow.' },
    { k: '04', t: 'Human review',      d: 'Every file crosses an underwriter\'s desk. Not a model. The same person signs your offer that answers your questions.' },
  ];
  return (
    <section data-v1-section style={{ padding: '120px 40px', background: V1.bg, borderBottom: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ marginBottom: 56, textAlign: 'center', maxWidth: 720, marginInline: 'auto' }}>
          <V1Eyebrow>Under the hood</V1Eyebrow>
          <h2 data-v1-section-title style={{ ...v1H2, marginTop: 18 }}>What we're doing<br/>while you wait.</h2>
        </div>

        <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {items.map(i => (
            <div key={i.k} style={{
              background: V1.white, border: `1px solid ${V1.line}`,
              borderRadius: 20, padding: 32,
              display: 'flex', gap: 24, alignItems: 'flex-start',
            }}>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 13, fontWeight: 600,
                color: V1.blue, letterSpacing: '0.12em',
                background: `${V1.blue}0D`, padding: '6px 10px',
                borderRadius: 6, flexShrink: 0, whiteSpace: 'nowrap',
              }}>{i.k}</div>
              <div>
                <div style={{
                  fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 600,
                  color: V1.ink, letterSpacing: '-0.02em', marginBottom: 8,
                }}>{i.t}</div>
                <div style={{
                  fontFamily: V1.fontBody, fontSize: 14.5, color: V1.text,
                  lineHeight: 1.55,
                }}>{i.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CTA close
// ═══════════════════════════════════════════════════════════════
function HwCTA({ onApply, onTalk }) {
  return (
    <section data-v1-section style={{
      position: 'relative', overflow: 'hidden',
      background: V1.ink, padding: '120px 40px',
    }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 600px 300px at 30% 50%, ${V1.blue}44 0%, transparent 60%),
                     radial-gradient(ellipse 500px 250px at 80% 80%, #818CF833 0%, transparent 60%)`,
      }} />

      <div data-v1-grid-2col style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <V1Eyebrow color={V1.blueSoft}>Get started</V1Eyebrow>
          <h2 data-v1-section-title style={{
            ...v1H2, color: '#fff', marginTop: 18,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          }}>
            Two minutes to apply.<br/>
            <em style={{
              fontStyle: 'italic', fontFamily: '"Source Serif Pro", Georgia, serif',
              fontWeight: 400, letterSpacing: '-0.015em',
              background: `linear-gradient(90deg, ${V1.blueSoft}, #fff)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>24 hours</em> to funds.
          </h2>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 17, color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.55, margin: '24px 0 0', maxWidth: 500,
          }}>
            Soft pull only. No obligation. A real offer in your inbox before the
            end of the business day.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button onClick={onApply} style={{
              padding: '16px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontFamily: V1.fontBody, fontSize: 16, fontWeight: 600,
              background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
              color: '#fff',
              boxShadow: `0 14px 40px -10px ${V1.blue}88`,
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              Start your application <HwIcon kind="arr" size={14} />
            </button>
            <button onClick={onTalk} style={{
              padding: '16px 22px', borderRadius: 12,
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              fontFamily: V1.fontBody, fontSize: 16, fontWeight: 500, cursor: 'pointer',
              transition: 'background .15s, border-color .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}>
              Talk to an underwriter
            </button>
          </div>
        </div>

        {/* Receipt card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20, padding: 28, backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 10.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: V1.blueSoft, fontWeight: 600,
          }}>Last 10 wires</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Austin, TX',     '$85K',  '1.16×', '12:41 PM'],
              ['Phoenix, AZ',    '$52K',  '1.22×', '11:18 AM'],
              ['Tampa, FL',      '$140K', '1.14×', '10:52 AM'],
              ['Denver, CO',     '$78K',  '1.19×', '09:34 AM'],
              ['Brooklyn, NY',   '$220K', '1.12×', '08:47 AM'],
              ['Portland, OR',   '$48K',  '1.20×', '08:02 AM'],
            ].map((r, i) => (
              <div data-v1-grid-4col key={i} style={{
                display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.7fr 0.8fr',
                fontFamily: V1.fontMono, fontSize: 12.5,
                color: 'rgba(255,255,255,0.85)',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{r[0]}</span>
                <span>{r[1]}</span>
                <span style={{ color: V1.blueSoft }}>{r[2]}</span>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{r[3]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
function HowItWorksPage({ accent, onApply, onTalk }) {
  return (
    <div style={{ background: V1.bg }}>
      <style>{`
        @keyframes hwSpin { to { transform: rotate(360deg); } }
        @keyframes hwPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes hwBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>

      <HwHero accent={accent} onApply={onApply} />

      <HwStep
        num="01" label="Apply" mockKind="apply" accent={accent}
        title="Five fields. No paperwork."
        body="A two-minute application replaces the 40-page bank package. You'll tell us who you are, what you do, and how much you need. That's it."
        bullets={[
          'Soft credit pull only — no FICO impact',
          'Autofill from your EIN cuts inputs in half',
          'Save and resume from any device',
        ]}
      />

      <HwStep
        num="02" label="Connect" mockKind="connect" accent={accent}
        title="Link your deposits. Read-only."
        body="We use Plaid to read 90 days of your business deposits. It's the same secure layer Venmo, Robinhood, and Chime sit on. We see balances — never credentials — and you can revoke access anytime."
        bullets={[
          'Bank-grade 256-bit encryption',
          'Read-only — we cannot move money',
          'Data discarded 30 days after decline',
        ]}
      />

      <HwStep
        num="03" label="Offer" mockKind="offer" accent={accent}
        title="A real offer, priced by a human."
        body="Every file crosses a Delt underwriter's desk. No black-box scoring. You get the actual numbers — factor rate, term, payment schedule — and the name of the analyst who signed it. Offers are live in under four hours on most files."
        bullets={[
          'Factor rate published, not hidden',
          'Payment schedule shown before you sign',
          '72-hour lock so you can compare',
        ]}
      />

      <HwStep
        num="04" label="Funded" mockKind="funded" accent={accent}
        title="Wire lands the next morning."
        body="E-sign the offer and the ACH goes out on the next banking window. Most of our funds clear by 9am the following business day. You get a live timeline from initiation to posting — no more calling your bank."
        bullets={[
          'ACH on the next business window',
          'Live status from initiation to posting',
          'Same-day wire available on $250K+',
        ]}
      />

      <HwSpeedStrip />
      <HwUnderTheHood />
      <HwCTA onApply={onApply} onTalk={onTalk} />
    </div>
  );
}

Object.assign(window, { HowItWorksPage });
