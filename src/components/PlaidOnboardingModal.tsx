import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink, PlaidLinkOnSuccess, PlaidLinkOnExit } from 'react-plaid-link';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
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

type PlaidStep = 'loading' | 'connect' | 'allSet';

// ─── Plaid Logo SVG ────────────────────────────────────────────────
function PlaidLogo({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" fill={color} />
    </svg>
  );
}

function PlaidHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-0">
      <div className="w-5" />
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

// ─── Animated check icon ───────────────────────────────────────────
function AnimatedCheckCircle() {
  return (
    <div className="relative w-16 h-16 mx-auto mb-4">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.12) 50%, transparent 70%)' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.6, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
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
  const [step, setStep] = useState<PlaidStep>('loading');
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<PlaidOnboardingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch a fresh link_token each time the modal opens; reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep('loading');
        setLinkToken(null);
        setPendingData(null);
        setError(null);
      }, 300);
      return () => clearTimeout(t);
    }

    setStep('loading');
    setError(null);
    fetch('/api/create-link-token')
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) {
          const msg = d.plaid_error_message || 'Unable to reach Plaid. Please try again.';
          throw new Error(msg);
        }
        return d;
      })
      .then((d) => {
        setLinkToken(d.link_token);
        setStep('connect');
      })
      .catch((e) => {
        setError(e.message || 'Unable to reach Plaid. Please try again.');
        setStep('connect');
      });
  }, [open]);

  const handleSuccess: PlaidLinkOnSuccess = useCallback(
    (publicToken, metadata) => {
      // Exchange token server-side (fire-and-forget for sandbox)
      fetch('/api/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: publicToken }),
      }).catch(() => {});

      const accounts = (metadata.accounts ?? []).map(
        (a) => `${a.name}${a.mask ? ` ••${a.mask}` : ''}`
      );
      const institution = metadata.institution?.name ?? null;

      const data: PlaidOnboardingData = {
        phone: '',
        selectedInstitution: institution,
        bankConnected: true,
        selectedAccounts: accounts,
        ssnLast4: '',
      };
      setPendingData(data);
      setStep('allSet');
    },
    []
  );

  const handleExit: PlaidLinkOnExit = useCallback((err) => {
    if (err) setError('Connection was interrupted. Please try again.');
  }, []);

  const { open: openPlaid, ready } = usePlaidLink({
    token: linkToken ?? '',
    onSuccess: handleSuccess,
    onExit: handleExit,
  });

  // ── All hooks must be called before this early return ──
  if (!open) return null;

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderStep = () => {
    switch (step) {

      // ── Loading: fetching link token ───────────────────────────────
      case 'loading':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} />
            <div className="px-7 pt-6 pb-4 flex-1 flex flex-col items-center justify-center gap-5">
              <div className="flex items-center justify-center gap-0">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  <img src={deltFavicon} alt="Delt" className="w-full h-full object-cover" />
                </div>
                <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center -ml-2 border-2 border-white">
                  <PlaidLogo size={16} color="white" />
                </div>
              </div>
              <div className="w-7 h-7 border-2 border-slate-200 border-t-black rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Connecting to Plaid…</p>
            </div>
          </div>
        );

      // ── Connect: show Plaid intro + launch button ──────────────────
      case 'connect':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} />
            <div className="px-7 pt-6 pb-4 flex-1 flex flex-col">
              {/* Dual logos */}
              <div className="flex items-center justify-center gap-0 mb-5">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  <img src={deltFavicon} alt="Delt" className="w-full h-full object-cover" />
                </div>
                <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center -ml-2 border-2 border-white">
                  <PlaidLogo size={16} color="white" />
                </div>
              </div>

              <h3 className="text-center text-[18px] text-[#172b4d] mb-1">
                This application uses <span className="font-semibold">Plaid</span> to
              </h3>
              <p className="text-center text-[18px] text-[#172b4d] mb-7">connect your account</p>

              {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 text-center">
                  {error}
                </div>
              )}

              <div className="mt-auto">
                <p className="text-[10.5px] text-slate-400 text-center leading-relaxed mb-4">
                  <span className="underline cursor-pointer hover:text-black transition-colors">Terms</span> apply. By continuing,
                  you agree to Plaid's{' '}
                  <span className="underline cursor-pointer hover:text-black transition-colors">Privacy Policy</span> and to
                  receive updates on plaid.com
                </p>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => openPlaid()}
                disabled={!ready || !linkToken}
                className="w-full py-3.5 rounded-full disabled:bg-slate-200 disabled:text-slate-400 enabled:bg-black enabled:text-white font-semibold text-base transition-all cursor-pointer"
              >
                {!ready || !linkToken ? 'Loading…' : 'Continue'}
              </button>
            </div>
          </div>
        );

      // ── All Set: success screen ────────────────────────────────────
      case 'allSet':
        return (
          <div className="flex flex-col h-full">
            <PlaidHeader onClose={onClose} />
            <div className="px-7 pt-6 pb-4 flex-1 flex flex-col items-center justify-center">
              <AnimatedCheckCircle />
              <h3 className="text-center text-[22px] font-semibold text-[#172b4d] mb-2">
                You're all set.
              </h3>
              <p className="text-center text-sm text-slate-500 max-w-[250px]">
                Bank verified and secured with Delt. Let's keep going.
              </p>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => {
                  if (pendingData) onComplete(pendingData);
                  onClose();
                }}
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

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
              animate={{ width: step === 'loading' ? '33%' : '66%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex flex-col flex-1 min-h-[480px]"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
