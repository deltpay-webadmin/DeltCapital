import { Star } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

const testimonials = [
  {
    quote: '"The funding from Delt Capital allowed us to open our second location 6 months ahead of schedule. The process was incredibly smooth and fast!"',
    name: 'Maria Rodriguez',
    business: 'La Rosa Restaurant',
    industry: 'Restaurant',
    funded: '$110K',
  },
  {
    quote: '"With Delt\'s Revenue-Based Financing, I was able to upgrade all my equipment without the stress of traditional bank loans. Game changer for my business."',
    name: 'Mike Rosario',
    business: 'Rosario Construction LLC',
    industry: 'Construction',
    funded: '$180K',
  },
  {
    quote: '"I was nervous about taking on financing, but Delt made it so easy. Now my salon is thriving with our new spa services!"',
    name: 'Sarah Thompson',
    business: 'Bloom Beauty Salon',
    industry: 'Beauty & Wellness',
    funded: '$65K',
  },
  {
    quote: '"Delt Capital helped me seize a time-sensitive opportunity to upgrade my operation. Their speed and flexibility were exactly what I needed."',
    name: 'Marcus Williams',
    business: 'Williams Logistics',
    industry: 'Transportation',
    funded: '$80K',
  },
  {
    quote: '"The holiday season was approaching, and I needed capital fast to stock up. Delt came through in record time!"',
    name: 'Emily Ward',
    business: "Emily's Market",
    industry: 'Retail',
    funded: '$50K',
  },
  {
    quote: '"Traditional banks turned me down, but Delt saw the potential in my business. Now I\'m taking on larger projects than ever!"',
    name: 'David Roberts',
    business: 'Roberts Auto Service',
    industry: 'Automotive',
    funded: '$95K',
  },
];

// Duplicate the list for seamless infinite loop
const loopedTestimonials = [...testimonials, ...testimonials];

export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const [cardWidth, setCardWidth] = useState(0);
  const totalOriginalWidth = useRef(0);

  // Measure card width on mount / resize
  const measure = useCallback(() => {
    if (!trackRef.current) return;
    const firstCard = trackRef.current.children[0] as HTMLElement | undefined;
    if (!firstCard) return;
    const gap = 24; // gap-6 = 24px
    const w = firstCard.offsetWidth + gap;
    setCardWidth(w);
    totalOriginalWidth.current = w * testimonials.length;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Continuous scroll animation
  useEffect(() => {
    if (!totalOriginalWidth.current) return;
    const speed = 1; // px per frame (~60px/s at 60fps)

    const animate = () => {
      if (!isPaused) {
        offsetRef.current += speed;
        // Reset seamlessly when we've scrolled past the first set
        if (offsetRef.current >= totalOriginalWidth.current) {
          offsetRef.current -= totalOriginalWidth.current;
        }
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, cardWidth]);

  return (
    <section className="py-20 bg-[#fafbfc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#172b4d',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          What our merchants say
        </h2>
        <p
          className="text-center mb-10"
          style={{ fontSize: '15px', color: 'rgba(4,30,66,0.45)' }}
        >
          Real stories from businesses funded by Delt Capital
        </p>

        {/* Carousel container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10" style={{ background: 'linear-gradient(to right, #fafbfc, transparent)' }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10" style={{ background: 'linear-gradient(to left, #fafbfc, transparent)' }} />

          {/* Scrolling track */}
          <div
            ref={trackRef}
            className="flex gap-6"
            style={{ willChange: 'transform' }}
          >
            {loopedTestimonials.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="shrink-0"
                style={{
                  width: 'min(420px, 80vw)',
                  background: '#f1f2f4',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid rgba(73,69,255,0.06)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-[#0c66e4] text-[#0c66e4]"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="mb-5 leading-relaxed"
                  style={{ fontSize: '15px', color: '#172b4d', minHeight: '72px' }}
                >
                  {t.quote}
                </p>

                {/* Attribution */}
                <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>
                  <span className="font-semibold" style={{ color: '#0c66e4' }}>
                    {t.name}
                  </span>
                  {' · '}
                  {t.business} · {t.industry}
                  {' · '}
                  Funded: {t.funded}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}