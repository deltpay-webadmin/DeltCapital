import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { LeadCaptureForm, LeadCaptureData } from './LeadCaptureForm';
import { DeltComparisonScreen, DeltComparisonResult } from './DeltComparisonScreen';
import { PreQualificationGame } from './PreQualificationGame';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';

type PagePhase = 'lead-capture' | 'awaiting-plaid' | 'delt-comparison' | 'application';

// ── Helper: convert calculator data → LeadCaptureForm initial data ──
// Maps overlapping fields so the user never has to re-type information
function buildInitialDataFromCalculator(calculatorData: any): Partial<LeadCaptureData> | undefined {
  if (!calculatorData) return undefined;

  const result: Partial<LeadCaptureData> = {};

  // Calculator provides monthlyRevenue as a locale string like "50,000"
  // LeadCaptureForm expects annualRevenue as a formatted currency string like "$600,000"
  if (calculatorData.monthlyRevenue) {
    const monthly = parseInt(String(calculatorData.monthlyRevenue).replace(/\D/g, ''), 10);
    if (monthly > 0) {
      const annual = monthly * 12;
      result.annualRevenue = '$' + annual.toLocaleString();
      result.desiredFunding = result.annualRevenue;
    }
  }

  // acceptsCreditCards: calculator uses true/false/null
  if (calculatorData.acceptsCreditCards === true || calculatorData.acceptsCreditCards === false) {
    result.acceptsCreditCards = calculatorData.acceptsCreditCards;
  }

  // creditCardProcessing: calculator provides as locale string like "25,000" or "No credit card processing"
  if (calculatorData.acceptsCreditCards === true && calculatorData.creditCardProcessing) {
    const ccStr = String(calculatorData.creditCardProcessing);
    if (ccStr !== 'No credit card processing') {
      const ccNum = parseInt(ccStr.replace(/\D/g, ''), 10);
      if (ccNum > 0) {
        result.monthlyCCSales = '$' + ccNum.toLocaleString();
      }
    }
  }

  // timeInBusiness: preserve for DeltComparisonScreen calculations
  if (calculatorData.timeInBusiness) {
    result.timeInBusiness = calculatorData.timeInBusiness;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

interface ApplicationPageProps {
  onClose: () => void;
  quizData: any;
  calculatorData?: any;
  fromQuiz?: boolean;
  onLegalLinkClick?: (page: 'terms' | 'privacy' | 'eca') => void;
  onOpenPlaidOnboarding?: () => void;
  plaidCompleted?: boolean;
  onDeltLearnMore?: () => void;
}

export function ApplicationPage({ onClose, quizData, calculatorData, fromQuiz, onLegalLinkClick, onOpenPlaidOnboarding, plaidCompleted, onDeltLearnMore }: ApplicationPageProps) {
  const [localLeadData, setLocalLeadData] = useState<LeadCaptureData | null>(null);
  const [comparisonResult, setComparisonResult] = useState<DeltComparisonResult | null>(null);

  // Merge calculator data into initial form data (computed once)
  const calcInitialData = useMemo(() => buildInitialDataFromCalculator(calculatorData), [calculatorData]);

  // If user already opted into Delt processing in the calculator, skip the comparison screen
  const skipComparison = calculatorData?.deltProcessing === true;

  // If user doesn't accept credit cards, they should SIGN UP with Delt (not switch), so skip comparison
  const isDeltSignup = localLeadData?.acceptsCreditCards === false;

  // Determine phase
  let phase: PagePhase;
  if (!localLeadData) {
    phase = 'lead-capture';
  } else if (!plaidCompleted) {
    phase = 'awaiting-plaid';
  } else if (!skipComparison && !comparisonResult && !isDeltSignup) {
    phase = 'delt-comparison';
  } else {
    phase = 'application';
  }

  const handleLeadSubmit = (data: LeadCaptureData) => {
    setLocalLeadData(data);
    // Trigger the Plaid onboarding modal
    if (onOpenPlaidOnboarding) {
      onOpenPlaidOnboarding();
    }
  };

  const handleComparisonSelect = (result: DeltComparisonResult) => {
    setComparisonResult(result);
  };

  return (
    <div 
      className="fixed inset-0 bg-[#FAFBFC] z-50 overflow-y-auto"
      style={{ scrollbarGutter: 'stable' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FAFBFC] border-b border-[#0C66E40F] shadow-sm isolate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-0 h-14 w-auto cursor-pointer" onClick={onClose}>
            <img src={logoImg} alt="Delt" className="h-10 w-auto object-contain" />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#FAFBFC] hover:bg-[#DCDFE4] rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {phase === 'lead-capture' && (
          <LeadCaptureForm
            onSubmit={handleLeadSubmit}
            initialData={localLeadData || calcInitialData || undefined}
          />
        )}

        {phase === 'awaiting-plaid' && (
          /* Plaid modal is open on top of this — show a subtle waiting state */
          <div className="w-full max-w-2xl mx-auto text-center py-20">
            <div className="animate-pulse">
              <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto mb-4" />
              <div className="h-4 bg-slate-200 rounded w-48 mx-auto mb-2" />
              <div className="h-3 bg-slate-100 rounded w-32 mx-auto" />
            </div>
          </div>
        )}

        {phase === 'delt-comparison' && localLeadData && (
          <DeltComparisonScreen
            desiredFunding={localLeadData.annualRevenue || localLeadData.desiredFunding}
            monthlyCCSales={localLeadData.monthlyCCSales}
            acceptsCreditCards={localLeadData.acceptsCreditCards}
            timeInBusiness={calculatorData?.timeInBusiness}
            businessName={localLeadData.businessName}
            onSelect={handleComparisonSelect}
          />
        )}

        {phase === 'application' && (
          <PreQualificationGame 
            startWithQuiz={false} 
            quizData={{
              ...quizData,
              ...(localLeadData && {
                firstName: localLeadData.ownerFirstName,
                lastName: localLeadData.ownerLastName,
                ownerEmail: localLeadData.ownerEmail,
                businessLegalName: localLeadData.businessName,
                industry: localLeadData.industry,
                requestedAmount: localLeadData.annualRevenue || localLeadData.desiredFunding,
                timeInBusiness: localLeadData.timeInBusiness,
              }),
              // If user doesn't accept credit cards, they're signing up (not switching), auto-enable Delt
              ...(isDeltSignup && {
                deltBoostEnabled: true,
                isDeltSignup: true, // Flag to change messaging from "switch" to "sign up"
                selectedOfferAmount: 0, // Will be calculated in PreQualificationGame
              }),
              // If comparison screen was shown and user selected an offer, use that
              ...(comparisonResult && {
                deltBoostEnabled: comparisonResult.selectedOffer === 'delt-preferred',
                selectedOfferAmount: comparisonResult.offerAmount,
                isDeltSignup: false,
              }),
              // If comparison was skipped (user already chose Delt in calculator), set defaults
              ...(skipComparison && !isDeltSignup && {
                deltBoostEnabled: true,
                selectedOfferAmount: calculatorData?.requestedAmount
                  ? parseInt(String(calculatorData.requestedAmount).replace(/\D/g, ''), 10) || 0
                  : 0,
                isDeltSignup: false,
              }),
            }} 
            fromQuiz={fromQuiz}
            onLegalLinkClick={onLegalLinkClick}
            onOpenPlaidOnboarding={onOpenPlaidOnboarding}
            plaidCompleted={plaidCompleted}
            onDeltLearnMore={onDeltLearnMore}
          />
        )}
      </div>
    </div>
  );
}