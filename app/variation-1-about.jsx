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
  const verbs = ['scale.', 'hire.', 'stock.', 'expand.', 'win.'];
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
                flexShrink: 0, width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 16px -6px ${V1.blue}AA`,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 7h.01M7 12h.01M7 17h.01M11 7h6M11 12h6M11 17h6"/>
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                </svg>
              </div>
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
                  The Delt underwriting team
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

// ─── Why business lending ───
const ABOUT_PILLARS = [
  {
    k: '01',
    t: 'Capital is the operator\u2019s oxygen',
    d: 'Small businesses run on timing. The right capital at the right week is the difference between hiring, opening a second location, or stalling out. Speed isn\u2019t a luxury — it\u2019s the product.',
    img: 'app/assets/about/pillar-01_oxygen.jpg',
    tags: ['Speed', 'Cash flow', 'Growth'],
  },
  {
    k: '02',
    t: 'Main Street is the engine of the economy',
    d: 'Small businesses generate roughly half of US private-sector GDP and create the majority of net new jobs. Every dollar that lands in an operator\u2019s account multiplies through payroll, suppliers, and local communities.',
    img: 'app/assets/about/pillar-02_mainstreet.jpg',
    tags: ['SMB', 'Jobs', 'GDP'],
  },
  {
    k: '03',
    t: 'Banks were never built for this',
    d: 'Legacy underwriting was designed for collateral and decade-long relationships, not for a roofer who needs a truck by Friday. A modern lender has to read live cash flow, not a paper file.',
    img: 'app/assets/about/pillar-03_banks.jpg',
    tags: ['Legacy', 'Friction', 'Collateral'],
  },
  {
    k: '04',
    t: 'Closing the access gap is the work',
    d: 'Most credit-worthy operators in this country still get a \u201cno\u201d from the bank — usually for reasons that have nothing to do with their actual business. Our job is to give those operators a real, fairly-priced answer in hours.',
    img: 'app/assets/about/pillar-04_access.jpg',
    tags: ['Access', 'Fair pricing', 'Operators'],
  },
];

function AboutPillarGallery() {
  const [active, setActive] = React.useState(0);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        height: 460,
        width: '100%',
      }}
    >
      {ABOUT_PILLARS.map((p, i) => {
        const isActive = i === active;
        return (
          <div
            key={p.k}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            style={{
              position: 'relative',
              flex: isActive ? '1 1 0' : '0 0 88px',
              minWidth: 88,
              borderRadius: 18,
              overflow: 'hidden',
              cursor: 'pointer',
              outline: 'none',
              transition: 'flex 520ms cubic-bezier(0.22,1,0.36,1)',
              boxShadow: isActive
                ? '0 18px 40px rgba(4,30,66,0.22)'
                : '0 6px 14px rgba(4,30,66,0.10)',
            }}
          >
            <img
              src={p.img}
              alt=""
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                filter: isActive ? 'none' : 'saturate(0.85) brightness(0.9)',
                transition: 'filter 520ms ease',
              }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: isActive
                ? 'linear-gradient(180deg, rgba(4,30,66,0.08) 0%, rgba(4,30,66,0.18) 45%, rgba(4,30,66,0.82) 100%)'
                : 'linear-gradient(180deg, rgba(4,30,66,0.45) 0%, rgba(4,30,66,0.78) 100%)',
              transition: 'background 520ms ease',
            }} />

            {/* Collapsed state — vertical text rail */}
            {!isActive && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontFamily: V1.fontDisplay,
                  fontSize: 15, fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{
                    fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.18em', color: V1.blueSoft,
                  }}>{p.k}</span>
                  <span style={{
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', maxHeight: 320,
                  }}>{p.t}</span>
                </div>
              </div>
            )}

            {/* Active state — bottom overlay */}
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              padding: '24px 28px 28px',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 360ms ease 120ms, transform 360ms ease 120ms',
              pointerEvents: isActive ? 'auto' : 'none',
            }}>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: V1.blueSoft, marginBottom: 8,
              }}>{p.k} · Pillar</div>
              <h3 style={{
                margin: '0 0 10px',
                fontFamily: V1.fontDisplay, fontSize: 26, fontWeight: 600,
                color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2,
                maxWidth: 540,
              }}>{p.t}</h3>
              <p style={{
                margin: '0 0 14px',
                fontFamily: V1.fontBody, fontSize: 15, lineHeight: 1.55,
                color: 'rgba(255,255,255,0.88)',
                maxWidth: 560,
              }}>{p.d}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.tags.map((tag) => (
                  <span key={tag} style={{
                    fontFamily: V1.fontMono, fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: '#ffffff',
                    padding: '6px 10px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    backdropFilter: 'blur(4px)',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AboutTimeline() {
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} style={{ background: V1.bg, padding: '140px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ marginBottom: 56, maxWidth: 760 }}>
          <V1Eyebrow>Why business lending</V1Eyebrow>
          <h2 style={{ ...v1H2, marginTop: 18 }}>
            Capital is what<br/>turns small businesses<br/>into big ones.
          </h2>
          <p style={{
            marginTop: 20,
            fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.6, color: V1.text,
            maxWidth: 620,
          }}>
            Small businesses are the economy. They employ nearly half of
            America, create most of its new jobs, and keep main streets
            standing. Modern, fairly-priced business lending is how those
            operators turn a good week into a growth year — and how local
            economies compound.
          </p>
        </div>

        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 700ms cubic-bezier(0.22,1,0.36,1) 150ms',
        }}>
          <AboutPillarGallery />
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

        {/* Function strip — the desk by discipline, not by individual */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16,
        }}>
          {[
            { k: 'Underwriting', d: 'Reads cash flow, prices the file, signs the offer.' },
            { k: 'Capital',      d: 'Manages the balance sheet so funded deals stay funded.' },
            { k: 'Operator desk', d: 'Owns the borrower relationship from first call to renewal.' },
            { k: 'Risk',         d: 'Watches portfolio health and catches drift before it costs.' },
            { k: 'Engineering',  d: 'Builds the data pipelines that turn deposits into decisions.' },
          ].map((f, i) => (
            <article key={f.k} style={{
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
              e.currentTarget.style.borderColor = V1.blue + '60';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = inView ? 'translateY(0)' : 'translateY(20px)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = V1.line;
            }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 20px -8px ${V1.blue}AA`,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {i === 0 && (<><path d="M3 12h3l2-7 4 14 2-7h7"/></>)}
                  {i === 1 && (<><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></>)}
                  {i === 2 && (<><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/></>)}
                  {i === 3 && (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>)}
                  {i === 4 && (<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>)}
                </svg>
              </div>
              <div>
                <div style={{
                  fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 600,
                  color: V1.ink, letterSpacing: '-0.015em', lineHeight: 1.2,
                }}>
                  {f.k}
                </div>
                <div style={{
                  marginTop: 4, fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                  color: V1.blue, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  Function
                </div>
              </div>
              <div style={{
                fontFamily: V1.fontBody, fontSize: 12.5, lineHeight: 1.55, color: V1.muted,
                borderTop: `1px solid ${V1.line}`, paddingTop: 14,
              }}>
                {f.d}
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
