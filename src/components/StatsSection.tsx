import { useLanguage } from '../contexts/LanguageContext';
import { useRef, useEffect, useCallback } from 'react';
import { animate, stagger } from 'animejs';

/*
 * ══════════════════════════════════════════════════════════════
 * STATS SECTION — Institutional Capital Aesthetic
 * ══════════════════════════════════════════════════════════════
 *
 * ANIME.JS v4 SCROLL-TRIGGERED ANIMATION SPEC
 * ─────────────────────────────────────────────
 * Trigger:  IntersectionObserver, once, enter bottom 80%
 * All elements start opacity: 0 (set via JS after mount).
 *
 * Sequence:
 *   1. "$200M+" headline — count 0→200, outExpo 2s, fade in
 *   2. Subtitle — fade + translateY, 400ms delay
 *   3. Four stat cards — translateY 30→0, scale 0.95→1, stagger(120)
 *   4. Card counters — count up staggered (2850, 96, 70; "24-48hr" fades)
 *   5. Indigo underlines — width 0→100%
 *   6. Right paragraphs — fade up, stagger(200)
 *   7. Bottom divider — width 0→100%
 *   8. Disclaimer — fade to 0.5
 */

/* Card config — static, defined outside component */
const CARD_DEFS = [
  {
    endValue: 2850,
    modifier: (v: number) => `${v.toLocaleString()}+`,
    labelKey: 'stats.businessesFunded',
    isHierarchy: false,
    gridPos: 'col-start-1 row-start-1',
    staticValue: null,
    initText: '0+',
  },
  {
    endValue: 96,
    modifier: (v: number) => `${v}%`,
    labelKey: 'stats.satisfactionRate',
    isHierarchy: false,
    gridPos: 'col-start-2 row-start-1',
    staticValue: null,
    initText: '0%',
  },
  {
    endValue: null,
    modifier: null,
    labelKey: 'stats.avgFundingTime',
    isHierarchy: false,
    gridPos: 'col-start-1 row-start-2',
    staticValue: '24-48hr',
    initText: '24-48hr',
  },
  {
    endValue: 70,
    modifier: (v: number) => `$${v}K`,
    labelKey: 'stats.averageAdvance',
    isHierarchy: true,
    gridPos: 'col-start-2 row-start-2',
    staticValue: null,
    initText: '$0K',
  },
] as const;

export function StatsSection() {
  const { t } = useLanguage();

  /* ─── Refs ─── */
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const underlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightParagraphs = useRef<(HTMLParagraphElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);
  const isReady = useRef(false);

  /* ─── Gather all animated elements ─── */
  const getAllAnimatedEls = useCallback(() => {
    const els: HTMLElement[] = [];
    if (headlineRef.current) els.push(headlineRef.current);
    if (subtitleRef.current) els.push(subtitleRef.current);
    cardsRef.current.forEach((el) => el && els.push(el));
    counterRefs.current.forEach((el) => el && els.push(el));
    underlineRefs.current.forEach((el) => el && els.push(el));
    labelRefs.current.forEach((el) => el && els.push(el));
    rightParagraphs.current.forEach((el) => el && els.push(el));
    if (dividerRef.current) els.push(dividerRef.current);
    if (disclaimerRef.current) els.push(disclaimerRef.current);
    return els;
  }, []);

  /* ─── Set all elements to hidden initial state ─── */
  const setInitialHiddenState = useCallback(() => {
    // Headline
    if (headlineRef.current) {
      headlineRef.current.style.opacity = '0';
      headlineRef.current.textContent = '$0M+';
    }
    // Subtitle
    if (subtitleRef.current) {
      subtitleRef.current.style.opacity = '0';
      subtitleRef.current.style.transform = 'translateY(10px)';
    }
    // Cards
    cardsRef.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px) scale(0.95)';
    });
    // Counter values — visible inside card, but card itself hidden
    counterRefs.current.forEach((el, i) => {
      if (!el) return;
      if (CARD_DEFS[i].staticValue) {
        el.style.opacity = '0'; // "24-48hr" fades in separately
      }
    });
    // Underlines
    underlineRefs.current.forEach((el) => {
      if (!el) return;
      el.style.width = '0%';
      el.style.opacity = '0';
    });
    // Labels
    labelRefs.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = '0';
    });
    // Right paragraphs
    rightParagraphs.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });
    // Divider
    if (dividerRef.current) {
      dividerRef.current.style.width = '0%';
      dividerRef.current.style.opacity = '0';
    }
    // Disclaimer
    if (disclaimerRef.current) {
      disclaimerRef.current.style.opacity = '0';
    }
  }, []);

  /* ─── Fire all animations ─── */
  const runAnimations = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // ── 1. Headline "$200M+" count-up + fade ──
    if (headlineRef.current) {
      const el = headlineRef.current;
      const proxy = { val: 0 };
      animate(proxy, {
        val: 200,
        duration: 2000,
        ease: 'outExpo',
        onUpdate: () => {
          el.textContent = `$${Math.round(proxy.val)}M+`;
        },
        onComplete: () => {
          el.textContent = '$200M+';
        },
      });
      animate(el, {
        opacity: [0, 1],
        duration: 800,
        ease: 'outQuad',
      });
    }

    // ── 2. Subtitle fade + slide up (400ms delay) ──
    if (subtitleRef.current) {
      animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 600,
        ease: 'outQuad',
        delay: 400,
      });
    }

    // ── 3. Stat cards fade up with stagger ──
    const cardEls = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cardEls.length) {
      animate(cardEls, {
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        duration: 700,
        ease: 'outQuad',
        delay: stagger(120, { start: 800 }),
      });
    }

    // ── 4. Card counter count-ups (staggered after cards appear) ──
    counterRefs.current.forEach((el, i) => {
      if (!el) return;
      const card = CARD_DEFS[i];
      if (card.endValue !== null && card.modifier) {
        const mod = card.modifier;
        const endVal = card.endValue;
        const proxy = { val: 0 };
        animate(proxy, {
          val: endVal,
          duration: 1800,
          ease: 'outExpo',
          delay: 1000 + i * 150,
          onUpdate: () => {
            el.textContent = mod(Math.round(proxy.val));
          },
          onComplete: () => {
            el.textContent = mod(endVal);
          },
        });
      } else {
        // "24-48hr" — just fade in
        animate(el, {
          opacity: [0, 1],
          duration: 500,
          delay: 1000 + i * 150,
          ease: 'outQuad',
        });
      }
    });

    // ── 5. Labels fade in ──
    const labelEls = labelRefs.current.filter(Boolean) as HTMLDivElement[];
    if (labelEls.length) {
      animate(labelEls, {
        opacity: [0, 1],
        duration: 500,
        ease: 'outQuad',
        delay: stagger(120, { start: 1200 }),
      });
    }

    // ── 5b. Indigo underlines width 0→100% ──
    const underlineEls = underlineRefs.current.filter(Boolean) as HTMLDivElement[];
    if (underlineEls.length) {
      animate(underlineEls, {
        width: ['0%', '100%'],
        opacity: [0, 1],
        duration: 600,
        ease: 'outQuad',
        delay: stagger(120, { start: 1400 }),
      });
    }

    // ── 6. Right-side paragraphs fade up ──
    const rightEls = rightParagraphs.current.filter(Boolean) as HTMLParagraphElement[];
    if (rightEls.length) {
      animate(rightEls, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
        ease: 'outQuad',
        delay: stagger(200, { start: 600 }),
      });
    }

    // ── 7. Bottom divider draws across ──
    if (dividerRef.current) {
      animate(dividerRef.current, {
        width: ['0%', '100%'],
        opacity: [0, 1],
        duration: 800,
        ease: 'outQuad',
        delay: 2000,
      });
    }

    // ── 8. Disclaimer fades to 0.5 last ──
    if (disclaimerRef.current) {
      animate(disclaimerRef.current, {
        opacity: [0, 0.5],
        duration: 600,
        ease: 'outQuad',
        delay: 2400,
      });
    }
  }, []);

  /* ─── Phase 1: Set initial hidden state after mount ─── */
  useEffect(() => {
    // Wait one frame so all refs are attached, then hide everything
    requestAnimationFrame(() => {
      setInitialHiddenState();
      // Mark ready after browser paints the hidden state
      requestAnimationFrame(() => {
        isReady.current = true;
      });
    });
  }, [setInitialHiddenState]);

  /* ─── Phase 2: IntersectionObserver watches for scroll-in ─── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isReady.current) {
          // Double-rAF ensures the hidden state is painted before we animate
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              runAnimations();
            });
          });
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20% 0px', // must enter 20% from bottom
      },
    );

    // Small delay before observing so Phase 1 finishes first
    const timer = setTimeout(() => {
      observer.observe(section);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [runAnimations]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fafbfc]"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ═══════════ LEFT COLUMN ═══════════ */}
          <div>
            {/* ── Headline: $200M+ ── */}
            <div>
              <h2
                ref={headlineRef}
                className="font-bold text-[#172b4d] mb-1 tracking-tight"
                style={{ fontSize: 'clamp(3rem, 5.5vw, 4.5rem)', lineHeight: 1.05 }}
              >
                $0M+
              </h2>
            </div>

            {/* ── Subtitle ── */}
            <p
              ref={subtitleRef}
              className="text-[#44546f] mb-12 lg:mb-14"
              style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)' }}
            >
              {t('stats.capitalDelivered')}<sup className="text-[0.6em] ml-0.5 opacity-60">1</sup>
            </p>

            {/* ── Metric Cards Grid ── */}
            <div className="grid grid-cols-2 gap-4 lg:gap-5">
              {CARD_DEFS.map((card, i) => {
                const isHierarchy = !!card.isHierarchy;

                return (
                  <div
                    key={i}
                    ref={(el) => { cardsRef.current[i] = el; }}
                    className={`${card.gridPos} relative`}
                  >
                    {/* Card surface */}
                    <div
                      className={`
                        rounded-xl px-6 py-5 lg:px-7 lg:py-6
                        bg-[#f1f2f4]
                        backdrop-blur-sm
                        border border-[#E0E2EA]
                        ${isHierarchy
                          ? 'shadow-[0_2px_20px_-4px_rgba(27,23,255,0.10)] ring-1 ring-[#0c66e4]/8'
                          : 'shadow-[0_1px_8px_-2px_rgba(4,30,66,0.06)]'
                        }
                      `}
                    >
                      {/* Metric value */}
                      <div
                        ref={(el) => { counterRefs.current[i] = el; }}
                        className={`
                          font-bold tracking-tight text-[#172b4d] mb-0.5
                          ${isHierarchy ? 'text-[1.75rem] lg:text-[2rem]' : 'text-[1.6rem] lg:text-[1.85rem]'}
                        `}
                        style={{ lineHeight: 1.2 }}
                      >
                        {card.initText}
                      </div>

                      {/* ── Violet accent line ── */}
                      <div
                        ref={(el) => { underlineRefs.current[i] = el; }}
                        className="h-[2px] rounded-full mb-2 mt-1"
                        style={{
                          background: isHierarchy
                            ? 'linear-gradient(90deg, #0c66e4 0%, #6C63FF 100%)'
                            : 'linear-gradient(90deg, #0c66e4 0%, #9B97FF 100%)',
                          transformOrigin: 'left center',
                          maxWidth: isHierarchy ? '56px' : '40px',
                        }}
                      />

                      {/* Label */}
                      <div
                        ref={(el) => { labelRefs.current[i] = el; }}
                        className="text-[0.8rem] lg:text-[0.85rem] text-[#7B8794] tracking-wide"
                      >
                        {t(card.labelKey)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════════ RIGHT COLUMN ═══════════ */}
          <div className="lg:pt-24">
            {/* Paragraph 1 */}
            <p
              ref={(el) => { rightParagraphs.current[0] = el; }}
              className="text-[1.05rem] lg:text-[1.1rem] text-[#172b4d] leading-[1.75] mb-6"
            >
              {t('stats.joinText')}
            </p>

            {/* Paragraph 2 */}
            <p
              ref={(el) => { rightParagraphs.current[1] = el; }}
              className="text-[0.95rem] lg:text-[1rem] text-[#616E7C] leading-[1.8]"
            >
              {t('stats.industryText')}
            </p>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="mt-12 pt-6">
          <div
            ref={dividerRef}
            className="border-t border-[#D8DAE3]"
          />
          <p
            ref={disclaimerRef}
            className="text-[0.7rem] text-[#758195] italic leading-relaxed mt-8"
          >
            {t('stats.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
}