import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Zap,
  Sparkles,
  Rocket,
  Check,
  X as XIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CapitalCostAnalyzerProps {
  onApplyClick?: (calculatorData?: {
    monthlyRevenue: string;
    timeInBusiness: string;
    creditCardProcessing: string;
    requestedAmount: string;
    acceptsCreditCards: boolean | null;
    deltProcessing: boolean; // true when user toggled Delt Boost or selected no-CC cross-sell branch
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

export function CapitalCostAnalyzer({ onApplyClick, onDeltLearnMore }: CapitalCostAnalyzerProps) {
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [revenueInputValue, setRevenueInputValue] = useState('');
  const [timeInBusiness, setTimeInBusiness] = useState<TimeInBusiness>('');
  const [acceptsCards, setAcceptsCards] = useState<boolean | null>(null); // null = not answered
  const [cardSales, setCardSales] = useState(0);
  const [cardSalesInputValue, setCardSalesInputValue] = useState('');
  const [deltToggle, setDeltToggle] = useState(false);

  // ── Calculating buffer ──
  const [showResults, setShowResults] = useState(false);
  const calcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── CTA glow tracking ──
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCtaMouseEnter = () => {
    setIsCtaHovered(true);
  };

  const handleCtaMouseLeave = () => {
    setIsCtaHovered(false);
  };

  // ── Branch logic ──
  const noCards = acceptsCards === false;
  const isCrossSellBranch = noCards;
  const isDeltBoosted = deltToggle || isCrossSellBranch;
  const isRedirectCase = timeInBusiness === '<6mo';

  // ── Funding calc ──
  // Base range: 50–67% of monthly revenue, TIB shifts within that range
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

  // Pre-boost (for the toggle before/after)
  const preBoostLow = Math.min(250000, Math.max(5000, Math.round(fundingLow / 1000) * 1000));
  const preBoostHigh = Math.min(250000, Math.max(preBoostLow + 2000, Math.round(fundingHigh / 1000) * 1000));

  // Delt boost: 1.75x the base range
  if (isDeltBoosted) {
    fundingLow *= 1.75;
    fundingHigh *= 1.75;
  }

  fundingLow = Math.round(fundingLow / 1000) * 1000;
  fundingHigh = Math.round(fundingHigh / 1000) * 1000;
  // Enforce min $5K and max $500K (boosted) / $250K (standard) caps
  const maxCap = isDeltBoosted ? 500000 : 250000;
  fundingLow = Math.min(maxCap, Math.max(5000, fundingLow));
  fundingHigh = Math.min(maxCap, Math.max(fundingLow + 2000, fundingHigh));

  // The numbers to display (boosted or base depending on toggle)
  const displayLow = isDeltBoosted ? fundingLow : preBoostLow;
  const displayHigh = isDeltBoosted ? fundingHigh : preBoostHigh;

  // ── All fields filled? ──
  // Revenue + TIB + card answer (if yes, also need card sales amount)
  const allFieldsFilled =
    monthlyRevenue > 0 &&
    timeInBusiness !== '' &&
    acceptsCards !== null &&
    (noCards || cardSales > 0);

  // ── Trigger calculation ──
  useEffect(() => {
    if (!allFieldsFilled) {
      if (calcTimerRef.current) clearTimeout(calcTimerRef.current);
      setShowResults(false);
      return;
    }

    if (calcTimerRef.current) clearTimeout(calcTimerRef.current);
    setShowResults(false);

    calcTimerRef.current = setTimeout(() => {
      setShowResults(true);
    }, 2500);

    return () => {
      if (calcTimerRef.current) clearTimeout(calcTimerRef.current);
    };
  }, [allFieldsFilled, monthlyRevenue, timeInBusiness, acceptsCards, cardSales]);

  useEffect(() => {
    return () => {
      if (calcTimerRef.current) clearTimeout(calcTimerRef.current);
    };
  }, []);

  // ── Handlers ──
  const handleRevenueInput = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const num = digits ? parseInt(digits, 10) : 0;
    const clamped = Math.min(num, 250000);
    setRevenueInputValue(clamped > 0 ? clamped.toLocaleString() : digits);
    setMonthlyRevenue(clamped);
  };

  const handleRevenueBlur = () => {
    if (monthlyRevenue > 0) setRevenueInputValue(Math.round(monthlyRevenue).toLocaleString());
  };

  const handleCardSalesInput = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const num = digits ? parseInt(digits, 10) : 0;
    const clamped = Math.min(num, 250000);
    setCardSalesInputValue(clamped > 0 ? clamped.toLocaleString() : digits);
    setCardSales(clamped);
  };

  const handleCardSalesBlur = () => {
    if (cardSales > 0) setCardSalesInputValue(Math.round(cardSales).toLocaleString());
  };

  const handleAcceptCards = (value: boolean) => {
    setAcceptsCards(value);
    if (!value) {
      setCardSales(0);
      setCardSalesInputValue('');
      setDeltToggle(false);
    }
  };

  const timeOptions: { value: TimeInBusiness; label: string }[] = [
    { value: '<6mo', label: 'Less than 6 months' },
    { value: '6-12mo', label: '6–12 months' },
    { value: '1-2yr', label: '1–2 years' },
    { value: '2yr+', label: '2+ years' },
  ];

  const ease300 = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  // ── Map to application form fields ──
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
      deltProcessing: isDeltBoosted, // true when user toggled Delt Boost or selected no-CC cross-sell branch
    };
  };

  // ── CTA logic ──
  const ctaIsUpgraded = (isDeltBoosted || isRedirectCase) && showResults;
  const ctaIsDeltInfo = deltToggle && showResults && !isRedirectCase && !isCrossSellBranch;

  // ── Progressive reveal flags ──
  const hasRevenue = monthlyRevenue > 0;
  const hasTIB = timeInBusiness !== '';

  return (
    <div className="bg-[#F7F8FC] rounded-2xl shadow-xl max-w-5xl mx-auto border border-[#e8eaf0] overflow-hidden">

      {/* ── Header ── */}
      <div className="text-center pt-8 sm:pt-9 md:pt-11 pb-2 px-4 sm:px-5">
        <h2
          className="mb-2"
          style={{ fontSize: 'clamp(1.35rem, 3.5vw, 2rem)', fontWeight: 700, color: '#041e42', lineHeight: 1.2 }}
        >
          How Much Could You Qualify For?
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(4,30,66,0.4)', lineHeight: 1.5 }}>
          Enter your details. See your funding estimate instantly.
        </p>
      </div>

      {/* ── Body — fixed-height two-column layout ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 sm:gap-5 lg:gap-7 px-4 sm:px-5 md:px-7 lg:px-10 pt-4 pb-6 sm:pb-7 md:pb-9 lg:h-[480px]"
      >

        {/* ═══════ LEFT COLUMN — Progressive Questions + CTA ═══════ */}
        <div className="flex flex-col min-h-0">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1 min-h-0">

          {/* ── 1. Monthly Revenue (always visible) ── */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e8eaf0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <label
              className="text-[11px] text-gray-400 uppercase tracking-widest mb-3 block"
              style={{ fontWeight: 600, letterSpacing: '0.1em' }}
            >
              Monthly Revenue
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#041E42] pointer-events-none select-none" style={{ fontSize: '1.15rem', fontWeight: 700 }}>$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={revenueInputValue}
                onChange={(e) => handleRevenueInput(e.target.value)}
                onBlur={handleRevenueBlur}
                className="w-full rounded-lg border border-[#e8eaf0] bg-[#F7F8FC] py-3 pl-9 pr-4 text-[#041E42] tabular-nums outline-none transition-all duration-200 focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/15"
                style={{ fontSize: '1.15rem', fontWeight: 700 }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2" style={{ fontWeight: 450 }}>
              Up to $250,000
            </p>
          </div>

          {/* ── 2. Time in Business — appears after revenue entered ── */}
          <AnimatePresence>
            {hasRevenue && (
              <motion.div
                key="tib-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e8eaf0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <label
                    className="text-[11px] text-gray-400 uppercase tracking-widest mb-3 block"
                    style={{ fontWeight: 600, letterSpacing: '0.1em' }}
                  >
                    Time in Business
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeOptions.map((opt) => {
                      const isActive = timeInBusiness === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setTimeInBusiness(isActive ? '' : opt.value)}
                          className={`px-3 py-2.5 rounded-lg border text-[13px] transition-all duration-200 ${
                            isActive
                              ? 'border-[#4945ff] bg-[#4945ff]/[0.04] text-[#4945ff]'
                              : 'border-[#e8eaf0] text-[#4a5568] hover:border-[#4945ff]/30'
                          }`}
                          style={{ fontWeight: isActive ? 600 : 450 }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 3. Accept Credit Cards? — appears after TIB selected ── */}
          <AnimatePresence>
            {hasTIB && (
              <motion.div
                key="cards-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e8eaf0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <label
                    className="text-[11px] text-gray-400 uppercase tracking-widest mb-3 block"
                    style={{ fontWeight: 600, letterSpacing: '0.1em' }}
                  >
                    Do you currently accept credit cards?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAcceptCards(true)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-[13.5px] transition-all duration-200 ${
                        acceptsCards === true
                          ? 'border-[#4945ff] bg-[#4945ff]/[0.04] text-[#4945ff]'
                          : 'border-[#e8eaf0] text-[#4a5568] hover:border-[#4945ff]/30'
                      }`}
                      style={{ fontWeight: acceptsCards === true ? 600 : 450 }}
                    >
                      <Check className="w-4 h-4" />
                      Yes
                    </button>
                    <button
                      onClick={() => handleAcceptCards(false)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-[13.5px] transition-all duration-200 ${
                        acceptsCards === false
                          ? 'border-[#4945ff] bg-[#4945ff]/[0.04] text-[#4945ff]'
                          : 'border-[#e8eaf0] text-[#4a5568] hover:border-[#4945ff]/30'
                      }`}
                      style={{ fontWeight: acceptsCards === false ? 600 : 450 }}
                    >
                      <XIcon className="w-4 h-4" />
                      No
                    </button>
                  </div>

                  {/* Card sales sub-field — only when "Yes" */}
                  <AnimatePresence>
                    {acceptsCards === true && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e8eaf0' }}>
                          <label
                            className="text-[11px] text-gray-400 uppercase tracking-widest mb-3 block"
                            style={{ fontWeight: 600, letterSpacing: '0.1em' }}
                          >
                            Monthly Card Sales
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#041E42] pointer-events-none select-none" style={{ fontSize: '0.95rem', fontWeight: 600 }}>$</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="0"
                              value={cardSalesInputValue}
                              onChange={(e) => handleCardSalesInput(e.target.value)}
                              onBlur={handleCardSalesBlur}
                              className="w-full rounded-lg border border-[#e8eaf0] bg-[#F7F8FC] py-2.5 pl-9 pr-4 text-[#041E42] tabular-nums outline-none transition-all duration-200 focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/15"
                              style={{ fontSize: '0.95rem', fontWeight: 600 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* ── CTA — full width of left column ── */}
          <div className="pt-4 flex-shrink-0">
            <motion.button
              ref={ctaRef}
              onMouseMove={handleCtaMouseMove}
              onMouseEnter={handleCtaMouseEnter}
              onMouseLeave={handleCtaMouseLeave}
              onClick={() => ctaIsDeltInfo ? onDeltLearnMore?.() : onApplyClick?.(getCalculatorData())}
              className={`relative overflow-hidden w-full py-3.5 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 ${
                !allFieldsFilled
                  ? 'bg-[#4945ff]/35 text-white/60 cursor-default'
                  : ctaIsDeltInfo
                    ? 'bg-[#4945ff] hover:bg-[#3d3ae0] text-white shadow-lg shadow-[#4945ff]/12 hover:shadow-xl hover:shadow-[#4945ff]/20 active:scale-[0.985]'
                    : ctaIsUpgraded
                      ? 'text-white active:scale-[0.985]'
                      : 'bg-[#4945ff] hover:bg-[#3d3ae0] text-white shadow-lg shadow-[#4945ff]/12 hover:shadow-xl hover:shadow-[#4945ff]/20 active:scale-[0.985]'
              }`}
              style={{
                fontWeight: 600,
                fontSize: '0.9375rem',
                ...(ctaIsUpgraded && !ctaIsDeltInfo
                  ? {
                      background: 'linear-gradient(135deg, #4945ff 0%, #3B5BF7 50%, #6366f1 100%)',
                      boxShadow: '0 4px 20px rgba(73,69,255,0.28), 0 0 0 1px rgba(73,69,255,0.10)',
                    }
                  : {}),
              }}
              disabled={!allFieldsFilled}
              animate={
                ctaIsUpgraded && !ctaIsDeltInfo
                  ? {
                      boxShadow: [
                        '0 4px 20px rgba(73,69,255,0.28), 0 0 0 1px rgba(73,69,255,0.10)',
                        '0 6px 28px rgba(73,69,255,0.35), 0 0 0 1px rgba(73,69,255,0.15)',
                        '0 4px 20px rgba(73,69,255,0.28), 0 0 0 1px rgba(73,69,255,0.10)',
                      ],
                    }
                  : {}
              }
              transition={ctaIsUpgraded && !ctaIsDeltInfo ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
              {allFieldsFilled && (
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  animate={{
                    opacity: isCtaHovered ? 1 : 0,
                    background: `radial-gradient(circle 140px at ${glowPos.x}px ${glowPos.y}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`,
                  }}
                  transition={{ opacity: { duration: 0.3 }, background: { duration: 0 } }}
                />
              )}
              <span className="flex items-center gap-2.5">
                Get My Offer
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
            <p
              className="text-center text-[12px] text-gray-400 mt-2"
              style={{ fontWeight: 400, fontStyle: 'italic' }}
            >
              No impact to your credit. Takes 2 minutes.
            </p>
          </div>
        </div>

        {/* ═══════ RIGHT COLUMN — Always visible funding estimate ═══════ */}
        <div className="flex flex-col min-h-0">

          {/* ══ Funding Range Card — flex-1 to fill available space ══ */}
          <div
            className="relative rounded-xl md:rounded-2xl flex-1 overflow-hidden flex flex-col"
            style={{
              background: hasRevenue && isDeltBoosted
                ? 'linear-gradient(145deg, #F5F7FA 0%, #EDEFFF 50%, #F5F7FA 100%)'
                : '#F5F7FA',
              border: hasRevenue && isDeltBoosted
                ? '1.5px solid rgba(73,69,255,0.18)'
                : '1px solid #e8eaf0',
              boxShadow: hasRevenue && isDeltBoosted
                ? '0 4px 24px rgba(73,69,255,0.10)'
                : '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.4s, border 0.4s, box-shadow 0.4s',
            }}
          >
            <div className="p-5 sm:p-6 md:p-7 flex-1 flex flex-col">
              {/* Estimate display */}
              <div className="flex-1 flex flex-col justify-center">
                <span
                  className="text-[11px] uppercase tracking-widest block mb-2"
                  style={{
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: hasRevenue ? '#9ca3af' : '#c7c9d1',
                    transition: 'color 0.3s',
                  }}
                >
                  Estimated Funding Range
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={hasRevenue ? `${displayLow}-${displayHigh}` : 'empty'}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                    className="py-1"
                  >
                    <span
                      className="tabular-nums tracking-tight block"
                      style={{
                        fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        color: !hasRevenue
                          ? '#d1d5db'
                          : isDeltBoosted
                            ? '#4945ff'
                            : '#041E42',
                        transition: 'color 0.4s ease',
                      }}
                    >
                      {hasRevenue ? (
                        <>{formatK(displayLow)}<span className="mx-1" style={{ opacity: 0.35 }}>–</span>{formatK(displayHigh)}</>
                      ) : (
                        <>$0<span className="mx-1" style={{ opacity: 0.35 }}>–</span>$0</>
                      )}
                    </span>
                  </motion.div>
                </AnimatePresence>

                <p
                  className="text-[13px] mt-1.5"
                  style={{
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: hasRevenue ? '#9ca3af' : '#c7c9d1',
                    transition: 'color 0.3s',
                  }}
                >
                  {!hasRevenue
                    ? 'Complete the fields to see your estimate.'
                    : isDeltBoosted
                      ? 'With Delt processing'
                      : 'Based on your monthly revenue'}
                </p>

                <AnimatePresence>
                  {hasRevenue && isDeltBoosted && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.95 }}
                      transition={ease300}
                      className="mt-2.5"
                    >
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]"
                        style={{ background: 'rgba(73,69,255,0.08)', color: '#4945ff', fontWeight: 600 }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        0% processing on your first $5,000
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Redirect case — early-stage business CTA */}
                <AnimatePresence>
                  {hasRevenue && isRedirectCase && (
                    <motion.div
                      key="redirect"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={ease300}
                      className="mt-4 space-y-3"
                    >
                      <div className="rounded-xl p-4" style={{ border: '1.5px solid rgba(73,69,255,0.12)', background: 'rgba(73,69,255,0.02)' }}>
                        <Rocket className="w-5 h-5 mb-2" style={{ color: '#4945ff' }} />
                        <p className="text-[13px] text-[#041E42] mb-1" style={{ fontWeight: 700, lineHeight: 1.35 }}>
                          Get started with Delt today.
                        </p>
                        <p className="text-[11.5px] text-gray-500" style={{ fontWeight: 400, lineHeight: 1.5 }}>
                          New businesses that process with Delt get a pre-approved offer and up to 2x more capital as they grow.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-[10.5px] text-gray-400/60 mt-3" style={{ fontWeight: 400, lineHeight: 1.45 }}>
                  Estimates are approximate and not a guarantee of funding. Final offers are based on a full review of your business.
                </p>
              </div>
            </div>

            {/* ── Cross-sell toggle — pinned to bottom of right column ── */}
            <div className="flex-shrink-0" style={{ borderTop: '1px solid #e8eaf0' }}>
              <button
                onClick={() => setDeltToggle(!deltToggle)}
                className="w-full text-left cursor-pointer transition-all duration-300 group"
                style={{
                  padding: 0,
                  background: deltToggle
                    ? 'linear-gradient(135deg, rgba(73,69,255,0.04) 0%, rgba(73,69,255,0.08) 100%)'
                    : 'transparent',
                  transition: 'background 0.3s',
                }}
              >
                <div className="px-5 sm:px-6 md:px-7 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                        style={{
                          background: deltToggle
                            ? 'linear-gradient(135deg, #4945ff, #6366f1)'
                            : '#d5d7de',
                          color: deltToggle ? '#fff' : '#9ca3af',
                          boxShadow: deltToggle ? '0 3px 10px rgba(73,69,255,0.25)' : 'none',
                        }}
                      >
                        <Zap style={{ width: '16px', height: '16px' }} />
                      </div>
                      <div className="min-w-0">
                        <span
                          className="text-[13px] block"
                          style={{
                            fontWeight: 600,
                            color: deltToggle ? '#041E42' : '#6b7280',
                            transition: 'color 0.3s',
                          }}
                        >
                          Switch processing to Delt for 2x more capital
                        </span>
                        {deltToggle && hasRevenue && !isRedirectCase && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[11.5px] block mt-0.5 tabular-nums"
                            style={{ fontWeight: 500, color: '#4945ff' }}
                          >
                            {formatK(preBoostLow)} → {formatK(fundingLow)}–{formatK(fundingHigh)}
                          </motion.span>
                        )}
                      </div>
                    </div>

                    {/* Toggle switch */}
                    <div
                      className="relative flex-shrink-0 rounded-full transition-all duration-300"
                      style={{
                        width: '44px',
                        height: '26px',
                        background: deltToggle ? '#4945ff' : '#c7c9d1',
                        boxShadow: deltToggle ? '0 0 10px rgba(73,69,255,0.30)' : 'none',
                      }}
                    >
                      <motion.span
                        className="block rounded-full bg-white shadow-md absolute"
                        style={{ width: '20px', height: '20px', top: '3px' }}
                        animate={{ x: deltToggle ? 20 : 3 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}