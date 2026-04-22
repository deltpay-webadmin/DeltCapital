import { Calculator, TrendingUp, ArrowRight, ShieldCheck, Star, Lock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import aboutImg1 from 'figma:asset/68f86b0d89444881cf06380344679174c53eeb19.png';
import aboutImg2 from 'figma:asset/d73b4dddaa745c3faa72080f1499fd21a9cf54e8.png';
import aboutImg3 from 'figma:asset/f5ccd74163d0490f9ca85ece7845b949e8675f69.png';
import aboutImg4 from 'figma:asset/618b03a51783dfb37dd9183d1327dc91ef869d9f.png';

interface AboutPageProps {
  onClose: () => void;
  onApplyClick: () => void;
  onCalculatorClick?: () => void;
  onReviewsClick?: () => void;
  onWinsClick?: () => void;
}

export function AboutPage({ onClose, onApplyClick, onCalculatorClick, onReviewsClick, onWinsClick }: AboutPageProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      kicker: 'Our story',
      heroLine1: 'Empower your business.',
      heroLine2: 'Grow with confidence.',
      heroAccent: 'Thrive.',
      heroSub:
        'Delt was built for U.S. operators who need capital that moves at the speed of business — not at the speed of a credit committee.',
      missionKicker: 'Our mission',
      missionHeading: 'Payment processing, reimagined as funding.',
      missionBody:
        'Traditional underwriting punishes the businesses that need capital most: long forms, gatekept credit, weeks of waiting. We turn the payment rails our merchants already trust into the underwriting signal — so funding arrives the same day, with no collateral and no theater.',
      statsHeading: 'By the numbers',
      stats: [
        { value: '$200M+', label: 'Capital deployed to U.S. merchants' },
        { value: '24h', label: 'Average time from approval to funding' },
        { value: '4.8★', label: 'Trustpilot, across 1,200+ reviews' },
        { value: '50 / 50', label: 'Industries funded · states served' },
      ],
      valuesHeading: 'What we stand for',
      valuesSub: 'Four principles that shape how we build, hire, and partner.',
      values: [
        {
          eyebrow: '01 · Team',
          title: "We're one team",
          description:
            'We lead with empathy and treat others with respect. Our success is dependent on all of us working together, lifting each other up, and picking each other up when we fall.',
        },
        {
          eyebrow: '02 · Ownership',
          title: 'We embrace an ownership mindset',
          description:
            'We each play a role in the success of Delt. We are decisive, we own the outcome, and when we see a problem we jump in to help solve it.',
        },
        {
          eyebrow: '03 · Purpose',
          title: "We're driven by purpose and impact",
          description:
            'We get stuff done with agility, integrity, and a sense of urgency. We dive deep, regardless of role, and create focus with clear goals.',
        },
        {
          eyebrow: '04 · Customer',
          title: "We're all in customer success",
          description:
            'Every interaction matters. We commit to helping businesses access the capital they need to grow — and to earning that trust again every single day.',
        },
      ],
      ctaKicker: "What's next",
      ctaHeading: 'Ready to grow your business?',
      ctaSub:
        'Join thousands of businesses that trust Delt Capital for fast, flexible funding solutions.',
      ctaPrimary: 'Get your funding offer',
      ctaCalculator: 'Run the calculator',
      ctaWins: 'See success stories',
    },
    es: {
      kicker: 'Nuestra historia',
      heroLine1: 'Empodera tu negocio.',
      heroLine2: 'Crece con confianza.',
      heroAccent: 'Prospera.',
      heroSub:
        'Delt está hecho para operadores en EE.UU. que necesitan capital que se mueva a la velocidad del negocio — no a la velocidad de un comité de crédito.',
      missionKicker: 'Nuestra misión',
      missionHeading: 'Procesamiento de pagos, reimaginado como financiamiento.',
      missionBody:
        'La suscripción tradicional castiga a los negocios que más necesitan capital: formularios largos, crédito restringido, semanas de espera. Convertimos los rieles de pago que nuestros comerciantes ya usan en la señal de suscripción — para que el financiamiento llegue el mismo día, sin colateral y sin teatro.',
      statsHeading: 'En cifras',
      stats: [
        { value: '$200M+', label: 'Capital desplegado a comerciantes en EE.UU.' },
        { value: '24h', label: 'Tiempo promedio de aprobación a fondos' },
        { value: '4.8★', label: 'Trustpilot, sobre 1.200+ reseñas' },
        { value: '50 / 50', label: 'Industrias financiadas · estados atendidos' },
      ],
      valuesHeading: 'Lo que defendemos',
      valuesSub: 'Cuatro principios que dan forma a cómo construimos, contratamos y nos asociamos.',
      values: [
        {
          eyebrow: '01 · Equipo',
          title: 'Somos un equipo',
          description:
            'Lideramos con empatía y tratamos a los demás con respeto. Nuestro éxito depende de que todos trabajemos juntos, nos apoyemos mutuamente y nos levantemos cuando caemos.',
        },
        {
          eyebrow: '02 · Propiedad',
          title: 'Adoptamos una mentalidad de propiedad',
          description:
            'Cada uno juega un papel en el éxito de Delt. Somos decisivos, somos dueños del resultado, y cuando vemos un problema, saltamos para ayudar a resolverlo.',
        },
        {
          eyebrow: '03 · Propósito',
          title: 'Nos impulsa el propósito y el impacto',
          description:
            'Hacemos las cosas con agilidad, integridad y sentido de urgencia. Profundizamos, sin importar el rol, y creamos enfoque con objetivos claros.',
        },
        {
          eyebrow: '04 · Cliente',
          title: 'Todos estamos en el éxito del cliente',
          description:
            'Cada interacción importa. Nos comprometemos a ayudar a los negocios a acceder al capital que necesitan — y a ganarnos esa confianza todos los días.',
        },
      ],
      ctaKicker: 'Lo que sigue',
      ctaHeading: '¿Listo para hacer crecer tu negocio?',
      ctaSub:
        'Únete a miles de negocios que confían en Delt Capital para soluciones de financiamiento rápidas y flexibles.',
      ctaPrimary: 'Obtén tu oferta de financiamiento',
      ctaCalculator: 'Ejecuta la calculadora',
      ctaWins: 'Ver historias de éxito',
    },
  };

  const t = content[language];
  const valueImages = [aboutImg1, aboutImg2, aboutImg3, aboutImg4];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* ═══════════════════════════════════════
          HERO — bolder, mesh-tinted
         ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-mesh absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-24">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="block uppercase text-[#0c66e4]"
            style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
          >
            {t.kicker}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-[#172b4d]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.0,
              maxWidth: '20ch',
            }}
          >
            {t.heroLine1}
            <br />
            <span className="text-[#172b4d]/85">{t.heroLine2} </span>
            <span className="text-gradient-primary">{t.heroAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="mt-7 max-w-2xl text-[#44546f]"
            style={{ fontSize: 18, lineHeight: 1.55 }}
          >
            {t.heroSub}
          </motion.p>

          {/* Trust strip — sits inside the hero for instant credibility */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[#44546f]"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <Lock className="w-3.5 h-3.5 text-[#0c66e4]" />
              Plaid · bank-grade
            </span>
            <span className="hidden md:inline-block w-px h-3 bg-[#dcdfe4]" />
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1f845a]" />
              BBB A+ accredited
            </span>
            <span className="hidden md:inline-block w-px h-3 bg-[#dcdfe4]" />
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <Star className="w-3.5 h-3.5 text-[#b65c02] fill-[#b65c02]" />
              Trustpilot 4.8 · 1,200+ reviews
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MISSION — large statement, gradient accent
         ═══════════════════════════════════════ */}
      <section className="relative bg-[#172b4d] text-white overflow-hidden">
        <div aria-hidden className="bg-mesh absolute inset-0 opacity-50 pointer-events-none" style={{ mixBlendMode: 'screen' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4">
              <span
                className="inline-flex items-center gap-2 uppercase text-[#85B8FF]"
                style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t.missionKicker}
              </span>
            </div>
            <div className="md:col-span-8">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.875rem, 4.2vw, 3.25rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
                className="mb-7 max-w-4xl"
              >
                {t.missionHeading}
              </h2>
              <p className="text-white/70 max-w-3xl" style={{ fontSize: 18, lineHeight: 1.7 }}>
                {t.missionBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS — by the numbers
         ═══════════════════════════════════════ */}
      <section className="bg-[#fafbfc] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <h2
              className="text-[#172b4d]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {t.statsHeading}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {t.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="card-hover-lift rounded-2xl border border-[#dcdfe4] bg-white p-6 md:p-7"
              >
                <div
                  className="text-gradient-primary tabular-nums"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.0,
                  }}
                >
                  {stat.value}
                </div>
                <p className="mt-3 text-[#44546f] text-sm leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VALUES BENTO — replaces the carousel
         ═══════════════════════════════════════ */}
      <section className="bg-[#f1f2f4] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span
              className="block uppercase text-[#0c66e4]"
              style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
            >
              Principles
            </span>
            <h2
              className="mt-4 text-[#172b4d]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.2vw, 3rem)',
                fontWeight: 600,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              {t.valuesHeading}
            </h2>
            <p className="mt-4 text-[#44546f]" style={{ fontSize: 17, lineHeight: 1.55 }}>
              {t.valuesSub}
            </p>
          </div>

          {/* Asymmetric bento: 1 hero tile + 3 supporting */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            {t.values.map((value, i) => {
              // First tile spans 7 cols (hero), rest span 5/5/5 in remaining grid
              // Layout: [hero col-7] [val2 col-5] / [val3 col-5] [val4 col-7 OR centered]
              // Simpler: hero col-span-7, val2 col-span-5, val3 col-span-5, val4 col-span-7
              const span =
                i === 0 ? 'md:col-span-7' :
                i === 1 ? 'md:col-span-5' :
                i === 2 ? 'md:col-span-5' :
                'md:col-span-7';
              const isHero = i === 0 || i === 3;

              return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`${span} card-hover-lift rounded-3xl bg-white border border-[#dcdfe4] overflow-hidden flex flex-col`}
                >
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: isHero ? '16 / 9' : '4 / 3' }}>
                    <img
                      src={valueImages[i]}
                      alt={value.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />
                    {/* Soft bottom gradient for legibility of any future overlay */}
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(23,43,77,0) 50%, rgba(23,43,77,0.18) 100%)',
                      }}
                    />
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <span
                      className="uppercase text-[#0c66e4]"
                      style={{ fontSize: 10, letterSpacing: '0.28em', fontWeight: 700 }}
                    >
                      {value.eyebrow}
                    </span>
                    <h3
                      className="mt-2 text-[#172b4d]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: isHero ? 'clamp(1.5rem, 2.4vw, 1.875rem)' : 'clamp(1.25rem, 1.8vw, 1.5rem)',
                        fontWeight: 600,
                        letterSpacing: '-0.015em',
                        lineHeight: 1.2,
                      }}
                    >
                      {value.title}
                    </h3>
                    <p className="mt-3 text-[#44546f] leading-relaxed" style={{ fontSize: 15 }}>
                      {value.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — gradient band, bolder
         ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c66e4] via-[#1d7afc] to-[#6e5dc6]">
        <div aria-hidden className="bg-grain absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-20 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -right-20 bottom-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span
            className="block uppercase text-white/70"
            style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
          >
            {t.ctaKicker}
          </span>
          <h2
            className="mt-5 text-white max-w-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            {t.ctaHeading}
          </h2>
          <p className="mt-5 text-white/85 max-w-2xl" style={{ fontSize: 18, lineHeight: 1.55 }}>
            {t.ctaSub}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onApplyClick(), 100);
              }}
              className="card-hover-lift inline-flex items-center justify-center gap-2 bg-white text-[#0c66e4] font-semibold px-7 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
              style={{ fontSize: 15 }}
            >
              {t.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </button>

            {onCalculatorClick && (
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onCalculatorClick(), 100);
                }}
                className="card-hover-lift inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-7 py-4 rounded-xl border border-white/25 hover:bg-white/15 transition-colors"
                style={{ fontSize: 15 }}
              >
                <Calculator className="w-4 h-4" />
                {t.ctaCalculator}
              </button>
            )}

            {onWinsClick && (
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onWinsClick(), 100);
                }}
                className="card-hover-lift inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-7 py-4 rounded-xl border border-white/25 hover:bg-white/15 transition-colors"
                style={{ fontSize: 15 }}
              >
                <TrendingUp className="w-4 h-4" />
                {t.ctaWins}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
