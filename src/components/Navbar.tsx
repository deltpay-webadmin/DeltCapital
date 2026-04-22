import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
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

export function Navbar({ onApplyClick, onCalculatorClick, onAboutClick, onHowItWorksClick, onLoginClick, overlayActive, overlayTitle, onOverlayClose }: NavbarProps) {
  const { language, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled((window.scrollY || 0) > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Over-hero = transparent; scrolled or overlay-open = opaque dark.
  const opaque = scrolled || overlayActive;

  const linkBase = 'relative uppercase tracking-[0.18em] text-[11px] font-semibold transition-colors py-1';
  const linkIdle = 'text-white/70 hover:text-white';
  const linkActive = 'text-white';

  const renderUnderline = (active: boolean) =>
    active ? (
      <span
        aria-hidden
        className="gradient-underline absolute left-1/2 -translate-x-1/2 bottom-[-6px] h-[2px] w-7 rounded-full"
      />
    ) : null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[70] transition-all duration-300 overflow-visible"
      style={{
        background: opaque ? 'rgba(13, 27, 45, 0.85)' : 'transparent',
        backdropFilter: opaque ? 'blur(14px) saturate(140%)' : 'none',
        WebkitBackdropFilter: opaque ? 'blur(14px) saturate(140%)' : 'none',
        borderBottom: opaque ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div
              className="flex items-center h-10 w-auto cursor-pointer"
              onClick={() => {
                if (overlayActive && onOverlayClose) onOverlayClose();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img src={logoWhiteImg} alt="Delt" className="h-6 w-auto object-contain" />
            </div>
          </div>

          {/* Nav Links — uppercase, letter-spaced */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={onHowItWorksClick}
              className={`${linkBase} ${overlayTitle === 'How It Works' ? linkActive : linkIdle}`}
            >
              How It Works
              {renderUnderline(overlayTitle === 'How It Works')}
            </button>
            <button
              onClick={onCalculatorClick}
              className={`${linkBase} ${overlayTitle === 'Calculator' ? linkActive : linkIdle}`}
            >
              Calculator
              {renderUnderline(overlayTitle === 'Calculator')}
            </button>
            <button
              onClick={onAboutClick}
              className={`${linkBase} ${overlayTitle === 'About' ? linkActive : linkIdle}`}
            >
              About
              {renderUnderline(overlayTitle === 'About')}
            </button>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-5 flex-shrink-0 ml-auto">
            {!overlayActive && (
              <button
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                aria-label="Toggle Language"
                style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em' }}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language.toUpperCase()}</span>
              </button>
            )}

            <button
              onClick={onLoginClick}
              className="hidden sm:inline-flex text-white/70 hover:text-white transition-colors uppercase"
              style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em' }}
            >
              Login
            </button>

            <button
              onClick={onApplyClick}
              className="card-hover-lift text-white cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-white hover:text-[#0D1B2D] uppercase"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: '2px',
                padding: '9px 18px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Get Funded
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
