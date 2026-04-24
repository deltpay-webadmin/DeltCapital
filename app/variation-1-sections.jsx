// V1-specific sections — Atlassian-preview aesthetic.
// Palette: #f6f9fc canvas · #041E42 ink · #0c66e4 blue · #1F845A green
//          #c9372c red · #697386 muted · #dcdfe4 hairline · #85B8FF on-dark blue
// Typography: serif-ish display (tight -0.035em), mono eyebrows w/ 0.18em tracking,
//             horizontal rule prefix before every eyebrow label.

const V1 = {
  bg:       '#f6f9fc',
  bgWarm:   '#f1f2f4',
  ink:      '#041E42',
  muted:    '#697386',
  text:     '#425466',
  line:     '#dcdfe4',
  // Indigo family
  blue:     '#4945FF', // Electric Indigo (brand §3.1)
  blueSoft: '#A5B4FC', // on-dark soft accent (derived)
  green:    '#1F845A',
  red:      '#c9372c',
  white:    '#ffffff',
  fontDisplay: '"Codec Pro", "Manrope", "Inter Tight", "Söhne", ui-sans-serif, system-ui, sans-serif',
  fontBody:    '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono:    '"JetBrains Mono", ui-monospace, Menlo, monospace',
};

// ─── Eyebrow label (mono, uppercase, short rule prefix) ───
function V1Eyebrow({ children, color = V1.blue, onDark = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      textTransform: 'uppercase',
      fontFamily: V1.fontMono, fontSize: 11.5, fontWeight: 600,
      letterSpacing: '0.18em',
      color: color,
    }}>
      <span aria-hidden style={{ display: 'inline-block', width: 16, height: 1, background: color }} />
      {children}
    </span>
  );
}

const v1H2 = {
  fontFamily: V1.fontDisplay,
  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
  fontWeight: 600,
  letterSpacing: '-0.035em',
  lineHeight: 1.05,
  color: V1.ink,
  margin: 0,
};

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// COMPARE — sleek modern side-by-side with animated delta bars
// ═══════════════════════════════════════════════════════════════
function V1CompareSection() {
  const [visible, setVisible] = React.useState(false);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Rich per-row data — each row has a numeric delta we can visualize
  // deltStrength = 0..1 (how much Delt wins on this metric)
  const rows = [
    { k: 'Speed to funds',     delt: '24 hours',       bank: '2–6 weeks',          win: '20× faster',    strength: 0.98 },
    { k: 'Factor rate',        delt: '1.18×',          bank: '1.35–1.49×',         win: '19% cheaper',   strength: 0.75 },
    { k: 'Paperwork',          delt: 'Plaid link',     bank: '3 mo statements + returns', win: 'Zero files', strength: 0.92 },
    { k: 'Credit pull',        delt: 'Soft inquiry',   bank: 'Hard pull',          win: 'No FICO hit',   strength: 0.88 },
    { k: 'Collateral',         delt: 'None',           bank: 'PG + UCC',           win: 'Unencumbered',  strength: 0.95 },
    { k: 'Prepayment penalty', delt: 'None',           bank: 'Full factor owed',   win: 'Early pays save', strength: 1.00 },
  ];

  return (
    <section ref={sectionRef} style={{ background: V1.bg, padding: '120px 0', borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        {/* Heading */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', marginBottom: 56 }}>
          <div>
            <V1Eyebrow>Banks vs Delt</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>
              Why Delt beats<br/>the bank.
            </h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.6, color: V1.text,
            margin: 0, maxWidth: 460, justifySelf: 'end',
          }}>
            Every row is a median across the last 12 months of our book, measured
            against publicly-reported bank SBA 7(a) averages. Updated quarterly.
          </p>
        </div>

        {/* ─── Unified comparison frame ─── */}
        <div style={{
          background: V1.white,
          border: `1px solid ${V1.line}`,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(10,37,64,0.03), 0 40px 80px -50px rgba(10,37,64,0.22)',
        }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            background: V1.bg,
            borderBottom: `1px solid ${V1.line}`,
          }}>
            <div style={{ padding: '22px 28px' }}>
              <V1Eyebrow color={V1.muted}>Metric</V1Eyebrow>
            </div>
            <div style={{
              padding: '22px 28px', borderLeft: `1px solid ${V1.line}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: V1.muted + '18', color: V1.muted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* Bank icon */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 14h12M3 14V8M6 14V8M10 14V8M13 14V8M1.5 7h13L8 2 1.5 7z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 600, color: V1.muted, letterSpacing: '-0.015em' }}>
                  Traditional bank
                </div>
                <div style={{ fontFamily: V1.fontMono, fontSize: 10.5, color: V1.muted, opacity: 0.7, marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  SBA 7(a) median
                </div>
              </div>
            </div>
            <div style={{
              padding: '22px 28px', borderLeft: `1px solid ${V1.line}`,
              display: 'flex', alignItems: 'center', gap: 12,
              background: `linear-gradient(90deg, ${V1.blue}0A, transparent)`,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 12px ${V1.blue}55`,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M8 1L2 8h4l-1 5 6-7H7l1-5z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 700, color: V1.ink, letterSpacing: '-0.015em' }}>
                  Delt<span style={{ color: V1.blue }}>.</span>
                </div>
                <div style={{ fontFamily: V1.fontMono, fontSize: 10.5, color: V1.blue, opacity: 0.85, marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Live book · Q4 trailing
                </div>
              </div>
            </div>
          </div>

          {/* Rows */}
          {rows.map((r, i) => (
            <V1CompareRow key={r.k} r={r} i={i} visible={visible} last={i === rows.length - 1} />
          ))}
        </div>

        {/* Result strip below */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Median time to funds',     value: '24 h',   sub: 'vs 2–6 weeks at a bank' },
            { label: 'Avg savings vs SBA',       value: '19%',    sub: 'on total cost of capital' },
            { label: 'Paperwork required',       value: '0',      sub: 'Plaid replaces the file box' },
          ].map((s, i) => (
            <div key={i} style={{
              background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 16,
              padding: '22px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <div>
                <div style={{
                  textTransform: 'uppercase', color: V1.muted,
                  fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.18em',
                }}>{s.label}</div>
                <div style={{
                  marginTop: 8,
                  fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 700,
                  letterSpacing: '-0.03em', color: V1.ink,
                  fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>{s.value}</div>
                <div style={{ marginTop: 6, fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted }}>
                  {s.sub}
                </div>
              </div>
              <span aria-hidden style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${V1.blue}0F`, color: V1.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: V1.fontMono, fontWeight: 700, fontSize: 18,
              }}>
                {i === 0 ? '⚡' : i === 1 ? '−' : '⊘'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Individual comparison row with animated fill-in ───
function V1CompareRow({ r, i, visible, last }) {
  const delay = 100 + i * 120;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr 1fr',
      borderBottom: last ? 'none' : `1px solid ${V1.line}`,
      minHeight: 88,
    }}>
      {/* Metric label */}
      <div style={{
        padding: '22px 28px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
        }}>
          0{i + 1}
        </div>
        <div style={{
          marginTop: 4,
          fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600,
          color: V1.ink, letterSpacing: '-0.015em', lineHeight: 1.2,
        }}>
          {r.k}
        </div>
      </div>

      {/* Bank column */}
      <div style={{
        padding: '22px 28px',
        borderLeft: `1px solid ${V1.line}`,
        display: 'flex', alignItems: 'center', gap: 14, position: 'relative',
      }}>
        <span style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: 999,
          background: V1.muted + '18', color: V1.muted,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 14 14">
            <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </span>
        <div style={{
          fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 500,
          color: V1.muted, letterSpacing: '-0.015em', lineHeight: 1.2,
          fontVariantNumeric: 'tabular-nums',
          textDecoration: 'line-through', textDecorationColor: V1.muted + '66',
          textDecorationThickness: 1,
        }}>
          {r.bank}
        </div>
      </div>

      {/* Delt column */}
      <div style={{
        padding: '22px 28px',
        borderLeft: `1px solid ${V1.line}`,
        background: `linear-gradient(90deg, ${V1.blue}06, transparent 70%)`,
        display: 'flex', alignItems: 'center', gap: 14, position: 'relative',
      }}>
        <span style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: 999,
          background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`, color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 3px 10px ${V1.blue}66`,
        }}>
          <svg width="11" height="11" viewBox="0 0 14 14">
            <path d="M3 7.2L5.8 10 11 4.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <div style={{
          flex: 1, minWidth: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700,
            color: V1.ink, letterSpacing: '-0.02em', lineHeight: 1.2,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {r.delt}
          </div>
          <span style={{
            flexShrink: 0,
            padding: '4px 10px', borderRadius: 999,
            background: `${V1.blue}14`, color: V1.blue,
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {r.win}
          </span>
        </div>

        {/* Animated strength bar */}
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0,
          height: 2, width: visible ? `${r.strength * 100}%` : '0%',
          background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
          transition: `width 1200ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEPS — editorial numbered list, hairline dividers
// ═══════════════════════════════════════════════════════════════
function V1StepsSection() {
  const steps = DeltContent.steps;
  return (
    <section style={{ background: V1.white, padding: '96px 0', borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', marginBottom: 64 }}>
          <div>
            <V1Eyebrow>How it works</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>Four steps.<br />One business day.</h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.6, color: V1.text,
            margin: 0, maxWidth: 520, justifySelf: 'end',
          }}>
            No sales advisor, no discovery call, no underwriter asking for "just one more statement."
            We read your deposits, price the deal, send an offer.
          </p>
        </div>

        {/* Steps list — wide rows with numeric column, content, and timing column */}
        <div style={{ borderTop: `1px solid ${V1.line}` }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 240px',
              gap: 48, alignItems: 'center',
              padding: '40px 0',
              borderBottom: `1px solid ${V1.line}`,
            }}>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 12.5, fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: V1.blue,
              }}>
                Step {s.n}
              </div>
              <div>
                <div style={{
                  fontFamily: V1.fontDisplay, fontSize: 28, fontWeight: 600,
                  letterSpacing: '-0.025em', color: V1.ink, lineHeight: 1.15,
                }}>{s.t}</div>
                <div style={{
                  marginTop: 10, fontFamily: V1.fontBody, fontSize: 15.5, lineHeight: 1.6,
                  color: V1.text, maxWidth: 620,
                }}>{s.d}</div>
              </div>
              <div style={{ borderLeft: `1px solid ${V1.line}`, paddingLeft: 24 }}>
                <div style={{
                  textTransform: 'uppercase', color: V1.muted,
                  fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.18em',
                }}>Elapsed</div>
                <div style={{
                  marginTop: 6, fontFamily: V1.fontDisplay, fontSize: 24, fontWeight: 600,
                  letterSpacing: '-0.02em', color: V1.ink, fontVariantNumeric: 'tabular-nums',
                }}>{s.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CALCULATOR — Atlassian-styled wrapper around the shared DeltCalculator
// ═══════════════════════════════════════════════════════════════
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

        {/* Rich analyzer — progressive reveal, Delt Boost toggle, custom amount */}
        <V1CalcAnalyzer onApply={onApply} hideHeader />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// REVIEWS — mono eyebrow per card, editorial
// ═══════════════════════════════════════════════════════════════
function V1ReviewsSection() {
  const items = DeltContent.testimonials;
  return (
    <section style={{ background: V1.white, padding: '96px 0', borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', marginBottom: 56 }}>
          <div>
            <V1Eyebrow>Operators</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>Verified on the renewal call.</h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.6, color: V1.text,
            margin: 0, maxWidth: 480, justifySelf: 'end',
          }}>
            Every quote is from a borrower who has closed at least once. Business
            names are real, on request.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {items.map((t, i) => (
            <figure key={i} style={{
              background: V1.bg, border: `1px solid ${V1.line}`, borderRadius: 20,
              padding: 28, margin: 0, display: 'flex', flexDirection: 'column', gap: 20,
              minHeight: 240,
            }}>
              <V1Eyebrow color={V1.blue}>{t.b.split(' ')[0]}</V1Eyebrow>
              <blockquote style={{
                fontFamily: V1.fontDisplay, fontSize: 19, fontWeight: 500,
                letterSpacing: '-0.015em', lineHeight: 1.4, color: V1.ink, margin: 0, flex: 1,
              }}>"{t.q}"</blockquote>
              <figcaption style={{
                display: 'flex', justifyContent: 'space-between', gap: 12,
                borderTop: `1px solid ${V1.line}`, paddingTop: 16,
                fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted,
              }}>
                <div>
                  <div style={{ color: V1.ink, fontWeight: 500 }}>{t.n}</div>
                  <div>{t.b}</div>
                </div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontFamily: V1.fontMono }}>
                  <div style={{ color: V1.blue, fontWeight: 600 }}>{t.f}</div>
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

// ═══════════════════════════════════════════════════════════════
// FAQ — hairline accordion
// ═══════════════════════════════════════════════════════════════
function V1FAQSection() {
  const [open, setOpen] = React.useState(0);
  return (
    <section style={{ background: V1.bg, padding: '96px 0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ marginBottom: 48 }}>
          <V1Eyebrow>Questions</V1Eyebrow>
          <h2 style={{ ...v1H2, marginTop: 18 }}>What operators actually ask.</h2>
        </div>
        <div style={{ borderTop: `1px solid ${V1.line}` }}>
          {DeltContent.faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: `1px solid ${V1.line}` }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                  width: '100%', padding: '24px 0', background: 'transparent', border: 'none',
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 24, textAlign: 'left',
                  fontFamily: V1.fontDisplay, fontSize: 19, fontWeight: 500,
                  color: V1.ink, letterSpacing: '-0.01em',
                }}>
                  {f.q}
                  <span style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 999,
                    border: `1px solid ${V1.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: V1.blue, fontFamily: V1.fontMono, fontSize: 16,
                    transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform .2s',
                  }}>+</span>
                </button>
                {isOpen && (
                  <div style={{
                    paddingBottom: 24, fontFamily: V1.fontBody, fontSize: 15, lineHeight: 1.65,
                    color: V1.text, maxWidth: 760,
                  }}>{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CTA — final push, navy band
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// CTA — closing spread, editorial: oversized "60s", animated timeline
// ═══════════════════════════════════════════════════════════════
function V1CTASection({ onApply, onTalk }) {
  const [secRef, inView] = useV1InView(0.2, '0px 0px -40px 0px');
  const [hoverPrimary, setHoverPrimary] = React.useState(false);
  const [hoverGhost, setHoverGhost]     = React.useState(false);
  const steps = [
    { n: '01', t: 'NOW',       d: 'Soft pull · 3 questions'  },
    { n: '02', t: '60s',       d: 'A real funding range'      },
    { n: '03', t: 'SAME DAY',  d: 'Single-page offer'         },
    { n: '04', t: '+24h',      d: 'Money wired'               },
  ];

  return (
    <section ref={secRef} style={{
      background: V1.ink, color: '#fff',
      padding: '100px 0 96px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient indigo bloom — subtle, decorative */}
      <div aria-hidden style={{
        position: 'absolute', top: -240, right: -200, width: 640, height: 640,
        background: `radial-gradient(circle, ${V1.blue}22 0%, transparent 60%)`,
        filter: 'blur(24px)', pointerEvents: 'none',
        opacity: inView ? 1 : 0,
        transition: 'opacity 1400ms ease-out 200ms',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -280, left: -180, width: 520, height: 520,
        background: `radial-gradient(circle, #818CF81A 0%, transparent 60%)`,
        filter: 'blur(24px)', pointerEvents: 'none',
        opacity: inView ? 1 : 0,
        transition: 'opacity 1400ms ease-out 400ms',
      }} />

      {/* Corner marker — volume / dateline */}
      <div style={{
        position: 'absolute', top: 28, right: 40,
        fontFamily: V1.fontMono, fontSize: 11, letterSpacing: '0.18em',
        color: 'rgba(255,255,255,0.42)', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 10,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(12px)',
        transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 80ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 80ms',
      }}>
        Vol. VII · Closing
        <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.32)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
        {/* Eyebrow */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 40ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 40ms',
        }}>
          <V1Eyebrow color={V1.blueSoft}>Final word</V1Eyebrow>
        </div>

        {/* Headline row: big copy left, oversized "60s" card right */}
        <div style={{
          marginTop: 32,
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: 72,
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{
              fontFamily: V1.fontDisplay,
              fontSize: 'clamp(2.6rem, 5.4vw, 4.6rem)',
              fontWeight: 600, lineHeight: 1.02, letterSpacing: '-0.04em',
              color: '#fff', margin: 0, maxWidth: 680,
            }}>
              <V1LineMask ready={inView} delay={120} duration={900}>Ready when your</V1LineMask>
              <V1LineMask ready={inView} delay={240} duration={900}>
                business is.
              </V1LineMask>
            </h2>
            <p style={{
              fontFamily: V1.fontBody, fontSize: 17.5, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)', margin: '28px 0 0', maxWidth: 540,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 520ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 520ms',
            }}>
              Three questions, a soft pull, and a real funding range.
              No obligation. No impact to your credit.
            </p>
          </div>

          {/* Oversized "60s" focal card */}
          <div style={{
            position: 'relative',
            padding: '38px 36px 32px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 22,
            background: `linear-gradient(155deg, ${V1.blue}24 0%, ${V1.blue}0a 45%, rgba(255,255,255,0) 100%)`,
            backdropFilter: 'blur(4px)',
            textAlign: 'center',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.97)',
            transition: 'opacity 900ms cubic-bezier(0.22,1,0.36,1) 320ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 320ms',
          }}>
            {/* Tiny corner marker */}
            <div style={{
              position: 'absolute', top: 14, left: 16,
              fontFamily: V1.fontMono, fontSize: 10, letterSpacing: '0.18em',
              color: V1.blueSoft, textTransform: 'uppercase', opacity: 0.7,
            }}>
              median
            </div>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'center',
              fontFamily: V1.fontDisplay,
              fontSize: 132, fontWeight: 700,
              lineHeight: 1, letterSpacing: '-0.06em',
              color: '#fff', fontVariantNumeric: 'tabular-nums',
            }}>
              <V1CountUp value="60" duration={1600} start={380} />
              <span style={{
                fontSize: 64, fontWeight: 600, letterSpacing: '-0.04em',
                color: V1.blueSoft, marginLeft: 6,
              }}>s</span>
            </div>
            <div style={{
              marginTop: 10,
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
            }}>
              From click → a real range
            </div>
          </div>
        </div>

        {/* CTA row — editorial buttons */}
        <div style={{
          marginTop: 64,
          display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 700ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 700ms',
        }}>
          <button
            onClick={onApply}
            onMouseEnter={() => setHoverPrimary(true)}
            onMouseLeave={() => setHoverPrimary(false)}
            style={{
              position: 'relative', overflow: 'hidden',
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: V1.blue, color: '#fff', border: 'none',
              padding: '16px 26px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontBody, fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.005em',
              boxShadow: hoverPrimary
                ? `0 12px 28px -10px ${V1.blue}cc, 0 2px 6px ${V1.blue}44`
                : `0 6px 18px -8px ${V1.blue}aa`,
              transform: hoverPrimary ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'background 180ms, box-shadow 240ms, transform 240ms',
            }}
          >
            {/* Sheen sweep on hover */}
            <span aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
              transform: hoverPrimary ? 'translateX(120%)' : 'translateX(-120%)',
              transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
            }} />
            Get Funded
            <svg width="15" height="15" viewBox="0 0 14 14" style={{
              transform: hoverPrimary ? 'translateX(3px)' : 'translateX(0)',
              transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}>
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {onTalk && (
            <button
              onClick={onTalk}
              onMouseEnter={() => setHoverGhost(true)}
              onMouseLeave={() => setHoverGhost(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: hoverGhost ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: '#fff',
                border: `1px solid ${hoverGhost ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.22)'}`,
                padding: '15px 24px', borderRadius: 10, cursor: 'pointer',
                fontFamily: V1.fontBody, fontSize: 15, fontWeight: 500,
                transition: 'background 220ms, border-color 220ms',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1.5" y="2.5" width="11" height="9" rx="1.5"/>
                <path d="M4 1v2M10 1v2M1.5 5.5h11"/>
              </svg>
              Talk to an underwriter
              <span style={{
                opacity: hoverGhost ? 1 : 0,
                transform: hoverGhost ? 'translateX(0)' : 'translateX(-4px)',
                transition: 'opacity 220ms, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'inline-flex', alignItems: 'center',
              }}>→</span>
            </button>
          )}
          <span style={{
            fontFamily: V1.fontMono, fontSize: 11, letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase',
            marginLeft: 8,
          }}>
            Soft-pull · No obligation
          </span>
        </div>

        {/* Separator eyebrow for timeline */}
        <div style={{
          marginTop: 88,
          display: 'flex', alignItems: 'center', gap: 14,
          opacity: inView ? 1 : 0,
          transition: 'opacity 700ms ease-out 800ms',
        }}>
          <span style={{ width: 18, height: 1, background: V1.blueSoft }} />
          <span style={{
            fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: V1.blueSoft,
          }}>
            The arc — click to wire
          </span>
        </div>

        {/* Timeline: horizontal progress rail + 4 dotted steps */}
        <div style={{ position: 'relative', marginTop: 36, paddingTop: 16 }}>
          {/* Base rail */}
          <div style={{
            position: 'absolute',
            top: 20, left: 'calc(12.5% - 4px)', right: 'calc(12.5% - 4px)',
            height: 1, background: 'rgba(255,255,255,0.1)',
          }} />
          {/* Filled rail (left → right draw) */}
          <div style={{
            position: 'absolute',
            top: 20, left: 'calc(12.5% - 4px)',
            height: 1,
            background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
            width: inView ? 'calc(75% + 8px)' : '0%',
            transition: 'width 1500ms cubic-bezier(0.22, 1, 0.36, 1) 900ms',
          }} />

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
            position: 'relative',
          }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', padding: '0 12px',
              }}>
                {/* Node dot with halo */}
                <span style={{ position: 'relative', height: 24, width: 24, marginBottom: 20 }}>
                  <span style={{
                    position: 'absolute', left: '50%', top: 8,
                    width: 10, height: 10, marginLeft: -5,
                    borderRadius: 999,
                    background: V1.blue,
                    boxShadow: `0 0 0 4px rgba(73,69,255,0.2)`,
                    transform: inView ? 'scale(1)' : 'scale(0)',
                    transition: `transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${1100 + i * 160}ms`,
                  }} />
                </span>
                <div style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${1200 + i * 160}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${1200 + i * 160}ms`,
                }}>
                  <div style={{
                    fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: V1.blueSoft, marginBottom: 8,
                  }}>
                    Step {s.n}
                  </div>
                  <div style={{
                    fontFamily: V1.fontDisplay, fontSize: 26, fontWeight: 700,
                    letterSpacing: '-0.025em', color: '#fff',
                    fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                    marginBottom: 8,
                  }}>
                    {s.t}
                  </div>
                  <div style={{
                    fontFamily: V1.fontBody, fontSize: 14, lineHeight: 1.45,
                    color: 'rgba(255,255,255,0.68)',
                  }}>
                    {s.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// USE CASES — tabbed left rail + dashboard visualization right panel
// ═══════════════════════════════════════════════════════════════
const USE_CASES = [
  {
    k: 'equipment',
    label: 'Equipment & Technology',
    icon: 'wrench',
    blurb: 'Upgrade machinery, purchase new equipment, or invest in technology that improves efficiency.',
    metric: { funding: '$45K', approval: '24 hrs', roi: '+38%' },
    stat: { label: 'Avg. equipment investment', value: '$45K' },
    insight: 'Businesses that invest in equipment upgrades see an average 38% productivity increase within the first 6 months of deployment.',
    breakdown: [
      { name: 'Machinery',   pct: 35 },
      { name: 'Software',    pct: 25 },
      { name: 'Hardware',    pct: 20 },
      { name: 'Maintenance', pct: 12 },
      { name: 'Training',    pct:  8 },
    ],
  },
  {
    k: 'vendor',
    label: 'Vendor Payments',
    icon: 'receipt',
    blurb: 'Pay suppliers on time, negotiate early-pay discounts, and keep your supply chain running smoothly.',
    metric: { funding: '$62K', approval: '24 hrs', roi: '+12%' },
    stat: { label: 'Avg. early-pay discount captured', value: '2.1%' },
    insight: 'Operators who take 2/10 net 30 discounts with Delt capital effectively earn 36% APY on their float.',
    breakdown: [
      { name: 'Raw materials',   pct: 42 },
      { name: 'Logistics',       pct: 22 },
      { name: 'Utilities',       pct: 15 },
      { name: 'Service vendors', pct: 13 },
      { name: 'SaaS tools',      pct:  8 },
    ],
  },
  {
    k: 'payroll',
    label: 'Payroll & Hiring',
    icon: 'users',
    blurb: 'Meet payroll during slow weeks, onboard new hires, and cover recruiting costs without stress.',
    metric: { funding: '$38K', approval: '24 hrs', roi: '+22%' },
    stat: { label: 'Avg. per-hire ramp cost', value: '$8.4K' },
    insight: 'Teams that fund hiring through Delt close roles 2.3 weeks faster than those waiting on retained cash flow.',
    breakdown: [
      { name: 'Salaries',    pct: 54 },
      { name: 'Benefits',    pct: 18 },
      { name: 'Recruiting',  pct: 12 },
      { name: 'Onboarding',  pct: 10 },
      { name: 'Contractors', pct:  6 },
    ],
  },
  {
    k: 'expansion',
    label: 'Business Expansion',
    icon: 'building',
    blurb: 'Open a new location, expand capacity, or enter a new market with capital that moves at your pace.',
    metric: { funding: '$120K', approval: '48 hrs', roi: '+54%' },
    stat: { label: 'Avg. new-location payback', value: '11 mo' },
    insight: 'Multi-unit operators funded through Delt hit break-even on new locations 4 months faster than industry average.',
    breakdown: [
      { name: 'Build-out',   pct: 38 },
      { name: 'Lease & CAM', pct: 22 },
      { name: 'Opening inv.', pct: 18 },
      { name: 'Marketing',   pct: 14 },
      { name: 'Permits',     pct:  8 },
    ],
  },
  {
    k: 'inventory',
    label: 'Inventory & Stock',
    icon: 'box',
    blurb: 'Stock up for peak season, negotiate bulk pricing, and keep shelves full when demand spikes.',
    metric: { funding: '$85K', approval: '24 hrs', roi: '+28%' },
    stat: { label: 'Avg. bulk-buy savings', value: '14%' },
    insight: 'Retailers who pre-stock with Delt capture 2.8× more peak-season revenue than those ordering reactively.',
    breakdown: [
      { name: 'Core SKUs',      pct: 48 },
      { name: 'Seasonal',       pct: 22 },
      { name: 'New products',   pct: 14 },
      { name: 'Packaging',      pct: 10 },
      { name: 'Safety stock',   pct:  6 },
    ],
  },
  {
    k: 'marketing',
    label: 'Marketing Campaigns',
    icon: 'megaphone',
    blurb: 'Fund ad spend, creative production, and launches that have a clear revenue payback.',
    metric: { funding: '$28K', approval: '24 hrs', roi: '+3.2× ROAS' },
    stat: { label: 'Median campaign ROAS', value: '3.2×' },
    insight: 'Brands that scale winning campaigns with Delt grow 47% faster than those constrained by retained earnings.',
    breakdown: [
      { name: 'Paid social',  pct: 38 },
      { name: 'Search',       pct: 24 },
      { name: 'Creative',     pct: 16 },
      { name: 'Influencer',   pct: 12 },
      { name: 'Email / SMS',  pct: 10 },
    ],
  },
];

// Indigo ramp for budget bars
const UC_COLORS = ['#3730A3', '#4945FF', '#6366F1', '#818CF8', '#1F845A'];

// Inline icon set for the left rail
function UCIcon({ name, size = 16, color = 'currentColor' }) {
  const c = { stroke: color, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    wrench:   <path d="M10.5 2.5a3.5 3.5 0 014.6 4.6L8 14.2 1.8 8 8.9 0.9a3.5 3.5 0 011.6 1.6z" transform="translate(0,0)" />,
    receipt:  <><path d="M3 1.5v13l2-1 2 1 2-1 2 1 2-1 2 1v-13z"/><path d="M5.5 5h5M5.5 8h5M5.5 11h3"/></>,
    users:    <><circle cx="6" cy="6" r="2.5"/><circle cx="11.5" cy="6.5" r="2"/><path d="M1.5 13.5a4.5 4.5 0 019 0M10 13.5a3.5 3.5 0 014.5 0"/></>,
    building: <><path d="M2.5 14V3l5-1.5V14M7.5 14V6l5 1.5V14M1 14h14"/><path d="M4 5.5h1.5M4 8h1.5M4 10.5h1.5M9.5 9h1.5M9.5 11h1.5"/></>,
    box:      <><path d="M8 1.5l6 2.5v7L8 14.5 2 11V4z"/><path d="M2 4l6 2.5 6-2.5M8 6.5V14"/></>,
    megaphone:<><path d="M2 6v4l7 3V3zM9 4l4-1.5v11L9 12M2 10v2.5h2L5 10"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={c}>
      {paths[name]}
    </svg>
  );
}

// Flips ready→true one frame after mount so siblings can key off a
// state change for their enter transition. Use with key={active} on a
// parent to replay animations every category switch.
function useUCReady() {
  const [r, setR] = React.useState(false);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setR(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return r;
}

// Horizontal progressive bar. Width grows from 0 → pct/max on ready flip.
function UCBar({ label, pct, max, color, delay = 0, ready }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '140px 1fr 48px',
      alignItems: 'center', gap: 16,
    }}>
      <span style={{
        fontFamily: V1.fontBody, fontSize: 14, color: V1.ink,
        opacity: ready ? 1 : 0,
        transform: ready ? 'translate3d(0,0,0)' : 'translate3d(-6px,0,0)',
        transition: `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}>{label}</span>
      <span style={{
        position: 'relative', height: 10,
        background: V1.line, borderRadius: 999, overflow: 'hidden',
      }}>
        <span style={{
          position: 'absolute', inset: 0,
          width: ready ? `${(pct / max) * 100}%` : '0%',
          background: color,
          borderRadius: 999,
          transition: `width 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 80}ms`,
          willChange: 'width',
        }} />
      </span>
      <span style={{
        textAlign: 'right',
        fontFamily: V1.fontMono, fontSize: 13, fontWeight: 600,
        color: V1.muted, fontVariantNumeric: 'tabular-nums',
        opacity: ready ? 1 : 0,
        transition: `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 350}ms`,
      }}>{pct}%</span>
    </div>
  );
}

// Inner pane that remounts on every category change so its animations replay.
function V1UseCasePane({ uc, active }) {
  const ready = useUCReady();
  const max = Math.max(...uc.breakdown.map(d => d.pct));
  const stats = [
    { label: 'Avg. funding',  value: uc.metric.funding },
    { label: 'Approval time', value: uc.metric.approval },
    { label: 'ROI increase',  value: uc.metric.roi, arrow: true },
  ];
  const enterFade = (delay) => ({
    opacity: ready ? 1 : 0,
    transform: ready ? 'translate3d(0,0,0)' : 'translate3d(0, 8px, 0)',
    transition: `opacity 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return (
    <div>
      {/* Chapter marker */}
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.blue,
        marginBottom: 14,
        ...enterFade(0),
      }}>
        Ch. {String(active + 1).padStart(2, '0')} — Where it goes
      </div>

      {/* Oversized chapter title with line-mask reveal */}
      <h3 style={{
        fontFamily: V1.fontDisplay, fontSize: 56, fontWeight: 600,
        lineHeight: 1, letterSpacing: '-0.03em', color: V1.ink,
        margin: 0,
      }}>
        <V1LineMask ready={ready} delay={60} duration={900}>{uc.label}.</V1LineMask>
      </h3>

      {/* Blurb */}
      <p style={{
        fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.55, color: V1.text,
        margin: '22px 0 0', maxWidth: 560,
        ...enterFade(300),
      }}>
        {uc.blurb}
      </p>

      {/* Stats — editorial triple with thin rules, no cards */}
      <div style={{
        marginTop: 44,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: `1px solid ${V1.line}`,
        borderBottom: `1px solid ${V1.line}`,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: '20px 0',
            paddingLeft: i > 0 ? 28 : 0,
            borderLeft: i > 0 ? `1px solid ${V1.line}` : 'none',
            ...enterFade(420 + i * 90),
          }}>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
            }}>{s.label}</div>
            <div style={{
              marginTop: 8,
              fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 700,
              letterSpacing: '-0.03em', color: V1.ink,
              lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <V1CountUp value={s.value} duration={1100} start={420 + i * 90} />
              {s.arrow && (
                <svg width="18" height="18" viewBox="0 0 16 16" style={{ color: V1.green }}>
                  <path d="M3 13L13 3M7 3h6v6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Budget allocation — horizontal progressive bars */}
      <div style={{ marginTop: 44 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 22,
          ...enterFade(760),
        }}>
          <span style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
          }}>Budget allocation</span>
          <span style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
          }}>% of funding</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {uc.breakdown.map((b, i) => (
            <UCBar
              key={i}
              label={b.name}
              pct={b.pct}
              max={max}
              color={UC_COLORS[i % UC_COLORS.length]}
              delay={820 + i * 110}
              ready={ready}
            />
          ))}
        </div>
      </div>

      {/* Insight — editorial pull-quote with serif italic */}
      <blockquote style={{
        margin: '52px 0 0',
        paddingLeft: 24,
        borderLeft: `3px solid ${V1.blue}`,
        fontFamily: '"Source Serif Pro", Georgia, serif',
        fontStyle: 'italic', fontSize: 19, lineHeight: 1.5,
        color: V1.ink, maxWidth: 640,
        ...enterFade(1500),
      }}>
        "{uc.insight}"
        <footer style={{
          marginTop: 10,
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
          fontStyle: 'normal',
        }}>
          — {uc.stat.label}: {uc.stat.value}
        </footer>
      </blockquote>
    </div>
  );
}

function V1UseCasesSection() {
  const [active, setActive] = React.useState(0);
  const [hovered, setHovered] = React.useState(null);
  const uc = USE_CASES[active];

  return (
    <section style={{ background: V1.bg, padding: '120px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Heading */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', marginBottom: 56 }}>
          <div>
            <V1Eyebrow>Use cases</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>
              Deploy your capital<br/>strategically.
            </h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.6, color: V1.text,
            margin: 0, maxWidth: 460, justifySelf: 'end',
          }}>
            Whether you're scaling, investing, or seizing an opportunity, your
            capital can fuel growth across your business.
          </p>
        </div>

        {/* Editorial two-column frame — no card shell */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: 0,
          borderTop: `1px solid ${V1.ink}`,
          paddingTop: 24,
        }}>
          {/* ─── LEFT: chapter menu ─── */}
          <nav style={{ paddingRight: 32, borderRight: `1px solid ${V1.line}` }}>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              marginBottom: 20,
            }}>
              Select a path
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {USE_CASES.map((u, i) => {
                const isActive = i === active;
                const isHover = hovered === i && !isActive;
                return (
                  <li key={u.k} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: '42px 1fr',
                        alignItems: 'center',
                        gap: 12,
                        textAlign: 'left',
                        padding: '16px 0',
                        border: 'none', background: 'transparent',
                        cursor: 'pointer',
                        borderBottom: `1px solid ${V1.line}`,
                        position: 'relative',
                      }}
                    >
                      {/* Active accent bar (slides in/out at left) */}
                      <span aria-hidden style={{
                        position: 'absolute', left: -32, top: '50%',
                        transform: `translateY(-50%) scaleX(${isActive ? 1 : 0})`,
                        transformOrigin: 'left center',
                        width: 20, height: 2, background: V1.blue,
                        transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                      }} />
                      {/* Numeral */}
                      <span style={{
                        fontFamily: V1.fontMono, fontSize: 11.5, fontWeight: 600,
                        letterSpacing: '0.1em',
                        color: isActive ? V1.blue : (isHover ? V1.ink : V1.muted),
                        transform: isHover ? 'translate3d(3px,0,0)' : 'translate3d(0,0,0)',
                        transition: 'color 220ms, transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {/* Label + animated hover underline */}
                      <span style={{ position: 'relative', display: 'inline-block' }}>
                        <span style={{
                          fontFamily: V1.fontDisplay, fontSize: 17,
                          fontWeight: isActive ? 600 : 500, letterSpacing: '-0.015em',
                          color: isActive ? V1.ink : (isHover ? V1.ink : V1.text),
                          transition: 'color 220ms, font-weight 220ms',
                        }}>
                          {u.label}
                        </span>
                        <span aria-hidden style={{
                          position: 'absolute', left: 0, right: 0, bottom: -3,
                          height: 1, background: V1.ink,
                          transformOrigin: 'left center',
                          transform: `scaleX(${isHover || isActive ? 1 : 0})`,
                          opacity: isActive ? 0 : 1, // active uses the left bar, not underline
                          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms',
                        }} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div style={{
              marginTop: 24,
              fontFamily: V1.fontMono, fontSize: 10.5, color: V1.muted,
              letterSpacing: '0.14em',
            }}>
              {String(active + 1).padStart(2, '0')} / {String(USE_CASES.length).padStart(2, '0')}
            </div>
          </nav>

          {/* ─── RIGHT: content pane, remounts on switch ─── */}
          <div style={{ paddingLeft: 56 }}>
            <V1UseCasePane key={active} uc={uc} active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  V1Eyebrow, V1CompareSection, V1StepsSection,
  V1CalcSection, V1ReviewsSection, V1FAQSection, V1CTASection,
  V1UseCasesSection, V1,
});
