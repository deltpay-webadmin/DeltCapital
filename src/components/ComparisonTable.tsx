import { Check, X, Zap, CreditCard, BarChart3, FileText, TrendingDown, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import plaidLogo from 'figma:asset/3d56d8057bf3175de1bdd9e78d2cb0a4f9e0dc87.png';
import deltLogo from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';

const ICONS = [Zap, CreditCard, BarChart3, FileText, TrendingDown, Shield];

const ROWS = [
  { featureKey: 'comparison.getFunded',  descriptionKey: 'comparison.getFunded.desc',  traditionalKey: 'comparison.getFunded.traditional',  deltKey: 'comparison.getFunded.delt' },
  { featureKey: 'comparison.repayment',  descriptionKey: 'comparison.repayment.desc',  traditionalKey: 'comparison.repayment.traditional',  deltKey: 'comparison.repayment.delt' },
  { featureKey: 'comparison.credit',     descriptionKey: 'comparison.credit.desc',     traditionalKey: 'comparison.credit.traditional',     deltKey: 'comparison.credit.delt' },
  { featureKey: 'comparison.paperwork',  descriptionKey: 'comparison.paperwork.desc',  traditionalKey: 'comparison.paperwork.traditional',  deltKey: 'comparison.paperwork.delt' },
  { featureKey: 'comparison.slowMonths', descriptionKey: 'comparison.slowMonths.desc', traditionalKey: 'comparison.slowMonths.traditional', deltKey: 'comparison.slowMonths.delt' },
  { featureKey: 'comparison.collateral', descriptionKey: 'comparison.collateral.desc', traditionalKey: 'comparison.collateral.traditional', deltKey: 'comparison.collateral.delt' },
];

export function ComparisonTable() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-[#fafbfc] overflow-hidden">
      {/* Soft mesh tint */}
      <div aria-hidden className="bg-mesh absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Heading ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14 md:mb-20"
        >
          <span
            className="block uppercase text-[#0c66e4]"
            style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
          >
            Banks vs Delt
          </span>
          <h2
            className="mt-4 text-[#172b4d]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.0,
            }}
          >
            Why Delt beats{' '}
            <span className="text-gradient-primary">the bank.</span>
          </h2>
          <p className="mt-5 text-[#44546f] max-w-xl" style={{ fontSize: 17, lineHeight: 1.6 }}>
            {t('comparison.subtitle')}
          </p>
        </motion.div>

        {/* ─── Versus battle layout ─── */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-0">
          {/* ═══════════ BANKS column — dim, monochrome ═══════════ */}
          <div className="lg:col-span-6 lg:pr-3">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full rounded-3xl overflow-hidden border border-[#dcdfe4] bg-[#f1f2f4]"
            >
              {/* Column header */}
              <div className="px-7 md:px-9 pt-9 pb-7 border-b border-[#dcdfe4]">
                <span
                  className="uppercase text-[#758195]"
                  style={{ fontSize: 10, letterSpacing: '0.32em', fontWeight: 700 }}
                >
                  The traditional way
                </span>
                <div className="flex items-baseline gap-3 mt-3">
                  <h3
                    className="text-[#758195]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      lineHeight: 1.0,
                    }}
                  >
                    Banks
                  </h3>
                  <span className="text-[#9aa5b1] text-sm">slow · gatekept · expensive</span>
                </div>
              </div>

              {/* Friction list */}
              <ul className="p-7 md:p-9 space-y-5">
                {ROWS.map((row, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4 group"
                  >
                    <span className="mt-0.5 w-9 h-9 rounded-lg bg-[#c9372c]/[0.08] text-[#c9372c] flex items-center justify-center flex-shrink-0">
                      <X className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[#44546f]"
                        style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}
                      >
                        {t(row.featureKey)}
                      </div>
                      <div className="mt-1 text-[#758195]" style={{ fontSize: 15, lineHeight: 1.5 }}>
                        {t(row.traditionalKey)}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ═══════════ DELT column — vibrant, dark, glowing ═══════════ */}
          <div className="lg:col-span-6 lg:pl-3 relative">
            {/* Behind-card mesh halo */}
            <div
              aria-hidden
              className="absolute -inset-6 lg:-inset-8 pointer-events-none"
            >
              <div className="bg-mesh absolute inset-0 opacity-60" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full rounded-3xl overflow-hidden bg-[#172b4d] text-white"
              style={{
                boxShadow:
                  '0 24px 60px -16px rgba(12,102,228,0.45), 0 4px 12px rgba(110,93,198,0.18)',
              }}
            >
              {/* Gradient ring */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  padding: 1.5,
                  background:
                    'linear-gradient(135deg, rgba(12,102,228,0.85) 0%, rgba(133,184,255,0.5) 35%, rgba(110,93,198,0.85) 100%)',
                  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              {/* Internal mesh-screen tint */}
              <div
                aria-hidden
                className="bg-mesh absolute inset-0 opacity-30 pointer-events-none"
                style={{ mixBlendMode: 'screen' }}
              />

              {/* Column header */}
              <div className="relative px-7 md:px-9 pt-9 pb-7 border-b border-white/10">
                <span
                  className="uppercase text-[#85B8FF]"
                  style={{ fontSize: 10, letterSpacing: '0.32em', fontWeight: 700 }}
                >
                  The Delt way
                </span>
                <div className="flex items-center gap-4 mt-3">
                  <img src={deltLogo} alt="Delt Capital" className="h-9 w-auto object-contain" />
                  <span className="text-white/55 text-sm hidden sm:inline">
                    fast · transparent · revenue-first
                  </span>
                </div>
              </div>

              {/* Win list */}
              <ul className="relative p-7 md:p-9 space-y-5">
                {ROWS.map((row, i) => {
                  const Icon = ICONS[i];
                  const isPlaid = row.deltKey === 'comparison.paperwork.delt';
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-4 group"
                    >
                      <span
                        className="mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #0c66e4 0%, #6e5dc6 100%)',
                          boxShadow: '0 4px 14px -4px rgba(12,102,228,0.55)',
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-[#85B8FF]"
                          style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}
                        >
                          {t(row.featureKey)}
                        </div>
                        <div className="mt-1 text-white flex items-center flex-wrap gap-x-2" style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.5 }}>
                          <Check className="w-4 h-4 text-[#1F845A] flex-shrink-0" strokeWidth={2.5} />
                          {isPlaid ? (
                            <span className="inline-flex items-center gap-0">
                              {t('comparison.paperwork.connectWith')}
                              <img
                                src={plaidLogo}
                                alt="Plaid"
                                className="h-12 w-auto inline-block object-contain -ml-1 brightness-0 invert"
                              />
                            </span>
                          ) : (
                            <span>{t(row.deltKey)}</span>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </div>

          {/* "VS" badge — only visible on lg+, sits over the column gap */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45, type: 'spring', stiffness: 220, damping: 18 }}
              className="w-16 h-16 rounded-full bg-white border border-[#dcdfe4] flex items-center justify-center"
              style={{
                boxShadow:
                  '0 12px 32px -8px rgba(9,30,66,0.25), 0 0 0 6px rgba(255,255,255,0.6)',
              }}
            >
              <span
                className="text-gradient-primary"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                VS
              </span>
            </motion.div>
          </div>
        </div>

        {/* ─── Result strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {[
            { label: 'Time to fund',     value: 'Same day' },
            { label: 'Credit impact',    value: '0%' },
            { label: 'Collateral',       value: 'None' },
          ].map((s, i) => (
            <div
              key={i}
              className="card-hover-lift relative rounded-2xl border border-[#dcdfe4] bg-white px-6 py-5 flex items-center justify-between"
            >
              <div>
                <div
                  className="uppercase text-[#758195]"
                  style={{ fontSize: 10, letterSpacing: '0.28em', fontWeight: 700 }}
                >
                  {s.label}
                </div>
                <div
                  className="text-gradient-primary tabular-nums mt-1.5"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-[#0c66e4]/45" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
