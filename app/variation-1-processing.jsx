// V1 Processing → 2× Capital page
// ─────────────────────────────────────────────────────────────────────────
// The pitch: when a business owner moves their credit-card, ACH, and
// international payment processing to Delt Merchant Services, Delt sees the
// real revenue flow in real time — which lets us underwrite with far more
// confidence and offer up to 2× more capital than a bank-statement-only
// review.
//
// This page is the deep dive behind two existing surfaces in the site:
//   • the Delt Boost toggle on the home/calculator card ("Switch processing
//     to Delt for 75% more capital"), and
//   • the post-estimate "New businesses that process with Delt get a
//     pre-approved offer and up to 2× more capital as they grow." callout.
//
// Visual language matches the rest of V1 (Atlassian-preview palette, mono
// eyebrows, oversized display type, indigo accents, dark hero band).
// Animations are restrained: line-mask hero reveal, scroll-triggered fades,
// a single count-up on the headline 2× number.
// ─────────────────────────────────────────────────────────────────────────

const { useState: pPUseState, useEffect: pPUseEffect, useRef: pPUseRef } = React;

// ─── Tiny inline icon set ───────────────────────────────────
function PpIcon({ name, size = 16 }) {
  const p = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'card')   return <svg {...p}><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M2 6.5h12M5 9.5h2"/></svg>;
  if (name === 'ach')    return <svg {...p}><path d="M2 8h11M11 5l3 3-3 3"/><path d="M2 5l-1 0M2 11l-1 0"/></svg>;
  if (name === 'globe')  return <svg {...p}><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2 2.5 4 2.5 6S10 12 8 14M8 2C6 4 5.5 6 5.5 8S6 12 8 14"/></svg>;
  if (name === 'bolt')   return <svg {...p} fill="currentColor" stroke="none"><path d="M9 1L3 9h4l-1 6 7-9H8l1-5z"/></svg>;
  if (name === 'eye')    return <svg {...p}><path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"/><circle cx="8" cy="8" r="2"/></svg>;
  if (name === 'trend')  return <svg {...p}><path d="M2 11l4-4 3 3 5-5"/><path d="M9 5h5v5"/></svg>;
  if (name === 'shield') return <svg {...p}><path d="M8 1.5l5.5 2v4.5c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7V3.5L8 1.5z"/><path d="M5.5 8L7 9.5 10.5 6"/></svg>;
  if (name === 'check')  return <svg {...p}><path d="M3 8.2L6.5 11.5 13 5"/></svg>;
  if (name === 'arr')    return <svg {...p}><path d="M3 8h10M9 5l4 3-4 3"/></svg>;
  if (name === 'dollar') return <svg {...p}><path d="M8 1v14M11 4.5C10.5 3 9.5 2.5 8 2.5S5 3.5 5 5.5 7 7 8 7s3 0 3 2.2-1.5 2.8-3 2.8-2.5-.5-3-2"/></svg>;
  if (name === 'plug')   return <svg {...p}><path d="M6 2v4M10 2v4M4 6h8v3a4 4 0 01-8 0V6zM8 13v2"/></svg>;
  if (name === 'lock')   return <svg {...p}><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/></svg>;
  return null;
}

// ─── Hero with mask-reveal title + ambient indigo bloom ──────
function PpHero({ onApply, onCalc }) {
  const mounted = useV1Mounted(60);
  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });
  return (
    <section style={{
      background: V1.ink, color: '#fff',
      position: 'relative', overflow: 'hidden',
      padding: '88px 0 80px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Ambient blooms */}
      <div aria-hidden style={{
        position: 'absolute', top: -260, right: -200, width: 660, height: 660,
        background: `radial-gradient(circle, ${V1.blue}26 0%, transparent 60%)`,
        filter: 'blur(28px)', pointerEvents: 'none',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 1400ms ease-out 100ms',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -300, left: -180, width: 520, height: 520,
        background: `radial-gradient(circle, #818CF818 0%, transparent 60%)`,
        filter: 'blur(28px)', pointerEvents: 'none',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 1400ms ease-out 320ms',
      }} />

      <div style={{
        position: 'absolute', top: 32, right: 40,
        fontFamily: V1.fontMono, fontSize: 11, letterSpacing: '0.18em',
        color: 'rgba(255,255,255,0.42)', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 10,
        ...enter(40),
      }}>
        Vol. VIII · Processing × Capital
        <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.32)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
        <div style={enter(80)}>
          <V1Eyebrow color={V1.blueSoft}>Process with Delt</V1Eyebrow>
        </div>

        <h1 style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(2.6rem, 6vw, 5.25rem)',
          fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 0.98,
          margin: '24px 0 0', color: '#fff', maxWidth: 980,
        }}>
          <V1LineMask ready={mounted} delay={120}>Process payments with</V1LineMask>
          <V1LineMask ready={mounted} delay={230}>
            Delt Merchant Services.
          </V1LineMask>
          <V1LineMask ready={mounted} delay={340}>
            Unlock{' '}
            <em style={{
              fontFamily: '"Source Serif Pro", Georgia, serif',
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(90deg, ${V1.blueSoft}, #fff)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>up to 2× more capital.</em>
          </V1LineMask>
        </h1>

        <p style={{
          fontFamily: V1.fontBody, fontSize: 18.5, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.72)', margin: '32px 0 0', maxWidth: 680,
          ...enter(560),
        }}>
          Move your <span style={{ color: '#fff', fontWeight: 500 }}>credit-card, ACH, and international</span> payments to Delt and we underwrite from your live revenue — not three-month-old statements. Confident underwriting means <span style={{ color: '#fff', fontWeight: 500 }}>bigger offers, faster renewals, and pre-approved capital as you grow</span>.
        </p>

        <div style={{
          display: 'flex', gap: 12, marginTop: 36, alignItems: 'center', flexWrap: 'wrap',
          ...enter(700),
        }}>
          <button
            onClick={onApply}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: V1.blue, color: '#fff', border: 'none',
              padding: '16px 24px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
              boxShadow: `0 6px 20px ${V1.blue}55`,
              transition: 'transform 220ms, box-shadow 220ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 10px 28px ${V1.blue}77`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 20px ${V1.blue}55`; }}
          >
            Get my 2× estimate <PpIcon name="arr" size={14} />
          </button>
          <button
            onClick={onCalc}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.22)',
              padding: '15px 22px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
              transition: 'background 220ms, border-color 220ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}
          >
            See it on the calculator →
          </button>
        </div>

        {/* Stat strip */}
        <div style={{
          marginTop: 48, paddingTop: 28,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28,
          ...enter(820),
        }}>
          {[
            ['Capital uplift', 'Up to 2×',     'with Delt processing'],
            ['Cap raised to',  '$500K',         'from $250K standard'],
            ['Approval lift',  '+75%',          'on offer size'],
            ['First $5K',      '0%',            'processing fee'],
          ].map(([l, v, s]) => (
            <div key={l}>
              <div style={{ fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{l}</div>
              <div style={{ fontFamily: V1.fontDisplay, fontSize: 30, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                {v}
              </div>
              <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── "Why" section — three rails: card / ACH / international ─
function PpRails() {
  const rails = [
    {
      icon: 'card',
      label: 'Credit & debit cards',
      h: 'Card processing.',
      d: 'Visa, Mastercard, Amex, Discover. In-person, online, virtual terminal, invoicing. Next-day funding standard, same-day available. Interchange-plus pricing — no surprise tiers.',
      bullets: ['Tap, chip, swipe, keyed', 'Hosted checkout & API', 'Recurring billing', 'Tokenized vaulting'],
    },
    {
      icon: 'ach',
      label: 'ACH & bank transfers',
      h: 'ACH payments.',
      d: 'Pull from customer accounts, push to vendors and payroll, run bill-pay. Lower per-transaction cost than cards, ideal for B2B invoices and recurring subscriptions.',
      bullets: ['Same-day ACH', 'NACHA-compliant pulls', 'Vendor & payroll push', 'Returns dashboard'],
    },
    {
      icon: 'globe',
      label: 'International',
      h: 'Cross-border payments.',
      d: 'Accept and send in 130+ currencies. Local rails where they exist (SEPA, Faster Payments, PIX) and SWIFT where they don\'t. Built-in FX with locked-in rates so margin stays predictable.',
      bullets: ['130+ currencies', 'SEPA, FPS, PIX, SWIFT', 'Locked-in FX', 'Compliance-ready KYC'],
    },
  ];
  return (
    <section style={{ background: V1.bg, padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>What we process</V1Eyebrow>
        <h2 style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.6vw, 2.75rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08,
          color: V1.ink, margin: '20px 0 12px', maxWidth: 720,
        }}>
          Every dollar that touches your business — on one ledger.
        </h2>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.6,
          color: V1.text, maxWidth: 680, margin: 0,
        }}>
          When all your payments flow through Delt, our underwriters see real revenue cadence in real time. That clarity is what turns a $250K cap into a $500K cap.
        </p>

        <div style={{
          marginTop: 56,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        }}>
          {rails.map((r) => (
            <div key={r.h} style={{
              background: V1.white, border: `1px solid ${V1.line}`,
              borderRadius: 16, padding: 28, position: 'relative',
              transition: 'transform 240ms, box-shadow 240ms, border-color 240ms',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 18px 44px ${V1.ink}10`;
                e.currentTarget.style.borderColor = `${V1.blue}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = V1.line;
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 16px ${V1.blue}33`,
              }}>
                <PpIcon name={r.icon} size={20} />
              </div>
              <div style={{
                marginTop: 18,
                fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
              }}>{r.label}</div>
              <h3 style={{
                fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
                letterSpacing: '-0.02em', color: V1.ink, margin: '6px 0 10px',
              }}>{r.h}</h3>
              <p style={{
                fontFamily: V1.fontBody, fontSize: 14, lineHeight: 1.6,
                color: V1.text, margin: 0,
              }}>{r.d}</p>
              <ul style={{
                listStyle: 'none', padding: 0, margin: '18px 0 0',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px',
              }}>
                {r.bullets.map((b) => (
                  <li key={b} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: V1.fontBody, fontSize: 12.5, color: V1.text,
                  }}>
                    <span style={{ color: V1.blue, display: 'inline-flex' }}>
                      <PpIcon name="check" size={12} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── The mechanic — "why does processing with us = more capital" ─
function PpWhy() {
  const items = [
    {
      icon: 'eye',
      h: 'We see the real number.',
      d: 'Statements are a 90-day rear-view mirror that miss refunds, chargebacks, and seasonality. Live processing data is the truth — and the truth lets us underwrite higher.',
    },
    {
      icon: 'bolt',
      h: 'Underwriting moves faster.',
      d: 'No statement-pulling, no statement-cleaning, no "can you re-export May?" Renewals on existing files take minutes, not days.',
    },
    {
      icon: 'shield',
      h: 'Repayment is built in.',
      d: 'Repayment can come straight off card settlement instead of a daily ACH debit. Slow week = smaller payment. No NSF fees, no surprises.',
    },
    {
      icon: 'trend',
      h: 'Pre-approved as you grow.',
      d: 'Once you\'re on our rails, every additional month of revenue raises your cap. Need more capital next quarter? It\'s already sized — sign and it\'s wired.',
    },
  ];
  return (
    <section style={{ background: V1.white, padding: '96px 0', borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 32 }}>
            <V1Eyebrow>Why 2×</V1Eyebrow>
            <h2 style={{
              fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.6vw, 2.75rem)',
              fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08,
              color: V1.ink, margin: '20px 0 16px',
            }}>
              The data we underwrite from changes the offer we can write.
            </h2>
            <p style={{
              fontFamily: V1.fontBody, fontSize: 15.5, lineHeight: 1.6,
              color: V1.text, margin: 0,
            }}>
              Most lenders price your file off three months of bank statements. We price yours off the live ledger of every card swipe, ACH pull, and cross-border wire. That difference is worth — empirically — up to 2× more capital.
            </p>
            <div style={{
              marginTop: 28, padding: 18, borderRadius: 12,
              border: `1px solid ${V1.blue}33`,
              background: `linear-gradient(135deg, ${V1.blue}08 0%, ${V1.blue}14 100%)`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 14px ${V1.blue}44`,
              }}>
                <PpIcon name="dollar" size={18} />
              </div>
              <div>
                <div style={{ fontFamily: V1.fontDisplay, fontSize: 14, fontWeight: 700, color: V1.ink, letterSpacing: '-0.01em' }}>
                  Standard cap $250,000 → Delt-processed cap $500,000
                </div>
                <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted, marginTop: 2 }}>
                  Same business. Same revenue. Different visibility.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {items.map((it) => (
              <div key={it.h} style={{
                border: `1px solid ${V1.line}`, borderRadius: 14,
                padding: 22, background: V1.bg,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: V1.white, color: V1.blue,
                  border: `1px solid ${V1.blue}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PpIcon name={it.icon} size={16} />
                </div>
                <h3 style={{
                  fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 600,
                  letterSpacing: '-0.015em', color: V1.ink, margin: '14px 0 8px',
                }}>{it.h}</h3>
                <p style={{
                  fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.55,
                  color: V1.text, margin: 0,
                }}>{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Worked example — before / after ─────────────────────────
function PpExample() {
  const ref = pPUseRef(null);
  const [inView, setInView] = pPUseState(false);
  pPUseEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  // Bar widths animate in
  const barLeft  = inView ? 38 : 0;   // standard offer
  const barRight = inView ? 76 : 0;   // delt-processed offer

  return (
    <section ref={ref} style={{ background: V1.bg, padding: '96px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>Worked example</V1Eyebrow>
        <h2 style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.6vw, 2.75rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08,
          color: V1.ink, margin: '20px 0 16px', maxWidth: 760,
        }}>
          Same shop, same revenue. Two different offers.
        </h2>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.6,
          color: V1.text, maxWidth: 680, margin: '0 0 48px',
        }}>
          A coffee roaster doing $80K / month in card sales applies for working capital. Here{`'`}s what the offer looks like before and after switching processing to Delt.
        </p>

        <div style={{
          background: V1.white, border: `1px solid ${V1.line}`,
          borderRadius: 16, padding: 32, overflow: 'hidden',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Before */}
            <div style={{ paddingRight: 28, borderRight: `1px solid ${V1.line}` }}>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
              }}>Bank-statement underwriting</div>
              <div style={{
                fontFamily: V1.fontDisplay, fontSize: 44, fontWeight: 600,
                letterSpacing: '-0.025em', color: V1.ink, marginTop: 8, fontVariantNumeric: 'tabular-nums',
              }}>$120K</div>
              <div style={{
                marginTop: 10, height: 8, borderRadius: 999,
                background: V1.line, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${barLeft}%`, background: V1.muted,
                  transition: 'width 1100ms cubic-bezier(0.22, 1, 0.36, 1) 200ms',
                }} />
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0' }}>
                {[
                  '12-month term',
                  '34% APR interest rate',
                  'Daily ACH debit',
                  'Renewal sized off statements',
                ].map((t) => (
                  <li key={t} style={{
                    fontFamily: V1.fontBody, fontSize: 13.5, color: V1.text,
                    padding: '8px 0', borderBottom: `1px dashed ${V1.line}`,
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div style={{ paddingLeft: 4, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: -32, right: -32, padding: '6px 10px',
                background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
                color: '#fff', borderRadius: 999,
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em',
                textTransform: 'uppercase', boxShadow: `0 6px 16px ${V1.blue}55`,
              }}>2× capital</div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.blue,
              }}>Live-processing underwriting</div>
              <div style={{
                fontFamily: V1.fontDisplay, fontSize: 44, fontWeight: 600,
                letterSpacing: '-0.025em', color: V1.ink, marginTop: 8, fontVariantNumeric: 'tabular-nums',
              }}>$240K</div>
              <div style={{
                marginTop: 10, height: 8, borderRadius: 999,
                background: V1.line, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${barRight}%`,
                  background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
                  transition: 'width 1100ms cubic-bezier(0.22, 1, 0.36, 1) 320ms',
                }} />
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0' }}>
                {[
                  '12-month term',
                  '10% loan fee (flat)',
                  'Repayment off card settlement',
                  'Pre-approved renewal at month 6',
                ].map((t) => (
                  <li key={t} style={{
                    fontFamily: V1.fontBody, fontSize: 13.5, color: V1.text,
                    padding: '8px 0', borderBottom: `1px dashed ${V1.line}`,
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>{t}</span>
                    <span style={{ color: V1.blue, display: 'inline-flex' }}><PpIcon name="check" size={14} /></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p style={{
            fontFamily: V1.fontBody, fontSize: 11.5, color: V1.muted,
            margin: '24px 0 0', lineHeight: 1.5,
          }}>
            Illustrative. Final offers depend on a full review of your business and processing volume. The Delt Boost on the calculator shows the typical 75% uplift on first offer; the 2× ceiling reflects raised caps and pre-approved renewals as your processing history with Delt builds.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── How switching works — 3-step strip ─────────────────────
function PpSwitch() {
  const steps = [
    { n: '01', icon: 'plug',   h: 'Tell us your stack.',     d: 'A 5-minute intake — current processor, terminals, gateway, average ticket. We map your existing setup so nothing breaks.' },
    { n: '02', icon: 'lock',   h: 'We migrate, you keep selling.', d: 'New terminals shipped, gateway swapped, recurring tokens migrated. Most merchants are fully cut over inside a single business day.' },
    { n: '03', icon: 'bolt',   h: 'Apply for capital — the 2× way.', d: 'Once your first batch settles, your funding cap rises automatically. Apply on the calculator with the Delt Boost on, or wait for your pre-approved offer email.' },
  ];
  return (
    <section style={{ background: V1.white, padding: '96px 0', borderTop: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>How switching works</V1Eyebrow>
        <h2 style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.6vw, 2.75rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08,
          color: V1.ink, margin: '20px 0 48px', maxWidth: 720,
        }}>
          Three steps. No downtime. Same-day cutover for most merchants.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' }}>
          {/* Connecting rule */}
          <div aria-hidden style={{
            position: 'absolute', top: 28, left: '14%', right: '14%', height: 1,
            background: `linear-gradient(90deg, transparent, ${V1.blue}55, ${V1.blue}55, transparent)`,
          }} />
          {steps.map((s) => (
            <div key={s.n} style={{ padding: '0 18px', position: 'relative' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: V1.white, border: `1.5px solid ${V1.blue}`,
                color: V1.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto', position: 'relative', zIndex: 1,
                boxShadow: `0 8px 22px ${V1.blue}1F`,
              }}>
                <PpIcon name={s.icon} size={22} />
              </div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
                textAlign: 'center', marginTop: 18,
              }}>Step {s.n}</div>
              <h3 style={{
                fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 600,
                letterSpacing: '-0.02em', color: V1.ink, margin: '6px 0 10px',
                textAlign: 'center',
              }}>{s.h}</h3>
              <p style={{
                fontFamily: V1.fontBody, fontSize: 14, lineHeight: 1.55,
                color: V1.text, margin: 0, textAlign: 'center', maxWidth: 320, marginInline: 'auto',
              }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Mini FAQ ────────────────────────────────────────────────
function PpFaq() {
  const items = [
    { q: 'Do I have to process with Delt to get funded?',
      a: 'No. You can take a Delt funding offer using your current processor — the calculator estimates that case by default. The 2× capital ceiling and pre-approved renewals only unlock when your processing flows through us, because that\'s the data we underwrite from.' },
    { q: 'How long does switching processors take?',
      a: 'Most merchants are fully cut over inside one business day. Our team handles terminal shipping, gateway swap, and recurring-token migration. We schedule cutover after-hours for restaurants and retail to avoid lost sales.' },
    { q: 'Will my pricing change?',
      a: 'We rate-match or beat your current processor — guaranteed. Send us your last statement and we\'ll quote an interchange-plus rate that comes in at or below what you\'re paying today. No tiered pricing, no junk fees, no surprises.' },
    { q: 'How does 0% processing fees work?',
      a: 'New Delt merchants process their first $5,000 of monthly volume at 0% — no markup, no per-transaction fee, nothing. It runs every month while you\'re building funding history with us, so you keep more of your revenue from day one. After the $5K threshold, your rate-matched or beaten interchange-plus pricing kicks in.' },
    { q: 'What about international payments?',
      a: 'We support 130+ currencies on local rails (SEPA, Faster Payments, PIX) and SWIFT for everything else. FX rates are locked in at quote time so your margin doesn\'t move between invoice and settlement.' },
    { q: 'Is the 2× a hard cap?',
      a: 'It\'s the practical ceiling we\'ve seen for merchants who\'ve been processing with us for 6+ months. Some files price higher, some lower — final amount always depends on a full review. The cap raise itself (from $250K to $500K) is automatic for Delt-processed merchants.' },
  ];
  const [open, setOpen] = pPUseState(0);
  return (
    <section style={{ background: V1.bgWarm, padding: '96px 0' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 40px' }}>
        <V1Eyebrow>Common questions</V1Eyebrow>
        <h2 style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1,
          color: V1.ink, margin: '20px 0 36px',
        }}>
          The questions every owner asks.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} style={{
                background: V1.white, border: `1px solid ${V1.line}`,
                borderRadius: 12, overflow: 'hidden',
                transition: 'border-color 200ms, box-shadow 200ms',
                borderColor: isOpen ? `${V1.blue}55` : V1.line,
                boxShadow: isOpen ? `0 6px 18px ${V1.ink}10` : 'none',
              }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%', padding: '18px 22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                    fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 600,
                    letterSpacing: '-0.01em', color: V1.ink,
                  }}>
                  <span>{it.q}</span>
                  <span style={{
                    color: V1.blue,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                    fontSize: 22, lineHeight: 1, display: 'inline-block',
                  }}>+</span>
                </button>
                <div style={{
                  maxHeight: isOpen ? 280 : 0,
                  opacity: isOpen ? 1 : 0,
                  transition: 'max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '0 22px 20px',
                    fontFamily: V1.fontBody, fontSize: 14, lineHeight: 1.6, color: V1.text,
                  }}>{it.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Closing CTA — mirrors FfCta from funding-flow ───────────
function PpCta({ onApply, onCalc }) {
  return (
    <section style={{ background: V1.ink, color: '#fff', padding: '88px 0', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 80% 30%, ${V1.blue}33 0%, transparent 55%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <V1Eyebrow color={V1.blueSoft}>Process with Delt</V1Eyebrow>
        <h2 style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(2rem, 4.6vw, 3.5rem)',
          fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05,
          color: '#fff', margin: '20px 0 18px',
        }}>
          Move your payments. Double your capital.
        </h2>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.72)', margin: '0 auto 32px', maxWidth: 640,
        }}>
          Tell us about your business — we{`'`}ll quote your processing rate and your funding offer side-by-side, in a single conversation.
        </p>
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <button
            onClick={onApply}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: V1.blue, color: '#fff', border: 'none',
              padding: '16px 26px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
              boxShadow: `0 6px 20px ${V1.blue}55`,
              transition: 'transform 220ms, box-shadow 220ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 10px 28px ${V1.blue}77`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 20px ${V1.blue}55`; }}
          >
            Get my 2× estimate <PpIcon name="arr" size={14} />
          </button>
          <button
            onClick={onCalc}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.22)',
              padding: '15px 24px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
              transition: 'background 220ms, border-color 220ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}
          >
            ← Back to calculator
          </button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// V1ProcessingPage — main exporter
// ═══════════════════════════════════════════════════════════════
function V1ProcessingPage({ accent, onApply, onCalc }) {
  return (
    <main>
      <PpHero onApply={onApply} onCalc={onCalc} />
      <PpRails />
      <PpWhy />
      <PpExample />
      <PpSwitch />
      <PpFaq />
      <PpCta onApply={onApply} onCalc={onCalc} />
    </main>
  );
}

Object.assign(window, { V1ProcessingPage });
