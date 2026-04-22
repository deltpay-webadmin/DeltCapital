import {
  X, TrendingUp, Calendar, Users, Star, DollarSign, Quote, ArrowRight,
  ArrowUpRight, MapPin, Sparkles, Lock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Footer } from './Footer';
import { useLanguage } from '../contexts/LanguageContext';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
import mariaImage from 'figma:asset/1b2c405c96e51ef33438f967ca73fc1dc4c6466d.png';
import sarahImage from 'figma:asset/ff53f8f3d85a709cccd6e0c82bd0e5777600875f.png';
import emilyImage from 'figma:asset/0a55cb1561cc1ee97dc02e3f2bffcc1328d5dc86.png';
import mikeImage from 'figma:asset/7ef9e7460353c7f5e10b8110f4d8f005f4548be3.png';
import davidImage from 'figma:asset/b8f000958fe67742e5bcf78ccf36f8a58e419128.png';
import marcusImage from 'figma:asset/699c182745bf9f0454ee49117fc20fc14cf0a9b0.png';

interface WinsPageProps {
  onClose: () => void;
  onAboutClick?: () => void;
  onHowItWorksClick?: () => void;
  onReviewsClick?: () => void;
  onBlogClick?: () => void;
  onFAQClick?: () => void;
  onSupportClick?: () => void;
  onWinsClick?: () => void;
  onApplyClick?: () => void;
  onQuizClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
}

export function WinsPage({
  onClose, onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick,
  onFAQClick, onSupportClick, onWinsClick, onApplyClick, onQuizClick,
  onPrivacyClick, onTermsClick, onDisclosuresClick,
}: WinsPageProps) {
  const { t } = useLanguage();

  const successStories = [
    {
      name: 'Maria Rodriguez',
      business: 'La Rosa Restaurant',
      industry: 'Restaurant',
      location: 'Miami, FL',
      image: mariaImage,
      fundingAmount: '$110,000',
      fundingDate: 'January 2025',
      achievement: 'Opened second location',
      quote:
        'The funding from Delt Capital allowed us to open our second location 6 months ahead of schedule. The process was incredibly smooth and fast!',
      metrics: [
        { labelKey: 'wins.story.revenueGrowth', value: '32%', icon: TrendingUp },
        { labelKey: 'wins.story.timeToFund', value: '36 hrs', icon: Calendar },
        { labelKey: 'wins.story.newEmployees', value: '5', icon: Users },
      ],
    },
    {
      name: 'Mike Rosario',
      business: 'Rosario Construction LLC',
      industry: 'Construction',
      location: 'Irving, TX',
      image: mikeImage,
      fundingAmount: '$180,000',
      fundingDate: 'December 2024',
      achievement: 'Purchased new equipment & expanded shop',
      quote:
        "With Delt's Revenue-Based Financing, I was able to upgrade all my equipment without the stress of traditional bank loans. Game changer for my business.",
      metrics: [
        { labelKey: 'wins.story.monthlyRevenue', value: '+$18K', icon: DollarSign },
        { labelKey: 'wins.story.approvalTime', value: '12 hrs', icon: Calendar },
        { labelKey: 'wins.story.customerGrowth', value: '22%', icon: TrendingUp },
      ],
    },
    {
      name: 'Sarah Thompson',
      business: 'Bloom Beauty Salon',
      industry: 'Beauty & Wellness',
      location: 'Austin, TX',
      image: sarahImage,
      fundingAmount: '$65,000',
      fundingDate: 'November 2024',
      achievement: 'Renovated salon & added spa services',
      quote:
        'I was nervous about taking on financing, but Delt made it so easy. Now my salon is thriving with our new spa services!',
      metrics: [
        { labelKey: 'wins.story.serviceExpansion', value: '3 New', icon: Star },
        { labelKey: 'wins.story.fundingSpeed', value: '24 hrs', icon: Calendar },
        { labelKey: 'wins.story.clientBase', value: '+65', icon: Users },
      ],
    },
    {
      name: 'Marcus Williams',
      business: 'Williams Logistics',
      industry: 'Transportation',
      location: 'Atlanta, GA',
      image: marcusImage,
      fundingAmount: '$80,000',
      fundingDate: 'October 2024',
      achievement: 'Upgraded fleet maintenance & equipment',
      quote:
        'Delt Capital helped me seize a time-sensitive opportunity to upgrade my operation. Their speed and flexibility were exactly what I needed.',
      metrics: [
        { labelKey: 'wins.story.fleetGrowth', value: '+1 Route', icon: TrendingUp },
        { labelKey: 'wins.story.revenueIncrease', value: '+$9K', icon: DollarSign },
        { labelKey: 'wins.story.processingTime', value: '48 hrs', icon: Calendar },
      ],
    },
    {
      name: 'Emily Ward',
      business: "Emily's Market",
      industry: 'Retail',
      location: 'Seattle, WA',
      image: emilyImage,
      fundingAmount: '$50,000',
      fundingDate: 'September 2024',
      achievement: 'Upgraded inventory & POS systems',
      quote:
        'The holiday season was approaching, and I needed capital fast to stock up. Delt came through in record time!',
      metrics: [
        { labelKey: 'wins.story.salesGrowth', value: '18%', icon: TrendingUp },
        { labelKey: 'wins.story.inventoryValue', value: '+$18K', icon: DollarSign },
        { labelKey: 'wins.story.fundedIn', value: '32 hrs', icon: Calendar },
      ],
    },
    {
      name: 'David Roberts',
      business: 'Roberts Auto Service',
      industry: 'Automotive',
      location: 'Phoenix, AZ',
      image: davidImage,
      fundingAmount: '$95,000',
      fundingDate: 'August 2024',
      achievement: 'Hired new techs & purchased equipment',
      quote:
        "Traditional banks turned me down, but Delt saw the potential in my business. Now I'm taking on larger projects than ever!",
      metrics: [
        { labelKey: 'wins.story.projectSize', value: '+35%', icon: TrendingUp },
        { labelKey: 'wins.story.teamGrowth', value: '2 Staff', icon: Users },
        { labelKey: 'wins.story.approvalTime', value: '6 hrs', icon: Calendar },
      ],
    },
  ];

  const aggregateStats = [
    { value: '$2.4M+', labelKey: 'wins.stats.totalCapital',  descKey: 'wins.stats.totalCapital.desc',  icon: DollarSign },
    { value: '24 hrs', labelKey: 'wins.stats.avgFunding',    descKey: 'wins.stats.avgFunding.desc',    icon: Calendar },
    { value: '93%',    labelKey: 'wins.stats.avgRevenue',    descKey: 'wins.stats.avgRevenue.desc',    icon: TrendingUp },
    { value: '4.9/5',  labelKey: 'wins.stats.satisfaction',  descKey: 'wins.stats.satisfaction.desc',  icon: Star },
  ];

  return (
    <div className="fixed inset-0 bg-[#fafbfc] dark:bg-[#0A1F35] z-50 overflow-y-auto">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-10 bg-[#fafbfc]/85 backdrop-blur-md border-b border-[#dcdfe4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-0 h-14 w-auto cursor-pointer" onClick={onClose}>
            <img src={logoImg} alt="Delt Capital" className="h-10 w-auto object-contain" />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-[#dcdfe4] bg-white hover:bg-[#fafbfc] flex items-center justify-center transition-colors text-[#44546f]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          HERO
         ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-mesh absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 uppercase text-[#0c66e4]"
            style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Success stories
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
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              maxWidth: '20ch',
            }}
          >
            Capital is the start.{' '}
            <span className="text-gradient-primary">The relationship is the point.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 max-w-2xl text-[#44546f]"
            style={{ fontSize: 18, lineHeight: 1.55 }}
          >
            Real merchants. Real results. Six operators who took the call and got
            funded — same week, no theater.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          AGGREGATE STATS — 4-up bento
         ═══════════════════════════════════════ */}
      <section className="bg-[#fafbfc] pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {aggregateStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="card-hover-lift rounded-2xl border border-[#dcdfe4] bg-white p-6 md:p-7"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white"
                    style={{
                      background: 'linear-gradient(135deg, #0c66e4 0%, #6e5dc6 100%)',
                      boxShadow: '0 8px 18px -6px rgba(12,102,228,0.45)',
                    }}
                  >
                    <stat.icon className="w-4.5 h-4.5" />
                  </span>
                </div>
                <div
                  className="text-gradient-primary tabular-nums"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4.2vw, 2.75rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.0,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[#172b4d] mt-3"
                  style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em' }}
                >
                  {t(stat.labelKey)}
                </div>
                <div className="text-[#758195] text-xs mt-1 leading-relaxed">
                  {t(stat.descKey)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STORIES — alternating feature blocks
         ═══════════════════════════════════════ */}
      <section className="bg-[#f1f2f4] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span
              className="block uppercase text-[#0c66e4]"
              style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
            >
              The stories
            </span>
            <h2
              className="mt-4 text-[#172b4d]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
                fontWeight: 600,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              Six operators. Same week to funded.
            </h2>
          </div>

          <div className="space-y-6 md:space-y-8">
            {successStories.map((story, i) => {
              const imageRight = i % 2 === 1;
              return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="card-hover-lift relative rounded-3xl bg-white overflow-hidden"
                  style={{
                    boxShadow:
                      '0 24px 60px -28px rgba(12,102,228,0.22), 0 8px 24px -10px rgba(110,93,198,0.12)',
                  }}
                >
                  {/* Faint gradient ring */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                    style={{
                      padding: 1,
                      background:
                        'linear-gradient(135deg, rgba(12,102,228,0.30) 0%, rgba(133,184,255,0.18) 50%, rgba(110,93,198,0.30) 100%)',
                      WebkitMask:
                        'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />

                  <div className={`relative grid md:grid-cols-2 gap-0 ${imageRight ? 'md:[&>*:first-child]:order-2' : ''}`}>
                    {/* ── Image side ── */}
                    <div className="relative h-72 md:h-auto overflow-hidden group">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Bottom-weighted gradient for legibility */}
                      <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(13,27,45,0) 30%, rgba(13,27,45,0.55) 75%, rgba(13,27,45,0.95) 100%)',
                        }}
                      />

                      {/* Top-left chips: industry + location */}
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-3 z-[2]">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-white"
                          style={{ fontSize: 10.5, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}
                        >
                          {story.industry}
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 text-white/85"
                          style={{ fontSize: 11, fontWeight: 600 }}
                        >
                          <MapPin className="w-3 h-3" />
                          {story.location}
                        </span>
                      </div>

                      {/* Bottom-left: name + business */}
                      <div className="absolute bottom-6 left-6 right-6 z-[2]">
                        <h3
                          className="text-white"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.5rem, 2.4vw, 1.875rem)',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                          }}
                        >
                          {story.name}
                        </h3>
                        <p className="text-white/85 text-sm mt-1 font-medium">{story.business}</p>
                      </div>
                    </div>

                    {/* ── Content side ── */}
                    <div className="p-7 md:p-9 flex flex-col">
                      {/* Quote */}
                      <div className="flex items-start gap-4">
                        <span
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 text-[#0c66e4]"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(12,102,228,0.12) 0%, rgba(110,93,198,0.12) 100%)',
                          }}
                        >
                          <Quote className="w-4 h-4" />
                        </span>
                        <p
                          className="text-[#172b4d] leading-relaxed"
                          style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.55 }}
                        >
                          "{story.quote}"
                        </p>
                      </div>

                      {/* Funding amount + achievement */}
                      <div className="mt-7 rounded-2xl border border-[#dcdfe4] bg-[#fafbfc] p-5">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <div
                              className="uppercase text-[#758195]"
                              style={{ fontSize: 9.5, letterSpacing: '0.28em', fontWeight: 700 }}
                            >
                              {t('wins.story.fundedAmount')}
                            </div>
                            <div
                              className="text-gradient-primary tabular-nums mt-1.5"
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(1.875rem, 3.5vw, 2.25rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.0,
                              }}
                            >
                              {story.fundingAmount}
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className="uppercase text-[#758195]"
                              style={{ fontSize: 9.5, letterSpacing: '0.28em', fontWeight: 700 }}
                            >
                              {t('wins.story.fundingDate')}
                            </div>
                            <div className="text-[#172b4d] text-sm font-semibold mt-1.5">
                              {story.fundingDate}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#dcdfe4] flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-[#b65c02] fill-[#b65c02] flex-shrink-0" />
                          <span className="text-[#172b4d] text-sm font-semibold">{story.achievement}</span>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="mt-5 grid grid-cols-3 gap-2.5">
                        {story.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-[#dcdfe4] bg-white p-3.5"
                          >
                            <div className="flex items-center gap-1.5 text-[#0c66e4] mb-2">
                              <metric.icon className="w-3.5 h-3.5" />
                            </div>
                            <div
                              className="text-[#172b4d] tabular-nums"
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 18,
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.0,
                              }}
                            >
                              {metric.value}
                            </div>
                            <div
                              className="uppercase text-[#758195] mt-1"
                              style={{ fontSize: 9, letterSpacing: '0.18em', fontWeight: 700 }}
                            >
                              {t(metric.labelKey)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — gradient + grain matching footer
         ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c66e4] via-[#1d7afc] to-[#6e5dc6]">
        <div aria-hidden className="bg-grain absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-20 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -right-20 bottom-0 w-[28rem] h-[28rem] bg-white/12 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span
            className="inline-flex items-center gap-2 uppercase text-white/85"
            style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Your story, next
          </span>
          <h2
            className="mt-5 text-white"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.0,
              maxWidth: '20ch',
            }}
          >
            {t('wins.cta.title')}
          </h2>
          <p className="mt-6 text-white/85 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.55 }}>
            {t('wins.cta.subtitle')}
          </p>

          {/* Email + button */}
          <form
            className="mt-9 flex flex-col sm:flex-row gap-3 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              onApplyClick?.();
            }}
          >
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl bg-white/95 backdrop-blur-sm text-[#172b4d] placeholder:text-[#758195] outline-none px-4 py-4 transition-shadow focus:shadow-2xl"
                style={{ fontSize: 15 }}
              />
            </div>
            <div className="relative">
              <span
                aria-hidden
                className="absolute -inset-1 rounded-full opacity-60 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)',
                  filter: 'blur(10px)',
                }}
              />
              <button
                type="submit"
                className="card-hover-lift relative inline-flex items-center justify-center gap-2 bg-white text-[#0c66e4] font-semibold rounded-xl px-7 py-4 transition-shadow group whitespace-nowrap"
                style={{
                  fontSize: 15,
                  boxShadow:
                    '0 18px 40px -14px rgba(9,30,66,0.45), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                Get started
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </form>

          {/* Trust line + return link */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/70">
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <Lock className="w-3.5 h-3.5" />
              No credit impact · 2-min application
            </span>
            <span className="hidden sm:inline-block w-px h-3 bg-white/20" />
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white underline underline-offset-2 text-sm transition-colors"
            >
              Or return to application
            </button>
          </div>
        </div>
      </section>

      {/* ─── Disclaimer ─── */}
      <div className="bg-[#172b4d] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-[#758195] leading-relaxed max-w-3xl mx-auto">
            {t('wins.footer.disclaimer')}
          </p>
        </div>
      </div>

      {/* Shared Footer */}
      <Footer
        hideCTA
        onAboutClick={onAboutClick || (() => {})}
        onHowItWorksClick={onHowItWorksClick || (() => {})}
        onReviewsClick={onReviewsClick || (() => {})}
        onBlogClick={onBlogClick || (() => {})}
        onFAQClick={onFAQClick || (() => {})}
        onSupportClick={onSupportClick || (() => {})}
        onWinsClick={onWinsClick || (() => {})}
        onApplyClick={onApplyClick || (() => {})}
        onQuizClick={onQuizClick}
        onPrivacyClick={onPrivacyClick}
        onTermsClick={onTermsClick}
        onDisclosuresClick={onDisclosuresClick}
      />
    </div>
  );
}
