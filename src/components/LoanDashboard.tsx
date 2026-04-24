import { useState } from 'react';
import {
  LogOut, Bell, Check, AlertCircle,
  CreditCard, DollarSign, FileText, Settings, HelpCircle,
  TrendingUp, ExternalLink, CheckCircle2
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';

interface LoanDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

/*
 * ─── CONSISTENT LOAN MODEL ─────────────────────────────────
 *
 * Original funded amount:     $70,000.00
 * Factor rate:                1.40
 * Total repayment obligation: $98,000.00  ($70,000 × 1.40)
 * Cost of capital (fees):     $28,000.00  ($98,000 − $70,000)
 * Term:                       56 months
 * Monthly payment:            $1,750.00   ($98,000 ÷ 56)
 *
 * Per-payment breakdown:
 *   Principal portion:  $1,250.00  ($70,000 ÷ 56)
 *   Fee portion:          $500.00  ($28,000 ÷ 56)
 *
 * Loan funded:   August 15, 2023
 * First payment:  September 15, 2023
 * Today:          February 25, 2026
 * Payments made:  30  (Sep 2023 → Feb 2026)
 * Next payment:   March 15, 2026  (18 days away)
 *
 * After 30 payments:
 *   Principal paid:   $37,500.00  (30 × $1,250)
 *   Fees paid:        $15,000.00  (30 × $500)
 *   Total paid:       $52,500.00  (30 × $1,750)
 *
 *   Principal remaining: $32,500.00  ($70,000 − $37,500)
 *   Fees remaining:      $13,000.00  ($28,000 − $15,000)
 *   Total remaining:     $45,500.00  ($98,000 − $52,500)
 *
 *   Payments remaining:  26  (56 − 30)
 * ────────────────────────────────────────────────────────────
 */

const ORIGINAL_ADVANCE     = 70_000.00;
const FACTOR_RATE          = 1.40;
const TOTAL_REPAYMENT      = ORIGINAL_ADVANCE * FACTOR_RATE;          // 98,000.00
const COST_OF_CAPITAL      = TOTAL_REPAYMENT - ORIGINAL_ADVANCE;      // 28,000.00
const TERM_MONTHS          = 56;
const MONTHLY_PAYMENT      = TOTAL_REPAYMENT / TERM_MONTHS;           // 1,750.00
const PRINCIPAL_PER_PMT    = ORIGINAL_ADVANCE / TERM_MONTHS;          // 1,250.00
const FEE_PER_PMT          = COST_OF_CAPITAL / TERM_MONTHS;           //   500.00
const PAYMENTS_MADE        = 30;
const PAYMENTS_REMAINING   = TERM_MONTHS - PAYMENTS_MADE;             // 26

const TOTAL_PAID           = PAYMENTS_MADE * MONTHLY_PAYMENT;         // 52,500.00
const PRINCIPAL_PAID       = PAYMENTS_MADE * PRINCIPAL_PER_PMT;       // 37,500.00
const FEES_PAID            = PAYMENTS_MADE * FEE_PER_PMT;             // 15,000.00

const TOTAL_REMAINING      = TOTAL_REPAYMENT - TOTAL_PAID;           // 45,500.00
const PRINCIPAL_REMAINING  = ORIGINAL_ADVANCE - PRINCIPAL_PAID;       // 32,500.00
const FEES_REMAINING       = COST_OF_CAPITAL - FEES_PAID;             // 13,000.00

const loanData = {
  loanId: 'DC-2026-4871',
  status: 'Open',
  performance: 'Performing',
  amountPastDue: 0,
  daysPastDue: 0,
  currentPayoff: TOTAL_REMAINING,          // 45,500.00
  principalBalance: PRINCIPAL_REMAINING,   // 32,500.00
  nextPaymentAmount: MONTHLY_PAYMENT,      // 1,750.00
  nextPaymentDate: '03/15/2026',
  originalAdvance: ORIGINAL_ADVANCE,       // 70,000.00
  totalRepayment: TOTAL_REPAYMENT,         // 98,000.00
  totalPaid: TOTAL_PAID,                   // 52,500.00
  totalRemaining: TOTAL_REMAINING,         // 45,500.00
  factorRate: FACTOR_RATE,
  termMonths: TERM_MONTHS,
  paymentsMade: PAYMENTS_MADE,
  paymentsRemaining: PAYMENTS_REMAINING,
  autoPayEnabled: true,
  dueIn: 18,
  originationDate: '08/15/2023',
  firstPaymentDate: '09/15/2023',
};

// Build 30 transactions from most recent to oldest (Feb 2026 → Sep 2023)
function generateTransactions() {
  const txns: { type: string; date: string; amount: number; status: string; principalPortion: number; feePortion: number }[] = [];
  let year = 2026;
  let month = 2; // Feb

  for (let i = 0; i < PAYMENTS_MADE; i++) {
    const mm = String(month).padStart(2, '0');
    txns.push({
      type: 'Payment',
      date: `${mm}/15/${year}`,
      amount: MONTHLY_PAYMENT,
      status: 'completed',
      principalPortion: PRINCIPAL_PER_PMT,
      feePortion: FEE_PER_PMT,
    });
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
  }
  return txns;
}

const transactions = generateTransactions();

const totalPaidData = [
  { name: 'Principal', value: PRINCIPAL_PAID, color: '#4F46E5' },
  { name: 'Factor Fees', value: FEES_PAID, color: '#F97316' },
];

const payoffData = [
  { name: 'Principal', value: PRINCIPAL_REMAINING, color: '#4F46E5' },
  { name: 'Factor Fees', value: FEES_REMAINING, color: '#F97316' },
];

/*
 * Payment history grid  —  must match exactly 30 payments
 *   2023: Sep ✓, Oct ✓, Nov ✓, Dec ✓  (4 payments, Jan–Aug null)
 *   2024: all 12 ✓                      (12 payments)
 *   2025: all 12 ✓                      (12 payments)
 *   2026: Jan ✓, Feb ✓, Mar–Dec null    (2 payments)
 *   Total: 4 + 12 + 12 + 2 = 30 ✓
 */
const paymentHistory: Record<number, (string | null)[]> = {
  2026: ['✓', '✓', null, null, null, null, null, null, null, null, null, null],
  2025: ['✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓'],
  2024: ['✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓'],
  2023: [null, null, null, null, null, null, null, null, '✓', '✓', '✓', '✓'],
};

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const paymentDetails = [
  { label: 'Months Reviewed', value: String(PAYMENTS_MADE) },
  { label: 'Payment Responsibility', value: 'SOLE' },
  { label: 'Loan Origination Date', value: 'Aug 15, 2023' },
  { label: 'Date Closed', value: '-' },
  { label: 'Date of Last Payment', value: 'Feb 15, 2026' },
  { label: 'Scheduled Monthly Payment', value: `$${MONTHLY_PAYMENT.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
  { label: 'Actual Payment Amount', value: `$${MONTHLY_PAYMENT.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
  { label: 'Charge Off Amount', value: '$0.00' },
  { label: 'Total Payments Made', value: String(PAYMENTS_MADE) },
  { label: 'Payments Remaining', value: String(PAYMENTS_REMAINING) },
  { label: 'Factor Rate', value: `${FACTOR_RATE.toFixed(2)}` },
  { label: 'Estimated Payoff Date', value: 'Apr 2028' },
];

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type Tab = 'summary' | 'payments' | 'documents' | 'settings';

export function LoanDashboard({ userEmail, onLogout }: LoanDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const displayedTransactions = showAllTransactions ? transactions : transactions.slice(0, 6);

  return (
    <div className="fixed inset-0 z-[55] bg-[#F7F5F0] flex flex-col">
      {/* Spacer for main Navbar (z-70) */}
      <div className="flex-shrink-0 h-[73px]" />

      {/* Dashboard header — sticky below main Navbar */}
      <header className="flex-shrink-0 bg-[#FFFFFF] border-b border-[#4F46E50F] shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4">
              <img src={logoImg} alt="Delt" className="h-8 w-auto object-contain" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="font-mono font-semibold text-[#0F0E17] dark:text-white">{loanData.loanId}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{loanData.status}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{loanData.performance}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-600">
                <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-sm font-semibold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{userEmail}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#4F46E5] bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation — sticky below dashboard header */}
      <div className="flex-shrink-0 bg-[#FFFFFF] border-b border-[#4F46E50F]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-0 -mb-px overflow-x-auto">
            {([
              { id: 'summary', label: 'Summary', icon: TrendingUp },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
            ] as { id: Tab; label: string; icon: any }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'summary' && (
            <SummaryTab
              displayedTransactions={displayedTransactions}
              showAllTransactions={showAllTransactions}
              onToggleTransactions={() => setShowAllTransactions(!showAllTransactions)}
              totalCount={transactions.length}
            />
          )}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'settings' && <SettingsTab userEmail={userEmail} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Summary Tab ────────────────────────────────────────── */
function SummaryTab({
  displayedTransactions, showAllTransactions, onToggleTransactions, totalCount
}: {
  displayedTransactions: typeof transactions;
  showAllTransactions: boolean;
  onToggleTransactions: () => void;
  totalCount: number;
}) {
  return (
    <div className="space-y-6">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Amount Past Due"
          value={`$${fmt(loanData.amountPastDue)}`}
          sub={`${loanData.daysPastDue} Days Past Due`}
          accent="green"
        />
        <KPICard
          label="Current Payoff"
          value={`$${fmt(loanData.currentPayoff)}`}
          sub={`Principal Balance: $${fmt(loanData.principalBalance)}`}
          accent="blue"
        />
        <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">AutoPay Enabled</span>
          </div>
          <p className="text-sm text-[#0F0E17] dark:text-white">
            Payment of <span className="font-semibold">${fmt(loanData.nextPaymentAmount)}</span> due on <span className="font-semibold">{loanData.nextPaymentDate}</span>
          </p>
          <span className="text-xs text-gray-400">Due in {loanData.dueIn} days · Payment {loanData.paymentsMade + 1} of {loanData.termMonths}</span>
        </div>
        <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-5 flex items-center justify-center">
          <button className="w-full py-3 bg-[#4F46E5] hover:bg-[#3730A3] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#4F46E5]/20 flex items-center justify-center gap-2">
            <DollarSign className="w-5 h-5" />
            Make a Payment
          </button>
        </div>
      </div>

      {/* Loan Balance Bar */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#0F0E17] dark:text-white">Repayment Progress</h3>
          <span className="text-xs text-gray-400">Factor Rate: {loanData.factorRate.toFixed(2)}x · {loanData.termMonths}-month term</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0F0E17] dark:text-white">${fmt(loanData.totalRepayment)}</p>
            <p className="text-xs text-gray-400">Total Repayment</p>
          </div>
          <span className="text-2xl text-gray-300">—</span>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${fmt(loanData.totalPaid)}</p>
            <p className="text-xs text-gray-400">{loanData.paymentsMade} Payments Made</p>
          </div>
          <span className="text-2xl text-gray-300">=</span>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#4F46E5]">${fmt(loanData.totalRemaining)}</p>
            <p className="text-xs text-gray-400">{loanData.paymentsRemaining} Payments Left</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#A78BFA] transition-all duration-500"
            style={{ width: `${(loanData.totalPaid / loanData.totalRepayment) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">{((loanData.totalPaid / loanData.totalRepayment) * 100).toFixed(1)}% repaid</span>
          <span className="text-xs text-gray-400">{((loanData.totalRemaining / loanData.totalRepayment) * 100).toFixed(1)}% remaining</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm font-semibold text-[#0F0E17] dark:text-white">${fmt(ORIGINAL_ADVANCE)}</p>
            <p className="text-xs text-gray-400">Original Advance</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F0E17] dark:text-white">${fmt(COST_OF_CAPITAL)}</p>
            <p className="text-xs text-gray-400">Cost of Capital</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600">${fmt(PRINCIPAL_PAID)}</p>
            <p className="text-xs text-gray-400">Principal Repaid</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#4F46E5]">${fmt(PRINCIPAL_REMAINING)}</p>
            <p className="text-xs text-gray-400">Principal Outstanding</p>
          </div>
        </div>
      </div>

      {/* Charts + Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#0F0E17] dark:text-white">Transactions</h3>
            <span className="text-xs text-gray-400">{totalCount} total</span>
          </div>
          <div className="space-y-3">
            {displayedTransactions.map((tx, i) => (
              <div key={`${tx.date}-${i}`} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50 dark:bg-green-900/20">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F0E17] dark:text-white">{tx.type}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-[#0F0E17] dark:text-white">
                    -${fmt(tx.amount)}
                  </span>
                  <p className="text-[10px] text-gray-400">${fmt(tx.principalPortion)} prin · ${fmt(tx.feePortion)} fee</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onToggleTransactions}
            className="mt-4 text-sm text-[#4F46E5] hover:text-[#3730A3] font-semibold transition-colors"
          >
            {showAllTransactions ? 'Show Recent' : `View All ${totalCount}`}
          </button>
        </div>

        {/* Total Paid Donut */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
          <h3 className="font-semibold text-[#0F0E17] dark:text-white mb-2">Total Paid</h3>
          <p className="text-xs text-gray-400 mb-3">{PAYMENTS_MADE} payments · ${fmt(MONTHLY_PAYMENT)}/mo</p>
          <div className="flex items-center gap-4 mb-3">
            {totalPaidData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{d.name}: ${fmt(d.value)}</span>
              </div>
            ))}
          </div>
          <div className="relative h-[220px] flex items-center justify-center">
            <PieChart width={200} height={200}>
              <Pie
                key="pie-total-paid"
                data={totalPaidData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {totalPaidData.map((entry, index) => (
                  <Cell key={`cell-tp-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="tooltip-total-paid" formatter={(value: number) => `$${fmt(value)}`} />
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-[#0F0E17] dark:text-white">
                ${fmt(TOTAL_PAID)}
              </span>
              <span className="text-[10px] text-gray-400">total paid</span>
            </div>
          </div>
        </div>

        {/* Payoff Breakdown Donut */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
          <h3 className="font-semibold text-[#0F0E17] dark:text-white mb-2">Payoff Breakdown</h3>
          <p className="text-xs text-gray-400 mb-3">{PAYMENTS_REMAINING} payments remaining · est. Apr 2028</p>
          <div className="flex items-center gap-4 mb-3">
            {payoffData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{d.name}: ${fmt(d.value)}</span>
              </div>
            ))}
          </div>
          <div className="relative h-[220px] flex items-center justify-center">
            <PieChart width={200} height={200}>
              <Pie
                key="pie-payoff"
                data={payoffData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {payoffData.map((entry, index) => (
                  <Cell key={`cell-po-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="tooltip-payoff" formatter={(value: number) => `$${fmt(value)}`} />
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-[#0F0E17] dark:text-white">
                ${fmt(TOTAL_REMAINING)}
              </span>
              <span className="text-[10px] text-gray-400">to pay off</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── KPI Card ───────────────────────────────────────────── */
function KPICard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: 'green' | 'blue' }) {
  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent === 'green' ? 'text-green-600' : 'text-[#0F0E17] dark:text-white'}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

/* ─── Payments Tab ───────────────────────────────────────── */
function PaymentsTab() {
  return (
    <div className="space-y-6">
      {/* Payment History Grid */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
        <h3 className="font-semibold text-[#0F0E17] dark:text-white mb-2">PAYMENT HISTORY</h3>
        <p className="text-xs text-gray-400 mb-5">
          Monthly payment history for this account. A check mark indicates an on-time payment. Numbers indicate days past due.
          Months before origination or in the future are shown as dashes.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 pr-4 text-gray-400 font-normal w-16"></th>
                {months.map((m) => (
                  <th key={m} className="py-2 px-1 text-center text-gray-500 dark:text-gray-400 font-normal min-w-[40px]">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(paymentHistory).sort(([a],[b]) => Number(b) - Number(a)).map(([year, data]) => (
                <tr key={year} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="py-2.5 pr-4 font-semibold text-[#0F0E17] dark:text-white">{year}</td>
                  {data.map((cell, i) => (
                    <td key={i} className="py-2.5 px-1 text-center">
                      {cell === '✓' ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : cell === null ? (
                        <span className="text-gray-200 dark:text-gray-600">—</span>
                      ) : (
                        <span className="text-red-500 font-semibold text-xs">{cell}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Paid on time</div>
          <div><span className="text-gray-300 dark:text-gray-600">—</span> N/A (pre-origination or future)</div>
          <div><span className="text-red-500 font-semibold">30</span> 30 Days Past Due</div>
          <div><span className="text-red-600 font-semibold">60</span> 60 Days Past Due</div>
          <div><span className="text-red-700 font-semibold">90+</span> 90+ Days Past Due</div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
        <h3 className="font-semibold text-[#0F0E17] dark:text-white mb-4">PAYMENT DETAILS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
          {paymentDetails.map((item, i) => (
            <div key={i} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
              <span className="text-sm font-semibold text-[#0F0E17] dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Summary Verification */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
        <h3 className="font-semibold text-[#0F0E17] dark:text-white mb-4">LOAN SUMMARY</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
          {[
            { label: 'Original Advance', value: `$${fmt(ORIGINAL_ADVANCE)}` },
            { label: 'Factor Rate', value: `${FACTOR_RATE.toFixed(2)}x` },
            { label: 'Total Repayment Obligation', value: `$${fmt(TOTAL_REPAYMENT)}` },
            { label: 'Total Cost of Capital', value: `$${fmt(COST_OF_CAPITAL)}` },
            { label: 'Monthly Payment', value: `$${fmt(MONTHLY_PAYMENT)}` },
            { label: 'Term Length', value: `${TERM_MONTHS} months` },
            { label: 'Total Paid to Date', value: `$${fmt(TOTAL_PAID)}` },
            { label: 'Total Remaining', value: `$${fmt(TOTAL_REMAINING)}` },
            { label: 'Principal Repaid', value: `$${fmt(PRINCIPAL_PAID)}` },
            { label: 'Principal Outstanding', value: `$${fmt(PRINCIPAL_REMAINING)}` },
            { label: 'Amount Past Due', value: `$${fmt(loanData.amountPastDue)}` },
            { label: 'Account Status', value: loanData.performance },
          ].map((item, i) => (
            <div key={i} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
              <span className="text-sm font-semibold text-[#0F0E17] dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Documents Tab ──────────────────────────────────────── */
function DocumentsTab() {
  const docs = [
    { name: 'Revenue-Based Financing Agreement', date: '08/15/2023', type: 'Contract' },
    { name: 'ACH Authorization Form', date: '08/15/2023', type: 'Authorization' },
    { name: 'UCC Filing Confirmation', date: '08/20/2023', type: 'Filing' },
    { name: 'Monthly Statement — February 2026', date: '02/01/2026', type: 'Statement' },
    { name: 'Monthly Statement — January 2026', date: '01/01/2026', type: 'Statement' },
    { name: 'Monthly Statement — December 2025', date: '12/01/2025', type: 'Statement' },
    { name: 'Annual Summary — 2025', date: '01/05/2026', type: 'Summary' },
    { name: 'Annual Summary — 2024', date: '01/05/2025', type: 'Summary' },
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
      <h3 className="font-semibold text-[#0F0E17] dark:text-white mb-5">Documents</h3>
      <div className="space-y-0">
        {docs.map((doc, i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F0E17] dark:text-white">{doc.name}</p>
                <p className="text-xs text-gray-400">{doc.type} · {doc.date}</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#4F46E5] hover:bg-[#4F46E5]/10 rounded-lg transition-colors font-semibold">
              <ExternalLink className="w-4 h-4" />
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings Tab ───────────────────────────────────────── */
function SettingsTab({ userEmail }: { userEmail: string }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
        <h3 className="font-semibold text-[#0F0E17] dark:text-white mb-5">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-sm font-semibold text-[#0F0E17] dark:text-white">Email Address</p>
              <p className="text-sm text-gray-400">{userEmail}</p>
            </div>
            <button className="text-sm text-[#4F46E5] font-semibold">Edit</button>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-sm font-semibold text-[#0F0E17] dark:text-white">Password</p>
              <p className="text-sm text-gray-400">Last changed 30 days ago</p>
            </div>
            <button className="text-sm text-[#4F46E5] font-semibold">Change</button>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-sm font-semibold text-[#0F0E17] dark:text-white">AutoPay</p>
              <p className="text-sm text-gray-400">Enabled — Bank account ending in 4821</p>
            </div>
            <button className="text-sm text-[#4F46E5] font-semibold">Manage</button>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="text-sm font-semibold text-[#0F0E17] dark:text-white">Notifications</p>
              <p className="text-sm text-gray-400">Email & SMS reminders enabled</p>
            </div>
            <button className="text-sm text-[#4F46E5] font-semibold">Configure</button>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-xl border border-[#4F46E50F] p-6">
        <h3 className="font-semibold text-[#0F0E17] dark:text-white mb-3">Need Help?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Contact our support team for any questions about your loan.
        </p>
        <div className="flex items-center gap-3 text-sm">
          <HelpCircle className="w-5 h-5 text-[#4F46E5]" />
          <span className="text-[#0F0E17] dark:text-white font-semibold">(864) 729-3358</span>
        </div>
      </div>
    </div>
  );
}