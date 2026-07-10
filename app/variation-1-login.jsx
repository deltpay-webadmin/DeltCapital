// V1 Login — clean, centered single-column card (Delt Pay style).
// Light-steel canvas, indigo lock badge, "Welcome back" headline, and a white
// rounded card holding boxed email/password inputs, remember/forgot row, and a
// full-width sheen-sweep submit. A magic-link success state crossfades in.

function V1LoginField({ id, label, type = 'text', value, onChange, placeholder, icon, trailing, focused, onFocus, onBlur, autoComplete }) {
  const isActive = focused;
  return (
    <label htmlFor={id} style={{ display: 'block' }}>
      <span style={{
        display: 'block',
        fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
        color: V1.ink,
        marginBottom: 8,
      }}>
        {label}
      </span>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff',
        border: `1px solid ${isActive ? V1.blue : V1.line}`,
        borderRadius: 10,
        padding: '13px 15px',
        boxShadow: isActive ? `0 0 0 3px ${V1.blue}22` : '0 0 0 rgba(0,0,0,0)',
        transition: 'border-color 180ms, box-shadow 180ms',
      }}>
        {icon && (
          <span aria-hidden style={{
            color: isActive ? V1.blue : V1.muted,
            display: 'inline-flex', alignItems: 'center',
            transition: 'color 180ms',
          }}>{icon}</span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            flex: 1,
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: V1.fontBody, fontSize: 15, color: V1.ink,
            padding: 0,
          }}
        />
        {trailing}
      </div>
    </label>
  );
}

function V1LoginPage({ onClose, onSignIn, onApply, onNavLegal }) {
  const mounted = useV1Mounted(60);
  const [email, setEmail]                 = React.useState('');
  const [password, setPassword]           = React.useState('');
  const [showPassword, setShowPassword]   = React.useState(false);
  const [rememberMe, setRememberMe]       = React.useState(false);
  const [focused, setFocused]             = React.useState(null);
  const [hoverSubmit, setHoverSubmit]     = React.useState(false);
  const [hoverForgot, setHoverForgot]     = React.useState(false);
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
    transition: `opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const nowLabel = (() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm} PT`;
  })();

  const legalLink = (label, page) => (
    <button
      type="button"
      onClick={() => onNavLegal && onNavLegal(page)}
      style={{
        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 'inherit', color: V1.blue, fontWeight: 600,
      }}
    >{label}</button>
  );

  return (
    <section data-v1-section style={{
      minHeight: 'calc(100vh - 96px)',
      background: V1.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px 80px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Back link */}
        <button
          onClick={onClose}
          onMouseEnter={() => setHoverBack(true)}
          onMouseLeave={() => setHoverBack(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: hoverBack ? V1.ink : V1.muted,
            fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 500,
            padding: 0, marginBottom: 40,
            transition: 'color 200ms',
            ...enter(20),
          }}
        >
          <span style={{
            display: 'inline-flex',
            transform: hoverBack ? 'translateX(-3px)' : 'translateX(0)',
            transition: 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M12.5 8H3.5M6.5 4.5L3 8l3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Back
        </button>

        {/* Form state */}
        <div style={{
          opacity: sent ? 0 : 1,
          transform: sent ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'opacity 380ms cubic-bezier(0.22, 1, 0.36, 1), transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: sent ? 'none' : 'auto',
          position: sent ? 'absolute' : 'static',
        }}>
          {/* Lock badge */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            ...enter(60),
          }}>
            <span style={{
              width: 64, height: 64, borderRadius: 16,
              background: V1.blue,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 14px 30px -12px ${V1.blue}aa`,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="11" width="16" height="10" rx="2"/>
                <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
              </svg>
            </span>
          </div>

          {/* Heading */}
          <h1 data-v1-section-title style={{
            textAlign: 'center',
            margin: '24px 0 0',
            fontFamily: V1.fontDisplay,
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em',
            color: V1.ink,
            ...enter(120),
          }}>
            Welcome back
          </h1>
          <p style={{
            textAlign: 'center',
            margin: '12px 0 0',
            fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.5,
            color: V1.muted,
            ...enter(180),
          }}>
            Sign in to your Delt account
          </p>

          {/* Card */}
          <div style={{
            marginTop: 32,
            background: '#fff',
            border: `1px solid ${V1.line}`,
            borderRadius: 16,
            padding: '32px 32px 34px',
            boxShadow: '0 24px 48px -24px rgba(4,30,66,0.18), 0 2px 6px rgba(4,30,66,0.04)',
            ...enter(240),
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <V1LoginField
                  id="login-email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  focused={focused === 'email'}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  autoComplete="email"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/>
                      <path d="M1.8 4.5l6.2 4.5 6.2-4.5"/>
                    </svg>
                  }
                />

                <V1LoginField
                  id="login-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  focused={focused === 'password'}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  autoComplete="current-password"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
                        padding: 0, color: V1.muted,
                        display: 'inline-flex', alignItems: 'center',
                        transition: 'color 200ms',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = V1.ink; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = V1.muted; }}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z"/>
                          <circle cx="8" cy="8" r="1.8"/>
                          <path d="M2.5 2.5l11 11"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z"/>
                          <circle cx="8" cy="8" r="1.8"/>
                        </svg>
                      )}
                    </button>
                  }
                />
              </div>

              {/* Remember + Forgot */}
              <div style={{
                marginTop: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  cursor: 'pointer',
                  fontFamily: V1.fontBody, fontSize: 14, color: V1.text,
                }}>
                  <span style={{
                    position: 'relative',
                    width: 17, height: 17, borderRadius: 4,
                    border: `1.5px solid ${rememberMe ? V1.blue : V1.line}`,
                    background: rememberMe ? V1.blue : '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 200ms, background 200ms',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" style={{
                      color: '#fff',
                      opacity: rememberMe ? 1 : 0,
                      transform: rememberMe ? 'scale(1)' : 'scale(0.6)',
                      transition: 'opacity 200ms, transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
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
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: 0,
                    fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
                    color: V1.blue,
                    textDecoration: hoverForgot ? 'underline' : 'none',
                    textUnderlineOffset: 3,
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                onMouseEnter={() => setHoverSubmit(true)}
                onMouseLeave={() => setHoverSubmit(false)}
                style={{
                  position: 'relative', overflow: 'hidden',
                  width: '100%', marginTop: 24,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: V1.blue, color: '#fff', border: 'none',
                  padding: '15px 26px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: V1.fontDisplay, fontSize: 15.5, fontWeight: 700,
                  lineHeight: 1, letterSpacing: '-0.005em',
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
                <svg width="16" height="16" viewBox="0 0 14 14" style={{
                  transform: hoverSubmit ? 'translateX(3px)' : 'translateX(0)',
                  transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}>
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>

          {/* Sign up prompt */}
          <p style={{
            marginTop: 28, textAlign: 'center',
            fontFamily: V1.fontBody, fontSize: 15, color: V1.text,
            ...enter(320),
          }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onApply}
              onMouseEnter={() => setHoverApply(true)}
              onMouseLeave={() => setHoverApply(false)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 0,
                fontFamily: V1.fontBody, fontSize: 15, fontWeight: 700,
                color: V1.blue,
                textDecoration: hoverApply ? 'underline' : 'none',
                textUnderlineOffset: 3,
              }}
            >
              Sign up for free
            </button>
          </p>

          {/* Legal */}
          <p style={{
            marginTop: 20, textAlign: 'center',
            fontFamily: V1.fontBody, fontSize: 13, lineHeight: 1.5,
            color: V1.muted,
            ...enter(360),
          }}>
            By signing in, you agree to our {legalLink('Terms of Service', 'terms')} and {legalLink('Privacy Policy', 'privacy')}
          </p>
        </div>

        {/* Success state */}
        <div style={{
          opacity: sent ? 1 : 0,
          transform: sent ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 480ms cubic-bezier(0.22, 1, 0.36, 1) 120ms, transform 480ms cubic-bezier(0.22, 1, 0.36, 1) 120ms',
          pointerEvents: sent ? 'auto' : 'none',
          position: sent ? 'static' : 'absolute',
        }}>
          {sent && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  width: 64, height: 64, borderRadius: 999,
                  background: V1.blue,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 14px 32px -12px ${V1.blue}99`,
                }}>
                  <svg width="26" height="26" viewBox="0 0 16 16" style={{ color: '#fff' }}>
                    <path d="M3 8.2L6.5 11.7 13 5.2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>

              <h2 data-v1-section-title style={{
                fontFamily: V1.fontDisplay,
                fontSize: 'clamp(1.8rem, 3.6vw, 2.3rem)', fontWeight: 800,
                letterSpacing: '-0.035em', lineHeight: 1.05, color: V1.ink,
                margin: '24px 0 0',
              }}>
                Magic link sent.
              </h2>

              <p style={{
                margin: '14px auto 0', maxWidth: 380,
                fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.55, color: V1.text,
              }}>
                We emailed a sign-in link to{' '}
                <span style={{ color: V1.ink, fontWeight: 600 }}>{email || 'operator@delt.capital'}</span>.
                Open it on this device to finish signing in.
              </p>

              <div style={{
                marginTop: 16,
                fontFamily: V1.fontBody, fontSize: 13, color: V1.muted,
              }}>
                Sent · {nowLabel} · expires in 10 min
              </div>

              <div style={{
                marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
              }}>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#fff', border: `1px solid ${V1.line}`,
                    padding: '13px 22px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700,
                    lineHeight: 1, color: V1.ink,
                    transition: 'border-color 220ms, background 220ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = V1.ink; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = V1.line; }}
                >
                  Resend link
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: V1.blue, color: '#fff', border: 'none',
                    padding: '13px 22px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 700,
                    lineHeight: 1,
                    boxShadow: `0 6px 18px -8px ${V1.blue}aa`,
                  }}
                >
                  Back to site
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { V1LoginPage });
