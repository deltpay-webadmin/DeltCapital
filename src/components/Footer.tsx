import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Star, Lock } from 'lucide-react';
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import logoWhiteImg from 'figma:asset/7f25ee6fe5a55b9182a00e3c5b80e1a42079fc74.png';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
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

export function Footer({ onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick, onFAQClick, onSupportClick, onWinsClick, onApplyClick, onQuizClick, onPrivacyClick, onTermsClick, onDisclosuresClick, onResourcesClick, hideCTA }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-[#172B4D] dark:bg-[#0D1B2D] text-white">
      {/* CTA Section */}
      {!hideCTA && (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0C66E4] via-[#1D7AFC] to-[#6E5DC6]">
        {/* Decorative curved shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -right-20 bottom-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute left-1/4 -top-20 w-64 h-64 bg-[#0055CC]/40 rounded-full blur-2xl"></div>
        </div>

        {/* Grain overlay — premium texture on the gradient. */}
        <div aria-hidden className="bg-grain absolute inset-0 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <ScrollReveal direction="up" distance={40}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-white">
                <span className="italic font-light">{t('cta.title').split(' ')[0]}</span>{' '}
                <span>{t('cta.title').split(' ').slice(1).join(' ')}</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" distance={30} delay={0.15}>
              <div className="flex flex-col items-start md:items-start gap-5 shrink-0">
                <Button 
                  onClick={onApplyClick}
                  className="bg-white hover:bg-gray-100 text-[#0C66E4] font-semibold px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  {t('cta.button')}
                </Button>
                <p className="text-sm text-white/80 leading-relaxed">
                  {t('cta.subtitle').split('\n')[0]}<br />
                  {t('cta.subtitle').split('\n')[1]?.split('Resources and Guides')[0]}
                  <span className="underline underline-offset-2 cursor-pointer hover:text-white transition-colors" onClick={onResourcesClick}>Resources and Guides</span>
                  {t('cta.subtitle').split('\n')[1]?.split('Resources and Guides')[1]}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      )}

      {/* Trust strip — sits between gradient CTA and footer bento. */}
      {!hideCTA && (
        <div className="border-y border-white/[0.08] bg-[#0F2440]/60">
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

      {/* Footer Content — Vercel-style bento tiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
          {/* Brand tile — large */}
          <div
            className="card-hover-lift md:col-span-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
          >
            <div className="mb-1">
              <img src={logoWhiteImg} alt="Delt" className="h-7 w-auto object-contain" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mt-3 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex items-center mt-auto pt-5">
              <a href="#" aria-label="LinkedIn" style={{ marginRight: 12 }}>
                <Linkedin style={{ width: 22, height: 22, color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }} className="hover:!text-white" />
              </a>
              <a href="#" aria-label="X / Twitter" style={{ marginRight: 12 }}>
                <Twitter style={{ width: 22, height: 22, color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }} className="hover:!text-white" />
              </a>
              <a href="#" aria-label="Instagram" style={{ marginRight: 12 }}>
                <Instagram style={{ width: 22, height: 22, color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }} className="hover:!text-white" />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook style={{ width: 22, height: 22, color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }} className="hover:!text-white" />
              </a>
            </div>
          </div>

          {/* Company tile */}
          <div className="card-hover-lift md:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-[0.12em]">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={onAboutClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.about')}</button></li>
              <li><button onClick={onQuizClick || onHowItWorksClick} className="text-gray-300 hover:text-white transition-colors text-left">{t('footer.howItWorks')}</button></li>
              <li><button onClick={onReviewsClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.reviews')}</button></li>
              <li><button onClick={onBlogClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.blog')}</button></li>
            </ul>
          </div>

          {/* Resources tile */}
          <div className="card-hover-lift md:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-[0.12em]">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={onFAQClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.faq')}</button></li>
              <li><button onClick={onSupportClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.support')}</button></li>
              <li><button onClick={onWinsClick} className="text-gray-300 hover:text-white transition-colors">Wins</button></li>
              <li><button onClick={onResourcesClick} className="text-gray-300 hover:text-white transition-colors">Resources</button></li>
            </ul>
          </div>

          {/* Contact tile */}
          <div className="card-hover-lift md:col-span-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-[0.12em]">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 text-[#85B8FF] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+18647293358" className="hover:text-white transition-colors font-medium text-white">
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

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Delt. {t('footer.rights')}
            </p>
            <div className="flex space-x-6 text-sm">
              <button onClick={onPrivacyClick} className="text-gray-400 hover:text-white transition-colors">{t('footer.privacy')}</button>
              <button onClick={onTermsClick} className="text-gray-400 hover:text-white transition-colors">{t('footer.terms')}</button>
              <button onClick={onDisclosuresClick} className="text-gray-400 hover:text-white transition-colors">{t('footer.disclosures')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#0D1B2D] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}