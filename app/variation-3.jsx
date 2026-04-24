// Variation 3 — "Split" — full-bleed split hero with LIVE calculator inline.
// Left: bold headline + value props. Right: the calculator itself, in the hero.
// This is the workhorse conversion layout.

function V3Chrome({ page, navTo, accent, openApp }) {
  const links = [
    { k: 'home', l: 'Overview' },
    { k: 'how', l: 'How it works' },
    { k: 'reviews', l: 'Reviews' },
    { k: 'about', l: 'About' },
  ];
  return (
    <header style={{
      background: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navTo('home')} style={{ cursor: 'pointer', fontFamily: DELT.font.display, fontWeight: 700, fontSize: 22, letterSpacing: '-0.04em', color: DELT.colors.ink }}>
          DELT<span style={{ color: accent }}>/</span>
        </div>
        <nav style={{ display: 'flex', gap: 32 }}>
          {links.map(ln => (
            <a key={ln.k} onClick={() => navTo(ln.k)} style={{
              fontFamily: DELT.font.body, fontSize: 13, color: page === ln.k ? DELT.colors.ink : DELT.colors.inkSoft,
              fontWeight: 500, letterSpacing: '0.02em', cursor: 'pointer',
            }}>{ln.l}</a>
          ))}
        </nav>
        <Btn variant="primary" size="sm" onClick={openApp}>Apply →</Btn>
      </div>
    </header>
  );
}
V3Chrome.brand = (
  <div style={{ fontFamily: DELT.font.display, fontWeight: 700, fontSize: 22, letterSpacing: '-0.04em', color: '#F7F5F0' }}>
    DELT<span style={{ color: DELT.colors.indigo }}>/</span>
  </div>
);

function V3Hero({ accent, calcState, setCalcState, onApply }) {
  return (
    <section style={{
      background: DELT.colors.ink, color: '#F7F5F0', position: 'relative', overflow: 'hidden',
      paddingTop: 96,
    }}>
      {/* Subtle grid backdrop */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: `linear-gradient(${accent}33 1px, transparent 1px), linear-gradient(90deg, ${accent}33 1px, transparent 1px)`,
        backgroundSize: '64px 64px', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 96px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'start' }}>
          <div style={{ paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: DELT.font.mono, fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: accent, boxShadow: `0 0 12px ${accent}` }} />
              Quoting live · Q1 2026 book
            </div>

            <h1 style={{
              fontFamily: DELT.font.display, fontSize: 88, fontWeight: 600,
              letterSpacing: '-0.045em', color: '#F7F5F0', lineHeight: 0.96, margin: 0,
            }}>
              $5K to<br />
              <span style={{ color: accent }}>$500K.</span><br />
              By tomorrow.
            </h1>

            <p style={{ fontFamily: DELT.font.body, fontSize: 18, lineHeight: 1.55, color: '#C9C6D1', marginTop: 24, maxWidth: 460 }}>
              Price a deal now — three fields, no email required. Live factor rates off our actual Q1 book. Soft-pull only.
            </p>

            <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#2B2A35', border: '1px solid #2B2A35', borderRadius: 10, overflow: 'hidden', maxWidth: 520 }}>
              {DeltContent.stats.map(s => (
                <div key={s.l} style={{ background: DELT.colors.ink, padding: '18px 20px' }}>
                  <div style={{ fontFamily: DELT.font.display, fontSize: 26, fontWeight: 600, color: '#F7F5F0', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                  <div style={{ fontFamily: DELT.font.body, fontSize: 11.5, color: '#9E9BA8', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline live calculator, styled for dark bg */}
          <div style={{
            background: '#F7F5F0', borderRadius: 14, padding: 8,
            boxShadow: `0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px ${accent}33`,
          }}>
            <div style={{ padding: '14px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: DELT.colors.inkMute }}>Live calculator</div>
              <div style={{ fontFamily: DELT.font.mono, fontSize: 11, color: accent, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: accent, boxShadow: `0 0 6px ${accent}` }} /> 60 SEC
              </div>
            </div>
            <DeltCalculator compact calcState={calcState} setCalcState={setCalcState} onApply={onApply} themeAccent={accent} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 80, paddingTop: 32, borderTop: '1px solid #2B2A35', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: DELT.font.body, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6A6876' }}>Funded by Delt</span>
          {['La Rosa Restaurant', 'Rosario Construction', 'Bloom Beauty', 'Williams Logistics', 'Ward Market', 'Roberts Auto'].map(n => (
            <span key={n} style={{ fontFamily: DELT.font.display, fontSize: 15, color: '#9E9BA8', fontWeight: 500, letterSpacing: '-0.01em' }}>{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
V3Hero.calcInline = true;

function Variation3() {
  const hero = (props) => <V3Hero {...props} />;
  hero.calcInline = true;
  return <DeltApp
    accent={DELT.colors.indigo}
    chrome={V3Chrome}
    hero={hero} />;
}

Object.assign(window, { Variation3, V3Chrome, V3Hero });
