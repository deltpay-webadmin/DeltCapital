const TESTIMONIALS = [
  {
    featured: true,
    quote:
      'Closed in 19 hours. The bank still hasn\'t returned my call. Delt priced it on our trailing-12, not on my story.',
    name: 'Maria Rodriguez',
    business: 'La Rosa Restaurant',
    industry: 'Restaurant · TX',
    funded: '$110K',
    factor: '1.16×',
    time: '19h',
  },
  {
    quote: 'Third draw with Delt. Every rate has been lower than the last. That doesn\'t happen at a bank.',
    name: 'Mike Rosario',
    business: 'Rosario Construction',
    industry: 'Construction · NY',
    funded: '$180K',
    factor: '1.14×',
  },
  {
    quote: 'Factor rate on the first email. No games, no callbacks, no "advisor" asking what my cash looks like.',
    name: 'Sarah Thompson',
    business: 'Bloom Beauty',
    industry: 'Beauty · FL',
    funded: '$65K',
    factor: '1.19×',
  },
  {
    quote: 'Paid early and they actually rebated the unearned factor. Unheard of in MCA.',
    name: 'Marcus Williams',
    business: 'Williams Logistics',
    industry: 'Logistics · NJ',
    funded: '$80K',
    factor: '1.17×',
  },
  {
    quote: 'I forwarded the offer to my CFO — she said "take it, I can\'t beat that."',
    name: 'Emily Ward',
    business: 'Ward Market',
    industry: 'Retail · WA',
    funded: '$50K',
    factor: '1.18×',
  },
  {
    quote: 'Underwriter called me by name and knew my book. Not a call center.',
    name: 'David Roberts',
    business: 'Roberts Auto',
    industry: 'Auto · IL',
    funded: '$95K',
    factor: '1.15×',
  },
];

export function TestimonialsSection() {
  return (
    <section
      style={{
        background: 'var(--paper)',
        padding: '120px 0',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <Eyebrow>Operators, on the record</Eyebrow>
            <h2
              style={{
                marginTop: 18,
                marginBottom: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 600,
                letterSpacing: '-0.035em',
                lineHeight: 1.05,
                color: '#0F0E17',
              }}
            >
              Said by the people
              <br />
              who actually paid it back.
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              justifySelf: 'end',
              maxWidth: 460,
              fontFamily: 'var(--font-body)',
              fontSize: 16.5,
              lineHeight: 1.6,
              color: 'var(--ink-soft)',
            }}
          >
            Every quote below is a Delt customer with a closed deal file. We verify employment, funding amount, and factor on every entry before it goes up.
          </p>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoFlow: 'dense',
            gap: 20,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name + i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  const featured = t.featured;
  const color = featured ? '#F7F5F0' : '#0F0E17';
  const subColor = featured ? 'rgba(231,227,218,0.65)' : 'var(--ink-mute)';
  const bg = featured ? '#0F0E17' : '#FFFFFF';
  const border = featured ? 'transparent' : 'var(--line)';

  return (
    <article
      style={{
        gridColumn: featured ? 'span 2' : 'span 1',
        gridRow: featured ? 'span 2' : 'span 1',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        padding: featured ? '44px 44px 36px' : '28px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 220,
        overflow: 'hidden',
      }}
    >
      {featured && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 10,
            right: 24,
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 200,
            lineHeight: 1,
            color: 'rgba(124,58,237,0.22)',
            pointerEvents: 'none',
          }}
        >
          &ldquo;
        </span>
      )}

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: featured ? '#C4B5FD' : '#4F46E5',
          fontWeight: 600,
        }}
      >
        {featured ? 'Featured operator' : t.industry}
      </div>

      <p
        style={{
          marginTop: 16,
          marginBottom: 'auto',
          fontFamily: 'var(--font-display)',
          fontSize: featured ? 'clamp(1.5rem, 2.4vw, 2rem)' : '1.0625rem',
          fontWeight: 500,
          letterSpacing: featured ? '-0.025em' : '-0.01em',
          lineHeight: 1.25,
          color,
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center justify-between gap-4" style={{ marginTop: 28 }}>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            style={{
              width: featured ? 44 : 36,
              height: featured ? 44 : 36,
              borderRadius: 999,
              background: featured
                ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
                : 'var(--paper-warm)',
              border: featured ? 'none' : '1px solid var(--line)',
              color: featured ? '#fff' : 'var(--ink-mute)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: featured ? 15 : 13,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              flexShrink: 0,
            }}
          >
            {t.name
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')}
          </span>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 600,
                color,
                letterSpacing: '-0.01em',
              }}
            >
              {t.name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12.5,
                color: subColor,
              }}
            >
              {t.business}
              {featured ? ` · ${t.industry}` : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Metric label="Funded" value={t.funded} featured={!!featured} />
          <span
            aria-hidden
            style={{
              width: 1,
              height: 28,
              background: featured ? 'rgba(231,227,218,0.16)' : 'var(--line)',
            }}
          />
          <Metric label="Factor" value={t.factor} featured={!!featured} />
          {featured && t.time && (
            <>
              <span
                aria-hidden
                style={{
                  width: 1,
                  height: 28,
                  background: 'rgba(231,227,218,0.16)',
                }}
              />
              <Metric label="Funded in" value={t.time} featured />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  featured,
}: {
  label: string;
  value?: string;
  featured: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: featured ? 'rgba(231,227,218,0.55)' : 'var(--ink-mute)',
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 2,
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: featured ? '#F7F5F0' : '#0F0E17',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Eyebrow({ children, color = '#4F46E5' }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color,
      }}
    >
      <span
        aria-hidden
        style={{ display: 'inline-block', width: 18, height: 1, background: color }}
      />
      {children}
    </span>
  );
}
