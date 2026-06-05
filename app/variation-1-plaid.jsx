// V1 Plaid integrations — wired to the real Plaid sandbox.
//
// window.PlaidIntegration is the seam to /api/plaid-* serverless functions.
// Two consumer components, kept on window for use from variation-1-apply.jsx:
//   - V1PlaidLink({ open, onClose, onSuccess })  — bank connect via Plaid Link SDK
//   - V1IDVerify({ open, onClose, onComplete })  — Plaid IDV with QR mobile handoff
//
// Mobile flow: V1IDVerify creates an identity_verification with is_shareable: true,
// renders the returned shareable_url as a QR code so the applicant can scan with
// their phone camera, completes ID + selfie capture on the phone, and the desktop
// polls /api/plaid-get-idv-status until status flips to "success".

// Build an Error from a non-2xx /api/plaid-* response, carrying the Plaid
// error_code + error_message forward so catch handlers can show a useful
// hint in the modal instead of a generic "try again" message.
function V1PlaidThrowFromResponse(data, fallbackLabel) {
  const e = new Error(data.error || fallbackLabel);
  e.plaidCode = data.code || null;
  e.plaidMessage = data.error_message || null;
  e.plaidType = data.error_type || null;
  return e;
}

// ─── window.PlaidIntegration: real fetches against /api/plaid-* ─────
window.PlaidIntegration = window.PlaidIntegration || {
  mintLinkToken: (productKind = 'bank') =>
    fetch('/api/plaid-create-link-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientUserId: V1PlaidGetClientUserId(),
        productKind,
      }),
    }).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw V1PlaidThrowFromResponse(data, 'mintLinkToken failed');
      return data;
    }),

  exchangePublicToken: (publicToken) =>
    fetch('/api/plaid-exchange-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token: publicToken }),
    }).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw V1PlaidThrowFromResponse(data, 'exchangePublicToken failed');
      return data;
    }),

  // `clientUserId` is optional — pass a fresh one (V1PlaidFreshClientUserId)
  // on retry so a failed/terminal IDV session is never re-entered. `user` is
  // optional PII (firstName/lastName/email/phone) forwarded so Plaid can
  // pre-fill / streamline the identity + phone-verification steps.
  createIDV: (clientUserId, user) =>
    fetch('/api/plaid-create-idv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientUserId: clientUserId || V1PlaidGetClientUserId(), user }),
    }).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw V1PlaidThrowFromResponse(data, 'createIDV failed');
      return data;
    }),

  pollIDV: (id) =>
    fetch(`/api/plaid-get-idv-status?id=${encodeURIComponent(id)}`).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw V1PlaidThrowFromResponse(data, 'pollIDV failed');
      return data;
    }),

  // Poll the hosted-link session so the desktop can detect when the user
  // finishes connecting their bank on their phone (the QR handoff).
  getLinkStatus: (linkToken) =>
    fetch('/api/plaid-get-link-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link_token: linkToken }),
    }).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw V1PlaidThrowFromResponse(data, 'getLinkStatus failed');
      return data;
    }),
};

// Stable client_user_id per browser so repeat IDV/Link sessions tie back to
// the same Plaid record. localStorage-backed; falls back to memory if storage
// is unavailable (private mode in some browsers).
function V1PlaidGetClientUserId() {
  const KEY = 'delt.plaid.clientUserId';
  try {
    let v = localStorage.getItem(KEY);
    if (!v) {
      v = 'delt-' + (crypto && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36));
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

// A one-off client_user_id for a retry. Plaid keys identity verifications by
// (client_user_id + template_id), so reusing the stable id can re-enter a
// session that's already failed/expired. A fresh id guarantees a clean run.
function V1PlaidFreshClientUserId() {
  const rnd = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : (Math.random().toString(36).slice(2) + Date.now().toString(36));
  return 'delt-retry-' + rnd;
}

// Map Plaid's IDV `steps` object to a human reason for the step that failed,
// so a failed verification says *what* went wrong (e.g. the selfie) instead of
// a generic message. Each step value is a status string
// ('success' | 'failed' | 'active' | 'expired' | 'canceled' | ...).
function V1IDVFailedStepReason(steps) {
  if (!steps || typeof steps !== 'object') return null;
  const LABELS = {
    selfie_check: 'the selfie / face match',
    documentary_verification: 'the ID document scan',
    kyc_check: 'the identity details (KYC)',
    verify_sms: 'phone verification',
    risk_check: 'the risk check',
    accept_tos: 'the consent step',
  };
  const terminal = ['failed', 'expired', 'canceled'];
  for (const key of Object.keys(LABELS)) {
    const v = (steps[key] || '').toString().toLowerCase();
    if (terminal.includes(v)) return LABELS[key];
  }
  return null;
}

// Turn a thrown create/poll error into friendly { title, body, code } copy so
// the modal shows a human message instead of dumping Plaid's raw error string.
function V1IDVErrorCopy(e) {
  const code = (e && e.plaidCode) || null;
  switch (code) {
    case 'INVALID_FIELD':
      // Should be handled by is_idempotent server-side; this is a safety net.
      return { title: 'A verification is already in progress',
               body: 'Tap “Begin verification” again to pick up where you left off.', code };
    case 'INVALID_API_KEYS':
    case 'INVALID_API_KEY':
    case 'INVALID_SECRET':
      return { title: 'Verification is temporarily unavailable',
               body: 'Identity checks aren’t configured correctly right now. Please try again later or contact support.', code };
    case 'PRODUCT_NOT_READY':
    case 'INTERNAL_SERVER_ERROR':
    case 'PLAID_ERROR':
      return { title: 'Plaid had a brief hiccup',
               body: 'The verification service is momentarily unavailable. Give it a few seconds and try again.', code };
    case 'RATE_LIMIT_EXCEEDED':
      return { title: 'Too many attempts',
               body: 'Please wait a moment before starting another verification.', code };
    default:
      return { title: 'Could not start verification',
               body: 'Something went wrong starting your ID check. Please try again.', code };
  }
}

// Clean inline alert for IDV errors. Accepts a { title, body, code } object
// (or a plain string for back-compat) and renders an icon + headline + concise
// body, with the technical code tucked into a small "Ref:" line for support.
function V1IDVAlert({ err }) {
  if (!err) return null;
  const title = typeof err === 'string' ? null : err.title;
  const body  = typeof err === 'string' ? err  : err.body;
  const code  = typeof err === 'string' ? null : err.code;
  return (
    <div role="alert" style={{
      background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
      padding: '12px 14px', marginBottom: 14, textAlign: 'left',
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#DC2626"
           strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
           style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="8" cy="8" r="6.5" /><path d="M8 5v3.5M8 11h.01" />
      </svg>
      <div>
        {title && (
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 13.5, fontWeight: 700,
            color: '#991B1B', marginBottom: 2,
          }}>{title}</div>
        )}
        <div style={{
          fontFamily: V1.fontBody, fontSize: 12.5, lineHeight: 1.5, color: '#B91C1C',
        }}>{body}</div>
        {code && (
          <div style={{
            marginTop: 6, fontFamily: V1.fontMono, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D69A9A',
          }}>Ref: {code}</div>
        )}
      </div>
    </div>
  );
}

// ─── Plaid logo (4-square grid mark) ─────────────────────────────
function V1PlaidLogo({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" fill={color}/>
    </svg>
  );
}

// ─── Plaid modal shell — black header, soft drop, white card ────
function V1PlaidShell({ children, onClose, title = 'Plaid' }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 80,
      background: 'rgba(4, 30, 66, 0.42)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'v1plaidFade 200ms cubic-bezier(0.22, 1, 0.36, 1) both',
    }} onClick={onClose}>
      <style>{`
        @keyframes v1plaidFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes v1plaidPop  { from { opacity: 0; transform: translateY(8px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes v1plaidSpin { to { transform: rotate(360deg) } }
        @keyframes v1plaidCheckPop { 0% { transform: scale(0) } 70% { transform: scale(1.12) } 100% { transform: scale(1) } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 18, width: '100%', maxWidth: 380,
          overflow: 'hidden', boxShadow: '0 24px 60px -10px rgba(4,30,66,0.5)',
          animation: 'v1plaidPop 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 0', color: '#0a0a0a',
        }}>
          <span style={{ width: 18 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <V1PlaidLogo size={14} color="#0a0a0a" />
            <span style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>{title}</span>
          </span>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 0, color: '#94a3b8', display: 'inline-flex',
          }}>
            <svg width="18" height="18" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Dual-logo handoff (Delt favicon + Plaid mark, overlapping) ──
function V1HandoffLogos() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 999,
        background: V1.blue, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
      }}>D</div>
      <div style={{
        width: 42, height: 42, borderRadius: 999,
        background: '#000', color: '#fff', marginLeft: -8,
        border: '2px solid #fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <V1PlaidLogo size={15} color="#fff" />
      </div>
    </div>
  );
}

// ─── QR rendering helper ────────────────────────────────────────
// `dataUrl` is a base64 PNG generated server-side by the qrcode npm
// package in api/plaid-create-link-token.js / api/plaid-create-idv.js.
// Server-side rendering keeps the Plaid hosted_link / shareable_url
// inside our own infrastructure — earlier iterations either depended on
// a flaky in-browser qrcode UMD build (window.QRCode never loaded) or
// routed the URL through api.qrserver.com (third-party leak). When the
// data URL is missing (server-side QR render failed), show a graceful
// fallback that points at the "Or open the link here" anchor.
function V1PlaidQR({ dataUrl, size = 196 }) {
  return (
    <div style={{
      padding: 12, background: '#fff', borderRadius: 12,
      border: '1px solid #E2E8F0', display: 'inline-flex',
      width: size + 24, height: size + 24,
      alignItems: 'center', justifyContent: 'center',
    }}>
      {dataUrl ? (
        <img src={dataUrl} width={size} height={size} alt="QR code" style={{ display: 'block' }} />
      ) : (
        <div style={{
          fontFamily: V1.fontBody, fontSize: 11.5, color: '#64748b',
          textAlign: 'center', padding: '0 8px', lineHeight: 1.4,
        }}>Couldn't render QR — use the link below.</div>
      )}
    </div>
  );
}

// ─── V1PlaidLink ─────────────────────────────────────────────────
// Real Plaid Link SDK. Stages:
//   intro → opening (SDK overlays our modal) → success
//   intro → mobile (QR of hosted_link_url, polling deferred to manual confirm)
function V1PlaidLink({ open, onClose, onSuccess }) {
  const [stage, setStage] = React.useState('loading');
  const [tokenData, setTokenData] = React.useState(null);  // { link_token, hosted_link_url }
  const [err, setErr] = React.useState(null);
  const [linkedSummary, setLinkedSummary] = React.useState(null); // { institution_name, accounts }
  const handlerRef = React.useRef(null);
  const pollTimerRef = React.useRef(null);
  const pollStoppedRef = React.useRef(false);

  function stopLinkPolling() {
    pollStoppedRef.current = true;
    if (pollTimerRef.current) { clearTimeout(pollTimerRef.current); pollTimerRef.current = null; }
  }

  // Exchange a public_token and report success — shared by the desktop SDK
  // callback and the mobile hosted-link poller so both paths advance the step.
  const finishWithPublicToken = async (publicToken) => {
    const result = await window.PlaidIntegration.exchangePublicToken(publicToken);
    setLinkedSummary({
      institution_name: result.institution_name || 'Your bank',
      accounts: result.accounts || [],
    });
    setStage('success');
    setTimeout(() => {
      const accountStrs = (result.accounts || []).map((a) =>
        a.mask ? `${a.name} ••${a.mask}` : a.name);
      onSuccess && onSuccess({
        institution: result.institution_name || 'Bank',
        accounts: accountStrs,
        item_id: result.item_id,
      });
    }, 900);
  };

  // Poll the hosted-link session until the phone finishes (or it expires), then
  // finish exactly like the desktop SDK's onSuccess. Mirrors the IDV poller.
  function startLinkPolling(linkToken) {
    if (!linkToken) return;
    pollStoppedRef.current = false;
    const tick = async () => {
      if (pollStoppedRef.current) return;
      try {
        const res = await window.PlaidIntegration.getLinkStatus(linkToken);
        if (pollStoppedRef.current) return;
        const status = (res.status || '').toLowerCase();
        if (status === 'completed' && res.public_token) {
          stopLinkPolling();
          try { await finishWithPublicToken(res.public_token); }
          catch (e) { console.error(e); setErr('Could not finish linking. Try again.'); setStage('intro'); }
          return;
        }
        if (status === 'expired') {
          stopLinkPolling();
          setErr('That mobile link expired. Tap “Use my phone instead” for a fresh code.');
          setStage('intro');
          return;
        }
        // status === 'pending' → keep polling
      } catch (e) {
        console.warn('link status poll error:', e && e.message);
      }
      pollTimerRef.current = setTimeout(tick, 3000);
    };
    pollTimerRef.current = setTimeout(tick, 2000);
  }

  // Reset on close. Tear down the Plaid SDK handler synchronously so its
  // document-level listeners can't swallow clicks on the page behind.
  React.useEffect(() => {
    if (!open) {
      stopLinkPolling();
      if (handlerRef.current && handlerRef.current.destroy) {
        try { handlerRef.current.destroy(); } catch (_) {}
      }
      handlerRef.current = null;
      const t = setTimeout(() => {
        setStage('loading'); setTokenData(null); setErr(null); setLinkedSummary(null);
      }, 260);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Hard cleanup: stop any poll timer if the component unmounts mid-handoff.
  React.useEffect(() => () => stopLinkPolling(), []);

  // Mint a link_token whenever the modal opens.
  React.useEffect(() => {
    if (!open) return;
    setStage('loading'); setErr(null);
    window.PlaidIntegration.mintLinkToken('bank')
      .then((d) => {
        if (!d.link_token) throw new Error('No link_token returned');
        setTokenData(d);
        setStage('intro');
      })
      .catch((e) => {
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
      onSuccess: async (publicToken /*, metadata */) => {
        try {
          await finishWithPublicToken(publicToken);
        } catch (e) {
          console.error(e);
          const code = e && e.plaidCode ? ` (${e.plaidCode})` : '';
          const msg = e && e.plaidMessage ? ` — ${e.plaidMessage}` : '';
          setErr(`Could not finish linking${code}${msg}. Try again.`);
          setStage('intro');
        }
      },
      onExit: (exitErr /*, metadata */) => {
        // User closed Plaid Link. Drop back to our intro so they can retry
        // or pick the mobile path.
        if (exitErr) {
          setErr(exitErr.display_message || exitErr.error_message || 'Plaid Link exited.');
        }
        setStage('intro');
      },
    });
    handlerRef.current.open();
  };

  return (
    <V1PlaidShell onClose={onClose}>
      {stage === 'loading' && (
        <div style={{ padding: '28px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <V1HandoffLogos />
          <div style={{
            width: 26, height: 26, borderRadius: 999,
            border: '2px solid #e2e8f0', borderTopColor: '#0a0a0a',
            animation: 'v1plaidSpin 700ms linear infinite',
          }} />
          <div style={{ fontFamily: V1.fontBody, fontSize: 13, color: '#64748b' }}>Connecting to Plaid…</div>
        </div>
      )}

      {stage === 'intro' && (
        <div style={{ padding: '24px 24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <V1HandoffLogos />
          </div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 700,
            letterSpacing: '-0.02em', color: '#0F0E17',
            textAlign: 'center', marginBottom: 8,
          }}>Delt uses Plaid to connect your bank</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.55,
            color: '#475569', textAlign: 'center', marginBottom: 18,
          }}>
            Plaid lets you securely link your account in seconds. Delt sees
            balances and 90 days of deposits — never your credentials.
          </div>
          {err && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
              padding: '10px 12px', marginBottom: 14,
              fontFamily: V1.fontBody, fontSize: 12.5, color: '#991B1B',
            }}>{err}</div>
          )}
          <button onClick={launchHere} disabled={!tokenData} style={{
            width: '100%', background: tokenData ? '#000' : '#CBD5E1', color: '#fff', border: 'none',
            padding: '13px 16px', borderRadius: 10,
            cursor: tokenData ? 'pointer' : 'not-allowed',
            fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.005em',
          }}>Continue with Plaid</button>
          {tokenData && tokenData.hosted_link_url && (
            <button onClick={() => { setErr(null); setStage('mobile'); startLinkPolling(tokenData.link_token); }} style={{
              width: '100%', marginTop: 10,
              background: 'transparent', color: '#0F0E17',
              border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: 10,
              cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="8" height="12" rx="1.5"/><path d="M7 12h2"/>
              </svg>
              Use my phone instead
            </button>
          )}
          <div style={{
            marginTop: 12, fontFamily: V1.fontMono, fontSize: 10, color: '#94a3b8',
            textAlign: 'center', letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>Bank-grade encryption · Read-only</div>
        </div>
      )}

      {stage === 'opening' && (
        <div style={{ padding: '36px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <V1HandoffLogos />
          <div style={{
            width: 26, height: 26, borderRadius: 999,
            border: '2px solid #e2e8f0', borderTopColor: '#0a0a0a',
            animation: 'v1plaidSpin 700ms linear infinite',
          }} />
          <div style={{ fontFamily: V1.fontBody, fontSize: 13, color: '#64748b', textAlign: 'center', maxWidth: 240, lineHeight: 1.5 }}>
            Plaid is opening… complete the connection in the Plaid window.
          </div>
        </div>
      )}

      {stage === 'mobile' && tokenData && tokenData.hosted_link_url && (
        <div style={{ padding: '20px 24px 26px', textAlign: 'center' }}>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700,
            color: '#0F0E17', marginBottom: 6,
          }}>Continue on your phone</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13, color: '#475569',
            lineHeight: 1.5, marginBottom: 16,
          }}>
            Scan with your phone camera to connect your bank on mobile.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <V1PlaidQR dataUrl={tokenData.hosted_link_qr} size={196} />
          </div>
          <a
            href={tokenData.hosted_link_url}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-block', marginBottom: 14,
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#0F0E17', borderBottom: '1px dashed #94a3b8',
            }}
          >Or open the link here</a>
          <div style={{
            margin: '0 auto', padding: '10px 12px', maxWidth: 'max-content',
            background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10,
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: 999,
              border: '2px solid #E2E8F0', borderTopColor: '#0a0a0a',
              animation: 'v1plaidSpin 700ms linear infinite',
            }} />
            <span style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: '#475569',
            }}>Waiting for your phone…</span>
          </div>
          <button onClick={() => { stopLinkPolling(); setStage('intro'); }} style={{
            display: 'block', margin: '14px auto 0',
            background: 'transparent', color: '#64748b', border: 'none',
            cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 12.5,
          }}>← Back</button>
        </div>
      )}

      {stage === 'success' && (
        <div style={{ padding: '34px 24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999,
            background: 'rgba(31,132,90,0.12)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: '#fff', border: '2px solid #1F845A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'v1plaidCheckPop 480ms cubic-bezier(0.22,1,0.36,1) both',
            }}>
              <svg width="20" height="20" viewBox="0 0 16 16" style={{ color: '#1F845A' }}>
                <path d="M3 8.2L6.5 11.5 13 5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 700,
            letterSpacing: '-0.02em', color: '#0F0E17',
          }}>You're all set</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13.5, color: '#64748b',
            textAlign: 'center', maxWidth: 280, lineHeight: 1.5,
          }}>
            {(linkedSummary && linkedSummary.institution_name) || 'Your bank'} is connected. Returning to Delt…
          </div>
        </div>
      )}
    </V1PlaidShell>
  );
}

// ─── V1IDVerify — Plaid Identity Verification with QR mobile handoff ──
// Stages:
//   intro → creating → choose-device → mobile-handoff (polling) → done
//   any-stage → failed (with retry)
function V1IDVerify({ open, onClose, onComplete, user }) {
  const [stage, setStage] = React.useState('intro');
  const [idv, setIdv] = React.useState(null);     // { identity_verification_id, shareable_url, status }
  const [err, setErr] = React.useState(null);
  const pollTimerRef = React.useRef(null);
  const stoppedRef = React.useRef(false);

  // Cleanup on close.
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStage('intro'); setIdv(null); setErr(null);
      }, 260);
      stopPolling();
      return () => clearTimeout(t);
    } else {
      stoppedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Auto-advance from done → onComplete after the green check shows.
  React.useEffect(() => {
    if (stage === 'done') {
      const t = setTimeout(() => {
        onComplete && onComplete({ idVerified: true });
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [stage, onComplete]);

  // Hard cleanup: kill any pending poll timer if the component unmounts
  // entirely (e.g. user navigates away from the apply flow mid-IDV).
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
        if (status === 'success') { stopPolling(); setStage('done'); return; }
        if (status === 'failed' || status === 'expired' || status === 'canceled') {
          stopPolling();
          const stepReason = V1IDVFailedStepReason(res.steps);
          setErr({
            title: status === 'expired'  ? 'Verification expired'
                 : status === 'canceled' ? 'Verification canceled'
                 : 'Verification didn’t pass',
            body: status === 'expired'  ? 'The session timed out before it finished. Start a new verification.'
                : status === 'canceled' ? 'The verification was canceled before it finished.'
                : stepReason ? `Plaid couldn’t verify ${stepReason}.`
                : 'Plaid couldn’t finish verifying your identity.',
          });
          setStage('failed');
          return;
        }
        // status === 'active' (or pending) → keep polling
      } catch (e) {
        // Don't kill the polling loop on a transient network blip; show
        // a quiet inline note and keep trying.
        console.warn('IDV poll error:', e && e.message);
      }
      pollTimerRef.current = setTimeout(tick, 3000);
    };
    pollTimerRef.current = setTimeout(tick, 1500);
  }

  async function beginVerification(clientUserId, isAutoFresh) {
    // Guard against being called directly as an onClick handler (where the
    // first arg is a SyntheticEvent, not an id).
    const cuid = typeof clientUserId === 'string' ? clientUserId : undefined;
    setErr(null);
    setStage('creating');
    try {
      const res = await window.PlaidIntegration.createIDV(cuid, user);
      if (!res.identity_verification_id) {
        throw new Error('Missing identity_verification_id');
      }
      const status = (res.status || '').toLowerCase();
      // Idempotent create can return an *existing* session — branch on state.
      if (status === 'success') {
        // Already verified earlier; short-circuit straight to done.
        setIdv(res);
        setStage('done');
        return;
      }
      if ((status === 'failed' || status === 'expired' || status === 'canceled') && !isAutoFresh) {
        // The existing session is terminal — transparently start a brand-new
        // one with a fresh client_user_id so the user isn't stuck re-entering
        // a dead session. Guarded by isAutoFresh to avoid looping.
        return beginVerification(V1PlaidFreshClientUserId(), true);
      }
      if (!res.shareable_url) {
        throw new Error('Missing shareable_url');
      }
      setIdv(res);
      setStage('choose-device');
    } catch (e) {
      console.error(e);
      setErr(V1IDVErrorCopy(e));
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
    setIdv(null); setErr(null);
    // Fresh client_user_id so we never re-enter the failed/terminal session.
    beginVerification(V1PlaidFreshClientUserId());
  }

  if (!open) return null;

  const stepIdx = ({
    intro: 0, creating: 0,
    'choose-device': 1, 'mobile-handoff': 2,
    done: 3, failed: 3,
  })[stage] || 0;
  const progressPct = (stepIdx / 3) * 100;

  return (
    <V1PlaidShell onClose={() => { stopPolling(); onClose && onClose(); }} title="Plaid · IDV">
      {stage !== 'intro' && (
        <div style={{
          padding: '12px 24px 0',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            flex: 1, height: 3, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progressPct}%`,
              background: stage === 'failed' ? '#DC2626' : '#0a0a0a',
              transition: 'width 360ms cubic-bezier(0.22, 1, 0.36, 1)',
            }} />
          </div>
          <span style={{
            fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b',
          }}>
            {stage === 'creating' ? 'Starting' :
             stage === 'choose-device' ? 'Where' :
             stage === 'mobile-handoff' ? 'Verifying' :
             stage === 'failed' ? 'Failed' : 'Done'}
          </span>
        </div>
      )}

      {stage === 'intro' && (
        <div style={{ padding: '24px 24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <V1HandoffLogos />
          </div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 700,
            letterSpacing: '-0.02em', color: '#0F0E17',
            textAlign: 'center', marginBottom: 8,
          }}>Verify your identity</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.55,
            color: '#475569', textAlign: 'center', marginBottom: 22,
          }}>
            Two steps: (1) photo of a government ID, (2) a quick selfie. Plaid
            matches face geometry between the two and stores nothing afterward.
          </div>
          <V1IDVAlert err={err} />
          <button onClick={beginVerification} style={{
            width: '100%', background: '#000', color: '#fff', border: 'none',
            padding: '13px 16px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600,
          }}>Begin verification</button>
          <div style={{
            marginTop: 12, fontFamily: V1.fontMono, fontSize: 10, color: '#94a3b8',
            textAlign: 'center', letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>Encrypted · Soft-pull only</div>
        </div>
      )}

      {stage === 'creating' && (
        <div style={{ padding: '36px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <V1HandoffLogos />
          <div style={{
            width: 26, height: 26, borderRadius: 999,
            border: '2px solid #e2e8f0', borderTopColor: '#0a0a0a',
            animation: 'v1plaidSpin 700ms linear infinite',
          }} />
          <div style={{ fontFamily: V1.fontBody, fontSize: 13, color: '#64748b' }}>
            Starting verification…
          </div>
        </div>
      )}

      {stage === 'choose-device' && idv && (
        <div style={{ padding: '20px 24px 26px' }}>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700,
            color: '#0F0E17', marginBottom: 6, textAlign: 'center',
          }}>How would you like to verify?</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13, color: '#475569',
            textAlign: 'center', marginBottom: 18, lineHeight: 1.5,
          }}>
            Plaid IDV uses your camera to capture an ID and a selfie. A phone
            camera is usually easiest.
          </div>
          <button onClick={pickPhone} style={{
            width: '100%', background: '#000', color: '#fff', border: 'none',
            padding: '13px 16px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            marginBottom: 10,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="8" height="12" rx="1.5"/><path d="M7 12h2"/>
            </svg>
            Use my phone
          </button>
          <button onClick={pickThisDevice} style={{
            width: '100%', background: 'transparent', color: '#0F0E17',
            border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: 10,
            cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
          }}>
            Continue on this device
          </button>
        </div>
      )}

      {stage === 'mobile-handoff' && idv && (
        <div style={{ padding: '18px 24px 24px', textAlign: 'center' }}>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700,
            color: '#0F0E17', marginBottom: 6,
          }}>Scan with your phone</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13, color: '#475569',
            lineHeight: 1.5, marginBottom: 14, maxWidth: 280, margin: '0 auto 14px',
          }}>
            Open your phone's camera and point it at the code. Plaid will guide
            you through ID + selfie capture there.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <V1PlaidQR dataUrl={idv.shareable_url_qr} size={196} />
          </div>
          <a
            href={idv.shareable_url}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-block', marginBottom: 12,
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#0F0E17', borderBottom: '1px dashed #94a3b8',
            }}
          >Or open link on this device</a>
          <div style={{
            marginTop: 6, padding: '10px 12px',
            background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10,
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: 999,
              border: '2px solid #E2E8F0', borderTopColor: '#0a0a0a',
              animation: 'v1plaidSpin 700ms linear infinite',
            }} />
            <span style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: '#475569',
            }}>Waiting for verification…</span>
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div style={{ padding: '34px 24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999,
            background: 'rgba(31,132,90,0.12)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: '#fff', border: '2px solid #1F845A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'v1plaidCheckPop 480ms cubic-bezier(0.22,1,0.36,1) both',
            }}>
              <svg width="20" height="20" viewBox="0 0 16 16" style={{ color: '#1F845A' }}>
                <path d="M3 8.2L6.5 11.5 13 5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 700,
            letterSpacing: '-0.02em', color: '#0F0E17',
          }}>Identity verified</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13.5, color: '#64748b',
            textAlign: 'center', maxWidth: 260, lineHeight: 1.5,
          }}>
            Returning you to Delt…
          </div>
        </div>
      )}

      {stage === 'failed' && (
        <div style={{ padding: '24px 24px 28px', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999,
            background: 'rgba(220,38,38,0.10)', margin: '0 auto 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 5l6 6M11 5l-6 6"/>
            </svg>
          </div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700,
            color: '#0F0E17', marginBottom: 8,
          }}>{(err && err.title) || 'Verification didn’t complete'}</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13, color: '#475569',
            lineHeight: 1.55, marginBottom: 18, maxWidth: 280, margin: '0 auto 18px',
          }}>
            {((err && err.body) || 'Plaid couldn’t finish verifying your identity.') + ' You can try again.'}
          </div>
          <button onClick={retry} style={{
            width: '100%', background: '#000', color: '#fff', border: 'none',
            padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
          }}>Try again</button>
        </div>
      )}
    </V1PlaidShell>
  );
}

Object.assign(window, { V1PlaidLink, V1IDVerify, V1PlaidLogo });
