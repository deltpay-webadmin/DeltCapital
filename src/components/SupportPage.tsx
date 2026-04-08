import { X, MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, CreditCard, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
import { Footer } from './Footer';

interface SupportPageProps {
  onClose: () => void;
  onChatClick: () => void;
  onFAQClick: () => void;
  onQuizClick?: () => void;
  onBookingClick?: () => void;
  onAboutClick?: () => void;
  onHowItWorksClick?: () => void;
  onReviewsClick?: () => void;
  onBlogClick?: () => void;
  onSupportClick?: () => void;
  onWinsClick?: () => void;
  onApplyClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
  onResourcesClick?: () => void;
}

export function SupportPage({ onClose, onChatClick, onFAQClick, onQuizClick, onBookingClick, onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick, onSupportClick, onWinsClick, onApplyClick, onPrivacyClick, onTermsClick, onDisclosuresClick, onResourcesClick }: SupportPageProps) {
  const handleCallClick = () => {
    window.location.href = 'tel:+18647293358';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@deltcapital.com';
  };

  const handleChatSupport = () => {
    onChatClick();
    onClose();
  };

  const handleFAQNavigate = () => {
    onFAQClick();
    onClose();
  };

  const handleQuizNavigate = () => {
    if (onQuizClick) {
      onQuizClick();
    }
    onClose();
  };

  const handleBookingNavigate = () => {
    if (onBookingClick) {
      onBookingClick();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#ededf6] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#ededf6] border-b border-[#041E42]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-0 h-14 w-auto cursor-pointer" onClick={onClose}>
            <img src={logoImg} alt="Delt Capital" className="h-10 w-auto object-contain" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl text-[#041E42] mb-6">
              We're here to <span className="text-[#4945ff]">help</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with our dedicated support team. We're available to answer your questions and help you get the funding you need.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Chat Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleChatSupport}
            className="bg-white dark:bg-[#0F2744] rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-[#4945ff]/30 group"
          >
            <div className="w-12 h-12 bg-[#4945ff]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4945ff]/15 transition-colors">
              <MessageCircle className="w-6 h-6 text-[#4945ff]" />
            </div>
            <h3 className="text-lg text-[#041E42] dark:text-white mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Chat with our support team in real-time. Get instant answers to your questions.
            </p>
            <div className="flex items-center text-[#4945ff] text-sm group-hover:gap-2 transition-all">
              <span className="font-semibold">Start Chat</span>
              <span className="ml-1">→</span>
            </div>
          </motion.div>

          {/* Call Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleCallClick}
            className="bg-white dark:bg-[#0F2744] rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-[#4945ff]/30 group"
          >
            <div className="w-12 h-12 bg-[#4945ff]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4945ff]/15 transition-colors">
              <Phone className="w-6 h-6 text-[#4945ff]" />
            </div>
            <h3 className="text-lg text-[#041E42] dark:text-white mb-2">Call Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Speak directly with a funding specialist. We're here to guide you through the process.
            </p>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-bold text-[#4945ff]">(864) 729-3358</div>
              <div className="flex items-center text-[#4945ff] text-sm group-hover:gap-2 transition-all">
                <span className="font-semibold">Call Now</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </motion.div>

          {/* Email Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleEmailClick}
            className="bg-white dark:bg-[#0F2744] rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-[#4945ff]/30 group"
          >
            <div className="w-12 h-12 bg-[#4945ff]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4945ff]/15 transition-colors">
              <Mail className="w-6 h-6 text-[#4945ff]" />
            </div>
            <h3 className="text-lg text-[#041E42] dark:text-white mb-2">Email Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Send us a detailed message and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col gap-2">
              <div className="text-base font-semibold text-[#4945ff]">info@deltcapital.com</div>
              <div className="flex items-center text-[#4945ff] text-sm group-hover:gap-2 transition-all">
                <span className="font-semibold">Send Email</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-white/5 rounded-xl p-5 mb-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-[#4945ff]" />
            <h3 className="text-lg text-[#041E42] dark:text-white">Support Hours</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold">Monday - Friday:</span>
                <span>8:00 AM - 8:00 PM EST</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold">Saturday:</span>
                <span>9:00 AM - 5:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#0F2744] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm text-[#041E42] dark:text-white">We're Online Now</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Average response time: Under 2 minutes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        {/* Common Questions section removed */}

        {/* Choose Your Funding Specialist CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 rounded-2xl overflow-hidden"
        >
          <button
            onClick={handleBookingNavigate}
            className="w-full group relative bg-gradient-to-r from-[#041E42] to-[#4945ff] rounded-2xl p-10 md:p-14 text-left transition-all hover:shadow-2xl hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl text-white mb-2">Choose Your Funding Specialist</h3>
                  <p className="text-white/80 text-base md:text-lg max-w-xl">
                    Book a personalized consultation with one of our dedicated specialists to find the best funding solution for your business.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white text-[#4945ff] px-8 py-4 rounded-xl font-semibold text-lg flex-shrink-0 group-hover:bg-white/95 transition-colors">
                Book Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </motion.div>
      </div>
      <Footer
        onAboutClick={onAboutClick || (() => {})}
        onHowItWorksClick={onHowItWorksClick || (() => {})}
        onReviewsClick={onReviewsClick || (() => {})}
        onBlogClick={onBlogClick || (() => {})}
        onFAQClick={onFAQClick}
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