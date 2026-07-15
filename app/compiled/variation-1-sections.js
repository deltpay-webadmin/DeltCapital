const V1 = {
  bg: '#f6f9fc',
  bgWarm: '#f1f2f4',
  ink: '#041E42',
  muted: '#697386',
  text: '#425466',
  line: '#dcdfe4',
  blue: '#4945FF',
  blueSoft: '#A5B4FC',
  green: '#1F845A',
  red: '#c9372c',
  white: '#ffffff',
  fontDisplay: '"Codec Pro", "Manrope", "Inter Tight", "Söhne", ui-sans-serif, system-ui, sans-serif',
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, Menlo, monospace'
};
function V1Eyebrow({
  children,
  color = V1.blue,
  onDark = false
}) {
  return React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      textTransform: 'uppercase',
      fontFamily: V1.fontMono,
      fontSize: 11.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      color: color
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      display: 'inline-block',
      width: 16,
      height: 1,
      background: color
    }
  }), children);
}
const v1H2 = {
  fontFamily: V1.fontDisplay,
  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
  fontWeight: 600,
  letterSpacing: '-0.035em',
  lineHeight: 1.05,
  color: V1.ink,
  margin: 0
};
function V1CompareSection() {
  const [visible, setVisible] = React.useState(false);
  const sectionRef = React.useRef(null);
  React.useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, {
      threshold: 0.2
    });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);
  const rows = [{
    k: 'Application process',
    delt: 'Apply in 5 minutes. Decision in 24–48 hours.',
    bank: 'Detailed financial review; weeks of back-and-forth.',
    win: 'minutes, not weeks',
    tone: 'pos',
    strength: 0.98
  }, {
    k: 'Max funding',
    delt: '$10,000 – $500,000',
    bank: 'Varies; depends on collateral and profile.',
    win: 'clear ceiling',
    tone: 'pos',
    strength: 0.85
  }, {
    k: 'Funding term',
    delt: 'Flexible, up to 18 months.',
    bank: 'Bank-set; little room to negotiate.',
    win: 'you set the pace',
    tone: 'pos',
    strength: 0.80
  }, {
    k: 'Application requirements',
    delt: '3–4 months of bank statements.',
    bank: 'Bank statements + P&L / balance sheet + tax returns + projections.',
    win: 'no file box',
    tone: 'pos',
    strength: 0.92
  }, {
    k: 'Funding speed',
    delt: 'Next-day funding after approval.',
    bank: 'Several days to weeks after approval.',
    win: 'days, not weeks',
    tone: 'pos',
    strength: 0.97
  }, {
    k: 'Repayment terms',
    delt: 'Flexible — a percentage of daily sales.',
    bank: 'Fixed monthly payments regardless of revenue.',
    win: 'slows when you do',
    tone: 'pos',
    strength: 0.95
  }, {
    k: 'Collateral',
    delt: 'Not required.',
    bank: 'Often required; secured by business or personal assets.',
    win: 'no lien on your life',
    tone: 'pos',
    strength: 1.00
  }, {
    k: 'Use of funds',
    delt: 'No restrictions.',
    bank: 'Restricted to specific approved uses.',
    win: 'spend as you see fit',
    tone: 'pos',
    strength: 1.00
  }, {
    k: 'Cost of capital',
    delt: 'Factor rate; typically 0.18×–0.35× of the funded amount.',
    bank: 'Lower interest rates; total cost lower for qualified borrowers.',
    win: 'priced for speed',
    tone: 'neutral',
    strength: 0.55
  }, {
    k: 'Prepayment ability',
    delt: 'Prepayment incentives; no penalties to prepay.',
    bank: 'Often prepayment fees and penalties.',
    win: 'pay early, save',
    tone: 'pos',
    strength: 0.90
  }];
  return React.createElement("section", {
    "data-v1-section": true,
    "data-v1-comparison-section": true,
    ref: sectionRef,
    style: {
      background: V1.bg,
      padding: '120px 0',
      borderTop: `1px solid ${V1.line}`,
      borderBottom: `1px solid ${V1.line}`
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'end',
      marginBottom: 56
    }
  }, React.createElement("div", null, React.createElement(V1Eyebrow, null, "Banks vs Delt"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      ...v1H2,
      marginTop: 18
    }
  }, "Why Delt beats", React.createElement("br", null), "the bank.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 16.5,
      lineHeight: 1.6,
      color: V1.text,
      margin: 0,
      maxWidth: 460,
      justifySelf: 'end'
    }
  }, "Ten differences that show up the day you actually need capital \u2014 speed, paperwork, collateral, and how you pay it back. Delt terms; typical bank terms.")), React.createElement("div", {
    "data-v1-comparison-mobile": true
  }, rows.map((r, i) => React.createElement("div", {
    key: r.k,
    className: "row"
  }, React.createElement("div", {
    className: "label"
  }, r.k), React.createElement("div", {
    className: "compare"
  }, React.createElement("span", {
    className: "bank"
  }, r.bank), React.createElement("span", {
    className: "delt"
  }, r.delt)), r.tone === 'pos' && React.createElement("span", {
    className: "pill"
  }, r.win)))), React.createElement("div", {
    "data-v1-comparison-desktop": true,
    "data-v1-comparison": true,
    "data-v1-table-wrap": true,
    style: {
      background: V1_CMP.frameBg,
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: '0 40px 90px -50px rgba(4,20,48,0.65), 0 2px 6px rgba(4,20,48,0.20)'
    }
  }, React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '210px 1fr 1fr',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }
  }, React.createElement("div", {
    style: {
      padding: '24px 28px'
    }
  }, React.createElement(V1Eyebrow, {
    color: "rgba(255,255,255,0.5)"
  }, "Metric")), React.createElement("div", {
    style: {
      padding: '24px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: V1_CMP.headBg,
      borderLeft: `1px solid ${V1_CMP.colLine}`
    }
  }, React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: 'rgba(255,255,255,0.10)',
      color: 'rgba(255,255,255,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M2 14h12M3 14V8M6 14V8M10 14V8M13 14V8M1.5 7h13L8 2 1.5 7z"
  }))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 17,
      fontWeight: 600,
      color: 'rgba(255,255,255,0.82)',
      letterSpacing: '-0.015em'
    }
  }, "Traditional bank"), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      color: 'rgba(255,255,255,0.5)',
      marginTop: 2,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "Typical terms"))), React.createElement("div", {
    style: {
      padding: '24px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: V1_CMP.deltHeadBg,
      borderLeft: `1px solid ${V1_CMP.colLine}`,
      boxShadow: 'inset 0 2px 0 rgba(129,140,248,0.55)'
    }
  }, React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: 'linear-gradient(135deg, #6366F1, #818CF8)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(99,102,241,0.5)'
    }
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "currentColor"
  }, React.createElement("path", {
    d: "M8 1L2 8h4l-1 5 6-7H7l1-5z"
  }))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 17,
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '-0.015em'
    }
  }, "Delt", React.createElement("span", {
    style: {
      color: '#A5B4FC'
    }
  }, ".")), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      color: '#A5B4FC',
      marginTop: 2,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "MCA \xB7 direct funder")))), rows.map((r, i) => React.createElement(V1CompareRow, {
    key: r.k,
    r: r,
    i: i,
    visible: visible,
    last: i === rows.length - 1
  }))), React.createElement("div", {
    "data-v1-grid-3col": true,
    "data-v1-weeks-faster": true,
    style: {
      marginTop: 24,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12
    }
  }, [{
    label: 'Median time to funds',
    value: '24 h',
    sub: 'vs weeks at a bank'
  }, {
    label: 'Max funding',
    value: '$500K',
    sub: 'per draw, revenue-based'
  }, {
    label: 'Paperwork required',
    value: '0',
    sub: 'Plaid replaces the file box'
  }].map((s, i) => React.createElement("div", {
    key: i,
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 16,
      padding: '22px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      textTransform: 'uppercase',
      color: V1.muted,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em'
    }
  }, s.label), React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: V1.fontDisplay,
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: '-0.03em',
      color: V1.ink,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1
    }
  }, s.value), React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: V1.fontBody,
      fontSize: 12.5,
      color: V1.muted
    }
  }, s.sub)), React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      background: `${V1.blue}0F`,
      color: V1.blue,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: V1.fontMono,
      fontWeight: 700,
      fontSize: 18
    }
  }, i === 0 ? '⚡' : i === 1 ? '−' : '⊘'))))));
}
const V1_CMP = {
  frameBg: 'linear-gradient(165deg, #0B2249 0%, #071834 100%)',
  headBg: 'rgba(255,255,255,0.03)',
  deltHeadBg: 'rgba(99,102,241,0.16)',
  bankBg: 'transparent',
  deltBg: 'rgba(99,102,241,0.09)',
  colLine: 'rgba(255,255,255,0.07)',
  rowLine: 'rgba(255,255,255,0.06)',
  bankText: 'rgba(255,255,255,0.56)',
  metricNum: '#818CF8',
  winBg: 'rgba(129,140,248,0.16)',
  winFg: '#C7D2FE',
  winBd: 'rgba(129,140,248,0.34)'
};
function V1CompareRow({
  r,
  i,
  visible,
  last
}) {
  const delay = 100 + i * 120;
  return React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '210px 1fr 1fr',
      minHeight: 88,
      borderBottom: last ? 'none' : `1px solid ${V1_CMP.rowLine}`
    }
  }, React.createElement("div", {
    style: {
      padding: '22px 28px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: V1_CMP.metricNum
    }
  }, "0", i + 1), React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 600,
      color: 'rgba(255,255,255,0.92)',
      letterSpacing: '-0.015em',
      lineHeight: 1.2
    }
  }, r.k)), React.createElement("div", {
    style: {
      padding: '22px 28px',
      background: V1_CMP.bankBg,
      borderLeft: `1px solid ${V1_CMP.colLine}`,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      position: 'relative'
    }
  }, React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 22,
      height: 22,
      borderRadius: 999,
      background: 'rgba(255,255,255,0.08)',
      color: 'rgba(255,255,255,0.5)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 14 14"
  }, React.createElement("path", {
    d: "M4 4L10 10M10 4L4 10",
    stroke: "currentColor",
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round"
  }))), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 16.5,
      fontWeight: 500,
      color: V1_CMP.bankText,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.bank)), React.createElement("div", {
    style: {
      padding: '22px 28px',
      background: V1_CMP.deltBg,
      borderLeft: `1px solid ${V1_CMP.colLine}`,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      position: 'relative'
    }
  }, React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 22,
      height: 22,
      borderRadius: 999,
      background: 'linear-gradient(135deg, #6366F1, #818CF8)',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 3px 10px rgba(99,102,241,0.45)'
    }
  }, React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 14 14"
  }, React.createElement("path", {
    d: "M3 7.2L5.8 10 11 4.5",
    stroke: "currentColor",
    strokeWidth: "2.2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 16.5,
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.delt), React.createElement("span", {
    style: {
      flexShrink: 0,
      padding: '4px 10px',
      borderRadius: 999,
      background: V1_CMP.winBg,
      color: V1_CMP.winFg,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      boxShadow: `inset 0 0 0 1px ${V1_CMP.winBd}`
    }
  }, r.win)), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 2,
      width: visible ? `${r.strength * 100}%` : '0%',
      background: 'linear-gradient(90deg, #818CF8, rgba(129,140,248,0.25))',
      transition: `width 1200ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`
    }
  })));
}
function V1StepsSection() {
  const steps = DeltContent.steps;
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.white,
      padding: '96px 0',
      borderTop: `1px solid ${V1.line}`,
      borderBottom: `1px solid ${V1.line}`
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'end',
      marginBottom: 64
    }
  }, React.createElement("div", null, React.createElement(V1Eyebrow, null, "How it works"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      ...v1H2,
      marginTop: 18
    }
  }, "Four steps.", React.createElement("br", null), "One business day.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.6,
      color: V1.text,
      margin: 0,
      maxWidth: 520,
      justifySelf: 'end'
    }
  }, "No sales advisor, no discovery call, no underwriter asking for \"just one more statement.\" We read your deposits, price the deal, send an offer.")), React.createElement("div", {
    style: {
      borderTop: `1px solid ${V1.line}`
    }
  }, steps.map((s, i) => React.createElement("div", {
    "data-v1-grid-3col": true,
    key: s.n,
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr 240px',
      gap: 48,
      alignItems: 'center',
      padding: '40px 0',
      borderBottom: `1px solid ${V1.line}`
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 12.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.blue
    }
  }, "Step ", s.n), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: V1.ink,
      lineHeight: 1.15
    }
  }, s.t), React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: V1.fontBody,
      fontSize: 15.5,
      lineHeight: 1.6,
      color: V1.text,
      maxWidth: 620
    }
  }, s.d)), React.createElement("div", {
    style: {
      borderLeft: `1px solid ${V1.line}`,
      paddingLeft: 24
    }
  }, React.createElement("div", {
    style: {
      textTransform: 'uppercase',
      color: V1.muted,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em'
    }
  }, "Elapsed"), React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: V1.fontDisplay,
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink,
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.time)))))));
}
function V1CalcSection({
  calcState,
  setCalcState,
  onApply,
  onNavHow,
  onNavProcessing
}) {
  return React.createElement("section", {
    "data-v1-calc": true,
    style: {
      background: V1.bg,
      padding: '96px 0'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'end',
      marginBottom: 48
    }
  }, React.createElement("div", null, React.createElement(V1Eyebrow, null, "Live calculator"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      ...v1H2,
      marginTop: 18
    }
  }, "Price the deal", React.createElement("br", null), "before you apply.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.6,
      color: V1.text,
      margin: 0,
      maxWidth: 460,
      justifySelf: 'end'
    }
  }, "Same underwriting logic that runs on every Delt application. Numbers update as you type.")), React.createElement(V1CalcAnalyzer, {
    onApply: onApply,
    onNavHow: onNavHow,
    onNavProcessing: onNavProcessing,
    hideHeader: true
  })));
}
function V1ReviewsSection() {
  const items = DeltContent.testimonials;
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.white,
      padding: '96px 0',
      borderTop: `1px solid ${V1.line}`,
      borderBottom: `1px solid ${V1.line}`
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'end',
      marginBottom: 56
    }
  }, React.createElement("div", null, React.createElement(V1Eyebrow, null, "Operators"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      ...v1H2,
      marginTop: 18
    }
  }, "Verified on the renewal call.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.6,
      color: V1.text,
      margin: 0,
      maxWidth: 480,
      justifySelf: 'end'
    }
  }, "Every quote is from a borrower who has closed at least once. Business names are real, on request.")), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, items.map((t, i) => React.createElement("figure", {
    key: i,
    style: {
      background: V1.bg,
      border: `1px solid ${V1.line}`,
      borderRadius: 20,
      padding: 28,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      minHeight: 240
    }
  }, React.createElement(V1Eyebrow, {
    color: V1.blue
  }, t.b.split(' ')[0]), React.createElement("blockquote", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 19,
      fontWeight: 500,
      letterSpacing: '-0.015em',
      lineHeight: 1.4,
      color: V1.ink,
      margin: 0,
      flex: 1
    }
  }, "\"", t.q, "\""), React.createElement("figcaption", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      borderTop: `1px solid ${V1.line}`,
      paddingTop: 16,
      fontFamily: V1.fontBody,
      fontSize: 12.5,
      color: V1.muted
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      color: V1.ink,
      fontWeight: 500
    }
  }, t.n), React.createElement("div", null, t.b)), React.createElement("div", {
    style: {
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
      fontFamily: V1.fontMono
    }
  }, React.createElement("div", {
    style: {
      color: V1.blue,
      fontWeight: 600
    }
  }, t.f), React.createElement("div", null, t.r))))))));
}
function V1FAQSection() {
  const [open, setOpen] = React.useState(0);
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.bg,
      padding: '96px 0'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 960,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    style: {
      marginBottom: 48
    }
  }, React.createElement(V1Eyebrow, null, "Questions"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      ...v1H2,
      marginTop: 18
    }
  }, "What operators actually ask.")), React.createElement("div", {
    style: {
      borderTop: `1px solid ${V1.line}`
    }
  }, DeltContent.faq.map((f, i) => {
    const isOpen = open === i;
    return React.createElement("div", {
      key: i,
      style: {
        borderBottom: `1px solid ${V1.line}`
      }
    }, React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        width: '100%',
        padding: '24px 0',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
        textAlign: 'left',
        fontFamily: V1.fontDisplay,
        fontSize: 19,
        fontWeight: 500,
        color: V1.ink,
        letterSpacing: '-0.01em'
      }
    }, f.q, React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 28,
        height: 28,
        borderRadius: 999,
        border: `1px solid ${V1.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: V1.blue,
        fontFamily: V1.fontMono,
        fontSize: 16,
        transform: isOpen ? 'rotate(45deg)' : 'none',
        transition: 'transform .2s'
      }
    }, "+")), isOpen && React.createElement("div", {
      style: {
        paddingBottom: 24,
        fontFamily: V1.fontBody,
        fontSize: 15,
        lineHeight: 1.65,
        color: V1.text,
        maxWidth: 760
      }
    }, f.a));
  }))));
}
function V1CTASection({
  onApply,
  onTalk
}) {
  const [secRef, inView] = useV1InView(0.2, '0px 0px -40px 0px');
  const [hoverPrimary, setHoverPrimary] = React.useState(false);
  const [hoverGhost, setHoverGhost] = React.useState(false);
  const steps = [{
    n: '01',
    t: 'NOW',
    d: 'Soft pull · 3 questions'
  }, {
    n: '02',
    t: '60s',
    d: 'A real funding range'
  }, {
    n: '03',
    t: 'SAME DAY',
    d: 'Single-page offer'
  }, {
    n: '04',
    t: '+24h',
    d: 'Money wired'
  }];
  return React.createElement("section", {
    "data-v1-section": true,
    ref: secRef,
    style: {
      background: V1.ink,
      color: '#fff',
      padding: '100px 0 96px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -240,
      right: -200,
      width: 640,
      height: 640,
      background: `radial-gradient(circle, ${V1.blue}22 0%, transparent 60%)`,
      filter: 'blur(24px)',
      pointerEvents: 'none',
      opacity: inView ? 1 : 0,
      transition: 'opacity 1400ms ease-out 200ms'
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      bottom: -280,
      left: -180,
      width: 520,
      height: 520,
      background: `radial-gradient(circle, #818CF81A 0%, transparent 60%)`,
      filter: 'blur(24px)',
      pointerEvents: 'none',
      opacity: inView ? 1 : 0,
      transition: 'opacity 1400ms ease-out 400ms'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      top: 28,
      right: 40,
      fontFamily: V1.fontMono,
      fontSize: 11,
      letterSpacing: '0.18em',
      color: 'rgba(255,255,255,0.42)',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(12px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 80ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 80ms'
    }
  }, "Vol. VII \xB7 Closing", React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: 'rgba(255,255,255,0.32)'
    }
  })), React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 40ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 40ms'
    }
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "Final word")), React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      marginTop: 32,
      display: 'grid',
      gridTemplateColumns: '1fr 360px',
      gap: 72,
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2.6rem, 5.4vw, 4.6rem)',
      fontWeight: 600,
      lineHeight: 1.02,
      letterSpacing: '-0.04em',
      color: '#fff',
      margin: 0,
      maxWidth: 680
    }
  }, React.createElement(V1LineMask, {
    ready: inView,
    delay: 120,
    duration: 900
  }, "Ready when your"), React.createElement(V1LineMask, {
    ready: inView,
    delay: 240,
    duration: 900
  }, "business is.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17.5,
      lineHeight: 1.6,
      color: 'rgba(255,255,255,0.7)',
      margin: '28px 0 0',
      maxWidth: 540,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 520ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 520ms'
    }
  }, "Three questions, a soft pull, and a real funding range. No obligation. No impact to your credit.")), React.createElement("div", {
    style: {
      position: 'relative',
      padding: '38px 36px 32px',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 22,
      background: `linear-gradient(155deg, ${V1.blue}24 0%, ${V1.blue}0a 45%, rgba(255,255,255,0) 100%)`,
      backdropFilter: 'blur(4px)',
      textAlign: 'center',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.97)',
      transition: 'opacity 900ms cubic-bezier(0.22,1,0.36,1) 320ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 320ms'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      left: 16,
      fontFamily: V1.fontMono,
      fontSize: 10,
      letterSpacing: '0.18em',
      color: V1.blueSoft,
      textTransform: 'uppercase',
      opacity: 0.7
    }
  }, "median"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      fontFamily: V1.fontDisplay,
      fontSize: 132,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '-0.06em',
      color: '#fff',
      fontVariantNumeric: 'tabular-nums'
    }
  }, React.createElement(V1CountUp, {
    value: "60",
    duration: 1600,
    start: 380
  }), React.createElement("span", {
    style: {
      fontSize: 64,
      fontWeight: 600,
      letterSpacing: '-0.04em',
      color: V1.blueSoft,
      marginLeft: 6
    }
  }, "s")), React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "From click \u2192 a real range"))), React.createElement("div", {
    style: {
      marginTop: 64,
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      flexWrap: 'wrap',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 700ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 700ms'
    }
  }, React.createElement("button", {
    onClick: onApply,
    onMouseEnter: () => setHoverPrimary(true),
    onMouseLeave: () => setHoverPrimary(false),
    style: {
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      background: V1.blue,
      color: '#fff',
      border: 'none',
      padding: '16px 26px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 15.5,
      fontWeight: 600,
      letterSpacing: '-0.005em',
      boxShadow: hoverPrimary ? `0 12px 28px -10px ${V1.blue}cc, 0 2px 6px ${V1.blue}44` : `0 6px 18px -8px ${V1.blue}aa`,
      transform: hoverPrimary ? 'translateY(-1px)' : 'translateY(0)',
      transition: 'background 180ms, box-shadow 240ms, transform 240ms'
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
      transform: hoverPrimary ? 'translateX(120%)' : 'translateX(-120%)',
      transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)'
    }
  }), "Get Funded", React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 14 14",
    style: {
      transform: hoverPrimary ? 'translateX(3px)' : 'translateX(0)',
      transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)'
    }
  }, React.createElement("path", {
    d: "M3 7h8M8 4l3 3-3 3",
    stroke: "currentColor",
    strokeWidth: "1.8",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), onTalk && React.createElement("button", {
    onClick: onTalk,
    onMouseEnter: () => setHoverGhost(true),
    onMouseLeave: () => setHoverGhost(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: hoverGhost ? 'rgba(255,255,255,0.06)' : 'transparent',
      color: '#fff',
      border: `1px solid ${hoverGhost ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.22)'}`,
      padding: '15px 24px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 15,
      fontWeight: 500,
      transition: 'background 220ms, border-color 220ms'
    }
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("rect", {
    x: "1.5",
    y: "2.5",
    width: "11",
    height: "9",
    rx: "1.5"
  }), React.createElement("path", {
    d: "M4 1v2M10 1v2M1.5 5.5h11"
  })), "Talk to an underwriter", React.createElement("span", {
    style: {
      opacity: hoverGhost ? 1 : 0,
      transform: hoverGhost ? 'translateX(0)' : 'translateX(-4px)',
      transition: 'opacity 220ms, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, "\u2192")), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      letterSpacing: '0.14em',
      color: 'rgba(255,255,255,0.45)',
      textTransform: 'uppercase',
      marginLeft: 8
    }
  }, "Soft-pull \xB7 No obligation")), React.createElement("div", {
    style: {
      marginTop: 88,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      opacity: inView ? 1 : 0,
      transition: 'opacity 700ms ease-out 800ms'
    }
  }, React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: V1.blueSoft
    }
  }), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: V1.blueSoft
    }
  }, "The arc \u2014 click to wire")), React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 36,
      paddingTop: 16
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 20,
      left: 'calc(12.5% - 4px)',
      right: 'calc(12.5% - 4px)',
      height: 1,
      background: 'rgba(255,255,255,0.1)'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      top: 20,
      left: 'calc(12.5% - 4px)',
      height: 1,
      background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
      width: inView ? 'calc(75% + 8px)' : '0%',
      transition: 'width 1500ms cubic-bezier(0.22, 1, 0.36, 1) 900ms'
    }
  }), React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
      position: 'relative'
    }
  }, steps.map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 12px'
    }
  }, React.createElement("span", {
    style: {
      position: 'relative',
      height: 24,
      width: 24,
      marginBottom: 20
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 8,
      width: 10,
      height: 10,
      marginLeft: -5,
      borderRadius: 999,
      background: V1.blue,
      boxShadow: `0 0 0 4px rgba(73,69,255,0.2)`,
      transform: inView ? 'scale(1)' : 'scale(0)',
      transition: `transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${1100 + i * 160}ms`
    }
  })), React.createElement("div", {
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(10px)',
      transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${1200 + i * 160}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${1200 + i * 160}ms`
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.blueSoft,
      marginBottom: 8
    }
  }, "Step ", s.n), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#fff',
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1,
      marginBottom: 8
    }
  }, s.t), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      lineHeight: 1.45,
      color: 'rgba(255,255,255,0.68)'
    }
  }, s.d))))))));
}
const USE_CASES = [{
  k: 'equipment',
  label: 'Equipment & Technology',
  icon: 'wrench',
  blurb: 'Upgrade machinery, purchase new equipment, or invest in technology that improves efficiency.',
  metric: {
    funding: '$45K',
    approval: '24 hrs',
    roi: '+38%'
  },
  stat: {
    label: 'Avg. equipment investment',
    value: '$45K'
  },
  insight: 'Businesses that invest in equipment upgrades see an average 38% productivity increase within the first 6 months of deployment.',
  breakdown: [{
    name: 'Machinery',
    pct: 35
  }, {
    name: 'Software',
    pct: 25
  }, {
    name: 'Hardware',
    pct: 20
  }, {
    name: 'Maintenance',
    pct: 12
  }, {
    name: 'Training',
    pct: 8
  }]
}, {
  k: 'vendor',
  label: 'Vendor Payments',
  icon: 'receipt',
  blurb: 'Pay suppliers on time, negotiate early-pay discounts, and keep your supply chain running smoothly.',
  metric: {
    funding: '$62K',
    approval: '24 hrs',
    roi: '+12%'
  },
  stat: {
    label: 'Avg. early-pay discount captured',
    value: '2.1%'
  },
  insight: 'Operators who take 2/10 net 30 discounts with Delt capital effectively earn 36% APY on their float.',
  breakdown: [{
    name: 'Raw materials',
    pct: 42
  }, {
    name: 'Logistics',
    pct: 22
  }, {
    name: 'Utilities',
    pct: 15
  }, {
    name: 'Service vendors',
    pct: 13
  }, {
    name: 'SaaS tools',
    pct: 8
  }]
}, {
  k: 'payroll',
  label: 'Payroll & Hiring',
  icon: 'users',
  blurb: 'Meet payroll during slow weeks, onboard new hires, and cover recruiting costs without stress.',
  metric: {
    funding: '$38K',
    approval: '24 hrs',
    roi: '+22%'
  },
  stat: {
    label: 'Avg. per-hire ramp cost',
    value: '$8.4K'
  },
  insight: 'Teams that fund hiring through Delt close roles 2.3 weeks faster than those waiting on retained cash flow.',
  breakdown: [{
    name: 'Salaries',
    pct: 54
  }, {
    name: 'Benefits',
    pct: 18
  }, {
    name: 'Recruiting',
    pct: 12
  }, {
    name: 'Onboarding',
    pct: 10
  }, {
    name: 'Contractors',
    pct: 6
  }]
}, {
  k: 'expansion',
  label: 'Business Expansion',
  icon: 'building',
  blurb: 'Open a new location, expand capacity, or enter a new market with capital that moves at your pace.',
  metric: {
    funding: '$120K',
    approval: '48 hrs',
    roi: '+54%'
  },
  stat: {
    label: 'Avg. new-location payback',
    value: '11 mo'
  },
  insight: 'Multi-unit operators funded through Delt hit break-even on new locations 4 months faster than industry average.',
  breakdown: [{
    name: 'Build-out',
    pct: 38
  }, {
    name: 'Lease & CAM',
    pct: 22
  }, {
    name: 'Opening inv.',
    pct: 18
  }, {
    name: 'Marketing',
    pct: 14
  }, {
    name: 'Permits',
    pct: 8
  }]
}, {
  k: 'inventory',
  label: 'Inventory & Stock',
  icon: 'box',
  blurb: 'Stock up for peak season, negotiate bulk pricing, and keep shelves full when demand spikes.',
  metric: {
    funding: '$85K',
    approval: '24 hrs',
    roi: '+28%'
  },
  stat: {
    label: 'Avg. bulk-buy savings',
    value: '14%'
  },
  insight: 'Retailers who pre-stock with Delt capture 2.8× more peak-season revenue than those ordering reactively.',
  breakdown: [{
    name: 'Core SKUs',
    pct: 48
  }, {
    name: 'Seasonal',
    pct: 22
  }, {
    name: 'New products',
    pct: 14
  }, {
    name: 'Packaging',
    pct: 10
  }, {
    name: 'Safety stock',
    pct: 6
  }]
}, {
  k: 'marketing',
  label: 'Marketing Campaigns',
  icon: 'megaphone',
  blurb: 'Fund ad spend, creative production, and launches that have a clear revenue payback.',
  metric: {
    funding: '$28K',
    approval: '24 hrs',
    roi: '+3.2× ROAS'
  },
  stat: {
    label: 'Median campaign ROAS',
    value: '3.2×'
  },
  insight: 'Brands that scale winning campaigns with Delt grow 47% faster than those constrained by retained earnings.',
  breakdown: [{
    name: 'Paid social',
    pct: 38
  }, {
    name: 'Search',
    pct: 24
  }, {
    name: 'Creative',
    pct: 16
  }, {
    name: 'Influencer',
    pct: 12
  }, {
    name: 'Email / SMS',
    pct: 10
  }]
}];
const UC_COLORS = ['#3730A3', '#4945FF', '#6366F1', '#818CF8', '#1F845A'];
function UCIcon({
  name,
  size = 16,
  color = 'currentColor'
}) {
  const c = {
    stroke: color,
    strokeWidth: 1.6,
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  const paths = {
    wrench: React.createElement("path", {
      d: "M10.5 2.5a3.5 3.5 0 014.6 4.6L8 14.2 1.8 8 8.9 0.9a3.5 3.5 0 011.6 1.6z",
      transform: "translate(0,0)"
    }),
    receipt: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M3 1.5v13l2-1 2 1 2-1 2 1 2-1 2 1v-13z"
    }), React.createElement("path", {
      d: "M5.5 5h5M5.5 8h5M5.5 11h3"
    })),
    users: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "6",
      cy: "6",
      r: "2.5"
    }), React.createElement("circle", {
      cx: "11.5",
      cy: "6.5",
      r: "2"
    }), React.createElement("path", {
      d: "M1.5 13.5a4.5 4.5 0 019 0M10 13.5a3.5 3.5 0 014.5 0"
    })),
    building: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M2.5 14V3l5-1.5V14M7.5 14V6l5 1.5V14M1 14h14"
    }), React.createElement("path", {
      d: "M4 5.5h1.5M4 8h1.5M4 10.5h1.5M9.5 9h1.5M9.5 11h1.5"
    })),
    box: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M8 1.5l6 2.5v7L8 14.5 2 11V4z"
    }), React.createElement("path", {
      d: "M2 4l6 2.5 6-2.5M8 6.5V14"
    })),
    megaphone: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M2 6v4l7 3V3zM9 4l4-1.5v11L9 12M2 10v2.5h2L5 10"
    }))
  };
  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    style: c
  }, paths[name]);
}
function useUCReady() {
  const [r, setR] = React.useState(false);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setR(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return r;
}
function UCBar({
  label,
  pct,
  max,
  color,
  delay = 0,
  ready
}) {
  return React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '140px 1fr 48px',
      alignItems: 'center',
      gap: 16
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      color: V1.ink,
      opacity: ready ? 1 : 0,
      transform: ready ? 'translate3d(0,0,0)' : 'translate3d(-6px,0,0)',
      transition: `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`
    }
  }, label), React.createElement("span", {
    style: {
      position: 'relative',
      height: 10,
      background: V1.line,
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      width: ready ? `${pct / max * 100}%` : '0%',
      background: color,
      borderRadius: 999,
      transition: `width 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 80}ms`,
      willChange: 'width'
    }
  })), React.createElement("span", {
    style: {
      textAlign: 'right',
      fontFamily: V1.fontMono,
      fontSize: 13,
      fontWeight: 600,
      color: V1.muted,
      fontVariantNumeric: 'tabular-nums',
      opacity: ready ? 1 : 0,
      transition: `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 350}ms`
    }
  }, pct, "%"));
}
function V1UseCasePane({
  uc,
  active
}) {
  const ready = useUCReady();
  const max = Math.max(...uc.breakdown.map(d => d.pct));
  const stats = [{
    label: 'Avg. funding',
    value: uc.metric.funding
  }, {
    label: 'Approval time',
    value: uc.metric.approval
  }, {
    label: 'ROI increase',
    value: uc.metric.roi,
    arrow: true
  }];
  const enterFade = delay => ({
    opacity: ready ? 1 : 0,
    transform: ready ? 'translate3d(0,0,0)' : 'translate3d(0, 8px, 0)',
    transition: `opacity 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`
  });
  return React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.blue,
      marginBottom: 14,
      ...enterFade(0)
    }
  }, "Ch. ", String(active + 1).padStart(2, '0'), " \u2014 Where it goes"), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 56,
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '-0.03em',
      color: V1.ink,
      margin: 0
    }
  }, React.createElement(V1LineMask, {
    ready: ready,
    delay: 60,
    duration: 900
  }, uc.label, ".")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.55,
      color: V1.text,
      margin: '22px 0 0',
      maxWidth: 560,
      ...enterFade(300)
    }
  }, uc.blurb), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      marginTop: 44,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      borderTop: `1px solid ${V1.line}`,
      borderBottom: `1px solid ${V1.line}`
    }
  }, stats.map((s, i) => React.createElement("div", {
    key: i,
    style: {
      padding: '20px 0',
      paddingLeft: i > 0 ? 28 : 0,
      borderLeft: i > 0 ? `1px solid ${V1.line}` : 'none',
      ...enterFade(420 + i * 90)
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, s.label), React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: V1.fontDisplay,
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: '-0.03em',
      color: V1.ink,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement(V1CountUp, {
    value: s.value,
    duration: 1100,
    start: 420 + i * 90
  }), s.arrow && React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 16 16",
    style: {
      color: V1.green
    }
  }, React.createElement("path", {
    d: "M3 13L13 3M7 3h6v6",
    stroke: "currentColor",
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))))), React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 22,
      ...enterFade(760)
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, "Budget allocation"), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, "% of funding")), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, uc.breakdown.map((b, i) => React.createElement(UCBar, {
    key: i,
    label: b.name,
    pct: b.pct,
    max: max,
    color: UC_COLORS[i % UC_COLORS.length],
    delay: 820 + i * 110,
    ready: ready
  })))), React.createElement("blockquote", {
    style: {
      margin: '52px 0 0',
      paddingLeft: 24,
      borderLeft: `3px solid ${V1.blue}`,
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontSize: 19,
      lineHeight: 1.5,
      color: V1.ink,
      maxWidth: 640,
      ...enterFade(1500)
    }
  }, "\"", uc.insight, "\"", React.createElement("footer", {
    style: {
      marginTop: 10,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: V1.muted,
      fontStyle: 'normal'
    }
  }, "\u2014 ", uc.stat.label, ": ", uc.stat.value)));
}
function V1UseCasesSection() {
  const [active, setActive] = React.useState(0);
  const [hovered, setHovered] = React.useState(null);
  const uc = USE_CASES[active];
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.bg,
      padding: '120px 0'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'end',
      marginBottom: 56
    }
  }, React.createElement("div", null, React.createElement(V1Eyebrow, null, "Use cases"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      ...v1H2,
      marginTop: 18
    }
  }, "Deploy your capital", React.createElement("br", null), "strategically.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 16.5,
      lineHeight: 1.6,
      color: V1.text,
      margin: 0,
      maxWidth: 460,
      justifySelf: 'end'
    }
  }, "Whether you're scaling, investing, or seizing an opportunity, your capital can fuel growth across your business.")), React.createElement("div", {
    "data-v1-capital-picker-mobile": true
  }, React.createElement("h3", null, "Use it for what moves the needle."), React.createElement("ul", null, USE_CASES.map(u => React.createElement("li", {
    key: u.k
  }, React.createElement("strong", null, u.label), u.blurb)))), React.createElement("div", {
    "data-v1-capital-picker-desktop": true,
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '360px 1fr',
      gap: 0,
      borderTop: `1px solid ${V1.ink}`,
      paddingTop: 24
    }
  }, React.createElement("nav", {
    style: {
      paddingRight: 32,
      borderRight: `1px solid ${V1.line}`
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted,
      marginBottom: 20
    }
  }, "Select a path"), React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    }
  }, USE_CASES.map((u, i) => {
    const isActive = i === active;
    const isHover = hovered === i && !isActive;
    return React.createElement("li", {
      key: u.k,
      style: {
        position: 'relative'
      }
    }, React.createElement("button", {
      onClick: () => setActive(i),
      onMouseEnter: () => setHovered(i),
      onMouseLeave: () => setHovered(null),
      style: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '42px 1fr',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        padding: '16px 0',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderBottom: `1px solid ${V1.line}`,
        position: 'relative'
      }
    }, React.createElement("span", {
      "aria-hidden": true,
      style: {
        position: 'absolute',
        left: -32,
        top: '50%',
        transform: `translateY(-50%) scaleX(${isActive ? 1 : 0})`,
        transformOrigin: 'left center',
        width: 20,
        height: 2,
        background: V1.blue,
        transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }), React.createElement("span", {
      style: {
        fontFamily: V1.fontMono,
        fontSize: 11.5,
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: isActive ? V1.blue : isHover ? V1.ink : V1.muted,
        transform: isHover ? 'translate3d(3px,0,0)' : 'translate3d(0,0,0)',
        transition: 'color 220ms, transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }, String(i + 1).padStart(2, '0')), React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-block'
      }
    }, React.createElement("span", {
      style: {
        fontFamily: V1.fontDisplay,
        fontSize: 17,
        fontWeight: isActive ? 600 : 500,
        letterSpacing: '-0.015em',
        color: isActive ? V1.ink : isHover ? V1.ink : V1.text,
        transition: 'color 220ms, font-weight 220ms'
      }
    }, u.label), React.createElement("span", {
      "aria-hidden": true,
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -3,
        height: 1,
        background: V1.ink,
        transformOrigin: 'left center',
        transform: `scaleX(${isHover || isActive ? 1 : 0})`,
        opacity: isActive ? 0 : 1,
        transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms'
      }
    }))));
  })), React.createElement("div", {
    style: {
      marginTop: 24,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      color: V1.muted,
      letterSpacing: '0.14em'
    }
  }, String(active + 1).padStart(2, '0'), " / ", String(USE_CASES.length).padStart(2, '0'))), React.createElement("div", {
    style: {
      paddingLeft: 56
    }
  }, React.createElement(V1UseCasePane, {
    key: active,
    uc: uc,
    active: active
  })))));
}
Object.assign(window, {
  V1Eyebrow,
  V1CompareSection,
  V1StepsSection,
  V1CalcSection,
  V1ReviewsSection,
  V1FAQSection,
  V1CTASection,
  V1UseCasesSection,
  V1
});