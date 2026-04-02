import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface StickyCTAProps {
  onApplyClick: () => void;
}

export function StickyCTA({ onApplyClick }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const footerObserverRef = useRef<IntersectionObserver | null>(null);
  const footerInViewRef = useRef(false);

  useEffect(() => {
    // Observe footer visibility
    const footer = document.querySelector('footer');
    if (footer) {
      footerObserverRef.current = new IntersectionObserver(
        ([entry]) => {
          footerInViewRef.current = entry.isIntersecting;
          // Re-evaluate visibility
          const pastHero = window.scrollY > window.innerHeight;
          setVisible(pastHero && !entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      footerObserverRef.current.observe(footer);
    }

    const handleScroll = () => {
      const pastHero = window.scrollY > window.innerHeight;
      setVisible(pastHero && !footerInViewRef.current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      footerObserverRef.current?.disconnect();
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
          background: '#4945ff',
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
