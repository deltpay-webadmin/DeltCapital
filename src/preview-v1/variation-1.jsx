// Variation 1 — "Ledger" — editorial hero with video centerpiece.
// Dark-gradient hero section to match the floating-card/dock video.
// Left: oversized display type + CTAs. Right: video, bleeding to the edge.
import React from 'react';
import heroVideo from './assets/hero.mp4';
import { DELT, Btn, Arr } from './shared';
import { FooterBlock, ApplicationFlow } from './app';
import {
  V1, v1H2, V1Eyebrow, V1StatsSection, V1CompareSection,
  V1FAQSection, V1CTASection, V1UseCasesSection,
} from './variation-1-sections';
import { V1CalculatorPage, V1CalcAnalyzer } from './variation-1-calculator';
import { HowItWorksPage } from './variation-1-howitworks';
import { V1AboutPage } from './variation-1-about';
import { V1ReviewsPage } from './variation-1-reviews';
import { V1BookingPage } from './variation-1-booking';

// V1CalcSection lives here (not in variation-1-sections.jsx) so that
// V1CalcAnalyzer can be imported without a circular dep between
// sections.jsx and variation-1-calculator.jsx (the latter declares module-
// level constants that read V1.*, which would hit TDZ on a cycle).
function V1CalcSection({ calcState, setCalcState, onApply }) {
  return (
    <section data-v1-calc style={{ background: V1.bg, padding: '96px 0' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', marginBottom: 48 }}>
          <div>
            <V1Eyebrow>Live calculator</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>Price the deal<br />before you apply.</h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.6, color: V1.text,
            margin: 0, maxWidth: 460, justifySelf: 'end',
          }}>
            Same underwriting logic that runs on every Delt application. Numbers
            update as you type.
          </p>
        </div>
        <V1CalcAnalyzer onApply={onApply} hideHeader />
      </div>
    </section>
  );
}

function V1Ticker({ accent }) {
  const rows = [
    ['LA ROSA REST.', '$110K', '1.16×', 'CLOSED'],
    ['ROSARIO CON.', '$180K', '1.14×', 'WIRED'],
    ['BLOOM BTY.', '$65K', '1.19×', 'FUNDED'],
    ['WILLIAMS LOG.', '$80K', '1.17×', 'CLOSED'],
    ['WARD MKT.', '$50K', '1.18×', 'WIRED'],
    ['ROBERTS AUTO', '$95K', '1.15×', 'FUNDED'],
    ['NORTHGATE CAFE', '$42K', '1.20×', 'APPRVD'],
    ['SILVER FORK', '$220K', '1.13×', 'WIRED'],
  ];
  const all = [...rows, ...rows];
  return (
    <div style={{ background: '#000', color: '#E9E7DF', padding: '6px 0', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{
        display: 'flex', gap: 40, whiteSpace: 'nowrap',
        animation: 'v1ticker 40s linear infinite', fontFamily: DELT.font.mono, fontSize: 11.5,
      }}>
        {all.map((row, i) => (
          <span key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ color: 'rgba(233,231,223,0.5)' }}>{row[0]}</span>
            <span>{row[1]}</span>
            <span style={{ color: accent }}>{row[2]}</span>
            <span style={{ color: DELT.colors.ok, fontSize: 10 }}>● {row[3]}</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes v1ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

function V1Chrome({ page, navTo, accent, openApp }) {
  const links = [
    { k: 'how',     l: 'How It Works' },
    { k: 'calc',    l: 'Calculator' },
    { k: 'about',   l: 'About' },
    { k: 'reviews', l: 'Operators' },
    { k: 'talk',    l: 'Talk' },
  ];
  const handleNav = (k) => { navTo(k); };
  return (
    <>
    <V1Ticker accent={accent} />
    <header style={{
      background: DELT.colors.ink,
      borderBottom: `1px solid rgba(255,255,255,0.08)`,
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navTo('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 0, fontFamily: DELT.font.display, fontWeight: 600, fontSize: 20, letterSpacing: '-0.03em', color: '#F7F5F0' }}>
          Delt<span style={{ color: accent }}>.</span>
        </div>
        <nav style={{ display: 'flex', gap: 28 }}>
          {links.map(ln => (
            <a key={ln.k} onClick={() => handleNav(ln.k)} style={{
              fontFamily: DELT.font.body, fontSize: 13.5,
              color: page === ln.k ? '#F7F5F0' : 'rgba(247,245,240,0.65)',
              fontWeight: page === ln.k ? 500 : 400, cursor: 'pointer', paddingBottom: 2,
              borderBottom: page === ln.k ? `1px solid #F7F5F0` : '1px solid transparent',
            }}>{ln.l}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a style={{ fontFamily: DELT.font.body, fontSize: 13.5, color: 'rgba(247,245,240,0.75)', cursor: 'pointer' }}>Login</a>
          <Btn variant="indigo" size="sm" onClick={openApp} style={{ background: accent, borderColor: accent }}>Get Funded</Btn>
        </div>
      </div>
    </header>
    </>
  );
}
V1Chrome.brand = (
  <div style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 22, color: '#F7F5F0', letterSpacing: '-0.03em' }}>
    Delt<span style={{ color: DELT.colors.indigo }}>.</span>
  </div>
);

function V1Hero({ accent, onApply }) {
  return (
    <section style={{
      background: '#0B0820',
      color: '#F7F5F0',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Dateline */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '20px 32px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: DELT.font.mono, fontSize: 11.5, color: 'rgba(247,245,240,0.5)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        position: 'relative', zIndex: 3,
      }}>
        <span>Vol. VII · Q1 2026</span>
        <span>Direct lender · Est. 2019</span>
        <span style={{ color: accent, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: accent, boxShadow: `0 0 10px ${accent}` }} />
          Quoting now
        </span>
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '56px 32px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
        alignItems: 'center', position: 'relative', zIndex: 2,
        minHeight: 680,
      }}>
        {/* Left: copy */}
        <div>
          <h1 style={{
            fontFamily: DELT.font.display, fontSize: 92, fontWeight: 600,
            letterSpacing: '-0.045em', color: '#F7F5F0', lineHeight: 0.95,
            margin: 0,
          }}>
            Capital,<br />
            priced the way<br />
            you'd price it{' '}
            <em style={{
              fontStyle: 'italic',
              fontFamily: '"Source Serif Pro", Georgia, serif',
              fontWeight: 400,
              color: accent,
              background: `linear-gradient(90deg, ${accent}, #A78BFA)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>yourself.</em>
          </h1>

          <p style={{
            fontFamily: DELT.font.body, fontSize: 18, lineHeight: 1.55,
            color: 'rgba(247,245,240,0.75)', margin: '32px 0 0', maxWidth: 520,
          }}>
            Revenue-based funding from <span style={{ color: '#F7F5F0', fontWeight: 500 }}>$5,000 to $500,000</span>, underwritten off deposits — not your FICO, not your collateral, not a call center's script. Median factor <span style={{ color: '#F7F5F0', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>1.18×</span>. Median time to funds, <span style={{ color: '#F7F5F0', fontWeight: 500 }}>24 hours</span>.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 36, alignItems: 'center', flexWrap: 'wrap' }}>
            <Btn variant="indigo" size="lg" onClick={onApply} style={{ background: accent, borderColor: accent }}>Start prequal <Arr /></Btn>
            <Btn variant="ghost" size="lg" style={{ background: 'transparent', color: '#F7F5F0', borderColor: 'rgba(247,245,240,0.2)' }}>See how pricing works</Btn>
          </div>

          <div style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(247,245,240,0.1)',
            display: 'flex', gap: 36, flexWrap: 'wrap',
          }}>
            {[
              ['Today\'s median', '1.18×', 'factor'],
              ['Time to funds', '24h', 'median'],
              ['Soft-pull', 'Yes', 'only'],
            ].map(([l, v, s]) => (
              <div key={l}>
                <div style={{ fontFamily: DELT.font.body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.45)' }}>{l}</div>
                <div style={{ fontFamily: DELT.font.display, fontSize: 26, fontWeight: 600, color: '#F7F5F0', letterSpacing: '-0.02em', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                  {v}
                  <span style={{ fontFamily: DELT.font.body, fontSize: 12, color: 'rgba(247,245,240,0.45)', fontWeight: 400, marginLeft: 6 }}>{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: video, bleeding to the right edge */}
        <div style={{
          position: 'relative',
          alignSelf: 'stretch',
          marginRight: -32,
          marginTop: -32,
          marginBottom: -32,
          overflow: 'hidden',
        }}>
          <video
            src={heroVideo}
            autoPlay loop muted playsInline
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Left-edge fade so video melts into the copy column */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #0B0820 0%, rgba(11,8,32,0.6) 12%, rgba(11,8,32,0) 32%)',
            pointerEvents: 'none',
          }} />
          {/* Top/bottom subtle fades to help the band read as a hero */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(11,8,32,0.25) 0%, transparent 15%, transparent 85%, rgba(11,8,32,0.4) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Floating card caption — subtle, editorial */}
          <div style={{
            position: 'absolute', bottom: 28, right: 28,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: DELT.font.mono, fontSize: 10.5, color: 'rgba(247,245,240,0.55)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>Fig. 01 — The offer, in motion</div>
            <div style={{
              width: 40, height: 1, background: 'rgba(247,245,240,0.25)',
            }} />
          </div>
        </div>
      </div>

      {/* Bottom rule with scroll cue */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '48px 32px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(247,245,240,0.08)', marginTop: 32,
        fontFamily: DELT.font.mono, fontSize: 11, color: 'rgba(247,245,240,0.45)',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        position: 'relative', zIndex: 2,
      }}>
        <span>Scroll — the numbers</span>
        <span>$200M+ deployed · 2,850+ funded · since 2019</span>
      </div>
    </section>
  );
}

// V1 has a fully bespoke home layout. We reuse DeltApp's chrome + ApplicationFlow
// but compose the body sections ourselves using the V1Section components.
function Variation1() {
  const accent = V1.blue; // Atlassian-preview blue for V1
  const [page, setPage] = React.useState('home');
  const [appOpen, setAppOpen] = React.useState(false);
  const [calcState, setCalcState] = React.useState({ revenue: 0, tib: '', cards: null, cardSales: 0 });
  const [appPrefill, setAppPrefill] = React.useState(null);

  const navTo = (p) => { setPage(p); window.scrollTo(0, 0); };
  const openApp = (c, est) => { if (est) setAppPrefill(est); setAppOpen(true); };

  const home = (
    <>
      <V1Hero accent={accent} onApply={() => openApp(null, null)} />
      <V1StatsSection />
      <V1CompareSection />
      <V1UseCasesSection />
      <V1CalcSection calcState={calcState} setCalcState={setCalcState} onApply={openApp} />
      <V1FAQSection />
      <V1CTASection onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} />
    </>
  );

  const body =
    page === 'about'   ? <V1AboutPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'how'     ? <HowItWorksPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'reviews' ? <V1ReviewsPage accent={accent} onApply={() => openApp(null, null)} onTalk={() => navTo('talk')} /> :
    page === 'calc'    ? <V1CalculatorPage accent={accent} onApply={(data) => openApp(null, data)} /> :
    page === 'talk'    ? <V1BookingPage accent={accent} onApply={() => openApp(null, null)} /> :
    home;

  return (
    <>
      {V1Chrome({ page, navTo, accent, openApp: () => openApp(null, null) })}
      {body}
      <FooterBlock accent={accent} brand={V1Chrome.brand} />
      <ApplicationFlow open={appOpen} onClose={() => setAppOpen(false)} prefill={appPrefill} accent={accent} />
    </>
  );
}

export { Variation1, V1Chrome, V1Hero };
