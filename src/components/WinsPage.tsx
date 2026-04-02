import { ArrowLeft, X, TrendingUp, Calendar, Users, Star, DollarSign, Quote, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Footer } from './Footer';
import { useLanguage } from '../contexts/LanguageContext';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
import poweredByDelt from 'figma:asset/4c27a0458c6dd6bcc420848937c08b3e8f4294bf.png';
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

export function WinsPage({ onClose, onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick, onFAQClick, onSupportClick, onWinsClick, onApplyClick, onQuizClick, onPrivacyClick, onTermsClick, onDisclosuresClick }: WinsPageProps) {
  const { t } = useLanguage();

  const successStories = [
    {
      name: "Maria Rodriguez",
      business: "La Rosa Restaurant",
      industry: "Restaurant",
      location: "Miami, FL",
      image: mariaImage,
      fundingAmount: "$110,000",
      fundingDate: "January 2025",
      achievement: "Opened second location",
      quote: "The funding from Delt Capital allowed us to open our second location 6 months ahead of schedule. The process was incredibly smooth and fast!",
      metrics: [
        { labelKey: "wins.story.revenueGrowth", value: "32%", icon: TrendingUp },
        { labelKey: "wins.story.timeToFund", value: "36 hrs", icon: Calendar },
        { labelKey: "wins.story.newEmployees", value: "5", icon: Users }
      ]
    },
    {
      name: "Mike Rosario",
      business: "Rosario Construction LLC",
      industry: "Construction",
      location: "Irving, TX",
      image: mikeImage,
      fundingAmount: "$180,000",
      fundingDate: "December 2024",
      achievement: "Purchased new equipment & expanded shop",
      quote: "With Delt's Revenue-Based Financing, I was able to upgrade all my equipment without the stress of traditional bank loans. Game changer for my business.",
      metrics: [
        { labelKey: "wins.story.monthlyRevenue", value: "+$18K", icon: DollarSign },
        { labelKey: "wins.story.approvalTime", value: "12 hrs", icon: Calendar },
        { labelKey: "wins.story.customerGrowth", value: "22%", icon: TrendingUp }
      ]
    },
    {
      name: "Sarah Thompson",
      business: "Bloom Beauty Salon",
      industry: "Beauty & Wellness",
      location: "Austin, TX",
      image: sarahImage,
      fundingAmount: "$65,000",
      fundingDate: "November 2024",
      achievement: "Renovated salon & added spa services",
      quote: "I was nervous about taking on financing, but Delt made it so easy. Now my salon is thriving with our new spa services!",
      metrics: [
        { labelKey: "wins.story.serviceExpansion", value: "3 New", icon: Star },
        { labelKey: "wins.story.fundingSpeed", value: "24 hrs", icon: Calendar },
        { labelKey: "wins.story.clientBase", value: "+65", icon: Users }
      ]
    },
    {
      name: "Marcus Williams",
      business: "Williams Logistics",
      industry: "Transportation",
      location: "Atlanta, GA",
      image: marcusImage,
      fundingAmount: "$80,000",
      fundingDate: "October 2024",
      achievement: "Upgraded fleet maintenance & equipment",
      quote: "Delt Capital helped me seize a time-sensitive opportunity to upgrade my operation. Their speed and flexibility were exactly what I needed.",
      metrics: [
        { labelKey: "wins.story.fleetGrowth", value: "+1 Route", icon: TrendingUp },
        { labelKey: "wins.story.revenueIncrease", value: "+$9K", icon: DollarSign },
        { labelKey: "wins.story.processingTime", value: "48 hrs", icon: Calendar }
      ]
    },
    {
      name: "Emily Ward",
      business: "Emily's Market",
      industry: "Retail",
      location: "Seattle, WA",
      image: emilyImage,
      fundingAmount: "$50,000",
      fundingDate: "September 2024",
      achievement: "Upgraded inventory & POS systems",
      quote: "The holiday season was approaching, and I needed capital fast to stock up. Delt came through in record time!",
      metrics: [
        { labelKey: "wins.story.salesGrowth", value: "18%", icon: TrendingUp },
        { labelKey: "wins.story.inventoryValue", value: "+$18K", icon: DollarSign },
        { labelKey: "wins.story.fundedIn", value: "32 hrs", icon: Calendar }
      ]
    },
    {
      name: "David Roberts",
      business: "Roberts Auto Service",
      industry: "Automotive",
      location: "Phoenix, AZ",
      image: davidImage,
      fundingAmount: "$95,000",
      fundingDate: "August 2024",
      achievement: "Hired new techs & purchased equipment",
      quote: "Traditional banks turned me down, but Delt saw the potential in my business. Now I'm taking on larger projects than ever!",
      metrics: [
        { labelKey: "wins.story.projectSize", value: "+35%", icon: TrendingUp },
        { labelKey: "wins.story.teamGrowth", value: "2 Staff", icon: Users },
        { labelKey: "wins.story.approvalTime", value: "6 hrs", icon: Calendar }
      ]
    }
  ];

  const aggregateStats = [
    {
      value: "$2.4M+",
      labelKey: "wins.stats.totalCapital",
      descKey: "wins.stats.totalCapital.desc",
      icon: DollarSign
    },
    {
      value: "24 hrs",
      labelKey: "wins.stats.avgFunding",
      descKey: "wins.stats.avgFunding.desc",
      icon: Calendar
    },
    {
      value: "93%",
      labelKey: "wins.stats.avgRevenue",
      descKey: "wins.stats.avgRevenue.desc",
      icon: TrendingUp
    },
    {
      value: "4.9/5",
      labelKey: "wins.stats.satisfaction",
      descKey: "wins.stats.satisfaction.desc",
      icon: Star
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#ededf6] dark:bg-[#0A1F35] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#ededf6] dark:bg-[#0a1929] border-b border-[#041E42]/10 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-0 h-14 w-auto cursor-pointer" onClick={onClose}>
            <img src={logoImg} alt="Delt Capital" className="h-10 w-auto object-contain" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#ededf6] dark:bg-[#0A1F35] pt-16 pb-12 md:pt-20 md:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-500 dark:text-gray-400 font-light mb-2">
              Capital is the start.
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-[#041E42] dark:text-white mb-6 tracking-tight" style={{ fontWeight: 700 }}>
              The <em className="text-[#4945ff] not-italic" style={{ fontStyle: 'italic' }}>relationship</em> is the point.
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-light">
              Real merchants. Real results.
            </p>
          </div>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aggregateStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4945ff] to-[#7B77FF] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t(stat.labelKey)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t(stat.descKey)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Stories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-12">
          {successStories.map((story, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-auto overflow-hidden group">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Dark overlay with hover effect */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 z-[1]"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 z-[15]">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full mb-2">
                      <span className="text-white text-xs font-medium">{story.industry}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{story.name}</h3>
                    <p className="text-white/90 text-sm">{story.business} • {story.location}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <Quote className="w-8 h-8 text-[#4945ff] flex-shrink-0 opacity-50" />
                    <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      "{story.quote}"
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-[#4945ff]/5 to-[#7B77FF]/5 dark:from-[#4945ff]/10 dark:to-[#7B77FF]/10 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('wins.story.fundedAmount')}</span>
                      <span className="text-2xl font-bold text-[#4945ff]">{story.fundingAmount}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('wins.story.fundingDate')}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{story.fundingDate}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{story.achievement}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {story.metrics.map((metric, idx) => {
                      const MetricIcon = metric.icon;
                      return (
                        <div key={idx} className="text-center">
                          <div className="flex justify-center mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4945ff]/10 to-[#7B77FF]/10 flex items-center justify-center">
                              <MetricIcon className="w-5 h-5 text-[#4945ff]" />
                            </div>
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t(metric.labelKey)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#4945ff] via-[#5B57FF] to-[#7B77FF] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('wins.cta.title').split(t('wins.cta.your'))[0]}<span className="italic font-light">{t('wins.cta.your')}</span>{t('wins.cta.title').split(t('wins.cta.your'))[1]}
          </h2>
          <p className="text-lg text-white/90 mb-8">
            {t('wins.cta.subtitle')}
          </p>
          
          {/* Email Input */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-4 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
              <Button 
                className="bg-white hover:bg-gray-100 text-[#4945ff] font-semibold px-8 py-4 shadow-xl hover:shadow-2xl transition-all hover:scale-105 whitespace-nowrap"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white underline text-sm transition-colors"
          >
            Or return to application
          </button>
        </div>
      </div>

      {/* Disclaimer Note */}
      <div className="bg-[#041E42] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
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