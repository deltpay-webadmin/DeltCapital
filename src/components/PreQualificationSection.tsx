import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { X, Sparkles, Clock, Shield, Zap, ArrowRight, Check, Lock, Signal, Wifi, BatteryFull } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { PreQualificationGame } from './PreQualificationGame';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Lightweight RAF-driven count-up. Mirrors the hook used by StatsSection.tsx
 * but kept inline so the phone visualization stays self-contained.
 */
function useCountUp(target: number, durationMs: number, start: boolean) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return value;
}

/**
 * Custom-built phone shell + approval interface. Replaces the legacy
 * 577 KB PNG mockup with a CSS / JSX scene that shares the design
 * language of the hero card, analyzer card, and How-It-Works visuals.
 */
function ApprovedPhone() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(phoneRef, { once: true, amount: 0.4 });
  const amount = useCountUp(125000, 2200, inView);

  // 12-month revenue heights (last bar is the tallest "now" bar)
  const bars = [38, 52, 47, 61, 55, 68, 64, 76, 72, 84, 81, 96];

  return (
    <div
      ref={phoneRef}
      className="prequal-phone relative"
      style={{ width: 296, height: 600 }}
    >
      {/* ── Phone shell ── */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: 52,
          background: '#0A1220',
          boxShadow:
            '0 32px 80px -20px rgba(12,102,228,0.55),' +
            ' 0 12px 28px -10px rgba(110,93,198,0.35),' +
            ' inset 0 1.5px 0 rgba(255,255,255,0.10),' +
            ' inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}
      >
        {/* Gradient ring around the bezel (mask-composite) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: 52,
            padding: 1.5,
            background:
              'rgba(12,102,228,0.55)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* ── Screen surface ── */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
            borderRadius: 44,
            background: '#ffffff',
          }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-7 pt-3.5 pb-1 text-[#0A1220]">
            <span className="tabular-nums" style={{ fontSize: 13, fontWeight: 600 }}>
              9:41
            </span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryFull className="w-4 h-4" />
            </div>
          </div>

          {/* Dynamic island */}
          <div
            aria-hidden
            className="absolute top-2 left-1/2 -translate-x-1/2"
            style={{
              width: 96,
              height: 28,
              borderRadius: 999,
              background: '#000',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          />

          {/* App content */}
          <div className="px-5 pt-9 pb-5 h-full flex flex-col">
            {/* App header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#dcdfe4]">
              <span
                className="text-[#0c66e4]"
                style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}
              >
                delt
              </span>
              <button
                aria-label="Close"
                className="w-7 h-7 rounded-full bg-[#f1f2f4] flex items-center justify-center text-[#44546f]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pre-qualified chip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 inline-flex items-center self-start gap-1.5 rounded-full border border-[#1F845A]/25 bg-[#1F845A]/[0.10] px-2.5 py-1"
            >
              <span className="processing-dot w-1.5 h-1.5 rounded-full bg-[#1F845A]" />
              <Check className="w-3 h-3 text-[#1F845A]" strokeWidth={3} />
              <span className="text-[#1F845A]" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em' }}>
                Pre-qualified · No credit impact
              </span>
            </motion.div>

            {/* Hero amount */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-3"
            >
              <div
                className="uppercase text-[#758195]"
                style={{ fontSize: 9, letterSpacing: '0.28em', fontWeight: 700 }}
              >
                Approved funding
              </div>
              <div
                className="text-gradient-primary tabular-nums mt-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 44,
                  fontWeight: 800,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.0,
                }}
              >
                ${Math.round(amount).toLocaleString()}
              </div>
              <div className="text-[#44546f] mt-1.5 text-xs">
                Up to · 6 month term
              </div>
            </motion.div>

            {/* Terms strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-1.5 mt-4"
            >
              {[
                { label: 'Factor rate', value: '1.18' },
                { label: 'Est. monthly', value: '$24K' },
                { label: 'Credit hit', value: '0%' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#dcdfe4] bg-white px-2 py-2"
                >
                  <div
                    className="uppercase text-[#758195]"
                    style={{ fontSize: 8, letterSpacing: '0.18em', fontWeight: 700 }}
                  >
                    {s.label}
                  </div>
                  <div
                    className="text-[#172b4d] tabular-nums mt-0.5"
                    style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.015em' }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Mini revenue chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-4 rounded-xl border border-[#dcdfe4] bg-[#fafbfc] p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="uppercase text-[#44546f]"
                  style={{ fontSize: 9, letterSpacing: '0.22em', fontWeight: 700 }}
                >
                  Revenue · 12 mo
                </span>
                <span className="text-[#1F845A] inline-flex items-center gap-1" style={{ fontSize: 10, fontWeight: 700 }}>
                  <Sparkles className="w-2.5 h-2.5" />
                  Trending up
                </span>
              </div>
              <div className="flex items-end gap-[3px] h-14">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${h}%` } : { height: 0 }}
                    transition={{ duration: 0.55, delay: 0.7 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 rounded-sm"
                    style={{
                      background:
                        i === bars.length - 1
                          ? '#0c66e4'
                          : 'rgba(12,102,228,0.45)',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Continue CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-auto inline-flex items-center justify-center gap-1.5 w-full text-white rounded-xl py-3 mb-2"
              style={{
                background: '#0c66e4',
                boxShadow: '0 10px 24px -10px rgba(12,102,228,0.7), inset 0 1px 0 rgba(255,255,255,0.18)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '-0.005em',
              }}
            >
              Continue application
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>

            {/* Security strip */}
            <div className="flex items-center justify-center gap-1.5 text-[#758195]">
              <Lock className="w-2.5 h-2.5" />
              <span style={{ fontSize: 9.5, letterSpacing: '0.04em' }}>Secured by Plaid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PreQualificationSectionProps {
  onApplyClick?: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
}

export interface PreQualificationSectionRef {
  openQuiz: () => void;
  scrollToSection: () => void;
}

export const PreQualificationSection = forwardRef<
  PreQualificationSectionRef,
  PreQualificationSectionProps
>(({ onApplyClick, onApplyFromQuiz, onCalculatorClick }, ref) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    openQuiz: () => setShowModal(true),
    scrollToSection: () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
  }));

  // Lock body scroll when quiz modal or results are open
  useEffect(() => {
    if (showModal || showResults) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal, showResults]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const handleShowResults = (data?: any) => {
    setQuizData(data);
    setShowModal(false);
    setShowResults(true);
  };

  const handleStartApplication = () => {
    setShowResults(false);
    if (onApplyFromQuiz) {
      onApplyFromQuiz(quizData);
    } else if (onApplyClick) {
      onApplyClick();
    }
  };

  const handleCtaClick = () => {
    if (onCalculatorClick) {
      onCalculatorClick();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative bg-[#172b4d] text-white overflow-hidden py-24 md:py-32"
      >
        {/* Mesh chromatic glow */}
        <div
          aria-hidden
          className="bg-mesh absolute inset-0 opacity-50 pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* ═══════ LEFT — Content ═══════ */}
            <div className="lg:col-span-7">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 uppercase text-[#85B8FF]"
                style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Pre-qualification
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 text-white"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.0,
                  maxWidth: '20ch',
                }}
              >
                {t('preQual.title')
                  .split(' ')
                  .map((word, i, arr) =>
                    i === arr.length - 1 ? (
                      <span key={i} className="text-gradient-primary">
                        {word}
                      </span>
                    ) : (
                      <React.Fragment key={i}>{word} </React.Fragment>
                    )
                  )}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 text-white/75 max-w-xl"
                style={{ fontSize: 18, lineHeight: 1.55 }}
              >
                Six questions. No credit impact. Instant results.
              </motion.p>

              {/* Quick trust pills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-7 flex flex-wrap gap-2.5"
              >
                {[
                  { icon: <Clock className="w-3.5 h-3.5" />, label: '60 seconds' },
                  { icon: <Shield className="w-3.5 h-3.5" />, label: 'Soft credit only' },
                  { icon: <Zap className="w-3.5 h-3.5" />, label: 'Real funding range' },
                ].map((pill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm px-3.5 py-2 text-white/85 text-xs font-medium"
                  >
                    <span className="text-[#85B8FF]">{pill.icon}</span>
                    {pill.label}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-5"
              >
                <button
                  onClick={handleCtaClick}
                  className="card-hover-lift group inline-flex items-center justify-center gap-2 bg-white text-[#0c66e4] font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-[0_24px_48px_-16px_rgba(12,102,228,0.55)] transition-shadow"
                  style={{ fontSize: 16 }}
                >
                  {t('preQual.button')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-white/55 text-sm">
                  {t('preQual.joinText')}
                </p>
              </motion.div>
            </div>

            {/* ═══════ RIGHT — Phone proof ═══════ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex lg:col-span-5 justify-center items-center relative"
            >
              {/* Behind-phone gradient halo */}
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div
                  className="w-[420px] h-[420px] rounded-full"
                  style={{
                    background:
                      'transparent 50%, transparent 78%)',
                    filter: 'blur(40px)',
                  }}
                />
              </div>

              <ApprovedPhone />
            </motion.div>
          </div>
        </div>

        {/* Phone float keyframe — applied to the .prequal-phone wrapper inside ApprovedPhone */}
        <style>{`
          @keyframes prequalFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .prequal-phone {
            animation: prequalFloat 5.5s ease-in-out infinite;
            will-change: transform;
          }
          @media (prefers-reduced-motion: reduce) {
            .prequal-phone { animation: none; }
          }
        `}</style>
      </section>

      {/* ── Quiz modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
          onClick={handleBackdropClick}
        >
          <div className="w-full max-w-4xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all hover:scale-110"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <PreQualificationGame startWithQuiz={true} onShowResults={handleShowResults} />
          </div>
        </div>
      )}

      {/* ── Results full-page ── */}
      {showResults && (
        <div className="fixed inset-0 bg-[#fafbfc] dark:bg-[#0A1F35] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
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
});

PreQualificationSection.displayName = 'PreQualificationSection';
