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
//   OUTLOOK_FROM_EMAIL    — Mailbox the event/email is sent from (David's)
//
// Required application permissions on the app registration (admin consent):
//   Mail.Send
//   Calendars.ReadWrite
//   OnlineMeetings.ReadWrite.All
//
// Optional:
//   BOOKING_NOTIFY_EMAIL  — overrides the default david@deltpay.com recipient
//   BOOKING_TIMEZONE      — Windows timezone name; defaults to "Eastern Standard Time"

const NOTIFY_TO = process.env.BOOKING_NOTIFY_EMAIL || 'david@deltpay.com';
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

async function sendMail(token, fromMailbox, to, subject, html) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(fromMailbox)}/sendMail`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: 'HTML', content: html },
        toRecipients: [{ emailAddress: { address: to } }],
      },
      saveToSentItems: true,
    }),
  });
  if (r.status !== 202) {
    const text = await r.text().catch(() => '');
    throw new Error(`sendMail to ${to} failed (${r.status}): ${text.slice(0, 400)}`);
  }
}

async function createEvent(token, organizerMailbox, ev) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(organizerMailbox)}/events`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: ev.subject,
      body: { contentType: 'HTML', content: ev.bodyHtml },
      start: { dateTime: ev.startLocal, timeZone: ev.timeZone },
      end:   { dateTime: ev.endLocal,   timeZone: ev.timeZone },
      attendees: [
        { emailAddress: { address: ev.attendeeEmail, name: ev.attendeeName }, type: 'required' },
      ],
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
      allowNewTimeProposals: true,
      reminderMinutesBeforeStart: 15,
    }),
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

function internalEmail({ fullName, email, specialistName, specialistTitle, dateLabel, time, joinUrl, webLink }) {
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.5;">
      <h2 style="margin:0 0 8px;font-size:18px;">New 30-minute call booked</h2>
      <p style="margin:0 0 16px;color:#5A6577;font-size:13px;">Auto-generated from the deltcapital.com booking flow. The event is already on your calendar.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">With</td><td style="padding:6px 0;">${esc(specialistName)} · ${esc(specialistTitle)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Day</td><td style="padding:6px 0;">${esc(dateLabel)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Time</td><td style="padding:6px 0;">${esc(time)} ET · 30 min</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Booker</td><td style="padding:6px 0;">${esc(fullName)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        ${joinUrl ? `<tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Teams</td><td style="padding:6px 0;"><a href="${esc(joinUrl)}">Join meeting</a></td></tr>` : ''}
        ${webLink ? `<tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Calendar</td><td style="padding:6px 0;"><a href="${esc(webLink)}">Open in Outlook</a></td></tr>` : ''}
      </table>
    </div>
  `;
}

function bookerEmail({ firstName, specialistName, specialistTitle, dateLabel, time, joinUrl }) {
  const linkBlock = joinUrl
    ? joinLinkButton(joinUrl)
    : `<p style="margin:0 0 12px;">A Microsoft Teams link will arrive ahead of the call. If you need to reschedule or cancel, just reply to this email.</p>`;
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.55;">
      <h2 style="margin:0 0 12px;font-size:20px;">Your call is booked.</h2>
      <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
      <p style="margin:0 0 12px;">
        You're confirmed for a 30-minute call with <strong>${esc(specialistName)}</strong>
        (${esc(specialistTitle)}) on <strong>${esc(dateLabel)}</strong> at
        <strong>${esc(time)} ET</strong>.
      </p>
      ${linkBlock}
      <p style="margin:18px 0 0;">You'll also get a calendar invite from David's mailbox — accept it to put this on your calendar. To reschedule or cancel, just reply to this email.</p>
      <p style="margin:24px 0 0;color:#5A6577;font-size:13px;">— Delt Capital</p>
    </div>
  `;
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
      dateLabel, dateISO, time,
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

    // 1. Create the calendar event first. If this fails, the whole booking
    //    fails — David needs to know about the meeting on his calendar, and
    //    falsely confirming a booking we couldn't schedule is worse than an
    //    explicit error.
    let eventInfo = null;
    try {
      const ev = await createEvent(token, fromMailbox, {
        subject: `Delt Capital — 30-min call with ${fullName}`,
        bodyHtml: `
          <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.55;">
            <p>30-minute intro call with <strong>${esc(fullName)}</strong>
            (${esc(email)}) booked via deltcapital.com.</p>
            <p>With: ${esc(specialistName)} · ${esc(specialistTitle)}<br/>
            When: ${esc(dateLabel)} at ${esc(time)} ET</p>
          </div>
        `,
        startLocal,
        endLocal,
        timeZone: EVENT_TIMEZONE,
        attendeeEmail: email,
        attendeeName: fullName,
      });
      eventInfo = {
        id: ev && ev.id,
        webLink: ev && ev.webLink,
        joinUrl: ev && ev.onlineMeeting && ev.onlineMeeting.joinUrl,
      };
    } catch (err) {
      console.error('createEvent failed:', err && err.stack ? err.stack : err);
      res.status(500).json({
        error: "We couldn't put this on the calendar. Please email david@deltpay.com directly and we'll get you booked.",
      });
      return;
    }

    const ctx = {
      fullName, firstName, email, specialistName, specialistTitle, dateLabel, time,
      joinUrl: eventInfo && eventInfo.joinUrl,
      webLink: eventInfo && eventInfo.webLink,
    };

    const internalSubject = `New booking: ${fullName} → ${specialistName} on ${dateLabel} ${time}`;
    const bookerSubject   = `You're booked with ${specialistName} — ${dateLabel} at ${time} ET`;

    // 2. Emails are best-effort: the booker has already received an Outlook
    //    invite (because they're an attendee on the event), so even if our
    //    branded email fails they have what they need. Log and continue.
    try {
      await sendMail(token, fromMailbox, NOTIFY_TO, internalSubject, internalEmail(ctx));
    } catch (err) {
      console.error('internal sendMail failed:', err && err.stack ? err.stack : err);
    }
    try {
      await sendMail(token, fromMailbox, email, bookerSubject, bookerEmail(ctx));
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
