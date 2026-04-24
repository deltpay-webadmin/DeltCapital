import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface StickyCTAProps {
  onApplyClick: () => void;
}

export function StickyCTA({ onApplyClick }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const hasScrolledPastHero = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const pastHero = window.scrollY > window.innerHeight;
      if (pastHero) hasScrolledPastHero.current = true;
      setVisible(hasScrolledPastHero.current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 40,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <button
        onClick={onApplyClick}
        style={{
          background: '#4F46E5',
          color: '#fff',
          borderRadius: '10px',
          padding: '12px 32px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '15px',
          fontWeight: 600,
        }}
      >
        Apply Now <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
