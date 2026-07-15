function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState: tmUseState,
  useEffect: tmUseEffect,
  useRef: tmUseRef
} = React;
function TmIcon({
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
  if (name === 'counter') return React.createElement("svg", p, React.createElement("rect", {
    x: "2",
    y: "2.5",
    width: "12",
    height: "9",
    rx: "1.2"
  }), React.createElement("path", {
    d: "M2 9h12M5 14h6"
  }));
  if (name === 'hand') return React.createElement("svg", p, React.createElement("rect", {
    x: "4",
    y: "1.5",
    width: "8",
    height: "13",
    rx: "1.4"
  }), React.createElement("path", {
    d: "M4 4.5h8"
  }), React.createElement("path", {
    d: "M7 12.5h2"
  }));
  if (name === 'mobile') return React.createElement("svg", p, React.createElement("rect", {
    x: "5",
    y: "1.5",
    width: "6",
    height: "13",
    rx: "1.4"
  }), React.createElement("path", {
    d: "M7.2 12.5h1.6"
  }));
  if (name === 'bolt') return React.createElement("svg", _extends({}, p, {
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("path", {
    d: "M9 1L3 9h4l-1 6 7-9H8l1-5z"
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
  if (name === 'shield') return React.createElement("svg", p, React.createElement("path", {
    d: "M8 1.5l5.5 2v4.5c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7V3.5L8 1.5z"
  }), React.createElement("path", {
    d: "M5.5 8L7 9.5 10.5 6"
  }));
  if (name === 'refresh') return React.createElement("svg", p, React.createElement("path", {
    d: "M3 8a5 5 0 018.5-3.5L13 6M13 8a5 5 0 01-8.5 3.5L3 10M11 3v3h-3M5 13v-3h3"
  }));
  if (name === 'plug') return React.createElement("svg", p, React.createElement("path", {
    d: "M6 2v4M10 2v4M4 6h8v3a4 4 0 01-8 0V6zM8 13v2"
  }));
  return null;
}
function TmHero({
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
  }, "Vol. XI \xB7 Hardware", React.createElement("span", {
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
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 56,
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: enter(80)
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "$0 down \xB7 same-day board")), React.createElement("h1", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2.6rem, 5.6vw, 4.8rem)',
      fontWeight: 600,
      letterSpacing: '-0.045em',
      lineHeight: 0.98,
      margin: '24px 0 0',
      color: '#fff',
      maxWidth: 640
    }
  }, React.createElement(V1LineMask, {
    ready: mounted,
    delay: 120
  }, "Terminals"), React.createElement(V1LineMask, {
    ready: mounted,
    delay: 230
  }, "on the", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      background: `linear-gradient(90deg, ${V1.blueSoft}, #fff)`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }, "counter today."))), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 18.5,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '32px 0 0',
      maxWidth: 540,
      ...enter(560)
    }
  }, "Countertop, handheld, and mobile hardware \u2014 pre-boarded and shipped, with ", React.createElement("span", {
    style: {
      color: '#fff',
      fontWeight: 500
    }
  }, "$0 down"), ". Own it or lease it, board same-day, and start taking payments without a compatibility headache."), React.createElement("div", {
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
  }, "Get my terminals ", React.createElement(TmIcon, {
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
  }, "Talk to a specialist \u2192"))), React.createElement("div", {
    style: {
      position: 'relative',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.98)',
      transition: 'opacity 900ms cubic-bezier(0.22,1,0.36,1) 320ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 320ms'
    }
  }, React.createElement("div", {
    style: {
      borderRadius: 22,
      padding: 28,
      background: 'linear-gradient(160deg, rgba(245,241,255,0.10) 0%, rgba(129,140,248,0.06) 100%)',
      border: '1px solid rgba(255,255,255,0.1)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 40px 80px -40px rgba(0,0,0,0.6)'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -80,
      right: -60,
      width: 260,
      height: 260,
      background: `radial-gradient(circle, ${V1.blue}33 0%, transparent 65%)`,
      filter: 'blur(24px)'
    }
  }), React.createElement("img", {
    src: "app/assets/mocks/delt_mock_terminals.jpg",
    alt: "Delt countertop, handheld, and mobile payment terminals",
    style: {
      width: '100%',
      height: 'auto',
      display: 'block',
      position: 'relative',
      zIndex: 1,
      borderRadius: 12
    }
  }), React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.55)'
    }
  }, "Countertop \xB7 handheld \xB7 mobile"), React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      padding: '5px 10px',
      borderRadius: 999,
      background: 'rgba(31,132,90,0.18)',
      border: '1px solid rgba(31,132,90,0.4)',
      color: '#4ADE80'
    }
  }, React.createElement(TmIcon, {
    name: "check",
    size: 11
  }), " Certified")))))));
}
function TmFormFactors() {
  const items = [{
    icon: 'counter',
    label: 'Countertop',
    h: 'The front-of-house workhorse.',
    d: 'A fast, full-size terminal for the register — chip, tap, swipe, and PIN, with a receipt printer and a bright touchscreen. Wired for reliability where the line moves fast.'
  }, {
    icon: 'hand',
    label: 'Handheld',
    h: 'Take payment anywhere in the room.',
    d: 'A cordless, all-day-battery unit for table-side, curbside, and the sales floor. Wi-Fi and 4G so it works wherever your customers are.'
  }, {
    icon: 'mobile',
    label: 'Mobile',
    h: 'A full terminal in your pocket.',
    d: 'Compact hardware or a phone-paired reader for pop-ups, markets, and field service. Accept a card the moment the sale happens.'
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
  }, React.createElement(V1Eyebrow, null, "One lineup, every counter"), React.createElement("h2", {
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
  }, "Hardware for how your business actually runs."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 16,
      lineHeight: 1.6,
      color: V1.text,
      maxWidth: 660,
      margin: '0 0 48px'
    }
  }, "Mix and match across locations \u2014 every unit is boarded to the same account and settles to the same next-day deposit."), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, items.map(it => React.createElement("div", {
    key: it.label,
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 16,
      padding: 28,
      transition: 'transform 240ms, box-shadow 240ms, border-color 240ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = `0 18px 44px ${V1.ink}10`;
      e.currentTarget.style.borderColor = `${V1.blue}33`;
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = V1.line;
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
  }, React.createElement(TmIcon, {
    name: it.icon,
    size: 20
  })), React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, it.label), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink,
      margin: '6px 0 10px'
    }
  }, it.h), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      lineHeight: 1.6,
      color: V1.text,
      margin: 0
    }
  }, it.d))))));
}
function TmOwnLease() {
  const [ref, inView] = useV1InView(0.25, '0px 0px -10% 0px');
  const cards = [{
    tag: 'Own',
    h: 'Buy it outright',
    accent: false,
    d: 'One-time purchase, financed at $0 down if you\'d rather spread it out. The hardware is yours — no monthly line item once it\'s paid off.',
    rows: [['Upfront', '$0 down'], ['Ownership', 'Yours, day one'], ['Best for', 'Established, steady volume'], ['Upgrades', 'Trade in anytime']]
  }, {
    tag: 'Lease',
    h: 'Lease month-to-month',
    accent: true,
    d: 'A low monthly rate that bundles the hardware, warranty, and free replacements. Swap to newer models as they ship and scale units up or down as you grow.',
    rows: [['Upfront', '$0 down'], ['Ownership', 'Included in service'], ['Best for', 'New or seasonal shops'], ['Upgrades', 'Always current']]
  }];
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
  }, React.createElement(V1Eyebrow, null, "Own or lease"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      lineHeight: 1.08,
      color: V1.ink,
      margin: '20px 0 16px',
      maxWidth: 720
    }
  }, "Two ways to get the hardware. Both start at zero."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 16,
      lineHeight: 1.6,
      color: V1.text,
      maxWidth: 660,
      margin: '0 0 48px'
    }
  }, "Buy it and own it, or lease it and stay on the latest models. Either way you're taking payments the same day it lands."), React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, cards.map((c, ci) => React.createElement("div", {
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
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: c.accent ? V1.blue : V1.muted,
      background: c.accent ? `${V1.blue}10` : V1.bgWarm,
      padding: '5px 11px',
      borderRadius: 999
    }
  }, c.tag)), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink,
      margin: '0 0 10px'
    }
  }, c.h), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      lineHeight: 1.6,
      color: V1.text,
      margin: '0 0 18px'
    }
  }, c.d), c.rows.map((r, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      padding: '11px 0',
      borderTop: `1px solid ${V1.line}`
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
      textAlign: 'right',
      fontWeight: r[0] === 'Upfront' ? 700 : 400
    }
  }, r[1]))))))));
}
function TmBoard() {
  const steps = [{
    n: '01',
    icon: 'plug',
    h: 'Tell us your setup.',
    d: 'Business type, average ticket, and how many stations you need. We pick the right mix of countertop, handheld, and mobile units.'
  }, {
    n: '02',
    icon: 'bolt',
    h: 'We pre-board & ship.',
    d: 'Your terminals are configured to your account before they leave the warehouse — settings, tips, taxes, and receipts already dialed in.'
  }, {
    n: '03',
    icon: 'refresh',
    h: 'Plug in and sell.',
    d: 'Power on, connect to Wi-Fi or 4G, and take your first payment. Most merchants are live the same day the box arrives.'
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
  }, React.createElement(V1Eyebrow, null, "Same-day board"), React.createElement("h2", {
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
  }, "Boxed, boarded, and taking payment \u2014 same day."), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 0,
      position: 'relative'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: 28,
      left: '14%',
      right: '14%',
      height: 1,
      background: `linear-gradient(90deg, transparent, ${V1.blue}55, ${V1.blue}55, transparent)`
    }
  }), steps.map(s => React.createElement("div", {
    key: s.n,
    style: {
      padding: '0 18px',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 14,
      background: V1.white,
      border: `1.5px solid ${V1.blue}`,
      color: V1.blue,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      boxShadow: `0 8px 22px ${V1.blue}1F`
    }
  }, React.createElement(TmIcon, {
    name: s.icon,
    size: 22
  })), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: V1.muted,
      textAlign: 'center',
      marginTop: 18
    }
  }, "Step ", s.n), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink,
      margin: '6px 0 10px',
      textAlign: 'center'
    }
  }, s.h), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      lineHeight: 1.55,
      color: V1.text,
      margin: 0,
      textAlign: 'center',
      maxWidth: 320,
      marginInline: 'auto'
    }
  }, s.d))))));
}
function TmAssurances() {
  const items = [{
    icon: 'dollar',
    h: '$0 down',
    d: 'No upfront cost to get hardware in the door — own or lease, you start at zero.'
  }, {
    icon: 'shield',
    h: 'PCI-certified',
    d: 'Every unit ships encrypted and PCI-DSS compliant. Tokenized, tamper-evident, and audited.'
  }, {
    icon: 'refresh',
    h: 'Free replacements',
    d: 'A unit fails, we overnight a new one. On lease, warranty and swaps are always included.'
  }, {
    icon: 'bolt',
    h: 'Next-day deposits',
    d: 'Batches settle to your account next business day — same-day funding available.'
  }];
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.white,
      padding: '80px 0',
      borderTop: `1px solid ${V1.line}`
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24
    }
  }, items.map(it => React.createElement("div", {
    key: it.h
  }, React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: `${V1.blue}10`,
      color: V1.blue,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(TmIcon, {
    name: it.icon,
    size: 18
  })), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 17,
      fontWeight: 600,
      letterSpacing: '-0.015em',
      color: V1.ink,
      margin: '16px 0 8px'
    }
  }, it.h), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      lineHeight: 1.55,
      color: V1.text,
      margin: 0
    }
  }, it.d))))));
}
function TmCta({
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
  }, "Ready when you are"), React.createElement("h2", {
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
  }, "New terminals on the counter \u2014 with nothing down."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '0 auto 32px',
      maxWidth: 620
    }
  }, "Tell us how you sell and we'll spec the lineup, board it to your account, and ship it \u2014 same-day live for most merchants."), React.createElement("div", {
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
  }, "Get my terminals ", React.createElement(TmIcon, {
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
function V1TerminalsPage({
  accent,
  onApply,
  onTalk
}) {
  return React.createElement("main", null, React.createElement(TmHero, {
    onApply: onApply,
    onTalk: onTalk
  }), React.createElement(TmFormFactors, null), React.createElement(TmOwnLease, null), React.createElement(TmBoard, null), React.createElement(TmAssurances, null), React.createElement(TmCta, {
    onApply: onApply,
    onTalk: onTalk
  }));
}
Object.assign(window, {
  V1TerminalsPage
});