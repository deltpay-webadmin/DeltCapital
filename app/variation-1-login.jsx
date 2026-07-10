// V1 Login — split editorial sign-in (Payoneer-style), Delt-branded.
// A floating rounded card on a soft canvas: left half is a full-bleed
// photograph of a real small-business operator with a dark gradient wash and an
// oversized headline; right half is a clean white sign-in form.
//
// HERO IMAGE: swap `HERO_SRC` for any other asset (e.g. a Nano Banana Pro
// render dropped into app/assets/) — everything else is layout, so a new file
// or a new path is the only change needed.
const V1_LOGIN_HERO_SRC = 'app/assets/cases/03_bloom.jpg';

function V1LoginPage({ onClose, onSignIn, onApply, onNavLegal }) {
  const mounted = useV1Mounted(60);
  const [email, setEmail]               = React.useState('');
  const [password, setPassword]         = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [focused, setFocused]           = React.useState(null);
  const [hover, setHover]               = React.useState(null);
  const [signed, setSigned]             = React.useState(false);

  const grad = 'linear-gradient(90deg, #4F46FF 0%, #8B5CF6 100%)';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSigned(true);
    onSignIn && onSignIn(email || 'operator@delt.capital');
  };

  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
    transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const field = (name) => ({
    width: '100%', boxSizing: 'border-box',
    background: '#fff',
    border: `1px solid ${focused === name ? V1.blue : '#e3e6eb'}`,
    borderRadius: 999,
    padding: '15px 22px',
    fontFamily: V1.fontBody, fontSize: 15, color: V1.ink,
    outline: 'none',
    boxShadow: focused === name ? `0 0 0 4px ${V1.blue}1f` : '0 1px 2px rgba(16,24,40,0.04)',
    transition: 'border-color 180ms, box-shadow 180ms',
  });

  return (
    <section data-v1-section style={{
      minHeight: 'calc(100vh - 96px)',
      background: 'radial-gradient(120% 120% at 50% 0%, #f3f4f7 0%, #e9ebef 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px',
    }}>
      <div data-v1-grid-2col style={{
        width: '100%', maxWidth: 1120,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        background: '#fff',
        borderRadius: 28, overflow: 'hidden',
        boxShadow: '0 40px 90px -40px rgba(4,30,66,0.45), 0 2px 8px rgba(4,30,66,0.06)',
        minHeight: 620,
        ...enter(40),
      }}>

        {/* ─── LEFT — editorial photo panel ─── */}
        <aside style={{
          position: 'relative',
          background: V1.ink,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '32px 36px 40px',
          minHeight: 620,
        }}>
          {/* Photo */}
          <img
            src={V1_LOGIN_HERO_SRC}
            alt="A small-business owner opening up for the day"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '62% 32%',
              transform: mounted ? 'scale(1)' : 'scale(1.06)',
              transition: 'transform 1400ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
          {/* Gradient wash for legibility */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(9,10,20,0.84) 0%, rgba(9,10,20,0.52) 15%, rgba(9,10,20,0.14) 34%, rgba(9,10,20,0.44) 74%, rgba(9,10,20,0.88) 100%)',
          }} />
          {/* Faint concentric ring, echoing the reference */}
          <div aria-hidden style={{
            position: 'absolute', top: '30%', left: '50%',
            width: 360, height: 360, transform: 'translate(-50%,-50%)',
            border: '1px solid rgba(255,255,255,0.10)', borderRadius: 999,
          }} />
          <div aria-hidden style={{
            position: 'absolute', top: '30%', left: '50%',
            width: 240, height: 240, transform: 'translate(-50%,-50%)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999,
          }} />

          {/* Top row: wordmark + tagline */}
          <div style={{ position: 'relative', zIndex: 1, ...enter(140) }}>
            <img src="app/assets/logo-white.png" alt="Delt Capital" style={{ height: 22, width: 'auto', display: 'block', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.55))' }} />
            <p style={{
              margin: '18px 0 0', maxWidth: 300,
              fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.5,
              color: 'rgba(255,255,255,0.95)',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}>
              Capital for operators who don't overpay — approved in minutes, wired in 24 hours.
            </p>
          </div>

          {/* Headline */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 data-v1-section-title style={{
              margin: 0,
              fontFamily: V1.fontDisplay,
              fontSize: 'clamp(2.4rem, 3.4vw, 3.1rem)',
              fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.035em',
              color: '#fff',
            }}>
              <V1LineMask ready={mounted} delay={240} duration={900}>Capital that</V1LineMask>
              <V1LineMask ready={mounted} delay={340} duration={900}>keeps you moving.</V1LineMask>
            </h1>
          </div>
        </aside>

        {/* ─── RIGHT — sign-in form ─── */}
        <div style={{
          position: 'relative',
          background: '#fff',
          padding: '32px 56px 40px',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Top row: Sign Up */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            ...enter(80),
          }}>
            <button
              type="button"
              onClick={onApply}
              onMouseEnter={() => setHover('signup')}
              onMouseLeave={() => setHover(null)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: V1.fontBody, fontSize: 14, fontWeight: 500,
                color: hover === 'signup' ? V1.blue : V1.text,
                transition: 'color 180ms',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="7" r="3.2"/><path d="M2.5 16.5c0-3 2.5-4.8 5.5-4.8s5.5 1.8 5.5 4.8"/><path d="M15.5 6.5v4M17.5 8.5h-4"/>
              </svg>
              Sign Up
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 380, width: '100%', margin: '0 auto' }}>
            {!signed ? (
              <>
                <h2 data-v1-section-title style={{
                  margin: '0 0 28px',
                  fontFamily: V1.fontDisplay,
                  fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05,
                  color: V1.ink,
                  ...enter(160),
                }}>
                  Sign In
                </h2>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={enter(220)}>
                      <input
                        id="login-email"
                        type="text"
                        placeholder="Email or Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        autoComplete="username"
                        style={field('email')}
                      />
                    </div>

                    <div style={{ position: 'relative', ...enter(280) }}>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused(null)}
                        autoComplete="current-password"
                        style={{ ...field('password'), paddingRight: 48 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        style={{
                          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          padding: 4, color: V1.muted, display: 'inline-flex',
                        }}
                      >
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z"/><circle cx="8" cy="8" r="1.8"/><path d="M2.5 2.5l11 11"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z"/><circle cx="8" cy="8" r="1.8"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, ...enter(320) }}>
                    <button
                      type="button"
                      onMouseEnter={() => setHover('forgot')}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                        fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600,
                        color: V1.blue,
                        textDecoration: hover === 'forgot' ? 'underline' : 'none',
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    onMouseEnter={() => setHover('submit')}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      position: 'relative', overflow: 'hidden',
                      width: '100%', marginTop: 26,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      background: grad, color: '#fff', border: 'none',
                      padding: '16px 26px', borderRadius: 999, cursor: 'pointer',
                      fontFamily: V1.fontDisplay, fontSize: 15.5, fontWeight: 600, lineHeight: 1,
                      boxShadow: hover === 'submit'
                        ? '0 16px 34px -12px rgba(79,70,255,0.62)'
                        : '0 10px 24px -12px rgba(79,70,255,0.5)',
                      transform: hover === 'submit' ? 'translateY(-1px)' : 'translateY(0)',
                      transition: 'box-shadow 240ms, transform 240ms',
                      ...enter(380),
                    }}
                  >
                    <span aria-hidden style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)',
                      transform: hover === 'submit' ? 'translateX(120%)' : 'translateX(-120%)',
                      transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }} />
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10h9M9.5 5.5L14 10l-4.5 4.5"/><path d="M13.5 4.5h2.5v11h-2.5"/>
                    </svg>
                    Sign In
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={{
                    width: 60, height: 60, borderRadius: 999, background: grad,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 16px 34px -12px rgba(79,70,255,0.6)',
                  }}>
                    <svg width="26" height="26" viewBox="0 0 16 16" style={{ color: '#fff' }}>
                      <path d="M3 8.2L6.5 11.7 13 5.2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <h2 style={{
                  margin: '20px 0 0', fontFamily: V1.fontDisplay, fontSize: 26, fontWeight: 700,
                  letterSpacing: '-0.025em', color: V1.ink,
                }}>
                  You're signed in.
                </h2>
                <p style={{ margin: '10px 0 0', fontFamily: V1.fontBody, fontSize: 14.5, color: V1.text }}>
                  Welcome back, <span style={{ color: V1.ink, fontWeight: 600 }}>{email || 'operator@delt.capital'}</span>.
                </p>
                <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setSigned(false)}
                    style={{
                      border: '1px solid #e3e6eb', borderRadius: 999, padding: '12px 24px',
                      background: '#fff', cursor: 'pointer',
                      fontFamily: V1.fontDisplay, fontSize: 14.5, fontWeight: 600, color: V1.ink,
                    }}
                  >
                    Sign out
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      border: 'none', borderRadius: 999, padding: '12px 24px',
                      background: grad, color: '#fff', cursor: 'pointer',
                      fontFamily: V1.fontDisplay, fontSize: 14.5, fontWeight: 600,
                    }}
                  >
                    Continue to Delt
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap', marginTop: 24,
            ...enter(460),
          }}>
            <span style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted }}>
              © 2005–2026 Delt Capital LLC.
            </span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
              <button
                type="button"
                onClick={onClose}
                onMouseEnter={() => setHover('contact')}
                onMouseLeave={() => setHover(null)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: V1.fontBody, fontSize: 12.5,
                  color: hover === 'contact' ? V1.ink : V1.text,
                }}
              >
                Contact Us
              </button>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: V1.fontBody, fontSize: 12.5, color: V1.text,
              }}>
                English
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4.5L6 7.5 9 4.5"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { V1LoginPage });
