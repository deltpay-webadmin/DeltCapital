import { useState, useEffect } from 'react';
import { Globe, User, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoWhiteImg from 'figma:asset/7f25ee6fe5a55b9182a00e3c5b80e1a42079fc74.png';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onApplyClick: () => void;
  onCalculatorClick?: () => void;
  onAboutClick?: () => void;
  onHowItWorksClick?: () => void;
  onLoginClick?: () => void;
  /** When an overlay is active, show a close button and overlay title */
  overlayActive?: boolean;
  overlayTitle?: string;
  onOverlayClose?: () => void;
}

export function Navbar({
  onApplyClick,
  onCalculatorClick,
  onAboutClick,
  onHowItWorksClick,
  onLoginClick,
  overlayActive,
  overlayTitle,
  onOverlayClose,
}: NavbarProps) {
  const { language, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled((window.scrollY || 0) > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Over-hero = transparent; scrolled or overlay-open = glass-dark.
  const opaque = scrolled || overlayActive;

  const navItems: { label: string; key: string; onClick?: () => void }[] = [
    { label: 'How it works', key: 'How It Works', onClick: onHowItWorksClick },
    { label: 'Calculator',   key: 'Calculator',   onClick: onCalculatorClick },
    { label: 'About',        key: 'About',        onClick: onAboutClick },
  ];

  const handleLogoClick = () => {
    if (overlayActive && onOverlayClose) onOverlayClose();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeMobileAnd = (fn?: () => void) => () => {
    setMobileOpen(false);
    fn?.();
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[70] transition-all duration-300 overflow-visible"
        style={{
          background: opaque ? 'rgba(13, 27, 45, 0.78)' : 'transparent',
          backdropFilter: opaque ? 'blur(18px) saturate(160%)' : 'none',
          WebkitBackdropFilter: opaque ? 'blur(18px) saturate(160%)' : 'none',
        }}
      >
        {/* Bottom gradient hairline — appears when scrolled */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none transition-opacity duration-300"
          style={{
            opacity: opaque ? 1 : 0,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(12,102,228,0.45) 35%, rgba(110,93,198,0.55) 65%, transparent 100%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3.5 gap-4">
            {/* ── LEFT — Logo ── */}
            <button
              onClick={handleLogoClick}
              aria-label="Delt — back to top"
              className="flex items-center gap-2 flex-shrink-0 group cursor-pointer"
            >
              <img src={logoWhiteImg} alt="Delt" className="h-6 w-auto object-contain" />
              {/* Tiny gradient dot accent */}
              <span
                aria-hidden
                className="hidden sm:block w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #1d7afc 0%, #6e5dc6 100%)',
                  boxShadow: '0 0 10px rgba(110,93,198,0.6)',
                }}
              />
            </button>

            {/* ── CENTER — Glass pill nav (desktop only) ── */}
            <div
              className="hidden md:flex items-center rounded-full border backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(255,255,255,0.12)',
                padding: 4,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {navItems.map((item) => {
                const isActive = overlayTitle === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={item.onClick}
                    className={`relative px-4 py-2 rounded-full transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                    style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em' }}
                  >
                    {/* Active-state gradient chip behind the text */}
                    {isActive && (
                      <motion.span
                        layoutId="navActivePill"
                        aria-hidden
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(12,102,228,0.55) 0%, rgba(110,93,198,0.55) 100%)',
                          boxShadow:
                            '0 6px 16px -6px rgba(12,102,228,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── RIGHT — Action cluster ── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Language chip */}
              {!overlayActive && (
                <button
                  onClick={toggleLanguage}
                  aria-label="Toggle language"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md text-white/80 hover:text-white hover:bg-white/[0.10] transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderColor: 'rgba(255,255,255,0.12)',
                    padding: '7px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{language.toUpperCase()}</span>
                </button>
              )}

              {/* Login chip */}
              <button
                onClick={onLoginClick}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md text-white/80 hover:text-white hover:bg-white/[0.10] transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.12)',
                  padding: '7px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '-0.005em',
                }}
              >
                <User className="w-3.5 h-3.5" />
                Log in
              </button>

              {/* Get Funded — gradient CTA */}
              <button
                onClick={onApplyClick}
                className="card-hover-lift inline-flex items-center gap-1.5 text-white whitespace-nowrap transition-shadow"
                style={{
                  background: 'linear-gradient(95deg, #0c66e4 0%, #1d7afc 50%, #6e5dc6 100%)',
                  borderRadius: 999,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '-0.005em',
                  boxShadow:
                    '0 10px 24px -10px rgba(12,102,228,0.65), inset 0 1px 0 rgba(255,255,255,0.20)',
                }}
              >
                Get funded
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden inline-flex items-center justify-center rounded-full border backdrop-blur-md text-white/85 hover:text-white hover:bg-white/[0.10] transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.12)',
                  width: 36,
                  height: 36,
                }}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile slide-down menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[68] md:hidden"
              style={{ background: 'rgba(13,27,45,0.55)', backdropFilter: 'blur(8px)' }}
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[68px] left-3 right-3 z-[69] md:hidden rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(13,27,45,0.92)',
                backdropFilter: 'blur(20px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 24px 60px -16px rgba(0,0,0,0.6)',
              }}
            >
              <div className="p-3">
                {navItems.map((item) => {
                  const isActive = overlayTitle === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={closeMobileAnd(item.onClick)}
                      className={`w-full text-left rounded-xl px-4 py-3.5 transition-colors ${
                        isActive
                          ? 'bg-white/[0.10] text-white'
                          : 'text-white/85 hover:bg-white/[0.06]'
                      }`}
                      style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}
                    >
                      {item.label}
                    </button>
                  );
                })}

                <div className="my-2 h-px bg-white/10" />

                <button
                  onClick={closeMobileAnd(onLoginClick)}
                  className="w-full text-left rounded-xl px-4 py-3 text-white/80 hover:bg-white/[0.06] transition-colors inline-flex items-center gap-2"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  <User className="w-4 h-4" />
                  Log in
                </button>

                {!overlayActive && (
                  <button
                    onClick={closeMobileAnd(toggleLanguage)}
                    className="w-full text-left rounded-xl px-4 py-3 text-white/80 hover:bg-white/[0.06] transition-colors inline-flex items-center gap-2"
                    style={{ fontSize: 14, fontWeight: 600 }}
                  >
                    <Globe className="w-4 h-4" />
                    {language === 'en' ? 'English' : 'Español'}
                  </button>
                )}

                <button
                  onClick={closeMobileAnd(onApplyClick)}
                  className="card-hover-lift w-full mt-2 inline-flex items-center justify-center gap-2 text-white rounded-xl py-3.5 transition-shadow"
                  style={{
                    background: 'linear-gradient(95deg, #0c66e4 0%, #1d7afc 50%, #6e5dc6 100%)',
                    boxShadow:
                      '0 12px 28px -10px rgba(12,102,228,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Get funded
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
