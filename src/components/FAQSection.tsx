import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
    { question: t('faq.q7'), answer: t('faq.a7') },
    { question: t('faq.q8'), answer: t('faq.a8') },
    { question: t('faq.q9'), answer: t('faq.a9') },
    { question: t('faq.q10'), answer: t('faq.a10') },
  ];

  // Intersection Observer to expand title when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsExpanded(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#ededf6] dark:bg-[#132030]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 overflow-hidden">
          <button
            onClick={() => setIsSectionOpen(!isSectionOpen)}
            className="w-full flex items-center justify-center gap-4 group"
          >
            <h2 
              id="faq-section"
              className={`font-bold text-[#041e42] dark:text-white transition-all duration-700 ease-out ${
                isExpanded 
                  ? 'text-4xl opacity-100 translate-y-0' 
                  : 'text-2xl opacity-50 -translate-y-2'
              }`}
            >
              {t('faq.title')}
            </h2>
            {isSectionOpen ? (
              <ChevronUp className="w-8 h-8 text-[#4945ff] flex-shrink-0 transition-transform" />
            ) : (
              <ChevronDown className="w-8 h-8 text-[#9AA5B1] group-hover:text-[#4945ff] flex-shrink-0 transition-colors" />
            )}
          </button>
          
          {isSectionOpen && (
            <p 
              className={`text-xl text-gray-600 dark:text-gray-300 mt-4 transition-all duration-700 delay-150 ease-out ${
                isExpanded 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
            >
              {t('faq.subtitle')}
            </p>
          )}
        </div>

        {isSectionOpen && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-[#F5F7FA] dark:bg-[#1F2933] rounded-xl border border-[#E4E7EB] dark:border-[#3E4C59] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white dark:hover:bg-[#132030] transition-colors"
                >
                  <span className="text-lg font-semibold text-[#041e42] dark:text-white pr-8">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-[#4945ff] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[#9AA5B1] flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[#52606D] dark:text-[#CBD2D9] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isSectionOpen && (
          <div className="mt-12 text-center animate-in slide-in-from-top-4 duration-500 delay-100">
            <p className="text-[#52606D] dark:text-[#CBD2D9] mb-4">{t('faq.stillQuestions')}</p>
            <a 
              href="tel:+18647293358" 
              className="inline-block bg-[#4945ff] hover:bg-[#3b38d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              {t('faq.callUs')}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}