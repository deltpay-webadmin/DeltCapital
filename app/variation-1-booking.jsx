// V1 Talk-to-an-Underwriter booking page.
// Structure borrowed from the original DeltCapital BookingPage.tsx
// (specialist selector · month calendar · time slots · confirm) but recut in
// V1's Atlassian-preview aesthetic: #f6f9fc canvas, #041E42 ink, violet accent,
// Inter Tight display / Inter body / JetBrains Mono eyebrows, hairline 1px
// borders, mono uppercase labels with short-rule prefix.
//
// Animations are subtle and staggered — hero copy lines fade up in sequence,
// specialist cards stagger in, time slots fade in when a date is picked, and
// the confirm button runs a real progress bar → ✓ success → calendar-ICS
// download affordance.
//
// Keep: 30-min, Teams, soft-pull language; underwriter-first framing matches
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
        ? `conic-gradient(from 180deg, ${accent}, #818CF8, ${accent})`
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
        background: `radial-gradient(circle, #4945FF22 0%, transparent 60%)`,
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
          30 minutes on Microsoft Teams. Bring your P&amp;L or don't — we'll walk you through
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
            ['video',    'Microsoft Teams'],
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

// 8:00am → 5:30pm in 30-minute increments. Last slot starts at 5:30pm so
// every meeting fits inside an 8am–6pm window.
const V1_BK_TIMES = (() => {
  const out = [];
  for (let h = 8; h < 18; h++) {
    for (const m of ['00', '30']) {
      const hr12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      const ampm = h >= 12 ? 'pm' : 'am';
      out.push(`${hr12}:${m}${ampm}`);
    }
  }
  return out;
})();

function v1BkParseTime(t) {
  const m = /^(\d{1,2}):(\d{2})(am|pm)$/i.exec(String(t || '').trim());
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3].toLowerCase();
  if (mer === 'pm' && h !== 12) h += 12;
  if (mer === 'am' && h === 12) h = 0;
  return { h, min };
}

// All slot times are anchored to America/New_York. The helpers below convert
// (et-date, et-wall-clock) ↔ UTC ↔ the user's local wall-clock so the UI can
// label slots in the visitor's timezone while the API payload stays ET.
const V1_USER_TZ = (() => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
  catch { return 'America/New_York'; }
})();

const V1_USER_TZ_SHORT = (() => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: V1_USER_TZ, timeZoneName: 'short',
    }).formatToParts(new Date());
    const tzn = parts.find((p) => p.type === 'timeZoneName');
    return tzn ? tzn.value : V1_USER_TZ;
  } catch { return V1_USER_TZ; }
})();

const V1_IS_ET_USER = V1_USER_TZ === 'America/New_York';

function v1BkTzOffsetMin(date, tz) {
  // Returns minutes such that wallClockInTZ = utc + offset.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date);
  const o = {};
  for (const p of parts) o[p.type] = p.value;
  const hour = +o.hour === 24 ? 0 : +o.hour;
  const asUTC = Date.UTC(+o.year, +o.month - 1, +o.day, hour, +o.minute, +o.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

function v1BkEtWallToUTC(dateISO, etTimeStr) {
  const t = v1BkParseTime(etTimeStr);
  if (!t || !/^\d{4}-\d{2}-\d{2}$/.test(String(dateISO || ''))) return null;
  const [y, m, d] = dateISO.split('-').map(Number);
  const candidate = new Date(Date.UTC(y, m - 1, d, t.h, t.min));
  const offset = v1BkTzOffsetMin(candidate, 'America/New_York');
  return new Date(candidate.getTime() - offset * 60000);
}

function v1BkSlotUserLocal(dateISO, etTimeStr) {
  const utc = v1BkEtWallToUTC(dateISO, etTimeStr);
  if (!utc) return { time: etTimeStr, dateOffset: 0 };
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: V1_USER_TZ, hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(utc).toLowerCase().replace(/\s/g, '');
  const userDateISO = new Intl.DateTimeFormat('en-CA', {
    timeZone: V1_USER_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(utc);
  let dateOffset = 0;
  if (userDateISO < dateISO) dateOffset = -1;
  else if (userDateISO > dateISO) dateOffset = 1;
  return { time, dateOffset };
}

function v1BkSlotIsPast(dateISO, etTimeStr, nowMs) {
  const utc = v1BkEtWallToUTC(dateISO, etTimeStr);
  if (!utc) return false;
  return utc.getTime() <= (nowMs || Date.now());
}

function v1BkTodayInET() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function v1BkDateToISO(d) {
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function downloadIcs({ specialistName, specialistTitle, date, time, firstName, lastName, joinUrl }) {
  if (!date || !time) return;
  const t = v1BkParseTime(time);
  if (!t) return;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const sh = String(t.h).padStart(2, '0');
  const sm = String(t.min).padStart(2, '0');
  const endMinTotal = t.h * 60 + t.min + 30;
  const eh = String(Math.floor(endMinTotal / 60) % 24).padStart(2, '0');
  const em = String(endMinTotal % 60).padStart(2, '0');
  const dtStart = `${yyyy}${mm}${dd}T${sh}${sm}00`;
  const dtEnd   = `${yyyy}${mm}${dd}T${eh}${em}00`;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dtStamp =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const uid = `${dtStamp}-${Math.random().toString(36).slice(2, 10)}@deltcapital.com`;
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  const summary = `Delt Capital — 30-min call with ${specialistName}`;
  const desc = [
    `30-minute call with ${specialistName}${specialistTitle ? ` (${specialistTitle})` : ''}.`,
    fullName && `Booked by ${fullName}.`,
    joinUrl && `Join: ${joinUrl}`,
  ].filter(Boolean).join('\\n');
  const location = joinUrl || 'Microsoft Teams';
  // RFC 5545: lines should be folded at 75 octets, but most calendar apps tolerate longer.
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Delt Capital//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'TZNAME:EDT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'TZNAME:EST',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=America/New_York:${dtStart}`,
    `DTEND;TZID=America/New_York:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `delt-capital-${yyyy}${mm}${dd}-${sh}${sm}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function V1BookingCalendar({ currentDate, setCurrentDate, selectedDate, onPickDate, accent }) {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dow = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const y = currentDate.getFullYear(), m = currentDate.getMonth();
  const first = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  // "Today" is anchored to David's timezone (ET) so a visitor outside ET
  // can't pick a date that's already wrapped up on his side.
  const todayET = v1BkTodayInET(); // 'YYYY-MM-DD'

  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  const cellISO = (d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const isSel = (d) => selectedDate && selectedDate.getFullYear() === y && selectedDate.getMonth() === m && selectedDate.getDate() === d;
  const isPast = (d) => cellISO(d) < todayET;
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

function V1TimeSlots({ selectedDate, selectedTime, onPickTime, accent, busySlots, busyLoading, nowMs }) {
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

  const dateISO = v1BkDateToISO(selectedDate);
  const busySet = new Set(busySlots || []);
  const visibleSlots = V1_BK_TIMES.map((t) => {
    const past = v1BkSlotIsPast(dateISO, t, nowMs);
    const busy = busySet.has(t);
    const local = v1BkSlotUserLocal(dateISO, t);
    return { t, past, busy, local };
  });
  // Hide slots that are entirely in the past so the list collapses as the day rolls forward.
  const slots = visibleSlots.filter((s) => !s.past);
  const allTaken = slots.every((s) => s.busy);

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
        letterSpacing: '-0.02em', color: V1.ink, marginBottom: 6,
      }}>
        {fmtDate(selectedDate)}
      </div>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5, color: V1.muted,
        letterSpacing: '0.06em', marginBottom: 14,
      }}>
        {V1_IS_ET_USER
          ? 'All times in Eastern Time'
          : `Your time (${V1_USER_TZ_SHORT}) · Meeting held in Eastern Time`}
      </div>
      {slots.length === 0 ? (
        <div style={{
          padding: '20px 16px', textAlign: 'center',
          border: `1px dashed ${V1.line}`, borderRadius: 10, background: V1.white,
          fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted,
        }}>
          No more open times today — pick another day.
        </div>
      ) : busyLoading ? (
        <div style={{
          padding: '20px 16px', textAlign: 'center',
          border: `1px dashed ${V1.line}`, borderRadius: 10, background: V1.white,
          fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted,
        }}>Checking David's calendar…</div>
      ) : allTaken ? (
        <div style={{
          padding: '20px 16px', textAlign: 'center',
          border: `1px dashed ${V1.line}`, borderRadius: 10, background: V1.white,
          fontFamily: V1.fontBody, fontSize: 13.5, color: V1.muted,
        }}>Fully booked — try another day.</div>
      ) : (
        <div
          className="bk-slot-list"
          style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            maxHeight: 440, overflowY: 'auto', paddingRight: 6,
          }}
        >
          {slots.map(({ t, busy, local }, i) => {
            const sel = selectedTime === t;
            const disabled = busy;
            const primary = V1_IS_ET_USER ? t : local.time;
            const secondary = V1_IS_ET_USER ? '30 min' : `${t} ET`;
            const dayBadge = local.dateOffset === 1 ? ' · next day'
              : local.dateOffset === -1 ? ' · prev day' : '';
            return (
              <button
                key={t}
                onClick={() => { if (!disabled) onPickTime(t); }}
                disabled={disabled}
                aria-disabled={disabled}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 16px', borderRadius: 10,
                  border: `1px solid ${sel ? accent : V1.line}`,
                  background: disabled ? V1.bg : (sel ? accent : V1.white),
                  color: disabled ? V1.muted : (sel ? V1.white : V1.ink),
                  fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 500,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.55 : 1,
                  textDecoration: disabled ? 'line-through' : 'none',
                  transition: 'all .15s',
                  animation: `bkSlotIn 400ms cubic-bezier(.2,.7,.3,1) ${Math.min(i, 8) * 50}ms both`,
                }}
                onMouseEnter={(e) => {
                  if (!sel && !disabled) {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.background = `${accent}08`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!sel && !disabled) {
                    e.currentTarget.style.borderColor = V1.line;
                    e.currentTarget.style.background = V1.white;
                  }
                }}
              >
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {primary}{dayBadge ? <span style={{
                    fontFamily: V1.fontMono, fontSize: 10.5, marginLeft: 8,
                    color: sel ? 'rgba(255,255,255,0.85)' : V1.muted,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>{dayBadge.replace(' · ', '')}</span> : null}
                </span>
                <span style={{
                  fontFamily: V1.fontMono, fontSize: 10.5,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: sel ? 'rgba(255,255,255,0.75)' : V1.muted,
                }}>{disabled ? 'Booked' : secondary}</span>
              </button>
            );
          })}
        </div>
      )}
      <style>{`
        @keyframes bkSlotIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .bk-slot-list { scrollbar-width: thin; scrollbar-color: ${V1.line} transparent; }
        .bk-slot-list::-webkit-scrollbar { width: 6px; }
        .bk-slot-list::-webkit-scrollbar-thumb { background: ${V1.line}; border-radius: 3px; }
        .bk-slot-list::-webkit-scrollbar-track { background: transparent; }
      `}</style>
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

function V1BookingForm({
  phase, first, setFirst, last, setLast, emailAddr, setEmailAddr,
  formValid, errorMsg, accent, specialist, dateLabel, time, date, onClose, onSubmit,
}) {
  const dateISO = v1BkDateToISO(date);
  const local = v1BkSlotUserLocal(dateISO, time);
  const dayBadge = local.dateOffset === 1 ? ' (next day your time)'
    : local.dateOffset === -1 ? ' (prev day your time)' : '';
  const timePrimary = V1_IS_ET_USER ? `${time} ET` : `${local.time}${dayBadge}`;
  const timeSecondary = V1_IS_ET_USER ? '30 min' : `${time} ET · 30 min`;
  const submitting = phase === 'submitting';
  const inputStyle = {
    width: '100%', padding: '11px 12px', borderRadius: 8,
    border: `1px solid ${V1.line}`, background: V1.white,
    fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink,
    outline: 'none', transition: 'border-color .15s, box-shadow .15s',
  };
  const labelStyle = {
    fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
    letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
    marginBottom: 6, display: 'block',
  };
  const focus = (e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}1f`; };
  const blur = (e) => { e.currentTarget.style.borderColor = V1.line; e.currentTarget.style.boxShadow = 'none'; };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm your booking"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(10,37,64,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, animation: 'bkOverlayIn 220ms ease-out both',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 480,
        background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 14,
        padding: 28, display: 'flex', flexDirection: 'column', gap: 18,
        animation: 'bkModalIn 280ms cubic-bezier(.2,.7,.3,1) both',
        boxShadow: '0 24px 60px rgba(10,37,64,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              marginBottom: 6,
            }}>Confirm your booking</div>
            <div style={{
              fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
              color: V1.ink, letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>Tell us who's coming.</div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={submitting}
            style={{
              border: `1px solid ${V1.line}`, background: V1.white,
              width: 32, height: 32, borderRadius: 8, cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: V1.muted,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l8 8M11 3l-8 8"/></svg>
          </button>
        </div>

        <div style={{
          background: V1.bg, border: `1px solid ${V1.line}`, borderRadius: 10,
          padding: 14, fontFamily: V1.fontMono, fontSize: 12.5,
          color: V1.ink, lineHeight: 1.7, fontVariantNumeric: 'tabular-nums',
        }}>
          <div><span style={{ color: V1.muted }}>WITH </span>{specialist.name} · {specialist.title}</div>
          <div><span style={{ color: V1.muted }}>DATE </span>{dateLabel}</div>
          <div><span style={{ color: V1.muted }}>TIME </span>{timePrimary} · {timeSecondary}</div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label>
              <span style={labelStyle}>First name</span>
              <input
                type="text" required autoComplete="given-name"
                value={first} onChange={(e) => setFirst(e.target.value)}
                onFocus={focus} onBlur={blur}
                style={inputStyle}
                disabled={submitting}
              />
            </label>
            <label>
              <span style={labelStyle}>Last name</span>
              <input
                type="text" required autoComplete="family-name"
                value={last} onChange={(e) => setLast(e.target.value)}
                onFocus={focus} onBlur={blur}
                style={inputStyle}
                disabled={submitting}
              />
            </label>
          </div>
          <label>
            <span style={labelStyle}>Email</span>
            <input
              type="email" required autoComplete="email"
              value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)}
              onFocus={focus} onBlur={blur}
              style={inputStyle}
              disabled={submitting}
              placeholder="you@company.com"
            />
          </label>

          {errorMsg && (
            <div style={{
              background: '#FFF1F1', border: '1px solid #F2C5C5', borderRadius: 8,
              padding: '10px 12px', color: '#9B1C1C',
              fontFamily: V1.fontBody, fontSize: 13,
            }}>{errorMsg}</div>
          )}

          <button
            type="submit"
            disabled={!formValid || submitting}
            style={{
              ...v1BkPrimaryBtn(accent),
              opacity: !formValid || submitting ? 0.55 : 1,
              cursor: !formValid || submitting ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}
          >
            {submitting ? 'Booking…' : 'Confirm booking'}
            {!submitting && <V1BkIcon name="arrow" />}
          </button>
          <div style={{
            fontFamily: V1.fontMono, fontSize: 10.5,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: V1.muted, textAlign: 'center',
          }}>
            We'll email you a Teams link · No credit pull
          </div>
        </form>
      </div>
      <style>{`
        @keyframes bkOverlayIn{from{opacity:0}to{opacity:1}}
        @keyframes bkModalIn{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>
    </div>
  );
}

function V1ConfirmPanel({ specialist, date, time, accent, onReset }) {
  // idle → click → form (modal asks first/last/email) → submitting → done | error
  const [phase, setPhase] = React.useState('idle');
  const [first, setFirst] = React.useState('');
  const [last, setLast] = React.useState('');
  const [emailAddr, setEmailAddr] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [bookingResult, setBookingResult] = React.useState(null);

  const ready = !!(specialist && date && time);
  const fmt = (d) => {
    if (!d) return '—';
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };
  const fmtLong = (d) => {
    if (!d) return '';
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const openForm = () => { if (ready) { setErrorMsg(''); setPhase('form'); } };
  const closeForm = () => { if (phase !== 'submitting') setPhase('idle'); };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddr.trim());
  const formValid = first.trim() && last.trim() && emailValid;

  const submit = async () => {
    if (!ready || !formValid) return;
    setErrorMsg('');
    setPhase('submitting');
    try {
      const dateISO = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      const r = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: first.trim(),
          lastName: last.trim(),
          email: emailAddr.trim(),
          specialistName: specialist.name,
          specialistTitle: specialist.title,
          dateLabel: fmtLong(date),
          dateISO,
          time,
          userTimeZone: V1_USER_TZ,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data.error || `Request failed (${r.status})`);
      }
      setBookingResult(data);
      setPhase('done');
    } catch (err) {
      setErrorMsg(err && err.message ? err.message : 'Booking failed. Please try again.');
      setPhase('form');
    }
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
          {(() => {
            if (V1_IS_ET_USER) return null;
            const local = v1BkSlotUserLocal(v1BkDateToISO(date), time);
            const dayBadge = local.dateOffset === 1 ? ' (next day)'
              : local.dateOffset === -1 ? ' (prev day)' : '';
            return <div><span style={{ color: V1.muted }}>YOURS </span>{local.time}{dayBadge} {V1_USER_TZ_SHORT}</div>;
          })()}
          <div><span style={{ color: V1.muted }}>WITH </span>{specialist.name} · {specialist.title}</div>
          <div>
            <span style={{ color: V1.muted }}>LINK </span>
            {bookingResult && bookingResult.joinUrl ? (
              <a
                href={bookingResult.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: accent, textDecoration: 'none', borderBottom: `1px solid ${accent}66` }}
              >
                Microsoft Teams meeting
              </a>
            ) : (
              'Teams — sent to your inbox'
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => downloadIcs({
              specialistName: specialist.name,
              specialistTitle: specialist.title,
              date,
              time,
              firstName: first,
              lastName: last,
              joinUrl: bookingResult && bookingResult.joinUrl,
            })}
            style={v1BkPrimaryBtn(accent)}
          >
            Add to calendar
            <V1BkIcon name="arrow" />
          </button>
          <button
            onClick={() => {
              onReset();
              setPhase('idle');
              setFirst(''); setLast(''); setEmailAddr(''); setErrorMsg('');
              setBookingResult(null);
            }}
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
          { k: 'Time',   v: time || 'Pick a time',                              filled: !!time,  sub: time && '30 min · Teams' },
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
        disabled={!ready}
        onClick={openForm}
        style={{
          ...v1BkPrimaryBtn(accent),
          opacity: ready ? 1 : 0.42,
          cursor: ready ? 'pointer' : 'not-allowed',
        }}
      >
        Book 30-minute call
        <V1BkIcon name="arrow" />
      </button>
      {(phase === 'form' || phase === 'submitting') && (
        <V1BookingForm
          phase={phase}
          first={first} setFirst={setFirst}
          last={last} setLast={setLast}
          emailAddr={emailAddr} setEmailAddr={setEmailAddr}
          formValid={formValid}
          errorMsg={errorMsg}
          accent={accent}
          specialist={specialist}
          dateLabel={fmt(date)}
          time={time}
          date={date}
          onClose={closeForm}
          onSubmit={submit}
        />
      )}

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
  const [busySlots, setBusySlots] = React.useState([]);
  const [busyLoading, setBusyLoading] = React.useState(false);
  const [nowMs, setNowMs] = React.useState(() => Date.now());

  const specialist = V1_SPECIALISTS.find(s => s.id === selectedSpecialistId);

  // Tick once a minute so already-passed slots disappear without a refresh.
  React.useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  // Fetch David's busy slots whenever the picked date changes.
  React.useEffect(() => {
    if (!selectedDate) { setBusySlots([]); return; }
    const dateISO = v1BkDateToISO(selectedDate);
    let cancelled = false;
    setBusyLoading(true);
    fetch(`/api/availability?dateISO=${encodeURIComponent(dateISO)}`)
      .then((r) => r.ok ? r.json() : { busy: [] })
      .then((data) => { if (!cancelled) setBusySlots(Array.isArray(data.busy) ? data.busy : []); })
      .catch(() => { if (!cancelled) setBusySlots([]); })
      .finally(() => { if (!cancelled) setBusyLoading(false); });
    return () => { cancelled = true; };
  }, [selectedDate && v1BkDateToISO(selectedDate)]);

  // If the currently-selected slot becomes busy or passes (live tick), unselect it.
  React.useEffect(() => {
    if (!selectedTime || !selectedDate) return;
    const dateISO = v1BkDateToISO(selectedDate);
    const conflict = busySlots.includes(selectedTime) || v1BkSlotIsPast(dateISO, selectedTime, nowMs);
    if (conflict) setSelectedTime(null);
  }, [busySlots, nowMs, selectedTime, selectedDate]);

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
              busySlots={busySlots}
              busyLoading={busyLoading}
              nowMs={nowMs}
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
              Get Funded instead
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
