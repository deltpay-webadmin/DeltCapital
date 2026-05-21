// Vercel serverless function — calculator lead capture.
//
// Fires when a user submits the lead-gate form in V1CalcAnalyzer
// (deltcapital.com calculator). Two things happen:
//   1. Internal notification → david@deltpay.com with the lead's contact
//      info and the funding estimate that triggered the gate.
//   2. Branded confirmation → the lead, with the funding range we
//      pre-qualified them for and a CTA back to the application.
//
// Best-effort by design: if either email fails, we still 200 so the
// front-end can unblur the result. We never want to block a user from
// seeing their number because of an SMTP hiccup; the front-end also
// posts the same data into the apply form, so the lead is captured
// downstream regardless.
//
// Required env vars (same set as /api/book):
//   OUTLOOK_TENANT_ID, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET,
//   OUTLOOK_FROM_EMAIL
// Optional:
//   LEADS_NOTIFY_EMAIL   — internal recipient (defaults to BOOKING_NOTIFY_EMAIL
//                           or david@deltpay.com)

const store = require('./_store');
const { getAccessToken, sendMail } = require('./_email');
const { buildApplyUrl, SITE_ORIGIN } = require('./_deeplink');

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'david@deltpay.com';

// Hosted logo for email branding. Same-origin asset → keeps SpamAssassin /
// Gmail's deliverability heuristics happy (no off-domain images).
const LOGO_URL = `${SITE_ORIGIN.replace(/\/$/, '')}/app/assets/logo-dark.png`;

// Heuristic: only echo back the business name in the email body when it
// looks like a real name. A user who types '123 my business' as a
// placeholder should still receive an email that reads naturally
// ("about your business") instead of repeating their junk input.
function isPlausibleBusinessName(s) {
  const t = String(s || '').trim();
  if (t.length < 2) return false;
  // Must contain at least one letter and start with a letter.
  if (!/^[A-Za-z]/.test(t)) return false;
  if (!/[A-Za-z]{2,}/.test(t)) return false;
  // Reject obvious placeholders.
  if (/\bmy (business|company|biz|shop)\b/i.test(t)) return false;
  if (/\btest\b/i.test(t) && t.length < 8) return false;
  return true;
}

// Deep-link builder lives in api/_deeplink.js (shared with sms-nudge.js +
// the /r/<prefix> redirector). Kept as a thin wrapper so the rest of this
// file reads the same as before.
function buildApplyDeepLink(args) { return buildApplyUrl(args); }

// Microsoft Graph auth + sendMail live in api/_email.js so api/sms-nudge
// (and any future server-fired email) can reuse the same flow.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]); }

function fmtMoney(n) {
  if (!Number.isFinite(n) || n <= 0) return '$0';
  if (n >= 1000) return `$${Math.round(n / 1000).toLocaleString()}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function tibLabel(t) {
  if (t === '<6mo')   return 'Less than 6 months';
  if (t === '6-12mo') return '6–12 months';
  if (t === '1-2yr')  return '1–2 years';
  if (t === '2yr+')   return '2+ years';
  return String(t || 'Unknown');
}

function internalEmail({ firstName, businessName, email, phone, source, estimate, applyUrl }) {
  const e = estimate || {};
  const range = (e.low && e.high) ? `${fmtMoney(e.low)} – ${fmtMoney(e.high)}` : '—';
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.5;">
      <h2 style="margin:0 0 8px;font-size:18px;">New calculator lead</h2>
      <p style="margin:0 0 16px;color:#5A6577;font-size:13px;">
        ${esc(firstName)} from ${esc(businessName)} requested their funding range
        via the calculator on deltcapital.com.
      </p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Name</td><td style="padding:6px 0;">${esc(firstName)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Business</td><td style="padding:6px 0;">${esc(businessName)}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Phone</td><td style="padding:6px 0;"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Source</td><td style="padding:6px 0;">${esc(source || 'calculator-gate')}</td></tr>
      </table>
      <h3 style="margin:18px 0 6px;font-size:15px;">Pre-qualified estimate</h3>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Funding range</td><td style="padding:6px 0;"><strong>${esc(range)}</strong>${e.boosted ? ' <span style="color:#5B5BD6;font-size:11px;font-weight:600;">(WITH DELT BOOST)</span>' : ''}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Monthly revenue</td><td style="padding:6px 0;">${esc(fmtMoney(e.revenue))}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Time in business</td><td style="padding:6px 0;">${esc(tibLabel(e.tib))}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Accepts cards</td><td style="padding:6px 0;">${e.acceptsCards === true ? 'Yes' : (e.acceptsCards === false ? 'No' : '—')}</td></tr>
        ${e.acceptsCards === true ? `<tr><td style="padding:6px 14px 6px 0;color:#5A6577;">Monthly card sales</td><td style="padding:6px 0;">${esc(fmtMoney(e.cardSales))}</td></tr>` : ''}
      </table>
      <p style="margin:24px 0 0;color:#5A6577;font-size:12.5px;">
        Specialist follow-up window: <strong>within 1 business hour</strong>.
      </p>
      ${applyUrl ? `<p style="margin:14px 0 0;font-size:12.5px;">
        <a href="${esc(applyUrl)}" style="color:#5B5BD6;">Open this lead's pre-filled application</a>
        (skip business + contact, lands on bank link).
      </p>` : ''}
    </div>
  `;
}

function leadEmail({ firstName, businessName, email, phone, estimate, applyUrl }) {
  const e = estimate || {};
  const range = (e.low && e.high) ? `${fmtMoney(e.low)} – ${fmtMoney(e.high)}` : 'your custom amount';
  // Only echo the business name when it looks real — protects against
  // placeholder inputs like "123 my business" reading back awkwardly.
  const showBiz = isPlausibleBusinessName(businessName);
  const aboutClause = showBiz
    ? `Based on what you told us about <strong>${esc(businessName)}</strong>,`
    : `Based on the numbers you shared,`;
  const ctaUrl = applyUrl
               || buildApplyDeepLink({ firstName, businessName, email, phone, estimate });
  return `
    <div style="font-family:Arial,sans-serif;color:#0F0E17;line-height:1.55;max-width:560px;">
      <div style="margin:0 0 22px;">
        <img src="${LOGO_URL}" alt="Delt Capital" width="148" style="height:36px;width:auto;display:block;border:0;outline:none;text-decoration:none;" />
      </div>
      <h2 style="margin:0 0 14px;font-size:22px;letter-spacing:-0.01em;">
        Your pre-qualified funding range is <span style="color:#5B5BD6;">${esc(range)}</span>.
      </h2>
      <p style="margin:0 0 14px;">Hi ${esc(firstName)},</p>
      <p style="margin:0 0 14px;">
        ${aboutClause} we've
        pre-qualified you for between <strong>${esc(range)}</strong> in working
        capital${e.boosted ? ' — that\'s the boosted estimate that comes with switching processing to Delt' : ''}.
      </p>
      <p style="margin:0 0 14px;">
        A funding specialist will reach out within the next business hour to
        confirm the exact offer and walk you through next steps. If you'd rather
        keep moving now, the application takes about 2 minutes — we'll skip the
        questions you already answered and take you straight to the bank link:
      </p>
      <p style="margin:0 0 20px;">
        <a href="${esc(ctaUrl)}"
           style="display:inline-block;background:#5B5BD6;color:#fff;text-decoration:none;
                  padding:12px 22px;border-radius:10px;font-family:Arial,sans-serif;
                  font-size:14.5px;font-weight:700;">
          Continue my application
        </a>
      </p>
      <p style="margin:0 0 14px;color:#5A6577;font-size:13.5px;">
        No credit pull until you accept an offer. Most operators get a final
        number back the same day.
      </p>
      <p style="margin:24px 0 0;color:#5A6577;font-size:13px;">— Delt Capital</p>
      <p style="margin:18px 0 0;color:#9aa3ad;font-size:11.5px;line-height:1.5;border-top:1px solid #e7e3da;padding-top:12px;">
        You're receiving this because you used the funding calculator on
        deltcapital.com. Reply to unsubscribe.
      </p>
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
      firstName, businessName, email, phone,
      source, estimate,
    } = body;

    if (!firstName || !businessName || !email || !phone) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }

    const fromMailbox = process.env.OUTLOOK_FROM_EMAIL;
    if (!fromMailbox) {
      // Even if email isn't configured, accept the lead — front-end has
      // it in state and will re-submit through the apply flow.
      console.warn('OUTLOOK_FROM_EMAIL not set — lead recorded without email notification');
      res.status(200).json({ ok: true, emailed: false });
      return;
    }

    // Persist the lead first so we can embed its id in the deep link
    // payload. Best-effort: if Supabase isn't configured (or errors) we
    // still build a deep link without a leadId — the email flow keeps
    // working, we just can't track progress / fire the cron nudge.
    let leadId = null;
    try {
      const row = await store.createLead({ firstName, businessName, email, phone, source, estimate });
      leadId = row && row.id ? row.id : null;
    } catch (err) {
      console.error('leads store.createLead failed:', err && err.message);
    }

    // Build the deep-link once so it can ride inside both the lead email
    // (CTA) and the internal notification (so David's team can paste-jump
    // a customer directly into their pre-filled application if needed).
    const applyUrl = buildApplyDeepLink({ leadId, firstName, businessName, email, phone, estimate });
    const ctx = { firstName, businessName, email, phone, source, estimate, applyUrl };

    let token;
    try {
      token = await getAccessToken();
    } catch (err) {
      console.error('leads getAccessToken failed:', err && err.stack ? err.stack : err);
      // Still 200 — the lead is captured in our front-end state.
      res.status(200).json({ ok: true, emailed: false });
      return;
    }

    const internalSubject = `New calc lead: ${firstName} @ ${businessName} — ${(estimate && estimate.low && estimate.high) ? `${fmtMoney(estimate.low)}–${fmtMoney(estimate.high)}` : 'no range'}`;
    const leadSubject     = `Your pre-qualified funding range — Delt Capital`;

    try {
      await sendMail(token, NOTIFY_TO, NOTIFY_TO, internalSubject, internalEmail(ctx), {
        from: fromMailbox,
        fromName: 'Delt Capital',
        replyTo: [email],
      });
    } catch (err) {
      console.error('leads internal sendMail failed:', err && err.stack ? err.stack : err);
    }
    try {
      await sendMail(token, NOTIFY_TO, email, leadSubject, leadEmail(ctx), {
        // applyUrl already inside ctx — leadEmail consumes it.
        // (Listed here purely to make the dependency obvious to readers.)
        from: fromMailbox,
        fromName: 'Delt Capital',
        replyTo: [NOTIFY_TO],
        bcc: [NOTIFY_TO],
      });
    } catch (err) {
      console.error('leads booker sendMail failed:', err && err.stack ? err.stack : err);
    }

    res.status(200).json({ ok: true, emailed: true, applyUrl, leadId });
  } catch (err) {
    console.error('leads api error:', err && err.stack ? err.stack : err);
    // Soft-fail: front-end already has the data and will retry via apply form.
    res.status(200).json({ ok: true, emailed: false });
  }
};
