import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Check, Search, Eye, EyeOff, AlertCircle } from 'lucide-react';
import deltFavicon from 'figma:asset/c3c469c594c03c3bfc98fd83feeab8caee9ddef8.png';

// ─── Types ─────────────────────────────────────────────────────────
export interface PlaidOnboardingData {
  phone: string;
  selectedInstitution: string | null;
  bankConnected: boolean;
  selectedAccounts: string[];
  ssnLast4: string;
}

interface PlaidOnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: PlaidOnboardingData) => void;
}

type PlaidStep =
  | 'phone'
  | 'selectInstitution'
  | 'bankLogin'
  | 'selectAccounts'
  | 'verifySsn'
  | 'allSet';

// ─── Mock data ─────────────────────────────────────────────────────
const INSTITUTIONS = [
  { id: 'chase', name: 'Chase', url: 'www.chase.com', color: '#117ACA' },
  { id: 'bofa', name: 'Bank of America', url: 'www.bankofamerica.com', color: '#012169' },
  { id: 'wells', name: 'Wells Fargo', url: 'www.wellsfargo.com', color: '#D71E28' },
  { id: 'citi', name: 'Citibank Online', url: 'www.citi.com', color: '#003B70' },
  { id: 'usbank', name: 'U.S. Bank', url: 'www.usbank.com/', color: '#D52B1E' },
  { id: 'pnc', name: 'PNC Bank', url: 'www.pnc.com', color: '#F58025' },
  { id: 'td', name: 'TD Bank', url: 'www.td.com', color: '#34A853' },
  { id: 'capital', name: 'Capital One', url: 'www.capitalone.com', color: '#004977' },
];

const MOCK_ACCOUNTS = [
  { id: 'checking', name: 'Plaid Checking', last4: '0000', balance: '$100.00' },
  { id: 'savings', name: 'Plaid Saving', last4: '1111', balance: '$210.00' },
  { id: 'business', name: 'Business Checking', last4: '2222', balance: '$5,430.00' },
  { id: 'credit', name: 'Plaid Credit Card', last4: '3333', balance: '$2,100.00' },
];

// ─── Plaid Logo SVG ────────────────────────────────────────────────
function PlaidLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" fill="currentColor" />
    </svg>
  );
}

function PlaidHeader({ onClose, onBack }: { onClose: () => void; onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-0">
      {onBack ? (
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-5" />
      )}
      <div className="flex items-center gap-1.5">
        <div className="text-black"><PlaidLogo size={16} /></div>
        <span className="text-xs font-semibold tracking-wider uppercase text-black">Plaid</span>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// ─── Animated check icon for "All Set" ─────────────────────────────
function AnimatedCheckCircle() {
  return (
    <div className="relative w-16 h-16 mx-auto mb-4">
      {/* Glow ring — cyan tint matching Figma */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.12) 50%, transparent 70%)' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.6, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {/* Circle */}
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-[#10B981] flex items-center justify-center bg-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 250, delay: 0.35 }}
        >
          <Check className="w-6 h-6 text-[#10B981]" strokeWidth={3} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export function PlaidOnboardingModal({ open, onClose, onComplete }: PlaidOnboardingModalProps) {
  const [step, setStep] = useState<PlaidStep>('phone');
  const [direction, setDirection] = useState(1);

  // Form state
  const [phone, setPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [bankUsername, setBankUsername] = useState('');
  const [bankPassword, setBankPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [ssnLast4, setSsnLast4] = useState('');
  const [ssnError, setSsnError] = useState(false);

  const STEP_ORDER: PlaidStep[] = [
    'phone', 'selectInstitution', 'bankLogin', 'selectAccounts', 'verifySsn', 'allSet'
  ];

  const goTo = useCallback((target: PlaidStep) => {
    const curIdx = STEP_ORDER.indexOf(step);
    const tarIdx = STEP_ORDER.indexOf(target);
    setDirection(tarIdx > curIdx ? 1 : -1);
    setStep(target);
  }, [step]);

  const goNext = useCallback(() => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx < STEP_ORDER.length - 1) {
      setDirection(1);
      setStep(STEP_ORDER[idx + 1]);
    }
  }, [step]);

  const goBack = useCallback(() => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) {
      setDirection(-1);
      setStep(STEP_ORDER[idx - 1]);
    }
  }, [step]);

  const handleComplete = () => {
    onComplete({
      phone,
      selectedInstitution,
      bankConnected: true,
      selectedAccounts,
      ssnLast4,
    });
  };

  const getInstitutionName = () => {
    const inst = INSTITUTIONS.find((i) => i.id === selectedInstitution);
    return inst?.name || 'your bank';
  };

  const filteredInstitutions = INSTITUTIONS.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length > 6) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length > 3) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length > 0) return `(${digits}`;
    return '';
  };

  const selectAllAccounts = selectedAccounts.length === MOCK_ACCOUNTS.length;

  if (!open) return null;

  // ─── Slide animation variants ─────────────────────────────────────
  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  // ─── Progress ─────────────────────────────────────────────────────
  const progressSteps = STEP_ORDER.filter(s => s !== 'allSet');
  const currentProgressIndex = progressSteps.indexOf(step);
  const progressPercent = step === 'allSet' ? 100 : ((currentProgressIndex) / (progressSteps.length - 1)) * 100;

  // ─── Render step content ─────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // ── Step 1: Phone (matches Figma exactly) ─────────────────────
      case 'phone':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} />
            <div className="px-7 pt-6 pb-4 flex-1 flex flex-col">
              {/* Dual logos — Delt + Plaid */}
              <div className="flex items-center justify-center gap-0 mb-5">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  <img src={deltFavicon} alt="Delt" className="w-full h-full object-cover" />
                </div>
                <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center -ml-2 border-2 border-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" fill="white"/>
                  </svg>
                </div>
              </div>

              <h3 className="text-center text-[18px] text-[#041E42] mb-1">
                This application uses <span className="font-semibold">Plaid</span> to
              </h3>
              <p className="text-center text-[18px] text-[#041E42] mb-7">connect your account</p>

              {/* Phone input */}
              <div className="border border-slate-200 rounded-lg flex items-center px-3.5 py-3 mb-3 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                <span className="text-base mr-2">&#x1F1FA;&#x1F1F8;</span>
                <span className="text-sm text-slate-500 mr-2">+1</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="Phone"
                  className="flex-1 outline-none bg-transparent text-[#041E42] placeholder-slate-400 text-sm"
                  autoFocus
                />
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-2">
                <span className="text-amber-500 mr-1">&#x26A1;</span>
                Use your phone number to log in or sign up with Plaid to go faster next time.{' '}
                <button className="underline hover:text-black transition-colors cursor-pointer">Learn more</button>
              </p>

              <div className="mt-auto pt-6">
                <p className="text-[10.5px] text-slate-400 text-center leading-relaxed mb-4">
                  <button className="underline hover:text-black transition-colors cursor-pointer">Terms</button> apply. By continuing, you agree to Plaid's{' '}
                  <button className="underline hover:text-black transition-colors cursor-pointer">Privacy Policy</button> and to receive updates on plaid.com
                </p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={goNext}
                disabled={phone.replace(/\D/g, '').length < 10}
                className="w-full py-3.5 rounded-full bg-slate-300 disabled:bg-slate-200 disabled:text-slate-400 enabled:bg-black enabled:text-white font-semibold text-base transition-all cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        );

      // ── Step 2: Select Institution ─────────────────────────────────
      case 'selectInstitution':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} onBack={goBack} />
            <div className="px-5 pt-4 pb-2 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-[18px] font-semibold text-[#041E42] mb-4">
                Select your institution
              </h3>

              {/* Search */}
              <div className="border border-slate-200 rounded-lg flex items-center px-3 py-2.5 mb-4 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Institutions"
                  className="flex-1 outline-none bg-transparent text-sm text-[#041E42] placeholder-slate-400"
                  autoFocus
                />
              </div>

              {/* Institution list */}
              <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-1.5">
                {filteredInstitutions.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setSelectedInstitution(inst.id);
                      setDirection(1);
                      setStep('bankLogin');
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                      style={{ backgroundColor: inst.color }}
                    >
                      {inst.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#041E42]">{inst.name}</p>
                      <p className="text-xs text-slate-400">{inst.url}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Step 3: Bank Login ─────────────────────────────────────────
      case 'bankLogin':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} onBack={() => goTo('selectInstitution')} />
            <div className="px-7 pt-6 pb-4 flex-1 flex flex-col">
              <div className="flex items-center justify-center mb-5">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="10" width="18" height="11" rx="2" />
                    <path d="M12 3l9 7H3l9-7z" />
                    <line x1="7" y1="14" x2="7" y2="17" />
                    <line x1="12" y1="14" x2="12" y2="17" />
                    <line x1="17" y1="14" x2="17" y2="17" />
                  </svg>
                </div>
              </div>

              <h3 className="text-center text-[18px] font-semibold text-[#041E42] mb-1">
                Log into {getInstitutionName()}
              </h3>
              <p className="text-center text-sm text-slate-500 mb-6">
                Enter your <strong>{getInstitutionName()}</strong> credentials to connect your account to this application.
              </p>

              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  value={bankUsername}
                  onChange={(e) => setBankUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-3.5 text-sm text-[#041E42] placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  autoFocus
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={bankPassword}
                    onChange={(e) => setBankPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-3.5 pr-10 text-sm text-[#041E42] placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                By providing your {getInstitutionName()} credentials to Plaid, you're enabling Plaid to retrieve your financial data.
              </p>
            </div>
            <div className="px-5 pb-5 space-y-2">
              <button
                onClick={goNext}
                disabled={!bankUsername.trim() || !bankPassword.trim()}
                className="w-full py-3.5 rounded-full bg-slate-300 disabled:bg-slate-200 disabled:text-slate-400 enabled:bg-black enabled:text-white font-semibold text-base transition-all cursor-pointer"
              >
                Submit
              </button>
              <button className="w-full py-2 text-sm text-slate-500 hover:text-black font-medium transition-colors cursor-pointer">
                Reset password
              </button>
            </div>
          </div>
        );

      // ── Step 4: Select Accounts ────────────────────────────────────
      case 'selectAccounts':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} onBack={goBack} />
            <div className="px-7 pt-5 pb-4 flex-1 flex flex-col">
              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M2 10h20" />
                  </svg>
                </div>
              </div>

              <h3 className="text-center text-[18px] font-semibold text-[#041E42] mb-1">
                Select accounts
              </h3>
              <p className="text-center text-sm text-slate-500 mb-5">
                Plaid will only share data from the <strong>{getInstitutionName()}</strong> accounts you select with this application.
              </p>

              {/* Select All */}
              <button
                onClick={() => {
                  if (selectAllAccounts) {
                    setSelectedAccounts([]);
                  } else {
                    setSelectedAccounts(MOCK_ACCOUNTS.map((a) => a.id));
                  }
                }}
                className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 mb-2 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${selectAllAccounts ? 'bg-black' : 'border-2 border-slate-300'}`}>
                    {selectAllAccounts && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-medium text-[#041E42]">Select all</span>
                </div>
                <span className="text-xs text-slate-400">{selectedAccounts.length} of {MOCK_ACCOUNTS.length}</span>
              </button>

              {/* Account list */}
              <div className="space-y-1.5">
                {MOCK_ACCOUNTS.map((account) => {
                  const isSelected = selectedAccounts.includes(account.id);
                  return (
                    <button
                      key={account.id}
                      onClick={() => {
                        setSelectedAccounts((prev) =>
                          isSelected ? prev.filter((id) => id !== account.id) : [...prev, account.id]
                        );
                      }}
                      className="w-full flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-black' : 'border-2 border-slate-300'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-sm text-[#041E42]">
                          {account.name} &bull; {account.last4}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{account.balance}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mt-4">
                You'll share contact info, account and balance info, and account and routing number to help you fund your account, get considered for a loan, and verify your identity and prevent fraud.{' '}
                <button className="underline hover:text-black transition-colors cursor-pointer">Learn more</button>
              </p>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={goNext}
                disabled={selectedAccounts.length === 0}
                className="w-full py-3.5 rounded-full bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-base transition-all cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        );

      // ── Step 5: Verify SSN ─────────────────────────────────────────
      case 'verifySsn':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} onBack={goBack} />
            <div className="px-7 pt-4 pb-4 flex-1 flex flex-col">
              {/* Dual avatars */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  <PlaidLogo size={14} />
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center -ml-2 border-2 border-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" fill="white"/>
                  </svg>
                </div>
              </div>

              <h3 className="text-[20px] font-semibold text-[#041E42] mb-1">
                Verify your identity
              </h3>
              <p className="text-sm text-slate-500 mb-5">Social Security Number</p>

              <div>
                <input
                  type="text"
                  value={ssnLast4}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setSsnLast4(val);
                    setSsnError(false);
                  }}
                  placeholder="Answer"
                  maxLength={4}
                  className={`w-full border ${ssnError ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 focus:border-black focus:ring-1 focus:ring-black'} rounded-lg px-3.5 py-3.5 text-sm text-[#041E42] placeholder-slate-400 outline-none transition-all`}
                  autoFocus
                />
                {ssnError && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    This field is required
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => {
                  if (ssnLast4.length < 4) {
                    setSsnError(true);
                  } else {
                    goNext();
                  }
                }}
                disabled={ssnLast4.length < 4}
                className="w-full py-3.5 rounded-full bg-slate-300 disabled:bg-slate-200 disabled:text-slate-400 enabled:bg-black enabled:text-white font-semibold text-base transition-all cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        );

      // ── Step 6: All Set ────────────────────────────────────────────
      case 'allSet':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} />
            <div className="px-7 pt-6 pb-4 flex-1 flex flex-col items-center justify-center">
              <AnimatedCheckCircle />
              <h3 className="text-center text-[22px] font-semibold text-[#041E42] mb-2">
                You're all set.
              </h3>
              <p className="text-center text-sm text-slate-500 max-w-[250px]">
                Bank verified and secured with Delt. Let's keep going.
              </p>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={handleComplete}
                className="w-full py-3.5 rounded-full bg-black text-white font-semibold text-base transition-all cursor-pointer hover:bg-[#222]"
              >
                Continue
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80] flex items-center justify-center"
    >
      {/* Faded backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-[400px] mx-4 rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh', minHeight: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        {step !== 'allSet' && (
          <div className="h-1 bg-slate-100 w-full flex-shrink-0">
            <motion.div
              className="h-full bg-black"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>
        )}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex flex-col h-full min-h-[480px]"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}