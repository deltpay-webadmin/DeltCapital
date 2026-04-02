import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const [fadeDistance, setFadeDistance] = useState(150);

  // Compute fade distance
  useEffect(() => {
    const update = () => setFadeDistance(window.innerHeight * 0.5);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Initial 7-second hover animation on page load
  useEffect(() => {
    const button = document.querySelector('.get-offer-button');
    if (button) {
      button.classList.add('initial-hover-animation');
      const timer = setTimeout(() => {
        button.classList.remove('initial-hover-animation');
        setInitialAnimationComplete(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Bounce animation trigger - only starts after initial animation
  useEffect(() => {
    if (!initialAnimationComplete) return;
    const initialTimeout = setTimeout(() => {
      const button = document.querySelector('.get-offer-button');
      if (button && !isHovered) {
        button.classList.add('bouncing');
        setTimeout(() => button.classList.remove('bouncing'), 600);
      }
    }, 3000);
    const bounceInterval = setInterval(() => {
      const button = document.querySelector('.get-offer-button');
      if (button && !isHovered) {
        button.classList.add('bouncing');
        setTimeout(() => button.classList.remove('bouncing'), 600);
      }
    }, 3000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(bounceInterval);
    };
  }, [isHovered, initialAnimationComplete]);

  // Scroll-based opacity fade: 1 → 0 over 15vh of scroll
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
      {/* Fixed hero: sits behind all content, fades on scroll via opacity only */}
      <motion.div
        className="fixed w-full overflow-hidden z-0 bg-black"
        style={{ 
          opacity: heroOpacityVal,
          top: '73px',
          height: '100vh',
          left: 0,
          right: 0
        }}
      >
        {/* Fullscreen Background Image */}
        <img
          src={businessPeopleImg}
          alt="Business owners working together"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

        {/* Main Overlay Content - Centered */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 sm:px-8 text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight max-w-5xl"
            style={{
              fontFamily: '"Codec Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <span>{t('hero.animated.capital')}</span>
            <span>{t('hero.animated.moves')}</span>
            <span className="inline-block hero-speed-text">{t('hero.animated.speed')}</span>
          </motion.h1>

          {/* Get Your Offer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mt-8"
          >
            <button
              onClick={() => onCalculatorClick?.()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="get-offer-button cursor-pointer transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
              style={{
                background: '#4945ff',
                color: '#fff',
                borderRadius: '10px',
                padding: '14px 28px',
                fontWeight: 600,
                fontSize: '16px',
                border: 'none',
              }}
            >
              {t('hero.cta')}
            </button>
          </motion.div>

          {/* Trust Badges - 16px gap */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            className="mt-4 flex flex-wrap items-center justify-center gap-5 sm:gap-6"
          >
            <div className="flex items-center gap-2">
              <BBBLogo className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-yellow-400 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={`bbb-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ))}
              </span>
              <span className="text-sm sm:text-base font-bold text-white">A+</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-white">Trustpilot</span>
              <span className="text-green-400 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={`tp-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ))}
              </span>
              <span className="text-sm sm:text-base font-bold text-white">4.8</span>
            </div>
          </motion.div>
        </div>

        {/* Frosted Stat Badge - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
          className="absolute bottom-16 left-6 sm:left-8 lg:left-12 z-10"
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '16px 24px',
          }}
        >
          <span className="text-white" style={{ fontSize: '14px' }}>
            $200M+ deployed to U.S. businesses.
          </span>
        </motion.div>

        {/* Disclaimer - Bottom Left, below stat badge */}
        <div className="absolute bottom-4 left-6 sm:left-8 lg:left-12 z-10 hidden md:block" style={{ maxWidth: 400 }}>
          <p className="text-[11px] text-white/50 italic leading-snug">
            Delt provides commercial funding solutions, including merchant cash advances. Funding may be provided directly by Delt or through third-party funding partners.
          </p>
        </div>
      </motion.div>

      {/* Spacer: reserves scroll height so content starts below the hero */}
      <div style={{ height: '100vh' }} />

      {/* Styles */}
      <style>{`
        .hero-speed-text {
          background: linear-gradient(90deg, #FFFFFF 0%, #8B5CF6 12.5%, #4945ff 25%, #60A5FA 37.5%, #FFFFFF 50%, #8B5CF6 62.5%, #4945ff 75%, #60A5FA 87.5%, #FFFFFF 100%);
          background-size: 600% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: gradientWave 16s linear infinite;
        }

        @keyframes subtleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .get-offer-button {
          position: relative;
        }

        .get-offer-button.bouncing:not(:hover) {
          animation: subtleBounce 0.6s ease-in-out;
        }

        .get-offer-button .button-text-hero {
          color: white;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }

        .get-offer-button:hover .button-text-hero,
        .get-offer-button.initial-hover-animation .button-text-hero {
          background: linear-gradient(90deg, #FFFFFF 0%, #8B5CF6 15%, #60A5FA 30%, #FFFFFF 45%, #8B5CF6 60%, #60A5FA 75%, #FFFFFF 90%, #8B5CF6 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          text-shadow: none;
          animation: gradientWave 5s linear infinite;
        }

        .get-offer-button:hover,
        .get-offer-button.initial-hover-animation {
          transform: scale(1.02);
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