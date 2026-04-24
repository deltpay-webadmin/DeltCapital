// V1 Login — editorial spread, not a card-in-a-modal.
// Left: Midnight Steel marketing column with oversized headline, ambient
// Electric Indigo bloom, and a short trust-signal ledger.
// Right: Pure White form column with hairline-underline inputs, sheen-sweep
// submit, SSO chips, and a magic-link success state that crossfades in.

function V1LoginField({ id, label, type = 'text', value, onChange, icon, trailing, focused, onFocus, onBlur, autoComplete }) {
  const isActive = focused;
  return (
    <label htmlFor={id} style={{ display: 'block', position: 'relative' }}>
      <span style={{
        display: 'block',
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: isActive ? V1.blue : V1.muted,
        marginBottom: 10,
        transition: 'color 220ms',
      }}>
        {label}
      </span>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        paddingBottom: 10,
        position: 'relative',
      }}>
        {icon && (
          <span aria-hidden style={{
            color: isActive ? V1.blue : V1.muted,
            display: 'inline-flex', alignItems: 'center',
            transition: 'color 220ms',
          }}>{icon}</span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          style={{
            flex: 1,
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: V1.fontBody, fontSize: 17, color: V1.ink,
            padding: 0,
          }}
        />
        {trailing}
      </div>
      {/* Hairline base rule */}
      <span aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: 1, background: V1.line,
      }} />
      {/* Indigo fill rule — scales in on focus */}
      <span aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: 1, background: V1.blue,
        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left center',
        transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
    </label>
  );
}

function V1LoginPage({ onClose, onSignIn, onApply }) {
  const mounted = useV1Mounted(60);
  const [email, setEmail]                 = React.useState('');
  const [password, setPassword]           = React.useState('');
  const [showPassword, setShowPassword]   = React.useState(false);
  const [rememberMe, setRememberMe]       = React.useState(false);
  const [focused, setFocused]             = React.useState(null);
  const [hoverSubmit, setHoverSubmit]     = React.useState(false);
  const [hoverForgot, setHoverForgot]     = React.useState(false);
  const [hoverGoogle, setHoverGoogle]     = React.useState(false);
  const [hoverFacebook, setHoverFacebook] = React.useState(false);
  const [hoverApply, setHoverApply]       = React.useState(false);
  const [hoverBack, setHoverBack]         = React.useState(false);
  const [sent, setSent]                   = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    onSignIn && onSignIn(email || 'operator@delt.capital');
  };

  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
    transition: `opacity 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 720ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const trustSignals = [
    { eyebrow: 'Compliance',  body: 'SOC 2 Type II · audited Q1 2026'            },
    { eyebrow: 'Session',     body: 'Expires in 20 min · browser-local only'     },
    { eyebrow: 'Last login',  body: 'Oct 12 · Los Angeles (you)'                  },
  ];

  const nowLabel = (() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm} PT`;
  })();

  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      minHeight: 'calc(100vh - 96px)',
      background: V1.bg,
    }}>
      {/* ─── LEFT — Midnight Steel marketing panel ─── */}
      <aside style={{
        position: 'relative',
        background: V1.ink,
        color: '#fff',
        padding: '64px 56px',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        {/* Ambient Electric Indigo bloom */}
        <div aria-hidden style={{
          position: 'absolute', top: -240, right: -200, width: 620, height: 620,
          background: `radial-gradient(circle, ${V1.blue}29 0%, transparent 60%)`,
          filter: 'blur(24px)', pointerEvents: 'none',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1200ms ease-out 120ms',
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: -280, left: -160, width: 480, height: 480,
          background: `radial-gradient(circle, #818CF81A 0%, transparent 60%)`,
          filter: 'blur(24px)', pointerEvents: 'none',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1200ms ease-out 320ms',
        }} />

        {/* Corner dateline */}
        <div style={{
          position: 'absolute', top: 32, right: 40,
          fontFamily: V1.fontMono, fontSize: 11, letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.42)', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 10,
          ...enter(40),
        }}>
          Vol. VII · Gate
          <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.32)' }} />
        </div>

        {/* Content */}
        <div style={{ maxWidth: 520, position: 'relative', zIndex: 1 }}>
          <div style={enter(80)}>
            <V1Eyebrow color={V1.blueSoft}>Sign in</V1Eyebrow>
          </div>

          <h1 style={{
            margin: '28px 0 0',
            fontFamily: V1.fontDisplay,
            fontSize: 'clamp(2.4rem, 4.6vw, 4rem)',
            fontWeight: 600, lineHeight: 1, letterSpacing: '-0.04em',
            color: '#fff',
          }}>
            <V1LineMask ready={mounted} delay={140} duration={900}>Welcome back,</V1LineMask>
            <V1LineMask ready={mounted} delay={250} duration={900}>operator.</V1LineMask>
          </h1>

          <p style={{
            fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.72)',
            margin: '28px 0 0', maxWidth: 460,
            ...enter(540),
          }}>
            Your session is secured, soft-pulled, and auto-expires. We never
            store card data or factor terms in the browser.
          </p>

          <div style={{
            marginTop: 48, paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            {trustSignals.map((s, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '14px 1fr',
                gap: 14, alignItems: 'baseline',
                ...enter(700 + i * 120),
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: 999,
                  background: V1.blue,
                  boxShadow: `0 0 0 3px rgba(73,69,255,0.22)`,
                  marginTop: 6,
                }} />
                <div>
                  <div style={{
                    fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: V1.blueSoft,
                  }}>
                    {s.eyebrow}
                  </div>
                  <div style={{
                    marginTop: 4,
                    fontFamily: V1.fontBody, fontSize: 15, lineHeight: 1.45,
                    color: 'rgba(255,255,255,0.85)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {s.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page counter */}
        <div style={{
          position: 'absolute', left: 56, bottom: 40,
          fontFamily: V1.fontMono, fontSize: 11, letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.42)',
          ...enter(1200),
        }}>
          PG. 01 / 01
        </div>
      </aside>

      {/* ─── RIGHT — Pure White form panel ─── */}
      <div style={{
        position: 'relative',
        background: '#ffffff',
        padding: '56px 72px 72px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top row: back + signin eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          ...enter(20),
        }}>
          <button
            onClick={onClose}
            onMouseEnter={() => setHoverBack(true)}
            onMouseLeave={() => setHoverBack(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: hoverBack ? V1.ink : V1.muted,
              fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
              padding: 0,
              transition: 'color 220ms',
            }}
          >
            <span style={{
              display: 'inline-flex',
              transform: hoverBack ? 'translateX(-3px)' : 'translateX(0)',
              transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Back
          </button>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: V1.muted,
          }}>
            <span style={{ width: 18, height: 1, background: V1.muted }} />
            Sign in
          </div>
        </div>

        {/* Card wrapper — centered */}
        <div style={{
          marginTop: 56, maxWidth: 520,
          alignSelf: 'center', width: '100%',
          position: 'relative',
        }}>
          {/* Form state */}
          <div style={{
            opacity: sent ? 0 : 1,
            transform: sent ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'opacity 380ms cubic-bezier(0.22, 1, 0.36, 1), transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: sent ? 'none' : 'auto',
            position: sent ? 'absolute' : 'static',
            inset: sent ? 0 : undefined,
          }}>
            <h2 style={{
              fontFamily: V1.fontDisplay, fontSize: 40, fontWeight: 600,
              letterSpacing: '-0.035em', lineHeight: 1.05,
              color: V1.ink, margin: 0,
              ...enter(140),
            }}>
              <V1LineMask ready={mounted} delay={200} duration={900}>
                Sign in to your Delt account.
              </V1LineMask>
            </h2>

            {/* Hairline rule */}
            <div style={{
              marginTop: 36, height: 1, background: V1.line,
              transformOrigin: 'left center',
              transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1) 420ms',
            }} />

            <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div style={enter(460)}>
                  <V1LoginField
                    id="login-email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    focused={focused === 'email'}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    autoComplete="email"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/>
                        <path d="M1.8 4.5l6.2 4.5 6.2-4.5"/>
                      </svg>
                    }
                  />
                </div>

                <div style={enter(560)}>
                  <V1LoginField
                    id="login-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focused={focused === 'password'}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    autoComplete="current-password"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2.5" y="7" width="11" height="7" rx="1.5"/>
                        <path d="M5 7V5a3 3 0 0 1 6 0v2"/>
                      </svg>
                    }
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          padding: 4, color: V1.muted,
                          display: 'inline-flex', alignItems: 'center',
                          transition: 'color 220ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = V1.ink; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = V1.muted; }}
                      >
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z"/>
                            <circle cx="8" cy="8" r="1.8"/>
                            <path d="M2.5 2.5l11 11"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z"/>
                            <circle cx="8" cy="8" r="1.8"/>
                          </svg>
                        )}
                      </button>
                    }
                  />
                </div>
              </div>

              {/* Remember + Forgot */}
              <div style={{
                marginTop: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                ...enter(660),
              }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer',
                  fontFamily: V1.fontBody, fontSize: 13.5, color: V1.text,
                }}>
                  <span style={{
                    position: 'relative',
                    width: 16, height: 16, borderRadius: 4,
                    border: `1.5px solid ${rememberMe ? V1.blue : V1.line}`,
                    background: rememberMe ? V1.blue : '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 220ms, background 220ms',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" style={{
                      color: '#fff',
                      opacity: rememberMe ? 1 : 0,
                      transform: rememberMe ? 'scale(1)' : 'scale(0.6)',
                      transition: 'opacity 220ms, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}>
                      <path d="M2 5.2L4.2 7.4 8.2 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onMouseEnter={() => setHoverForgot(true)}
                  onMouseLeave={() => setHoverForgot(false)}
                  style={{
                    position: 'relative',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: 0,
                    fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                    color: hoverForgot ? V1.ink : V1.blue,
                    transition: 'color 220ms',
                  }}
                >
                  Forgot password?
                  <span aria-hidden style={{
                    position: 'absolute', left: 0, right: 0, bottom: -2,
                    height: 1, background: 'currentColor',
                    transform: hoverForgot ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left center',
                    transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }} />
                </button>
              </div>

              {/* Submit */}
              <div style={{ marginTop: 32, ...enter(760) }}>
                <button
                  type="submit"
                  onMouseEnter={() => setHoverSubmit(true)}
                  onMouseLeave={() => setHoverSubmit(false)}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    width: '100%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    background: V1.blue, color: '#fff', border: 'none',
                    padding: '16px 26px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: V1.fontBody, fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.005em',
                    boxShadow: hoverSubmit
                      ? `0 12px 28px -10px ${V1.blue}cc, 0 2px 6px ${V1.blue}44`
                      : `0 6px 18px -8px ${V1.blue}aa`,
                    transform: hoverSubmit ? 'translateY(-1px)' : 'translateY(0)',
                    transition: 'box-shadow 240ms, transform 240ms',
                  }}
                >
                  <span aria-hidden style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                    transform: hoverSubmit ? 'translateX(120%)' : 'translateX(-120%)',
                    transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }} />
                  Sign in
                  <svg width="15" height="15" viewBox="0 0 14 14" style={{
                    transform: hoverSubmit ? 'translateX(3px)' : 'translateX(0)',
                    transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}>
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div style={{
              marginTop: 36,
              display: 'flex', alignItems: 'center', gap: 14,
              color: V1.muted,
              ...enter(860),
            }}>
              <span style={{ flex: 1, height: 1, background: V1.line }} />
              <span style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
                or continue with
              </span>
              <span style={{ flex: 1, height: 1, background: V1.line }} />
            </div>

            {/* SSO */}
            <div style={{
              marginTop: 20,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
              ...enter(900),
            }}>
              {[
                {
                  k: 'google', label: 'Google', hover: hoverGoogle, set: setHoverGoogle,
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  k: 'facebook', label: 'Facebook', hover: hoverFacebook, set: setHoverFacebook,
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                    </svg>
                  ),
                },
              ].map((sso) => (
                <button
                  key={sso.k}
                  type="button"
                  onMouseEnter={() => sso.set(true)}
                  onMouseLeave={() => sso.set(false)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: '#fff',
                    border: `1px solid ${sso.hover ? V1.ink : V1.line}`,
                    borderRadius: 10,
                    padding: '12px 18px', cursor: 'pointer',
                    fontFamily: V1.fontMono, fontSize: 11.5, fontWeight: 600,
                    letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.ink,
                    boxShadow: sso.hover ? '0 8px 20px -12px rgba(4,30,66,0.35)' : '0 0 0 rgba(0,0,0,0)',
                    transform: sso.hover ? 'translateY(-1px)' : 'translateY(0)',
                    transition: 'border-color 220ms, box-shadow 240ms, transform 240ms',
                  }}
                >
                  {sso.icon}
                  {sso.label}
                </button>
              ))}
            </div>

            {/* Apply prompt */}
            <div style={{
              marginTop: 44, paddingTop: 24,
              borderTop: `1px solid ${V1.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16, flexWrap: 'wrap',
              ...enter(1020),
            }}>
              <span style={{
                fontFamily: V1.fontBody, fontSize: 14, color: V1.text,
              }}>
                Not a customer yet?
              </span>
              <button
                type="button"
                onClick={onApply}
                onMouseEnter={() => setHoverApply(true)}
                onMouseLeave={() => setHoverApply(false)}
                style={{
                  position: 'relative',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: 0,
                  fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
                  color: V1.blue,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
              >
                Apply for funding
                <span style={{
                  display: 'inline-flex',
                  transform: hoverApply ? 'translateX(3px)' : 'translateX(0)',
                  transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}>
                  <svg width="13" height="13" viewBox="0 0 14 14">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span aria-hidden style={{
                  position: 'absolute', left: 0, right: 0, bottom: -3,
                  height: 1, background: 'currentColor',
                  transform: hoverApply ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
              </button>
            </div>

            <div style={{
              marginTop: 20,
              fontFamily: V1.fontMono, fontSize: 10.5,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
              ...enter(1080),
            }}>
              By signing in you agree to Terms · Privacy
            </div>
          </div>

          {/* Success state */}
          <div style={{
            opacity: sent ? 1 : 0,
            transform: sent ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 480ms cubic-bezier(0.22, 1, 0.36, 1) 120ms, transform 480ms cubic-bezier(0.22, 1, 0.36, 1) 120ms',
            pointerEvents: sent ? 'auto' : 'none',
            position: sent ? 'static' : 'absolute',
            inset: sent ? undefined : 0,
          }}>
            {sent && (
              <div style={{ maxWidth: 520 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 999,
                  background: V1.blue,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 14px 32px -12px ${V1.blue}99`,
                  marginBottom: 28,
                }}>
                  <svg width="22" height="22" viewBox="0 0 16 16" style={{ color: '#fff' }}>
                    <path d="M3 8.2L6.5 11.7 13 5.2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <h2 style={{
                  fontFamily: V1.fontDisplay, fontSize: 40, fontWeight: 600,
                  letterSpacing: '-0.035em', lineHeight: 1.05, color: V1.ink,
                  margin: 0,
                }}>
                  Magic link sent.
                </h2>

                <p style={{
                  marginTop: 20,
                  fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.55, color: V1.text,
                  maxWidth: 460,
                }}>
                  We emailed a sign-in link to{' '}
                  <span style={{ color: V1.ink, fontWeight: 500 }}>{email || 'operator@delt.capital'}</span>.
                  Open it on this device to finish signing in.
                </p>

                <div style={{
                  marginTop: 24,
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                  letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
                }}>
                  <span style={{ width: 18, height: 1, background: V1.muted }} />
                  Sent · {nowLabel} · expires in 10 min
                </div>

                <div style={{
                  marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap',
                }}>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      background: 'transparent', border: `1px solid ${V1.line}`,
                      padding: '12px 22px', borderRadius: 10, cursor: 'pointer',
                      fontFamily: V1.fontBody, fontSize: 14, fontWeight: 500, color: V1.ink,
                      transition: 'border-color 220ms, background 220ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = V1.ink; e.currentTarget.style.background = V1.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = V1.line; e.currentTarget.style.background = 'transparent'; }}
                  >
                    Resend link
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      background: V1.ink, color: '#fff', border: 'none',
                      padding: '12px 22px', borderRadius: 10, cursor: 'pointer',
                      fontFamily: V1.fontBody, fontSize: 14, fontWeight: 500,
                    }}
                  >
                    Back to site
                    <svg width="13" height="13" viewBox="0 0 14 14">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { V1LoginPage });
