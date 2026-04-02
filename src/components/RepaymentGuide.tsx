import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, Percent } from 'lucide-react';

export function RepaymentGuide() {
  const [dailySales, setDailySales] = useState(2000);
  const dailyPercentage = 15;
  const dailyPayment = (dailySales * dailyPercentage) / 100;

  const scenarios = [
    { type: 'high', sales: 3500, label: 'High Sales Day', icon: TrendingUp, color: 'green' },
    { type: 'normal', sales: 2000, label: 'Normal Sales Day', icon: Minus, color: 'blue' },
    { type: 'low', sales: 800, label: 'Low Sales Day', icon: TrendingDown, color: 'orange' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#041e42] dark:text-white mb-2">Revenue-Based Repayment Guide</h3>
        <p className="text-gray-600 dark:text-gray-300">Understand how flexible, sales-based payments work</p>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 mb-8 border border-blue-200 dark:border-gray-700">
        <h4 className="text-2xl font-bold text-[#041e42] dark:text-white mb-4">How Revenue-Based Repayment Works</h4>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
          Instead of fixed monthly payments, we automatically deduct a small percentage (typically 10-20%) 
          of your daily credit card sales. This means your payments flex with your business performance.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <Percent className="w-8 h-8 text-[#1b17ff] mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fixed Percentage</p>
            <p className="text-2xl font-bold text-[#041e42] dark:text-white">10-20%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <Calendar className="w-8 h-8 text-[#1b17ff] mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Deducted</p>
            <p className="text-2xl font-bold text-[#041e42] dark:text-white">Daily</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <DollarSign className="w-8 h-8 text-[#1b17ff] mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Based On</p>
            <p className="text-2xl font-bold text-[#041e42] dark:text-white">Your Sales</p>
          </div>
        </div>
      </div>

      {/* Interactive Example */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-[#041e42] dark:text-white mb-4">Interactive Example</h4>
        <div className="bg-[#f4f4f4] dark:bg-gray-800 rounded-xl p-6 mb-6">
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#041e42] dark:text-white mb-2 block">
              Your Daily Credit Card Sales: ${dailySales.toLocaleString()}
            </label>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={dailySales}
              onChange={(e) => setDailySales(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$500</span>
              <span>$5,000</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-5 border-2 border-[#1b17ff]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Payment (15% of sales)</p>
              <p className="text-4xl font-bold text-[#1b17ff] mb-2">${dailyPayment.toFixed(2)}</p>
              <p className="text-xs text-gray-500">${dailySales} × 15% = ${dailyPayment.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Est. Monthly Payment</p>
              <p className="text-4xl font-bold text-[#041e42] dark:text-white mb-2">
                ${(dailyPayment * 22).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Based on ~22 business days/month</p>
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <div className="grid md:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => {
            const payment = (scenario.sales * dailyPercentage) / 100;
            const Icon = scenario.icon;
            const colorClasses = {
              green: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400',
              blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400',
              orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-400',
            };

            return (
              <div key={index} className={`${colorClasses[scenario.color as keyof typeof colorClasses]} rounded-xl p-5 border-l-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5" />
                  <h5 className="font-bold">{scenario.label}</h5>
                </div>
                <p className="text-sm mb-2">Sales: ${scenario.sales.toLocaleString()}</p>
                <p className="text-2xl font-bold">${payment.toFixed(2)}</p>
                <p className="text-xs opacity-75">payment today</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-[#041e42] dark:text-white mb-4">Key Benefits of Revenue-Based Repayment</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
            <h5 className="font-bold text-green-800 dark:text-green-400 mb-2">Cash Flow Protection</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Slow days mean lower payments. You never pay more than you can afford based on your sales.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
            <h5 className="font-bold text-blue-800 dark:text-blue-400 mb-2">Automatic Payments</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              No need to remember due dates. Payments happen automatically through your processor.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-5 border border-purple-200 dark:border-purple-800">
            <h5 className="font-bold text-purple-800 dark:text-purple-400 mb-2">Seasonal Friendly</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Perfect for seasonal businesses. High season = faster payoff. Low season = reduced burden.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-5 border border-orange-200 dark:border-orange-800">
            <h5 className="font-bold text-orange-800 dark:text-orange-400 mb-2">Growth Aligned</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              As your business grows and sales increase, you pay off the advance faster naturally.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison to Fixed Payments */}
      <div className="bg-gradient-to-r from-[#041e42] to-[#0a2d5a] rounded-xl p-8 text-white">
        <h4 className="text-2xl font-bold mb-6">Revenue-Based vs. Fixed Monthly Payments</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-bold mb-3 text-[#1b17ff]">Revenue-Based (MCA) ✓</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Payments adjust with sales volume</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>No late fees on slow days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Automatic daily deductions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Faster payoff on good months</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Seasonal business friendly</span>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-3 text-red-300">Fixed Monthly Payments ✗</h5>
            <ul className="space-y-2 text-sm opacity-75">
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Same payment regardless of sales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Late fees if you can't pay</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Manual payments required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Fixed timeline regardless of growth</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Risky for seasonal businesses</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
