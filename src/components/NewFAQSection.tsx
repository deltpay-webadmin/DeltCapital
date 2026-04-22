import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { ScrollReveal } from './ScrollNarrative';

export function NewFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });

  // Manual scroll-linked parallax for the period dot (avoids Motion useScroll iframe issues)
  const [dotScaleVal, setDotScaleVal] = useState(0);
  const [dotOpacityVal, setDotOpacityVal] = useState(0);

  const handleScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0 = element top at viewport bottom, 1 = element center at viewport center
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height / 2)));
    // dotScale: [0, 0.5, 1] → [0, 1.4, 1]
    if (progress <= 0.5) {
      setDotScaleVal((progress / 0.5) * 1.4);
    } else {
      setDotScaleVal(1.4 - 0.4 * ((progress - 0.5) / 0.5));
    }
    // dotOpacity: [0, 0.3, 0.5] → [0, 0.5, 1]
    if (progress <= 0.3) {
      setDotOpacityVal((progress / 0.3) * 0.5);
    } else if (progress <= 0.5) {
      setDotOpacityVal(0.5 + 0.5 * ((progress - 0.3) / 0.2));
    } else {
      setDotOpacityVal(1);
    }
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

  const leftColumnFaqs = faqs.filter((_, index) => index % 2 === 0);
  const rightColumnFaqs = faqs.filter((_, index) => index % 2 === 1);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderFaqItem = (faq: { question: string; answer: string }, index: number, staggerIdx: number) => (
    <ScrollReveal
      key={index}
      direction="up"
      delay={staggerIdx * 0.08}
      distance={30}
      threshold={0.1}
    >
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <button
          onClick={() => toggleFaq(index)}
          className="w-full flex items-start justify-between text-left gap-4 group"
        >
          <span className="text-lg font-semibold text-[#172b4d] dark:text-white group-hover:text-[#0c66e4] dark:group-hover:text-[#0c66e4] transition-colors">
            {faq.question}
          </span>
          <motion.div
            animate={{ rotate: openIndex === index ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Plus 
              className={`w-6 h-6 flex-shrink-0 transition-colors ${
                openIndex === index 
                  ? 'text-[#0c66e4]' 
                  : 'text-[#0c66e4] group-hover:scale-110'
              }`}
            />
          </motion.div>
        </button>
        <motion.div
          initial={false}
          animate={{
            height: openIndex === index ? 'auto' : 0,
            opacity: openIndex === index ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <div className="mt-4 pr-10">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </motion.div>
      </div>
    </ScrollReveal>
  );

  return (
    <section id="new-faq-section" ref={sectionRef} className="relative py-20 bg-white dark:bg-[#0D1B2A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title with animated dot */}
        <div ref={titleRef} className="mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-[#172b4d] dark:text-white"
            initial={{ opacity: 0, x: -60 }}
            animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            FAQ
            <motion.span
              className="text-[#0c66e4] inline-block"
              style={{ scale: dotScaleVal, opacity: dotOpacityVal }}
            >
              .
            </motion.span>
          </motion.h2>
        </div>

        {/* Two Column FAQ Layout — each item staggers */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
          {/* Left Column */}
          <div className="space-y-8">
            {leftColumnFaqs.map((faq, idx) => renderFaqItem(faq, idx * 2, idx))}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {rightColumnFaqs.map((faq, idx) => renderFaqItem(faq, idx * 2 + 1, idx))}
          </div>
        </div>
      </div>
    </section>
  );
}