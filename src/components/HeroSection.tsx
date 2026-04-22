import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PreQualificationGame } from './PreQualificationGame';
import { motion } from 'motion/react';
import businessPeopleImg from 'figma:asset/a03f9a9d95ad3eb3d24430a1c47663d5974d68f8.png';
import { BBBLogo } from './BBBLogo';

interface HeroSectionProps {
  onApplyClick: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
}

export function HeroSection({ onApplyClick, onApplyFromQuiz, onCalculatorClick }: HeroSectionProps) {
  const { t } = useLanguage();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [fadeDistance, setFadeDistance] = useState(150);

  useEffect(() => {
    const update = () => setFadeDistance(window.innerHeight * 0.5);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [heroOpacityVal, setHeroOpacityVal] = useState(1);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const opacity = Math.max(0, 1 - scrollTop / fadeDistance);
      setHeroOpacityVal(opacity);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fadeDistance]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowQuiz(false);
    }
  };

  const handleShowResults = (data?: any) => {
    setQuizData(data);
    setShowQuiz(false);
    setShowResults(true);
  };

  const handleStartApplication = () => {
    setShowResults(false);
    if (onApplyFromQuiz) {
      onApplyFromQuiz(quizData);
    } else {
      onApplyClick();
    }
  };

  return (
    <>
      {/* Fixed full-bleed hero — sits behind all content, fades on scroll */}
      <motion.div
        className="fixed w-full overflow-hidden z-0 bg-black"
        style={{
          opacity: heroOpacityVal,
          top: 0,
          height: '100vh',
          left: 0,
          right: 0,
        }}
      >
        <img
          src={businessPeopleImg}
          alt="Business owners working together"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Cinematic bottom-weighted overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(13,27,45,0.45) 0%, rgba(13,27,45,0.20) 35%, rgba(13,27,45,0.55) 75%, rgba(13,27,45,0.92) 100%)'
        }} />

        {/* Vercel-style chromatic mesh — sits over the cinematic overlay,
            screens onto the dark areas to add a tinted glow. */}
        <div
          aria-hidden
          className="bg-mesh absolute inset-0 pointer-events-none"
          style={{ mixBlendMode: 'screen', opacity: 0.55 }}
        />

        {/* Hero content — bottom-positioned, SpaceX-style */}
        <div className="relative z-10 h-full flex flex-col px-6 sm:px-8 lg:px-12">
          {/* Centered block, pushed toward lower-third */}
          <div className="mt-auto mb-[14vh] flex flex-col items-center text-center">
            {/* Kicker */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-white/80 uppercase mb-5"
              style={{
                fontSize: '11px',
                letterSpacing: '0.32em',
                fontWeight: 600,
              }}
            >
              Payment Processing · Reimagined
            </motion.span>

            {/* Headline — uppercase, tight, dramatic */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="text-white uppercase"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                fontWeight: 700,
                letterSpacing: '-0.015em',
                lineHeight: 0.95,
                maxWidth: '18ch',
              }}
            >
              Capital at the<br />
              <span className="hero-speed-text">speed of business</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
              className="text-white/75 mt-6 max-w-xl"
              style={{ fontSize: '15px', lineHeight: 1.6 }}
            >
              Same-day funding for U.S. merchants. No collateral. No bureaucracy.
            </motion.p>

            {/* CTA row — outline + text link */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
              className="mt-8 flex items-center gap-6"
            >
              <button
                onClick={() => onCalculatorClick?.()}
                className="hero-cta group cursor-pointer inline-flex items-center gap-2 uppercase transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.9)',
                  color: '#fff',
                  borderRadius: '2px',
                  padding: '14px 28px',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.28em',
                }}
              >
                <span>{t('hero.cta')}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={onApplyClick}
                className="hidden sm:inline-flex items-center gap-2 text-white/80 hover:text-white uppercase transition-colors"
                style={{ fontSize: '11px', letterSpacing: '0.28em', fontWeight: 600 }}
              >
                Apply Now
                <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Floating payment-processing card — modern Vercel/Linear flourish.
            Hidden on small screens to keep the headline breathing. */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
          className="hidden lg:block absolute z-10 pointer-events-none"
          style={{ right: '4vw', top: '36vh', width: 320 }}
        >
          <div
            className="rounded-2xl p-5 backdrop-blur-xl border border-white/15 shadow-2xl"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
              boxShadow: '0 20px 50px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="uppercase text-white/85"
                style={{ fontSize: 9, letterSpacing: '0.28em', fontWeight: 700 }}
              >
                Processing
              </span>
              <div className="flex items-center gap-1">
                <span className="processing-dot w-1.5 h-1.5 rounded-full bg-[#1F845A]" style={{ animationDelay: '-0.32s' }} />
                <span className="processing-dot w-1.5 h-1.5 rounded-full bg-[#1F845A]" style={{ animationDelay: '-0.16s' }} />
                <span className="processing-dot w-1.5 h-1.5 rounded-full bg-[#1F845A]" />
              </div>
            </div>

            {/* Faux card chip */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-7 rounded-md"
                style={{
                  background: 'linear-gradient(135deg, #d4b15a 0%, #f0d68a 50%, #b8954e 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
                }}
              />
              <div className="flex-1">
                <div className="text-white/60" style={{ fontSize: 10, letterSpacing: '0.18em' }}>
                  •••• •••• •••• 4242
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-1">
              <div className="text-white/55 uppercase" style={{ fontSize: 9, letterSpacing: '0.22em', fontWeight: 600 }}>
                Funded today
              </div>
              <div
                className="text-white tabular-nums mt-1"
                style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                $48,500.00
              </div>
            </div>

            {/* Status row */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <span className="text-[#85B8FF]" style={{ fontSize: 11, fontWeight: 600 }}>
                Approved · 2 min ago
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white/60" />
            </div>
          </div>
        </motion.div>

        {/* Footer strip — SpaceX-style three-column bottom band */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-8 lg:px-12 pb-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/70">
            {/* Left: stat */}
            <div
              className="uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.24em', fontWeight: 600 }}
            >
              <span className="text-white">$200M+</span> deployed to U.S. businesses
            </div>

            {/* Middle: trust row, minimal */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <BBBLogo className="w-5 h-5 opacity-90" />
                <span className="uppercase" style={{ fontSize: '10px', letterSpacing: '0.22em', fontWeight: 700 }}>BBB A+</span>
              </div>
              <div className="h-3 w-px bg-white/20" />
              <div
                className="uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.22em', fontWeight: 700 }}
              >
                Trustpilot 4.8
              </div>
            </div>

            {/* Right: disclaimer */}
            <div
              className="hidden md:block uppercase text-right"
              style={{ fontSize: '10px', letterSpacing: '0.20em', fontWeight: 500, maxWidth: 260 }}
            >
              Commercial funding & MCA solutions
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Spacer to reserve scroll height so content starts below the hero */}
      <div style={{ height: '100vh' }} />

      <style>{`
        .hero-speed-text {
          background: linear-gradient(90deg, #FFFFFF 0%, #85B8FF 30%, #579DFF 50%, #85B8FF 70%, #FFFFFF 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: gradientWave 22s linear infinite;
        }

        .hero-cta:hover {
          background: #fff;
          color: #0D1B2D;
        }
      `}</style>

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
          className="fixed inset-0 bg-[#FAFBFC] dark:bg-[#0D1B2D] z-50 flex items-start justify-center p-4 overflow-y-auto"
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
