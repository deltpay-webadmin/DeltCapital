import { X, ArrowLeft, ChevronDown, Filter, Calendar, TrendingUp, Briefcase, Wrench, Grid3x3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Footer } from './Footer';
import { BlogPostPlaidPartnership } from './blog-posts/BlogPostPlaidPartnership';
import { BlogPostInterchange } from './blog-posts/BlogPostInterchange';
import { BlogPostMCAvsLoans } from './blog-posts/BlogPostMCAvsLoans';
import { BlogPostCashFlowMastery } from './blog-posts/BlogPostCashFlowMastery';
import { BlogPostKPIs } from './blog-posts/BlogPostKPIs';
import { BlogPostQualifying } from './blog-posts/BlogPostQualifying';
import { BlogPostSeasonal } from './blog-posts/BlogPostSeasonal';
import { BlogPostCustomerRetention } from './blog-posts/BlogPostCustomerRetention';
import { BlogPostEmergency } from './blog-posts/BlogPostEmergency';
import { BlogPostRestaurant } from './blog-posts/BlogPostRestaurant';
import { BlogPostRetail } from './blog-posts/BlogPostRetail';
import { BlogPostPricingStrategy } from './blog-posts/BlogPostPricingStrategy';
import { BlogPostMarketing } from './blog-posts/BlogPostMarketing';
import { BlogPostEquipment } from './blog-posts/BlogPostEquipment';
import { BlogPostExpansion } from './blog-posts/BlogPostExpansion';
import { BlogPostEcommerce } from './blog-posts/BlogPostEcommerce';
import { BlogPostConstruction } from './blog-posts/BlogPostConstruction';
import { BlogPostBusinessCredit } from './blog-posts/BlogPostBusinessCredit';
import { BlogPostTaxPlanning } from './blog-posts/BlogPostTaxPlanning';
import { BlogPostTimeManagement } from './blog-posts/BlogPostTimeManagement';
import { BlogPostSupplyChain } from './blog-posts/BlogPostSupplyChain';

interface BlogPageProps {
  onClose: () => void;
  onAboutClick?: () => void;
  onHowItWorksClick?: () => void;
  onReviewsClick?: () => void;
  onBlogClick?: () => void;
  onFAQClick?: () => void;
  onSupportClick?: () => void;
  onWinsClick?: () => void;
  onApplyClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
  onResourcesClick?: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  component: JSX.Element;
}

export function BlogPage({ onClose, onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick, onFAQClick, onSupportClick, onWinsClick, onApplyClick, onPrivacyClick, onTermsClick, onDisclosuresClick, onResourcesClick }: BlogPageProps) {
  const { t } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const blogPosts: BlogPost[] = [
    // What's New - Latest Updates
    {
      id: 'plaid-partnership-2026',
      title: 'Delt Capital Partners with Plaid for Instant Bank Verification',
      subtitle: 'Major announcement: We\'ve partnered with Plaid to offer instant, secure bank account verification. Connect your bank in seconds, get approved faster than ever. Learn how this changes everything...',
      date: 'February 11, 2026',
      author: 'Delt Capital Team',
      category: 'What\'s New',
      imageUrl: 'https://images.unsplash.com/photo-1726064855971-f12e80d59680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW50ZWNoJTIwdGVjaG5vbG9neSUyMGRpZ2l0YWwlMjBiYW5raW5nJTIwc2VjdXJpdHl8ZW58MXx8fHwxNzcwODI1NzUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      component: <BlogPostPlaidPartnership />
    },
    
    // 2026 Articles
    {
      id: 'mca-growth-stories',
      title: 'How Small Businesses Are Achieving Explosive Growth with Revenue-Based Financing',
      subtitle: 'Real success stories of businesses that used revenue-based financing to scale faster than they ever imagined. From doubling inventory to opening new locations in months, not years...',
      date: 'February 6, 2026',
      author: 'Delt Capital Team',
      category: 'Success Stories',
      imageUrl: 'https://images.unsplash.com/photo-1758519289022-5f9dea0d8cdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBncm93dGglMjBjaGFydCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzcwNDAwNTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      component: <BlogPostInterchange />
    },
    {
      id: 'mca-vs-traditional-loans',
      title: 'Why Smart Business Owners Choose Revenue-Based Financing Over Traditional Loans',
      subtitle: 'Traditional banks say no to 82% of small business loan applications. Revenue-Based Financing says yes in 24 hours. No collateral, no perfect credit required, just revenue. Here\'s why it\'s revolutionizing...',
      date: 'February 5, 2026',
      author: 'Delt Capital Team',
      category: 'Growth',
      imageUrl: 'https://images.unsplash.com/photo-1758518726324-62bef7c815b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBvZmZpY2UlMjBwcm9mZXNzaW9uYWxzfGVufDF8fHx8MTc3MDM2MDAyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      component: <BlogPostMCAvsLoans />
    },
    {
      id: 'pricing-strategy',
      title: 'Pricing Psychology: How to Price Your Services for Maximum Profitability',
      subtitle: 'Stop leaving money on the table. Most small businesses underprice by 20-40%. Learn value-based pricing, anchoring strategies, and the psychology that lets you charge what you\'re actually worth...',
      date: 'February 4, 2026',
      author: 'Delt Capital Team',
      category: 'Business Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1554224311-beee4ead24b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostPricingStrategy />
    },
    {
      id: 'cash-flow-mastery',
      title: 'Cash Flow Mastery: 7 Strategies Every Small Business Owner Must Know',
      subtitle: 'You can be profitable on paper and still fail if you run out of cash. Master weekly forecasting, accelerate receivables, negotiate supplier terms, and build reserves that protect your business...',
      date: 'February 3, 2026',
      author: 'Delt Capital Team',
      category: 'Business Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostCashFlowMastery />
    },
    {
      id: 'qualifying-for-business-funding',
      title: '96% Approval Rate: How to Get Approved for Revenue-Based Financing in 24 Hours',
      subtitle: 'Bad credit? No problem. No collateral? Perfect. Just $10K in monthly revenue? You qualify. Discover the simple requirements that help almost every business get approved for growth capital...',
      date: 'February 2, 2026',
      author: 'Delt Capital Team',
      category: 'Getting Started',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostQualifying />
    },
    {
      id: 'seasonal-business-funding',
      title: 'Seasonal Business Owners: How to Dominate Your Peak Season with Revenue-Based Financing',
      subtitle: 'Stock up before your competitors. Hire the best talent early. Market aggressively when it matters most. Revenue-Based Financing gives seasonal businesses the capital to win when stakes are highest...',
      date: 'February 1, 2026',
      author: 'Delt Capital Team',
      category: 'Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostSeasonal />
    },
    {
      id: 'customer-retention-strategy',
      title: 'Customer Retention: The Most Profitable Growth Strategy You\'re Ignoring',
      subtitle: 'Acquiring new customers costs 5-25X more than retaining existing ones. A 5% increase in retention can boost profits by 95%. Learn post-purchase strategies, loyalty programs, and win-back campaigns...',
      date: 'January 31, 2026',
      author: 'Delt Capital Team',
      category: 'Business Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostCustomerRetention />
    },
    {
      id: 'emergency-business-funding',
      title: 'From Emergency to Opportunity: How Fast Capital Transforms Crisis Into Growth',
      subtitle: 'Equipment breaks. Inventory sells out overnight. A once-in-a-lifetime deal appears. With 24-48 hour funding, you\'re never caught flat-footed. Turn every challenge into your competitive...',
      date: 'January 30, 2026',
      author: 'Delt Capital Team',
      category: 'Growth',
      imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostEmergency />
    },

    // 2025 Articles
    {
      id: 'restaurant-funding-2025',
      title: 'Restaurant Funding Guide: How Revenue-Based Financing Helps Food Service Businesses Thrive',
      subtitle: 'From food trucks to fine dining, restaurants need capital for equipment, inventory, and expansion. Discover why 73% of successful restaurants use fast funding to fuel growth without waiting weeks...',
      date: 'September 15, 2025',
      author: 'Delt Capital Team',
      category: 'Industry Guide',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostRestaurant />
    },
    {
      id: 'retail-expansion-2025',
      title: 'Retail Revolution: How Brick-and-Mortar Stores Are Winning with Smart Funding',
      subtitle: 'E-commerce isn\'t killing retail—lack of capital is. Smart retailers are using Revenue-Based Financing to refresh inventory faster, upgrade experiences, and outcompete online rivals. Here\'s their playbook...',
      date: 'May 22, 2025',
      author: 'Delt Capital Team',
      category: 'Industry Guide',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostRetail />
    },
    {
      id: 'business-kpis-2025',
      title: 'Essential Business KPIs: Track These Metrics or Risk Failure',
      subtitle: 'You can\'t manage what you don\'t measure. Learn the 6 KPIs that separate scaling businesses from struggling ones: gross margin, CAC, LTV, operating cash flow, revenue per employee, and NPS...',
      date: 'February 8, 2025',
      author: 'Delt Capital Team',
      category: 'Business Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostKPIs />
    },

    // 2024 Articles
    {
      id: 'marketing-investment-2024',
      title: 'Marketing That Pays for Itself: Using Revenue-Based Financing to Dominate Your Market',
      subtitle: 'The best time to invest in marketing is when you can\'t afford to. Revenue-Based Financing lets you launch aggressive campaigns today and pay from the revenue they generate. Scale your brand without draining reserves...',
      date: 'October 12, 2024',
      author: 'Delt Capital Team',
      category: 'Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostMarketing />
    },
    {
      id: 'equipment-financing-2024',
      title: 'Equipment Financing Reimagined: Why Revenue-Based Financing Beats Traditional Equipment Loans',
      subtitle: 'Equipment loans take weeks and require collateral. Revenue-Based Financing provides capital in 24 hours with no equipment liens. Upgrade technology, replace broken machinery, or expand capacity—instantly...',
      date: 'June 18, 2024',
      author: 'Delt Capital Team',
      category: 'Equipment',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostEquipment />
    },
    {
      id: 'multi-location-2024',
      title: 'Multi-Location Mastery: Scaling from One Store to Empire with Revenue-Based Financing',
      subtitle: 'Your first location is proof. Your second is momentum. Your third is a pattern. Revenue-Based Financing helps ambitious owners open multiple locations faster than traditional financing ever could...',
      date: 'March 3, 2024',
      author: 'Delt Capital Team',
      category: 'Expansion',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostExpansion />
    },

    // 2023 Articles
    {
      id: 'ecommerce-growth-2023',
      title: 'E-Commerce Explosive Growth: How Online Retailers Scale with Fast Capital',
      subtitle: 'Peak season waits for no one. When your products go viral or holidays approach, fast capital gives e-commerce sellers the inventory capital to capitalize on momentum before the moment passes...',
      date: 'November 7, 2023',
      author: 'Delt Capital Team',
      category: 'Industry Guide',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostEcommerce />
    },
    {
      id: 'construction-contractors-2023',
      title: 'Construction & Contractors: How to Win Bigger Bids with Revenue-Based Working Capital',
      subtitle: 'Big projects require upfront material costs and payroll. Traditional financing can\'t move fast enough. Revenue-Based Financing provides the working capital contractors need to bid on and win lucrative contracts...',
      date: 'July 25, 2023',
      author: 'Delt Capital Team',
      category: 'Industry Guide',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostConstruction />
    },
    {
      id: 'business-credit-building-2023',
      title: 'Building Business Credit: A Step-by-Step Guide to Financial Credibility',
      subtitle: 'The businesses that recovered fastest didn\'t wait for "normal" to return—they invested in growth immediately. MCA provided the capital cushion that turned survival into thriving...',
      date: 'April 14, 2023',
      author: 'Delt Capital Team',
      category: 'Business Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostBusinessCredit />
    },

    // 2022 Articles
    {
      id: 'tax-planning-2022',
      title: 'Tax Planning for Small Business Owners: Keep More of What You Earn',
      subtitle: 'Most small businesses overpay taxes by $10K-$50K annually. Learn strategic tax planning: S-Corp structures, retirement contributions, Section 179 deductions, home office write-offs, and quarterly estimates...',
      date: 'October 30, 2022',
      author: 'Delt Capital Team',
      category: 'Business Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostTaxPlanning />
    },
    {
      id: 'time-management-2022',
      title: 'Time Management for Entrepreneurs: Work Smarter, Not Just Harder',
      subtitle: 'The difference between $50K and $500K entrepreneurs isn\'t effort—it\'s leverage. Learn the $10/$100/$1000 per hour framework, time blocking, delegation systems, and how to protect your energy...',
      date: 'June 19, 2022',
      author: 'Delt Capital Team',
      category: 'Business Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostTimeManagement />
    },
    {
      id: 'supply-chain-2022',
      title: 'Supply Chain Solutions: Navigate Disruptions with Strategic Capital Reserves',
      subtitle: 'Supply chain chaos rewards the prepared. When prices spike or availability drops, businesses with capital reserves can buy in bulk, lock in rates, and gain advantages competitors can\'t match...',
      date: 'February 27, 2022',
      author: 'Delt Capital Team',
      category: 'Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      component: <BlogPostSupplyChain />
    }
  ];

  // Get unique categories and count
  const allCategories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  const getCategoryCount = (category: string) => {
    if (category === 'All') return blogPosts.length;
    return blogPosts.filter(post => post.category === category).length;
  };

  // Featured categories shown as pills
  const featuredCategories = ['All', 'What\'s New', 'Business Strategy', 'Growth'];
  // Remaining categories for dropdown
  const dropdownCategories = allCategories.filter(cat => !featuredCategories.includes(cat));

  // Filter and sort posts
  const filteredAndSortedPosts = blogPosts
    .filter(post => selectedCategory === 'All' || post.category === selectedCategory)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  if (selectedPost) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white dark:bg-[#0A1F35] z-50 overflow-y-auto"
        >
          <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-[#0A1F35]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-[#6B7280] hover:text-[#4945ff] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <div className="inline-block px-3 py-1 bg-[#4945ff]/10 text-[#4945ff] rounded-full text-sm mb-4">
                  {selectedPost.category}
                </div>
                <h1 className="text-4xl lg:text-5xl text-[#041E42] dark:text-white mb-6 leading-tight">
                  {selectedPost.title}
                </h1>
                <div className="text-sm text-[#9CA3AF] dark:text-gray-400">
                  {selectedPost.author} • {selectedPost.date}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {selectedPost.component}
              </motion.div>
            </article>
            <Footer
              onAboutClick={onAboutClick || (() => {})}
              onHowItWorksClick={onHowItWorksClick || (() => {})}
              onReviewsClick={onReviewsClick || (() => {})}
              onBlogClick={onBlogClick || (() => {})}
              onFAQClick={onFAQClick || (() => {})}
              onSupportClick={onSupportClick || (() => {})}
              onWinsClick={onWinsClick || (() => {})}
              onApplyClick={onApplyClick || (() => {})}
              onPrivacyClick={onPrivacyClick}
              onTermsClick={onTermsClick}
              onDisclosuresClick={onDisclosuresClick}
              onResourcesClick={onResourcesClick}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#ededf6] z-50 overflow-y-auto"
    >
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-[#ededf6] border-b border-[#041E42]/10 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h1 className="text-4xl text-[#041E42] mb-1">
                  What's new
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 ? 'article' : 'articles'}
                </p>
              </motion.div>
            </div>

            {/* Filter and Sort Controls */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mr-1">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Topics:</span>
                </div>
                
                {/* Featured Categories */}
                {featuredCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowDropdown(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-[#4945ff] text-white shadow-lg shadow-[#4945ff]/25'
                        : 'bg-white dark:bg-[#0F2744] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a3a52] border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {category === 'All' ? `All (${getCategoryCount(category)})` : category}
                  </button>
                ))}

                {/* More Topics Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                      dropdownCategories.includes(selectedCategory)
                        ? 'bg-[#4945ff] text-white shadow-lg shadow-[#4945ff]/25'
                        : 'bg-white dark:bg-[#0F2744] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a3a52] border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    More Topics
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-[#0F2744] rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-20"
                      >
                        <div className="p-2 max-h-80 overflow-y-auto">
                          {dropdownCategories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                                selectedCategory === category
                                  ? 'bg-[#4945ff]/10 text-[#4945ff] font-medium'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a3a52]'
                              }`}
                            >
                              <span>{category}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {getCategoryCount(category)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <div className="flex gap-1 bg-white dark:bg-[#0F2744] rounded-full p-1 border border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setSortOrder('newest')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      sortOrder === 'newest'
                        ? 'bg-[#4945ff] text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a3a52]'
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortOrder('oldest')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      sortOrder === 'oldest'
                        ? 'bg-[#4945ff] text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a3a52]'
                    }`}
                  >
                    Oldest
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No articles found in this category.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAndSortedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPost(post)}
                className="group bg-white dark:bg-[#0F2744] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                  {/* Text Content */}
                  <div className="flex-1 order-2 md:order-1">
                    <div className="inline-block px-3 py-1 bg-[#4945ff]/10 text-[#4945ff] rounded-full text-sm mb-4">
                      {post.category}
                    </div>
                    
                    <h2 className="text-2xl lg:text-3xl text-[#041E42] dark:text-white mb-4 group-hover:text-[#4945ff] dark:group-hover:text-[#5B57FF] transition-colors leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-[#6B7280] dark:text-gray-400 leading-relaxed mb-6">
                      {post.subtitle}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#9CA3AF] dark:text-gray-500">
                        {post.date}
                      </div>
                      <span className="text-[#4945ff] hover:text-[#3b38d9] transition-colors inline-flex items-center gap-2 group-hover:gap-3">
                        Read more
                        <span className="transition-all">→</span>
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="md:w-80 h-56 md:h-auto flex-shrink-0 order-1 md:order-2">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
              ))}
            </div>
          )}
        </div>

      </div>
      <Footer
        onAboutClick={onAboutClick || (() => {})}
        onHowItWorksClick={onHowItWorksClick || (() => {})}
        onReviewsClick={onReviewsClick || (() => {})}
        onBlogClick={onBlogClick || (() => {})}
        onFAQClick={onFAQClick || (() => {})}
        onSupportClick={onSupportClick || (() => {})}
        onWinsClick={onWinsClick || (() => {})}
        onApplyClick={onApplyClick || (() => {})}
        onPrivacyClick={onPrivacyClick}
        onTermsClick={onTermsClick}
        onDisclosuresClick={onDisclosuresClick}
        onResourcesClick={onResourcesClick}
      />
    </motion.div>
  );
}