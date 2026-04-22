import React, { useEffect } from 'react';
import {
  FileText, BarChart3, Clock, Shield, Zap, TrendingUp,
  CreditCard, Banknote, ArrowRight, Landmark, RefreshCw,
  PieChart, Users, Lock, ShieldCheck, Sparkles, CheckCircle2,
  Calculator, X as XIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
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
  eyebrow: string;
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
    eyebrow: 'Step 01 · Apply',
    title: 'Quick application',
    tagline: 'Simple. Fast. No credit impact.',
    description:
      'Start with a streamlined application that takes minutes. We ask for basic business details and connect securely to your bank — no hard credit pulls, no paperwork, no waiting.',
    bullets: [
      { icon: <FileText className="w-4 h-4" />, text: 'Short online form, under 5 minutes' },
      { icon: <Landmark className="w-4 h-4" />, text: 'Securely connect your bank via Plaid — no statements to upload' },
      { icon: <Shield className="w-4 h-4" />, text: 'Soft credit check only — no impact to your score' },
      { icon: <Clock className="w-4 h-4" />, text: 'Instant confirmation that your application is received' },
    ],
    stat: '5 min',
    statLabel: 'Average application time',
  },
  {
    number: 2,
    eyebrow: 'Step 02 · Underwrite',
    title: 'Review & approval',
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
    eyebrow: 'Step 03 · Fund',
    title: 'Get funded & grow',
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

/**
 * Per-step visual card. Each step gets a distinct payment-processing
 * inspired visualization rendered with pure CSS / divs / icons (no
 * SVG asset, no image generation needed).
 */
function StepVisual({ step }: { step: number }) {
  const base = (
    <div
      className="relative rounded-3xl backdrop-blur-xl border border-white/15 p-7 shadow-2xl overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
        boxShadow:
          '0 24px 60px -16px rgba(9,30,66,0.45), inset 0 1px 0 rgba(255,255,255,0.10)',
      }}
    >
      {/* Step number watermark */}
      <span
        aria-hidden
        className="absolute -top-4 -right-2 select-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(7rem, 14vw, 11rem)',
          fontWeight: 800,
          letterSpacing: '-0.05em',
          color: 'rgba(255,255,255,0.06)',
          lineHeight: 0.85,
        }}
      >
        0{step}
      </span>
      {step === 1 && <ApplicationVisual />}
      {step === 2 && <UnderwritingVisual />}
      {step === 3 && <FundedVisual />}
    </div>
  );

  return (
    <div className="relative">
      {/* Mesh glow behind card */}
      <div aria-hidden className="bg-mesh absolute -inset-8 opacity-50 pointer-events-none" />
      <div className="relative">{base}</div>
    </div>
  );
}

function ApplicationVisual() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-5">
        <span
          className="uppercase text-white/85"
          style={{ fontSize: 9, letterSpacing: '0.28em', fontWeight: 700 }}
        >
          Application
        </span>
        <span className="processing-dot w-1.5 h-1.5 rounded-full bg-[#85B8FF]" />
      </div>

      {/* Faux form fields */}
      <div className="space-y-3">
        {[
          { label: 'Business name', value: 'Acme Roasters LLC', done: true },
          { label: 'Industry', value: 'Food & beverage', done: true },
          { label: 'Monthly revenue', value: '$48,500', done: true },
          { label: 'Bank account', value: 'Plaid · connected', done: true },
        ].map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2.5"
          >
            <div>
              <div className="text-white/55" style={{ fontSize: 9, letterSpacing: '0.18em', fontWeight: 600 }}>
                {row.label.toUpperCase()}
              </div>
              <div className="text-white text-sm font-medium mt-0.5">{row.value}</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#1F845A]" />
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50" style={{ fontSize: 10, letterSpacing: '0.18em', fontWeight: 600 }}>
            COMPLETION
          </span>
          <span className="text-white text-xs font-semibold tabular-nums">100%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #0c66e4 0%, #6e5dc6 100%)' }}
          />
        </div>
      </div>
    </div>
  );
}

function UnderwritingVisual() {
  // Faux 8-month revenue bars
  const bars = [42, 58, 51, 67, 74, 69, 88, 96];
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-5">
        <span
          className="uppercase text-white/85"
          style={{ fontSize: 9, letterSpacing: '0.28em', fontWeight: 700 }}
        >
          Revenue analysis
        </span>
        <span className="text-white/50 text-xs tabular-nums">Last 8 mo</span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-32 mb-5">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-md"
            style={{
              background:
                i === bars.length - 1
                  ? 'linear-gradient(180deg, #6e5dc6 0%, #0c66e4 100%)'
                  : 'linear-gradient(180deg, rgba(133,184,255,0.6) 0%, rgba(12,102,228,0.5) 100%)',
            }}
          />
        ))}
      </div>

      {/* Approval card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="rounded-xl border border-[#1F845A]/30 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(31,132,90,0.12)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1F845A]/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-[#1F845A]" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Approved</div>
            <div className="text-white/55 text-xs">Factor rate 1.18 · 6 mo term</div>
          </div>
        </div>
        <div className="text-white tabular-nums" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
          $48,500
        </div>
      </motion.div>
    </div>
  );
}

function FundedVisual() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-5">
        <span
          className="uppercase text-white/85"
          style={{ fontSize: 9, letterSpacing: '0.28em', fontWeight: 700 }}
        >
          Deposit
        </span>
        <span className="inline-flex items-center gap-1.5 text-[#1F845A] text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F845A] processing-dot" />
          Live
        </span>
      </div>

      {/* Amount block */}
      <div className="mb-6">
        <div className="text-white/55 uppercase" style={{ fontSize: 10, letterSpacing: '0.22em', fontWeight: 600 }}>
          Funded today
        </div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-white tabular-nums mt-1"
          style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.0 }}
        >
          $48,500.00
        </motion.div>
        <div className="text-[#85B8FF] text-xs font-medium mt-1.5">
          → Wells Fargo Business · 1234
        </div>
      </div>

      {/* Auto-repayment row */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-sm font-semibold inline-flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-[#85B8FF]" />
            Auto repayment
          </span>
          <span className="text-white/55 text-xs">Tied to revenue</span>
        </div>
        {/* Tiny daily-bar mini chart */}
        <div className="flex items-end gap-[3px] h-8">
          {[3, 4, 3, 5, 6, 4, 5, 7, 6, 8, 7, 5, 6, 8].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h * 9}%`,
                background: 'linear-gradient(180deg, rgba(133,184,255,0.55) 0%, rgba(12,102,228,0.4) 100%)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const ChevronGradient = () => (
  <span
    aria-hidden
    className="hidden md:block w-px h-12 mx-auto my-6"
    style={{ background: 'linear-gradient(180deg, transparent, #dcdfe4, transparent)' }}
  />
);

export function HowItWorksPage({
  onClose, onApplyClick, onCalculatorClick, onAboutClick, onHowItWorksClick,
  onReviewsClick, onBlogClick, onFAQClick, onSupportClick, onWinsClick,
  onPrivacyClick, onTermsClick, onDisclosuresClick, onResourcesClick,
}: HowItWorksPageProps) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#fafbfc] z-50 flex flex-col">
      {/* Spacer for navbar */}
      <div className="flex-shrink-0 h-[73px]" />

      <div className="flex-1 overflow-y-auto">
        {/* ═══════════════════════════════════════
            HERO
           ═══════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="bg-mesh absolute inset-0 opacity-40 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="block uppercase text-[#0c66e4]"
              style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
            >
              How it works
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 text-[#172b4d]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.0,
                maxWidth: '20ch',
              }}
            >
              From application to funded, in{' '}
              <span className="text-gradient-primary">three steps.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-7 max-w-2xl text-[#44546f]"
              style={{ fontSize: 18, lineHeight: 1.55 }}
            >
              We turned the bank statements you already have into the underwriting
              signal — so you skip the gatekeeping, the paperwork, and the wait.
            </motion.p>

            {/* Hero stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-10 grid grid-cols-3 gap-3 max-w-2xl"
            >
              {[
                { val: '5 min', lbl: 'To apply' },
                { val: '24 hr', lbl: 'To approve' },
                { val: 'Same day', lbl: 'To fund' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="card-hover-lift rounded-2xl border border-[#dcdfe4] bg-white px-5 py-4"
                >
                  <div
                    className="text-gradient-primary tabular-nums"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      lineHeight: 1.0,
                    }}
                  >
                    {s.val}
                  </div>
                  <div className="text-[#44546f] text-xs mt-1.5 font-medium">{s.lbl}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            STEPS — alternating feature blocks
           ═══════════════════════════════════════ */}
        <section className="bg-[#172b4d] text-white relative overflow-hidden">
          <div aria-hidden className="bg-mesh absolute inset-0 opacity-30 pointer-events-none" style={{ mixBlendMode: 'screen' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 space-y-24 md:space-y-32">
            {steps.map((step, i) => {
              const visualLeft = i % 2 === 1; // alternate
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                    visualLeft ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  {/* Content side */}
                  <div>
                    <span
                      className="inline-flex items-center gap-2 uppercase text-[#85B8FF]"
                      style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
                    >
                      <span className="tabular-nums">{step.eyebrow}</span>
                    </span>
                    <h2
                      className="mt-4 text-white"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 4.2vw, 3.25rem)',
                        fontWeight: 600,
                        letterSpacing: '-0.025em',
                        lineHeight: 1.05,
                      }}
                    >
                      {step.title}
                    </h2>
                    <p
                      className="mt-3 text-gradient-primary"
                      style={{ fontSize: 17, fontWeight: 600 }}
                    >
                      {step.tagline}
                    </p>
                    <p className="mt-5 text-white/70" style={{ fontSize: 16, lineHeight: 1.7 }}>
                      {step.description}
                    </p>

                    <ul className="mt-7 space-y-3">
                      {step.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#85B8FF] flex-shrink-0">
                            {b.icon}
                          </span>
                          <span className="text-white/85 leading-relaxed pt-1.5" style={{ fontSize: 14.5 }}>
                            {b.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Stat callout */}
                    <div className="mt-8 inline-flex items-baseline gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3">
                      <span
                        className="text-gradient-primary tabular-nums"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 30,
                          fontWeight: 700,
                          letterSpacing: '-0.025em',
                          lineHeight: 1.0,
                        }}
                      >
                        {step.stat}
                      </span>
                      <span className="text-white/65 text-sm">{step.statLabel}</span>
                    </div>
                  </div>

                  {/* Visual side */}
                  <div className="md:px-2">
                    <StepVisual step={step.number} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            BUILT ON BANK-GRADE INFRASTRUCTURE
           ═══════════════════════════════════════ */}
        <section className="bg-[#fafbfc] py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span
                className="block uppercase text-[#0c66e4]"
                style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
              >
                Under the hood
              </span>
              <h2
                className="mt-4 text-[#172b4d]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
              >
                Built on bank-grade infrastructure
              </h2>
              <p className="mt-4 text-[#44546f]" style={{ fontSize: 17, lineHeight: 1.6 }}>
                The same primitives a digital bank uses — applied to commercial funding.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                {
                  icon: <Lock className="w-5 h-5" />,
                  title: 'Plaid-secured connection',
                  body:
                    'Read-only access to your bank — nothing we touch can move money out. SOC 2 Type II audited.',
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  title: 'Encrypted end-to-end',
                  body:
                    'TLS in transit, AES-256 at rest. Your data is partitioned, scoped, and access-logged.',
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Revenue is the signal',
                  body:
                    'We weight cash flow over credit history — so a healthy operator is not penalized by personal score.',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  className="card-hover-lift rounded-2xl border border-[#dcdfe4] bg-white p-7"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#0c66e4]/[0.10] text-[#0c66e4] flex items-center justify-center mb-5">
                    {card.icon}
                  </div>
                  <h3
                    className="text-[#172b4d]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 19,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-[#44546f] text-sm leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            WHAT YOU'LL NEVER SEE — bento
           ═══════════════════════════════════════ */}
        <section className="bg-[#f1f2f4] py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span
                className="block uppercase text-[#0c66e4]"
                style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
              >
                Not in our process
              </span>
              <h2
                className="mt-4 text-[#172b4d]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
              >
                What you'll never see
              </h2>
              <p className="mt-4 text-[#44546f]" style={{ fontSize: 17, lineHeight: 1.6 }}>
                The four things traditional lenders bury in fine print — gone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  title: 'No collateral',
                  body:
                    'We do not lien your equipment, vehicles, or inventory. Your assets stay yours.',
                },
                {
                  title: 'No personal guarantees',
                  body:
                    'Your home, your car, your credit — never on the hook for the business advance.',
                },
                {
                  title: 'No compounding interest',
                  body:
                    'One transparent factor rate, fixed up front. The cost on day one is the cost on day 180.',
                },
                {
                  title: 'No hidden fees',
                  body:
                    'No origination, no early-payoff penalty, no monthly servicing surcharge. What you sign is what you pay.',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: i * 0.06 }}
                  className="card-hover-lift rounded-2xl border border-[#dcdfe4] bg-white p-7 flex items-start gap-5"
                >
                  <span className="w-11 h-11 rounded-xl bg-[#c9372c]/[0.08] text-[#c9372c] flex items-center justify-center flex-shrink-0">
                    <XIcon className="w-5 h-5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3
                      className="text-[#172b4d]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 19,
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[#44546f] text-sm leading-relaxed">{card.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            CTA
           ═══════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0c66e4] via-[#1d7afc] to-[#6e5dc6]">
          <div aria-hidden className="bg-grain absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-20 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -right-20 bottom-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <span
              className="block uppercase text-white/70"
              style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
            >
              Ready when you are
            </span>
            <h2
              className="mt-5 text-white max-w-4xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              See how much capital you qualify for.
            </h2>
            <p className="mt-5 text-white/85 max-w-2xl" style={{ fontSize: 18, lineHeight: 1.55 }}>
              Less than five minutes, no credit impact, and an instant range you can act on.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    if (onCalculatorClick) onCalculatorClick();
                    else onApplyClick?.();
                  }, 100);
                }}
                className="card-hover-lift inline-flex items-center justify-center gap-2 bg-white text-[#0c66e4] font-semibold px-7 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
                style={{ fontSize: 15 }}
              >
                <Calculator className="w-4 h-4" />
                Check my amount
                <ArrowRight className="w-4 h-4" />
              </button>
              {onApplyClick && (
                <button
                  onClick={() => { onClose(); setTimeout(() => onApplyClick(), 100); }}
                  className="card-hover-lift inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-7 py-4 rounded-xl border border-white/25 hover:bg-white/15 transition-colors"
                  style={{ fontSize: 15 }}
                >
                  Skip ahead — apply now
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="mt-6 text-white/65 text-sm">
              No credit impact · No obligation · Results in minutes
            </p>
          </div>
        </section>

        <Footer
          hideCTA
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
    </div>
  );
}
