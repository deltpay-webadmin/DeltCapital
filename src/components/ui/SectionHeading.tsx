import React from 'react';

interface SectionHeadingProps {
  /** Sans-bold portion of the heading (before the serif accent) */
  lead: string;
  /** Italic-serif accent portion */
  accent: string;
  /** Optional trailing sans text (after the accent) */
  trail?: string;
  /** Optional eyebrow (small-caps tag above headline) */
  eyebrow?: string;
  /** Optional subcopy rendered below the heading */
  subcopy?: string;
  /** Alignment — default centered */
  align?: 'left' | 'center';
  /** Shimmer animation on the italic accent */
  shimmer?: boolean;
  /** Override heading level (default h2) */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/**
 * Shared editorial section heading — bold sans lead + italic-serif accent.
 * Used across homepage sections + footer CTA to establish the DeltPay-inspired voice.
 */
export function SectionHeading({
  lead,
  accent,
  trail,
  eyebrow,
  subcopy,
  align = 'center',
  shimmer = false,
  as: Tag = 'h2',
  className = '',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow && (
        <div
          className={`inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#4945ff]/80 mb-4`}
        >
          {eyebrow}
        </div>
      )}
      <Tag
        className={`font-bold text-[#041E42] leading-[1.05] tracking-tight ${
          Tag === 'h1'
            ? 'text-5xl sm:text-6xl md:text-7xl'
            : 'text-4xl sm:text-5xl md:text-6xl'
        }`}
        style={{ fontFamily: '"Codec Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        {lead}{' '}
        <span
          className={`serif-italic ${shimmer ? 'serif-shimmer' : ''}`}
          style={{ fontWeight: 400 }}
        >
          {accent}
        </span>
        {trail ? <>{' '}{trail}</> : null}
      </Tag>
      {subcopy && (
        <p
          className={`mt-5 text-lg sm:text-xl text-[#52606D] leading-relaxed ${
            align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
          }`}
        >
          {subcopy}
        </p>
      )}
    </div>
  );
}
