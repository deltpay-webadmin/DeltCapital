// V1 Admin — Supabase-login-gated operator console.
//
// Reached when an admin (email in the allowlist — see api/_supabase-auth.js and
// V1_ADMIN_EMAILS in variation-1-auth.jsx) signs in through the normal login.
// Lets the operator:
//   • see every application and a queue of those waiting on a decision,
//   • Approve / Deny an application (with an optional decline reason),
//   • manually enter the customer's dashboard servicing data (which the
//     customer's dashboard then renders).
//
// All reads/writes go through /api/admin-applications, which re-checks the
// caller is an admin server-side. Reuses v1ResolveDash / V1_DASH_EMPTY and the
// v1Money helper from variation-1-dashboard.jsx.

const V1_ADMIN_STATUS_TONE = {
  in_review: { bg: `${V1.blue}16`, fg: V1.blue, label: 'In Review' },
  approved:  { bg: 'rgba(16,185,129,0.12)', fg: '#047857', label: 'Approved' },
  denied:    { bg: 'rgba(220,38,38,0.10)', fg: '#b91c1c', label: 'Denied' },
  applied:   { bg: V1.line, fg: V1.muted, label: 'Applied' },
};

// Scalar field schema for the dashboard-data editor, grouped into sections.
const V1_ADMIN_FIELD_GROUPS = [
  ['Account', [
    ['account', 'Account ID', 'text'],
    ['accountStatus', 'Account status', 'text'],
    ['performance', 'Performance', 'text'],
  ]],
  ['Loan terms', [
    ['originalAdvance', 'Original advance', 'money'],
    ['factorRate', 'Factor rate', 'num'],
    ['totalRepayment', 'Total repayment', 'money'],
    ['costOfCapital', 'Cost of capital', 'money'],
    ['monthlyPayment', 'Monthly payment', 'money'],
    ['termMonths', 'Term (months)', 'int'],
  ]],
  ['Progress', [
    ['paymentsMade', 'Payments made', 'int'],
    ['paymentsRemaining', 'Payments remaining', 'int'],
    ['totalPaid', 'Total paid', 'money'],
    ['totalRemaining', 'Total remaining', 'money'],
    ['currentPayoff', 'Current payoff', 'money'],
    ['principalBalance', 'Principal balance', 'money'],
    ['principalRepaid', 'Principal repaid', 'money'],
    ['principalOutstanding', 'Principal outstanding', 'money'],
  ]],
  ['Past due & next payment', [
    ['amountPastDue', 'Amount past due', 'money'],
    ['daysPastDue', 'Days past due', 'int'],
    ['nextPaymentAmount', 'Next payment amount', 'money'],
    ['nextPaymentDate', 'Next payment date', 'text'],
    ['nextPaymentDueInDays', 'Next payment due in (days)', 'int'],
    ['nextPaymentNumber', 'Next payment number', 'int'],
  ]],
  ['Splits — paid / remaining', [
    ['paidPrincipal', 'Paid · principal', 'money'],
    ['paidFactorFees', 'Paid · factor fees', 'money'],
    ['remainingPrincipal', 'Remaining · principal', 'money'],
    ['remainingFactorFees', 'Remaining · factor fees', 'money'],
  ]],
  ['Dates & AutoPay', [
    ['estPayoff', 'Estimated payoff', 'text'],
    ['originationDate', 'Origination date', 'text'],
    ['lastPaymentDate', 'Last payment date', 'text'],
    ['autopayBankLast4', 'AutoPay bank (last 4)', 'text'],
  ]],
];

const V1_HISTORY_STATES = ['na', 'ok', '30', '60', '90'];
const V1_ADMIN_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function v1AdminToken() { return v1GetAccessToken(); }

// ─── Field primitives ───
function V1AdminLabel({ children }) {
  return <div style={{ fontFamily: V1.fontMono, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: V1.muted, marginBottom: 6 }}>{children}</div>;
}
function V1AdminInput({ value, onChange, type = 'text', placeholder }) {
  return (
    <input
      type={type} value={value === 0 ? '0' : (value || '')} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.currentTarget.style.borderColor = V1.blue; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = V1.line; }}
      style={{
        width: '100%', padding: '9px 11px', background: '#fff',
        border: `1px solid ${V1.line}`, borderRadius: 8, outline: 'none',
        fontFamily: V1.fontBody, fontSize: 13.5, color: V1.ink, boxSizing: 'border-box',
      }}
    />
  );
}
function V1AdminSelect({ value, onChange, opts }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      width: '100%', padding: '8px 9px', background: '#fff', border: `1px solid ${V1.line}`,
      borderRadius: 8, outline: 'none', fontFamily: V1.fontBody, fontSize: 12.5, color: V1.ink, cursor: 'pointer',
    }}>
      {opts.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function V1AdminGhostBtn({ children, onClick, tone }) {
  const c = tone === 'danger' ? '#b91c1c' : tone === 'good' ? '#047857' : V1.ink;
  return (
    <button type="button" onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8,
      background: '#fff', border: `1px solid ${V1.line}`, color: c, cursor: 'pointer',
      fontFamily: V1.fontBody, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

// ─── Dashboard-data editor drawer ───
function V1AdminEditor({ app, onClose, onSaved }) {
  const [form, setForm] = React.useState(() => v1ResolveDash(app.dashboard));
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState('');

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const parse = (kind, raw) => {
    if (kind === 'text') return raw;
    const n = parseFloat(String(raw).replace(/[^0-9.\-]/g, ''));
    if (isNaN(n)) return 0;
    return kind === 'int' ? Math.round(n) : n;
  };

  // Transactions
  const addTxn = () => setForm((f) => ({ ...f, transactions: [...f.transactions, { date: '', amount: 0, principal: 0, fee: 0 }] }));
  const setTxn = (i, k, v) => setForm((f) => { const t = f.transactions.slice(); t[i] = { ...t[i], [k]: k === 'date' ? v : (parseFloat(String(v).replace(/[^0-9.\-]/g, '')) || 0) }; return { ...f, transactions: t }; });
  const delTxn = (i) => setForm((f) => ({ ...f, transactions: f.transactions.filter((_, j) => j !== i) }));

  // History
  const years = Object.keys(form.history).map(Number).filter((n) => !isNaN(n)).sort((a, b) => b - a);
  const addYear = () => {
    const y = prompt('Year to add (e.g. 2025)');
    const n = parseInt(y, 10);
    if (!n || n < 2000 || n > 2100) return;
    setForm((f) => ({ ...f, history: { ...f.history, [n]: f.history[n] || Array(12).fill('na') } }));
  };
  const setMonth = (y, mi, v) => setForm((f) => { const arr = (f.history[y] || Array(12).fill('na')).slice(); arr[mi] = v; return { ...f, history: { ...f.history, [y]: arr } }; });
  const delYear = (y) => setForm((f) => { const h = { ...f.history }; delete h[y]; return { ...f, history: h }; });

  // Documents
  const addDoc = () => setForm((f) => ({ ...f, documents: [...f.documents, { title: '', kind: '', date: '' }] }));
  const setDoc = (i, k, v) => setForm((f) => { const d = f.documents.slice(); d[i] = { ...d[i], [k]: v }; return { ...f, documents: d }; });
  const delDoc = (i) => setForm((f) => ({ ...f, documents: f.documents.filter((_, j) => j !== i) }));

  const save = async () => {
    setSaving(true); setErr('');
    try {
      const token = await v1AdminToken();
      const res = await fetch('/api/admin-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: app.id, dashboard: form }),
      });
      if (!res.ok) { setErr(`Save failed (${res.status}).`); return; }
      const data = await res.json().catch(() => null);
      onSaved && onSaved(data && data.application);
    } catch (e) { setErr(String(e && e.message || e)); }
    finally { setSaving(false); }
  };

  const sectionTitle = (t) => (
    <div style={{ fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.ink, margin: '22px 0 12px' }}>{t}</div>
  );

  return ReactDOM.createPortal(
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(4,30,66,0.5)',
      backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end',
    }}>
      <div style={{ width: 'min(720px, 100%)', height: '100%', background: V1.bg, boxShadow: '-20px 0 60px -20px rgba(4,30,66,0.5)', display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${V1.line}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 700, color: V1.ink }}>Edit dashboard data</div>
            <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted, marginTop: 2 }}>{app.business_name || '—'} · {app.email || '—'}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${V1.line}`, background: '#fff', color: V1.muted, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l8 8M11 3l-8 8"/></svg>
          </button>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 24px' }}>
          {V1_ADMIN_FIELD_GROUPS.map(([group, fields]) => (
            <div key={group}>
              {sectionTitle(group)}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {fields.map(([key, label, kind]) => (
                  <div key={key}>
                    <V1AdminLabel>{label}</V1AdminLabel>
                    <V1AdminInput
                      value={form[key]}
                      type={kind === 'text' ? 'text' : 'text'}
                      onChange={(v) => setField(key, parse(kind, v))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Transactions */}
          {sectionTitle('Transactions')}
          {form.transactions.length === 0 && <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted, marginBottom: 10 }}>None yet.</div>}
          {form.transactions.map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 34px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <V1AdminInput value={t.date} placeholder="MM/DD/YYYY" onChange={(v) => setTxn(i, 'date', v)} />
              <V1AdminInput value={t.amount} placeholder="Amount" onChange={(v) => setTxn(i, 'amount', v)} />
              <V1AdminInput value={t.principal} placeholder="Principal" onChange={(v) => setTxn(i, 'principal', v)} />
              <V1AdminInput value={t.fee} placeholder="Fee" onChange={(v) => setTxn(i, 'fee', v)} />
              <button type="button" onClick={() => delTxn(i)} aria-label="Remove" style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${V1.line}`, background: '#fff', color: '#b91c1c', cursor: 'pointer' }}>×</button>
            </div>
          ))}
          <V1AdminGhostBtn onClick={addTxn}>+ Add transaction</V1AdminGhostBtn>

          {/* Payment history */}
          {sectionTitle('Payment history')}
          {years.length === 0 && <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted, marginBottom: 10 }}>No years added.</div>}
          {years.map((y) => (
            <div key={y} style={{ marginBottom: 12, padding: 12, background: '#fff', border: `1px solid ${V1.line}`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: V1.fontDisplay, fontSize: 14, fontWeight: 700, color: V1.ink }}>{y}</span>
                <button type="button" onClick={() => delYear(y)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 12 }}>Remove year</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                {V1_ADMIN_MONTHS.map((m, mi) => (
                  <div key={m}>
                    <div style={{ fontFamily: V1.fontMono, fontSize: 9, color: V1.muted, textAlign: 'center', marginBottom: 3 }}>{m}</div>
                    <V1AdminSelect value={(form.history[y] || [])[mi] || 'na'} onChange={(v) => setMonth(y, mi, v)} opts={V1_HISTORY_STATES} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <V1AdminGhostBtn onClick={addYear}>+ Add year</V1AdminGhostBtn>

          {/* Documents */}
          {sectionTitle('Documents')}
          {form.documents.length === 0 && <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted, marginBottom: 10 }}>None yet.</div>}
          {form.documents.map((doc, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 34px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <V1AdminInput value={doc.title} placeholder="Title" onChange={(v) => setDoc(i, 'title', v)} />
              <V1AdminInput value={doc.kind} placeholder="Kind" onChange={(v) => setDoc(i, 'kind', v)} />
              <V1AdminInput value={doc.date} placeholder="MM/DD/YYYY" onChange={(v) => setDoc(i, 'date', v)} />
              <button type="button" onClick={() => delDoc(i)} aria-label="Remove" style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${V1.line}`, background: '#fff', color: '#b91c1c', cursor: 'pointer' }}>×</button>
            </div>
          ))}
          <V1AdminGhostBtn onClick={addDoc}>+ Add document</V1AdminGhostBtn>
        </div>

        {/* footer */}
        <div style={{ padding: '14px 24px', borderTop: `1px solid ${V1.line}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: err ? '#b91c1c' : V1.muted }}>{err || 'Saved data appears on the customer dashboard immediately.'}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <V1AdminGhostBtn onClick={onClose}>Cancel</V1AdminGhostBtn>
            <button type="button" onClick={save} disabled={saving} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none', cursor: saving ? 'progress' : 'pointer',
              background: V1.blue, color: '#fff', fontFamily: V1.fontDisplay, fontSize: 14, fontWeight: 700, opacity: saving ? 0.7 : 1,
            }}>{saving ? 'Saving…' : 'Save data'}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Application row ───
function V1AdminRow({ app, onDecision, onEdit }) {
  const tone = V1_ADMIN_STATUS_TONE[app.status] || V1_ADMIN_STATUS_TONE.applied;
  const amount = app.offer && app.offer.amount ? `$${Number(app.offer.amount).toLocaleString()}` : '—';
  const when = app.created_at ? new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.9fr 1fr auto', gap: 12, alignItems: 'center', padding: '14px 16px', borderTop: `1px solid ${V1.line}` }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600, color: V1.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.business_name || '—'}</div>
        <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 2 }}>{app.email || '—'}</div>
      </div>
      <div style={{ fontFamily: V1.fontDisplay, fontSize: 14, fontWeight: 700, color: V1.ink, fontVariantNumeric: 'tabular-nums' }}>{amount}</div>
      <div><span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: tone.bg, color: tone.fg, fontFamily: V1.fontBody, fontSize: 11.5, fontWeight: 600 }}>{tone.label}</span></div>
      <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted }}>{when}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {app.status !== 'approved' && <V1AdminGhostBtn tone="good" onClick={() => onDecision(app, 'approved')}>Approve</V1AdminGhostBtn>}
        {app.status !== 'denied' && <V1AdminGhostBtn tone="danger" onClick={() => onDecision(app, 'denied')}>Deny</V1AdminGhostBtn>}
        <V1AdminGhostBtn onClick={() => onEdit(app)}>Edit data</V1AdminGhostBtn>
      </div>
    </div>
  );
}

function V1AdminPage({ user, onSignOut, onNavHome }) {
  const mounted = useV1Mounted(40);
  const [apps, setApps] = React.useState(null); // null = loading
  const [err, setErr] = React.useState('');
  const [filter, setFilter] = React.useState('all'); // all | in_review | approved | denied
  const [editing, setEditing] = React.useState(null);
  const [signingOut, setSigningOut] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const token = await v1AdminToken();
      if (!token) { setErr('Session expired — sign in again.'); setApps([]); return; }
      const res = await fetch('/api/admin-applications', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 403) { setErr('Your account is not an admin.'); setApps([]); return; }
      if (!res.ok) { setErr(`Could not load applications (${res.status}).`); setApps([]); return; }
      const data = await res.json().catch(() => null);
      setApps((data && data.applications) || []);
      setErr('');
    } catch (e) { setErr(String(e && e.message || e)); setApps([]); }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const decide = async (app, status) => {
    let reason = '';
    if (status === 'denied') {
      reason = prompt('Reason for denial (optional, shown to the applicant):') || '';
    }
    try {
      const token = await v1AdminToken();
      const res = await fetch('/api/admin-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: app.id, decision: { status, reason } }),
      });
      if (!res.ok) { setErr(`Update failed (${res.status}).`); return; }
      await load();
    } catch (e) { setErr(String(e && e.message || e)); }
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try { onSignOut && await onSignOut(); } finally { setSigningOut(false); }
  };

  const list = apps || [];
  const queue = list.filter((a) => a.status === 'in_review' || a.status === 'applied');
  const filtered = filter === 'all' ? list : list.filter((a) => a.status === filter);
  const email = (user && user.email) || 'admin';

  const filters = [
    ['all', `All (${list.length})`],
    ['in_review', `In Review (${list.filter((a) => a.status === 'in_review').length})`],
    ['approved', `Approved (${list.filter((a) => a.status === 'approved').length})`],
    ['denied', `Denied (${list.filter((a) => a.status === 'denied').length})`],
  ];

  return (
    <section data-v1-section style={{ background: V1.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${V1.line}`, position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src="app/assets/logo-dark.png" alt="Delt Capital — back to site" onClick={onNavHome} title="Back to deltcapital.com" style={{ height: 26, width: 'auto', display: 'block', cursor: 'pointer' }} />
            <span aria-hidden style={{ width: 1, height: 22, background: V1.line }} />
            <span style={{ fontFamily: V1.fontMono, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.ink }}>Admin console</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: V1.fontBody, fontSize: 13.5, color: V1.ink }}>{email}</span>
            <button type="button" onClick={handleSignOut} disabled={signingOut} style={{
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

      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '28px 32px 80px',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {err && (
          <div role="alert" style={{ marginBottom: 18, padding: '12px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.22)', fontFamily: V1.fontBody, fontSize: 13.5, color: '#b91c1c' }}>{err}</div>
        )}

        {/* Queue — waiting on a decision */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ margin: 0, fontFamily: V1.fontDisplay, fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: V1.ink }}>Waiting on a decision</h1>
          <span style={{ fontFamily: V1.fontBody, fontSize: 13, color: V1.muted }}>{queue.length} new {queue.length === 1 ? 'applicant' : 'applicants'}</span>
        </div>
        <V1DashCard style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
          {apps === null ? (
            <div style={{ padding: 28, textAlign: 'center', fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted }}>Loading…</div>
          ) : queue.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted }}>No applicants waiting. 🎉</div>
          ) : (
            queue.map((a) => <V1AdminRow key={a.id} app={a} onDecision={decide} onEdit={setEditing} />)
          )}
        </V1DashCard>

        {/* All applications with filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <h2 style={{ margin: '0 12px 0 0', fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700, color: V1.ink }}>All applications</h2>
          {filters.map(([k, label]) => (
            <button key={k} type="button" onClick={() => setFilter(k)} style={{
              padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
              border: `1px solid ${filter === k ? V1.blue : V1.line}`,
              background: filter === k ? `${V1.blue}10` : '#fff',
              color: filter === k ? V1.blue : V1.muted,
              fontFamily: V1.fontBody, fontSize: 12.5, fontWeight: 600,
            }}>{label}</button>
          ))}
        </div>
        <V1DashCard style={{ padding: 0, overflow: 'hidden' }}>
          {apps === null ? (
            <div style={{ padding: 28, textAlign: 'center', fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted }}>No applications.</div>
          ) : (
            filtered.map((a) => <V1AdminRow key={a.id} app={a} onDecision={decide} onEdit={setEditing} />)
          )}
        </V1DashCard>
      </div>

      {editing && (
        <V1AdminEditor
          app={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => { setEditing(null); if (updated) setApps((prev) => (prev || []).map((a) => a.id === updated.id ? updated : a)); else load(); }}
        />
      )}
    </section>
  );
}

Object.assign(window, { V1AdminPage });
