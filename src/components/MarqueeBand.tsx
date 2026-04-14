import React from 'react';

const ROW_1 = [
  'CAPITAL',
  'REVENUE',
  'GROWTH',
  'SPEED',
  'FLEXIBLE',
  'NO DEBT',
  '24-HOUR FUNDING',
];

const ROW_2 = [
  'BUILT FOR BUSINESS',
  'POWERED BY DELT',
  'MAIN STREET',
  'MOMENTUM',
  'FUELED',
  'READY',
  'INSTANT OFFERS',
];

const SEP = '·';

/**
 * Full-bleed editorial marquee band shown above the footer.
 * Two oversized rows of pale-indigo uppercase text scrolling in opposite directions.
 */
export function MarqueeBand() {
  return (
    <section
      aria-hidden="true"
      className="relative bg-white py-16 sm:py-20 overflow-hidden select-none"
    >
      <MarqueeRow items={ROW_1} direction="left" />
      <div className="h-4" />
      <MarqueeRow items={ROW_2} direction="right" />
    </section>
  );
}

function MarqueeRow({ items, direction }: { items: string[]; direction: 'left' | 'right' }) {
  const content = items.flatMap((w, i) => [w, SEP]).slice(0, -1);
  return (
    <div className="marquee-group overflow-hidden">
      <div
        className={`marquee-track ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{ gap: '1.5rem' }}
      >
        {[...Array(2)].map((_, dup) => (
          <div key={dup} className="flex items-center gap-6 pr-6 shrink-0">
            {content.map((w, i) => (
              <span
                key={`${dup}-${i}`}
                className="font-black uppercase leading-none whitespace-nowrap"
                style={{
                  fontFamily: '"Codec Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 'clamp(64px, 10vw, 160px)',
                  color: 'var(--marquee-pale)',
                  letterSpacing: '-0.02em',
                }}
              >
                {w}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
