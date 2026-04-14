import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface PageHeroProps {
  /** Small-caps eyebrow label above the headline */
  eyebrow?: string;
  /** Bold sans-serif portion of the headline (before the serif accent) */
  lead: string;
  /** Italic-serif accent portion (shimmer by default) */
  accent: string;
  /** Optional trailing sans-serif text after the accent */
  trail?: string;
  /** Subcopy paragraph under the headline */
  subcopy?: React.ReactNode;
  /** Optional CTA slot rendered under the subcopy */
  children?: React.ReactNode;
  /** Compact variant reduces vertical padding — use for short informational pages (FAQ, Legal) */
  compact?: boolean;
  /** Align content (default centered) */
  align?: 'center' | 'left';
}

/**
 * Shared dark-gradient hero used at the top of every marketing page.
 * Mirrors the homepage Hero's visual language (hero-bg-gradient, parallax glows,
 * serif shimmer accent) in a drop-in component.
 */
export function PageHero({
  eyebrow,
  lead,
  accent,
  trail,
  subcopy,
  children,
  compact = false,
  align = 'center',
}: PageHeroProps) {
  const { scrollY } = useScroll();
  const glow1Y = useTransform(scrollY, [0, 400], [0, -60]);
  const glow2Y = useTransform(scrollY, [0, 400], [0, -30]);

  const alignWrap = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <section
      className="relative overflow-hidden hero-bg-gradient"
      style={{
        paddingTop: compact ? 'calc(73px + 3rem)' : 'calc(73px + 5rem)',
        paddingBottom: compact ? '4rem' : '7rem',
      }}
    >
      {/* Ambient glow blobs */}
      <motion.div
        aria-hidden="true"
        style={{ y: glow1Y }}
        className="absolute -top-20 -right-20 w-[55vw] max-w-[720px] aspect-square rounded-full blur-3xl pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            background:
              'radial-gradient(circle, var(--glow-indigo) 0%, rgba(73,69,255,0.12) 40%, transparent 70%)',
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ y: glow2Y }}
        className="absolute -bottom-32 -left-16 w-[55vw] max-w-[720px] aspect-square rounded-full blur-3xl pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            background:
              'radial-gradient(circle, var(--glow-violet) 0%, rgba(139,92,246,0.12) 40%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Subtle noise */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className={`flex flex-col ${alignWrap}`}>
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4945ff] shadow-[0_0_10px_2px_rgba(73,69,255,0.6)]" />
              {eyebrow}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`${eyebrow ? 'mt-6' : ''} text-white font-bold tracking-tight leading-[1.05] ${
              align === 'center' ? 'max-w-4xl' : 'max-w-3xl'
            }`}
            style={{
              fontFamily: '"Codec Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: compact ? 'clamp(36px, 4.8vw, 64px)' : 'clamp(40px, 5.4vw, 80px)',
            }}
          >
            {lead}{' '}
            <span className="serif-italic serif-shimmer" style={{ fontWeight: 400, fontSize: '1.05em' }}>
              {accent}
            </span>
            {trail ? <>{' '}{trail}</> : null}
          </motion.h1>

          {subcopy && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
              className={`mt-6 text-white/75 text-lg sm:text-xl leading-relaxed ${
                align === 'center' ? 'max-w-2xl' : 'max-w-2xl'
              }`}
            >
              {subcopy}
            </motion.div>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: 'easeOut' }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
