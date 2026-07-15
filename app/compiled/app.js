const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;
function DeltCalculator({
  compact = false,
  onApply,
  themeAccent = DELT.colors.indigo,
  calcState,
  setCalcState
}) {
  const c = calcState,
    set = setCalcState;
  const est = calcEstimate(c);
  const revenueDisplay = c.revenue ? c.revenue.toLocaleString() : '';
  const handleRev = raw => {
    const digits = raw.replace(/[^0-9]/g, '');
    const n = Math.min(parseInt(digits || '0', 10), 500000);
    set({
      ...c,
      revenue: n
    });
  };
  const tibOpts = [{
    v: '<6mo',
    l: '< 6 mo'
  }, {
    v: '6-12mo',
    l: '6–12 mo'
  }, {
    v: '1-2yr',
    l: '1–2 yr'
  }, {
    v: '2yr+',
    l: '2+ yr'
  }];
  const fieldStyle = {
    width: '100%',
    padding: '11px 12px',
    background: DELT.colors.paper,
    border: `1px solid ${DELT.colors.line}`,
    borderRadius: 6,
    fontFamily: DELT.font.body,
    fontSize: 15,
    color: DELT.colors.ink,
    fontVariantNumeric: 'tabular-nums',
    outline: 'none',
    transition: 'border-color .15s, box-shadow .15s'
  };
  return React.createElement("div", {
    style: {
      background: DELT.colors.card,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      padding: compact ? 20 : 28,
      fontFamily: DELT.font.body
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
      gap: compact ? 16 : 32
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, React.createElement("div", null, React.createElement("label", {
    style: lblStyle
  }, "Monthly revenue"), React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      color: DELT.colors.inkMute,
      fontSize: 15
    }
  }, "$"), React.createElement("input", {
    type: "text",
    inputMode: "numeric",
    placeholder: "25,000",
    value: revenueDisplay,
    onChange: e => handleRev(e.target.value),
    onFocus: e => {
      e.target.style.borderColor = themeAccent;
      e.target.style.boxShadow = `0 0 0 3px ${themeAccent}1A`;
    },
    onBlur: e => {
      e.target.style.borderColor = DELT.colors.line;
      e.target.style.boxShadow = 'none';
    },
    style: {
      ...fieldStyle,
      paddingLeft: 24
    }
  }))), React.createElement("div", null, React.createElement("label", {
    style: lblStyle
  }, "Time in business"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 6
    }
  }, tibOpts.map(o => {
    const active = c.tib === o.v;
    return React.createElement("button", {
      key: o.v,
      onClick: () => set({
        ...c,
        tib: o.v
      }),
      style: {
        padding: '9px 4px',
        fontSize: 12.5,
        fontWeight: 500,
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily: DELT.font.body,
        border: `1px solid ${active ? themeAccent : DELT.colors.line}`,
        background: active ? `${themeAccent}0D` : DELT.colors.paper,
        color: active ? themeAccent : DELT.colors.inkSoft
      }
    }, o.l);
  }))), React.createElement("div", null, React.createElement("label", {
    style: lblStyle
  }, "Accepts card payments?"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 6
    }
  }, [{
    v: true,
    l: 'Yes'
  }, {
    v: false,
    l: 'No'
  }].map(o => {
    const active = c.cards === o.v;
    return React.createElement("button", {
      key: String(o.v),
      onClick: () => set({
        ...c,
        cards: o.v,
        cardSales: o.v ? c.cardSales : 0
      }),
      style: {
        padding: '9px 4px',
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily: DELT.font.body,
        border: `1px solid ${active ? themeAccent : DELT.colors.line}`,
        background: active ? `${themeAccent}0D` : DELT.colors.paper,
        color: active ? themeAccent : DELT.colors.inkSoft
      }
    }, o.l);
  }))), c.cards && React.createElement("div", null, React.createElement("label", {
    style: lblStyle
  }, "Monthly card sales"), React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      color: DELT.colors.inkMute,
      fontSize: 15
    }
  }, "$"), React.createElement("input", {
    type: "text",
    inputMode: "numeric",
    placeholder: "8,500",
    value: c.cardSales ? c.cardSales.toLocaleString() : '',
    onChange: e => {
      const digits = e.target.value.replace(/[^0-9]/g, '');
      set({
        ...c,
        cardSales: Math.min(parseInt(digits || '0', 10), 250000)
      });
    },
    style: {
      ...fieldStyle,
      paddingLeft: 24
    }
  }))))), React.createElement("div", {
    style: {
      background: DELT.colors.paper,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 8,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: compact ? 180 : 240
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute,
      marginBottom: 6
    }
  }, "Estimated offer"), est.ok ? React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      fontSize: compact ? 32 : 40,
      fontWeight: 600,
      fontFamily: DELT.font.display,
      letterSpacing: '-0.02em',
      color: DELT.colors.ink,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, fmt(est.low), React.createElement("span", {
    style: {
      color: DELT.colors.inkMute,
      margin: '0 4px'
    }
  }, "\u2013"), fmt(est.high)), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      marginTop: 12,
      fontSize: 12.5,
      fontFamily: DELT.font.body
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      color: DELT.colors.inkMute,
      fontSize: 10.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Factor"), React.createElement("div", {
    style: {
      color: DELT.colors.ink,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, est.factor.toFixed(2), "\xD7")), React.createElement("div", null, React.createElement("div", {
    style: {
      color: DELT.colors.inkMute,
      fontSize: 10.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Term"), React.createElement("div", {
    style: {
      color: DELT.colors.ink,
      fontWeight: 600
    }
  }, "4\u201310 mo")), React.createElement("div", null, React.createElement("div", {
    style: {
      color: DELT.colors.inkMute,
      fontSize: 10.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Fund"), React.createElement("div", {
    style: {
      color: DELT.colors.ink,
      fontWeight: 600
    }
  }, "~24 hr")))) : est.early ? React.createElement("div", {
    style: {
      color: DELT.colors.inkMute,
      fontSize: 13.5,
      lineHeight: 1.5,
      marginTop: 4
    }
  }, "Under 6 months in business \u2014 we can still help via our launch program. Talk to a specialist.") : React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: compact ? 32 : 40,
      fontWeight: 600,
      fontFamily: DELT.font.display,
      color: DELT.colors.line,
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, "$0", React.createElement("span", {
    style: {
      margin: '0 4px'
    }
  }, "\u2013"), "$0"), React.createElement("div", {
    style: {
      color: DELT.colors.inkMute,
      fontSize: 12.5,
      marginTop: 10
    }
  }, "Enter revenue and time in business."))), React.createElement(Btn, {
    variant: "indigo",
    size: "md",
    onClick: () => onApply?.(c, est),
    style: {
      marginTop: 16,
      width: '100%',
      justifyContent: 'center',
      background: themeAccent,
      borderColor: themeAccent
    }
  }, est.ok ? 'Continue →' : 'Continue'))));
}
const lblStyle = {
  display: 'block',
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: DELT.colors.inkMute,
  marginBottom: 6,
  fontFamily: DELT.font.body
};
function StatsStrip({
  align = 'row',
  accent = DELT.colors.indigo
}) {
  return React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      background: DELT.colors.card
    }
  }, DeltContent.stats.map((s, i) => React.createElement("div", {
    key: s.l,
    style: {
      padding: '22px 24px',
      borderLeft: i === 0 ? 'none' : `1px solid ${DELT.colors.lineSoft}`
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontWeight: 600,
      fontSize: 30,
      letterSpacing: '-0.02em',
      color: DELT.colors.ink,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.v), React.createElement("div", {
    style: {
      fontSize: 12,
      color: DELT.colors.inkMute,
      marginTop: 8,
      fontFamily: DELT.font.body
    }
  }, s.l))));
}
function CompareSection({
  accent = DELT.colors.indigo
}) {
  return React.createElement("section", {
    style: {
      background: DELT.colors.paper
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '80px 32px'
    }
  }, React.createElement(SectionLabel, {
    accent: accent
  }, "Comparison"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'start',
      marginBottom: 40
    }
  }, React.createElement("h2", {
    style: h2Style
  }, "Delt vs. a traditional lender.", React.createElement("br", null), "On the numbers that matter."), React.createElement("p", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 15,
      lineHeight: 1.6,
      color: DELT.colors.inkSoft,
      marginTop: 8
    }
  }, "Every row is a median across the last 12 months of Delt fundings, measured against publicly-reported bank SBA 7(a) averages. We update quarterly.")), React.createElement("div", {
    style: {
      background: DELT.colors.card,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1.3fr 1.3fr',
      padding: '14px 28px',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute,
      background: DELT.colors.paperWarm,
      borderBottom: `1px solid ${DELT.colors.line}`,
      fontFamily: DELT.font.body
    }
  }, React.createElement("div", null), React.createElement("div", null, "Delt"), React.createElement("div", null, "Traditional")), DeltContent.compare.map((row, i) => React.createElement("div", {
    key: row.k,
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1.3fr 1.3fr',
      alignItems: 'center',
      padding: '18px 28px',
      borderBottom: i === DeltContent.compare.length - 1 ? 'none' : `1px solid ${DELT.colors.lineSoft}`,
      fontFamily: DELT.font.body
    }
  }, React.createElement("div", {
    style: {
      fontSize: 14.5,
      color: DELT.colors.ink,
      fontWeight: 500
    }
  }, row.k), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: DELT.colors.ink,
      fontWeight: 500
    }
  }, React.createElement(Tick, {
    c: accent
  }), React.createElement("span", null, row.delt)), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: DELT.colors.inkMute
    }
  }, React.createElement(Ex, null), React.createElement("span", null, row.bank)))))));
}
function StepsSection({
  accent = DELT.colors.indigo
}) {
  return React.createElement("section", {
    style: {
      background: DELT.colors.paperWarm
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '80px 32px'
    }
  }, React.createElement(SectionLabel, {
    accent: accent
  }, "How it works"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'start',
      marginBottom: 48
    }
  }, React.createElement("h2", {
    style: h2Style
  }, "Four steps. One business day."), React.createElement("p", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 15,
      lineHeight: 1.6,
      color: DELT.colors.inkSoft,
      marginTop: 8
    }
  }, "No sales advisor, no discovery call, no underwriter asking for \"just one more statement\". We read your deposits, price the deal, send an offer.")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, DeltContent.steps.map((s, i) => React.createElement("div", {
    key: s.n,
    style: {
      background: DELT.colors.card,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      padding: '24px 22px',
      position: 'relative',
      minHeight: 200
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 13,
      color: accent,
      fontWeight: 500
    }
  }, s.n), React.createElement("span", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 11,
      color: DELT.colors.inkMute,
      letterSpacing: '0.06em'
    }
  }, s.time)), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 19,
      fontWeight: 600,
      color: DELT.colors.ink,
      marginTop: 18,
      letterSpacing: '-0.01em'
    }
  }, s.t), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13.5,
      lineHeight: 1.55,
      color: DELT.colors.inkSoft,
      marginTop: 8
    }
  }, s.d))))));
}
function ReviewsSection({
  accent = DELT.colors.indigo
}) {
  return React.createElement("section", {
    style: {
      background: DELT.colors.paper
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '80px 32px'
    }
  }, React.createElement(SectionLabel, {
    accent: accent
  }, "Operators"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      marginBottom: 40
    }
  }, React.createElement("h2", {
    style: h2Style
  }, "What funded operators tell us."), React.createElement("p", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 15,
      lineHeight: 1.6,
      color: DELT.colors.inkSoft,
      marginTop: 8
    }
  }, "Verified. Every quote is from a borrower who has closed at least once. The business names are real, on request.")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, DeltContent.testimonials.map((t, i) => React.createElement("figure", {
    key: i,
    style: {
      background: DELT.colors.card,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      padding: 24,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("blockquote", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 18,
      lineHeight: 1.4,
      color: DELT.colors.ink,
      letterSpacing: '-0.01em',
      margin: 0,
      fontWeight: 500
    }
  }, "\"", t.q, "\""), React.createElement("figcaption", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      color: DELT.colors.inkMute,
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      borderTop: `1px solid ${DELT.colors.lineSoft}`,
      paddingTop: 14
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      color: DELT.colors.ink,
      fontWeight: 500
    }
  }, t.n), React.createElement("div", null, t.b)), React.createElement("div", {
    style: {
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  }, React.createElement("div", {
    style: {
      color: accent,
      fontWeight: 600
    }
  }, t.f), React.createElement("div", null, t.r))))))));
}
function FAQSection({
  accent = DELT.colors.indigo
}) {
  const [open, setOpen] = useState(0);
  return React.createElement("section", {
    style: {
      background: DELT.colors.paperWarm
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 920,
      margin: '0 auto',
      padding: '80px 32px'
    }
  }, React.createElement(SectionLabel, {
    accent: accent
  }, "Questions"), React.createElement("h2", {
    style: {
      ...h2Style,
      marginBottom: 40
    }
  }, "What operators actually ask."), React.createElement("div", {
    style: {
      borderTop: `1px solid ${DELT.colors.line}`
    }
  }, DeltContent.faq.map((f, i) => React.createElement("div", {
    key: i,
    style: {
      borderBottom: `1px solid ${DELT.colors.line}`
    }
  }, React.createElement("button", {
    onClick: () => setOpen(open === i ? -1 : i),
    style: {
      width: '100%',
      padding: '20px 0',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 24,
      textAlign: 'left',
      fontFamily: DELT.font.display,
      fontSize: 17,
      fontWeight: 500,
      color: DELT.colors.ink,
      letterSpacing: '-0.005em'
    }
  }, f.q, React.createElement("span", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 18,
      color: accent,
      flexShrink: 0,
      transform: open === i ? 'rotate(45deg)' : 'none',
      transition: 'transform .2s'
    }
  }, "+")), open === i && React.createElement("div", {
    style: {
      paddingBottom: 20,
      fontFamily: DELT.font.body,
      fontSize: 14.5,
      lineHeight: 1.65,
      color: DELT.colors.inkSoft,
      maxWidth: 720
    }
  }, f.a))))));
}
function FooterBlock({
  accent = DELT.colors.indigo,
  brand,
  onNav
}) {
  useLang();
  const handle = k => e => {
    if (k && onNav) {
      e.preventDefault();
      onNav(k);
    }
  };
  const columns = [{
    h: t('foot.col.product'),
    links: [{
      k: 'calc',
      l: t('foot.link.calc')
    }, {
      k: 'how',
      l: t('foot.link.how')
    }, {
      k: 'processing',
      l: t('foot.link.proc')
    }]
  }, {
    h: t('foot.col.company'),
    links: [{
      k: 'about',
      l: t('foot.link.about')
    }, {
      k: 'reviews',
      l: t('foot.link.reviews')
    }]
  }, {
    h: t('foot.col.res'),
    links: [{
      k: 'faq',
      l: t('foot.link.faq')
    }, {
      k: 'blog',
      l: t('foot.link.blog')
    }, {
      k: 'support',
      l: t('foot.link.support')
    }]
  }];
  const legalLinks = [{
    k: 'terms',
    l: t('foot.terms')
  }, {
    k: 'privacy',
    l: t('foot.privacy')
  }, {
    k: 'eca',
    l: t('foot.eca')
  }];
  return React.createElement("footer", {
    style: {
      background: DELT.colors.ink,
      color: '#E9E7DF',
      padding: '64px 32px 40px'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, React.createElement("div", {
    "data-v1-grid-4col": true,
    "data-v1-footer-grid": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: 48,
      marginBottom: 56
    }
  }, React.createElement("div", null, brand, React.createElement("p", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13.5,
      lineHeight: 1.6,
      color: '#9E9BA8',
      marginTop: 16,
      maxWidth: 300
    }
  }, t('foot.tagline'))), columns.map(col => React.createElement("div", {
    key: col.h
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#6A6876',
      marginBottom: 18
    }
  }, col.h), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, col.links.map(ln => React.createElement("a", {
    key: ln.k,
    onClick: handle(ln.k),
    style: {
      fontFamily: DELT.font.body,
      fontSize: 14,
      color: '#E9E7DF',
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }, ln.l)))))), React.createElement("div", {
    style: {
      paddingTop: 28,
      borderTop: '1px solid #2B2A35',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap',
      fontFamily: DELT.font.body,
      fontSize: 12,
      color: '#6A6876'
    }
  }, React.createElement("span", null, t('foot.legal')), React.createElement("span", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, legalLinks.map(ln => React.createElement("a", {
    key: ln.k,
    onClick: handle(ln.k),
    style: {
      color: '#9E9BA8',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 180ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = '#E9E7DF';
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = '#9E9BA8';
    }
  }, ln.l)), React.createElement("a", {
    onClick: e => {
      e.preventDefault();
      if (window.DeltConsent) window.DeltConsent.open();
    },
    style: {
      color: '#9E9BA8',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 180ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = '#E9E7DF';
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = '#9E9BA8';
    }
  }, t('foot.cookies'))))));
}
function SectionLabel({
  children,
  accent
}) {
  return React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: DELT.font.body,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: accent,
      marginBottom: 20
    }
  }, React.createElement("span", {
    style: {
      width: 20,
      height: 1,
      background: accent
    }
  }), children);
}
const h2Style = {
  fontFamily: DELT.font.display,
  fontSize: 36,
  fontWeight: 600,
  letterSpacing: '-0.025em',
  color: DELT.colors.ink,
  lineHeight: 1.1,
  margin: 0
};
function AboutPage({
  accent
}) {
  return React.createElement("div", {
    style: {
      background: DELT.colors.paper
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 880,
      margin: '0 auto',
      padding: '88px 32px 48px'
    }
  }, React.createElement(SectionLabel, {
    accent: accent
  }, "About"), React.createElement("h1", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 56,
      fontWeight: 600,
      letterSpacing: '-0.035em',
      color: DELT.colors.ink,
      lineHeight: 1.05,
      margin: 0
    }
  }, "We under\xADwrite businesses the way your CFO would \u2014 by reading deposits, not pulling credit reports."), React.createElement("p", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 18,
      lineHeight: 1.6,
      color: DELT.colors.inkSoft,
      marginTop: 28,
      maxWidth: 680
    }
  }, "Delt was founded in 2019 by two operators who got quoted 1.48\xD7 on an inventory-buy advance and decided the MCA market needed a direct lender that didn't hide behind broker layers.")), React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 32px 96px'
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 1,
      background: DELT.colors.line,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      overflow: 'hidden'
    }
  }, [{
    h: 'Direct capital',
    t: 'We lend off our own balance sheet. No broker points, no middleman markup, no "we\'ll shop you around."'
  }, {
    h: 'Revenue-based',
    t: 'We underwrite 90 days of deposits via Plaid. Your FICO is a check, not the decision.'
  }, {
    h: 'Flat pricing',
    t: 'One factor rate. No origination fee, no "processing fee," no ACH fees. The number you see is the number you pay.'
  }, {
    h: 'Early-pay rebates',
    t: 'Pay off early and we return the unearned factor pro-rata. The industry standard — owe the full factor — is a tax on success.'
  }, {
    h: 'No prepayment penalties',
    t: 'Ever. On any product. Written into every contract on page one.'
  }, {
    h: 'In-house underwriting',
    t: 'Two-person underwriting desk. Your file is read by a human who has authority to price it.'
  }].map(v => React.createElement("div", {
    key: v.h,
    style: {
      background: DELT.colors.card,
      padding: 28
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 18,
      fontWeight: 600,
      color: DELT.colors.ink,
      letterSpacing: '-0.01em'
    }
  }, v.h), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13.5,
      lineHeight: 1.6,
      color: DELT.colors.inkSoft,
      marginTop: 10
    }
  }, v.t))))));
}
function HowItWorksPage({
  accent,
  onApply
}) {
  const steps = [{
    n: '01',
    t: 'Get Funded',
    d: 'Three fields on the calculator — revenue, time in business, card processor. We return a funded-range estimate and a factor rate in under a minute. Soft-pull only; no impact to your business credit.',
    time: '< 1 minute',
    doc: 'No statements, no tax returns.'
  }, {
    n: '02',
    t: 'Connect bank',
    d: 'Plaid read-only link to your primary operating account. We analyze 90 days of deposits, average daily balances, and negative-day frequency. This replaces the statement-review step other lenders drag out for weeks.',
    time: '~ 2 minutes',
    doc: 'Plaid. Read-only.'
  }, {
    n: '03',
    t: 'Receive offer',
    d: 'One page. Amount, factor rate, term, daily or weekly debit size, total repayment, full amortization schedule. No other fees. Sign it or send it to your CFO — no "advisor" to route around.',
    time: 'Same day',
    doc: 'Single PDF. No addenda.'
  }, {
    n: '04',
    t: 'Fund',
    d: 'Wire or ACH to your operating account. Wire before 2 pm ET clears same-day; ACH next business day. Funds are yours — no restricted accounts, no controlled disbursements.',
    time: '24 hours',
    doc: 'Wire or ACH. Your choice.'
  }];
  return React.createElement("div", {
    style: {
      background: DELT.colors.paper
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '72px 32px 48px'
    }
  }, React.createElement(SectionLabel, {
    accent: accent
  }, "How it works"), React.createElement("h1", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 54,
      fontWeight: 600,
      letterSpacing: '-0.035em',
      color: DELT.colors.ink,
      lineHeight: 1.05,
      margin: 0,
      maxWidth: 800
    }
  }, "From first click to funded wire. One business day, every time.")), React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 32px 64px'
    }
  }, steps.map((s, i) => React.createElement("div", {
    key: s.n,
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr 200px',
      gap: 48,
      alignItems: 'start',
      padding: '36px 0',
      borderTop: `1px solid ${DELT.colors.line}`
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 14,
      color: accent,
      fontWeight: 500,
      paddingTop: 4
    }
  }, s.n), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 26,
      fontWeight: 600,
      color: DELT.colors.ink,
      letterSpacing: '-0.02em',
      marginBottom: 8
    }
  }, s.t), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 15.5,
      lineHeight: 1.6,
      color: DELT.colors.inkSoft,
      maxWidth: 620
    }
  }, s.d)), React.createElement("div", {
    style: {
      borderLeft: `1px solid ${DELT.colors.line}`,
      paddingLeft: 20,
      paddingTop: 4
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute,
      marginBottom: 4
    }
  }, "Elapsed"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 15,
      color: DELT.colors.ink,
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.time), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      color: DELT.colors.inkMute,
      marginTop: 10
    }
  }, s.doc)))), React.createElement("div", {
    style: {
      borderTop: `1px solid ${DELT.colors.line}`,
      paddingTop: 40,
      marginTop: 8
    }
  }, React.createElement(Btn, {
    variant: "indigo",
    size: "lg",
    onClick: onApply,
    style: {
      background: accent,
      borderColor: accent
    }
  }, "Start an application ", React.createElement(Arr, null)))));
}
function ReviewsPage({
  accent
}) {
  return React.createElement("div", {
    style: {
      background: DELT.colors.paper
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '72px 32px 56px'
    }
  }, React.createElement(SectionLabel, {
    accent: accent
  }, "Reviews"), React.createElement("h1", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 54,
      fontWeight: 600,
      letterSpacing: '-0.035em',
      color: DELT.colors.ink,
      lineHeight: 1.05,
      margin: 0,
      maxWidth: 800
    }
  }, "Verified by renewal. 68% of Delt merchants come back for a second funding.")), React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 32px 96px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, [...DeltContent.testimonials, ...DeltContent.testimonials.slice(0, 4)].map((t, i) => React.createElement("figure", {
    key: i,
    style: {
      background: DELT.colors.card,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      padding: 32,
      margin: 0
    }
  }, React.createElement("blockquote", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 22,
      lineHeight: 1.4,
      color: DELT.colors.ink,
      letterSpacing: '-0.015em',
      margin: 0,
      fontWeight: 500
    }
  }, "\"", t.q, "\""), React.createElement("figcaption", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13,
      color: DELT.colors.inkMute,
      marginTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      borderTop: `1px solid ${DELT.colors.lineSoft}`,
      paddingTop: 16
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      color: DELT.colors.ink,
      fontWeight: 500
    }
  }, t.n), React.createElement("div", null, t.b)), React.createElement("div", {
    style: {
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  }, React.createElement("div", {
    style: {
      color: accent,
      fontWeight: 600
    }
  }, t.f, " funded"), React.createElement("div", null, t.r, " factor")))))));
}
function ApplicationFlow({
  open,
  onClose,
  prefill,
  accent
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessName: '',
    ein: '',
    legalForm: 'LLC',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: 'CA',
    useOfFunds: 'Inventory',
    bankConnected: false,
    ssn4: '',
    amount: prefill?.high || 75000
  });
  useEffect(() => {
    if (open) {
      setStep(0);
    }
  }, [open]);
  if (!open) return null;
  const steps = ['Business', 'Bank', 'Identity', 'Offer', 'Done'];
  return React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(15,14,23,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflowY: 'auto',
      padding: '60px 20px'
    },
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    }
  }, React.createElement("div", {
    style: {
      background: DELT.colors.card,
      borderRadius: 14,
      maxWidth: 680,
      width: '100%',
      border: `1px solid ${DELT.colors.line}`,
      overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(15,14,23,0.25)'
    }
  }, React.createElement("div", {
    style: {
      padding: '20px 32px',
      borderBottom: `1px solid ${DELT.colors.line}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: DELT.colors.paperWarm
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, steps.map((s, i) => React.createElement(React.Fragment, {
    key: s
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 11,
      color: i <= step ? accent : DELT.colors.inkMute,
      fontWeight: 500,
      padding: '4px 8px',
      background: i <= step ? `${accent}14` : 'transparent',
      borderRadius: 4,
      letterSpacing: '0.04em'
    }
  }, "0", i + 1, " \xB7 ", s), i < steps.length - 1 && React.createElement("div", {
    style: {
      width: 16,
      height: 1,
      background: DELT.colors.line
    }
  })))), React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'transparent',
      border: 'none',
      fontSize: 20,
      cursor: 'pointer',
      color: DELT.colors.inkMute,
      padding: 4
    }
  }, "\xD7")), React.createElement("div", {
    style: {
      padding: '36px 32px',
      minHeight: 380
    }
  }, step === 0 && React.createElement(StepBusiness, {
    form: form,
    setForm: setForm,
    accent: accent
  }), step === 1 && React.createElement(StepBank, {
    form: form,
    setForm: setForm,
    accent: accent
  }), step === 2 && React.createElement(StepIdentity, {
    form: form,
    setForm: setForm,
    accent: accent
  }), step === 3 && React.createElement(StepOffer, {
    form: form,
    setForm: setForm,
    prefill: prefill,
    accent: accent
  }), step === 4 && React.createElement(StepDone, {
    form: form,
    accent: accent
  })), React.createElement("div", {
    style: {
      padding: '16px 32px',
      borderTop: `1px solid ${DELT.colors.line}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: DELT.colors.paperWarm
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 12,
      color: DELT.colors.inkMute
    }
  }, step < 4 ? 'Secured · Plaid · Soft-pull only' : 'Application received'), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, step > 0 && step < 4 && React.createElement(Btn, {
    variant: "ghost",
    size: "sm",
    onClick: () => setStep(step - 1)
  }, "Back"), step < 3 && React.createElement(Btn, {
    variant: "indigo",
    size: "sm",
    onClick: () => setStep(step + 1),
    style: {
      background: accent,
      borderColor: accent
    }
  }, "Continue ", React.createElement(Arr, null)), step === 3 && React.createElement(Btn, {
    variant: "indigo",
    size: "sm",
    onClick: () => setStep(4),
    style: {
      background: accent,
      borderColor: accent
    }
  }, "Accept offer ", React.createElement(Arr, null)), step === 4 && React.createElement(Btn, {
    variant: "ghost",
    size: "sm",
    onClick: onClose
  }, "Close")))));
}
function FieldRow({
  label,
  children
}) {
  return React.createElement("div", null, React.createElement("label", {
    style: lblStyle
  }, label), children);
}
function Input({
  value,
  onChange,
  placeholder,
  accent
}) {
  return React.createElement("input", {
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value),
    onFocus: e => {
      e.target.style.borderColor = accent;
      e.target.style.boxShadow = `0 0 0 3px ${accent}1A`;
    },
    onBlur: e => {
      e.target.style.borderColor = DELT.colors.line;
      e.target.style.boxShadow = 'none';
    },
    style: {
      width: '100%',
      padding: '10px 12px',
      background: DELT.colors.paper,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 6,
      fontFamily: DELT.font.body,
      fontSize: 14.5,
      color: DELT.colors.ink,
      outline: 'none',
      transition: 'border-color .15s, box-shadow .15s'
    }
  });
}
function Select({
  value,
  onChange,
  opts,
  accent
}) {
  return React.createElement("select", {
    value: value,
    onChange: e => onChange(e.target.value),
    style: {
      width: '100%',
      padding: '10px 12px',
      background: DELT.colors.paper,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 6,
      fontFamily: DELT.font.body,
      fontSize: 14.5,
      color: DELT.colors.ink,
      outline: 'none',
      cursor: 'pointer'
    }
  }, opts.map(o => React.createElement("option", {
    key: o,
    value: o
  }, o)));
}
function StepBusiness({
  form,
  setForm,
  accent
}) {
  return React.createElement("div", null, React.createElement("h3", {
    style: stepTitle
  }, "About your business"), React.createElement("p", {
    style: stepSub
  }, "Used to verify entity formation. We don't hard-pull business credit."), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      marginTop: 24
    }
  }, React.createElement(FieldRow, {
    label: "Legal business name"
  }, React.createElement(Input, {
    value: form.businessName,
    onChange: v => setForm({
      ...form,
      businessName: v
    }),
    placeholder: "La Rosa Restaurant LLC",
    accent: accent
  })), React.createElement(FieldRow, {
    label: "EIN"
  }, React.createElement(Input, {
    value: form.ein,
    onChange: v => setForm({
      ...form,
      ein: v
    }),
    placeholder: "12-3456789",
    accent: accent
  })), React.createElement(FieldRow, {
    label: "Entity type"
  }, React.createElement(Select, {
    value: form.legalForm,
    onChange: v => setForm({
      ...form,
      legalForm: v
    }),
    opts: ['LLC', 'S-Corp', 'C-Corp', 'Sole Prop', 'Partnership'],
    accent: accent
  })), React.createElement(FieldRow, {
    label: "State of operation"
  }, React.createElement(Select, {
    value: form.state,
    onChange: v => setForm({
      ...form,
      state: v
    }),
    opts: ['CA', 'TX', 'FL', 'NY', 'IL', 'GA', 'Other'],
    accent: accent
  })), React.createElement(FieldRow, {
    label: "First name"
  }, React.createElement(Input, {
    value: form.firstName,
    onChange: v => setForm({
      ...form,
      firstName: v
    }),
    placeholder: "Maria",
    accent: accent
  })), React.createElement(FieldRow, {
    label: "Last name"
  }, React.createElement(Input, {
    value: form.lastName,
    onChange: v => setForm({
      ...form,
      lastName: v
    }),
    placeholder: "Rodriguez",
    accent: accent
  })), React.createElement(FieldRow, {
    label: "Email"
  }, React.createElement(Input, {
    value: form.email,
    onChange: v => setForm({
      ...form,
      email: v
    }),
    placeholder: "you@business.com",
    accent: accent
  })), React.createElement(FieldRow, {
    label: "Phone"
  }, React.createElement(Input, {
    value: form.phone,
    onChange: v => setForm({
      ...form,
      phone: v
    }),
    placeholder: "(555) 555-0199",
    accent: accent
  }))));
}
function StepBank({
  form,
  setForm,
  accent
}) {
  const [connecting, setConnecting] = useState(false);
  return React.createElement("div", null, React.createElement("h3", {
    style: stepTitle
  }, "Connect your bank"), React.createElement("p", {
    style: stepSub
  }, "We read 90 days of deposits via Plaid \u2014 read-only, no ACH authorization yet."), React.createElement("div", {
    style: {
      marginTop: 28,
      background: DELT.colors.paper,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      padding: 24
    }
  }, form.bankConnected ? React.createElement("div", null, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 6,
      background: DELT.colors.ok,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(Tick, {
    c: "#fff"
  })), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 16,
      fontWeight: 600,
      color: DELT.colors.ink
    }
  }, "Chase Business Complete \xB7 \u2022\u20221842"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      color: DELT.colors.inkMute
    }
  }, "90 days of deposits read \xB7 $312,480 total"))), React.createElement("div", {
    style: {
      marginTop: 20,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12
    }
  }, [['Avg. daily balance', '$28,410'], ['Neg. days (90d)', '0'], ['Avg. monthly deposits', '$104,160']].map(([k, v]) => React.createElement("div", {
    key: k,
    style: {
      background: DELT.colors.card,
      border: `1px solid ${DELT.colors.lineSoft}`,
      borderRadius: 6,
      padding: 12
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, k), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 18,
      fontWeight: 600,
      color: DELT.colors.ink,
      marginTop: 4,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v))))) : connecting ? React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '30px 0'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 13,
      color: accent,
      marginBottom: 10
    }
  }, "Reading 90 days of deposits\u2026"), React.createElement("div", {
    style: {
      width: '60%',
      height: 3,
      background: DELT.colors.line,
      margin: '0 auto',
      borderRadius: 2,
      overflow: 'hidden',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: accent,
      animation: 'dpulse 1.4s linear infinite'
    }
  })), React.createElement("style", null, `@keyframes dpulse { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`)) : React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 14.5,
      color: DELT.colors.inkSoft,
      lineHeight: 1.5,
      marginBottom: 20
    }
  }, "Select your primary operating bank. Plaid will open in a secure popup \u2014 you sign in with your bank credentials, not us."), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10
    }
  }, ['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'US Bank', 'Other (20k+)'].map(b => React.createElement("button", {
    key: b,
    onClick: () => {
      setConnecting(true);
      setTimeout(() => {
        setForm({
          ...form,
          bankConnected: true
        });
        setConnecting(false);
      }, 1600);
    },
    style: {
      padding: '14px 10px',
      background: DELT.colors.card,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 6,
      cursor: 'pointer',
      fontFamily: DELT.font.body,
      fontSize: 13,
      color: DELT.colors.ink,
      fontWeight: 500
    }
  }, b))))));
}
function StepIdentity({
  form,
  setForm,
  accent
}) {
  return React.createElement("div", null, React.createElement("h3", {
    style: stepTitle
  }, "Verify identity"), React.createElement("p", {
    style: stepSub
  }, "Last 4 of SSN \u2014 used for KYC only. Soft-pull, no impact to personal credit."), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      marginTop: 24,
      maxWidth: 420
    }
  }, React.createElement(FieldRow, {
    label: "SSN (last 4)"
  }, React.createElement(Input, {
    value: form.ssn4,
    onChange: v => setForm({
      ...form,
      ssn4: v.replace(/[^0-9]/g, '').slice(0, 4)
    }),
    placeholder: "1234",
    accent: accent
  })), React.createElement(FieldRow, {
    label: "Use of funds"
  }, React.createElement(Select, {
    value: form.useOfFunds,
    onChange: v => setForm({
      ...form,
      useOfFunds: v
    }),
    opts: ['Inventory', 'Equipment', 'Hiring', 'Renovation', 'Marketing', 'Bridge A/R', 'Other'],
    accent: accent
  }))), React.createElement("div", {
    style: {
      marginTop: 32,
      padding: 16,
      background: DELT.colors.paperWarm,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 8,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: accent,
      marginTop: 8,
      flexShrink: 0
    }
  }), React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 13,
      color: DELT.colors.inkSoft,
      lineHeight: 1.55
    }
  }, "Soft inquiry on personal credit only. We never hard-pull at this stage. A hard pull happens only if you countersign an offer \u2014 and only on the guarantor.")));
}
function StepOffer({
  form,
  prefill,
  accent
}) {
  const amount = prefill?.high || 75000;
  const factor = prefill?.factor || 1.18;
  const total = Math.round(amount * factor);
  const term = 8;
  const daily = Math.round(total / (term * 22));
  return React.createElement("div", null, React.createElement("h3", {
    style: stepTitle
  }, "Your offer"), React.createElement("p", {
    style: stepSub
  }, "One page. No addenda. Counter-sign to move to funding."), React.createElement("div", {
    style: {
      marginTop: 28,
      border: `1px solid ${DELT.colors.line}`,
      borderRadius: 10,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      background: DELT.colors.ink,
      color: '#F7F5F0',
      padding: '20px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#9E9BA8'
    }
  }, "Advance amount"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 42,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      marginTop: 4,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$", amount.toLocaleString())), React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#9E9BA8'
    }
  }, "Offer ID"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 14,
      marginTop: 4,
      color: '#E9E7DF'
    }
  }, "DLT-2026-", Math.floor(Math.random() * 900000 + 100000)))), React.createElement("div", {
    style: {
      padding: 24,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
      background: DELT.colors.card
    }
  }, [['Factor rate', `${factor.toFixed(2)}×`], ['Total repayment', `$${total.toLocaleString()}`], ['Term', `${term} months`], ['Daily debit', `$${daily.toLocaleString()}`]].map(([k, v]) => React.createElement("div", {
    key: k
  }, React.createElement("div", {
    style: {
      fontFamily: DELT.font.body,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: DELT.colors.inkMute
    }
  }, k), React.createElement("div", {
    style: {
      fontFamily: DELT.font.display,
      fontSize: 20,
      fontWeight: 600,
      color: DELT.colors.ink,
      marginTop: 4,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)))), React.createElement("div", {
    style: {
      padding: '16px 24px',
      background: DELT.colors.paperWarm,
      borderTop: `1px solid ${DELT.colors.line}`,
      fontFamily: DELT.font.body,
      fontSize: 12.5,
      color: DELT.colors.inkMute,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, React.createElement("div", null, "No origination fee \xB7 No ACH fee \xB7 Early-pay rebate included"), React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono
    }
  }, "Expires in 72h"))));
}
function StepDone({
  form,
  accent
}) {
  return React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '40px 0'
    }
  }, React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      margin: '0 auto 20px',
      borderRadius: 999,
      background: `${accent}14`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(Tick, {
    c: accent
  })), React.createElement("h3", {
    style: {
      ...stepTitle,
      textAlign: 'center'
    }
  }, "You're funded."), React.createElement("p", {
    style: {
      ...stepSub,
      textAlign: 'center',
      maxWidth: 460,
      margin: '8px auto 24px'
    }
  }, "Funds will arrive in your connected account by 2 pm ET tomorrow. A copy of your contract and amortization schedule is on its way to ", form.email || 'your email', "."), React.createElement("div", {
    style: {
      fontFamily: DELT.font.mono,
      fontSize: 12,
      color: DELT.colors.inkMute
    }
  }, "Wire reference \xB7 DLT-2026-", Math.floor(Math.random() * 900000 + 100000)));
}
const stepTitle = {
  fontFamily: DELT.font.display,
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: DELT.colors.ink,
  margin: 0
};
const stepSub = {
  fontFamily: DELT.font.body,
  fontSize: 14,
  color: DELT.colors.inkMute,
  margin: '8px 0 0',
  lineHeight: 1.55
};
function DeltApp({
  chrome,
  accent = DELT.colors.indigo,
  hero
}) {
  const [page, setPage] = useState('home');
  const [appOpen, setAppOpen] = useState(false);
  const [calcState, setCalcState] = useState({
    revenue: 0,
    tib: '',
    cards: null,
    cardSales: 0
  });
  const [appPrefill, setAppPrefill] = useState(null);
  const navTo = p => {
    setPage(p);
    window.scrollTo(0, 0);
  };
  const openApp = (c, est) => {
    if (est) setAppPrefill(est);
    setAppOpen(true);
  };
  const pageContent = (() => {
    if (page === 'about') return React.createElement(AboutPage, {
      accent: accent
    });
    if (page === 'how') return React.createElement(HowItWorksPage, {
      accent: accent,
      onApply: () => openApp(null, null)
    });
    if (page === 'reviews') return React.createElement(ReviewsPage, {
      accent: accent
    });
    return React.createElement(React.Fragment, null, hero && hero({
      accent,
      calcState,
      setCalcState,
      onApply: openApp
    }), React.createElement("section", {
      style: {
        background: DELT.colors.paperWarm,
        padding: '48px 32px 16px'
      }
    }, React.createElement("div", {
      style: {
        maxWidth: 1120,
        margin: '0 auto'
      }
    }, React.createElement(StatsStrip, {
      accent: accent
    }))), React.createElement(CompareSection, {
      accent: accent
    }), React.createElement(StepsSection, {
      accent: accent
    }), !hero?.calcInline && React.createElement("section", {
      style: {
        background: DELT.colors.paperWarm,
        padding: '80px 32px'
      }
    }, React.createElement("div", {
      style: {
        maxWidth: 960,
        margin: '0 auto'
      }
    }, React.createElement(SectionLabel, {
      accent: accent
    }, "Calculator"), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        alignItems: 'start',
        marginBottom: 32
      }
    }, React.createElement("h2", {
      style: h2Style
    }, "Price the deal before you apply."), React.createElement("p", {
      style: {
        fontFamily: DELT.font.body,
        fontSize: 15,
        lineHeight: 1.6,
        color: DELT.colors.inkSoft,
        marginTop: 8
      }
    }, "Live estimates based on the same underwriting logic that runs on every Delt application.")), React.createElement(DeltCalculator, {
      calcState: calcState,
      setCalcState: setCalcState,
      onApply: openApp,
      themeAccent: accent
    }))), React.createElement(ReviewsSection, {
      accent: accent
    }), React.createElement(FAQSection, {
      accent: accent
    }));
  })();
  return React.createElement(React.Fragment, null, chrome({
    page,
    navTo,
    accent,
    openApp: () => openApp(null, null)
  }), pageContent, React.createElement(FooterBlock, {
    accent: accent,
    brand: chrome.brand
  }), React.createElement(ApplicationFlow, {
    open: appOpen,
    onClose: () => setAppOpen(false),
    prefill: appPrefill,
    accent: accent
  }));
}
Object.assign(window, {
  DeltApp,
  DeltCalculator,
  StatsStrip,
  CompareSection,
  StepsSection,
  ReviewsSection,
  FAQSection,
  FooterBlock,
  SectionLabel,
  h2Style,
  lblStyle,
  AboutPage,
  HowItWorksPage,
  ReviewsPage,
  ApplicationFlow
});