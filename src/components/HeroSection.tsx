import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PreQualificationGame } from './PreQualificationGame';
import { motion } from 'motion/react';
import businessPeopleImg from 'figma:asset/a03f9a9d95ad3eb3d24430a1c47663d5974d68f8.png';

interface HeroSectionProps {
  onApplyClick: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
}

// Navbar height (ticker + main chrome). Keep in sync with App.tsx spacers.
const NAV_OFFSET = 88;

export function HeroSection({ onApplyClick, onApplyFromQuiz, onCalculatorClick }: HeroSectionProps) {
  useLanguage();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [fadeDistance, setFadeDistance] = useState(400);

  useEffect(() => {
    const update = () => setFadeDistance(Math.max(300, window.innerHeight * 0.5));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [heroOpacityVal, setHeroOpacityVal] = useState(1);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      setHeroOpacityVal(Math.max(0, 1 - scrollTop / fadeDistance));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fadeDistance]);

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
      <motion.div
        className="fixed w-full overflow-hidden z-0"
        style={{
          opacity: heroOpacityVal,
          top: NAV_OFFSET,
          height: `calc(100vh - ${NAV_OFFSET}px)`,
          left: 0,
          right: 0,
          background:
            'radial-gradient(120% 100% at 20% 0%, #1a1040 0%, #0b0820 55%, #07051a 100%)',
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(60% 60% at 85% 30%, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0) 60%), radial-gradient(40% 40% at 10% 80%, rgba(79,70,229,0.18) 0%, rgba(79,70,229,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top/bottom hairlines */}
        <div
          aria-hidden
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'rgba(231,227,218,0.10)',
          }}
        />

        <div
          className="relative h-full mx-auto"
          style={{ maxWidth: 1440, padding: '0 40px' }}
        >
          <div
            className="grid h-full items-center"
            style={{ gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 48 }}
          >
            {/* ── Left column: copy ── */}
            <div style={{ paddingTop: 40, paddingBottom: 40, maxWidth: 720 }}>
              {/* Dateline */}
              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(231,227,218,0.55)',
                  fontWeight: 600,
                }}
              >
                <span>Vol. VII · Q1 2026</span>
                <span style={{ opacity: 0.4 }}>—</span>
                <span>Direct lender · Est. 2019</span>
                <span style={{ opacity: 0.4 }}>—</span>
                <span className="inline-flex items-center gap-2">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: '#7C3AED',
                      boxShadow: '0 0 10px rgba(124,58,237,0.8)',
                      animation: 'delt-pulse 2s ease-in-out infinite',
                    }}
                  />
                  Quoting now
                </span>
              </div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  marginTop: 28,
                  marginBottom: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.045em',
                  lineHeight: 0.98,
                  color: '#F7F5F0',
                }}
              >
                Capital, priced
                <br />
                the way you&rsquo;d price it{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  yourself
                </span>
                .
              </motion.h1>

              {/* Sub-copy */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                style={{
                  marginTop: 28,
                  marginBottom: 0,
                  maxWidth: 560,
                  fontFamily: 'var(--font-body)',
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: 'rgba(231,227,218,0.75)',
                }}
              >
                Revenue-based funding from{' '}
                <span style={{ color: '#F7F5F0', fontWeight: 600 }}>$5,000 to $500,000</span>,
                priced on one factor rate — not an APR you can&rsquo;t verify. Median{' '}
                <span
                  style={{ color: '#F7F5F0', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}
                >
                  1.18×
                </span>
                . Median time to funds,{' '}
                <span style={{ color: '#F7F5F0', fontWeight: 600 }}>24 hours</span>.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3"
                style={{ marginTop: 36 }}
              >
                <button
                  onClick={() => onCalculatorClick?.()}
                  className="get-offer-button transition-transform"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 8,
                    padding: '12px 20px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 24px -8px rgba(124,58,237,0.55)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  See my rate
                  <span aria-hidden>→</span>
                </button>
                <button
                  onClick={onApplyClick}
                  className="transition-colors"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#F7F5F0',
                    background: 'transparent',
                    border: '1px solid rgba(231,227,218,0.28)',
                    borderRadius: 8,
                    padding: '12px 20px',
                    cursor: 'pointer',
                  }}
                >
                  Start application
                </button>
              </motion.div>

              {/* Metric strip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="grid grid-cols-3"
                style={{
                  marginTop: 44,
                  paddingTop: 24,
                  borderTop: '1px solid rgba(231,227,218,0.14)',
                  columnGap: 24,
                }}
              >
                {[
                  { l: 'Deployed', v: '$200M+', s: 'since 2019' },
                  { l: 'Median factor', v: '1.18×', s: 'last 12 months' },
                  { l: 'Median funding time', v: '24h', s: 'application → wire' },
                ].map((m) => (
                  <div key={m.l}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10.5,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'rgba(231,227,218,0.55)',
                        fontWeight: 600,
                      }}
                    >
                      {m.l}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontFamily: 'var(--font-display)',
                        fontSize: 26,
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        color: '#F7F5F0',
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1,
                      }}
                    >
                      {m.v}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        color: 'rgba(231,227,218,0.55)',
                      }}
                    >
                      {m.s}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right column: framed image / "motion" figure ── */}
            <div
              className="relative hidden lg:block"
              style={{ height: '100%', paddingTop: 24, paddingBottom: 24 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: 'relative',
                  height: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid rgba(231,227,218,0.12)',
                  background: '#0b0820',
                }}
              >
                <img
                  src={businessPeopleImg}
                  alt="Operators at work"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'saturate(0.75) contrast(1.05) brightness(0.82)',
                  }}
                />
                {/* Left fade into hero bg */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, rgba(11,8,32,0.95) 0%, rgba(11,8,32,0.35) 30%, rgba(11,8,32,0) 60%)',
                  }}
                />
                {/* Vignette */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(11,8,32,0.55) 0%, rgba(11,8,32,0) 30%, rgba(11,8,32,0) 70%, rgba(11,8,32,0.65) 100%)',
                  }}
                />
                {/* Grid overlay */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'linear-gradient(rgba(231,227,218,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(231,227,218,0.06) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    mixBlendMode: 'overlay',
                  }}
                />
                {/* Caption */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 22,
                    right: 24,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10.5,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(231,227,218,0.78)',
                  }}
                >
                  Fig. 01 — The offer, in motion
                </div>
                {/* Corner reg marks */}
                {[
                  { t: 12, l: 12 },
                  { t: 12, r: 12 },
                  { b: 12, l: 12 },
                  { b: 12, r: 12 },
                ].map((p, i) => (
                  <span
                    key={i}
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: p.t,
                      left: p.l,
                      right: p.r,
                      bottom: p.b,
                      width: 10,
                      height: 10,
                      borderColor: 'rgba(231,227,218,0.55)',
                      borderStyle: 'solid',
                      borderWidth: 0,
                      borderTopWidth: p.t !== undefined ? 1 : 0,
                      borderBottomWidth: p.b !== undefined ? 1 : 0,
                      borderLeftWidth: p.l !== undefined ? 1 : 0,
                      borderRightWidth: p.r !== undefined ? 1 : 0,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom disclosure */}
        <div
          className="hidden md:block"
          style={{
            position: 'absolute',
            bottom: 18,
            left: 40,
            right: 40,
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontStyle: 'italic',
            color: 'rgba(231,227,218,0.42)',
            lineHeight: 1.5,
            maxWidth: 520,
          }}
        >
          Delt provides commercial funding solutions, including merchant cash advances. Funding may
          be provided directly by Delt or through third-party funding partners.
        </div>
      </motion.div>

      {/* Spacer reserves scroll height for the fixed hero */}
      <div style={{ height: '100vh' }} />

      <style>{`
        @keyframes delt-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.88); }
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
              className="absolute -top-4 -right-4 w-12 h-12 bg-white hover:bg-gray-100 rounded-full shadow-2xl flex items-center justify-center z-10 transition-all hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <PreQualificationGame startWithQuiz={true} onShowResults={handleShowResults} />
          </div>
        </div>
      )}

      {/* Results Full Page */}
      {showResults && (
        <div
          className="fixed inset-0 bg-[#F7F5F0] z-50 flex items-start justify-center p-4 overflow-y-auto"
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
