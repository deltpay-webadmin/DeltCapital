import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
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
    <footer className="bg-[#041E42] dark:bg-[#0A1F35] text-white">
      {/* CTA Section */}
      {!hideCTA && (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#4945ff] via-[#5B57FF] to-[#7B77FF]">
        {/* Decorative curved shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -right-20 bottom-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute left-1/4 -top-20 w-64 h-64 bg-[#1510DD]/30 rounded-full blur-2xl"></div>
        </div>
        
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
                  className="bg-white hover:bg-gray-100 text-[#4945ff] font-semibold px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
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

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          {/* Company Info */}
          <div>
            <div className="mb-1">
              <img src={logoWhiteImg} alt="Delt" className="h-7 w-auto object-contain" />
            </div>
            {/* Social Icons */}
            <div className="flex items-center" style={{ marginTop: 12, marginBottom: 12 }}>
              <a href="#" aria-label="LinkedIn" style={{ marginRight: 12 }}>
                <Linkedin style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} className="hover:!text-white" />
              </a>
              <a href="#" aria-label="X / Twitter" style={{ marginRight: 12 }}>
                <Twitter style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} className="hover:!text-white" />
              </a>
              <a href="#" aria-label="Instagram" style={{ marginRight: 12 }}>
                <Instagram style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} className="hover:!text-white" />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} className="hover:!text-white" />
              </a>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={onAboutClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.about')}</button></li>
              <li><button onClick={onQuizClick || onHowItWorksClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.howItWorks')}</button></li>
              <li><button onClick={onReviewsClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.reviews')}</button></li>
              <li><button onClick={onBlogClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.blog')}</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={onFAQClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.faq')}</button></li>
              <li><button onClick={onSupportClick} className="text-gray-300 hover:text-white transition-colors">{t('footer.support')}</button></li>
              <li><button onClick={onWinsClick} className="text-gray-300 hover:text-white transition-colors">Wins</button></li>
              <li><button onClick={onResourcesClick} className="text-gray-300 hover:text-white transition-colors">Resources</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 text-[#4945ff] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+18647293358" className="hover:text-[#4945ff] transition-colors text-lg font-medium">
                    (864) 729-3358
                  </a>
                  <p className="text-xs text-gray-400">{t('footer.hours')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 text-[#4945ff] mr-2 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@deltcapital.com" className="hover:text-[#4945ff] transition-colors">info@deltcapital.com</a>
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
      <div className="bg-[#0A1F35] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}