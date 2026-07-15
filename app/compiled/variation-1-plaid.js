function V1PlaidThrowFromResponse(data, fallbackLabel) {
  const e = new Error(data.error || fallbackLabel);
  e.plaidCode = data.code || null;
  e.plaidMessage = data.error_message || null;
  e.plaidType = data.error_type || null;
  return e;
}
window.PlaidIntegration = window.PlaidIntegration || {
  mintLinkToken: (productKind = 'bank') => fetch('/api/plaid-create-link-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clientUserId: V1PlaidGetClientUserId(),
      productKind
    })
  }).then(async r => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw V1PlaidThrowFromResponse(data, 'mintLinkToken failed');
    return data;
  }),
  exchangePublicToken: publicToken => fetch('/api/plaid-exchange-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      public_token: publicToken
    })
  }).then(async r => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw V1PlaidThrowFromResponse(data, 'exchangePublicToken failed');
    return data;
  }),
  createIDV: () => fetch('/api/plaid-create-idv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clientUserId: V1PlaidGetClientUserId()
    })
  }).then(async r => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw V1PlaidThrowFromResponse(data, 'createIDV failed');
    return data;
  }),
  pollIDV: id => fetch(`/api/plaid-get-idv-status?id=${encodeURIComponent(id)}`).then(async r => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw V1PlaidThrowFromResponse(data, 'pollIDV failed');
    return data;
  }),
  pollLinkStatus: linkToken => fetch('/api/plaid-get-link-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      link_token: linkToken
    })
  }).then(async r => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw V1PlaidThrowFromResponse(data, 'pollLinkStatus failed');
    return data;
  })
};
function V1PlaidGetClientUserId() {
  const KEY = 'delt.plaid.clientUserId';
  try {
    let v = localStorage.getItem(KEY);
    if (!v) {
      v = 'delt-' + (crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
      localStorage.setItem(KEY, v);
    }
    return v;
  } catch (_) {
    if (!window.__deltPlaidUid) {
      window.__deltPlaidUid = 'delt-mem-' + Math.random().toString(36).slice(2);
    }
    return window.__deltPlaidUid;
  }
}
function V1PlaidLogo({
  size = 16,
  color = 'currentColor'
}) {
  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true
  }, React.createElement("path", {
    d: "M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z",
    fill: color
  }));
}
function V1PlaidShell({
  children,
  onClose,
  title = 'Plaid'
}) {
  return React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      background: 'rgba(4, 30, 66, 0.42)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      animation: 'v1plaidFade 200ms cubic-bezier(0.22, 1, 0.36, 1) both'
    },
    onClick: onClose
  }, React.createElement("style", null, `
        @keyframes v1plaidFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes v1plaidPop  { from { opacity: 0; transform: translateY(8px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes v1plaidSpin { to { transform: rotate(360deg) } }
        @keyframes v1plaidCheckPop { 0% { transform: scale(0) } 70% { transform: scale(1.12) } 100% { transform: scale(1) } }
      `), React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: '#fff',
      borderRadius: 18,
      width: '100%',
      maxWidth: 380,
      overflow: 'hidden',
      boxShadow: '0 24px 60px -10px rgba(4,30,66,0.5)',
      animation: 'v1plaidPop 280ms cubic-bezier(0.22, 1, 0.36, 1) both'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 20px 0',
      color: '#0a0a0a'
    }
  }, React.createElement("span", {
    style: {
      width: 18
    }
  }), React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement(V1PlaidLogo, {
    size: 14,
    color: "#0a0a0a"
  }), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    }
  }, title)), React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      color: '#94a3b8',
      display: 'inline-flex'
    }
  }, React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 14 14"
  }, React.createElement("path", {
    d: "M3 3l8 8M11 3l-8 8",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  })))), children));
}
function V1HandoffLogos() {
  return React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      background: V1.blue,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "D"), React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 999,
      background: '#000',
      color: '#fff',
      marginLeft: -8,
      border: '2px solid #fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(V1PlaidLogo, {
    size: 15,
    color: "#fff"
  })));
}
function V1PlaidQR({
  dataUrl,
  size = 196
}) {
  return React.createElement("div", {
    style: {
      padding: 12,
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #E2E8F0',
      display: 'inline-flex',
      width: size + 24,
      height: size + 24,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, dataUrl ? React.createElement("img", {
    src: dataUrl,
    width: size,
    height: size,
    alt: "QR code",
    style: {
      display: 'block'
    }
  }) : React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 11.5,
      color: '#64748b',
      textAlign: 'center',
      padding: '0 8px',
      lineHeight: 1.4
    }
  }, "Couldn't render QR \u2014 use the link below."));
}
function V1PlaidLink({
  open,
  onClose,
  onSuccess
}) {
  const [stage, setStage] = React.useState('loading');
  const [tokenData, setTokenData] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const handlerRef = React.useRef(null);
  const pollTimerRef = React.useRef(null);
  const pollStoppedRef = React.useRef(false);
  function stopLinkPolling() {
    pollStoppedRef.current = true;
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }
  const completeWithPublicToken = React.useCallback(async (publicToken, instHint) => {
    try {
      const result = await window.PlaidIntegration.exchangePublicToken(publicToken);
      const accountStrs = (result.accounts || []).map(a => a.mask ? `${a.name} ••${a.mask}` : a.name);
      onSuccess && onSuccess({
        institution: result.institution_name || instHint || 'Bank',
        accounts: accountStrs,
        item_id: result.item_id
      });
    } catch (e) {
      console.error(e);
      const code = e && e.plaidCode ? ` (${e.plaidCode})` : '';
      const msg = e && e.plaidMessage ? ` — ${e.plaidMessage}` : '';
      setErr(`Could not finish linking${code}${msg}. Try again.`);
      setStage('intro');
    }
  }, [onSuccess]);
  React.useEffect(() => {
    if (!open) {
      if (handlerRef.current && handlerRef.current.destroy) {
        try {
          handlerRef.current.destroy();
        } catch (_) {}
      }
      handlerRef.current = null;
      stopLinkPolling();
      const t = setTimeout(() => {
        setStage('loading');
        setTokenData(null);
        setErr(null);
      }, 260);
      return () => clearTimeout(t);
    }
  }, [open]);
  React.useEffect(() => () => stopLinkPolling(), []);
  React.useEffect(() => {
    if (stage !== 'mobile') return;
    if (!tokenData || !tokenData.link_token) return;
    pollStoppedRef.current = false;
    const linkToken = tokenData.link_token;
    const tick = async () => {
      if (pollStoppedRef.current) return;
      try {
        const res = await window.PlaidIntegration.pollLinkStatus(linkToken);
        if (pollStoppedRef.current) return;
        if (res && res.status === 'success' && res.public_token) {
          stopLinkPolling();
          completeWithPublicToken(res.public_token, res.institution_name);
          return;
        }
      } catch (e) {
        console.warn('link status poll error:', e && e.message);
      }
      pollTimerRef.current = setTimeout(tick, 3000);
    };
    pollTimerRef.current = setTimeout(tick, 1500);
    return () => stopLinkPolling();
  }, [stage, tokenData, completeWithPublicToken]);
  React.useEffect(() => {
    if (!open) return;
    setStage('loading');
    setErr(null);
    window.PlaidIntegration.mintLinkToken('bank').then(d => {
      if (!d.link_token) throw new Error('No link_token returned');
      setTokenData(d);
      setStage('intro');
    }).catch(e => {
      console.error(e);
      const code = e && e.plaidCode ? ` (${e.plaidCode})` : '';
      const msg = e && e.plaidMessage ? ` — ${e.plaidMessage}` : '';
      setErr(`Could not reach Plaid${code}${msg}. Try again.`);
      setStage('intro');
    });
  }, [open]);
  if (!open) return null;
  const launchHere = () => {
    if (!tokenData || !tokenData.link_token || !window.Plaid || !window.Plaid.create) {
      setErr('Plaid Link SDK is not available.');
      return;
    }
    setErr(null);
    setStage('opening');
    handlerRef.current = window.Plaid.create({
      token: tokenData.link_token,
      onSuccess: (publicToken) => {
        completeWithPublicToken(publicToken);
      },
      onExit: (exitErr) => {
        if (exitErr) {
          setErr(exitErr.display_message || exitErr.error_message || 'Plaid Link exited.');
        }
        setStage('intro');
      }
    });
    handlerRef.current.open();
  };
  return React.createElement(V1PlaidShell, {
    onClose: onClose
  }, stage === 'loading' && React.createElement("div", {
    style: {
      padding: '28px 24px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, React.createElement(V1HandoffLogos, null), React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 999,
      border: '2px solid #e2e8f0',
      borderTopColor: '#0a0a0a',
      animation: 'v1plaidSpin 700ms linear infinite'
    }
  }), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: '#64748b'
    }
  }, "Connecting to Plaid\u2026")), stage === 'intro' && React.createElement("div", {
    style: {
      padding: '24px 24px 28px'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 18
    }
  }, React.createElement(V1HandoffLogos, null)), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#0F0E17',
      textAlign: 'center',
      marginBottom: 8
    }
  }, "Delt uses Plaid to connect your bank"), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      lineHeight: 1.55,
      color: '#475569',
      textAlign: 'center',
      marginBottom: 18
    }
  }, "Plaid lets you securely link your account in seconds. Delt sees balances and 90 days of deposits \u2014 never your credentials."), err && React.createElement("div", {
    style: {
      background: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: 8,
      padding: '10px 12px',
      marginBottom: 14,
      fontFamily: V1.fontBody,
      fontSize: 12.5,
      color: '#991B1B'
    }
  }, err), React.createElement("button", {
    onClick: launchHere,
    disabled: !tokenData,
    style: {
      width: '100%',
      background: tokenData ? '#000' : '#CBD5E1',
      color: '#fff',
      border: 'none',
      padding: '13px 16px',
      borderRadius: 10,
      cursor: tokenData ? 'pointer' : 'not-allowed',
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      fontWeight: 600,
      letterSpacing: '-0.005em'
    }
  }, "Continue with Plaid"), tokenData && tokenData.hosted_link_url && React.createElement("button", {
    onClick: () => setStage('mobile'),
    style: {
      width: '100%',
      marginTop: 10,
      background: 'transparent',
      color: '#0F0E17',
      border: '1px solid #E2E8F0',
      padding: '12px 16px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("rect", {
    x: "4",
    y: "2",
    width: "8",
    height: "12",
    rx: "1.5"
  }), React.createElement("path", {
    d: "M7 12h2"
  })), "Use my phone instead"), React.createElement("div", {
    style: {
      marginTop: 12,
      fontFamily: V1.fontMono,
      fontSize: 10,
      color: '#94a3b8',
      textAlign: 'center',
      letterSpacing: '0.14em',
      textTransform: 'uppercase'
    }
  }, "Bank-grade encryption \xB7 Read-only")), stage === 'opening' && React.createElement("div", {
    style: {
      padding: '36px 24px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, React.createElement(V1HandoffLogos, null), React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 999,
      border: '2px solid #e2e8f0',
      borderTopColor: '#0a0a0a',
      animation: 'v1plaidSpin 700ms linear infinite'
    }
  }), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: '#64748b',
      textAlign: 'center',
      maxWidth: 240,
      lineHeight: 1.5
    }
  }, "Plaid is opening\u2026 complete the connection in the Plaid window.")), stage === 'mobile' && tokenData && tokenData.hosted_link_url && React.createElement("div", {
    style: {
      padding: '20px 24px 26px',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 700,
      color: '#0F0E17',
      marginBottom: 6
    }
  }, "Continue on your phone"), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: '#475569',
      lineHeight: 1.5,
      marginBottom: 16
    }
  }, "Scan with your phone camera to connect your bank on mobile."), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 16
    }
  }, React.createElement(V1PlaidQR, {
    dataUrl: tokenData.hosted_link_qr,
    size: 196
  })), React.createElement("a", {
    href: tokenData.hosted_link_url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-block',
      marginBottom: 14,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#0F0E17',
      borderBottom: '1px dashed #94a3b8'
    }
  }, "Or open the link here"), React.createElement("div", {
    style: {
      margin: '0 auto',
      padding: '10px 12px',
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: 10,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 999,
      border: '2px solid #E2E8F0',
      borderTopColor: '#0a0a0a',
      animation: 'v1plaidSpin 700ms linear infinite'
    }
  }), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#475569'
    }
  }, "Waiting for connection\u2026")), React.createElement("button", {
    onClick: () => {
      stopLinkPolling();
      setStage('intro');
    },
    style: {
      display: 'block',
      margin: '12px auto 0',
      background: 'transparent',
      color: '#64748b',
      border: 'none',
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 12.5
    }
  }, "\u2190 Back")));
}
function V1IDVerify({
  open,
  onClose,
  onComplete
}) {
  const [stage, setStage] = React.useState('intro');
  const [idv, setIdv] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const pollTimerRef = React.useRef(null);
  const stoppedRef = React.useRef(false);
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStage('intro');
        setIdv(null);
        setErr(null);
      }, 260);
      stopPolling();
      return () => clearTimeout(t);
    } else {
      stoppedRef.current = false;
    }
  }, [open]);
  React.useEffect(() => {
    if (stage === 'done') {
      const t = setTimeout(() => {
        onComplete && onComplete({
          idVerified: true
        });
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [stage, onComplete]);
  React.useEffect(() => () => stopPolling(), []);
  function stopPolling() {
    stoppedRef.current = true;
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }
  function startPolling(id) {
    stoppedRef.current = false;
    const tick = async () => {
      if (stoppedRef.current) return;
      try {
        const res = await window.PlaidIntegration.pollIDV(id);
        if (stoppedRef.current) return;
        const status = (res.status || '').toLowerCase();
        if (status === 'success') {
          stopPolling();
          setStage('done');
          return;
        }
        if (status === 'failed' || status === 'expired' || status === 'canceled') {
          stopPolling();
          setErr(status === 'expired' ? 'Session expired. Start a new verification.' : status === 'canceled' ? 'Verification was canceled.' : 'Verification could not be completed.');
          setStage('failed');
          return;
        }
      } catch (e) {
        console.warn('IDV poll error:', e && e.message);
      }
      pollTimerRef.current = setTimeout(tick, 3000);
    };
    pollTimerRef.current = setTimeout(tick, 1500);
  }
  async function beginVerification() {
    setErr(null);
    setStage('creating');
    try {
      const res = await window.PlaidIntegration.createIDV();
      if (!res.shareable_url || !res.identity_verification_id) {
        throw new Error('Missing shareable_url or id');
      }
      setIdv(res);
      setStage('choose-device');
    } catch (e) {
      console.error(e);
      const code = e && e.plaidCode ? ` (${e.plaidCode})` : '';
      const msg = e && e.plaidMessage ? ` — ${e.plaidMessage}` : '';
      setErr(`Could not start verification${code}${msg}. Try again.`);
      setStage('intro');
    }
  }
  function pickThisDevice() {
    if (!idv) return;
    window.open(idv.shareable_url, '_blank', 'noopener');
    setStage('mobile-handoff');
    startPolling(idv.identity_verification_id);
  }
  function pickPhone() {
    if (!idv) return;
    setStage('mobile-handoff');
    startPolling(idv.identity_verification_id);
  }
  function retry() {
    stopPolling();
    setIdv(null);
    setErr(null);
    beginVerification();
  }
  if (!open) return null;
  const stepIdx = {
    intro: 0,
    creating: 0,
    'choose-device': 1,
    'mobile-handoff': 2,
    done: 3,
    failed: 3
  }[stage] || 0;
  const progressPct = stepIdx / 3 * 100;
  return React.createElement(V1PlaidShell, {
    onClose: () => {
      stopPolling();
      onClose && onClose();
    },
    title: "Plaid \xB7 IDV"
  }, stage !== 'intro' && React.createElement("div", {
    style: {
      padding: '12px 24px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement("div", {
    style: {
      flex: 1,
      height: 3,
      background: '#E2E8F0',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      height: '100%',
      width: `${progressPct}%`,
      background: stage === 'failed' ? '#DC2626' : '#0a0a0a',
      transition: 'width 360ms cubic-bezier(0.22, 1, 0.36, 1)'
    }
  })), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#64748b'
    }
  }, stage === 'creating' ? 'Starting' : stage === 'choose-device' ? 'Where' : stage === 'mobile-handoff' ? 'Verifying' : stage === 'failed' ? 'Failed' : 'Done')), stage === 'intro' && React.createElement("div", {
    style: {
      padding: '24px 24px 28px'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 18
    }
  }, React.createElement(V1HandoffLogos, null)), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#0F0E17',
      textAlign: 'center',
      marginBottom: 8
    }
  }, "Verify your identity"), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      lineHeight: 1.55,
      color: '#475569',
      textAlign: 'center',
      marginBottom: 22
    }
  }, "Two steps: (1) photo of a government ID, (2) a quick selfie. Plaid matches face geometry between the two and stores nothing afterward."), err && React.createElement("div", {
    style: {
      background: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: 8,
      padding: '10px 12px',
      marginBottom: 14,
      fontFamily: V1.fontBody,
      fontSize: 12.5,
      color: '#991B1B'
    }
  }, err), React.createElement("button", {
    onClick: beginVerification,
    style: {
      width: '100%',
      background: '#000',
      color: '#fff',
      border: 'none',
      padding: '13px 16px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      fontWeight: 600
    }
  }, "Begin verification"), React.createElement("div", {
    style: {
      marginTop: 12,
      fontFamily: V1.fontMono,
      fontSize: 10,
      color: '#94a3b8',
      textAlign: 'center',
      letterSpacing: '0.14em',
      textTransform: 'uppercase'
    }
  }, "Encrypted \xB7 Soft-pull only")), stage === 'creating' && React.createElement("div", {
    style: {
      padding: '36px 24px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, React.createElement(V1HandoffLogos, null), React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 999,
      border: '2px solid #e2e8f0',
      borderTopColor: '#0a0a0a',
      animation: 'v1plaidSpin 700ms linear infinite'
    }
  }), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: '#64748b'
    }
  }, "Starting verification\u2026")), stage === 'choose-device' && idv && React.createElement("div", {
    style: {
      padding: '20px 24px 26px'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 700,
      color: '#0F0E17',
      marginBottom: 6,
      textAlign: 'center'
    }
  }, "How would you like to verify?"), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: '#475569',
      textAlign: 'center',
      marginBottom: 18,
      lineHeight: 1.5
    }
  }, "Plaid IDV uses your camera to capture an ID and a selfie. A phone camera is usually easiest."), React.createElement("button", {
    onClick: pickPhone,
    style: {
      width: '100%',
      background: '#000',
      color: '#fff',
      border: 'none',
      padding: '13px 16px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 14,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("rect", {
    x: "4",
    y: "2",
    width: "8",
    height: "12",
    rx: "1.5"
  }), React.createElement("path", {
    d: "M7 12h2"
  })), "Use my phone"), React.createElement("button", {
    onClick: pickThisDevice,
    style: {
      width: '100%',
      background: 'transparent',
      color: '#0F0E17',
      border: '1px solid #E2E8F0',
      padding: '12px 16px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      fontWeight: 500
    }
  }, "Continue on this device")), stage === 'mobile-handoff' && idv && React.createElement("div", {
    style: {
      padding: '18px 24px 24px',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 700,
      color: '#0F0E17',
      marginBottom: 6
    }
  }, "Scan with your phone"), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: '#475569',
      lineHeight: 1.5,
      marginBottom: 14,
      maxWidth: 280,
      margin: '0 auto 14px'
    }
  }, "Open your phone's camera and point it at the code. Plaid will guide you through ID + selfie capture there."), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 14
    }
  }, React.createElement(V1PlaidQR, {
    dataUrl: idv.shareable_url_qr,
    size: 196
  })), React.createElement("a", {
    href: idv.shareable_url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-block',
      marginBottom: 12,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#0F0E17',
      borderBottom: '1px dashed #94a3b8'
    }
  }, "Or open link on this device"), React.createElement("div", {
    style: {
      marginTop: 6,
      padding: '10px 12px',
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: 10,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 999,
      border: '2px solid #E2E8F0',
      borderTopColor: '#0a0a0a',
      animation: 'v1plaidSpin 700ms linear infinite'
    }
  }), React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#475569'
    }
  }, "Waiting for verification\u2026"))), stage === 'done' && React.createElement("div", {
    style: {
      padding: '34px 24px 36px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 999,
      background: 'rgba(31,132,90,0.12)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      background: '#fff',
      border: '2px solid #1F845A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'v1plaidCheckPop 480ms cubic-bezier(0.22,1,0.36,1) both'
    }
  }, React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 16 16",
    style: {
      color: '#1F845A'
    }
  }, React.createElement("path", {
    d: "M3 8.2L6.5 11.5 13 5",
    stroke: "currentColor",
    strokeWidth: "2.2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#0F0E17'
    }
  }, "Identity verified"), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      color: '#64748b',
      textAlign: 'center',
      maxWidth: 260,
      lineHeight: 1.5
    }
  }, "Returning you to Delt\u2026")), stage === 'failed' && React.createElement("div", {
    style: {
      padding: '24px 24px 28px',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 999,
      background: 'rgba(220,38,38,0.10)',
      margin: '0 auto 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "#DC2626",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M5 5l6 6M11 5l-6 6"
  }))), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 700,
      color: '#0F0E17',
      marginBottom: 8
    }
  }, "Verification didn't complete"), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: '#475569',
      lineHeight: 1.55,
      marginBottom: 18,
      maxWidth: 280,
      margin: '0 auto 18px'
    }
  }, err || 'Plaid couldn\'t finish verifying your identity.', " You can try again."), React.createElement("button", {
    onClick: retry,
    style: {
      width: '100%',
      background: '#000',
      color: '#fff',
      border: 'none',
      padding: '12px 16px',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 14,
      fontWeight: 600
    }
  }, "Try again")));
}
Object.assign(window, {
  V1PlaidLink,
  V1IDVerify,
  V1PlaidLogo
});