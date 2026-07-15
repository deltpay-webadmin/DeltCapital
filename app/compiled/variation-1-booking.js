function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function V1UnderwriterDonut({
  person,
  accent,
  active
}) {
  const initials = person.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return React.createElement("div", {
    style: {
      position: 'relative',
      width: 56,
      height: 56,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      background: active ? `conic-gradient(from 180deg, ${accent}, #818CF8, ${accent})` : `linear-gradient(135deg, ${V1.ink}, #1E3A5F)`,
      transition: 'background .3s'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 3,
      borderRadius: 999,
      background: V1.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 600,
      color: active ? accent : V1.ink,
      letterSpacing: '-0.02em'
    }
  }, initials));
}
function V1BookingHero({
  accent
}) {
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.ink,
      padding: '80px 0 72px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: `1px solid rgba(255,255,255,0.06)`
    }
  }, React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: -220,
      right: -180,
      width: 600,
      height: 600,
      background: `radial-gradient(circle, ${accent}33 0%, transparent 60%)`,
      pointerEvents: 'none',
      filter: 'blur(20px)'
    }
  }), React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      bottom: -260,
      left: -140,
      width: 520,
      height: 520,
      background: `radial-gradient(circle, #4945FF22 0%, transparent 60%)`,
      pointerEvents: 'none',
      filter: 'blur(20px)'
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '0 40px',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      animation: 'bkFadeUp 600ms cubic-bezier(.2,.7,.3,1) both'
    }
  }, React.createElement(V1Eyebrow, {
    color: V1.blueSoft
  }, "Concierge \xB7 Real human")), React.createElement("h1", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2.4rem, 5.4vw, 4.5rem)',
      fontWeight: 600,
      letterSpacing: '-0.04em',
      lineHeight: 1.02,
      color: '#fff',
      margin: '22px 0 0',
      maxWidth: 840,
      animation: 'bkFadeUp 700ms cubic-bezier(.2,.7,.3,1) 60ms both'
    }
  }, "Talk to the underwriter", React.createElement("br", null), "who'd price your deal.", ' ', React.createElement("em", {
    style: {
      fontFamily: '"Source Serif Pro", Georgia, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      color: accent
    }
  }, "Not a call center.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 18.5,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.72)',
      margin: '28px 0 0',
      maxWidth: 620,
      animation: 'bkFadeUp 700ms cubic-bezier(.2,.7,.3,1) 140ms both'
    }
  }, "We're the only funding shop that prices your offer off your real card volume \u2014 not just a bank statement. Bring your last processing report, or connect your account live, and in 30 minutes you'll have the exact rate, term, and payment we'd fund you at. If we can't beat the offer you're holding, we'll tell you who can."), React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 32,
      animation: 'bkFadeUp 700ms cubic-bezier(.2,.7,.3,1) 220ms both'
    }
  }, [['clock', '30 min'], ['video', 'Microsoft Teams'], ['shield', 'No credit pull'], ['user', 'Real underwriter']].map(([icon, label]) => React.createElement("span", {
    key: label,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 999,
      padding: '7px 14px',
      fontFamily: V1.fontMono,
      fontSize: 11.5,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.82)'
    }
  }, React.createElement(V1BkIcon, {
    name: icon,
    size: 13
  }), label)))), React.createElement("style", null, `@keyframes bkFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`));
}
function V1BkIcon({
  name,
  size = 14
}) {
  const s = size;
  const p = {
    stroke: 'currentColor',
    strokeWidth: 1.6,
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  if (name === 'clock') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 14 14"
  }, React.createElement("circle", _extends({
    cx: "7",
    cy: "7",
    r: "5.5"
  }, p)), React.createElement("path", _extends({
    d: "M7 4v3l2 1.2"
  }, p)));
  if (name === 'video') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 14 14"
  }, React.createElement("rect", _extends({
    x: "1",
    y: "4",
    width: "8",
    height: "6",
    rx: "1"
  }, p)), React.createElement("path", _extends({
    d: "M9 6.5l3.5-1.8v4.6L9 7.5"
  }, p)));
  if (name === 'shield') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 14 14"
  }, React.createElement("path", _extends({
    d: "M7 1.2l5 1.8v3.5c0 3.2-2.1 5.5-5 6.3C4.1 12 2 9.7 2 6.5V3l5-1.8z"
  }, p)), React.createElement("path", _extends({
    d: "M4.8 7.2L6.3 8.7 9.4 5.6"
  }, p)));
  if (name === 'user') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 14 14"
  }, React.createElement("circle", _extends({
    cx: "7",
    cy: "5",
    r: "2.2"
  }, p)), React.createElement("path", _extends({
    d: "M2.5 12c0-2.3 2-4 4.5-4s4.5 1.7 4.5 4"
  }, p)));
  if (name === 'chev-l') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 14 14"
  }, React.createElement("path", _extends({
    d: "M9 3L5 7l4 4"
  }, p)));
  if (name === 'chev-r') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 14 14"
  }, React.createElement("path", _extends({
    d: "M5 3l4 4-4 4"
  }, p)));
  if (name === 'check') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 14 14"
  }, React.createElement("path", _extends({
    d: "M3 7.2L5.8 10 11 4.5"
  }, p)));
  if (name === 'arrow') return React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 14 14"
  }, React.createElement("path", _extends({
    d: "M3 7h8M8 4l3 3-3 3"
  }, p)));
  return null;
}
const V1_SPECIALISTS = [{
  id: 1,
  name: 'Marcus Reeves',
  title: 'Funding Specialist'
}, {
  id: 2,
  name: 'Jordan Bellamy',
  title: 'Funding Specialist'
}, {
  id: 3,
  name: 'Sasha Whitfield',
  title: 'Funding Specialist'
}];
const V1_BK_TIMES = (() => {
  const out = [];
  for (let h = 8; h < 18; h++) {
    for (const m of ['00', '30']) {
      const hr12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
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
  return {
    h,
    min
  };
}
const V1_USER_TZ = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York';
  }
})();
const V1_USER_TZ_SHORT = (() => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: V1_USER_TZ,
      timeZoneName: 'short'
    }).formatToParts(new Date());
    const tzn = parts.find(p => p.type === 'timeZoneName');
    return tzn ? tzn.value : V1_USER_TZ;
  } catch {
    return V1_USER_TZ;
  }
})();
const V1_IS_ET_USER = V1_USER_TZ === 'America/New_York';
function v1BkTzOffsetMin(date, tz) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
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
  if (!utc) return {
    time: etTimeStr,
    dateOffset: 0
  };
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: V1_USER_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(utc).toLowerCase().replace(/\s/g, '');
  const userDateISO = new Intl.DateTimeFormat('en-CA', {
    timeZone: V1_USER_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(utc);
  let dateOffset = 0;
  if (userDateISO < dateISO) dateOffset = -1;else if (userDateISO > dateISO) dateOffset = 1;
  return {
    time,
    dateOffset
  };
}
function v1BkSlotIsPast(dateISO, etTimeStr, nowMs) {
  const utc = v1BkEtWallToUTC(dateISO, etTimeStr);
  if (!utc) return false;
  return utc.getTime() <= (nowMs || Date.now());
}
function v1BkTodayInET() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}
function v1BkDateToISO(d) {
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function downloadIcs({
  specialistName,
  specialistTitle,
  date,
  time,
  firstName,
  lastName,
  joinUrl
}) {
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
  const dtEnd = `${yyyy}${mm}${dd}T${eh}${em}00`;
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` + `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const uid = `${dtStamp}-${Math.random().toString(36).slice(2, 10)}@deltcapital.com`;
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  const summary = `Delt Capital — 30-min call with ${specialistName}`;
  const desc = [`30-minute call with ${specialistName}${specialistTitle ? ` (${specialistTitle})` : ''}.`, fullName && `Booked by ${fullName}.`, joinUrl && `Join: ${joinUrl}`].filter(Boolean).join('\\n');
  const location = joinUrl || 'Microsoft Teams';
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Delt Capital//Booking//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VTIMEZONE', 'TZID:America/New_York', 'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'TZNAME:EDT', 'DTSTART:19700308T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT', 'BEGIN:STANDARD', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'TZNAME:EST', 'DTSTART:19701101T020000', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD', 'END:VTIMEZONE', 'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${dtStamp}`, `DTSTART;TZID=America/New_York:${dtStart}`, `DTEND;TZID=America/New_York:${dtEnd}`, `SUMMARY:${summary}`, `DESCRIPTION:${desc}`, `LOCATION:${location}`, 'STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const blob = new Blob([ics], {
    type: 'text/calendar;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `delt-capital-${yyyy}${mm}${dd}-${sh}${sm}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function V1BookingCalendar({
  currentDate,
  setCurrentDate,
  selectedDate,
  onPickDate,
  accent
}) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dow = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const y = currentDate.getFullYear(),
    m = currentDate.getMonth();
  const first = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const todayET = v1BkTodayInET();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  const cellISO = d => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isSel = d => selectedDate && selectedDate.getFullYear() === y && selectedDate.getMonth() === m && selectedDate.getDate() === d;
  const isPast = d => cellISO(d) < todayET;
  const isWknd = d => {
    const g = new Date(y, m, d).getDay();
    return g === 0 || g === 6;
  };
  return React.createElement("div", null, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 16,
      height: 1,
      background: V1.muted
    }
  }), "Choose a day"), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink
    }
  }, monthNames[m], " ", y)), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, React.createElement("button", {
    onClick: () => setCurrentDate(new Date(y, m - 1, 1)),
    "aria-label": "Previous month",
    style: v1BkNavBtn,
    onMouseEnter: e => {
      e.currentTarget.style.background = V1.bgWarm;
      e.currentTarget.style.borderColor = V1.ink;
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = V1.white;
      e.currentTarget.style.borderColor = V1.line;
    }
  }, React.createElement(V1BkIcon, {
    name: "chev-l"
  })), React.createElement("button", {
    onClick: () => setCurrentDate(new Date(y, m + 1, 1)),
    "aria-label": "Next month",
    style: v1BkNavBtn,
    onMouseEnter: e => {
      e.currentTarget.style.background = V1.bgWarm;
      e.currentTarget.style.borderColor = V1.ink;
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = V1.white;
      e.currentTarget.style.borderColor = V1.line;
    }
  }, React.createElement(V1BkIcon, {
    name: "chev-r"
  })))), React.createElement("div", {
    style: {
      border: `1px solid ${V1.line}`,
      borderRadius: 12,
      overflow: 'hidden',
      background: V1.white
    }
  }, React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      background: V1.bg,
      borderBottom: `1px solid ${V1.line}`
    }
  }, dow.map(d => React.createElement("div", {
    key: d,
    style: {
      padding: '10px 0',
      textAlign: 'center',
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      color: V1.muted
    }
  }, d))), React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)'
    }
  }, cells.map((d, i) => {
    if (!d) return React.createElement("div", {
      key: i,
      style: {
        aspectRatio: '1',
        background: V1.bgWarm
      }
    });
    const past = isPast(d);
    const wknd = isWknd(d);
    const disabled = past || wknd;
    const sel = isSel(d);
    return React.createElement("button", {
      key: i,
      disabled: disabled,
      onClick: () => !disabled && onPickDate(new Date(y, m, d)),
      style: {
        aspectRatio: '1',
        border: 'none',
        padding: 0,
        borderTop: `1px solid ${V1.line}`,
        borderLeft: i % 7 === 0 ? 'none' : `1px solid ${V1.line}`,
        background: sel ? accent : V1.white,
        color: sel ? V1.white : disabled ? '#C3CED7' : V1.ink,
        fontFamily: V1.fontDisplay,
        fontSize: 15,
        fontWeight: sel ? 600 : 500,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background .15s, color .15s, transform .12s',
        position: 'relative'
      },
      onMouseEnter: e => {
        if (!disabled && !sel) {
          e.currentTarget.style.background = V1.bg;
          e.currentTarget.style.transform = 'scale(1.04)';
        }
      },
      onMouseLeave: e => {
        if (!sel) {
          e.currentTarget.style.background = V1.white;
          e.currentTarget.style.transform = 'scale(1)';
        }
      }
    }, d, !disabled && !sel && React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 3,
        height: 3,
        borderRadius: 999,
        background: accent,
        opacity: 0.5
      }
    }));
  }))), React.createElement("div", {
    style: {
      marginTop: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, "Timezone"), React.createElement("select", {
    defaultValue: "et",
    style: {
      border: `1px solid ${V1.line}`,
      borderRadius: 8,
      padding: '7px 12px',
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: V1.ink,
      background: V1.white,
      cursor: 'pointer'
    }
  }, React.createElement("option", {
    value: "et"
  }, "Eastern (US)"), React.createElement("option", {
    value: "ct"
  }, "Central (US)"), React.createElement("option", {
    value: "mt"
  }, "Mountain (US)"), React.createElement("option", {
    value: "pt"
  }, "Pacific (US)"))));
}
const v1BkNavBtn = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: `1px solid ${V1.line}`,
  background: V1.white,
  color: V1.ink,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background .15s, border-color .15s'
};
function V1TimeSlots({
  selectedDate,
  selectedTime,
  onPickTime,
  accent,
  busySlots,
  busyLoading,
  nowMs
}) {
  const fmtDate = d => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };
  if (!selectedDate) {
    return React.createElement("div", {
      style: {
        padding: '40px 20px',
        textAlign: 'center',
        border: `1px dashed ${V1.line}`,
        borderRadius: 12,
        background: V1.white,
        fontFamily: V1.fontBody,
        fontSize: 14,
        color: V1.muted
      }
    }, "Pick a day to see open times.");
  }
  const dateISO = v1BkDateToISO(selectedDate);
  const busySet = new Set(busySlots || []);
  const visibleSlots = V1_BK_TIMES.map(t => {
    const past = v1BkSlotIsPast(dateISO, t, nowMs);
    const busy = busySet.has(t);
    const local = v1BkSlotUserLocal(dateISO, t);
    return {
      t,
      past,
      busy,
      local
    };
  });
  const slots = visibleSlots.filter(s => !s.past);
  const allTaken = slots.every(s => s.busy);
  return React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 16,
      height: 1,
      background: V1.muted
    }
  }), "Open times"), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: V1.ink,
      marginBottom: 6
    }
  }, fmtDate(selectedDate)), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      color: V1.muted,
      letterSpacing: '0.06em',
      marginBottom: 14
    }
  }, V1_IS_ET_USER ? 'All times in Eastern Time' : `Your time (${V1_USER_TZ_SHORT}) · Meeting held in Eastern Time`), slots.length === 0 ? React.createElement("div", {
    style: {
      padding: '20px 16px',
      textAlign: 'center',
      border: `1px dashed ${V1.line}`,
      borderRadius: 10,
      background: V1.white,
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      color: V1.muted
    }
  }, "No more open times today \u2014 pick another day.") : busyLoading ? React.createElement("div", {
    style: {
      padding: '20px 16px',
      textAlign: 'center',
      border: `1px dashed ${V1.line}`,
      borderRadius: 10,
      background: V1.white,
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      color: V1.muted
    }
  }, "Checking David's calendar\u2026") : allTaken ? React.createElement("div", {
    style: {
      padding: '20px 16px',
      textAlign: 'center',
      border: `1px dashed ${V1.line}`,
      borderRadius: 10,
      background: V1.white,
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      color: V1.muted
    }
  }, "Fully booked \u2014 try another day.") : React.createElement("div", {
    className: "bk-slot-list",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxHeight: 440,
      overflowY: 'auto',
      paddingRight: 6
    }
  }, slots.map(({
    t,
    busy,
    local
  }, i) => {
    const sel = selectedTime === t;
    const disabled = busy;
    const primary = V1_IS_ET_USER ? t : local.time;
    const secondary = V1_IS_ET_USER ? '30 min' : `${t} ET`;
    const dayBadge = local.dateOffset === 1 ? ' · next day' : local.dateOffset === -1 ? ' · prev day' : '';
    return React.createElement("button", {
      key: t,
      onClick: () => {
        if (!disabled) onPickTime(t);
      },
      disabled: disabled,
      "aria-disabled": disabled,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 16px',
        borderRadius: 10,
        border: `1px solid ${sel ? accent : V1.line}`,
        background: disabled ? V1.bg : sel ? accent : V1.white,
        color: disabled ? V1.muted : sel ? V1.white : V1.ink,
        fontFamily: V1.fontBody,
        fontSize: 14.5,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        textDecoration: disabled ? 'line-through' : 'none',
        transition: 'all .15s',
        animation: `bkSlotIn 400ms cubic-bezier(.2,.7,.3,1) ${Math.min(i, 8) * 50}ms both`
      },
      onMouseEnter: e => {
        if (!sel && !disabled) {
          e.currentTarget.style.borderColor = accent;
          e.currentTarget.style.background = `${accent}08`;
        }
      },
      onMouseLeave: e => {
        if (!sel && !disabled) {
          e.currentTarget.style.borderColor = V1.line;
          e.currentTarget.style.background = V1.white;
        }
      }
    }, React.createElement("span", {
      style: {
        fontVariantNumeric: 'tabular-nums'
      }
    }, primary, dayBadge ? React.createElement("span", {
      style: {
        fontFamily: V1.fontMono,
        fontSize: 10.5,
        marginLeft: 8,
        color: sel ? 'rgba(255,255,255,0.85)' : V1.muted,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }
    }, dayBadge.replace(' · ', '')) : null), React.createElement("span", {
      style: {
        fontFamily: V1.fontMono,
        fontSize: 10.5,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: sel ? 'rgba(255,255,255,0.75)' : V1.muted
      }
    }, disabled ? 'Booked' : secondary));
  })), React.createElement("style", null, `
        @keyframes bkSlotIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .bk-slot-list { scrollbar-width: thin; scrollbar-color: ${V1.line} transparent; }
        .bk-slot-list::-webkit-scrollbar { width: 6px; }
        .bk-slot-list::-webkit-scrollbar-thumb { background: ${V1.line}; border-radius: 3px; }
        .bk-slot-list::-webkit-scrollbar-track { background: transparent; }
      `));
}
function V1SpecialistCard({
  person,
  active,
  onPick,
  accent,
  idx
}) {
  return React.createElement("button", {
    onClick: onPick,
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      padding: 20,
      borderRadius: 14,
      border: active ? `1.5px solid ${accent}` : `1px solid ${V1.line}`,
      background: active ? `${accent}08` : V1.white,
      transition: 'all .2s',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      animation: `bkCardIn 500ms cubic-bezier(.2,.7,.3,1) ${idx * 80 + 150}ms both`,
      outline: 'none'
    },
    onMouseEnter: e => {
      if (!active) {
        e.currentTarget.style.borderColor = V1.ink;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(10,37,64,0.08)';
      }
    },
    onMouseLeave: e => {
      if (!active) {
        e.currentTarget.style.borderColor = V1.line;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, React.createElement(V1UnderwriterDonut, {
    person: person,
    accent: accent,
    active: active
  }), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 16,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.015em'
    }
  }, person.name), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13,
      color: active ? accent : V1.muted,
      marginTop: 2
    }
  }, person.title)), active && React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 999,
      background: accent,
      color: V1.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement(V1BkIcon, {
    name: "check",
    size: 11
  }))), React.createElement("style", null, `@keyframes bkCardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`));
}
function V1BookingForm({
  phase,
  first,
  setFirst,
  last,
  setLast,
  emailAddr,
  setEmailAddr,
  formValid,
  errorMsg,
  accent,
  specialist,
  dateLabel,
  time,
  date,
  onClose,
  onSubmit
}) {
  const dateISO = v1BkDateToISO(date);
  const local = v1BkSlotUserLocal(dateISO, time);
  const dayBadge = local.dateOffset === 1 ? ' (next day your time)' : local.dateOffset === -1 ? ' (prev day your time)' : '';
  const timePrimary = V1_IS_ET_USER ? `${time} ET` : `${local.time}${dayBadge}`;
  const timeSecondary = V1_IS_ET_USER ? '30 min' : `${time} ET · 30 min`;
  const submitting = phase === 'submitting';
  const inputStyle = {
    width: '100%',
    padding: '11px 12px',
    borderRadius: 8,
    border: `1px solid ${V1.line}`,
    background: V1.white,
    fontFamily: V1.fontBody,
    fontSize: 14.5,
    color: V1.ink,
    outline: 'none',
    transition: 'border-color .15s, box-shadow .15s'
  };
  const labelStyle = {
    fontFamily: V1.fontMono,
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: V1.muted,
    marginBottom: 6,
    display: 'block'
  };
  const focus = e => {
    e.currentTarget.style.borderColor = accent;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}1f`;
  };
  const blur = e => {
    e.currentTarget.style.borderColor = V1.line;
    e.currentTarget.style.boxShadow = 'none';
  };
  return React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Confirm your booking",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(10,37,64,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      animation: 'bkOverlayIn 220ms ease-out both'
    },
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 480,
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 14,
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      animation: 'bkModalIn 280ms cubic-bezier(.2,.7,.3,1) both',
      boxShadow: '0 24px 60px rgba(10,37,64,0.18)'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted,
      marginBottom: 6
    }
  }, "Confirm your booking"), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 22,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    }
  }, "Tell us who's coming.")), React.createElement("button", {
    type: "button",
    "aria-label": "Close",
    onClick: onClose,
    disabled: submitting,
    style: {
      border: `1px solid ${V1.line}`,
      background: V1.white,
      width: 32,
      height: 32,
      borderRadius: 8,
      cursor: submitting ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: V1.muted
    }
  }, React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M3 3l8 8M11 3l-8 8"
  })))), React.createElement("div", {
    style: {
      background: V1.bg,
      border: `1px solid ${V1.line}`,
      borderRadius: 10,
      padding: 14,
      fontFamily: V1.fontMono,
      fontSize: 12.5,
      color: V1.ink,
      lineHeight: 1.7,
      fontVariantNumeric: 'tabular-nums'
    }
  }, React.createElement("div", null, React.createElement("span", {
    style: {
      color: V1.muted
    }
  }, "WITH "), specialist.name, " \xB7 ", specialist.title), React.createElement("div", null, React.createElement("span", {
    style: {
      color: V1.muted
    }
  }, "DATE "), dateLabel), React.createElement("div", null, React.createElement("span", {
    style: {
      color: V1.muted
    }
  }, "TIME "), timePrimary, " \xB7 ", timeSecondary)), React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit();
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, React.createElement("label", null, React.createElement("span", {
    style: labelStyle
  }, "First name"), React.createElement("input", {
    type: "text",
    required: true,
    autoComplete: "given-name",
    value: first,
    onChange: e => setFirst(e.target.value),
    onFocus: focus,
    onBlur: blur,
    style: inputStyle,
    disabled: submitting
  })), React.createElement("label", null, React.createElement("span", {
    style: labelStyle
  }, "Last name"), React.createElement("input", {
    type: "text",
    required: true,
    autoComplete: "family-name",
    value: last,
    onChange: e => setLast(e.target.value),
    onFocus: focus,
    onBlur: blur,
    style: inputStyle,
    disabled: submitting
  }))), React.createElement("label", null, React.createElement("span", {
    style: labelStyle
  }, "Email"), React.createElement("input", {
    type: "email",
    required: true,
    autoComplete: "email",
    value: emailAddr,
    onChange: e => setEmailAddr(e.target.value),
    onFocus: focus,
    onBlur: blur,
    style: inputStyle,
    disabled: submitting,
    placeholder: "you@company.com"
  })), errorMsg && React.createElement("div", {
    style: {
      background: '#FFF1F1',
      border: '1px solid #F2C5C5',
      borderRadius: 8,
      padding: '10px 12px',
      color: '#9B1C1C',
      fontFamily: V1.fontBody,
      fontSize: 13
    }
  }, errorMsg), React.createElement("button", {
    type: "submit",
    disabled: !formValid || submitting,
    style: {
      ...v1BkPrimaryBtn(accent),
      opacity: !formValid || submitting ? 0.55 : 1,
      cursor: !formValid || submitting ? 'not-allowed' : 'pointer',
      marginTop: 4
    }
  }, submitting ? 'Booking…' : 'Confirm booking', !submitting && React.createElement(V1BkIcon, {
    name: "arrow"
  })), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: V1.muted,
      textAlign: 'center'
    }
  }, "We'll email you a Teams link \xB7 No credit pull"))), React.createElement("style", null, `
        @keyframes bkOverlayIn{from{opacity:0}to{opacity:1}}
        @keyframes bkModalIn{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      `));
}
function V1ConfirmPanel({
  specialist,
  date,
  time,
  accent,
  onReset
}) {
  const [phase, setPhase] = React.useState('idle');
  const [first, setFirst] = React.useState('');
  const [last, setLast] = React.useState('');
  const [emailAddr, setEmailAddr] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [bookingResult, setBookingResult] = React.useState(null);
  const ready = !!(specialist && date && time);
  const fmt = d => {
    if (!d) return '—';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };
  const fmtLong = d => {
    if (!d) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };
  const openForm = () => {
    if (ready) {
      setErrorMsg('');
      setPhase('form');
    }
  };
  const closeForm = () => {
    if (phase !== 'submitting') setPhase('idle');
  };
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddr.trim());
  const formValid = first.trim() && last.trim() && emailValid;
  const submit = async () => {
    if (!ready || !formValid) return;
    setErrorMsg('');
    setPhase('submitting');
    try {
      const dateISO = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const r = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: first.trim(),
          lastName: last.trim(),
          email: emailAddr.trim(),
          specialistName: specialist.name,
          specialistTitle: specialist.title,
          dateLabel: fmtLong(date),
          dateISO,
          time,
          userTimeZone: V1_USER_TZ
        })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data.error || `Request failed (${r.status})`);
      }
      setBookingResult(data);
      setPhase('done');
      if (typeof window !== 'undefined' && window.DeltPixel) {
        window.DeltPixel.contactBooked();
      }
    } catch (err) {
      setErrorMsg(err && err.message ? err.message : 'Booking failed. Please try again.');
      setPhase('form');
    }
  };
  if (phase === 'done') {
    return React.createElement("div", {
      style: {
        background: V1.white,
        border: `1px solid ${V1.line}`,
        borderRadius: 14,
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        animation: 'bkFadeUp 500ms cubic-bezier(.2,.7,.3,1) both'
      }
    }, React.createElement("div", {
      style: {
        width: 48,
        height: 48,
        borderRadius: 999,
        background: `${V1.green}14`,
        color: V1.green,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'bkCheckPop 500ms cubic-bezier(.2,1.4,.5,1) 80ms both'
      }
    }, React.createElement(V1BkIcon, {
      name: "check",
      size: 22
    })), React.createElement("div", null, React.createElement("div", {
      style: {
        fontFamily: V1.fontMono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: V1.green,
        marginBottom: 6
      }
    }, "Booked"), React.createElement("div", {
      style: {
        fontFamily: V1.fontDisplay,
        fontSize: 22,
        fontWeight: 600,
        color: V1.ink,
        letterSpacing: '-0.02em',
        lineHeight: 1.2
      }
    }, "You're on ", specialist.name.split(' ')[0], "'s calendar.")), React.createElement("div", {
      style: {
        background: V1.bg,
        border: `1px solid ${V1.line}`,
        borderRadius: 10,
        padding: 14,
        fontFamily: V1.fontMono,
        fontSize: 12.5,
        color: V1.ink,
        lineHeight: 1.7,
        fontVariantNumeric: 'tabular-nums'
      }
    }, React.createElement("div", null, React.createElement("span", {
      style: {
        color: V1.muted
      }
    }, "DATE "), fmt(date)), React.createElement("div", null, React.createElement("span", {
      style: {
        color: V1.muted
      }
    }, "TIME "), time, " ET \xB7 30 min"), (() => {
      if (V1_IS_ET_USER) return null;
      const local = v1BkSlotUserLocal(v1BkDateToISO(date), time);
      const dayBadge = local.dateOffset === 1 ? ' (next day)' : local.dateOffset === -1 ? ' (prev day)' : '';
      return React.createElement("div", null, React.createElement("span", {
        style: {
          color: V1.muted
        }
      }, "YOURS "), local.time, dayBadge, " ", V1_USER_TZ_SHORT);
    })(), React.createElement("div", null, React.createElement("span", {
      style: {
        color: V1.muted
      }
    }, "WITH "), specialist.name, " \xB7 ", specialist.title), React.createElement("div", null, React.createElement("span", {
      style: {
        color: V1.muted
      }
    }, "LINK "), bookingResult && bookingResult.joinUrl ? React.createElement("a", {
      href: bookingResult.joinUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: accent,
        textDecoration: 'none',
        borderBottom: `1px solid ${accent}66`
      }
    }, "Microsoft Teams meeting") : 'Teams — sent to your inbox')), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, React.createElement("button", {
      onClick: () => downloadIcs({
        specialistName: specialist.name,
        specialistTitle: specialist.title,
        date,
        time,
        firstName: first,
        lastName: last,
        joinUrl: bookingResult && bookingResult.joinUrl
      }),
      style: v1BkPrimaryBtn(accent)
    }, "Add to calendar", React.createElement(V1BkIcon, {
      name: "arrow"
    })), React.createElement("button", {
      onClick: () => {
        onReset();
        setPhase('idle');
        setFirst('');
        setLast('');
        setEmailAddr('');
        setErrorMsg('');
        setBookingResult(null);
      },
      style: {
        padding: '11px 18px',
        borderRadius: 10,
        border: `1px solid ${V1.line}`,
        background: V1.white,
        color: V1.ink,
        cursor: 'pointer',
        fontFamily: V1.fontBody,
        fontSize: 13.5,
        fontWeight: 500
      }
    }, "Book another")), React.createElement("style", null, `@keyframes bkCheckPop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}`));
  }
  return React.createElement("div", {
    style: {
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 14,
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'sticky',
      top: 24
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 16,
      height: 1,
      background: V1.muted
    }
  }), "Your booking"), React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 20,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    }
  }, "Confirm the details.")), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, [{
    k: 'With',
    v: specialist ? specialist.name : 'Pick a specialist',
    filled: !!specialist,
    sub: specialist && specialist.title
  }, {
    k: 'Day',
    v: date ? fmt(date) : 'Pick a day',
    filled: !!date
  }, {
    k: 'Time',
    v: time || 'Pick a time',
    filled: !!time,
    sub: time && '30 min · Teams'
  }].map((r, i) => React.createElement("div", {
    key: r.k,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      padding: '12px 0',
      borderBottom: i < 2 ? `1px solid ${V1.lineSoft || V1.line}` : 'none'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: V1.muted,
      flexShrink: 0,
      paddingTop: 2
    }
  }, r.k), React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      fontWeight: 500,
      color: r.filled ? V1.ink : V1.muted
    }
  }, r.v), r.sub && React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 12,
      color: V1.muted,
      marginTop: 2
    }
  }, r.sub))))), React.createElement("button", {
    disabled: !ready,
    onClick: openForm,
    style: {
      ...v1BkPrimaryBtn(accent),
      opacity: ready ? 1 : 0.42,
      cursor: ready ? 'pointer' : 'not-allowed'
    }
  }, "Book 30-minute call", React.createElement(V1BkIcon, {
    name: "arrow"
  })), (phase === 'form' || phase === 'submitting') && React.createElement(V1BookingForm, {
    phase: phase,
    first: first,
    setFirst: setFirst,
    last: last,
    setLast: setLast,
    emailAddr: emailAddr,
    setEmailAddr: setEmailAddr,
    formValid: formValid,
    errorMsg: errorMsg,
    accent: accent,
    specialist: specialist,
    dateLabel: fmt(date),
    time: time,
    date: date,
    onClose: closeForm,
    onSubmit: submit
  }), React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: V1.muted,
      textAlign: 'center'
    }
  }, "No credit pull \xB7 Cancel anytime"));
}
function v1BkPrimaryBtn(accent) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '13px 20px',
    borderRadius: 10,
    border: 'none',
    background: accent,
    color: V1.white,
    fontFamily: V1.fontBody,
    fontSize: 14.5,
    fontWeight: 600,
    letterSpacing: '-0.005em',
    cursor: 'pointer',
    transition: 'transform .1s, filter .15s',
    width: '100%'
  };
}
function V1BookingPage({
  accent,
  onApply
}) {
  const today = new Date();
  const [currentDate, setCurrentDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [selectedSpecialistId, setSelectedSpecialistId] = React.useState(1);
  const [busySlots, setBusySlots] = React.useState([]);
  const [busyLoading, setBusyLoading] = React.useState(false);
  const [nowMs, setNowMs] = React.useState(() => Date.now());
  const specialist = V1_SPECIALISTS.find(s => s.id === selectedSpecialistId);
  React.useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    if (!selectedDate) {
      setBusySlots([]);
      return;
    }
    const dateISO = v1BkDateToISO(selectedDate);
    let cancelled = false;
    setBusyLoading(true);
    fetch(`/api/availability?dateISO=${encodeURIComponent(dateISO)}`).then(r => r.ok ? r.json() : {
      busy: []
    }).then(data => {
      if (!cancelled) setBusySlots(Array.isArray(data.busy) ? data.busy : []);
    }).catch(() => {
      if (!cancelled) setBusySlots([]);
    }).finally(() => {
      if (!cancelled) setBusyLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedDate && v1BkDateToISO(selectedDate)]);
  React.useEffect(() => {
    if (!selectedTime || !selectedDate) return;
    const dateISO = v1BkDateToISO(selectedDate);
    const conflict = busySlots.includes(selectedTime) || v1BkSlotIsPast(dateISO, selectedTime, nowMs);
    if (conflict) setSelectedTime(null);
  }, [busySlots, nowMs, selectedTime, selectedDate]);
  const reset = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedSpecialistId(1);
  };
  return React.createElement(React.Fragment, null, React.createElement(V1BookingHero, {
    accent: accent
  }), React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.bg,
      padding: '80px 0 96px'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px'
    }
  }, React.createElement("div", {
    style: {
      marginBottom: 56
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 22
    }
  }, React.createElement("div", null, React.createElement(V1Eyebrow, null, "Step 01 \xB7 Who"), React.createElement("h2", {
    "data-v1-section-title": true,
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: V1.ink,
      margin: '12px 0 0'
    }
  }, "Pick your specialist.")), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      color: V1.muted,
      maxWidth: 380,
      margin: 0
    }
  }, "Any of our three will give you a straight answer. They each own their own book \u2014 you'll stay with whoever you pick.")), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, V1_SPECIALISTS.map((p, i) => React.createElement(V1SpecialistCard, {
    key: p.id,
    person: p,
    active: selectedSpecialistId === p.id,
    onPick: () => setSelectedSpecialistId(p.id),
    accent: accent,
    idx: i
  })))), React.createElement("div", {
    style: {
      height: 1,
      background: V1.line,
      margin: '0 0 48px',
      position: 'relative'
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: -8,
      background: V1.bg,
      padding: '0 14px 0 0',
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted
    }
  }, "Step 02 \xB7 When")), React.createElement("div", {
    "data-v1-grid-3col": true,
    style: {
      display: 'grid',
      gridTemplateColumns: '1.35fr 0.75fr 0.9fr',
      gap: 28,
      alignItems: 'flex-start'
    }
  }, React.createElement(V1BookingCalendar, {
    currentDate: currentDate,
    setCurrentDate: setCurrentDate,
    selectedDate: selectedDate,
    onPickDate: d => {
      setSelectedDate(d);
      setSelectedTime(null);
    },
    accent: accent
  }), React.createElement(V1TimeSlots, {
    selectedDate: selectedDate,
    selectedTime: selectedTime,
    onPickTime: setSelectedTime,
    accent: accent,
    busySlots: busySlots,
    busyLoading: busyLoading,
    nowMs: nowMs
  }), React.createElement(V1ConfirmPanel, {
    specialist: specialist,
    date: selectedDate,
    time: selectedTime,
    accent: accent,
    onReset: reset
  })), React.createElement("div", {
    "data-v1-grid-4col": true,
    style: {
      marginTop: 72,
      padding: '28px 32px',
      background: V1.white,
      border: `1px solid ${V1.line}`,
      borderRadius: 14,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 28
    }
  }, [['No credit pull', 'This is a conversation, not a quote request.'], ['Real underwriter', 'Not a BDR reading a script. The person who prices your file.'], ['30 minutes, capped', "We'll respect your time. Early exits are fine."], ['Zero obligation', "If we're not the right fit, we'll tell you who is."]].map(([t, d]) => React.createElement("div", {
    key: t
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: accent,
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 12,
      height: 1,
      background: accent
    }
  }), t), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      lineHeight: 1.55,
      color: V1.text
    }
  }, d)))), React.createElement("div", {
    style: {
      marginTop: 48,
      padding: 32,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontDisplay,
      fontSize: 20,
      fontWeight: 600,
      color: V1.ink,
      letterSpacing: '-0.02em'
    }
  }, "Rather skip the call?"), React.createElement("p", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14.5,
      color: V1.muted,
      maxWidth: 440,
      margin: 0,
      lineHeight: 1.55
    }
  }, "Run a rate yourself in 60 seconds. Soft pull, no obligation, real numbers against your actual deposits."), React.createElement("button", {
    onClick: onApply,
    style: {
      ...v1BkPrimaryBtn(accent),
      width: 'auto',
      padding: '12px 22px'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.filter = 'brightness(1.07)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.filter = 'none';
    }
  }, "Get Funded instead", React.createElement(V1BkIcon, {
    name: "arrow"
  }))))));
}
Object.assign(window, {
  V1BookingPage,
  V1_SPECIALISTS
});