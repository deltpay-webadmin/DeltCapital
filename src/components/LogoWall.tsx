import React from 'react';

const BUSINESSES = [
  'Basecamp Outdoors',
  'Lumen Salon',
  'Horizon Brewing',
  'Crestview Dental',
  'Sage & Vine',
  'Northpoint Auto',
  'Tidal Wave Surf',
  'Copper Lane Café',
  'Sterling Home Services',
  'Jade Wellness Studio',
];

/**
 * Logo-wall band that sits directly under the Hero and softens the transition
 * from the dark hero into the white page body.
 */
export function LogoWall() {
  return (
    <section className="relative bg-white py-10 sm:py-14 border-b border-[#E4E7EB]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#9AA5B1]">
          Trusted by growing businesses nationwide
        </div>

        {/* Desktop: static flex row */}
        <div className="hidden md:flex mt-7 items-center justify-between gap-6 lg:gap-10 text-[#9AA5B1]">
          {BUSINESSES.slice(0, 8).map((b) => (
            <span
              key={b}
              className="text-sm lg:text-base font-semibold tracking-wide whitespace-nowrap hover:text-[#041E42] transition-colors"
            >
              {b}
            </span>
          ))}
        </div>

        {/* Mobile: marquee */}
        <div className="md:hidden mt-6 marquee-group overflow-hidden">
          <div className="marquee-track marquee-left">
            {[...BUSINESSES, ...BUSINESSES].map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="text-sm font-semibold tracking-wide text-[#9AA5B1] whitespace-nowrap"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
