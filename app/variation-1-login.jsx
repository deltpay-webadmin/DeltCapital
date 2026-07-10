// V1 Login — Apple Account–style sign-in, recut for Delt.
// A single centered white card on a near-white canvas: a dotted brand "halo"
// around the Delt mark, one rounded identifier field, a two-step
// email → password flow, a primary Continue and a dark Passkey button, an
// account-info blurb, and a slim legal footer.

// ─── Brand halo emblem (Delt take on Apple's dotted ring) ───────────
function V1LoginHalo() {
  const cx = 100, cy = 100;
  const colors = ['#4945FF', '#635BFF', '#8B79F0', '#B07CE8', '#D77BD0', '#E87CA6', '#F0997C', '#F4B77C', '#9FB4FC', '#7C9BF4'];
  const rings = [
    { r: 84, count: 46, base: 3.1, off: 0.0 },
    { r: 63, count: 34, base: 2.7, off: 0.11 },
  ];
  const dots = [];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.count; i++) {
      const a = (i / ring.count) * Math.PI * 2 + ring.off;
      const x = cx + ring.r * Math.cos(a);
      const y = cy + ring.r * Math.sin(a);
      const size = ring.base * (0.72 + ((i % 3) * 0.2));
      const color = colors[(i + ri * 3) % colors.length];
      const opacity = 0.45 + ((i % 4) * 0.16);
      dots.push({ x, y, size, color, opacity, key: ri + '-' + i });
    }
  });
  return (
    <div style={{ position: 'relative', width: 116, height: 116 }}>
      <svg width="116" height="116" viewBox="0 0 200 200" aria-hidden>
        {dots.map(d => (
          <circle key={d.key} cx={d.x} cy={d.y} r={d.size} fill={d.color} opacity={d.opacity} />
        ))}
      </svg>
      {/* Delt mark, centered */}
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <rect x="34" y="9" width="14" height="46" rx="7" fill="#4945FF" />
        <circle cx="20" cy="44" r="11" fill="#4945FF" />
      </svg>
    </div>
  );
}

function V1LoginPage({ onClose, onSignIn, onApply, onNavLegal }) {
  const mounted = useV1Mounted(60);
  const [step, setStep]                 = React.useState('email'); // 'email' | 'password' | 'done'
  const [email, setEmail]               = React.useState('');
  const [password, setPassword]         = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe]     = React.useState(false);
  const [focused, setFocused]           = React.useState(null);
  const [hover, setHover]               = React.useState(null);

  const APPLE = {
    ink:    '#1d1d1f',
    sub:    '#6e6e73',
    line:   '#d2d2d7',
    field:  '#ffffff',
    canvas: '#fbfbfd',
    link:   V1.blue,
    key:    '#1d1d1f',
  };

  const canContinue = email.trim().length > 0;
  const canSignIn   = password.length > 0;

  const handleContinue = (e) => {
    e.preventDefault();
    if (!canContinue) return;
    setStep('password');
    setFocused('password');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!canSignIn) return;
    setStep('done');
    onSignIn && onSignIn(email || 'operator@delt.capital');
  };

  const enter = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0,8px,0)',
    transition: `opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const fieldStyle = (name) => ({
    width: '100%', boxSizing: 'border-box',
    background: APPLE.field,
    border: `1px solid ${focused === name ? V1.blue : APPLE.line}`,
    borderRadius: 12,
    padding: '15px 16px',
    fontFamily: V1.fontBody, fontSize: 17, color: APPLE.ink,
    outline: 'none',
    boxShadow: focused === name ? `0 0 0 3px ${V1.blue}22` : 'none',
    transition: 'border-color 160ms, box-shadow 160ms',
  });

  const footerLink = (label, onClick) => (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover('f-' + label)}
      onMouseLeave={() => setHover(null)}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
        fontFamily: V1.fontBody, fontSize: 12, color: APPLE.sub,
        textDecoration: hover === ('f-' + label) ? 'underline' : 'none',
      }}
    >{label}</button>
  );

  return (
    <section data-v1-section style={{
      minHeight: 'calc(100vh - 96px)',
      background: APPLE.canvas,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '56px 24px 40px',
      }}>
        <div style={{
          width: '100%', maxWidth: 640,
          background: '#ffffff',
          borderRadius: 18,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 18px 48px -12px rgba(0,0,0,0.14)',
          padding: '48px 40px 40px',
          ...enter(40),
        }}>
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            {/* Emblem */}
            <div style={{ display: 'flex', justifyContent: 'center', ...enter(80) }}>
              <V1LoginHalo />
            </div>

            {/* Heading */}
            <h1 data-v1-section-title style={{
              textAlign: 'center', margin: '18px 0 0',
              fontFamily: V1.fontDisplay,
              fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em',
              color: APPLE.ink,
              ...enter(120),
            }}>
              Sign in with Delt Account
            </h1>

            {step !== 'done' && (
              <form onSubmit={step === 'email' ? handleContinue : handleSignIn} style={{ marginTop: 28 }}>
                {/* Identifier field */}
                <div style={enter(180)}>
                  <input
                    id="login-email"
                    type="text"
                    inputMode="email"
                    placeholder="Email or Phone Number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    readOnly={step === 'password'}
                    autoComplete="username"
                    style={{
                      ...fieldStyle('email'),
                      color: step === 'password' ? APPLE.sub : APPLE.ink,
                      cursor: step === 'password' ? 'default' : 'text',
                    }}
                  />
                </div>

                {/* Password field (step 2) */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: step === 'password' ? 140 : 0,
                  opacity: step === 'password' ? 1 : 0,
                  transition: 'max-height 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease',
                }}>
                  <div style={{ position: 'relative', marginTop: 12 }}>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      autoComplete="current-password"
                      style={{ ...fieldStyle('password'), paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        padding: 4, color: APPLE.sub, display: 'inline-flex',
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
                  <label style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14,
                    cursor: 'pointer', fontFamily: V1.fontBody, fontSize: 14, color: APPLE.sub,
                  }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: `1.5px solid ${rememberMe ? V1.blue : APPLE.line}`,
                      background: rememberMe ? V1.blue : '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" style={{ color: '#fff', opacity: rememberMe ? 1 : 0 }}>
                        <path d="M2 5.2L4.2 7.4 8.2 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
                    Keep me signed in
                  </label>
                </div>

                {/* Create account / Forgot */}
                <div style={{ marginTop: 16, ...enter(240) }}>
                  {step === 'email' ? (
                    <button
                      type="button"
                      onClick={onApply}
                      onMouseEnter={() => setHover('create')}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                        fontFamily: V1.fontBody, fontSize: 15, color: APPLE.link,
                        textDecoration: hover === 'create' ? 'underline' : 'none',
                      }}
                    >Create Your Delt Account</button>
                  ) : (
                    <button
                      type="button"
                      onMouseEnter={() => setHover('forgot')}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                        fontFamily: V1.fontBody, fontSize: 15, color: APPLE.link,
                        textDecoration: hover === 'forgot' ? 'underline' : 'none',
                      }}
                    >Forgot password?</button>
                  )}
                </div>

                {/* Account-info blurb */}
                <div style={{ marginTop: 22, ...enter(300) }}>
                  <svg width="30" height="24" viewBox="0 0 30 24" style={{ display: 'block', marginBottom: 8 }}>
                    <circle cx="9" cy="7" r="4.2" fill={V1.blue} />
                    <path d="M2 21c0-4 3.1-6.4 7-6.4S16 17 16 21z" fill={V1.blue} />
                    <circle cx="21.5" cy="9" r="3.2" fill="#9FB4FC" />
                    <path d="M16.5 21c0-3.1 2.3-5 5-5s5 1.9 5 5z" fill="#9FB4FC" />
                  </svg>
                  <p style={{
                    margin: 0, fontFamily: V1.fontBody, fontSize: 12.5, lineHeight: 1.5, color: APPLE.sub,
                  }}>
                    Your Delt Account information is used to allow you to sign in securely and
                    access your data. Delt records certain data for security, support, and
                    reporting purposes. If you agree, Delt may also use your account
                    information to send you product updates and communications.{' '}
                    <button
                      type="button"
                      onClick={() => onNavLegal && onNavLegal('privacy')}
                      onMouseEnter={() => setHover('manage')}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                        fontFamily: 'inherit', fontSize: 'inherit', color: APPLE.link,
                        textDecoration: hover === 'manage' ? 'underline' : 'none',
                      }}
                    >See how your data is managed…</button>
                  </p>
                </div>

                {/* Actions */}
                <div style={{
                  marginTop: 26, display: 'flex', gap: 12, alignItems: 'stretch',
                  ...enter(360),
                }}>
                  <button
                    type="submit"
                    disabled={step === 'email' ? !canContinue : !canSignIn}
                    onMouseEnter={() => setHover('primary')}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      flex: 1,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      border: 'none', borderRadius: 12, padding: '13px 20px',
                      fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600, lineHeight: 1,
                      color: '#fff',
                      background: (step === 'email' ? canContinue : canSignIn)
                        ? (hover === 'primary' ? '#3a36e0' : V1.blue)
                        : '#b7c1f7',
                      cursor: (step === 'email' ? canContinue : canSignIn) ? 'pointer' : 'default',
                      transition: 'background 200ms',
                    }}
                  >
                    {step === 'email' ? 'Continue' : 'Sign In'}
                  </button>

                  {step === 'email' && (
                    <button
                      type="button"
                      onClick={() => onSignIn && onSignIn(email || 'operator@delt.capital')}
                      onMouseEnter={() => setHover('passkey')}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        flex: 1,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        border: 'none', borderRadius: 12, padding: '13px 20px',
                        fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600, lineHeight: 1,
                        color: '#fff',
                        background: hover === 'passkey' ? '#000' : APPLE.key,
                        cursor: 'pointer', transition: 'background 200ms',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="7" cy="8" r="3.2"/>
                        <path d="M9.6 9.8L15 15.2M13 13.2l1.6 1.6M15 15.2l1.4-1.4"/>
                      </svg>
                      Sign in with Passkey
                    </button>
                  )}

                  {step === 'password' && (
                    <button
                      type="button"
                      onClick={() => { setStep('email'); setPassword(''); }}
                      onMouseEnter={() => setHover('back')}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${APPLE.line}`, borderRadius: 12, padding: '13px 20px',
                        fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600, lineHeight: 1,
                        color: APPLE.ink, background: hover === 'back' ? '#f5f5f7' : '#fff',
                        cursor: 'pointer', transition: 'background 200ms',
                      }}
                    >
                      Back
                    </button>
                  )}
                </div>

                {step === 'email' && (
                  <p style={{
                    margin: '10px 0 0', textAlign: 'right', flexBasis: '100%',
                    fontFamily: V1.fontBody, fontSize: 12, color: APPLE.sub,
                    ...enter(420),
                  }}>
                    Requires a device with a saved Delt passkey.
                  </p>
                )}
              </form>
            )}

            {/* Signed-in confirmation */}
            {step === 'done' && (
              <div style={{ marginTop: 28, textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={{
                    width: 56, height: 56, borderRadius: 999, background: V1.blue,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 14px 32px -12px ${V1.blue}99`,
                  }}>
                    <svg width="24" height="24" viewBox="0 0 16 16" style={{ color: '#fff' }}>
                      <path d="M3 8.2L6.5 11.7 13 5.2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <h2 style={{
                  margin: '18px 0 0', fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 700,
                  letterSpacing: '-0.02em', color: APPLE.ink,
                }}>
                  You're signed in.
                </h2>
                <p style={{ margin: '8px 0 0', fontFamily: V1.fontBody, fontSize: 14.5, color: APPLE.sub }}>
                  Welcome back, <span style={{ color: APPLE.ink }}>{email || 'operator@delt.capital'}</span>.
                </p>
                <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setPassword(''); }}
                    style={{
                      border: `1px solid ${APPLE.line}`, borderRadius: 12, padding: '12px 22px',
                      background: '#fff', cursor: 'pointer',
                      fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600, color: APPLE.ink,
                    }}
                  >
                    Sign out
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      border: 'none', borderRadius: 12, padding: '12px 22px',
                      background: V1.blue, color: '#fff', cursor: 'pointer',
                      fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600,
                    }}
                  >
                    Continue to Delt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slim legal footer */}
      <footer style={{
        borderTop: `1px solid ${APPLE.line}`,
        background: '#f5f5f7',
        padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
        ...enter(480),
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          {footerLink('System Status', onClose)}
          <span style={{ width: 1, height: 12, background: APPLE.line }} />
          {footerLink('Privacy Policy', () => onNavLegal && onNavLegal('privacy'))}
          <span style={{ width: 1, height: 12, background: APPLE.line }} />
          {footerLink('Terms & Conditions', () => onNavLegal && onNavLegal('terms'))}
        </div>
        <span style={{ fontFamily: V1.fontBody, fontSize: 12, color: APPLE.sub }}>
          Copyright © 2026 Delt Capital LLC. All rights reserved.
        </span>
      </footer>
    </section>
  );
}

Object.assign(window, { V1LoginPage });
