import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign, Building2, User, Mail, ArrowRight, Shield, Clock, Zap, Lock,
  Search, Check, ChevronDown, CreditCard,
} from 'lucide-react';

export interface LeadCaptureData {
  annualRevenue: string;
  acceptsCreditCards: boolean;
  monthlyCCSales: string;
  desiredFunding: string; // kept for backward compat — mirrors annualRevenue
  timeInBusiness: string;
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

/* ─── Currency helpers (UNCHANGED) ─── */
function formatCurrencyInput(value: string): string {
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

/* ─── Shake variant (UNCHANGED) ─── */
const shakeVariants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.45, ease: 'easeInOut' as const },
  },
  idle: { x: 0 },
};

/* ─────────────────────────────────────────────────
 * Shared input — modern field with gradient focus ring
 * ─────────────────────────────────────────────── */
function FieldShell({
  hasError,
  children,
  withIcon,
}: {
  hasError: boolean;
  withIcon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative rounded-xl transition-all ${
        hasError ? 'ring-2 ring-[#c9372c]/30' : ''
      }`}
    >
      <div
        className={`relative rounded-xl bg-white border transition-colors ${
          hasError ? 'border-[#c9372c]' : 'border-[#dcdfe4]'
        } focus-within:border-[#0c66e4] focus-within:ring-2 focus-within:ring-[#0c66e4]/20`}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
 * IndustryAutocomplete — modernized
 * ─────────────────────────────────────────────── */
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
    ? INDUSTRY_OPTIONS.filter((opt) =>
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
        className={`w-full rounded-xl px-4 py-3.5 text-left flex items-center justify-between transition-all cursor-pointer bg-white border ${
          hasError
            ? 'border-[#c9372c] ring-2 ring-[#c9372c]/30'
            : isOpen
              ? 'border-[#0c66e4] ring-2 ring-[#0c66e4]/20'
              : 'border-[#dcdfe4] hover:border-[#c1c7d0]'
        }`}
        style={{ fontSize: 14.5 }}
      >
        <span className={value ? 'text-[#172b4d] font-medium' : 'text-[#9aa5b1]'}>
          {value || 'Select your industry'}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180 text-[#0c66e4]' : 'text-[#758195]'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-[#dcdfe4] rounded-2xl overflow-hidden"
            style={{
              boxShadow:
                '0 24px 48px -16px rgba(9,30,66,0.20), 0 4px 12px rgba(9,30,66,0.06)',
            }}
          >
            {/* Search input */}
            <div className="p-3 border-b border-[#dcdfe4]">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#fafbfc] border border-[#dcdfe4]">
                <Search className="w-3.5 h-3.5 text-[#758195] flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search…"
                  className="flex-1 outline-none bg-transparent text-sm text-[#172b4d] placeholder-[#9aa5b1]"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-[220px] overflow-y-auto py-1">
              {filtered.length > 0 ? (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                      value === opt
                        ? 'bg-[#e9f2ff] text-[#0c66e4] font-semibold'
                        : 'text-[#172b4d] hover:bg-[#fafbfc]'
                    }`}
                  >
                    <span>{opt}</span>
                    {value === opt && (
                      <Check className="w-3.5 h-3.5 text-[#0c66e4]" strokeWidth={2.5} />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-[#9aa5b1]">
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

/* ─────────────────────────────────────────────────
 * Shared shell (mirrors QuizShell from CapitalCostAnalyzerQuiz)
 * ─────────────────────────────────────────────── */
function FormShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div aria-hidden className="bg-mesh absolute -inset-6 md:-inset-10 opacity-40 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
 * Stepper — 3 segments with gradient fill
 * ─────────────────────────────────────────────── */
function FormStepper({
  step,
  skipped,
  total = 3,
}: {
  step: number;
  skipped: Record<`step${0 | 1 | 2}`, boolean>;
  total?: number;
}) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const wasSkipped = skipped[`step${i as 0 | 1 | 2}`];
        const isDone = i < step || (wasSkipped && i <= step);
        const isActive = i === step;
        return (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-[#dcdfe4] overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: isDone || isActive ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{
                background: isDone
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
  );
}

/* ─────────────────────────────────────────────────
 * Step header — gradient icon + eyebrow + headline
 * ─────────────────────────────────────────────── */
function StepHeader({
  Icon,
  eyebrow,
  title,
  subtitle,
}: {
  Icon: typeof DollarSign;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 text-white"
        style={{
          background: '#0c66e4',
          boxShadow: '0 10px 24px -8px rgba(12,102,228,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <span
        className="block uppercase text-[#0c66e4]"
        style={{ fontSize: 11, letterSpacing: '0.28em', fontWeight: 700 }}
      >
        {eyebrow}
      </span>
      <h3
        className="mt-2 text-[#172b4d]"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p className="mt-2 text-[#44546f]" style={{ fontSize: 14.5, lineHeight: 1.55 }}>
          {subtitle}
        </p>
      )}
    </>
  );
}

/* Common label */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[#44546f] mb-2"
      style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}
    >
      {children}
    </label>
  );
}

/* Common error row */
function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[#c9372c] mt-1.5 inline-flex items-center gap-1.5"
      style={{ fontSize: 12, fontWeight: 500 }}
    >
      <span className="w-1 h-1 rounded-full bg-[#c9372c]" />
      {children}
    </motion.p>
  );
}

/* Continue / Submit button */
function PrimaryButton({
  onClick,
  children,
  endIcon,
}: {
  onClick: () => void;
  children: React.ReactNode;
  endIcon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="card-hover-lift w-full text-white inline-flex items-center justify-center gap-2 rounded-xl py-3.5 transition-shadow"
      style={{
        background: '#0c66e4',
        boxShadow:
          '0 12px 28px -10px rgba(12,102,228,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
        fontSize: 15,
        fontWeight: 700,
      }}
    >
      {children}
      {endIcon}
    </button>
  );
}

function SecondaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3.5 rounded-xl border border-[#dcdfe4] text-[#172b4d] transition-colors hover:bg-[#fafbfc]"
      style={{ fontSize: 14, fontWeight: 600 }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────
 * Main component
 * ─────────────────────────────────────────────── */
export function LeadCaptureForm({ onSubmit, initialData }: LeadCaptureFormProps) {
  const [annualRevenue, setAnnualRevenue] = useState(initialData?.annualRevenue || '');
  const [acceptsCreditCards, setAcceptsCreditCards] = useState<boolean | null>(
    initialData?.acceptsCreditCards ?? null
  );
  const [monthlyCCSales, setMonthlyCCSales] = useState(initialData?.monthlyCCSales || '');
  const [timeInBusiness, setTimeInBusiness] = useState(initialData?.timeInBusiness || '');
  const [businessName, setBusinessName] = useState(initialData?.businessName || '');
  const [industry, setIndustry] = useState(initialData?.industry || '');
  const [ownerFirstName, setOwnerFirstName] = useState(initialData?.ownerFirstName || '');
  const [ownerLastName, setOwnerLastName] = useState(initialData?.ownerLastName || '');
  const [ownerEmail, setOwnerEmail] = useState(initialData?.ownerEmail || '');

  /* Pre-fill detection — UNCHANGED */
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

  const initialStep = step0Prefilled ? (step1Prefilled ? (step2Prefilled ? 2 : 2) : 1) : 0;
  const [step, setStep] = useState(initialStep);

  const skippedSteps = {
    step0: step0Prefilled,
    step1: step1Prefilled,
    step2: step2Prefilled,
  };

  /* Validation — UNCHANGED */
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shakeKey, setShakeKey] = useState(0);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail);

  const triggerShake = (fieldErrors: Record<string, boolean>) => {
    setErrors(fieldErrors);
    setShakeKey((prev) => prev + 1);
    setTimeout(() => setErrors({}), 2000);
  };

  const handleStep0Continue = () => {
    const errs: Record<string, boolean> = {};
    if (!annualRevenue || parseCurrencyToNumber(annualRevenue) === 0) errs.annualRevenue = true;
    if (acceptsCreditCards === null) errs.acceptsCreditCards = true;
    if (acceptsCreditCards && (!monthlyCCSales || parseCurrencyToNumber(monthlyCCSales) === 0)) errs.monthlyCCSales = true;
    if (!timeInBusiness) errs.timeInBusiness = true;
    if (Object.keys(errs).length > 0) { triggerShake(errs); return; }
    setStep(1);
  };

  const handleStep1Continue = () => {
    const errs: Record<string, boolean> = {};
    if (!businessName.trim()) errs.businessName = true;
    if (!industry) errs.industry = true;
    if (Object.keys(errs).length > 0) { triggerShake(errs); return; }
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
    if (Object.keys(errs).length > 0) { triggerShake(errs); return; }
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

  /* Time-in-business as button grid (replaces the native <select>) */
  const timeOptions = [
    { value: '6-12 months', label: '6 – 12 months', sub: 'Getting started' },
    { value: '1-2 years',   label: '1 – 2 years',   sub: 'Established' },
    { value: '2-5 years',   label: '2 – 5 years',   sub: 'Veteran' },
    { value: '5+ years',    label: '5+ years',      sub: 'Long-standing' },
  ];

  return (
    <FormShell>
      {/* Header */}
      <div className="px-7 sm:px-10 pt-8 pb-6 border-b border-[#dcdfe4]">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <span
              className="block uppercase text-[#0c66e4]"
              style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
            >
              Get funded
            </span>
            <h2
              className="mt-2 text-[#172b4d]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.65rem, 3.2vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              Start your application
            </h2>
            <p className="text-[#44546f] mt-1.5" style={{ fontSize: 13.5 }}>
              Takes less than 2 minutes · No credit impact
            </p>
          </div>
        </div>
        <FormStepper step={step} skipped={skippedSteps} />
      </div>

      {/* Form content */}
      <div className="px-7 sm:px-10 py-7 min-h-[380px] flex flex-col">
        <AnimatePresence mode="wait">
          {/* ─────────────────────── Step 0 ─────────────────────── */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <StepHeader
                Icon={DollarSign}
                eyebrow="Step 1 of 3 · Revenue"
                title="Tell us about your revenue"
                subtitle="We use these numbers to determine your funding range. Estimates are fine — we'll refine the exact figures later."
              />

              <div className="space-y-5 mt-7 flex-1">
                {/* Annual Revenue */}
                <div>
                  <FieldLabel>Annual business revenue</FieldLabel>
                  <motion.div
                    key={`shake-revenue-${shakeKey}`}
                    variants={shakeVariants}
                    animate={errors.annualRevenue ? 'shake' : 'idle'}
                  >
                    <FieldShell hasError={!!errors.annualRevenue}>
                      <DollarSign
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                          errors.annualRevenue ? 'text-[#c9372c]' : 'text-[#758195]'
                        }`}
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={annualRevenue}
                        onChange={(e) => {
                          setAnnualRevenue(formatCurrencyInput(e.target.value));
                          setErrors((prev) => ({ ...prev, annualRevenue: false }));
                        }}
                        placeholder="e.g. $1,200,000"
                        className="w-full bg-transparent rounded-xl pl-11 pr-4 py-3.5 text-[#172b4d] placeholder-[#9aa5b1] outline-none"
                        style={{ fontSize: 15 }}
                        autoFocus
                      />
                    </FieldShell>
                  </motion.div>
                  {errors.annualRevenue && <FieldError>Please enter your annual revenue</FieldError>}
                </div>

                {/* Accept Credit Cards */}
                <div>
                  <FieldLabel>Do you accept credit cards?</FieldLabel>
                  <motion.div
                    key={`shake-cc-${shakeKey}`}
                    variants={shakeVariants}
                    animate={errors.acceptsCreditCards ? 'shake' : 'idle'}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      { value: true,  label: 'Yes', sub: 'I process cards', Icon: Check },
                      { value: false, label: 'No',  sub: 'Cash / bank only', Icon: CreditCard },
                    ].map((opt) => {
                      const isActive = acceptsCreditCards === opt.value;
                      return (
                        <motion.button
                          key={String(opt.value)}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setAcceptsCreditCards(opt.value);
                            if (!opt.value) setMonthlyCCSales('');
                            setErrors((prev) => ({
                              ...prev,
                              acceptsCreditCards: false,
                              ...(opt.value ? {} : { monthlyCCSales: false }),
                            }));
                          }}
                          className={`group relative rounded-2xl px-5 py-4 transition-all duration-200 text-left ${
                            isActive
                              ? 'bg-gradient-to-br from-[#f1f6ff] to-[#f5f3ff] border-2 border-[#0c66e4]/40'
                              : errors.acceptsCreditCards
                                ? 'bg-white border-2 border-[#c9372c]/40'
                                : 'bg-white border-2 border-[#dcdfe4] hover:border-[#0c66e4]/30 hover:bg-[#f1f6ff]/50'
                          }`}
                          style={{
                            boxShadow: isActive
                              ? '0 8px 22px -10px rgba(12,102,228,0.4)'
                              : '0 1px 2px rgba(9,30,66,0.04)',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-transform ${
                                isActive ? 'scale-105' : 'group-hover:scale-105'
                              }`}
                              style={{
                                background: '#0c66e4',
                                boxShadow: '0 6px 14px -4px rgba(12,102,228,0.4)',
                              }}
                            >
                              <opt.Icon className="w-4 h-4" strokeWidth={2.5} />
                            </span>
                            <div>
                              <div className="text-[#172b4d]" style={{ fontSize: 15, fontWeight: 700 }}>
                                {opt.label}
                              </div>
                              <div
                                className="uppercase text-[#758195] mt-0.5"
                                style={{ fontSize: 9.5, letterSpacing: '0.22em', fontWeight: 700 }}
                              >
                                {opt.sub}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                  {errors.acceptsCreditCards && <FieldError>Please select an option</FieldError>}
                </div>

                {/* Monthly CC Sales — conditional */}
                <AnimatePresence>
                  {acceptsCreditCards === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <FieldLabel>Monthly credit card sales</FieldLabel>
                      <motion.div
                        key={`shake-ccsales-${shakeKey}`}
                        variants={shakeVariants}
                        animate={errors.monthlyCCSales ? 'shake' : 'idle'}
                      >
                        <FieldShell hasError={!!errors.monthlyCCSales}>
                          <CreditCard
                            className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                              errors.monthlyCCSales ? 'text-[#c9372c]' : 'text-[#758195]'
                            }`}
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={monthlyCCSales}
                            onChange={(e) => {
                              setMonthlyCCSales(formatCurrencyInput(e.target.value));
                              setErrors((prev) => ({ ...prev, monthlyCCSales: false }));
                            }}
                            placeholder="e.g. $50,000"
                            className="w-full bg-transparent rounded-xl pl-11 pr-4 py-3.5 text-[#172b4d] placeholder-[#9aa5b1] outline-none"
                            style={{ fontSize: 15 }}
                          />
                        </FieldShell>
                      </motion.div>
                      {errors.monthlyCCSales && (
                        <FieldError>Please enter your monthly credit card sales</FieldError>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Time in Business — button grid replacing native <select> */}
                <div>
                  <FieldLabel>Time in business</FieldLabel>
                  <motion.div
                    key={`shake-time-${shakeKey}`}
                    variants={shakeVariants}
                    animate={errors.timeInBusiness ? 'shake' : 'idle'}
                    className="grid grid-cols-2 gap-2"
                  >
                    {timeOptions.map((opt) => {
                      const isActive = timeInBusiness === opt.value;
                      return (
                        <motion.button
                          key={opt.value}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setTimeInBusiness(opt.value);
                            setErrors((prev) => ({ ...prev, timeInBusiness: false }));
                          }}
                          className={`group rounded-xl px-4 py-3 transition-all duration-200 text-left ${
                            isActive
                              ? 'bg-gradient-to-br from-[#f1f6ff] to-[#f5f3ff] border-2 border-[#0c66e4]/40'
                              : errors.timeInBusiness
                                ? 'bg-white border-2 border-[#c9372c]/30'
                                : 'bg-white border-2 border-[#dcdfe4] hover:border-[#0c66e4]/30 hover:bg-[#f1f6ff]/50'
                          }`}
                          style={{
                            boxShadow: isActive ? '0 6px 16px -8px rgba(12,102,228,0.35)' : 'none',
                          }}
                        >
                          <div className="text-[#172b4d]" style={{ fontSize: 14, fontWeight: 700 }}>
                            {opt.label}
                          </div>
                          <div
                            className="uppercase text-[#758195] mt-0.5"
                            style={{ fontSize: 9, letterSpacing: '0.2em', fontWeight: 700 }}
                          >
                            {opt.sub}
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                  {errors.timeInBusiness && <FieldError>Please select your time in business</FieldError>}
                </div>
              </div>

              <div className="mt-7">
                <PrimaryButton
                  onClick={handleStep0Continue}
                  endIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </PrimaryButton>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────── Step 1 ─────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <StepHeader
                Icon={Building2}
                eyebrow="Step 2 of 3 · Business"
                title="Tell us about your business"
                subtitle="We use this to tailor your funding options to your industry."
              />

              {skippedSteps.step0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-5 px-3 py-2 rounded-lg border border-[#1F845A]/25"
                  style={{ background: 'rgba(31,132,90,0.08)' }}
                >
                  <Check className="w-3.5 h-3.5 text-[#1F845A]" strokeWidth={2.5} />
                  <span className="text-[#1F845A] text-xs font-semibold">
                    Revenue info saved from calculator
                  </span>
                </motion.div>
              )}

              <div className="space-y-5 mt-6 flex-1">
                {/* Business Name */}
                <div>
                  <FieldLabel>Business name</FieldLabel>
                  <motion.div
                    key={`shake-biz-${shakeKey}`}
                    variants={shakeVariants}
                    animate={errors.businessName ? 'shake' : 'idle'}
                  >
                    <FieldShell hasError={!!errors.businessName}>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          setErrors((prev) => ({ ...prev, businessName: false }));
                        }}
                        placeholder="Your business name"
                        className="w-full bg-transparent rounded-xl px-4 py-3.5 text-[#172b4d] placeholder-[#9aa5b1] outline-none"
                        style={{ fontSize: 15 }}
                        autoFocus
                      />
                    </FieldShell>
                  </motion.div>
                  {errors.businessName && <FieldError>Business name is required</FieldError>}
                </div>

                {/* Industry */}
                <div>
                  <FieldLabel>Industry</FieldLabel>
                  <motion.div
                    key={`shake-ind-${shakeKey}`}
                    variants={shakeVariants}
                    animate={errors.industry ? 'shake' : 'idle'}
                  >
                    <IndustryAutocomplete
                      value={industry}
                      onChange={(val) => {
                        setIndustry(val);
                        setErrors((prev) => ({ ...prev, industry: false }));
                      }}
                      hasError={!!errors.industry}
                    />
                  </motion.div>
                  {errors.industry && <FieldError>Please select your industry</FieldError>}
                </div>
              </div>

              <div className="mt-7 flex gap-3">
                {!skippedSteps.step0 && <SecondaryButton onClick={() => setStep(0)}>Back</SecondaryButton>}
                <div className="flex-1">
                  <PrimaryButton
                    onClick={handleStep1Continue}
                    endIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────── Step 2 ─────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <StepHeader
                Icon={User}
                eyebrow="Step 3 of 3 · Owner"
                title="Owner information"
                subtitle="We use this to prepare your offer and securely connect your bank."
              />

              <div className="space-y-5 mt-7 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  {/* First Name */}
                  <div>
                    <FieldLabel>First name</FieldLabel>
                    <motion.div
                      key={`shake-fn-${shakeKey}`}
                      variants={shakeVariants}
                      animate={errors.ownerFirstName ? 'shake' : 'idle'}
                    >
                      <FieldShell hasError={!!errors.ownerFirstName}>
                        <input
                          type="text"
                          value={ownerFirstName}
                          onChange={(e) => {
                            setOwnerFirstName(e.target.value);
                            setErrors((prev) => ({ ...prev, ownerFirstName: false }));
                          }}
                          placeholder="First name"
                          className="w-full bg-transparent rounded-xl px-4 py-3.5 text-[#172b4d] placeholder-[#9aa5b1] outline-none"
                          style={{ fontSize: 15 }}
                          autoFocus
                        />
                      </FieldShell>
                    </motion.div>
                    {errors.ownerFirstName && <FieldError>Required</FieldError>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <FieldLabel>Last name</FieldLabel>
                    <motion.div
                      key={`shake-ln-${shakeKey}`}
                      variants={shakeVariants}
                      animate={errors.ownerLastName ? 'shake' : 'idle'}
                    >
                      <FieldShell hasError={!!errors.ownerLastName}>
                        <input
                          type="text"
                          value={ownerLastName}
                          onChange={(e) => {
                            setOwnerLastName(e.target.value);
                            setErrors((prev) => ({ ...prev, ownerLastName: false }));
                          }}
                          placeholder="Last name"
                          className="w-full bg-transparent rounded-xl px-4 py-3.5 text-[#172b4d] placeholder-[#9aa5b1] outline-none"
                          style={{ fontSize: 15 }}
                        />
                      </FieldShell>
                    </motion.div>
                    {errors.ownerLastName && <FieldError>Required</FieldError>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <FieldLabel>Email address</FieldLabel>
                  <motion.div
                    key={`shake-email-${shakeKey}`}
                    variants={shakeVariants}
                    animate={errors.ownerEmail ? 'shake' : 'idle'}
                  >
                    <FieldShell hasError={!!errors.ownerEmail}>
                      <Mail
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                          errors.ownerEmail ? 'text-[#c9372c]' : 'text-[#758195]'
                        }`}
                      />
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => {
                          setOwnerEmail(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            ownerEmail: false,
                            ownerEmailFormat: false,
                          }));
                        }}
                        placeholder="you@business.com"
                        className="w-full bg-transparent rounded-xl pl-11 pr-4 py-3.5 text-[#172b4d] placeholder-[#9aa5b1] outline-none"
                        style={{ fontSize: 15 }}
                      />
                    </FieldShell>
                  </motion.div>
                  {errors.ownerEmail && (
                    <FieldError>
                      {errors.ownerEmailFormat ? 'Please enter a valid email address' : 'Email is required'}
                    </FieldError>
                  )}
                </div>
              </div>

              <div className="mt-7 flex gap-3">
                {!skippedSteps.step1 && <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>}
                <div className="flex-1">
                  <PrimaryButton
                    onClick={handleStep2Submit}
                    endIcon={<Lock className="w-4 h-4" />}
                  >
                    Connect your bank
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer trust signals */}
      <div className="px-7 sm:px-10 py-4 bg-[#fafbfc] border-t border-[#dcdfe4]">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[#44546f]">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
            <Shield className="w-3 h-3 text-[#0c66e4]" />
            256-bit encryption
          </span>
          <span className="hidden sm:inline-block w-px h-3 bg-[#dcdfe4]" />
          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
            <Clock className="w-3 h-3 text-[#0c66e4]" />
            2 min to complete
          </span>
          <span className="hidden sm:inline-block w-px h-3 bg-[#dcdfe4]" />
          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
            <Zap className="w-3 h-3 text-[#1F845A]" />
            No credit impact
          </span>
        </div>
      </div>
    </FormShell>
  );
}
