import { useState } from 'react';
import { CheckCircle2, XCircle, Award, TrendingUp, Calendar, DollarSign, CreditCard, FileText, AlertCircle, Download, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';

export function QualificationGuide() {
  const [quizStep, setQuizStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showDetailedRequirements, setShowDetailedRequirements] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  
  // Quiz answers
  const [timeInBusiness, setTimeInBusiness] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [cardProcessing, setCardProcessing] = useState('');

  const calculateApprovalScore = () => {
    let score = 0;
    let minAmount = 10000;
    let maxAmount = 250000;
    let minFactor = 1.15;
    let maxFactor = 1.45;

    // Time in business scoring
    if (timeInBusiness === '2+') { score += 25; minFactor = 1.15; }
    else if (timeInBusiness === '1-2') { score += 20; minFactor = 1.20; }
    else if (timeInBusiness === '6-12') { score += 15; minFactor = 1.25; }
    else { score += 5; minFactor = 1.35; }

    // Monthly revenue scoring
    if (monthlyRevenue === '50k+') { score += 30; maxAmount = 250000; }
    else if (monthlyRevenue === '25-50k') { score += 25; maxAmount = 150000; }
    else if (monthlyRevenue === '10-25k') { score += 15; maxAmount = 75000; }
    else { score += 5; maxAmount = 25000; }

    // Credit score scoring
    if (creditScore === '700+') { score += 25; maxFactor = 1.20; }
    else if (creditScore === '650-699') { score += 20; maxFactor = 1.25; }
    else if (creditScore === '550-649') { score += 15; maxFactor = 1.35; }
    else { score += 5; maxFactor = 1.45; }

    // Card processing scoring
    if (cardProcessing === 'high') { score += 20; }
    else if (cardProcessing === 'consistent') { score += 15; }
    else if (cardProcessing === 'inconsistent') { score += 10; }
    else { score += 0; }

    return { 
      score, 
      minAmount, 
      maxAmount, 
      minFactor: minFactor.toFixed(2), 
      maxFactor: maxFactor.toFixed(2) 
    };
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setShowResults(false);
    setTimeInBusiness('');
    setMonthlyRevenue('');
    setCreditScore('');
    setCardProcessing('');
  };

  const results = calculateApprovalScore();

  const getApprovalMessage = (score: number) => {
    if (score >= 85) return { 
      text: 'Excellent approval probability', 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500'
    };
    if (score >= 70) return { 
      text: 'Strong approval probability', 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500'
    };
    if (score >= 50) return { 
      text: 'Good approval probability', 
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-500'
    };
    return { 
      text: 'Additional review required', 
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-500'
    };
  };

  const qualificationCriteria = [
    {
      icon: Calendar,
      title: 'Time in Business',
      minimum: '6+ months',
      optimal: '2+ years',
      description: 'Longer operating history = better terms available',
      detail: 'Businesses operating 2+ years qualify for larger advance amounts and lower factor rates.',
    },
    {
      icon: DollarSign,
      title: 'Monthly Revenue',
      minimum: '$10,000+',
      optimal: '$50,000+',
      description: 'Higher revenue qualifies for larger advances & better pricing',
      detail: 'Monthly revenue determines maximum advance amount. $50K+ monthly revenue can qualify for $100K+ advances.',
    },
    {
      icon: Award,
      title: 'Credit Profile',
      minimum: '550 FICO',
      optimal: '680+ FICO',
      description: 'We work with challenged credit. Higher scores = better rates',
      detail: 'Personal credit score influences factor rate. Scores 700+ receive premium pricing.',
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      minimum: 'Active card processing',
      optimal: 'Consistent volume',
      description: 'Consistent volume improves approval likelihood and pricing',
      detail: 'Regular credit card processing demonstrates business stability and provides repayment mechanism.',
    },
  ];

  const approvalProfiles = [
    {
      title: 'Strong Candidate',
      probability: '90-95%',
      color: 'green',
      criteria: [
        'Credit: 700+',
        'Revenue: $50K+ monthly',
        'Operating: 2+ years',
        'Processing: High volume, consistent',
      ],
    },
    {
      title: 'Qualified Candidate',
      probability: '75-85%',
      color: 'blue',
      criteria: [
        'Credit: 650-699',
        'Revenue: $25K-50K monthly',
        'Operating: 1-2 years',
        'Processing: Regular, predictable',
      ],
    },
    {
      title: 'Acceptable Candidate',
      probability: '60-75%',
      color: 'yellow',
      criteria: [
        'Credit: 580-649',
        'Revenue: $15K-25K monthly',
        'Operating: 6-12 months',
        'Processing: Moderate volume',
      ],
    },
    {
      title: 'Minimum Threshold',
      probability: '45-60%',
      color: 'orange',
      criteria: [
        'Credit: 550-579',
        'Revenue: $10K-15K monthly',
        'Operating: 6 months',
        'Processing: Inconsistent but present',
      ],
    },
  ];

  const essentialDocs = [
    'Business bank statements (most recent 6 months)',
    'Credit card processing statements (most recent 3 months)',
    'Business formation documents (Articles of Organization, EIN letter)',
    'Personal identification (government-issued photo ID)',
    'Voided business check (for ACH setup)',
  ];

  const conditionalDocs = [
    'Business tax returns (for advances >$50K)',
    'Profit & loss statement (for newer businesses)',
    'Additional owner verification (for multi-member LLCs)',
  ];

  const cannotApprove = [
    'Active bankruptcy proceedings',
    'Business not currently operating',
    'No credit card processing capability',
    'Less than 6 months of business operation',
    'Monthly revenue consistently below $10,000',
  ];

  const additionalReview = [
    'Recent tax liens (documentation required)',
    'Industry with higher regulatory scrutiny',
    'Inconsistent revenue patterns',
    'Multiple existing cash advances',
  ];

  const faqs = [
    {
      q: 'What if I don\'t meet all the minimum requirements?',
      a: 'We encourage you to apply. Each application receives individual review, and we may be able to structure an advance that works for your specific situation.',
    },
    {
      q: 'Will checking my qualification hurt my credit score?',
      a: 'Our initial assessment uses a soft inquiry which does not impact your credit score. A hard inquiry only occurs if you proceed with a formal application.',
    },
    {
      q: 'How long does the approval process take?',
      a: 'Most applications receive a decision within 4-24 hours. Complex situations may require additional review.',
    },
    {
      q: 'Can I improve my approval odds after being declined?',
      a: 'Yes. We\'ll provide specific guidance on what factors led to the decision and what changes would improve your qualification.',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 md:p-8 z-10">
        <h3 className="text-3xl font-bold text-[#041e42] dark:text-white mb-2">
          Qualification Assessment
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Understanding our underwriting criteria and evaluation process
        </p>
      </div>

      <div className="p-6 md:p-8">
        {/* Interactive Quiz Component */}
        {!showResults ? (
          <div className="mb-10">
            <div className="bg-gradient-to-br from-[#1b17ff]/5 to-blue-50 dark:from-[#1b17ff]/10 dark:to-blue-900/20 rounded-xl p-6 md:p-8 border-2 border-[#1b17ff]/20">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-[#041e42] dark:text-white mb-2">
                  Instant Qualification Estimator
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Answer 4 quick questions to see your approval likelihood
                </p>
              </div>

              <div className="space-y-8">
                {/* Question 1: Time in Business */}
                <div>
                  <label className="block text-base font-semibold text-[#041e42] dark:text-white mb-4">
                    Question 1: How long has your business been operating?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: '<6', label: 'Less than 6 months' },
                      { value: '6-12', label: '6-12 months' },
                      { value: '1-2', label: '1-2 years' },
                      { value: '2+', label: '2+ years' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          timeInBusiness === option.value
                            ? 'border-[#1b17ff] bg-[#1b17ff]/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#1b17ff]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="timeInBusiness"
                          value={option.value}
                          checked={timeInBusiness === option.value}
                          onChange={(e) => setTimeInBusiness(e.target.value)}
                          className="w-5 h-5 text-[#1b17ff]"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Question 2: Monthly Revenue */}
                <div>
                  <label className="block text-base font-semibold text-[#041e42] dark:text-white mb-4">
                    Question 2: What's your average monthly revenue?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: '<10k', label: 'Under $10,000' },
                      { value: '10-25k', label: '$10,000 - $25,000' },
                      { value: '25-50k', label: '$25,000 - $50,000' },
                      { value: '50k+', label: '$50,000+' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          monthlyRevenue === option.value
                            ? 'border-[#1b17ff] bg-[#1b17ff]/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#1b17ff]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="monthlyRevenue"
                          value={option.value}
                          checked={monthlyRevenue === option.value}
                          onChange={(e) => setMonthlyRevenue(e.target.value)}
                          className="w-5 h-5 text-[#1b17ff]"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Question 3: Credit Score */}
                <div>
                  <label className="block text-base font-semibold text-[#041e42] dark:text-white mb-4">
                    Question 3: What's your personal credit score range?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: '<550', label: 'Under 550' },
                      { value: '550-649', label: '550-649' },
                      { value: '650-699', label: '650-699' },
                      { value: '700+', label: '700+' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          creditScore === option.value
                            ? 'border-[#1b17ff] bg-[#1b17ff]/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#1b17ff]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="creditScore"
                          value={option.value}
                          checked={creditScore === option.value}
                          onChange={(e) => setCreditScore(e.target.value)}
                          className="w-5 h-5 text-[#1b17ff]"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Question 4: Card Processing */}
                <div>
                  <label className="block text-base font-semibold text-[#041e42] dark:text-white mb-4">
                    Question 4: Do you process credit card payments regularly?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'none', label: 'No credit card processing' },
                      { value: 'inconsistent', label: 'Inconsistent (some months)' },
                      { value: 'consistent', label: 'Consistent (most months)' },
                      { value: 'high', label: 'High volume (daily)' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          cardProcessing === option.value
                            ? 'border-[#1b17ff] bg-[#1b17ff]/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#1b17ff]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="cardProcessing"
                          value={option.value}
                          checked={cardProcessing === option.value}
                          onChange={(e) => setCardProcessing(e.target.value)}
                          className="w-5 h-5 text-[#1b17ff]"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleQuizSubmit}
                  disabled={!timeInBusiness || !monthlyRevenue || !creditScore || !cardProcessing}
                  className="w-full h-14 bg-gradient-to-r from-[#1b17ff] to-[#4845ff] hover:from-[#1510dd] hover:to-[#3835dd] text-white text-lg font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Calculate My Approval Odds
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="mb-10 animate-in slide-in-from-top-4 duration-300">
            <div className={`${getApprovalMessage(results.score).bgColor} rounded-xl p-6 md:p-8 border-2 ${getApprovalMessage(results.score).borderColor}`}>
              <h4 className="text-2xl font-bold text-[#041e42] dark:text-white mb-6">
                Your Qualification Assessment
              </h4>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Based on your responses:
              </p>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Estimated Approval Probability
                  </span>
                  <span className={`text-3xl font-bold ${getApprovalMessage(results.score).color}`}>
                    {results.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#1b17ff] to-[#4845ff] h-full rounded-full transition-all duration-1000"
                    style={{ width: `${results.score}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {results.score >= 50 ? 'You meet our minimum criteria' : 'Additional documentation may be required'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Estimated advance range: ${results.minAmount.toLocaleString()} - ${results.maxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Estimated factor rate: {results.minFactor} - {results.maxFactor}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 h-12 bg-gradient-to-r from-[#1b17ff] to-[#4845ff] hover:from-[#1510dd] hover:to-[#3835dd] text-white font-semibold">
                  Start Application
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailedRequirements(true)}
                  className="flex-1 h-12 border-2 border-[#1b17ff] text-[#1b17ff] hover:bg-[#1b17ff]/5"
                >
                  See Detailed Requirements
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <button
                onClick={resetQuiz}
                className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-[#1b17ff] underline"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        )}

        {/* Core Qualification Criteria - Shows after results or by default */}
        {(showResults && showDetailedRequirements) || (!showResults && true) ? (
          <div className="mb-10 animate-in slide-in-from-top-4 duration-300">
            <h4 className="text-2xl font-bold text-[#041e42] dark:text-white mb-6">
              Core Qualification Criteria
            </h4>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {qualificationCriteria.map((criteria, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#1b17ff] rounded-lg flex items-center justify-center">
                      <criteria.icon className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="text-lg font-bold text-[#041e42] dark:text-white">
                      {criteria.title}
                    </h5>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                        Minimum
                      </p>
                      <p className="text-lg font-bold text-[#041e42] dark:text-white">
                        {criteria.minimum}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                        Optimal
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {criteria.optimal}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {criteria.description}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {criteria.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Approval Outlook by Business Profile */}
            <h4 className="text-2xl font-bold text-[#041e42] dark:text-white mb-4">
              Approval Outlook by Business Profile
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Understanding your likelihood based on combined factors
            </p>

            <div className="space-y-4 mb-10">
              {approvalProfiles.map((profile, index) => {
                const colorClasses = {
                  green: {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-500',
                    text: 'text-green-700 dark:text-green-400',
                    probability: 'text-green-600 dark:text-green-400',
                  },
                  blue: {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-500',
                    text: 'text-blue-700 dark:text-blue-400',
                    probability: 'text-blue-600 dark:text-blue-400',
                  },
                  yellow: {
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    border: 'border-yellow-500',
                    text: 'text-yellow-700 dark:text-yellow-400',
                    probability: 'text-yellow-600 dark:text-yellow-400',
                  },
                  orange: {
                    bg: 'bg-orange-50 dark:bg-orange-900/20',
                    border: 'border-orange-500',
                    text: 'text-orange-700 dark:text-orange-400',
                    probability: 'text-orange-600 dark:text-orange-400',
                  },
                };

                const colors = colorClasses[profile.color as keyof typeof colorClasses];

                return (
                  <div
                    key={index}
                    className={`${colors.bg} border-l-4 ${colors.border} p-5 rounded-r-lg`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h5 className={`text-lg font-bold ${colors.text}`}>
                        {profile.title}
                      </h5>
                      <span className={`text-2xl font-bold ${colors.probability}`}>
                        {profile.probability}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {profile.criteria.map((criterion, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-gray-500 dark:text-gray-400">├─</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {criterion}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Note:</span> These are estimates. Actual approval depends on comprehensive underwriting review including industry, banking history, and other factors.
              </p>
            </div>
          </div>
        ) : null}

        {/* Documentation Requirements */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold text-[#041e42] dark:text-white mb-4">
            Documentation Requirements
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            What you'll need to complete your application
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h5 className="text-lg font-bold text-[#041e42] dark:text-white">
                  Essential Documents (Required)
                </h5>
              </div>
              <ul className="space-y-3">
                {essentialDocs.map((doc, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h5 className="text-lg font-bold text-[#041e42] dark:text-white">
                  Conditional Documents (May be requested)
                </h5>
              </div>
              <ul className="space-y-3">
                {conditionalDocs.map((doc, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-[#1b17ff] rounded-lg text-[#1b17ff] font-semibold hover:bg-[#1b17ff] hover:text-white transition-all duration-200">
            <Download className="w-4 h-4" />
            Download Complete Checklist (PDF)
          </button>
        </div>

        {/* Situations That May Impact Approval */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold text-[#041e42] dark:text-white mb-6">
            Situations That May Impact Approval
          </h4>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h5 className="text-lg font-bold text-[#041e42] dark:text-white">
                  We cannot approve applications with:
                </h5>
              </div>
              <ul className="space-y-2">
                {cannotApprove.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400">├─</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <h5 className="text-lg font-bold text-[#041e42] dark:text-white">
                  Situations requiring additional review:
                </h5>
              </div>
              <ul className="space-y-2">
                {additionalReview.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400">├─</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We encourage you to apply even if you have concerns about qualification. Our underwriting team evaluates each application individually and considers the complete business profile.
            </p>
          </div>
        </div>

        {/* Strengthening Your Application */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold text-[#041e42] dark:text-white mb-6">
            Strengthening Your Application
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h5 className="text-lg font-bold text-[#041e42] dark:text-white mb-4">
                Preparation Steps:
              </h5>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#1b17ff]">├─</span>
                  <span>Gather 6 months of complete bank statements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1b17ff]">├─</span>
                  <span>Collect 3 months of processing statements (all pages)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1b17ff]">├─</span>
                  <span>Verify business information is current</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1b17ff]">├─</span>
                  <span>Review personal credit report for accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1b17ff]">└─</span>
                  <span>Organize business formation documents</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h5 className="text-lg font-bold text-[#041e42] dark:text-white mb-4">
                To Qualify for Better Terms:
              </h5>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">├─</span>
                  <span>Maintain consistent monthly revenue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">├─</span>
                  <span>Demonstrate steady or growing sales trajectory</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">├─</span>
                  <span>Increase time in business (if near threshold)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">├─</span>
                  <span>Address any outstanding tax obligations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">└─</span>
                  <span>Consider waiting if credit score is improving</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Our underwriting team is available to discuss your specific situation and advise on the best time to apply.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-2 border-[#1b17ff] text-[#1b17ff] hover:bg-[#1b17ff]/5">
                Schedule Pre-Application Consultation
              </Button>
              <Button className="bg-gradient-to-r from-[#1b17ff] to-[#4845ff] hover:from-[#1510dd] hover:to-[#3835dd] text-white">
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <button
            onClick={() => setShowFAQs(!showFAQs)}
            className="flex items-center justify-between w-full text-left mb-6"
          >
            <h4 className="text-2xl font-bold text-[#041e42] dark:text-white">
              Frequently Asked Questions
            </h4>
            {showFAQs ? (
              <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {showFAQs && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700"
                >
                  <h5 className="font-bold text-[#041e42] dark:text-white mb-2">
                    {faq.q}
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
