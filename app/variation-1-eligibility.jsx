// V1 Eligibility page — "Do you qualify?"
// ─────────────────────────────────────────────────────────────────────────
// Destination for the FAQ "Learn more about eligibility for Delt funding"
// link. Lays out who qualifies, what Delt actually underwrites (live deposits,
// not FICO), and what it does NOT require. Same visual language as the Speed /
// Lending / Terminals pages: dark hero band, mono eyebrows, oversized display
// type, indigo accents, restrained scroll reveals, shared V1 tokens.
// Numbers here match the rest of the site: $10K–$500K, soft pull, 24h.
// ─────────────────────────────────────────────────────────────────────────

const { useState: elUseState, useEffect: elUseEffect, useRef: elUseRef } = React;

// ─── Tiny inline icon set ───────────────────────────────────
function ElIcon({ name, size = 16 }) {
  const p = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'flag')    return <svg {...p}><path d="M4 14V2M4 3h8l-1.5 2.5L12 8H4"/></svg>;
  if (name === 'clock')   return <svg {...p}><circle cx="8" cy="8" r="6"/><path d="M8 4.5v3.5l2.2 1.4"/></svg>;
  if (name === 'trend')   return <svg {...p}><path d="M2 11l4-4 3 3 5-5"/><path d="M9 5h5v5"/></svg>;
  if (name === 'bank')    return <svg {...p}><path d="M2 14h12M3 14V8M6 14V8M10 14V8M13 14V8M1.5 7h13L8 2 1.5 7z"/></svg>;
  if (name === 'eye')     return <svg {...p}><path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"/><circle cx="8" cy="8" r="2"/></svg>;
  if (name === 'card')    return <svg {...p}><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M2 6.5h12M5 9.5h2"/></svg>;
  if (name === 'pulse')   return <svg {...p}><path d="M1.5 8h3l1.5-4 2.5 8 1.5-4h4.5"/></svg>;
  if (name === 'check')   return <svg {...p}><path d="M3 8.2L6.5 11.5 13 5"/></svg>;
  if (name === 'x')       return <svg {...p}><path d="M4 4l8 8M12 4l-8 8"/></svg>;
  if (name === 'arr')     return <svg {...p}><path d="M3 8h10M9 5l4 3-4 3"/></svg>;
  if (name === 'shield')  return <svg {...p}><path d="M8 1.5l5.5 2v4.5c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7V3.5L8 1.5z"/><path d="M5.5 8L7 9.5 10.5 6"/></svg>;
  return null;
}

// ─── Hero ────────────────────────────────────────────────────────
function ElHero({ onApply, onTalk }) {
  const mounted = useV1Mounted(60);
  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });
  return (
    <section data-v1-section style={{
      background: V1.ink, color: '#fff', position: 'relative', overflow: 'hidden',
      padding: '88px 0 80px', borderBottom: '1px solid rgba(255,255,255,0.06)',
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
        Vol. XII · Eligibility
        <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.32)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
        <div style={enter(80)}>
          <V1Eyebrow color={V1.blueSoft}>Who qualifies</V1Eyebrow>
        </div>
        <h1 data-v1-section-title style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(2.6rem, 5.6vw, 4.8rem)',
          fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 0.98,
          margin: '24px 0 0', color: '#fff', maxWidth: 860,
        }}>
          <V1LineMask ready={mounted} delay={120}>Funded on your revenue,</V1LineMask>
          <V1LineMask ready={mounted} delay={230}>
            not your{' '}
            <em style={{
              fontFamily: '"Source Serif Pro", Georgia, serif',
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(90deg, ${V1.blueSoft}, #fff)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>credit score.</em>
          </V1LineMask>
        </h1>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 18.5, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.72)', margin: '32px 0 0', maxWidth: 620, ...enter(560),
        }}>
          If you run a real U.S. business with steady deposits, you're likely a
          fit. We underwrite the money that actually moves through your
          account — so a thin or bruised credit file doesn't count you out.
          Checking is a <span style={{ color: '#fff', fontWeight: 500 }}>soft pull</span> and takes about two minutes.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 36, alignItems: 'center', flexWrap: 'wrap', ...enter(700) }}>
          <button onClick={onApply} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: V1.blue, color: '#fff', border: 'none',
            padding: '16px 24px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
            boxShadow: `0 6px 20px ${V1.blue}55`, transition: 'transform 220ms, box-shadow 220ms',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 10px 28px ${V1.blue}77`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 20px ${V1.blue}55`; }}>
            Check my eligibility <ElIcon name="arr" size={14} />
          </button>
          <button onClick={onTalk} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.22)',
            padding: '15px 22px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
            transition: 'background 220ms, border-color 220ms',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}>
            Talk to a specialist →
          </button>
        </div>

        {/* Stat strip */}
        <div data-v1-grid-4col style={{
          marginTop: 52, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, ...enter(820),
        }}>
          {[
            ['Time in business', '6+ mo', 'minimum'],
            ['Monthly revenue', '$10K+', 'in deposits'],
            ['Credit pull', 'Soft', 'no score impact'],
            ['Funding range', '$10K–$500K', 'per draw'],
          ].map(([l, v, s]) => (
            <div key={l}>
              <div style={{ fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{l}</div>
              <div style={{ fontFamily: V1.fontDisplay, fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── The basics — four requirement cards ─────────────────────────
function ElRequirements() {
  const items = [
    { icon: 'flag',  h: 'A U.S. business', d: 'Registered and operating in the United States, with a valid EIN. Sole props, LLCs, S-corps, and C-corps all qualify.' },
    { icon: 'clock', h: '6+ months operating', d: 'Enough history for us to read a real deposit pattern. Newer businesses that process card payments with Delt can qualify sooner.' },
    { icon: 'trend', h: '$10K+ monthly revenue', d: 'Roughly ten thousand dollars a month or more flowing through your account. Consistency matters more than a single big month.' },
    { icon: 'bank',  h: 'A business bank account', d: 'A primary operating account we can link read-only through Plaid. No statements to dig up, print, or upload.' },
  ];
  return (
    <section data-v1-section style={{ background: V1.bg, padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>The basics</V1Eyebrow>
        <h2 data-v1-section-title style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08, color: V1.ink,
          margin: '20px 0 12px', maxWidth: 760,
        }}>
          Four things that make you a fit.
        </h2>
        <p style={{ fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.6, color: V1.text, maxWidth: 640, margin: '0 0 48px' }}>
          Meet these and you're almost certainly eligible for an offer. The rest is what your deposits say about your business.
        </p>
        <div data-v1-grid-4col style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {items.map((it) => (
            <div key={it.h} style={{ background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 16, padding: 26, transition: 'transform 240ms, box-shadow 240ms, border-color 240ms' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 18px 44px ${V1.ink}10`; e.currentTarget.style.borderColor = `${V1.blue}33`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = V1.line; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${V1.blue}33` }}>
                <ElIcon name={it.icon} size={20} />
              </div>
              <h3 style={{ fontFamily: V1.fontDisplay, fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: V1.ink, margin: '18px 0 10px' }}>{it.h}</h3>
              <p style={{ fontFamily: V1.fontBody, fontSize: 14, lineHeight: 1.6, color: V1.text, margin: 0 }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What we underwrite vs. what we don't require ────────────────
function ElUnderwrite() {
  const [ref, inView] = useV1InView(0.25, '0px 0px -10% 0px');
  const look = [
    { icon: 'eye',   t: 'Deposit volume and cadence — the real money moving through your account.' },
    { icon: 'card',  t: 'Card-processing volume, if you accept cards (more if you process with Delt).' },
    { icon: 'pulse', t: 'Sales consistency and average daily balance — how steady the business runs.' },
    { icon: 'clock', t: 'Time in business and account history — the track record behind the numbers.' },
  ];
  const skip = [
    'A perfect (or even good) credit score',
    'Collateral or a personal-asset lien',
    'Tax returns, P&L, or a balance sheet',
    'A business plan or projections deck',
  ];
  return (
    <section data-v1-section ref={ref} style={{ background: V1.white, padding: '96px 0', borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>Deposits, not FICO</V1Eyebrow>
        <h2 data-v1-section-title style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08, color: V1.ink,
          margin: '20px 0 16px', maxWidth: 760,
        }}>
          We read your revenue. We skip the paperwork.
        </h2>
        <p style={{ fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.6, color: V1.text, maxWidth: 660, margin: '0 0 48px' }}>
          Underwriting looks at the ledger of your business, not a three-year-old bureau file. Here's exactly what's in — and what you'll never be asked for.
        </p>
        <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* What we look at */}
          <div style={{
            background: V1.bg, border: `1px solid ${V1.blue}33`, borderRadius: 16, padding: 28,
            boxShadow: `0 24px 52px -40px ${V1.blue}66`,
            opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 600ms cubic-bezier(0.22,1,0.36,1)',
          }}>
            <span style={{ fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.blue }}>What we underwrite</span>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {look.map((it) => (
                <div key={it.t} style={{ display: 'grid', gridTemplateColumns: '26px 1fr', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ElIcon name={it.icon} size={13} />
                  </span>
                  <span style={{ fontFamily: V1.fontBody, fontSize: 14.5, lineHeight: 1.5, color: V1.ink, paddingTop: 3 }}>{it.t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* What we don't require */}
          <div style={{
            background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 16, padding: 28,
            opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1) 120ms, transform 600ms cubic-bezier(0.22,1,0.36,1) 120ms',
          }}>
            <span style={{ fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted }}>What we never ask for</span>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {skip.map((t) => (
                <div key={t} style={{ display: 'grid', gridTemplateColumns: '26px 1fr', gap: 12, alignItems: 'center' }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: `${V1.muted}18`, color: V1.muted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ElIcon name="x" size={12} />
                  </span>
                  <span style={{ fontFamily: V1.fontBody, fontSize: 14.5, lineHeight: 1.5, color: V1.muted, textDecoration: 'line-through', textDecorationColor: `${V1.muted}55` }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who we fund — industries ────────────────────────────────────
function ElIndustries() {
  const tags = ['Restaurants & QSR', 'Retail & e-commerce', 'Auto & repair', 'Salons & spas', 'Construction & trades', 'Healthcare & dental', 'Logistics & trucking', 'Professional services', 'Fitness & wellness', 'Hospitality'];
  return (
    <section data-v1-section style={{ background: V1.bg, padding: '96px 0' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>Who we fund</V1Eyebrow>
        <h2 data-v1-section-title style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.8vw, 2.5rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, color: V1.ink, margin: '20px 0 14px',
        }}>
          Main-street operators, across the map.
        </h2>
        <p style={{ fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.6, color: V1.text, maxWidth: 640, margin: '0 0 32px' }}>
          If your business takes deposits, we've probably funded one like it. A few of the industries we work with every day:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {tags.map((t) => (
            <span key={t} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 999,
              background: V1.white, border: `1px solid ${V1.line}`,
              fontFamily: V1.fontBody, fontSize: 14, color: V1.ink,
            }}>
              <span style={{ color: V1.blue, display: 'inline-flex' }}><ElIcon name="check" size={13} /></span>
              {t}
            </span>
          ))}
        </div>
        <p style={{ fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.6, color: V1.muted, margin: '28px 0 0', maxWidth: 640 }}>
          Don't see yours? It's not an exhaustive list — check the calculator or ask a specialist. We fund a handful of restricted categories case-by-case.
        </p>
      </div>
    </section>
  );
}

// ─── Closing CTA ─────────────────────────────────────────────────
function ElCta({ onApply, onTalk }) {
  return (
    <section data-v1-section style={{ background: V1.ink, color: '#fff', padding: '88px 0', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 80% 30%, ${V1.blue}33 0%, transparent 55%)`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <V1Eyebrow color={V1.blueSoft}>Two-minute soft check</V1Eyebrow>
        <h2 data-v1-section-title style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(2rem, 4.6vw, 3.5rem)',
          fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, color: '#fff', margin: '20px 0 18px',
        }}>
          See what you qualify for — no score impact.
        </h2>
        <p style={{ fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,0.72)', margin: '0 auto 32px', maxWidth: 620 }}>
          Answer three quick questions, link your bank read-only, and see a real ranged offer. Soft pull only — nothing touches your credit.
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
            Check my eligibility <ElIcon name="arr" size={14} />
          </button>
          <button onClick={onTalk} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.22)',
            padding: '15px 24px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
            transition: 'background 220ms, border-color 220ms',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}>
            Talk to a specialist →
          </button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// V1EligibilityPage — main exporter
// ═══════════════════════════════════════════════════════════════
function V1EligibilityPage({ accent, onApply, onTalk }) {
  return (
    <main>
      <ElHero onApply={onApply} onTalk={onTalk} />
      <ElRequirements />
      <ElUnderwrite />
      <ElIndustries />
      <ElCta onApply={onApply} onTalk={onTalk} />
    </main>
  );
}

Object.assign(window, { V1EligibilityPage });
