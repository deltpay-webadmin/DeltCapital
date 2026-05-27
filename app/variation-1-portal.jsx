// V1 Customer Portal — what the customer lands on after the Supabase Auth
// magic-link redirects them back to /?portal=1#access_token=…
//
// Lifecycle on this page:
//   1. Look in localStorage for a Supabase access_token (the Variation1
//      router stashed it there on first paint after the redirect).
//   2. GET /api/customer-status with Authorization: Bearer <token>.
//      → Server validates with Supabase, looks up the lead by email,
//        returns { status, firstName, businessName, estimate, … }.
//   3. Render one of four states keyed off status:
//        approved        — success, "you're cleared, here's next steps"
//        pending         — under review, set expectations on timing
//        denied          — soft decline with an apply-again CTA
//        no_application  — authenticated but no matching lead row
//
// Token storage keys (must match Variation1's hash-callback effect):
//   deltcap:sb:access_token
//   deltcap:sb:refresh_token

const PORTAL_LS = {
  access:  'deltcap:sb:access_token',
  refresh: 'deltcap:sb:refresh_token',
  expires: 'deltcap:sb:expires_at',
};

function readPortalToken() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const tok = window.localStorage.getItem(PORTAL_LS.access);
    if (!tok) return null;
    // expires_at is unix seconds from Supabase's auth payload. If it's in
    // the past, treat as no-session — caller will route to login. The
    // server will reject it anyway, but failing fast saves a roundtrip.
    const expRaw = window.localStorage.getItem(PORTAL_LS.expires);
    if (expRaw) {
      const exp = Number(expRaw);
      if (Number.isFinite(exp) && exp * 1000 < Date.now()) {
        clearPortalToken();
        return null;
      }
    }
    return tok;
  } catch (_) { return null; }
}

function clearPortalToken() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(PORTAL_LS.access);
    window.localStorage.removeItem(PORTAL_LS.refresh);
    window.localStorage.removeItem(PORTAL_LS.expires);
  } catch (_) {}
}

// ─── Status card ─────────────────────────────────────────────────
// One presentational shell per status — copy + accent color come from
// `STATUS_VIEWS` below. Kept as a single component so the entry / exit
// animations are consistent across verdicts (avoids the "jumping card"
// effect when the API resolves a different status than what we guessed).
function V1PortalStatusCard({ view, data, onApply, onTalk, onSignOut }) {
  const mounted = useV1Mounted(60);
  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
    transition: `opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const e = (data && data.estimate) || {};
  const hasRange = Number(e.low) > 0 && Number(e.high) > 0;
  const fmtMoney = (n) => '$' + Math.round(Number(n) || 0).toLocaleString();
  const fmtDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: `1px solid ${V1.line}`,
      boxShadow: '0 24px 60px -32px rgba(4,30,66,0.22)',
      padding: '40px 44px',
      ...enter(80),
    }}>
      {/* Verdict ribbon — accent dot + uppercase label */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: view.accent,
        ...enter(140),
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: 999,
          background: view.accent,
          boxShadow: `0 0 0 4px ${view.accent}22`,
        }} />
        {view.eyebrow}
      </div>

      <h2 style={{
        fontFamily: V1.fontDisplay,
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.035em',
        color: V1.ink,
        margin: '20px 0 0',
        ...enter(200),
      }}>
        {typeof view.headline === 'function' ? view.headline(data) : view.headline}
      </h2>

      <p style={{
        fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.55,
        color: V1.text,
        margin: '20px 0 0', maxWidth: 560,
        ...enter(260),
      }}>
        {typeof view.body === 'function' ? view.body(data) : view.body}
      </p>

      {/* Summary strip — only when we have an estimate to show */}
      {hasRange && (
        <div style={{
          marginTop: 36, paddingTop: 28,
          borderTop: `1px solid ${V1.line}`,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 24,
          ...enter(320),
        }}>
          <div>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
            }}>Offer range</div>
            <div style={{
              fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 700,
              color: V1.ink, marginTop: 6, letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}>{fmtMoney(e.low)}–{fmtMoney(e.high)}</div>
          </div>
          {data.businessName && (
            <div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              }}>Business</div>
              <div style={{
                fontFamily: V1.fontBody, fontSize: 16, fontWeight: 500,
                color: V1.ink, marginTop: 6,
              }}>{data.businessName}</div>
            </div>
          )}
          {fmtDate(data.submittedAt || data.createdAt) && (
            <div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              }}>Applied</div>
              <div style={{
                fontFamily: V1.fontBody, fontSize: 16, fontWeight: 500,
                color: V1.ink, marginTop: 6,
              }}>{fmtDate(data.submittedAt || data.createdAt)}</div>
            </div>
          )}
          {fmtDate(data.decidedAt) && data.status !== 'pending' && (
            <div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              }}>Decision</div>
              <div style={{
                fontFamily: V1.fontBody, fontSize: 16, fontWeight: 500,
                color: V1.ink, marginTop: 6,
              }}>{fmtDate(data.decidedAt)}</div>
            </div>
          )}
        </div>
      )}

      {/* Next steps — bulleted list rendered per view */}
      {view.steps && view.steps.length > 0 && (
        <div style={{ marginTop: 36, ...enter(380) }}>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
            marginBottom: 14,
          }}>What happens next</div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {view.steps.map((step, i) => (
              <li key={i} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr',
                gap: 14, alignItems: 'baseline',
                padding: '12px 0',
                borderBottom: i < view.steps.length - 1 ? `1px solid ${V1.line}` : 'none',
              }}>
                <span style={{
                  fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                  color: view.accent, letterSpacing: '0.1em',
                }}>0{i + 1}</span>
                <span style={{
                  fontFamily: V1.fontBody, fontSize: 15, lineHeight: 1.5,
                  color: V1.ink,
                }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Primary + secondary CTAs */}
      <div style={{
        marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap',
        ...enter(460),
      }}>
        {view.primary && (
          <button
            type="button"
            onClick={view.primary.onClick === 'apply' ? onApply
                  : view.primary.onClick === 'talk'  ? onTalk
                  : view.primary.onClick === 'signOut' ? onSignOut
                  : () => {}}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: view.accent, color: '#fff', border: 'none',
              padding: '13px 22px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontDisplay, fontSize: 14.5, fontWeight: 700,
              lineHeight: 1, letterSpacing: '-0.005em',
              boxShadow: `0 12px 28px -14px ${view.accent}`,
            }}
          >
            {view.primary.label}
            <svg width="13" height="13" viewBox="0 0 14 14">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {view.secondary && (
          <button
            type="button"
            onClick={view.secondary.onClick === 'apply' ? onApply
                  : view.secondary.onClick === 'talk'  ? onTalk
                  : view.secondary.onClick === 'signOut' ? onSignOut
                  : () => {}}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'transparent', color: V1.ink,
              border: `1px solid ${V1.line}`,
              padding: '13px 22px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontDisplay, fontSize: 14.5, fontWeight: 700,
              lineHeight: 1, letterSpacing: '-0.005em',
            }}
          >
            {view.secondary.label}
          </button>
        )}
      </div>
    </div>
  );
}

// Status → presentational config. Keep copy here so the card stays pure
// presentation and the data shape coming from /api/customer-status drives
// what renders.
const STATUS_VIEWS = {
  approved: {
    eyebrow: 'Approved',
    accent:  '#1F845A',
    headline: (d) => `You're cleared${d.firstName ? `, ${d.firstName}` : ''}.`,
    body:     'Your application is approved. Our funding desk will reach out within one business day to confirm the wire details and set your repayment schedule.',
    steps: [
      'A funding specialist calls or emails to confirm bank routing and the agreed-on factor.',
      'You countersign the funding agreement (DocuSign — takes about 3 minutes).',
      'Funds wire to the connected account, typically within 24 hours of countersignature.',
    ],
    primary:   { label: 'Talk to funding desk', onClick: 'talk' },
    secondary: { label: 'Sign out',             onClick: 'signOut' },
  },
  pending: {
    eyebrow: 'Under review',
    accent:  '#4945FF',
    headline: (d) => `We're reviewing your application${d.firstName ? `, ${d.firstName}` : ''}.`,
    body:     'Your application is in underwriting. We re-pull deposits and validate identity on every file before issuing a verdict — most decisions land within one business day.',
    steps: [
      'Underwriting validates the deposits pulled through Plaid.',
      'Identity verification is checked against the application.',
      "You'll get an email the moment a verdict is set — refresh this page anytime to see live status.",
    ],
    primary:   { label: 'Talk to a human', onClick: 'talk' },
    secondary: { label: 'Sign out',        onClick: 'signOut' },
  },
  denied: {
    eyebrow: 'Not approved',
    accent:  '#c9372c',
    headline: () => "We couldn't approve this application.",
    body:     "Your file didn't clear underwriting on this pass. This isn't permanent — most declines are revenue- or seasoning-driven and reverse once another 60–90 days of deposits roll in. Talk to us about timing or reapply later.",
    steps: [
      'Most common reason: average monthly deposits below our minimum for the requested range.',
      'Other common reason: business under 6 months of operating history.',
      'You can reapply with fresh statements whenever you like.',
    ],
    primary:   { label: 'Talk to a human', onClick: 'talk' },
    secondary: { label: 'Reapply',         onClick: 'apply' },
  },
  no_application: {
    eyebrow: 'No application on file',
    accent:  '#4945FF',
    headline: () => 'You haven’t applied yet.',
    body:     'We can’t find an application tied to this email. Start one in a couple of minutes — most operators finish in under 4.',
    steps: [
      'Run the calculator to see your offer range.',
      'Connect your business bank via Plaid (read-only).',
      'Verify identity and submit — underwriting kicks off the moment you do.',
    ],
    primary:   { label: 'Apply for funding', onClick: 'apply' },
    secondary: { label: 'Sign out',          onClick: 'signOut' },
  },
};

function V1PortalPage({ onApply, onTalk, onNavLogin }) {
  const mounted = useV1Mounted(40);
  const [state, setState] = React.useState({ phase: 'loading', data: null, error: null });

  // Fetch status on mount. If there's no token we redirect to login. If the
  // API rejects with 401, the token expired — drop it and bounce to login.
  React.useEffect(() => {
    let cancelled = false;
    const token = readPortalToken();
    if (!token) {
      onNavLogin && onNavLogin();
      return undefined;
    }
    (async () => {
      try {
        const r = await fetch('/api/customer-status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (r.status === 401) {
          clearPortalToken();
          onNavLogin && onNavLogin();
          return;
        }
        if (!r.ok) {
          setState({ phase: 'error', data: null, error: `Server error (${r.status})` });
          return;
        }
        const data = await r.json();
        setState({ phase: 'ready', data, error: null });
      } catch (err) {
        if (cancelled) return;
        setState({ phase: 'error', data: null, error: 'network' });
      }
    })();
    return () => { cancelled = true; };
  }, [onNavLogin]);

  const handleSignOut = React.useCallback(() => {
    clearPortalToken();
    onNavLogin && onNavLogin();
  }, [onNavLogin]);

  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
    transition: `opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const data = state.data || {};
  const view = STATUS_VIEWS[data.status] || STATUS_VIEWS.pending;

  return (
    <section data-v1-section style={{
      background: V1.bg,
      minHeight: 'calc(100vh - 96px)',
      padding: '64px 32px 96px',
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* Page header */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap',
          ...enter(0),
        }}>
          <div>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: V1.muted,
            }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: V1.muted, verticalAlign: 'middle', marginRight: 10 }} />
              Customer portal
            </div>
            <h1 style={{
              margin: '14px 0 0',
              fontFamily: V1.fontDisplay,
              fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
              fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em',
              color: V1.ink,
            }}>
              Your funding status.
            </h1>
          </div>
          {data.email && (
            <div style={{
              fontFamily: V1.fontMono, fontSize: 11.5, fontWeight: 500,
              letterSpacing: '0.06em', color: V1.muted,
            }}>
              Signed in as <span style={{ color: V1.ink, fontWeight: 600 }}>{data.email}</span>
            </div>
          )}
        </div>

        {/* Body — loading / error / ready */}
        <div style={{ marginTop: 32 }}>
          {state.phase === 'loading' && (
            <div style={{
              padding: '60px 24px', textAlign: 'center',
              background: '#fff', borderRadius: 16,
              border: `1px solid ${V1.line}`,
              ...enter(120),
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999,
                border: `2.5px solid ${V1.line}`,
                borderTopColor: V1.blue,
                margin: '0 auto 16px',
                animation: 'v1portalspin 850ms linear infinite',
              }} />
              <div style={{
                fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              }}>Loading your file</div>
              <style>{`@keyframes v1portalspin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {state.phase === 'error' && (
            <div style={{
              padding: '40px 32px',
              background: '#fff', borderRadius: 16,
              border: `1px solid ${V1.line}`,
              ...enter(120),
            }}>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: V1.red, marginBottom: 14,
              }}>Trouble loading</div>
              <h3 style={{
                fontFamily: V1.fontDisplay, fontSize: 24, fontWeight: 700,
                color: V1.ink, margin: 0, letterSpacing: '-0.02em',
              }}>We couldn't pull your status.</h3>
              <p style={{
                fontFamily: V1.fontBody, fontSize: 15, lineHeight: 1.55,
                color: V1.text, marginTop: 12,
              }}>
                Something hiccuped on our end. Try refreshing — if it sticks, sign out and request a fresh sign-in link.
              </p>
              <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  style={{
                    background: V1.ink, color: '#fff', border: 'none',
                    padding: '11px 18px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: V1.fontDisplay, fontSize: 14, fontWeight: 700,
                  }}
                >Refresh</button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    background: 'transparent', color: V1.ink,
                    border: `1px solid ${V1.line}`,
                    padding: '11px 18px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: V1.fontDisplay, fontSize: 14, fontWeight: 700,
                  }}
                >Sign out</button>
              </div>
            </div>
          )}

          {state.phase === 'ready' && (
            <V1PortalStatusCard
              view={view}
              data={data}
              onApply={onApply}
              onTalk={onTalk}
              onSignOut={handleSignOut}
            />
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { V1PortalPage, PORTAL_LS, readPortalToken, clearPortalToken });
