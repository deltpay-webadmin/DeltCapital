import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PreQualificationSection } from './components/PreQualificationSection';
import { UseCapitalSection } from './components/UseCapitalSection';
import { StatsSection } from './components/StatsSection';
import { CapitalCostAnalyzer } from './components/CapitalCostAnalyzerQuiz';
import { ComparisonTable } from './components/ComparisonTable';
import { FAQPage } from './components/FAQPage';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { ApplicationPage } from './components/ApplicationPage';
import { AboutPage } from './components/AboutPageClean';
import { ReviewsPage } from './components/ReviewsPage';
import { BlogPage } from './components/BlogPage';
import { SupportPage } from './components/SupportPage';
import { WinsPage } from './components/WinsPage';
import BookingPage from './components/BookingPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TermsOfUse, PrivacyPolicy, ElectronicCommunicationsAgreement } from './components/legal/LegalPages';
import { LoginPage } from './components/LoginPage';
import { LoanDashboard } from './components/LoanDashboard';
import { ResourcesPage } from './components/ResourcesPage';
import { ScrollProgressBar, ScrollReveal } from './components/ScrollNarrative';
import { TestimonialsSection } from './components/TestimonialsSection';
import { StickyCTA } from './components/StickyCTA';
import { HowItWorksPage } from './components/HowItWorksPage';
import { DeltLearnMorePage } from './components/DeltLearnMorePage';
import { PlaidOnboardingModal } from './components/PlaidOnboardingModal';
import { useViewportScale } from './hooks/useViewportScale';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
import faviconImg from 'figma:asset/c3c469c594c03c3bfc98fd83feeab8caee9ddef8.png';

interface PreQualificationSectionRef {
  scrollToSection: () => void;
  openQuiz: () => void;
}

function AppContent() {
  const [showApplication, setShowApplication] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showWins, setShowWins] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showDeltLearnMore, setShowDeltLearnMore] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [quizData, setQuizData] = useState<any>(null);
  const [calculatorData, setCalculatorData] = useState<any>(() => {
    try {
      const stored = sessionStorage.getItem('delt_calculatorData');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [showPlaidOnboarding, setShowPlaidOnboarding] = useState(false);
  const [_plaidOnboardingData, setPlaidOnboardingData] = useState<any>(null);
  const [_leadCaptureData, setLeadCaptureData] = useState<any>(null);
  const preQualSectionRef = useRef<PreQualificationSectionRef>(null);

  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | 'eca' | null>(null);

  // Viewport-based zoom — sections scale down proportionally on smaller windows
  const viewportZoom = useViewportScale(1440, 0.6, 768);

  // Persist calculatorData to sessionStorage so it survives page refreshes
  useEffect(() => {
    if (calculatorData) {
      try { sessionStorage.setItem('delt_calculatorData', JSON.stringify(calculatorData)); }
      catch { /* quota exceeded or unavailable — ignore */ }
    }
  }, [calculatorData]);

  useEffect(() => {
    // Basic routing for legal pages
    const path = window.location.pathname;
    if (path === '/terms') setLegalPage('terms');
    else if (path === '/privacy') setLegalPage('privacy');
    else if (path === '/electronic-communications') setLegalPage('eca');
  }, []);

  // Set Delt favicon
  useEffect(() => {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconImg;
    document.head.appendChild(link);
  }, []);

  const handleLegalLinkClick = (page: 'terms' | 'privacy' | 'eca') => {
    setLegalPage(page);
  };

  // Close all overlay pages (used before opening a new one for seamless switching)
  const closeAllOverlays = () => {
    setShowApplication(false);
    setShowAbout(false);
    setShowReviews(false);
    setShowBlog(false);
    setShowSupport(false);
    setShowWins(false);
    setShowBooking(false);
    setShowFAQ(false);
    setShowCalculator(false);
    setShowResources(false);
    setShowHowItWorks(false);
    setShowDeltLearnMore(false);
    setShowLogin(false);
    setShowDashboard(false);
    setLegalPage(null);
    // NOTE: we intentionally do NOT clear calculatorData or quizData here
    // so that data collected from the calculator persists across page transitions
  };

  // "Apply now" button - opens Get Funded page with lead capture form
  // Preserves any previously-collected calculator data
  const handleApplyClick = () => {
    closeAllOverlays();
    setShowApplication(true);
  };

  // Called from calculator CTA with calculator field data
  const handleApplyFromCalculator = (data?: any) => {
    const merged = { ...calculatorData, ...data };
    setCalculatorData(merged);
    closeAllOverlays();
    setQuizData(merged);
    setLeadCaptureData(null);
    setShowApplication(true);
  };

  // Called when starting application from quiz results
  const handleApplyFromQuiz = (data?: any) => {
    const merged = { ...calculatorData, ...data };
    closeAllOverlays();
    setQuizData(merged);
    setLeadCaptureData(null);
    setShowApplication(true);
  };

  const handleCloseApplication = () => {
    setShowApplication(false);
    setQuizData(null);
  };

  const handleAboutClick = () => {
    closeAllOverlays();
    setShowAbout(true);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
  };

  const handleHowItWorksClick = () => {
    closeAllOverlays();
    setShowHowItWorks(true);
  };

  const handleDeltLearnMoreClick = () => {
    closeAllOverlays();
    setShowDeltLearnMore(true);
  };

  const handleReviewsClick = () => {
    closeAllOverlays();
    setShowReviews(true);
  };

  const handleCloseReviews = () => {
    setShowReviews(false);
  };

  const handleBlogClick = () => {
    closeAllOverlays();
    setShowBlog(true);
  };

  const handleCloseBlog = () => {
    setShowBlog(false);
  };

  const handleSupportClick = () => {
    closeAllOverlays();
    setShowSupport(true);
  };

  const handleCloseSupport = () => {
    setShowSupport(false);
  };

  const handleWinsClick = () => {
    closeAllOverlays();
    setShowWins(true);
  };

  const handleCloseWins = () => {
    setShowWins(false);
  };

  const handleChatClick = () => {
    // This will trigger the chatbot to open
    const chatbotButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
    if (chatbotButton) {
      chatbotButton.click();
    }
  };

  const handleFAQClick = () => {
    closeAllOverlays();
    setShowFAQ(true);
  };

  const handleTalkToSpecialist = () => {
    closeAllOverlays();
    setShowBooking(true);
  };

  const handleQuizClick = () => {
    // Scroll to PreQualification section and open quiz
    preQualSectionRef.current?.scrollToSection();
    setTimeout(() => {
      preQualSectionRef.current?.openQuiz();
    }, 500);
  };

  const handleCalculatorClick = () => {
    closeAllOverlays();
    setShowCalculator(true);
  };

  const handleCloseCalculator = () => {
    setShowCalculator(false);
  };

  // Lock body scroll when calculator page is open
  useEffect(() => {
    if (showCalculator) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [showCalculator]);

  const handleResourcesClick = () => {
    closeAllOverlays();
    setShowResources(true);
  };

  const handleCloseResources = () => {
    setShowResources(false);
  };

  // (Scroll-linked snap-up for the content wrapper was retired with the
  // fixed-photo hero. The new editorial hero is a normal flow element.)

  const pageTransitionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  };

  // Compute active overlay state for Navbar
  const overlayMap: { active: boolean; title: string; close: () => void } | null =
    showApplication ? { active: true, title: 'Application', close: handleCloseApplication } :
    showAbout ? { active: true, title: 'About', close: handleCloseAbout } :
    showReviews ? { active: true, title: 'Reviews', close: handleCloseReviews } :
    showBlog ? { active: true, title: 'Blog', close: handleCloseBlog } :
    showSupport ? { active: true, title: 'Support', close: handleCloseSupport } :
    showWins ? { active: true, title: 'Success Stories', close: handleCloseWins } :
    showBooking ? { active: true, title: 'Book a Call', close: () => setShowBooking(false) } :
    showFAQ ? { active: true, title: 'FAQ', close: () => setShowFAQ(false) } :
    showCalculator ? { active: true, title: 'Calculator', close: handleCloseCalculator } :
    showResources ? { active: true, title: 'Resources', close: handleCloseResources } :
    showHowItWorks ? { active: true, title: 'How It Works', close: () => setShowHowItWorks(false) } :
    showDeltLearnMore ? { active: true, title: 'Learn More', close: () => setShowDeltLearnMore(false) } :
    showLogin ? { active: true, title: 'Login', close: () => setShowLogin(false) } :
    showDashboard ? { active: true, title: 'Dashboard', close: () => { setShowDashboard(false); setLoggedInEmail(''); } } :
    legalPage === 'terms' ? { active: true, title: 'Terms of Use', close: () => setLegalPage(null) } :
    legalPage === 'privacy' ? { active: true, title: 'Privacy Policy', close: () => setLegalPage(null) } :
    legalPage === 'eca' ? { active: true, title: 'Electronic Communications', close: () => setLegalPage(null) } :
    null;

  return (
    <div className="relative min-h-screen bg-[#fafbfc] transition-colors duration-300">
      {!overlayMap && <ScrollProgressBar />}
      <Navbar
        onApplyClick={handleApplyClick}
        onCalculatorClick={handleCalculatorClick}
        onAboutClick={handleAboutClick}
        onHowItWorksClick={handleHowItWorksClick}
        onLoginClick={() => setShowLogin(true)}
        overlayActive={!!overlayMap}
        overlayTitle={overlayMap?.title}
        onOverlayClose={overlayMap?.close}
      />
      
      <main className="relative">
        <HeroSection onApplyClick={handleApplyClick} onApplyFromQuiz={handleApplyFromQuiz} onCalculatorClick={() => setShowCalculator(true)} />
        <div className="relative bg-[#fafbfc]">
        <div style={{ zoom: viewportZoom } as React.CSSProperties}>
          <section className="py-20 bg-[#fafbfc]">
            <ScrollReveal direction="up" distance={50}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CapitalCostAnalyzer onApplyClick={handleApplyFromCalculator} onDeltLearnMore={handleDeltLearnMoreClick} />
              </div>
            </ScrollReveal>
          </section>
          <ComparisonTable />
          <UseCapitalSection onTalkToSpecialist={handleTalkToSpecialist} />
          <StatsSection />
          <PreQualificationSection ref={preQualSectionRef} onApplyClick={handleApplyClick} onApplyFromQuiz={handleApplyFromQuiz} onCalculatorClick={handleCalculatorClick} />
          <TestimonialsSection />
        </div>
        </div>
      </main>

      <div className="relative">
        <div style={{ zoom: viewportZoom } as React.CSSProperties}>
        <Footer onAboutClick={handleAboutClick} onHowItWorksClick={handleHowItWorksClick} onReviewsClick={handleReviewsClick} onBlogClick={handleBlogClick} onFAQClick={handleFAQClick} onSupportClick={handleSupportClick} onWinsClick={handleWinsClick} onApplyClick={handleApplyClick} onQuizClick={handleQuizClick} onResourcesClick={handleResourcesClick} onPrivacyClick={() => handleLegalLinkClick('privacy')} onTermsClick={() => handleLegalLinkClick('terms')} onDisclosuresClick={() => handleLegalLinkClick('eca')} />
        </div>
      </div>

      <StickyCTA onApplyClick={handleApplyClick} />

      <Chatbot 
        onApplyClick={handleApplyClick}
        onCalculatorClick={handleCalculatorClick}
        onBookingClick={handleTalkToSpecialist}
        onSupportClick={handleSupportClick}
      />

      {/* Application Page - Fully Embedded */}
      <AnimatePresence>
        {showApplication && (
          <motion.div key="application" {...pageTransitionProps}>
            <ApplicationPage
              onClose={handleCloseApplication}
              quizData={quizData}
              calculatorData={calculatorData}
              fromQuiz={!!quizData}
              onLegalLinkClick={handleLegalLinkClick}
              onOpenPlaidOnboarding={() => setShowPlaidOnboarding(true)}
              plaidCompleted={!!quizData?.plaidCompleted}
              onDeltLearnMore={handleDeltLearnMoreClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showAbout && (
          <motion.div key="about" className="fixed inset-0 bg-[#fafbfc] z-50 overflow-y-auto" {...pageTransitionProps}>
            <div className="sticky top-0 z-10 bg-[#fafbfc] border-b border-[#172b4d]/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-0 h-14 w-auto cursor-pointer" onClick={handleCloseAbout}>
                  <img src={logoImg} alt="Delt" className="h-10 w-auto object-contain" />
                </div>
              </div>
            </div>
            <AboutPage onClose={handleCloseAbout} onApplyClick={handleCalculatorClick} onCalculatorClick={handleCalculatorClick} onReviewsClick={handleReviewsClick} onWinsClick={handleWinsClick} />
            <Footer onAboutClick={handleAboutClick} onHowItWorksClick={handleHowItWorksClick} onReviewsClick={handleReviewsClick} onBlogClick={handleBlogClick} onFAQClick={handleFAQClick} onSupportClick={handleSupportClick} onWinsClick={handleWinsClick} onApplyClick={handleApplyClick} onQuizClick={handleQuizClick} onResourcesClick={handleResourcesClick} onPrivacyClick={() => handleLegalLinkClick('privacy')} onTermsClick={() => handleLegalLinkClick('terms')} onDisclosuresClick={() => handleLegalLinkClick('eca')} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviews && (
          <motion.div key="reviews" {...pageTransitionProps}>
            <ReviewsPage onClose={handleCloseReviews} onCalculatorClick={handleCalculatorClick} onAboutClick={handleAboutClick} onHowItWorksClick={handleHowItWorksClick} onReviewsClick={handleReviewsClick} onBlogClick={handleBlogClick} onFAQClick={handleFAQClick} onSupportClick={handleSupportClick} onWinsClick={handleWinsClick} onApplyClick={handleApplyClick} onResourcesClick={handleResourcesClick} onPrivacyClick={() => handleLegalLinkClick('privacy')} onTermsClick={() => handleLegalLinkClick('terms')} onDisclosuresClick={() => handleLegalLinkClick('eca')} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBlog && (
          <motion.div key="blog" {...pageTransitionProps}>
            <BlogPage onClose={handleCloseBlog} onAboutClick={handleAboutClick} onHowItWorksClick={handleHowItWorksClick} onReviewsClick={handleReviewsClick} onBlogClick={handleBlogClick} onFAQClick={handleFAQClick} onSupportClick={handleSupportClick} onWinsClick={handleWinsClick} onApplyClick={handleApplyClick} onResourcesClick={handleResourcesClick} onPrivacyClick={() => handleLegalLinkClick('privacy')} onTermsClick={() => handleLegalLinkClick('terms')} onDisclosuresClick={() => handleLegalLinkClick('eca')} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSupport && (
          <motion.div key="support" {...pageTransitionProps}>
            <SupportPage onClose={handleCloseSupport} onChatClick={handleChatClick} onFAQClick={handleFAQClick} onQuizClick={handleQuizClick} onBookingClick={handleTalkToSpecialist} onAboutClick={handleAboutClick} onHowItWorksClick={handleHowItWorksClick} onReviewsClick={handleReviewsClick} onBlogClick={handleBlogClick} onSupportClick={handleSupportClick} onWinsClick={handleWinsClick} onApplyClick={handleApplyClick} onResourcesClick={handleResourcesClick} onPrivacyClick={() => handleLegalLinkClick('privacy')} onTermsClick={() => handleLegalLinkClick('terms')} onDisclosuresClick={() => handleLegalLinkClick('eca')} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWins && (
          <motion.div key="wins" {...pageTransitionProps}>
            <WinsPage
              onClose={handleCloseWins}
              onAboutClick={handleAboutClick}
              onHowItWorksClick={handleHowItWorksClick}
              onReviewsClick={handleReviewsClick}
              onBlogClick={handleBlogClick}
              onFAQClick={handleFAQClick}
              onSupportClick={handleSupportClick}
              onWinsClick={handleWinsClick}
              onApplyClick={handleApplyClick}
              onQuizClick={handleQuizClick}
              onPrivacyClick={() => handleLegalLinkClick('privacy')}
              onTermsClick={() => handleLegalLinkClick('terms')}
              onDisclosuresClick={() => handleLegalLinkClick('eca')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBooking && (
          <motion.div key="booking" {...pageTransitionProps}>
            <BookingPage onClose={() => setShowBooking(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* How It Works Page */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div key="how-it-works" {...pageTransitionProps}>
            <HowItWorksPage onClose={() => setShowHowItWorks(false)} onApplyClick={handleApplyClick} onCalculatorClick={handleCalculatorClick} onAboutClick={handleAboutClick} onHowItWorksClick={handleHowItWorksClick} onReviewsClick={handleReviewsClick} onBlogClick={handleBlogClick} onFAQClick={handleFAQClick} onSupportClick={handleSupportClick} onWinsClick={handleWinsClick} onResourcesClick={handleResourcesClick} onPrivacyClick={() => handleLegalLinkClick('privacy')} onTermsClick={() => handleLegalLinkClick('terms')} onDisclosuresClick={() => handleLegalLinkClick('eca')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Page */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div key="faq" {...pageTransitionProps}>
            <FAQPage onClose={() => setShowFAQ(false)} onAboutClick={handleAboutClick} onHowItWorksClick={handleHowItWorksClick} onReviewsClick={handleReviewsClick} onBlogClick={handleBlogClick} onFAQClick={handleFAQClick} onSupportClick={handleSupportClick} onWinsClick={handleWinsClick} onApplyClick={handleApplyClick} onResourcesClick={handleResourcesClick} onPrivacyClick={() => handleLegalLinkClick('privacy')} onTermsClick={() => handleLegalLinkClick('terms')} onDisclosuresClick={() => handleLegalLinkClick('eca')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calculator Page */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div key="calculator" className="fixed inset-0 bg-[#fafbfc] z-50 flex flex-col" {...pageTransitionProps}>
            {/* Spacer for navbar */}
            <div className="flex-shrink-0 h-[73px]" />
            {/* Scrollable content below navbar */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
              <div className="max-w-6xl mx-auto px-4 py-10 w-full">
                <CapitalCostAnalyzer onApplyClick={handleApplyFromCalculator} onDeltLearnMore={handleDeltLearnMoreClick} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delt Learn More Page */}
      <AnimatePresence>
        {showDeltLearnMore && (
          <motion.div key="delt-learn-more" className="fixed inset-0 bg-[#fafbfc] z-50 overflow-y-auto" {...pageTransitionProps}>
            <div className="flex-shrink-0 h-[73px]" />
            <DeltLearnMorePage onApplyClick={handleApplyClick} calculatorData={calculatorData} onAboutClick={handleAboutClick} onHowItWorksClick={handleHowItWorksClick} onReviewsClick={handleReviewsClick} onBlogClick={handleBlogClick} onFAQClick={handleFAQClick} onSupportClick={handleSupportClick} onWinsClick={handleWinsClick} onResourcesClick={handleResourcesClick} onPrivacyClick={() => handleLegalLinkClick('privacy')} onTermsClick={() => handleLegalLinkClick('terms')} onDisclosuresClick={() => handleLegalLinkClick('eca')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Page */}
      <AnimatePresence>
        {showLogin && (
          <motion.div key="login" {...pageTransitionProps}>
            <LoginPage
              onClose={() => setShowLogin(false)}
              onSignIn={(email) => {
                setLoggedInEmail(email);
                setShowLogin(false);
                setShowDashboard(true);
              }}
              onLegalLink={(page) => {
                handleLegalLinkClick(page);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loan Dashboard */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div key="dashboard" {...pageTransitionProps}>
            <LoanDashboard
              userEmail={loggedInEmail}
              onLogout={() => {
                setShowDashboard(false);
                setLoggedInEmail('');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Pages Overlay */}
      <AnimatePresence>
        {legalPage && (
          <motion.div key={legalPage} className="fixed inset-0 bg-[#fafbfc] z-[60] overflow-y-auto" {...pageTransitionProps}>
            {legalPage === 'terms' && <TermsOfUse onClose={() => setLegalPage(null)} />}
            {legalPage === 'privacy' && <PrivacyPolicy onClose={() => setLegalPage(null)} />}
            {legalPage === 'eca' && <ElectronicCommunicationsAgreement onClose={() => setLegalPage(null)} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resources Page */}
      <AnimatePresence>
        {showResources && (
          <motion.div key="resources" {...pageTransitionProps}>
            <ResourcesPage
              onClose={handleCloseResources}
              onFAQClick={handleFAQClick}
              onSupportClick={handleSupportClick}
              onCalculatorClick={handleCalculatorClick}
              onBlogClick={handleBlogClick}
              onApplyClick={handleApplyClick}
              onAboutClick={handleAboutClick}
              onHowItWorksClick={handleHowItWorksClick}
              onReviewsClick={handleReviewsClick}
              onWinsClick={handleWinsClick}
              onResourcesClick={handleResourcesClick}
              onPrivacyClick={() => handleLegalLinkClick('privacy')}
              onTermsClick={() => handleLegalLinkClick('terms')}
              onDisclosuresClick={() => handleLegalLinkClick('eca')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plaid Onboarding Modal — bank connection flow */}
      <PlaidOnboardingModal
        open={showPlaidOnboarding}
        onClose={() => setShowPlaidOnboarding(false)}
        onComplete={(data) => {
          setPlaidOnboardingData(data);
          setShowPlaidOnboarding(false);
          // Merge Plaid data into quizData so ApplicationPage can pick it up
          const merged = {
            ...calculatorData,
            ...quizData,
            bankConnected: data.bankConnected,
            selectedAccounts: data.selectedAccounts,
            ssnLast4: data.ssnLast4,
            plaidCompleted: true,
          };
          setQuizData(merged);
          setCalculatorData(merged);
          // ApplicationPage stays open — it transitions from lead form to the full application
          if (!showApplication) {
            setShowApplication(true);
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
}