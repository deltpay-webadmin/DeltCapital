const PLX = {
  navy: '#041E42',
  navyMid: '#0A1A6E',
  indigo: '#4945FF',
  indigoDeep: '#3730A3',
  softIndigo: '#7C6BFF',
  violet: '#8B5CF6',
  cyan: '#7DD3FC',
  ink: '#0F0E17'
};
function useIsMobile(bp = 768) {
  const [m, setM] = React.useState(() => typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(`(max-width:${bp}px)`).matches : false);
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(`(max-width:${bp}px)`);
    const on = e => setM(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', on);else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);else mq.removeListener(on);
    };
  }, [bp]);
  return m;
}
const PLX_REDUCED = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function PlxArrowCircle({
  dark = false,
  active = false
}) {
  const filled = dark ? false : active;
  return React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: filled ? '#0F0E17' : 'transparent',
      border: filled ? '1px solid #0F0E17' : dark ? '1px solid rgba(247,245,240,0.25)' : '1px solid rgba(15,14,23,0.18)',
      color: filled ? '#FFFFFF' : dark ? '#F7F5F0' : '#0F0E17',
      opacity: dark ? 1 : active ? 1 : 0.7,
      transform: active ? 'translate(2px, -2px)' : 'translate(0, 0)',
      transition: 'background .22s ease, border-color .22s ease, color .22s ease, opacity .22s ease, transform .22s cubic-bezier(0.22,1,0.36,1)',
      boxShadow: filled ? '0 4px 10px rgba(15,14,23,0.15)' : 'none'
    }
  }, React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 14 14"
  }, React.createElement("path", {
    d: "M3 7h8M8 4l3 3-3 3",
    stroke: "currentColor",
    strokeWidth: "1.8",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
function V1LogoMarquee() {
  const brands = ['Paysafe', 'NMI', 'Global Payments', 'Goat Payments', 'PAX', 'Verifone', 'Landi', 'Korona', 'Plaid', 'Supabase'];
  const loop = [...brands, ...brands];
  return React.createElement("section", {
    "aria-label": "Trusted by leading payment processors",
    style: {
      background: PLX.navy,
      padding: '30px 0 34px',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }
  }, React.createElement("style", null, `
        @keyframes plxMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .plx-marquee-track { animation: plxMarquee 60s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .plx-marquee-track { animation: none; } }
      `), React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: DELT.font.mono,
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(247,245,240,0.5)',
      marginBottom: 18
    }
  }, "Trusted across the payments stack"), React.createElement("div", {
    style: {
      WebkitMaskImage: 'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
      maskImage: 'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)'
    }
  }, React.createElement("div", {
    className: "plx-marquee-track",
    style: {
      display: 'flex',
      width: 'max-content',
      gap: 56,
      alignItems: 'center',
      height: 32,
      whiteSpace: 'nowrap'
    }
  }, loop.map((b, i) => React.createElement("span", {
    key: i,
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'rgba(247,245,240,0.55)'
    }
  }, b)))));
}
function PlxProductCard({
  title,
  desc,
  children,
  large,
  mobile,
  tint,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const clickable = typeof onClick === 'function';
  const activate = clickable ? e => {
    if (e) e.preventDefault();
    onClick();
  } : undefined;
  return React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: activate,
    role: clickable ? 'link' : undefined,
    tabIndex: clickable ? 0 : undefined,
    "aria-label": clickable ? title : undefined,
    onKeyDown: clickable ? e => {
      if (e.key === 'Enter' || e.key === ' ') activate(e);
    } : undefined,
    style: {
      position: 'relative',
      display: 'flex',
      cursor: clickable ? 'pointer' : 'default'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: -6,
      borderRadius: 26,
      background: 'linear-gradient(135deg, rgba(124,107,255,0.55), rgba(125,211,252,0.55))',
      filter: 'blur(18px)',
      opacity: hover && !mobile ? 0.35 : 0,
      transition: 'opacity .28s ease-out',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      background: tint || DELT.colors.card,
      borderRadius: 20,
      border: hover && !mobile ? '1px solid rgba(125,211,252,0.55)' : `1px solid ${DELT.colors.line}`,
      padding: mobile ? 24 : 32,
      display: 'flex',
      flexDirection: 'column',
      minHeight: large ? mobile ? 380 : 460 : mobile ? 320 : 380,
      transform: hover && !mobile ? 'translateY(-3px)' : 'translateY(0)',
      boxShadow: hover && !mobile ? '0 28px 56px rgba(15,14,23,0.10), 0 4px 10px rgba(15,14,23,0.04)' : '0 1px 2px rgba(15,14,23,0.04)',
      transition: 'transform .22s cubic-bezier(0.22,1,0.36,1), box-shadow .22s, border-color .22s',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'radial-gradient(80% 60% at 50% 100%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)'
    }
  }), React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, React.createElement("div", null, React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: large ? 28 : 22,
      letterSpacing: '-0.02em',
      color: DELT.colors.ink,
      lineHeight: 1.15
    }
  }, title), React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontFamily: DELT.font.body,
      fontSize: 15,
      lineHeight: 1.5,
      color: DELT.colors.inkMute,
      maxWidth: 360
    }
  }, desc)), React.createElement(PlxArrowCircle, {
    active: hover && !mobile
  })), React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 'auto',
      paddingTop: 26,
      display: 'flex',
      justifyContent: 'center'
    }
  }, children)));
}
function PlxMockOffer_OLD() {
  return React.createElement("div", {
    style: {
      width: 240,
      height: 320,
      borderRadius: 34,
      background: '#0F0E17',
      padding: 9,
      boxShadow: '0 30px 60px rgba(15,14,23,0.25), 0 4px 12px rgba(15,14,23,0.12)',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 26,
      background: '#FFFFFF',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 66,
      height: 6,
      borderRadius: 999,
      background: '#0F0E17'
    }
  }), React.createElement("div", {
    style: {
      padding: '30px 20px 12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 700,
      fontSize: 14,
      color: DELT.colors.indigo,
      letterSpacing: '-0.01em'
    }
  }, "DELT"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.14em',
      color: DELT.colors.inkMute,
      textTransform: 'uppercase'
    }
  }, "Offer")), React.createElement("div", {
    style: {
      padding: '4px 20px 0'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "Ready to fund"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 38,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.03em',
      marginTop: 6
    }
  }, "$95,000"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      color: DELT.colors.inkMute,
      marginTop: 2
    }
  }, "1.16\xD7 \xB7 8 months")), React.createElement("div", {
    style: {
      padding: '18px 20px 0'
    }
  }, React.createElement("div", {
    style: {
      height: 7,
      borderRadius: 999,
      background: 'rgba(73,69,255,0.10)',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      width: '82%',
      height: '100%',
      borderRadius: 999,
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`
    }
  })), React.createElement("div", {
    style: {
      marginTop: 9,
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      color: DELT.colors.ok
    }
  }, "Approved \xB7 24h to wire")), React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: 18
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      height: 44,
      borderRadius: 12,
      background: DELT.colors.indigo,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: DELT.font.body,
      fontSize: 13,
      fontWeight: 600,
      color: '#fff'
    }
  }, "Accept offer"))));
}
function PlxMockApprovals_OLD() {
  const start = 160;
  const end = 380;
  const pct = 0.82;
  const R = 108;
  const cx = 130;
  const cy = 125;
  const rad = a => a * Math.PI / 180;
  const arcPath = (a0, a1) => {
    const x0 = cx + R * Math.cos(rad(a0));
    const y0 = cy + R * Math.sin(rad(a0));
    const x1 = cx + R * Math.cos(rad(a1));
    const y1 = cy + R * Math.sin(rad(a1));
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
  };
  const fillEnd = start + (end - start) * pct;
  return React.createElement("div", {
    style: {
      position: 'relative',
      width: 260,
      height: 240
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: -20,
      borderRadius: '50%',
      background: 'conic-gradient(from 220deg at 50% 50%, rgba(125,211,252,0.35), rgba(139,92,246,0.30), rgba(219,243,255,0.35), rgba(124,107,255,0.30), rgba(125,211,252,0.35))',
      filter: 'blur(24px)',
      opacity: 0.7
    }
  }), React.createElement("svg", {
    viewBox: "0 0 260 240",
    width: "100%",
    height: "100%",
    style: {
      position: 'relative'
    }
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "plxGaugeGrad",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: PLX.cyan
  }), React.createElement("stop", {
    offset: "55%",
    stopColor: DELT.colors.indigo
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: PLX.violet
  }))), React.createElement("path", {
    d: arcPath(start, end),
    stroke: "rgba(73,69,255,0.10)",
    strokeWidth: "20",
    strokeLinecap: "round",
    fill: "none"
  }), React.createElement("path", {
    d: arcPath(start, fillEnd),
    stroke: "url(#plxGaugeGrad)",
    strokeWidth: "20",
    strokeLinecap: "round",
    fill: "none"
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 12
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute,
      fontWeight: 500
    }
  }, "Approved"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 72,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.045em',
      lineHeight: 1,
      marginTop: 4
    }
  }, "82"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      color: DELT.colors.inkMute,
      marginTop: 8
    }
  }, "Soft pull \xB7 60s")), React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: 4,
      transform: 'translateX(-50%)',
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      color: DELT.colors.indigo,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(4px)',
      padding: '5px 12px',
      borderRadius: 999,
      border: `1px solid rgba(73,69,255,0.15)`
    }
  }, "$85k \u2013 $110k"));
}
function PlxMockCommissions_OLD() {
  const bars = [42, 55, 48, 68, 78, 92];
  const max = 100;
  return React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 280,
      background: '#FFFFFF',
      borderRadius: 14,
      padding: 22,
      boxShadow: '0 20px 44px rgba(15,14,23,0.12), 0 2px 6px rgba(15,14,23,0.04)'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "Commissions \xB7 YTD"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 32,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.03em',
      margin: '4px 0 2px'
    }
  }, "$74,820"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      color: DELT.colors.ok
    }
  }, "\u25B2 34% vs last year")), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      color: DELT.colors.indigo,
      background: 'rgba(73,69,255,0.10)',
      padding: '4px 9px',
      borderRadius: 999
    }
  }, "100% residual")), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8,
      height: 84
    }
  }, bars.map((v, i) => React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      height: `${v / max * 100}%`,
      minHeight: 8,
      borderRadius: 6,
      background: i === bars.length - 1 ? `linear-gradient(180deg, ${DELT.colors.indigo}, ${PLX.softIndigo})` : 'rgba(73,69,255,0.20)'
    }
  }), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9,
      color: DELT.colors.inkMute
    }
  }, ['J', 'F', 'M', 'A', 'M', 'J'][i])))));
}
function PlxMockProcessors_OLD() {
  const procs = [{
    n: 'Paysafe',
    c: '#0057B7'
  }, {
    n: 'NMI',
    c: '#00A651'
  }, {
    n: 'Global',
    c: '#E42527'
  }, {
    n: 'Goat',
    c: '#8B5CF6'
  }];
  return React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 280,
      background: '#FFFFFF',
      borderRadius: 14,
      padding: 22,
      boxShadow: '0 20px 44px rgba(15,14,23,0.12), 0 2px 6px rgba(15,14,23,0.04)'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute,
      marginBottom: 12
    }
  }, "Board across processors"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, procs.map(p => React.createElement("div", {
    key: p.n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 12px',
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10
    }
  }, React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      background: p.c,
      flexShrink: 0
    }
  }), React.createElement("span", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      fontWeight: 500,
      color: DELT.colors.ink
    }
  }, p.n)))), React.createElement("div", {
    style: {
      marginTop: 14,
      padding: '10px 12px',
      borderRadius: 10,
      background: 'rgba(73,69,255,0.06)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      color: DELT.colors.inkSoft,
      letterSpacing: '0.06em'
    }
  }, "Settlement \xB7 T+1"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      fontWeight: 600,
      color: DELT.colors.indigo
    }
  }, "Board in 48h")));
}
function PlxMockTerminals_OLD() {
  const Term = ({
    label,
    accent,
    tilt
  }) => React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      transform: `rotate(${tilt}deg)`
    }
  }, React.createElement("svg", {
    width: "72",
    height: "96",
    viewBox: "0 0 72 96",
    fill: "none",
    style: {
      filter: 'drop-shadow(0 12px 20px rgba(15,14,23,0.15))'
    }
  }, React.createElement("rect", {
    x: "3",
    y: "3",
    width: "66",
    height: "90",
    rx: "9",
    fill: "#fff",
    stroke: DELT.colors.inkSoft,
    strokeWidth: "1.6"
  }), React.createElement("rect", {
    x: "10",
    y: "10",
    width: "52",
    height: "26",
    rx: "4",
    fill: `${accent}22`,
    stroke: accent,
    strokeWidth: "1.2"
  }), [0, 1, 2, 3].map(r => [0, 1, 2].map(c => React.createElement("circle", {
    key: `${r}-${c}`,
    cx: 20 + c * 16,
    cy: 52 + r * 10,
    r: "2.8",
    fill: DELT.colors.inkMute
  })))), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10,
      color: DELT.colors.inkSoft
    }
  }, label));
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: 6
    }
  }, React.createElement(Term, {
    label: "PAX A920",
    accent: DELT.colors.indigo,
    tilt: -6
  }), React.createElement(Term, {
    label: "Verifone",
    accent: PLX.violet,
    tilt: 0
  }), React.createElement(Term, {
    label: "Landi",
    accent: PLX.cyan,
    tilt: 6
  })), React.createElement("div", {
    style: {
      padding: '10px 18px',
      borderRadius: 999,
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: '0 8px 20px rgba(73,69,255,0.30)'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13,
      fontWeight: 600,
      color: '#fff',
      letterSpacing: '-0.005em'
    }
  }, "$0 down"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      fontWeight: 600,
      color: 'rgba(255,255,255,0.8)'
    }
  }, "Own or lease")));
}
function PlxSurface({
  width = 300,
  children,
  style
}) {
  return React.createElement("div", {
    style: {
      width,
      maxWidth: '100%',
      borderRadius: 18,
      padding: 20,
      background: '#FFFFFF',
      border: '1px solid rgba(15,14,23,0.06)',
      boxShadow: '0 24px 48px rgba(15,14,23,0.10), 0 2px 6px rgba(15,14,23,0.04)',
      fontFamily: DELT.font.body,
      ...style
    }
  }, children);
}
const PlxLabel = ({
  children,
  color
}) => React.createElement("div", {
  style: {
    fontFamily: DELT.font.mono,
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: color || DELT.colors.inkMute
  }
}, children);
const PlxPill = ({
  children,
  tone = 'green'
}) => {
  const tones = {
    green: {
      bg: 'rgba(15,169,104,0.10)',
      fg: '#0FA968'
    },
    indigo: {
      bg: 'rgba(73,69,255,0.10)',
      fg: DELT.colors.indigo
    }
  };
  const t = tones[tone];
  return React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: t.fg,
      background: t.bg,
      padding: '4px 9px',
      borderRadius: 999,
      fontWeight: 600
    }
  }, children);
};
function PlxMockOffer() {
  return React.createElement("div", {
    style: {
      width: 220,
      height: 450,
      borderRadius: 40,
      padding: 7,
      background: 'linear-gradient(160deg, #1B1A24 0%, #0F0E17 60%, #1B1A24 100%)',
      boxShadow: '0 40px 70px rgba(15,14,23,0.28), 0 6px 14px rgba(15,14,23,0.14), inset 0 0 0 1px rgba(255,255,255,0.06)',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: -2,
      top: 98,
      width: 3,
      height: 26,
      borderRadius: 2,
      background: '#2A2933'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: -2,
      top: 138,
      width: 3,
      height: 48,
      borderRadius: 2,
      background: '#2A2933'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: -2,
      top: 195,
      width: 3,
      height: 48,
      borderRadius: 2,
      background: '#2A2933'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      right: -2,
      top: 158,
      width: 3,
      height: 72,
      borderRadius: 2,
      background: '#2A2933'
    }
  }), React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 33,
      background: 'linear-gradient(180deg, #FAFAFB 0%, #F4F4F8 100%)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 9,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 76,
      height: 22,
      borderRadius: 999,
      background: '#0F0E17'
    }
  }), React.createElement("div", {
    style: {
      padding: '16px 22px 0',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      fontWeight: 600,
      color: '#0F0E17'
    }
  }, React.createElement("span", null, "9:41"), React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 4,
      alignItems: 'center'
    }
  }, React.createElement("svg", {
    width: "14",
    height: "9",
    viewBox: "0 0 14 9"
  }, React.createElement("path", {
    d: "M0 8h2V6H0v2zm4 0h2V4H4v4zm4 0h2V2H8v6zm4 0h2V0h-2v8z",
    fill: "#0F0E17"
  })), React.createElement("svg", {
    width: "14",
    height: "10",
    viewBox: "0 0 14 10",
    fill: "none"
  }, React.createElement("path", {
    d: "M1 5a6 6 0 0112 0M3 6a4 4 0 018 0M5 7a2 2 0 014 0",
    stroke: "#0F0E17",
    strokeWidth: "1.2",
    strokeLinecap: "round"
  })), React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: 20,
      height: 9
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      border: '1px solid #0F0E17',
      borderRadius: 2,
      opacity: 0.4
    }
  }), React.createElement("span", {
    style: {
      position: 'absolute',
      top: 1.5,
      left: 1.5,
      width: 14,
      height: 6,
      background: '#0F0E17',
      borderRadius: 1
    }
  })))), React.createElement("div", {
    style: {
      padding: '44px 18px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '-0.02em',
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }, "DELT"), React.createElement(PlxPill, {
    tone: "indigo"
  }, "Offer")), React.createElement("div", {
    style: {
      padding: '14px 18px 0'
    }
  }, React.createElement(PlxLabel, null, "Ready to fund"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 36,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.035em',
      marginTop: 4,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$95,000")), React.createElement("div", {
    style: {
      margin: '14px 14px 0',
      padding: '10px 14px',
      background: '#FFFFFF',
      borderRadius: 12,
      border: '1px solid rgba(15,14,23,0.05)',
      boxShadow: '0 1px 2px rgba(15,14,23,0.03)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, [['Advance', '$95,000'], ['Factor', '1.16×'], ['Total repay', '$110,200'], ['Holdback', '9% of sales']].map((row, i, arr) => React.createElement("div", {
    key: row[0],
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 0',
      borderBottom: i < arr.length - 1 ? '1px solid rgba(15,14,23,0.04)' : 'none',
      fontFamily: DELT.font.body,
      fontSize: 11
    }
  }, React.createElement("span", {
    style: {
      color: DELT.colors.inkMute
    }
  }, row[0]), React.createElement("span", {
    style: {
      color: DELT.colors.ink,
      fontWeight: 600
    }
  }, row[1])))), React.createElement("div", {
    style: {
      padding: '12px 18px 0'
    }
  }, React.createElement("div", {
    style: {
      height: 5,
      borderRadius: 999,
      background: 'rgba(73,69,255,0.10)',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      width: '82%',
      height: '100%',
      borderRadius: 999,
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`
    }
  })), React.createElement("div", {
    style: {
      marginTop: 7,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      color: '#0FA968',
      fontWeight: 600,
      letterSpacing: '0.02em'
    }
  }, React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 999,
      background: '#0FA968'
    }
  }), "Approved \xB7 funds in 24h")), React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: '0 14px 16px'
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      height: 40,
      borderRadius: 12,
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      fontWeight: 600,
      color: '#fff',
      letterSpacing: '-0.005em',
      boxShadow: '0 8px 18px rgba(73,69,255,0.30)'
    }
  }, "Accept offer \u2192"), React.createElement("div", {
    style: {
      width: 88,
      height: 4,
      borderRadius: 999,
      background: '#0F0E17',
      opacity: 0.3,
      margin: '8px auto 0'
    }
  }))));
}
function PlxMockApprovals() {
  const start = 135;
  const end = 405;
  const pct = 0.68;
  const R = 68;
  const cx = 90;
  const cy = 90;
  const rad = a => a * Math.PI / 180;
  const arcPath = (a0, a1) => {
    const x0 = cx + R * Math.cos(rad(a0));
    const y0 = cy + R * Math.sin(rad(a0));
    const x1 = cx + R * Math.cos(rad(a1));
    const y1 = cy + R * Math.sin(rad(a1));
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
  };
  const fillEnd = start + (end - start) * pct;
  return React.createElement(PlxSurface, {
    width: 300
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 13,
      color: DELT.colors.indigo,
      letterSpacing: '-0.005em'
    }
  }, "Approval \xB7 live"), React.createElement(PlxPill, {
    tone: "green"
  }, "Soft pull")), React.createElement("div", {
    style: {
      position: 'relative',
      width: 180,
      height: 180,
      margin: '4px auto 0'
    }
  }, React.createElement("svg", {
    viewBox: "0 0 180 180",
    width: "100%",
    height: "100%"
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "plxApprovalGrad",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: DELT.colors.indigo
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: PLX.softIndigo
  }))), React.createElement("path", {
    d: arcPath(start, end),
    stroke: "rgba(73,69,255,0.10)",
    strokeWidth: "10",
    strokeLinecap: "round",
    fill: "none"
  }), React.createElement("path", {
    d: arcPath(start, fillEnd),
    stroke: "url(#plxApprovalGrad)",
    strokeWidth: "10",
    strokeLinecap: "round",
    fill: "none"
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 40,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.045em',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "Live"), React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "underwriting"))), React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, [['Deposits verified', 'Done'], ['Ownership matched', 'Done'], ['Offer ranged', 'Done']].map(row => React.createElement("div", {
    key: row[0],
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      background: 'rgba(15,169,104,0.06)',
      border: '1px solid rgba(15,169,104,0.15)',
      borderRadius: 10,
      fontFamily: DELT.font.body,
      fontSize: 12
    }
  }, React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      color: DELT.colors.ink
    }
  }, React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "5.5",
    fill: "#0FA968"
  }), React.createElement("path", {
    d: "M3.5 6.2l1.7 1.7L8.7 4.3",
    stroke: "#fff",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none"
  })), row[0]), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      color: '#0FA968',
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, row[1])))));
}
function PlxMockCommissions() {
  const bars = [42, 55, 48, 68, 78, 92];
  const max = 100;
  return React.createElement(PlxSurface, {
    width: 280
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14
    }
  }, React.createElement("div", null, React.createElement(PlxLabel, null, "Commissions \xB7 YTD"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 30,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.03em',
      margin: '4px 0 2px',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$74,820"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      color: '#0FA968'
    }
  }, "\u25B2 34% vs last year")), React.createElement(PlxPill, {
    tone: "indigo"
  }, "100% residual")), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8,
      height: 84
    }
  }, bars.map((v, i) => React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      height: `${v / max * 100}%`,
      minHeight: 8,
      borderRadius: 6,
      background: i === bars.length - 1 ? `linear-gradient(180deg, ${DELT.colors.indigo}, ${PLX.softIndigo})` : 'rgba(73,69,255,0.20)'
    }
  }), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9,
      color: DELT.colors.inkMute
    }
  }, ['J', 'F', 'M', 'A', 'M', 'J'][i])))));
}
function PlxMockLineOfCredit() {
  const limit = 250000;
  const drawn = 92500;
  const available = limit - drawn;
  const pct = drawn / limit * 100;
  const fmt = n => `$${n.toLocaleString('en-US')}`;
  const spark = [0.20, 0.35, 0.28, 0.52, 0.44, 0.60, 0.55, 0.72, 0.68, 0.80, 0.75, 0.90];
  const sparkW = 260;
  const sparkH = 24;
  const points = spark.map((v, i) => {
    const x = i / (spark.length - 1) * sparkW;
    const y = sparkH - v * sparkH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return React.createElement(PlxSurface, {
    width: 300
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 13,
      color: DELT.colors.indigo,
      letterSpacing: '-0.005em'
    }
  }, "Delt Credit Line"), React.createElement(PlxPill, {
    tone: "green"
  }, "Open")), React.createElement(PlxLabel, null, "Available to draw"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 32,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.035em',
      marginTop: 4,
      fontVariantNumeric: 'tabular-nums'
    }
  }, fmt(available)), React.createElement("div", {
    style: {
      marginTop: 14,
      height: 7,
      borderRadius: 999,
      background: 'rgba(73,69,255,0.10)',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      borderRadius: 999,
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`
    }
  })), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 8,
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      color: DELT.colors.inkMute,
      fontVariantNumeric: 'tabular-nums'
    }
  }, React.createElement("span", null, fmt(drawn), " drawn"), React.createElement("span", null, fmt(limit), " limit")), React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "Draws \xB7 12wk"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10,
      color: '#0FA968',
      fontWeight: 600
    }
  }, "\u25B2 22%")), React.createElement("svg", {
    viewBox: `0 0 ${sparkW} ${sparkH}`,
    width: "100%",
    height: sparkH,
    preserveAspectRatio: "none"
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "plxLocSpark",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: DELT.colors.indigo
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: PLX.softIndigo
  }))), React.createElement("polyline", {
    points: points,
    fill: "none",
    stroke: "url(#plxLocSpark)",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 14,
      borderTop: '1px solid rgba(15,14,23,0.06)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "Bank line"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 14,
      fontWeight: 600,
      color: DELT.colors.inkMute,
      textDecoration: 'line-through'
    }
  }, "12.5% APR")), React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.indigo
    }
  }, "Your rate"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 18,
      fontWeight: 700,
      color: DELT.colors.ink,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "8.9% APR"))));
}
function PlxMockProcessors() {
  return React.createElement(PlxSurface, {
    width: 300
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 13,
      color: DELT.colors.indigo,
      letterSpacing: '-0.005em'
    }
  }, "Rate comparison"), React.createElement(PlxPill, {
    tone: "green"
  }, "Live quote")), React.createElement("div", {
    style: {
      padding: '12px 14px',
      borderRadius: 12,
      background: 'rgba(15,14,23,0.03)',
      border: '1px solid rgba(15,14,23,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "Current \xB7 Square"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 11,
      color: DELT.colors.inkMute,
      marginTop: 2
    }
  }, "2.6% + $0.15 per swipe")), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 22,
      fontWeight: 600,
      color: DELT.colors.inkMute,
      letterSpacing: '-0.02em',
      textDecoration: 'line-through',
      textDecorationThickness: '1px',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "~2.9%")), React.createElement("div", {
    style: {
      marginTop: 8,
      padding: '14px',
      borderRadius: 12,
      background: 'linear-gradient(135deg, rgba(73,69,255,0.08), rgba(124,107,255,0.05))',
      border: '1px solid rgba(73,69,255,0.20)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.indigo,
      fontWeight: 600
    }
  }, "Delt \xB7 cash discount"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 11,
      color: DELT.colors.inkSoft,
      marginTop: 2
    }
  }, "Retail, service, QSR")), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.03em',
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "0% net")), React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 14,
      borderTop: '1px solid rgba(15,14,23,0.06)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "You keep"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 11,
      color: DELT.colors.inkMute,
      marginTop: 2
    }
  }, "on $100K/month volume")), React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 12,
      color: '#0FA968',
      fontWeight: 700
    }
  }, "\u25B2"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 22,
      fontWeight: 700,
      color: '#0FA968',
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$2,900"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      color: DELT.colors.inkMute,
      marginLeft: 2
    }
  }, "/mo"))));
}
function PlxMockTerminals() {
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      width: '100%'
    }
  }, React.createElement("img", {
    src: "app/assets/mocks/delt_mock_terminals.jpg",
    alt: "Delt payment terminals",
    style: {
      width: 320,
      maxWidth: '100%',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
      filter: 'drop-shadow(0 12px 24px rgba(15,14,23,0.08))'
    }
  }), React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 9.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute,
      fontWeight: 500,
      textAlign: 'center'
    }
  }, "Countertop \xB7 handheld \xB7 mobile"), React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 2,
      fontFamily: DELT.font.mono,
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute,
      fontVariantNumeric: 'tabular-nums'
    }
  }, React.createElement("span", null, React.createElement("span", {
    style: {
      color: DELT.colors.ink,
      fontWeight: 700
    }
  }, "$0"), " down"), React.createElement("span", {
    style: {
      opacity: 0.3
    }
  }, "\u2022"), React.createElement("span", null, "Own or lease"), React.createElement("span", {
    style: {
      opacity: 0.3
    }
  }, "\u2022"), React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: '#0FA968',
      fontWeight: 700
    }
  }, React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12",
    fill: "none"
  }, React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "5.5",
    fill: "#0FA968"
  }), React.createElement("path", {
    d: "M3.5 6.2l1.7 1.7L8.7 4.3",
    stroke: "#fff",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none"
  })), "Same-day board")));
}
function V1ProductGrid({
  onNav
}) {
  const mobile = useIsMobile();
  const go = page => typeof onNav === 'function' ? () => onNav(page) : undefined;
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: '#EEF3FA',
      padding: mobile ? '64px 0' : '120px 0'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: mobile ? '0 20px' : '0 32px'
    }
  }, React.createElement(V1Reveal, null, React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      margin: 0,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: mobile ? 34 : 72,
      letterSpacing: '-0.03em',
      lineHeight: 1.0,
      color: DELT.colors.ink,
      maxWidth: 820
    }
  }, "Don't wait on the bank."), React.createElement("p", {
    style: {
      margin: '20px 0 0',
      fontFamily: DELT.font.body,
      fontSize: mobile ? 16 : 18,
      lineHeight: 1.55,
      color: DELT.colors.inkSoft,
      maxWidth: 560
    }
  }, "Every day you wait is revenue you don't book. Capital wired in 24 hours \u2014 priced off your deposits, not your paperwork."), React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, React.createElement("a", {
    href: "#how",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: DELT.font.body,
      fontSize: 15,
      fontWeight: 500,
      color: DELT.colors.indigo
    }
  }, "See how it works ", React.createElement(Arr, null)))), React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: mobile ? 16 : 24,
      marginTop: mobile ? 40 : 56
    }
  }, React.createElement(PlxProductCard, {
    large: true,
    mobile: mobile,
    tint: "#EEF0FF",
    title: "Revenue-based funding",
    desc: "Underwritten off your deposits, not FICO. Wired in 24 hours.",
    onClick: go('how')
  }, React.createElement(PlxMockOffer, null)), React.createElement(PlxProductCard, {
    large: true,
    mobile: mobile,
    tint: "#F0F7FE",
    title: "Faster than the bank",
    desc: "Ranged offers in minutes. Soft pull, no callbacks.",
    onClick: go('speed')
  }, React.createElement(PlxMockApprovals, null))), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
      gap: mobile ? 16 : 24,
      marginTop: mobile ? 16 : 24
    }
  }, React.createElement(PlxProductCard, {
    mobile: mobile,
    tint: "#F5F1FF",
    title: "Lines, loans & more",
    desc: "Revolving credit, term loans with simple interest, and SBA-style options \u2014 all priced below the bank.",
    onClick: go('lending')
  }, React.createElement(PlxMockLineOfCredit, null)), React.createElement(PlxProductCard, {
    mobile: mobile,
    tint: "#FFFFFF",
    title: "Card processing",
    desc: "We beat your current rate in writing. Same terminals, next-day deposits.",
    onClick: go('processing')
  }, React.createElement(PlxMockProcessors, null)), React.createElement(PlxProductCard, {
    mobile: mobile,
    tint: "#EEF7FB",
    title: "Terminal financing",
    desc: "Own or lease. Same-day board.",
    onClick: go('terminals')
  }, React.createElement(PlxMockTerminals, null)))));
}
function PlxDnaHelix({
  size = 400
}) {
  const H = 420,
    W = 260,
    cx = W / 2;
  const amp = 78;
  const turns = 3.2;
  const samples = 48;
  const strandPath = phase => {
    let d = '';
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const y = t * H;
      const x = cx + amp * Math.sin(t * turns * Math.PI * 2 + phase);
      d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  };
  const rungs = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const theta = t * turns * Math.PI * 2;
    const xA = cx + amp * Math.sin(theta);
    const xB = cx + amp * Math.sin(theta + Math.PI);
    const y = t * H;
    if (i % 4 === 0) rungs.push({
      xA,
      xB,
      y,
      k: i
    });
  }
  return React.createElement("div", {
    "aria-hidden": true,
    style: {
      width: size,
      maxWidth: '100%',
      margin: '0 auto'
    }
  }, React.createElement("style", null, `
        @keyframes dnaRotate { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes dnaPulse  { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes dnaFloat  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .plx-dna-spin { transform-box: fill-box; transform-origin: center; animation: dnaRotate 30s linear infinite; }
        .plx-dna-node { animation: dnaPulse 3s ease-in-out infinite; }
        .plx-dna-float { animation: dnaFloat 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .plx-dna-spin, .plx-dna-node, .plx-dna-float { animation: none !important; opacity: 1 !important; }
        }
      `), React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, React.createElement("defs", null, React.createElement("filter", {
    id: "plxDnaGlow",
    x: "-40%",
    y: "-40%",
    width: "180%",
    height: "180%"
  }, React.createElement("feGaussianBlur", {
    stdDeviation: "4",
    result: "b"
  }), React.createElement("feMerge", null, React.createElement("feMergeNode", {
    in: "b"
  }), React.createElement("feMergeNode", {
    in: "SourceGraphic"
  }))), React.createElement("linearGradient", {
    id: "plxStrandA",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: PLX.cyan
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: PLX.indigo
  })), React.createElement("linearGradient", {
    id: "plxStrandB",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: PLX.violet
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: PLX.softIndigo
  }))), React.createElement("g", {
    className: "plx-dna-spin",
    style: {
      transformOrigin: `${cx}px ${H / 2}px`
    },
    filter: "url(#plxDnaGlow)"
  }, rungs.map(r => React.createElement("line", {
    key: `rung-${r.k}`,
    x1: r.xA,
    y1: r.y,
    x2: r.xB,
    y2: r.y,
    stroke: "rgba(125,211,252,0.35)",
    strokeWidth: "1.5"
  })), React.createElement("path", {
    d: strandPath(0),
    fill: "none",
    stroke: "url(#plxStrandA)",
    strokeWidth: "3.5",
    strokeLinecap: "round"
  }), React.createElement("path", {
    d: strandPath(Math.PI),
    fill: "none",
    stroke: "url(#plxStrandB)",
    strokeWidth: "3.5",
    strokeLinecap: "round"
  }), rungs.map((r, i) => React.createElement("g", {
    key: `nodes-${r.k}`
  }, React.createElement("circle", {
    className: "plx-dna-node",
    cx: r.xA,
    cy: r.y,
    r: "5.5",
    fill: PLX.indigo,
    style: {
      animationDelay: `${i % 5 * 0.35}s`
    }
  }), React.createElement("circle", {
    className: "plx-dna-node",
    cx: r.xB,
    cy: r.y,
    r: "5.5",
    fill: PLX.indigo,
    style: {
      animationDelay: `${i % 5 * 0.35 + 0.5}s`
    }
  }))))));
}
function PlxNetworkGlobe({
  size = 380
}) {
  const R = 160;
  const lats = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
  const lons = [-60, -30, 0, 30, 60];
  const nodes = [{
    x: -0.55,
    y: -0.40
  }, {
    x: 0.20,
    y: -0.55
  }, {
    x: 0.60,
    y: -0.15
  }, {
    x: -0.30,
    y: 0.10
  }, {
    x: 0.45,
    y: 0.30
  }, {
    x: -0.65,
    y: 0.35
  }, {
    x: 0.05,
    y: 0.55
  }, {
    x: -0.10,
    y: -0.20
  }, {
    x: 0.35,
    y: -0.05
  }];
  return React.createElement("svg", {
    "aria-hidden": true,
    viewBox: `-${R + 40} -${R + 40} ${(R + 40) * 2} ${(R + 40) * 2}`,
    width: size,
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, React.createElement("defs", null, React.createElement("radialGradient", {
    id: "plxGlobeFade",
    cx: "50%",
    cy: "50%",
    r: "55%"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: "rgba(125,211,252,0.28)"
  }), React.createElement("stop", {
    offset: "70%",
    stopColor: "rgba(125,211,252,0.05)"
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: "rgba(4,30,66,0)"
  })), React.createElement("filter", {
    id: "plxGlobeGlow",
    x: "-30%",
    y: "-30%",
    width: "160%",
    height: "160%"
  }, React.createElement("feGaussianBlur", {
    stdDeviation: "3"
  }))), React.createElement("circle", {
    cx: "0",
    cy: "0",
    r: R + 30,
    fill: "url(#plxGlobeFade)"
  }), React.createElement("g", {
    className: "plx-globe-spin",
    style: {
      transformOrigin: '0 0'
    }
  }, lats.map((y, i) => React.createElement("ellipse", {
    key: `lat-${i}`,
    cx: "0",
    cy: y * R,
    rx: Math.sqrt(1 - y * y) * R,
    ry: 4,
    fill: "none",
    stroke: "rgba(125,211,252,0.30)",
    strokeWidth: "1"
  })), lons.map(a => React.createElement("ellipse", {
    key: `lon-${a}`,
    cx: "0",
    cy: "0",
    rx: Math.abs(Math.sin(a * Math.PI / 180)) * R || 1,
    ry: R,
    fill: "none",
    stroke: "rgba(125,211,252,0.25)",
    strokeWidth: "1"
  })), React.createElement("circle", {
    cx: "0",
    cy: "0",
    r: R,
    fill: "none",
    stroke: "rgba(125,211,252,0.50)",
    strokeWidth: "1.25"
  }), React.createElement("g", {
    filter: "url(#plxGlobeGlow)"
  }, nodes.map((n, i) => React.createElement("circle", {
    key: `nGlow-${i}`,
    cx: n.x * R,
    cy: n.y * R,
    r: "6",
    fill: PLX.cyan,
    opacity: "0.55"
  }))), nodes.map((n, i) => React.createElement("circle", {
    key: `n-${i}`,
    cx: n.x * R,
    cy: n.y * R,
    r: "3",
    fill: PLX.cyan,
    className: "plx-dna-node",
    style: {
      animationDelay: `${i % 5 * 0.4}s`
    }
  })), [[0, 4], [1, 7], [3, 6], [2, 8]].map(([a, b], i) => {
    const A = nodes[a],
      B = nodes[b];
    const mx = (A.x + B.x) / 2 * R;
    const my = (A.y + B.y) / 2 * R - 30;
    return React.createElement("path", {
      key: `link-${i}`,
      d: `M ${A.x * R} ${A.y * R} Q ${mx} ${my} ${B.x * R} ${B.y * R}`,
      fill: "none",
      stroke: "rgba(125,211,252,0.45)",
      strokeWidth: "1",
      strokeDasharray: "2 4"
    });
  })));
}
function V1IntelligentBanner({
  onNav
}) {
  const mobile = useIsMobile();
  return React.createElement("section", {
    style: {
      background: '#EEF3FA',
      padding: mobile ? '40px 0 64px' : '80px 0 120px'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: mobile ? '0 20px' : '0 32px'
    }
  }, React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 28,
      minHeight: mobile ? 'auto' : 480,
      background: `radial-gradient(100% 120% at 100% 50%, #2FA9E6 0%, #1F6CB8 30%, #123A82 60%, #0B2C5C 100%)`,
      border: '1px solid rgba(125,211,252,0.14)',
      boxShadow: '0 60px 120px rgba(4,30,66,0.30), 0 0 0 1px rgba(125,211,252,0.08)'
    }
  }, React.createElement("style", null, `
            @keyframes plxGlobeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .plx-globe-spin { animation: plxGlobeSpin 90s linear infinite; transform-origin: center; }
            @keyframes plxTopoDrift { 0% { transform: translateX(0); } 100% { transform: translateX(-24px); } }
            .plx-topo-drift { animation: plxTopoDrift 24s ease-in-out infinite alternate; }
            @media (prefers-reduced-motion: reduce) {
              .plx-globe-spin, .plx-topo-drift { animation: none !important; }
            }
          `), !mobile && React.createElement("svg", {
    "aria-hidden": true,
    viewBox: "0 0 600 480",
    width: "600",
    height: "480",
    preserveAspectRatio: "none",
    className: "plx-topo-drift",
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      opacity: 0.28,
      pointerEvents: 'none'
    }
  }, Array.from({
    length: 22
  }, (_, i) => React.createElement("path", {
    key: i,
    d: `M ${-40 + i * 4} 0 Q ${140 + i * 8} ${140 + i * 6}, ${80 + i * 6} ${320 - i * 4} T ${-20 + i * 2} 480`,
    fill: "none",
    stroke: "rgba(125,211,252,0.55)",
    strokeWidth: "0.6"
  }))), !mobile && React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      top: 0,
      width: '60%',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    }
  }, React.createElement("img", {
    src: "app/assets/washington-blue.jpg",
    alt: "",
    "aria-hidden": true,
    style: {
      height: '108%',
      width: 'auto',
      maxWidth: '100%',
      objectFit: 'cover',
      objectPosition: 'right bottom',
      mixBlendMode: 'screen',
      opacity: 0.95
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(11,44,92,1) 0%, rgba(11,44,92,0.35) 22%, rgba(11,44,92,0) 45%)'
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '18%',
      background: 'linear-gradient(90deg, rgba(47,169,230,0) 0%, rgba(47,169,230,0.35) 100%)',
      mixBlendMode: 'screen'
    }
  })), React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 3,
      maxWidth: mobile ? '100%' : '50%',
      padding: mobile ? '48px 24px 40px' : '110px 64px'
    }
  }, React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: mobile ? 34 : 56,
      letterSpacing: '-0.028em',
      lineHeight: 1.02,
      color: '#fff'
    }
  }, "Underwriting that reads your revenue, not only your credit."), React.createElement("p", {
    style: {
      margin: '20px 0 0',
      fontFamily: DELT.font.body,
      fontSize: mobile ? 15.5 : 17,
      lineHeight: 1.6,
      color: 'rgba(255,255,255,0.78)',
      maxWidth: 440
    }
  }, "A holistic review \u2014 live deposits, cash flow, and time in business weighed alongside credit, not a single score deciding your fate."), React.createElement("a", {
    onClick: e => {
      e.preventDefault();
      if (onNav) onNav('how');
    },
    href: "#how",
    style: {
      marginTop: 32,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: DELT.font.body,
      fontSize: 15,
      fontWeight: 500,
      color: DELT.colors.ink,
      background: '#fff',
      borderRadius: 999,
      padding: '13px 26px',
      cursor: 'pointer',
      boxShadow: `0 0 0 3px rgba(125,211,252,0.35), 0 0 0 6px rgba(47,169,230,0.15), 0 10px 24px rgba(4,30,66,0.35)`
    }
  }, "See how we underwrite")), mobile && React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      padding: '0 20px 40px',
      display: 'flex',
      justifyContent: 'center'
    }
  }, React.createElement(PlxDnaHelix, {
    size: 220
  })))));
}
function PlxFundedCard({
  icon,
  iconBg,
  iconFg,
  name,
  msg,
  ago
}) {
  return React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 16,
      padding: '12px 14px 12px 12px',
      width: 300,
      maxWidth: '100%',
      boxShadow: '0 20px 44px rgba(15,14,23,0.10), 0 2px 6px rgba(15,14,23,0.05)',
      border: `1px solid ${DELT.colors.line}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, React.createElement("div", {
    style: {
      flexShrink: 0,
      width: 40,
      height: 40,
      borderRadius: 11,
      background: iconBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: iconFg,
      fontFamily: DELT.font.display,
      fontWeight: 700,
      fontSize: 18,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)'
    }
  }, icon), React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 13,
      color: DELT.colors.ink,
      letterSpacing: '-0.005em'
    }
  }, name), React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: DELT.font.body,
      fontSize: 11,
      color: DELT.colors.inkMute
    }
  }, ago)), React.createElement("div", {
    style: {
      marginTop: 2,
      fontFamily: DELT.font.body,
      fontSize: 14,
      color: DELT.colors.ink,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, msg)));
}
function PlxStoryPill({
  img,
  tag,
  tagBg
}) {
  return React.createElement("div", {
    style: {
      width: 208,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 20px 44px rgba(15,14,23,0.10)',
      background: tagBg,
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      aspectRatio: '16 / 8',
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("img", {
    src: img,
    alt: "",
    "aria-hidden": true,
    loading: "lazy",
    style: {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center'
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(180deg, rgba(0,0,0,0) 40%, ${tagBg} 100%)`
    }
  }), React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 8,
      left: 10,
      fontFamily: DELT.font.display,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '0.04em',
      color: '#fff',
      textTransform: 'uppercase',
      textShadow: '0 1px 4px rgba(0,0,0,0.3)'
    }
  }, tag)));
}
function PlxNetworkSpine() {
  const lines = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const stops = [[125, 211, 252], [124, 107, 255], [139, 92, 246]];
    const seg = t * (stops.length - 1);
    const idx = Math.min(Math.floor(seg), stops.length - 2);
    const f = seg - idx;
    const a = stops[idx],
      b = stops[idx + 1];
    const rgb = [Math.round(a[0] + (b[0] - a[0]) * f), Math.round(a[1] + (b[1] - a[1]) * f), Math.round(a[2] + (b[2] - a[2]) * f)];
    const dx = -30 + i * 4;
    lines.push({
      dx,
      rgb,
      alpha: 0.42 + 0.12 * Math.sin(i * 0.9)
    });
  }
  return React.createElement("svg", {
    "aria-hidden": true,
    viewBox: "0 0 480 600",
    width: "100%",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      inset: 0,
      height: '100%',
      width: '100%',
      pointerEvents: 'none'
    }
  }, lines.map((l, i) => React.createElement("path", {
    key: i,
    d: `M ${80 + l.dx} 0
              C ${340 + l.dx} 120, ${110 + l.dx} 220, ${360 + l.dx} 320
              S ${70 + l.dx} 460, ${350 + l.dx} 560
              S ${140 + l.dx} 620, ${320 + l.dx} 620`,
    fill: "none",
    stroke: `rgba(${l.rgb[0]},${l.rgb[1]},${l.rgb[2]},${l.alpha.toFixed(2)})`,
    strokeWidth: "1",
    strokeLinecap: "round"
  })));
}
function V1NetworkStats() {
  const mobile = useIsMobile();
  const [ref, inView] = useV1InView(0.3);
  const items = [{
    kind: 'card',
    top: 10,
    left: 50,
    icon: 'D',
    iconBg: '#4945FF',
    iconFg: '#fff',
    name: 'Delt Capital',
    ago: '2m ago',
    msg: 'Bloom Beauty funded · $65K'
  }, {
    kind: 'pill',
    top: 130,
    left: 130,
    img: 'app/assets/cases/04_larosa.jpg',
    tag: 'La Rosa',
    tagBg: '#0B2C5C'
  }, {
    kind: 'card',
    top: 250,
    left: 30,
    icon: 'R',
    iconBg: '#0F7A5A',
    iconFg: '#fff',
    name: 'Rosario Const.',
    ago: 'now',
    msg: 'Wired $180,000 · 1.14×'
  }, {
    kind: 'pill',
    top: 370,
    left: 170,
    img: 'app/assets/cases/03_bloom.jpg',
    tag: 'Bloom Beauty',
    tagBg: '#4945FF'
  }, {
    kind: 'card',
    top: 490,
    left: 60,
    icon: 'W',
    iconBg: '#7DD3FC',
    iconFg: '#041E42',
    name: 'Ward Market',
    ago: '1h ago',
    msg: 'Funded $50,000 · 1.18×'
  }];
  return React.createElement("section", {
    "data-v1-section": true,
    ref: ref,
    style: {
      background: '#F5F7FB',
      padding: mobile ? '64px 0' : '120px 0'
    }
  }, React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: mobile ? '0 20px' : '0 32px',
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '45% 55%',
      gap: mobile ? 40 : 64,
      alignItems: 'center'
    }
  }, mobile ? React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, items.filter(i => i.kind === 'card').map(c => React.createElement(PlxFundedCard, {
    key: c.name,
    icon: c.icon,
    iconBg: c.iconBg,
    iconFg: c.iconFg,
    name: c.name,
    msg: c.msg,
    ago: c.ago
  }))) : React.createElement("div", {
    style: {
      position: 'relative',
      height: 620,
      width: '100%'
    }
  }, React.createElement(PlxNetworkSpine, null), items.map((it, i) => React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      top: it.top,
      left: it.left,
      filter: 'drop-shadow(0 6px 14px rgba(15,14,23,0.06))'
    }
  }, it.kind === 'card' ? React.createElement(PlxFundedCard, {
    icon: it.icon,
    iconBg: it.iconBg,
    iconFg: it.iconFg,
    name: it.name,
    msg: it.msg,
    ago: it.ago
  }) : React.createElement(PlxStoryPill, {
    img: it.img,
    tag: it.tag,
    tagBg: it.tagBg
  })))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: DELT.colors.indigo,
      marginBottom: 16
    }
  }, "The Numbers"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      margin: 0,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: mobile ? 30 : 56,
      letterSpacing: '-0.025em',
      lineHeight: 1.05,
      color: DELT.colors.ink
    }
  }, "Sharper offers, every year we've been at it."), React.createElement("p", {
    style: {
      margin: '20px 0 0',
      fontFamily: DELT.font.body,
      fontSize: 17,
      lineHeight: 1.6,
      color: DELT.colors.inkSoft,
      maxWidth: 460
    }
  }, "2,850+ businesses funded. $200M+ deployed since 2019. That track record is why your offer lands faster and priced better."), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: mobile ? 24 : 36,
      marginTop: 40
    }
  }, DeltContent.stats.map((s, i) => React.createElement("div", {
    key: s.l
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 700,
      fontSize: mobile ? 44 : 64,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      color: i % 2 === 0 ? DELT.colors.indigo : PLX.violet
    }
  }, inView ? React.createElement(V1CountUp, {
    value: s.v
  }) : s.v), React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: DELT.font.mono,
      fontSize: 12,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, s.l)))))));
}
function PlxTabCapital() {
  return React.createElement("div", {
    style: {
      background: '#fff',
      color: DELT.colors.ink,
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    style: {
      padding: '22px 28px',
      borderBottom: `1px solid ${DELT.colors.line}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 15,
      color: DELT.colors.indigo
    }
  }, "Your funding offer"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#0FA968',
      background: 'rgba(15,169,104,0.10)',
      padding: '5px 12px',
      borderRadius: 999
    }
  }, "Ready to fund")), React.createElement("div", {
    style: {
      padding: '36px 28px 12px',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "You get today"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 68,
      fontWeight: 700,
      letterSpacing: '-0.035em',
      lineHeight: 1,
      marginTop: 8,
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }, "$125,000"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 15,
      color: DELT.colors.inkSoft,
      marginTop: 14
    }
  }, "Wired to your account within 24 hours.")), React.createElement("div", {
    style: {
      padding: '28px 28px 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, [['Holdback', '9% of sales'], ['Factor', '1.16×'], ['Total repaid', '$145,000']].map(([l, v]) => React.createElement("div", {
    key: l,
    style: {
      textAlign: 'center',
      padding: 14,
      borderRadius: 12,
      background: 'rgba(73,69,255,0.04)',
      border: `1px solid ${DELT.colors.lineSoft}`
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, l), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 18,
      fontWeight: 700,
      color: DELT.colors.ink,
      marginTop: 6,
      letterSpacing: '-0.015em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)))), React.createElement("div", {
    style: {
      padding: 28,
      marginTop: 'auto'
    }
  }, React.createElement("div", {
    style: {
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
      color: '#fff',
      textAlign: 'center',
      borderRadius: 12,
      padding: '15px 0',
      fontFamily: DELT.font.body,
      fontWeight: 600,
      fontSize: 16,
      boxShadow: '0 12px 24px rgba(73,69,255,0.25)'
    }
  }, "Accept offer \u2192"), React.createElement("div", {
    style: {
      marginTop: 14,
      textAlign: 'center',
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      color: DELT.colors.inkMute
    }
  }, "No collateral. No hidden fees. Pay early, pay less.")));
}
function PlxTabCapital_OLD() {
  const rows = [{
    d: 'Weeks 1–8',
    amt: '$1,240 / wk'
  }, {
    d: 'Weeks 9–16',
    amt: '$1,240 / wk'
  }, {
    d: 'Weeks 17–24',
    amt: '$1,240 / wk'
  }];
  return React.createElement("div", {
    style: {
      background: '#fff',
      color: DELT.colors.ink,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    style: {
      padding: '18px 24px',
      borderBottom: `1px solid ${DELT.colors.line}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 15
    }
  }, "Delt Capital \xB7 Offer #10482"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 12,
      color: DELT.colors.ok,
      background: 'rgba(15,122,90,0.10)',
      padding: '4px 10px',
      borderRadius: 999
    }
  }, "Ready")), React.createElement("div", {
    style: {
      padding: 24,
      display: 'flex',
      gap: 40,
      flexWrap: 'wrap'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: DELT.colors.inkMute
    }
  }, "Advance"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 48,
      fontWeight: 700,
      color: DELT.colors.indigo,
      letterSpacing: '-0.03em',
      lineHeight: 1
    }
  }, "$125,000")), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: DELT.colors.inkMute
    }
  }, "Factor"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 48,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.03em',
      lineHeight: 1
    }
  }, "1.16\xD7"))), React.createElement("div", {
    style: {
      padding: '0 24px'
    }
  }, rows.map(r => React.createElement("div", {
    key: r.d,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderTop: `1px solid ${DELT.colors.lineSoft}`,
      fontFamily: DELT.font.body,
      fontSize: 14
    }
  }, React.createElement("span", {
    style: {
      color: DELT.colors.inkSoft
    }
  }, r.d), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      color: DELT.colors.ink
    }
  }, r.amt)))), React.createElement("div", {
    style: {
      padding: 24,
      marginTop: 'auto'
    }
  }, React.createElement("div", {
    style: {
      background: DELT.colors.indigo,
      color: '#fff',
      textAlign: 'center',
      borderRadius: 8,
      padding: '13px 0',
      fontFamily: DELT.font.body,
      fontWeight: 600,
      fontSize: 15
    }
  }, "Accept offer \u2192")));
}
function PlxTabPayments() {
  return React.createElement("div", {
    style: {
      background: '#fff',
      color: DELT.colors.ink,
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    style: {
      padding: '22px 28px',
      borderBottom: `1px solid ${DELT.colors.line}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 15,
      color: DELT.colors.indigo
    }
  }, "Your processing rate"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "Monthly savings")), React.createElement("div", {
    style: {
      padding: '30px 28px 24px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      padding: 22,
      borderRadius: 14,
      border: `1px solid ${DELT.colors.lineSoft}`,
      background: 'rgba(15,14,23,0.02)'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "Old processor"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 40,
      fontWeight: 700,
      color: DELT.colors.inkMute,
      marginTop: 8,
      letterSpacing: '-0.025em',
      textDecoration: 'line-through',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "2.90%"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13,
      color: DELT.colors.inkMute,
      marginTop: 4
    }
  }, "+ $0.30 per swipe")), React.createElement("div", {
    style: {
      padding: 22,
      borderRadius: 14,
      border: `1px solid ${DELT.colors.indigo}`,
      background: 'rgba(73,69,255,0.06)',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.indigo
    }
  }, "With Delt"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 40,
      fontWeight: 700,
      marginTop: 8,
      letterSpacing: '-0.025em',
      background: `linear-gradient(90deg, ${DELT.colors.indigo}, ${PLX.softIndigo})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "1.79%"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13,
      color: DELT.colors.ink,
      marginTop: 4
    }
  }, "+ $0.10 per swipe"))), React.createElement("div", {
    style: {
      margin: '4px 28px 0',
      padding: 18,
      borderRadius: 14,
      background: `linear-gradient(90deg, rgba(73,69,255,0.08), rgba(125,211,252,0.10))`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "You save every month"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 28,
      fontWeight: 700,
      color: DELT.colors.ink,
      letterSpacing: '-0.02em',
      marginTop: 2,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$1,240")), React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, "Deposits arrive"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 22,
      fontWeight: 700,
      color: DELT.colors.indigo,
      letterSpacing: '-0.02em',
      marginTop: 2
    }
  }, "Next day"))), React.createElement("div", {
    style: {
      padding: 28,
      marginTop: 'auto',
      textAlign: 'center',
      fontFamily: DELT.font.body,
      fontSize: 13,
      color: DELT.colors.inkMute
    }
  }, "Works with your existing terminals. We\u2019ll beat any rate in writing."));
}
function PlxTabPayments_OLD() {
  const vol = [22, 26, 20, 30, 28, 36, 34];
  const pts = vol.map((v, i) => `${i / (vol.length - 1) * 100},${44 - v}`).join(' ');
  return React.createElement("div", {
    style: {
      background: '#fff',
      color: DELT.colors.ink,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    style: {
      padding: '18px 24px',
      borderBottom: `1px solid ${DELT.colors.line}`,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 15
    }
  }, "Delt Payments \xB7 Volume"), React.createElement("div", {
    style: {
      padding: 24
    }
  }, React.createElement("svg", {
    width: "100%",
    height: "120",
    viewBox: "0 0 100 48",
    preserveAspectRatio: "none",
    style: {
      display: 'block'
    }
  }, React.createElement("polyline", {
    points: `0,48 ${pts} 100,48`,
    fill: "rgba(73,69,255,0.08)",
    stroke: "none"
  }), React.createElement("polyline", {
    points: pts,
    fill: "none",
    stroke: DELT.colors.indigo,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke"
  }))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12,
      padding: '0 24px 24px'
    }
  }, [['Volume today', '$42,180'], ['Batches', '3'], ['Approval rate', '96.8%']].map(([l, v]) => React.createElement("div", {
    key: l,
    style: {
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      padding: 14
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: DELT.colors.inkMute
    }
  }, l), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 700,
      fontSize: 22,
      color: DELT.colors.ink,
      marginTop: 4,
      letterSpacing: '-0.02em'
    }
  }, v)))));
}
function PlxTabPortal() {
  return React.createElement("img", {
    src: "app/assets/mocks/delt_tabs_portal_polished.jpg",
    alt: "Delt Portal agent commissions and merchants",
    style: {
      width: '100%',
      height: 'auto',
      display: 'block'
    }
  });
}
function PlxTabPortal_OLD() {
  const rows = [{
    m: 'Bloom Beauty',
    f: '$65,000',
    r: '1.19×',
    res: '$1,430'
  }, {
    m: 'La Rosa Restaurant',
    f: '$110,000',
    r: '1.16×',
    res: '$2,640'
  }, {
    m: 'Rosario Construction',
    f: '$180,000',
    r: '1.14×',
    res: '$4,320'
  }, {
    m: 'Ward Market',
    f: '$50,000',
    r: '1.18×',
    res: '$1,100'
  }];
  return React.createElement("div", {
    style: {
      background: '#fff',
      color: DELT.colors.ink,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    style: {
      padding: '18px 24px',
      borderBottom: `1px solid ${DELT.colors.line}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 15
    }
  }, "Agent Portal \xB7 Residuals"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 12.5,
      color: DELT.colors.indigo
    }
  }, "Commissions this month: ", React.createElement("strong", null, "$12,480"))), React.createElement("div", {
    style: {
      padding: '8px 24px 24px'
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      padding: '10px 0',
      fontFamily: DELT.font.mono,
      fontSize: 10.5,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: DELT.colors.inkMute,
      borderBottom: `1px solid ${DELT.colors.line}`
    }
  }, React.createElement("span", null, "Merchant"), React.createElement("span", null, "Funded"), React.createElement("span", null, "Factor"), React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "Residual")), rows.map(r => React.createElement("div", {
    key: r.m,
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      padding: '13px 0',
      borderBottom: `1px solid ${DELT.colors.lineSoft}`,
      fontFamily: DELT.font.body,
      fontSize: 14,
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, r.m), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono
    }
  }, r.f), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono
    }
  }, r.r), React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      textAlign: 'right',
      color: DELT.colors.indigo,
      fontWeight: 600
    }
  }, r.res)))));
}
function V1ProductTabs() {
  const mobile = useIsMobile();
  const [tab, setTab] = React.useState('Capital');
  const tabs = ['Capital', 'Payments'];
  const mockInner = tab === 'Capital' ? React.createElement(PlxTabCapital, null) : React.createElement(PlxTabPayments, null);
  const mock = React.createElement("div", {
    style: {
      width: '100%'
    }
  }, mockInner);
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: `radial-gradient(80% 100% at 50% 0%, #0A1A6E 0%, #041E42 55%, #030F26 100%)`,
      padding: mobile ? '64px 0' : '120px 0'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: mobile ? '0 20px' : '0 32px',
      textAlign: 'center'
    }
  }, React.createElement(V1Reveal, null, React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      margin: 0,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: mobile ? 32 : 72,
      letterSpacing: '-0.03em',
      lineHeight: 1.02,
      color: '#fff'
    }
  }, "Capital and payments, working together."), React.createElement("p", {
    style: {
      margin: '20px auto 0',
      fontFamily: DELT.font.body,
      fontSize: mobile ? 16 : 18,
      color: 'rgba(247,245,240,0.65)',
      maxWidth: 560
    }
  }, "Get the money you need. Keep more of every sale. That\u2019s it.")), React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 4,
      marginTop: 40,
      padding: 5,
      background: 'rgba(247,245,240,0.06)',
      borderRadius: 999,
      border: '1px solid rgba(247,245,240,0.10)'
    }
  }, tabs.map(t => React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      border: 'none',
      cursor: 'pointer',
      borderRadius: 999,
      padding: '10px 20px',
      fontFamily: DELT.font.body,
      fontSize: 14,
      fontWeight: 600,
      background: tab === t ? '#fff' : 'transparent',
      color: tab === t ? DELT.colors.ink : 'rgba(247,245,240,0.55)',
      transition: 'background .18s, color .18s'
    }
  }, t))), React.createElement("div", {
    style: {
      marginTop: 40,
      display: 'flex',
      justifyContent: 'center'
    }
  }, React.createElement("style", null, `
            @keyframes plxTabIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            .plx-tab-mock { animation: plxTabIn 220ms cubic-bezier(0.22,1,0.36,1); }
            @media (prefers-reduced-motion: reduce) { .plx-tab-mock { animation: none; } }
          `), React.createElement("div", {
    key: tab,
    className: "plx-tab-mock",
    style: {
      width: '100%',
      maxWidth: 800,
      minHeight: mobile ? 'auto' : 480,
      borderRadius: 18,
      overflow: 'hidden',
      textAlign: 'left',
      boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
      border: '1px solid rgba(247,245,240,0.10)',
      display: 'flex'
    }
  }, mock))));
}
function PlxStoryCard({
  img,
  wordmark,
  headline
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 340,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: -6,
      borderRadius: 22,
      background: 'conic-gradient(from 200deg at 50% 50%, #7DD3FC, #7C6BFF, #8B5CF6, #DBF3FF, #7DD3FC)',
      filter: 'blur(16px)',
      opacity: hover ? 0.6 : 0,
      transition: 'opacity .28s ease-out',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      overflow: 'hidden',
      borderRadius: 16,
      background: '#fff',
      border: hover ? '1px solid rgba(125,211,252,0.55)' : `1px solid ${DELT.colors.line}`,
      transition: 'border-color .28s'
    }
  }, React.createElement("img", {
    src: img,
    alt: "",
    loading: "lazy",
    style: {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center'
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(15,14,23,0.55) 0%, rgba(15,14,23,0.15) 45%, rgba(15,14,23,0) 65%)'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      top: 20,
      left: 22,
      fontFamily: DELT.font.display,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: '-0.01em',
      color: '#fff',
      textShadow: '0 2px 12px rgba(0,0,0,0.35)'
    }
  }, wordmark))), React.createElement("div", {
    style: {
      padding: '22px 2px 4px'
    }
  }, React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 22,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      color: DELT.colors.ink
    }
  }, headline), React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: DELT.font.body,
      fontSize: 15,
      fontWeight: 500,
      color: DELT.colors.indigo
    }
  }, React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 24,
      height: 24,
      borderRadius: 999,
      border: `1px solid ${DELT.colors.indigo}`,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 14 14"
  }, React.createElement("path", {
    d: "M3 7h8M8 4l3 3-3 3",
    stroke: "currentColor",
    strokeWidth: "1.6",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), "Read the story")));
}
function V1CaseStudyStrip() {
  const mobile = useIsMobile();
  const stories = [{
    img: 'app/assets/cases/01_ward.jpg',
    wordmark: 'Ward Market',
    headline: "Ward Market's CFO said: \u2018take it, I can\u2019t beat that.\u2019"
  }, {
    img: 'app/assets/cases/02_roberts.jpg',
    wordmark: 'Roberts Auto',
    headline: 'Roberts Auto: a real underwriter knew my file, not a call center.'
  }, {
    img: 'app/assets/cases/03_bloom.jpg',
    wordmark: 'Bloom Beauty',
    headline: 'Bloom Beauty grew revenue 40% on $65K of working capital.'
  }, {
    img: 'app/assets/cases/04_larosa.jpg',
    wordmark: 'La Rosa Restaurant',
    headline: 'La Rosa Restaurant closed in 19 hours — not 19 days.'
  }, {
    img: 'app/assets/cases/05_rosario.jpg',
    wordmark: 'Rosario Construction',
    headline: 'Rosario’s 3rd draw — each rate lower than the last.'
  }, {
    img: 'app/assets/cases/06_williams.jpg',
    wordmark: 'Williams Logistics',
    headline: 'Williams paid early — Delt rebated the unearned factor.'
  }];
  const loop = [...stories, ...stories];
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: '#F5F7FB',
      padding: mobile ? '64px 0' : '120px 0',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: mobile ? '0 20px' : '0 32px',
      marginBottom: mobile ? 32 : 56,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: DELT.colors.indigo,
      marginBottom: 16
    }
  }, "Operator Stories"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      margin: 0,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: mobile ? 30 : 48,
      letterSpacing: '-0.025em',
      color: DELT.colors.ink
    }
  }, "See what\u2019s possible with Delt."))), React.createElement("style", null, `
        @keyframes plxStoryScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .plx-story-track { animation: plxStoryScroll 80s linear infinite; }
        .plx-story-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .plx-story-track { animation: none; } }
      `), React.createElement("div", {
    style: {
      WebkitMaskImage: 'linear-gradient(90deg, transparent 0, black 5%, black 95%, transparent 100%)',
      maskImage: 'linear-gradient(90deg, transparent 0, black 5%, black 95%, transparent 100%)'
    }
  }, React.createElement("div", {
    className: "plx-story-track",
    style: {
      display: 'flex',
      gap: 24,
      width: 'max-content',
      padding: '4px 24px'
    }
  }, loop.map((s, i) => React.createElement(PlxStoryCard, {
    key: i,
    img: s.img,
    wordmark: s.wordmark,
    headline: s.headline
  })))));
}
function V1LeadFormSection({
  onApply
}) {
  const mobile = useIsMobile();
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    revenue: '',
    tib: '',
    phone: ''
  });
  const set = k => e => setForm(f => ({
    ...f,
    [k]: e.target.value
  }));
  const submit = e => {
    e.preventDefault();
    const rev = Number(String(form.revenue).replace(/[^\d.]/g, '')) || 0;
    const est = calcEstimate({
      revenue: rev,
      tib: form.tib,
      cards: null,
      cardSales: 0
    });
    const prefill = {
      low: est.low,
      high: est.high,
      factor: est.factor,
      ok: est.ok,
      lead: {
        firstName: form.firstName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone
      },
      calc: {
        revenue: rev,
        tib: form.tib,
        acceptsCards: null,
        cardSales: 0,
        boosted: false
      }
    };
    if (onApply) onApply(null, prefill);
  };
  const inputStyle = {
    width: '100%',
    fontFamily: DELT.font.body,
    fontSize: 15,
    color: DELT.colors.ink,
    background: '#fff',
    border: `1px solid ${DELT.colors.line}`,
    borderRadius: 8,
    padding: '12px 14px',
    outline: 'none'
  };
  const labelStyle = {
    display: 'block',
    fontFamily: DELT.font.mono,
    fontSize: 10.5,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: DELT.colors.inkMute,
    marginBottom: 7
  };
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: `radial-gradient(80% 100% at 100% 50%, #1FA9E6 0%, #1F6CB8 30%, #123A82 60%, #0B2C5C 90%, #041E42 100%)`,
      padding: mobile ? '72px 0 96px' : '140px 0 180px'
    }
  }, !mobile && React.createElement("svg", {
    "aria-hidden": true,
    viewBox: "0 0 700 700",
    width: "700",
    height: "700",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      left: -80,
      top: 40,
      opacity: 0.28,
      pointerEvents: 'none'
    }
  }, Array.from({
    length: 26
  }, (_, i) => React.createElement("path", {
    key: i,
    d: `M ${-40 + i * 4} 0 Q ${180 + i * 8} ${160 + i * 6}, ${100 + i * 6} ${380 - i * 4} T ${-20 + i * 2} 700`,
    fill: "none",
    stroke: "rgba(125,211,252,0.55)",
    strokeWidth: "0.6"
  }))), React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      maxWidth: 1200,
      margin: '0 auto',
      padding: mobile ? '0 20px' : '0 32px',
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: mobile ? 40 : 56,
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: mobile ? 44 : 88,
      letterSpacing: '-0.035em',
      lineHeight: 0.95,
      color: '#fff'
    }
  }, React.createElement("span", {
    style: {
      color: '#7DD3FC'
    }
  }, "Built for the"), React.createElement("br", null), React.createElement("span", {
    style: {
      color: '#B6E9FF'
    }
  }, "business you"), React.createElement("br", null), React.createElement("span", {
    style: {
      color: '#DBF3FF'
    }
  }, "built."))), React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: -6,
      borderRadius: 26,
      background: 'conic-gradient(from 200deg at 50% 50%, #7DD3FC, #7C6BFF, #8B5CF6, #DBF3FF, #7DD3FC)',
      filter: 'blur(14px)',
      opacity: 0.55,
      pointerEvents: 'none'
    }
  }), React.createElement("form", {
    onSubmit: submit,
    style: {
      position: 'relative',
      width: '100%',
      background: '#fff',
      borderRadius: 22,
      padding: mobile ? 28 : 40,
      boxShadow: '0 40px 80px rgba(4,30,66,0.35), 0 0 0 1px rgba(125,211,252,0.4)'
    }
  }, React.createElement("h3", {
    style: {
      margin: '0 0 24px',
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 28,
      letterSpacing: '-0.02em',
      color: DELT.colors.ink
    }
  }, "Let's get started"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: 14
    }
  }, React.createElement("div", null, React.createElement("label", {
    style: labelStyle
  }, "First name"), React.createElement("input", {
    style: inputStyle,
    value: form.firstName,
    onChange: set('firstName'),
    required: true
  })), React.createElement("div", null, React.createElement("label", {
    style: labelStyle
  }, "Last name"), React.createElement("input", {
    style: inputStyle,
    value: form.lastName,
    onChange: set('lastName')
  })), React.createElement("div", null, React.createElement("label", {
    style: labelStyle
  }, "Business email"), React.createElement("input", {
    type: "email",
    style: inputStyle,
    value: form.email,
    onChange: set('email'),
    required: true
  })), React.createElement("div", null, React.createElement("label", {
    style: labelStyle
  }, "Business name"), React.createElement("input", {
    style: inputStyle,
    value: form.businessName,
    onChange: set('businessName'),
    required: true
  })), React.createElement("div", null, React.createElement("label", {
    style: labelStyle
  }, "Monthly revenue"), React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      color: DELT.colors.inkMute,
      fontSize: 15
    }
  }, "$"), React.createElement("input", {
    inputMode: "numeric",
    style: {
      ...inputStyle,
      paddingLeft: 26
    },
    value: form.revenue,
    onChange: set('revenue'),
    placeholder: "50,000"
  }))), React.createElement("div", null, React.createElement("label", {
    style: labelStyle
  }, "Time in business"), React.createElement("select", {
    style: inputStyle,
    value: form.tib,
    onChange: set('tib'),
    required: true
  }, React.createElement("option", {
    value: "",
    disabled: true
  }, "Select\u2026"), React.createElement("option", {
    value: "<6mo"
  }, "<6 months"), React.createElement("option", {
    value: "6-12mo"
  }, "6\u201312 months"), React.createElement("option", {
    value: "1-2yr"
  }, "1\u20132 years"), React.createElement("option", {
    value: "2yr+"
  }, "2+ years"))), React.createElement("div", {
    style: {
      gridColumn: mobile ? 'auto' : '1 / -1'
    }
  }, React.createElement("label", {
    style: labelStyle
  }, "Phone (optional)"), React.createElement("input", {
    type: "tel",
    style: inputStyle,
    value: form.phone,
    onChange: set('phone')
  }))), React.createElement("p", {
    style: {
      margin: '18px 0 16px',
      fontFamily: DELT.font.body,
      fontSize: 12,
      lineHeight: 1.5,
      color: DELT.colors.inkMute
    }
  }, "By submitting, I confirm I've read Delt's Privacy Policy."), React.createElement("button", {
    type: "submit",
    style: {
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 999,
      background: 'linear-gradient(90deg, #7DD3FC 0%, #7C6BFF 100%)',
      color: '#041E42',
      padding: '14px 0',
      fontFamily: DELT.font.body,
      fontSize: 15,
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, "Talk with our team")))), React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      maxWidth: 1136,
      margin: mobile ? '48px 20px 0' : '80px auto 0',
      background: '#F0E8FF',
      borderRadius: 999,
      padding: mobile ? '14px 18px' : '18px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: mobile ? 12 : 24,
      flexWrap: 'wrap',
      boxShadow: '0 10px 32px rgba(4,30,66,0.20)'
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      display: 'inline-flex',
      width: 32,
      height: 32,
      borderRadius: 8,
      background: '#4945FF',
      color: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontFamily: DELT.font.display,
      fontWeight: 700,
      fontSize: 15
    }
  }, "\uD83D\uDD12"), React.createElement("span", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: mobile ? 13 : 15,
      color: '#041E42',
      flex: 1,
      minWidth: 200
    }
  }, "When you fund with Delt, you keep control of the deposits, the terminals, and the customer list."), React.createElement("a", {
    href: "#about",
    style: {
      fontFamily: DELT.font.body,
      fontSize: mobile ? 13 : 15,
      fontWeight: 600,
      color: '#4945FF',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Read our operator promise \xBB")));
}
Object.assign(window, {
  V1LogoMarquee,
  V1ProductGrid,
  V1IntelligentBanner,
  V1NetworkStats,
  V1ProductTabs,
  V1CaseStudyStrip,
  V1LeadFormSection
});