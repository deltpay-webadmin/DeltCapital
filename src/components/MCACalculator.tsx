import { useState } from 'react';
import { Slider } from './ui/slider';
import { DollarSign, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

export function MCACalculator() {
  const [loanAmount, setLoanAmount] = useState(75000);
  const [factorRate, setFactorRate] = useState(1.25);
  const [dailyPercentage, setDailyPercentage] = useState(15);
  const [repaymentFrequency, setRepaymentFrequency] = useState<'daily' | 'weekly'>('daily');

  const totalRepayment = loanAmount * factorRate;
  const totalCost = totalRepayment - loanAmount;
  
  // Calculate payment based on frequency
  const paymentAmount = repaymentFrequency === 'daily' 
    ? (totalRepayment / 100) * (dailyPercentage / 30) // Daily payment
    : (totalRepayment / 100) * (dailyPercentage / 30) * 5; // Weekly payment (5 business days)
  
  const estimatedPeriods = totalRepayment / paymentAmount;
  const estimatedDays = repaymentFrequency === 'daily' ? estimatedPeriods : estimatedPeriods * 5;
  const estimatedMonths = Math.round(estimatedDays / 30);

  const getLoanPurpose = (amount: number) => {
    if (amount < 25000) return 'Working capital, inventory top-up, small equipment purchases';
    if (amount < 50000) return 'Seasonal inventory, marketing campaigns, hiring 1-2 employees';
    if (amount < 100000) return 'Major inventory purchases, equipment upgrades, business expansion';
    if (amount < 150000) return 'Opening new location, major renovations, significant hiring';
    return 'Multiple locations, large-scale expansion, major business transformation';
  };

  const getRepaymentDescription = (months: number, frequency: string) => {
    if (frequency === 'weekly') {
      if (months < 6) return 'Fast repayment - higher weekly payments but shorter term';
      if (months < 9) return 'Balanced repayment - moderate weekly payments';
      return 'Extended repayment - lower weekly payments, longer term';
    } else {
      if (months < 6) return 'Fast repayment - higher daily payments but shorter term';
      if (months < 9) return 'Balanced repayment - moderate daily payments';
      return 'Extended repayment - lower daily payments, longer term';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#041e42] dark:text-white mb-2">MCA Cost Calculator</h3>
        <p className="text-gray-600 dark:text-gray-300">Calculate your merchant cash advance costs and repayment</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Controls */}
        <div className="space-y-8">
          {/* Loan Amount */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-[#041e42] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#4945ff]" />
                Advance Amount
              </label>
              <span className="text-2xl font-bold text-[#4945ff]">
                ${loanAmount.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[loanAmount]}
              onValueChange={(value) => setLoanAmount(value[0])}
              min={10000}
              max={250000}
              step={5000}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$10K</span>
              <span>$250K</span>
            </div>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-[#041e42]">
                <span className="font-semibold">Typical use:</span> {getLoanPurpose(loanAmount)}
              </p>
            </div>
          </div>

          {/* Factor Rate */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-[#041e42] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4945ff]" />
                Factor Rate
              </label>
              <span className="text-2xl font-bold text-[#4945ff]">
                {factorRate.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[factorRate * 100]}
              onValueChange={(value) => setFactorRate(value[0] / 100)}
              min={105}
              max={115}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1.05</span>
              <span>1.15</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
              Range 1.05-1.15 is the preferred applicant range. Not all may qualify for these rates.
            </p>
          </div>

          {/* Payment Percentage */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-[#041e42] dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4945ff]" />
                Daily Payment %
              </label>
              <span className="text-2xl font-bold text-[#4945ff]">
                {dailyPercentage}%
              </span>
            </div>
            <Slider
              value={[dailyPercentage]}
              onValueChange={(value) => setDailyPercentage(value[0])}
              min={10}
              max={25}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10% (Lower)</span>
              <span>25% (Higher)</span>
            </div>
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <p className="text-sm text-[#041e42] dark:text-white">
                <span className="font-semibold">{getRepaymentDescription(estimatedMonths, repaymentFrequency)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div>
          <div className="bg-gradient-to-br from-[#4945ff] to-[#3b38d9] rounded-xl p-8 text-white mb-6">
            <h4 className="text-lg font-semibold mb-6 opacity-90">Your MCA Summary</h4>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm opacity-80 mb-1">Advance Amount</p>
                <p className="text-3xl font-bold">${loanAmount.toLocaleString()}</p>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm opacity-80 mb-1">Total Repayment</p>
                <p className="text-3xl font-bold">${totalRepayment.toLocaleString()}</p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <p className="text-sm opacity-80 mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-yellow-300">${totalCost.toLocaleString()}</p>
              </div>

              <div className="border-t border-white/20 pt-4">
                {/* Repayment Frequency Toggle */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm opacity-80">{repaymentFrequency === 'daily' ? 'Daily' : 'Weekly'} Payment</p>
                  <div className="inline-flex rounded-lg bg-white/10 p-0.5">
                    <button
                      onClick={() => setRepaymentFrequency('daily')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        repaymentFrequency === 'daily'
                          ? 'bg-white text-[#4945ff] shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setRepaymentFrequency('weekly')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        repaymentFrequency === 'weekly'
                          ? 'bg-white text-[#4945ff] shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>
                <p className="text-2xl font-bold">${Math.round(paymentAmount).toLocaleString()}</p>
                <p className="text-xs opacity-70 mt-1">
                  Based on {dailyPercentage}% of {repaymentFrequency === 'daily' ? 'daily' : 'weekly'} sales
                </p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <p className="text-sm opacity-80 mb-1">Estimated Repayment Period</p>
                <p className="text-2xl font-bold">{estimatedMonths} months</p>
                <p className="text-xs opacity-70 mt-1">
                  {repaymentFrequency === 'daily' 
                    ? `Approximately ${Math.round(estimatedDays)} business days` 
                    : `Approximately ${Math.round(estimatedPeriods)} weeks`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-[#041e42] dark:text-white font-semibold mb-2">Important Note:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              This is an estimate. Actual costs depend on your sales volume and repayment speed. 
              Higher sales = faster repayment. Lower sales = extended timeline.
              {repaymentFrequency === 'weekly' && ' Weekly payments provide more predictable cash flow management.'}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-[#4945ff] hover:bg-[#3b38d9] text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* APR Equivalent */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-[#041e42] dark:text-white mb-3">Understanding Your Costs</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Cost as Percentage</p>
            <p className="text-xl font-bold text-[#041e42] dark:text-white">
              {(((totalCost / loanAmount) * 100)).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Approximate APR*</p>
            <p className="text-xl font-bold text-[#041e42] dark:text-white">
              {(((totalCost / loanAmount) / (estimatedMonths / 12)) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">{repaymentFrequency === 'daily' ? 'Daily Cost' : 'Weekly Cost'}</p>
            <p className="text-xl font-bold text-[#041e42] dark:text-white">
              ${repaymentFrequency === 'daily' 
                ? (totalCost / estimatedDays).toFixed(2)
                : ((totalCost / estimatedDays) * 5).toFixed(2)}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          *APR calculation is approximate. MCAs are not loans and don't have traditional APRs. This is for comparison purposes only.
        </p>
      </div>
    </div>
  );
}