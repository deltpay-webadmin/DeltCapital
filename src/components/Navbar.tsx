import { useState, useEffect } from 'react';
import { Globe, X } from 'lucide-react';
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

const TICKER_ROWS = [
  { sym: 'DELT', rate: '1.18×', amt: '$120K', ago: 'Restaurant · TX · 23m' },
  { sym: 'DELT', rate: '1.15×', amt: '$240K', ago: 'Logistics · CA · 41m' },
  { sym: 'DELT', rate: '1.19×', amt: '$65K',  ago: 'Beauty · FL · 1h' },
  { sym: 'DELT', rate: '1.14×', amt: '$180K', ago: 'Construction · NY · 1h' },
  { sym: 'DELT', rate: '1.17×', amt: '$95K',  ago: 'Auto · IL · 2h' },
  { sym: 'DELT', rate: '1.16×', amt: '$50K',  ago: 'Retail · WA · 3h' },
  { sym: 'DELT', rate: '1.18×', amt: '$310K', ago: 'Wholesale · NJ · 4h' },
  { sym: 'DELT', rate: '1.15×', amt: '$75K',  ago: 'Services · CO · 5h' },
];

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
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const handleScroll = () => setElevated(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[70]"
      style={{
        fontFamily: 'var(--font-body)',
        background: 'transparent',
      }}
    >
      {/* ── Deal-tape ticker ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: '#0F0E17',
          borderBottom: '1px solid rgba(231, 227, 218, 0.08)',
        }}
      >
        <div
          className="flex items-center gap-10 whitespace-nowrap py-[7px]"
          style={{
            animation: 'delt-ticker 60s linear infinite',
            willChange: 'transform',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            color: '#E7E3DA',
          }}
        >
          {[...TICKER_ROWS, ...TICKER_ROWS, ...TICKER_ROWS].map((r, i) => (
            <span key={i} className="flex items-center gap-3">
              <span style={{ color: '#7C3AED', fontWeight: 600 }}>●</span>
              <span style={{ color: '#F7F5F0' }}>{r.sym}</span>
              <span style={{ color: '#8A8895' }}>·</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>FUNDED {r.amt}</span>
              <span style={{ color: '#8A8895' }}>·</span>
              <span style={{ color: '#C4B5FD', fontVariantNumeric: 'tabular-nums' }}>
                {r.rate}
              </span>
              <span style={{ color: '#6A6876' }}>· {r.ago}</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes delt-ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>

      {/* ── Main chrome ── */}
      <div
        style={{
          background: elevated ? 'rgba(247, 245, 240, 0.92)' : 'rgba(247, 245, 240, 0.78)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${elevated ? '#E7E3DA' : 'transparent'}`,
          transition: 'background 200ms ease, border-color 200ms ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left: wordmark + optional overlay title */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => {
                  if (overlayActive && onOverlayClose) {
                    onOverlayClose();
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center cursor-pointer bg-transparent border-0 p-0"
                aria-label="Delt home"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#0F0E17',
                  lineHeight: 1,
                }}
              >
                Delt<span style={{ color: '#4F46E5' }}>.</span>
              </button>
              {overlayActive && overlayTitle && (
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    style={{ width: 1, height: 18, background: '#E7E3DA' }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#6A6876',
                      fontWeight: 600,
                    }}
                  >
                    {overlayTitle}
                  </span>
                </div>
              )}
            </div>

            {/* Center: nav links (hidden on mobile, hidden during overlays) */}
            {!overlayActive && (
              <div className="hidden md:flex items-center gap-8">
                <NavLink active={false} onClick={onHowItWorksClick}>
                  How it works
                </NavLink>
                <NavLink active={false} onClick={onCalculatorClick}>
                  Calculator
                </NavLink>
                <NavLink active={false} onClick={onAboutClick}>
                  About
                </NavLink>
              </div>
            )}

            {/* Right: CTA + login / close */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {!overlayActive && (
                <>
                  <button
                    onClick={toggleLanguage}
                    className="hidden md:flex items-center gap-1.5 transition-colors"
                    aria-label="Toggle language"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#6A6876',
                      padding: '6px 8px',
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {language.toUpperCase()}
                  </button>

                  <button
                    onClick={() => onLoginClick?.()}
                    className="transition-colors whitespace-nowrap"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: '#0F0E17',
                      background: 'transparent',
                      border: '1px solid #E7E3DA',
                      borderRadius: 6,
                      padding: '7px 14px',
                      cursor: 'pointer',
                    }}
                  >
                    Login
                  </button>
                </>
              )}

              {overlayActive ? (
                <button
                  onClick={onOverlayClose}
                  aria-label="Close"
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: '#0F0E17',
                    background: 'transparent',
                    border: '1px solid #E7E3DA',
                    borderRadius: 6,
                    padding: '7px 12px',
                    cursor: 'pointer',
                  }}
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              ) : (
                <button
                  onClick={onApplyClick}
                  className="whitespace-nowrap transition-transform"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    background: '#0F0E17',
                    border: '1px solid #0F0E17',
                    borderRadius: 6,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(15,14,23,0.05)',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(1px)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  Get funded →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative transition-colors bg-transparent border-0 cursor-pointer"
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13.5,
        fontWeight: 500,
        color: active ? '#0F0E17' : '#2B2A35',
        padding: '6px 2px',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#0F0E17')}
      onMouseLeave={(e) => (e.currentTarget.style.color = active ? '#0F0E17' : '#2B2A35')}
    >
      {children}
      {active && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -2,
            height: 1.5,
            background: '#4F46E5',
          }}
        />
      )}
    </button>
  );
}
