import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CTASectionProps {
  onApplyClick: () => void;
}

export function CTASection({ onApplyClick }: CTASectionProps) {
  const { t } = useLanguage();

  return (
    <>
      <section className="py-24 bg-[#041E42] dark:bg-[#0A1F35] relative overflow-hidden">
        {/* Background decoration - subtle */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#4945ff] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4945ff] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-[#CBD2D9] max-w-3xl mx-auto mb-8">
              {t('cta.subtitle')}
            </p>

            <Button 
              onClick={onApplyClick}
              size="lg" 
              className="bg-[#4945ff] hover:bg-[#3b38d9] text-white text-lg px-12 py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all"
            >
              {t('cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Visual Separator */}
      <div className="bg-gradient-to-b from-[#041E42] via-[#0A2840] to-[#ededf6] dark:from-[#0A1F35] dark:via-[#0D2538] dark:to-[#132030] h-24"></div>
    </>
  );
}