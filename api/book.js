// Vercel serverless function — booking handler.
//
// Three things happen on a booking:
//   1. Create a 30-minute event on David's calendar via Microsoft Graph,
//      with the booker added as a required attendee and a Teams meeting
//      auto-generated. Outlook sends the booker an .ics invite for free.
//   2. Send an internal HTML notification → david@deltpay.com
//   3. Send a branded HTML confirmation → the booker, including the Teams
//      join link from step 1.
//
// Required Vercel env vars (Microsoft Graph app registration):
//   OUTLOOK_TENANT_ID     — Azure AD tenant id
//   OUTLOOK_CLIENT_ID     — App registration (client) id
//   OUTLOOK_CLIENT_SECRET — App registration client secret
//   OUTLOOK_FROM_EMAIL    — Mailbox the emails AND calendar invites are sent from
//                            (e.g. noreply@deltpay.com — a shared mailbox is fine)
//
// Required application permissions on the app registration (admin consent):
//   Mail.Send                    — on OUTLOOK_FROM_EMAIL  (the noreply mailbox)
//   Calendars.ReadWrite          — on OUTLOOK_FROM_EMAIL  (so noreply can host events)
//                                 + BOOKING_NOTIFY_EMAIL (so we can read David's calendar
//                                   for availability and add him as an attendee)
//   OnlineMeetings.ReadWrite.All — on OUTLOOK_TEAMS_HOST  (defaults to BOOKING_NOTIFY_EMAIL —
//                                   David's licensed mailbox creates the Teams meeting)
// (If you have an Application Access Policy, it must cover BOTH mailboxes.)
//
// Optional:
//   OUTLOOK_CALENDAR_USER — Mailbox the event lands on. Defaults to OUTLOOK_FROM_EMAIL,
//                           then BOOKING_NOTIFY_EMAIL. Set explicitly only if you want
//                           the calendar invite to come from a different mailbox than
//                           the one sending the HTML emails.
//   OUTLOOK_TEAMS_HOST    — Mailbox whose Teams license backs the online meeting.
//                           Defaults to BOOKING_NOTIFY_EMAIL (David). Shared mailboxes
//                           don't typically have Teams licenses, so this should be a
//                           regular licensed user.
//   BOOKING_NOTIFY_EMAIL  — Internal recipient + BCC on booker email; defaults to david@deltpay.com
//   BOOKING_TIMEZONE      — Windows timezone name; defaults to "Eastern Standard Time"

const NOTIFY_TO = process.env.BOOKING_NOTIFY_EMAIL || 'info@deltpay.com';
const CALENDAR_USER = process.env.OUTLOOK_CALENDAR_USER || process.env.OUTLOOK_FROM_EMAIL || NOTIFY_TO;
const TEAMS_HOST = process.env.OUTLOOK_TEAMS_HOST || NOTIFY_TO;
const EVENT_TIMEZONE = process.env.BOOKING_TIMEZONE || 'Eastern Standard Time';

async function getAccessToken() {
  const tenant = process.env.OUTLOOK_TENANT_ID;
  const clientId = process.env.OUTLOOK_CLIENT_ID;
  const secret = process.env.OUTLOOK_CLIENT_SECRET;
  if (!tenant || !clientId || !secret) {
    throw new Error('Missing OUTLOOK_TENANT_ID / OUTLOOK_CLIENT_ID / OUTLOOK_CLIENT_SECRET');
  }
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: secret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });
  const r = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`Token request failed (${r.status}): ${text.slice(0, 400)}`);
  }
  const data = await r.json();
  if (!data.access_token) throw new Error('Token response missing access_token');
  return data.access_token;
}

// senderMailbox is the licensed mailbox whose URL we POST to (the actual
// sender). opts.from is the display From address — must be a mailbox the
// senderMailbox holds Send-As permission on. This pattern matches how
// shared mailboxes work in Outlook: a real licensed user (David) sends
// "as" the shared mailbox (noreply) without the shared mailbox needing
// its own send capability.
async function sendMail(token, senderMailbox, to, subject, html, opts = {}) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderMailbox)}/sendMail`;
  const message = {
    subject,
    body: { contentType: 'HTML', content: html },
    toRecipients: [{ emailAddress: { address: to } }],
  };
  if (opts.from) {
    const fromAddr = { address: opts.from };
    if (opts.fromName) fromAddr.name = opts.fromName;
    message.from = { emailAddress: fromAddr };
  }
  if (opts.replyTo && opts.replyTo.length) {
    message.replyTo = opts.replyTo.map((addr) => ({ emailAddress: { address: addr } }));
  }
  if (opts.bcc && opts.bcc.length) {
    message.bccRecipients = opts.bcc.map((addr) => ({ emailAddress: { address: addr } }));
  }
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, saveToSentItems: true }),
  });
  if (r.status !== 202) {
    const text = await r.text().catch(() => '');
    throw new Error(`sendMail to ${to} failed (${r.status}): ${text.slice(0, 400)}`);
  }
}

// Convert an ET wall-clock (YYYY-MM-DD + 24h hour/min) to a UTC ISO 8601
// string with a 'Z' suffix. DST-aware via Intl.
function etWallToUTCIso(dateISO, h24, min) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateISO || ''))) return null;
  const [y, mo, d] = dateISO.split('-').map(Number);
  const candidate = new Date(Date.UTC(y, mo - 1, d, h24, min));
  let offsetMin;
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(candidate);
    const o = {};
    for (const p of parts) o[p.type] = p.value;
    const hr = +o.hour === 24 ? 0 : +o.hour;
    const asUTC = Date.UTC(+o.year, +o.month - 1, +o.day, hr, +o.minute, +o.second);
    offsetMin = Math.round((asUTC - candidate.getTime()) / 60000);
  } catch {
    return null;
  }
  return new Date(candidate.getTime() - offsetMin * 60000).toISOString();
}

// Resolve a mailbox UPN/email to its Azure AD object ID. The /onlineMeetings
// endpoint with application permission requires the user's GUID (not UPN);
// the regular /users/{upn} lookup endpoint accepts either and returns id.
async function lookupUserId(token, mailbox) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}?$select=id`;
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`lookupUserId(${mailbox}) failed (${r.status}): ${text.slice(0, 400)}`);
  }
  const data = await r.json();
  if (!data.id) throw new Error(`lookupUserId(${mailbox}): no id in response`);
  return data.id;
}

// Pre-create a Teams online meeting on a licensed user's mailbox so we can
// embed the join URL into a calendar event hosted on a different (shared)
// mailbox. Returns { joinUrl } or null on failure (booking still proceeds
// without the link rather than failing the whole flow).
async function createOnlineMeeting(token, hostMailbox, m) {
  // /onlineMeetings in app-only flow requires the host's Object ID, not UPN.
  // Resolve once per call; cheap and keeps the surface tiny.
  const hostId = await lookupUserId(token, hostMailbox);
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(hostId)}/onlineMeetings`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDateTime: m.startUTCIso,
      endDateTime: m.endUTCIso,
      subject: m.subject,
    }),
  });
  if (r.status !== 201 && r.status !== 200) {
    const text = await r.text().catch(() => '');
    throw new Error(`createOnlineMeeting failed (${r.status}): ${text.slice(0, 400)}`);
  }
  const data = await r.json();
  return {
    joinUrl: data.joinWebUrl || data.joinUrl || null,
    id: data.id || null,
  };
}

async function createEvent(token, organizerMailbox, ev) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(organizerMailbox)}/events`;
  const teamsBlock = ev.joinUrl ? `
    <p style="margin:12px 0 6px;font-family:Arial,sans-serif;">
      <strong>Microsoft Teams meeting</strong>
    </p>
    <p style="margin:0 0 12px;font-family:Arial,sans-serif;">
      <a href="${ev.joinUrl}">Join the meeting</a>
    </p>
  ` : '';
  const eventBody = {
    subject: ev.subject,
    body: { contentType: 'HTML', content: (ev.bodyHtml || '') + teamsBlock },
    start: { dateTime: ev.startLocal, timeZone: ev.timeZone },
    end:   { dateTime: ev.endLocal,   timeZone: ev.timeZone },
    attendees: (ev.attendees || []).map((a) => {
      const emailAddress = { address: a.email };
      if (a.name) emailAddress.name = a.name;
      return { emailAddress, type: a.type || 'required' };
    }),
    allowNewTimeProposals: true,
    reminderMinutesBeforeStart: 15,
  };
  if (ev.joinUrl) {
    eventBody.location = { displayName: 'Microsoft Teams Meeting', locationUri: ev.joinUrl };
  }
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventBody),
  });
  if (r.status !== 201) {
    const text = await r.text().catch(() => '');
    throw new Error(`createEvent failed (${r.status}): ${text.slice(0, 400)}`);
  }
  return r.json();
}

function parseTimeTo24h(t) {
  const m = /^(\d{1,2}):(\d{2})(am|pm)$/i.exec(String(t || '').trim());
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3].toLowerCase();
  if (mer === 'pm' && h !== 12) h += 12;
  if (mer === 'am' && h === 12) h = 0;
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return { h, min };
}

function pad2(n) { return String(n).padStart(2, '0'); }

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]); }

function joinLinkButton(joinUrl, accent = '#5B5BD6') {
  if (!joinUrl) return '';
  return `
    <p style="margin:18px 0 6px;">
      <a href="${esc(joinUrl)}"
         style="display:inline-block;background:${accent};color:#fff;text-decoration:none;
                padding:11px 18px;border-radius:8px;font-family:Arial,sans-serif;
                font-size:14px;font-weight:600;">
        Join Microsoft Teams meeting
      </a>
    </p>
    <p style="margin:6px 0 0;font-family:Arial,sans-serif;color:#5A6577;font-size:12px;
              word-break:break-all;">
      Or paste this link: <a href="${esc(joinUrl)}" style="color:#5B5BD6;">${esc(joinUrl)}</a>
    </p>
  `;
}

function internalEmail({ fullName, email, specialistName, specialistTitle, dateLabel, time, joinUrl, webLink, userTimeLine }) {
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.5;">
      <h2 style="margin:0 0 8px;font-size:18px;">New 30-minute call booked</h2>
      <p style="margin:0 0 16px;color:#5A6577;font-size:13px;">Auto-generated from the deltcapital.com booking flow. The event is already on your calendar.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">With</td><td style="padding:6px 0;">${esc(specialistName)} · ${esc(specialistTitle)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Day</td><td style="padding:6px 0;">${esc(dateLabel)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Time</td><td style="padding:6px 0;">${esc(time)} ET · 30 min</td></tr>
        ${userTimeLine ? `<tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Booker time</td><td style="padding:6px 0;">${esc(userTimeLine)}</td></tr>` : ''}
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Booker</td><td style="padding:6px 0;">${esc(fullName)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        ${joinUrl ? `<tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Teams</td><td style="padding:6px 0;"><a href="${esc(joinUrl)}">Join meeting</a></td></tr>` : ''}
        ${webLink ? `<tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Calendar</td><td style="padding:6px 0;"><a href="${esc(webLink)}">Open in Outlook</a></td></tr>` : ''}
      </table>
    </div>
  `;
}

function bookerEmail({ firstName, specialistName, specialistTitle, dateLabel, time, joinUrl, userTimeLine }) {
  const linkBlock = joinUrl
    ? joinLinkButton(joinUrl)
    : `<p style="margin:0 0 12px;">A Microsoft Teams link will arrive ahead of the call. If you need to reschedule or cancel, just reply to this email.</p>`;
  const localLine = userTimeLine
    ? `<p style="margin:0 0 12px;color:#5A6577;font-size:13.5px;">In your timezone: <strong>${esc(userTimeLine)}</strong>.</p>`
    : '';
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.55;">
      <h2 style="margin:0 0 12px;font-size:20px;">Your call is booked.</h2>
      <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
      <p style="margin:0 0 12px;">
        You're confirmed for a 30-minute call with <strong>${esc(specialistName)}</strong>
        (${esc(specialistTitle)}) on <strong>${esc(dateLabel)}</strong> at
        <strong>${esc(time)} ET</strong>.
      </p>
      ${localLine}
      ${linkBlock}
      <p style="margin:18px 0 0;">You'll also get a calendar invite alongside this email — accept it to put this on your calendar. To reschedule or cancel, just reply to this email.</p>
      <p style="margin:24px 0 0;color:#5A6577;font-size:13px;">— Delt Capital</p>
      <p style="margin:18px 0 0;color:#9aa3ad;font-size:11.5px;line-height:1.5;border-top:1px solid #e7e3da;padding-top:12px;">
        You're receiving this because you requested a 30-minute consultation
        at deltcapital.com. Reply to this email to reschedule or cancel.
      </p>
    </div>
  `;
}

function buildUserTimeLine(dateISO, h24, m, userTimeZone) {
  if (!userTimeZone || userTimeZone === 'America/New_York') return null;
  const utcIso = etWallToUTCIso(dateISO, h24, m);
  if (!utcIso) return null;
  const utc = new Date(utcIso);
  let timeStr, dateStr, tzShort;
  try {
    timeStr = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimeZone, hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(utc).toLowerCase().replace(/\s/g, '');
    dateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimeZone, weekday: 'short', month: 'short', day: 'numeric',
    }).format(utc);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimeZone, timeZoneName: 'short',
    }).formatToParts(utc);
    const tzn = parts.find((p) => p.type === 'timeZoneName');
    tzShort = tzn ? tzn.value : userTimeZone;
  } catch {
    return null;
  }
  return `${dateStr}, ${timeStr} ${tzShort}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      firstName, lastName, email,
      specialistName, specialistTitle,
      dateLabel, dateISO, time, userTimeZone,
    } = body;

    if (!firstName || !lastName || !email || !specialistName || !dateLabel || !time) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }
    if (!dateISO || !/^\d{4}-\d{2}-\d{2}$/.test(String(dateISO))) {
      res.status(400).json({ error: 'Invalid date' });
      return;
    }
    const parsed = parseTimeTo24h(time);
    if (!parsed) {
      res.status(400).json({ error: 'Invalid time' });
      return;
    }

    const fromMailbox = process.env.OUTLOOK_FROM_EMAIL;
    if (!fromMailbox) {
      console.error('OUTLOOK_FROM_EMAIL is not set');
      res.status(500).json({ error: 'Server is not configured' });
      return;
    }

    const token = await getAccessToken();

    const fullName = `${firstName} ${lastName}`.trim();
    const startLocal = `${dateISO}T${pad2(parsed.h)}:${pad2(parsed.min)}:00`;
    const endTotal = parsed.h * 60 + parsed.min + 30;
    const eh = Math.floor(endTotal / 60) % 24;
    const em = endTotal % 60;
    const endLocal = `${dateISO}T${pad2(eh)}:${pad2(em)}:00`;
    const subject = `Delt Capital — 30-min call: ${specialistName} & ${fullName}`;

    // 1. Pre-create a Teams online meeting on David's licensed mailbox.
    //    The shared mailbox we're about to host the calendar event on
    //    typically has no Teams license, so we can't ask Graph to auto-create
    //    the meeting via isOnlineMeeting on the event itself. We embed the
    //    pre-created joinUrl into the event body and location instead.
    let joinUrl = null;
    try {
      const startUTCIso = etWallToUTCIso(dateISO, parsed.h, parsed.min);
      const endUTCIso   = etWallToUTCIso(dateISO, eh, em);
      if (startUTCIso && endUTCIso) {
        const m = await createOnlineMeeting(token, TEAMS_HOST, {
          startUTCIso, endUTCIso, subject,
        });
        joinUrl = m && m.joinUrl;
      }
    } catch (err) {
      // Don't fail the booking on a Teams hiccup — the calendar invite is
      // the primary artifact; we'll just ship without an embedded link.
      console.error('createOnlineMeeting failed:', err && err.stack ? err.stack : err);
    }

    // 2. Create the calendar event on the noreply (or configured) mailbox.
    //    Add David and the customer as required attendees so Outlook auto-
    //    sends both an .ics meeting invite. If this fails, the whole booking
    //    fails — David needs to know about the meeting on his calendar.
    let eventInfo = null;
    try {
      const ev = await createEvent(token, CALENDAR_USER, {
        subject,
        bodyHtml: `
          <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.55;">
            <p>30-minute call between <strong>${esc(fullName)}</strong>
            (${esc(email)}) and <strong>${esc(specialistName)}</strong> · ${esc(specialistTitle)}.</p>
            <p>Booked via deltcapital.com on ${esc(dateLabel)} at ${esc(time)} ET.</p>
          </div>
        `,
        startLocal,
        endLocal,
        timeZone: EVENT_TIMEZONE,
        attendees: [
          // David — name omitted so Outlook resolves the directory display name.
          { email: NOTIFY_TO,                       type: 'required' },
          { email,            name: fullName,        type: 'required' },
        ],
        joinUrl,
      });
      eventInfo = {
        id: ev && ev.id,
        webLink: ev && ev.webLink,
        joinUrl,
      };
    } catch (err) {
      console.error('createEvent failed:', err && err.stack ? err.stack : err);
      res.status(500).json({
        error: "We couldn't put this on the calendar. Please email support@deltpay.com directly and we'll get you booked.",
      });
      return;
    }

    const userTimeLine = buildUserTimeLine(dateISO, parsed.h, parsed.min, userTimeZone);

    const ctx = {
      fullName, firstName, email, specialistName, specialistTitle, dateLabel, time,
      joinUrl: eventInfo && eventInfo.joinUrl,
      webLink: eventInfo && eventInfo.webLink,
      userTimeLine,
    };

    const internalSubject = `New booking: ${fullName} → ${specialistName} on ${dateLabel} ${time}`;
    const bookerSubject   = `You're booked with ${specialistName} — ${dateLabel} at ${time} ET`;

    // 3. Emails are best-effort: the booker has already received an Outlook
    //    invite (because they're an attendee on the event), so even if our
    //    branded HTML email fails they have what they need. Log and continue.
    //
    //    Sending strategy: route through David's licensed mailbox (NOTIFY_TO)
    //    and use his Send-As permission on the noreply shared mailbox to
    //    display OUTLOOK_FROM_EMAIL as the visible From address. Sending
    //    directly via the shared mailbox URL fails in many tenant configs
    //    because shared mailboxes lack their own send capability, even with
    //    Mail.Send app permission granted.
    try {
      await sendMail(token, NOTIFY_TO, NOTIFY_TO, internalSubject, internalEmail(ctx), {
        from: fromMailbox,
        fromName: 'Delt Capital',
        replyTo: [NOTIFY_TO],
      });
    } catch (err) {
      console.error('internal sendMail failed:', err && err.stack ? err.stack : err);
    }
    try {
      await sendMail(token, NOTIFY_TO, email, bookerSubject, bookerEmail(ctx), {
        from: fromMailbox,
        fromName: 'Delt Capital',
        replyTo: [NOTIFY_TO],
        bcc: [NOTIFY_TO],
      });
    } catch (err) {
      console.error('booker sendMail failed:', err && err.stack ? err.stack : err);
    }

    res.status(200).json({
      ok: true,
      eventId: eventInfo.id,
      joinUrl: eventInfo.joinUrl || null,
      webLink: eventInfo.webLink || null,
    });
  } catch (err) {
    console.error('book api error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Booking failed. Please try again or email us directly.' });
  }
};
