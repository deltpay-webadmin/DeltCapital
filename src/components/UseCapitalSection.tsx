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
    <section ref={sectionRef} className="py-20 md:py-24 lg:py-28 bg-[#fafbfc] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header — eyebrow + bold display headline + sub ─── */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <motion.span
            className="block uppercase text-[#0c66e4]"
            style={{ fontSize: 11, letterSpacing: '0.32em', fontWeight: 700 }}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
          >
            Use cases
          </motion.span>
          <motion.h2
            className="mt-4 text-[#172b4d]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.0,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {t('capital.title').split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-gradient-primary">{word}</span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </motion.h2>
          <motion.p
            className="mt-5 text-[#44546f] max-w-2xl"
            style={{ fontSize: 17, lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t('capital.subtitle')}
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════════════
            MAIN EXPLORER — Gradient-ring shell with mesh halo
            ═══════════════════════════════════════════════════ */}
        <div className="relative">
          {/* Mesh halo */}
          <div aria-hidden className="bg-mesh absolute -inset-6 md:-inset-10 opacity-35 pointer-events-none" />

          <motion.div
            className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-white"
            style={{
              boxShadow:
                '0 30px 80px -28px rgba(12,102,228,0.30), 0 8px 28px -10px rgba(110,93,198,0.18)',
            }}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Gradient ring (mask-composite) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl lg:rounded-3xl z-20"
              style={{
                padding: 1.5,
                background:
                  'rgba(12,102,228,0.35)',
                WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            <div className="grid lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] min-h-[460px] lg:min-h-[520px]">

              {/* ═══ LEFT: Feature list — dark navy with mesh glow ═══ */}
              <div className="relative px-5 lg:px-6 xl:px-8 py-7 lg:py-9 flex flex-col bg-[#172b4d] overflow-hidden">
                {/* Mesh-screen glow */}
                <div
                  aria-hidden
                  className="bg-mesh absolute inset-0 opacity-25 pointer-events-none"
                  style={{ mixBlendMode: 'screen' }}
                />

                <div className="relative flex flex-col h-full">
                  {/* Column kicker */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="uppercase text-[#85B8FF]"
                      style={{ fontSize: 10, letterSpacing: '0.32em', fontWeight: 700 }}
                    >
                      Browse · {totalItems} use cases
                    </span>
                    {/* Up / Down glass chips */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={goUp}
                        className="w-8 h-8 rounded-full border backdrop-blur-md text-white/65 hover:text-white hover:bg-white/[0.10] transition-colors flex items-center justify-center"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          borderColor: 'rgba(255,255,255,0.12)',
                        }}
                        aria-label="Previous category"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={goDown}
                        className="w-8 h-8 rounded-full border backdrop-blur-md text-white/65 hover:text-white hover:bg-white/[0.10] transition-colors flex items-center justify-center"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          borderColor: 'rgba(255,255,255,0.12)',
                        }}
                        aria-label="Next category"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category items */}
                  <div className="flex-1 flex flex-col gap-0.5">
                    {categories.map((cat, i) => {
                      const isActive = i === activeIndex;
                      const isHovered = i === hoveredItem;

                      return (
                        <div key={i}>
                          {/* Item button */}
                          <motion.button
                            className={`relative w-full text-left pl-4 pr-3 py-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-white/[0.06]'
                                : isHovered
                                  ? 'bg-white/[0.04]'
                                  : 'bg-transparent'
                            }`}
                            onClick={() => setActiveIndex(i)}
                            onMouseEnter={() => setHoveredItem(i)}
                            onMouseLeave={() => setHoveredItem(null)}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Active gradient left bar */}
                            {isActive && (
                              <motion.span
                                layoutId="capitalActiveBar"
                                aria-hidden
                                className="absolute left-1 top-2 bottom-2 w-[3px] rounded-full"
                                style={{
                                  background: '#0c66e4',
                                  boxShadow: '0 0 12px rgba(12,102,228,0.55)',
                                }}
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}

                            {/* Plus / Minus circle — gradient when active */}
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                background: isActive
                                  ? '#0c66e4'
                                  : 'transparent',
                                border: isActive
                                  ? '1px solid transparent'
                                  : '1px solid rgba(255,255,255,0.2)',
                                boxShadow: isActive
                                  ? '0 6px 16px -4px rgba(12,102,228,0.5)'
                                  : 'none',
                              }}
                            >
                              {isActive ? (
                                <Minus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-white/45" strokeWidth={2.5} />
                              )}
                            </div>

                            {/* Title */}
                            <span
                              className="transition-all"
                              style={{
                                fontSize: isActive ? 15.5 : 14,
                                fontWeight: isActive ? 700 : 500,
                                letterSpacing: isActive ? '-0.01em' : '0',
                                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.62)',
                              }}
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
                                <div className="pl-12 pr-4 pt-2 pb-4">
                                  {/* Gradient hairline divider */}
                                  <div
                                    aria-hidden
                                    className="h-[2px] w-10 rounded-full mb-3"
                                    style={{
                                      background:
                                        '#0c66e4',
                                    }}
                                  />

                                  {/* Description */}
                                  <div
                                    className="text-white/70 leading-relaxed"
                                    style={{ fontSize: 13.5, lineHeight: 1.55 }}
                                  >
                                    {t(cat.descKey)}
                                  </div>

                                  {/* Stat */}
                                  <div className="mt-4 flex items-baseline gap-3">
                                    <span
                                      className="text-gradient-primary tabular-nums"
                                      style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 24,
                                        fontWeight: 800,
                                        letterSpacing: '-0.025em',
                                        lineHeight: 1.0,
                                      }}
                                    >
                                      {cat.statValue}
                                    </span>
                                    <span
                                      className="uppercase text-white/45"
                                      style={{ fontSize: 9.5, letterSpacing: '0.22em', fontWeight: 700 }}
                                    >
                                      {cat.statLabel}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Counter at bottom — progress dots + tabular-nums */}
                  <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {categories.map((_, i) => (
                        <div
                          key={i}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === activeIndex ? 16 : 4,
                            height: 4,
                            background:
                              i === activeIndex
                                ? '#0c66e4'
                                : 'rgba(255,255,255,0.18)',
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-white/55 tabular-nums"
                      style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}
                    >
                      {String(activeIndex + 1).padStart(2, '0')}
                      <span className="text-white/25 mx-0.5">/</span>
                      {String(totalItems).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* ═══ RIGHT: Data visualization (light surface) ═══ */}
              <div className="relative border-t lg:border-t-0 lg:border-l border-[#dcdfe4] px-5 lg:px-7 xl:px-10 py-7 lg:py-9 flex flex-col overflow-hidden bg-white">
                {/* Subtle ambient mesh */}
                <div aria-hidden className="bg-mesh absolute inset-0 opacity-[0.10] pointer-events-none" />

                <div className="relative flex flex-col h-full">
                  {/* KPI cards row */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`kpis-${activeIndex}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-3 gap-2.5 mb-5"
                    >
                      {active.kpis.map((kpi, i) => (
                        <div
                          key={i}
                          className="card-hover-lift rounded-xl border border-[#dcdfe4] bg-white px-3.5 py-3"
                        >
                          <p
                            className="uppercase text-[#758195] mb-1.5"
                            style={{ fontSize: 9, letterSpacing: '0.22em', fontWeight: 700 }}
                          >
                            {kpi.label}
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[#172b4d] tabular-nums"
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 20,
                                fontWeight: 700,
                                letterSpacing: '-0.025em',
                                lineHeight: 1.0,
                              }}
                            >
                              {kpi.value}
                            </span>
                            {kpi.trend === 'up' && (
                              <span
                                className="inline-flex items-center justify-center rounded-full w-5 h-5"
                                style={{ background: 'rgba(31,132,90,0.12)' }}
                              >
                                <ArrowUpRight className="w-3 h-3 text-[#1F845A]" strokeWidth={2.5} />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* Chart label row */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`label-${activeIndex}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 flex items-center gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center justify-center rounded-lg w-7 h-7"
                          style={{
                            background:
                              'rgba(12,102,228,0.10)',
                          }}
                        >
                          <active.icon className="w-3.5 h-3.5 text-[#0c66e4]" />
                        </span>
                        <span
                          className="uppercase text-[#0c66e4]"
                          style={{ fontSize: 10.5, letterSpacing: '0.28em', fontWeight: 700 }}
                        >
                          {active.chartLabel}
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-[#dcdfe4]/0 via-[#dcdfe4] to-[#dcdfe4]/0" />
                      <span
                        className="text-gradient-primary tabular-nums"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 18,
                          fontWeight: 800,
                          letterSpacing: '-0.025em',
                        }}
                      >
                        {active.statValue}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  {/* Chart area — RECHARTS UNTOUCHED */}
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
                      className="mt-5 flex items-start gap-3 rounded-2xl bg-white border border-[#dcdfe4] px-4 py-3.5"
                      style={{ boxShadow: '0 6px 20px -10px rgba(9,30,66,0.08)' }}
                    >
                      <span
                        className="inline-flex items-center justify-center rounded-xl w-9 h-9 flex-shrink-0 mt-0.5"
                        style={{
                          background:
                            'rgba(12,102,228,0.12)',
                        }}
                      >
                        <Lightbulb className="w-4 h-4 text-[#0c66e4]" />
                      </span>
                      <div>
                        <span
                          className="uppercase text-[#0c66e4]"
                          style={{ fontSize: 9.5, letterSpacing: '0.28em', fontWeight: 700 }}
                        >
                          Insight
                        </span>
                        <p
                          className="text-[#44546f] mt-1"
                          style={{ fontSize: 14, lineHeight: 1.6 }}
                        >
                          {active.insight}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom dot navigation (mobile only) ── */}
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
                  width: i === activeIndex ? 32 : 8,
                  height: 8,
                  background:
                    i === activeIndex
                      ? '#0c66e4'
                      : '#dcdfe4',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}