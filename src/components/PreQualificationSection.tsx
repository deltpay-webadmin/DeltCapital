import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from 'react';
import { X, Sparkles } from 'lucide-react';
import { PreQualificationGame } from './PreQualificationGame';
import phoneMockup from 'figma:asset/71c57b806f1b63be76a88b51a3a97efac7f0c5ee.png';
import { useLanguage } from '../contexts/LanguageContext';
import { animate } from 'animejs';

/*
 * ══════════════════════════════════════════════════════════════
 * PRE-QUALIFICATION SECTION — Institutional Capital Aesthetic
 * ══════════════════════════════════════════════════════════════
 *
 * MOTION SPEC (AnimeJS)
 * ─────────────────────
 * Trigger: IntersectionObserver (once, 20% threshold)
 * Ease:    'easeInOutQuad' / 'easeOutCubic' — measured, no bounce
 *
 * ENTRANCE TIMELINE (plays once on scroll-into-view):
 * ───────────────────────────────────────────────────
 * T + 0ms     │ Sparkles icon  — opacity 0→1, scale 0.6→1, 600ms
 * T + 150ms    Headline       — opacity 0→1, translateY 24→0, 700ms
 * T + 300ms   │ Subtitle       — opacity 0→1, translateY 18→0, 600ms
 * T + 400ms   │ Questions line — opacity 0→1, translateY 14→0, 600ms
 * T + 500ms   │ Bullet points  — opacity 0→1, translateY 10→0, 500ms
 * T + 650ms   │ CTA button     — opacity 0→1, translateX -20→0, 600ms
 * T + 750ms   │ Badges         — opacity 0→1, translateY 8→0, 500ms
 * T + 900ms   │ Join text      — opacity 0→1, 400ms
 *
 * T + 200ms   │ Phone          — opacity 0→1, translateY 60→0,
 *             │                   rotateY -8→-12°, rotateX 4→2°,
 *             │                   rotateZ 0→1°, 1000ms easeOutCubic
 * T + 1200ms  │ Phone shadow   — opacity 0→0.35, scaleX 0.7→1, 600ms
 *
 * AMBIENT LOOP (after entrance):
 * ──────────────────────────────
 * Phone float  — translateY ±6px, 4000ms, easeInOutSine, infinite
 * Shadow pulse — scaleX 0.95↔1.05, opacity 0.3↔0.4, 4000ms, synced
 *
 * BG orbs      — STATIC gradients, no pulsing (institutional)
 */

interface PreQualificationSectionProps {
  onApplyClick?: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
}

export interface PreQualificationSectionRef {
  openQuiz: () => void;
  scrollToSection: () => void;
}

export const PreQualificationSection = forwardRef<PreQualificationSectionRef, PreQualificationSectionProps>(({ onApplyClick, onApplyFromQuiz, onCalculatorClick }, ref) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Refs for each animatable text element
  const iconRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const joinRef = useRef<HTMLParagraphElement>(null);

  useImperativeHandle(ref, () => ({
    openQuiz: () => setShowModal(true),
    scrollToSection: () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }));

  // Lock body scroll when quiz modal or results are open
  useEffect(() => {
    if (showModal || showResults) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal, showResults]);

  /* ─── AnimeJS entrance timeline + ambient loop ─── */
  const runAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Collect all entrance targets and their configs
    const entranceAnims: { targets: HTMLElement; props: Record<string, any>; offset: number }[] = [];

    if (iconRef.current) entranceAnims.push({
      targets: iconRef.current,
      props: { opacity: [0, 1], scale: [0.6, 1] },
      offset: 0,
    });
    if (headlineRef.current) entranceAnims.push({
      targets: headlineRef.current,
      props: { opacity: [0, 1], translateY: [24, 0] },
      offset: 150,
    });
    if (subtitleRef.current) entranceAnims.push({
      targets: subtitleRef.current,
      props: { opacity: [0, 1], translateY: [18, 0] },
      offset: 300,
    });
    if (ctaRef.current) entranceAnims.push({
      targets: ctaRef.current,
      props: { opacity: [0, 1], translateX: [-20, 0] },
      offset: 650,
    });
    if (joinRef.current) entranceAnims.push({
      targets: joinRef.current,
      props: { opacity: [0, 1] },
      offset: 900,
    });

    // Run all entrance animations with individual delays
    const entrancePromises = entranceAnims.map(({ targets, props, offset }) => {
      const duration = offset >= 900 ? 400 : 600;
      const anim = animate(targets, {
        ...props,
        duration,
        ease: 'inOutQuad',
        delay: offset,
      });
      return anim.then ? anim : Promise.resolve();
    });
  }, []);

  /* ─── IntersectionObserver trigger ─── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [runAnimation]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const handleShowResults = (data?: any) => {
    setQuizData(data);
    setShowModal(false);
    setShowResults(true);
  };

  const handleStartApplication = () => {
    setShowResults(false);
    if (onApplyFromQuiz) {
      onApplyFromQuiz(quizData);
    } else if (onApplyClick) {
      onApplyClick();
    }
  };

  return (
    <>
      <section ref={sectionRef} className="py-12 md:py-16 lg:py-20 bg-[#fafbfc] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full">

            {/* ═══════════ LEFT — Content ═══════════ */}
            <div className="text-center lg:text-left">

              {/* Icon */}
              <div
                ref={iconRef}
                className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-[#0c66e4]/10 rounded-full mb-5 lg:mb-8"
                style={{ opacity: 0 }}
              >
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-[#0c66e4]" />
              </div>

              {/* Headline */}
              <h2
                ref={headlineRef}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[3.2rem] 2xl:text-[3.6rem] text-[#172b4d] mb-4 lg:mb-5 leading-[1.05] tracking-tight"
                style={{ opacity: 0, fontWeight: 700 }}
              >
                {t('preQual.title')}
              </h2>

              {/* Subtitle — single trust line */}
              <p
                ref={subtitleRef}
                className="text-black/60 mb-5 lg:mb-8 text-sm sm:text-base lg:text-lg"
                style={{ opacity: 0, lineHeight: 1.6 }}
              >
                6 questions. No credit impact. Instant results.
              </p>

              {/* CTA button + trust line */}
              <div
                ref={ctaRef}
                className="flex flex-col items-center lg:items-start gap-3 lg:gap-4 mb-0"
                style={{ opacity: 0 }}
              >
                <button
                  onClick={() => {
                    if (onCalculatorClick) {
                      onCalculatorClick();
                    } else {
                      setShowModal(true);
                    }
                  }}
                  className="prequal-cta-button bg-[#0c66e4] hover:bg-[#0055cc] text-base sm:text-lg md:text-xl lg:text-2xl py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer text-white"
                >
                  {t('preQual.button')}
                </button>

                {/* Trust line — directly under CTA */}
                <p
                  ref={joinRef}
                  className="text-xs sm:text-sm"
                  style={{ opacity: 0, color: '#999' }}
                >
                  {t('preQual.joinText')}
                </p>
              </div>
            </div>

            {/* ═══════════ RIGHT — Phone Mockup ═══════════ */}
            <div className="hidden lg:flex justify-center items-center relative">
              <img
                src={phoneMockup}
                alt="Delt Capital qualification result showing $125,000 in funding"
                loading="eager"
                className="w-full max-w-[220px] xl:max-w-[280px]"
              />
            </div>
          </div>
        </div>

        {/* ── Bottom border accent ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </section>

      {/* ── CTA hover style (no bounce — just color shift) ── */}
      <style>{`
        .prequal-cta-button {
          position: relative;
        }
        .prequal-cta-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(73, 69, 255, 0.3);
        }
        .prequal-cta-button:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
          onClick={handleBackdropClick}
        >
          <div className="w-full max-w-4xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all hover:scale-110"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <PreQualificationGame startWithQuiz={true} onShowResults={handleShowResults} />
          </div>
        </div>
      )}

      {/* Results Full Page */}
      {showResults && (
        <div className="fixed inset-0 bg-[#fafbfc] dark:bg-[#0A1F35] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <PreQualificationGame
              startWithQuiz={true}
              showResultsOnly={true}
              onCloseResults={() => setShowResults(false)}
              onStartApplication={handleStartApplication}
            />
          </div>
        </div>
      )}
    </>
  );
});

PreQualificationSection.displayName = 'PreQualificationSection';