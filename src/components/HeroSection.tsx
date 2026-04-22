import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PreQualificationGame } from './PreQualificationGame';

interface HeroSectionProps {
  onApplyClick: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
}

/* ─────────────────────────────────────────────────
 * Live merchant feed — the product-as-hero panel.
 * Solid surface, hairline borders, monospace data,
 * no gradients, no halos. Reads as "this is the
 * dashboard you'll get," not "this is decoration."
 * ─────────────────────────────────────────────── */
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

function MerchantPanel({ onConnect }: { onConnect: () => void }) {
  const sparklineId = useMemo(() => `hero-spark-${Math.random().toString(36).slice(2, 7)}`, []);

  const [items, setItems] = useState(() => {
    const now = Date.now();
    return [0, 1, 2, 3, 4].map((i) => ({
      ...TX_POOL[i],
      id: `seed-${i}`,
      ts: new Date(now - i * 4 * 60_000),
    }));
  });

  useEffect(() => {
    let alive = true;
    let i = 5;
    const id = window.setInterval(() => {
      if (!alive) return;
      const tx = TX_POOL[i % TX_POOL.length];
      i += 1;
      setItems((prev) => [
        { ...tx, id: `${tx.merchant}-${Date.now()}`, ts: new Date() },
        ...prev,
      ].slice(0, 5));
    }, 3800);
    return () => { alive = false; window.clearInterval(id); };
  }, []);

  // 14-bar revenue sparkline, last point highest
  const points = useMemo(() => [22, 28, 24, 33, 30, 41, 38, 47, 44, 56, 52, 58, 64, 72], []);
  const maxP = Math.max(...points);
  const w = 280;
  const h = 60;
  const stepX = w / (points.length - 1);
  const path =
    'M ' +
    points
      .map((p, idx) => `${(idx * stepX).toFixed(1)} ${(h - (p / maxP) * h * 0.92 - 2).toFixed(1)}`)
      .join(' L ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1px solid #dcdfe4',
        borderRadius: 16,
        boxShadow: '0 1px 1px rgba(10,37,64,0.04), 0 24px 48px -24px rgba(10,37,64,0.18)',
      }}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#dcdfe4]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex w-2 h-2">
            <span
              className="absolute inset-0 rounded-full bg-[#1F845A] opacity-75"
              style={{ animation: 'merchantPulse 2.2s ease-in-out infinite' }}
            />
            <span className="relative w-2 h-2 rounded-full bg-[#1F845A]" />
          </span>
          <span
            className="uppercase text-[#0a2540]"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
            }}
          >
            Merchant feed · live
          </span>
        </div>
        <span
          className="text-[#697386]"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.04em',
          }}
        >
          delt/dashboard
        </span>
      </div>

      {/* Top: volume + sparkline */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-baseline justify-between mb-3">
          <span
            className="uppercase text-[#697386]"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.12em',
            }}
          >
            Volume today
          </span>
          <span
            className="inline-flex items-center gap-1 text-[#1F845A] tabular-nums"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}
          >
            <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
            +12.4%
          </span>
        </div>
        <div className="flex items-end justify-between gap-5">
          <span
            className="text-[#0a2540] tabular-nums"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 3.5vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}
          >
            $48,500
          </span>

          <svg
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            className="overflow-visible flex-shrink-0"
            style={{ maxWidth: '60%' }}
          >
            <path
              d={path}
              fill="none"
              stroke="#0c66e4"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx={w}
              cy={h - (points[points.length - 1] / maxP) * h * 0.92 - 2}
              r={3}
              fill="#0c66e4"
            />
          </svg>
        </div>
      </div>

      {/* Transaction ledger */}
      <div className="border-t border-[#dcdfe4]">
        <div className="grid grid-cols-[80px_1fr_auto] px-6 py-3 border-b border-[#dcdfe4]" style={{ fontFamily: 'var(--font-mono)' }}>
          <span
            className="uppercase text-[#697386]"
            style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.16em' }}
          >
            Time
          </span>
          <span
            className="uppercase text-[#697386]"
            style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.16em' }}
          >
            Merchant
          </span>
          <span
            className="uppercase text-[#697386]"
            style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.16em' }}
          >
            Amount
          </span>
        </div>
        <div className="px-2">
          <AnimatePresence initial={false}>
            {items.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[80px_1fr_auto] items-center px-4 py-2.5 rounded-md hover:bg-[#f6f9fc] transition-colors"
              >
                <span
                  className="text-[#697386] tabular-nums"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500 }}
                >
                  {formatTime(tx.ts)}
                </span>
                <span
                  className="text-[#0a2540] truncate pr-3"
                  style={{ fontSize: 13.5, fontWeight: 500 }}
                >
                  {tx.merchant}
                </span>
                <span
                  className="text-[#0a2540] tabular-nums"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}
                >
                  +${tx.amount.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer connect strip */}
      <div className="px-6 py-4 border-t border-[#dcdfe4] bg-[#f6f9fc] flex items-center justify-between gap-3">
        <span
          className="text-[#697386]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em' }}
        >
          Connect via Plaid · read-only
        </span>
        <button
          onClick={onConnect}
          className="inline-flex items-center gap-1.5 transition-colors"
          style={{
            color: '#0c66e4',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '-0.005em',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0a2540'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#0c66e4'; }}
        >
          See your funding
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export function HeroSection({ onApplyClick, onApplyFromQuiz, onCalculatorClick }: HeroSectionProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);

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
      {/* ════════════════════════════════════════════════════════
          HERO — editorial split, no photo, no gradients, no halos
         ════════════════════════════════════════════════════════ */}
      <section
        className="relative pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 lg:pb-28"
        style={{ background: '#f6f9fc' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* ── LEFT: editorial copy ── */}
            <div className="lg:col-span-7">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="inline-flex items-center gap-2 uppercase text-[#0c66e4]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                }}
              >
                <span
                  aria-hidden
                  className="inline-block w-4 h-px"
                  style={{ background: '#0c66e4' }}
                />
                Same-day merchant funding
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-[#0a2540]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7vw, 5.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.045em',
                  lineHeight: 0.96,
                  maxWidth: '14ch',
                }}
              >
                Capital at the speed of your business.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18 }}
                className="mt-7 text-[#425466] max-w-xl"
                style={{ fontSize: 19, lineHeight: 1.55, fontWeight: 400 }}
              >
                Connect your bank, see a real funding range in 60 seconds, and get
                deposited the same day. No collateral. No paperwork. No theater.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
              >
                <button
                  onClick={onApplyClick}
                  className="inline-flex items-center gap-2 text-white whitespace-nowrap transition-colors"
                  style={{
                    background: '#0a2540',
                    borderRadius: 10,
                    padding: '14px 24px',
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: '-0.005em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#0c66e4'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#0a2540'; }}
                >
                  Get funded
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onCalculatorClick?.()}
                  className="inline-flex items-center gap-1.5 transition-colors group"
                  style={{
                    color: '#0c66e4',
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: '-0.005em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0a2540'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#0c66e4'; }}
                >
                  Run the calculator
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </motion.div>

              {/* Mono trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 text-[#697386]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-[#0a2540]" />
                  $200M+ deployed
                </span>
                <span className="opacity-30">·</span>
                <span>BBB A+ accredited</span>
                <span className="opacity-30">·</span>
                <span>Trustpilot 4.8 / 1,200+ reviews</span>
              </motion.div>
            </div>

            {/* ── RIGHT: product panel ── */}
            <div className="lg:col-span-5">
              <MerchantPanel onConnect={onApplyClick} />
            </div>
          </div>
        </div>

        {/* Pulse keyframe for the "live" indicator */}
        <style>{`
          @keyframes merchantPulse {
            0%, 100% { transform: scale(1); opacity: 0.75; }
            50%      { transform: scale(2.4); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="merchantPulse"] { animation: none !important; }
          }
        `}</style>
      </section>

      {/* Quiz Modal — kept identical to preserve LeadCapture flow */}
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

      {showResults && (
        <div
          className="fixed inset-0 bg-[#f6f9fc] z-50 flex items-start justify-center p-4 overflow-y-auto"
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
