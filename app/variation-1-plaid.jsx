// V1 Plaid integrations — UI-faithful recreations of Plaid Link + Plaid IDV
// for the static prototype.
//
// Production seam: window.PlaidIntegration provides a thin abstraction so a
// real backend (link-token mint + public-token exchange) can be swapped in
// later without changing any consumer code. The default `simulated`
// implementation walks through fake stages with realistic timings; replacing
// `mintLinkToken` + `exchangePublicToken` is enough to wire real Plaid.
//
// Two components exported on window:
//   - V1PlaidLink({ open, onClose, onSuccess })  — bank-account connect flow
//   - V1IDVerify({ open, onClose, onComplete })  — Plaid IDV recreation

window.PlaidIntegration = window.PlaidIntegration || {
  // Replace this with: fetch('/api/create-link-token').then(r => r.json())
  mintLinkToken: () => new Promise((res) => setTimeout(() => res({
    link_token: 'sandbox-recreation-' + Date.now(),
  }), 700)),
  // Replace with: fetch('/api/exchange-token', { method: 'POST', body }).then(...)
  exchangePublicToken: (publicToken) => new Promise((res) => setTimeout(() => res({
    success: true, item_id: 'item_' + Math.random().toString(36).slice(2, 10),
  }), 400)),
};

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

// ─── Institutions list (recreation — not a real Plaid Link search) ──
const V1_PLAID_INSTITUTIONS = [
  { id: 'chase', name: 'Chase',                color: '#117ACA' },
  { id: 'boa',   name: 'Bank of America',      color: '#E31837' },
  { id: 'wf',    name: 'Wells Fargo',          color: '#D71E28' },
  { id: 'cap1',  name: 'Capital One',          color: '#004977' },
  { id: 'usbk',  name: 'U.S. Bank',            color: '#0F1B5C' },
  { id: 'pnc',   name: 'PNC Bank',             color: '#FF6900' },
  { id: 'cit',   name: 'Citibank',             color: '#003B70' },
  { id: 'amex',  name: 'American Express',     color: '#016FD0' },
];

// ─── V1PlaidLink ─────────────────────────────────────────────────
// Stages: loading → intro → institutions → credentials → linking → success
function V1PlaidLink({ open, onClose, onSuccess }) {
  const [stage, setStage] = React.useState('loading');
  const [linkToken, setLinkToken] = React.useState(null);
  const [inst, setInst] = React.useState(null);
  const [user, setUser] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStage('loading'); setLinkToken(null); setInst(null);
        setUser(''); setPw(''); setErr(null);
      }, 260);
      return () => clearTimeout(t);
    }
    setStage('loading');
    setErr(null);
    window.PlaidIntegration.mintLinkToken()
      .then((d) => { setLinkToken(d.link_token); setStage('intro'); })
      .catch(() => { setErr('Could not reach Plaid. Try again.'); setStage('intro'); });
  }, [open]);

  if (!open) return null;

  const finishLink = () => {
    setStage('linking');
    const accounts = [
      { name: `${inst.name} Business Checking`, mask: '4421' },
      { name: `${inst.name} Operating Reserve`, mask: '0182' },
    ];
    // In real Plaid, the SDK fires onSuccess(public_token, metadata) directly.
    // Here we mint a fake public token and exchange it for parity.
    const publicToken = 'public-recreation-' + Math.random().toString(36).slice(2, 10);
    window.PlaidIntegration.exchangePublicToken(publicToken).then(() => {
      setStage('success');
      setTimeout(() => {
        onSuccess && onSuccess({
          institution: inst.name,
          accounts: accounts.map(a => `${a.name} ••${a.mask}`),
          item_id: 'item_recreation',
          link_token: linkToken,
        });
      }, 900);
    });
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
            color: '#475569', textAlign: 'center', marginBottom: 22,
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
          <button onClick={() => setStage('institutions')} style={{
            width: '100%', background: '#000', color: '#fff', border: 'none',
            padding: '13px 16px', borderRadius: 10, cursor: 'pointer',
            fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.005em',
          }}>Continue</button>
          <div style={{
            marginTop: 12, fontFamily: V1.fontMono, fontSize: 10, color: '#94a3b8',
            textAlign: 'center', letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>Bank-grade encryption · Read-only</div>
        </div>
      )}

      {stage === 'institutions' && (
        <div style={{ padding: '20px 0 24px' }}>
          <div style={{ padding: '0 24px 14px' }}>
            <div style={{
              fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 700,
              color: '#0F0E17', marginBottom: 10,
            }}>Select your bank</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 12px', background: '#F1F5F9',
              border: '1px solid #E2E8F0', borderRadius: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.6">
                <circle cx="7" cy="7" r="4.5"/><path d="M14 14l-3.5-3.5"/>
              </svg>
              <span style={{ fontFamily: V1.fontBody, fontSize: 13, color: '#94a3b8' }}>Search 12,000+ banks</span>
            </div>
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {V1_PLAID_INSTITUTIONS.map(b => (
              <button
                key={b.id}
                onClick={() => { setInst(b); setStage('credentials'); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 24px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderTop: '1px solid #F1F5F9', textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: b.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: V1.fontDisplay, fontSize: 13, fontWeight: 700,
                }}>{b.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
                <span style={{ flex: 1, fontFamily: V1.fontBody, fontSize: 14, color: '#0F0E17' }}>{b.name}</span>
                <span style={{ color: '#94a3b8' }}>
                  <svg width="12" height="12" viewBox="0 0 14 14"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'credentials' && (
        <div style={{ padding: '22px 24px 26px' }}>
          <button onClick={() => setStage('institutions')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#64748b', padding: 0, marginBottom: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: V1.fontBody, fontSize: 13,
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 6,
              background: inst.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: V1.fontDisplay, fontSize: 13, fontWeight: 700,
            }}>{inst.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
            <div style={{ fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 700, color: '#0F0E17' }}>{inst.name}</div>
          </div>
          <div style={{ fontFamily: V1.fontBody, fontSize: 12.5, color: '#475569', lineHeight: 1.5, marginBottom: 18 }}>
            Enter your <b>{inst.name}</b> credentials. Plaid encrypts and never shares them with Delt.
          </div>
          {[['Username', user, setUser, 'text'], ['Password', pw, setPw, 'password']].map(([label, val, set, type]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6,
              }}>{label}</label>
              <input
                type={type} value={val} onChange={(e) => set(e.target.value)}
                style={{
                  width: '100%', padding: '11px 12px',
                  border: '1px solid #E2E8F0', borderRadius: 8,
                  fontFamily: V1.fontBody, fontSize: 14, color: '#0F0E17',
                  outline: 'none', background: '#fff',
                }}
              />
            </div>
          ))}
          <button
            onClick={finishLink}
            disabled={!user || !pw}
            style={{
              width: '100%', marginTop: 8,
              background: (!user || !pw) ? '#CBD5E1' : '#000', color: '#fff', border: 'none',
              padding: '12px 16px', borderRadius: 10,
              cursor: (!user || !pw) ? 'not-allowed' : 'pointer',
              fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600,
            }}>Submit</button>
          <div style={{
            marginTop: 14, padding: '10px 12px',
            background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8,
            fontFamily: V1.fontMono, fontSize: 10, color: '#64748b',
            letterSpacing: '0.04em', lineHeight: 1.5,
          }}>
            Demo: any non-empty values will succeed. Real Plaid uses your actual bank login,
            encrypted in transit and never shared with Delt.
          </div>
        </div>
      )}

      {stage === 'linking' && (
        <div style={{ padding: '36px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <V1HandoffLogos />
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            border: '3px solid #e2e8f0', borderTopColor: '#0a0a0a',
            animation: 'v1plaidSpin 700ms linear infinite',
          }} />
          <div style={{ fontFamily: V1.fontBody, fontSize: 14, color: '#0F0E17' }}>Linking your accounts…</div>
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
            {inst ? inst.name : 'Your bank'} is connected. Returning to Delt…
          </div>
        </div>
      )}
    </V1PlaidShell>
  );
}

// ─── V1IDVerify — Plaid IDV recreation ─────────────────────────
// Stages: intro → id-capture → id-review → selfie-capture → selfie-review →
// processing → done.  Mirrors Plaid's IDV flow: ID document upload, then
// selfie with a smile prompt, then a "matching face geometry" processing
// state, then a verified confirmation.
function V1IDVerify({ open, onClose, onComplete }) {
  const [stage, setStage] = React.useState('intro');

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setStage('intro'), 260);
      return () => clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    if (stage === 'processing') {
      const t = setTimeout(() => setStage('done'), 1700);
      return () => clearTimeout(t);
    }
    if (stage === 'done') {
      const t = setTimeout(() => {
        onComplete && onComplete({ idVerified: true });
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [stage, onComplete]);

  if (!open) return null;

  const stepIdx = ({ intro: 0, 'id-capture': 1, 'id-review': 1, 'selfie-capture': 2, 'selfie-review': 2, processing: 3, done: 3 }[stage]) || 0;
  const progressPct = (stepIdx / 3) * 100;

  return (
    <V1PlaidShell onClose={onClose} title="Plaid · IDV">
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
              background: '#0a0a0a',
              transition: 'width 360ms cubic-bezier(0.22, 1, 0.36, 1)',
            }} />
          </div>
          <span style={{
            fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b',
          }}>
            {stage.startsWith('id') ? 'ID' : stage.startsWith('selfie') ? 'Selfie' : stage === 'processing' ? 'Verifying' : 'Done'}
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
          <button onClick={() => setStage('id-capture')} style={{
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

      {(stage === 'id-capture' || stage === 'id-review') && (
        <div style={{ padding: '14px 24px 24px' }}>
          <div style={{
            textAlign: 'center', marginBottom: 10, marginTop: 8,
            fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 700, color: '#0F0E17',
          }}>
            {stage === 'id-capture' ? 'Capture your ID' : 'Use this image?'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{
              border: '2px dashed #CBD5E1', borderRadius: 10, padding: 8,
              background: '#fff',
            }}>
              {/* Stylised ID card mock */}
              <div style={{
                width: 240, height: 142, borderRadius: 6,
                background: 'linear-gradient(135deg, #ECFDF5 0%, #DCFCE7 100%)',
                position: 'relative', padding: 12,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: V1.fontMono, fontSize: 7.5, letterSpacing: '0.14em', color: 'rgba(6,95,70,0.65)', textTransform: 'uppercase' }}>State of</div>
                    <div style={{ fontFamily: V1.fontDisplay, fontSize: 10, fontWeight: 700, color: '#065F46', marginTop: 2 }}>DRIVER LICENSE</div>
                  </div>
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: 'rgba(16,185,129,0.55)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                  <div style={{ width: 36, height: 46, borderRadius: 3, background: 'rgba(16,185,129,0.35)' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ height: 4, width: 96, borderRadius: 2, background: 'rgba(16,185,129,0.5)' }} />
                    <div style={{ height: 4, width: 70, borderRadius: 2, background: 'rgba(16,185,129,0.4)' }} />
                    <div style={{ height: 4, width: 110, borderRadius: 2, background: 'rgba(16,185,129,0.3)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: '#F1F5F9',
              fontFamily: V1.fontMono, fontSize: 10, color: '#475569',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3.5" width="10" height="7" rx="1.2"/><circle cx="7" cy="7" r="2"/>
              </svg>
              Make sure image is clear
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {stage === 'id-capture' ? (
              <>
                <button onClick={() => setStage('id-review')} style={{
                  flex: 1, background: '#000', color: '#fff', border: 'none',
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600,
                }}>Capture</button>
                <button onClick={() => setStage('selfie-capture')} style={{
                  background: 'transparent', color: '#64748b',
                  border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: 10,
                  cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                }}>Skip</button>
              </>
            ) : (
              <>
                <button onClick={() => setStage('id-capture')} style={{
                  flex: 1, background: 'transparent', color: '#0F0E17',
                  border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: 10,
                  cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                }}>Retake</button>
                <button onClick={() => setStage('selfie-capture')} style={{
                  flex: 1, background: '#000', color: '#fff', border: 'none',
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600,
                }}>Use this image</button>
              </>
            )}
          </div>
        </div>
      )}

      {(stage === 'selfie-capture' || stage === 'selfie-review') && (
        <div style={{ padding: '14px 24px 24px' }}>
          <div style={{
            textAlign: 'center', marginBottom: 10, marginTop: 8,
            fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 700, color: '#0F0E17',
          }}>
            {stage === 'selfie-capture' ? 'Take a quick selfie' : 'Use this selfie?'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{
              position: 'relative', width: 180, height: 220,
              borderRadius: 999, overflow: 'hidden',
              border: '2px solid #1F845A',
              background: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            }}>
              {/* Stylised face placeholder */}
              <svg width="120" height="160" viewBox="0 0 120 160" style={{ marginBottom: -4 }}>
                <ellipse cx="60" cy="60" rx="38" ry="44" fill="#FCD34D" />
                <circle cx="48" cy="56" r="3" fill="#451A03" />
                <circle cx="72" cy="56" r="3" fill="#451A03" />
                <path d="M50 76 Q60 84 70 76" stroke="#451A03" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <path d="M28 110 Q60 96 92 110 L92 160 L28 160 Z" fill="#0F172A" />
              </svg>
              {/* Smile-detection corner marks */}
              {[[12, 12, 'tl'], [168, 12, 'tr'], [12, 208, 'bl'], [168, 208, 'br']].map(([x, y, k], i) => (
                <span key={i} style={{
                  position: 'absolute', left: x, top: y,
                  width: 14, height: 14, pointerEvents: 'none',
                  borderTop: k.startsWith('t') ? '2px solid #1F845A' : 'none',
                  borderBottom: k.startsWith('b') ? '2px solid #1F845A' : 'none',
                  borderLeft: k.endsWith('l') ? '2px solid #1F845A' : 'none',
                  borderRight: k.endsWith('r') ? '2px solid #1F845A' : 'none',
                }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: '#F1F5F9',
              fontFamily: V1.fontMono, fontSize: 10, color: '#475569',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="6"/><path d="M5.5 9.5 Q8 11.5 10.5 9.5 M5.5 6.5h0.01 M10.5 6.5h0.01"/>
              </svg>
              {stage === 'selfie-capture' ? 'Smile! Center your face' : 'Looks good'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {stage === 'selfie-capture' ? (
              <>
                <button onClick={() => setStage('selfie-review')} style={{
                  flex: 1, background: '#000', color: '#fff', border: 'none',
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600,
                }}>Capture</button>
                <button onClick={() => setStage('processing')} style={{
                  background: 'transparent', color: '#64748b',
                  border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: 10,
                  cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                }}>Skip</button>
              </>
            ) : (
              <>
                <button onClick={() => setStage('selfie-capture')} style={{
                  flex: 1, background: 'transparent', color: '#0F0E17',
                  border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: 10,
                  cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                }}>Retake</button>
                <button onClick={() => setStage('processing')} style={{
                  flex: 1, background: '#000', color: '#fff', border: 'none',
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600,
                }}>Use this selfie</button>
              </>
            )}
          </div>
        </div>
      )}

      {stage === 'processing' && (
        <div style={{ padding: '36px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <V1HandoffLogos />
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            border: '3px solid #e2e8f0', borderTopColor: '#0a0a0a',
            animation: 'v1plaidSpin 700ms linear infinite',
          }} />
          <div style={{
            fontFamily: V1.fontBody, fontSize: 14, color: '#0F0E17', textAlign: 'center',
            maxWidth: 260, lineHeight: 1.5,
          }}>Matching ID and selfie face geometry…</div>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 10, color: '#94a3b8',
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>Plaid IDV · Encrypted</div>
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
    </V1PlaidShell>
  );
}

Object.assign(window, { V1PlaidLink, V1IDVerify, V1PlaidLogo });
