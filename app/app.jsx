// DeltApp — the interactive core. Each variation passes a `chrome` prop
// that renders the hero + navbar; everything else (calculator, quiz,
// compare, steps, reviews, about, application flow) is shared.

const { useState, useEffect, useRef, useMemo } = React;

// ────────────────────────────────────────────────────────────
// CALCULATOR — interactive, inline, same logic across variations
// ────────────────────────────────────────────────────────────
function DeltCalculator({ compact = false, onApply, themeAccent = DELT.colors.indigo, calcState, setCalcState }) {
  const c = calcState, set = setCalcState;
  const est = calcEstimate(c);
  const revenueDisplay = c.revenue ? c.revenue.toLocaleString() : '';

  const handleRev = (raw) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const n = Math.min(parseInt(digits || '0', 10), 500000);
    set({ ...c, revenue: n });
  };

  const tibOpts = [
    { v: '<6mo', l: '< 6 mo' },
    { v: '6-12mo', l: '6–12 mo' },
    { v: '1-2yr', l: '1–2 yr' },
    { v: '2yr+', l: '2+ yr' },
  ];

  const fieldStyle = {
    width: '100%', padding: '11px 12px',
    background: DELT.colors.paper, border: `1px solid ${DELT.colors.line}`,
    borderRadius: 6, fontFamily: DELT.font.body, fontSize: 15,
    color: DELT.colors.ink, fontVariantNumeric: 'tabular-nums',
    outline: 'none', transition: 'border-color .15s, box-shadow .15s',
  };

  return (
    <div style={{
      background: DELT.colors.card,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      padding: compact ? 20 : 28,
      fontFamily: DELT.font.body,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: compact ? 16 : 32 }}>
        {/* Left: inputs */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lblStyle}>Monthly revenue</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: DELT.colors.inkMute, fontSize: 15 }}>$</span>
                <input
                  type="text" inputMode="numeric" placeholder="25,000"
                  value={revenueDisplay}
                  onChange={(e) => handleRev(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = themeAccent; e.target.style.boxShadow = `0 0 0 3px ${themeAccent}1A`; }}
                  onBlur={(e) => { e.target.style.borderColor = DELT.colors.line; e.target.style.boxShadow = 'none'; }}
                  style={{ ...fieldStyle, paddingLeft: 24 }}
                />
              </div>
            </div>

            <div>
              <label style={lblStyle}>Time in business</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {tibOpts.map(o => {
                  const active = c.tib === o.v;
                  return (
                    <button key={o.v} onClick={() => set({ ...c, tib: o.v })} style={{
                      padding: '9px 4px', fontSize: 12.5, fontWeight: 500,
                      borderRadius: 6, cursor: 'pointer', fontFamily: DELT.font.body,
                      border: `1px solid ${active ? themeAccent : DELT.colors.line}`,
                      background: active ? `${themeAccent}0D` : DELT.colors.paper,
                      color: active ? themeAccent : DELT.colors.inkSoft,
                    }}>{o.l}</button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={lblStyle}>Accepts card payments?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[{ v: true, l: 'Yes' }, { v: false, l: 'No' }].map(o => {
                  const active = c.cards === o.v;
                  return (
                    <button key={String(o.v)} onClick={() => set({ ...c, cards: o.v, cardSales: o.v ? c.cardSales : 0 })} style={{
                      padding: '9px 4px', fontSize: 13, fontWeight: 500,
                      borderRadius: 6, cursor: 'pointer', fontFamily: DELT.font.body,
                      border: `1px solid ${active ? themeAccent : DELT.colors.line}`,
                      background: active ? `${themeAccent}0D` : DELT.colors.paper,
                      color: active ? themeAccent : DELT.colors.inkSoft,
                    }}>{o.l}</button>
                  );
                })}
              </div>
            </div>

            {c.cards && (
              <div>
                <label style={lblStyle}>Monthly card sales</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: DELT.colors.inkMute, fontSize: 15 }}>$</span>
                  <input
                    type="text" inputMode="numeric" placeholder="8,500"
                    value={c.cardSales ? c.cardSales.toLocaleString() : ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, '');
                      set({ ...c, cardSales: Math.min(parseInt(digits || '0', 10), 250000) });
                    }}
                    style={{ ...fieldStyle, paddingLeft: 24 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: estimate */}
        <div style={{
          background: DELT.colors.paper,
          border: `1px solid ${DELT.colors.line}`,
          borderRadius: 8,
          padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: compact ? 180 : 240,
        }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute, marginBottom: 6 }}>
              Estimated offer
            </div>
            {est.ok ? (
              <>
                <div style={{ fontSize: compact ? 32 : 40, fontWeight: 600, fontFamily: DELT.font.display, letterSpacing: '-0.02em', color: DELT.colors.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(est.low)}<span style={{ color: DELT.colors.inkMute, margin: '0 4px' }}>–</span>{fmt(est.high)}
                </div>
                <div style={{ display: 'flex', gap: 18, marginTop: 12, fontSize: 12.5, fontFamily: DELT.font.body }}>
                  <div>
                    <div style={{ color: DELT.colors.inkMute, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Factor</div>
                    <div style={{ color: DELT.colors.ink, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{est.factor.toFixed(2)}×</div>
                  </div>
                  <div>
                    <div style={{ color: DELT.colors.inkMute, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Term</div>
                    <div style={{ color: DELT.colors.ink, fontWeight: 600 }}>4–10 mo</div>
                  </div>
                  <div>
                    <div style={{ color: DELT.colors.inkMute, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Fund</div>
                    <div style={{ color: DELT.colors.ink, fontWeight: 600 }}>~24 hr</div>
                  </div>
                </div>
              </>
            ) : est.early ? (
              <div style={{ color: DELT.colors.inkMute, fontSize: 13.5, lineHeight: 1.5, marginTop: 4 }}>
                Under 6 months in business — we can still help through our launch program. Talk to a real person on our team.
              </div>
            ) : (
              <div>
                <div style={{ fontSize: compact ? 32 : 40, fontWeight: 600, fontFamily: DELT.font.display, color: DELT.colors.line, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  $0<span style={{ margin: '0 4px' }}>–</span>$0
                </div>
                <div style={{ color: DELT.colors.inkMute, fontSize: 12.5, marginTop: 10 }}>
                  Enter revenue and time in business.
                </div>
              </div>
            )}
          </div>

          <Btn variant="indigo" size="md" onClick={() => onApply?.(c, est)}
               style={{ marginTop: 16, width: '100%', justifyContent: 'center', background: themeAccent, borderColor: themeAccent }}>
            {est.ok ? 'Continue →' : 'Continue'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

const lblStyle = {
  display: 'block', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: DELT.colors.inkMute, marginBottom: 6,
  fontFamily: DELT.font.body,
};

// ────────────────────────────────────────────────────────────
// PAGE — Home (shared sections below the hero)
// ────────────────────────────────────────────────────────────
function StatsStrip({ align = 'row', accent = DELT.colors.indigo }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${DELT.colors.line}`, borderRadius: 10, background: DELT.colors.card }}>
      {DeltContent.stats.map((s, i) => (
        <div key={s.l} style={{
          padding: '22px 24px',
          borderLeft: i === 0 ? 'none' : `1px solid ${DELT.colors.lineSoft}`,
        }}>
          <div style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em', color: DELT.colors.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
          <div style={{ fontSize: 12, color: DELT.colors.inkMute, marginTop: 8, fontFamily: DELT.font.body }}>{s.l}</div>
        </div>
      ))}
    </div>
  );
}

function CompareSection({ accent = DELT.colors.indigo }) {
  return (
    <section style={{ background: DELT.colors.paper }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
        <SectionLabel accent={accent}>Comparison</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 40 }}>
          <h2 style={h2Style}>Delt vs. a traditional lender.<br />On the numbers that matter.</h2>
          <p style={{ fontFamily: DELT.font.body, fontSize: 15, lineHeight: 1.6, color: DELT.colors.inkSoft, marginTop: 8 }}>
            Every row is a median across the last 12 months of our book, measured against publicly-reported bank SBA 7(a) averages. We update quarterly.
          </p>
        </div>

        <div style={{ background: DELT.colors.card, border: `1px solid ${DELT.colors.line}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.3fr',
            padding: '14px 28px',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: DELT.colors.inkMute, background: DELT.colors.paperWarm,
            borderBottom: `1px solid ${DELT.colors.line}`, fontFamily: DELT.font.body,
          }}>
            <div></div>
            <div>Delt</div>
            <div>Traditional</div>
          </div>
          {DeltContent.compare.map((row, i) => (
            <div key={row.k} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.3fr', alignItems: 'center',
              padding: '18px 28px',
              borderBottom: i === DeltContent.compare.length - 1 ? 'none' : `1px solid ${DELT.colors.lineSoft}`,
              fontFamily: DELT.font.body,
            }}>
              <div style={{ fontSize: 14.5, color: DELT.colors.ink, fontWeight: 500 }}>{row.k}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: DELT.colors.ink, fontWeight: 500 }}>
                <Tick c={accent} /><span>{row.delt}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: DELT.colors.inkMute }}>
                <Ex /><span>{row.bank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsSection({ accent = DELT.colors.indigo }) {
  return (
    <section style={{ background: DELT.colors.paperWarm }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
        <SectionLabel accent={accent}>How it works</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 48 }}>
          <h2 style={h2Style}>Four steps. One business day.</h2>
          <p style={{ fontFamily: DELT.font.body, fontSize: 15, lineHeight: 1.6, color: DELT.colors.inkSoft, marginTop: 8 }}>
            No sales pitch, no "discovery call," no one asking for "just one more bank statement." We look at your deposits, price the offer, and send it over.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {DeltContent.steps.map((s, i) => (
            <div key={s.n} style={{
              background: DELT.colors.card, border: `1px solid ${DELT.colors.line}`,
              borderRadius: 10, padding: '24px 22px', position: 'relative',
              minHeight: 200,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: DELT.font.mono, fontSize: 13, color: accent, fontWeight: 500 }}>{s.n}</span>
                <span style={{ fontFamily: DELT.font.body, fontSize: 11, color: DELT.colors.inkMute, letterSpacing: '0.06em' }}>{s.time}</span>
              </div>
              <div style={{ fontFamily: DELT.font.display, fontSize: 19, fontWeight: 600, color: DELT.colors.ink, marginTop: 18, letterSpacing: '-0.01em' }}>{s.t}</div>
              <div style={{ fontFamily: DELT.font.body, fontSize: 13.5, lineHeight: 1.55, color: DELT.colors.inkSoft, marginTop: 8 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ accent = DELT.colors.indigo }) {
  return (
    <section style={{ background: DELT.colors.paper }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
        <SectionLabel accent={accent}>Operators</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 40 }}>
          <h2 style={h2Style}>What the last 100 borrowers said on their renewal call.</h2>
          <p style={{ fontFamily: DELT.font.body, fontSize: 15, lineHeight: 1.6, color: DELT.colors.inkSoft, marginTop: 8 }}>
            Verified. Every quote is from a borrower who has closed at least once. The business names are real, on request.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {DeltContent.testimonials.map((t, i) => (
            <figure key={i} style={{
              background: DELT.colors.card, border: `1px solid ${DELT.colors.line}`,
              borderRadius: 10, padding: 24, margin: 0,
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <blockquote style={{
                fontFamily: DELT.font.display, fontSize: 18, lineHeight: 1.4,
                color: DELT.colors.ink, letterSpacing: '-0.01em', margin: 0, fontWeight: 500,
              }}>"{t.q}"</blockquote>
              <figcaption style={{ fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute, marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: `1px solid ${DELT.colors.lineSoft}`, paddingTop: 14 }}>
                <div>
                  <div style={{ color: DELT.colors.ink, fontWeight: 500 }}>{t.n}</div>
                  <div>{t.b}</div>
                </div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  <div style={{ color: accent, fontWeight: 600 }}>{t.f}</div>
                  <div>{t.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ accent = DELT.colors.indigo }) {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ background: DELT.colors.paperWarm }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '80px 32px' }}>
        <SectionLabel accent={accent}>Questions</SectionLabel>
        <h2 style={{ ...h2Style, marginBottom: 40 }}>What business owners actually ask.</h2>
        <div style={{ borderTop: `1px solid ${DELT.colors.line}` }}>
          {DeltContent.faq.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${DELT.colors.line}` }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                width: '100%', padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
                textAlign: 'left', fontFamily: DELT.font.display, fontSize: 17, fontWeight: 500, color: DELT.colors.ink, letterSpacing: '-0.005em',
              }}>
                {f.q}
                <span style={{
                  fontFamily: DELT.font.mono, fontSize: 18, color: accent, flexShrink: 0,
                  transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .2s',
                }}>+</span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: 20, fontFamily: DELT.font.body, fontSize: 14.5, lineHeight: 1.65, color: DELT.colors.inkSoft, maxWidth: 720 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterBlock({ accent = DELT.colors.indigo, brand, onNav }) {
  const linkKeyMap = { 'Blog': 'blog', 'FAQ': 'faq', 'About': 'about', 'How it works': 'how', 'Calculator': 'calc', 'Reviews': 'reviews', 'Support': 'support', 'Contact': 'support', 'Terms of Use': 'terms', 'Privacy Policy': 'privacy', 'Communications': 'eca' };
  const handle = (label) => (e) => {
    const k = linkKeyMap[label];
    if (k && onNav) { e.preventDefault(); onNav(k); }
  };
  return (
    <footer style={{ background: DELT.colors.ink, color: '#E9E7DF', padding: '64px 32px 40px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            {brand}
            <p style={{ fontFamily: DELT.font.body, fontSize: 13.5, lineHeight: 1.6, color: '#9E9BA8', marginTop: 16, maxWidth: 300 }}>
              Revenue-based funding for U.S. businesses. Direct lender. Equal-opportunity finance.
            </p>
          </div>
          {[
            { h: 'Product', links: ['Calculator', 'How it works'] },
            { h: 'Company', links: ['About', 'Reviews'] },
            { h: 'Resources', links: ['FAQ', 'Blog', 'Support'] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: DELT.font.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6A6876', marginBottom: 18 }}>{col.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} onClick={handle(l)} style={{ fontFamily: DELT.font.body, fontSize: 14, color: '#E9E7DF', textDecoration: 'none', cursor: 'pointer' }}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 28, borderTop: '1px solid #2B2A35', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap', fontFamily: DELT.font.body, fontSize: 12, color: '#6A6876' }}>
          <span>© 2026 Delt Capital, Inc. NMLS #—. California Finance Lender License #—.</span>
          <span style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['Terms of Use', 'Privacy Policy', 'Communications'].map(l => (
              <a
                key={l}
                onClick={handle(l)}
                style={{ color: '#9E9BA8', textDecoration: 'none', cursor: 'pointer', transition: 'color 180ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E9E7DF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9E9BA8'; }}
              >{l}</a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}

function SectionLabel({ children, accent }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontFamily: DELT.font.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: accent, marginBottom: 20,
    }}>
      <span style={{ width: 20, height: 1, background: accent }} />
      {children}
    </div>
  );
}

const h2Style = {
  fontFamily: DELT.font.display, fontSize: 36, fontWeight: 600,
  letterSpacing: '-0.025em', color: DELT.colors.ink, lineHeight: 1.1, margin: 0,
};

// ────────────────────────────────────────────────────────────
// PAGES — About, HowItWorks, Reviews (lighter variants)
// ────────────────────────────────────────────────────────────
function AboutPage({ accent }) {
  return (
    <div style={{ background: DELT.colors.paper }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '88px 32px 48px' }}>
        <SectionLabel accent={accent}>About</SectionLabel>
        <h1 style={{ fontFamily: DELT.font.display, fontSize: 56, fontWeight: 600, letterSpacing: '-0.035em', color: DELT.colors.ink, lineHeight: 1.05, margin: 0 }}>
          We look at your business the way a smart financial advisor would — by reading your deposits, not just your credit report.
        </h1>
        <p style={{ fontFamily: DELT.font.body, fontSize: 18, lineHeight: 1.6, color: DELT.colors.inkSoft, marginTop: 28, maxWidth: 680 }}>
          Delt was founded in 2019 by two business owners who were quoted a 1.48× factor rate on an advance to buy inventory. They decided the small-business funding world needed a direct lender that didn't hide behind layers of brokers.
        </p>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: DELT.colors.line, border: `1px solid ${DELT.colors.line}`, borderRadius: 10, overflow: 'hidden' }}>
          {[
            { h: 'Direct capital', t: 'We lend off our own balance sheet. No broker points, no middleman markup, no "we\'ll shop you around."' },
            { h: 'Revenue-based', t: 'We review 90 days of your deposits through a secure bank link. Your credit score is a check, not the deciding factor.' },
            { h: 'Flat pricing', t: 'One factor rate. No origination fee, no "processing fee," no ACH fees. The number you see is the number you pay.' },
            { h: 'Early-pay rebates', t: 'Pay off early and we return the unearned factor pro-rata. The industry standard — owe the full factor — is a tax on success.' },
            { h: 'No prepayment penalties', t: 'Ever. On any product. Written into every contract on page one.' },
            { h: 'Real people review your file', t: 'A two-person team handles approvals. A real person reads your file and has the authority to price your offer.' },
          ].map(v => (
            <div key={v.h} style={{ background: DELT.colors.card, padding: 28 }}>
              <div style={{ fontFamily: DELT.font.display, fontSize: 18, fontWeight: 600, color: DELT.colors.ink, letterSpacing: '-0.01em' }}>{v.h}</div>
              <div style={{ fontFamily: DELT.font.body, fontSize: 13.5, lineHeight: 1.6, color: DELT.colors.inkSoft, marginTop: 10 }}>{v.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorksPage({ accent, onApply }) {
  const steps = [
    { n: '01', t: 'Get Funded', d: 'Three fields on the calculator — revenue, time in business, card processor. We return a funded-range estimate and a factor rate in under a minute. Soft-pull only; no impact to your business credit.', time: '< 1 minute', doc: 'No statements, no tax returns.' },
    { n: '02', t: 'Connect bank', d: 'Plaid read-only link to your primary operating account. We analyze 90 days of deposits, average daily balances, and negative-day frequency. This replaces the statement-review step other lenders drag out for weeks.', time: '~ 2 minutes', doc: 'Plaid. Read-only.' },
    { n: '03', t: 'Receive offer', d: 'One page. Amount, factor rate, term, daily or weekly debit size, total repayment, full amortization schedule. No other fees. Sign it or send it to your CFO — no "advisor" to route around.', time: 'Same day', doc: 'Single PDF. No addenda.' },
    { n: '04', t: 'Fund', d: 'Wire or ACH to your operating account. Wire before 2 pm ET clears same-day; ACH next business day. Funds are yours — no restricted accounts, no controlled disbursements.', time: '24 hours', doc: 'Wire or ACH. Your choice.' },
  ];

  return (
    <div style={{ background: DELT.colors.paper }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px 48px' }}>
        <SectionLabel accent={accent}>How it works</SectionLabel>
        <h1 style={{ fontFamily: DELT.font.display, fontSize: 54, fontWeight: 600, letterSpacing: '-0.035em', color: DELT.colors.ink, lineHeight: 1.05, margin: 0, maxWidth: 800 }}>
          From first click to funded wire. One business day, every time.
        </h1>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 64px' }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: 48, alignItems: 'start',
            padding: '36px 0', borderTop: `1px solid ${DELT.colors.line}`,
          }}>
            <div style={{ fontFamily: DELT.font.mono, fontSize: 14, color: accent, fontWeight: 500, paddingTop: 4 }}>{s.n}</div>
            <div>
              <div style={{ fontFamily: DELT.font.display, fontSize: 26, fontWeight: 600, color: DELT.colors.ink, letterSpacing: '-0.02em', marginBottom: 8 }}>{s.t}</div>
              <div style={{ fontFamily: DELT.font.body, fontSize: 15.5, lineHeight: 1.6, color: DELT.colors.inkSoft, maxWidth: 620 }}>{s.d}</div>
            </div>
            <div style={{ borderLeft: `1px solid ${DELT.colors.line}`, paddingLeft: 20, paddingTop: 4 }}>
              <div style={{ fontFamily: DELT.font.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: DELT.colors.inkMute, marginBottom: 4 }}>Elapsed</div>
              <div style={{ fontFamily: DELT.font.mono, fontSize: 15, color: DELT.colors.ink, fontVariantNumeric: 'tabular-nums' }}>{s.time}</div>
              <div style={{ fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute, marginTop: 10 }}>{s.doc}</div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${DELT.colors.line}`, paddingTop: 40, marginTop: 8 }}>
          <Btn variant="indigo" size="lg" onClick={onApply} style={{ background: accent, borderColor: accent }}>Start an application <Arr /></Btn>
        </div>
      </div>
    </div>
  );
}

function ReviewsPage({ accent }) {
  return (
    <div style={{ background: DELT.colors.paper }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px 56px' }}>
        <SectionLabel accent={accent}>Reviews</SectionLabel>
        <h1 style={{ fontFamily: DELT.font.display, fontSize: 54, fontWeight: 600, letterSpacing: '-0.035em', color: DELT.colors.ink, lineHeight: 1.05, margin: 0, maxWidth: 800 }}>
          Verified by renewal. 68% of our book has funded with us more than once.
        </h1>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 96px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[...DeltContent.testimonials, ...DeltContent.testimonials.slice(0, 4)].map((t, i) => (
          <figure key={i} style={{
            background: DELT.colors.card, border: `1px solid ${DELT.colors.line}`,
            borderRadius: 10, padding: 32, margin: 0,
          }}>
            <blockquote style={{ fontFamily: DELT.font.display, fontSize: 22, lineHeight: 1.4, color: DELT.colors.ink, letterSpacing: '-0.015em', margin: 0, fontWeight: 500 }}>"{t.q}"</blockquote>
            <figcaption style={{ fontFamily: DELT.font.body, fontSize: 13, color: DELT.colors.inkMute, marginTop: 24, display: 'flex', justifyContent: 'space-between', gap: 16, borderTop: `1px solid ${DELT.colors.lineSoft}`, paddingTop: 16 }}>
              <div>
                <div style={{ color: DELT.colors.ink, fontWeight: 500 }}>{t.n}</div>
                <div>{t.b}</div>
              </div>
              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                <div style={{ color: accent, fontWeight: 600 }}>{t.f} funded</div>
                <div>{t.r} factor</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// APPLICATION FLOW — multistep modal, simulated end-to-end
// ────────────────────────────────────────────────────────────
function ApplicationFlow({ open, onClose, prefill, accent }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessName: '', ein: '', legalForm: 'LLC',
    firstName: '', lastName: '', email: '', phone: '',
    state: 'CA', useOfFunds: 'Inventory',
    bankConnected: false, ssn4: '',
    amount: prefill?.high || 75000,
  });

  useEffect(() => { if (open) { setStep(0); } }, [open]);

  if (!open) return null;

  const steps = ['Business', 'Bank', 'Identity', 'Offer', 'Done'];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,14,23,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      overflowY: 'auto', padding: '60px 20px',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: DELT.colors.card, borderRadius: 14, maxWidth: 680, width: '100%',
        border: `1px solid ${DELT.colors.line}`, overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(15,14,23,0.25)',
      }}>
        {/* Header with stepper */}
        <div style={{
          padding: '20px 32px', borderBottom: `1px solid ${DELT.colors.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: DELT.colors.paperWarm,
        }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  fontFamily: DELT.font.mono, fontSize: 11, color: i <= step ? accent : DELT.colors.inkMute,
                  fontWeight: 500, padding: '4px 8px', background: i <= step ? `${accent}14` : 'transparent',
                  borderRadius: 4, letterSpacing: '0.04em',
                }}>0{i + 1} · {s}</div>
                {i < steps.length - 1 && <div style={{ width: 16, height: 1, background: DELT.colors.line }} />}
              </React.Fragment>
            ))}
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: DELT.colors.inkMute, padding: 4 }}>×</button>
        </div>

        <div style={{ padding: '36px 32px', minHeight: 380 }}>
          {step === 0 && <StepBusiness form={form} setForm={setForm} accent={accent} />}
          {step === 1 && <StepBank form={form} setForm={setForm} accent={accent} />}
          {step === 2 && <StepIdentity form={form} setForm={setForm} accent={accent} />}
          {step === 3 && <StepOffer form={form} setForm={setForm} prefill={prefill} accent={accent} />}
          {step === 4 && <StepDone form={form} accent={accent} />}
        </div>

        <div style={{
          padding: '16px 32px', borderTop: `1px solid ${DELT.colors.line}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: DELT.colors.paperWarm,
        }}>
          <div style={{ fontFamily: DELT.font.body, fontSize: 12, color: DELT.colors.inkMute }}>
            {step < 4 ? 'Secured · Plaid · Soft-pull only' : 'Application received'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && step < 4 && <Btn variant="ghost" size="sm" onClick={() => setStep(step - 1)}>Back</Btn>}
            {step < 3 && <Btn variant="indigo" size="sm" onClick={() => setStep(step + 1)} style={{ background: accent, borderColor: accent }}>Continue <Arr /></Btn>}
            {step === 3 && <Btn variant="indigo" size="sm" onClick={() => setStep(4)} style={{ background: accent, borderColor: accent }}>Accept offer <Arr /></Btn>}
            {step === 4 && <Btn variant="ghost" size="sm" onClick={onClose}>Close</Btn>}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div>
      <label style={lblStyle}>{label}</label>
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder, accent }) {
  return (
    <input value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}1A`; }}
      onBlur={(e) => { e.target.style.borderColor = DELT.colors.line; e.target.style.boxShadow = 'none'; }}
      style={{ width: '100%', padding: '10px 12px', background: DELT.colors.paper, border: `1px solid ${DELT.colors.line}`, borderRadius: 6, fontFamily: DELT.font.body, fontSize: 14.5, color: DELT.colors.ink, outline: 'none', transition: 'border-color .15s, box-shadow .15s' }} />
  );
}
function Select({ value, onChange, opts, accent }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: '10px 12px', background: DELT.colors.paper, border: `1px solid ${DELT.colors.line}`, borderRadius: 6, fontFamily: DELT.font.body, fontSize: 14.5, color: DELT.colors.ink, outline: 'none', cursor: 'pointer' }}>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function StepBusiness({ form, setForm, accent }) {
  return (
    <div>
      <h3 style={stepTitle}>About your business</h3>
      <p style={stepSub}>Used to confirm your business is properly registered. We don't run a full credit check on your business.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
        <FieldRow label="Legal business name"><Input value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} placeholder="La Rosa Restaurant LLC" accent={accent} /></FieldRow>
        <FieldRow label="EIN"><Input value={form.ein} onChange={(v) => setForm({ ...form, ein: v })} placeholder="12-3456789" accent={accent} /></FieldRow>
        <FieldRow label="Entity type"><Select value={form.legalForm} onChange={(v) => setForm({ ...form, legalForm: v })} opts={['LLC', 'S-Corp', 'C-Corp', 'Sole Prop', 'Partnership']} accent={accent} /></FieldRow>
        <FieldRow label="State of operation"><Select value={form.state} onChange={(v) => setForm({ ...form, state: v })} opts={['CA', 'TX', 'FL', 'NY', 'IL', 'GA', 'Other']} accent={accent} /></FieldRow>
        <FieldRow label="First name"><Input value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} placeholder="Maria" accent={accent} /></FieldRow>
        <FieldRow label="Last name"><Input value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} placeholder="Rodriguez" accent={accent} /></FieldRow>
        <FieldRow label="Email"><Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@business.com" accent={accent} /></FieldRow>
        <FieldRow label="Phone"><Input value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="(555) 555-0199" accent={accent} /></FieldRow>
      </div>
    </div>
  );
}

function StepBank({ form, setForm, accent }) {
  const [connecting, setConnecting] = useState(false);
  return (
    <div>
      <h3 style={stepTitle}>Connect your bank</h3>
      <p style={stepSub}>We read 90 days of deposits via Plaid — read-only, no ACH authorization yet.</p>
      <div style={{ marginTop: 28, background: DELT.colors.paper, border: `1px solid ${DELT.colors.line}`, borderRadius: 10, padding: 24 }}>
        {form.bankConnected ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 6, background: DELT.colors.ok, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tick c="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: DELT.font.display, fontSize: 16, fontWeight: 600, color: DELT.colors.ink }}>Chase Business Complete · ••1842</div>
                <div style={{ fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute }}>90 days of deposits read · $312,480 total</div>
              </div>
            </div>
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[['Avg. daily balance', '$28,410'], ['Neg. days (90d)', '0'], ['Avg. monthly deposits', '$104,160']].map(([k, v]) => (
                <div key={k} style={{ background: DELT.colors.card, border: `1px solid ${DELT.colors.lineSoft}`, borderRadius: 6, padding: 12 }}>
                  <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>{k}</div>
                  <div style={{ fontFamily: DELT.font.display, fontSize: 18, fontWeight: 600, color: DELT.colors.ink, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ) : connecting ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontFamily: DELT.font.mono, fontSize: 13, color: accent, marginBottom: 10 }}>Reading 90 days of deposits…</div>
            <div style={{ width: '60%', height: 3, background: DELT.colors.line, margin: '0 auto', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: accent, animation: 'dpulse 1.4s linear infinite' }} />
            </div>
            <style>{`@keyframes dpulse { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: DELT.font.body, fontSize: 14.5, color: DELT.colors.inkSoft, lineHeight: 1.5, marginBottom: 20 }}>
              Select your primary operating bank. Plaid will open in a secure popup — you sign in with your bank credentials, not us.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'US Bank', 'Other (20k+)'].map(b => (
                <button key={b} onClick={() => {
                  setConnecting(true);
                  setTimeout(() => { setForm({ ...form, bankConnected: true }); setConnecting(false); }, 1600);
                }} style={{
                  padding: '14px 10px', background: DELT.colors.card, border: `1px solid ${DELT.colors.line}`,
                  borderRadius: 6, cursor: 'pointer', fontFamily: DELT.font.body, fontSize: 13, color: DELT.colors.ink, fontWeight: 500,
                }}>{b}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StepIdentity({ form, setForm, accent }) {
  return (
    <div>
      <h3 style={stepTitle}>Verify identity</h3>
      <p style={stepSub}>Last 4 of your SSN — used for the standard identity check only. Soft credit check, no impact on your personal credit.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24, maxWidth: 420 }}>
        <FieldRow label="SSN (last 4)"><Input value={form.ssn4} onChange={(v) => setForm({ ...form, ssn4: v.replace(/[^0-9]/g, '').slice(0, 4) })} placeholder="1234" accent={accent} /></FieldRow>
        <FieldRow label="Use of funds"><Select value={form.useOfFunds} onChange={(v) => setForm({ ...form, useOfFunds: v })} opts={['Inventory', 'Equipment', 'Hiring', 'Renovation', 'Marketing', 'Bridge A/R', 'Other']} accent={accent} /></FieldRow>
      </div>
      <div style={{ marginTop: 32, padding: 16, background: DELT.colors.paperWarm, border: `1px solid ${DELT.colors.line}`, borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 6, height: 6, borderRadius: 999, background: accent, marginTop: 8, flexShrink: 0 }} />
        <div style={{ fontFamily: DELT.font.body, fontSize: 13, color: DELT.colors.inkSoft, lineHeight: 1.55 }}>
          Soft credit check on your personal credit only. We never do a full credit check at this stage. A full credit check only happens if you sign an offer — and only on the person guaranteeing the loan.
        </div>
      </div>
    </div>
  );
}

function StepOffer({ form, prefill, accent }) {
  const amount = prefill?.high || 75000;
  const factor = prefill?.factor || 1.18;
  const total = Math.round(amount * factor);
  const term = 8;
  const daily = Math.round(total / (term * 22));

  return (
    <div>
      <h3 style={stepTitle}>Your offer</h3>
      <p style={stepSub}>One page. No fine-print add-ons. Sign to move to funding.</p>

      <div style={{ marginTop: 28, border: `1px solid ${DELT.colors.line}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ background: DELT.colors.ink, color: '#F7F5F0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9E9BA8' }}>Advance amount</div>
            <div style={{ fontFamily: DELT.font.display, fontSize: 42, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>${amount.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9E9BA8' }}>Offer ID</div>
            <div style={{ fontFamily: DELT.font.mono, fontSize: 14, marginTop: 4, color: '#E9E7DF' }}>DLT-2026-{Math.floor(Math.random() * 900000 + 100000)}</div>
          </div>
        </div>
        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, background: DELT.colors.card }}>
          {[
            ['Factor rate', `${factor.toFixed(2)}×`],
            ['Total repayment', `$${total.toLocaleString()}`],
            ['Term', `${term} months`],
            ['Daily debit', `$${daily.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>{k}</div>
              <div style={{ fontFamily: DELT.font.display, fontSize: 20, fontWeight: 600, color: DELT.colors.ink, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 24px', background: DELT.colors.paperWarm, borderTop: `1px solid ${DELT.colors.line}`, fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute, display: 'flex', justifyContent: 'space-between' }}>
          <div>No origination fee · No ACH fee · Early-pay rebate included</div>
          <div style={{ fontFamily: DELT.font.mono }}>Expires in 72h</div>
        </div>
      </div>
    </div>
  );
}

function StepDone({ form, accent }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ width: 48, height: 48, margin: '0 auto 20px', borderRadius: 999, background: `${accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Tick c={accent} />
      </div>
      <h3 style={{ ...stepTitle, textAlign: 'center' }}>You're funded.</h3>
      <p style={{ ...stepSub, textAlign: 'center', maxWidth: 460, margin: '8px auto 24px' }}>
        Funds will arrive in your connected account by 2 pm ET tomorrow. A copy of your contract and payment schedule is on its way to {form.email || 'your email'}.
      </p>
      <div style={{ fontFamily: DELT.font.mono, fontSize: 12, color: DELT.colors.inkMute }}>Reference number · DLT-2026-{Math.floor(Math.random() * 900000 + 100000)}</div>
    </div>
  );
}

const stepTitle = { fontFamily: DELT.font.display, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: DELT.colors.ink, margin: 0 };
const stepSub = { fontFamily: DELT.font.body, fontSize: 14, color: DELT.colors.inkMute, margin: '8px 0 0', lineHeight: 1.55 };

// ────────────────────────────────────────────────────────────
// DeltApp — stateful shell consumed by each variation
// ────────────────────────────────────────────────────────────
function DeltApp({ chrome, accent = DELT.colors.indigo, hero }) {
  const [page, setPage] = useState('home'); // home | about | how | reviews
  const [appOpen, setAppOpen] = useState(false);
  const [calcState, setCalcState] = useState({ revenue: 0, tib: '', cards: null, cardSales: 0 });
  const [appPrefill, setAppPrefill] = useState(null);

  const navTo = (p) => { setPage(p); window.scrollTo(0, 0); };

  const openApp = (c, est) => {
    if (est) setAppPrefill(est);
    setAppOpen(true);
  };

  const pageContent = (() => {
    if (page === 'about') return <AboutPage accent={accent} />;
    if (page === 'how') return <HowItWorksPage accent={accent} onApply={() => openApp(null, null)} />;
    if (page === 'reviews') return <ReviewsPage accent={accent} />;

    // Home: chrome renders hero, we render everything below
    return (
      <>
        {hero && hero({ accent, calcState, setCalcState, onApply: openApp })}

        <section style={{ background: DELT.colors.paperWarm, padding: '48px 32px 16px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <StatsStrip accent={accent} />
          </div>
        </section>

        <CompareSection accent={accent} />
        <StepsSection accent={accent} />

        {/* Inline calculator, if hero didn't render one */}
        {!hero?.calcInline && (
          <section style={{ background: DELT.colors.paperWarm, padding: '80px 32px' }}>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
              <SectionLabel accent={accent}>Calculator</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 32 }}>
                <h2 style={h2Style}>Price the deal before you apply.</h2>
                <p style={{ fontFamily: DELT.font.body, fontSize: 15, lineHeight: 1.6, color: DELT.colors.inkSoft, marginTop: 8 }}>
                  Live estimates based on the same logic our team uses on every Delt application.
                </p>
              </div>
              <DeltCalculator calcState={calcState} setCalcState={setCalcState} onApply={openApp} themeAccent={accent} />
            </div>
          </section>
        )}

        <ReviewsSection accent={accent} />
        <FAQSection accent={accent} />
      </>
    );
  })();

  return (
    <>
      {chrome({
        page, navTo, accent, openApp: () => openApp(null, null),
      })}
      {pageContent}
      <FooterBlock accent={accent} brand={chrome.brand} />
      <ApplicationFlow open={appOpen} onClose={() => setAppOpen(false)} prefill={appPrefill} accent={accent} />
    </>
  );
}

Object.assign(window, {
  DeltApp, DeltCalculator, StatsStrip, CompareSection, StepsSection,
  ReviewsSection, FAQSection, FooterBlock, SectionLabel, h2Style, lblStyle,
  AboutPage, HowItWorksPage, ReviewsPage, ApplicationFlow,
});
