import { useState } from 'react';
import { X, ArrowLeft, CheckCircle, Camera, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface IDVerificationProps {
  ssn?: string;
  onComplete: (idPhoto: string, selfiePhoto: string) => void;
}

const SELFIE_IMG = 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3QlMjBzbWlsZXxlbnwxfHx8fDE3NzI4MzM5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

/* ─── Plaid-style grid logo ─── */
function PlaidLogo({ size = 16, color = '#111' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" fill={color} />
    </svg>
  );
}

export function IDVerification({ onComplete }: IDVerificationProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<'id' | 'selfie'>('id');
  const [done, setDone] = useState(false);

  const openModal = () => {
    setStep('id');
    setModalOpen(true);
  };

  const confirmId = () => setStep('selfie');
  const confirmSelfie = () => {
    setDone(true);
    setModalOpen(false);
    onComplete('id-verified', 'selfie-verified');
  };
  const skipId = () => setStep('selfie');
  const skipSelfie = () => {
    setDone(true);
    setModalOpen(false);
    onComplete('', '');
  };

  /* progress: 0 = id, 1 = selfie */
  const progressPct = step === 'id' ? 50 : 100;

  return (
    <>
      {/* Trigger */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 mb-4">
          {done
            ? <CheckCircle className="w-6 h-6 text-emerald-500" />
            : <Camera className="w-6 h-6 text-[#0c66e4]" />}
        </div>
        <h4 className="text-[#172b4d] dark:text-white mb-1">
          {done ? 'Identity Verified' : 'Verify Your Identity'}
        </h4>
        <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6">
          {done
            ? 'Your ID and selfie have been captured successfully.'
            : "We'll guide you through a quick ID and selfie capture via Plaid."}
        </p>
        <button
          onClick={openModal}
          disabled={done}
          className={`px-8 py-3 rounded-full text-sm transition-all ${
            done
              ? 'bg-emerald-500 text-white cursor-default'
              : 'bg-[#0c66e4] hover:bg-[#0055cc] text-white'
          }`}
        >
          {done ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Verified
            </span>
          ) : (
            'Begin Verification'
          )}
        </button>
      </div>

      {/* ── Plaid-style Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1F2933] rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {/* ─── Step 1: Capture ID ─── */}
                {step === 'id' && (
                  <motion.div
                    key="id"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pt-5 pb-5"
                  >
                    {/* Plaid header + progress */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <PlaidLogo size={14} color="#111" />
                        <span className="text-[10px] tracking-wider uppercase text-slate-500 dark:text-slate-300">Plaid</span>
                      </div>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Tab label */}
                    <p className="text-center text-sm text-[#172b4d] dark:text-white mb-2">ID</p>

                    {/* Progress bar */}
                    <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-700 mb-4 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[#111] dark:bg-white"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>

                    {/* Green checkmark */}
                    <div className="flex justify-center mb-3">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>

                    {/* ID image in dashed border */}
                    <div className="flex justify-center mb-3">
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-lg p-2 inline-block">
                        <div className="w-48 h-28 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-md flex items-center justify-center overflow-hidden relative">
                          {/* Stylised ID card placeholder */}
                          <div className="w-full h-full p-2.5 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-[7px] tracking-wider text-emerald-800/70 dark:text-emerald-300/70 uppercase">State</div>
                                <div className="text-[9px] text-emerald-900 dark:text-emerald-200 mt-0.5">DRIVER LICENSE</div>
                              </div>
                              <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="w-7 h-9 rounded-sm bg-emerald-300/40 dark:bg-emerald-600/30" />
                              <div className="flex-1 space-y-1">
                                <div className="h-1.5 w-16 rounded-full bg-emerald-300/50 dark:bg-emerald-600/30" />
                                <div className="h-1.5 w-12 rounded-full bg-emerald-300/40 dark:bg-emerald-600/20" />
                                <div className="h-1.5 w-20 rounded-full bg-emerald-300/30 dark:bg-emerald-600/15" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tip badge */}
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                        <Camera className="w-3 h-3" />
                        Make sure image is clear
                      </span>
                    </div>

                    {/* Delt logo */}
                    <div className="flex justify-center mb-3">
                      <span className="text-sm text-[#172b4d] dark:text-white tracking-tight">
                        <span className="text-[#0c66e4]">⊿</span>Delt
                      </span>
                    </div>

                    {/* Privacy */}
                    <p className="text-[10px] text-slate-300 dark:text-slate-500 text-center leading-relaxed mb-4">
                      Photos are encrypted end-to-end. By continuing you agree to Plaid's{' '}
                      <button className="underline hover:text-[#0c66e4]">Privacy Policy</button>.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={skipId}
                        className="flex-1 py-2.5 rounded-full text-sm text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                      >
                        Skip
                      </button>
                      <button
                        onClick={confirmId}
                        className="flex-1 py-2.5 rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-sm transition-all hover:opacity-90"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─── Step 2: Take Selfie ─── */}
                {step === 'selfie' && (
                  <motion.div
                    key="selfie"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pt-5 pb-5"
                  >
                    {/* Plaid header + progress */}
                    <div className="flex items-center justify-between mb-1">
                      <button
                        onClick={() => setStep('id')}
                        className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        <PlaidLogo size={14} color="#111" />
                        <span className="text-[10px] tracking-wider uppercase text-slate-500 dark:text-slate-300">Plaid</span>
                      </div>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Tab label */}
                    <p className="text-center text-sm text-[#172b4d] dark:text-white mb-2">Selfie</p>

                    {/* Progress bar */}
                    <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-700 mb-4 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[#111] dark:bg-white"
                        initial={{ width: '50%' }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>

                    {/* Green checkmark */}
                    <div className="flex justify-center mb-3">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>

                    {/* Selfie in dashed circle */}
                    <div className="flex justify-center mb-3">
                      <div className="relative w-36 h-36">
                        {/* Dashed circle border */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 144 144">
                          <circle
                            cx="72" cy="72" r="68"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2.5"
                            strokeDasharray="8 5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-2 rounded-full overflow-hidden">
                          <ImageWithFallback
                            src={SELFIE_IMG}
                            alt="Take a selfie"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Smile badge */}
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                        <Smile className="w-3 h-3" />
                        Smile
                      </span>
                    </div>

                    {/* Delt logo */}
                    <div className="flex justify-center mb-3">
                      <span className="text-sm text-[#172b4d] dark:text-white tracking-tight">
                        <span className="text-[#0c66e4]">⊿</span>Delt
                      </span>
                    </div>

                    {/* Privacy */}
                    <p className="text-[10px] text-slate-300 dark:text-slate-500 text-center leading-relaxed mb-4">
                      Photos are encrypted end-to-end. By continuing you agree to Plaid's{' '}
                      <button className="underline hover:text-[#0c66e4]">Privacy Policy</button>.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={skipSelfie}
                        className="flex-1 py-2.5 rounded-full text-sm text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                      >
                        Skip
                      </button>
                      <button
                        onClick={confirmSelfie}
                        className="flex-1 py-2.5 rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-sm transition-all hover:opacity-90"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
