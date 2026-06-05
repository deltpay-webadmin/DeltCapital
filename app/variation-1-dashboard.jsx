// V1 Dashboard — signed-in account portal for an approved/funded customer.
//
// Reached after an application is approved (see variation-1-status.jsx). Four
// tabs — Summary · Payments · Documents · Settings — matching the product
// screenshots. The loan/servicing figures are entered per-customer by an admin
// (see variation-1-admin.jsx) and stored on applications.dashboard; this view
// renders that data, falling back to EMPTY states until an admin fills it in.

// Empty template — every field a customer dashboard can show. Admin-entered
// values (applications.dashboard) are merged over this, so unfilled fields read
// as 0 / blank rather than sample data.
const V1_DASH_EMPTY = {
  account: '', accountStatus: '', performance: '',
  originalAdvance: 0, factorRate: 0, totalRepayment: 0, costOfCapital: 0,
  monthlyPayment: 0, termMonths: 0, paymentsMade: 0, paymentsRemaining: 0,
  totalPaid: 0, totalRemaining: 0, currentPayoff: 0, principalBalance: 0,
  principalRepaid: 0, principalOutstanding: 0, amountPastDue: 0, daysPastDue: 0,
  nextPaymentAmount: 0, nextPaymentDate: '', nextPaymentDueInDays: 0, nextPaymentNumber: 0,
  paidPrincipal: 0, paidFactorFees: 0, remainingPrincipal: 0, remainingFactorFees: 0,
  estPayoff: '', originationDate: '', lastPaymentDate: '', autopayBankLast4: '',
  transactions: [], history: {}, documents: [],
};

function v1ResolveDash(stored) {
  const s = (stored && typeof stored === 'object') ? stored : {};
  return {
    ...V1_DASH_EMPTY,
    ...s,
    transactions: Array.isArray(s.transactions) ? s.transactions : [],
    history: (s.history && typeof s.history === 'object') ? s.history : {},
    documents: Array.isArray(s.documents) ? s.documents : [],
  };
}

const V1_DASH_ORANGE = '#E8833A';
const V1_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const v1Money = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const v1Or = (v, fallback = '—') => (v === 0 || v ? v : fallback);

// ─── Small primitives ───
function V1DashCard({ children, style }) {
  return (
    <div style={{
      background: '#fff', border: `1px solid ${V1.line}`, borderRadius: 16,
      boxShadow: '0 14px 40px -28px rgba(4,30,66,0.30)', padding: 24, ...style,
    }}>{children}</div>
  );
}

function V1Pill({ label, tone }) {
  const map = {
    green: { bg: 'rgba(16,185,129,0.12)', fg: '#047857' },
    indigo:{ bg: `${V1.blue}16`,          fg: V1.blue   },
    muted: { bg: V1.line,                 fg: V1.muted  },
  };
  const c = map[tone] || map.indigo;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
      borderRadius: 999, background: c.bg, color: c.fg,
      fontFamily: V1.fontBody, fontSize: 12, fontWeight: 600,
    }}>{label}</span>
  );
}

function V1DonutChart({ segments, centerValue, centerLabel, size = 200 }) {
  const stroke = 26;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={V1.line} strokeWidth={stroke} opacity={0.35} />
        {segments.map((seg, i) => {
          const len = (seg.value / total) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={dash} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        <div style={{ fontFamily: V1.fontDisplay, fontSize: 24, fontWeight: 800, color: V1.ink, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{centerValue}</div>
        <div style={{ marginTop: 2, fontFamily: V1.fontBody, fontSize: 12, color: V1.muted }}>{centerLabel}</div>
      </div>
    </div>
  );
}

function V1Legend({ items }) {
  return (
    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 4 }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: V1.fontBody, fontSize: 12.5, color: V1.text }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: it.color }} />
          {it.label}: <b style={{ fontWeight: 600, color: V1.ink }}>{it.value}</b>
        </span>
      ))}
    </div>
  );
}

function V1KeyVal({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: `1px solid ${V1.line}` }}>
      <span style={{ fontFamily: V1.fontBody, fontSize: 14, color: V1.muted }}>{label}</span>
      <span style={{ fontFamily: V1.fontDisplay, fontSize: 14.5, fontWeight: 700, color: valueColor || V1.ink, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function V1StatTile({ children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${V1.line}`, borderRadius: 14, padding: '18px 20px', boxShadow: '0 10px 30px -26px rgba(4,30,66,0.3)' }}>{children}</div>
  );
}
function V1TileLabel({ children }) {
  return <div style={{ fontFamily: V1.fontBody, fontSize: 13, color: V1.muted }}>{children}</div>;
}

function V1DashEmptyNote({ children }) {
  return (
    <div style={{ padding: '22px 4px', textAlign: 'center', fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted }}>{children}</div>
  );
}

// ─── Summary tab ───
function V1DashSummary({ data: d, onPay }) {
  const repaidPct = d.totalRepayment > 0 ? (d.totalPaid / d.totalRepayment) * 100 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top row — 4 tiles */}
      <div data-v1-dash-tiles style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <V1StatTile>
          <V1TileLabel>Amount Past Due</V1TileLabel>
          <div style={{ marginTop: 8, fontFamily: V1.fontDisplay, fontSize: 26, fontWeight: 800, color: d.amountPastDue > 0 ? '#DC2626' : V1.green, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{v1Money(d.amountPastDue)}</div>
          <div style={{ marginTop: 6, fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted }}>{d.daysPastDue} Days Past Due</div>
        </V1StatTile>
        <V1StatTile>
          <V1TileLabel>Current Payoff</V1TileLabel>
          <div style={{ marginTop: 8, fontFamily: V1.fontDisplay, fontSize: 26, fontWeight: 800, color: V1.ink, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{v1Money(d.currentPayoff)}</div>
          <div style={{ marginTop: 6, fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted }}>Principal Balance: {v1Money(d.principalBalance)}</div>
        </V1StatTile>
        <V1StatTile>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={V1.green} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6.5"/><path d="M5.5 8.2L7 9.7 10.5 6"/></svg>
            <span style={{ fontFamily: V1.fontBody, fontSize: 13, color: V1.ink, fontWeight: 600 }}>AutoPay Enabled</span>
          </div>
          <div style={{ marginTop: 10, fontFamily: V1.fontBody, fontSize: 13, color: V1.text, lineHeight: 1.4 }}>
            Payment of <b style={{ color: V1.ink }}>{v1Money(d.nextPaymentAmount)}</b> due on <b style={{ color: V1.ink }}>{d.nextPaymentDate || '—'}</b>
          </div>
          <div style={{ marginTop: 8, fontFamily: V1.fontBody, fontSize: 11.5, color: V1.muted }}>Due in {d.nextPaymentDueInDays} days · Payment {d.nextPaymentNumber} of {d.termMonths}</div>
        </V1StatTile>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <button type="button" onClick={onPay} style={{
            width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: V1.blue, color: '#fff', border: 'none', borderRadius: 14, cursor: 'pointer',
            fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 700,
            boxShadow: `0 14px 32px -14px ${V1.blue}cc`,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v12M11 5H6.5a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H4"/></svg>
            Make a Payment
          </button>
        </div>
      </div>

      {/* Repayment progress */}
      <V1DashCard>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 700, color: V1.ink }}>Repayment Progress</div>
          <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted }}>Factor Rate {Number(d.factorRate || 0).toFixed(2)}x · {d.termMonths}-month term</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 22, margin: '22px 0 10px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: V1.fontDisplay, fontSize: 30, fontWeight: 800, color: V1.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{v1Money(d.totalRepayment)}</div>
            <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 4 }}>Total Repayment</div>
          </div>
          <div style={{ fontFamily: V1.fontDisplay, fontSize: 26, color: V1.muted, paddingBottom: 14 }}>−</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: V1.fontDisplay, fontSize: 30, fontWeight: 800, color: V1.green, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{v1Money(d.totalPaid)}</div>
            <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 4 }}>{d.paymentsMade} Payments Made</div>
          </div>
          <div style={{ fontFamily: V1.fontDisplay, fontSize: 26, color: V1.muted, paddingBottom: 14 }}>=</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: V1.fontDisplay, fontSize: 30, fontWeight: 800, color: V1.blue, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{v1Money(d.totalRemaining)}</div>
            <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 4 }}>{d.paymentsRemaining} Payments Left</div>
          </div>
        </div>
        <div style={{ height: 12, borderRadius: 999, background: V1.line, overflow: 'hidden', marginTop: 10 }}>
          <div style={{ height: '100%', width: `${repaidPct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${V1.blue}, #818CF8)` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: V1.fontBody, fontSize: 12, color: V1.muted }}>
          <span>{repaidPct.toFixed(1)}% repaid</span>
          <span>{(100 - repaidPct).toFixed(1)}% remaining</span>
        </div>
        <div data-v1-dash-tiles style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 24 }}>
          {[
            ['Original Advance', v1Money(d.originalAdvance), V1.ink],
            ['Cost of Capital', v1Money(d.costOfCapital), V1.ink],
            ['Principal Repaid', v1Money(d.principalRepaid), V1.green],
            ['Principal Outstanding', v1Money(d.principalOutstanding), V1.blue],
          ].map(([l, v, color]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </V1DashCard>

      {/* Transactions + 2 donuts */}
      <div data-v1-dash-3col style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <V1DashCard style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 22px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 700, color: V1.ink }}>Transactions</div>
            <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted }}>{d.transactions.length} total</div>
          </div>
          {d.transactions.length === 0 ? (
            <div style={{ borderTop: `1px solid ${V1.line}` }}><V1DashEmptyNote>No transactions recorded yet.</V1DashEmptyNote></div>
          ) : (
            <>
              <div>
                {d.transactions.slice(0, 6).map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderTop: `1px solid ${V1.line}` }}>
                    <span style={{ width: 22, height: 22, borderRadius: 999, background: 'rgba(16,185,129,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={V1.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.2L6.5 11.5 13 5"/></svg>
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600, color: V1.ink }}>Payment</div>
                      <div style={{ fontFamily: V1.fontMono, fontSize: 11, color: V1.muted, marginTop: 2 }}>{t.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: V1.fontDisplay, fontSize: 13.5, fontWeight: 700, color: V1.ink, fontVariantNumeric: 'tabular-nums' }}>-{v1Money(t.amount)}</div>
                      <div style={{ fontFamily: V1.fontBody, fontSize: 10.5, color: V1.muted, marginTop: 2 }}>{v1Money(t.principal)} prin · {v1Money(t.fee)} fee</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 22px', borderTop: `1px solid ${V1.line}` }}>
                <span style={{ fontFamily: V1.fontBody, fontSize: 13, fontWeight: 600, color: V1.blue, cursor: 'pointer' }}>View All {d.transactions.length}</span>
              </div>
            </>
          )}
        </V1DashCard>

        <V1DashCard>
          <div style={{ fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 700, color: V1.ink }}>Total Paid</div>
          <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 4 }}>{d.paymentsMade} payments · {v1Money(d.monthlyPayment)}/mo</div>
          <div style={{ marginTop: 12 }}>
            <V1Legend items={[
              { color: V1.blue, label: 'Principal', value: v1Money(d.paidPrincipal) },
              { color: V1_DASH_ORANGE, label: 'Factor Fees', value: v1Money(d.paidFactorFees) },
            ]} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <V1DonutChart
              segments={[{ value: d.paidPrincipal, color: V1.blue }, { value: d.paidFactorFees, color: V1_DASH_ORANGE }]}
              centerValue={v1Money(d.totalPaid)} centerLabel="total paid" />
          </div>
        </V1DashCard>

        <V1DashCard>
          <div style={{ fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 700, color: V1.ink }}>Payoff Breakdown</div>
          <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 4 }}>{d.paymentsRemaining} payments remaining{d.estPayoff ? ` · est. ${d.estPayoff}` : ''}</div>
          <div style={{ marginTop: 12 }}>
            <V1Legend items={[
              { color: V1.blue, label: 'Principal', value: v1Money(d.remainingPrincipal) },
              { color: V1_DASH_ORANGE, label: 'Factor Fees', value: v1Money(d.remainingFactorFees) },
            ]} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <V1DonutChart
              segments={[{ value: d.remainingPrincipal, color: V1.blue }, { value: d.remainingFactorFees, color: V1_DASH_ORANGE }]}
              centerValue={v1Money(d.currentPayoff)} centerLabel="to pay off" />
          </div>
        </V1DashCard>
      </div>
    </div>
  );
}

// ─── Payments tab ───
function V1HistoryCell({ state }) {
  if (state === 'ok') {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={V1.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.2L6.5 11.5 13 5"/></svg>;
  }
  if (state === 'na' || !state) return <span style={{ color: V1.line, fontWeight: 700 }}>—</span>;
  const tone = state === '30' ? '#D97706' : state === '60' ? '#DC2626' : '#991B1B';
  return <span style={{ color: tone, fontFamily: V1.fontMono, fontSize: 11, fontWeight: 700 }}>{state === '90' ? '90+' : state}</span>;
}

function V1DashPayments({ data: d }) {
  const years = Object.keys(d.history).map(Number).filter((n) => !isNaN(n)).sort((a, b) => b - a);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <V1DashCard>
        <div style={{ fontFamily: V1.fontMono, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: V1.ink }}>Payment History</div>
        <p style={{ margin: '8px 0 18px', fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted, lineHeight: 1.5, maxWidth: 760 }}>
          Monthly payment history for this account. A check mark indicates an on-time payment. Numbers indicate days past due. Months before origination or in the future are shown as dashes.
        </p>
        {years.length === 0 ? (
          <V1DashEmptyNote>No payment history yet.</V1DashEmptyNote>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: 60 }} />
                  {V1_MONTHS.map((m) => (
                    <th key={m} style={{ fontFamily: V1.fontBody, fontSize: 12, fontWeight: 500, color: V1.muted, padding: '0 0 14px', textAlign: 'center' }}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {years.map((y) => (
                  <tr key={y}>
                    <td style={{ fontFamily: V1.fontDisplay, fontSize: 13.5, fontWeight: 700, color: V1.ink, padding: '10px 0' }}>{y}</td>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <td key={i} style={{ textAlign: 'center', padding: '10px 0' }}><V1HistoryCell state={(d.history[y] || [])[i]} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 18, paddingTop: 16, borderTop: `1px solid ${V1.line}` }}>
          {[
            [<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={V1.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.2L6.5 11.5 13 5"/></svg>, 'Paid on time'],
            [<span style={{ color: V1.line, fontWeight: 700 }}>—</span>, 'N/A (pre-origination or future)'],
            [<span style={{ color: '#D97706', fontFamily: V1.fontMono, fontSize: 11, fontWeight: 700 }}>30</span>, '30 Days Past Due'],
            [<span style={{ color: '#DC2626', fontFamily: V1.fontMono, fontSize: 11, fontWeight: 700 }}>60</span>, '60 Days Past Due'],
            [<span style={{ color: '#991B1B', fontFamily: V1.fontMono, fontSize: 11, fontWeight: 700 }}>90+</span>, '90+ Days Past Due'],
          ].map(([icon, label], i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: V1.fontBody, fontSize: 12.5, color: V1.text }}>{icon} {label}</span>
          ))}
        </div>
      </V1DashCard>

      <V1DashCard>
        <div style={{ fontFamily: V1.fontMono, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: V1.ink, marginBottom: 6 }}>Payment Details</div>
        <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40 }}>
          <div>
            <V1KeyVal label="Months Reviewed" value={d.paymentsMade} />
            <V1KeyVal label="Loan Origination Date" value={v1Or(d.originationDate)} />
            <V1KeyVal label="Date of Last Payment" value={v1Or(d.lastPaymentDate)} />
            <V1KeyVal label="Actual Payment Amount" value={v1Money(d.monthlyPayment)} />
            <V1KeyVal label="Total Payments Made" value={d.paymentsMade} />
            <V1KeyVal label="Factor Rate" value={Number(d.factorRate || 0).toFixed(2)} />
          </div>
          <div>
            <V1KeyVal label="Payment Responsibility" value="SOLE" />
            <V1KeyVal label="Date Closed" value="-" />
            <V1KeyVal label="Scheduled Monthly Payment" value={v1Money(d.monthlyPayment)} />
            <V1KeyVal label="Charge Off Amount" value={v1Money(0)} />
            <V1KeyVal label="Payments Remaining" value={d.paymentsRemaining} />
            <V1KeyVal label="Estimated Payoff Date" value={v1Or(d.estPayoff)} />
          </div>
        </div>
      </V1DashCard>

      <V1DashCard>
        <div style={{ fontFamily: V1.fontMono, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: V1.ink, marginBottom: 6 }}>Loan Summary</div>
        <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40 }}>
          <div>
            <V1KeyVal label="Original Advance" value={v1Money(d.originalAdvance)} />
            <V1KeyVal label="Total Repayment Obligation" value={v1Money(d.totalRepayment)} />
            <V1KeyVal label="Monthly Payment" value={v1Money(d.monthlyPayment)} />
            <V1KeyVal label="Total Paid to Date" value={v1Money(d.totalPaid)} />
          </div>
          <div>
            <V1KeyVal label="Factor Rate" value={`${Number(d.factorRate || 0).toFixed(2)}x`} />
            <V1KeyVal label="Total Cost of Capital" value={v1Money(d.costOfCapital)} />
            <V1KeyVal label="Term Length" value={`${d.termMonths} months`} />
            <V1KeyVal label="Total Remaining" value={v1Money(d.totalRemaining)} />
          </div>
        </div>
      </V1DashCard>
    </div>
  );
}

// ─── Documents tab ───
function V1DashDocuments({ data: d }) {
  return (
    <V1DashCard style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '22px 26px 6px', fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 700, color: V1.ink }}>Documents</div>
      {d.documents.length === 0 ? (
        <div style={{ borderTop: `1px solid ${V1.line}`, marginTop: 12 }}><V1DashEmptyNote>No documents yet.</V1DashEmptyNote></div>
      ) : (
        <div>
          {d.documents.map((doc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 26px', borderTop: `1px solid ${V1.line}` }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, background: `${V1.blue}12`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke={V1.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2h5l3 3v9H4z"/><path d="M9 2v3h3M6 8h4M6 11h4"/></svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600, color: V1.ink }}>{doc.title}</div>
                <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 2 }}>{doc.kind}{doc.date ? ` · ${doc.date}` : ''}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600, color: V1.blue, cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9"/></svg>
                View
              </span>
            </div>
          ))}
        </div>
      )}
    </V1DashCard>
  );
}

// ─── Settings tab ───
function V1SettingsRow({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '18px 0', borderBottom: `1px solid ${V1.line}` }}>
      <div>
        <div style={{ fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600, color: V1.ink }}>{title}</div>
        <div style={{ fontFamily: V1.fontBody, fontSize: 13, color: V1.muted, marginTop: 3 }}>{sub}</div>
      </div>
      <span style={{ fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600, color: V1.blue, cursor: 'pointer', whiteSpace: 'nowrap' }}>{action}</span>
    </div>
  );
}

function V1DashSettings({ email, data: d }) {
  const autopaySub = d.autopayBankLast4 ? `Enabled — Bank account ending in ${d.autopayBankLast4}` : 'Not set up yet';
  return (
    <div data-v1-dash-settings style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, maxWidth: 560 }}>
      <V1DashCard>
        <div style={{ fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 700, color: V1.ink, marginBottom: 4 }}>Account Settings</div>
        <V1SettingsRow title="Email Address" sub={email} action="Edit" />
        <V1SettingsRow title="Password" sub="Last changed 30 days ago" action="Change" />
        <V1SettingsRow title="AutoPay" sub={autopaySub} action="Manage" />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '18px 0 4px' }}>
          <div>
            <div style={{ fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600, color: V1.ink }}>Notifications</div>
            <div style={{ fontFamily: V1.fontBody, fontSize: 13, color: V1.muted, marginTop: 3 }}>Email &amp; SMS reminders enabled</div>
          </div>
          <span style={{ fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600, color: V1.blue, cursor: 'pointer' }}>Configure</span>
        </div>
      </V1DashCard>

      <V1DashCard>
        <div style={{ fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 700, color: V1.ink }}>Need Help?</div>
        <p style={{ margin: '10px 0 14px', fontFamily: V1.fontBody, fontSize: 14, color: V1.muted, lineHeight: 1.55 }}>
          Contact our support team for any questions about your loan.
        </p>
        <a href="tel:+18647293358" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, color: V1.blue, textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6.5"/><path d="M8 11v-3M8 5.5h.01"/></svg>
          (864) 729-3358
        </a>
      </V1DashCard>
    </div>
  );
}

// ─── Account header — the dashboard's own app-shell header (the marketing
// chrome is hidden on this route). Logo returns to the marketing site; Log out
// ends the session. ───
function V1DashHeader({ email, account, hasData, accountStatus, performance, onSignOut, signingOut, onNavHome }) {
  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${V1.line}`, position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <img
            src="app/assets/logo-dark.png"
            alt="Delt Capital — back to site"
            onClick={onNavHome}
            title="Back to deltcapital.com"
            style={{ height: 26, width: 'auto', display: 'block', cursor: 'pointer' }}
          />
          <span aria-hidden style={{ width: 1, height: 22, background: V1.line }} />
          <span style={{ fontFamily: V1.fontMono, fontSize: 13.5, fontWeight: 700, letterSpacing: '0.04em', color: V1.ink }}>{account || '—'}</span>
          {hasData ? (
            <>
              <V1Pill label={accountStatus || 'Open'} tone="green" />
              <V1Pill label={performance || 'Performing'} tone="indigo" />
            </>
          ) : (
            <V1Pill label="Awaiting setup" tone="muted" />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={V1.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3a4 4 0 0 0-4 4c0 4-2 5-2 5h12s-2-1-2-5a4 4 0 0 0-4-4zM8.5 15a1.5 1.5 0 0 0 3 0"/></svg>
            <span style={{ position: 'absolute', top: -1, right: -1, width: 7, height: 7, borderRadius: 999, background: '#DC2626', border: '1.5px solid #fff' }} />
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: V1.fontDisplay, fontSize: 13, fontWeight: 700 }}>{(email || 'U').charAt(0).toUpperCase()}</span>
            <span style={{ fontFamily: V1.fontBody, fontSize: 13.5, color: V1.ink }}>{email || 'user@delt.com'}</span>
          </span>
          <button type="button" onClick={onSignOut} disabled={signingOut} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 8,
            background: `${V1.blue}10`, border: 'none', color: V1.blue, cursor: signingOut ? 'progress' : 'pointer',
            fontFamily: V1.fontBody, fontSize: 13, fontWeight: 600,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 14H3V2h3M11 11l3-3-3-3M14 8H6"/></svg>
            {signingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      </div>
    </div>
  );
}

function V1DashboardPage({ user, application, onSignOut, onApply, onNavHome }) {
  const mounted = useV1Mounted(40);
  const [tab, setTab] = React.useState('summary');
  const [session, setSession] = React.useState(null);
  const [signingOut, setSigningOut] = React.useState(false);

  // Pull the live session so the header/Settings show the real account email.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try { const { data } = await v1GetSession(); if (!cancelled && data && data.session) setSession(data.session); }
      catch (_) { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const activeUser = (session && session.user) || user || null;
  const email = (activeUser && activeUser.email) || 'user@delt.com';

  const stored = application && application.dashboard;
  const hasData = !!(stored && typeof stored === 'object' && Object.keys(stored).length);
  const data = v1ResolveDash(stored);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try { onSignOut && await onSignOut(); } finally { setSigningOut(false); }
  };

  const tabs = [
    { k: 'summary',   label: 'Summary',   icon: <path d="M3 13l3-4 3 2 4-6" /> },
    { k: 'payments',  label: 'Payments',  icon: <><rect x="2.5" y="4" width="11" height="8" rx="1.5"/><path d="M2.5 7h11"/></> },
    { k: 'documents', label: 'Documents', icon: <><path d="M4 2h5l3 3v9H4z"/><path d="M9 2v3h3"/></> },
    { k: 'settings',  label: 'Settings',  icon: <><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13"/></> },
  ];

  return (
    <section data-v1-section style={{ background: V1.bg, minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 900px) {
          [data-v1-dash-tiles] { grid-template-columns: 1fr 1fr !important; }
          [data-v1-dash-3col]  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          [data-v1-dash-tiles] { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <V1DashHeader
        email={email} account={data.account} hasData={hasData}
        accountStatus={data.accountStatus} performance={data.performance}
        onSignOut={handleSignOut} signingOut={signingOut} onNavHome={onNavHome}
      />

      {/* Tab nav */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${V1.line}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {tabs.map((t) => {
            const active = tab === t.k;
            return (
              <button key={t.k} type="button" onClick={() => setTab(t.k)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 16px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${active ? V1.blue : 'transparent'}`,
                color: active ? V1.blue : V1.muted,
                fontFamily: V1.fontBody, fontSize: 14, fontWeight: active ? 600 : 500, whiteSpace: 'nowrap',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '28px 32px 80px',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {!hasData && (
          <div style={{
            marginBottom: 20, padding: '14px 18px', borderRadius: 12,
            background: `${V1.blue}0C`, border: `1px solid ${V1.blue}33`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke={V1.blue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6.5"/><path d="M8 11v-3M8 5.5h.01"/></svg>
            <span style={{ fontFamily: V1.fontBody, fontSize: 13.5, color: V1.ink, lineHeight: 1.45 }}>
              Your account details are being set up. Your balance, payment schedule, and documents will appear here shortly.
            </span>
          </div>
        )}
        {tab === 'summary'   && <V1DashSummary data={data} onPay={() => {}} />}
        {tab === 'payments'  && <V1DashPayments data={data} />}
        {tab === 'documents' && <V1DashDocuments data={data} />}
        {tab === 'settings'  && <V1DashSettings email={email} data={data} />}
      </div>
    </section>
  );
}

Object.assign(window, { V1DashboardPage, V1_DASH_EMPTY, v1ResolveDash });
