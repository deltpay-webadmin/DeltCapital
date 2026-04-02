import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Globe, X, ArrowLeft } from 'lucide-react';
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
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[70] border-b border-white/10 transition-colors duration-300 overflow-visible" style={{ background: '#041E42', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-0 h-14 w-auto cursor-pointer" onClick={() => {
              if (overlayActive && onOverlayClose) {
                onOverlayClose();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}>
              <img src={logoWhiteImg} alt="Delt" className="h-7 w-auto object-contain" />
            </div>
            {overlayActive && overlayTitle && (
              <div className="flex items-center gap-2">
                <div className="w-px h-6 bg-white/20" />
              </div>
            )}
          </div>

          {/* Nav Links - Hidden on mobile, always visible */}
            <div className="hidden md:flex items-center gap-6 ml-8">
              <button
                onClick={onHowItWorksClick}
                className={`transition-colors font-medium ${overlayTitle === 'How It Works' ? 'text-white border-b-2 border-[#4945ff] pb-0.5' : 'text-white/70 hover:text-white'}`}
                style={{ fontSize: '0.9375rem' }}
              >
                How It Works
              </button>
              <button
                onClick={onCalculatorClick}
                className={`transition-colors font-medium ${overlayTitle === 'Calculator' ? 'text-white border-b-2 border-[#4945ff] pb-0.5' : 'text-white/70 hover:text-white'}`}
                style={{ fontSize: '0.9375rem' }}
              >
                Calculator
              </button>
              <button
                onClick={onAboutClick}
                className={`transition-colors font-medium ${overlayTitle === 'About' ? 'text-white border-b-2 border-[#4945ff] pb-0.5' : 'text-white/70 hover:text-white'}`}
                style={{ fontSize: '0.9375rem' }}
              >
                About
              </button>
            </div>

          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
            {/* Language Toggle - Hidden on mobile */}
            {!overlayActive && (
              <button
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                aria-label="Toggle Language"
              >
                <Globe className="w-4 h-4 text-white/80" />
                <span className="text-sm font-semibold text-white/90">
                  {language.toUpperCase()}
                </span>
              </button>
            )}

            <button 
              onClick={onApplyClick}
              className="text-white font-semibold whitespace-nowrap cursor-pointer flex-shrink-0 transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
              style={{
                background: '#4945ff',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '0.875rem',
                fontFamily: "'Open Sauce Sans', 'Codec Pro', sans-serif",
              }}
            >
              Get Funded
            </button>

            <button 
              className={`login-button ${isScrolling ? 'scrolling' : ''} bg-transparent px-4 py-2 rounded-lg outline-none cursor-pointer flex-shrink-0 relative whitespace-nowrap`}
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: "'Open Sauce Sans', 'Codec Pro', sans-serif",
              }}
              onClick={() => onLoginClick?.()}
            >
              Login
            </button>
            <style>{`
              .login-button {
                color: #ffffff;
              }
              
              .login-button:hover,
              .login-button.scrolling {
                background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 15%, #4945ff 30%, #60A5FA 45%, #4F46E5 60%, #8B5CF6 75%, #4945ff 90%, #60A5FA 100%);
                background-size: 300% 100%;
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                animation: gradientWave 5s linear infinite;
              }
            `}</style>
          </div>
        </div>
      </div>
    </nav>
  );
}