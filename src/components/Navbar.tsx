import { useState, useEffect } from 'react';
import { Globe, User, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoWhiteImg from 'figma:asset/7f25ee6fe5a55b9182a00e3c5b80e1a42079fc74.png';
import logoDarkImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
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

/**
 * Modern Stripe-adjacent header.
 *
 * Editorial flat bar — no glass pill, no gradient halo, no live status
 * theater. Two visual states:
 *   - Over-hero: transparent surface, dark text (the new hero canvas
 *     is light, so dark-on-light reads cleanly)
 *   - Scrolled / overlay-open: warm-white surface with a single
 *     hairline bottom border
 */
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
    const handleScroll = () => setScrolled((window.scrollY || 0) > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Always dark text on light surface in the new design.
  const opaque = scrolled || overlayActive;
  // The new hero is a light canvas, so we use the dark logo regardless.
  const logoSrc = logoDarkImg;

  const navItems = [
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
        className="fixed top-0 left-0 right-0 z-[70] transition-all duration-200"
        style={{
          background: opaque ? 'rgba(246, 249, 252, 0.85)' : 'transparent',
          backdropFilter: opaque ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: opaque ? 'blur(12px)' : 'none',
          borderBottom: opaque
            ? '1px solid #dcdfe4'
            : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between gap-8 py-4">
            {/* ── Left: Logo + nav links ── */}
            <div className="flex items-center gap-10">
              <button
                onClick={handleLogoClick}
                aria-label="Delt — back to top"
                className="flex items-center cursor-pointer"
              >
                <img src={logoSrc} alt="Delt" className="h-7 w-auto object-contain" />
              </button>

              {/* Editorial inline nav (md+) */}
              <div className="hidden md:flex items-center gap-7">
                {navItems.map((item) => {
                  const isActive = overlayTitle === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={item.onClick}
                      className="relative transition-colors duration-150"
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: isActive ? '#0a2540' : '#425466',
                        letterSpacing: '-0.005em',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#0a2540'; }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isActive ? '#0a2540' : '#425466';
                      }}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="navHairline"
                          aria-hidden
                          className="absolute -bottom-[18px] left-0 right-0 h-[2px]"
                          style={{ background: '#0c66e4' }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Right: secondary actions + CTA ── */}
            <div className="flex items-center gap-4">
              {!overlayActive && (
                <button
                  onClick={toggleLanguage}
                  aria-label="Toggle language"
                  className="hidden lg:inline-flex items-center gap-1.5 transition-colors"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#425466',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0a2540'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#425466'; }}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {language.toUpperCase()}
                </button>
              )}

              <button
                onClick={onLoginClick}
                className="hidden sm:inline-flex items-center transition-colors"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#425466',
                  letterSpacing: '-0.005em',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0a2540'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#425466'; }}
              >
                Sign in
              </button>

              {/* Solid CTA — sharp, no halo, no gradient */}
              <button
                onClick={onApplyClick}
                className="inline-flex items-center gap-1.5 text-white whitespace-nowrap transition-all duration-150"
                style={{
                  background: '#0a2540',
                  borderRadius: 8,
                  padding: '9px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '-0.005em',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#0c66e4'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#0a2540'; }}
              >
                Get funded
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden inline-flex items-center justify-center transition-colors"
                style={{
                  width: 36,
                  height: 36,
                  color: '#0a2540',
                }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile slide-down menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[68] md:hidden"
              style={{ background: 'rgba(10,37,64,0.45)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[68px] left-3 right-3 z-[69] md:hidden rounded-xl overflow-hidden"
              style={{
                background: '#ffffff',
                border: '1px solid #dcdfe4',
                boxShadow: '0 24px 60px -16px rgba(10,37,64,0.18)',
              }}
            >
              <div className="p-2">
                {navItems.map((item) => {
                  const isActive = overlayTitle === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={closeMobileAnd(item.onClick)}
                      className="w-full text-left rounded-lg px-4 py-3.5 transition-colors hover:bg-[#f6f9fc]"
                      style={{
                        fontSize: 15,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#0a2540' : '#425466',
                        letterSpacing: '-0.005em',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}

                <div className="my-2 h-px bg-[#dcdfe4]" />

                <button
                  onClick={closeMobileAnd(onLoginClick)}
                  className="w-full text-left rounded-lg px-4 py-3 transition-colors hover:bg-[#f6f9fc] inline-flex items-center gap-2"
                  style={{ fontSize: 14, fontWeight: 500, color: '#425466' }}
                >
                  <User className="w-4 h-4" />
                  Sign in
                </button>

                {!overlayActive && (
                  <button
                    onClick={closeMobileAnd(toggleLanguage)}
                    className="w-full text-left rounded-lg px-4 py-3 transition-colors hover:bg-[#f6f9fc] inline-flex items-center gap-2"
                    style={{ fontSize: 14, fontWeight: 500, color: '#425466' }}
                  >
                    <Globe className="w-4 h-4" />
                    {language === 'en' ? 'English' : 'Español'}
                  </button>
                )}

                <button
                  onClick={closeMobileAnd(onApplyClick)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 text-white rounded-lg py-3.5 transition-colors"
                  style={{
                    background: '#0a2540',
                    fontSize: 15,
                    fontWeight: 600,
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
