import React, { useState, useRef, useEffect } from 'react';
import { X, FileText, BarChart3, DollarSign, Clock, Shield, Zap, CheckCircle2, TrendingUp, CreditCard, Banknote, ArrowRight, Landmark, RefreshCw, PieChart, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
import { Footer } from './Footer';

interface HowItWorksPageProps {
  onClose: () => void;
  onApplyClick?: () => void;
  onCalculatorClick?: () => void;
  onAboutClick?: () => void;
  onHowItWorksClick?: () => void;
  onReviewsClick?: () => void;
  onBlogClick?: () => void;
  onFAQClick?: () => void;
  onSupportClick?: () => void;
  onWinsClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
  onResourcesClick?: () => void;
}

interface Step {
  number: number;
  title: string;
  tagline: string;
  description: string;
  bullets: { icon: React.ReactNode; text: string }[];
  stat: string;
  statLabel: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Quick Application',
    tagline: 'Simple. Fast. No credit impact.',
    description:
      'Start with a streamlined application that takes just minutes to complete. We ask for basic business details and connect securely to your bank — no hard credit pulls, no paperwork, no waiting.',
    bullets: [
      { icon: <FileText className="w-4 h-4" />, text: 'Complete a short online application in under 5 minutes' },
      { icon: <Landmark className="w-4 h-4" />, text: 'Securely connect your bank via Plaid — no statements to upload' },
      { icon: <Shield className="w-4 h-4" />, text: 'Soft credit check only — no impact to your score' },
      { icon: <Clock className="w-4 h-4" />, text: 'Instant confirmation that your application is received' },
    ],
    stat: '5 min',
    statLabel: 'Average application time',
  },
  {
    number: 2,
    title: 'Review & Approval',
    tagline: 'Revenue-based. Human-reviewed. Transparent.',
    description:
      'Our underwriting team reviews your revenue patterns — not just your credit score. We look at real business performance to determine how much capital you qualify for, then present a clear offer with no hidden fees.',
    bullets: [
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Revenue-based underwriting — we focus on your cash flow' },
      { icon: <Users className="w-4 h-4" />, text: 'Dedicated funding specialist assigned to your file' },
      { icon: <PieChart className="w-4 h-4" />, text: 'Transparent pricing — one factor rate, no compounding' },
      { icon: <Zap className="w-4 h-4" />, text: 'Most applications approved within hours, not weeks' },
    ],
    stat: '24 hrs',
    statLabel: 'Average approval time',
  },
  {
    number: 3,
    title: 'Get Funded & Grow',
    tagline: 'Capital in your account. Immediately.',
    description:
      'Once approved, funds are deposited directly into your business bank account — often the same day. Repayment is automatic and tied to your revenue, so it flexes with your business cycle. No fixed monthly burden.',
    bullets: [
      { icon: <Banknote className="w-4 h-4" />, text: 'Funds deposited directly — often same-day or next-day' },
      { icon: <RefreshCw className="w-4 h-4" />, text: 'Revenue-based repayment that adjusts with your sales' },
      { icon: <CreditCard className="w-4 h-4" />, text: 'No collateral, no personal guarantees required' },
      { icon: <TrendingUp className="w-4 h-4" />, text: 'Renew for additional capital as your business grows' },
    ],
    stat: '$0',
    statLabel: 'Hidden fees or surprises',
  },
];

export function HowItWorksPage({ onClose, onApplyClick, onCalculatorClick, onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick, onFAQClick, onSupportClick, onWinsClick, onPrivacyClick, onTermsClick, onDisclosuresClick, onResourcesClick }: HowItWorksPageProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);

  // Lock body scroll to prevent double scrollbar
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on click outside modal card
  useEffect(() => {
    if (expandedStep === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalCardRef.current && !modalCardRef.current.contains(e.target as Node)) {
        setExpandedStep(null);
      }
    };

    // Delay to prevent the opening click from immediately closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedStep]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedStep !== null) {
        setExpandedStep(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expandedStep]);

  return (
    <div className="fixed inset-0 bg-[#ededf6] z-50 flex flex-col">
      {/* Spacer for navbar */}
      <div className="flex-shrink-0 h-[73px]" />
      {/* Scrollable content below navbar */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl text-[#041E42] mb-5 tracking-tight"
              style={{ fontWeight: 700 }}
            >
              How it <em className="text-[#4945ff] not-italic" style={{ fontStyle: 'italic' }}>works</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-[#041E42]/60 max-w-xl mx-auto"
              style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
            >
              Getting revenue-based financing shouldn't be complicated. We've simplified the process so you can focus on what matters — growing your business.
            </motion.p>
          </div>
        </section>

        {/* Steps overview — numbered circles with dashed connectors */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Desktop timeline row */}
            <div className="hidden md:flex items-start justify-center gap-0 mb-4">
              {steps.map((step, i) => (
                <div key={step.number} className="contents">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.15 }}
                    className="flex flex-col items-center cursor-pointer group"
                    style={{ width: 240 }}
                    onClick={() => setExpandedStep(step.number)}
                    whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
                  >
                    {/* Circle */}
                    <motion.div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                        expandedStep === step.number
                          ? 'bg-[#4945ff] text-white'
                          : 'bg-[#4945ff]/10 text-[#4945ff] group-hover:bg-[#4945ff]/25'
                      }`}
                      whileHover={{
                        scale: 1.12,
                        boxShadow: '0 8px 30px rgba(73,69,255,0.25)',
                        transition: { duration: 0.25, ease: 'easeOut' },
                      }}
                    >
                      <span className="text-xl" style={{ fontWeight: 700 }}>{step.number}</span>
                    </motion.div>
                    <h3
                      className="text-[#041E42] text-center mb-2 group-hover:text-[#4945ff] transition-colors duration-200"
                      style={{ fontWeight: 600, fontSize: '1.05rem' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[#041E42]/50 text-center" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
                      {step.description.slice(0, 120)}…
                    </p>
                  </motion.div>
                  {/* Dashed connector */}
                  {i < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
                      className="flex-shrink-0 mt-8"
                      style={{ width: 60 }}
                    >
                      <svg width="60" height="2" viewBox="0 0 60 2">
                        <line
                          x1="0" y1="1" x2="60" y2="1"
                          stroke="#4945ff"
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          strokeOpacity="0.3"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile stacked */}
            <div className="md:hidden space-y-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                  className="flex items-start gap-4 cursor-pointer bg-white/60 rounded-xl p-4 border border-[#e8eaf0] active:scale-[0.98] transition-transform"
                  onClick={() => setExpandedStep(step.number)}
                  whileHover={{ y: -4, boxShadow: '0 6px 24px rgba(73,69,255,0.1)' }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      expandedStep === step.number
                        ? 'bg-[#4945ff] text-white'
                        : 'bg-[#4945ff]/10 text-[#4945ff]'
                    }`}
                  >
                    <span style={{ fontWeight: 700 }}>{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-[#041E42] mb-1" style={{ fontWeight: 600 }}>{step.title}</h3>
                    <p className="text-[#041E42]/50" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {step.description.slice(0, 100)}…
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl text-[#041E42] mb-3" style={{ fontWeight: 700 }}>
              Ready to get started?
            </h2>
            <p className="text-[#041E42]/50 mb-8" style={{ fontSize: '0.95rem' }}>
              See how much capital you qualify for — it takes less than 5 minutes and won't impact your credit.
            </p>
            <button
              onClick={() => {
                onClose();
                if (onCalculatorClick) {
                  onCalculatorClick();
                } else {
                  onApplyClick?.();
                }
              }}
              className="inline-flex items-center gap-2 bg-[#4945ff] hover:bg-[#3b38d9] text-white px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#4945ff]/25"
              style={{ fontWeight: 600, fontSize: '1rem' }}
            >
              Check my amount
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-[#041E42]/40" style={{ fontSize: '0.8rem' }}>
              No credit impact · No obligation · Results in minutes
            </p>
          </motion.div>
        </section>
        <Footer
          onAboutClick={onAboutClick || (() => {})}
          onHowItWorksClick={onHowItWorksClick || (() => {})}
          onReviewsClick={onReviewsClick || (() => {})}
          onBlogClick={onBlogClick || (() => {})}
          onFAQClick={onFAQClick || (() => {})}
          onSupportClick={onSupportClick || (() => {})}
          onWinsClick={onWinsClick || (() => {})}
          onApplyClick={onApplyClick || (() => {})}
          onPrivacyClick={onPrivacyClick}
          onTermsClick={onTermsClick}
          onDisclosuresClick={onDisclosuresClick}
          onResourcesClick={onResourcesClick}
        />
      </div>

      {/* ════ Modal Popup Overlay ════ */}
      <AnimatePresence>
        {expandedStep !== null && (() => {
          const step = steps[expandedStep - 1];
          return (
            <motion.div
              key="step-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[80] flex items-center justify-center px-4 sm:px-6"
              style={{ background: 'rgba(4,30,66,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            >
              <motion.div
                ref={modalCardRef}
                key={`step-modal-${expandedStep}`}
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
                style={{ boxShadow: '0 25px 60px rgba(4,30,66,0.18), 0 8px 24px rgba(73,69,255,0.08)' }}
              >
                <div className="p-7 sm:p-9">
                  {/* Close button */}
                  <button
                    onClick={() => setExpandedStep(null)}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#ededf6] hover:bg-[#E4E7F0] flex items-center justify-center transition-colors z-10"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Step badge + title */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-14 h-14 rounded-full bg-[#4945ff] text-white flex items-center justify-center flex-shrink-0"
                    >
                      <span className="text-xl" style={{ fontWeight: 700 }}>{step.number}</span>
                    </motion.div>
                    <div>
                      <p className="text-[#4945ff] text-xs tracking-wider mb-0.5" style={{ fontWeight: 600 }}>
                        STEP {step.number}
                      </p>
                      <h2 className="text-[#041E42] text-xl sm:text-2xl" style={{ fontWeight: 700 }}>
                        {step.title}
                      </h2>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="text-[#4945ff] mb-4" style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {step.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-[#041E42]/60 mb-8" style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {step.description}
                  </p>

                  {/* Bullets */}
                  <div className="space-y-4 mb-8">
                    {step.bullets.map((bullet, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + idx * 0.06, duration: 0.3 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#4945ff]/[0.06] flex items-center justify-center flex-shrink-0 text-[#4945ff]">
                          {bullet.icon}
                        </div>
                        <p className="text-[#041E42]/80 pt-2" style={{ fontSize: '0.93rem' }}>
                          {bullet.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stat bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                    className="bg-[#F7F8FC] rounded-xl px-6 py-4 flex items-center gap-4"
                  >
                    <span className="text-[#4945ff] text-3xl" style={{ fontWeight: 700 }}>
                      {step.stat}
                    </span>
                    <span className="text-[#041E42]/50" style={{ fontSize: '0.9rem' }}>
                      {step.statLabel}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}