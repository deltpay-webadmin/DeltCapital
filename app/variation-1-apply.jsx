// V1 Apply Flow — same 5 steps (Business · Bank · Identity · Offer · Done)
// and identical behavior as the original ApplicationFlow in app.jsx, but
// reskinned for V1: full-viewport modal, left rail with large numbered
// stepper + trust marks, right panel with generous typography, V1 violet
// accent. Plaid "Connect bank" UI kept intentionally close to the original
// intent (bank grid → connecting spinner → read-back stats on success).

const V1APPLY_BANKS = [
  { name: 'Chase',          c1: '#117ACA', c2: '#0A5BA0', mark: 'J' },
  { name: 'Bank of America',c1: '#E31837', c2: '#9F1120', mark: 'B' },
  { name: 'Wells Fargo',    c1: '#D71E28', c2: '#7A1015', mark: 'W' },
  { name: 'Citi',           c1: '#003B70', c2: '#00264A', mark: 'C' },
  { name: 'US Bank',        c1: '#0066B2', c2: '#00417A', mark: 'U' },
  { name: 'PNC',            c1: '#F58025', c2: '#A94F10', mark: 'P' },
  { name: 'Capital One',    c1: '#004977', c2: '#002B47', mark: 'C' },
  { name: 'Other',          c1: V1.ink,    c2: '#1A2438', mark: '+' },
];

const V1APPLY_STEPS = ['Business', 'Bank', 'Identity', 'Offer', 'Done'];

// ─── Field formatters & validators ───
// EIN auto-formats to XX-XXXXXXX and phone to (555) 555-0199 as the user
// types; the validators below gate the Continue button so every Business
// field must be present and well-formed before advancing.
function formatEIN(v) {
  const d = (v || '').replace(/\D/g, '').slice(0, 9);
  return d.length <= 2 ? d : `${d.slice(0, 2)}-${d.slice(2)}`;
}
function formatPhone(v) {
  const d = (v || '').replace(/\D/g, '').slice(0, 10);
  if (d.length === 0) return '';
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
const v1IsEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
const v1IsEIN   = (v) => (v || '').replace(/\D/g, '').length === 9;
const v1IsPhone = (v) => (v || '').replace(/\D/g, '').length === 10;
const v1NotBlank = (v) => !!(v && v.trim());

// Every Business-step field must be filled and well-formed to proceed.
function v1BusinessComplete(form) {
  return (
    v1NotBlank(form.businessName) &&
    v1IsEIN(form.ein) &&
    v1NotBlank(form.legalForm) &&
    v1NotBlank(form.state) &&
    v1NotBlank(form.firstName) &&
    v1NotBlank(form.lastName) &&
    v1IsEmail(form.email) &&
    v1IsPhone(form.phone)
  );
}

function V1ApplyField({ label, hint, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
        marginBottom: 7,
      }}>
        <span style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
        }}>{label}</span>
        {hint && (
          <span style={{
            fontFamily: V1.fontBody, fontSize: 11.5, color: V1.muted, fontStyle: 'italic',
          }}>{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function V1ApplyInput({ value, onChange, placeholder, type = 'text', accent, inputMode, invalid }) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      value={value || ''}
      placeholder={placeholder}
      aria-invalid={invalid ? 'true' : undefined}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.currentTarget.style.borderColor = invalid ? V1.red : accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${(invalid ? V1.red : accent)}26`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = invalid ? V1.red : V1.line; e.currentTarget.style.boxShadow = 'none'; }}
      style={{
        width: '100%', padding: '13px 14px',
        background: V1.white,
        border: `1px solid ${invalid ? V1.red : V1.line}`, borderRadius: 10,
        fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink,
        outline: 'none', transition: 'border-color .15s, box-shadow .15s',
      }}
    />
  );
}

function V1ApplySelect({ value, onChange, opts, accent }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}26`; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = V1.line; e.currentTarget.style.boxShadow = 'none'; }}
        style={{
          width: '100%', padding: '13px 40px 13px 14px',
          background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 10,
          fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink,
          outline: 'none', cursor: 'pointer', appearance: 'none',
          transition: 'border-color .15s, box-shadow .15s',
        }}
      >
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg width="12" height="12" viewBox="0 0 12 12"
        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        fill="none" stroke={V1.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4.5L6 7.5L9 4.5"/>
      </svg>
    </div>
  );
}

// ─── Step 1: Business ───
function V1StepBusiness({ form, setForm, accent }) {
  return (
    <div>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: accent,
      }}>Step 01 · Business</div>
      <h3 style={{
        fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 600,
        letterSpacing: '-0.03em', color: V1.ink, margin: '10px 0 8px', lineHeight: 1.1,
      }}>Tell us about your business.</h3>
      <p style={{
        fontFamily: V1.fontBody, fontSize: 15, color: V1.muted,
        lineHeight: 1.55, margin: 0, maxWidth: 520,
      }}>
        Used to verify entity formation and file a KYB check. We don't hard-pull
        business credit and we don't surface this to bureaus.
      </p>

      <div data-v1-form-grid style={{
        marginTop: 30,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18,
      }}>
        <V1ApplyField label="Legal business name">
          <V1ApplyInput value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} placeholder="La Rosa Restaurant LLC" accent={accent} />
        </V1ApplyField>
        <V1ApplyField label="EIN" hint="9 digits">
          <V1ApplyInput value={form.ein} onChange={(v) => setForm({ ...form, ein: formatEIN(v) })} placeholder="12-3456789" accent={accent} inputMode="numeric" invalid={!!form.ein && !v1IsEIN(form.ein)} />
        </V1ApplyField>
        <V1ApplyField label="Entity type">
          <V1ApplySelect value={form.legalForm} onChange={(v) => setForm({ ...form, legalForm: v })} opts={['LLC', 'S-Corp', 'C-Corp', 'Sole Prop', 'Partnership']} accent={accent} />
        </V1ApplyField>
        <V1ApplyField label="State of operation">
          <V1ApplySelect value={form.state} onChange={(v) => setForm({ ...form, state: v })} opts={['CA','TX','FL','NY','IL','GA','WA','CO','AZ','NJ','Other']} accent={accent} />
        </V1ApplyField>
        <V1ApplyField label="First name">
          <V1ApplyInput value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} placeholder="Maria" accent={accent} />
        </V1ApplyField>
        <V1ApplyField label="Last name">
          <V1ApplyInput value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} placeholder="Rodriguez" accent={accent} />
        </V1ApplyField>
        <V1ApplyField label="Email">
          <V1ApplyInput type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@business.com" accent={accent} inputMode="email" invalid={!!form.email && !v1IsEmail(form.email)} />
        </V1ApplyField>
        <V1ApplyField label="Phone">
          <V1ApplyInput value={form.phone} onChange={(v) => setForm({ ...form, phone: formatPhone(v) })} placeholder="(555) 555-0199" accent={accent} inputMode="tel" invalid={!!form.phone && !v1IsPhone(form.phone)} />
        </V1ApplyField>
      </div>
    </div>
  );
}

// ─── Step 2: Bank (Plaid) ───
function V1StepBank({ form, setForm, accent, onAdvance, autoOpen }) {
  const [plaidOpen, setPlaidOpen] = React.useState(false);

  // When the user lands on Bank via the email deep-link we kick Plaid Link
  // open automatically — they've already committed once (clicked the
  // email CTA), and the gap between "page loaded" and "first action" is
  // where most apply-flow drop-off happens. Only fire when the bank isn't
  // already connected (e.g. user is resuming a finished step) and only
  // once per mount.
  const autoOpenedRef = React.useRef(false);
  React.useEffect(() => {
    if (!autoOpen) return;
    if (autoOpenedRef.current) return;
    if (form.bankConnected) return;
    autoOpenedRef.current = true;
    // Defer one tick so the Bank step has actually painted before Plaid's
    // popup steals focus — keeps the transition from looking jarring.
    const t = setTimeout(() => setPlaidOpen(true), 350);
    return () => clearTimeout(t);
  }, [autoOpen, form.bankConnected]);

  const handlePlaidSuccess = (data) => {
    setPlaidOpen(false);
    setForm({
      ...form,
      bankConnected: true,
      bankInstitution: data.institution,
      bankAccounts: data.accounts,
    });
    setTimeout(() => { onAdvance && onAdvance(); }, 700);
  };

  return (
    <div>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: accent,
      }}>Step 02 · Connect</div>
      <h3 style={{
        fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 600,
        letterSpacing: '-0.03em', color: V1.ink, margin: '10px 0 8px', lineHeight: 1.1,
      }}>Link your deposits.{' '}
        <em style={{
          fontFamily: '"Source Serif Pro", Georgia, serif',
          fontStyle: 'italic', fontWeight: 400, color: accent,
        }}>Read-only.</em>
      </h3>
      <p style={{
        fontFamily: V1.fontBody, fontSize: 15, color: V1.muted,
        lineHeight: 1.55, margin: 0, maxWidth: 540,
      }}>
        90 days of deposits via Plaid. We see balances, not credentials. No ACH
        authorization yet — you revoke access anytime at my.plaid.com.
      </p>

      {/* State A — success */}
      {form.bankConnected && (
        <div style={{
          marginTop: 26, background: V1.white,
          border: `1px solid ${V1.line}`, borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14,
            background: `linear-gradient(180deg, ${accent}0A, transparent)`,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `linear-gradient(135deg, ${accent}, #818CF8)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: V1.white, fontFamily: V1.fontDisplay, fontWeight: 700, fontSize: 20,
              letterSpacing: '-0.02em',
            }}>✓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 600, color: V1.ink }}>
                {form.bankInstitution || 'Chase'}{form.bankAccounts && form.bankAccounts[0] ? ` · ${form.bankAccounts[0]}` : ' · Business Complete · ••1842'}
              </div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 11.5, color: V1.muted,
                letterSpacing: '0.06em', marginTop: 3,
              }}>
                90 DAYS · {form.bankAccounts ? form.bankAccounts.length : 1} ACCOUNT{form.bankAccounts && form.bankAccounts.length !== 1 ? 'S' : ''}
              </div>
            </div>
            <button
              onClick={() => setForm({ ...form, bankConnected: false })}
              style={{
                padding: '7px 12px', borderRadius: 8, border: `1px solid ${V1.line}`,
                background: 'transparent', color: V1.muted, cursor: 'pointer',
                fontFamily: V1.fontBody, fontSize: 12.5,
              }}
            >Re-link</button>
          </div>
        </div>
      )}

      {/* State B — pre-connect: Plaid CTA + trust strip */}
      {!form.bankConnected && (
        <>
          <div style={{
            marginTop: 26, padding: '14px 18px',
            background: `${accent}10`,
            borderLeft: `2px solid ${accent}`, borderRadius: '2px 10px 10px 2px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M6 4V2.5h4V4"/><circle cx="8" cy="9" r="1.5"/>
            </svg>
            <div style={{
              fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.55, color: V1.ink,
            }}>
              Plaid opens a secure popup — you enter your bank credentials with them,
              not us. Same infrastructure as Venmo, Chime, and Robinhood.
            </div>
          </div>

          <button
            onClick={() => setPlaidOpen(true)}
            style={{
              marginTop: 22, width: '100%', maxWidth: 420,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: '#000', color: '#fff', border: 'none',
              padding: '14px 22px', borderRadius: 10, cursor: 'pointer',
              fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600,
              boxShadow: '0 8px 22px -10px rgba(0,0,0,0.5)',
              transition: 'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 28px -10px rgba(0,0,0,0.55)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 22px -10px rgba(0,0,0,0.5)'; }}
          >
            <V1PlaidLogo size={14} color="#fff" />
            Connect with Plaid
          </button>

          <div style={{
            marginTop: 22, display: 'flex', gap: 20,
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
          }}>
            <span>⚡ 256-bit TLS</span>
            <span>◇ SOC 2 Type II</span>
            <span>✓ Plaid Partner</span>
          </div>
        </>
      )}

      <V1PlaidLink open={plaidOpen} onClose={() => setPlaidOpen(false)} onSuccess={handlePlaidSuccess} />
    </div>
  );
}

// ─── Step 3: Identity ───
function V1StepIdentity({ form, setForm, accent, onAdvance }) {
  const [idvOpen, setIdvOpen] = React.useState(false);
  const idvDone = !!form.idVerified;
  const handleIdvComplete = (data) => {
    setIdvOpen(false);
    setForm({ ...form, idVerified: !!data.idVerified });
  };

  // Auto-advance once IDV + SSN are both satisfied. Critically this also
  // fires when the *phone* finishes IDV — V1IDVerify polls the IDV status
  // and calls handleIdvComplete, which flips idVerified true here.
  // Skip the auto-advance if the user landed back on this step with both
  // already filled (e.g. via Back from Offer).
  const [armed] = React.useState(() =>
    !(form.idVerified && form.ssn4.length === 4)
  );
  React.useEffect(() => {
    if (armed && form.idVerified && form.ssn4.length === 4) {
      const t = setTimeout(() => { onAdvance && onAdvance(); }, 700);
      return () => clearTimeout(t);
    }
  }, [armed, form.idVerified, form.ssn4.length, onAdvance]);
  return (
    <div>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: accent,
      }}>Step 03 · Identity</div>
      <h3 style={{
        fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 600,
        letterSpacing: '-0.03em', color: V1.ink, margin: '10px 0 8px', lineHeight: 1.1,
      }}>Verify identity.</h3>
      <p style={{
        fontFamily: V1.fontBody, fontSize: 15, color: V1.muted,
        lineHeight: 1.55, margin: 0, maxWidth: 520,
      }}>
        ID + selfie via Plaid IDV, plus the last 4 of SSN for KYC. Soft-pull on
        the guarantor. No impact to your personal credit.
      </p>

      {/* Plaid IDV launcher / verified state */}
      <div style={{
        marginTop: 26, padding: '18px 20px',
        background: idvDone ? `${V1.green}0E` : V1.white,
        border: `1px solid ${idvDone ? V1.green + '55' : V1.line}`,
        borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 14, maxWidth: 620,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 999,
          background: idvDone ? V1.green : '#000', color: '#fff', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {idvDone ? (
            <svg width="18" height="18" viewBox="0 0 16 16">
              <path d="M3 8.2L6.5 11.5 13 5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <V1PlaidLogo size={14} color="#fff" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600,
            color: V1.ink, letterSpacing: '-0.015em',
          }}>
            {idvDone ? 'Identity verified via Plaid IDV' : 'Verify your identity with Plaid'}
          </div>
          <div style={{
            marginTop: 3, fontFamily: V1.fontMono, fontSize: 10.5,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: V1.muted,
          }}>
            {idvDone ? 'ID match · Selfie match · No further action' : 'Government ID + selfie · ~ 60 seconds'}
          </div>
        </div>
        {!idvDone && (
          <button
            onClick={() => setIdvOpen(true)}
            style={{
              padding: '10px 16px', borderRadius: 8,
              background: '#000', color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: V1.fontBody, fontSize: 13, fontWeight: 600,
            }}
          >Begin verification</button>
        )}
      </div>

      <div data-v1-form-grid style={{
        marginTop: 22,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, maxWidth: 480,
      }}>
        <V1ApplyField label="SSN (last 4)" hint="Masked on submit">
          <V1ApplyInput
            value={form.ssn4}
            onChange={(v) => setForm({ ...form, ssn4: v.replace(/[^0-9]/g, '').slice(0, 4) })}
            placeholder="1234" accent={accent} />
        </V1ApplyField>
        <V1ApplyField label="Use of funds">
          <V1ApplySelect
            value={form.useOfFunds}
            onChange={(v) => setForm({ ...form, useOfFunds: v })}
            opts={['Inventory', 'Equipment', 'Hiring', 'Renovation', 'Marketing', 'Bridge A/R', 'Other']}
            accent={accent} />
        </V1ApplyField>
      </div>

      <V1IDVerify open={idvOpen} onClose={() => setIdvOpen(false)} onComplete={handleIdvComplete} />

      <div style={{
        marginTop: 32, padding: '18px 20px',
        background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 12,
        display: 'flex', gap: 14, alignItems: 'flex-start', maxWidth: 620,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${accent}14`, color: accent, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2L3 5v4c0 3 2 4.5 5 6 3-1.5 5-3 5-6V5L8 2z"/><path d="M6 8l1.5 1.5L10 7"/>
          </svg>
        </div>
        <div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 14.5, fontWeight: 600,
            color: V1.ink, letterSpacing: '-0.015em',
          }}>Soft inquiry only</div>
          <div style={{
            marginTop: 4, fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted,
            lineHeight: 1.55, maxWidth: 500,
          }}>
            A hard pull happens only if you counter-sign the offer on the next
            screen — and only on the personal guarantor, not the business.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Offer ───
function V1StepOffer({ form, prefill, accent }) {
  const amount = prefill?.high || form.amount || 75000;
  const factor = prefill?.factor || 1.18;
  const total = Math.round(amount * factor);
  const term = 8;
  const weekly = Math.round(total / (term * 4.33));
  const daily = Math.round(total / (term * 22));
  const offerId = React.useMemo(() => `DLT-2026-${Math.floor(100000 + Math.random() * 900000)}`, []);

  return (
    <div>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: accent,
      }}>Step 04 · Offer</div>
      <h3 style={{
        fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 600,
        letterSpacing: '-0.03em', color: V1.ink, margin: '10px 0 8px', lineHeight: 1.1,
      }}>Your offer.{' '}
        <em style={{
          fontFamily: '"Source Serif Pro", Georgia, serif',
          fontStyle: 'italic', fontWeight: 400, color: accent,
        }}>One page.</em>
      </h3>
      <p style={{
        fontFamily: V1.fontBody, fontSize: 15, color: V1.muted,
        lineHeight: 1.55, margin: 0, maxWidth: 540,
      }}>
        No addenda, no "processing fee", no origination fee. Counter-sign to
        move to funding.
      </p>

      <div style={{
        marginTop: 26, borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${V1.line}`,
        boxShadow: '0 20px 50px -28px rgba(15,14,23,0.35)',
      }}>
        {/* Hero — advance amount */}
        <div style={{
          background: V1.ink, color: V1.white,
          padding: '28px 28px', position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', top: -120, right: -80, width: 300, height: 300,
            background: `radial-gradient(circle, ${accent}40, transparent 60%)`,
            filter: 'blur(10px)', pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, position: 'relative' }}>
            <div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
              }}>Advance amount</div>
              <div style={{
                fontFamily: V1.fontDisplay, fontSize: 56, fontWeight: 600,
                letterSpacing: '-0.04em', marginTop: 4,
                fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>${amount.toLocaleString()}</div>
              <div style={{
                marginTop: 8, fontFamily: V1.fontBody, fontSize: 13.5,
                color: 'rgba(255,255,255,0.7)',
              }}>
                Wires same-day when signed before 2:00 PM ET
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
              }}>Offer ID</div>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 13.5, color: V1.white,
                marginTop: 6, letterSpacing: '0.04em',
              }}>{offerId}</div>
              <div style={{
                marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 99,
                background: `${accent}22`, color: accent,
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: accent }} />
                Locked 72h
              </div>
            </div>
          </div>
        </div>

        {/* Terms grid */}
        <div style={{
          background: V1.white, padding: 0,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {[
            ['Factor rate', `${factor.toFixed(2)}×`],
            ['Total repayment', `$${total.toLocaleString()}`],
            ['Term', `${term} months`],
            ['Weekly debit', `$${weekly.toLocaleString()}`],
          ].map(([k, v], i) => (
            <div key={k} style={{
              padding: '22px 20px',
              borderRight: i < 3 ? `1px solid ${V1.line}` : 'none',
            }}>
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
              }}>{k}</div>
              <div style={{
                fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
                color: V1.ink, marginTop: 6, letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px', background: V1.bg,
          borderTop: `1px solid ${V1.line}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: V1.fontMono, fontSize: 11, fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase', color: V1.muted,
        }}>
          <span>No origination · No ACH · Early-pay rebate</span>
          <span>${daily.toLocaleString()} / day equiv.</span>
        </div>
      </div>

      <p style={{
        marginTop: 16, fontFamily: V1.fontBody, fontSize: 12.5,
        color: V1.muted, lineHeight: 1.5, maxWidth: 620,
      }}>
        By accepting, you agree to Delt's standard advance agreement. You'll
        receive a signed PDF and a payment schedule by email within 60 seconds
        of counter-signing.
      </p>
    </div>
  );
}

// ─── Step 5: Done ───
function V1StepDone({ form, accent }) {
  const ref = React.useMemo(() => `DLT-2026-${Math.floor(100000 + Math.random() * 900000)}`, []);
  return (
    <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
      <div style={{
        width: 84, height: 84, margin: '0 auto',
        borderRadius: 24, position: 'relative',
        background: `linear-gradient(135deg, ${accent}, #818CF8)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 30px 80px -20px ${accent}88`,
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: -12, borderRadius: 30,
          border: `2px solid ${accent}66`,
          animation: 'v1apPing 1.8s cubic-bezier(0,.55,.45,1) infinite',
        }}/>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 20l7 7 13-14"/>
        </svg>
      </div>
      <style>{`
        @keyframes v1apPing { 0%{transform:scale(.85);opacity:.8} 80%,100%{transform:scale(1.4);opacity:0} }
      `}</style>

      <div style={{
        marginTop: 22, fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: accent,
      }}>Counter-signed</div>
      <h3 style={{
        fontFamily: V1.fontDisplay, fontSize: 36, fontWeight: 600,
        letterSpacing: '-0.03em', color: V1.ink, margin: '12px 0 8px', lineHeight: 1.1,
      }}>
        You're funded.{' '}
        <em style={{
          fontFamily: '"Source Serif Pro", Georgia, serif',
          fontStyle: 'italic', fontWeight: 400, color: accent,
        }}>Tomorrow by 2 PM.</em>
      </h3>
      <p style={{
        fontFamily: V1.fontBody, fontSize: 15, color: V1.muted,
        lineHeight: 1.6, margin: '0 auto 26px', maxWidth: 480,
      }}>
        Funds will hit your connected Chase account by 2:00 PM ET tomorrow.
        Contract + amortization schedule are on the way to{' '}
        <b style={{ color: V1.ink }}>{form.email || 'your email'}</b>.
      </p>

      <div style={{
        maxWidth: 480, margin: '0 auto',
        padding: '16px 20px',
        background: V1.bg, border: `1px solid ${V1.line}`, borderRadius: 12,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
      }}>
        {[
          ['REF',     ref],
          ['FUND BY', '2:00 PM ET'],
          ['TEAM',    'Elena Morgan'],
        ].map(([k, v], i) => (
          <div key={k} style={{
            textAlign: 'center',
            borderRight: i < 2 ? `1px solid ${V1.line}` : 'none',
          }}>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 9.5, fontWeight: 600,
              letterSpacing: '0.16em', color: V1.muted,
            }}>{k}</div>
            <div style={{
              marginTop: 3, fontFamily: V1.fontMono, fontSize: 12.5,
              fontWeight: 600, color: V1.ink, letterSpacing: '0.02em',
            }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main shell ───
function V1ApplicationFlow({
  open, onClose, prefill, accent,
  // New props: see app/variation-1.jsx for the wiring.
  // • startStep    — 0 (Business) by default; 1 (Bank) when arriving via
  //                  the post-calculator email deep-link, because business
  //                  + contact are already on file from the lead-gate.
  // • autoOpenPlaid — when true, kicks Plaid Link open the instant the
  //                  Bank step paints. Pairs with startStep=1.
  // • onDraftChange — fires on each form mutation so the host can persist
  //                  progress to localStorage and let users resume later.
  // • onComplete    — fires on the "Done" step so the host can clear the
  //                  saved draft.
  startStep = 0,
  autoOpenPlaid = false,
  onDraftChange,
  onComplete,
}) {
  const [step, setStep] = React.useState(startStep);
  const [form, setForm] = React.useState({
    // Contact fields are pre-filled from the calculator lead-gate when present
    businessName: prefill?.lead?.businessName || '',
    ein: '', legalForm: 'LLC',
    firstName: prefill?.lead?.firstName || '',
    lastName: '',
    email: prefill?.lead?.email || '',
    phone: prefill?.lead?.phone || '',
    state: 'CA', useOfFunds: 'Inventory',
    bankConnected: false, bankInstitution: '', bankAccounts: null,
    ssn4: '', idVerified: false,
    // Offer amount defaults to the *high end* of the calculator estimate
    // so the slider starts where the email said the user pre-qualified.
    // The previous default of 75000 was a regression — it threw away the
    // estimate.high they were just shown.
    amount: prefill?.high || 75000,
  });

  // If the modal is re-opened with a newer prefill (e.g. user re-runs the
  // calculator and the lead-gate captures different contact info), merge
  // those values in without clobbering anything the user has typed.
  React.useEffect(() => {
    if (!open || !prefill?.lead) return;
    setForm((f) => ({
      ...f,
      businessName: f.businessName || prefill.lead.businessName || '',
      firstName:    f.firstName    || prefill.lead.firstName    || '',
      email:        f.email        || prefill.lead.email        || '',
      phone:        f.phone        || prefill.lead.phone        || '',
      amount:       prefill.high   || f.amount,
    }));
  }, [open, prefill]);
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) { setStep(startStep); setClosing(false); }
  }, [open, startStep]);

  // Persist every form mutation to the host (localStorage). We snapshot
  // the bits that pre-fill on the next visit: contact, calculator inputs,
  // and the in-progress bank/idv/amount state. Underwriting-sensitive
  // values (e.g. accept-decision) are never persisted client-side.
  React.useEffect(() => {
    if (!open) return;
    if (typeof onDraftChange !== 'function') return;
    onDraftChange({
      ...(prefill || {}),
      lead: {
        firstName:    form.firstName,
        businessName: form.businessName,
        email:        form.email,
        phone:        form.phone,
      },
      // Carry the user's in-progress offer amount so a resume lands them
      // on the slider position they had, not the prefill high.
      pendingAmount: form.amount,
    });
  }, [open, form.firstName, form.businessName, form.email, form.phone, form.amount]);

  // Fire onComplete when we reach the Done step (index 4). Used by the
  // host to clear the saved draft — once the application is in, there's
  // nothing left to resume.
  React.useEffect(() => {
    if (open && step >= 4 && typeof onComplete === 'function') onComplete();
  }, [open, step]);

  // ─── Apply-flow analytics beacon ───
  // Fire fire-and-forget pings to /api/apply-progress as the user clears
  // milestones. The beacon is keyed by prefill.leadId (set by the email
  // deep link or the calculator lead-gate); without it the endpoint no-
  // ops, so we never pin progress to an orphan row.
  //
  // Using a ref to track "already fired" so a re-render or a form-merge
  // doesn't double-ping. We deliberately don't await — these are pure
  // analytics and must never block UI transitions.
  const beaconLeadId = prefill && prefill.leadId;
  const beaconFiredRef = React.useRef({});
  const fireBeacon = React.useCallback((event, meta) => {
    if (!beaconLeadId) return;
    if (beaconFiredRef.current[event]) return;
    beaconFiredRef.current[event] = true;
    try {
      const body = JSON.stringify({ leadId: beaconLeadId, event, meta: meta || null });
      // navigator.sendBeacon survives page unloads (the user closing the
      // tab after submitting), but it only accepts Blob/FormData/string
      // and ignores response codes. fetch keepalive is the modern
      // equivalent and gives us actual feedback; pick whichever exists.
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/apply-progress', blob);
      } else {
        fetch('/api/apply-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body, keepalive: true,
        }).catch(() => {});
      }
    } catch (_) { /* analytics must never throw into the UI */ }
  }, [beaconLeadId]);

  // modal_opened — fire once per open per leadId. Reset the fired-state
  // when the modal closes so re-opening (e.g. after a refresh) re-pings.
  React.useEffect(() => {
    if (!open) { beaconFiredRef.current = {}; return; }
    fireBeacon('modal_opened', { fromEmail: !!(prefill && prefill.fromEmail) });
  }, [open, fireBeacon]);

  // plaid_connected — fire when Plaid Link returns success.
  React.useEffect(() => {
    if (!open) return;
    if (form.bankConnected) {
      fireBeacon('plaid_connected', { institution: form.bankInstitution || null });
    }
  }, [open, form.bankConnected, form.bankInstitution, fireBeacon]);

  // idv_done — fire when IDV flips true.
  React.useEffect(() => {
    if (!open) return;
    if (form.idVerified) fireBeacon('idv_done');
  }, [open, form.idVerified, fireBeacon]);

  // submitted — fire when the user lands on the Done step (which is
  // gated on completing every prior step and clicking Accept offer).
  React.useEffect(() => {
    if (!open) return;
    if (step >= 4) fireBeacon('submitted', { amount: form.amount });
  }, [open, step, form.amount, fireBeacon]);

  // Prevent body scroll while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open && !closing) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 200);
  };

  const canProceed = (() => {
    if (step === 0) return v1BusinessComplete(form);
    if (step === 1) return form.bankConnected;
    if (step === 2) return form.ssn4.length === 4 && form.idVerified;
    return true;
  })();

  const modal = (
    <div
      data-v1-apply-modal-overlay
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(15, 14, 23, 0.62)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: `${closing ? 'v1apFadeOut' : 'v1apFadeIn'} .2s ease`,
      }}
    >
      <style>{`
        @keyframes v1apFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes v1apFadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes v1apSlideIn { from { opacity: 0; transform: translateY(18px) scale(.985); } to { opacity: 1; transform: none; } }
      `}</style>

      <div data-v1-apply-modal style={{
        width: '100%', maxWidth: 1080, maxHeight: 'calc(100vh - 48px)',
        background: V1.bg, borderRadius: 20, overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '300px 1fr',
        boxShadow: '0 40px 100px -20px rgba(15,14,23,0.5)',
        border: `1px solid ${V1.line}`,
        animation: 'v1apSlideIn .28s cubic-bezier(.2,.7,.3,1)',
      }}>
        {/* ─── Left rail — stepper + trust ─── */}
        <aside style={{
          background: V1.ink, color: V1.white,
          padding: '30px 26px 26px',
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', top: -100, left: -60, width: 300, height: 300,
            background: `radial-gradient(circle, ${accent}40, transparent 60%)`,
            filter: 'blur(20px)', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: `linear-gradient(135deg, ${accent}, #818CF8)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: V1.white, fontFamily: V1.fontDisplay, fontWeight: 700, fontSize: 14,
            }}>D</div>
            <div style={{
              fontFamily: V1.fontDisplay, fontWeight: 600, fontSize: 15,
              letterSpacing: '-0.01em',
            }}>Delt · Get funded</div>
          </div>

          <div style={{
            marginTop: 34, position: 'relative', flex: 1,
          }}>
            {/* vertical track */}
            <div style={{
              position: 'absolute', left: 15, top: 14, bottom: 14, width: 2,
              background: 'rgba(255,255,255,0.08)', borderRadius: 2,
            }} />
            <div style={{
              position: 'absolute', left: 15, top: 14, width: 2,
              height: `calc(${(step / (V1APPLY_STEPS.length - 1)) * 100}% - 0px)`,
              background: `linear-gradient(180deg, ${accent}, #818CF8)`,
              borderRadius: 2, transition: 'height .3s ease',
              boxShadow: `0 0 12px ${accent}`,
            }} />

            {V1APPLY_STEPS.map((s, i) => {
              const isDone = i < step;
              const isActive = i === step;
              return (
                <div key={s} style={{
                  position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 14,
                  marginBottom: 20,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 99, flexShrink: 0,
                    background: isDone
                      ? `linear-gradient(135deg, ${accent}, #818CF8)`
                      : isActive ? V1.white : 'rgba(255,255,255,0.06)',
                    border: isActive ? `2px solid ${accent}` : 'none',
                    color: isActive ? V1.ink : isDone ? V1.white : 'rgba(255,255,255,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: V1.fontMono, fontSize: 11.5, fontWeight: 700,
                    transition: 'all .2s',
                    boxShadow: isActive ? `0 0 0 4px ${accent}33` : 'none',
                  }}>
                    {isDone ? (
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7l3 3 5-6"/>
                      </svg>
                    ) : (
                      <span>{String(i + 1).padStart(2, '0')}</span>
                    )}
                  </div>
                  <div style={{ paddingTop: 5 }}>
                    <div style={{
                      fontFamily: V1.fontMono, fontSize: 10, fontWeight: 600,
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: isActive || isDone ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
                    }}>Step {String(i + 1).padStart(2, '0')}</div>
                    <div style={{
                      fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600,
                      color: isActive ? V1.white : isDone ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
                      marginTop: 2, letterSpacing: '-0.015em',
                    }}>{s}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 'auto', paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 9.5, fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>Trust & security</div>
            <div style={{
              marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6,
              fontFamily: V1.fontBody, fontSize: 12, color: 'rgba(255,255,255,0.72)',
            }}>
              <div>▸ Soft-pull only (until countersign)</div>
              <div>▸ Plaid read-only — no ACH yet</div>
              <div>▸ Data purged 30d if declined</div>
            </div>
          </div>
        </aside>

        {/* ─── Right panel — content ─── */}
        <div data-v1-apply-body style={{
          display: 'flex', flexDirection: 'column',
          background: V1.bg, overflow: 'hidden', position: 'relative',
        }}>
          {/* top bar */}
          <div style={{
            padding: '18px 32px', borderBottom: `1px solid ${V1.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: V1.white,
          }}>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
            }}>
              {step + 1} / {V1APPLY_STEPS.length} · {V1APPLY_STEPS[step]}
            </div>
            <button
              onClick={handleClose}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'transparent', border: `1px solid ${V1.line}`,
                color: V1.muted, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s, color .15s, border-color .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = V1.bg; e.currentTarget.style.color = V1.ink; e.currentTarget.style.borderColor = V1.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = V1.muted; e.currentTarget.style.borderColor = V1.line; }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 3L11 11M11 3L3 11"/>
              </svg>
            </button>
          </div>

          {/* body — scrolls */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '38px 40px',
          }}>
            {step === 0 && <V1StepBusiness form={form} setForm={setForm} accent={accent} />}
            {step === 1 && <V1StepBank form={form} setForm={setForm} accent={accent} onAdvance={() => setStep(2)} autoOpen={autoOpenPlaid} />}
            {step === 2 && <V1StepIdentity form={form} setForm={setForm} accent={accent} onAdvance={() => setStep(3)} />}
            {step === 3 && <V1StepOffer form={form} prefill={prefill} accent={accent} />}
            {step === 4 && <V1StepDone form={form} accent={accent} />}
          </div>

          {/* action bar */}
          <div data-v1-modal-footer style={{
            padding: '16px 32px', borderTop: `1px solid ${V1.line}`,
            background: V1.white,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 11, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: V1.muted,
            }}>
              {step < 4 ? '🔒 Secured · Plaid · Soft-pull only' : 'Application received'}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* TEMP: dev-only skip — remove once IDV is green */}
              {step < 2 && (
                <button
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      businessName: f.businessName || 'Test Co',
                      email: f.email || 'test@example.com',
                      bankConnected: true,
                      bankInstitution: f.bankInstitution || 'Test Bank',
                    }));
                    setStep(2);
                  }}
                  style={{
                    padding: '7px 10px', borderRadius: 6,
                    background: 'transparent', border: `1px dashed ${V1.muted}`,
                    color: V1.muted, cursor: 'pointer',
                    fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}
                >Skip → Identity</button>
              )}
              {/* /TEMP */}
              {step > 0 && step < 4 && (
                <button
                  onClick={() => setStep(step - 1)}
                  style={{
                    padding: '11px 18px', borderRadius: 10,
                    background: 'transparent', border: `1px solid ${V1.line}`,
                    color: V1.ink, cursor: 'pointer',
                    fontFamily: V1.fontBody, fontSize: 14, fontWeight: 500,
                    transition: 'background .15s, border-color .15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = V1.bg; e.currentTarget.style.borderColor = V1.ink; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = V1.line; }}
                >Back</button>
              )}

              {step < 3 && (
                <button
                  onClick={() => canProceed && setStep(step + 1)}
                  disabled={!canProceed}
                  style={{
                    padding: '11px 22px', borderRadius: 10, border: 'none',
                    background: canProceed ? accent : V1.line,
                    color: canProceed ? V1.white : V1.muted,
                    fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
                    cursor: canProceed ? 'pointer' : 'not-allowed',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    transition: 'filter .15s, transform .1s, box-shadow .15s',
                    boxShadow: canProceed ? `0 8px 22px -10px ${accent}aa` : 'none',
                  }}
                  onMouseEnter={(e) => { if (canProceed) { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                  onMouseLeave={(e) => { if (canProceed) { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; } }}
                >
                  Continue
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={() => setStep(4)}
                  style={{
                    padding: '11px 22px', borderRadius: 10, border: 'none',
                    background: `linear-gradient(135deg, ${accent}, #818CF8)`,
                    color: V1.white,
                    fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    boxShadow: `0 10px 28px -10px ${accent}aa`,
                    transition: 'filter .15s, transform .1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Accept offer
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}

              {step === 4 && (
                <button
                  onClick={handleClose}
                  style={{
                    padding: '11px 22px', borderRadius: 10,
                    background: V1.ink, color: V1.white, border: 'none', cursor: 'pointer',
                    fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
                  }}
                >Close</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
}

Object.assign(window, { V1ApplicationFlow });
