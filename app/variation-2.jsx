// Variation 2 — "Institutional"
// Stripe-style: subtle warm gradient backdrop, hero with headline left,
// embedded browser-chrome mockup right showing the offer page.

function V2Chrome({ page, navTo, accent, openApp }) {
  const groups = [
    { k: 'how', l: 'Funding' },
    { k: 'how', l: 'Pricing' },
    { k: 'reviews', l: 'Customers' },
    { k: 'about', l: 'Company' },
  ];
  return (
    <header style={{
      background: DELT.colors.paperWarm,
      borderBottom: `1px solid ${DELT.colors.line}`,
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 48 }}>
        <div onClick={() => navTo('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${accent}, ${DELT.colors.violet})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: DELT.font.display, fontWeight: 700, fontSize: 16 }}>D</div>
          <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 18, color: DELT.colors.ink, letterSpacing: '-0.02em' }}>Delt Capital</span>
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {groups.map((g, i) => (
            <a key={i} onClick={() => navTo(g.k)} style={{
              fontFamily: DELT.font.body, fontSize: 13.5, color: DELT.colors.inkSoft,
              cursor: 'pointer', padding: '6px 12px', borderRadius: 6, fontWeight: 500,
            }}>{g.l}</a>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <a style={{ fontFamily: DELT.font.body, fontSize: 13.5, color: DELT.colors.inkSoft, cursor: 'pointer' }}>Sign in</a>
          <Btn variant="indigo" size="sm" onClick={openApp} style={{ background: accent, borderColor: accent }}>Get funded <Arr /></Btn>
        </div>
      </div>
    </header>
  );
}
V2Chrome.brand = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${DELT.colors.indigo}, ${DELT.colors.violet})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: DELT.font.display, fontWeight: 700, fontSize: 16 }}>D</div>
    <span style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 18, color: '#F7F5F0' }}>Delt Capital</span>
  </div>
);

function V2Hero({ accent, onApply }) {
  return (
    <section style={{
      background: `linear-gradient(180deg, ${DELT.colors.paperWarm} 0%, ${DELT.colors.paper} 100%)`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Soft decorative arcs */}
      <svg width="800" height="600" viewBox="0 0 800 600" style={{ position: 'absolute', top: -200, right: -120, opacity: 0.5, pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="v2g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.25" />
            <stop offset="1" stopColor={DELT.colors.violet} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx="500" cy="300" r={120 + i * 60} fill="none" stroke="url(#v2g)" strokeWidth="1" />
        ))}
      </svg>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 32px 96px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <Pill tone="indigo" style={{ color: accent }}>Direct lender · 2019</Pill>
            <h1 style={{
              fontFamily: DELT.font.display, fontSize: 64, fontWeight: 600,
              letterSpacing: '-0.035em', color: DELT.colors.ink, lineHeight: 1.02,
              margin: '20px 0 0', maxWidth: 580,
            }}>
              Funding infrastructure for U.S. businesses.
            </h1>
            <p style={{ fontFamily: DELT.font.body, fontSize: 18, lineHeight: 1.55, color: DELT.colors.inkSoft, marginTop: 22, maxWidth: 500 }}>
              Delt powers revenue-based advances from $5K to $500K. Same-day offers, next-day wires, a flat factor rate that never compounds.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <Btn variant="indigo" size="lg" onClick={onApply} style={{ background: accent, borderColor: accent }}>Start prequal <Arr /></Btn>
              <Btn variant="ghost" size="lg">Contact sales</Btn>
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 28, fontFamily: DELT.font.body, fontSize: 12.5, color: DELT.colors.inkMute }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Tick c={accent} /> Soft-pull only</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Tick c={accent} /> No paperwork</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Tick c={accent} /> No prepayment penalty</div>
            </div>
          </div>

          {/* Browser mock */}
          <div style={{
            background: DELT.colors.card, border: `1px solid ${DELT.colors.line}`, borderRadius: 12,
            overflow: 'hidden', boxShadow: '0 24px 60px rgba(15,14,23,0.10), 0 2px 8px rgba(15,14,23,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: DELT.colors.paperWarm, borderBottom: `1px solid ${DELT.colors.line}` }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#E06C75', '#E5B24C', '#67B26F'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c, opacity: 0.7 }} />)}
              </div>
              <div style={{ marginLeft: 14, padding: '3px 10px', background: DELT.colors.card, border: `1px solid ${DELT.colors.lineSoft}`, borderRadius: 5, fontFamily: DELT.font.mono, fontSize: 11, color: DELT.colors.inkMute, flex: 1, maxWidth: 280 }}>
                delt.com/offer/dlt-2026-819402
              </div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Offer · approved</div>
              <div style={{ fontFamily: DELT.font.display, fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', color: DELT.colors.ink, marginTop: 4, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>$110,000</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <Pill tone="ok">Approved</Pill>
                <Pill>24h funding</Pill>
              </div>
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${DELT.colors.line}`, borderRadius: 8, overflow: 'hidden' }}>
                {[
                  ['Factor rate', '1.16×'],
                  ['Total repayment', '$127,600'],
                  ['Term', '8 months'],
                  ['Daily debit', '$725'],
                ].map(([k, v], i) => (
                  <div key={k} style={{
                    padding: '14px 18px',
                    borderRight: i % 2 === 0 ? `1px solid ${DELT.colors.lineSoft}` : 'none',
                    borderBottom: i < 2 ? `1px solid ${DELT.colors.lineSoft}` : 'none',
                  }}>
                    <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>{k}</div>
                    <div style={{ fontFamily: DELT.font.display, fontSize: 20, fontWeight: 600, color: DELT.colors.ink, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, padding: 12, background: DELT.colors.paper, borderRadius: 6, fontFamily: DELT.font.body, fontSize: 12, color: DELT.colors.inkMute, display: 'flex', justifyContent: 'space-between' }}>
                <span>No origination · No ACH fee · Early-pay rebate</span>
                <span style={{ fontFamily: DELT.font.mono, color: accent }}>● Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Variation2() {
  return <DeltApp
    accent={DELT.colors.indigo}
    chrome={V2Chrome}
    hero={(props) => <V2Hero {...props} />} />;
}

Object.assign(window, { Variation2, V2Chrome, V2Hero });
