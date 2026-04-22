import { useState, useMemo } from 'react';
import {
  ArrowRight,
  Check,
  X as XIcon,
  DollarSign,
  Calendar,
  CreditCard,
  Sparkles,
  Zap,
  Rocket,
  RefreshCcw,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MonthlyRevenueSlider } from './MonthlyRevenueSlider';
import { CreditCardSalesSlider } from './CreditCardSalesSlider';

interface CapitalCostAnalyzerProps {
  onApplyClick?: (calculatorData?: {
    monthlyRevenue: string;
    timeInBusiness: string;
    creditCardProcessing: string;
    requestedAmount: string;
    acceptsCreditCards: boolean | null;
    deltProcessing: boolean;
  }) => void;
  onDeltLearnMore?: () => void;
}

type TimeInBusiness = '' | '<6mo' | '6-12mo' | '1-2yr' | '2yr+';

function formatK(n: number): string {
  if (n >= 1000) {
    const k = Math.round(n / 1000);
    return `$${k.toLocaleString()}K`;
  }
  return `$${n.toLocaleString()}`;
}

const TIB_MULTIPLIERS: Record<string, { low: number; high: number } | 'redirect'> = {
  '<6mo': 'redirect',
  '6-12mo': { low: 0.50, high: 0.56 },
  '1-2yr': { low: 0.56, high: 0.62 },
  '2yr+': { low: 0.60, high: 0.67 },
};

/* ─────────────────────────────────────────────────
 * Shared shell — gradient-ring card with mesh halo
 * ─────────────────────────────────────────────── */
function QuizShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Behind-card mesh halo */}
      <div aria-hidden className="bg-mesh absolute -inset-6 md:-inset-10 opacity-40 pointer-events-none" />
      <div
        className="relative rounded-3xl bg-white overflow-hidden"
        style={{
          boxShadow:
            '0 30px 80px -28px rgba(12,102,228,0.30), 0 8px 28px -10px rgba(110,93,198,0.18)',
        }}
      >
        {/* Gradient ring (mask-composite) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            padding: 1.5,
            background:
              'rgba(12,102,228,0.35)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
 * Stepper — 4 segments, gradient fill on done/active
 * ─────────────────────────────────────────────── */
function QuizStepper({ stepIndex, totalSteps = 4, kicker, percent }: {
  stepIndex: number;
  totalSteps?: number;
  kicker: string;
  percent: number;
}) {
  return (
    <div className="px-8 md:px-12 pt-7">
      <div className="flex items-center justify-between mb-3">
        <span
          className="uppercase text-[#0c66e4]"
          style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
        >
          {kicker}
        </span>
        <span className="text-[#44546f] tabular-nums" style={{ fontSize: 12, fontWeight: 600 }}>
          {Math.round(percent)}% complete
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isDone = i < stepIndex;
          const isActive = i === stepIndex;
          return (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-[#dcdfe4] overflow-hidden">
              <motion.div
                initial={false}
                animate={{
                  width: isDone || isActive ? '100%' : '0%',
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{
                  background:
                    isDone
                      ? '#0c66e4'
                      : isActive
                        ? '#0c66e4'
                        : 'transparent',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
 * Question header — eyebrow + headline + optional sub
 * ─────────────────────────────────────────────── */
function QuestionHeader({
  Icon,
  eyebrow,
  title,
  subtitle,
}: {
  Icon: typeof Calendar;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="px-8 md:px-12 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 text-white"
        style={{
          background: '#0c66e4',
          boxShadow: '0 12px 28px -10px rgba(12,102,228,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>

      <span
        className="block uppercase text-[#758195]"
        style={{ fontSize: 11, letterSpacing: '0.28em', fontWeight: 700 }}
      >
        {eyebrow}
      </span>

      <h3
        className="mt-2.5 text-[#172b4d]"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 3.2vw, 2.25rem)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          maxWidth: '24ch',
        }}
      >
        {title}
      </h3>

      {subtitle && (
        <p className="mt-2 text-[#44546f]" style={{ fontSize: 15, lineHeight: 1.55 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function CapitalCostAnalyzer({ onApplyClick, onDeltLearnMore }: CapitalCostAnalyzerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [timeInBusiness, setTimeInBusiness] = useState<TimeInBusiness>('');
  const [acceptsCards, setAcceptsCards] = useState<boolean | null>(null);
  const [cardSales, setCardSales] = useState(0);
  const [deltToggle, setDeltToggle] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [showResults, setShowResults] = useState(false);

  /* ───────── Calc — UNCHANGED from original ───────── */
  const noCards = acceptsCards === false;
  const isCrossSellBranch = noCards;
  const isDeltBoosted = deltToggle || isCrossSellBranch;
  const isRedirectCase = timeInBusiness === '<6mo';

  let baseLow = monthlyRevenue * 0.50;
  let baseHigh = monthlyRevenue * 0.67;

  if (timeInBusiness && timeInBusiness !== '<6mo') {
    const tib = TIB_MULTIPLIERS[timeInBusiness];
    if (tib !== 'redirect') {
      baseLow = monthlyRevenue * tib.low;
      baseHigh = monthlyRevenue * tib.high;
    }
  }

  let fundingLow = baseLow;
  let fundingHigh = baseHigh;

  const preBoostLow = Math.min(250000, Math.max(5000, Math.round(fundingLow / 1000) * 1000));
  const preBoostHigh = Math.min(250000, Math.max(preBoostLow + 2000, Math.round(fundingHigh / 1000) * 1000));

  if (isDeltBoosted) {
    fundingLow *= 1.75;
    fundingHigh *= 1.75;
  }

  fundingLow = Math.round(fundingLow / 1000) * 1000;
  fundingHigh = Math.round(fundingHigh / 1000) * 1000;
  const maxCap = isDeltBoosted ? 500000 : 250000;
  fundingLow = Math.min(maxCap, Math.max(5000, fundingLow));
  fundingHigh = Math.min(maxCap, Math.max(fundingLow + 2000, fundingHigh));

  const displayLow = isDeltBoosted ? fundingLow : preBoostLow;
  const displayHigh = isDeltBoosted ? fundingHigh : preBoostHigh;

  /* ───────── Handlers — UNCHANGED behavior ───────── */
  const handleTimeSelect = (value: TimeInBusiness) => {
    setTimeInBusiness(value);
    setTimeout(() => setCurrentQuestion(1), 300);
  };

  const handleRevenueContinue = () => {
    if (monthlyRevenue > 0) setCurrentQuestion(2);
  };

  const handleAcceptCards = (value: boolean) => {
    setAcceptsCards(value);
    if (!value) {
      setCardSales(0);
      setTimeout(() => {
        setCurrentQuestion(4);
        triggerLoadingAndResults();
      }, 300);
    } else {
      setTimeout(() => setCurrentQuestion(3), 300);
    }
  };

  const handleCardSalesContinue = () => {
    if (cardSales > 0) {
      setCurrentQuestion(4);
      triggerLoadingAndResults();
    }
  };

  const handleToggleClick = () => setDeltToggle((p) => !p);

  const handleReset = () => {
    setCurrentQuestion(0);
    setMonthlyRevenue(0);
    setTimeInBusiness('');
    setAcceptsCards(null);
    setCardSales(0);
    setDeltToggle(false);
    setIsLoadingResults(false);
    setShowResults(false);
  };

  const triggerLoadingAndResults = () => {
    setIsLoadingResults(true);
    setTimeout(() => {
      setIsLoadingResults(false);
      setShowResults(true);
    }, 2000);
  };

  const timeOptions: { value: TimeInBusiness; label: string; sub: string }[] = [
    { value: '<6mo',   label: 'Less than 6 months', sub: 'Brand new' },
    { value: '6-12mo', label: '6 – 12 months',      sub: 'Getting started' },
    { value: '1-2yr',  label: '1 – 2 years',        sub: 'Established' },
    { value: '2yr+',   label: '2+ years',           sub: 'Veteran' },
  ];

  const getCalculatorData = () => {
    const tibMap: Record<string, string> = {
      '<6mo': 'Less than 6 months',
      '6-12mo': '6-12 months',
      '1-2yr': '1-2 years',
      '2yr+': '2-5 years',
    };
    return {
      monthlyRevenue: monthlyRevenue > 0 ? monthlyRevenue.toLocaleString() : '',
      timeInBusiness: timeInBusiness ? (tibMap[timeInBusiness] || '') : '',
      creditCardProcessing: noCards ? 'No credit card processing' : (cardSales > 0 ? cardSales.toLocaleString() : ''),
      requestedAmount: showResults ? String(Math.round(displayHigh)) : '',
      acceptsCreditCards: acceptsCards,
      deltProcessing: isDeltBoosted,
    };
  };

  const stepIndex = useMemo(() => {
    // Stepper has 4 segments: TIB, Revenue, Cards?, (CardSales OR auto-result)
    if (currentQuestion === 0) return 0;
    if (currentQuestion === 1) return 1;
    if (currentQuestion === 2) return 2;
    return 3;
  }, [currentQuestion]);
  const percent = ((stepIndex + 1) / 4) * 100;

  /* ─────────────────────────────────────────────
   * LOADING
   * ─────────────────────────────────────────── */
  if (isLoadingResults) {
    return (
      <QuizShell>
        <div className="px-8 md:px-12 py-16 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-20 h-20 mx-auto mb-7"
          >
            <div className="absolute inset-0 rounded-full bg-mesh opacity-50" />
            <svg className="relative animate-spin text-[#0c66e4]" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-[#172b4d]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Calculating your funding range
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-[#44546f] mt-2.5"
            style={{ fontSize: 15 }}
          >
            Analyzing your business profile…
          </motion.p>
        </div>
      </QuizShell>
    );
  }

  /* ─────────────────────────────────────────────
   * RESULTS
   * ─────────────────────────────────────────── */
  if (showResults) {
    return (
      <QuizShell>
        <div className="px-8 md:px-12 pt-9 pb-9">
          {/* Eyebrow + sub */}
          <div className="text-center mb-6">
            <span
              className="inline-flex items-center gap-2 uppercase text-[#0c66e4]"
              style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Estimated funding range
            </span>
            <p className="text-[#44546f] mt-3" style={{ fontSize: 14 }}>
              Based on your business profile
            </p>
          </div>

          {/* Strikethrough preview when boosted */}
          <AnimatePresence>
            {isDeltBoosted && !noCards && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-center text-[#758195] mb-1.5"
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: '-0.5px',
                  textDecoration: 'line-through',
                }}
              >
                {formatK(preBoostLow)}–{formatK(preBoostHigh)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero amount */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${displayLow}-${displayHigh}-${isDeltBoosted ? 'b' : 'p'}`}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className={`text-center tabular-nums ${
                isDeltBoosted ? 'text-gradient-primary' : 'text-[#172b4d]'
              }`}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 8vw, 4.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.045em',
                lineHeight: 1.0,
              }}
            >
              {formatK(displayLow)}
              <span style={{ color: '#c1c7d0', fontWeight: 400, margin: '0 8px' }}>–</span>
              {formatK(displayHigh)}
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-[#44546f] mt-3 mb-8" style={{ fontSize: 13.5 }}>
            {isDeltBoosted ? 'With Delt processing' : 'Based on your monthly revenue'}
          </p>

          {/* Boost / static cross-sell card */}
          {noCards ? (
            <div
              className="rounded-2xl p-5 mb-7 border border-[#0c66e4]/20"
              style={{
                background: '#f1f6ff',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{
                    background: '#0c66e4',
                    boxShadow: '0 6px 16px -4px rgba(12,102,228,0.45)',
                  }}
                >
                  <Rocket className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[#172b4d]" style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35 }}>
                    Enable payment processing with Delt
                  </div>
                  <div className="text-[#44546f] mt-1.5" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    Unlock up to <span className="font-semibold text-[#0c66e4]">2× more capital</span> as your business grows
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleToggleClick}
              className="w-full text-left rounded-2xl p-5 mb-7 transition-all duration-300 group"
              style={{
                background: deltToggle
                  ? '#f1f6ff'
                  : '#f1f2f4',
                border: deltToggle
                  ? '1.5px solid rgba(12,102,228,0.3)'
                  : '1.5px solid #dcdfe4',
                boxShadow: deltToggle
                  ? '0 12px 32px -16px rgba(12,102,228,0.4)'
                  : '0 1px 2px rgba(9,30,66,0.04)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: deltToggle
                      ? '#0c66e4'
                      : '#dcdfe4',
                    color: deltToggle ? '#fff' : '#758195',
                    boxShadow: deltToggle
                      ? '0 6px 16px -4px rgba(12,102,228,0.45)'
                      : 'none',
                  }}
                >
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="text-[#172b4d]" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35 }}>
                    {isRedirectCase ? 'Enable payment processing with Delt' : 'Switch payment processing to Delt'}
                  </div>
                  <div className="text-[#44546f] mt-1.5" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    Unlock up to <span className="font-semibold text-[#0c66e4]">2× more capital</span> as your business grows
                  </div>
                </div>
                {/* iOS-style toggle */}
                <div
                  className="relative flex-shrink-0 mt-1 transition-colors duration-300"
                  style={{
                    width: 48,
                    height: 28,
                    borderRadius: 14,
                    background: deltToggle ? '#0c66e4' : '#c1c7d0',
                    padding: 3,
                  }}
                >
                  <motion.div
                    className="rounded-full bg-white"
                    style={{
                      width: 22,
                      height: 22,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                    }}
                    animate={{ x: deltToggle ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
            </button>
          )}

          {/* Boost badge */}
          <AnimatePresence>
            {isDeltBoosted && !isRedirectCase && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="flex justify-center mb-5"
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
                  style={{
                    background: 'rgba(12,102,228,0.08)',
                    color: '#0c66e4',
                    fontSize: 12,
                    fontWeight: 700,
                    border: '1px solid rgba(12,102,228,0.18)',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  0% processing on your first $5,000
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <button
            onClick={() => onApplyClick?.(getCalculatorData())}
            className="card-hover-lift w-full text-white inline-flex items-center justify-center gap-2 rounded-xl py-4"
            style={{
              background: '#0c66e4',
              boxShadow: '0 12px 28px -10px rgba(12,102,228,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '-0.005em',
            }}
          >
            Get my offer
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Trust line */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[#758195]" style={{ fontSize: 13 }}>
            <Lock className="w-3 h-3" />
            No impact to your credit · Takes 2 minutes
          </div>

          {/* Redirect special card */}
          <AnimatePresence>
            {isRedirectCase && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl p-4"
                style={{
                  border: '1.5px solid rgba(12,102,228,0.18)',
                  background: 'rgba(12,102,228,0.05)',
                }}
              >
                <Rocket className="w-5 h-5 mb-2 text-[#0c66e4]" />
                <p className="text-[#172b4d] mb-1" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>
                  Get started with Delt today.
                </p>
                <p className="text-[#44546f]" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  New businesses that process with Delt get a pre-approved offer and up to 2× more capital as they grow.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider + footer row */}
          <div className="border-t border-[#dcdfe4] mt-8 pt-5 flex items-center justify-between">
            <button
              type="button"
              onClick={onDeltLearnMore}
              className="inline-flex items-center gap-1.5 text-[#0c66e4] hover:text-[#0055cc] transition-colors"
              style={{ fontSize: 13.5, fontWeight: 600 }}
            >
              How it works
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-[#758195] hover:text-[#0c66e4] transition-colors"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              <RefreshCcw className="w-3 h-3" />
              Start over
            </button>
          </div>

          {/* Disclaimer */}
          <div
            className="mt-5 text-[#9aa5b1]"
            style={{ fontSize: 11, lineHeight: 1.55 }}
          >
            Estimates are approximate and not a guarantee of funding. Final offers are based on a full review of your business.
          </div>
        </div>
      </QuizShell>
    );
  }

  /* ─────────────────────────────────────────────
   * Q0 — Time in Business
   * ─────────────────────────────────────────── */
  if (currentQuestion === 0) {
    return (
      <QuizShell>
        <QuizStepper stepIndex={0} kicker="Question 1 of 4" percent={percent} />
        <QuestionHeader
          Icon={Calendar}
          eyebrow="Time in business"
          title={<>How long have you been in business?</>}
          subtitle="We use this to calibrate your funding range. Pick the closest answer."
        />
        <AnimatePresence mode="wait">
          <motion.div
            key="q0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="px-8 md:px-12 pt-7 pb-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timeOptions.map((opt, i) => {
                const isActive = timeInBusiness === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => handleTimeSelect(opt.value)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative overflow-hidden text-left rounded-2xl p-5 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-br from-[#f1f6ff] to-[#f5f3ff] border-2 border-[#0c66e4]/40'
                        : 'bg-white border-2 border-[#dcdfe4] hover:border-[#0c66e4]/40 hover:bg-[#f1f6ff]/50'
                    }`}
                    style={{
                      boxShadow: isActive
                        ? '0 12px 28px -12px rgba(12,102,228,0.35)'
                        : '0 1px 2px rgba(9,30,66,0.04)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div
                          className="text-[#172b4d]"
                          style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}
                        >
                          {opt.label}
                        </div>
                        <div
                          className="uppercase text-[#758195] mt-1"
                          style={{ fontSize: 10, letterSpacing: '0.22em', fontWeight: 700 }}
                        >
                          {opt.sub}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#0c66e4] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </QuizShell>
    );
  }

  /* ─────────────────────────────────────────────
   * Q1 — Monthly Revenue
   * ─────────────────────────────────────────── */
  if (currentQuestion === 1) {
    return (
      <QuizShell>
        <QuizStepper stepIndex={1} kicker="Question 2 of 4" percent={percent} />
        <QuestionHeader
          Icon={DollarSign}
          eyebrow="Monthly revenue"
          title={<>What's your average monthly revenue?</>}
          subtitle="Slide to your closest figure. Our underwriters care about cash flow, not perfection."
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="px-8 md:px-12 pt-7 pb-10"
        >
          <MonthlyRevenueSlider value={monthlyRevenue} onChange={setMonthlyRevenue} />

          <AnimatePresence>
            {monthlyRevenue > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-7 flex justify-center"
              >
                <button
                  onClick={handleRevenueContinue}
                  className="card-hover-lift inline-flex items-center justify-center gap-2 text-white rounded-xl px-7 py-3.5"
                  style={{
                    background: '#0c66e4',
                    boxShadow: '0 10px 24px -10px rgba(12,102,228,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </QuizShell>
    );
  }

  /* ─────────────────────────────────────────────
   * Q2 — Accept Credit Cards?
   * ─────────────────────────────────────────── */
  if (currentQuestion === 2) {
    return (
      <QuizShell>
        <QuizStepper stepIndex={2} kicker="Question 3 of 4" percent={percent} />
        <QuestionHeader
          Icon={CreditCard}
          eyebrow="Payment processing"
          title={<>Do you currently accept credit cards?</>}
          subtitle="Either way works — we support both processors and non-card businesses."
        />
        <AnimatePresence mode="wait">
          <motion.div
            key="q2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="px-8 md:px-12 pt-7 pb-10"
          >
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {[
                { value: true, label: 'Yes', sub: 'I process cards', Icon: Check },
                { value: false, label: 'No',  sub: 'Cash / bank only', Icon: XIcon },
              ].map((opt, i) => (
                <motion.button
                  key={String(opt.value)}
                  onClick={() => handleAcceptCards(opt.value)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex flex-col items-center gap-2 rounded-2xl p-6 bg-white border-2 border-[#dcdfe4] hover:border-[#0c66e4]/40 hover:bg-[#f1f6ff]/50 transition-all duration-200"
                  style={{ boxShadow: '0 1px 2px rgba(9,30,66,0.04)' }}
                >
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110"
                    style={{
                      background: '#0c66e4',
                      boxShadow: '0 6px 14px -4px rgba(12,102,228,0.4)',
                    }}
                  >
                    <opt.Icon className="w-5 h-5" strokeWidth={2.5} />
                  </span>
                  <div
                    className="text-[#172b4d] mt-1"
                    style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em' }}
                  >
                    {opt.label}
                  </div>
                  <div
                    className="uppercase text-[#758195]"
                    style={{ fontSize: 10, letterSpacing: '0.22em', fontWeight: 700 }}
                  >
                    {opt.sub}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </QuizShell>
    );
  }

  /* ─────────────────────────────────────────────
   * Q3 — Card Sales
   * ─────────────────────────────────────────── */
  if (currentQuestion === 3) {
    return (
      <QuizShell>
        <QuizStepper stepIndex={3} kicker="Final question" percent={100} />
        <QuestionHeader
          Icon={CreditCard}
          eyebrow="Monthly card sales"
          title={<>How much of that runs through your card processor?</>}
          subtitle="A rough monthly average is fine — we'll refine the exact number during application."
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="px-8 md:px-12 pt-7 pb-10"
        >
          <CreditCardSalesSlider value={cardSales} onChange={setCardSales} />

          <AnimatePresence>
            {cardSales > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-7 flex justify-center"
              >
                <button
                  onClick={handleCardSalesContinue}
                  className="card-hover-lift inline-flex items-center justify-center gap-2 text-white rounded-xl px-7 py-3.5"
                  style={{
                    background: '#0c66e4',
                    boxShadow: '0 10px 24px -10px rgba(12,102,228,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  See my estimate
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </QuizShell>
    );
  }

  return null;
}
