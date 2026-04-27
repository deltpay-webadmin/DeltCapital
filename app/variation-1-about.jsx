// V1 — About page
// Modern editorial treatment: oversized hero, counting stats, principles
// carousel, animated vertical timeline, leadership strip.

// ─── Content ───
const ABOUT_PRINCIPLES = [
  {
    n: '01',
    title: "We're one team",
    blurb: 'Lead with empathy, treat others with respect. Our success depends on all of us working together — helping, pushing, picking each other up when we fall.',
    pull: 'One P&L. One standard. One Delt.',
  },
  {
    n: '02',
    title: 'We own the outcome',
    blurb: "Each of us plays a role in Delt's success. We're decisive. When we see a problem, we jump in. We seek frontline perspectives and spend the company's finite resources on what matters most.",
    pull: 'No passengers. Every seat drives.',
  },
  {
    n: '03',
    title: 'Purpose, not process',
    blurb: 'We get stuff done with agility, integrity, and urgency. We dive deep regardless of level — understand the details, create focus with clear goals aligned to our mission.',
    pull: 'Speed with substance.',
  },
  {
    n: '04',
    title: 'All-in on the operator',
    blurb: "Every interaction matters. We understand our customers' diverse needs and goals, deliver exceptional products and services, and work hard to earn and keep their trust.",
    pull: 'The operator always eats first.',
  },
];

const ABOUT_TIMELINE = [
  { y: '2019', title: 'Delt founded',       body: 'Two underwriters and an engineer set out to rebuild small-business lending from scratch. Seed round closes in 42 days.' },
  { y: '2020', title: 'First $1M month',    body: 'Delt crosses $1M deployed in a single month. First repeat borrower signs a third draw before month-end.' },
  { y: '2021', title: 'Plaid partnership',  body: 'Live bank-data underwriting goes into production. Decision-to-fund time drops from 72 to 19 hours.' },
  { y: '2022', title: 'Series A',           body: 'Backed by operators, not just venture. Book expands to construction, logistics, and multi-unit F&B.' },
  { y: '2023', title: 'SOC 2 Type II',      body: 'Achieved SOC 2 Type II compliance with zero findings. First AI-assisted underwriting model rolls out.' },
  { y: '2024', title: '$100M deployed',     body: 'Delt crosses $100M deployed lifetime, with an average fund time of 24 hours and a 94% refinance rate.' },
  { y: '2025', title: '$200M milestone',    body: 'Book crosses $200M. Team grows to 48. Launch same-day wire for qualified operators.' },
];

const ABOUT_LEADERSHIP = [
  { n: 'Elena Park',      r: 'Co-founder, CEO',      bio: '10 yrs at OnDeck credit · Wharton MBA',   color: '#4945FF' },
  { n: 'David Okonkwo',   r: 'Co-founder, CTO',      bio: 'Ex-Plaid staff eng · MIT CS',              color: '#4945FF' },
  { n: 'Priya Singh',     r: 'Head of Underwriting', bio: '8 yrs at Kabbage · Fraud & risk',          color: '#818CF8' },
  { n: 'Marcus Chen',     r: 'Head of Capital',      bio: 'Ex-Goldman SMB lending · 2 Fed funds',     color: '#4338CA' },
  { n: 'Nora Hassan',     r: 'Head of Operator Desk', bio: 'Scaled support at Brex to 20K accounts',  color: '#6366F1' },
];

const ABOUT_VALUES = [
  { label: 'Years operating',      value: 6,       suffix: '',  sub: 'Founded 2019' },
  { label: 'Capital deployed',     value: 200,     suffix: 'M', prefix: '$', sub: 'Lifetime, through Q4' },
  { label: 'Operators funded',     value: 4200,    suffix: '+', sub: 'Across 47 US states' },
  { label: 'Avg. time to fund',    value: 24,      suffix: ' h', sub: 'From Plaid connect' },
];

// ─── CountUp hook ───
function useCountUp(target, visible, duration = 1400) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!visible) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, visible, duration]);
  return val;
}

function formatCount(val, target, suffix = '', prefix = '') {
  let txt;
  if (target >= 1000) {
    txt = Math.round(val).toLocaleString();
  } else if (target % 1 === 0) {
    txt = Math.round(val).toString();
  } else {
    txt = val.toFixed(1);
  }
  return `${prefix}${txt}${suffix}`;
}

// ─── Intersection observer hook ───
function useInView(threshold = 0.2) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated stat card ───
function AboutStatCard({ value, suffix = '', prefix = '', label, sub, visible, delay = 0 }) {
  const [started, setStarted] = React.useState(false);
  React.useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [visible, delay]);
  const val = useCountUp(value, started);

  return (
    <div style={{ padding: '28px 24px' }}>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
      }}>
        {label}
      </div>
      <div style={{
        marginTop: 12,
        fontFamily: V1.fontDisplay, fontSize: 56, fontWeight: 700,
        letterSpacing: '-0.04em', color: V1.ink,
        fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>
        {started ? formatCount(val, value, suffix, prefix) : `${prefix}0${suffix}`}
      </div>
      <div style={{
        marginTop: 10, fontFamily: V1.fontBody, fontSize: 13, color: V1.muted,
      }}>
        {sub}
      </div>
    </div>
  );
}

// ─── Hero — rotating keyword ───
function AboutHero() {
  const verbs = ['grow.', 'scale.', 'hire.', 'stock.', 'expand.', 'win.'];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % verbs.length), 1800);
    return () => clearInterval(iv);
  }, []);

  const [heroRef, heroInView] = useInView(0.1);

  return (
    <section ref={heroRef} style={{
      background: V1.white,
      padding: '140px 0 100px',
      borderBottom: `1px solid ${V1.line}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Parallax violet orbs */}
      <div aria-hidden style={{
        position: 'absolute', top: -240, right: -140,
        width: 640, height: 640, borderRadius: '50%',
        background: `radial-gradient(circle, ${V1.blue}1C, transparent 65%)`,
        pointerEvents: 'none',
        transform: heroInView ? 'translateY(0)' : 'translateY(40px)',
        transition: 'transform 1800ms cubic-bezier(0.22,1,0.36,1)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -180, left: -80,
        width: 420, height: 420, borderRadius: '50%',
        background: `radial-gradient(circle, ${V1.blue}12, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
        <V1Eyebrow>About Delt</V1Eyebrow>
        <h1 style={{
          marginTop: 18,
          fontFamily: V1.fontDisplay, fontSize: 'clamp(52px, 8vw, 104px)',
          fontWeight: 700, color: V1.ink,
          letterSpacing: '-0.04em', lineHeight: 0.98,
          textWrap: 'balance',
          maxWidth: 1100,
        }}>
          Capital built to{' '}
          <span style={{
            display: 'inline-block',
            position: 'relative',
            color: V1.blue,
            // Manrope/Codec Pro don't ship italic glyphs; force a real
            // italic by switching to Source Serif Pro Italic (same trick
            // V1Hero uses for "yourself.").
            fontFamily: '"Source Serif Pro", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 600,
            minWidth: '3.2ch',
            verticalAlign: 'baseline',
          }}>
            {verbs.map((v, i) => (
              <span
                key={v}
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  left: 0, top: 0,
                  opacity: i === idx ? 1 : 0,
                  transform: i === idx ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 500ms, transform 500ms',
                  whiteSpace: 'nowrap',
                }}
              >
                {v}
              </span>
            ))}
          </span>
          <br/>
          Priced in one number.
          <br/>
          Wired in one day.
        </h1>

        <div style={{
          marginTop: 48,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'end',
          maxWidth: 1000,
        }}>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 19, lineHeight: 1.55,
            color: V1.text, margin: 0, maxWidth: 500,
          }}>
            We built Delt because the banks we started our own businesses with
            wouldn't lend us a dime when we needed it most. So we rebuilt lending
            from scratch — with data, not committee minutes.
          </p>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
            display: 'flex', alignItems: 'center', gap: 10,
            justifySelf: 'end',
          }}>
            <span style={{ width: 28, height: 1, background: V1.muted }} />
            EST. 2019 — Austin · TX
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          marginTop: 88,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: `1px solid ${V1.line}`,
        }}>
          {ABOUT_VALUES.map((s, i) => (
            <div key={i} style={{
              borderRight: i < 3 ? `1px solid ${V1.line}` : 'none',
            }}>
              <AboutStatCard {...s} visible={heroInView} delay={200 + i * 120} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Thesis section ───
function AboutThesis() {
  const [ref, inView] = useInView(0.25);
  return (
    <section ref={ref} style={{ background: V1.bg, padding: '140px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 120, alignItems: 'start',
        }}>
          <div>
            <V1Eyebrow>Thesis</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>
              Most lenders<br/>
              <span style={{
                display: 'inline-block',
                transform: inView ? 'translateY(0)' : 'translateY(16px)',
                opacity: inView ? 1 : 0,
                transition: 'all 700ms cubic-bezier(0.22,1,0.36,1) 200ms',
              }}>
                underwrite the <em style={{ color: V1.blue, fontStyle: 'italic' }}>past</em>.
              </span>
              <br/>
              <span style={{
                display: 'inline-block',
                transform: inView ? 'translateY(0)' : 'translateY(16px)',
                opacity: inView ? 1 : 0,
                transition: 'all 700ms cubic-bezier(0.22,1,0.36,1) 400ms',
              }}>
                Delt underwrites the <em style={{ color: V1.blue, fontStyle: 'italic' }}>next 90 days</em>.
              </span>
            </h2>
          </div>
          <div style={{ paddingTop: 16 }}>
            <p style={{
              fontFamily: V1.fontBody, fontSize: 18, lineHeight: 1.6,
              color: V1.text, margin: 0,
            }}>
              Credit bureaus and tax returns tell a lender what a business did
              two years ago. That's fine for a 30-year mortgage. It's useless
              for a restaurant that needs to stock up for March Madness.
            </p>
            <p style={{
              marginTop: 24,
              fontFamily: V1.fontBody, fontSize: 18, lineHeight: 1.6,
              color: V1.text,
            }}>
              We underwrite the pattern of deposits over the last 90 days — the
              actual signal of whether a business can service capital. It's
              faster, fairer, and it's why we can fund same-day without
              collateral, without a hard pull, without a PG.
            </p>

            {/* Signature callout */}
            <div style={{
              marginTop: 36, padding: '24px 28px',
              background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 16,
              display: 'flex', alignItems: 'center', gap: 18,
            }}>
              <div style={{
                flexShrink: 0, width: 40, height: 40, borderRadius: 999,
                background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700,
                boxShadow: `0 6px 16px -6px ${V1.blue}AA`,
              }}>EP</div>
              <div>
                <div style={{
                  fontFamily: V1.fontBody, fontSize: 14, fontStyle: 'italic', color: V1.ink,
                }}>
                  "Your bank statements are already the truth. We just read them faster."
                </div>
                <div style={{
                  marginTop: 4, fontFamily: V1.fontMono, fontSize: 11,
                  color: V1.muted, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  Elena Park, Co-founder
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Principles carousel ───
function AboutPrinciples() {
  const [idx, setIdx] = React.useState(0);
  const scrollerRef = React.useRef(null);
  const [ref, inView] = useInView(0.15);

  const scrollTo = (i) => {
    setIdx(i);
    if (scrollerRef.current) {
      const cards = scrollerRef.current.children;
      if (cards[i]) {
        scrollerRef.current.scrollTo({ left: cards[i].offsetLeft - 40, behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={ref} style={{
      background: V1.white,
      padding: '140px 0',
      borderTop: `1px solid ${V1.line}`,
      borderBottom: `1px solid ${V1.line}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'end', marginBottom: 56,
        }}>
          <div>
            <V1Eyebrow>How we operate</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>
              Four principles.<br/>Taped to every wall.
            </h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.6,
            color: V1.text, margin: 0, maxWidth: 460, justifySelf: 'end',
          }}>
            These aren't aspirations — they're how the team actually runs. We
            interview for them, promote against them, and fire for them.
          </p>
        </div>
      </div>

      {/* Scrolling cards */}
      <div
        ref={scrollerRef}
        style={{
          display: 'flex', gap: 20,
          padding: '0 40px 8px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }}
      >
        <style>{`
          .about-principles-scroller::-webkit-scrollbar { display: none; }
        `}</style>
        {ABOUT_PRINCIPLES.map((p, i) => (
          <article
            key={p.n}
            onClick={() => scrollTo(i)}
            style={{
              flexShrink: 0,
              width: 'min(520px, 88vw)',
              scrollSnapAlign: 'start',
              background: i === idx ? V1.ink : V1.bg,
              color: i === idx ? '#fff' : V1.ink,
              border: `1px solid ${i === idx ? 'rgba(255,255,255,0.08)' : V1.line}`,
              borderRadius: 24,
              padding: '44px 40px',
              cursor: 'pointer',
              transition: 'all 400ms cubic-bezier(0.22,1,0.36,1)',
              display: 'flex', flexDirection: 'column',
              gap: 28, minHeight: 400,
              transform: inView ? 'translateY(0)' : 'translateY(40px)',
              opacity: inView ? 1 : 0,
              transitionDelay: `${i * 120}ms`,
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Big number */}
            <div aria-hidden style={{
              position: 'absolute', top: 16, right: 32,
              fontFamily: V1.fontDisplay, fontSize: 180, fontWeight: 700,
              lineHeight: 0.9,
              color: i === idx ? V1.blue : V1.ink,
              opacity: i === idx ? 0.35 : 0.06,
              letterSpacing: '-0.06em', pointerEvents: 'none',
            }}>
              {p.n}
            </div>

            <div style={{
              fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: i === idx ? V1.blueSoft : V1.blue,
              display: 'inline-flex', alignItems: 'center', gap: 10,
              position: 'relative',
            }}>
              <span style={{
                width: 18, height: 1,
                background: i === idx ? V1.blueSoft : V1.blue,
              }} />
              Principle {p.n}
            </div>

            <h3 style={{
              margin: 0,
              fontFamily: V1.fontDisplay, fontSize: 30, fontWeight: 700,
              color: i === idx ? '#fff' : V1.ink,
              letterSpacing: '-0.025em', lineHeight: 1.15,
              position: 'relative',
            }}>
              {p.title}
            </h3>

            <p style={{
              margin: 0, flex: 1,
              fontFamily: V1.fontBody, fontSize: 15.5, lineHeight: 1.6,
              color: i === idx ? 'rgba(255,255,255,0.75)' : V1.text,
              position: 'relative',
            }}>
              {p.blurb}
            </p>

            <div style={{
              paddingTop: 20,
              borderTop: `1px solid ${i === idx ? 'rgba(255,255,255,0.1)' : V1.line}`,
              fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 600, fontStyle: 'italic',
              color: i === idx ? V1.blueSoft : V1.blue,
              letterSpacing: '-0.01em',
              position: 'relative',
            }}>
              "{p.pull}"
            </div>
          </article>
        ))}
      </div>

      {/* Progress rail */}
      <div style={{
        maxWidth: 1280, margin: '40px auto 0', padding: '0 40px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          flex: 1, height: 2, background: V1.line, position: 'relative', borderRadius: 1,
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${((idx + 1) / ABOUT_PRINCIPLES.length) * 100}%`,
            background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
            borderRadius: 1,
            transition: 'width 400ms cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>
        <div style={{
          fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.12em', color: V1.muted, whiteSpace: 'nowrap',
        }}>
          {String(idx + 1).padStart(2, '0')} / {String(ABOUT_PRINCIPLES.length).padStart(2, '0')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => scrollTo((idx + d + ABOUT_PRINCIPLES.length) % ABOUT_PRINCIPLES.length)}
              aria-label={d < 0 ? 'Previous principle' : 'Next principle'}
              style={{
                width: 36, height: 36, borderRadius: 999,
                border: `1px solid ${V1.line}`, background: V1.white,
                color: V1.ink, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 180ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = V1.ink; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = V1.white; e.currentTarget.style.color = V1.ink; }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d={d < 0 ? "M7.5 3L4.5 6L7.5 9" : "M4.5 3L7.5 6L4.5 9"} stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Timeline ───
function AboutTimeline() {
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} style={{ background: V1.bg, padding: '140px 0' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ marginBottom: 72, maxWidth: 720 }}>
          <V1Eyebrow>Our story</V1Eyebrow>
          <h2 style={{ ...v1H2, marginTop: 18 }}>Six years. One book.</h2>
          <p style={{
            marginTop: 20,
            fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.6, color: V1.text,
            maxWidth: 580,
          }}>
            We don't white-label, resell, or repackage. Every dollar deployed
            under the Delt name is underwritten by our team and held on our
            balance sheet.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: 80 }}>
          {/* Vertical line */}
          <div aria-hidden style={{
            position: 'absolute', left: 38, top: 0, bottom: 0,
            width: 2, background: V1.line, borderRadius: 1,
          }} />
          <div aria-hidden style={{
            position: 'absolute', left: 38, top: 0,
            width: 2,
            height: inView ? '100%' : '0%',
            background: `linear-gradient(180deg, ${V1.blue}, #818CF8, transparent)`,
            borderRadius: 1,
            transition: 'height 2400ms cubic-bezier(0.22,1,0.36,1) 200ms',
          }} />

          {ABOUT_TIMELINE.map((m, i) => {
            const latest = i === ABOUT_TIMELINE.length - 1;
            return (
              <div key={m.y} style={{
                position: 'relative', paddingBottom: latest ? 0 : 48,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(-12px)',
                transition: `all 700ms cubic-bezier(0.22,1,0.36,1) ${300 + i * 140}ms`,
              }}>
                {/* Node */}
                <div aria-hidden style={{
                  position: 'absolute', left: -51, top: 4,
                  width: 26, height: 26, borderRadius: 999,
                  background: V1.white,
                  border: `2px solid ${latest ? V1.blue : V1.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: 999,
                    background: latest ? `linear-gradient(135deg, ${V1.blue}, #818CF8)` : V1.muted,
                    boxShadow: latest ? `0 0 0 4px ${V1.blue}22` : 'none',
                  }} />
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: '140px 1fr',
                  gap: 32, alignItems: 'start',
                }}>
                  <div style={{
                    fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 700,
                    color: latest ? V1.blue : V1.ink,
                    letterSpacing: '-0.03em', lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {m.y}
                  </div>
                  <div>
                    <h3 style={{
                      margin: 0,
                      fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
                      color: V1.ink, letterSpacing: '-0.02em', lineHeight: 1.2,
                    }}>
                      {m.title}
                    </h3>
                    <p style={{
                      marginTop: 10, marginBottom: 0,
                      fontFamily: V1.fontBody, fontSize: 15.5, lineHeight: 1.6,
                      color: V1.text, maxWidth: 620,
                    }}>
                      {m.body}
                    </p>
                    {latest && (
                      <span style={{
                        display: 'inline-block', marginTop: 12,
                        padding: '4px 12px', borderRadius: 999,
                        background: `${V1.blue}14`, color: V1.blue,
                        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                      }}>
                        Current chapter
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Leadership ───
function AboutLeadership() {
  const [ref, inView] = useInView(0.15);
  return (
    <section ref={ref} style={{
      background: V1.white, padding: '140px 0',
      borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'end', marginBottom: 56,
        }}>
          <div>
            <V1Eyebrow>Leadership</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>The people<br/>on the desk.</h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.6,
            color: V1.text, margin: 0, maxWidth: 460, justifySelf: 'end',
          }}>
            Every senior operator at Delt has either built a small business, or
            underwritten thousands of them. We don't hire from consulting.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16,
        }}>
          {ABOUT_LEADERSHIP.map((p, i) => (
            <article key={p.n} style={{
              background: V1.bg,
              border: `1px solid ${V1.line}`,
              borderRadius: 16,
              padding: 24,
              display: 'flex', flexDirection: 'column', gap: 16,
              transition: 'all 240ms cubic-bezier(0.22,1,0.36,1)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: `${i * 100}ms`,
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px -24px rgba(10,37,64,0.2)';
              e.currentTarget.style.borderColor = p.color + '60';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = inView ? 'translateY(0)' : 'translateY(20px)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = V1.line;
            }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 999,
                background: `linear-gradient(135deg, ${p.color}, ${p.color}AA)`,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 700,
                letterSpacing: '-0.02em',
                boxShadow: `0 8px 20px -8px ${p.color}AA`,
              }}>
                {avatarInitials(p.n)}
              </div>
              <div>
                <div style={{
                  fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 600,
                  color: V1.ink, letterSpacing: '-0.015em', lineHeight: 1.2,
                }}>
                  {p.n}
                </div>
                <div style={{
                  marginTop: 4, fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                  color: p.color, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  {p.r}
                </div>
              </div>
              <div style={{
                fontFamily: V1.fontBody, fontSize: 12.5, lineHeight: 1.55, color: V1.muted,
                borderTop: `1px solid ${V1.line}`, paddingTop: 14,
              }}>
                {p.bio}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Root ───
function V1AboutPage({ accent, onApply, onTalk }) {
  return (
    <>
      <AboutHero />
      <AboutThesis />
      <AboutPrinciples />
      <AboutTimeline />
      <AboutLeadership />
      <V1CTASection onApply={onApply} onTalk={onTalk} />
    </>
  );
}

Object.assign(window, {
  V1AboutPage,
});
