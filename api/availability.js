// Vercel serverless function — booking availability lookup.
//
// GET /api/availability?dateISO=YYYY-MM-DD
//   → { busy: ["8:30am", "11:00am", ...] }
//
// Returns the list of 30-minute slots in David's working window
// (8:00am–6:00pm ET) that are NOT free on the given date, derived from
// his Outlook calendar via Microsoft Graph getSchedule. The frontend uses
// this to dim already-booked or otherwise-unavailable slots.
//
// Reuses the same env vars as api/book.js — see that file for setup.

const NOTIFY_TO = process.env.BOOKING_NOTIFY_EMAIL || 'info@deltpay.com';
// Availability is always evaluated against the specialist's mailbox (David),
// not the mailbox that hosts the calendar event. They diverge once events are
// hosted on a shared mailbox like noreply.
const BUSY_USER = process.env.OUTLOOK_AVAILABILITY_USER || NOTIFY_TO;
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

function slotLabelForIndex(i) {
  // i is the 30-min interval index from 8:00am ET, 0..19
  const totalMin = 8 * 60 + i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const hr12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  const ampm = h >= 12 ? 'pm' : 'am';
  return `${hr12}:${String(m).padStart(2, '0')}${ampm}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const dateISO = req.query && req.query.dateISO;
  if (!dateISO || !/^\d{4}-\d{2}-\d{2}$/.test(String(dateISO))) {
    res.status(400).json({ error: 'Invalid dateISO' });
    return;
  }

  try {
    const token = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(BUSY_USER)}/calendar/getSchedule`;
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schedules: [BUSY_USER],
        startTime: { dateTime: `${dateISO}T08:00:00`, timeZone: EVENT_TIMEZONE },
        endTime:   { dateTime: `${dateISO}T18:00:00`, timeZone: EVENT_TIMEZONE },
        availabilityViewInterval: 30,
      }),
    });
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      throw new Error(`getSchedule failed (${r.status}): ${text.slice(0, 400)}`);
    }
    const data = await r.json();
    const view = (data.value && data.value[0] && data.value[0].availabilityView) || '';
    // availabilityView codes: 0 free, 1 tentative, 2 busy, 3 OOF, 4 working-elsewhere.
    // Anything other than '0' means we should not let someone else book that slot.
    const busy = [];
    for (let i = 0; i < view.length && i < 20; i++) {
      if (view[i] !== '0') busy.push(slotLabelForIndex(i));
    }
    // Lightweight cache so a flurry of clicks doesn't hammer Graph.
    res.setHeader('Cache-Control', 'private, max-age=30');
    res.status(200).json({ busy });
  } catch (err) {
    console.error('availability error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Could not load availability' });
  }
};
