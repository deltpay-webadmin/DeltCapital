import { Mail, Phone, ArrowRight, ArrowUpRight, ShieldCheck, Star, Lock, ChevronUp, Sparkles } from 'lucide-react';
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import logoWhiteImg from 'figma:asset/7f25ee6fe5a55b9182a00e3c5b80e1a42079fc74.png';
import { useLanguage } from '../contexts/LanguageContext';
import { ScrollReveal } from './ScrollNarrative';

interface FooterProps {
  onAboutClick: () => void;
  onHowItWorksClick: () => void;
  onReviewsClick: () => void;
  onBlogClick: () => void;
  onFAQClick: () => void;
  onSupportClick: () => void;
  onWinsClick: () => void;
  onApplyClick: () => void;
  onQuizClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
  onResourcesClick?: () => void;
  hideCTA?: boolean;
}

export function Footer({
  onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick, onFAQClick,
  onSupportClick, onWinsClick, onApplyClick, onQuizClick, onPrivacyClick,
  onTermsClick, onDisclosuresClick, onResourcesClick, hideCTA,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const ctaTitle = t('cta.title');
  const ctaWords = ctaTitle.split(' ');
  const ctaFirstWord = ctaWords[0];
  const ctaRest = ctaWords.slice(1).join(' ');

  return (
    <footer className="relative bg-[#172B4D] dark:bg-[#0D1B2D] text-white overflow-hidden">
      {/* ─────────────────────────────────────────
          CTA Section — cinematic gradient band
         ───────────────────────────────────────── */}
      {!hideCTA && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0C66E4] via-[#1D7AFC] to-[#6E5DC6]">
          {/* Decorative blurs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-20 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -right-20 bottom-0 w-[28rem] h-[28rem] bg-white/12 rounded-full blur-3xl" />
            <div className="absolute left-1/4 -top-20 w-72 h-72 bg-[#0055CC]/45 rounded-full blur-2xl" />
          </div>

          {/* Grain overlay */}
          <div aria-hidden className="bg-grain absolute inset-0 pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <ScrollReveal direction="up" distance={24}>
              <span
                className="inline-flex items-center gap-2 uppercase text-white/85"
                style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Your offer is waiting
              </span>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={28} delay={0.1}>
              <h2
                className="mt-5 text-white"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.0,
                  maxWidth: '20ch',
                }}
              >
                {ctaFirstWord} <span>{ctaRest}</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={20} delay={0.18}>
              <p className="mt-6 text-white/85 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.55 }}>
                {t('cta.subtitle').split('\n')[0]}
                {' '}
                {t('cta.subtitle').split('\n')[1]?.split('Resources and Guides')[0]}
                <span
                  className="underline underline-offset-2 cursor-pointer hover:text-white transition-colors"
                  onClick={onResourcesClick}
                >
                  Resources and Guides
                </span>
                {t('cta.subtitle').split('\n')[1]?.split('Resources and Guides')[1]}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={18} delay={0.26}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                {/* Halo + button */}
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute -inset-2 rounded-full opacity-70 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)',
                      filter: 'blur(14px)',
                    }}
                  />
                  <button
                    onClick={onApplyClick}
                    className="card-hover-lift relative inline-flex items-center gap-2 bg-white text-[#0C66E4] font-semibold rounded-xl px-8 py-4 transition-shadow group"
                    style={{
                      fontSize: 16,
                      boxShadow:
                        '0 18px 40px -14px rgba(9,30,66,0.45), inset 0 1px 0 rgba(255,255,255,0.9)',
                    }}
                  >
                    {t('cta.button')}
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>

                {/* Live indicator pill — sits inline with the button */}
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3.5 py-1.5"
                >
                  <span className="relative flex w-1.5 h-1.5">
                    <span
                      className="absolute inset-0 rounded-full bg-white opacity-80"
                      style={{ animation: 'footerLivePulse 2.2s ease-in-out infinite' }}
                    />
                    <span className="relative w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <span
                    className="text-white tabular-nums"
                    style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.02em' }}
                  >
                    12 businesses funded today
                  </span>
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          Trust strip — between CTA and bento
         ───────────────────────────────────────── */}
      {!hideCTA && (
        <div className="border-y border-white/[0.08] bg-[#0F2440]/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-3">
              <span
                className="uppercase text-white/45"
                style={{ fontSize: 10, letterSpacing: '0.3em', fontWeight: 700 }}
              >
                Powered by trusted infrastructure
              </span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/70">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-3.5 h-3.5 text-[#85B8FF]" />
                  Plaid · bank-grade
                </span>
                <span className="hidden md:inline-block w-px h-3 bg-white/15" />
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1F845A]" />
                  BBB A+ accredited
                </span>
                <span className="hidden md:inline-block w-px h-3 bg-white/15" />
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <Star className="w-3.5 h-3.5 text-[#F5CD47] fill-[#F5CD47]" />
                  Trustpilot 4.8
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          Footer bento + signature wordmark
         ───────────────────────────────────────── */}
      <div className="relative">
        {/* Subtle dot-grid pattern in the dark band for distinction */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          {/* Bento tiles */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-12">
            {/* Brand tile — large, with manifesto + gradient ring */}
            <div className="md:col-span-5 relative">
              {/* Faint gradient ring around the brand tile */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  padding: 1,
                  background:
                    'linear-gradient(135deg, rgba(12,102,228,0.45) 0%, rgba(133,184,255,0.25) 50%, rgba(110,93,198,0.45) 100%)',
                  WebkitMask:
                    'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              <div
                className="card-hover-lift relative rounded-2xl p-7 flex flex-col h-full"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <img src={logoWhiteImg} alt="Delt" className="h-7 w-auto object-contain" />
                <p
                  className="text-white mt-4 max-w-sm"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: '-0.015em',
                    lineHeight: 1.3,
                  }}
                >
                  Capital that moves at the{' '}
                  <span className="text-gradient-primary">speed of business.</span>
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-md">
                  {t('footer.description')}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-6">
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    aria-label="X / Twitter"
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Company tile */}
            <div className="card-hover-lift md:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <h3
                className="font-semibold mb-3 text-white uppercase"
                style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700 }}
              >
                {t('footer.company')}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={onAboutClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.about')}</button></li>
                <li><button onClick={onQuizClick || onHowItWorksClick} className="text-gray-300 hover:text-white transition-colors text-left">{t('footer.howItWorks')}</button></li>
                <li><button onClick={onReviewsClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.reviews')}</button></li>
                <li><button onClick={onBlogClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.blog')}</button></li>
              </ul>
            </div>

            {/* Resources tile */}
            <div className="card-hover-lift md:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <h3
                className="font-semibold mb-3 text-white uppercase"
                style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700 }}
              >
                {t('footer.resources')}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={onFAQClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.faq')}</button></li>
                <li><button onClick={onSupportClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.support')}</button></li>
                <li><button onClick={onWinsClick} className="text-gray-300 hover:text-white transition-colors">Wins</button></li>
                <li><button onClick={onResourcesClick} className="text-gray-300 hover:text-white transition-colors">Resources</button></li>
              </ul>
            </div>

            {/* Contact tile */}
            <div className="card-hover-lift md:col-span-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <h3
                className="font-semibold mb-3 text-white uppercase"
                style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700 }}
              >
                {t('footer.contact')}
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <Phone className="w-4 h-4 text-[#85B8FF] mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <a href="tel:+18647293358" className="hover:text-white transition-colors font-medium text-white tabular-nums">
                      (864) 729-3358
                    </a>
                    <p className="text-xs text-gray-400">{t('footer.hours')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="w-4 h-4 text-[#85B8FF] mr-2 mt-0.5 flex-shrink-0" />
                  <a href="mailto:info@deltcapital.com" className="hover:text-white transition-colors text-gray-300">info@deltcapital.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* ──────── Bottom band ──────── */}
          <div className="border-t border-white/[0.08] pt-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Delt. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-5">
              <button onClick={onPrivacyClick} className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.privacy')}</button>
              <button onClick={onTermsClick} className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.terms')}</button>
              <button onClick={onDisclosuresClick} className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.disclosures')}</button>
              <span className="hidden md:inline-block w-px h-4 bg-white/10" />
              {/* Back to top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.10] px-3 py-1.5 text-white/70 hover:text-white transition-colors"
                style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}
              >
                <ChevronUp className="w-3 h-3" />
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer band */}
      <div className="bg-[#0D1B2D] py-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>

      {/* Live-pulse keyframe (used by the CTA "businesses funded today" pill) */}
      <style>{`
        @keyframes footerLivePulse {
          0%, 100% { transform: scale(1); opacity: 0.80; }
          50%      { transform: scale(2.4); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="footerLivePulse"] { animation: none !important; }
        }
      `}</style>
    </footer>
  );
}
