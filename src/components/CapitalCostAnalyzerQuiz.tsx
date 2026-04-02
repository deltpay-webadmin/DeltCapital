import { useState } from 'react';
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

export function CapitalCostAnalyzer({ onApplyClick, onDeltLearnMore }: CapitalCostAnalyzerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [timeInBusiness, setTimeInBusiness] = useState<TimeInBusiness>('');
  const [acceptsCards, setAcceptsCards] = useState<boolean | null>(null);
  const [cardSales, setCardSales] = useState(0);
  const [deltToggle, setDeltToggle] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showDelta, setShowDelta] = useState(false);

  // Branch logic
  const noCards = acceptsCards === false;
  const isCrossSellBranch = noCards;
  const isDeltBoosted = deltToggle || isCrossSellBranch;
  const isRedirectCase = timeInBusiness === '<6mo';

  // Funding calc
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

  const handleRevenueInput = (value: number) => {
    setMonthlyRevenue(value);
  };

  const handleRevenueContinue = () => {
    if (monthlyRevenue > 0) {
      setCurrentQuestion(2);
    }
  };

  const handleTimeSelect = (value: TimeInBusiness) => {
    setTimeInBusiness(value);
    setTimeout(() => setCurrentQuestion(1), 300);
  };

  const handleAcceptCards = (value: boolean) => {
    setAcceptsCards(value);
    if (!value) {
      setCardSales(0);
      // No cards = show loading
      setTimeout(() => {
        setCurrentQuestion(4);
        triggerLoadingAndResults();
      }, 300);
    } else {
      // Yes cards = ask for card sales
      setTimeout(() => setCurrentQuestion(3), 300);
    }
  };

  const handleCardSalesInput = (value: number) => {
    setCardSales(value);
  };

  const handleCardSalesContinue = () => {
    if (cardSales > 0) {
      setCurrentQuestion(4);
      triggerLoadingAndResults();
    }
  };

  const handleToggleClick = () => {
    const next = !deltToggle;
    setDeltToggle(next);
    if (next) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
      setTimeout(() => setShowDelta(true), 300);
    } else {
      setShowDelta(false);
    }
  };

  const triggerLoadingAndResults = () => {
    setIsLoadingResults(true);
    setTimeout(() => {
      setIsLoadingResults(false);
      setShowResults(true);
    }, 2000);
  };

  const timeOptions: { value: TimeInBusiness; label: string }[] = [
    { value: '<6mo', label: 'Less than 6 months' },
    { value: '6-12mo', label: '6–12 months' },
    { value: '1-2yr', label: '1–2 years' },
    { value: '2yr+', label: '2+ years' },
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

  const progress = ((currentQuestion + 1) / 4) * 100;

  // LOADING RESULTS PHASE
  if (isLoadingResults) {
    return (
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl mx-auto border border-[#e8eaf0] overflow-hidden p-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto mb-4">
              <svg className="animate-spin text-[#4945ff]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-[#041E42] mb-2"
          >
            Calculating Your Funding Range
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base text-slate-600"
          >
            Analyzing your business profile...
          </motion.p>
        </div>
      </div>
    );
  }

  // RESULTS PHASE
  if (showResults) {
    return (
      <div className="bg-white rounded-2xl shadow-xl max-w-xl mx-auto border border-[#EBEBF0] overflow-hidden">
        <div className="text-center pt-11 pb-9 px-12">
          <div
            className="uppercase tracking-widest mb-1.5"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '1.2px',
              color: '#A0A0B0',
            }}
          >
            Estimated Funding Range
          </div>
          <p style={{ fontSize: '14px', color: '#8888A0', marginBottom: '32px' }}>
            Based on your business profile
          </p>

          {/* Strikethrough old amount when Delt toggle is ON */}
          <AnimatePresence>
            {isDeltBoosted && !noCards && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#64748B',
                  letterSpacing: '-0.5px',
                  textDecoration: 'line-through',
                  marginBottom: '8px',
                }}
              >
                {formatK(preBoostLow)}–{formatK(preBoostHigh)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* THE NUMBER — hero display */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            style={{
              fontSize: 'clamp(48px, 8vw, 64px)',
              fontWeight: 800,
              color: isDeltBoosted ? '#4945ff' : '#0B0B18',
              letterSpacing: '-2px',
              lineHeight: 1,
              marginBottom: '6px',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {formatK(displayLow)}
            <span style={{ color: '#A0A0B0', fontWeight: 400, margin: '0 4px' }}>–</span>
            {formatK(displayHigh)}
          </motion.div>

          <div style={{ fontSize: '13px', color: '#A0A0B0', marginBottom: '32px' }}>
            {isDeltBoosted ? 'With Delt processing' : 'Based on your monthly revenue'}
          </div>

          {/* Switch processing toggle OR static signup card */}
          {noCards ? (
            // Static card for users who don't accept credit cards
            <div
              style={{
                marginBottom: '32px',
                padding: '20px 24px',
                background: 'linear-gradient(135deg, #F8F9FF 0%, #F5F3FF 100%)',
                borderRadius: '12px',
                border: '1.5px solid #E5E7EB',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #4945ff 0%, #5B3AFF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(73,69,255,0.2)',
                  }}
                >
                  <Rocket
                    style={{
                      width: '18px',
                      height: '18px',
                      color: '#fff',
                      strokeWidth: 2,
                    }}
                  />
                </div>
                <div style={{ flex: 1, paddingTop: '2px' }}>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0F172A',
                      lineHeight: 1.4,
                      marginBottom: '6px',
                    }}
                  >
                    Enable payment processing with Delt
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748B',
                      lineHeight: 1.5,
                    }}
                  >
                    Unlock up to 2× more capital as your business grows
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Toggle for users who accept credit cards
            <div
              style={{
                marginBottom: '32px',
                padding: '20px 24px',
                background: deltToggle
                  ? 'linear-gradient(135deg, #F8F9FF 0%, #F5F3FF 100%)'
                  : '#FAFBFC',
                borderRadius: '12px',
                border: deltToggle ? '1.5px solid #E0E7FF' : '1.5px solid #E5E7EB',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'pointer',
              }}
              onClick={handleToggleClick}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: deltToggle
                      ? 'linear-gradient(135deg, #4945ff 0%, #5B3AFF 100%)'
                      : '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    flexShrink: 0,
                    boxShadow: deltToggle ? '0 4px 12px rgba(73,69,255,0.2)' : 'none',
                  }}
                >
                  <Zap
                    style={{
                      width: '18px',
                      height: '18px',
                      color: deltToggle ? '#fff' : '#9CA3AF',
                      strokeWidth: 2,
                    }}
                  />
                </div>
                <div style={{ flex: 1, paddingTop: '2px' }}>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#0F172A',
                      lineHeight: 1.4,
                      marginBottom: '6px',
                    }}
                  >
                    {isRedirectCase
                      ? 'Enable payment processing with Delt'
                      : 'Switch payment processing to Delt'}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#64748B',
                      lineHeight: 1.5,
                    }}
                  >
                    Unlock up to 2× more capital as your business grows
                  </div>
                </div>
                {/* Toggle Switch */}
                <div
                  style={{
                    width: '48px',
                    height: '28px',
                    borderRadius: '14px',
                    background: deltToggle ? '#4945ff' : '#CBD5E1',
                    padding: '3px',
                    transition: 'background 0.25s cubic-bezier(0.16,1,0.3,1)',
                    flexShrink: 0,
                    marginTop: '6px',
                  }}
                >
                  <motion.div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '11px',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    animate={{ x: deltToggle ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => onApplyClick?.(getCalculatorData())}
            className="w-full transition-all duration-150 flex items-center justify-center gap-2 mb-2.5"
            style={{
              padding: '16px 0',
              borderRadius: '10px',
              border: 'none',
              background: '#4945ff',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(73,69,255,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3b38d9';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(73,69,255,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#4945ff';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(73,69,255,0.2)';
            }}
          >
            Get My Offer
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div style={{ fontSize: '14.4px', color: '#A0A0B0', marginBottom: '24px' }}>
            No impact to your credit. Takes 2 minutes.
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#EBEBF0', marginBottom: '16px' }} />

          {/* Disclaimer */}
          <div
            style={{
              fontSize: '11.5px',
              color: '#B0B0BE',
              lineHeight: 1.5,
              marginBottom: '12px',
            }}
          >
            Estimates are approximate and not a guarantee of funding. Final offers are based on a full review of your business.
          </div>

          {/* How it Works link */}
          <button
            type="button"
            onClick={onDeltLearnMore}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#4945ff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            How it Works <span>→</span>
          </button>

          {/* Redirect case special messaging */}
          <AnimatePresence>
            {isRedirectCase && (
              <motion.div
                key="redirect"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div
                  className="rounded-xl p-4"
                  style={{
                    border: '1.5px solid rgba(73,69,255,0.12)',
                    background: 'rgba(73,69,255,0.02)',
                  }}
                >
                  <Rocket className="w-5 h-5 mb-2" style={{ color: '#4945ff' }} />
                  <p
                    className="text-[13px] text-[#041E42] mb-1"
                    style={{ fontWeight: 700, lineHeight: 1.35 }}
                  >
                    Get started with Delt today.
                  </p>
                  <p
                    className="text-[11.5px] text-gray-500"
                    style={{ fontWeight: 400, lineHeight: 1.5 }}
                  >
                    New businesses that process with Delt get a pre-approved offer and up to 2x more
                    capital as they grow.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delt Boost Badge */}
          <AnimatePresence>
            {isDeltBoosted && !isRedirectCase && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="mt-4"
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]"
                  style={{
                    background: 'rgba(73,69,255,0.08)',
                    color: '#4945ff',
                    fontWeight: 600,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  0% processing on your first $5,000
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // QUIZ PHASE - Question 0: Monthly Revenue
  if (currentQuestion === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl mx-auto border border-[#e8eaf0] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="time-in-business"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="p-8 md:p-12"
          >
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-[#1E40AF]">
                  Question 1 of 3
                </span>
                <span className="text-sm text-[#52606D]">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-[#E4E7EB] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#4945ff] to-[#6366f1]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4945ff]/10 rounded-full mb-4">
                <Calendar className="w-6 h-6 text-[#4945ff]" />
              </div>
              <div className="uppercase tracking-[0.15em] text-[#9CA3AF] text-xs font-semibold mb-6">
                Time in Business
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                {timeOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    onClick={() => handleTimeSelect(opt.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-4 rounded-xl border-2 border-[#e8eaf0] text-[#4a5568] hover:border-[#4945ff] hover:bg-[#4945ff]/5 transition-all duration-200 font-semibold text-sm"
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // QUIZ PHASE - Question 1: Time in Business
  if (currentQuestion === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl mx-auto border border-[#e8eaf0] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="p-8 md:p-12"
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-[#1E40AF]">
                Question 2 of 3
              </span>
              <span className="text-sm text-[#52606D]">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-[#E4E7EB] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4945ff]/10 rounded-full mb-4">
              <DollarSign className="w-6 h-6 text-[#4945ff]" />
            </div>
            <div className="uppercase tracking-[0.15em] text-[#9CA3AF] text-xs font-semibold mb-6">
              Monthly Revenue
            </div>
            <MonthlyRevenueSlider
              value={monthlyRevenue}
              onChange={handleRevenueInput}
            />
          </div>

          {/* Continue Button */}
          {monthlyRevenue > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={handleRevenueContinue}
                className="bg-[#4945ff] hover:bg-[#3b38d9] text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // QUIZ PHASE - Question 2: Accept Credit Cards?
  if (currentQuestion === 2) {
    return (
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl mx-auto border border-[#e8eaf0] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="accept-cards"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="p-8 md:p-12"
          >
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-[#1E40AF]">
                  Question 3 of 3
                </span>
                <span className="text-sm text-[#52606D]">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-[#E4E7EB] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4945ff]/10 rounded-full mb-4">
                <CreditCard className="w-6 h-6 text-[#4945ff]" />
              </div>
              <div className="uppercase tracking-[0.15em] text-[#9CA3AF] text-xs font-semibold mb-6">
                Do you currently accept credit cards?
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <motion.button
                  onClick={() => handleAcceptCards(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-[#e8eaf0] text-[#4a5568] hover:border-[#4945ff] hover:bg-[#4945ff]/5 transition-all duration-200 font-semibold text-sm"
                >
                  <Check className="w-5 h-5" />
                  Yes
                </motion.button>
                <motion.button
                  onClick={() => handleAcceptCards(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-[#e8eaf0] text-[#4a5568] hover:border-[#4945ff] hover:bg-[#4945ff]/5 transition-all duration-200 font-semibold text-sm"
                >
                  <XIcon className="w-5 h-5" />
                  No
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // QUIZ PHASE - Question 3: Card Sales Amount (only if they accept cards)
  if (currentQuestion === 3) {
    return (
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl mx-auto border border-[#e8eaf0] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="p-8 md:p-12"
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-[#1E40AF]">
                Final Question
              </span>
              <span className="text-sm text-[#52606D]">
                Almost Done!
              </span>
            </div>
            <div className="w-full h-2 bg-[#E4E7EB] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]"
                initial={{ width: '75%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4945ff]/10 rounded-full mb-4">
              <CreditCard className="w-6 h-6 text-[#4945ff]" />
            </div>
            <div className="uppercase tracking-[0.15em] text-[#9CA3AF] text-xs font-semibold mb-6">
              Monthly Credit Card Sales
            </div>
            <CreditCardSalesSlider
              value={cardSales}
              onChange={handleCardSalesInput}
            />
          </div>

          {/* Continue Button */}
          {cardSales > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={handleCardSalesContinue}
                className="bg-[#4945ff] hover:bg-[#3b38d9] text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm"
              >
                See My Estimate
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return null;
}