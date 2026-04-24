import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  Wrench,
  Package,
  Megaphone,
  Users,
  Building2,
  TrendingUp,
} from 'lucide-react';

interface UseCapitalSectionProps {
  onTalkToSpecialist?: () => void;
}

type Category = {
  icon: typeof Users;
  label: string;
  copy: string;
  kpis: { label: string; value: string }[];
  split: { label: string; percent: number }[];
  insight: string;
};

const CATEGORIES: Category[] = [
  {
    icon: Wrench,
    label: 'Equipment & fleet',
    copy: 'Replace or expand hard assets without tying up your operating line. Depreciation stays with the equipment; the capital stays with the business.',
    kpis: [
      { label: 'Avg. deployed', value: '$45K' },
      { label: 'Time to funds', value: '24h' },
      { label: 'Productivity lift', value: '+38%' },
    ],
    split: [
      { label: 'Machinery', percent: 40 },
      { label: 'Software / systems', percent: 25 },
      { label: 'Hardware', percent: 20 },
      { label: 'Install & training', percent: 15 },
    ],
    insight: 'Operators who finance equipment rather than drain reserves add an average of 6 weeks of runway in the quarter they deploy.',
  },
  {
    icon: TrendingUp,
    label: 'Vendor & A/P',
    copy: 'Take the Net 10 discount. Hold the Net 30 terms. A short-term advance against receivables pays for itself when the discount is wider than the factor.',
    kpis: [
      { label: 'Median discount', value: '2.8%' },
      { label: 'Annual savings', value: '$12K' },
      { label: 'Vendors paid early', value: '340+' },
    ],
    split: [
      { label: 'Core suppliers', percent: 55 },
      { label: 'Contract labor', percent: 20 },
      { label: 'Logistics & freight', percent: 15 },
      { label: 'Admin / SaaS', percent: 10 },
    ],
    insight: 'On a 1.18× factor, any vendor discount above ~2.1% on Net 30 is net accretive before you count the relationship upside.',
  },
  {
    icon: Package,
    label: 'Inventory ramp',
    copy: 'Stock up before peak without sacrificing unit economics. Advance funds against forecasted revenue, pay down on the terms revenue actually arrives.',
    kpis: [
      { label: 'Avg. deployed', value: '$75K' },
      { label: 'Sell-through uplift', value: '+24%' },
      { label: 'Stockouts avoided', value: '92%' },
    ],
    split: [
      { label: 'Seasonal SKUs', percent: 50 },
      { label: 'Core replenishment', percent: 30 },
      { label: 'New launches', percent: 12 },
      { label: 'Safety stock', percent: 8 },
    ],
    insight: 'Revenue-based repayment means slow weeks take smaller debits — you never owe more than the business actually generated.',
  },
  {
    icon: Megaphone,
    label: 'Marketing push',
    copy: 'Fund the demand-gen quarter. Return-on-ad-spend happens in weeks, the repayment schedule flexes with what actually came in.',
    kpis: [
      { label: 'Median spend', value: '$60K' },
      { label: 'ROAS', value: '3.4×' },
      { label: 'New customer CAC', value: '−18%' },
    ],
    split: [
      { label: 'Paid social', percent: 45 },
      { label: 'Search & SEO', percent: 25 },
      { label: 'Events & out-of-home', percent: 18 },
      { label: 'Creative production', percent: 12 },
    ],
    insight: 'Pay-down matches collections — so a weak week doesn\'t punish you for funding the marketing that caused the strong ones.',
  },
  {
    icon: Users,
    label: 'Hiring',
    copy: 'Hire the revenue-critical role now; pay from the revenue they unlock. Underwriting is on your book, not their background check.',
    kpis: [
      { label: 'Avg. deployed', value: '$90K' },
      { label: 'Time to first hire', value: '3 wks' },
      { label: 'Revenue per FTE', value: '+22%' },
    ],
    split: [
      { label: 'Revenue-producing', percent: 55 },
      { label: 'Ops & fulfillment', percent: 25 },
      { label: 'Recruiting fees', percent: 10 },
      { label: 'Onboarding / training', percent: 10 },
    ],
    insight: 'Most Delt hires pay back within 2 quarters — the advance is sized to that reality, not to 60-month bank amortization.',
  },
  {
    icon: Building2,
    label: 'New location',
    copy: 'Buildout, permits, first-three-months payroll — funded up front, repaid on the ramp from week one of operations.',
    kpis: [
      { label: 'Avg. deployed', value: '$180K' },
      { label: 'Buildout → open', value: '9 wks' },
      { label: 'Year-1 IRR', value: '41%' },
    ],
    split: [
      { label: 'Buildout / TI', percent: 45 },
      { label: 'Equipment', percent: 25 },
      { label: 'Pre-opening payroll', percent: 20 },
      { label: 'Permits & soft costs', percent: 10 },
    ],
    insight: 'We underwrite your existing book — not the new location\'s projections. Approval is decoupled from the pro-forma.',
  },
];

export function UseCapitalSection({ onTalkToSpecialist }: UseCapitalSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = CATEGORIES[activeIndex];

  const go = (delta: number) => {
    const next = (activeIndex + delta + CATEGORIES.length) % CATEGORIES.length;
    setActiveIndex(next);
  };

  return (
    <section
      style={{
        background: 'var(--paper)',
        padding: '120px 0',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        {/* Heading */}
        <div
          className="grid items-end"
          style={{ gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 56 }}
        >
          <div>
            <Eyebrow>What you deploy it on</Eyebrow>
            <h2
              style={{
                marginTop: 18,
                marginBottom: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 600,
                letterSpacing: '-0.035em',
                lineHeight: 1.05,
                color: '#0F0E17',
              }}
            >
              Six ways operators
              <br />
              deploy Delt capital.
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              justifySelf: 'end',
              maxWidth: 460,
              fontFamily: 'var(--font-body)',
              fontSize: 16.5,
              lineHeight: 1.6,
              color: 'var(--ink-soft)',
            }}
          >
            Every draw is sized to the job, not to a product tier. Pick the category closest to your use — the numbers below are medians from our last 12 months.
          </p>
        </div>

        {/* Main frame */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: '340px 1fr',
            background: '#0F0E17',
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid #1A1923',
            minHeight: 520,
          }}
        >
          {/* Left rail: category list */}
          <div style={{ padding: '28px 0', borderRight: '1px solid rgba(231,227,218,0.08)' }}>
            <div
              className="flex items-center justify-between"
              style={{ padding: '0 24px 18px', borderBottom: '1px solid rgba(231,227,218,0.08)' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(231,227,218,0.55)',
                  fontWeight: 600,
                }}
              >
                Use cases · {String(activeIndex + 1).padStart(2, '0')} / {String(CATEGORIES.length).padStart(2, '0')}
              </span>
              <div className="flex gap-1">
                <IconBtn onClick={() => go(-1)} aria={'Previous'}>
                  <ChevronUp size={14} />
                </IconBtn>
                <IconBtn onClick={() => go(1)} aria={'Next'}>
                  <ChevronDown size={14} />
                </IconBtn>
              </div>
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {CATEGORIES.map((c, i) => {
                const isActive = i === activeIndex;
                const Icon = c.icon;
                return (
                  <li key={c.label}>
                    <button
                      onClick={() => setActiveIndex(i)}
                      className="w-full text-left transition-colors"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '16px 24px',
                        background: isActive ? 'rgba(124,58,237,0.14)' : 'transparent',
                        borderLeft: isActive ? '2px solid #7C3AED' : '2px solid transparent',
                        color: isActive ? '#F7F5F0' : 'rgba(231,227,218,0.72)',
                        fontFamily: 'var(--font-display)',
                        fontSize: 15,
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: '-0.01em',
                        border: 0,
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: isActive
                            ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
                            : 'rgba(231,227,218,0.06)',
                          color: isActive ? '#fff' : 'rgba(231,227,218,0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={14} />
                      </span>
                      {c.label}
                      <span style={{ marginLeft: 'auto' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            letterSpacing: '0.12em',
                            color: isActive ? '#C4B5FD' : 'rgba(231,227,218,0.35)',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right content panel */}
          <div style={{ position: 'relative', padding: '40px 44px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10.5,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#C4B5FD',
                    fontWeight: 600,
                  }}
                >
                  Category {String(activeIndex + 1).padStart(2, '0')}
                </div>
                <h3
                  style={{
                    marginTop: 14,
                    marginBottom: 0,
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 2.8vw, 2.25rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    color: '#F7F5F0',
                  }}
                >
                  {active.label}.
                </h3>
                <p
                  style={{
                    marginTop: 14,
                    marginBottom: 0,
                    maxWidth: 560,
                    fontFamily: 'var(--font-body)',
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: 'rgba(231,227,218,0.72)',
                  }}
                >
                  {active.copy}
                </p>

                {/* KPIs */}
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    marginTop: 32,
                  }}
                >
                  {active.kpis.map((k) => (
                    <div
                      key={k.label}
                      style={{
                        background: 'rgba(231,227,218,0.04)',
                        border: '1px solid rgba(231,227,218,0.08)',
                        borderRadius: 14,
                        padding: '18px 20px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10.5,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: 'rgba(231,227,218,0.55)',
                          fontWeight: 600,
                        }}
                      >
                        {k.label}
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          fontFamily: 'var(--font-display)',
                          fontSize: 28,
                          fontWeight: 700,
                          letterSpacing: '-0.03em',
                          color: '#F7F5F0',
                          fontVariantNumeric: 'tabular-nums',
                          lineHeight: 1,
                        }}
                      >
                        {k.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Allocation bars */}
                <div
                  style={{
                    marginTop: 28,
                    padding: '22px 24px',
                    background: 'rgba(231,227,218,0.03)',
                    border: '1px solid rgba(231,227,218,0.08)',
                    borderRadius: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10.5,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(231,227,218,0.55)',
                      fontWeight: 600,
                      marginBottom: 14,
                    }}
                  >
                    Typical allocation
                  </div>
                  {active.split.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-4"
                      style={{ marginBottom: 10 }}
                    >
                      <span
                        style={{
                          flex: '0 0 40%',
                          fontFamily: 'var(--font-body)',
                          fontSize: 13.5,
                          color: 'rgba(231,227,218,0.85)',
                        }}
                      >
                        {row.label}
                      </span>
                      <span
                        aria-hidden
                        style={{
                          flex: 1,
                          height: 4,
                          background: 'rgba(231,227,218,0.06)',
                          borderRadius: 2,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: `${row.percent}%` }}
                          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: `${row.percent}%`,
                            background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                            borderRadius: 2,
                          }}
                        />
                      </span>
                      <span
                        style={{
                          flex: '0 0 48px',
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          fontVariantNumeric: 'tabular-nums',
                          color: '#C4B5FD',
                        }}
                      >
                        {row.percent}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Insight + CTA */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4"
                  style={{ marginTop: 28 }}
                >
                  <p
                    style={{
                      margin: 0,
                      flex: '1 1 auto',
                      maxWidth: 520,
                      fontFamily: 'var(--font-body)',
                      fontStyle: 'italic',
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      color: 'rgba(231,227,218,0.65)',
                    }}
                  >
                    &ldquo;{active.insight}&rdquo;
                  </p>
                  <button
                    onClick={onTalkToSpecialist}
                    className="transition-transform"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: '#F7F5F0',
                      color: '#0F0E17',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 16px',
                      fontFamily: 'var(--font-body)',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Talk to a specialist
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Eyebrow({ children, color = '#4F46E5' }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color,
      }}
    >
      <span
        aria-hidden
        style={{ display: 'inline-block', width: 18, height: 1, background: color }}
      />
      {children}
    </span>
  );
}

function IconBtn({
  children,
  onClick,
  aria,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  aria: string;
}) {
  return (
    <button
      aria-label={aria}
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(231,227,218,0.04)',
        border: '1px solid rgba(231,227,218,0.12)',
        borderRadius: 6,
        color: 'rgba(231,227,218,0.72)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
