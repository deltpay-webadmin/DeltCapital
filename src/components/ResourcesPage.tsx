import { X, BookOpen, HelpCircle, LifeBuoy, Calculator, FileText, TrendingUp, ArrowRight, Phone, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
import { Button } from './ui/button';
import { Footer } from './Footer';

interface ResourcesPageProps {
  onClose: () => void;
  onFAQClick: () => void;
  onSupportClick: () => void;
  onCalculatorClick: () => void;
  onBlogClick: () => void;
  onApplyClick: () => void;
  onAboutClick?: () => void;
  onHowItWorksClick?: () => void;
  onReviewsClick?: () => void;
  onWinsClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
  onResourcesClick?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function ResourcesPage({ onClose, onFAQClick, onSupportClick, onCalculatorClick, onBlogClick, onApplyClick, onAboutClick, onHowItWorksClick, onReviewsClick, onWinsClick, onPrivacyClick, onTermsClick, onDisclosuresClick, onResourcesClick }: ResourcesPageProps) {

  const categories = [
    {
      icon: BookOpen,
      title: 'Guides',
      description: 'Step-by-step walkthroughs to help you understand revenue-based financing and make informed decisions.',
      action: onBlogClick,
      actionLabel: 'Browse Guides',
    },
    {
      icon: HelpCircle,
      title: 'FAQs',
      description: 'Quick answers to the most common questions about our products, application process, and repayment.',
      action: onFAQClick,
      actionLabel: 'View FAQs',
    },
    {
      icon: LifeBuoy,
      title: 'Help Center',
      description: 'Get personalized assistance from our support team via chat, phone, or email.',
      action: onSupportClick,
      actionLabel: 'Get Help',
    },
  ];

  const guides = [
    {
      icon: DollarSign,
      title: 'Understanding Revenue-Based Financing',
      description: 'Learn how RBF works, how it compares to traditional loans, and whether it\'s the right fit for your business.',
      tag: 'Fundamentals',
    },
    {
      icon: Calculator,
      title: 'How to Calculate Your True Cost of Capital',
      description: 'Use our interactive tools to compare factor rates, APRs, and total repayment across different financing options.',
      tag: 'Tools',
      action: onCalculatorClick,
    },
    {
      icon: FileText,
      title: 'Preparing Your Application',
      description: 'Everything you need to gather before applying — from bank statements to business documentation.',
      tag: 'Getting Started',
    },
    {
      icon: Clock,
      title: 'What to Expect After Funding',
      description: 'A clear walkthrough of the repayment process, payment schedules, and how to manage your advance.',
      tag: 'Post-Funding',
    },
    {
      icon: TrendingUp,
      title: 'Growth Strategies with Working Capital',
      description: 'Real tactics for deploying capital effectively — inventory, marketing, hiring, and equipment.',
      tag: 'Strategy',
    },
    {
      icon: ShieldCheck,
      title: 'Responsible Borrowing & Transparency',
      description: 'How Delt ensures fair pricing, clear terms, and full disclosure so you can borrow with confidence.',
      tag: 'Trust & Safety',
    },
  ];

  return (
    <div className="fixed inset-0 bg-[#fafbfc] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#fafbfc] border-b border-[#172b4d]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center h-14 w-auto cursor-pointer" onClick={onClose}>
            <img src={logoImg} alt="Delt" className="h-8 w-auto object-contain" />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl text-[#172b4d] mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <em className="text-[#0c66e4] not-italic" style={{ fontStyle: 'italic' }}>Resources</em> for every stage{'\n'}
            <br className="hidden sm:block" />
            of your Delt journey.
          </motion.h1>
          <motion.p
            className="text-lg text-[#172b4d]/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Read through guides and FAQs to get quick answers to your questions.
          </motion.p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="bg-[#172b4d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.h2
            className="text-3xl md:text-4xl text-white mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
          >
            All your Delt product<br />resources
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                className="bg-white rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer group shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-[#0c66e4]/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={i + 1}
                onClick={() => { cat.action(); onClose(); }}
              >
                <div className="w-16 h-16 rounded-full bg-[#0c66e4]/10 flex items-center justify-center mb-5 group-hover:bg-[#0c66e4]/15 transition-colors">
                  <cat.icon className="w-8 h-8 text-[#0c66e4]" />
                </div>
                <h3 className="text-xl text-[#172b4d] mb-2">{cat.title}</h3>
                <p className="text-sm text-[#172b4d]/60 mb-5 flex-1">{cat.description}</p>
                <span className="text-[#0c66e4] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  {cat.actionLabel} <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.h2
            className="text-3xl md:text-4xl text-[#172b4d] mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
          >
            Featured Guides
          </motion.h2>
          <motion.p
            className="text-[#172b4d]/60 mb-12 max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0.5}
          >
            In-depth resources to help you get the most from your financing.
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, i) => (
              <motion.div
                key={guide.title}
                className="border border-gray-200 rounded-2xl p-7 hover:border-[#0c66e4]/30 hover:shadow-md transition-all cursor-pointer group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i + 1}
                onClick={() => {
                  if (guide.action) { guide.action(); onClose(); }
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0c66e4]/8 flex items-center justify-center">
                    <guide.icon className="w-5 h-5 text-[#0c66e4]" />
                  </div>
                  <span className="text-xs tracking-wide text-[#0c66e4] bg-[#0c66e4]/8 px-2.5 py-1 rounded-full">
                    {guide.tag}
                  </span>
                </div>
                <h3 className="text-[#172b4d] mb-2">{guide.title}</h3>
                <p className="text-sm text-[#172b4d]/60 leading-relaxed">{guide.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#fafbfc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#172b4d] mb-8"
            style={{ fontWeight: 700 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
          >
            Still have questions?
          </motion.h2>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-600 mb-10 max-w-lg mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0.5}
          >
            Our team is here to help. Reach out anytime or give us a call.
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={1}
          >
            <button
              onClick={() => { onSupportClick(); onClose(); }}
              className="bg-[#0c66e4] hover:bg-[#0055cc] text-white px-6 py-3 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl"
            >
              Contact Support
            </button>
          </motion.div>

          {/* Secondary Options */}
          <motion.div
            className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={1.5}
          >
            <a
              href="tel:+18647293358"
              className="bg-[#f1f2f4] border border-[#0c66e4]/20 text-[#0c66e4] px-6 py-4 rounded-xl font-semibold hover:bg-[#0c66e4] hover:text-white transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              (864) 729-3358
            </a>
            <button
              onClick={() => { onCalculatorClick(); onClose(); }}
              className="bg-[#f1f2f4] border border-[#0c66e4]/20 text-[#0c66e4] px-6 py-4 rounded-xl font-semibold hover:bg-[#0c66e4] hover:text-white transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculator
            </button>
          </motion.div>
        </div>
      </div>
      <Footer
        onAboutClick={onAboutClick || (() => {})}
        onHowItWorksClick={onHowItWorksClick || (() => {})}
        onReviewsClick={onReviewsClick || (() => {})}
        onBlogClick={onBlogClick}
        onFAQClick={onFAQClick}
        onSupportClick={onSupportClick}
        onWinsClick={onWinsClick || (() => {})}
        onApplyClick={onApplyClick}
        onPrivacyClick={onPrivacyClick}
        onTermsClick={onTermsClick}
        onDisclosuresClick={onDisclosuresClick}
        onResourcesClick={onResourcesClick}
      />
    </div>
  );
}