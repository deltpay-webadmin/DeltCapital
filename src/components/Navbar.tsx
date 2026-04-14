import { useState, useEffect } from 'react';
import { Globe, ChevronDown, Search, ArrowRight } from 'lucide-react';
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
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop((window.scrollY || document.documentElement.scrollTop || 0) < 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Transparent only when at the very top of the page AND no overlay is active
  const transparent = isAtTop && !overlayActive;

  const navStyle: React.CSSProperties = transparent
    ? { background: 'transparent', backdropFilter: 'none', WebkitBackdropFilter: 'none' }
    : { background: 'rgba(4, 30, 66, 0.85)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' };

  const borderClass = transparent ? 'border-transparent' : 'border-white/10';

  const navLinkClass = (active: boolean) =>
    `transition-colors font-medium inline-flex items-center gap-1 ${
      active
        ? 'text-white'
        : transparent
        ? 'text-white/80 hover:text-white'
        : 'text-white/70 hover:text-white'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[70] border-b ${borderClass} transition-all duration-300 overflow-visible`}
      style={navStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4 gap-6">
          {/* Left: logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="flex items-center gap-0 h-14 w-auto cursor-pointer"
              onClick={() => {
                if (overlayActive && onOverlayClose) onOverlayClose();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img src={logoWhiteImg} alt="Delt" className="h-7 w-auto object-contain" />
            </div>
          </div>

          {/* Center: nav cluster */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-7" style={{ fontSize: '0.9375rem' }}>
            <button
              onClick={onHowItWorksClick}
              className={navLinkClass(overlayTitle === 'How It Works')}
            >
              How it works
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={onCalculatorClick}
              className={navLinkClass(overlayTitle === 'Calculator')}
            >
              Calculator
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={onAboutClick}
              className={navLinkClass(overlayTitle === 'About')}
            >
              About
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto md:ml-0">
            <button
              type="button"
              aria-label="Search"
              className="hidden md:inline-flex w-9 h-9 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {!overlayActive && (
              <button
                onClick={toggleLanguage}
                className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/15"
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-white/80" />
                <span className="text-xs font-semibold text-white/90">{language.toUpperCase()}</span>
              </button>
            )}

            <button
              onClick={() => onLoginClick?.()}
              className="hidden sm:inline-flex items-center gap-1 h-9 px-3 text-sm font-semibold text-white/90 hover:text-white transition-colors"
              style={{ fontFamily: "'Open Sauce Sans', 'Codec Pro', sans-serif" }}
            >
              Sign in
              <span className="opacity-70">›</span>
            </button>

            <button
              onClick={onApplyClick}
              className="group inline-flex items-center gap-1.5 text-white font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_28px_-10px_rgba(73,69,255,0.8)]"
              style={{
                background: 'linear-gradient(180deg, #5b57ff 0%, #4945ff 55%, #3e3add 100%)',
                borderRadius: '999px',
                padding: '9px 18px',
                fontSize: '0.875rem',
                fontFamily: "'Open Sauce Sans', 'Codec Pro', sans-serif",
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 24px -10px rgba(73,69,255,0.6)',
              }}
            >
              Get funded
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
