// V1 Talk-to-an-Underwriter booking page.
// Structure borrowed from the original DeltCapital BookingPage.tsx
// (specialist selector · month calendar · time slots · confirm) but recut in
// V1's Atlassian-preview aesthetic: #f6f9fc canvas, #0a2540 ink, violet accent,
// Inter Tight display / Inter body / JetBrains Mono eyebrows, hairline 1px
// borders, mono uppercase labels with short-rule prefix.
//
// Animations are subtle and staggered — hero copy lines fade up in sequence,
// specialist cards stagger in, time slots fade in when a date is picked, and
// the confirm button runs a real progress bar → ✓ success → calendar-ICS
// download affordance.
//
// Keep: 30-min, Zoom, soft-pull language; underwriter-first framing matches
// the rest of V1.

function V1UnderwriterDonut({ person, accent, active }) {
  // Subtle orbit ring + initials when no image is available — matches the
  // mock-avatar vibe of V1 About leadership. Never generate a photo-like
  // placeholder; this is deliberately abstract.
  const initials = person.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <div style={{
      position: 'relative', width: 56, height: 56, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 999,
      background: active
        ? `conic-gradient(from 180deg, ${accent}, #A78BFA, ${accent})`
        : `linear-gradient(135deg, ${V1.ink}, #1E3A5F)`,
      transition: 'background .3s',
    }}>
      <div style={{
        position: 'absolute', inset: 3, borderRadius: 999,
        background: V1.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 600,
        color: active ? accent : V1.ink, letterSpacing: '-0.02em',
      }}>{initials}</div>
    </div>
  );
}

function V1BookingHero({ accent }) {
  return (
    <section style={{
      background: V1.ink,
      padding: '80px 0 72px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: `1px solid rgba(255,255,255,0.06)`,
    }}>
      {/* soft orbs — violet bloom */}
      <div aria-hidden style={{
        position: 'absolute', top: -220, right: -180, width: 600, height: 600,
        background: `radial-gradient(circle, ${accent}33 0%, transparent 60%)`,
        pointerEvents: 'none', filter: 'blur(20px)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -260, left: -140, width: 520, height: 520,
        background: `radial-gradient(circle, #4F46E522 0%, transparent 60%)`,
        pointerEvents: 'none', filter: 'blur(20px)',
      }} />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
        <div style={{ animation: 'bkFadeUp 600ms cubic-bezier(.2,.7,.3,1) both' }}>
          <V1Eyebrow color={V1.blueSoft}>Concierge · Real human</V1Eyebrow>
        </div>
        <h1 style={{
          fontFamily: V1.fontDisplay, fontSize: 'clamp(2.4rem, 5.4vw, 4.5rem)',
          fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.02,
          color: '#fff', margin: '22px 0 0', maxWidth: 840,
          animation: 'bkFadeUp 700ms cubic-bezier(.2,.7,.3,1) 60ms both',
        }}>
          Talk to the underwriter<br/>
          who'd price your deal.{' '}
          <em style={{
            fontFamily: '"Source Serif Pro", Georgia, serif',
            fontStyle: 'italic', fontWeight: 400, color: accent,
          }}>Not a call center.</em>
        </h1>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 18.5, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.72)', margin: '28px 0 0', maxWidth: 620,
          animation: 'bkFadeUp 700ms cubic-bezier(.2,.7,.3,1) 140ms both',
        }}>
          30 minutes on Zoom. Bring your P&amp;L or don't — we'll walk you through
          a factor rate, repayment options, and what a pay-early rebate would look
          like on your numbers. No soft-pull required.
        </p>

        {/* Inline meeting chips */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32,
          animation: 'bkFadeUp 700ms cubic-bezier(.2,.7,.3,1) 220ms both',
        }}>
          {[
            ['clock',    '30 min'],
            ['video',    'Zoom'],
            ['shield',   'No credit pull'],
            ['user',     'Real underwriter'],
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
              <V1BkIcon name={icon} size={13} />
              {label}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes bkFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  );
}

function V1BkIcon({ name, size = 14 }) {
  const s = size;
  const p = { stroke: 'currentColor', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'clock')  return <svg width={s} height={s} viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" {...p}/><path d="M7 4v3l2 1.2" {...p}/></svg>;
  if (name === 'video')  return <svg width={s} height={s} viewBox="0 0 14 14"><rect x="1" y="4" width="8" height="6" rx="1" {...p}/><path d="M9 6.5l3.5-1.8v4.6L9 7.5" {...p}/></svg>;
  if (name === 'shield') return <svg width={s} height={s} viewBox="0 0 14 14"><path d="M7 1.2l5 1.8v3.5c0 3.2-2.1 5.5-5 6.3C4.1 12 2 9.7 2 6.5V3l5-1.8z" {...p}/><path d="M4.8 7.2L6.3 8.7 9.4 5.6" {...p}/></svg>;
  if (name === 'user')   return <svg width={s} height={s} viewBox="0 0 14 14"><circle cx="7" cy="5" r="2.2" {...p}/><path d="M2.5 12c0-2.3 2-4 4.5-4s4.5 1.7 4.5 4" {...p}/></svg>;
  if (name === 'chev-l') return <svg width={s} height={s} viewBox="0 0 14 14"><path d="M9 3L5 7l4 4" {...p}/></svg>;
  if (name === 'chev-r') return <svg width={s} height={s} viewBox="0 0 14 14"><path d="M5 3l4 4-4 4" {...p}/></svg>;
  if (name === 'check')  return <svg width={s} height={s} viewBox="0 0 14 14"><path d="M3 7.2L5.8 10 11 4.5" {...p}/></svg>;
  if (name === 'arrow')  return <svg width={s} height={s} viewBox="0 0 14 14"><path d="M3 7h8M8 4l3 3-3 3" {...p}/></svg>;
  return null;
}

const V1_SPECIALISTS = [
  {
    id: 1, name: 'Daniel Martinez', title: 'Funding Advisor',
    tenure: '4y at Delt', deals: '340+ deals', focus: 'Restaurants · Retail · Services',
    blurb: 'Guides operators through the approval and funding process, start to finish.',
    quote: "I'll show you what the price actually is. If another lender is cheaper, I'll say so.",
  },
  {
    id: 2, name: 'Elena Morgan', title: 'Funding Advisor',
    tenure: '3y at Delt', deals: '220+ deals', focus: 'Logistics · Trucking · Construction',
    blurb: 'Specializes in deposit-based underwriting for seasonal and cyclical books.',
    quote: 'Bring me your messy Q4 — I underwrite the trend, not the snapshot.',
  },
  {
    id: 3, name: 'Robert Klein', title: 'Director, Underwriting & Risk',
    tenure: '6y at Delt', deals: 'Signs every offer',
    focus: 'Large files · Complex books',
    blurb: 'Oversees approvals and owns every funding decision that goes out the door.',
    quote: 'If a rate looks too good, it usually is. I sign off on the ones that actually close.',
  },
];

const V1_BK_TIMES = ['9:00am', '10:00am', '11:00am', '1:00pm', '2:30pm', '4:00pm'];

function V1BookingCalendar({ currentDate, setCurrentDate, selectedDate, onPickDate, accent }) {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dow = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const y = currentDate.getFullYear(), m = currentDate.getMonth();
  const first = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  const isSel = (d) => selectedDate && selectedDate.getFullYear() === y && selectedDate.getMonth() === m && selectedDate.getDate() === d;
  const isPast = (d) => new Date(y, m, d) < today;
  const isWknd = (d) => { const g = new Date(y, m, d).getDay(); return g === 0 || g === 6; };

  return (
    <div>
      {/* Month header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
          }}>
            <span aria-hidden style={{ width: 16, height: 1, background: V1.muted }}/>
            Choose a day
          </div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
            letterSpacing: '-0.02em', color: V1.ink,
          }}>
            {monthNames[m]} {y}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setCurrentDate(new Date(y, m - 1, 1))}
            aria-label="Previous month"
            style={v1BkNavBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = V1.bgWarm; e.currentTarget.style.borderColor = V1.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = V1.white; e.currentTarget.style.borderColor = V1.line; }}
          >
            <V1BkIcon name="chev-l" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(y, m + 1, 1))}
            aria-label="Next month"
            style={v1BkNavBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = V1.bgWarm; e.currentTarget.style.borderColor = V1.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = V1.white; e.currentTarget.style.borderColor = V1.line; }}
          >
            <V1BkIcon name="chev-r" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{
        border: `1px solid ${V1.line}`, borderRadius: 12, overflow: 'hidden',
        background: V1.white,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: V1.bg, borderBottom: `1px solid ${V1.line}` }}>
          {dow.map((d) => (
            <div key={d} style={{
              padding: '10px 0', textAlign: 'center',
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.14em', color: V1.muted,
            }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} style={{ aspectRatio: '1', background: V1.bgWarm }} />;
            const past = isPast(d);
            const wknd = isWknd(d);
            const disabled = past || wknd;
            const sel = isSel(d);
            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => !disabled && onPickDate(new Date(y, m, d))}
                style={{
                  aspectRatio: '1', border: 'none', padding: 0,
                  borderTop: `1px solid ${V1.line}`,
                  borderLeft: i % 7 === 0 ? 'none' : `1px solid ${V1.line}`,
                  background: sel ? accent : V1.white,
                  color: sel ? V1.white : (disabled ? '#C3CED7' : V1.ink),
                  fontFamily: V1.fontDisplay, fontSize: 15,
                  fontWeight: sel ? 600 : 500,
                  letterSpacing: '-0.01em',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'background .15s, color .15s, transform .12s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!disabled && !sel) {
                    e.currentTarget.style.background = V1.bg;
                    e.currentTarget.style.transform = 'scale(1.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!sel) {
                    e.currentTarget.style.background = V1.white;
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {d}
                {!disabled && !sel && (
                  <span style={{
                    position: 'absolute', bottom: 6, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 3, height: 3, borderRadius: 999, background: accent, opacity: 0.5,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timezone */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
        }}>Timezone</span>
        <select
          defaultValue="et"
          style={{
            border: `1px solid ${V1.line}`, borderRadius: 8,
            padding: '7px 12px', fontFamily: V1.fontBody, fontSize: 13,
            color: V1.ink, background: V1.white, cursor: 'pointer',
          }}
        >
          <option value="et">Eastern (US)</option>
          <option value="ct">Central (US)</option>
          <option value="mt">Mountain (US)</option>
          <option value="pt">Pacific (US)</option>
        </select>
      </div>
    </div>
  );
}

const v1BkNavBtn = {
  width: 32, height: 32, borderRadius: 8,
  border: `1px solid ${V1.line}`, background: V1.white,
  color: V1.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'background .15s, border-color .15s',
};

function V1TimeSlots({ selectedDate, selectedTime, onPickTime, accent }) {
  const fmtDate = (d) => {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  if (!selectedDate) {
    return (
      <div style={{
        padding: '40px 20px', textAlign: 'center',
        border: `1px dashed ${V1.line}`, borderRadius: 12, background: V1.white,
        fontFamily: V1.fontBody, fontSize: 14, color: V1.muted,
      }}>
        Pick a day to see open times.
      </div>
    );
  }

  return (
    <div>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
      }}>
        <span aria-hidden style={{ width: 16, height: 1, background: V1.muted }}/>
        Open times
      </div>
      <div style={{
        fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 600,
        letterSpacing: '-0.02em', color: V1.ink, marginBottom: 14,
      }}>
        {fmtDate(selectedDate)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {V1_BK_TIMES.map((t, i) => {
          const sel = selectedTime === t;
          return (
            <button
              key={t}
              onClick={() => onPickTime(t)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 16px', borderRadius: 10,
                border: `1px solid ${sel ? accent : V1.line}`,
                background: sel ? accent : V1.white,
                color: sel ? V1.white : V1.ink,
                fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all .15s',
                animation: `bkSlotIn 400ms cubic-bezier(.2,.7,.3,1) ${i * 50}ms both`,
              }}
              onMouseEnter={(e) => {
                if (!sel) {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.background = `${accent}08`;
                }
              }}
              onMouseLeave={(e) => {
                if (!sel) {
                  e.currentTarget.style.borderColor = V1.line;
                  e.currentTarget.style.background = V1.white;
                }
              }}
            >
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{t}</span>
              <span style={{
                fontFamily: V1.fontMono, fontSize: 10.5,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: sel ? 'rgba(255,255,255,0.75)' : V1.muted,
              }}>30 min</span>
            </button>
          );
        })}
      </div>
      <style>{`@keyframes bkSlotIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function V1SpecialistCard({ person, active, onPick, accent, idx }) {
  return (
    <button
      onClick={onPick}
      style={{
        textAlign: 'left', cursor: 'pointer',
        padding: 20, borderRadius: 14,
        border: active ? `1.5px solid ${accent}` : `1px solid ${V1.line}`,
        background: active ? `${accent}08` : V1.white,
        transition: 'all .2s',
        display: 'flex', flexDirection: 'column', gap: 14,
        animation: `bkCardIn 500ms cubic-bezier(.2,.7,.3,1) ${idx * 80 + 150}ms both`,
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = V1.ink;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(10,37,64,0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = V1.line;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <V1UnderwriterDonut person={person} accent={accent} active={active} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 16, fontWeight: 600,
            color: V1.ink, letterSpacing: '-0.015em',
          }}>{person.name}</div>
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13, color: active ? accent : V1.muted,
            marginTop: 2,
          }}>{person.title}</div>
        </div>
        {active && (
          <div style={{
            width: 22, height: 22, borderRadius: 999, background: accent,
            color: V1.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <V1BkIcon name="check" size={11} />
          </div>
        )}
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          person.tenure,
          person.deals,
        ].map((m) => (
          <span key={m} style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: V1.muted,
          }}>{m}</span>
        ))}
      </div>

      {/* Focus */}
      <div style={{
        fontFamily: V1.fontBody, fontSize: 12.5, lineHeight: 1.5,
        color: V1.text,
      }}>
        <span style={{ color: V1.muted, fontFamily: V1.fontMono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 6 }}>Focus</span>
        {person.focus}
      </div>

      {/* Blurb */}
      <div style={{
        fontFamily: V1.fontBody, fontSize: 13, lineHeight: 1.55, color: V1.text,
      }}>{person.blurb}</div>

      {/* Quote */}
      <div style={{
        fontFamily: '"Source Serif Pro", Georgia, serif',
        fontStyle: 'italic', fontWeight: 400,
        fontSize: 13.5, lineHeight: 1.5,
        color: active ? V1.ink : V1.text,
        paddingLeft: 12, borderLeft: `2px solid ${active ? accent : V1.line}`,
        transition: 'border-color .2s, color .2s',
      }}>"{person.quote}"</div>

      <style>{`@keyframes bkCardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </button>
  );
}

function V1ConfirmPanel({ specialist, date, time, accent, onReset }) {
  const [phase, setPhase] = React.useState('idle'); // idle · submitting · done
  const [progress, setProgress] = React.useState(0);

  const submit = () => {
    if (!specialist || !date || !time) return;
    setPhase('submitting');
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); setPhase('done'); return 100; }
        return p + 4;
      });
    }, 30);
  };

  const ready = !!(specialist && date && time);
  const fmt = (d) => {
    if (!d) return '—';
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  if (phase === 'done') {
    return (
      <div style={{
        background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 14,
        padding: 28, display: 'flex', flexDirection: 'column', gap: 16,
        animation: 'bkFadeUp 500ms cubic-bezier(.2,.7,.3,1) both',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 999,
          background: `${V1.green}14`, color: V1.green,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'bkCheckPop 500ms cubic-bezier(.2,1.4,.5,1) 80ms both',
        }}>
          <V1BkIcon name="check" size={22} />
        </div>
        <div>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.green,
            marginBottom: 6,
          }}>Booked</div>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
            color: V1.ink, letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            You're on {specialist.name.split(' ')[0]}'s calendar.
          </div>
        </div>
        <div style={{
          background: V1.bg, border: `1px solid ${V1.line}`, borderRadius: 10,
          padding: 14, fontFamily: V1.fontMono, fontSize: 12.5,
          color: V1.ink, lineHeight: 1.7, fontVariantNumeric: 'tabular-nums',
        }}>
          <div><span style={{ color: V1.muted }}>DATE </span>{fmt(date)}</div>
          <div><span style={{ color: V1.muted }}>TIME </span>{time} ET · 30 min</div>
          <div><span style={{ color: V1.muted }}>WITH </span>{specialist.name} · {specialist.title}</div>
          <div><span style={{ color: V1.muted }}>LINK </span>Zoom — sent to your inbox</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={v1BkPrimaryBtn(accent)}>
            Add to calendar
            <V1BkIcon name="arrow" />
          </button>
          <button
            onClick={() => { onReset(); setPhase('idle'); setProgress(0); }}
            style={{
              padding: '11px 18px', borderRadius: 10,
              border: `1px solid ${V1.line}`, background: V1.white,
              color: V1.ink, cursor: 'pointer',
              fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
            }}
          >Book another</button>
        </div>
        <style>{`@keyframes bkCheckPop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{
      background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 14,
      padding: 22, display: 'flex', flexDirection: 'column', gap: 16,
      position: 'sticky', top: 24,
    }}>
      <div>
        <div style={{
          fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
        }}>
          <span aria-hidden style={{ width: 16, height: 1, background: V1.muted }}/>
          Your booking
        </div>
        <div style={{
          fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 600,
          color: V1.ink, letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>
          Confirm the details.
        </div>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          { k: 'With',   v: specialist ? specialist.name : 'Pick a specialist', filled: !!specialist, sub: specialist && specialist.title },
          { k: 'Day',    v: date ? fmt(date) : 'Pick a day',                    filled: !!date },
          { k: 'Time',   v: time || 'Pick a time',                              filled: !!time,  sub: time && '30 min · Zoom' },
        ].map((r, i) => (
          <div key={r.k} style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: 12, padding: '12px 0',
            borderBottom: i < 2 ? `1px solid ${V1.lineSoft || V1.line}` : 'none',
          }}>
            <span style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
              flexShrink: 0, paddingTop: 2,
            }}>{r.k}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: V1.fontBody, fontSize: 14, fontWeight: 500,
                color: r.filled ? V1.ink : V1.muted,
              }}>{r.v}</div>
              {r.sub && <div style={{ fontFamily: V1.fontBody, fontSize: 12, color: V1.muted, marginTop: 2 }}>{r.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!ready || phase === 'submitting'}
        onClick={submit}
        style={{
          ...v1BkPrimaryBtn(accent),
          opacity: ready || phase === 'submitting' ? 1 : 0.42,
          cursor: ready ? 'pointer' : 'not-allowed',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {phase === 'submitting' ? (
          <>
            <span style={{ position: 'relative', zIndex: 2 }}>Securing slot… {progress}%</span>
            <span style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: `${progress}%`, background: 'rgba(255,255,255,0.18)',
              transition: 'width .03s linear', zIndex: 1,
            }}/>
          </>
        ) : (
          <>
            Book 30-minute call
            <V1BkIcon name="arrow" />
          </>
        )}
      </button>

      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: V1.muted, textAlign: 'center',
      }}>
        No credit pull · Cancel anytime
      </div>
    </div>
  );
}

function v1BkPrimaryBtn(accent) {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '13px 20px', borderRadius: 10, border: 'none',
    background: accent, color: V1.white,
    fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.005em',
    cursor: 'pointer', transition: 'transform .1s, filter .15s',
    width: '100%',
  };
}

// ─── Page root ───
function V1BookingPage({ accent, onApply }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [selectedSpecialistId, setSelectedSpecialistId] = React.useState(1);

  const specialist = V1_SPECIALISTS.find(s => s.id === selectedSpecialistId);

  const reset = () => { setSelectedDate(null); setSelectedTime(null); setSelectedSpecialistId(1); };

  return (
    <>
      <V1BookingHero accent={accent} />

      <section style={{ background: V1.bg, padding: '80px 0 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>

          {/* Specialist selector */}
          <div style={{ marginBottom: 56 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12, marginBottom: 22,
            }}>
              <div>
                <V1Eyebrow>Step 01 · Who</V1Eyebrow>
                <h2 style={{
                  fontFamily: V1.fontDisplay, fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 600, letterSpacing: '-0.025em', color: V1.ink,
                  margin: '12px 0 0',
                }}>Pick your underwriter.</h2>
              </div>
              <p style={{
                fontFamily: V1.fontBody, fontSize: 14, color: V1.muted,
                maxWidth: 380, margin: 0,
              }}>
                Any of our three will give you a straight answer. They each own their
                own book — you'll stay with whoever you pick.
              </p>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
            }}>
              {V1_SPECIALISTS.map((p, i) => (
                <V1SpecialistCard
                  key={p.id}
                  person={p}
                  active={selectedSpecialistId === p.id}
                  onPick={() => setSelectedSpecialistId(p.id)}
                  accent={accent}
                  idx={i}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1, background: V1.line, margin: '0 0 48px',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute', left: 0, top: -8, background: V1.bg,
              padding: '0 14px 0 0',
              fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
            }}>Step 02 · When</span>
          </div>

          {/* Calendar + slots + confirm */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1.35fr 0.75fr 0.9fr', gap: 28,
            alignItems: 'flex-start',
          }}>
            <V1BookingCalendar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={selectedDate}
              onPickDate={(d) => { setSelectedDate(d); setSelectedTime(null); }}
              accent={accent}
            />
            <V1TimeSlots
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onPickTime={setSelectedTime}
              accent={accent}
            />
            <V1ConfirmPanel
              specialist={specialist}
              date={selectedDate}
              time={selectedTime}
              accent={accent}
              onReset={reset}
            />
          </div>

          {/* Trust / assurance strip */}
          <div style={{
            marginTop: 72, padding: '28px 32px',
            background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 14,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28,
          }}>
            {[
              ['No credit pull', 'This is a conversation, not a quote request.'],
              ['Real underwriter', 'Not a BDR reading a script. The person who prices your file.'],
              ['30 minutes, capped', "We'll respect your time. Early exits are fine."],
              ['Zero obligation', "If we're not the right fit, we'll tell you who is."],
            ].map(([t, d]) => (
              <div key={t}>
                <div style={{
                  fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: accent,
                  marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span aria-hidden style={{ width: 12, height: 1, background: accent }}/>
                  {t}
                </div>
                <div style={{
                  fontFamily: V1.fontBody, fontSize: 13.5, lineHeight: 1.55,
                  color: V1.text,
                }}>{d}</div>
              </div>
            ))}
          </div>

          {/* Rather skip the call */}
          <div style={{
            marginTop: 48, padding: 32, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 600,
              color: V1.ink, letterSpacing: '-0.02em',
            }}>Rather skip the call?</div>
            <p style={{
              fontFamily: V1.fontBody, fontSize: 14.5, color: V1.muted,
              maxWidth: 440, margin: 0, lineHeight: 1.55,
            }}>
              Run a rate yourself in 60 seconds. Soft pull, no obligation, real numbers
              against your actual deposits.
            </p>
            <button
              onClick={onApply}
              style={{
                ...v1BkPrimaryBtn(accent),
                width: 'auto', padding: '12px 22px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.07)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none'; }}
            >
              Start prequal instead
              <V1BkIcon name="arrow" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, {
  V1BookingPage, V1_SPECIALISTS,
});
