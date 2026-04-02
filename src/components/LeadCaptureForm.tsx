import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, Building2, User, Mail, ArrowRight, Shield, Clock, Zap, Lock, Search, Check, ChevronDown, CreditCard } from 'lucide-react';
import deltFavicon from 'figma:asset/c3c469c594c03c3bfc98fd83feeab8caee9ddef8.png';

export interface LeadCaptureData {
  annualRevenue: string;
  acceptsCreditCards: boolean;
  monthlyCCSales: string;
  desiredFunding: string; // kept for backward compat — mirrors annualRevenue
  timeInBusiness: string; // e.g. "6-12 months", "1-2 years", "2-5 years", "5+ years"
  businessName: string;
  industry: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
}

interface LeadCaptureFormProps {
  onSubmit: (data: LeadCaptureData) => void;
  initialData?: Partial<LeadCaptureData>;
}

// ─── Currency formatting helpers ─────────────────────────────────────
function formatCurrencyInput(value: string): string {
  // Strip everything except digits
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return '$' + parseInt(digits, 10).toLocaleString();
}

function parseCurrencyToNumber(value: string): number {
  const digits = value.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

const INDUSTRY_OPTIONS = [
  'Restaurant / Food Service',
  'Retail',
  'Construction',
  'Healthcare',
  'Transportation / Trucking',
  'Professional Services',
  'E-Commerce',
  'Auto Repair / Dealership',
  'Beauty / Salon',
  'Real Estate',
  'Manufacturing',
  'Hospitality / Hotel',
  'Fitness / Gym',
  'Legal Services',
  'Accounting / Finance',
  'Cleaning Services',
  'Landscaping',
  'Dental / Orthodontics',
  'Veterinary',
  'Other',
];

// ─── Shake animation variant ───────────────────────────────────────
const shakeVariants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.45, ease: 'easeInOut' },
  },
  idle: { x: 0 },
};

// ─── Industry Autocomplete Component ───────────────────────────────
function IndustryAutocomplete({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (val: string) => void;
  hasError: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? INDUSTRY_OPTIONS.filter(opt =>
        opt.toLowerCase().includes(query.toLowerCase())
      )
    : INDUSTRY_OPTIONS;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt: string) => {
    onChange(opt);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full border rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between transition-all cursor-pointer ${
          hasError
            ? 'border-red-400 ring-1 ring-red-400'
            : value
              ? 'border-slate-200 text-[#041E42]'
              : 'border-slate-200 text-slate-400'
        } ${isOpen ? 'border-[#041E42] ring-1 ring-[#041E42]' : ''}`}
      >
        <span className={value ? 'text-[#041E42]' : 'text-slate-400'}>
          {value || 'Select your industry'}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-lg shadow-black/8 overflow-hidden"
          >
            {/* Search input */}
            <div className="p-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search..."
                  className="flex-1 outline-none bg-transparent text-sm text-[#041E42] placeholder-slate-400"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-[200px] overflow-y-auto py-1">
              {filtered.length > 0 ? (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                      value === opt
                        ? 'bg-[#041E42]/5 text-[#041E42] font-medium'
                        : 'text-[#041E42] hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {value === opt && <Check className="w-3.5 h-3.5 text-[#041E42]" strokeWidth={2.5} />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  No industries match "{query}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────
export function LeadCaptureForm({ onSubmit, initialData }: LeadCaptureFormProps) {
  const [annualRevenue, setAnnualRevenue] = useState(initialData?.annualRevenue || '');
  const [acceptsCreditCards, setAcceptsCreditCards] = useState<boolean | null>(initialData?.acceptsCreditCards ?? null);
  const [monthlyCCSales, setMonthlyCCSales] = useState(initialData?.monthlyCCSales || '');
  const [timeInBusiness, setTimeInBusiness] = useState(initialData?.timeInBusiness || '');
  const [businessName, setBusinessName] = useState(initialData?.businessName || '');
  const [industry, setIndustry] = useState(initialData?.industry || '');
  const [ownerFirstName, setOwnerFirstName] = useState(initialData?.ownerFirstName || '');
  const [ownerLastName, setOwnerLastName] = useState(initialData?.ownerLastName || '');
  const [ownerEmail, setOwnerEmail] = useState(initialData?.ownerEmail || '');

  // Determine which steps are already complete from pre-filled data
  // Step 0 = revenue/CC data, Step 1 = business info, Step 2 = owner info
  const step0Prefilled = (() => {
    if (!initialData) return false;
    const hasRevenue = !!(initialData.annualRevenue && parseCurrencyToNumber(initialData.annualRevenue) > 0);
    const hasCC = initialData.acceptsCreditCards !== undefined && initialData.acceptsCreditCards !== null;
    const hasCCSales = initialData.acceptsCreditCards === false || !!(initialData.monthlyCCSales && parseCurrencyToNumber(initialData.monthlyCCSales) > 0);
    const hasTimeInBusiness = !!(initialData.timeInBusiness?.trim());
    return hasRevenue && hasCC && hasCCSales && hasTimeInBusiness;
  })();

  const step1Prefilled = (() => {
    if (!initialData) return false;
    return !!(initialData.businessName?.trim()) && !!(initialData.industry?.trim());
  })();

  const step2Prefilled = (() => {
    if (!initialData) return false;
    return !!(initialData.ownerFirstName?.trim()) && !!(initialData.ownerLastName?.trim()) && !!(initialData.ownerEmail?.trim());
  })();

  // Auto-start at the first step that ISN'T already complete
  const initialStep = step0Prefilled ? (step1Prefilled ? (step2Prefilled ? 2 : 2) : 1) : 0;
  const [step, setStep] = useState(initialStep);

  // Track which steps were pre-filled (to show a "pre-filled" badge or skip them)
  const skippedSteps = {
    step0: step0Prefilled,
    step1: step1Prefilled,
    step2: step2Prefilled,
  };

  // Error / shake states
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shakeKey, setShakeKey] = useState(0); // bump to re-trigger shake

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail);

  const triggerShake = (fieldErrors: Record<string, boolean>) => {
    setErrors(fieldErrors);
    setShakeKey(prev => prev + 1);
    // Auto-clear errors after a delay
    setTimeout(() => setErrors({}), 2000);
  };

  const handleStep0Continue = () => {
    const errs: Record<string, boolean> = {};
    if (!annualRevenue || parseCurrencyToNumber(annualRevenue) === 0) errs.annualRevenue = true;
    if (acceptsCreditCards === null) errs.acceptsCreditCards = true;
    if (acceptsCreditCards && (!monthlyCCSales || parseCurrencyToNumber(monthlyCCSales) === 0)) errs.monthlyCCSales = true;
    if (!timeInBusiness) errs.timeInBusiness = true;
    if (Object.keys(errs).length > 0) {
      triggerShake(errs);
      return;
    }
    setStep(1);
  };

  const handleStep1Continue = () => {
    const errs: Record<string, boolean> = {};
    if (!businessName.trim()) errs.businessName = true;
    if (!industry) errs.industry = true;
    if (Object.keys(errs).length > 0) {
      triggerShake(errs);
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = () => {
    const errs: Record<string, boolean> = {};
    if (!ownerFirstName.trim()) errs.ownerFirstName = true;
    if (!ownerLastName.trim()) errs.ownerLastName = true;
    if (!ownerEmail.trim()) {
      errs.ownerEmail = true;
    } else if (!isEmailValid) {
      errs.ownerEmailFormat = true;
      errs.ownerEmail = true;
    }
    if (Object.keys(errs).length > 0) {
      triggerShake(errs);
      return;
    }
    onSubmit({
      annualRevenue,
      acceptsCreditCards: acceptsCreditCards === true,
      monthlyCCSales: acceptsCreditCards ? monthlyCCSales : '',
      desiredFunding: annualRevenue,
      timeInBusiness,
      businessName,
      industry,
      ownerFirstName,
      ownerLastName,
      ownerEmail,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-slate-200/60"
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img src={deltFavicon} alt="Delt" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#041E42] tracking-tight">Get Funded</h2>
              <p className="text-slate-500 text-xs mt-0.5">Takes less than 2 minutes</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((s) => {
              const isSkipped = skippedSteps[`step${s}` as keyof typeof skippedSteps];
              const isFilled = s < step || (isSkipped && s <= step);
              return (
                <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-[#041E42]"
                    initial={{ width: '0%' }}
                    animate={{ width: isFilled ? '100%' : s === step ? '50%' : '0%' }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Form content */}
        <div className="px-6 sm:px-8 py-6 min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* ── Step 0: Desired Funding ── */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-[#4945ff]" />
                  <span className="text-xs text-[#4945ff] font-medium uppercase tracking-wider">Step 1 of 3</span>
                </div>
                <h3 className="text-[#041E42] text-xl mb-1">Tell us about your revenue</h3>
                <p className="text-slate-500 text-sm mb-5">This helps us determine your funding options</p>

                <div className="space-y-4 flex-1">
                  {/* Annual Revenue */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Annual Business Revenue</label>
                    <motion.div
                      key={`shake-revenue-${shakeKey}`}
                      variants={shakeVariants}
                      animate={errors.annualRevenue ? 'shake' : 'idle'}
                    >
                      <div className="relative">
                        <DollarSign className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${errors.annualRevenue ? 'text-red-400' : 'text-slate-400'}`} />
                        <input
                          type="text"
                          inputMode="numeric"
                          value={annualRevenue}
                          onChange={(e) => { setAnnualRevenue(formatCurrencyInput(e.target.value)); setErrors(prev => ({ ...prev, annualRevenue: false })); }}
                          placeholder="e.g. $1,200,000"
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm text-[#041E42] placeholder-slate-400 outline-none transition-all ${
                            errors.annualRevenue
                              ? 'border-red-400 ring-1 ring-red-400'
                              : 'border-slate-200 focus:border-[#041E42] focus:ring-1 focus:ring-[#041E42]'
                          }`}
                          autoFocus
                        />
                      </div>
                    </motion.div>
                    {errors.annualRevenue && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                        Please enter your annual revenue
                      </motion.p>
                    )}
                  </div>

                  {/* Accept Credit Cards */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Do you accept credit cards?</label>
                    <motion.div
                      key={`shake-cc-${shakeKey}`}
                      variants={shakeVariants}
                      animate={errors.acceptsCreditCards ? 'shake' : 'idle'}
                      className="flex gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => { setAcceptsCreditCards(true); setErrors(prev => ({ ...prev, acceptsCreditCards: false })); }}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm transition-all cursor-pointer ${
                          acceptsCreditCards === true
                            ? 'border-[#041E42] bg-[#041E42] text-white font-medium'
                            : errors.acceptsCreditCards
                              ? 'border-red-300 text-[#041E42] bg-red-50/50'
                              : 'border-slate-200 text-[#041E42] hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAcceptsCreditCards(false); setMonthlyCCSales(''); setErrors(prev => ({ ...prev, acceptsCreditCards: false, monthlyCCSales: false })); }}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm transition-all cursor-pointer ${
                          acceptsCreditCards === false
                            ? 'border-[#041E42] bg-[#041E42] text-white font-medium'
                            : errors.acceptsCreditCards
                              ? 'border-red-300 text-[#041E42] bg-red-50/50'
                              : 'border-slate-200 text-[#041E42] hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        No
                      </button>
                    </motion.div>
                    {errors.acceptsCreditCards && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                        Please select an option
                      </motion.p>
                    )}
                  </div>

                  {/* Monthly CC Sales — shown only if acceptsCreditCards === true */}
                  <AnimatePresence>
                    {acceptsCreditCards === true && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Monthly Credit Card Sales</label>
                        <motion.div
                          key={`shake-ccsales-${shakeKey}`}
                          variants={shakeVariants}
                          animate={errors.monthlyCCSales ? 'shake' : 'idle'}
                        >
                          <div className="relative">
                            <CreditCard className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${errors.monthlyCCSales ? 'text-red-400' : 'text-slate-400'}`} />
                            <input
                              type="text"
                              inputMode="numeric"
                              value={monthlyCCSales}
                              onChange={(e) => { setMonthlyCCSales(formatCurrencyInput(e.target.value)); setErrors(prev => ({ ...prev, monthlyCCSales: false })); }}
                              placeholder="e.g. $50,000"
                              className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm text-[#041E42] placeholder-slate-400 outline-none transition-all ${
                                errors.monthlyCCSales
                                  ? 'border-red-400 ring-1 ring-red-400'
                                  : 'border-slate-200 focus:border-[#041E42] focus:ring-1 focus:ring-[#041E42]'
                              }`}
                            />
                          </div>
                        </motion.div>
                        {errors.monthlyCCSales && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                            Please enter your monthly credit card sales
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Time in Business */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Time in Business</label>
                    <motion.div
                      key={`shake-time-${shakeKey}`}
                      variants={shakeVariants}
                      animate={errors.timeInBusiness ? 'shake' : 'idle'}
                    >
                      <select
                        value={timeInBusiness}
                        onChange={(e) => { setTimeInBusiness(e.target.value); setErrors(prev => ({ ...prev, timeInBusiness: false })); }}
                        className={`w-full border rounded-xl px-4 py-3 text-sm text-[#041E42] placeholder-slate-400 outline-none transition-all ${
                          errors.timeInBusiness
                            ? 'border-red-400 ring-1 ring-red-400'
                            : 'border-slate-200 focus:border-[#041E42] focus:ring-1 focus:ring-[#041E42]'
                        }`}
                      >
                        <option value="">Select...</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="2-5 years">2-5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                    </motion.div>
                    {errors.timeInBusiness && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                        Please select your time in business
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleStep0Continue}
                    className="w-full py-3.5 rounded-xl bg-[#041E42] text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-[#0a2d5c]"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 1: Business Name & Industry ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-[#4945ff]" />
                  <span className="text-xs text-[#4945ff] font-medium uppercase tracking-wider">Step 2 of 3</span>
                </div>
                <h3 className="text-[#041E42] text-xl mb-1">Tell us about your business</h3>
                <p className="text-slate-500 text-sm mb-5">We use this to tailor your funding options</p>

                {/* Show pre-filled badge when step 0 was auto-completed */}
                {skippedSteps.step0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-4 px-3 py-2 bg-[#10B981]/8 border border-[#10B981]/20 rounded-lg"
                  >
                    <Check className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={2.5} />
                    <span className="text-xs text-[#10B981] font-medium">Revenue info saved from calculator</span>
                  </motion.div>
                )}

                <div className="space-y-4 flex-1">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Business Name</label>
                    <motion.div
                      key={`shake-biz-${shakeKey}`}
                      variants={shakeVariants}
                      animate={errors.businessName ? 'shake' : 'idle'}
                    >
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => { setBusinessName(e.target.value); setErrors(prev => ({ ...prev, businessName: false })); }}
                        placeholder="Your business name"
                        className={`w-full border rounded-xl px-4 py-3 text-sm text-[#041E42] placeholder-slate-400 outline-none transition-all ${
                          errors.businessName
                            ? 'border-red-400 ring-1 ring-red-400'
                            : 'border-slate-200 focus:border-[#041E42] focus:ring-1 focus:ring-[#041E42]'
                        }`}
                        autoFocus
                      />
                    </motion.div>
                    {errors.businessName && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                        Business name is required
                      </motion.p>
                    )}
                  </div>

                  {/* Industry Autocomplete */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Industry</label>
                    <motion.div
                      key={`shake-ind-${shakeKey}`}
                      variants={shakeVariants}
                      animate={errors.industry ? 'shake' : 'idle'}
                    >
                      <IndustryAutocomplete
                        value={industry}
                        onChange={(val) => { setIndustry(val); setErrors(prev => ({ ...prev, industry: false })); }}
                        hasError={!!errors.industry}
                      />
                    </motion.div>
                    {errors.industry && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                        Please select your industry
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  {!skippedSteps.step0 && (
                    <button
                      onClick={() => setStep(0)}
                      className="px-5 py-3.5 rounded-xl border border-slate-200 text-[#041E42] text-sm font-medium transition-all cursor-pointer hover:bg-slate-50"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleStep1Continue}
                    className="flex-1 py-3.5 rounded-xl bg-[#041E42] text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-[#0a2d5c]"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Owner Name & Email ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-[#4945ff]" />
                  <span className="text-xs text-[#4945ff] font-medium uppercase tracking-wider">Step 3 of 3</span>
                </div>
                <h3 className="text-[#041E42] text-xl mb-1">Owner information</h3>
                <p className="text-slate-500 text-sm mb-5">We'll use this to prepare your offer</p>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">First Name</label>
                      <motion.div
                        key={`shake-fn-${shakeKey}`}
                        variants={shakeVariants}
                        animate={errors.ownerFirstName ? 'shake' : 'idle'}
                      >
                        <input
                          type="text"
                          value={ownerFirstName}
                          onChange={(e) => { setOwnerFirstName(e.target.value); setErrors(prev => ({ ...prev, ownerFirstName: false })); }}
                          placeholder="First name"
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-[#041E42] placeholder-slate-400 outline-none transition-all ${
                            errors.ownerFirstName
                              ? 'border-red-400 ring-1 ring-red-400'
                              : 'border-slate-200 focus:border-[#041E42] focus:ring-1 focus:ring-[#041E42]'
                          }`}
                          autoFocus
                        />
                      </motion.div>
                      {errors.ownerFirstName && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                          Required
                        </motion.p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Last Name</label>
                      <motion.div
                        key={`shake-ln-${shakeKey}`}
                        variants={shakeVariants}
                        animate={errors.ownerLastName ? 'shake' : 'idle'}
                      >
                        <input
                          type="text"
                          value={ownerLastName}
                          onChange={(e) => { setOwnerLastName(e.target.value); setErrors(prev => ({ ...prev, ownerLastName: false })); }}
                          placeholder="Last name"
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-[#041E42] placeholder-slate-400 outline-none transition-all ${
                            errors.ownerLastName
                              ? 'border-red-400 ring-1 ring-red-400'
                              : 'border-slate-200 focus:border-[#041E42] focus:ring-1 focus:ring-[#041E42]'
                          }`}
                        />
                      </motion.div>
                      {errors.ownerLastName && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                          Required
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
                    <motion.div
                      key={`shake-email-${shakeKey}`}
                      variants={shakeVariants}
                      animate={errors.ownerEmail ? 'shake' : 'idle'}
                    >
                      <div className="relative">
                        <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${errors.ownerEmail ? 'text-red-400' : 'text-slate-400'}`} />
                        <input
                          type="email"
                          value={ownerEmail}
                          onChange={(e) => { setOwnerEmail(e.target.value); setErrors(prev => ({ ...prev, ownerEmail: false, ownerEmailFormat: false })); }}
                          placeholder="you@business.com"
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm text-[#041E42] placeholder-slate-400 outline-none transition-all ${
                            errors.ownerEmail
                              ? 'border-red-400 ring-1 ring-red-400'
                              : 'border-slate-200 focus:border-[#041E42] focus:ring-1 focus:ring-[#041E42]'
                          }`}
                        />
                      </div>
                    </motion.div>
                    {errors.ownerEmail && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                        {errors.ownerEmailFormat ? 'Please enter a valid email address' : 'Email is required'}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  {!skippedSteps.step1 && (
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3.5 rounded-xl border border-slate-200 text-[#041E42] text-sm font-medium transition-all cursor-pointer hover:bg-slate-50"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleStep2Submit}
                    className="flex-1 py-3.5 rounded-xl bg-[#041E42] text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-[#0a2d5c]"
                  >
                    Connect Your Bank
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer trust signals */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50/80 border-t border-slate-100">
          <div className="flex items-center justify-center gap-5 text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>256-bit encryption</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>2 min to complete</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>No credit impact</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}