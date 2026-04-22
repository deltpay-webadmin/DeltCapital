import { Star, Quote } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

const testimonials = [
  {
    quote:
      'The funding from Delt Capital allowed us to open our second location 6 months ahead of schedule. The process was incredibly smooth and fast!',
    name: 'Maria Rodriguez',
    business: 'La Rosa Restaurant',
    industry: 'Restaurant',
    funded: '$110K',
  },
  {
    quote:
      "With Delt's revenue-based financing, I was able to upgrade all my equipment without the stress of traditional bank loans. Game changer for my business.",
    name: 'Mike Rosario',
    business: 'Rosario Construction LLC',
    industry: 'Construction',
    funded: '$180K',
  },
  {
    quote:
      'I was nervous about taking on financing, but Delt made it so easy. Now my salon is thriving with our new spa services!',
    name: 'Sarah Thompson',
    business: 'Bloom Beauty Salon',
    industry: 'Beauty & Wellness',
    funded: '$65K',
  },
  {
    quote:
      'Delt Capital helped me seize a time-sensitive opportunity to upgrade my operation. Their speed and flexibility were exactly what I needed.',
    name: 'Marcus Williams',
    business: 'Williams Logistics',
    industry: 'Transportation',
    funded: '$80K',
  },
  {
    quote:
      'The holiday season was approaching, and I needed capital fast to stock up. Delt came through in record time!',
    name: 'Emily Ward',
    business: "Emily's Market",
    industry: 'Retail',
    funded: '$50K',
  },
  {
    quote:
      "Traditional banks turned me down, but Delt saw the potential in my business. Now I'm taking on larger projects than ever!",
    name: 'David Roberts',
    business: 'Roberts Auto Service',
    industry: 'Automotive',
    funded: '$95K',
  },
];

const loopedTestimonials = [...testimonials, ...testimonials];

export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const totalOriginalWidth = useRef(0);

  // Re-measure on mount + resize
  const measure = useCallback(() => {
    if (!trackRef.current) return;
    const firstCard = trackRef.current.children[0] as HTMLElement | undefined;
    if (!firstCard) return;
    const gap = 24;
    const w = firstCard.offsetWidth + gap;
    totalOriginalWidth.current = w * testimonials.length;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => {
    if (!totalOriginalWidth.current) return;
    const speed = 0.55; // slightly slower for readability

    const tick = () => {
      if (!isPaused) {
        offsetRef.current += speed;
        if (offsetRef.current >= totalOriginalWidth.current) {
          offsetRef.current -= totalOriginalWidth.current;
        }
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  return (
    <section className="relative bg-[#f6f9fc] py-24 md:py-28 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-14"
        >
          <span
            className="inline-flex items-center gap-2 uppercase text-[#0c66e4]"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: '0.18em',
            }}
          >
            <span aria-hidden className="inline-block w-4 h-px" style={{ background: '#0c66e4' }} />
            What our merchants say
          </span>
          <h2
            className="mt-5 text-[#0a2540]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.2vw, 3.25rem)',
              fontWeight: 600,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            Stories from the field.
          </h2>
          <p className="mt-4 text-[#425466]" style={{ fontSize: 17, lineHeight: 1.55 }}>
            Real operators. Real funding. Real outcomes.
          </p>
        </motion.div>
      </div>

      {/* Marquee — full-bleed for cinematic feel */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Wider gradient fade edges */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-48 z-10"
          style={{ background: 'linear-gradient(to right, #f6f9fc 10%, rgba(250,251,252,0))' }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-48 z-10"
          style={{ background: 'linear-gradient(to left, #f6f9fc 10%, rgba(250,251,252,0))' }}
        />

        <div ref={trackRef} className="flex gap-6 px-6" style={{ willChange: 'transform' }}>
          {loopedTestimonials.map((tst, i) => (
            <article
              key={`${tst.name}-${i}`}
              className="card-hover-lift shrink-0 relative bg-white border border-[#dcdfe4] rounded-2xl p-7 flex flex-col"
              style={{
                width: 'min(420px, 80vw)',
                boxShadow: '0 1px 3px rgba(9,30,66,0.04), 0 8px 24px -12px rgba(9,30,66,0.06)',
              }}
            >
              {/* Quote glyph watermark */}
              <Quote
                aria-hidden
                className="absolute top-5 right-5 w-7 h-7 text-[#0c66e4]/12"
                strokeWidth={2}
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-[#b65c02] text-[#b65c02]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-[#0a2540] leading-relaxed flex-1"
                style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.55 }}
              >
                "{tst.quote}"
              </p>

              {/* Attribution row */}
              <div className="mt-6 pt-5 border-t border-[#dcdfe4] flex items-center justify-between">
                <div>
                  <div
                    className="text-[#0a2540]"
                    style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em' }}
                  >
                    {tst.name}
                  </div>
                  <div className="text-[#425466] text-xs mt-0.5">
                    {tst.business} · {tst.industry}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className="text-[#0c66e4] tabular-nums"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {tst.funded}
                  </span>
                  <span
                    className="uppercase text-[#697386]"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9.5,
                      letterSpacing: '0.18em',
                      fontWeight: 600,
                    }}
                  >
                    Funded
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
