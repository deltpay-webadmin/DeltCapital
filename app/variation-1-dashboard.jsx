// V1 Dashboard — post-login confirmation page.
//
// A deliberately simple, signed-in-only screen whose job is to PROVE the
// Supabase login works end to end: it re-reads the live session from Supabase
// on mount (independent of the in-memory `user` prop), surfaces the account
// email / id / token timestamps, and offers a Sign out control. If the session
// can't be read it tells you why, which makes it a useful smoke test for the
// env-var wiring (SUPABASE_URL / SUPABASE_ANON_KEY) as well.

function V1DashboardRow({ label, value, mono = true }) {
  return (
    <div data-v1-grid-2col style={{
      display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16,
      alignItems: 'baseline',
      padding: '16px 0',
      borderBottom: `1px solid ${V1.line}`,
    }}>
      <span style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
      }}>{label}</span>
      <span style={{
        fontFamily: mono ? V1.fontMono : V1.fontBody,
        fontSize: mono ? 13.5 : 15, color: V1.ink,
        wordBreak: 'break-all', lineHeight: 1.5,
      }}>{value}</span>
    </div>
  );
}

function V1DashboardPage({ user, onSignOut, onApply }) {
  const mounted = useV1Mounted(60);
  // Live session pulled straight from Supabase — independent confirmation that
  // the persisted session is real and the client is configured.
  const [session, setSession] = React.useState(null);
  const [status, setStatus]   = React.useState('checking'); // checking | ok | error
  const [errMsg, setErrMsg]   = React.useState('');
  const [signingOut, setSigningOut] = React.useState(false);
  const [hoverOut, setHoverOut]     = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await v1GetSession();
        if (cancelled) return;
        if (error) { setStatus('error'); setErrMsg(error.message); return; }
        if (data && data.session) { setSession(data.session); setStatus('ok'); }
        else { setStatus('error'); setErrMsg('No active session found.'); }
      } catch (err) {
        if (!cancelled) { setStatus('error'); setErrMsg(String(err && err.message || err)); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const activeUser = (session && session.user) || user || null;
  const fmt = (s) => {
    if (!s) return '—';
    const d = new Date(typeof s === 'number' ? s * 1000 : s);
    return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
  };

  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
    transition: `opacity 640ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 640ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try { onSignOut && await onSignOut(); }
    finally { setSigningOut(false); }
  };

  return (
    <section data-v1-section style={{
      background: V1.bg, minHeight: 'calc(100vh - 96px)',
      padding: '64px 32px 96px',
    }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={enter(40)}>
          <V1Eyebrow>Account · session check</V1Eyebrow>
        </div>

        <h1 data-v1-section-title style={{
          margin: '24px 0 0',
          fontFamily: V1.fontDisplay,
          fontSize: 'clamp(2.2rem, 4vw, 3rem)',
          fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.04em',
          color: V1.ink,
        }}>
          <V1LineMask ready={mounted} delay={140} duration={820}>You're signed in.</V1LineMask>
        </h1>

        <p style={{
          margin: '20px 0 0', maxWidth: 560,
          fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.55, color: V1.text,
          ...enter(360),
        }}>
          This page only renders for an authenticated session, so reaching it
          confirms the Supabase login is wired up correctly. The details below
          are read live from your active session.
        </p>

        {/* Status pill */}
        <div style={{
          marginTop: 28,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 14px', borderRadius: 999,
          background: status === 'ok' ? 'rgba(16,185,129,0.10)' : status === 'error' ? 'rgba(220,38,38,0.08)' : 'rgba(73,69,255,0.08)',
          border: `1px solid ${status === 'ok' ? 'rgba(16,185,129,0.35)' : status === 'error' ? 'rgba(220,38,38,0.30)' : 'rgba(73,69,255,0.30)'}`,
          ...enter(460),
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 999,
            background: status === 'ok' ? '#10b981' : status === 'error' ? '#dc2626' : V1.blue,
          }} />
          <span style={{
            fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: status === 'ok' ? '#047857' : status === 'error' ? '#b91c1c' : V1.blue,
          }}>
            {status === 'checking' ? 'Verifying session…' : status === 'ok' ? 'Session verified' : 'Session error'}
          </span>
        </div>

        {/* Detail card */}
        <div style={{
          marginTop: 32, padding: '8px 28px 28px',
          background: '#fff', border: `1px solid ${V1.line}`, borderRadius: 14,
          boxShadow: '0 10px 30px -18px rgba(4,30,66,0.25)',
          ...enter(560),
        }}>
          <V1DashboardRow label="Email" value={activeUser ? activeUser.email : '—'} mono={false} />
          <V1DashboardRow label="User ID" value={activeUser ? activeUser.id : '—'} />
          <V1DashboardRow label="Provider" value={activeUser && activeUser.app_metadata ? (activeUser.app_metadata.provider || 'email') : 'email'} />
          <V1DashboardRow label="Last sign in" value={fmt(activeUser && activeUser.last_sign_in_at)} />
          <V1DashboardRow label="Confirmed at" value={fmt(activeUser && (activeUser.email_confirmed_at || activeUser.confirmed_at))} />
          <div data-v1-grid-2col style={{
            display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16,
            alignItems: 'baseline', padding: '16px 0',
          }}>
            <span style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
            }}>Token expires</span>
            <span style={{ fontFamily: V1.fontMono, fontSize: 13.5, color: V1.ink }}>
              {fmt(session && session.expires_at)}
            </span>
          </div>

          {status === 'error' && (
            <div role="alert" style={{
              marginTop: 4,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.22)',
              borderRadius: 10, padding: '12px 14px',
              fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.45, color: '#b91c1c',
            }}>
              <span>{errMsg || 'Could not read the session.'}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap', ...enter(680) }}>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            onMouseEnter={() => setHoverOut(true)}
            onMouseLeave={() => setHoverOut(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: V1.ink, color: '#fff', border: 'none',
              padding: '14px 24px', borderRadius: 10,
              cursor: signingOut ? 'progress' : 'pointer', opacity: signingOut ? 0.7 : 1,
              fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1,
              transform: hoverOut && !signingOut ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'transform 220ms, opacity 220ms',
            }}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
          <button
            type="button"
            onClick={onApply}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'transparent', border: `1px solid ${V1.line}`,
              padding: '14px 24px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700, lineHeight: 1, color: V1.ink,
              transition: 'border-color 220ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = V1.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = V1.line; }}
          >
            Apply for funding
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { V1DashboardPage });
