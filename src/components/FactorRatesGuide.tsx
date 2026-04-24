import { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export function FactorRatesGuide() {
  const [exampleAmount, setExampleAmount] = useState(50000);
  const [exampleRate, setExampleRate] = useState(1.20);

  const examples = [
    { rate: 1.10, credit: 'Excellent', timeInBusiness: '5+ years', revenue: '$100K+/month', description: 'Best rates for established businesses' },
    { rate: 1.20, credit: 'Good', timeInBusiness: '2-5 years', revenue: '$50K-100K/month', description: 'Standard rates for solid businesses' },
    { rate: 1.30, credit: 'Fair', timeInBusiness: '1-2 years', revenue: '$25K-50K/month', description: 'Average rates for newer businesses' },
    { rate: 1.40, credit: 'Poor', timeInBusiness: '6-12 months', revenue: '$10K-25K/month', description: 'Higher rates for higher risk' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#0F0E17] mb-2">Understanding Factor Rates</h3>
        <p className="text-gray-600">Learn how factor rates work and what affects your cost</p>
      </div>

      {/* What is a Factor Rate */}
      <div className="bg-blue-50 border-l-4 border-[#4F46E5] p-6 rounded-lg mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#4F46E5] rounded-lg flex items-center justify-center flex-shrink-0">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#0F0E17] mb-3">What is a Factor Rate?</h4>
            <p className="text-gray-700 mb-4 leading-relaxed">
              A factor rate is a decimal figure (like 1.20) that's multiplied by your advance amount to determine 
              your total repayment. Unlike interest rates, factor rates are fixed and don't compound.
            </p>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="font-mono text-lg text-[#0F0E17]">
                <span className="font-bold text-[#4F46E5]">Advance Amount</span> × <span className="font-bold text-[#4F46E5]">Factor Rate</span> = <span className="font-bold text-green-600">Total Repayment</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Example */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-[#0F0E17] mb-4">See It in Action</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Advance Amount</p>
            <p className="text-3xl font-bold text-[#0F0E17] mb-4">${exampleAmount.toLocaleString()}</p>
            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={exampleAmount}
              onChange={(e) => setExampleAmount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <p className="text-sm text-gray-600 mb-2">Factor Rate</p>
            <p className="text-3xl font-bold text-[#0F0E17] mb-4">{exampleRate.toFixed(2)}</p>
            <input
              type="range"
              min="1.10"
              max="1.45"
              step="0.01"
              value={exampleRate}
              onChange={(e) => setExampleRate(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Total Repayment</p>
            <p className="text-3xl font-bold text-green-600 mb-2">
              ${(exampleAmount * exampleRate).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">
              Cost: <span className="font-bold">${((exampleAmount * exampleRate) - exampleAmount).toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Factor Rate Ranges */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-[#0F0E17] mb-4">Typical Factor Rate Ranges</h4>
        <div className="space-y-4">
          {examples.map((example, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-[#4F46E5] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-[#4F46E5] rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    {example.rate}
                  </div>
                  <div>
                    <p className="font-bold text-[#0F0E17] text-lg">{example.credit} Credit Profile</p>
                    <p className="text-sm text-gray-600">{example.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">On $50K advance</p>
                  <p className="text-xl font-bold text-[#4F46E5]">${(50000 * example.rate).toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-gray-600">Credit Score</p>
                  <p className="font-semibold text-[#0F0E17]">{example.credit}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time in Business</p>
                  <p className="font-semibold text-[#0F0E17]">{example.timeInBusiness}</p>
                </div>
                <div>
                  <p className="text-gray-600">Monthly Revenue</p>
                  <p className="font-semibold text-[#0F0E17]">{example.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What Affects Your Rate */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-[#0F0E17] mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#4F46E5]" />
          What Affects Your Factor Rate?
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h5 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Factors That Lower Your Rate
            </h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Strong credit score (680+)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>High monthly revenue ($75K+)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Long time in business (3+ years)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Consistent cash flow</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Low-risk industry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Previous successful MCAs</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
            <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Factors That Raise Your Rate
            </h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">!</span>
                <span>Lower credit score (below 600)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">!</span>
                <span>Lower revenue (below $25K/month)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">!</span>
                <span>Newer business (under 1 year)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">!</span>
                <span>Inconsistent cash flow</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">!</span>
                <span>High-risk industry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">!</span>
                <span>Previous defaults or issues</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Differences */}
      <div className="bg-gradient-to-br from-[#0F0E17] to-[#0a2d5a] rounded-xl p-8 text-white">
        <h4 className="text-xl font-bold mb-6">Factor Rate vs. Interest Rate</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-bold mb-3 text-[#4F46E5]">Factor Rate (MCA)</h5>
            <ul className="space-y-2 text-sm">
              <li>• Fixed multiplier (e.g., 1.20)</li>
              <li>• Does not compound</li>
              <li>• Simple calculation</li>
              <li>• Total cost known upfront</li>
              <li>• Not time-dependent</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-3 text-yellow-300">Interest Rate (Loan)</h5>
            <ul className="space-y-2 text-sm">
              <li>• Percentage per year (e.g., 8% APR)</li>
              <li>• Can compound over time</li>
              <li>• Complex with amortization</li>
              <li>• Cost depends on time</li>
              <li>• Increases with longer terms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}