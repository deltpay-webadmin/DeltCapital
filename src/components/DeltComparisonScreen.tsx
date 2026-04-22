import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Zap, TrendingUp, Shield, ArrowRight, Star } from 'lucide-react';

export interface DeltComparisonResult {
  selectedOffer: 'standard' | 'delt-preferred';
  offerAmount: number;
}

interface DeltComparisonScreenProps {
  desiredFunding: string; // now annual revenue string (formatted like "$1,200,000")
  monthlyCCSales?: string; // formatted like "$50,000"
  acceptsCreditCards?: boolean;
  timeInBusiness?: string; // e.g. "2-5 years", "1-2 years", "6-12 months", "Less than 6 months"
  businessName: string;
  onSelect: (result: DeltComparisonResult) => void;
}

function parseCurrencyString(str: string): number {
  // Parse "$1,200,000" or "$50,000" style strings
  const digits = str.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

const TIB_MULTIPLIERS: Record<string, { low: number; high: number }> = {
  '6-12 months': { low: 0.50, high: 0.56 },
  '1-2 years': { low: 0.56, high: 0.62 },
  '2-5 years': { low: 0.60, high: 0.67 },
  '5+ years': { low: 0.60, high: 0.67 },
};

export function DeltComparisonScreen({ desiredFunding, monthlyCCSales, acceptsCreditCards, timeInBusiness, businessName, onSelect }: DeltComparisonScreenProps) {
  const [selected, setSelected] = useState<'standard' | 'delt-preferred' | null>(null);

  // Calculate offers using the same logic as CapitalCostAnalyzer
  const annualRevenue = parseCurrencyString(desiredFunding);
  const monthlyRevenue = annualRevenue / 12;

  // Look up TIB multiplier (default to lowest if unknown)
  const tib = (timeInBusiness && TIB_MULTIPLIERS[timeInBusiness]) || { low: 0.50, high: 0.56 };

  let standardLow = Math.round((monthlyRevenue * tib.low) / 1000) * 1000;
  let standardHigh = Math.round((monthlyRevenue * tib.high) / 1000) * 1000;
  standardLow = Math.max(5000, standardLow);
  standardHigh = Math.max(standardLow + 2000, standardHigh);

  // Delt Preferred range: 1.75x the standard range
  const deltLow = Math.round((standardLow * 1.75) / 1000) * 1000;
  const deltHigh = Math.round((standardHigh * 1.75) / 1000) * 1000;

  const formatCurrency = (n: number) => '$' + n.toLocaleString();
  const formatK = (n: number) => n >= 1000 ? `$${Math.round(n / 1000).toLocaleString()}K` : `$${n.toLocaleString()}`;

  const handleContinue = () => {
    if (!selected) return;
    onSelect({
      selectedOffer: selected,
      offerAmount: selected === 'delt-preferred' ? deltHigh : standardHigh,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_32px_rgba(0,0,0,0.06)] p-6 md:p-8"
      >
        {/* Header — matches PreQualificationGame layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#172b4d] tracking-tight">
              Your Funding Options
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bank verified — here's what {businessName || 'your business'} qualifies for
            </p>
          </div>

          {/* Trust Indicator - Top Right */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
            <Shield className="w-3.5 h-3.5 text-[#172b4d]" />
            <span className="text-xs font-medium text-[#172b4d]">Bank-Grade Security</span>
          </div>
        </div>

        {/* Progress Bar — fully completed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172b4d]">
              Select Offer
            </span>
            <span className="text-xs font-medium text-slate-500">
              Step 1 of 3
            </span>
          </div>
          <div className="flex gap-2 w-full">
            <div className="h-1.5 flex-1 bg-slate-100 rounded-sm overflow-hidden">
              <motion.div
                className="h-full bg-[#172b4d]"
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>
            <div className="h-1.5 flex-1 bg-slate-100 rounded-sm overflow-hidden">
              <div className="h-full w-0" />
            </div>
            <div className="h-1.5 flex-1 bg-slate-100 rounded-sm overflow-hidden">
              <div className="h-full w-0" />
            </div>
          </div>
        </div>

        {/* Offers */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* ── Offer A: Standard ── */}
            <motion.button
              onClick={() => setSelected('standard')}
              whileTap={{ scale: 0.985 }}
              className={`relative text-left rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                selected === 'standard'
                  ? 'border-[#172b4d] bg-[#F8F9FB] shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Radio */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">Standard</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === 'standard' ? 'border-[#172b4d] bg-[#172b4d]' : 'border-slate-300'
                }`}>
                  {selected === 'standard' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </div>

              <p className="text-[28px] font-bold text-[#172b4d] mb-1.5 tabular-nums tracking-tight">
                {formatK(standardLow)}<span className="mx-1 opacity-35">–</span>{formatK(standardHigh)}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Based on your verified bank history with Plaid.
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Current processing rates apply</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Check className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" strokeWidth={2.5} />
                  <span>No merchant service changes</span>
                </div>
              </div>
            </motion.button>

            {/* ── Offer B: Delt Preferred ── */}
            <motion.button
              onClick={() => setSelected('delt-preferred')}
              whileTap={{ scale: 0.985 }}
              className={`relative text-left rounded-2xl border-2 p-5 transition-all cursor-pointer overflow-hidden ${
                selected === 'delt-preferred'
                  ? 'border-[#0c66e4] bg-gradient-to-br from-[#F5F5FF] to-[#EAECFF] shadow-md shadow-indigo-100'
                  : 'border-slate-200 hover:border-indigo-200'
              }`}
            >
              {/* Recommended badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-[#0c66e4] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-lg flex items-center gap-1">
                  <Star className="w-2.5 h-2.5" fill="currentColor" />
                  Recommended
                </div>
              </div>

              {/* Radio */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#0c66e4]" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#0c66e4]">Delt Preferred</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === 'delt-preferred' ? 'border-[#0c66e4] bg-[#0c66e4]' : 'border-slate-300'
                }`}>
                  {selected === 'delt-preferred' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </div>

              <p className="text-[28px] font-bold text-[#172b4d] mb-1.5 tabular-nums tracking-tight">
                {formatK(deltLow)}<span className="mx-1 opacity-35">–</span>{formatK(deltHigh)}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Unlock max funding + Lower your daily overhead.
              </p>

              <div className="space-y-2 pt-3 border-t border-indigo-100">
                <div className="flex items-center gap-2 text-[11px] text-[#172b4d]">
                  <div className="w-4 h-4 rounded-full bg-[#0c66e4]/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-2.5 h-2.5 text-[#0c66e4]" />
                  </div>
                  <span><strong className="text-[#0c66e4]">+{formatCurrency(deltHigh - standardHigh)}</strong> additional funding</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#172b4d]">
                  <div className="w-4 h-4 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#10B981]" strokeWidth={3} />
                  </div>
                  <span><strong className="text-[#10B981]">1.5% lower</strong> processing fees</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#172b4d]">
                  <div className="w-4 h-4 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-2.5 h-2.5 text-[#F59E0B]" />
                  </div>
                  <span>Same-day processing with Delt</span>
                </div>
              </div>
            </motion.button>
          </div>

          {/* CTA */}
          <motion.button
            onClick={handleContinue}
            disabled={!selected}
            whileTap={selected ? { scale: 0.98 } : {}}
            className="w-full py-3.5 rounded-xl bg-[#172b4d] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {selected === 'delt-preferred'
              ? 'Continue with Delt Preferred'
              : selected === 'standard'
                ? 'Continue with Standard'
                : 'Choose your growth path'}
            {selected && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-center gap-5 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#10B981]" strokeWidth={2.5} />
              <span>256-bit encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#10B981]" strokeWidth={2.5} />
              <span>No impact to your credit to apply</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}