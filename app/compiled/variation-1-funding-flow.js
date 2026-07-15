function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState: ffUseState,
  useEffect: ffUseEffect,
  useRef: ffUseRef
} = React;
function FfIcon({
  name,
  size = 14
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
  if (name === 'doc') return React.createElement("svg", p, React.createElement("path", {
    d: "M4 1.5h6l2.5 2.5v10a1 1 0 01-1 1h-7.5a1 1 0 01-1-1v-12a1 1 0 011-1z"
  }), React.createElement("path", {
    d: "M5.5 5h3M5.5 7.5h5M5.5 10h4"
  }));
  if (name === 'bank') return React.createElement("svg", p, React.createElement("path", {
    d: "M2 13.5h12M3 13.5V7M6 13.5V7M10 13.5V7M13 13.5V7M1.5 6.5h13L8 2 1.5 6.5z"
  }));
  if (name === 'shield') return React.createElement("svg", p, React.createElement("path", {
    d: "M8 1.5l5.5 2v4.5c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7V3.5L8 1.5z"
  }), React.createElement("path", {
    d: "M5.5 8L7 9.5 10.5 6"
  }));
  if (name === 'clock') return React.createElement("svg", p, React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6"
  }), React.createElement("path", {
    d: "M8 4.5v3.5l2.2 1.4"
  }));
  if (name === 'chart') return React.createElement("svg", p, React.createElement("path", {
    d: "M2.5 13h11M3.5 13V8M6.5 13V5M9.5 13V9M12.5 13V6"
  }));
  if (name === 'users') return React.createElement("svg", p, React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "2.2"
  }), React.createElement("path", {
    d: "M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
  }), React.createElement("circle", {
    cx: "11",
    cy: "6.5",
    r: "1.8"
  }), React.createElement("path", {
    d: "M10 13c0-1.6 1.3-3 3-3"
  }));
  if (name === 'pie') return React.createElement("svg", p, React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "5.5"
  }), React.createElement("path", {
    d: "M8 2.5V8l4 4"
  }));
  if (name === 'zap') return React.createElement("svg", _extends({}, p, {
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("path", {
    d: "M9 1L3 9h4l-1 6 7-9H8l1-5z"
  }));
  if (name === 'wire') return React.createElement("svg", p, React.createElement("path", {
    d: "M2 8h11M11 5l3 3-3 3"
  }));
  if (name === 'refresh') return React.createElement("svg", p, React.createElement("path", {
    d: "M3 8a5 5 0 018.5-3.5L13 6M13 8a5 5 0 01-8.5 3.5L3 10M11 3v3h-3M5 13v-3h3"
  }));
  if (name === 'card') return React.createElement("svg", p, React.createElement("rect", {
    x: "2",
    y: "3.5",
    width: "12",
    height: "9",
    rx: "1.5"
  }), React.createElement("path", {
    d: "M2 6.5h12M5 9.5h2"
  }));
  if (name === 'trend') return React.createElement("svg", p, React.createElement("path", {
    d: "M2 11l4-4 3 3 5-5"
  }), React.createElement("path", {
    d: "M9 5h5v5"
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
  return null;
}
function FfHero({
  onApply
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
      padding: '88px 0 72px',
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
  }, "Vol. VII \xB7 Funding flow", React.createElement("span", {
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
  }, "From estimate to wire")), React.createElement("h1", {
    "data-v1-section-title": true,
    style: {
      margin: '24px 0 0',
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2.6rem, 5.4vw, 4.6rem)',
      fontWeight: 900,
      lineHeight: 1.02,
      letterSpacing: '-0.04em',
      color: '#fff',
      maxWidth: 920
    }
  }, React.createElement(V1LineMask, {
    ready: mounted,
    delay: 140,
    duration: 900
  }, "Here's how"), React.createElement(V1LineMask, {
    ready: mounted,
    delay: 250,
    duration: 900
  }, "your offer"), React.createElement(V1LineMask, {
    ready: mounted,
    delay: 360,
    duration: 900
  }, "actually", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      color: V1.blue,
      background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }, "works."))), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 18,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '32px 0 0',
      maxWidth: 600,
      ...enter(620)
    }
  }, "From the moment you submit to the moment funds clear \u2014 what happens on our side, who reads what, and how long every step actually takes."), React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      marginTop: 56,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      borderTop: '1px solid rgba(255,255,255,0.12)',
      ...enter(800)
    }
  }, [['Application', '5', 'min'], ['Approval', '24', 'hrs'], ['To wire', '24', 'h'], ['Hidden fees', '0', '$']].map(([label, value, unit], i) => React.createElement("div", {
    key: i,
    style: {
      padding: '20px 0',
      paddingLeft: i > 0 ? 24 : 0,
      borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.12)' : 'none'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.55)'
    }
  }, label), React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 4,
      fontFamily: V1.fontDisplay,
      fontSize: 32,
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: '#fff',
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1
    }
  }, React.createElement(V1CountUp, {
    value: value,
    duration: 1300,
    start: 1000 + i * 90
  }), React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: V1.blueSoft,
      marginLeft: 2
    }
  }, unit)))))));
}
function FfStepShell({
  index,
  eyebrow,
  title,
  tagline,
  body,
  bullets,
  statLabel,
  mock
}) {
  const [ref, inView] = useV1InView(0.2, '0px 0px -10% 0px');
  return React.createElement("section", {
    "data-v1-section": true,
    ref: ref,
    style: {
      padding: '88px 0',
      borderTop: index === 1 ? 'none' : `1px solid ${V1.line}`,
      background: V1.bg,
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 72,
      alignItems: 'start'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 12px',
      borderRadius: 999,
      background: `${V1.blue}10`,
      color: V1.blue,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 600ms cubic-bezier(0.22,1,0.36,1)'
    }
  }, React.createElement("span", null, "Step ", String(index).padStart(2, '0')), React.createElement("span", {
    style: {
      width: 14,
      height: 1,
      background: V1.blue
    }
  }), React.createElement("span", null, eyebrow)), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      margin: '20px 0 8px',
      fontFamily: V1.fontDisplay,
      fontSize: 48,
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: '-0.035em',
      color: V1.ink,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 120ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 120ms'
    }
  }, title), React.createElement("div", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontSize: 19,
      color: V1.blue,
      fontWeight: 400,
      marginBottom: 20,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 220ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 220ms'
    }
  }, tagline), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.6,
      color: V1.text,
      margin: '0 0 28px',
      maxWidth: 520,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 320ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 320ms'
    }
  }, body), React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, bullets.map((b, i) => React.createElement("li", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '24px 1fr',
      gap: 14,
      alignItems: 'flex-start',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-10px)',
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${480 + i * 110}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${480 + i * 110}ms`
    }
  }, React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 6,
      background: `${V1.blue}14`,
      color: V1.blue,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement(FfIcon, {
    name: b.icon,
    size: 13
  })), React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15.5,
      lineHeight: 1.55,
      color: V1.ink,
      paddingTop: 1
    }
  }, b.text)))), React.createElement("div", {
    style: {
      marginTop: 32,
      paddingTop: 22,
      borderTop: `1px solid ${V1.line}`,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted,
      opacity: inView ? 1 : 0,
      transition: `opacity 800ms cubic-bezier(0.22,1,0.36,1) ${480 + bullets.length * 110 + 200}ms`
    }
  }, statLabel)), React.createElement("div", {
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.98)',
      transition: 'opacity 900ms cubic-bezier(0.22,1,0.36,1) 280ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 280ms'
    }
  }, mock(inView)))));
}
function FfMock1({
  active
}) {
  const [filled, setFilled] = ffUseState(0);
  ffUseEffect(() => {
    if (!active) return;
    const fields = 4;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setFilled(i);
      if (i >= fields) clearInterval(id);
    }, 480);
    return () => clearInterval(id);
  }, [active]);
  const rows = [{
    label: 'Legal business name',
    value: 'La Rosa Restaurant LLC'
  }, {
    label: 'EIN / Tax ID',
    value: '83-1429•••'
  }, {
    label: 'Average monthly revenue',
    value: '$48,200'
  }, {
    label: 'Time in business',
    value: '4 years'
  }];
  return React.createElement("div", {
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 18,
      padding: 24,
      position: 'relative',
      boxShadow: '0 30px 60px -36px rgba(4,30,66,0.30)'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 14,
      borderBottom: `1px solid ${V1.line}`,
      marginBottom: 18
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
  }, "Step 01 \xB7 Application"), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: filled >= 4 ? V1.green : V1.muted,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      transition: 'color 220ms'
    }
  }, filled >= 4 ? '● Soft-pull received' : '○ Filling fields…')), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, rows.map((r, i) => {
    const done = filled > i;
    const active = filled === i;
    return React.createElement("div", {
      key: i,
      style: {
        padding: '12px 0',
        borderBottom: i < rows.length - 1 ? `1px solid ${V1.line}` : 'none'
      }
    }, React.createElement("div", {
      style: {
        fontFamily: V1.fontMono,
        fontSize: 9.5,
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: V1.muted
      }
    }, r.label), React.createElement("div", {
      style: {
        marginTop: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 22,
        fontFamily: V1.fontBody,
        fontSize: 15,
        color: V1.ink,
        fontWeight: 500
      }
    }, React.createElement("span", {
      style: {
        opacity: done ? 1 : 0,
        transform: done ? 'translateX(0)' : 'translateX(-4px)',
        transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)'
      }
    }, r.value), active && React.createElement("span", {
      style: {
        width: 1.5,
        height: 16,
        background: V1.blue,
        animation: 'ffCaret 760ms steps(2, end) infinite'
      }
    }), done && React.createElement("span", {
      style: {
        marginLeft: 'auto',
        color: V1.green
      }
    }, React.createElement(FfIcon, {
      name: "check",
      size: 13
    }))));
  })), React.createElement("style", null, `@keyframes ffCaret { 50% { opacity: 0 } }`));
}
function FfMock2({
  active
}) {
  const [phase, setPhase] = ffUseState('idle');
  ffUseEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setPhase('drawing'), 200);
    const t2 = setTimeout(() => setPhase('reviewing'), 1700);
    const t3 = setTimeout(() => setPhase('approved'), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);
  const drawing = phase !== 'idle';
  const approved = phase === 'approved';
  const bars = [42, 58, 51, 67, 72, 49, 80, 76, 64, 88, 71, 90];
  return React.createElement("div", {
    style: {
      background: V1.ink,
      color: '#fff',
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 18,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 60px -36px rgba(4,30,66,0.45)'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -120,
      right: -100,
      width: 320,
      height: 320,
      background: `radial-gradient(circle, ${V1.blue}26 0%, transparent 65%)`,
      filter: 'blur(20px)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 14,
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      marginBottom: 22,
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Step 02 \xB7 Underwriting"), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: approved ? '#4ADE80' : V1.blueSoft,
      transition: 'color 220ms',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, phase === 'idle' && 'Awaiting bank link', phase === 'drawing' && '◉ Reading deposits…', phase === 'reviewing' && '◉ Running model…', approved && '✓ Approved')), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.45)',
      marginBottom: 8,
      position: 'relative',
      zIndex: 1
    }
  }, "90-day deposits \xB7 weekly"), React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: `repeat(${bars.length}, 1fr)`,
      gap: 6,
      alignItems: 'flex-end',
      height: 110,
      marginBottom: 12
    }
  }, bars.map((h, i) => React.createElement("div", {
    key: i,
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'flex-end'
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      height: drawing ? `${h}%` : '0%',
      background: `linear-gradient(180deg, ${V1.blue} 0%, #818CF8 100%)`,
      borderRadius: '2px 2px 0 0',
      transition: `height 800ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms`,
      boxShadow: `0 0 10px ${V1.blue}55`
    }
  })))), React.createElement("div", {
    style: {
      height: 1,
      background: 'rgba(255,255,255,0.12)',
      position: 'relative',
      zIndex: 1
    }
  }), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      marginTop: 18,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 14,
      position: 'relative',
      zIndex: 1
    }
  }, [['Avg. balance', '$28,410'], ['Neg. days', '0'], ['Mo. deposits', '$104K']].map(([k, v], i) => React.createElement("div", {
    key: k,
    style: {
      opacity: drawing ? 1 : 0,
      transform: drawing ? 'translateY(0)' : 'translateY(6px)',
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${800 + i * 110}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${800 + i * 110}ms`
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.5)'
    }
  }, k), React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '-0.015em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)))), approved && React.createElement("div", {
    style: {
      marginTop: 22,
      padding: '14px 16px',
      background: 'rgba(31,132,90,0.18)',
      border: '1px solid rgba(31,132,90,0.4)',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      animation: 'ffPanel 480ms cubic-bezier(0.22, 1, 0.36, 1) both',
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: '#1F845A',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement(FfIcon, {
    name: "check",
    size: 14
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 14,
      fontWeight: 700,
      color: '#fff'
    }
  }, "Approved \xB7 $24,000\u2013$32,000 at 1.18\xD7"), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.65)',
      marginTop: 3
    }
  }, "Reviewed by Robert K. \xB7 Underwriter"))), React.createElement("style", null, `@keyframes ffPanel { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }`));
}
function FfMock3({
  active
}) {
  const [pct, setPct] = ffUseState(0);
  const [phase, setPhase] = ffUseState('idle');
  ffUseEffect(() => {
    if (!active) return;
    const start = setTimeout(() => {
      setPhase('sending');
    }, 200);
    return () => clearTimeout(start);
  }, [active]);
  ffUseEffect(() => {
    if (phase !== 'sending') return;
    const id = setInterval(() => {
      setPct(p => {
        const next = Math.min(100, p + 2.4 + Math.random() * 1.6);
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setPhase('cleared'), 280);
        }
        return next;
      });
    }, 60);
    return () => clearInterval(id);
  }, [phase]);
  const cleared = phase === 'cleared';
  return React.createElement("div", {
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 18,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 60px -36px rgba(4,30,66,0.30)'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 14,
      borderBottom: `1px solid ${V1.line}`,
      marginBottom: 18
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
  }, "Step 03 \xB7 Wire"), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: cleared ? V1.green : V1.blue
    }
  }, phase === 'idle' && 'Pending sign', phase === 'sending' && '◉ Sending…', cleared && '✓ Cleared')), React.createElement("div", {
    style: {
      position: 'relative',
      padding: '24px 8px 8px'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative'
    }
  }, [{
    l: 'Delt',
    k: 'd'
  }, {
    l: 'Wire network',
    k: 'w'
  }, {
    l: 'Your bank',
    k: 'b'
  }].map((n, i) => React.createElement("div", {
    key: n.k,
    style: {
      textAlign: 'center',
      position: 'relative',
      zIndex: 2
    }
  }, React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 999,
      background: '#fff',
      border: `2px solid ${cleared ? V1.green : V1.blue}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: cleared ? V1.green : V1.blue,
      boxShadow: cleared ? `0 0 0 4px ${V1.green}22` : `0 0 0 4px ${V1.blue}1a`,
      transition: 'border-color 320ms, color 320ms, box-shadow 320ms'
    }
  }, React.createElement(FfIcon, {
    name: i === 0 ? 'dollar' : i === 1 ? 'wire' : 'bank',
    size: 18
  })), React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, n.l))), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: 22,
      left: 22,
      right: 22,
      height: 2,
      background: V1.line,
      borderRadius: 999
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: 22,
      left: 22,
      height: 2,
      width: `calc((100% - 44px) * ${pct / 100})`,
      background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
      borderRadius: 999,
      transition: 'width 80ms linear',
      boxShadow: `0 0 8px ${V1.blue}aa`
    }
  }), phase === 'sending' && React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: 18,
      left: `calc(22px + (100% - 44px) * ${pct / 100} - 5px)`,
      width: 10,
      height: 10,
      borderRadius: 999,
      background: V1.blue,
      boxShadow: `0 0 12px ${V1.blue}`,
      transition: 'left 80ms linear'
    }
  }))), React.createElement("div", {
    style: {
      marginTop: 22,
      padding: '14px 16px',
      background: V1.bg,
      border: `1px solid ${V1.line}`,
      borderRadius: 10
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, "Funding amount"), React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: V1.ink,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$28,000")), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: cleared ? V1.green : V1.muted,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: cleared ? V1.green : V1.muted
    }
  }), cleared ? 'Funds available' : `${Math.floor(pct)}% sent`))), React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement(FfIcon, {
    name: "clock",
    size: 11
  }), cleared ? 'Cleared in 19h 14m · Wire trace #DELT-7421' : 'Median time: 19h 14m'));
}
function FfCta({
  onApply,
  onCalc
}) {
  const [ref, inView] = useV1InView(0.2, '0px 0px -10% 0px');
  const [hover, setHover] = ffUseState(false);
  return React.createElement("section", {
    "data-v1-section": true,
    ref: ref,
    style: {
      background: V1.ink,
      color: '#fff',
      padding: '88px 0 96px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -240,
      left: -200,
      width: 620,
      height: 620,
      background: `radial-gradient(circle, ${V1.blue}26 0%, transparent 60%)`,
      filter: 'blur(28px)',
      pointerEvents: 'none',
      opacity: inView ? 1 : 0,
      transition: 'opacity 1400ms ease-out 100ms'
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '0 40px',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)'
    }
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "Now you know")), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      margin: '20px 0 0',
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: '-0.035em',
      color: '#fff',
      maxWidth: 740
    }
  }, React.createElement(V1LineMask, {
    ready: inView,
    delay: 120
  }, "Five minutes in,"), React.createElement(V1LineMask, {
    ready: inView,
    delay: 230
  }, "twenty-four hours out.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 17,
      lineHeight: 1.6,
      color: 'rgba(255,255,255,0.72)',
      margin: '24px 0 36px',
      maxWidth: 540,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 380ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 380ms'
    }
  }, "A real range, a real underwriter, and a wire that actually clears the same day. No call centers, no broker layers, no junk fees."), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      flexWrap: 'wrap',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 520ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 520ms'
    }
  }, React.createElement("button", {
    onClick: onApply,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      background: V1.blue,
      color: '#fff',
      border: 'none',
      padding: '16px 28px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '-0.005em',
      boxShadow: hover ? `0 12px 28px -10px ${V1.blue}cc, 0 2px 6px ${V1.blue}44` : `0 6px 18px -8px ${V1.blue}aa`,
      transform: hover ? 'translateY(-1px)' : 'translateY(0)',
      transition: 'box-shadow 240ms, transform 240ms'
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
      transform: hover ? 'translateX(120%)' : 'translateX(-120%)',
      transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)'
    }
  }), "Get my offer", React.createElement("span", {
    style: {
      transform: hover ? 'translateX(3px)' : 'translateX(0)',
      transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
      display: 'inline-flex'
    }
  }, React.createElement(FfIcon, {
    name: "arr",
    size: 14
  }))), React.createElement("button", {
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
  }, "\u2190 Back to calculator"))));
}
function V1FundingFlowPage({
  accent,
  onApply,
  onCalc
}) {
  return React.createElement("main", null, React.createElement(FfHero, {
    onApply: onApply
  }), React.createElement(FfStepShell, {
    index: 1,
    eyebrow: "Quick application",
    title: "Quick application.",
    tagline: "Simple. Fast. No credit impact.",
    body: "Start with a streamlined application that takes just minutes to complete. Basic business details, secure bank link via Plaid \u2014 no hard pulls, no paperwork, no waiting.",
    bullets: [{
      icon: 'doc',
      text: 'Online application in under 5 minutes'
    }, {
      icon: 'bank',
      text: 'Secure Plaid bank connection — no statements to upload'
    }, {
      icon: 'shield',
      text: 'Soft credit check only — no impact to your score'
    }, {
      icon: 'clock',
      text: 'Instant confirmation that your application is received'
    }],
    statLabel: "Average application time \xB7 5 minutes",
    mock: active => React.createElement(FfMock1, {
      active: active
    })
  }), React.createElement(FfStepShell, {
    index: 2,
    eyebrow: "Review & approval",
    title: "Reviewed by humans.",
    tagline: "Revenue-based. Transparent. Same-day.",
    body: "Our underwriting desk reads your revenue patterns \u2014 not just your credit score. We look at real deposit flow, balance stability, and trailing cash position to size the offer. One factor rate, one page, no hidden fees.",
    bullets: [{
      icon: 'chart',
      text: 'Revenue-based underwriting — we focus on cash flow'
    }, {
      icon: 'users',
      text: 'Dedicated funding specialist assigned to your file'
    }, {
      icon: 'pie',
      text: 'Transparent pricing — one factor rate, no compounding'
    }, {
      icon: 'zap',
      text: 'Most files approved within hours, not weeks'
    }],
    statLabel: "Average approval time \xB7 24 hours",
    mock: active => React.createElement(FfMock2, {
      active: active
    })
  }), React.createElement(FfStepShell, {
    index: 3,
    eyebrow: "Get funded & grow",
    title: "Funds in your account.",
    tagline: "Wired same-day. Repayment that flexes with you.",
    body: "Once you counter-sign, funds wire directly to your operating account \u2014 often the same business day. Repayment is revenue-based and adjusts with your sales cycle. No collateral, no guarantees beyond the standard, no prepayment penalty.",
    bullets: [{
      icon: 'wire',
      text: 'Wire or ACH to your operating account — your choice'
    }, {
      icon: 'refresh',
      text: 'Revenue-based repayment that adjusts with your sales'
    }, {
      icon: 'card',
      text: 'No collateral, no personal guarantees beyond standard'
    }, {
      icon: 'trend',
      text: 'Renew for additional capital as your business grows'
    }],
    statLabel: "Hidden fees or surprises \xB7 $0",
    mock: active => React.createElement(FfMock3, {
      active: active
    })
  }), React.createElement(FfCta, {
    onApply: onApply,
    onCalc: onCalc
  }));
}
Object.assign(window, {
  V1FundingFlowPage
});