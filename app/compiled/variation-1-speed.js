function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState: spUseState,
  useEffect: spUseEffect,
  useRef: spUseRef
} = React;
function SpIcon({
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
  if (name === 'bolt') return React.createElement("svg", _extends({}, p, {
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("path", {
    d: "M9 1L3 9h4l-1 6 7-9H8l1-5z"
  }));
  if (name === 'clock') return React.createElement("svg", p, React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6"
  }), React.createElement("path", {
    d: "M8 4.5v3.5l2.2 1.4"
  }));
  if (name === 'shield') return React.createElement("svg", p, React.createElement("path", {
    d: "M8 1.5l5.5 2v4.5c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7V3.5L8 1.5z"
  }), React.createElement("path", {
    d: "M5.5 8L7 9.5 10.5 6"
  }));
  if (name === 'phone') return React.createElement("svg", p, React.createElement("path", {
    d: "M4 1.5h8a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1v-11a1 1 0 011-1z"
  }), React.createElement("path", {
    d: "M7 12.5h2"
  }));
  if (name === 'wire') return React.createElement("svg", p, React.createElement("path", {
    d: "M2 8h11M11 5l3 3-3 3"
  }));
  if (name === 'check') return React.createElement("svg", p, React.createElement("path", {
    d: "M3 8.2L6.5 11.5 13 5"
  }));
  if (name === 'arr') return React.createElement("svg", p, React.createElement("path", {
    d: "M3 8h10M9 5l4 3-4 3"
  }));
  if (name === 'x') return React.createElement("svg", p, React.createElement("path", {
    d: "M4 4l8 8M12 4l-8 8"
  }));
  if (name === 'eye') return React.createElement("svg", p, React.createElement("path", {
    d: "M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"
  }), React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "2"
  }));
  return null;
}
function SpHero({
  onApply,
  onCalc
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
  }, "Vol. IX \xB7 Speed", React.createElement("span", {
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
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1.15fr 0.85fr',
      gap: 56,
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: enter(80)
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "Minutes, not months")), React.createElement("h1", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2.6rem, 5.6vw, 4.8rem)',
      fontWeight: 600,
      letterSpacing: '-0.045em',
      lineHeight: 0.98,
      margin: '24px 0 0',
      color: '#fff',
      maxWidth: 720
    }
  }, React.createElement(V1LineMask, {
    ready: mounted,
    delay: 120
  }, "Faster than"), React.createElement(V1LineMask, {
    ready: mounted,
    delay: 230
  }, "the", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      background: `linear-gradient(90deg, ${V1.blueSoft}, #fff)`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }, "bank."))), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 18.5,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '32px 0 0',
      maxWidth: 560,
      ...enter(560)
    }
  }, "A bank routes you through a loan officer, a committee, and a stack of paperwork \u2014 then makes you wait weeks for a maybe. We underwrite live off your deposits and hand back a", ' ', React.createElement("span", {
    style: {
      color: '#fff',
      fontWeight: 500
    }
  }, "real, ranged offer in minutes"), ". Soft pull, no callbacks, wire inside 24 hours."), React.createElement("div", {
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
  }, "Get my offer in minutes ", React.createElement(SpIcon, {
    name: "arr",
    size: 14
  })), React.createElement("button", {
    onClick: onCalc,
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
  }, "Try the calculator \u2192"))), React.createElement("div", {
    style: {
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.98)',
      transition: 'opacity 900ms cubic-bezier(0.22,1,0.36,1) 320ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 320ms'
    }
  }, React.createElement(SpApprovalCard, {
    active: mounted
  })))));
}
function SpApprovalCard({
  active
}) {
  const [phase, setPhase] = spUseState('idle');
  spUseEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setPhase('reading'), 500);
    const t2 = setTimeout(() => setPhase('ranged'), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active]);
  const ranged = phase === 'ranged';
  return React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 20,
      padding: 26,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 60px -30px rgba(0,0,0,0.5)'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -100,
      right: -80,
      width: 280,
      height: 280,
      background: `radial-gradient(circle, ${V1.blue}33 0%, transparent 65%)`,
      filter: 'blur(20px)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 1,
      marginBottom: 8
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Approval \xB7 live"), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 999,
      background: 'rgba(31,132,90,0.18)',
      border: '1px solid rgba(31,132,90,0.4)',
      color: '#4ADE80'
    }
  }, "Soft pull")), React.createElement("div", {
    style: {
      position: 'relative',
      textAlign: 'center',
      padding: '18px 0 8px'
    }
  }, React.createElement("svg", {
    viewBox: "0 0 220 130",
    width: "100%",
    style: {
      maxWidth: 240,
      display: 'inline-block'
    }
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "spGauge",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: V1.blueSoft
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: V1.blue
  }))), React.createElement("path", {
    d: "M20 120 A90 90 0 0 1 200 120",
    fill: "none",
    stroke: "rgba(255,255,255,0.12)",
    strokeWidth: "12",
    strokeLinecap: "round"
  }), React.createElement("path", {
    d: "M20 120 A90 90 0 0 1 200 120",
    fill: "none",
    stroke: "url(#spGauge)",
    strokeWidth: "12",
    strokeLinecap: "round",
    strokeDasharray: "283",
    strokeDashoffset: ranged ? 51 : 283,
    style: {
      transition: 'stroke-dashoffset 1400ms cubic-bezier(0.22,1,0.36,1)'
    }
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 24
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontWeight: 700,
      fontSize: 40,
      letterSpacing: '-0.04em',
      color: '#fff',
      lineHeight: 1
    }
  }, active ? React.createElement(V1CountUp, {
    value: ranged ? '82' : '0',
    duration: 1400,
    start: 600
  }) : '0'), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 9.5,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.5)',
      marginTop: 4
    }
  }, phase === 'idle' ? 'Awaiting link' : phase === 'reading' ? 'Reading deposits…' : 'Approval score'))), React.createElement("div", {
    style: {
      marginTop: 10,
      padding: '14px 16px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
      zIndex: 1,
      opacity: ranged ? 1 : 0.35,
      transition: 'opacity 400ms'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 9.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.5)'
    }
  }, "Your ranged offer"), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 24,
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '-0.02em',
      marginTop: 4,
      fontVariantNumeric: 'tabular-nums'
    }
  }, ranged ? '$85K – $110K' : '· · ·')), React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      position: 'relative',
      zIndex: 1
    }
  }, ['Deposits verified', 'Ownership matched', 'Offer ranged'].map((c, i) => React.createElement("div", {
    key: c,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
      opacity: ranged ? 1 : 0,
      transform: ranged ? 'translateX(0)' : 'translateX(-6px)',
      transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${i * 140}ms, transform 500ms cubic-bezier(0.22,1,0.36,1) ${i * 140}ms`
    }
  }, React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 999,
      background: '#1F845A',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: '#fff'
    }
  }, React.createElement(SpIcon, {
    name: "check",
    size: 11
  })), c))));
}
function SpTimeline() {
  const [ref, inView] = useV1InView(0.2, '0px 0px -10% 0px');
  const bank = [{
    t: 'Day 1',
    d: 'Book a branch appointment. Print the application packet.'
  }, {
    t: 'Week 1',
    d: 'Hand over tax returns, P&L, balance sheet, projections.'
  }, {
    t: 'Week 2–3',
    d: 'Loan officer requests “just one more document.” Twice.'
  }, {
    t: 'Week 4–6',
    d: 'File sits with a credit committee that meets weekly.'
  }, {
    t: 'Week 6+',
    d: 'A maybe — often with a covenant and a personal guarantee.'
  }];
  const delt = [{
    t: 'Minute 0',
    d: 'Three fields on the calculator. Revenue, time in business, processor.'
  }, {
    t: 'Minute 2',
    d: 'Link your bank read-only via Plaid. No statements to dig up.'
  }, {
    t: 'Minute 5',
    d: 'A soft-pull, deposit-based approval score and a ranged offer.'
  }, {
    t: 'Hour 1–4',
    d: 'A human underwriter confirms the range on your file.'
  }, {
    t: 'Hour 24',
    d: 'Counter-sign and the wire hits your operating account.'
  }];
  return React.createElement("section", {
    "data-v1-section": true,
    ref: ref,
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
  }, React.createElement(V1Eyebrow, null, "The difference is the wait"), React.createElement("h2", {
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
  }, "Same business. Same numbers. Six weeks apart."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 16,
      lineHeight: 1.6,
      color: V1.text,
      maxWidth: 640,
      margin: '0 0 48px'
    }
  }, "Here's the identical funding request, run through a bank and through Delt."), React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, React.createElement("div", {
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 16,
      padding: 28
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 22
    }
  }, React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: V1.bgWarm,
      color: V1.muted,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(SpIcon, {
    name: "clock",
    size: 16
  })), React.createElement("span", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 600,
      color: V1.muted,
      letterSpacing: '-0.01em'
    }
  }, "The bank"), React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.red
    }
  }, "~6 weeks")), bank.map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '78px 1fr',
      gap: 14,
      padding: '12px 0',
      borderTop: i === 0 ? 'none' : `1px solid ${V1.line}`,
      opacity: inView ? 0.75 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, transform 500ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, s.t), React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      lineHeight: 1.5,
      color: V1.text
    }
  }, s.d)))), React.createElement("div", {
    style: {
      background: V1.white,
      border: `1px solid ${V1.blue}33`,
      borderRadius: 16,
      padding: 28,
      boxShadow: `0 30px 60px -40px ${V1.blue}66`,
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 22
    }
  }, React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 6px 16px ${V1.blue}44`
    }
  }, React.createElement(SpIcon, {
    name: "bolt",
    size: 16
  })), React.createElement("span", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.01em'
    }
  }, "Delt"), React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.green
    }
  }, "24 hours")), delt.map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '78px 1fr',
      gap: 14,
      padding: '12px 0',
      borderTop: i === 0 ? 'none' : `1px solid ${V1.line}`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-8px)',
      transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${i * 110}ms, transform 500ms cubic-bezier(0.22,1,0.36,1) ${i * 110}ms`
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: V1.blue
    }
  }, s.t), React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      lineHeight: 1.5,
      color: V1.ink
    }
  }, s.d)))))));
}
function SpWhy() {
  const items = [{
    icon: 'eye',
    h: 'We read data, not paperwork.',
    d: 'A read-only Plaid link shows us 90 days of real deposits in seconds. There is nothing to print, scan, or re-export — the truth is already in your account.'
  }, {
    icon: 'shield',
    h: 'Soft pull, no score damage.',
    d: 'The estimate never touches your credit. No hard inquiry, no ding, no callback from a loan officer trying to “restructure” the deal.'
  }, {
    icon: 'bolt',
    h: 'One desk, one decision.',
    d: 'No branch, no broker layer, no committee that meets on Thursdays. Your file goes straight to an underwriter with authority to price and fund it.'
  }];
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
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement(V1Eyebrow, null, "Why we're faster"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      lineHeight: 1.08,
      color: V1.ink,
      margin: '20px 0 48px',
      maxWidth: 720
    }
  }, "Speed isn't a rush job. It's a better process."), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, items.map(it => React.createElement("div", {
    key: it.h,
    style: {
      background: V1.bg,
      border: `1px solid ${V1.line}`,
      borderRadius: 16,
      padding: 28
    }
  }, React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      background: `linear-gradient(135deg, ${V1.blue}, #818CF8)`,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 6px 16px ${V1.blue}33`
    }
  }, React.createElement(SpIcon, {
    name: it.icon,
    size: 20
  })), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink,
      margin: '18px 0 10px'
    }
  }, it.h), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      lineHeight: 1.6,
      color: V1.text,
      margin: 0
    }
  }, it.d))))));
}
function SpCta({
  onApply,
  onCalc
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
  }, "Stop waiting on a maybe"), React.createElement("h2", {
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
  }, "Get a real offer before the bank picks up the phone."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '0 auto 32px',
      maxWidth: 620
    }
  }, "Three fields, a soft pull, and a ranged offer in minutes. No callbacks, no committee, no covenants."), React.createElement("div", {
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
  }, "Get my offer ", React.createElement(SpIcon, {
    name: "arr",
    size: 14
  })), React.createElement("button", {
    onClick: onCalc,
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
  }, "\u2190 Back to calculator"))));
}
function V1SpeedPage({
  accent,
  onApply,
  onCalc
}) {
  return React.createElement("main", null, React.createElement(SpHero, {
    onApply: onApply,
    onCalc: onCalc
  }), React.createElement(SpTimeline, null), React.createElement(SpWhy, null), React.createElement(SpCta, {
    onApply: onApply,
    onCalc: onCalc
  }));
}
Object.assign(window, {
  V1SpeedPage
});