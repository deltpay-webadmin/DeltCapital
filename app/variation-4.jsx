// Variation 4 — "Terminal"
// Dense, numeric-forward, trading-desk aesthetic. Monospace accents,
// live-ticker of recent fundings, compressed everything.

function V4Chrome({ page, navTo, accent, openApp }) {
  const links = [
    { k: 'home', l: 'Fund' },
    { k: 'how', l: 'Mechanics' },
    { k: 'reviews', l: 'Desk' },
    { k: 'about', l: 'Firm' },
  ];
  return (
    <header style={{ background: DELT.colors.paperWarm, borderBottom: `1px solid ${DELT.colors.line}` }}>
      {/* Ticker */}
      <div style={{ background: DELT.colors.ink, color: '#E9E7DF', padding: '6px 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          display: 'flex', gap: 40, whiteSpace: 'nowrap',
          animation: 'ticker 40s linear infinite', fontFamily: DELT.font.mono, fontSize: 11.5,
        }}>
          {[
            ['LA ROSA REST.', '$110K', '1.16×', 'CLOSED'],
            ['ROSARIO CON.', '$180K', '1.14×', 'WIRED'],
            ['BLOOM BTY.', '$65K', '1.19×', 'FUNDED'],
            ['WILLIAMS LOG.', '$80K', '1.17×', 'CLOSED'],
            ['WARD MKT.', '$50K', '1.18×', 'WIRED'],
            ['ROBERTS AUTO', '$95K', '1.15×', 'FUNDED'],
            ['NORTHGATE CAFE', '$42K', '1.20×', 'APPRVD'],
            ['SILVER FORK', '$220K', '1.13×', 'WIRED'],
          ].concat([
            ['LA ROSA REST.', '$110K', '1.16×', 'CLOSED'],
            ['ROSARIO CON.', '$180K', '1.14×', 'WIRED'],
            ['BLOOM BTY.', '$65K', '1.19×', 'FUNDED'],
            ['WILLIAMS LOG.', '$80K', '1.17×', 'CLOSED'],
          ]).map((row, i) => (
            <span key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: '#9E9BA8' }}>{row[0]}</span>
              <span>{row[1]}</span>
              <span style={{ color: accent }}>{row[2]}</span>
              <span style={{ color: DELT.colors.ok, fontSize: 10 }}>● {row[3]}</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
      </div>

      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: DELT.colors.paperWarm }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 36 }}>
          <div onClick={() => navTo('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: DELT.font.display, fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em', color: DELT.colors.ink }}>Delt</span>
            <span style={{ fontFamily: DELT.font.mono, fontSize: 10.5, color: DELT.colors.inkMute, letterSpacing: '0.14em' }}>CAPITAL</span>
          </div>
          <nav style={{ display: 'flex', gap: 4 }}>
            {links.map(ln => (
              <a key={ln.k} onClick={() => navTo(ln.k)} style={{
                fontFamily: DELT.font.mono, fontSize: 12, color: page === ln.k ? DELT.colors.ink : DELT.colors.inkSoft,
                cursor: 'pointer', padding: '5px 10px', borderRadius: 4, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                background: page === ln.k ? DELT.colors.paper : 'transparent',
              }}>{ln.l}</a>
            ))}
          </nav>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: DELT.font.mono, fontSize: 11, color: DELT.colors.inkMute }}>MEDIAN · 1.18× · 24H</span>
            <Btn variant="indigo" size="sm" onClick={openApp} style={{ background: accent, borderColor: accent, fontFamily: DELT.font.mono, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11.5 }}>
              Prequal →
            </Btn>
          </div>
        </div>
      </div>
    </header>
  );
}
V4Chrome.brand = (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
    <span style={{ fontFamily: DELT.font.display, fontWeight: 700, fontSize: 22, color: '#F7F5F0' }}>Delt</span>
    <span style={{ fontFamily: DELT.font.mono, fontSize: 10.5, color: '#9E9BA8', letterSpacing: '0.14em' }}>CAPITAL</span>
  </div>
);

function V4Hero({ accent, onApply }) {
  // Live "tape" of recent deals
  const deals = [
    { t: '09:42', biz: 'La Rosa Restaurant LLC', ind: 'Restaurant', amt: 110000, f: 1.16, s: 'WIRED' },
    { t: '09:38', biz: 'Rosario Construction', ind: 'Construction', amt: 180000, f: 1.14, s: 'CLOSED' },
    { t: '09:21', biz: 'Bloom Beauty Salon', ind: 'Beauty', amt: 65000, f: 1.19, s: 'FUNDED' },
    { t: '09:04', biz: 'Williams Logistics', ind: 'Logistics', amt: 80000, f: 1.17, s: 'WIRED' },
    { t: '08:52', biz: 'Ward Market', ind: 'Retail', amt: 50000, f: 1.18, s: 'FUNDED' },
    { t: '08:41', biz: 'Roberts Auto Service', ind: 'Automotive', amt: 95000, f: 1.15, s: 'WIRED' },
    { t: '08:33', biz: 'Northgate Cafe', ind: 'Restaurant', amt: 42000, f: 1.20, s: 'APPROVED' },
  ];

  return (
    <section style={{ background: DELT.colors.paperWarm }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: DELT.font.mono, fontSize: 11, color: DELT.colors.inkMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>DELT — DIRECT LENDER — 2019</span>
              <span style={{ width: 1, height: 10, background: DELT.colors.line }} />
              <span style={{ color: accent }}>Q1/26 BOOK LIVE</span>
            </div>
            <h1 style={{
              fontFamily: DELT.font.display, fontSize: 76, fontWeight: 600,
              letterSpacing: '-0.04em', color: DELT.colors.ink, lineHeight: 0.98, margin: 0,
            }}>
              Rates off our book,<br />
              not an <em style={{ fontStyle: 'italic', fontFamily: '"Source Serif Pro", Georgia, serif', fontWeight: 400, color: accent }}>aggregator's</em><br />
              markup.
            </h1>
            <p style={{ fontFamily: DELT.font.body, fontSize: 17, lineHeight: 1.55, color: DELT.colors.inkSoft, marginTop: 24, maxWidth: 520 }}>
              We're the underwriter, the lender, and the servicer. One factor rate. One flat schedule. Pay early, pay less — always.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <Btn variant="indigo" size="lg" onClick={onApply} style={{ background: accent, borderColor: accent, fontFamily: DELT.font.mono, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 13 }}>Open deal →</Btn>
              <Btn variant="ghost" size="lg" style={{ fontFamily: DELT.font.mono, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 13 }}>Read the book</Btn>
            </div>

            {/* Price strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 40, border: `1px solid ${DELT.colors.line}`, borderRadius: 8, overflow: 'hidden', background: DELT.colors.card }}>
              {[
                ['MIN', '1.12×', 'good credit'],
                ['MED', '1.18×', '30d rolling'],
                ['AVG', '1.21×', 'all tiers'],
                ['MAX', '1.28×', '<12mo tib'],
              ].map((r, i) => (
                <div key={r[0]} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : `1px solid ${DELT.colors.lineSoft}` }}>
                  <div style={{ fontFamily: DELT.font.mono, fontSize: 10, color: DELT.colors.inkMute, letterSpacing: '0.14em' }}>{r[0]}</div>
                  <div style={{ fontFamily: DELT.font.display, fontSize: 24, fontWeight: 600, color: DELT.colors.ink, letterSpacing: '-0.02em', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{r[1]}</div>
                  <div style={{ fontFamily: DELT.font.body, fontSize: 11, color: DELT.colors.inkMute, marginTop: 2 }}>{r[2]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The deal tape */}
          <div style={{ background: DELT.colors.card, border: `1px solid ${DELT.colors.line}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${DELT.colors.line}`, background: DELT.colors.paper }}>
              <div style={{ fontFamily: DELT.font.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: DELT.colors.inkSoft }}>Deal tape · live</div>
              <div style={{ fontFamily: DELT.font.mono, fontSize: 11, color: accent, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: accent, boxShadow: `0 0 6px ${accent}` }} />
                7 today
              </div>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 80px 60px 72px',
              padding: '10px 20px', fontFamily: DELT.font.mono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', color: DELT.colors.inkMute,
              borderBottom: `1px solid ${DELT.colors.lineSoft}`,
            }}>
              <div>Time</div><div>Business</div><div style={{ textAlign: 'right' }}>Amount</div><div style={{ textAlign: 'right' }}>Factor</div><div style={{ textAlign: 'right' }}>Status</div>
            </div>
            {deals.map((d, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 80px 60px 72px', alignItems: 'center',
                padding: '11px 20px', borderBottom: i === deals.length - 1 ? 'none' : `1px solid ${DELT.colors.lineSoft}`,
                fontFamily: DELT.font.mono, fontSize: 12, color: DELT.colors.ink,
              }}>
                <div style={{ color: DELT.colors.inkMute }}>{d.t}</div>
                <div style={{ fontFamily: DELT.font.body, fontSize: 13.5, fontWeight: 500 }}>
                  {d.biz}<span style={{ color: DELT.colors.inkMute, fontWeight: 400 }}> · {d.ind}</span>
                </div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${d.amt.toLocaleString()}</div>
                <div style={{ textAlign: 'right', color: accent, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.f.toFixed(2)}×</div>
                <div style={{ textAlign: 'right', color: DELT.colors.ok, fontSize: 10.5, letterSpacing: '0.04em' }}>● {d.s}</div>
              </div>
            ))}
            <div style={{ padding: '12px 20px', background: DELT.colors.paperWarm, fontFamily: DELT.font.mono, fontSize: 10.5, color: DELT.colors.inkMute, letterSpacing: '0.08em' }}>
              <span>UPDATED 09:47 ET · 28 ACTIVE DEALS · AVG TTA 24H</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Variation4() {
  return <DeltApp
    accent={DELT.colors.indigo}
    chrome={V4Chrome}
    hero={(props) => <V4Hero {...props} />} />;
}

Object.assign(window, { Variation4, V4Chrome, V4Hero });
