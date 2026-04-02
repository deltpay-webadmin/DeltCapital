import { Calculator, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CalculatorCTAProps {
  onCalculatorClick: () => void;
}

export function CalculatorCTA({ onCalculatorClick }: CalculatorCTAProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-[#ededf6] dark:bg-[#0A1F35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0f1f2e] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0 items-stretch">
            {/* Left Side - Content */}
            <div className="p-12 md:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[#4945ff] dark:text-white text-sm font-semibold mb-6">
                <Calculator className="w-4 h-4" />
                FREE TOOL
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Calculate Your True Costs
              </h2>
              
              <p className="text-base text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Use our advanced MCA calculator to understand exactly what you'll pay. Compare factor rates and see detailed repayment schedules before you commit.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <DollarSign className="w-5 h-5 text-[#4945ff]" />
                  </div>
                  <span className="text-base text-gray-700 dark:text-gray-300">Instant cost breakdown and payment schedules</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-5 h-5 text-[#4945ff]" />
                  </div>
                  <span className="text-base text-gray-700 dark:text-gray-300">Compare different factor rates side-by-side</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-[#4945ff]" />
                  </div>
                  <span className="text-base text-gray-700 dark:text-gray-300">Understand true costs before you apply</span>
                </li>
              </ul>

              <button
                onClick={onCalculatorClick}
                className="w-full bg-[#4945ff] hover:bg-[#3b38d9] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all inline-flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                OPEN CALCULATOR
              </button>
            </div>

            {/* Right Side - Visual */}
            <div className="relative h-full min-h-[500px] bg-[#4945ff] p-12 md:p-16 flex items-center justify-center">
              <div className="relative z-10 text-white text-center w-full">
                <div className="mb-12">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 rounded-lg border border-white/20">
                    <Calculator className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-6xl font-bold mb-3 tracking-tight">$250K</div>
                  <div className="text-sm opacity-90 uppercase tracking-widest font-semibold">MAXIMUM FUNDING</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-12">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                    <div className="text-4xl font-bold tracking-tight mb-2">96%</div>
                    <div className="text-xs opacity-90 uppercase tracking-widest font-semibold">APPROVAL RATE</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                    <div className="text-4xl font-bold tracking-tight mb-2">24-48h</div>
                    <div className="text-xs opacity-90 uppercase tracking-widest font-semibold">FAST FUNDING</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}