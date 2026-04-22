import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, X, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PreQualificationGame } from './PreQualificationGame';
import { motion, AnimatePresence } from 'motion/react';
import businessPeopleImg from 'figma:asset/a03f9a9d95ad3eb3d24430a1c47663d5974d68f8.png';
import { BBBLogo } from './BBBLogo';

interface HeroSectionProps {
  onApplyClick: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
}

/* ─────────────────────────────────────────────
 * Live payments dashboard — hero flourish.
 * Streams faux transactions in from the bottom,
 * shows a small SVG sparkline + today's volume.
 * ─────────────────────────────────────────── */
const TX_POOL = [
  { merchant: 'Acme Coffee',       amount: 245 },
  { merchant: 'Riverside Diner',   amount: 1820 },
  { merchant: 'Cole Auto Repair',  amount: 640 },
  { merchant: 'Bloom Salon',       amount: 180 },
  { merchant: 'Westlake Bakery',   amount: 95 },
  { merchant: 'North Pier Yoga',   amount: 320 },
  { merchant: 'Gold Coast Tacos',  amount: 412 },
  { merchant: 'Linden Pharmacy',   amount: 78 },
  { merchant: 'Maple Street Vets', amount: 1240 },
  { merchant: 'Iron Bar & Grill',  amount: 870 },
];

function formatTime(d: Date) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function LivePaymentsDashboard() {
  const sparklineId = useMemo(() => `hero-spark-${Math.random().toString(36).slice(2, 7)}`, []);

  // Seed initial 4 transactions (most recent first), then stream new ones in.
  const [items, setItems] = useState(() => {
    const now = Date.now();
    return [0, 1, 2, 3].map((i) => ({
      ...TX_POOL[i],
      id: `seed-${i}`,
      ts: new Date(now - i * 4 * 60_000),
    }));
  });

  useEffect(() => {
    let alive = true;
    let i = 4;
    const id = window.setInterval(() => {
      if (!alive) return;
      const tx = TX_POOL[i % TX_POOL.length];
      i += 1;
      setItems((prev) => [
        { ...tx, id: `${tx.merchant}-${Date.now()}`, ts: new Date() },
        ...prev,
      ].slice(0, 4));
    }, 3800);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  // Sparkline points (faux 12-bar revenue trend, last point highest)
  const points = useMemo(() => [22, 28, 24, 33, 30, 41, 38, 47, 44, 56, 52, 64], []);
  const maxP = Math.max(...points);
  const w = 220;
  const h = 36;
  const stepX = w / (points.length - 1);
  const path =
    'M ' +
    points
      .map((p, idx) => `${(idx * stepX).toFixed(1)} ${(h - (p / maxP) * h).toFixed(1)}`)
      .join(' L ');
  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.0, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden
      className="hidden lg:block absolute z-10 pointer-events-none"
      style={{ right: '4vw', top: '24vh', width: 380 }}
    >
      <div
        className="rounded-2xl backdrop-blur-2xl border border-white/15 overflow-hidden"
        style={{
          background:
            'rgba(255,255,255,0.06)',
          boxShadow:
            '0 28px 60px -16px rgba(0,0,0,0.6), 0 6px 18px -8px rgba(110,93,198,0.35), inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
      >
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.08]">
          <span className="inline-flex items-center gap-2">
            <span className="processing-dot w-1.5 h-1.5 rounded-full bg-[#1F845A]" />
            <span
              className="uppercase text-white/85"
              style={{ fontSize: 10, letterSpacing: '0.28em', fontWeight: 700 }}
            >
              Live · today
            </span>
          </span>
          <span className="text-white/45" style={{ fontSize: 10, letterSpacing: '0.06em' }}>
            delt · merchant feed
          </span>
        </div>

        {/* ── Volume + delta + sparkline ── */}
        <div className="px-5 pt-4 pb-4">
          <div className="flex items-baseline justify-between mb-1">
            <span
              className="uppercase text-white/55"
              style={{ fontSize: 10, letterSpacing: '0.22em', fontWeight: 700 }}
            >
              Volume
            </span>
            <span
              className="inline-flex items-center gap-1 text-[#1F845A] tabular-nums"
              style={{ fontSize: 11, fontWeight: 700 }}
            >
              <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              +12.4%
            </span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <span
              className="text-white tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.0,
              }}
            >
              $48,500
            </span>

            {/* SVG sparkline */}
            <svg
              width={w}
              height={h}
              viewBox={`0 0 ${w} ${h}`}
              className="overflow-visible"
              style={{ maxWidth: '60%' }}
            >
              <defs>
                <linearGradient id={`${sparklineId}-stroke`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#85B8FF" />
                  <stop offset="60%" stopColor="#1d7afc" />
                  <stop offset="100%" stopColor="#6e5dc6" />
                </linearGradient>
                <linearGradient id={`${sparklineId}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d7afc" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#1d7afc" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill={`url(#${sparklineId}-fill)`} />
              <path d={path} fill="none" stroke={`url(#${sparklineId}-stroke)`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {/* End-point dot */}
              <circle
                cx={w}
                cy={h - (points[points.length - 1] / maxP) * h}
                r={3}
                fill="#6e5dc6"
                style={{ filter: 'drop-shadow(0 0 6px rgba(110,93,198,0.8))' }}
              />
            </svg>
          </div>
        </div>

        {/* ── Transaction stream ── */}
        <div className="px-2 pb-3">
          <AnimatePresence initial={false}>
            {items.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between rounded-lg px-3 py-2.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="text-white/45 tabular-nums flex-shrink-0"
                    style={{ fontSize: 10, fontWeight: 600 }}
                  >
                    {formatTime(tx.ts)}
                  </span>
                  <span
                    className="text-white truncate"
                    style={{ fontSize: 12.5, fontWeight: 600 }}
                  >
                    {tx.merchant}
                  </span>
                </div>
                <span
                  className="text-[#85B8FF] tabular-nums flex-shrink-0"
                  style={{ fontSize: 12.5, fontWeight: 700 }}
                >
                  +${tx.amount.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Footer status ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.08] bg-white/[0.02]">
          <span
            className="uppercase text-white/55"
            style={{ fontSize: 9, letterSpacing: '0.28em', fontWeight: 700 }}
          >
            Plaid · secure feed
          </span>
          <span className="inline-flex items-center gap-1 text-[#85B8FF]" style={{ fontSize: 11, fontWeight: 600 }}>
            View funding
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
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

        {/* Live payments dashboard — replaces the old floating card.
            Wider glass panel with a streaming transaction list,
            sparkline, and live volume + delta indicator. Hidden on
            small screens to keep the headline breathing. */}
        <LivePaymentsDashboard />

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
          background: #FFFFFF;
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
