// V1 Support page — contact form + schedule-a-meeting hand-off.
// Matches the Atlassian-preview aesthetic used across V1: #f6f9fc canvas,
// #0a2540 ink, violet accent, Inter Tight display / Inter body / JetBrains
// Mono eyebrows, 1px hairline borders, mono uppercase labels with short-rule
// prefix. Borrows form-field chrome from V1 Apply and the dark-hero language
// from V1 Booking so the two pages feel like siblings.

function V1SupIcon({ name, size = 16, color }) {
  const s = size;
  const p = { stroke: color || 'currentColor', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'mail')    return <svg width={s} height={s} viewBox="0 0 16 16"><rect x="2" y="3.5" width="12" height="9" rx="1.5" {...p}/><path d="M2.5 4.5l5.5 4 5.5-4" {...p}/></svg>;
  if (name === 'phone')   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M3.5 3c0-.6.5-1 1-1h2l1 3-1.5 1c.5 1.5 2 3 3.5 3.5l1-1.5 3 1v2c0 .6-.4 1-1 1C6.5 12 3.5 9 3.5 3z" {...p}/></svg>;
  if (name === 'chat')    return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M3 3h10c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1H9l-3 2.5V11H3c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1z" {...p}/></svg>;
  if (name === 'calendar')return <svg width={s} height={s} viewBox="0 0 16 16"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" {...p}/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" {...p}/></svg>;
  if (name === 'clock')   return <svg width={s} height={s} viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" {...p}/><path d="M8 4.5v3.8l2.5 1.5" {...p}/></svg>;
  if (name === 'check')   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M3.5 8.5L7 12l5.5-7" {...p}/></svg>;
  if (name === 'arrow')   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M3 8h9M9 5l3 3-3 3" {...p}/></svg>;
  if (name === 'shield')  return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M8 1.5l6 2v4c0 3.6-2.5 6.3-6 7.2C4.5 13.8 2 11 2 7.5v-4l6-2z" {...p}/></svg>;
  if (name === 'user')    return <svg width={s} height={s} viewBox="0 0 16 16"><circle cx="8" cy="6" r="2.5" {...p}/><path d="M3 13.5c0-2.6 2.2-4.5 5-4.5s5 1.9 5 4.5" {...p}/></svg>;
  if (name === 'file')    return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M3 2h6l4 4v8c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1z" {...p}/><path d="M9 2v4h4" {...p}/></svg>;
  if (name === 'dollar')  return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M8 2v12M11 5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" {...p}/></svg>;
  if (name === 'help')    return <svg width={s} height={s} viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" {...p}/><path d="M6.2 6.2c0-1 .8-1.7 1.8-1.7s1.8.7 1.8 1.7c0 1.6-1.8 1.4-1.8 2.8" {...p}/><circle cx="8" cy="11.5" r="0.5" fill={color || 'currentColor'} stroke="none"/></svg>;
  return null;
}

// ═══ Dark hero ═══════════════════════════════════════════════════
function V1SupportHero({ accent }) {
  return (
    <section style={{
      background: V1.ink, padding: '80px 0 72px', color: '#fff',
      position: 'relative', overflow: 'hidden',
      borderBottom: `1px solid rgba(255,255,255,0.06)`,
    }}>
      <div aria-hidden style={{
        position: 'absolute', top: -220, left: -180, width: 580, height: 580,
        background: `radial-gradient(circle, ${accent}33 0%, transparent 60%)`,
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -240, right: -120, width: 500, height: 500,
        background: `radial-gradient(circle, #4F46E522 0%, transparent 60%)`,
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
        <div style={{ animation: 'supFadeUp 600ms cubic-bezier(.2,.7,.3,1) both' }}>
          <V1Eyebrow color={V1.blueSoft}>Support · Real humans, fast</V1Eyebrow>
        </div>
        <h1 style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(2.4rem, 5.4vw, 4.5rem)',
          fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.02,
          color: '#fff', margin: '22px 0 0', maxWidth: 900,
          animation: 'supFadeUp 700ms cubic-bezier(.2,.7,.3,1) 60ms both',
        }}>
          How can we help?{' '}
          <em style={{
            fontFamily: '"Source Serif Pro", Georgia, serif',
            fontStyle: 'italic', fontWeight: 400, color: accent,
          }}>No ticket queue.</em>
        </h1>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 18.5, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.72)', margin: '28px 0 0', maxWidth: 640,
          animation: 'supFadeUp 700ms cubic-bezier(.2,.7,.3,1) 140ms both',
        }}>
          Drop us a note below and a real person on our operator desk picks it up —
          typically under an hour during business hours. Want to talk it through?{' '}
          Book a 30-minute call with the underwriter who'd price your deal.
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32,
          animation: 'supFadeUp 700ms cubic-bezier(.2,.7,.3,1) 220ms both',
        }}>
          {[
            ['clock',  '< 1hr median reply'],
            ['user',   'Operator desk, not BPO'],
            ['shield', 'No credit pull'],
            ['calendar','Mon–Fri · 8a–7p ET'],
          ].map(([icon, label]) => (
            <span key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 999, padding: '7px 14px',
              fontFamily: V1.fontMono, fontSize: 11.5,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.82)',
            }}>
              <V1SupIcon name={icon} size={13} />
              {label}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes supFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  );
}

// ═══ Topic chips ════════════════════════════════════════════════
const V1_SUP_TOPICS = [
  { k: 'application', label: 'Application status',    icon: 'file',   hint: "I've applied and want an update." },
  { k: 'pricing',     label: 'Pricing / factor rate', icon: 'dollar', hint: 'Questions about my offer or rebate.' },
  { k: 'funding',     label: 'Funding & payments',    icon: 'dollar', hint: 'Wire timing, ACH, renewal, pay-early.' },
  { k: 'account',     label: 'Account & documents',   icon: 'user',   hint: 'Login, statements, tax docs, changes.' },
  { k: 'general',     label: 'General inquiry',       icon: 'help',   hint: 'Press, partnerships, anything else.' },
];

// ═══ Main page ══════════════════════════════════════════════════
function V1SupportPage({ accent, onTalk, onApply }) {
  const [topic, setTopic] = React.useState('application');
  const [form, setForm] = React.useState({
    name: '', email: '', phone: '', company: '', message: '',
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const ready = form.name.trim() && /@/.test(form.email) && form.message.trim().length > 10;

  const submit = (e) => {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 900);
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', phone: '', company: '', message: '' });
    setTopic('application');
  };

  return (
    <>
      <V1SupportHero accent={accent} />

      {/* Main body */}
      <section style={{ background: V1.bg, padding: '72px 0 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>

          <div style={{
            display: 'grid', gridTemplateColumns: '1.4fr 0.9fr', gap: 40,
            alignItems: 'flex-start',
          }}>

            {/* ═══ LEFT: Contact form ═══ */}
            <div style={{
              background: V1.white, border: `1px solid ${V1.line}`,
              borderRadius: 16, padding: 40,
              animation: 'supFadeUp 500ms cubic-bezier(.2,.7,.3,1) both',
            }}>
              {submitted ? (
                <V1SupportConfirm form={form} topic={topic} accent={accent} onReset={reset} onTalk={onTalk} />
              ) : (
                <form onSubmit={submit}>
                  <V1Eyebrow>Send us a note</V1Eyebrow>
                  <h2 style={{
                    fontFamily: V1.fontDisplay, fontSize: 30, fontWeight: 600,
                    letterSpacing: '-0.03em', color: V1.ink, margin: '12px 0 8px', lineHeight: 1.1,
                  }}>Write us. We read every one.</h2>
                  <p style={{
                    fontFamily: V1.fontBody, fontSize: 14.5, color: V1.muted,
                    lineHeight: 1.55, margin: 0, maxWidth: 520,
                  }}>
                    Routed to the right person by topic — existing files go to your
                    underwriter; general inquiries go to the operator desk.
                  </p>

                  {/* Topic picker */}
                  <div style={{ marginTop: 28 }}>
                    <V1SupLabel>What's this about?</V1SupLabel>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 10,
                    }}>
                      {V1_SUP_TOPICS.map((t) => {
                        const active = topic === t.k;
                        return (
                          <button
                            key={t.k}
                            type="button"
                            onClick={() => setTopic(t.k)}
                            style={{
                              padding: '12px 10px', borderRadius: 10,
                              border: active ? `1.5px solid ${accent}` : `1px solid ${V1.line}`,
                              background: active ? `${accent}0A` : V1.white,
                              color: active ? accent : V1.text,
                              cursor: 'pointer', transition: 'all .15s',
                              display: 'flex', flexDirection: 'column', gap: 6,
                              alignItems: 'flex-start', textAlign: 'left',
                              fontFamily: V1.fontBody, fontSize: 12.5, fontWeight: 500,
                              lineHeight: 1.25,
                            }}
                            onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = V1.ink; }}
                            onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = V1.line; }}
                          >
                            <V1SupIcon name={t.icon} size={15} color={active ? accent : V1.muted} />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{
                      marginTop: 10, fontFamily: V1.fontMono, fontSize: 11.5,
                      letterSpacing: '0.08em', color: V1.muted,
                    }}>
                      → {V1_SUP_TOPICS.find((t) => t.k === topic).hint}
                    </div>
                  </div>

                  {/* Fields */}
                  <div style={{
                    marginTop: 28,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
                  }}>
                    <V1SupField label="Full name" required>
                      <V1SupInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Maria Rodriguez" accent={accent} />
                    </V1SupField>
                    <V1SupField label="Email" required>
                      <V1SupInput type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@business.com" accent={accent} />
                    </V1SupField>
                    <V1SupField label="Phone" hint="Optional">
                      <V1SupInput value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="(555) 555-0199" accent={accent} />
                    </V1SupField>
                    <V1SupField label="Business name" hint="Helps route faster">
                      <V1SupInput value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="La Rosa Restaurant LLC" accent={accent} />
                    </V1SupField>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <V1SupField label="How can we help?" required>
                      <V1SupTextarea value={form.message} onChange={(v) => setForm({ ...form, message: v })} placeholder="I applied last Tuesday and haven't heard back on my offer — can you check the status?" accent={accent} />
                    </V1SupField>
                  </div>

                  {/* Submit row */}
                  <div style={{
                    marginTop: 24, display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                  }}>
                    <div style={{
                      fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: V1.muted, display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <V1SupIcon name="shield" size={12} color={V1.muted} />
                      Encrypted in transit · Never shared
                    </div>
                    <button
                      type="submit"
                      disabled={!ready || submitting}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '13px 22px', borderRadius: 10, border: 'none',
                        background: ready ? accent : V1.line,
                        color: ready ? V1.white : V1.muted,
                        fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600,
                        cursor: ready ? 'pointer' : 'not-allowed',
                        transition: 'filter .15s, transform .1s',
                      }}
                      onMouseEnter={(e) => { if (ready) { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {submitting ? 'Sending…' : 'Send message'}
                      {!submitting && <V1SupIcon name="arrow" size={14} />}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ═══ RIGHT: Schedule panel + channels ═══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Schedule a meeting — featured card */}
              <div style={{
                background: V1.ink, color: '#fff',
                borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden',
                animation: 'supFadeUp 500ms cubic-bezier(.2,.7,.3,1) 80ms both',
              }}>
                <div aria-hidden style={{
                  position: 'absolute', top: -120, right: -80, width: 280, height: 280,
                  background: `radial-gradient(circle, ${accent}44 0%, transparent 60%)`,
                  filter: 'blur(10px)', pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative' }}>
                  <V1Eyebrow color={V1.blueSoft}>Skip the wait</V1Eyebrow>
                  <h3 style={{
                    fontFamily: V1.fontDisplay, fontSize: 24, fontWeight: 600,
                    letterSpacing: '-0.025em', color: '#fff', margin: '14px 0 10px',
                    lineHeight: 1.15,
                  }}>
                    Schedule a 30-min call{' '}
                    <em style={{
                      fontFamily: '"Source Serif Pro", Georgia, serif',
                      fontStyle: 'italic', fontWeight: 400, color: V1.blueSoft,
                    }}>with an underwriter.</em>
                  </h3>
                  <p style={{
                    fontFamily: V1.fontBody, fontSize: 14, lineHeight: 1.55,
                    color: 'rgba(255,255,255,0.72)', margin: '0 0 20px',
                  }}>
                    Faster than email for anything pricing-related. Zoom, no credit
                    pull, pick your own time.
                  </p>

                  {/* Mini availability chip */}
                  <div style={{
                    padding: 14, borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: 16,
                  }}>
                    <div style={{
                      fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: V1.blueSoft, marginBottom: 8,
                    }}>Next available</div>
                    <div style={{
                      fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 600,
                      color: '#fff', letterSpacing: '-0.015em',
                      fontVariantNumeric: 'tabular-nums',
                    }}>Today · 2:30 pm ET</div>
                    <div style={{
                      marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6,
                    }}>
                      {['Today 2:30p', 'Today 4:00p', 'Tomorrow 9:00a', 'Tomorrow 11:00a'].map((t, i) => (
                        <span key={t} style={{
                          padding: '4px 10px', borderRadius: 999,
                          background: i === 0 ? accent : 'rgba(255,255,255,0.08)',
                          border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          color: i === 0 ? '#fff' : 'rgba(255,255,255,0.8)',
                          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 500,
                          letterSpacing: '0.04em', whiteSpace: 'nowrap',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={onTalk}
                    style={{
                      width: '100%',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      padding: '14px 18px', borderRadius: 10, border: 'none',
                      background: '#fff', color: V1.ink,
                      fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600,
                      cursor: 'pointer', transition: 'transform .1s, filter .15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(0.97)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none'; }}
                  >
                    <V1SupIcon name="calendar" size={15} />
                    Pick a time
                    <V1SupIcon name="arrow" size={14} />
                  </button>
                </div>
              </div>

              {/* Direct channels */}
              <div style={{
                background: V1.white, border: `1px solid ${V1.line}`,
                borderRadius: 16, padding: 24,
                animation: 'supFadeUp 500ms cubic-bezier(.2,.7,.3,1) 160ms both',
              }}>
                <V1Eyebrow>Direct channels</V1Eyebrow>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <V1SupChannel icon="mail" label="Email" value="hello@deltcapital.com" sub="Reply in < 1 hour (business hours)" accent={accent} />
                  <V1SupChannel icon="phone" label="Phone" value="(888) 555-0144" sub="Mon–Fri · 8:00a–7:00p ET" accent={accent} />
                  <V1SupChannel icon="chat" label="Live chat" value="In the app · bottom right" sub="For active accounts only" accent={accent} />
                </div>
              </div>

              {/* FAQ nudge */}
              <div style={{
                border: `1px dashed ${V1.line}`,
                borderRadius: 14, padding: 20,
                display: 'flex', alignItems: 'flex-start', gap: 14,
                animation: 'supFadeUp 500ms cubic-bezier(.2,.7,.3,1) 240ms both',
              }}>
                <span style={{
                  flexShrink: 0, width: 34, height: 34, borderRadius: 10,
                  background: `${accent}14`, color: accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <V1SupIcon name="help" size={17} />
                </span>
                <div>
                  <div style={{
                    fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600,
                    color: V1.ink, letterSpacing: '-0.01em',
                  }}>Have a common question?</div>
                  <p style={{
                    fontFamily: V1.fontBody, fontSize: 13, color: V1.muted,
                    lineHeight: 1.55, margin: '4px 0 0',
                  }}>
                    Our FAQ covers rates, renewals, funding timing, and what we
                    underwrite on.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom SLA strip */}
          <div style={{
            marginTop: 64, padding: '28px 32px',
            background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 14,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28,
          }}>
            {[
              ['Median first reply', '47 min', 'Business hours, Mon–Fri'],
              ['Urgent funding issues', '< 15 min', 'Call the funding line'],
              ['No scripts', 'Real humans', 'Operator desk — not a BPO'],
              ['Escalation path', 'Direct', 'Same underwriter through renewal'],
            ].map(([k, v, sub]) => (
              <div key={k}>
                <div style={{
                  fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: accent,
                  marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span aria-hidden style={{ width: 12, height: 1, background: accent }} />
                  {k}
                </div>
                <div style={{
                  fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
                  letterSpacing: '-0.025em', color: V1.ink, marginBottom: 4,
                  fontVariantNumeric: 'tabular-nums',
                }}>{v}</div>
                <div style={{
                  fontFamily: V1.fontBody, fontSize: 13, color: V1.muted, lineHeight: 1.5,
                }}>{sub}</div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

// ═══ Confirmation state ═══
function V1SupportConfirm({ form, topic, accent, onReset, onTalk }) {
  const topicLabel = V1_SUP_TOPICS.find((t) => t.k === topic).label;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 999,
        background: `${V1.green}14`, color: V1.green,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'supCheckPop 500ms cubic-bezier(.2,1.4,.5,1) 80ms both',
      }}>
        <V1SupIcon name="check" size={24} />
      </div>
      <div>
        <div style={{
          fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.green,
          marginBottom: 8,
        }}>Message sent</div>
        <h2 style={{
          fontFamily: V1.fontDisplay, fontSize: 28, fontWeight: 600,
          letterSpacing: '-0.025em', color: V1.ink, margin: 0, lineHeight: 1.15,
        }}>
          Thanks, {form.name.split(' ')[0]}. We'll reply within the hour.
        </h2>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 15, color: V1.muted,
          lineHeight: 1.55, margin: '12px 0 0', maxWidth: 520,
        }}>
          Your note is routed to the right desk. You'll get a confirmation at{' '}
          <span style={{ color: V1.ink, fontWeight: 500 }}>{form.email}</span>{' '}
          and a real reply from a person, not an autoresponder.
        </p>
      </div>
      <div style={{
        background: V1.bg, border: `1px solid ${V1.line}`, borderRadius: 10,
        padding: 16, fontFamily: V1.fontMono, fontSize: 12.5,
        color: V1.ink, lineHeight: 1.8, fontVariantNumeric: 'tabular-nums',
      }}>
        <div><span style={{ color: V1.muted }}>TOPIC </span>{topicLabel}</div>
        <div><span style={{ color: V1.muted }}>EMAIL </span>{form.email}</div>
        {form.phone && <div><span style={{ color: V1.muted }}>PHONE </span>{form.phone}</div>}
        {form.company && <div><span style={{ color: V1.muted }}>BIZ </span>{form.company}</div>}
        <div><span style={{ color: V1.muted }}>REF # </span>DC-{String(Math.floor(Math.random() * 90000) + 10000)}</div>
      </div>

      <div style={{
        padding: 18, background: `${accent}08`, border: `1px solid ${accent}33`,
        borderRadius: 12, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 15, fontWeight: 600,
            color: V1.ink, letterSpacing: '-0.01em',
          }}>Want to talk while you wait?</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13, color: V1.muted, marginTop: 2,
          }}>30-min Zoom, next slot in ~2 hours.</div>
        </div>
        <button
          onClick={onTalk}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 18px', borderRadius: 10, border: 'none',
            background: accent, color: V1.white,
            fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600,
            cursor: 'pointer', transition: 'filter .15s, transform .1s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <V1SupIcon name="calendar" size={14} />
          Book a meeting
          <V1SupIcon name="arrow" size={13} />
        </button>
      </div>

      <button
        onClick={onReset}
        style={{
          alignSelf: 'flex-start',
          padding: '10px 16px', borderRadius: 10,
          border: `1px solid ${V1.line}`, background: V1.white,
          color: V1.ink, cursor: 'pointer',
          fontFamily: V1.fontBody, fontSize: 13, fontWeight: 500,
        }}
      >Send another message</button>
      <style>{`@keyframes supCheckPop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

// ═══ Form primitives ═══
function V1SupLabel({ children }) {
  return (
    <div style={{
      fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span aria-hidden style={{ width: 14, height: 1, background: V1.muted }} />
      {children}
    </div>
  );
}

function V1SupField({ label, hint, required, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <V1SupLabel>
          {label}
          {required && <span style={{ color: V1.red, marginLeft: 2 }}>*</span>}
        </V1SupLabel>
        {hint && (
          <span style={{
            fontFamily: V1.fontBody, fontSize: 11.5, color: V1.muted,
          }}>{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function V1SupInput({ value, onChange, placeholder, type = 'text', accent }) {
  return (
    <input
      type={type}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}26`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = V1.line; e.currentTarget.style.boxShadow = 'none'; }}
      style={{
        width: '100%', padding: '13px 14px',
        background: V1.white,
        border: `1px solid ${V1.line}`, borderRadius: 10,
        fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink,
        outline: 'none', transition: 'border-color .15s, box-shadow .15s',
      }}
    />
  );
}

function V1SupTextarea({ value, onChange, placeholder, accent }) {
  return (
    <textarea
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={6}
      onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}26`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = V1.line; e.currentTarget.style.boxShadow = 'none'; }}
      style={{
        width: '100%', padding: '13px 14px',
        background: V1.white,
        border: `1px solid ${V1.line}`, borderRadius: 10,
        fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink, lineHeight: 1.55,
        outline: 'none', resize: 'vertical', minHeight: 140,
        transition: 'border-color .15s, box-shadow .15s',
      }}
    />
  );
}

function V1SupChannel({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '12px 0', borderBottom: `1px solid ${V1.bgWarm}`,
    }}>
      <span style={{
        flexShrink: 0, width: 34, height: 34, borderRadius: 10,
        background: `${accent}10`, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <V1SupIcon name={icon} size={16} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: V1.muted,
        }}>{label}</div>
        <div style={{
          fontFamily: V1.fontDisplay, fontSize: 15.5, fontWeight: 600,
          color: V1.ink, letterSpacing: '-0.01em', marginTop: 2,
          fontVariantNumeric: 'tabular-nums',
        }}>{value}</div>
        <div style={{
          fontFamily: V1.fontBody, fontSize: 12.5, color: V1.muted, marginTop: 2,
        }}>{sub}</div>
      </div>
    </div>
  );
}

Object.assign(window, { V1SupportPage });
