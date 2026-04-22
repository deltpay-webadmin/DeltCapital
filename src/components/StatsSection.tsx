import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Lightweight count-up driven by requestAnimationFrame, kicked off once
 * the section enters the viewport. Replaces the previous anime.js setup.
 */
function useCountUp(target: number, durationMs = 1800, start: boolean) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    const t0 = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs);
      // outExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);

  return value;
}

interface StatCard {
  value: string | number;
  prefix?: string;
  suffix?: string;
  label: string;
  isStatic?: boolean;
  staticValue?: string;
  isHero?: boolean;
}

export function StatsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  // Headline count-up: 0 → 200
  const headline = useCountUp(200, 2000, inView);

  // Per-card count-up
  const businessesFunded = useCountUp(2850, 2200, inView);
  const satisfactionRate = useCountUp(96, 1800, inView);
  const averageAdvance = useCountUp(70, 1900, inView);

  const cards: StatCard[] = [
    {
      value: businessesFunded,
      suffix: '+',
      label: t('stats.businessesFunded'),
    },
    {
      value: satisfactionRate,
      suffix: '%',
      label: t('stats.satisfactionRate'),
    },
    {
      value: 0,
      isStatic: true,
      staticValue: '24-48hr',
      label: t('stats.avgFundingTime'),
    },
    {
      value: averageAdvance,
      prefix: '$',
      suffix: 'K',
      label: t('stats.averageAdvance'),
      isHero: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fafbfc] py-24 md:py-28"
    >
      {/* Soft mesh tint */}
      <div aria-hidden className="bg-mesh absolute inset-0 opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Top: hero headline + supporting copy ─── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 lg:mb-20">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="block uppercase text-[#0c66e4]"
              style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
            >
              By the numbers
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-gradient-primary tabular-nums mt-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.25rem, 9vw, 7rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
              }}
            >
              ${Math.round(headline)}M+
              <sup className="text-[0.25em] ml-2 align-top opacity-60">1</sup>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-5 text-[#172b4d] max-w-xl"
              style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.4 }}
            >
              {t('stats.capitalDelivered')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="lg:col-span-5"
          >
            <p className="text-[#44546f]" style={{ fontSize: 16, lineHeight: 1.7 }}>
              {t('stats.joinText')}
            </p>
            <p className="text-[#758195] mt-4" style={{ fontSize: 14, lineHeight: 1.7 }}>
              {t('stats.industryText')}
            </p>
          </motion.div>
        </div>

        {/* ─── Bento stat grid ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((card, i) => {
            const display = card.isStatic
              ? card.staticValue
              : `${card.prefix ?? ''}${
                  typeof card.value === 'number'
                    ? Math.round(card.value).toLocaleString()
                    : card.value
                }${card.suffix ?? ''}`;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`card-hover-lift relative rounded-2xl border bg-white p-6 md:p-7 ${
                  card.isHero
                    ? 'border-[#0c66e4]/25'
                    : 'border-[#dcdfe4]'
                }`}
                style={
                  card.isHero
                    ? {
                        boxShadow:
                          '0 8px 32px rgba(12,102,228,0.10), 0 2px 6px rgba(110,93,198,0.06)',
                      }
                    : undefined
                }
              >
                {/* Gradient ring on the hero tile */}
                {card.isHero && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                      padding: 1,
                      background:
                        'linear-gradient(135deg, rgba(12,102,228,0.55) 0%, rgba(110,93,198,0.4) 100%)',
                      WebkitMask:
                        'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />
                )}

                <div
                  className={`tabular-nums ${card.isHero ? 'text-gradient-primary' : 'text-[#172b4d]'}`}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.0,
                  }}
                >
                  {display}
                </div>

                {/* Accent underline */}
                <div
                  className="h-[2px] rounded-full mt-3 mb-3"
                  style={{
                    width: card.isHero ? 56 : 36,
                    background: card.isHero
                      ? 'linear-gradient(90deg, #0c66e4 0%, #6e5dc6 100%)'
                      : 'linear-gradient(90deg, #0c66e4 0%, #1d7afc 100%)',
                  }}
                />

                <div className="text-[#44546f] text-sm leading-relaxed">
                  {card.label}
                </div>

                {card.isHero && (
                  <div className="absolute top-4 right-4 text-[#0c66e4]/70">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ─── Disclaimer ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 pt-6 border-t border-[#dcdfe4]"
        >
          <p className="text-[#758195] italic text-xs leading-relaxed mt-4">
            <sup className="not-italic">1</sup> {t('stats.disclaimer')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
