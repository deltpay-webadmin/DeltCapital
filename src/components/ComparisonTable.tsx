import { Check, X, Zap, CreditCard, BarChart3, FileText, TrendingDown, Shield } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ScrollReveal, TextReveal } from './ScrollNarrative';
import plaidLogo from 'figma:asset/3d56d8057bf3175de1bdd9e78d2cb0a4f9e0dc87.png';
import deltLogo from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';

export function ComparisonTable() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const isTableInView = useInView(tableRef, { once: true, amount: 0.05 });

  // Manual scroll-linked parallax (avoids Motion useScroll iframe issues)
  const [headerYVal, setHeaderYVal] = useState(60);
  const [headerOpacityVal, setHeaderOpacityVal] = useState(0);

  const handleScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0 = element top at viewport bottom, 1 = element bottom at viewport top
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    setHeaderYVal(progress <= 0.3 ? 60 - (60 * progress / 0.3) : 0);
    setHeaderOpacityVal(progress <= 0.2 ? progress / 0.2 : 1);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const comparisonData = [
    {
      featureKey: 'comparison.getFunded',
      descriptionKey: 'comparison.getFunded.desc',
      traditionalKey: 'comparison.getFunded.traditional',
      deltKey: 'comparison.getFunded.delt',
      isHighlight: true,
    },
    {
      featureKey: 'comparison.repayment',
      descriptionKey: 'comparison.repayment.desc',
      traditionalKey: 'comparison.repayment.traditional',
      deltKey: 'comparison.repayment.delt',
      isHighlight: true,
    },
    {
      featureKey: 'comparison.credit',
      descriptionKey: 'comparison.credit.desc',
      traditionalKey: 'comparison.credit.traditional',
      deltKey: 'comparison.credit.delt',
      isHighlight: true,
    },
    {
      featureKey: 'comparison.paperwork',
      descriptionKey: 'comparison.paperwork.desc',
      traditionalKey: 'comparison.paperwork.traditional',
      deltKey: 'comparison.paperwork.delt',
      isHighlight: true,
    },
    {
      featureKey: 'comparison.slowMonths',
      descriptionKey: 'comparison.slowMonths.desc',
      traditionalKey: 'comparison.slowMonths.traditional',
      deltKey: 'comparison.slowMonths.delt',
      isHighlight: true,
    },
    {
      featureKey: 'comparison.collateral',
      descriptionKey: 'comparison.collateral.desc',
      traditionalKey: 'comparison.collateral.traditional',
      deltKey: 'comparison.collateral.delt',
      isHighlight: true,
    },
  ];

  const icons = [Zap, CreditCard, BarChart3, FileText, TrendingDown, Shield];

  return (
    <section ref={sectionRef} className="relative py-20 bg-[#FAFBFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with scroll-linked parallax */}
        <motion.div
          style={{ transform: `translateY(${headerYVal}px)`, opacity: headerOpacityVal }}
          className="text-center mb-12"
        >
          <h2
            className="mb-3"
            style={{ fontSize: '2rem', fontWeight: 700, color: '#172B4D' }}
          >
            Why Delt beats the bank.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.5)' }}>
            {t('comparison.subtitle')}
          </p>
        </motion.div>

        <div ref={tableRef} className="max-w-5xl mx-auto">
          {/* Desktop Table — rows build progressively */}
          <div className="hidden md:block bg-[#FFFFFF] rounded-2xl shadow-2xl overflow-hidden border border-[#0C66E40F]">
            <table className="w-full">
              <thead>
                <motion.tr
                  className="bg-gradient-to-r from-[#FAFBFC] to-[#F1F2F4]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={isTableInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <th className="px-8 py-6 text-left text-lg font-semibold text-[#172B4D] dark:text-white">
                    {t('comparison.feature')}
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {t('comparison.traditional')}
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-semibold bg-gradient-to-b from-[#0C66E4]/[0.10] to-[#0C66E4]/[0.04] dark:bg-[#0C66E4]/10 border-l border-[#0C66E4]/15">
                    <img src={deltLogo} alt="Delt Capital" className="h-7 w-auto mx-auto object-contain" />
                  </th>
                </motion.tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => {
                  const Icon = icons[index];
                  const isEven = index % 2 === 0;

                  return (
                    <motion.tr
                      key={index}
                      className={`border-t border-[#0C66E40F] hover:bg-[#FAFBFC] transition-colors ${
                        isEven ? 'bg-[#FAFBFC]/40' : ''
                      }`}
                      initial={{ opacity: 0, x: -40 }}
                      animate={isTableInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: 0.15 + index * 0.12,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0C66E4] to-[#1D7AFC] flex items-center justify-center flex-shrink-0"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={isTableInView ? { scale: 1, rotate: 0 } : {}}
                            transition={{
                              type: 'spring',
                              stiffness: 260,
                              damping: 20,
                              delay: 0.3 + index * 0.12,
                            }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <div className="text-[#172B4D] dark:text-white font-semibold text-base mb-1">
                              {t(row.featureKey)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {t(row.descriptionKey)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center text-gray-600 dark:text-gray-400">
                        <motion.div
                          className="flex items-center justify-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={isTableInView ? { opacity: 1 } : {}}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.12 }}
                        >
                          <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <span>{t(row.traditionalKey)}</span>
                        </motion.div>
                      </td>
                      <td className="px-8 py-6 text-center bg-gradient-to-b from-[#0C66E4]/[0.04] via-[#6E5DC6]/[0.08] to-[#0C66E4]/[0.04] dark:bg-[#0C66E4]/10 border-l border-[#0C66E4]/15">
                        <motion.div
                          className="flex items-center justify-center gap-2"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isTableInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{
                            duration: 0.4,
                            delay: 0.6 + index * 0.12,
                            type: 'spring',
                            stiffness: 200,
                          }}
                        >
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          {row.deltKey === 'comparison.paperwork.delt' ? (
                            <span className="text-[#172B4D] dark:text-white font-semibold flex items-center gap-0">
                              {t('comparison.paperwork.connectWith')} <img src={plaidLogo} alt="Plaid" className="h-[3.25rem] w-auto inline-block object-contain -ml-1" />
                            </span>
                          ) : (
                            <span className="text-[#172B4D] dark:text-white font-semibold">
                              {t(row.deltKey)}
                            </span>
                          )}
                        </motion.div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards — staggered reveal */}
          <div className="md:hidden space-y-6">
            {comparisonData.map((row, index) => {
              const Icon = icons[index];
              
              return (
                <ScrollReveal key={index} direction="up" delay={index * 0.08} distance={30}>
                  <div className="bg-[#FFFFFF] rounded-xl shadow-lg overflow-hidden border border-[#0C66E40F]">
                    <div className="bg-gradient-to-r from-[#FAFBFC] to-[#F1F2F4] px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0C66E4] to-[#1D7AFC] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-[#172B4D] dark:text-white">
                            {t(row.featureKey)}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {t(row.descriptionKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('comparison.traditional')}</span>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600 dark:text-gray-400">{t(row.traditionalKey)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-[#0C66E4]/5 dark:bg-[#0C66E4]/10 rounded-lg p-3">
                        <img src={deltLogo} alt="Delt Capital" className="h-5 w-auto object-contain" />
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          {row.deltKey === 'comparison.paperwork.delt' ? (
                            <span className="text-[#172B4D] dark:text-white font-semibold flex items-center gap-0">
                              {t('comparison.paperwork.connectWith')} <img src={plaidLogo} alt="Plaid" className="h-[3.25rem] w-auto inline-block object-contain -ml-1" />
                            </span>
                          ) : (
                            <span className="text-[#172B4D] dark:text-white font-semibold">
                              {t(row.deltKey)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}