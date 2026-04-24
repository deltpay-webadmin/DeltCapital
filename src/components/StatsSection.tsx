import { useEffect, useRef, useState } from 'react';

const STATS = [
  { label: 'Deployed since 2019', value: '$200M+', dot: '#4F46E5' },
  { label: 'Businesses funded',   value: '2,850+', dot: '#0F7A5A' },
  { label: 'Median time to funds', value: '24h',   dot: '#4F46E5' },
  { label: 'Median factor rate',  value: '1.18×',  dot: '#0F7A5A' },
];

export function StatsSection() {
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
      { threshold: 0.15 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--paper)',
        padding: '80px 0 48px',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#4F46E5',
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          <span aria-hidden style={{ width: 18, height: 1, background: '#4F46E5' }} />
          The receipts
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
            fontWeight: 600,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            color: '#0F0E17',
            margin: 0,
            maxWidth: 720,
          }}
        >
          Seven years, one thesis — price capital fairly, fund it quickly.
        </h2>

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
            marginTop: 44,
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 500ms ease ${i * 80}ms, transform 500ms ease ${i * 80}ms`,
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
                    marginTop: 10,
                    fontFamily: 'var(--font-display)',
                    fontSize: 34,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#0F0E17',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
              </div>
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: s.dot,
                  flexShrink: 0,
                  boxShadow: `0 0 0 4px ${s.dot}1A`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
