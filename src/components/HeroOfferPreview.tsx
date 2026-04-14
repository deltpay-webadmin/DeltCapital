import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, TrendingUp, Clock, DollarSign } from 'lucide-react';

/**
 * Floating product-mockup card that sits in the right half of the new Hero.
 * Matches the deltpay.com "Good morning, Jessica" dashboard card pattern,
 * but localized to DeltCapital's product: an approved capital offer.
 */
export function HeroOfferPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[520px] mx-auto lg:ml-auto lg:mr-0"
    >
      {/* Ambient glow behind the card */}
      <div
        className="absolute -inset-8 rounded-[32px] blur-3xl opacity-60 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(73,69,255,0.35) 0%, rgba(139,92,246,0.2) 45%, transparent 75%)',
        }}
      />

      {/* Main card */}
      <div
        className="relative bg-white rounded-2xl overflow-hidden float-slow"
        style={{ boxShadow: 'var(--shadow-soft-2), 0 1px 0 rgba(255,255,255,0.4) inset' }}
      >
        {/* Header strip */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4945ff] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-semibold">
              M
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#9AA5B1]">Approved for</div>
              <div className="text-sm font-semibold text-[#041E42]">Maria&apos;s Autobody</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E3FCEF] px-2.5 py-1 text-[11px] font-semibold text-[#00875A]">
            <Check className="w-3 h-3" /> Approved
          </div>
        </div>

        {/* Amount */}
        <div className="px-6">
          <div className="text-[11px] uppercase tracking-wider text-[#9AA5B1]">Capital available</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className="text-5xl font-bold text-[#041E42] tracking-tight tabular-nums"
              style={{ fontFamily: '"Codec Pro", sans-serif' }}
            >
              $175,000
            </span>
            <span className="serif-italic text-2xl text-[#4945ff]">today.</span>
          </div>
        </div>

        {/* Detail rows */}
        <div className="mt-5 mx-6 rounded-xl border border-[#E4E7EB] divide-y divide-[#F0F2F5]">
          <DetailRow
            icon={<TrendingUp className="w-4 h-4 text-[#4945ff]" />}
            label="Revenue share"
            value="6.5%"
            sub="of daily sales"
          />
          <DetailRow
            icon={<Clock className="w-4 h-4 text-[#4945ff]" />}
            label="Funding speed"
            value="24–48h"
            sub="after docs signed"
          />
          <DetailRow
            icon={<DollarSign className="w-4 h-4 text-[#4945ff]" />}
            label="No collateral"
            value="None"
            sub="no personal guarantee"
          />
        </div>

        {/* CTA */}
        <div className="px-6 pt-5 pb-6 flex items-center gap-3">
          <button
            className="flex-1 h-11 rounded-xl bg-[#4945ff] text-white text-sm font-semibold hover:bg-[#3e3add] transition-colors"
          >
            Claim offer
          </button>
          <button className="h-11 px-4 rounded-xl border border-[#E4E7EB] text-sm font-semibold text-[#041E42] hover:bg-[#F5F7FA] transition-colors">
            Details
          </button>
        </div>
      </div>

      {/* Overlaid "Delt AI" callout */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.9, ease: 'easeOut' }}
        className="absolute -bottom-6 -left-6 sm:-left-10 max-w-[280px] rounded-2xl px-4 py-3.5"
        style={{
          background: 'rgba(11,15,44,0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(199,197,255,0.18)',
          boxShadow: '0 20px 50px -20px rgba(5,6,15,0.7)',
        }}
      >
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#4945ff] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-white">Delt AI</span>
              <span className="text-[10px] text-white/50">· Insight</span>
            </div>
            <p className="text-[12px] text-white/85 leading-snug mt-0.5">
              Your revenue is trending <span className="font-semibold text-white">+12% above</span>{' '}
              last month — you&apos;ve pre-qualified for a larger offer.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-lg bg-[#E6EDFF] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-[#9AA5B1]">{label}</div>
        <div className="text-[13px] text-[#52606D]">{sub}</div>
      </div>
      <div className="text-sm font-semibold text-[#041E42] tabular-nums">{value}</div>
    </div>
  );
}
