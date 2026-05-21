// V1 — Operators / Reviews page
// Full editorial reviews experience: filterable hero strip, featured quote,
// masonry-varied grid with metric-forward cards, and a "proof" strip at bottom.

// ─── Rich testimonial dataset — extends shared.testimonials with metadata ───
const REVIEW_META = [
  { industry: 'Restaurants',  kind: 'Family trattoria',      city: 'Miami, FL',     draw: 3, years: 4, savings: '$12.4K' },
  { industry: 'Construction', kind: 'Residential GC',        city: 'Phoenix, AZ',   draw: 3, years: 6, savings: '$28.7K' },
  { industry: 'Beauty',       kind: 'Medical spa',           city: 'Austin, TX',    draw: 2, years: 2, savings: '$8.9K'  },
  { industry: 'Logistics',    kind: 'Regional 3PL',          city: 'Atlanta, GA',   draw: 4, years: 5, savings: '$16.2K' },
  { industry: 'Retail',       kind: 'Specialty grocer',      city: 'Denver, CO',    draw: 2, years: 3, savings: '$6.5K'  },
  { industry: 'Auto',         kind: 'Independent body shop', city: 'Nashville, TN', draw: 3, years: 7, savings: '$14.8K' },
];

const REVIEW_FILTERS = ['All', 'Restaurants', 'Construction', 'Logistics', 'Retail', 'Beauty', 'Auto'];

function avatarInitials(name) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function avatarColor(name) {
  // Deterministic violet-family tint per person
  const hues = ['#4945FF', '#4338CA', '#6366F1', '#818CF8', '#3730A3', '#6D6BF5'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return hues[h % hues.length];
}

// ─── Metric pill ───
function ReviewMetric({ label, value, color }) {
  return (
    <div>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
      }}>
        {label}
      </div>
      <div style={{
        marginTop: 4, fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700,
        letterSpacing: '-0.02em', color: color || V1.ink,
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
      }}>
        {value}
      </div>
    </div>
  );
}

// ─── Individual card ───
function ReviewCard({ t, meta, featured, idx }) {
  const initials = avatarInitials(t.n);
  const avColor = avatarColor(t.n);

  return (
    <article style={{
      background: featured ? V1.ink : V1.white,
      color: featured ? '#fff' : V1.ink,
      border: `1px solid ${featured ? 'rgba(255,255,255,0.08)' : V1.line}`,
      borderRadius: 20,
      padding: featured ? 32 : 28,
      gridColumn: featured ? 'span 2' : 'span 1',
      display: 'flex', flexDirection: 'column', gap: 20,
      position: 'relative', overflow: 'hidden',
      transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1), box-shadow 240ms',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = featured
        ? '0 30px 60px -30px rgba(10,37,64,0.5)'
        : '0 20px 40px -24px rgba(10,37,64,0.18)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = '';
    }}
    >
      {/* Decorative quote glyph for featured */}
      {featured && (
        <div aria-hidden style={{
          position: 'absolute', top: 24, right: 28,
          fontFamily: V1.fontDisplay, fontSize: 180, fontWeight: 700,
          lineHeight: 0.9, color: V1.blue, opacity: 0.12,
          letterSpacing: '-0.08em', pointerEvents: 'none',
        }}>
          "
        </div>
      )}

      {/* Top meta row: industry chip + verified */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: featured ? V1.blueSoft : V1.blue,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 14, height: 1,
            background: featured ? V1.blueSoft : V1.blue,
          }} />
          {meta.kind || meta.industry}
        </span>
        <span style={{ color: featured ? 'rgba(255,255,255,0.2)' : V1.line }}>·</span>
        <span style={{
          fontFamily: V1.fontMono, fontSize: 10.5,
          color: featured ? 'rgba(255,255,255,0.55)' : V1.muted,
          letterSpacing: '0.06em',
        }}>
          {meta.city}
        </span>
        <span style={{
          marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '3px 9px', borderRadius: 999,
          background: featured ? 'rgba(31,132,90,0.18)' : 'rgba(31,132,90,0.1)',
          color: featured ? '#4ADE80' : V1.green,
          fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <svg width="10" height="10" viewBox="0 0 14 14">
            <path d="M3 7.2L5.8 10 11 4.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Verified
        </span>
      </div>

      {/* Quote */}
      <blockquote style={{
        margin: 0,
        fontFamily: V1.fontDisplay,
        fontSize: featured ? 26 : 18,
        fontWeight: featured ? 500 : 500,
        lineHeight: featured ? 1.3 : 1.45,
        letterSpacing: featured ? '-0.025em' : '-0.015em',
        color: featured ? '#fff' : V1.ink,
      }}>
        <span style={{
          color: featured ? V1.blueSoft : V1.blue,
          fontWeight: 600,
        }}>"</span>
        {t.q}
        <span style={{
          color: featured ? V1.blueSoft : V1.blue,
          fontWeight: 600,
        }}>"</span>
      </blockquote>

      {/* Divider */}
      <div style={{
        height: 1, width: '100%',
        background: featured ? 'rgba(255,255,255,0.08)' : V1.line,
      }} />

      {/* Footer: avatar + name / metrics */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          flexShrink: 0, width: featured ? 48 : 40, height: featured ? 48 : 40,
          borderRadius: 999,
          background: `linear-gradient(135deg, ${avColor}, ${avColor}CC)`,
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: V1.fontDisplay, fontSize: featured ? 16 : 13,
          fontWeight: 700, letterSpacing: '-0.01em',
          boxShadow: featured ? `0 6px 18px -6px ${avColor}AA` : `0 4px 12px -4px ${avColor}AA`,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: V1.fontDisplay,
            fontSize: featured ? 15 : 14, fontWeight: 600,
            color: featured ? '#fff' : V1.ink,
            letterSpacing: '-0.01em', lineHeight: 1.2,
          }}>
            {t.n}
          </div>
          <div style={{
            marginTop: 2,
            fontFamily: V1.fontBody, fontSize: featured ? 13 : 12,
            color: featured ? 'rgba(255,255,255,0.6)' : V1.muted,
          }}>
            {t.b}
          </div>
        </div>
      </div>

      {/* Metric strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: featured ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
        gap: featured ? 20 : 12,
        padding: featured ? '20px 0 0' : '16px 0 0',
        borderTop: `1px solid ${featured ? 'rgba(255,255,255,0.08)' : V1.line}`,
      }}>
        <FooterMetric featured={featured} label="Funded" value={t.f} highlight />
        <FooterMetric featured={featured} label="Loan fee" value={t.r} />
        <FooterMetric featured={featured} label={meta.draw > 1 ? `Draw #${meta.draw}` : 'First draw'} value={`${meta.years} yr`} />
        {featured && <FooterMetric featured={featured} label="Saved vs bank" value={meta.savings} />}
      </div>
    </article>
  );
}

function FooterMetric({ label, value, featured, highlight }) {
  return (
    <div>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 9.5, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: featured ? 'rgba(255,255,255,0.55)' : V1.muted,
      }}>
        {label}
      </div>
      <div style={{
        marginTop: 5,
        fontFamily: V1.fontDisplay,
        fontSize: featured ? 20 : 16, fontWeight: 700,
        letterSpacing: '-0.02em',
        color: highlight
          ? (featured ? V1.blueSoft : V1.blue)
          : (featured ? '#fff' : V1.ink),
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
      }}>
        {value}
      </div>
    </div>
  );
}

// ─── Main reviews page ───
function V1ReviewsPage({ accent, onApply, onTalk }) {
  const [filter, setFilter] = React.useState('All');
  const allReviews = DeltContent.testimonials.map((t, i) => ({ ...t, _meta: REVIEW_META[i] }));

  const filtered = filter === 'All'
    ? allReviews
    : allReviews.filter(r => r._meta.industry === filter);

  return (
    <>
      {/* ─── HERO ─── */}
      <section data-v1-section style={{
        background: V1.white,
        padding: '120px 0 80px',
        borderBottom: `1px solid ${V1.line}`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle gradient orb decoration */}
        <div aria-hidden style={{
          position: 'absolute', top: -200, right: -120,
          width: 520, height: 520, borderRadius: '50%',
          background: `radial-gradient(circle, ${V1.blue}14, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          <V1Eyebrow>Operators</V1Eyebrow>
          <div data-v1-grid-2col style={{
            display: 'grid', gridTemplateColumns: '1.3fr 1fr',
            gap: 80, alignItems: 'end', marginTop: 18,
          }}>
            <h1 data-v1-section-title style={{
              fontFamily: V1.fontDisplay, fontSize: 'clamp(44px, 6.5vw, 80px)',
              fontWeight: 700, color: V1.ink,
              letterSpacing: '-0.035em', lineHeight: 1.02,
              margin: 0, textWrap: 'balance',
            }}>
              Verified on<br/>the renewal call.
            </h1>
            <p style={{
              fontFamily: V1.fontBody, fontSize: 17.5, lineHeight: 1.6,
              color: V1.text, margin: 0, maxWidth: 440,
            }}>
              Every quote is from a borrower who has closed at least once.
              Business names are real, on request. We publish the loan fee and
              funding amount beside each story — no anonymized marketing fluff.
            </p>
          </div>

          {/* Hard numbers strip */}
          <div data-v1-grid-4col style={{
            marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0, borderTop: `1px solid ${V1.line}`,
          }}>
            {[
              { label: 'Reviews collected',      value: '1,847',   sub: 'Post-funding, every deal' },
              { label: 'Net Promoter Score',     value: '72',      sub: 'Industry avg: 44' },
              { label: 'Would refinance again',  value: '94%',     sub: 'Of closed borrowers' },
              { label: 'Return customers',       value: '2.4×',    sub: 'Avg. draws per operator' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderRight: i < 3 ? `1px solid ${V1.line}` : 'none',
              }}>
                <div style={{
                  fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
                }}>
                  {s.label}
                </div>
                <div style={{
                  marginTop: 12,
                  fontFamily: V1.fontDisplay, fontSize: 44, fontWeight: 700,
                  letterSpacing: '-0.035em', color: V1.ink,
                  fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>
                  {s.value}
                </div>
                <div style={{
                  marginTop: 10, fontFamily: V1.fontBody, fontSize: 13, color: V1.muted,
                }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FILTER + GRID ─── */}
      <section data-v1-section style={{ background: V1.bg, padding: '80px 0 120px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          {/* Filter row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 40, flexWrap: 'wrap',
            padding: '6px', background: V1.white,
            border: `1px solid ${V1.line}`, borderRadius: 999,
            width: 'fit-content',
          }}>
            {REVIEW_FILTERS.map((f) => {
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '9px 18px', borderRadius: 999,
                    border: 'none', cursor: 'pointer',
                    background: isActive ? V1.ink : 'transparent',
                    color: isActive ? '#fff' : V1.text,
                    fontFamily: V1.fontDisplay, fontSize: 13, fontWeight: isActive ? 600 : 500,
                    letterSpacing: '-0.005em',
                    transition: 'all 180ms',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = V1.bgWarm; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {f}
                  {f !== 'All' && (
                    <span style={{
                      marginLeft: 8, opacity: isActive ? 0.7 : 0.5,
                      fontFamily: V1.fontMono, fontSize: 11,
                    }}>
                      {allReviews.filter(r => r._meta.industry === f).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Grid — featured first card + regular cards */}
          <div data-v1-grid-3col style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            gridAutoFlow: 'dense',
          }}>
            {filtered.map((t, i) => (
              <ReviewCard
                key={t.n}
                t={t}
                meta={t._meta}
                featured={filter === 'All' && i === 0}
                idx={i}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{
              padding: '80px 40px', textAlign: 'center',
              background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 20,
              fontFamily: V1.fontBody, fontSize: 15, color: V1.muted,
            }}>
              No operators in this category yet. <button onClick={() => setFilter('All')} style={{
                background: 'transparent', border: 'none', color: V1.blue,
                fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer',
                textDecoration: 'underline', padding: 0,
              }}>Show all</button>
            </div>
          )}
        </div>
      </section>

      {/* ─── PROOF STRIP — press / trust logos ─── */}
      <section data-v1-section style={{
        background: V1.white,
        padding: '56px 0',
        borderTop: `1px solid ${V1.line}`,
        borderBottom: `1px solid ${V1.line}`,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 40, flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              whiteSpace: 'nowrap',
            }}>
              <span style={{ display: 'inline-block', width: 24, height: 1, background: V1.muted, verticalAlign: 'middle', marginRight: 10 }} />
              Trusted & audited
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap',
              opacity: 0.65,
            }}>
              {['TRUSTPILOT', 'BBB A+', 'SOC 2 TYPE II', 'PLAID PARTNER', 'FDIC PARTNER BANKS'].map((l, i) => (
                <span key={i} style={{
                  fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600,
                  letterSpacing: '0.04em', color: V1.ink,
                }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <V1CTASection onApply={onApply} onTalk={onTalk} />
    </>
  );
}

Object.assign(window, {
  V1ReviewsPage,
});
