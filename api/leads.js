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
const { buildApplyUrl, withUtm } = require('./_deeplink');
const { renderEmail } = require('./_email-layout');
const outreach = require('./_outreach');

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'david@deltpay.com';

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

// HTML-escape inherited via _email-layout (shared with other email modules)
const { esc } = require('./_email-layout');

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

function internalEmailBody({ firstName, businessName, email, phone, source, estimate, applyUrl }) {
  const e = estimate || {};
  const range = (e.low && e.high) ? `${fmtMoney(e.low)} – ${fmtMoney(e.high)}` : '—';
  return `
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
  `;
}

function internalEmail(ctx) {
  return renderEmail({
    body: internalEmailBody(ctx),
    audience: 'operator',
    includeTrustStrip: false,
  });
}

function leadEmailBody({ firstName, businessName, email, phone, estimate, applyUrl }) {
  const e = estimate || {};
  const range = (e.low && e.high) ? `${fmtMoney(e.low)} – ${fmtMoney(e.high)}` : 'your custom amount';
  // Only echo the business name when it looks real — protects against
  // placeholder inputs like "123 my business" reading back awkwardly.
  const showBiz = isPlausibleBusinessName(businessName);
  const aboutClause = showBiz
    ? `Based on what you told us about <strong>${esc(businessName)}</strong>,`
    : `Based on the numbers you shared,`;
  const ctaUrl = withUtm(
    applyUrl || buildApplyDeepLink({ firstName, businessName, email, phone, estimate }),
    { utm_source: 'email', utm_medium: 'lifecycle', utm_campaign: 'calc-confirmation' }
  );
  return `
      <p style="margin:0 0 6px;font-size:13px;color:#6B6877;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;">Your pre-qualified offer</p>
      <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;letter-spacing:-0.01em;font-weight:700;color:#0A1133;">
        ${esc(range)} <span style="font-weight:500;color:#6B6877;font-size:20px;">in working capital</span>
      </h1>
      <p style="margin:0 0 14px;font-size:15.5px;line-height:1.55;">Hi ${esc(firstName)},</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">
        ${aboutClause} we've pre-qualified you for between <strong>${esc(range)}</strong> in working
        capital${e.boosted ? ' — that\'s the boosted estimate that comes with switching processing to Delt' : ''}.
      </p>
      <p style="margin:0 0 22px;font-size:15px;line-height:1.6;">
        A funding specialist will reach out within the next business hour to
        confirm the exact offer. If you'd rather keep moving now, the application
        takes about 2 minutes — we'll skip the questions you already answered and
        take you straight to the bank-link step:
      </p>
      <p style="margin:0 0 28px;">
        <a href="${esc(ctaUrl)}"
           style="display:inline-block;background:#0A1133;color:#FFFFFF;text-decoration:none;
                  padding:13px 28px;border-radius:6px;font-family:Arial,sans-serif;
                  font-size:15px;font-weight:600;letter-spacing:0.01em;">
          Continue my application &rarr;
        </a>
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;border-top:1px solid #E7E3DA;">
        <tr><td style="padding:14px 0 0;">
          <p style="margin:0 0 8px;font-size:13.5px;color:#5A6577;line-height:1.55;">
            <strong style="color:#0A1133;">No credit pull</strong> until you accept terms.
          </p>
          <p style="margin:0 0 8px;font-size:13.5px;color:#5A6577;line-height:1.55;">
            <strong style="color:#0A1133;">Bank-grade verification</strong> via Plaid.
          </p>
          <p style="margin:0;font-size:13.5px;color:#5A6577;line-height:1.55;">
            <strong style="color:#0A1133;">Funded as fast as 24h</strong> after acceptance.
          </p>
        </td></tr>
      </table>
      <p style="margin:0 0 4px;color:#5A6577;font-size:13.5px;line-height:1.55;">
        Questions? Just reply to this email — it goes straight to my inbox.
      </p>
      <p style="margin:16px 0 0;color:#0A1133;font-size:13.5px;line-height:1.55;">
        — David Hazday<br/>
        <span style="color:#6B6877;font-weight:500;">Director, Delt Capital</span>
      </p>
  `;
}

function leadEmail(ctx) {
  const preheader = (ctx.estimate && ctx.estimate.low && ctx.estimate.high)
    ? `Your ${fmtMoney(ctx.estimate.low)}\u2013${fmtMoney(ctx.estimate.high)} offer is ready. Specialist follow-up within 1 business hour.`
    : 'Your pre-qualified funding offer is ready. Specialist follow-up within 1 business hour.';
  return renderEmail({
    body: leadEmailBody(ctx),
    audience: 'lead',
    includeTrustStrip: true,
    recipientEmail: ctx.email,
    recipientPhone: ctx.phone,
    preheader,
    openPixelUrl: outreach.openPixelUrl({
      leadId: ctx.leadId,
      email: ctx.email,
      campaign: 'calc-confirmation',
    }),
  });
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
    const ctx = { leadId, firstName, businessName, email, phone, source, estimate, applyUrl };

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
      // Outreach telemetry for the backend's Outreach page. Best-effort.
      await outreach.recordOutreach({
        leadId,
        leadEmail: email,
        leadName: firstName,
        campaign: 'calc-confirmation',
        event: 'sent',
        utm: { utm_source: 'email', utm_medium: 'lifecycle', utm_campaign: 'calc-confirmation' },
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
