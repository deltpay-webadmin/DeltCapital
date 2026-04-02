import { X, TrendingUp, DollarSign, Users, BarChart3, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface WhatsNewPageProps {
  onClose: () => void;
}

interface IndustryFact {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  stats: {
    label: string;
    value: string;
    icon: JSX.Element;
  }[];
  content: string[];
}

export function WhatsNewPage({ onClose }: WhatsNewPageProps) {
  const industryFacts: IndustryFact[] = [
    {
      id: 'small-business-funding-2026',
      title: 'Small Business Funding Trends in 2026: Revenue-Based Financing Market Growth',
      category: 'Industry Insights',
      date: 'February 2026',
      excerpt: 'The revenue-based financing industry continues to grow as small businesses seek flexible funding alternatives to traditional bank loans.',
      imageUrl: 'https://images.unsplash.com/photo-1763038311036-6d18805537e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN0YXRpc3RpY3MlMjBkYXRhfGVufDF8fHx8MTc3MDQ5MDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stats: [
        { label: 'Market Growth', value: '23% YoY', icon: <TrendingUp className="w-5 h-5" /> },
        { label: 'Average Advance', value: '$70K', icon: <DollarSign className="w-5 h-5" /> },
        { label: 'Businesses Funded', value: '450K+', icon: <Users className="w-5 h-5" /> }
      ],
      content: [
        'The revenue-based financing industry has experienced remarkable growth in 2026, with market analysis showing a 23% year-over-year increase in total funding volume. This surge reflects small businesses increasingly turning to alternative financing solutions that offer speed and flexibility.',
        'Traditional bank loan approval rates remain stagnant at around 25% for small businesses, while revenue-based financing providers maintain approval rates exceeding 85%. The disparity highlights a fundamental shift in how business owners approach working capital needs.',
        'Industry data reveals that retail businesses, restaurants, and service-based companies represent the largest segments utilizing revenue-based financing. These sectors particularly value the revenue-based repayment structure that aligns with their cash flow patterns.',
        'Looking ahead, experts predict continued expansion as fintech innovation reduces processing times and improves risk assessment accuracy. The average approval time has decreased from 5 days in 2024 to under 24 hours in 2026.'
      ]
    },
    {
      id: 'mca-approval-statistics',
      title: 'Revenue-Based Financing Approval Rates Reach Record Highs: What Business Owners Need to Know',
      category: 'Market Data',
      date: 'February 2026',
      excerpt: 'Recent data shows revenue-based financing approval rates reaching 96% for qualified applicants, dramatically outpacing traditional lending institutions.',
      imageUrl: 'https://images.unsplash.com/photo-1758348607292-60f450b10c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwcmV0YWlsJTIwc3RvcmV8ZW58MXx8fHwxNzcwNDkwNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stats: [
        { label: 'Approval Rate', value: '96%', icon: <BarChart3 className="w-5 h-5" /> },
        { label: 'Avg Processing', value: '24hrs', icon: <Calendar className="w-5 h-5" /> },
        { label: 'Funding Range', value: '$10K-$250K', icon: <DollarSign className="w-5 h-5" /> }
      ],
      content: [
        'Revenue-based financing providers are reporting unprecedented approval rates in 2026, with qualified applicants seeing acceptance rates as high as 96%. This represents a dramatic improvement over traditional bank loans, which typically approve only 1 in 4 small business applications.',
        'The key difference lies in evaluation criteria. While banks focus heavily on credit scores and collateral, revenue-based financing providers primarily assess daily revenue and transaction history. This shift benefits businesses with strong sales but limited assets or imperfect credit.',
        'Processing times have also reached new efficiency benchmarks. Advanced algorithms and automated underwriting systems now enable most applications to receive decisions within 24 hours, with funding often available within 48 hours of approval.',
        'Businesses generating at least $10,000 in monthly revenue with consistent transaction patterns qualify for advances ranging from $10,000 to $250,000. The revenue-based qualification model makes this financing accessible to a broader spectrum of small businesses than traditional financing.'
      ]
    },
    {
      id: 'fintech-innovation-mca',
      title: 'Fintech Innovation Transforms the Revenue-Based Financing Experience: Faster, Smarter, More Accessible',
      category: 'Technology',
      date: 'January 2026',
      excerpt: 'Cutting-edge technology is revolutionizing how businesses access capital, with AI-powered underwriting and instant decision engines.',
      imageUrl: 'https://images.unsplash.com/photo-1726064855857-4540ed3834db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjB0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NzA0NDUxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stats: [
        { label: 'Decision Time', value: '< 1 Hour', icon: <Calendar className="w-5 h-5" /> },
        { label: 'Automation Rate', value: '94%', icon: <BarChart3 className="w-5 h-5" /> },
        { label: 'Mobile Applications', value: '67%', icon: <TrendingUp className="w-5 h-5" /> }
      ],
      content: [
        'Artificial intelligence and machine learning are fundamentally transforming the revenue-based financing industry. Modern platforms now utilize sophisticated algorithms that analyze hundreds of data points in real-time, enabling instant preliminary approvals.',
        'The integration of open banking APIs allows applicants to securely connect their business bank accounts, eliminating the need for manual document submission in many cases. This streamlined approach reduces application time from hours to minutes.',
        'Mobile-first design has become standard, with 67% of applications now submitted via smartphone or tablet. This accessibility enables business owners to apply from anywhere, removing traditional barriers to funding access.',
        'Predictive analytics help both providers and businesses make better decisions. Advanced models can forecast repayment capacity with remarkable accuracy, reducing risk while enabling more competitive pricing for qualified applicants.',
        'The technology revolution extends to post-funding management as well. Real-time dashboards give businesses complete visibility into their advance status, daily payments, and remaining balance—all accessible from any device.'
      ]
    },
    {
      id: 'cash-flow-challenges',
      title: 'Cash Flow Challenges Facing Small Businesses: Industry Survey Results',
      category: 'Research',
      date: 'January 2026',
      excerpt: 'A comprehensive survey reveals that 82% of small businesses experience cash flow gaps, with working capital cited as the #1 concern.',
      imageUrl: 'https://images.unsplash.com/photo-1620365744528-88da1e08ac96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNhc2glMjBmbG93JTIwY2hhcnR8ZW58MXx8fHwxNzcwNDkwNTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stats: [
        { label: 'Experience Gaps', value: '82%', icon: <BarChart3 className="w-5 h-5" /> },
        { label: 'Avg Gap Duration', value: '45 Days', icon: <Calendar className="w-5 h-5" /> },
        { label: 'Impact on Growth', value: '63%', icon: <TrendingUp className="w-5 h-5" /> }
      ],
      content: [
        'Recent industry research conducted across 5,000 small businesses reveals that cash flow management remains the single biggest challenge facing entrepreneurs. An overwhelming 82% reported experiencing at least one significant cash flow gap in the past 12 months.',
        'The average cash flow gap lasts 45 days, during which businesses struggle to meet payroll, pay suppliers, or invest in growth opportunities. These gaps often occur due to seasonal fluctuations, delayed customer payments, or unexpected expenses.',
        'Perhaps most concerning, 63% of surveyed businesses reported that cash flow constraints directly limited their growth potential. Opportunities for expansion, inventory investment, or marketing initiatives went unrealized due to capital constraints.',
        'Traditional financing options often fail to address these timing issues effectively. Bank loans require weeks for approval—far too slow when immediate working capital is needed. Credit cards carry high interest rates and don\'t solve larger funding needs.',
        'This is where revenue-based financing fills a critical gap. The ability to access working capital within 24-48 hours enables businesses to seize opportunities, smooth cash flow fluctuations, and maintain operational stability during challenging periods.'
      ]
    },
    {
      id: 'retail-restaurant-funding',
      title: 'Retail and Restaurant Sectors Lead Revenue-Based Financing Adoption: Sector-Specific Insights',
      category: 'Industry Analysis',
      date: 'December 2025',
      excerpt: 'Analysis shows retail and restaurant businesses account for 58% of all revenue-based financing, driven by seasonal needs and daily revenue patterns.',
      imageUrl: 'https://images.unsplash.com/photo-1720048091816-cb6d3c0333be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjaGFudCUyMHBheW1lbnQlMjB0ZXJtaW5hbHxlbnwxfHx8fDE3NzA0OTA1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stats: [
        { label: 'Market Share', value: '58%', icon: <BarChart3 className="w-5 h-5" /> },
        { label: 'Avg Advance', value: '$65K', icon: <DollarSign className="w-5 h-5" /> },
        { label: 'Repeat Rate', value: '74%', icon: <TrendingUp className="w-5 h-5" /> }
      ],
      content: [
        'Sector-specific analysis reveals that retail stores and restaurants are the primary adopters of revenue-based financing, collectively representing 58% of total volume. The revenue characteristics of these businesses make this financing model particularly well-suited to their needs.',
        'Retail businesses utilize revenue-based financing primarily for inventory purchases ahead of peak seasons, store renovations, and equipment upgrades. The ability to repay through a percentage of daily sales aligns perfectly with retail\'s transaction-heavy business model.',
        'Restaurants face unique cash flow challenges including food cost volatility, equipment failures, and seasonal fluctuations. Revenue-based financing enables quick response to these issues without the delay and documentation requirements of traditional loans.',
        'The repeat customer rate of 74% in these sectors demonstrates strong satisfaction with the revenue-based financing model. Business owners appreciate the simplicity, speed, and flexibility compared to conventional financing options.',
        'Average advance amounts in retail and restaurant sectors cluster around $65,000—ideal for significant investments like kitchen equipment, POS system upgrades, or seasonal inventory stock, while remaining manageable for repayment through daily revenue.'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="min-h-screen py-8 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl mx-auto bg-white dark:bg-[#0A1F35] rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1B17FF] via-[#4A47FF] to-[#7B77FF] text-white px-6 md:px-12 py-8 md:py-12 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="max-w-3xl">
              <div className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold mb-4">
                Industry Updates
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                What's New
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Latest industry insights, market trends, and facts about small business funding
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-12">
            <div className="space-y-12">
              {industryFacts.map((fact, index) => (
                <motion.article
                  key={fact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-12 last:pb-0"
                >
                  {/* Article Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#1B17FF]/10 dark:bg-[#1B17FF]/20 text-[#1B17FF] dark:text-[#7B77FF] rounded-full text-sm font-semibold">
                      {fact.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {fact.date}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {fact.title}
                  </h2>

                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {fact.excerpt}
                  </p>

                  {/* Image */}
                  <div className="mb-8 rounded-xl overflow-hidden">
                    <img 
                      src={fact.imageUrl} 
                      alt={fact.title}
                      className="w-full h-64 md:h-96 object-cover"
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {fact.stats.map((stat, idx) => (
                      <div 
                        key={idx}
                        className="bg-[#F5F7FA] dark:bg-[#0f1f2e] rounded-lg p-5 flex items-start gap-4"
                      >
                        <div className="text-[#1B17FF] dark:text-[#7B77FF] mt-1">
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {fact.content.map((paragraph, idx) => (
                      <p 
                        key={idx}
                        className="text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-12 bg-gradient-to-br from-[#1B17FF] via-[#4A47FF] to-[#7B77FF] rounded-2xl p-8 md:p-12 text-center text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Join the Growing Number of Funded Businesses?
              </h3>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Get instant approval and access working capital within 24-48 hours
              </p>
              <button
                onClick={onClose}
                className="bg-white text-[#1B17FF] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                Explore Our Solutions
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
