// V1 Speed page — "Faster than the bank"
// ─────────────────────────────────────────────────────────────────────────
// The deep dive behind the home bento card "Faster than the bank — ranged
// offers in minutes, soft pull, no callbacks." Where the bank makes you wait
// weeks on a committee, Delt underwrites live off your deposits and returns a
// real range in minutes, then wires inside 24 hours.
//
// Visual language matches the rest of V1: dark hero band with ambient indigo
// blooms, mono eyebrows, oversized display type, indigo accents, restrained
// scroll-revealed mocks. Reuses the global V1 token object + motion helpers
// (useV1Mounted, useV1InView, V1LineMask, V1CountUp, V1Eyebrow).
// ─────────────────────────────────────────────────────────────────────────

const { useState: spUseState, useEffect: spUseEffect, useRef: spUseRef } = React;

// ─── Tiny inline icon set ───────────────────────────────────
function SpIcon({ name, size = 16 }) {
  const p = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'bolt')    return <svg {...p} fill="currentColor" stroke="none"><path d="M9 1L3 9h4l-1 6 7-9H8l1-5z"/></svg>;
  if (name === 'clock')   return <svg {...p}><circle cx="8" cy="8" r="6"/><path d="M8 4.5v3.5l2.2 1.4"/></svg>;
  if (name === 'shield')  return <svg {...p}><path d="M8 1.5l5.5 2v4.5c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7V3.5L8 1.5z"/><path d="M5.5 8L7 9.5 10.5 6"/></svg>;
  if (name === 'phone')   return <svg {...p}><path d="M4 1.5h8a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1v-11a1 1 0 011-1z"/><path d="M7 12.5h2"/></svg>;
  if (name === 'wire')    return <svg {...p}><path d="M2 8h11M11 5l3 3-3 3"/></svg>;
  if (name === 'check')   return <svg {...p}><path d="M3 8.2L6.5 11.5 13 5"/></svg>;
  if (name === 'arr')     return <svg {...p}><path d="M3 8h10M9 5l4 3-4 3"/></svg>;
  if (name === 'x')       return <svg {...p}><path d="M4 4l8 8M12 4l-8 8"/></svg>;
  if (name === 'eye')     return <svg {...p}><path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"/><circle cx="8" cy="8" r="2"/></svg>;
  return null;
}

// ─── Hero — mask-reveal title, ambient bloom, live-approval gauge ─
function SpHero({ onApply, onCalc }) {
  const mounted = useV1Mounted(60);
  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });
  return (
    <section data-v1-section style={{
      background: V1.ink, color: '#fff',
      position: 'relative', overflow: 'hidden',
      padding: '88px 0 80px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div aria-hidden style={{
        position: 'absolute', top: -260, right: -200, width: 660, height: 660,
        background: `radial-gradient(circle, ${V1.blue}26 0%, transparent 60%)`,
        filter: 'blur(28px)', pointerEvents: 'none',
        opacity: mounted ? 1 : 0, transition: 'opacity 1400ms ease-out 100ms',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -300, left: -180, width: 520, height: 520,
        background: `radial-gradient(circle, #818CF818 0%, transparent 60%)`,
        filter: 'blur(28px)', pointerEvents: 'none',
        opacity: mounted ? 1 : 0, transition: 'opacity 1400ms ease-out 320ms',
      }} />

      <div style={{
        position: 'absolute', top: 32, right: 40,
        fontFamily: V1.fontMono, fontSize: 11, letterSpacing: '0.18em',
        color: 'rgba(255,255,255,0.42)', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 10, ...enter(40),
      }}>
        Vol. IX · Speed
        <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.32)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
        <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={enter(80)}>
              <V1Eyebrow color={V1.blueSoft}>Minutes, not months</V1Eyebrow>
            </div>
            <h1 data-v1-section-title style={{
              fontFamily: V1.fontDisplay, fontSize: 'clamp(2.6rem, 5.6vw, 4.8rem)',
              fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 0.98,
              margin: '24px 0 0', color: '#fff', maxWidth: 720,
            }}>
              <V1LineMask ready={mounted} delay={120}>Faster than</V1LineMask>
              <V1LineMask ready={mounted} delay={230}>
                the{' '}
                <em style={{
                  fontFamily: '"Source Serif Pro", Georgia, serif',
                  fontStyle: 'italic', fontWeight: 400,
                  background: `linear-gradient(90deg, ${V1.blueSoft}, #fff)`,
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>bank.</em>
              </V1LineMask>
            </h1>
            <p style={{
              fontFamily: V1.fontBody, fontSize: 18.5, lineHeight: 1.55,
              color: 'rgba(255,255,255,0.72)', margin: '32px 0 0', maxWidth: 560,
              ...enter(560),
            }}>
              A bank routes you through a loan officer, a committee, and a stack
              of paperwork — then makes you wait weeks for a maybe. We underwrite
              live off your deposits and hand back a{' '}
              <span style={{ color: '#fff', fontWeight: 500 }}>real, ranged offer in minutes</span>.
              Soft pull, no callbacks, wire inside 24 hours.
            </p>
            <div style={{
              display: 'flex', gap: 12, marginTop: 36, alignItems: 'center', flexWrap: 'wrap', ...enter(700),
            }}>
              <button onClick={onApply} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: V1.blue, color: '#fff', border: 'none',
                padding: '16px 24px', borderRadius: 10, cursor: 'pointer',
                fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
                boxShadow: `0 6px 20px ${V1.blue}55`, transition: 'transform 220ms, box-shadow 220ms',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 10px 28px ${V1.blue}77`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 20px ${V1.blue}55`; }}>
                Get my offer in minutes <SpIcon name="arr" size={14} />
              </button>
              <button onClick={onCalc} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: '#fff',
                border: '1px solid rgba(255,255,255,0.22)',
                padding: '15px 22px', borderRadius: 10, cursor: 'pointer',
                fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
                transition: 'background 220ms, border-color 220ms',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}>
                Try the calculator →
              </button>
            </div>
          </div>

          {/* Right — live approval gauge card */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.98)',
            transition: 'opacity 900ms cubic-bezier(0.22,1,0.36,1) 320ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 320ms',
          }}>
            <SpApprovalCard active={mounted} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Live approval gauge — counts up to a soft-pull decision ─────
function SpApprovalCard({ active }) {
  const [phase, setPhase] = spUseState('idle'); // idle → reading → ranged
  spUseEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setPhase('reading'), 500);
    const t2 = setTimeout(() => setPhase('ranged'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);
  const ranged = phase === 'ranged';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 20, padding: 26, position: 'relative', overflow: 'hidden',
      boxShadow: '0 30px 60px -30px rgba(0,0,0,0.5)',
    }}>
      <div aria-hidden style={{
        position: 'absolute', top: -100, right: -80, width: 280, height: 280,
        background: `radial-gradient(circle, ${V1.blue}33 0%, transparent 65%)`,
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1, marginBottom: 8,
      }}>
        <span style={{ fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Approval · live</span>
        <span style={{
          fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(31,132,90,0.18)', border: '1px solid rgba(31,132,90,0.4)', color: '#4ADE80',
        }}>Soft pull</span>
      </div>

      {/* Gauge */}
      <div style={{ position: 'relative', textAlign: 'center', padding: '18px 0 8px' }}>
        <svg viewBox="0 0 220 130" width="100%" style={{ maxWidth: 240, display: 'inline-block' }}>
          <defs>
            <linearGradient id="spGauge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={V1.blueSoft} />
              <stop offset="100%" stopColor={V1.blue} />
            </linearGradient>
          </defs>
          <path d="M20 120 A90 90 0 0 1 200 120" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" strokeLinecap="round" />
          <path d="M20 120 A90 90 0 0 1 200 120" fill="none" stroke="url(#spGauge)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={ranged ? 51 : 283}
            style={{ transition: 'stroke-dashoffset 1400ms cubic-bezier(0.22,1,0.36,1)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 24 }}>
          <div style={{ fontFamily: V1.fontDisplay, fontWeight: 700, fontSize: 40, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
            {active ? <V1CountUp value={ranged ? '82' : '0'} duration={1400} start={600} /> : '0'}
          </div>
          <div style={{ fontFamily: V1.fontMono, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            {phase === 'idle' ? 'Awaiting link' : phase === 'reading' ? 'Reading deposits…' : 'Approval score'}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 10, padding: '14px 16px', borderRadius: 12,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative', zIndex: 1,
        opacity: ranged ? 1 : 0.35, transition: 'opacity 400ms',
      }}>
        <div style={{ fontFamily: V1.fontMono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Your ranged offer</div>
        <div style={{ fontFamily: V1.fontDisplay, fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
          {ranged ? '$85K – $110K' : '· · ·'}
        </div>
      </div>

      {/* Checklist */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', zIndex: 1 }}>
        {['Deposits verified', 'Ownership matched', 'Offer ranged'].map((c, i) => (
          <div key={c} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: V1.fontBody, fontSize: 13, color: 'rgba(255,255,255,0.8)',
            opacity: ranged ? 1 : 0, transform: ranged ? 'translateX(0)' : 'translateX(-6px)',
            transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${i * 140}ms, transform 500ms cubic-bezier(0.22,1,0.36,1) ${i * 140}ms`,
          }}>
            <span style={{ width: 18, height: 18, borderRadius: 999, background: '#1F845A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
              <SpIcon name="check" size={11} />
            </span>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Side-by-side timeline: bank vs Delt ─────────────────────────
function SpTimeline() {
  const [ref, inView] = useV1InView(0.2, '0px 0px -10% 0px');
  const bank = [
    { t: 'Day 1', d: 'Book a branch appointment. Print the application packet.' },
    { t: 'Week 1', d: 'Hand over tax returns, P&L, balance sheet, projections.' },
    { t: 'Week 2–3', d: 'Loan officer requests “just one more document.” Twice.' },
    { t: 'Week 4–6', d: 'File sits with a credit committee that meets weekly.' },
    { t: 'Week 6+', d: 'A maybe — often with a covenant and a personal guarantee.' },
  ];
  const delt = [
    { t: 'Minute 0', d: 'Three fields on the calculator. Revenue, time in business, processor.' },
    { t: 'Minute 2', d: 'Link your bank read-only via Plaid. No statements to dig up.' },
    { t: 'Minute 5', d: 'A soft-pull, deposit-based approval score and a ranged offer.' },
    { t: 'Hour 1–4', d: 'A human underwriter confirms the range on your file.' },
    { t: 'Hour 24', d: 'Counter-sign and the wire hits your operating account.' },
  ];
  return (
    <section data-v1-section ref={ref} style={{ background: V1.bg, padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>The difference is the wait</V1Eyebrow>
        <h2 data-v1-section-title style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08,
          color: V1.ink, margin: '20px 0 12px', maxWidth: 760,
        }}>
          Same business. Same numbers. Six weeks apart.
        </h2>
        <p style={{ fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.6, color: V1.text, maxWidth: 640, margin: '0 0 48px' }}>
          Here's the identical funding request, run through a bank and through Delt.
        </p>

        <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Bank */}
          <div style={{ background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 16, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: V1.bgWarm, color: V1.muted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <SpIcon name="clock" size={16} />
              </span>
              <span style={{ fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 600, color: V1.muted, letterSpacing: '-0.01em' }}>The bank</span>
              <span style={{ marginLeft: 'auto', fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.red }}>~6 weeks</span>
            </div>
            {bank.map((s, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '78px 1fr', gap: 14, padding: '12px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${V1.line}`,
                opacity: inView ? 0.75 : 0, transform: inView ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, transform 500ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`,
              }}>
                <span style={{ fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: V1.muted }}>{s.t}</span>
                <span style={{ fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.5, color: V1.text }}>{s.d}</span>
              </div>
            ))}
          </div>

          {/* Delt */}
          <div style={{
            background: V1.white, border: `1px solid ${V1.blue}33`, borderRadius: 16, padding: 28,
            boxShadow: `0 30px 60px -40px ${V1.blue}66`, position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${V1.blue}44` }}>
                <SpIcon name="bolt" size={16} />
              </span>
              <span style={{ fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 600, color: V1.ink, letterSpacing: '-0.01em' }}>Delt</span>
              <span style={{ marginLeft: 'auto', fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.green }}>24 hours</span>
            </div>
            {delt.map((s, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '78px 1fr', gap: 14, padding: '12px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${V1.line}`,
                opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-8px)',
                transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${i * 110}ms, transform 500ms cubic-bezier(0.22,1,0.36,1) ${i * 110}ms`,
              }}>
                <span style={{ fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: V1.blue }}>{s.t}</span>
                <span style={{ fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.5, color: V1.ink }}>{s.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Why we're faster — 3 pillars ────────────────────────────────
function SpWhy() {
  const items = [
    { icon: 'eye',    h: 'We read data, not paperwork.', d: 'A read-only Plaid link shows us 90 days of real deposits in seconds. There is nothing to print, scan, or re-export — the truth is already in your account.' },
    { icon: 'shield', h: 'Soft pull, no score damage.', d: 'The estimate never touches your credit. No hard inquiry, no ding, no callback from a loan officer trying to “restructure” the deal.' },
    { icon: 'bolt',   h: 'One desk, one decision.', d: 'No branch, no broker layer, no committee that meets on Thursdays. Your file goes straight to an underwriter with authority to price and fund it.' },
  ];
  return (
    <section data-v1-section style={{ background: V1.white, padding: '96px 0', borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>Why we're faster</V1Eyebrow>
        <h2 data-v1-section-title style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08,
          color: V1.ink, margin: '20px 0 48px', maxWidth: 720,
        }}>
          Speed isn't a rush job. It's a better process.
        </h2>
        <div data-v1-grid-3col style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {items.map((it) => (
            <div key={it.h} style={{ background: V1.bg, border: `1px solid ${V1.line}`, borderRadius: 16, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${V1.blue}33` }}>
                <SpIcon name={it.icon} size={20} />
              </div>
              <h3 style={{ fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: V1.ink, margin: '18px 0 10px' }}>{it.h}</h3>
              <p style={{ fontFamily: V1.fontBody, fontSize: 14.5, lineHeight: 1.6, color: V1.text, margin: 0 }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Closing CTA ─────────────────────────────────────────────────
function SpCta({ onApply, onCalc }) {
  return (
    <section data-v1-section style={{ background: V1.ink, color: '#fff', padding: '88px 0', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 80% 30%, ${V1.blue}33 0%, transparent 55%)`, pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <V1Eyebrow color={V1.blueSoft}>Stop waiting on a maybe</V1Eyebrow>
        <h2 data-v1-section-title style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(2rem, 4.6vw, 3.5rem)',
          fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, color: '#fff', margin: '20px 0 18px',
        }}>
          Get a real offer before the bank picks up the phone.
        </h2>
        <p style={{ fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,0.72)', margin: '0 auto 32px', maxWidth: 620 }}>
          Three fields, a soft pull, and a ranged offer in minutes. No callbacks, no committee, no covenants.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onApply} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: V1.blue, color: '#fff', border: 'none',
            padding: '16px 26px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
            boxShadow: `0 6px 20px ${V1.blue}55`, transition: 'transform 220ms, box-shadow 220ms',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 10px 28px ${V1.blue}77`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 20px ${V1.blue}55`; }}>
            Get my offer <SpIcon name="arr" size={14} />
          </button>
          <button onClick={onCalc} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.22)',
            padding: '15px 24px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
            transition: 'background 220ms, border-color 220ms',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}>
            ← Back to calculator
          </button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// V1SpeedPage — main exporter
// ═══════════════════════════════════════════════════════════════
function V1SpeedPage({ accent, onApply, onCalc }) {
  return (
    <main>
      <SpHero onApply={onApply} onCalc={onCalc} />
      <SpTimeline />
      <SpWhy />
      <SpCta onApply={onApply} onCalc={onCalc} />
    </main>
  );
}

Object.assign(window, { V1SpeedPage });
