import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useInView } from 'motion/react';

/* ════════════════════════════════════════════════════════════
   1. SCROLL PROGRESS INDICATOR — thin bar at top of viewport
   ════════════════════════════════════════════════════════════ */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
      style={{
        scaleX: progress,
        background: 'linear-gradient(90deg, #1B17FF 0%, #7B77FF 50%, #1B17FF 100%)',
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   2. SCROLL REVEAL — fade-up / fade-left / scale on enter
   ════════════════════════════════════════════════════════════ */
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const directionMap = (dir: RevealDirection, distance: number) => {
  switch (dir) {
    case 'up': return { y: distance, x: 0, scale: 1 };
    case 'down': return { y: -distance, x: 0, scale: 1 };
    case 'left': return { y: 0, x: distance, scale: 1 };
    case 'right': return { y: 0, x: -distance, scale: 1 };
    case 'scale': return { y: 0, x: 0, scale: 0.85 };
    case 'none': return { y: 0, x: 0, scale: 1 };
  }
};

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 60,
  className = '',
  once = true,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const from = directionMap(direction, distance);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: from.y, x: from.x, scale: from.scale }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : { opacity: 0, y: from.y, x: from.x, scale: from.scale }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   3. STAGGERED CHILDREN — each child animates in sequence
   ════════════════════════════════════════════════════════════ */
interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  direction?: RevealDirection;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  distance = 40,
  className = '',
  once = true,
  threshold = 0.1,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const from = directionMap(direction, distance);

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: from.y, x: from.x, scale: from.scale }}
          animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : { opacity: 0, y: from.y, x: from.x, scale: from.scale }}
          transition={{
            duration: 0.6,
            delay: i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   4. TEXT REVEAL — word-by-word or line-by-line scroll-linked
   ════════════════════════════════════════════════════════════ */
interface TextRevealProps {
  text: string;
  className?: string;
  mode?: 'word' | 'character';
  once?: boolean;
  staggerDelay?: number;
}

export function TextReveal({
  text,
  className = '',
  mode = 'word',
  once = true,
  staggerDelay = 0.04,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const tokens = useMemo(() => {
    if (mode === 'word') return text.split(' ');
    return text.split('');
  }, [text, mode]);

  return (
    <span ref={ref} className={`inline ${className}`}>
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 20, filter: 'blur(4px)' }
          }
          transition={{
            duration: 0.5,
            delay: i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {token}{mode === 'word' && i < tokens.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   5. PARALLAX LAYER — depth effect with scroll speed multiplier
   ════════════════════════════════════════════════════════════ */
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // 0 = no movement, 1 = full scroll, -1 = inverse
  className?: string;
}

export function ParallaxLayer({ children, speed = 0.3, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [yVal, setYVal] = useState(speed * 100);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    setYVal(speed * 100 - progress * speed * 200);
  }, [speed]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ transform: `translateY(${yVal}px)` }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   6. HORIZONTAL SCROLL REVEAL — slides content horizontally
   ════════════════════════════════════════════════════════════ */
interface HorizontalRevealProps {
  children: React.ReactNode;
  className?: string;
  fromLeft?: boolean;
}

export function HorizontalReveal({ children, className = '', fromLeft = true }: HorizontalRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [xVal, setXVal] = useState(fromLeft ? -120 : 120);
  const [opacityVal, setOpacityVal] = useState(0);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0 = element top at viewport bottom, 1 = element center at viewport center
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height / 2)));
    const startX = fromLeft ? -120 : 120;
    setXVal(startX - startX * progress);
    // opacity: [0, 0.5, 1] → [0, 0.6, 1]
    if (progress <= 0.5) {
      setOpacityVal((progress / 0.5) * 0.6);
    } else {
      setOpacityVal(0.6 + 0.4 * ((progress - 0.5) / 0.5));
    }
  }, [fromLeft]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ transform: `translateX(${xVal}px)`, opacity: opacityVal }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   7. PROGRESSIVE DATA REVEAL — for rows that build one by one
   ════════════════════════════════════════════════════════════ */
interface ProgressiveRevealProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function ProgressiveReveal({ children, staggerDelay = 0.15, className = '' }: ProgressiveRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30, scale: 0.97 }}
          animate={
            isInView
              ? { opacity: 1, x: 0, scale: 1 }
              : { opacity: 0, x: -30, scale: 0.97 }
          }
          transition={{
            duration: 0.5,
            delay: i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   8. SECTION SNAP WRAPPER — enables CSS scroll-snap on a section
   ════════════════════════════════════════════════════════════ */
interface SnapSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SnapSection({ children, className = '', id }: SnapSectionProps) {
  return (
    <div
      id={id}
      className={`scroll-snap-section ${className}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   9. COUNTER REVEAL — animated number with scroll trigger
   ════════════════════════════════════════════════════════════ */
interface CounterRevealProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  start?: number;
}

export function CounterReveal({
  end,
  duration = 2500,
  prefix = '',
  suffix = '',
  className = '',
  start = 0,
}: CounterRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let frame: number;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setCount(end);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, end, duration, start]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   10. SCROLL-LINKED OPACITY — content fades based on position
   ════════════════════════════════════════════════════════════ */
interface ScrollFadeProps {
  children: React.ReactNode;
  className?: string;
  fadeOut?: boolean; // also fade out as section leaves
}

export function ScrollFade({ children, className = '', fadeOut = false }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [opacityVal, setOpacityVal] = useState(0);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    if (fadeOut) {
      // [0, 0.3, 0.7, 1] → [0, 1, 1, 0]
      if (progress <= 0.3) setOpacityVal(progress / 0.3);
      else if (progress <= 0.7) setOpacityVal(1);
      else setOpacityVal(1 - (progress - 0.7) / 0.3);
    } else {
      // [0, 0.3] → [0, 1], then stays 1
      setOpacityVal(progress <= 0.3 ? progress / 0.3 : 1);
    }
  }, [fadeOut]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ opacity: opacityVal }}>
        {children}
      </motion.div>
    </div>
  );
}