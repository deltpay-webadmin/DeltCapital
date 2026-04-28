// Shared tokens, data, and primitives used across all 4 Delt variations.
// Each variation imports what it needs from window.DeltShared.

const DELT = {
  // Palette — warm-neutral paper + indigo/violet accent. No navy navbar.
  colors: {
    ink: '#0F0E17',
    inkSoft: '#2B2A35',
    inkMute: '#6A6876',
    line: '#E7E3DA',
    lineSoft: '#EFECE4',
    paper: '#F7F5F0',
    paperWarm: '#FAF8F3',
    card: '#FFFFFF',
    indigo: '#4945FF',
    indigoDeep: '#3730A3',
    violet: '#4945FF',
    ok: '#0F7A5A',
    warn: '#B8531A',
  },
  font: {
    // Brand §4.1 — Codec Pro primary display; Manrope free stand-in until
    // licensed Codec Pro .woff2 files are dropped at /fonts/.
    display: '"Codec Pro", "Manrope", "Inter Tight", "Söhne", ui-sans-serif, system-ui, sans-serif',
    // Brand §4.2 — Inter secondary body.
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
  },
  radius: { sm: 4, md: 6, lg: 10, xl: 14 },
};

// ---------------- Canonical content for Delt ----------------

const DeltContent = {
  tagline: 'Capital for operators who don\'t overpay.',
  stats: [
    { v: '$200M+', l: 'Deployed since 2019' },
    { v: '2,850+', l: 'Businesses funded' },
    { v: '24h', l: 'Median time to funds' },
    { v: '1.18x', l: 'Median factor rate' },
  ],
  compare: [
    { k: 'Speed to funds',      delt: '24 hours',               bank: '2–6 weeks' },
    { k: 'Factor rate (median)', delt: '1.18×',                  bank: '1.35–1.49×' },
    { k: 'Paperwork',           delt: 'Plaid connection',       bank: '3 months statements, tax returns' },
    { k: 'Credit pull',         delt: 'Soft inquiry',           bank: 'Hard pull' },
    { k: 'Collateral',          delt: 'None',                   bank: 'Personal guarantee + UCC' },
    { k: 'Prepayment penalty',  delt: 'None — early pays save', bank: 'Full factor owed' },
  ],
  steps: [
    { n: '01', t: 'Get Funded', d: 'Three questions. Soft-pull only. Range in 60 seconds.', time: '1 min' },
    { n: '02', t: 'Connect bank', d: 'Plaid read-only. No statements, no tax returns.', time: '2 min' },
    { n: '03', t: 'Offer', d: 'A single factor rate, flat fee schedule, no compounding.', time: 'Same day' },
    { n: '04', t: 'Fund', d: 'Wire or ACH to your operating account. You pick.', time: '24 h' },
  ],
  uses: [
    'Inventory buy-ins', 'Equipment', 'Hiring', 'Bridge A/R', 'New location', 'Marketing push',
    'Renovation', 'Emergency repairs', 'Supplier deposits', 'Seasonal ramp',
  ],
  testimonials: [
    { q: 'Closed in 19 hours. The bank still hasn\'t returned my call.', n: 'Maria Rodriguez', b: 'La Rosa Restaurant', f: '$110K', r: '1.16×' },
    { q: 'Third draw with Delt. Every rate has been lower than the last.', n: 'Mike Rosario', b: 'Rosario Construction', f: '$180K', r: '1.14×' },
    { q: 'Factor rate on the first email. No games, no callbacks, no "advisor".', n: 'Sarah Thompson', b: 'Bloom Beauty', f: '$65K', r: '1.19×' },
    { q: 'Paid early and they actually rebated the unearned factor. Unheard of.', n: 'Marcus Williams', b: 'Williams Logistics', f: '$80K', r: '1.17×' },
    { q: 'I forwarded the offer to my CFO — she said "take it, I can\'t beat that."', n: 'Emily Ward', b: 'Ward Market', f: '$50K', r: '1.18×' },
    { q: 'Underwriter called me by name and knew my book. Not a call center.', n: 'David Roberts', b: 'Roberts Auto', f: '$95K', r: '1.15×' },
  ],
  faq: [
    { q: 'What\'s a factor rate, really?', a: 'One multiplier. $100K at 1.18× = $118K repaid, total. No compounding, no APR gymnastics. Pay early, pay less — we rebate unearned factor.' },
    { q: 'How is repayment structured?', a: 'A fixed daily or weekly debit sized to your revenue. Typically 4–10 months. You see the schedule in your offer before you sign anything.' },
    { q: 'Will this hurt my credit?', a: 'No. Get Funded is a soft pull. A hard pull only happens if you counter-sign an offer — and only on the guarantor, not the business.' },
    { q: 'Do I need collateral?', a: 'No UCC-1 filing, no personal guarantee beyond a standard assurance. We underwrite revenue, not assets.' },
    { q: 'What if revenue drops mid-term?', a: 'Call us. We\'ve restructured ~12% of active books without penalty. Talk to us before you miss a debit.' },
    { q: 'Does my rate get better on a second draw?', a: 'Yes. Repeat borrowers in good standing typically see 4–8 basis points off the factor on each renewal. 68% of our book funds with us more than once — the math is in the file.' },
  ],
};

// ---------------- Calculator logic ----------------

function calcEstimate({ revenue, tib, cards, cardSales }) {
  // Returns { low, high, factor, ok }
  if (!revenue || revenue <= 0 || !tib) return { low: 0, high: 0, factor: 1.18, ok: false };
  const mult = { '<6mo': [0.0, 0.0], '6-12mo': [0.50, 0.56], '1-2yr': [0.56, 0.62], '2yr+': [0.60, 0.67] }[tib] || [0, 0];
  if (tib === '<6mo') return { low: 0, high: 0, factor: 1.18, ok: false, early: true };
  let low = revenue * mult[0];
  let high = revenue * mult[1];
  if (cards && cardSales > 0) { low *= 1.08; high *= 1.12; }
  // Factor: larger advances → lower factor; longer TIB → lower factor
  let factor = 1.22;
  if (tib === '2yr+') factor -= 0.04;
  else if (tib === '1-2yr') factor -= 0.02;
  if (high > 100000) factor -= 0.02;
  if (high > 250000) factor -= 0.02;
  factor = Math.max(1.12, factor);
  low = Math.round(low / 1000) * 1000;
  high = Math.round(high / 1000) * 1000;
  low = Math.max(5000, Math.min(low, 500000));
  high = Math.max(low + 2000, Math.min(high, 500000));
  return { low, high, factor, ok: true };
}

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000).toLocaleString()}K`;
  return `$${n.toLocaleString()}`;
}

// ---------------- Mini atoms ----------------

function Divider({ color = DELT.colors.line, style = {} }) {
  return <div style={{ height: 1, background: color, ...style }} />;
}

function Pill({ children, tone = 'ink', style = {} }) {
  const bg = tone === 'indigo' ? 'rgba(73,69,255,0.08)' : tone === 'ok' ? 'rgba(15,122,90,0.10)' : 'rgba(15,14,23,0.05)';
  const fg = tone === 'indigo' ? DELT.colors.indigo : tone === 'ok' ? DELT.colors.ok : DELT.colors.inkSoft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 500, letterSpacing: '0.02em',
      color: fg, background: bg, padding: '4px 9px', borderRadius: 999,
      fontFamily: DELT.font.body, textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

// A thin hairline button matching Stripe's restraint.
function Btn({ children, variant = 'primary', size = 'md', onClick, style = {}, ...rest }) {
  const sz = size === 'sm' ? { padding: '7px 12px', fontSize: 13 } :
             size === 'lg' ? { padding: '13px 22px', fontSize: 15 } :
             { padding: '10px 16px', fontSize: 14 };
  const variants = {
    primary: { background: DELT.colors.ink, color: '#fff', border: `1px solid ${DELT.colors.ink}` },
    indigo:  { background: DELT.colors.indigo, color: '#fff', border: `1px solid ${DELT.colors.indigo}` },
    ghost:   { background: 'transparent', color: DELT.colors.ink, border: `1px solid ${DELT.colors.line}` },
    link:    { background: 'transparent', color: DELT.colors.indigo, border: '1px solid transparent', padding: 0 },
  };
  return (
    <button onClick={onClick} style={{
      ...variants[variant], ...sz,
      borderRadius: 6, fontFamily: DELT.font.body, fontWeight: 500,
      cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex',
      alignItems: 'center', gap: 6, transition: 'transform .1s, background .15s, box-shadow .15s',
      ...style,
    }} onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)'; }}
       onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
       onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
       {...rest}>{children}</button>
  );
}

// Stripe-ish hairline tick
const Tick = ({ c = DELT.colors.ok }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
    <path d="M3 7.2L5.8 10 11 4.5" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Ex = ({ c = DELT.colors.inkMute }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
    <path d="M4 4L10 10M10 4L4 10" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);
const Arr = ({ c = 'currentColor' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <path d="M3 7h8M8 4l3 3-3 3" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------- Exports ----------------
Object.assign(window, {
  DELT, DeltContent, calcEstimate, fmt,
  Divider, Pill, Btn, Tick, Ex, Arr,
});
