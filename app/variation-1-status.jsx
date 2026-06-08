// V1 Application Status — post-account approval tracker.
//
// Shown after an applicant creates an account from the apply flow's "Create
// account & track status" CTA. Reads the signed-in user's application row from
// /api/application (authenticated with the Supabase access token) and renders a
// progress tracker: Applied → In Review → Approved / Denied.
//
//   • in_review  → reassurance copy, keeps polling (~10s) so an admin decision
//                  appears without a refresh.
//   • approved   → success state + "View your dashboard".
//   • denied     → next-steps + contact customer service.
//
// The Approve/Deny transition itself is a future admin action; this page only
// reflects whatever status the row currently holds.

const V1_STATUS_STAGES = [
  { key: 'applied',   label: 'Applied',   blurb: 'Application submitted' },
  { key: 'in_review', label: 'In Review', blurb: 'Underwriting your file' },
  { key: 'decision',  label: 'Decision',  blurb: 'Approved or denied' },
];

// Map a status string → per-stage visual state.
function v1StatusStageStates(status) {
  switch (status) {
    case 'applied':   return ['active', 'upcoming', 'upcoming'];
    case 'in_review': return ['done', 'active', 'upcoming'];
    case 'approved':  return ['done', 'done', 'approved'];
    case 'denied':    return ['done', 'done', 'denied'];
    default:          return ['active', 'upcoming', 'upcoming'];
  }
}

function V1StatusStepper({ status }) {
  const states = v1StatusStageStates(status);
  const decisionLabel = status === 'denied' ? 'Denied' : status === 'approved' ? 'Approved' : 'Decision';
  const colorFor = (s) =>
    s === 'denied' ? '#DC2626'
    : s === 'approved' ? V1.green
    : (s === 'done' || s === 'active') ? V1.blue
    : V1.line;

  // Filled portion of the connecting track (0 → 1).
  const filled =
    status === 'approved' || status === 'denied' ? 1 :
    status === 'in_review' ? 0.5 : 0;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        {/* Track */}
        <div aria-hidden style={{
          position: 'absolute', left: 22, right: 22, top: 22, height: 3,
          background: V1.line, borderRadius: 3,
        }} />
        <div aria-hidden style={{
          position: 'absolute', left: 22, top: 22, height: 3, borderRadius: 3,
          width: `calc((100% - 44px) * ${filled})`,
          background: status === 'denied'
            ? `linear-gradient(90deg, ${V1.blue}, #DC2626)`
            : `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
          transition: 'width 600ms cubic-bezier(0.22, 1, 0.36, 1)',
        }} />

        {V1_STATUS_STAGES.map((stage, i) => {
          const s = states[i];
          const c = colorFor(s);
          const isTerminal = s === 'approved' || s === 'denied';
          const label = stage.key === 'decision' ? decisionLabel : stage.label;
          const blurb = stage.key === 'decision'
            ? (status === 'approved' ? "You're funded"
               : status === 'denied' ? 'See next steps below'
               : stage.blurb)
            : stage.blurb;
          return (
            <div key={stage.key} style={{
              position: 'relative', zIndex: 1, width: 120, textAlign: 'center',
            }}>
              <div style={{
                width: 44, height: 44, margin: '0 auto', borderRadius: 999,
                background: (s === 'done' || isTerminal) ? c : '#fff',
                border: `2px solid ${s === 'upcoming' ? V1.line : c}`,
                boxShadow: s === 'active' ? `0 0 0 5px ${V1.blue}1F` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: (s === 'done' || isTerminal) ? '#fff' : (s === 'active' ? V1.blue : V1.muted),
                transition: 'all 360ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                {s === 'done' || s === 'approved' ? (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.2L6.5 11.5 13 5" />
                  </svg>
                ) : s === 'denied' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M5 5l6 6M11 5l-6 6" />
                  </svg>
                ) : s === 'active' ? (
                  <span style={{
                    width: 12, height: 12, borderRadius: 999, background: V1.blue,
                    animation: 'v1statusPulse 1.6s ease-in-out infinite',
                  }} />
                ) : (
                  <span style={{
                    fontFamily: V1.fontMono, fontSize: 13, fontWeight: 700,
                  }}>{i + 1}</span>
                )}
              </div>
              <div style={{
                marginTop: 12, fontFamily: V1.fontDisplay, fontSize: 14.5, fontWeight: 600,
                letterSpacing: '-0.01em',
                color: s === 'upcoming' ? V1.muted : (s === 'denied' ? '#DC2626' : V1.ink),
              }}>{label}</div>
              <div style={{
                marginTop: 3, fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, lineHeight: 1.4,
              }}>{blurb}</div>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes v1statusPulse { 0%,100% { transform: scale(0.7); opacity: 0.7 } 50% { transform: scale(1); opacity: 1 } }`}</style>
    </div>
  );
}

function V1StatusSummaryRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16,
      padding: '12px 0', borderBottom: `1px solid ${V1.line}`,
    }}>
      <span style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
      }}>{label}</span>
      <span style={{
        fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink, fontVariantNumeric: 'tabular-nums',
        textAlign: 'right',
      }}>{value}</span>
    </div>
  );
}

function V1StatusPage({ user, onNavDashboard, onNavSupport, onApply }) {
  const mounted = useV1Mounted(60);
  const [phase, setPhase]   = React.useState('loading'); // loading | ok | none | error
  const [app, setApp]       = React.useState(null);
  const [errMsg, setErrMsg] = React.useState('');
  const [hoverDash, setHoverDash] = React.useState(false);
  // Bumped by the "Try again" button to re-run the loader after an error.
  const [reloadKey, setReloadKey] = React.useState(0);

  // Fetch the application once, then poll so an admin decision appears live.
  React.useEffect(() => {
    let cancelled = false;
    let timer = null;

    const load = async (isFirst) => {
      try {
        const token = await v1GetAccessToken();
        if (cancelled) return;
        if (!token) { if (isFirst) { setPhase('error'); setErrMsg('Your session has expired. Please sign in again.'); } return; }
        let res = await fetch('/api/application', { headers: { Authorization: `Bearer ${token}` } });
        if (cancelled) return;
        // No row yet. If a finished application is still pending (its initial
        // submit failed during sign-up), submit it now so the tracker self-heals.
        if (res.status === 404) {
          const pend = (typeof loadPendingApplication === 'function') ? loadPendingApplication() : null;
          if (pend) {
            const post = await fetch('/api/application', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(pend),
            });
            if (cancelled) return;
            if (!post.ok) { setPhase('error'); setErrMsg('We couldn’t submit your application. Tap “Try again” to retry.'); return; }
            if (typeof clearPendingApplication === 'function') clearPendingApplication();
            res = await fetch('/api/application', { headers: { Authorization: `Bearer ${token}` } });
            if (cancelled) return;
          } else {
            setApp(null); setPhase('none'); return;
          }
        }
        if (res.status === 404) { setApp(null); setPhase('none'); return; }
        if (!res.ok) { if (isFirst) { setPhase('error'); setErrMsg('Could not load your application. We’ll keep trying.'); } return; }
        const data = await res.json().catch(() => null);
        if (cancelled || !data || !data.application) { if (isFirst) setPhase('error'); return; }
        setApp(data.application);
        setPhase('ok');
      } catch (err) {
        if (!cancelled && isFirst) { setPhase('error'); setErrMsg(String(err && err.message || err)); }
      }
    };

    load(true);
    // Light polling so an admin decision appears without a manual refresh. The
    // interval is cheap; it's cleared on unmount. Terminal states simply stop
    // changing, so there's no harm in continuing to poll.
    timer = setInterval(() => {
      if (cancelled) return;
      load(false);
    }, 10000);
    return () => { cancelled = true; if (timer) clearInterval(timer); };
  }, [reloadKey]);

  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
    transition: `opacity 640ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 640ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const status = app && app.status;
  const offer  = (app && app.offer) || {};
  const fmtMoney = (n) => (typeof n === 'number' && isFinite(n)) ? `$${Math.round(n).toLocaleString()}` : '—';
  const fmtDate  = (s) => { if (!s) return '—'; const d = new Date(s); return isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); };

  const headline =
    status === 'approved' ? "You're approved." :
    status === 'denied'   ? 'A quick update on your application.' :
    'Tracking your application.';

  const subcopy =
    status === 'approved' ? 'Your funding is confirmed. Open your dashboard to manage payments, documents, and statements.' :
    status === 'denied'   ? 'We weren’t able to approve this application. Here’s what you can do next.' :
    'We’re reviewing your deposits and verification. This page updates automatically — no need to refresh.';

  return (
    <section data-v1-section style={{
      background: V1.bg, minHeight: 'calc(100vh - 96px)', padding: '64px 32px 96px',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={enter(40)}>
          <V1Eyebrow>Account · application status</V1Eyebrow>
        </div>

        <h1 data-v1-section-title style={{
          margin: '24px 0 0', fontFamily: V1.fontDisplay,
          fontSize: 'clamp(2rem, 3.6vw, 2.8rem)', fontWeight: 900,
          lineHeight: 1.04, letterSpacing: '-0.04em', color: V1.ink,
        }}>
          <V1LineMask ready={mounted} delay={140} duration={820}>{headline}</V1LineMask>
        </h1>

        <p style={{
          margin: '18px 0 0', maxWidth: 560,
          fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.55, color: V1.text,
          ...enter(320),
        }}>{subcopy}</p>

        {/* Loading */}
        {phase === 'loading' && (
          <div style={{ marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 12, ...enter(420) }}>
            <span style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${V1.line}`, borderTopColor: V1.blue, animation: 'v1statusSpin 700ms linear infinite' }} />
            <span style={{ fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted }}>Loading your application…</span>
            <style>{`@keyframes v1statusSpin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* No application on file */}
        {phase === 'none' && (
          <div style={{
            marginTop: 36, padding: '28px 28px', background: '#fff',
            border: `1px solid ${V1.line}`, borderRadius: 14, ...enter(420),
          }}>
            <div style={{ fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 600, color: V1.ink }}>No application on file yet</div>
            <p style={{ margin: '10px 0 18px', fontFamily: V1.fontBody, fontSize: 15, color: V1.muted, lineHeight: 1.55, maxWidth: 520 }}>
              We couldn’t find an application tied to this account. Start one and you’ll be able to track it here in real time.
            </p>
            <button type="button" onClick={onApply} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px',
              borderRadius: 10, border: 'none', cursor: 'pointer', background: V1.blue, color: '#fff',
              fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700,
            }}>Apply for funding</button>
          </div>
        )}

        {/* Error */}
        {phase === 'error' && (
          <div style={{ ...enter(420) }}>
            <div role="alert" style={{
              marginTop: 32, display: 'flex', alignItems: 'flex-start', gap: 10,
              background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.22)',
              borderRadius: 10, padding: '14px 16px', maxWidth: 520,
              fontFamily: V1.fontBody, fontSize: 14, lineHeight: 1.5, color: '#b91c1c',
            }}>
              <span>{errMsg || 'Could not load your application.'}</span>
            </div>
            <button type="button" onClick={() => { setErrMsg(''); setPhase('loading'); setReloadKey((k) => k + 1); }} style={{
              marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px',
              borderRadius: 10, border: 'none', cursor: 'pointer', background: V1.blue, color: '#fff',
              fontFamily: V1.fontDisplay, fontSize: 14.5, fontWeight: 700,
            }}>Try again</button>
          </div>
        )}

        {/* Tracker */}
        {phase === 'ok' && app && (
          <>
            <div style={{
              marginTop: 40, padding: '36px 32px 34px', background: '#fff',
              border: `1px solid ${V1.line}`, borderRadius: 16,
              boxShadow: '0 18px 44px -28px rgba(4,30,66,0.28)', ...enter(420),
            }}>
              <V1StatusStepper status={status} />
            </div>

            {/* Live-refresh note while pending */}
            {(status === 'in_review' || status === 'applied') && (
              <div style={{
                marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted, ...enter(520),
              }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: V1.blue, animation: 'v1statusPulse 1.6s ease-in-out infinite' }} />
                Updates automatically · most decisions within 1 business day
              </div>
            )}

            {/* Approved → dashboard */}
            {status === 'approved' && (
              <div style={{
                marginTop: 24, padding: '24px 26px', borderRadius: 14,
                background: `linear-gradient(135deg, ${V1.green}0F, #fff)`,
                border: `1px solid ${V1.green}55`, ...enter(520),
              }}>
                <div style={{ fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 600, color: V1.ink }}>Your account is ready</div>
                <p style={{ margin: '8px 0 18px', fontFamily: V1.fontBody, fontSize: 14.5, color: V1.text, lineHeight: 1.55 }}>
                  Funding is confirmed. Your dashboard has your balance, payment schedule, statements, and documents.
                </p>
                <button type="button" onClick={onNavDashboard}
                  onMouseEnter={() => setHoverDash(true)} onMouseLeave={() => setHoverDash(false)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px',
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: `linear-gradient(135deg, ${V1.green}, #34D399)`, color: '#fff',
                    fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700,
                    boxShadow: `0 12px 30px -12px ${V1.green}aa`,
                    transform: hoverDash ? 'translateY(-1px)' : 'translateY(0)', transition: 'transform .15s',
                  }}>
                  View your dashboard
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            )}

            {/* Denied → next steps */}
            {status === 'denied' && (
              <div style={{
                marginTop: 24, padding: '24px 26px', borderRadius: 14,
                background: '#fff', border: `1px solid ${V1.line}`, ...enter(520),
              }}>
                <div style={{ fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 600, color: V1.ink }}>What you can do next</div>
                {app.decline_reason && (
                  <p style={{ margin: '10px 0 0', fontFamily: V1.fontBody, fontSize: 14, color: V1.muted, lineHeight: 1.55 }}>
                    Reason: {app.decline_reason}
                  </p>
                )}
                <ul style={{ margin: '14px 0 18px', paddingLeft: 18, fontFamily: V1.fontBody, fontSize: 14.5, color: V1.text, lineHeight: 1.7 }}>
                  <li>Speak with our team about your file and what changed the decision.</li>
                  <li>Ask about re-applying once more deposit history is available.</li>
                  <li>Request the specific factors behind the decision.</li>
                </ul>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <a href="tel:+18647293358" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px',
                    borderRadius: 10, background: V1.ink, color: '#fff', textDecoration: 'none',
                    fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700,
                  }}>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3.5c0 5 4.5 9.5 9.5 9.5l.5-2.5-3-1-1 1.2A8 8 0 0 1 5.3 6.5L6.5 5.5l-1-3z"/></svg>
                    Call customer service · (864) 729-3358
                  </a>
                  <button type="button" onClick={onNavSupport} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px',
                    borderRadius: 10, background: 'transparent', border: `1px solid ${V1.line}`, color: V1.ink,
                    cursor: 'pointer', fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700,
                  }}>Contact support</button>
                </div>
              </div>
            )}

            {/* Application summary */}
            <div style={{
              marginTop: 24, padding: '8px 28px 20px', background: '#fff',
              border: `1px solid ${V1.line}`, borderRadius: 14, ...enter(620),
            }}>
              <div style={{
                padding: '18px 0 4px', fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              }}>Application</div>
              {app.ref && <V1StatusSummaryRow label="Reference" value={app.ref} />}
              {app.business_name && <V1StatusSummaryRow label="Business" value={app.business_name} />}
              <V1StatusSummaryRow label="Advance amount" value={fmtMoney(offer.amount)} />
              <V1StatusSummaryRow label="Factor rate" value={offer.factor ? `${Number(offer.factor).toFixed(2)}×` : '—'} />
              <V1StatusSummaryRow label="Term" value={offer.term ? `${offer.term} months` : '—'} />
              <V1StatusSummaryRow label="Submitted" value={fmtDate(app.created_at)} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

Object.assign(window, { V1StatusPage });
