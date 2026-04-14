import React, { useState } from 'react';
import { Star, X, ArrowRight, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { PreQualificationGame } from './PreQualificationGame';
import { BBBLogo } from './BBBLogo';
import { HeroOfferPreview } from './HeroOfferPreview';

interface HeroSectionProps {
  onApplyClick: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
  onHowItWorksClick?: () => void;
}

export function HeroSection({
  onApplyClick,
  onApplyFromQuiz,
  onCalculatorClick,
  onHowItWorksClick,
}: HeroSectionProps) {
  const { t } = useLanguage();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);

  // Parallax on the ambient glow blobs
  const { scrollY } = useScroll();
  const glow1Y = useTransform(scrollY, [0, 600], [0, -80]);
  const glow2Y = useTransform(scrollY, [0, 600], [0, -40]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setShowQuiz(false);
  };

  const handleShowResults = (data?: any) => {
    setQuizData(data);
    setShowQuiz(false);
    setShowResults(true);
  };

  const handleStartApplication = () => {
    setShowResults(false);
    if (onApplyFromQuiz) onApplyFromQuiz(quizData);
    else onApplyClick();
  };

  return (
    <>
      <section
        className="relative overflow-hidden hero-bg-gradient"
        style={{ paddingTop: 'calc(73px + 2.5rem)', paddingBottom: '7rem' }}
      >
        {/* Ambient glow blobs */}
        <motion.div
          aria-hidden="true"
          style={{ y: glow1Y }}
          className="absolute top-[-10%] right-[-5%] w-[55vw] max-w-[900px] aspect-square rounded-full blur-3xl pointer-events-none"
        >
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(circle, var(--glow-indigo) 0%, rgba(73,69,255,0.15) 40%, transparent 70%)',
            }}
          />
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={{ y: glow2Y }}
          className="absolute bottom-[-20%] left-[-10%] w-[60vw] max-w-[900px] aspect-square rounded-full blur-3xl pointer-events-none"
        >
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(circle, var(--glow-violet) 0%, rgba(139,92,246,0.15) 40%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Subtle grain / noise via repeating dots */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '3px 3px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3.5 py-1.5 text-[12px] font-medium text-white/85"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4945ff] shadow-[0_0_10px_2px_rgba(73,69,255,0.7)]" />
                New · $200M+ deployed to U.S. businesses
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mt-6 text-white font-bold tracking-tight leading-[1.02]"
                style={{
                  fontFamily:
                    '"Codec Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: 'clamp(44px, 6vw, 88px)',
                }}
              >
                Capital that moves
                <br />
                at your{' '}
                <span
                  className="serif-italic serif-shimmer"
                  style={{ fontSize: '1.05em' }}
                >
                  speed.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                className="mt-6 text-white/75 text-lg sm:text-xl leading-relaxed max-w-xl"
              >
                Flexible funding for real businesses — $10K to $250K, approved in minutes,
                funded in 24&ndash;48 hours. No personal guarantee.{' '}
                <span className="text-white/95">Powered by AI that learns your revenue.</span>
              </motion.p>

              {/* Dual CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <button
                  onClick={() => onCalculatorClick?.()}
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_-10px_rgba(73,69,255,0.8)]"
                  style={{
                    background:
                      'linear-gradient(180deg, #5b57ff 0%, #4945ff 55%, #3e3add 100%)',
                    boxShadow: '0 10px 30px -12px rgba(73,69,255,0.7), inset 0 1px 0 rgba(255,255,255,0.25)',
                  }}
                >
                  {t('hero.cta') || 'Get your offer'}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => onHowItWorksClick?.()}
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold text-white/90 border border-white/25 bg-white/5 backdrop-blur transition-all duration-200 hover:bg-white/10 hover:border-white/40"
                >
                  See how it works
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </motion.div>

              {/* Social proof line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="mt-5 text-sm text-white/55"
              >
                Join 2,850+ businesses funded this year
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8 flex flex-wrap items-center gap-5 sm:gap-7"
              >
                <div className="flex items-center gap-2">
                  <BBBLogo className="w-7 h-7" />
                  <span className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={`bbb-${i}`} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </span>
                  <span className="text-sm font-bold text-white/95">A+</span>
                </div>
                <div className="h-4 w-px bg-white/15" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white/95">Trustpilot</span>
                  <span className="text-green-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={`tp-${i}`} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </span>
                  <span className="text-sm font-bold text-white/95">4.8</span>
                </div>
              </motion.div>
            </div>

            {/* Right: floating offer preview */}
            <div className="relative">
              <HeroOfferPreview />
            </div>
          </div>
        </div>

        {/* Soft fade into the next (white) section */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.12) 100%)',
          }}
        />
      </section>

      {/* Quiz Modal */}
      {showQuiz && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={handleBackdropClick}
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="w-full max-w-4xl mb-16 relative">
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-2xl flex items-center justify-center z-10 transition-all hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <PreQualificationGame startWithQuiz={true} onShowResults={handleShowResults} />
          </div>
        </div>
      )}

      {/* Results Full Page */}
      {showResults && (
        <div
          className="fixed inset-0 bg-[#ededf6] dark:bg-[#0A1F35] z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="w-full max-w-4xl my-auto">
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
}
