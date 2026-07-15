const {
  useState: lnUseState,
  useEffect: lnUseEffect,
  useRef: lnUseRef
} = React;
function LnIcon({
  name,
  size = 16
}) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  if (name === 'revolve') return React.createElement("svg", p, React.createElement("path", {
    d: "M3 8a5 5 0 018.5-3.5L13 6M13 8a5 5 0 01-8.5 3.5L3 10M11 3v3h-3M5 13v-3h3"
  }));
  if (name === 'term') return React.createElement("svg", p, React.createElement("rect", {
    x: "2",
    y: "3",
    width: "12",
    height: "10",
    rx: "1.5"
  }), React.createElement("path", {
    d: "M2 6.5h12M5 10h3"
  }));
  if (name === 'revenue') return React.createElement("svg", p, React.createElement("path", {
    d: "M2 11l4-4 3 3 5-5"
  }), React.createElement("path", {
    d: "M9 5h5v5"
  }));
  if (name === 'equip') return React.createElement("svg", p, React.createElement("rect", {
    x: "2.5",
    y: "4",
    width: "11",
    height: "8",
    rx: "1"
  }), React.createElement("path", {
    d: "M6 12v1.5M10 12v1.5M5 4V2.5h6V4"
  }));
  if (name === 'check') return React.createElement("svg", p, React.createElement("path", {
    d: "M3 8.2L6.5 11.5 13 5"
  }));
  if (name === 'arr') return React.createElement("svg", p, React.createElement("path", {
    d: "M3 8h10M9 5l4 3-4 3"
  }));
  if (name === 'dollar') return React.createElement("svg", p, React.createElement("path", {
    d: "M8 1v14M11 4.5C10.5 3 9.5 2.5 8 2.5S5 3.5 5 5.5 7 7 8 7s3 0 3 2.2-1.5 2.8-3 2.8-2.5-.5-3-2"
  }));
  if (name === 'scale') return React.createElement("svg", p, React.createElement("path", {
    d: "M8 2v12M3 5h10M5 5l-2 4a2 2 0 004 0L5 5zM11 5l-2 4a2 2 0 004 0l-2-4z"
  }));
  return null;
}
function LnHero({
  onApply,
  onTalk
}) {
  const mounted = useV1Mounted(60);
  const enter = delay => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`
  });
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.ink,
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      padding: '88px 0 80px',
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -260,
      right: -200,
      width: 660,
      height: 660,
      background: `radial-gradient(circle, ${V1.blue}26 0%, transparent 60%)`,
      filter: 'blur(28px)',
      pointerEvents: 'none',
      opacity: mounted ? 1 : 0,
      transition: 'opacity 1400ms ease-out 100ms'
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      bottom: -300,
      left: -180,
      width: 520,
      height: 520,
      background: `radial-gradient(circle, #818CF818 0%, transparent 60%)`,
      filter: 'blur(28px)',
      pointerEvents: 'none',
      opacity: mounted ? 1 : 0,
      transition: 'opacity 1400ms ease-out 320ms'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      top: 32,
      right: 40,
      fontFamily: V1.fontMono,
      fontSize: 11,
      letterSpacing: '0.18em',
      color: 'rgba(255,255,255,0.42)',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      ...enter(40)
    }
  }, "Vol. X \xB7 Lending", React.createElement("span", {
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
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("div", {
    style: enter(80)
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "The whole lending stack")), React.createElement("h1", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2.6rem, 5.6vw, 4.8rem)',
      fontWeight: 600,
      letterSpacing: '-0.045em',
      lineHeight: 0.98,
      margin: '24px 0 0',
      color: '#fff',
      maxWidth: 900
    }
  }, React.createElement(V1LineMask, {
    ready: mounted,
    delay: 120
  }, "Lines, loans,"), React.createElement(V1LineMask, {
    ready: mounted,
    delay: 230
  }, "and every way to", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      background: `linear-gradient(90deg, ${V1.blueSoft}, #fff)`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }, "borrow."))), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 18.5,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '32px 0 0',
      maxWidth: 640,
      ...enter(560)
    }
  }, "A revolving line for the day-to-day. A", ' ', React.createElement("span", {
    style: {
      color: '#fff',
      fontWeight: 500
    }
  }, "term loan with simple interest"), ' ', "for the big build-out. A revenue-based advance when speed matters most. Equipment and SBA-style financing when you're buying to grow. One desk, every structure \u2014 and each priced to beat the bank."), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 36,
      alignItems: 'center',
      flexWrap: 'wrap',
      ...enter(700)
    }
  }, React.createElement("button", {
    onClick: onApply,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: V1.blue,
      color: '#fff',
      border: 'none',
      padding: '16px 24px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 700,
      lineHeight: 1,
      boxShadow: `0 6px 20px ${V1.blue}55`,
      transition: 'transform 220ms, box-shadow 220ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = `0 10px 28px ${V1.blue}77`;
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = `0 6px 20px ${V1.blue}55`;
    }
  }, "Find my structure ", React.createElement(LnIcon, {
    name: "arr",
    size: 14
  })), React.createElement("button", {
    onClick: onTalk,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.22)',
      padding: '15px 22px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 700,
      lineHeight: 1,
      transition: 'background 220ms, border-color 220ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
    }
  }, "Talk to a specialist \u2192")), React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      marginTop: 52,
      paddingTop: 28,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 28,
      ...enter(820)
    }
  }, [['Products', '4', 'ways to borrow'], ['Range', '$10K–$500K', 'across the stack'], ['Term', 'Up to 18mo', 'you set the pace'], ['Prepay penalty', '$0', 'on every product']].map(([l, v, s]) => React.createElement("div", {
    key: l
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.5)'
    }
  }, l), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 26,
      fontWeight: 600,
      color: '#fff',
      letterSpacing: '-0.02em',
      marginTop: 6,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 12,
      color: 'rgba(255,255,255,0.55)',
      marginTop: 4
    }
  }, s))))));
}
function LnProducts({
  onApply
}) {
  const products = [{
    icon: 'revolve',
    tag: 'Revolving',
    h: 'Line of credit',
    d: 'A revolving limit you draw against on demand and only pay for what you use. Refills as you repay — capital that\'s always on standby for payroll, inventory, or a slow week.',
    rate: '8.9% APR',
    rateLabel: 'from',
    bank: '12.5% APR bank line',
    bullets: ['Draw only what you need', 'Interest on the drawn balance only', 'No covenants, no annual review', 'Limits from $25K to $500K']
  }, {
    icon: 'term',
    tag: 'Fixed',
    h: 'Term loan',
    d: 'A lump sum with simple, fixed interest and a set monthly payment. Best when you know the number and want a predictable payoff — a renovation, an acquisition, a debt consolidation.',
    rate: 'Simple interest',
    rateLabel: 'fixed',
    bank: 'Variable + origination fees',
    bullets: ['One fixed monthly payment', 'Simple interest — no compounding', 'Terms of 6 to 18 months', 'Pay off early, save the unearned interest']
  }, {
    icon: 'revenue',
    tag: 'Fastest',
    h: 'Revenue-based advance',
    d: 'Capital priced off your deposits, repaid as a small percentage of daily sales. Repayment flexes with your revenue — slow week, smaller payment. The 24-hour option when speed wins.',
    rate: 'Factor rate',
    rateLabel: 'one flat',
    bank: 'Weeks of underwriting',
    bullets: ['Funded in 24 hours', 'Repayment flexes with sales', 'Soft pull, no FICO gate', 'Renew as you grow']
  }, {
    icon: 'equip',
    tag: 'Asset-backed',
    h: 'Equipment & SBA-style',
    d: 'Financing secured by what you\'re buying — terminals, vehicles, kitchen build-outs — or longer-horizon, SBA-style capital for a larger expansion. Lower rates, longer terms, more room.',
    rate: 'Asset-secured',
    rateLabel: 'lower',
    bank: 'Months at the SBA desk',
    bullets: ['Finance the asset you\'re buying', 'Longer terms for bigger projects', 'Own or lease structures', 'Fast pre-qualification']
  }];
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.bg,
      padding: '96px 0'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement(V1Eyebrow, null, "Pick your structure"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      lineHeight: 1.08,
      color: V1.ink,
      margin: '20px 0 12px',
      maxWidth: 760
    }
  }, "Four ways to borrow. One underwriting desk."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 16,
      lineHeight: 1.6,
      color: V1.text,
      maxWidth: 660,
      margin: '0 0 48px'
    }
  }, "Not sure which fits? Apply once and we'll range every structure your file qualifies for \u2014 you pick."), React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, products.map(p => React.createElement("div", {
    key: p.h,
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 18,
      padding: 30,
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 240ms, box-shadow 240ms, border-color 240ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = `0 22px 48px ${V1.ink}12`;
      e.currentTarget.style.borderColor = `${V1.blue}33`;
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = V1.line;
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, React.createElement("span", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 12,
      background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 6px 16px ${V1.blue}33`
    }
  }, React.createElement(LnIcon, {
    name: p.icon,
    size: 22
  })), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.blue,
      background: `${V1.blue}10`,
      padding: '5px 11px',
      borderRadius: 999
    }
  }, p.tag)), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink,
      margin: '20px 0 10px'
    }
  }, p.h), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      lineHeight: 1.6,
      color: V1.text,
      margin: 0
    }
  }, p.d), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      margin: '22px 0 4px'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, p.rateLabel), React.createElement("span", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 700,
      color: V1.ink,
      letterSpacing: '-0.02em'
    }
  }, p.rate)), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 12.5,
      color: V1.muted,
      textDecoration: 'line-through'
    }
  }, p.bank), React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '20px 0 0',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px 14px'
    }
  }, p.bullets.map(b => React.createElement("li", {
    key: b,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      fontFamily: V1.fontBody,
      fontSize: 12.5,
      lineHeight: 1.45,
      color: V1.ink
    }
  }, React.createElement("span", {
    style: {
      color: V1.blue,
      display: 'inline-flex',
      marginTop: 1,
      flexShrink: 0
    }
  }, React.createElement(LnIcon, {
    name: "check",
    size: 12
  })), b))))))));
}
function LnPricing() {
  const [ref, inView] = useV1InView(0.25, '0px 0px -10% 0px');
  return React.createElement("section", {
    "data-v1-section": true,
    ref: ref,
    style: {
      background: V1.white,
      padding: '96px 0',
      borderTop: `1px solid ${V1.line}`,
      borderBottom: `1px solid ${V1.line}`
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement(V1Eyebrow, null, "Interest vs. factor"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      lineHeight: 1.08,
      color: V1.ink,
      margin: '20px 0 16px',
      maxWidth: 760
    }
  }, "Two ways to price capital. Both plainly stated."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 16,
      lineHeight: 1.6,
      color: V1.text,
      maxWidth: 680,
      margin: '0 0 48px'
    }
  }, "A term loan charges simple interest on the balance \u2014 pay it down and you pay less. An advance uses one flat factor with revenue-based repayment. No product on our sheet compounds, and none carries a prepayment penalty."), React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, [{
    tag: 'Loans with interest',
    h: 'Simple interest, fixed payment',
    rows: [['Priced on', 'Outstanding balance'], ['Rate type', 'Simple — never compounds'], ['Payment', 'Fixed monthly'], ['Early payoff', 'Saves the unearned interest']],
    accent: false
  }, {
    tag: 'Revenue-based advance',
    h: 'One factor, flexible repay',
    rows: [['Priced on', 'Total funded amount'], ['Rate type', 'One flat factor rate'], ['Payment', '% of daily sales — flexes'], ['Early payoff', 'Pro-rata rebate on the factor']],
    accent: true
  }].map((c, ci) => React.createElement("div", {
    key: c.h,
    style: {
      background: c.accent ? V1.bg : V1.white,
      border: `1px solid ${c.accent ? V1.blue + '33' : V1.line}`,
      borderRadius: 16,
      padding: 28,
      boxShadow: c.accent ? `0 24px 52px -40px ${V1.blue}66` : 'none',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${ci * 120}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${ci * 120}ms`
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: c.accent ? V1.blue : V1.muted
    }
  }, c.tag), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink,
      margin: '10px 0 18px'
    }
  }, c.h), c.rows.map((r, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      padding: '11px 0',
      borderTop: i === 0 ? 'none' : `1px solid ${V1.line}`
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, r[0]), React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      color: V1.ink,
      textAlign: 'right'
    }
  }, r[1]))))))));
}
function LnChooser() {
  const rows = [{
    need: 'Cover payroll or a slow week',
    pick: 'Line of credit',
    icon: 'revolve'
  }, {
    need: 'Fund a renovation or acquisition',
    pick: 'Term loan',
    icon: 'term'
  }, {
    need: 'Get cash in 24 hours',
    pick: 'Revenue-based advance',
    icon: 'revenue'
  }, {
    need: 'Buy terminals, vehicles, or equipment',
    pick: 'Equipment / SBA-style',
    icon: 'equip'
  }];
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
  }, React.createElement(V1Eyebrow, null, "Which is right for me?"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(1.75rem, 3.8vw, 2.5rem)',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
      color: V1.ink,
      margin: '20px 0 36px'
    }
  }, "Start with the job to be done."), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, rows.map(r => React.createElement("div", {
    key: r.need,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '18px 22px',
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 14
    }
  }, React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: `${V1.blue}10`,
      color: V1.blue,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement(LnIcon, {
    name: r.icon,
    size: 18
  })), React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15.5,
      color: V1.ink,
      flex: 1
    }
  }, r.need), React.createElement("span", {
    style: {
      color: V1.muted,
      display: 'inline-flex',
      flexShrink: 0
    }
  }, React.createElement(LnIcon, {
    name: "arr",
    size: 16
  })), React.createElement("span", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 14.5,
      fontWeight: 600,
      color: V1.blue,
      letterSpacing: '-0.01em',
      textAlign: 'right',
      flexShrink: 0
    }
  }, r.pick))))));
}
function LnCta({
  onApply,
  onTalk
}) {
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.ink,
      color: '#fff',
      padding: '88px 0',
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(circle at 80% 30%, ${V1.blue}33 0%, transparent 55%)`,
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 980,
      margin: '0 auto',
      padding: '0 40px',
      position: 'relative',
      zIndex: 1,
      textAlign: 'center'
    }
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "One application, every option"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2rem, 4.6vw, 3.5rem)',
      fontWeight: 600,
      letterSpacing: '-0.035em',
      lineHeight: 1.05,
      color: '#fff',
      margin: '20px 0 18px'
    }
  }, "Tell us the goal. We'll range every structure that fits."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '0 auto 32px',
      maxWidth: 620
    }
  }, "Apply once, soft pull only. We come back with the line, the loan, and the advance side-by-side \u2014 you choose what to draw."), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, React.createElement("button", {
    onClick: onApply,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: V1.blue,
      color: '#fff',
      border: 'none',
      padding: '16px 26px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 700,
      lineHeight: 1,
      boxShadow: `0 6px 20px ${V1.blue}55`,
      transition: 'transform 220ms, box-shadow 220ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = `0 10px 28px ${V1.blue}77`;
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = `0 6px 20px ${V1.blue}55`;
    }
  }, "See my options ", React.createElement(LnIcon, {
    name: "arr",
    size: 14
  })), React.createElement("button", {
    onClick: onTalk,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.22)',
      padding: '15px 24px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 700,
      lineHeight: 1,
      transition: 'background 220ms, border-color 220ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
    }
  }, "Talk to a specialist \u2192"))));
}
function V1LendingPage({
  accent,
  onApply,
  onTalk
}) {
  return React.createElement("main", null, React.createElement(LnHero, {
    onApply: onApply,
    onTalk: onTalk
  }), React.createElement(LnProducts, {
    onApply: onApply
  }), React.createElement(LnPricing, null), React.createElement(LnChooser, null), React.createElement(LnCta, {
    onApply: onApply,
    onTalk: onTalk
  }));
}
Object.assign(window, {
  V1LendingPage
});