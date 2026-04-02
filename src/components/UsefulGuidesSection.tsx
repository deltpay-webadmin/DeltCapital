import React, { useState } from 'react';
import { Calculator, HelpCircle, TrendingUp, X } from 'lucide-react';
import { CapitalCostAnalyzer } from './CapitalCostAnalyzer';
import { QualificationGuide } from './QualificationGuide';
import { RepaymentGuide } from './RepaymentGuide';
import { useLanguage } from '../contexts/LanguageContext';

export function UsefulGuidesSection() {
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const { t } = useLanguage();

  const guides = [
    {
      id: 'calculator',
      icon: Calculator,
      title: t('guides.calculator.title'),
      description: t('guides.calculator.desc'),
      component: <CapitalCostAnalyzer />,
    },
    {
      id: 'qualification',
      icon: HelpCircle,
      title: t('guides.qualification.title'),
      description: t('guides.qualification.desc'),
      component: <QualificationGuide />,
    },
    {
      id: 'repayment',
      icon: TrendingUp,
      title: t('guides.repayment.title'),
      description: t('guides.repayment.desc'),
      component: <RepaymentGuide />,
    },
  ];

  const activeGuideData = guides.find(g => g.id === activeGuide);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setActiveGuide(null);
    }
  };

  return (
    <>
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#0A1F35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#041e42] dark:text-white mb-4">
              {t('guides.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('guides.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <button
                key={index}
                onClick={() => guide.component ? setActiveGuide(guide.id) : null}
                className="bg-white dark:bg-[#0f1f2e] p-8 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-[#1b17ff] transition-all group text-left w-full"
              >
                <div className="w-14 h-14 bg-[#1b17ff] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                  <guide.icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#041e42] dark:text-white mb-3">
                  {guide.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {guide.description}
                </p>
                <div className="text-[#1b17ff] font-semibold flex items-center">
                  {t('guides.open')} →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Interactive Guides */}
      {activeGuide && activeGuideData?.component && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div className="w-full max-w-6xl mb-16">
            <div className="relative">
              <button
                onClick={() => setActiveGuide(null)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-lg flex items-center justify-center z-10 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
              {activeGuideData.component}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
