import { Mail, Phone, ArrowRight } from 'lucide-react';
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
  onAboutClick,
  onHowItWorksClick,
  onReviewsClick,
  onBlogClick,
  onFAQClick,
  onSupportClick,
  onWinsClick,
  onApplyClick,
  onQuizClick,
  onPrivacyClick,
  onTermsClick,
  onDisclosuresClick,
  onResourcesClick,
  hideCTA,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const ctaCopy = t('cta.title') || 'Ready to power up your business?';
  const ctaFirst = ctaCopy.split(' ')[0];
  const ctaRest = ctaCopy.split(' ').slice(1).join(' ');

  return (
    <footer data-footer className="bg-[#041E42] dark:bg-[#0A1F35] text-white">
      {/* CTA band */}
      {!hideCTA && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#4945ff] via-[#5B57FF] to-[#7B77FF]">
          {/* Decorative glow blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-24 top-0 w-[28rem] h-[28rem] bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -right-20 bottom-0 w-[32rem] h-[32rem] bg-[#1510DD]/40 rounded-full blur-3xl" />
            <div className="absolute left-1/3 -top-24 w-72 h-72 bg-[#8B5CF6]/40 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
              <ScrollReveal direction="up" distance={40}>
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.05] max-w-2xl font-bold tracking-tight"
                  style={{ fontFamily: '"Codec Pro", sans-serif' }}
                >
                  <span className="serif-italic font-normal">{ctaFirst}</span>{' '}
                  <span>{ctaRest}</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={30} delay={0.15}>
                <div className="flex flex-col items-start gap-5 shrink-0">
                  <button
                    onClick={onApplyClick}
                    className="group inline-flex items-center gap-2 rounded-full bg-white text-[#4945ff] font-semibold px-7 py-4 text-base shadow-xl hover:shadow-2xl transition-all hover:scale-[1.03]"
                  >
                    {t('cta.button') || 'Get your offer'}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-sm text-white/80 leading-relaxed max-w-md">
                    {t('cta.subtitle')?.split('\n')[0]}
                    <br />
                    {t('cta.subtitle')?.split('\n')[1]?.split('Resources and Guides')[0]}
                    <span
                      className="underline underline-offset-2 cursor-pointer hover:text-white transition-colors"
                      onClick={onResourcesClick}
                    >
                      Resources and Guides
                    </span>
                    {t('cta.subtitle')?.split('\n')[1]?.split('Resources and Guides')[1]}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      )}

      {/* Footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-6">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2 md:pr-6">
            <img src={logoWhiteImg} alt="Delt" className="h-7 w-auto object-contain" />
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-sm">
              {t('footer.description') || 'Everything you need to run and grow your business.'}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SocialIcon label="LinkedIn"><Linkedin className="w-4 h-4" /></SocialIcon>
              <SocialIcon label="X / Twitter"><Twitter className="w-4 h-4" /></SocialIcon>
              <SocialIcon label="Instagram"><Instagram className="w-4 h-4" /></SocialIcon>
              <SocialIcon label="Facebook"><Facebook className="w-4 h-4" /></SocialIcon>
            </div>
          </div>

          {/* Products */}
          <FooterCol title="Products">
            <FooterLink onClick={onQuizClick || onHowItWorksClick}>Capital</FooterLink>
            <FooterLink onClick={onHowItWorksClick}>Pre-qualify</FooterLink>
            <FooterLink onClick={() => { /* calculator link */ }}>Calculator</FooterLink>
            <FooterLink onClick={onApplyClick}>Apply</FooterLink>
          </FooterCol>

          {/* Resources */}
          <FooterCol title="Resources">
            <FooterLink onClick={onFAQClick}>FAQ</FooterLink>
            <FooterLink onClick={onBlogClick}>Blog</FooterLink>
            <FooterLink onClick={onWinsClick}>Success stories</FooterLink>
            <FooterLink onClick={onResourcesClick}>Guides</FooterLink>
          </FooterCol>

          {/* Company */}
          <FooterCol title="Company">
            <FooterLink onClick={onAboutClick}>About</FooterLink>
            <FooterLink onClick={onReviewsClick}>Reviews</FooterLink>
            <FooterLink onClick={onSupportClick}>Support</FooterLink>
            <FooterLink onClick={onHowItWorksClick}>How it works</FooterLink>
          </FooterCol>

          {/* Contact */}
          <FooterCol title="Contact">
            <li>
              <a
                href="tel:+18647293358"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#8B84FF]" />
                (864) 729-3358
              </a>
            </li>
            <li>
              <a
                href="mailto:info@deltcapital.com"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#8B84FF]" />
                info@deltcapital.com
              </a>
            </li>
            <li className="text-xs text-white/45 pt-1">{t('footer.hours')}</li>
          </FooterCol>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} Delt. {t('footer.rights') || 'All rights reserved.'}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <button onClick={onPrivacyClick} className="text-white/50 hover:text-white transition-colors">
              {t('footer.privacy') || 'Privacy'}
            </button>
            <button onClick={onTermsClick} className="text-white/50 hover:text-white transition-colors">
              {t('footer.terms') || 'Terms'}
            </button>
            <button onClick={onDisclosuresClick} className="text-white/50 hover:text-white transition-colors">
              {t('footer.disclosures') || 'Disclosures'}
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#020f22] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-white/40 text-center leading-relaxed">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <li>
      <button
        onClick={onClick}
        className="text-sm text-white/60 hover:text-white transition-colors text-left"
      >
        {children}
      </button>
    </li>
  );
}

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}
