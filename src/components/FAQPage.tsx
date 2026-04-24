import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
import { Footer } from './Footer';

interface FAQPageProps {
  onClose: () => void;
  onAboutClick?: () => void;
  onHowItWorksClick?: () => void;
  onReviewsClick?: () => void;
  onBlogClick?: () => void;
  onFAQClick?: () => void;
  onSupportClick?: () => void;
  onWinsClick?: () => void;
  onApplyClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
  onResourcesClick?: () => void;
}

export function FAQPage({ onClose, onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick, onFAQClick, onSupportClick, onWinsClick, onApplyClick, onPrivacyClick, onTermsClick, onDisclosuresClick, onResourcesClick }: FAQPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

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

  const renderFaqItem = (faq: { question: string; answer: string }, index: number) => (
    <div key={index} className="border-b border-gray-200 pb-6">
      <button
        onClick={() => toggleFaq(index)}
        className="w-full flex items-start justify-between text-left gap-4 group"
      >
        <span className="text-lg font-semibold text-[#0F0E17] group-hover:text-[#4F46E5] transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: openIndex === index ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Plus
            className={`w-6 h-6 flex-shrink-0 transition-colors ${
              openIndex === index
                ? 'text-[#4F46E5]'
                : 'text-[#4F46E5] group-hover:scale-110'
            }`}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {openIndex === index && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pr-10">
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#F7F5F0] z-50 overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#F7F5F0] border-b border-[#0F0E17]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-0 h-14 w-auto cursor-pointer" onClick={onClose}>
            <img src={logoImg} alt="Delt" className="h-10 w-auto object-contain" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-[#0F0E17] mb-14"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          FAQ
          <span className="text-[#4F46E5]">.</span>
        </motion.h1>

        {/* Two Column FAQ Layout */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
          {/* Left Column */}
          <div className="space-y-8">
            {leftColumnFaqs.map((faq, idx) => renderFaqItem(faq, idx * 2))}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {rightColumnFaqs.map((faq, idx) => renderFaqItem(faq, idx * 2 + 1))}
          </div>
        </div>
      </div>

      <Footer
        onAboutClick={onAboutClick || (() => {})}
        onHowItWorksClick={onHowItWorksClick || (() => {})}
        onReviewsClick={onReviewsClick || (() => {})}
        onBlogClick={onBlogClick || (() => {})}
        onFAQClick={onFAQClick || (() => {})}
        onSupportClick={onSupportClick || (() => {})}
        onWinsClick={onWinsClick || (() => {})}
        onApplyClick={onApplyClick || (() => {})}
        onPrivacyClick={onPrivacyClick}
        onTermsClick={onTermsClick}
        onDisclosuresClick={onDisclosuresClick}
        onResourcesClick={onResourcesClick}
      />
    </div>
  );
}