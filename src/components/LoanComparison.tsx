import { CheckCircle2, XCircle, Clock, DollarSign, FileText, TrendingUp } from 'lucide-react';

export function LoanComparison() {
  const comparisonFeatures = [
    {
      category: 'Speed & Approval',
      features: [
        { name: 'Application Time', mca: '10-15 minutes', bank: '2-4 hours', winner: 'mca' },
        { name: 'Decision Time', mca: 'Minutes to 4 hours', bank: '2-6 weeks', winner: 'mca' },
        { name: 'Funding Speed', mca: '24-48 hours', bank: '4-8 weeks', winner: 'mca' },
        { name: 'Approval Rate', mca: '85%+', bank: '25-35%', winner: 'mca' },
      ],
    },
    {
      category: 'Qualification',
      features: [
        { name: 'Credit Score', mca: 'Flexible (550+)', bank: 'Good (680+)', winner: 'mca' },
        { name: 'Time in Business', mca: '6+ months', bank: '2+ years', winner: 'mca' },
        { name: 'Revenue Required', mca: '$10K+/month', bank: '$50K+/month', winner: 'mca' },
        { name: 'Collateral', mca: 'None required', bank: 'Often required', winner: 'mca' },
        { name: 'Personal Guarantee', mca: 'Sometimes', bank: 'Always', winner: 'mca' },
      ],
    },
    {
      category: 'Cost & Terms',
      features: [
        { name: 'Typical Cost', mca: '15-40% of amount', bank: '5-10% APR', winner: 'bank' },
        { name: 'Repayment Method', mca: '% of daily sales', bank: 'Fixed monthly', winner: 'neutral' },
        { name: 'Flexibility', mca: 'Sales-based payment', bank: 'Fixed schedule', winner: 'mca' },
        { name: 'Prepayment Penalty', mca: 'Often waived', bank: 'Common', winner: 'mca' },
      ],
    },
    {
      category: 'Documentation',
      features: [
        { name: 'Required Documents', mca: '3-4 items', bank: '10+ items', winner: 'mca' },
        { name: 'Tax Returns', mca: 'Not required', bank: '2-3 years', winner: 'mca' },
        { name: 'Business Plan', mca: 'Not required', bank: 'Required', winner: 'mca' },
        { name: 'Financial Statements', mca: 'Bank statements only', bank: 'Full P&L, balance sheet', winner: 'mca' },
      ],
    },
  ];

  const whenToChoose = {
    mca: [
      'Need capital quickly (days, not months)',
      'Don\'t qualify for traditional bank loans',
      'Have inconsistent revenue/cash flow',
      'Want flexible, sales-based repayment',
      'Don\'t want to pledge collateral',
      'Limited time in business (6+ months)',
      'Seasonal business with variable income',
      'Time-sensitive opportunity',
    ],
    bank: [
      'Can wait weeks/months for funding',
      'Have excellent credit (700+)',
      'Established business (3+ years)',
      'Strong, consistent revenue',
      'Want lowest possible cost',
      'Can provide collateral',
      'Long-term financing needs',
      'Want to build business credit',
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#041e42] mb-2">MCA vs. Bank Loan Comparison</h3>
        <p className="text-gray-600">Understanding the key differences to make the right choice</p>
      </div>

      {/* Quick Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-br from-[#4945ff] to-[#3b38d9] rounded-xl p-6 text-white">
          <h4 className="text-xl font-bold mb-4">Merchant Cash Advance</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Fast & Easy</p>
                <p className="text-sm opacity-90">Funding in 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Flexible Qualification</p>
                <p className="text-sm opacity-90">Revenue-focused approval</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Sales-Based Repayment</p>
                <p className="text-sm opacity-90">Payments flex with revenue</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-300" />
              <div>
                <p className="font-semibold">Higher Cost</p>
                <p className="text-sm opacity-90">More expensive than loans</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#041e42] to-[#0a2d5a] rounded-xl p-6 text-white">
          <h4 className="text-xl font-bold mb-4">Traditional Bank Loan</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Lower Cost</p>
                <p className="text-sm opacity-90">Best rates available</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Builds Credit</p>
                <p className="text-sm opacity-90">Improves business profile</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-300" />
              <div>
                <p className="font-semibold">Slow Process</p>
                <p className="text-sm opacity-90">Takes weeks or months</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-300" />
              <div>
                <p className="font-semibold">Strict Requirements</p>
                <p className="text-sm opacity-90">Hard to qualify</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      {comparisonFeatures.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <h4 className="text-xl font-bold text-[#041e42] mb-4">{section.category}</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#4945ff]">Merchant Cash Advance</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#041e42]">Bank Loan</th>
                </tr>
              </thead>
              <tbody>
                {section.features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-700">{feature.name}</td>
                    <td className={`py-4 px-4 text-center ${feature.winner === 'mca' ? 'bg-blue-50 font-semibold text-[#4945ff]' : 'text-gray-600'}`}>
                      {feature.mca}
                      {feature.winner === 'mca' && <span className="ml-2">✓</span>}
                    </td>
                    <td className={`py-4 px-4 text-center ${feature.winner === 'bank' ? 'bg-green-50 font-semibold text-green-700' : 'text-gray-600'}`}>
                      {feature.bank}
                      {feature.winner === 'bank' && <span className="ml-2">✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* When to Choose */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="bg-blue-50 border-2 border-[#4945ff] rounded-xl p-6">
          <h4 className="text-xl font-bold text-[#041e42] mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#4945ff]" />
            Choose MCA When You Need:
          </h4>
          <ul className="space-y-2">
            {whenToChoose.mca.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-[#4945ff] flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
          <h4 className="text-xl font-bold text-[#041e42] mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Choose Bank Loan When You Have:
          </h4>
          <ul className="space-y-2">
            {whenToChoose.bank.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 bg-gradient-to-r from-[#4945ff] to-[#3b38d9] rounded-xl p-8 text-white text-center">
        <h4 className="text-2xl font-bold mb-3">Not Sure Which is Right for You?</h4>
        <p className="text-lg mb-6 opacity-90">
          Our team can help you evaluate your options and find the best funding solution for your business.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="bg-white text-[#4945ff] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Apply for MCA
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
            Talk to an Expert
          </button>
        </div>
      </div>
    </div>
  );
}