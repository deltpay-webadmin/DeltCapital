// Vercel cron — T+45min reactivation nudge for leads that bounced.
//
// Selection criteria (see api/_store.findStaleLeads):
//   created_at between 45min and 24hr ago
//   nudged_at IS NULL          (one nudge per lead, ever)
//   completed_at IS NULL       (submitted leads are off-limits)
//
// What we send:
//   • A short follow-up email to the lead with the same deep link the
//     original confirmation carried. Re-uses Microsoft Graph send-as.
//   • An internal heads-up to LEADS_NOTIFY_EMAIL with a "click to text"
//     mailto link generated from the same deep link — David can fire
//     the SMS manually from Google Voice in <5 seconds.
//
// Quiet hours:
//   We do not nudge between 9pm and 8am Eastern (the operator's tz),
//   and we skip weekends entirely. The cron schedule itself (every
//   15min) keeps running so caught-up leads get caught up as soon as
//   the window re-opens.
//
// Cron schedule lives in vercel.json:
//   { "path": "/api/sms-nudge", "schedule": "*/15 * * * *" }
//
// Auth: Vercel sets the request header `x-vercel-cron: 1` for cron
// invocations. We accept any request without that header only when a
// shared secret matches \u2014 lets the operator trigger it manually for
// testing without exposing a public endpoint.

const store = require('./_store');
const { getAccessToken, sendMail } = require('./_email');
const { buildApplyUrlFromRow, buildShortUrl, withUtm, SITE_ORIGIN } = require('./_deeplink');
const { renderEmail, esc: layoutEsc, ctaButton, COMPANY } = require('./_email-layout');
const { firstNameOf } = require('./_name');
const outreach = require('./_outreach');

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'david@deltpay.com';

const FROM_MAILBOX = process.env.OUTLOOK_FROM_EMAIL;

// Operator's number for the click-to-text mailto link. Google Voice
// inbound texting accepts mailto:<10digits>@txt.voice.google.com but
// that's flaky; we instead generate an https://voice.google.com/u/0/messages
// link which opens the GV web UI pre-filtered to the lead's number.
// Operator clicks → number is pre-typed → paste body → send.
function googleVoiceLink({ phone, body }) {
  const digits = String(phone || '').replace(/\D+/g, '');
  // The query string isn't officially supported but the GV web UI does
  // honor a phone fragment in the URL via its own router. The body has
  // to be pasted manually \u2014 we include it next to the link in the email
  // so the operator can hit copy then paste.
  return `https://voice.google.com/u/0/messages?itemId=t.%2B1${digits}`;
}

// SMS body. We use the branded short link (/r/<8-char>) rather than the
// raw /apply?d=<base64> payload so the message stays well under 160
// chars AND looks like a real link a human would send. The short link
// 302s through api/r.js back to the same payloaded /apply URL.
//
// Two things this used to get wrong:
//   \u2022 It greeted with the raw column, so a lead whose first_name held
//     "Null Null" got "Null Null, this is David...".
//   \u2022 It told everyone they'd "started the funding calculator", which is
//     false for apply_form leads \u2014 they filled in the Business step of the
//     application and never touched the calculator.
//
// Budget: keep the whole body under 160 chars so it stays a single SMS
// segment. The short link is ~34 chars, which leaves ~125 for the copy.
function smsTemplate({ firstName, shortUrl, stage, source }) {
  const name = firstNameOf(firstName) || 'Hey';
  const lead = `${name}, this is David at Delt Capital.`;

  // Past the first milestone, drop the "saw you started..." recap and lead
  // with the one thing that's left. It's the more useful sentence and it's
  // what keeps the whole body inside a single 160-char segment.
  if (stage === 'bank_linked') {
    return `${lead} Your bank's linked \u2014 just a 60-sec ID check left: ${shortUrl}`;
  }
  if (stage === 'idv_done' || stage === 'offer_presented') {
    return `${lead} You're verified \u2014 your offer's ready to review: ${shortUrl}`;
  }

  const saw = source === 'apply_form'
    ? 'Saw you started your application earlier'
    : (source === 'calculator-gate'
      ? 'Saw you ran the funding calculator earlier'
      : 'Saw you started with us earlier');
  return `${lead} ${saw} \u2014 here's your offer link, takes 2 min: ${shortUrl}`;
}

// HTML-escape — shared with _email-layout so we don't drift between modules.
const esc = layoutEsc;
function fmtMoney(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return '$0';
  return '$' + Math.round(v).toLocaleString();
}

// Whole-thousands helper for subject lines / button copy ("$54K").
// Returns null (not '$0') when there's no usable number so callers can
// fall back to generic copy instead of quoting a bogus amount.
function fmtK(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v < 1000) return '$' + Math.round(v).toLocaleString();
  return '$' + Math.round(v / 1000) + 'K';
}

// ── Subject line A/B/C rotation ─────────────────────────────────────
// Variant is picked deterministically from the lead id (not randomly)
// so a retried send never flips copy on the same lead, and the split
// stays roughly even. The chosen letter also rides the CTA link as
// utm_content so clicks can be attributed per subject.
function subjectVariant(leadId) {
  const s = String(leadId || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  return 'abc'[h % 3];
}

// The subject is now derived from the same stageCopy() block as the body,
// so the two can't drift into telling the lead different stories. Variant
// selection itself is unchanged — still deterministic from the lead id.
function nudgeSubject({ variant, stage, name, source, estimate, institution, deadline }) {
  const copy = stageCopy({ stage, name, source, estimate, institution, deadline });
  return copy.subjects[variant] || copy.subjects.a;
}

// The urgency line quotes a real date ("holds through Sunday, July 26")
// instead of a vague "this weekend". Nudges never fire on weekends
// (quiet hours skips Sat/Sun), so the upcoming Sunday is always a few
// days out from any real send. Computed in Eastern, same as quiet hours.
function upcomingSundayLabel(now = new Date()) {
  const wd = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', weekday: 'short',
  }).format(now);
  const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd);
  const days = idx === -1 ? 7 : (((7 - idx) % 7) || 7);
  const sunday = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const monthDay = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', month: 'long', day: 'numeric',
  }).format(sunday);
  return `Sunday, ${monthDay}`;
}

// Only echo the bank name back at the lead when it looks like a real
// institution name. Same defensive spirit as isPlausibleBusinessName in
// api/leads.js \u2014 the meta comes off a client-fired beacon, so it is not
// trusted input.
function plausibleInstitution(s) {
  const t = String(s || '').trim();
  if (!t) return null;
  return /^[A-Za-z0-9][\w .&'-]{1,40}$/.test(t) ? t : null;
}

// \u2500\u2500 Stage-aware copy \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
//
// The old email said exactly one thing to everybody: "You ran the funding
// calculator earlier today... pick up right where you left off." Two
// problems with that.
//
// First, it isn't always true. Leads created by api/apply-lead.js
// (source 'apply_form') never touched the calculator \u2014 they filled in the
// Business step of the application. Telling them otherwise reads as a
// mail-merge that doesn't know who they are.
//
// Second, it's stage-blind. apply_progress already records exactly how far
// each lead got, so we know the difference between somebody who never
// opened the modal and somebody whose bank is linked and only needs a
// 60-second ID check. Those two people need completely different asks. A
// nudge that names the one thing left is a nudge that closes; a nudge that
// says "finish your application" is a nudge that gets archived.
//
// Everything the body and the subject lines need comes out of here
// together, so the two can't contradict each other about which step the
// lead is on.
//
// Pure function \u2014 no I/O, no dates fetched internally \u2014 so it can be
// rendered offline via the __test export at the bottom of this file.
function stageCopy({ stage, name, source, estimate, institution, deadline }) {
  const e = estimate || {};
  const hasRange = !!(e.low && e.high);
  const high  = hasRange ? fmtMoney(e.high) : null;
  const lowK  = hasRange ? fmtK(e.low) : null;
  const highK = hasRange ? fmtK(e.high) : null;
  const bank  = plausibleInstitution(institution);
  const by    = deadline || upcomingSundayLabel();

  // How they got here. Only used for the 'new' stage: once a lead has hit
  // a milestone, whereYouLeftOff below is both more specific and more
  // accurate, and running both would say the same thing twice \u2014 or worse,
  // contradict itself ("stopped after the business details" is simply
  // false for someone whose bank is already linked).
  //
  // The neutral third branch covers rows whose `source` predates the
  // current writers or arrived via the CRM mirror: better vague than wrong.
  const provenance = source === 'apply_form'
    ? 'You started your application earlier today and stopped after the business details. Nothing needs re-entering \u2014 I held your spot.'
    : (source === 'calculator-gate'
      ? 'You ran the funding calculator earlier today. I held your pre-qualification open so you can pick up right where you left off.'
      : 'You started with us earlier today. I held your pre-qualification open so you can pick up right where you left off.');

  // Name-and-amount aware headline builder, so each stage below only has
  // to supply its own predicate.
  const head = (withName, without) => (name ? withName : without);

  // Stages past 'new' narrate themselves via whereYouLeftOff, so they
  // suppress the provenance line entirely (see the comment above it).
  const common = { lowK, highK, hasRange, provenance: null };

  if (stage === 'opened') {
    return {
      ...common,
      eyebrow: 'One step left \u2014 bank connection',
      headline: head(
        high ? `${name} \u2014 you're one step from your ${high}.` : `${name} \u2014 you're one step away.`,
        high ? `You're one step from your ${high}.` : "You're one step away."
      ),
      whereYouLeftOff: 'You opened your application earlier today but stopped before connecting your bank. Nothing needs re-entering \u2014 and that connection is what prices the offer, so it\'s the only thing standing between you and a real number.',
      ctaLabel: 'Connect my bank',
      timeNote: 'Takes about 90 seconds. Resumes exactly where you stopped.',
      // The generic "~2 minutes to finish" bullet would contradict the
      // 90-second estimate above it. Only the 'new' stage, which has no
      // per-step estimate of its own, keeps it.
      showTimeBullet: false,
      urgency: `Offers are priced against live bank data, so ${hasRange ? 'this range' : 'this offer'} holds through <strong style="color:#0A1133;">${esc(by)}</strong>. After that we'll re-verify and the numbers may shift.`,
      preheader: 'One step left \u2014 connect your bank, about 90 seconds.',
      subjects: {
        a: name ? `${name} \u2014 one step left on your application` : 'One step left on your application',
        b: `Your Delt Capital offer holds through ${by}`,
        c: 'David @ Delt: your bank connection is the last step',
      },
    };
  }

  if (stage === 'bank_linked') {
    return {
      ...common,
      eyebrow: 'Bank linked \u2014 ID check left',
      headline: head(
        `${name} \u2014 your bank is linked. One ID check to go.`,
        'Your bank is linked. One ID check to go.'
      ),
      whereYouLeftOff: `You connected ${bank ? esc(bank) : 'your bank'} earlier today, which is the slow part and it's done. The only thing left before your offer is a photo ID check.`,
      ctaLabel: 'Finish my ID check',
      timeNote: 'About 60 seconds, on your phone.',
      showTimeBullet: false,
      urgency: `Your offer is priced against the bank data you just connected, so it's locked through <strong style="color:#0A1133;">${esc(by)}</strong>. Finish the ID check and it's yours to review.`,
      preheader: 'Bank linked \u2014 one 60-second ID check left.',
      subjects: {
        a: name ? `${name} \u2014 one 60-second ID check left` : 'One 60-second ID check left',
        b: `Your bank is linked \u2014 offer locked through ${by}`,
        c: 'David @ Delt: just the ID check left',
      },
    };
  }

  if (stage === 'idv_done' || stage === 'offer_presented') {
    return {
      ...common,
      eyebrow: 'Last step \u2014 review & accept',
      headline: head(
        high ? `${name} \u2014 everything checks out. Your ${high} is waiting.` : `${name} \u2014 everything checks out. Your offer is waiting.`,
        high ? `Everything checks out. Your ${high} is waiting.` : 'Everything checks out. Your offer is waiting.'
      ),
      whereYouLeftOff: 'Bank connected, ID verified \u2014 you\'re through everything that takes real time. All that\'s left is reading your terms and signing.',
      ctaLabel: 'Review and accept my offer',
      timeNote: 'Under a minute. Nothing to re-enter.',
      showTimeBullet: false,
      urgency: `Your offer is priced against the bank data you connected, so it's locked through <strong style="color:#0A1133;">${esc(by)}</strong>. After that we re-verify and the numbers may shift.`,
      preheader: 'Verified \u2014 your offer is ready to review and sign.',
      subjects: {
        a: name ? `${name} \u2014 your offer is ready to sign` : 'Your offer is ready to sign',
        b: `You're verified \u2014 offer locked through ${by}`,
        c: 'David @ Delt: your offer is ready, just needs a signature',
      },
    };
  }

  // stage === 'new' \u2014 we have contact details but no milestone at all, so
  // provenance is the only thing we can honestly say about where they are.
  return {
    ...common,
    provenance,
    eyebrow: 'Your offer is still open',
    headline: head(
      high ? `${name} \u2014 your ${high} is ready to claim.` : `${name} \u2014 your offer is ready to claim.`,
      high ? `Your ${high} is ready to claim.` : 'Your offer is ready to claim.'
    ),
    whereYouLeftOff: null,
    ctaLabel: (lowK && highK) ? `Claim my ${lowK}\u2013${highK} offer` : 'Claim my offer',
    timeNote: 'Resumes your application \u2014 about 2 minutes.',
    showTimeBullet: true,
    urgency: `Offers are priced against live bank data, so ${hasRange ? 'this range' : 'this offer'} holds through <strong style="color:#0A1133;">${esc(by)}</strong>. After that we'll re-verify and the numbers may shift.`,
    preheader: 'Pick up where you left off \u2014 about 2 minutes.',
    subjects: {
      a: name
        ? `${name} \u2014 ${high ? `your ${high} offer` : 'your funding offer'} is holding (2 min to claim)`
        : `Your ${highK ? `${highK} ` : ''}offer is holding (2 min to claim)`,
      b: `Your Delt Capital offer expires ${by}`,
      c: (lowK && highK)
        ? `David @ Delt: your ${lowK}\u2013${highK} is still open`
        : 'David @ Delt: your funding offer is still open',
    },
  };
}

// Format a real offer expiry the same way upcomingSundayLabel() formats
// its invented one, so the copy around it reads identically either way.
function offerDeadlineLabel(expiresAt) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric',
    }).format(new Date(expiresAt));
  } catch (_) {
    return null;
  }
}

function nudgeEmailBody({ stage, name, source, estimate, institution, deadline, ctaUrl, pasteUrl }) {
  const copy = stageCopy({ stage, name, source, estimate, institution, deadline });

  const bullet = (lead, rest) => `
      <p style="margin:0 0 10px;font-size:14.5px;line-height:1.55;color:#0F0E17;">
        <span style="color:#5B5BD6;font-weight:700;">&bull;</span>&nbsp;
        <strong style="color:#0A1133;">${lead}</strong>${rest}
      </p>`;

  // ctaButton owns the caption and the paste-me link, so they can never be
  // orphaned from the button the way "Resumes your application." was.
  const cta = ctaButton({
    url: ctaUrl,
    label: copy.ctaLabel,
    bg: '#5B5BD6',
    gradient: 'linear-gradient(135deg,#5B5BD6 0%,#6366F1 50%,#5B5BD6 100%)',
    caption: copy.timeNote,
    pasteUrl,
  });

  return `
      <p style="margin:0 0 6px;font-size:13px;color:#6B6877;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;">${esc(copy.eyebrow)}</p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:#0A1133;letter-spacing:-0.01em;">
        ${esc(copy.headline)}
      </h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        ${name ? `Hey ${esc(name)},` : 'Hey there,'}
      </p>
      ${copy.provenance ? `<p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#0F0E17;">
        ${esc(copy.provenance)}
      </p>` : ''}
      ${copy.whereYouLeftOff ? `<p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#0F0E17;">
        ${copy.whereYouLeftOff}
      </p>` : ''}
      ${cta}
      <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#0A1133;">
        ${copy.showTimeBullet ? 'Three things worth knowing before you click:' : 'Two things worth knowing before you click:'}
      </p>
      ${copy.showTimeBullet ? bullet('~2 minutes to finish', ' \u2014 most of your info is already saved.') : ''}
      ${bullet('Soft check only', ' \u2014 your credit score stays untouched until you accept terms.')}
      ${bullet('Plaid verified.', ' Bank-grade encryption.')}
      <p style="font-size:15px;line-height:1.6;margin:18px 0 14px;color:#0F0E17;">
        ${copy.urgency}
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 22px;color:#0F0E17;">
        If something's holding you back \u2014 rate, term, payback, timing \u2014
        reply with your #1 question and I'll answer today. It comes straight
        to my inbox.
      </p>
      <p style="margin:22px 0 0;color:#0A1133;font-size:13.5px;line-height:1.55;">
        \u2014 David Hazday<br/>
        <span style="color:#6B6877;font-weight:500;">Director, Delt Capital</span>
      </p>
      <p style="margin:14px 0 0;font-size:13px;color:#6B6877;">
        Prefer to talk? Call or text
        <a href="tel:${esc(COMPANY.phoneTel)}" style="color:#5B5BD6;text-decoration:none;font-weight:600;">${esc(COMPANY.phone)}</a>.
      </p>
  `;
}

function nudgeEmail({
  leadId, stage, name, source, estimate, institution, deadline,
  applyUrl, pasteUrl, leadEmail, leadPhone, variant,
}) {
  // Tag the CTA so clicks are attributable in any analytics tool that
  // reads utm_* params; utm_content carries the subject-line variant.
  const ctaUrl = withUtm(applyUrl, {
    utm_source: 'email',
    utm_medium: 'lifecycle',
    utm_campaign: 'calc-nudge-45m',
    utm_content: variant ? `subj-${variant}` : null,
  });
  const copy = stageCopy({ stage, name, source, estimate, institution, deadline });
  return renderEmail({
    body: nudgeEmailBody({
      stage, name, source, estimate, institution, deadline, ctaUrl, pasteUrl,
    }),
    audience: 'lead',
    includeTrustStrip: true,
    recipientEmail: leadEmail,
    recipientPhone: leadPhone,
    // Don't tell an apply_form lead they used the calculator — the footer
    // has the same provenance trap the body copy does.
    footerReason: source === 'apply_form'
      ? `started a funding application on ${COMPANY.site}`
      : `used the funding calculator on ${COMPANY.site}`,
    preheader: copy.preheader,
    openPixelUrl: outreach.openPixelUrl({
      leadId,
      email: leadEmail,
      campaign: 'calc-nudge-45m',
      variant,
    }),
  });
}

// Operator-facing. Deliberately renders lead.first_name RAW \u2014 no
// firstNameOf() here. When a lead's name column holds "Null Null", David
// needs to see that so he can fix the row; sanitizing it would hide the
// data problem behind a clean-looking internal email. Same for the
// operator subject line below.
function internalNudgeBody({ lead, stage, applyUrl, shortUrl, smsBody, gvLink, variant, subject }) {
  return `
      <h2 style="margin:0 0 12px;font-size:18px;">T+45min nudge fired</h2>
      <p style="margin:6px 0;font-size:14px;"><b>Lead:</b> ${esc(lead.first_name || '')} \u2014 ${esc(lead.business_name || '')}</p>
      <p style="margin:6px 0;font-size:14px;"><b>Stage:</b> ${esc(stage || 'new')} (copy is tailored to this)</p>
      <p style="margin:6px 0;font-size:14px;"><b>Email:</b> ${esc(lead.email || '')}</p>
      <p style="margin:6px 0;font-size:14px;"><b>Phone:</b> ${esc(lead.phone || '')}</p>
      <p style="margin:6px 0;font-size:14px;"><b>Subject (variant ${esc(variant || '?')}):</b> ${esc(subject || '')}</p>
      <hr style="border:none;border-top:1px solid #EEE;margin:18px 0;" />
      <p style="margin:6px 0;font-size:14px;font-weight:600;">Send the SMS yourself from Google Voice:</p>
      <p style="margin:8px 0;">
        <a href="${esc(gvLink)}" style="color:#5B5BD6;font-weight:600;">Open Google Voice \u2192 ${esc(lead.phone || '')}</a>
      </p>
      <p style="margin:12px 0 6px;font-size:13px;color:#555;">Copy this body:</p>
      <div style="background:#F4F4F8;border-radius:8px;padding:14px;font-family:Menlo,monospace;font-size:13px;line-height:1.45;white-space:pre-wrap;">${esc(smsBody)}</div>
      <p style="margin:18px 0 0;font-size:12.5px;color:#6B6877;">Short link in SMS: <a href="${esc(shortUrl)}">${esc(shortUrl)}</a></p>
      <p style="margin:6px 0 0;font-size:12.5px;color:#6B6877;">Full deep link (302 target): <a href="${esc(applyUrl)}">${esc(applyUrl)}</a></p>
  `;
}

function internalNudgeNote(ctx) {
  return renderEmail({
    body: internalNudgeBody(ctx),
    audience: 'operator',
    includeTrustStrip: false,
  });
}

// Quiet hours: don't fire between 9pm and 8am Eastern, and skip
// weekends. We compute "now in Eastern" via Intl rather than relying on
// the serverless container's TZ (Vercel defaults to UTC).
function inQuietHours(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short', hour: 'numeric', hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === 'weekday')?.value || '';
  const hourStr = parts.find((p) => p.type === 'hour')?.value || '0';
  const hour = parseInt(hourStr, 10);
  if (weekday === 'Sat' || weekday === 'Sun') return true;
  if (hour < 8 || hour >= 21) return true;
  return false;
}

function isAuthorized(req) {
  // Vercel cron invocations carry x-vercel-cron. For manual testing we
  // also accept ?token=<CRON_SECRET> or an Authorization: Bearer header.
  if (req.headers['x-vercel-cron']) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization || '';
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(req.url || '/', 'http://x');
  if (url.searchParams.get('token') === secret) return true;
  return false;
}

module.exports = async function handler(req, res) {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  if (!store.ENABLED) {
    res.status(200).json({ ok: true, skipped: 'store_disabled' });
    return;
  }
  if (!FROM_MAILBOX) {
    res.status(200).json({ ok: true, skipped: 'outlook_not_configured' });
    return;
  }
  // Operators sometimes want to test outside quiet hours \u2014 a ?force=1
  // query param bypasses the check. Cron itself never passes this.
  const url = new URL(req.url || '/', 'http://x');
  const force = url.searchParams.get('force') === '1';
  if (!force && inQuietHours()) {
    res.status(200).json({ ok: true, skipped: 'quiet_hours' });
    return;
  }

  let stale;
  try {
    stale = await store.findStaleLeads({ minMinutes: 45, maxMinutes: 24 * 60 });
  } catch (err) {
    console.error('[sms-nudge] findStaleLeads failed:', err && err.message);
    res.status(500).json({ error: 'store_error', detail: String(err && err.message) });
    return;
  }
  if (!stale.length) {
    res.status(200).json({ ok: true, nudged: 0 });
    return;
  }

  let token;
  try {
    token = await getAccessToken();
  } catch (err) {
    console.error('[sms-nudge] getAccessToken failed:', err && err.message);
    res.status(500).json({ error: 'graph_auth_failed' });
    return;
  }

  const results = [];
  for (const lead of stale) {
    if (!lead || !lead.email) continue;

    const stage = store.applyStage(lead);

    // findStaleLeads filters on completed_at is null, but that isn't
    // airtight: recordEvent swallows markCompleted failures, so a lead can
    // carry a 'submitted' event with a null completed_at. Nudging someone
    // who already applied is the worst thing this cron could do, so trust
    // the event log over the column and mark them so we stop reconsidering.
    if (stage === 'submitted') {
      try { await store.markNudged(lead.id); } catch (_) { /* best effort */ }
      results.push({ id: lead.id, ok: false, reason: 'already_submitted' });
      continue;
    }

    // Pass the stage so the link opens on the step they actually stopped
    // on — a "finish your ID check" CTA that lands on the business form
    // isn't a one-click nudge.
    const applyUrl = buildApplyUrlFromRow(lead, stage);
    const shortUrl = buildShortUrl(lead.id);
    // Never hand ctaButton a falsy URL — buildApplyUrlFromRow returns null
    // for a null row and buildShortUrl returns null for a malformed id,
    // and withUtm passes null straight through. An empty href resolves
    // against the mail client's own base URL and silently does nothing.
    const linkUrl  = applyUrl || shortUrl || `${SITE_ORIGIN.replace(/\/$/, '')}/apply`;
    // The paste-me line gets the short link: it's readable when typed by
    // hand, and api/r.js already logs a 'clicked' outreach row on the way
    // through, so the fallback path stays attributable.
    const pasteUrl = shortUrl || linkUrl;

    const name = firstNameOf(lead.first_name);
    const institution = lead.latest_event
      && lead.latest_event.meta
      && lead.latest_event.meta.institution;

    // If the lead has a live offer, quote its real terms and its real
    // expiry. Without one we fall back to the upcoming-Sunday label, which
    // is a soft framing rather than a claim about a specific offer —
    // "locked through Sunday" should only be said when something actually
    // is. Best-effort: a lookup failure just drops us to the fallback.
    let offer = null;
    try {
      offer = await store.findOpenOffer(lead.id);
    } catch (err) {
      console.error(`[sms-nudge] offer lookup failed for ${lead.id}:`, err && err.message);
    }
    const deadline = offer ? offerDeadlineLabel(offer.expires_at) : null;
    // A real quote beats the calculator estimate — it's what the applicant
    // will actually be signing.
    const estimate = offer
      ? { ...(lead.estimate || {}), low: Number(offer.advance_amount), high: Number(offer.advance_amount) }
      : (lead.estimate || {});

    const smsBody = smsTemplate({
      firstName: lead.first_name,
      shortUrl: pasteUrl,
      stage,
      source: lead.source,
    });
    const gvLink = googleVoiceLink({ phone: lead.phone, body: smsBody });
    const variant = subjectVariant(lead.id);
    const subject = nudgeSubject({
      variant,
      stage,
      name,
      source: lead.source,
      estimate,
      institution,
      deadline,
    });

    // Email the lead first (the automation half of the hybrid).
    try {
      await sendMail(
        token, FROM_MAILBOX, lead.email,
        subject,
        nudgeEmail({
          leadId: lead.id,
          stage,
          name,
          source: lead.source,
          estimate,
          institution,
          deadline,
          applyUrl: linkUrl,
          pasteUrl,
          leadEmail: lead.email,
          leadPhone: lead.phone,
          variant,
        }),
        {
          from: FROM_MAILBOX,
          fromName: 'David @ Delt Capital',
          replyTo: [NOTIFY_TO],
          bcc: [NOTIFY_TO],
        }
      );
    } catch (err) {
      console.error(`[sms-nudge] lead email failed for ${lead.email}:`, err && err.message);
      results.push({ id: lead.id, ok: false, reason: 'lead_email_failed' });
      continue;
    }

    // Outreach telemetry for the backend's Outreach page. Best-effort.
    await outreach.recordOutreach({
      leadId: lead.id,
      leadEmail: lead.email,
      leadName: lead.first_name,
      campaign: 'calc-nudge-45m',
      event: 'sent',
      variant,
      utm: {
        utm_source: 'email',
        utm_medium: 'lifecycle',
        utm_campaign: 'calc-nudge-45m',
        utm_content: `subj-${variant}`,
      },
      meta: { subject, stage },
    });

    // Then send the operator the SMS-ready note (the manual half).
    try {
      await sendMail(
        token, FROM_MAILBOX, NOTIFY_TO,
        `[Delt SMS nudge] ${lead.first_name || ''} \u2014 ${lead.business_name || ''}`,
        internalNudgeNote({ lead, stage, applyUrl: linkUrl, shortUrl: pasteUrl, smsBody, gvLink, variant, subject }),
        { from: FROM_MAILBOX, fromName: 'Delt Capital Bot' }
      );
    } catch (err) {
      // Operator note is best-effort \u2014 the lead nudge already shipped.
      console.error(`[sms-nudge] operator note failed for ${lead.id}:`, err && err.message);
    }

    // Mark the lead so we never re-nudge them. We do this last so a
    // failed lead-email above leaves the lead eligible on the next run.
    try {
      await store.markNudged(lead.id);
      results.push({ id: lead.id, ok: true, variant });
    } catch (err) {
      console.error(`[sms-nudge] markNudged failed for ${lead.id}:`, err && err.message);
      results.push({ id: lead.id, ok: true, variant, mark_failed: true });
    }
  }

  res.status(200).json({ ok: true, nudged: results.filter((r) => r.ok).length, results });
};

// Render harness. Vercel invokes the default export as the handler and
// ignores extra properties on it, so this is safe in production and it's
// the only way to render these templates offline — the repo has no build
// step and no test runner. See the verification notes in the PR.
module.exports.__test = {
  stageCopy,
  nudgeSubject,
  nudgeEmailBody,
  nudgeEmail,
  smsTemplate,
  subjectVariant,
  upcomingSundayLabel,
  offerDeadlineLabel,
  plausibleInstitution,
};
