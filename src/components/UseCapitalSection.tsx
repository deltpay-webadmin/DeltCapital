import {
  Users, TrendingUp, Package, Building2, Megaphone, Wrench,
  ChevronUp, ChevronDown, Plus, Minus,
  ArrowUpRight, Lightbulb,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area,
  ResponsiveContainer,
} from 'recharts';

/*
 * ══════════════════════════════════════════════════════════════
 * DEPLOY CAPITAL STRATEGICALLY — iPhone 17 Feature-Explorer UI
 * ══════════════════════════════════════════════════════════════
 *
 * Layout:  Dark container (#0C0C14) housing a 2-column grid.
 *   Left:  Vertical list of 6 capital categories. Active item
 *          expands to show description + accent details.
 *          Up/Down arrows navigate sequentially.
 *   Right: Interactive data visualization that crossfades when
 *          the active category changes.
 *
 * Micro-interactions:
 *   • List item hover: subtle bg lighten + translateX nudge
 *   • Active item: expand with spring, accent dot pulses
 *   • Chart transition: exit scale-down + fade, enter scale-up
 *   • Chart data points: hover tooltips with custom styling
 *   • Accent color pill on category title
 *
 * Data viz per category:
 *   0 Equipment & Technology  → Donut chart (budget allocation)
 *   1 Vendor Payments         → Horizontal bars (savings tiers)
 *   2 Payroll & Hiring        → Area chart (headcount growth)
 *   3 Business Expansion      → Bar chart (revenue by location)
 *   4 Inventory & Stock       → Stacked bars (demand vs stock)
 *   5 Marketing Campaigns     → Area chart (ROAS over quarters)
 */

interface UseCapitalSectionProps {
  onTalkToSpecialist?: () => void;
}

/* ─── Category data ─── */
const ACCENT = '#0c66e4';
const ACCENT_LIGHT = '#6C63FF';

interface CategoryData {
  icon: typeof Users;
  titleKey: string;
  descKey: string;
  accentColor: string;
  chartData: any[];
  chartType: 'donut' | 'bar' | 'area' | 'horizontalBar' | 'stackedBar';
  chartLabel: string;
  statValue: string;
  statLabel: string;
  kpis: { label: string; value: string; trend?: string }[];
  insight: string;
}

const CHART_COLORS = ['#0c66e4', '#6C63FF', '#9B97FF', '#C4C1FF', '#22C55E', '#F59E0B'];

export function UseCapitalSection({ }: UseCapitalSectionProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const categories: CategoryData[] = [
    {
      icon: Wrench,
      titleKey: 'capital.equipment.title',
      descKey: 'capital.equipment.desc',
      accentColor: '#0c66e4',
      chartType: 'donut',
      chartLabel: 'Budget Allocation',
      statValue: '$45K',
      statLabel: 'Avg. equipment investment',
      chartData: [
        { name: 'Machinery', value: 35 },
        { name: 'Software', value: 25 },
        { name: 'Hardware', value: 20 },
        { name: 'Maintenance', value: 12 },
        { name: 'Training', value: 8 },
      ],
      kpis: [
        { label: 'Avg. Funding', value: '$45K' },
        { label: 'Approval Time', value: '24hrs' },
        { label: 'ROI Increase', value: '+38%', trend: 'up' },
      ],
      insight: 'Businesses that invest in equipment upgrades see an average 38% productivity increase within the first 6 months of deployment.',
    },
    {
      icon: TrendingUp,
      titleKey: 'capital.vendor.title',
      descKey: 'capital.vendor.desc',
      accentColor: '#22C55E',
      chartType: 'horizontalBar',
      chartLabel: 'Early Payment Savings',
      statValue: '2.8%',
      statLabel: 'Avg. discount captured',
      chartData: [
        { name: 'Net 10', savings: 3.2, baseline: 0 },
        { name: 'Net 15', savings: 2.5, baseline: 0 },
        { name: 'Net 20', savings: 1.8, baseline: 0 },
        { name: 'Net 30', savings: 0, baseline: 0 },
      ],
      kpis: [
        { label: 'Avg. Discount', value: '2.8%' },
        { label: 'Annual Savings', value: '$12K', trend: 'up' },
        { label: 'Vendors Paid', value: '340+' },
      ],
      insight: 'Paying vendors on Net 10 terms instead of Net 30 can save your business over $12,000 annually through early payment discounts.',
    },
    {
      icon: Users,
      titleKey: 'capital.payroll.title',
      descKey: 'capital.payroll.desc',
      accentColor: '#6C63FF',
      chartType: 'area',
      chartLabel: 'Team Growth Trajectory',
      statValue: '+12',
      statLabel: 'Avg. hires funded per cycle',
      chartData: [
        { month: 'Jan', headcount: 8 },
        { month: 'Mar', headcount: 11 },
        { month: 'May', headcount: 14 },
        { month: 'Jul', headcount: 18 },
        { month: 'Sep', headcount: 22 },
        { month: 'Nov', headcount: 26 },
      ],
      kpis: [
        { label: 'Avg. Hires', value: '+12' },
        { label: 'Growth Rate', value: '225%', trend: 'up' },
        { label: 'Retention', value: '94%' },
      ],
      insight: 'Funded businesses grow their teams 3x faster than bootstrapped competitors, with 94% employee retention over the first year.',
    },
    {
      icon: Building2,
      titleKey: 'capital.expansion.title',
      descKey: 'capital.expansion.desc',
      accentColor: '#F59E0B',
      chartType: 'bar',
      chartLabel: 'Revenue by Location',
      statValue: '3.2x',
      statLabel: 'Avg. ROI on expansion capital',
      chartData: [
        { location: 'Original', revenue: 320 },
        { location: 'Location 2', revenue: 210 },
        { location: 'Location 3', revenue: 180 },
        { location: 'Projected', revenue: 280 },
      ],
      kpis: [
        { label: 'Avg. ROI', value: '3.2x' },
        { label: 'Break-even', value: '8 mos' },
        { label: 'Revenue Lift', value: '+67%', trend: 'up' },
      ],
      insight: 'New locations typically break even within 8 months and contribute 67% more revenue by year two when properly capitalized.',
    },
    {
      icon: Package,
      titleKey: 'capital.inventory.title',
      descKey: 'capital.inventory.desc',
      accentColor: '#EF4444',
      chartType: 'stackedBar',
      chartLabel: 'Demand vs. Inventory',
      statValue: '94%',
      statLabel: 'Fill rate with funded inventory',
      chartData: [
        { quarter: 'Q1', demand: 120, stock: 95 },
        { quarter: 'Q2', demand: 180, stock: 170 },
        { quarter: 'Q3', demand: 240, stock: 230 },
        { quarter: 'Q4', demand: 300, stock: 290 },
      ],
      kpis: [
        { label: 'Fill Rate', value: '94%' },
        { label: 'Stockouts', value: '-82%', trend: 'up' },
        { label: 'Order Value', value: '+$23K' },
      ],
      insight: 'Businesses with funded inventory maintain a 94% fill rate, reducing lost sales from stockouts by 82% compared to underfunded peers.',
    },
    {
      icon: Megaphone,
      titleKey: 'capital.marketing.title',
      descKey: 'capital.marketing.desc',
      accentColor: '#EC4899',
      chartType: 'area',
      chartLabel: 'ROAS Over Time',
      statValue: '4.7x',
      statLabel: 'Avg. return on ad spend',
      chartData: [
        { month: 'Month 1', roas: 1.2 },
        { month: 'Month 2', roas: 2.1 },
        { month: 'Month 3', roas: 3.4 },
        { month: 'Month 4', roas: 4.1 },
        { month: 'Month 5', roas: 4.5 },
        { month: 'Month 6', roas: 4.7 },
      ],
      kpis: [
        { label: 'Peak ROAS', value: '4.7x' },
        { label: 'CAC Payback', value: '45 days' },
        { label: 'Lead Growth', value: '+310%', trend: 'up' },
      ],
      insight: 'Funded marketing campaigns reach peak ROAS by month 6, with customer acquisition costs paying back in just 45 days on average.',
    },
  ];

  const totalItems = categories.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setIsInView(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goUp = useCallback(() => {
    setActiveIndex((p) => (p - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const goDown = useCallback(() => {
    setActiveIndex((p) => (p + 1) % totalItems);
  }, [totalItems]);

  const active = categories[activeIndex];

  /* ─── Chart renderer ─── */
  const renderChart = (cat: CategoryData) => {
    const tooltipStyle = {
      backgroundColor: '#ffffff',
      border: '1px solid #dcdfe4',
      borderRadius: '8px',
      color: '#172b4d',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(4,30,66,0.08)',
    };

    switch (cat.chartType) {
      case 'donut':
        return (
          <div className="flex items-center justify-center h-full">
            <PieChart width={260} height={260}>
              <Pie
                key="pie"
                data={cat.chartData}
                cx={130} cy={130}
                innerRadius={70} outerRadius={115}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {cat.chartData.map((_: any, i: number) => (
                  <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip key="tooltip" contentStyle={tooltipStyle} />
            </PieChart>
            <div className="ml-4 space-y-2">
              {cat.chartData.map((d: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#172b4d]/70">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span>{d.name}</span>
                  <span className="text-[#172b4d]/40 ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cat.chartData} barSize={40}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(4,30,66,0.06)" />
              <XAxis key="xaxis" dataKey="location" tick={{ fill: 'rgba(4,30,66,0.55)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fill: 'rgba(4,30,66,0.45)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={tooltipStyle} />
              <Bar key="revenue" dataKey="revenue" fill={cat.accentColor} radius={[6, 6, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'horizontalBar':
        return (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cat.chartData} layout="vertical" barSize={24}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(4,30,66,0.06)" />
              <XAxis key="xaxis" type="number" tick={{ fill: 'rgba(4,30,66,0.45)', fontSize: 13 }} axisLine={false} tickLine={false} domain={[0, 4]} unit="%" />
              <YAxis key="yaxis" type="category" dataKey="name" tick={{ fill: 'rgba(4,30,66,0.55)', fontSize: 13 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip key="tooltip" contentStyle={tooltipStyle} />
              <Bar key="savings" dataKey="savings" fill={cat.accentColor} radius={[0, 6, 6, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'stackedBar':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cat.chartData} barSize={36}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(4,30,66,0.06)" />
              <XAxis key="xaxis" dataKey="quarter" tick={{ fill: 'rgba(4,30,66,0.55)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fill: 'rgba(4,30,66,0.45)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={tooltipStyle} />
              <Bar key="demand" dataKey="demand" fill="rgba(4,30,66,0.10)" radius={[6, 6, 0, 0]} animationDuration={1000} name="Demand" />
              <Bar key="stock" dataKey="stock" fill={cat.accentColor} radius={[6, 6, 0, 0]} animationDuration={1200} name="Inventory" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
      default: {
        const dataKey = cat.chartData[0]?.headcount !== undefined ? 'headcount' : 'roas';
        const xKey = cat.chartData[0]?.month !== undefined ? 'month' : 'quarter';
        const gradientId = `gradient-${activeIndex}-${dataKey}`;
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={cat.chartData}>
              <defs key="defs">
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cat.accentColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={cat.accentColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(4,30,66,0.06)" />
              <XAxis key="xaxis" dataKey={xKey} tick={{ fill: 'rgba(4,30,66,0.55)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fill: 'rgba(4,30,66,0.45)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={tooltipStyle} />
              <Area
                key={dataKey}
                type="monotone"
                dataKey={dataKey}
                stroke={cat.accentColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                animationDuration={1200}
                dot={{ r: 4, fill: cat.accentColor, stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: cat.accentColor, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-12 md:py-16 lg:py-20 bg-[#fafbfc] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-8 lg:mb-12">
          <motion.p
            className="uppercase tracking-[0.15em] mb-2"
            style={{ fontSize: '11px', color: '#0c66e4' }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
          >
            USE CASES
          </motion.p>
          <motion.h2
            className="mb-3 lg:mb-4 tracking-tight text-xl sm:text-2xl lg:text-[2rem]"
            style={{ fontWeight: 700, color: '#172b4d' }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('capital.title')}
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('capital.subtitle')}
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════════════
            MAIN EXPLORER — Light container (iPhone 17 style)
            ═══════════════════════════════════════════════════ */}
        <motion.div
          className="rounded-2xl lg:rounded-3xl overflow-hidden bg-[#f1f2f4] border border-[#0c66e40F] shadow-[0_2px_24px_rgba(4,30,66,0.06)]"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.455, 0.03, 0.515, 0.955] }}
        >
          <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[360px_1fr] min-h-[420px] lg:min-h-[480px]">

            {/* ═══ LEFT: Feature list ═══ */}
            <div className="relative px-4 lg:px-6 xl:px-8 py-6 lg:py-8 flex flex-col bg-[#172b4d]">
              {/* Up / Down arrows */}
              <div className="flex items-center gap-2 mb-4 lg:mb-6">
                <button
                  onClick={goUp}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/50 transition-all cursor-pointer"
                  aria-label="Previous category"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={goDown}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/50 transition-all cursor-pointer"
                  aria-label="Next category"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Category items */}
              <div className="flex-1 flex flex-col gap-0.5 lg:gap-1">
                {categories.map((cat, i) => {
                  const isActive = i === activeIndex;
                  const isHovered = i === hoveredItem;
                  const Icon = cat.icon;

                  return (
                    <div key={i}>
                      {/* Item button */}
                      <motion.button
                        className={`
                          w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl flex items-center gap-2.5 lg:gap-3 transition-colors cursor-pointer
                          ${isActive
                            ? 'bg-white/15 shadow-sm'
                            : isHovered
                              ? 'bg-white/8'
                              : 'bg-transparent'
                          }
                        `}
                        onClick={() => setActiveIndex(i)}
                        onMouseEnter={() => setHoveredItem(i)}
                        onMouseLeave={() => setHoveredItem(null)}
                        animate={{ x: isActive ? 4 : isHovered ? 2 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Expand/collapse indicator */}
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border transition-all"
                          style={{
                            borderColor: isActive ? cat.accentColor : 'rgba(255,255,255,0.2)',
                            backgroundColor: isActive ? cat.accentColor : 'transparent',
                          }}
                        >
                          {isActive ? (
                            <Minus className="w-3 h-3 text-white" strokeWidth={2.5} />
                          ) : (
                            <Plus className="w-3 h-3 text-white/40" strokeWidth={2.5} />
                          )}
                        </div>

                        {/* Title */}
                        <span
                          className={`text-sm lg:text-base transition-colors ${
                            isActive ? 'text-white font-semibold' : 'text-white/55'
                          }`}
                        >
                          {t(cat.titleKey)}
                        </span>
                      </motion.button>

                      {/* Expanded detail panel */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.455, 0.03, 0.515, 0.955] }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 lg:px-4 pt-2 pb-3 lg:pb-4 ml-8 lg:ml-9">
                              {/* Description card */}
                              <div className="rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-[13px] lg:text-[15px] leading-relaxed text-white/70 bg-white/8">
                                <span className="text-white font-semibold">{t(cat.titleKey)}.</span>{' '}
                                {t(cat.descKey)}
                              </div>

                              {/* Stat pill */}
                              <div className="mt-3 flex items-center gap-3">
                                <div
                                  className="px-3 py-1.5 rounded-full text-sm font-bold"
                                  style={{ backgroundColor: `${cat.accentColor}25`, color: cat.accentColor }}
                                >
                                  {cat.statValue}
                                </div>
                                <span className="text-xs text-white/40">{cat.statLabel}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Counter at bottom */}
              <div className="mt-3 lg:mt-4 px-4 text-sm text-white/25 tabular-nums">
                <span className="text-white/50 font-semibold">{activeIndex + 1}</span>
                <span className="mx-1">/</span>
                <span>{totalItems}</span>
              </div>
            </div>

            {/* ═══ RIGHT: Data visualization ═══ */}
            <div className="relative border-t lg:border-t-0 lg:border-l border-[#0c66e40F] px-4 lg:px-6 xl:px-10 py-6 lg:py-8 flex flex-col overflow-hidden bg-[#f1f2f4]">

              {/* KPI cards row */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`kpis-${activeIndex}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-3 gap-2 lg:gap-3 mb-4 lg:mb-5"
                >
                  {active.kpis.map((kpi, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[#dcdfe4] px-3 lg:px-4 py-2.5 lg:py-3 bg-[#f1f2f4]/50"
                    >
                      <p className="text-[10px] lg:text-xs text-[#172b4d]/40 mb-0.5 lg:mb-1">{kpi.label}</p>
                      <div className="flex items-center gap-1 lg:gap-1.5">
                        <span className="text-base lg:text-lg font-semibold text-[#172b4d]">{kpi.value}</span>
                        {kpi.trend === 'up' && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#22C55E]" />
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Chart label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`label-${activeIndex}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 flex items-center gap-3"
                >
                  <div className="flex items-center gap-2">
                    <active.icon className="w-5 h-5 text-[#172b4d]/40" />
                    <span className="text-sm text-[#172b4d]/45 uppercase tracking-wider">{active.chartLabel}</span>
                  </div>
                  <div className="flex-1 h-px bg-[#dcdfe4]" />
                  <div
                    className="px-3 py-1 rounded text-xs font-semibold"
                    style={{ backgroundColor: `${active.accentColor}12`, color: active.accentColor }}
                  >
                    {active.statValue}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Chart area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`chart-${activeIndex}`}
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.455, 0.03, 0.515, 0.955] }}
                  className="relative z-10 flex items-center justify-center flex-1 min-h-[200px] lg:min-h-[240px]"
                >
                  {renderChart(active)}
                </motion.div>
              </AnimatePresence>

              {/* Insight callout */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`insight-${activeIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="mt-4 lg:mt-5 flex items-start gap-2.5 lg:gap-3 rounded-xl bg-[#f1f2f4] border border-[#dcdfe4] px-3 lg:px-4 py-2.5 lg:py-3"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${active.accentColor}12` }}
                  >
                    <Lightbulb className="w-3.5 h-3.5" style={{ color: active.accentColor }} />
                  </div>
                  <p className="text-xs lg:text-sm leading-relaxed text-[#172b4d]/60">
                    {active.insight}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom dot navigation (for mobile) ── */}
        <div className="flex items-center justify-center gap-2.5 mt-8 lg:hidden">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="p-1 cursor-pointer"
              aria-label={`Go to ${t(cat.titleKey)}`}
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? 28 : 8,
                  height: 8,
                  backgroundColor: i === activeIndex ? cat.accentColor : 'rgba(0,0,0,0.15)',
                }}
              />
            </button>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        {/* removed — moved to App.tsx above FAQ */}
      </div>
    </section>
  );
}