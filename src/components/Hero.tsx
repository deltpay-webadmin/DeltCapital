import { DollarSign } from 'lucide-react';

export function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-6">
          <DollarSign className="w-16 h-16 mr-4" />
          <h1 className="text-6xl font-bold">Funder</h1>
        </div>
        <p className="text-2xl text-center text-blue-100 mb-8">
          Smart Merchant Cash Advance Solutions
        </p>
        <p className="text-lg text-center text-blue-200 max-w-3xl mx-auto">
          Analyze deals with precision. Calculate profitability. Understand the true cost of money.
          Your complete MCA underwriting platform.
        </p>
      </div>
    </div>
  );
}
