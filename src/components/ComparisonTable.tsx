import { useEffect, useRef, useState } from 'react';

const ROWS = [
  { k: 'Speed to funds',     delt: '24 hours',           bank: '2–6 weeks',                  win: '20× faster',       strength: 0.98 },
  { k: 'Factor rate',        delt: '1.18×',              bank: '1.35–1.49×',                 win: '19% cheaper',      strength: 0.75 },
  { k: 'Paperwork',          delt: 'Plaid link',         bank: '3 mo statements + returns',  win: 'Zero files',       strength: 0.92 },
  { k: 'Credit pull',        delt: 'Soft inquiry',       bank: 'Hard pull',                  win: 'No FICO hit',      strength: 0.88 },
  { k: 'Collateral',         delt: 'None',               bank: 'PG + UCC',                   win: 'Unencumbered',     strength: 0.95 },
  { k: 'Prepayment penalty', delt: 'None',               bank: 'Full factor owed',           win: 'Early pays save',  strength: 1.00 },
];

const RESULT_STRIP = [
  { label: 'Median time to funds', value: '24h',  sub: 'vs 2–6 weeks at a bank', glyph: '⚡' },
  { label: 'Avg savings vs SBA',   value: '19%',  sub: 'on total cost of capital', glyph: '−' },
  { label: 'Paperwork required',   value: '0',    sub: 'Plaid replaces the file box', glyph: '⊘' },
];

export function ComparisonTable() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--paper)',
        padding: '120px 0',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
        {/* Heading row */}
        <div
          className="grid items-end"
          style={{ gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 48 }}
        >
          <div>
            <Eyebrow>Banks vs Delt</Eyebrow>
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
              Why Delt beats
              <br />
              the bank.
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              maxWidth: 460,
              justifySelf: 'end',
              fontFamily: 'var(--font-body)',
              fontSize: 16.5,
              lineHeight: 1.6,
              color: 'var(--ink-soft)',
            }}
          >
            Every row is a median across the last 12 months of our book, measured against
            publicly-reported bank SBA 7(a) averages. Updated quarterly.
          </p>
        </div>

        {/* Unified comparison frame */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--line)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow:
              '0 1px 2px rgba(15,14,23,0.03), 0 40px 80px -50px rgba(15,14,23,0.18)',
          }}
        >
          {/* Column headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr 1fr',
              background: 'var(--paper-warm)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div style={{ padding: '22px 28px' }}>
              <Eyebrow color="var(--ink-mute)">Metric</Eyebrow>
            </div>
            <HeaderCell
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 14h12M3 14V8M6 14V8M10 14V8M13 14V8M1.5 7h13L8 2 1.5 7z" />
                </svg>
              }
              title="Traditional bank"
              subtitle="SBA 7(a) median"
              muted
            />
            <HeaderCell
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M8 1L2 8h4l-1 5 6-7H7l1-5z" />
                </svg>
              }
              title={
                <>
                  Delt
                  <span style={{ color: '#4F46E5' }}>.</span>
                </>
              }
              subtitle="Live book · Q4 trailing"
              accent
            />
          </div>

          {/* Rows */}
          {ROWS.map((r, i) => (
            <Row key={r.k} row={r} visible={visible} last={i === ROWS.length - 1} index={i} />
          ))}
        </div>

        {/* Result strip */}
        <div
          className="grid"
          style={{ marginTop: 24, gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
        >
          {RESULT_STRIP.map((s) => (
            <div
              key={s.label}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: '22px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10.5,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: 'var(--font-display)',
                    fontSize: 32,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#0F0E17',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: 'var(--font-body)',
                    fontSize: 12.5,
                    color: 'var(--ink-mute)',
                  }}
                >
                  {s.sub}
                </div>
              </div>
              <span
                aria-hidden
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(79,70,229,0.06)',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {s.glyph}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      <span aria-hidden style={{ display: 'inline-block', width: 18, height: 1, background: color }} />
      {children}
    </span>
  );
}

function HeaderCell({
  icon,
  title,
  subtitle,
  muted = false,
  accent = false,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        padding: '22px 28px',
        borderLeft: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: accent ? 'linear-gradient(90deg, rgba(79,70,229,0.05), transparent)' : undefined,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: accent
            ? 'linear-gradient(135deg, #4F46E5, #A78BFA)'
            : 'rgba(106,104,118,0.10)',
          color: accent ? '#fff' : 'var(--ink-mute)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: accent ? '0 4px 12px rgba(79,70,229,0.33)' : 'none',
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: muted ? 600 : 700,
            color: muted ? 'var(--ink-mute)' : '#0F0E17',
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: muted ? 'var(--ink-mute)' : '#4F46E5',
            opacity: muted ? 0.7 : 0.9,
            marginTop: 2,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function Row({
  row,
  visible,
  last,
  index,
}: {
  row: (typeof ROWS)[number];
  visible: boolean;
  last: boolean;
  index: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 1fr',
        borderBottom: last ? 'none' : '1px solid var(--line)',
        minHeight: 88,
        alignItems: 'center',
      }}
    >
      <div style={{ padding: '22px 28px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          {`Row ${String(index + 1).padStart(2, '0')}`}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 600,
            color: '#0F0E17',
            letterSpacing: '-0.015em',
          }}
        >
          {row.k}
        </div>
      </div>

      <div
        style={{
          padding: '22px 28px',
          borderLeft: '1px solid var(--line)',
          fontFamily: 'var(--font-body)',
          fontSize: 15.5,
          color: 'var(--ink-mute)',
          textDecoration: 'line-through',
          textDecorationColor: 'rgba(106,104,118,0.45)',
        }}
      >
        {row.bank}
      </div>

      <div
        style={{
          padding: '22px 28px',
          borderLeft: '1px solid var(--line)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: '#0F0E17',
            letterSpacing: '-0.015em',
          }}
        >
          {row.delt}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#4F46E5',
            background: 'rgba(79,70,229,0.08)',
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          {row.win}
        </span>
        {/* strength bar */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 28,
            right: 28,
            bottom: 0,
            height: 2,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
            transform: `scaleX(${visible ? row.strength : 0})`,
            transformOrigin: 'left',
            transition: `transform 900ms cubic-bezier(0.25,0.46,0.45,0.94) ${index * 120 + 200}ms`,
          }}
        />
      </div>
    </div>
  );
}
