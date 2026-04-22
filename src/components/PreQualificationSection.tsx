import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { X, Sparkles, Clock, Shield, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PreQualificationGame } from './PreQualificationGame';
import phoneMockup from 'figma:asset/71c57b806f1b63be76a88b51a3a97efac7f0c5ee.png';
import { useLanguage } from '../contexts/LanguageContext';

interface PreQualificationSectionProps {
  onApplyClick?: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
}

export interface PreQualificationSectionRef {
  openQuiz: () => void;
  scrollToSection: () => void;
}

export const PreQualificationSection = forwardRef<
  PreQualificationSectionRef,
  PreQualificationSectionProps
>(({ onApplyClick, onApplyFromQuiz, onCalculatorClick }, ref) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    openQuiz: () => setShowModal(true),
    scrollToSection: () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
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

  const handleCtaClick = () => {
    if (onCalculatorClick) {
      onCalculatorClick();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative bg-[#172b4d] text-white overflow-hidden py-24 md:py-32"
      >
        {/* Mesh chromatic glow */}
        <div
          aria-hidden
          className="bg-mesh absolute inset-0 opacity-50 pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* ═══════ LEFT — Content ═══════ */}
            <div className="lg:col-span-7">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 uppercase text-[#85B8FF]"
                style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Pre-qualification
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 text-white"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.0,
                  maxWidth: '20ch',
                }}
              >
                {t('preQual.title')
                  .split(' ')
                  .map((word, i, arr) =>
                    i === arr.length - 1 ? (
                      <span key={i} className="text-gradient-primary">
                        {word}
                      </span>
                    ) : (
                      <React.Fragment key={i}>{word} </React.Fragment>
                    )
                  )}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 text-white/75 max-w-xl"
                style={{ fontSize: 18, lineHeight: 1.55 }}
              >
                Six questions. No credit impact. Instant results.
              </motion.p>

              {/* Quick trust pills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-7 flex flex-wrap gap-2.5"
              >
                {[
                  { icon: <Clock className="w-3.5 h-3.5" />, label: '60 seconds' },
                  { icon: <Shield className="w-3.5 h-3.5" />, label: 'Soft credit only' },
                  { icon: <Zap className="w-3.5 h-3.5" />, label: 'Real funding range' },
                ].map((pill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm px-3.5 py-2 text-white/85 text-xs font-medium"
                  >
                    <span className="text-[#85B8FF]">{pill.icon}</span>
                    {pill.label}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-5"
              >
                <button
                  onClick={handleCtaClick}
                  className="card-hover-lift group inline-flex items-center justify-center gap-2 bg-white text-[#0c66e4] font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-[0_24px_48px_-16px_rgba(12,102,228,0.55)] transition-shadow"
                  style={{ fontSize: 16 }}
                >
                  {t('preQual.button')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-white/55 text-sm">
                  {t('preQual.joinText')}
                </p>
              </motion.div>
            </div>

            {/* ═══════ RIGHT — Phone proof ═══════ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex lg:col-span-5 justify-center items-center relative"
            >
              {/* Behind-phone gradient ring glow */}
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div
                  className="w-72 h-72 rounded-full"
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(110,93,198,0.45), rgba(12,102,228,0.25) 55%, transparent 80%)',
                    filter: 'blur(28px)',
                  }}
                />
              </div>

              {/* Soft floating bob via inline keyframe */}
              <img
                src={phoneMockup}
                alt="Delt Capital qualification result showing $125,000 in funding"
                loading="eager"
                className="prequal-phone relative w-full max-w-[260px] xl:max-w-[300px] drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>

        {/* Phone float keyframe */}
        <style>{`
          @keyframes prequalFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .prequal-phone {
            animation: prequalFloat 5.5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .prequal-phone { animation: none; }
          }
        `}</style>
      </section>

      {/* ── Quiz modal ── */}
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

      {/* ── Results full-page ── */}
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
