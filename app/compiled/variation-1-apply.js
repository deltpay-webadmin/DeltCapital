const V1APPLY_BANKS = [{
  name: 'Chase',
  c1: '#117ACA',
  c2: '#0A5BA0',
  mark: 'J'
}, {
  name: 'Bank of America',
  c1: '#E31837',
  c2: '#9F1120',
  mark: 'B'
}, {
  name: 'Wells Fargo',
  c1: '#D71E28',
  c2: '#7A1015',
  mark: 'W'
}, {
  name: 'Citi',
  c1: '#003B70',
  c2: '#00264A',
  mark: 'C'
}, {
  name: 'US Bank',
  c1: '#0066B2',
  c2: '#00417A',
  mark: 'U'
}, {
  name: 'PNC',
  c1: '#F58025',
  c2: '#A94F10',
  mark: 'P'
}, {
  name: 'Capital One',
  c1: '#004977',
  c2: '#002B47',
  mark: 'C'
}, {
  name: 'Other',
  c1: V1.ink,
  c2: '#1A2438',
  mark: '+'
}];
const V1APPLY_STEPS = ['Business', 'Bank', 'Identity', 'Offer', 'Done'];
function formatEIN(v) {
  const d = (v || '').replace(/\D/g, '').slice(0, 9);
  return d.length <= 2 ? d : `${d.slice(0, 2)}-${d.slice(2)}`;
}
function formatPhone(v) {
  const d = (v || '').replace(/\D/g, '').slice(0, 10);
  if (d.length === 0) return '';
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
const v1IsEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
const v1IsEIN = v => (v || '').replace(/\D/g, '').length === 9;
const v1IsPhone = v => (v || '').replace(/\D/g, '').length === 10;
const v1NotBlank = v => !!(v && v.trim());
function v1BusinessComplete(form) {
  return v1NotBlank(form.businessName) && v1IsEIN(form.ein) && v1NotBlank(form.legalForm) && v1NotBlank(form.state) && v1NotBlank(form.firstName) && v1NotBlank(form.lastName) && v1IsEmail(form.email) && v1IsPhone(form.phone);
}
function V1ApplyField({
  label,
  hint,
  children
}) {
  return React.createElement("label", {
    style: {
      display: 'block'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 7
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, label), hint && React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 11.5,
      color: V1.muted,
      fontStyle: 'italic'
    }
  }, hint)), children);
}
function V1ApplyInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  accent,
  inputMode,
  invalid
}) {
  return React.createElement("input", {
    type: type,
    inputMode: inputMode,
    value: value || '',
    placeholder: placeholder,
    "aria-invalid": invalid ? 'true' : undefined,
    onChange: e => onChange(e.target.value),
    onFocus: e => {
      e.currentTarget.style.borderColor = invalid ? V1.red : accent;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${invalid ? V1.red : accent}26`;
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = invalid ? V1.red : V1.line;
      e.currentTarget.style.boxShadow = 'none';
    },
    style: {
      width: '100%',
      padding: '13px 14px',
      background: V1.white,
      border: `1px solid ${invalid ? V1.red : V1.line}`,
      borderRadius: 10,
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      color: V1.ink,
      outline: 'none',
      transition: 'border-color .15s, box-shadow .15s'
    }
  });
}
function V1ApplySelect({
  value,
  onChange,
  opts,
  accent,
  placeholder
}) {
  const isPlaceholder = !value;
  return React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement("select", {
    value: value || '',
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
      padding: '13px 40px 13px 14px',
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 10,
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      color: isPlaceholder ? V1.muted : V1.ink,
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      transition: 'border-color .15s, box-shadow .15s'
    }
  }, placeholder && React.createElement("option", {
    value: "",
    disabled: true,
    hidden: true
  }, placeholder), opts.map(o => React.createElement("option", {
    key: o,
    value: o,
    style: {
      color: V1.ink
    }
  }, o))), React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    },
    fill: "none",
    stroke: V1.muted,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M3 4.5L6 7.5L9 4.5"
  })));
}
function V1StepBusiness({
  form,
  setForm,
  accent
}) {
  return React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: accent
    }
  }, "Step 01 \xB7 Business"), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 32,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: V1.ink,
      margin: '10px 0 8px',
      lineHeight: 1.1
    }
  }, "Tell us about your business."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15,
      color: V1.muted,
      lineHeight: 1.55,
      margin: 0,
      maxWidth: 520
    }
  }, "Used to verify entity formation and file a KYB check. We don't hard-pull business credit and we don't surface this to bureaus."), React.createElement("div", {
    "data-v1-form-grid": true,
    style: {
      marginTop: 30,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, React.createElement(V1ApplyField, {
    label: "Legal business name"
  }, React.createElement(V1ApplyInput, {
    value: form.businessName,
    onChange: v => setForm({
      ...form,
      businessName: v
    }),
    placeholder: "La Rosa Restaurant LLC",
    accent: accent
  })), React.createElement(V1ApplyField, {
    label: "EIN",
    hint: "9 digits"
  }, React.createElement(V1ApplyInput, {
    value: form.ein,
    onChange: v => setForm({
      ...form,
      ein: formatEIN(v)
    }),
    placeholder: "12-3456789",
    accent: accent,
    inputMode: "numeric",
    invalid: !!form.ein && !v1IsEIN(form.ein)
  })), React.createElement(V1ApplyField, {
    label: "Entity type"
  }, React.createElement(V1ApplySelect, {
    value: form.legalForm,
    onChange: v => setForm({
      ...form,
      legalForm: v
    }),
    opts: ['LLC', 'S-Corp', 'C-Corp', 'Sole Prop', 'Partnership'],
    accent: accent,
    placeholder: "Select entity type"
  })), React.createElement(V1ApplyField, {
    label: "State of operation"
  }, React.createElement(V1ApplySelect, {
    value: form.state,
    onChange: v => setForm({
      ...form,
      state: v
    }),
    opts: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC', 'Other'],
    accent: accent,
    placeholder: "Select state"
  })), React.createElement(V1ApplyField, {
    label: "First name"
  }, React.createElement(V1ApplyInput, {
    value: form.firstName,
    onChange: v => setForm({
      ...form,
      firstName: v
    }),
    placeholder: "Maria",
    accent: accent
  })), React.createElement(V1ApplyField, {
    label: "Last name"
  }, React.createElement(V1ApplyInput, {
    value: form.lastName,
    onChange: v => setForm({
      ...form,
      lastName: v
    }),
    placeholder: "Rodriguez",
    accent: accent
  })), React.createElement(V1ApplyField, {
    label: "Email"
  }, React.createElement(V1ApplyInput, {
    type: "email",
    value: form.email,
    onChange: v => setForm({
      ...form,
      email: v
    }),
    placeholder: "you@business.com",
    accent: accent,
    inputMode: "email",
    invalid: !!form.email && !v1IsEmail(form.email)
  })), React.createElement(V1ApplyField, {
    label: "Phone"
  }, React.createElement(V1ApplyInput, {
    value: form.phone,
    onChange: v => setForm({
      ...form,
      phone: formatPhone(v)
    }),
    placeholder: "(555) 555-0199",
    accent: accent,
    inputMode: "tel",
    invalid: !!form.phone && !v1IsPhone(form.phone)
  }))));
}
function V1StepBank({
  form,
  setForm,
  accent,
  onAdvance,
  autoOpen
}) {
  const [plaidOpen, setPlaidOpen] = React.useState(false);
  const autoOpenedRef = React.useRef(false);
  React.useEffect(() => {
    if (!autoOpen) return;
    if (autoOpenedRef.current) return;
    if (form.bankConnected) return;
    autoOpenedRef.current = true;
    const t = setTimeout(() => setPlaidOpen(true), 350);
    return () => clearTimeout(t);
  }, [autoOpen, form.bankConnected]);
  const handlePlaidSuccess = data => {
    setPlaidOpen(false);
    setForm({
      ...form,
      bankConnected: true,
      bankInstitution: data.institution,
      bankAccounts: data.accounts
    });
    setTimeout(() => {
      onAdvance && onAdvance();
    }, 700);
  };
  return React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: accent
    }
  }, "Step 02 \xB7 Connect"), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 32,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: V1.ink,
      margin: '10px 0 8px',
      lineHeight: 1.1
    }
  }, "Link your deposits.", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      color: accent
    }
  }, "Read-only.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15,
      color: V1.muted,
      lineHeight: 1.55,
      margin: 0,
      maxWidth: 540
    }
  }, "90 days of deposits via Plaid. We see balances, not credentials. No ACH authorization yet \u2014 you revoke access anytime at my.plaid.com."), form.bankConnected && React.createElement("div", {
    style: {
      marginTop: 26,
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 14,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: `linear-gradient(180deg, ${accent}0A, transparent)`
    }
  }, React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 10,
      background: `linear-gradient(135deg, ${accent}, #818CF8)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: V1.white,
      fontFamily: V1.fontDisplay,
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: '-0.02em'
    }
  }, "\u2713"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 16,
      fontWeight: 600,
      color: V1.ink
    }
  }, form.bankInstitution || 'Chase', form.bankAccounts && form.bankAccounts[0] ? ` · ${form.bankAccounts[0]}` : ' · Business Complete · ••1842'), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11.5,
      color: V1.muted,
      letterSpacing: '0.06em',
      marginTop: 3
    }
  }, "90 DAYS \xB7 ", form.bankAccounts ? form.bankAccounts.length : 1, " ACCOUNT", form.bankAccounts && form.bankAccounts.length !== 1 ? 'S' : '')), React.createElement("button", {
    onClick: () => setForm({
      ...form,
      bankConnected: false
    }),
    style: {
      padding: '7px 12px',
      borderRadius: 8,
      border: `1px solid ${V1.line}`,
      background: 'transparent',
      color: V1.muted,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 12.5
    }
  }, "Re-link"))), !form.bankConnected && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      marginTop: 26,
      padding: '14px 18px',
      background: `${accent}10`,
      borderLeft: `2px solid ${accent}`,
      borderRadius: '2px 10px 10px 2px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: accent,
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      marginTop: 2
    }
  }, React.createElement("rect", {
    x: "2",
    y: "4",
    width: "12",
    height: "9",
    rx: "1.5"
  }), React.createElement("path", {
    d: "M6 4V2.5h4V4"
  }), React.createElement("circle", {
    cx: "8",
    cy: "9",
    r: "1.5"
  })), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      lineHeight: 1.55,
      color: V1.ink
    }
  }, "Plaid opens a secure popup \u2014 you enter your bank credentials with them, not us. Same infrastructure as Venmo, Chime, and Robinhood.")), React.createElement("button", {
    onClick: () => setPlaidOpen(true),
    style: {
      marginTop: 22,
      width: '100%',
      maxWidth: 420,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      background: '#000',
      color: '#fff',
      border: 'none',
      padding: '14px 22px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      fontWeight: 600,
      boxShadow: '0 8px 22px -10px rgba(0,0,0,0.5)',
      transition: 'transform .15s, box-shadow .15s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = '0 12px 28px -10px rgba(0,0,0,0.55)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 22px -10px rgba(0,0,0,0.5)';
    }
  }, React.createElement(V1PlaidLogo, {
    size: 14,
    color: "#fff"
  }), "Connect with Plaid"), React.createElement("div", {
    style: {
      marginTop: 22,
      display: 'flex',
      gap: 20,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, React.createElement("span", null, "\u26A1 256-bit TLS"), React.createElement("span", null, "\u25C7 SOC 2 Type II"), React.createElement("span", null, "\u2713 Plaid Partner"))), React.createElement(V1PlaidLink, {
    open: plaidOpen,
    onClose: () => setPlaidOpen(false),
    onSuccess: handlePlaidSuccess
  }));
}
function V1StepIdentity({
  form,
  setForm,
  accent,
  onAdvance
}) {
  const [idvOpen, setIdvOpen] = React.useState(false);
  const idvDone = !!form.idVerified;
  const handleIdvComplete = data => {
    setIdvOpen(false);
    setForm({
      ...form,
      idVerified: !!data.idVerified
    });
  };
  const [armed] = React.useState(() => !form.idVerified);
  React.useEffect(() => {
    if (armed && form.idVerified) {
      const t = setTimeout(() => {
        onAdvance && onAdvance();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [armed, form.idVerified, onAdvance]);
  return React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: accent
    }
  }, "Step 03 \xB7 Identity"), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 32,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: V1.ink,
      margin: '10px 0 8px',
      lineHeight: 1.1
    }
  }, "Verify identity."), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15,
      color: V1.muted,
      lineHeight: 1.55,
      margin: 0,
      maxWidth: 520
    }
  }, "ID + selfie via Plaid IDV for KYC. Soft-pull on the guarantor. No impact to your personal credit."), React.createElement("div", {
    style: {
      marginTop: 26,
      padding: '18px 20px',
      background: idvDone ? `${V1.green}0E` : V1.white,
      border: `1px solid ${idvDone ? V1.green + '55' : V1.line}`,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      maxWidth: 620
    }
  }, React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      background: idvDone ? V1.green : '#000',
      color: '#fff',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, idvDone ? React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 16 16"
  }, React.createElement("path", {
    d: "M3 8.2L6.5 11.5 13 5",
    stroke: "currentColor",
    strokeWidth: "2.2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })) : React.createElement(V1PlaidLogo, {
    size: 14,
    color: "#fff"
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 15,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.015em'
    }
  }, idvDone ? 'Identity verified via Plaid IDV' : 'Verify your identity with Plaid'), React.createElement("div", {
    style: {
      marginTop: 3,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, idvDone ? 'ID match · Selfie match · No further action' : 'Government ID + selfie · ~ 60 seconds')), !idvDone && React.createElement("button", {
    onClick: () => setIdvOpen(true),
    style: {
      padding: '10px 16px',
      borderRadius: 8,
      background: '#000',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 13,
      fontWeight: 600
    }
  }, "Begin verification")), React.createElement(V1IDVerify, {
    open: idvOpen,
    onClose: () => setIdvOpen(false),
    onComplete: handleIdvComplete
  }), React.createElement("div", {
    style: {
      marginTop: 32,
      padding: '18px 20px',
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 12,
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      maxWidth: 620
    }
  }, React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: `${accent}14`,
      color: accent,
      flexShrink: 0,
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
    d: "M8 2L3 5v4c0 3 2 4.5 5 6 3-1.5 5-3 5-6V5L8 2z"
  }), React.createElement("path", {
    d: "M6 8l1.5 1.5L10 7"
  }))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 14.5,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.015em'
    }
  }, "Soft inquiry only"), React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      color: V1.muted,
      lineHeight: 1.55,
      maxWidth: 500
    }
  }, "A hard pull happens only if you counter-sign the offer on the next screen \u2014 and only on the personal guarantor, not the business."))));
}
function V1StepOffer({
  form,
  prefill,
  accent
}) {
  const amount = prefill?.high || form.amount || 75000;
  const factor = prefill?.factor || 1.18;
  const total = Math.round(amount * factor);
  const term = 8;
  const weekly = Math.round(total / (term * 4.33));
  const daily = Math.round(total / (term * 22));
  const offerId = React.useMemo(() => `DLT-2026-${Math.floor(100000 + Math.random() * 900000)}`, []);
  return React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: accent
    }
  }, "Step 04 \xB7 Offer"), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 32,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: V1.ink,
      margin: '10px 0 8px',
      lineHeight: 1.1
    }
  }, "Your offer.", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      color: accent
    }
  }, "One page.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15,
      color: V1.muted,
      lineHeight: 1.55,
      margin: 0,
      maxWidth: 540
    }
  }, "No addenda, no \"processing fee\", no origination fee. Counter-sign to move to funding."), React.createElement("div", {
    style: {
      marginTop: 26,
      borderRadius: 16,
      overflow: 'hidden',
      border: `1px solid ${V1.line}`,
      boxShadow: '0 20px 50px -28px rgba(15,14,23,0.35)'
    }
  }, React.createElement("div", {
    style: {
      background: V1.ink,
      color: V1.white,
      padding: '28px 28px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -120,
      right: -80,
      width: 300,
      height: 300,
      background: `radial-gradient(circle, ${accent}40, transparent 60%)`,
      filter: 'blur(10px)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 20,
      position: 'relative'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Advance amount"), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 56,
      fontWeight: 600,
      letterSpacing: '-0.04em',
      marginTop: 4,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1
    }
  }, "$", amount.toLocaleString()), React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      color: 'rgba(255,255,255,0.7)'
    }
  }, "Wires same-day when signed before 2:00 PM ET")), React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Offer ID"), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 13.5,
      color: V1.white,
      marginTop: 6,
      letterSpacing: '0.04em'
    }
  }, offerId), React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 10px',
      borderRadius: 99,
      background: `${accent}22`,
      color: accent,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 99,
      background: accent
    }
  }), "Locked 72h")))), React.createElement("div", {
    style: {
      background: V1.white,
      padding: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }, [['Factor rate', `${factor.toFixed(2)}×`], ['Total repayment', `$${total.toLocaleString()}`], ['Term', `${term} months`], ['Weekly debit', `$${weekly.toLocaleString()}`]].map(([k, v], i) => React.createElement("div", {
    key: k,
    style: {
      padding: '22px 20px',
      borderRight: i < 3 ? `1px solid ${V1.line}` : 'none'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, k), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 600,
      color: V1.ink,
      marginTop: 6,
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)))), React.createElement("div", {
    style: {
      padding: '14px 22px',
      background: V1.bg,
      borderTop: `1px solid ${V1.line}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, React.createElement("span", null, "No origination \xB7 No ACH \xB7 Early-pay rebate"), React.createElement("span", null, "$", daily.toLocaleString(), " / day equiv."))), React.createElement("p", {
    style: {
      marginTop: 16,
      fontFamily: V1.fontBody,
      fontSize: 12.5,
      color: V1.muted,
      lineHeight: 1.5,
      maxWidth: 620
    }
  }, "By accepting, you agree to Delt's standard advance agreement. You'll receive a signed PDF and a payment schedule by email within 60 seconds of counter-signing."));
}
function V1StepDone({
  form,
  accent
}) {
  const ref = React.useMemo(() => `DLT-2026-${Math.floor(100000 + Math.random() * 900000)}`, []);
  return React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '24px 0 16px'
    }
  }, React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      margin: '0 auto',
      borderRadius: 24,
      position: 'relative',
      background: `linear-gradient(135deg, ${accent}, #818CF8)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 30px 80px -20px ${accent}88`
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: -12,
      borderRadius: 30,
      border: `2px solid ${accent}66`,
      animation: 'v1apPing 1.8s cubic-bezier(0,.55,.45,1) infinite'
    }
  }), React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M10 20l7 7 13-14"
  }))), React.createElement("style", null, `
        @keyframes v1apPing { 0%{transform:scale(.85);opacity:.8} 80%,100%{transform:scale(1.4);opacity:0} }
      `), React.createElement("div", {
    style: {
      marginTop: 22,
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: accent
    }
  }, "Counter-signed"), React.createElement("h3", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 36,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: V1.ink,
      margin: '12px 0 8px',
      lineHeight: 1.1
    }
  }, "You're funded.", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      color: accent
    }
  }, "Tomorrow by 2 PM.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15,
      color: V1.muted,
      lineHeight: 1.6,
      margin: '0 auto 26px',
      maxWidth: 480
    }
  }, "Funds will hit your connected Chase account by 2:00 PM ET tomorrow. Contract + amortization schedule are on the way to", ' ', React.createElement("b", {
    style: {
      color: V1.ink
    }
  }, form.email || 'your email'), "."), React.createElement("div", {
    style: {
      maxWidth: 480,
      margin: '0 auto',
      padding: '16px 20px',
      background: V1.bg,
      border: `1px solid ${V1.line}`,
      borderRadius: 12,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 0
    }
  }, [['REF', ref], ['FUND BY', '2:00 PM ET'], ['TEAM', 'Elena Morgan']].map(([k, v], i) => React.createElement("div", {
    key: k,
    style: {
      textAlign: 'center',
      borderRight: i < 2 ? `1px solid ${V1.line}` : 'none'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      color: V1.muted
    }
  }, k), React.createElement("div", {
    style: {
      marginTop: 3,
      fontFamily: V1.fontMono,
      fontSize: 12.5,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '0.02em'
    }
  }, v)))));
}
function V1ApplicationFlow({
  open,
  onClose,
  prefill,
  accent,
  startStep = 0,
  autoOpenPlaid = false,
  onDraftChange,
  onComplete
}) {
  const [step, setStep] = React.useState(startStep);
  const [form, setForm] = React.useState({
    businessName: prefill?.lead?.businessName || '',
    ein: '',
    legalForm: '',
    firstName: prefill?.lead?.firstName || '',
    lastName: '',
    email: prefill?.lead?.email || '',
    phone: prefill?.lead?.phone || '',
    state: '',
    bankConnected: false,
    bankInstitution: '',
    bankAccounts: null,
    idVerified: false,
    amount: prefill?.high || 75000
  });
  React.useEffect(() => {
    if (!open || !prefill?.lead) return;
    setForm(f => ({
      ...f,
      businessName: f.businessName || prefill.lead.businessName || '',
      firstName: f.firstName || prefill.lead.firstName || '',
      email: f.email || prefill.lead.email || '',
      phone: f.phone || prefill.lead.phone || '',
      amount: prefill.high || f.amount
    }));
  }, [open, prefill]);
  const [closing, setClosing] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setStep(startStep);
      setClosing(false);
    }
  }, [open, startStep]);
  React.useEffect(() => {
    if (!open) return;
    if (typeof onDraftChange !== 'function') return;
    onDraftChange({
      ...(prefill || {}),
      lead: {
        firstName: form.firstName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone
      },
      pendingAmount: form.amount
    });
  }, [open, form.firstName, form.businessName, form.email, form.phone, form.amount]);
  React.useEffect(() => {
    if (open && step >= 4 && typeof onComplete === 'function') onComplete();
  }, [open, step]);
  const beaconLeadId = prefill && prefill.leadId;
  const beaconFiredRef = React.useRef({});
  const fireBeacon = React.useCallback((event, meta) => {
    if (!beaconLeadId) return;
    if (beaconFiredRef.current[event]) return;
    beaconFiredRef.current[event] = true;
    try {
      const body = JSON.stringify({
        leadId: beaconLeadId,
        event,
        meta: meta || null
      });
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([body], {
          type: 'application/json'
        });
        navigator.sendBeacon('/api/apply-progress', blob);
      } else {
        fetch('/api/apply-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body,
          keepalive: true
        }).catch(() => {});
      }
    } catch (_) {}
  }, [beaconLeadId]);
  const pixelFiredRef = React.useRef({});
  React.useEffect(() => {
    if (!open) {
      beaconFiredRef.current = {};
      pixelFiredRef.current = {};
      return;
    }
    fireBeacon('modal_opened', {
      fromEmail: !!(prefill && prefill.fromEmail)
    });
    if (!pixelFiredRef.current.opened && window.DeltPixel) {
      pixelFiredRef.current.opened = true;
      window.DeltPixel.applyStarted(form.amount, !!(prefill && prefill.fromEmail));
    }
  }, [open, fireBeacon]);
  React.useEffect(() => {
    if (!open) return;
    if (form.bankConnected) {
      fireBeacon('plaid_connected', {
        institution: form.bankInstitution || null
      });
      if (!pixelFiredRef.current.plaid && window.DeltPixel) {
        pixelFiredRef.current.plaid = true;
        window.DeltPixel.bankConnected(form.amount, form.bankInstitution);
      }
    }
  }, [open, form.bankConnected, form.bankInstitution, fireBeacon]);
  React.useEffect(() => {
    if (!open) return;
    if (form.idVerified) fireBeacon('idv_done');
  }, [open, form.idVerified, fireBeacon]);
  React.useEffect(() => {
    if (!open) return;
    if (step >= 4) {
      fireBeacon('submitted', {
        amount: form.amount
      });
      if (!pixelFiredRef.current.submitted && window.DeltPixel) {
        pixelFiredRef.current.submitted = true;
        window.DeltPixel.applicationSubmitted(form.amount);
      }
    }
  }, [open, step, form.amount, fireBeacon]);
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  if (!open && !closing) return null;
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };
  const canProceed = (() => {
    if (step === 0) return v1BusinessComplete(form);
    if (step === 1) return form.bankConnected;
    if (step === 2) return form.idVerified;
    return true;
  })();
  const modal = React.createElement("div", {
    "data-v1-apply-modal-overlay": true,
    onClick: e => {
      if (e.target === e.currentTarget) handleClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(15, 14, 23, 0.62)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      animation: `${closing ? 'v1apFadeOut' : 'v1apFadeIn'} .2s ease`
    }
  }, React.createElement("style", null, `
        @keyframes v1apFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes v1apFadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes v1apSlideIn { from { opacity: 0; transform: translateY(18px) scale(.985); } to { opacity: 1; transform: none; } }
      `), React.createElement("div", {
    "data-v1-apply-modal": true,
    style: {
      width: '100%',
      maxWidth: 1080,
      maxHeight: 'calc(100vh - 48px)',
      background: V1.bg,
      borderRadius: 20,
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      boxShadow: '0 40px 100px -20px rgba(15,14,23,0.5)',
      border: `1px solid ${V1.line}`,
      animation: 'v1apSlideIn .28s cubic-bezier(.2,.7,.3,1)'
    }
  }, React.createElement("aside", {
    style: {
      background: V1.ink,
      color: V1.white,
      padding: '30px 26px 26px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -100,
      left: -60,
      width: 300,
      height: 300,
      background: `radial-gradient(circle, ${accent}40, transparent 60%)`,
      filter: 'blur(20px)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 7,
      background: `linear-gradient(135deg, ${accent}, #818CF8)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: V1.white,
      fontFamily: V1.fontDisplay,
      fontWeight: 700,
      fontSize: 14
    }
  }, "D"), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: '-0.01em'
    }
  }, "Delt \xB7 Get funded")), React.createElement("div", {
    style: {
      marginTop: 34,
      position: 'relative',
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 15,
      top: 14,
      bottom: 14,
      width: 2,
      background: 'rgba(255,255,255,0.08)',
      borderRadius: 2
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 15,
      top: 14,
      width: 2,
      height: `calc(${step / (V1APPLY_STEPS.length - 1) * 100}% - 0px)`,
      background: `linear-gradient(180deg, ${accent}, #818CF8)`,
      borderRadius: 2,
      transition: 'height .3s ease',
      boxShadow: `0 0 12px ${accent}`
    }
  }), V1APPLY_STEPS.map((s, i) => {
    const isDone = i < step;
    const isActive = i === step;
    return React.createElement("div", {
      key: s,
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        marginBottom: 20
      }
    }, React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 99,
        flexShrink: 0,
        background: isDone ? `linear-gradient(135deg, ${accent}, #818CF8)` : isActive ? V1.white : 'rgba(255,255,255,0.06)',
        border: isActive ? `2px solid ${accent}` : 'none',
        color: isActive ? V1.ink : isDone ? V1.white : 'rgba(255,255,255,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: V1.fontMono,
        fontSize: 11.5,
        fontWeight: 700,
        transition: 'all .2s',
        boxShadow: isActive ? `0 0 0 4px ${accent}33` : 'none'
      }
    }, isDone ? React.createElement("svg", {
      width: "13",
      height: "13",
      viewBox: "0 0 13 13",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M3 7l3 3 5-6"
    })) : React.createElement("span", null, String(i + 1).padStart(2, '0'))), React.createElement("div", {
      style: {
        paddingTop: 5
      }
    }, React.createElement("div", {
      style: {
        fontFamily: V1.fontMono,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: isActive || isDone ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)'
      }
    }, "Step ", String(i + 1).padStart(2, '0')), React.createElement("div", {
      style: {
        fontFamily: V1.fontDisplay,
        fontSize: 15,
        fontWeight: 600,
        color: isActive ? V1.white : isDone ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
        marginTop: 2,
        letterSpacing: '-0.015em'
      }
    }, s)));
  })), React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 20,
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.4)'
    }
  }, "Trust & security"), React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: V1.fontBody,
      fontSize: 12,
      color: 'rgba(255,255,255,0.72)'
    }
  }, React.createElement("div", null, "\u25B8 Soft-pull only (until countersign)"), React.createElement("div", null, "\u25B8 Plaid read-only \u2014 no ACH yet"), React.createElement("div", null, "\u25B8 Data purged 30d if declined")))), React.createElement("div", {
    "data-v1-apply-body": true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: V1.bg,
      overflow: 'hidden',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      padding: '18px 32px',
      borderBottom: `1px solid ${V1.line}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: V1.white
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, step + 1, " / ", V1APPLY_STEPS.length, " \xB7 ", V1APPLY_STEPS[step]), React.createElement("button", {
    onClick: handleClose,
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: 'transparent',
      border: `1px solid ${V1.line}`,
      color: V1.muted,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s, color .15s, border-color .15s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = V1.bg;
      e.currentTarget.style.color = V1.ink;
      e.currentTarget.style.borderColor = V1.ink;
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = V1.muted;
      e.currentTarget.style.borderColor = V1.line;
    },
    "aria-label": "Close"
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M3 3L11 11M11 3L3 11"
  })))), React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '38px 40px'
    }
  }, step === 0 && React.createElement(V1StepBusiness, {
    form: form,
    setForm: setForm,
    accent: accent
  }), step === 1 && React.createElement(V1StepBank, {
    form: form,
    setForm: setForm,
    accent: accent,
    onAdvance: () => setStep(2),
    autoOpen: autoOpenPlaid
  }), step === 2 && React.createElement(V1StepIdentity, {
    form: form,
    setForm: setForm,
    accent: accent,
    onAdvance: () => setStep(3)
  }), step === 3 && React.createElement(V1StepOffer, {
    form: form,
    prefill: prefill,
    accent: accent
  }), step === 4 && React.createElement(V1StepDone, {
    form: form,
    accent: accent
  })), React.createElement("div", {
    "data-v1-modal-footer": true,
    style: {
      padding: '16px 32px',
      borderTop: `1px solid ${V1.line}`,
      background: V1.white,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, step < 4 ? '🔒 Secured · Plaid · Soft-pull only' : 'Application received'), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, step < 2 && React.createElement("button", {
    onClick: () => {
      setForm(f => ({
        ...f,
        businessName: f.businessName || 'Test Co',
        email: f.email || 'test@example.com',
        bankConnected: true,
        bankInstitution: f.bankInstitution || 'Test Bank'
      }));
      setStep(2);
    },
    style: {
      padding: '7px 10px',
      borderRadius: 6,
      background: 'transparent',
      border: `1px dashed ${V1.muted}`,
      color: V1.muted,
      cursor: 'pointer',
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }, "Skip \u2192 Identity"), step > 0 && step < 4 && React.createElement("button", {
    onClick: () => setStep(step - 1),
    style: {
      padding: '11px 18px',
      borderRadius: 10,
      background: 'transparent',
      border: `1px solid ${V1.line}`,
      color: V1.ink,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 14,
      fontWeight: 500,
      transition: 'background .15s, border-color .15s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = V1.bg;
      e.currentTarget.style.borderColor = V1.ink;
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = V1.line;
    }
  }, "Back"), step < 3 && React.createElement("button", {
    onClick: () => canProceed && setStep(step + 1),
    disabled: !canProceed,
    style: {
      padding: '11px 22px',
      borderRadius: 10,
      border: 'none',
      background: canProceed ? accent : V1.line,
      color: canProceed ? V1.white : V1.muted,
      fontFamily: V1.fontBody,
      fontSize: 14,
      fontWeight: 600,
      cursor: canProceed ? 'pointer' : 'not-allowed',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      transition: 'filter .15s, transform .1s, box-shadow .15s',
      boxShadow: canProceed ? `0 8px 22px -10px ${accent}aa` : 'none'
    },
    onMouseEnter: e => {
      if (canProceed) {
        e.currentTarget.style.filter = 'brightness(1.08)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }
    },
    onMouseLeave: e => {
      if (canProceed) {
        e.currentTarget.style.filter = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }
  }, "Continue", React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14"
  }, React.createElement("path", {
    d: "M3 7h8M8 4l3 3-3 3",
    stroke: "currentColor",
    strokeWidth: "1.8",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), step === 3 && React.createElement("button", {
    onClick: () => setStep(4),
    style: {
      padding: '11px 22px',
      borderRadius: 10,
      border: 'none',
      background: `linear-gradient(135deg, ${accent}, #818CF8)`,
      color: V1.white,
      fontFamily: V1.fontBody,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: `0 10px 28px -10px ${accent}aa`,
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
  }, "Accept offer", React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14"
  }, React.createElement("path", {
    d: "M3 7h8M8 4l3 3-3 3",
    stroke: "currentColor",
    strokeWidth: "1.8",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), step === 4 && React.createElement("button", {
    onClick: handleClose,
    style: {
      padding: '11px 22px',
      borderRadius: 10,
      background: V1.ink,
      color: V1.white,
      border: 'none',
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 14,
      fontWeight: 600
    }
  }, "Close"))))));
  return ReactDOM.createPortal(modal, document.body);
}
Object.assign(window, {
  V1ApplicationFlow
});