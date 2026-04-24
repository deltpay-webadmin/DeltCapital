import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  FileText, 
  TrendingUp, 
  ChevronRight,
  CheckCircle,
  X,
  DollarSign,
  Clock,
  RefreshCw,
  FileCheck,
  CreditCard,
  Building2,
  Phone,
  BarChart3,
  Gauge,
  Calendar
} from 'lucide-react';
import plaidLogo from 'figma:asset/b19fc5b06208df452c9347434d63d6c2447fa096.png';
import { useLanguage } from '../contexts/LanguageContext';

interface MCAEducationSectionProps {
  initialTab?: string;
}

export function MCAEducationSection({ initialTab }: MCAEducationSectionProps = {}) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string | null>(initialTab || null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveSection(initialTab);
      // Scroll to the section when initialTab is set
      if (sectionRef.current) {
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [initialTab]);

  const sections = [
    {
      id: 'how-it-works',
      title: t('knowledge.howItWorks'),
      icon: BookOpen,
      color: 'from-[#4F46E5] to-[#6D5BFF]',
    },
    {
      id: 'how-to-apply',
      title: t('knowledge.howToApply'),
      icon: FileText,
      color: 'from-[#4F46E5] to-[#6D5BFF]',
    },
    {
      id: 'managing-repayment',
      title: t('knowledge.managingRepayment'),
      icon: TrendingUp,
      color: 'from-[#4F46E5] to-[#4F46E5]',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-[#FFFFFF] dark:bg-[#0F0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0F0E17] dark:text-white mb-4">
            {t('knowledge.title')}
          </h2>
          <p className="text-xl text-[#6A6876] dark:text-[#D9D4C7] max-w-3xl mx-auto">
            {t('knowledge.subtitle')}
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(isActive ? null : section.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105`
                    : 'bg-[#FAF8F3] dark:bg-[#1A1923] text-[#0F0E17] dark:text-white hover:shadow-md border-2 border-transparent hover:border-[#4F46E5]'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {activeSection && (
          <div className="bg-white dark:bg-[#1A1923] rounded-2xl shadow-xl border border-[#E7E3DA] dark:border-[#3E3D49] p-8 md:p-12">
          {/* Tab 1: How It Works */}
          {activeSection === 'how-it-works' && (
            <div className="space-y-10">
              {/* What is an MCA */}
              <div>
                <h3 className="text-3xl font-bold text-[#0F0E17] dark:text-white mb-4">
                  {t('knowledge.whatIsMCA')}
                </h3>
                <p className="text-lg text-[#6A6876] dark:text-[#D9D4C7] leading-relaxed">
                  {t('knowledge.whatIsMCA.desc')}
                </p>
              </div>

              {/* 3 Simple Steps */}
              <div>
                <h4 className="text-2xl font-bold text-[#0F0E17] dark:text-white mb-6">
                  {t('knowledge.3steps')}
                </h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-6 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#6D5BFF] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                      1
                    </div>
                    <h5 className="text-lg font-bold text-[#0F0E17] dark:text-white mb-2">
                      {t('knowledge.step1.title')}
                    </h5>
                    <p className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">
                      {t('knowledge.step1.desc')}
                    </p>
                  </div>
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-6 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#6D5BFF] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                      2
                    </div>
                    <h5 className="text-lg font-bold text-[#0F0E17] dark:text-white mb-2">
                      {t('knowledge.step2.title')}
                    </h5>
                    <p className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">
                      {t('knowledge.step2.desc')}
                    </p>
                  </div>
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-6 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#6D5BFF] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                      3
                    </div>
                    <h5 className="text-lg font-bold text-[#0F0E17] dark:text-white mb-2">
                      {t('knowledge.step3.title')}
                    </h5>
                    <p className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">
                      {t('knowledge.step3.desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Terms */}
              <div>
                <h4 className="text-2xl font-bold text-[#0F0E17] dark:text-white mb-6">
                  {t('knowledge.keyTerms')}
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-lg p-5 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="font-bold text-[#4F46E5] mb-2">{t('knowledge.purchaseAmount')}</div>
                    <div className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">{t('knowledge.purchaseAmount.desc')}</div>
                  </div>
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-lg p-5 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="font-bold text-[#4F46E5] mb-2">{t('knowledge.holdback')}</div>
                    <div className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">{t('knowledge.holdback.desc')}</div>
                  </div>
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-lg p-5 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="font-bold text-[#4F46E5] mb-2">{t('knowledge.factorRate')}</div>
                    <div className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">{t('knowledge.factorRate.desc')}</div>
                  </div>
                </div>
              </div>

              {/* Good Fit */}
              <div className="bg-gradient-to-br from-[#E6E9FF] to-[#FAF8F3] dark:from-[#1A1923] dark:to-[#1A1923] rounded-xl p-6 border border-[#4F46E5]/20">
                <h4 className="text-2xl font-bold text-[#0F0E17] dark:text-white mb-6">
                  {t('knowledge.goodFit')}
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-[#16A34A]" />
                      <h5 className="font-bold text-[#0F0E17] dark:text-white">{t('knowledge.yesIf')}</h5>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <CheckCircle className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.yes1')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <CheckCircle className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.yes2')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <CheckCircle className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.yes3')}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <X className="w-5 h-5 text-[#DC2626]" />
                      <h5 className="font-bold text-[#0F0E17] dark:text-white">{t('knowledge.notIdeal')}</h5>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <X className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.no1')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <X className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.no2')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: How to Apply */}
          {activeSection === 'how-to-apply' && (
            <div className="space-y-10">
              {/* You Need */}
              <div>
                <h3 className="text-3xl font-bold text-[#0F0E17] dark:text-white mb-6">
                  {t('knowledge.youNeed')}
                </h3>
                <div className="space-y-4">
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-6 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#4F46E5] rounded-lg flex items-center justify-center flex-shrink-0">
                        <img src={plaidLogo} alt="Plaid" className="w-8 h-8 brightness-0 invert" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-[#0F0E17] dark:text-white mb-1">
                          {t('knowledge.connectPlaid')}
                        </h5>
                        <p className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">{t('knowledge.connectPlaid.desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-6 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#4F46E5] rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-[#0F0E17] dark:text-white mb-1">
                          {t('knowledge.processingStatements')}
                        </h5>
                        <p className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">{t('knowledge.processingStatements.desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-6 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#4F46E5] rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-[#0F0E17] dark:text-white mb-1">
                          {t('knowledge.businessInfo')}
                        </h5>
                        <p className="text-sm text-[#6A6876] dark:text-[#D9D4C7]">{t('knowledge.businessInfo.desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* We Look For */}
              <div>
                <h4 className="text-2xl font-bold text-[#0F0E17] dark:text-white mb-4">
                  {t('knowledge.weLookFor')}
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-[#6A6876] dark:text-[#D9D4C7]">
                    <CheckCircle className="w-5 h-5 text-[#4F46E5] flex-shrink-0" />
                    <span>{t('knowledge.look1')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6A6876] dark:text-[#D9D4C7]">
                    <CheckCircle className="w-5 h-5 text-[#4F46E5] flex-shrink-0" />
                    <span>{t('knowledge.look2')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6A6876] dark:text-[#D9D4C7]">
                    <CheckCircle className="w-5 h-5 text-[#4F46E5] flex-shrink-0" />
                    <span>{t('knowledge.look3')}</span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div>
                <h4 className="text-2xl font-bold text-[#0F0E17] dark:text-white mb-4">
                  {t('knowledge.quickTips')}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[#6A6876] dark:text-[#D9D4C7]">
                    <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.tip1')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#6A6876] dark:text-[#D9D4C7]">
                    <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.tip2')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#6A6876] dark:text-[#D9D4C7]">
                    <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.tip3')}</span>
                  </li>
                </ul>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-br from-[#E6E9FF] to-[#FAF8F3] dark:from-[#1A1923] dark:to-[#1A1923] rounded-xl p-8 border border-[#4F46E5]/20">
                <div className="flex items-start gap-4">
                  <Calendar className="w-8 h-8 text-[#4F46E5] flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold text-[#0F0E17] dark:text-white mb-3">
                      {t('knowledge.timeline')}
                    </h4>
                    <p className="text-[#6A6876] dark:text-[#D9D4C7]">
                      {t('knowledge.timeline.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Managing Repayment */}
          {activeSection === 'managing-repayment' && (
            <div className="space-y-10">
              {/* First Steps */}
              <div>
                <h3 className="text-3xl font-bold text-[#0F0E17] dark:text-white mb-6">
                  {t('knowledge.firstSteps')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-lg text-[#6A6876] dark:text-[#D9D4C7]">
                    <CheckCircle className="w-6 h-6 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.first1')}</span>
                  </div>
                  <div className="flex items-start gap-3 text-lg text-[#6A6876] dark:text-[#D9D4C7]">
                    <CheckCircle className="w-6 h-6 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.first2')}</span>
                  </div>
                  <div className="flex items-start gap-3 text-lg text-[#6A6876] dark:text-[#D9D4C7]">
                    <CheckCircle className="w-6 h-6 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.first3')}</span>
                  </div>
                </div>
              </div>

              {/* Know This */}
              <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-5 border border-[#E7E3DA] dark:border-[#3E3D49]">
                <h4 className="text-xl font-bold text-[#0F0E17] dark:text-white mb-4">
                  {t('knowledge.knowThis')}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                    <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.know1')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                    <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.know2')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                    <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.know3')}</span>
                  </li>
                </ul>
              </div>

              {/* Smart Moves */}
              <div>
                <h4 className="text-2xl font-bold text-[#0F0E17] dark:text-white mb-6">
                  {t('knowledge.smartMoves')}
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-5 border border-[#E7E3DA] dark:border-[#3E3D49]">
                    <div className="flex items-start gap-3 mb-4">
                      <DollarSign className="w-6 h-6 text-[#4F46E5] flex-shrink-0" />
                      <h5 className="font-bold text-[#0F0E17] dark:text-white">{t('knowledge.useFundsFor')}</h5>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.use1')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.use2')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.use3')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                        <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                        <span>{t('knowledge.use4')}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-lg p-4 border border-[#E7E3DA] dark:border-[#3E3D49]">
                      <h5 className="font-bold text-[#0F0E17] dark:text-white mb-2">{t('knowledge.maintain')}</h5>
                      <p className="text-base text-[#6A6876] dark:text-[#D9D4C7]">{t('knowledge.maintain.desc')}</p>
                    </div>
                    <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-lg p-4 border border-[#E7E3DA] dark:border-[#3E3D49]">
                      <h5 className="font-bold text-[#0F0E17] dark:text-white mb-2">{t('knowledge.plan')}</h5>
                      <p className="text-base text-[#6A6876] dark:text-[#D9D4C7]">{t('knowledge.plan.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Future Funding */}
              <div className="bg-[#FAF8F3] dark:bg-[#1A1923] rounded-xl p-5 border border-[#E7E3DA] dark:border-[#3E3D49]">
                <h4 className="text-xl font-bold text-[#0F0E17] dark:text-white mb-4">
                  {t('knowledge.futureFunding')}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                    <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.future1')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-base text-[#6A6876] dark:text-[#D9D4C7]">
                    <ChevronRight className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <span>{t('knowledge.future2')}</span>
                  </li>
                </ul>
              </div>

              {/* Questions */}
              <div className="bg-gradient-to-br from-[#E6E9FF] to-[#FAF8F3] dark:from-[#1A1923] dark:to-[#1A1923] rounded-xl p-8 border border-[#4F46E5]/20">
                <div className="flex items-start gap-4">
                  <Phone className="w-8 h-8 text-[#4F46E5] flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold text-[#0F0E17] dark:text-white mb-3">
                      {t('knowledge.questions')}
                    </h4>
                    <p className="text-[#6A6876] dark:text-[#D9D4C7]">
                      {t('knowledge.questions.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </section>
  );
}