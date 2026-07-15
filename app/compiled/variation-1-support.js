function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function V1SupIcon({
  name,
  size = 16,
  color
}) {
  const s = size;
  const p = {
    stroke: color || 'currentColor',
    strokeWidth: 1.6,
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  if (name === 'mail') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("rect", _extends({
    x: "2",
    y: "3.5",
    width: "12",
    height: "9",
    rx: "1.5"
  }, p)), React.createElement("path", _extends({
    d: "M2.5 4.5l5.5 4 5.5-4"
  }, p)));
  if (name === 'phone') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("path", _extends({
    d: "M3.5 3c0-.6.5-1 1-1h2l1 3-1.5 1c.5 1.5 2 3 3.5 3.5l1-1.5 3 1v2c0 .6-.4 1-1 1C6.5 12 3.5 9 3.5 3z"
  }, p)));
  if (name === 'chat') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("path", _extends({
    d: "M3 3h10c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1H9l-3 2.5V11H3c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1z"
  }, p)));
  if (name === 'calendar') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("rect", _extends({
    x: "2.5",
    y: "3.5",
    width: "11",
    height: "10",
    rx: "1.5"
  }, p)), React.createElement("path", _extends({
    d: "M2.5 6.5h11M5.5 2v3M10.5 2v3"
  }, p)));
  if (name === 'clock') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("circle", _extends({
    cx: "8",
    cy: "8",
    r: "6"
  }, p)), React.createElement("path", _extends({
    d: "M8 4.5v3.8l2.5 1.5"
  }, p)));
  if (name === 'check') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("path", _extends({
    d: "M3.5 8.5L7 12l5.5-7"
  }, p)));
  if (name === 'arrow') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("path", _extends({
    d: "M3 8h9M9 5l3 3-3 3"
  }, p)));
  if (name === 'shield') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("path", _extends({
    d: "M8 1.5l6 2v4c0 3.6-2.5 6.3-6 7.2C4.5 13.8 2 11 2 7.5v-4l6-2z"
  }, p)));
  if (name === 'user') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("circle", _extends({
    cx: "8",
    cy: "6",
    r: "2.5"
  }, p)), React.createElement("path", _extends({
    d: "M3 13.5c0-2.6 2.2-4.5 5-4.5s5 1.9 5 4.5"
  }, p)));
  if (name === 'file') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("path", _extends({
    d: "M3 2h6l4 4v8c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1z"
  }, p)), React.createElement("path", _extends({
    d: "M9 2v4h4"
  }, p)));
  if (name === 'dollar') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("path", _extends({
    d: "M8 2v12M11 5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2"
  }, p)));
  if (name === 'help') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 16 16"
  }, React.createElement("circle", _extends({
    cx: "8",
    cy: "8",
    r: "6"
  }, p)), React.createElement("path", _extends({
    d: "M6.2 6.2c0-1 .8-1.7 1.8-1.7s1.8.7 1.8 1.7c0 1.6-1.8 1.4-1.8 2.8"
  }, p)), React.createElement("circle", {
    cx: "8",
    cy: "11.5",
    r: "0.5",
    fill: color || 'currentColor',
    stroke: "none"
  }));
  return null;
}
function V1SupportHero({
  accent
}) {
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.ink,
      padding: '80px 0 72px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: `1px solid rgba(255,255,255,0.06)`
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -220,
      left: -180,
      width: 580,
      height: 580,
      background: `radial-gradient(circle, ${accent}33 0%, transparent 60%)`,
      filter: 'blur(20px)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      bottom: -240,
      right: -120,
      width: 500,
      height: 500,
      background: `radial-gradient(circle, #4945FF22 0%, transparent 60%)`,
      filter: 'blur(20px)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      animation: 'supFadeUp 600ms cubic-bezier(.2,.7,.3,1) both'
    }
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "Support \xB7 Real humans, fast")), React.createElement("h1", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2.4rem, 5.4vw, 4.5rem)',
      fontWeight: 600,
      letterSpacing: '-0.04em',
      lineHeight: 1.02,
      color: '#fff',
      margin: '22px 0 0',
      maxWidth: 900,
      animation: 'supFadeUp 700ms cubic-bezier(.2,.7,.3,1) 60ms both'
    }
  }, "How can we help?", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      color: accent
    }
  }, "No ticket queue.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 18.5,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '28px 0 0',
      maxWidth: 640,
      animation: 'supFadeUp 700ms cubic-bezier(.2,.7,.3,1) 140ms both'
    }
  }, "Drop us a note below and a real person on our operator desk picks it up \u2014 typically under an hour during business hours. Want to talk it through?", ' ', "Book a 30-minute call with the underwriter who'd price your deal."), React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 32,
      animation: 'supFadeUp 700ms cubic-bezier(.2,.7,.3,1) 220ms both'
    }
  }, [['clock', '< 1hr median reply'], ['user', 'Operator desk, not BPO'], ['shield', 'No credit pull'], ['calendar', 'Mon–Fri · 8a–7p ET']].map(([icon, label]) => React.createElement("span", {
    key: label,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 999,
      padding: '7px 14px',
      fontFamily: V1.fontMono,
      fontSize: 11.5,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.82)'
    }
  }, React.createElement(V1SupIcon, {
    name: icon,
    size: 13
  }), label)))), React.createElement("style", null, `@keyframes supFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`));
}
const V1_SUP_TOPICS = [{
  k: 'application',
  label: 'Application status',
  icon: 'file',
  hint: "I've applied and want an update."
}, {
  k: 'pricing',
  label: 'Pricing / factor rate',
  icon: 'dollar',
  hint: 'Questions about my offer or rebate.'
}, {
  k: 'funding',
  label: 'Funding & payments',
  icon: 'dollar',
  hint: 'Wire timing, ACH, renewal, pay-early.'
}, {
  k: 'account',
  label: 'Account & documents',
  icon: 'user',
  hint: 'Login, statements, tax docs, changes.'
}, {
  k: 'general',
  label: 'General inquiry',
  icon: 'help',
  hint: 'Press, partnerships, anything else.'
}];
function V1SupportPage({
  accent,
  onTalk,
  onApply
}) {
  const [topic, setTopic] = React.useState('application');
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const ready = form.name.trim() && /@/.test(form.email) && form.message.trim().length > 10;
  const submit = e => {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };
  const reset = () => {
    setSubmitted(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    });
    setTopic('application');
  };
  return React.createElement(React.Fragment, null, React.createElement(V1SupportHero, {
    accent: accent
  }), React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.bg,
      padding: '72px 0 96px'
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
      gridTemplateColumns: '1.4fr 0.9fr',
      gap: 40,
      alignItems: 'flex-start'
    }
  }, React.createElement("div", {
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 16,
      padding: 40,
      animation: 'supFadeUp 500ms cubic-bezier(.2,.7,.3,1) both'
    }
  }, submitted ? React.createElement(V1SupportConfirm, {
    form: form,
    topic: topic,
    accent: accent,
    onReset: reset,
    onTalk: onTalk
  }) : React.createElement("form", {
    onSubmit: submit
  }, React.createElement(V1Eyebrow, null, "Send us a note"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 30,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: V1.ink,
      margin: '12px 0 8px',
      lineHeight: 1.1
    }
  }, "Write us. We read every one."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      color: V1.muted,
      lineHeight: 1.55,
      margin: 0,
      maxWidth: 520
    }
  }, "Routed to the right person by topic \u2014 existing files go to your underwriter; general inquiries go to the operator desk."), React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, React.createElement(V1SupLabel, null, "What's this about?"), React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 8,
      marginTop: 10
    }
  }, V1_SUP_TOPICS.map(t => {
    const active = topic === t.k;
    return React.createElement("button", {
      key: t.k,
      type: "button",
      onClick: () => setTopic(t.k),
      style: {
        padding: '12px 10px',
        borderRadius: 10,
        border: active ? `1.5px solid ${accent}` : `1px solid ${V1.line}`,
        background: active ? `${accent}0A` : V1.white,
        color: active ? accent : V1.text,
        cursor: 'pointer',
        transition: 'all .15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'flex-start',
        textAlign: 'left',
        fontFamily: V1.fontBody,
        fontSize: 12.5,
        fontWeight: 500,
        lineHeight: 1.25
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.borderColor = V1.ink;
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.borderColor = V1.line;
      }
    }, React.createElement(V1SupIcon, {
      name: t.icon,
      size: 15,
      color: active ? accent : V1.muted
    }), React.createElement("span", null, t.label));
  })), React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: V1.fontMono,
      fontSize: 11.5,
      letterSpacing: '0.08em',
      color: V1.muted
    }
  }, "\u2192 ", V1_SUP_TOPICS.find(t => t.k === topic).hint)), React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      marginTop: 28,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, React.createElement(V1SupField, {
    label: "Full name",
    required: true
  }, React.createElement(V1SupInput, {
    value: form.name,
    onChange: v => setForm({
      ...form,
      name: v
    }),
    placeholder: "Maria Rodriguez",
    accent: accent
  })), React.createElement(V1SupField, {
    label: "Email",
    required: true
  }, React.createElement(V1SupInput, {
    type: "email",
    value: form.email,
    onChange: v => setForm({
      ...form,
      email: v
    }),
    placeholder: "you@business.com",
    accent: accent
  })), React.createElement(V1SupField, {
    label: "Phone",
    hint: "Optional"
  }, React.createElement(V1SupInput, {
    value: form.phone,
    onChange: v => setForm({
      ...form,
      phone: v
    }),
    placeholder: "(555) 555-0199",
    accent: accent
  })), React.createElement(V1SupField, {
    label: "Business name",
    hint: "Helps route faster"
  }, React.createElement(V1SupInput, {
    value: form.company,
    onChange: v => setForm({
      ...form,
      company: v
    }),
    placeholder: "La Rosa Restaurant LLC",
    accent: accent
  }))), React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, React.createElement(V1SupField, {
    label: "How can we help?",
    required: true
  }, React.createElement(V1SupTextarea, {
    value: form.message,
    onChange: v => setForm({
      ...form,
      message: v
    }),
    placeholder: "I applied last Tuesday and haven't heard back on my offer \u2014 can you check the status?",
    accent: accent
  }))), React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: V1.muted,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement(V1SupIcon, {
    name: "shield",
    size: 12,
    color: V1.muted
  }), "Encrypted in transit \xB7 Never shared"), React.createElement("button", {
    type: "submit",
    disabled: !ready || submitting,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '13px 22px',
      borderRadius: 10,
      border: 'none',
      background: ready ? accent : V1.line,
      color: ready ? V1.white : V1.muted,
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      fontWeight: 600,
      cursor: ready ? 'pointer' : 'not-allowed',
      transition: 'filter .15s, transform .1s'
    },
    onMouseEnter: e => {
      if (ready) {
        e.currentTarget.style.filter = 'brightness(1.08)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, submitting ? 'Sending…' : 'Send message', !submitting && React.createElement(V1SupIcon, {
    name: "arrow",
    size: 14
  }))))), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      background: V1.ink,
      color: '#fff',
      borderRadius: 16,
      padding: 28,
      position: 'relative',
      overflow: 'hidden',
      animation: 'supFadeUp 500ms cubic-bezier(.2,.7,.3,1) 80ms both'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -120,
      right: -80,
      width: 280,
      height: 280,
      background: `radial-gradient(circle, ${accent}44 0%, transparent 60%)`,
      filter: 'blur(10px)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "Skip the wait"), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: '#fff',
      margin: '14px 0 10px',
      lineHeight: 1.15
    }
  }, "Schedule a 30-min call", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      color: V1.blueSoft
    }
  }, "with an underwriter.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '0 0 20px'
    }
  }, "Faster than email for anything pricing-related. Teams, no credit pull, pick your own time."), React.createElement("div", {
    style: {
      padding: 14,
      borderRadius: 10,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      marginBottom: 16
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.blueSoft,
      marginBottom: 8
    }
  }, "Next available"), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 16,
      fontWeight: 600,
      color: '#fff',
      letterSpacing: '-0.015em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "Today \xB7 2:30 pm ET"), React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, ['Today 2:30p', 'Today 4:00p', 'Tomorrow 9:00a', 'Tomorrow 11:00a'].map((t, i) => React.createElement("span", {
    key: t,
    style: {
      padding: '4px 10px',
      borderRadius: 999,
      background: i === 0 ? accent : 'rgba(255,255,255,0.08)',
      border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
      color: i === 0 ? '#fff' : 'rgba(255,255,255,0.8)',
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 500,
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap'
    }
  }, t)))), React.createElement("button", {
    onClick: onTalk,
    style: {
      width: '100%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '14px 18px',
      borderRadius: 10,
      border: 'none',
      background: '#fff',
      color: V1.ink,
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'transform .1s, filter .15s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.filter = 'brightness(0.97)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.filter = 'none';
    }
  }, React.createElement(V1SupIcon, {
    name: "calendar",
    size: 15
  }), "Pick a time", React.createElement(V1SupIcon, {
    name: "arrow",
    size: 14
  })))), React.createElement("div", {
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 16,
      padding: 24,
      animation: 'supFadeUp 500ms cubic-bezier(.2,.7,.3,1) 160ms both'
    }
  }, React.createElement(V1Eyebrow, null, "Direct channels"), React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, React.createElement(V1SupChannel, {
    icon: "mail",
    label: "Email",
    value: "hello@deltcapital.com",
    sub: "Reply in < 1 hour (business hours)",
    accent: accent
  }), React.createElement(V1SupChannel, {
    icon: "phone",
    label: "Phone",
    value: "(888) 555-0144",
    sub: "Mon\u2013Fri \xB7 8:00a\u20137:00p ET",
    accent: accent
  }), React.createElement(V1SupChannel, {
    icon: "chat",
    label: "Live chat",
    value: "In the app \xB7 bottom right",
    sub: "For active accounts only",
    accent: accent
  }))), React.createElement("div", {
    style: {
      border: `1px dashed ${V1.line}`,
      borderRadius: 14,
      padding: 20,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      animation: 'supFadeUp 500ms cubic-bezier(.2,.7,.3,1) 240ms both'
    }
  }, React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 34,
      height: 34,
      borderRadius: 10,
      background: `${accent}14`,
      color: accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(V1SupIcon, {
    name: "help",
    size: 17
  })), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.01em'
    }
  }, "Have a common question?"), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: V1.muted,
      lineHeight: 1.55,
      margin: '4px 0 0'
    }
  }, "Our FAQ covers rates, renewals, funding timing, and what we underwrite on."))))), React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      marginTop: 64,
      padding: '28px 32px',
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 14,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 28
    }
  }, [['Median first reply', '47 min', 'Business hours, Mon–Fri'], ['Urgent funding issues', '< 15 min', 'Call the funding line'], ['No scripts', 'Real humans', 'Operator desk — not a BPO'], ['Escalation path', 'Direct', 'Same underwriter through renewal']].map(([k, v, sub]) => React.createElement("div", {
    key: k
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: accent,
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 12,
      height: 1,
      background: accent
    }
  }), k), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: V1.ink,
      marginBottom: 4,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: V1.muted,
      lineHeight: 1.5
    }
  }, sub)))))));
}
function V1SupportConfirm({
  form,
  topic,
  accent,
  onReset,
  onTalk
}) {
  const topicLabel = V1_SUP_TOPICS.find(t => t.k === topic).label;
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 999,
      background: `${V1.green}14`,
      color: V1.green,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'supCheckPop 500ms cubic-bezier(.2,1.4,.5,1) 80ms both'
    }
  }, React.createElement(V1SupIcon, {
    name: "check",
    size: 24
  })), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.green,
      marginBottom: 8
    }
  }, "Message sent"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: V1.ink,
      margin: 0,
      lineHeight: 1.15
    }
  }, "Thanks, ", form.name.split(' ')[0], ". We'll reply within the hour."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15,
      color: V1.muted,
      lineHeight: 1.55,
      margin: '12px 0 0',
      maxWidth: 520
    }
  }, "Your note is routed to the right desk. You'll get a confirmation at", ' ', React.createElement("span", {
    style: {
      color: V1.ink,
      fontWeight: 500
    }
  }, form.email), ' ', "and a real reply from a person, not an autoresponder.")), React.createElement("div", {
    style: {
      background: V1.bg,
      border: `1px solid ${V1.line}`,
      borderRadius: 10,
      padding: 16,
      fontFamily: V1.fontMono,
      fontSize: 12.5,
      color: V1.ink,
      lineHeight: 1.8,
      fontVariantNumeric: 'tabular-nums'
    }
  }, React.createElement("div", null, React.createElement("span", {
    style: {
      color: V1.muted
    }
  }, "TOPIC "), topicLabel), React.createElement("div", null, React.createElement("span", {
    style: {
      color: V1.muted
    }
  }, "EMAIL "), form.email), form.phone && React.createElement("div", null, React.createElement("span", {
    style: {
      color: V1.muted
    }
  }, "PHONE "), form.phone), form.company && React.createElement("div", null, React.createElement("span", {
    style: {
      color: V1.muted
    }
  }, "BIZ "), form.company), React.createElement("div", null, React.createElement("span", {
    style: {
      color: V1.muted
    }
  }, "REF # "), "DC-", String(Math.floor(Math.random() * 90000) + 10000))), React.createElement("div", {
    style: {
      padding: 18,
      background: `${accent}08`,
      border: `1px solid ${accent}33`,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.01em'
    }
  }, "Want to talk while you wait?"), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: V1.muted,
      marginTop: 2
    }
  }, "30-min Teams, next slot in ~2 hours.")), React.createElement("button", {
    onClick: onTalk,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 18px',
      borderRadius: 10,
      border: 'none',
      background: accent,
      color: V1.white,
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'filter .15s, transform .1s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.filter = 'brightness(1.08)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, React.createElement(V1SupIcon, {
    name: "calendar",
    size: 14
  }), "Book a meeting", React.createElement(V1SupIcon, {
    name: "arrow",
    size: 13
  }))), React.createElement("button", {
    onClick: onReset,
    style: {
      alignSelf: 'flex-start',
      padding: '10px 16px',
      borderRadius: 10,
      border: `1px solid ${V1.line}`,
      background: V1.white,
      color: V1.ink,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 13,
      fontWeight: 500
    }
  }, "Send another message"), React.createElement("style", null, `@keyframes supCheckPop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}`));
}
function V1SupLabel({
  children
}) {
  return React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 14,
      height: 1,
      background: V1.muted
    }
  }), children);
}
function V1SupField({
  label,
  hint,
  required,
  children
}) {
  return React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8
    }
  }, React.createElement(V1SupLabel, null, label, required && React.createElement("span", {
    style: {
      color: V1.red,
      marginLeft: 2
    }
  }, "*")), hint && React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 11.5,
      color: V1.muted
    }
  }, hint)), children);
}
function V1SupInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  accent
}) {
  return React.createElement("input", {
    type: type,
    value: value || '',
    placeholder: placeholder,
    onChange: e => onChange(e.target.value),
    onFocus: e => {
      e.currentTarget.style.borderColor = accent;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}26`;
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = V1.line;
      e.currentTarget.style.boxShadow = 'none';
    },
    style: {
      width: '100%',
      padding: '13px 14px',
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 10,
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      color: V1.ink,
      outline: 'none',
      transition: 'border-color .15s, box-shadow .15s'
    }
  });
}
function V1SupTextarea({
  value,
  onChange,
  placeholder,
  accent
}) {
  return React.createElement("textarea", {
    value: value || '',
    placeholder: placeholder,
    onChange: e => onChange(e.target.value),
    rows: 6,
    onFocus: e => {
      e.currentTarget.style.borderColor = accent;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}26`;
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = V1.line;
      e.currentTarget.style.boxShadow = 'none';
    },
    style: {
      width: '100%',
      padding: '13px 14px',
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 10,
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      color: V1.ink,
      lineHeight: 1.55,
      outline: 'none',
      resize: 'vertical',
      minHeight: 140,
      transition: 'border-color .15s, box-shadow .15s'
    }
  });
}
function V1SupChannel({
  icon,
  label,
  value,
  sub,
  accent
}) {
  return React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      padding: '12px 0',
      borderBottom: `1px solid ${V1.bgWarm}`
    }
  }, React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 34,
      height: 34,
      borderRadius: 10,
      background: `${accent}10`,
      color: accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(V1SupIcon, {
    name: icon,
    size: 16
  })), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, label), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 15.5,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.01em',
      marginTop: 2,
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 12.5,
      color: V1.muted,
      marginTop: 2
    }
  }, sub)));
}
Object.assign(window, {
  V1SupportPage
});