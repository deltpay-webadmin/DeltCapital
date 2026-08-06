// POST /api/offer-accept
//   body: { offerCode, typedSignature, agreedTermsVersion }
//   → { ok: true, offerCode, acceptedAt, institution }
//
// Records an applicant accepting their funding offer.
//
// What used to happen here: nothing. The "Accept offer" button was
// `onClick={() => setStep(4)}`. No signature, no server call, no record —
// and the very next screen told the applicant "You're funded. Tomorrow by
// 2 PM," named a rep who doesn't exist, and said the money would land in
// their "connected Chase account" regardless of which bank they'd linked.
//
// So this endpoint is the difference between a demo and a funding
// application. It:
//   • validates the offer is real, still 'presented', and not expired
//   • requires a typed signature and the terms version the applicant was
//     actually shown (a stale tab must not sign an old price)
//   • writes an immutable acceptance row with the terms frozen as
//     displayed, plus IP and user agent
//   • flips the offer to 'accepted' under a status guard so a double
//     submit can't record two acceptances
//   • records the milestone, which marks the lead complete and stops the
//     nudge cron from chasing somebody who has already signed
//   • emails the applicant their signed terms and notifies the operator
//
// Nothing here promises funding. Acceptance means signed and received; the
// wire is a separate, human step.

const store = require('./_store');
const { getAccessToken, sendMail } = require('./_email');
const { renderEmail, esc, COMPANY } = require('./_email-layout');
const { firstNameOf } = require('./_name');

const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL
                || process.env.BOOKING_NOTIFY_EMAIL
                || 'david@deltpay.com';
const FROM_MAILBOX = process.env.OUTLOOK_FROM_EMAIL;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function money(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '$0';
  return '$' + Math.round(v).toLocaleString();
}

function dateLabel(iso) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      month: 'long', day: 'numeric', year: 'numeric',
    }).format(new Date(iso));
  } catch (_) {
    return String(iso || '');
  }
}

// Best-effort client IP. Vercel puts the real one in x-forwarded-for; the
// first entry is the client, the rest are proxies.
function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  if (Array.isArray(fwd) && fwd.length) return String(fwd[0]).split(',')[0].trim();
  return (req.headers['x-real-ip'] && String(req.headers['x-real-ip'])) || null;
}

// The applicant's copy of what they just signed. Every figure comes from
// the frozen snapshot, not from a re-read of the offers table.
function acceptedEmailBody({ name, snapshot, acceptedAt }) {
  const row = (k, v) => `
        <tr>
          <td style="padding:9px 16px 9px 0;color:#5A6577;font-size:13.5px;">${esc(k)}</td>
          <td style="padding:9px 0;color:#0A1133;font-size:14px;font-weight:600;">${esc(v)}</td>
        </tr>`;
  return `
      <p style="margin:0 0 6px;font-size:13px;color:#6B6877;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;">Signed &amp; received</p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:#0A1133;letter-spacing:-0.01em;">
        ${name ? `${esc(name)}, we have your signed agreement.` : 'We have your signed agreement.'}
      </h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#0F0E17;">
        You accepted offer <strong style="color:#0A1133;">${esc(snapshot.offerCode)}</strong>
        on ${esc(dateLabel(acceptedAt))}. Here are the terms exactly as you
        signed them &mdash; keep this email for your records.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px;border-top:1px solid #E7E3DA;border-bottom:1px solid #E7E3DA;">
        ${row('Advance amount', money(snapshot.advanceAmount))}
        ${row('Factor rate', `${Number(snapshot.factorRate).toFixed(2)}×`)}
        ${row('Total repayment', money(snapshot.totalRepayment))}
        ${row('Term', `${snapshot.termMonths} months`)}
        ${row('Weekly debit', money(snapshot.weeklyDebit))}
        ${row('Signed by', snapshot.typedSignature)}
        ${row('Agreement version', snapshot.termsVersion)}
      </table>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#0F0E17;">
        <strong style="color:#0A1133;">What happens next.</strong> Your file
        goes to final verification. A funding specialist confirms the details
        against your connected bank account and contacts you to arrange the
        wire. You do not need to do anything in the meantime.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 22px;color:#0F0E17;">
        If anything above doesn't match what you expected, reply to this
        email straight away and we'll hold the file until it's sorted.
      </p>
      <p style="margin:22px 0 0;color:#0A1133;font-size:13.5px;line-height:1.55;">
        &mdash; David Hazday<br/>
        <span style="color:#6B6877;font-weight:500;">Director, Delt Capital</span>
      </p>
      <p style="margin:14px 0 0;font-size:13px;color:#6B6877;">
        Questions? Call or text
        <a href="tel:${esc(COMPANY.phoneTel)}" style="color:#5B5BD6;text-decoration:none;font-weight:600;">${esc(COMPANY.phone)}</a>.
      </p>
  `;
}

function operatorAcceptedBody({ lead, snapshot, acceptedAt, ip }) {
  const row = (k, v) => `<p style="margin:5px 0;font-size:14px;"><b>${esc(k)}:</b> ${esc(v)}</p>`;
  return `
      <h2 style="margin:0 0 12px;font-size:18px;">Offer accepted &mdash; ${esc(snapshot.offerCode)}</h2>
      ${row('Lead', `${lead.first_name || ''} — ${lead.business_name || ''}`)}
      ${row('Email', lead.email || '')}
      ${row('Phone', lead.phone || '')}
      <hr style="border:none;border-top:1px solid #EEE;margin:16px 0;" />
      ${row('Advance', money(snapshot.advanceAmount))}
      ${row('Factor', `${Number(snapshot.factorRate).toFixed(2)}×`)}
      ${row('Total repayment', money(snapshot.totalRepayment))}
      ${row('Term', `${snapshot.termMonths} months`)}
      ${row('Weekly debit', money(snapshot.weeklyDebit))}
      <hr style="border:none;border-top:1px solid #EEE;margin:16px 0;" />
      ${row('Typed signature', snapshot.typedSignature)}
      ${row('Terms version', snapshot.termsVersion)}
      ${row('Accepted at', acceptedAt)}
      ${row('IP', ip || 'unknown')}
      <p style="margin:16px 0 0;font-size:13px;color:#6B6877;">
        Signature record is in <code>offer_acceptances</code>. This file is
        awaiting final verification &mdash; nothing has been funded.
      </p>
  `;
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'method_not_allowed' }); return; }

  if (!store.ENABLED) {
    // Refuse rather than let the UI advance to a success screen we can't
    // back with a record. This is the exact failure the old flow shipped.
    res.status(503).json({ error: 'acceptance_unavailable' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const offerCode = String(body.offerCode || '').trim();
  const typedSignature = String(body.typedSignature || '').trim();
  const agreedTermsVersion = String(body.agreedTermsVersion || '').trim();

  if (!offerCode) { res.status(400).json({ error: 'offer_code_required' }); return; }
  if (typedSignature.length < 2) {
    res.status(400).json({
      error: 'signature_required',
      message: 'Type your full legal name to sign.',
    });
    return;
  }

  try {
    const offer = await store.getOfferByCode(offerCode);
    if (!offer) { res.status(404).json({ error: 'offer_not_found' }); return; }

    if (offer.status === 'accepted') {
      // Idempotent replay (double-click, retried request): report success
      // with the existing acceptance rather than erroring or double-writing.
      res.status(200).json({
        ok: true,
        offerCode: offer.offer_code,
        acceptedAt: offer.accepted_at,
        alreadyAccepted: true,
      });
      return;
    }

    if (offer.status !== 'presented') {
      res.status(409).json({
        error: 'offer_not_open',
        message: 'This offer is no longer available. Reply to your email and we\'ll re-issue it.',
      });
      return;
    }

    if (new Date(offer.expires_at).getTime() <= Date.now()) {
      res.status(409).json({
        error: 'offer_expired',
        message: `This offer expired on ${dateLabel(offer.expires_at)}. Reply and we'll re-verify your bank data and re-issue it — it usually takes a few minutes.`,
      });
      return;
    }

    // A tab left open across a repricing must not be able to sign the old
    // number silently.
    if (agreedTermsVersion && agreedTermsVersion !== offer.terms_version) {
      res.status(409).json({
        error: 'terms_changed',
        message: 'These terms have been updated since this page loaded. Refresh to see the current offer before signing.',
      });
      return;
    }

    // Claim the offer first. The status guard inside markOfferAccepted
    // means a racing second request finds nothing to update and bails out
    // here, so exactly one acceptance is ever recorded.
    const claimed = await store.markOfferAccepted(offer.id);
    if (!claimed) {
      res.status(409).json({ error: 'offer_not_open', message: 'This offer was just accepted.' });
      return;
    }

    const lead = await store.getLead(offer.lead_id);
    const acceptedAt = claimed.accepted_at || new Date().toISOString();

    // Everything the applicant was looking at, frozen. Read this back for
    // any question about what was agreed — never re-derive from `offers`.
    const snapshot = {
      offerCode:      offer.offer_code,
      advanceAmount:  Number(offer.advance_amount),
      factorRate:     Number(offer.factor_rate),
      termMonths:     Number(offer.term_months),
      totalRepayment: Number(offer.total_repayment),
      weeklyDebit:    Number(offer.weekly_debit),
      termsVersion:   offer.terms_version,
      typedSignature,
      acceptedAt,
    };

    await store.recordAcceptance({
      offerId: offer.id,
      leadId: offer.lead_id,
      typedSignature,
      signerEmail: (lead && lead.email) || '',
      termsVersion: offer.terms_version,
      ip: clientIp(req),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 500),
      contractSnapshot: snapshot,
    });

    // Milestones. 'submitted' also flips leads.completed_at via recordEvent,
    // which is what takes this lead out of the nudge cron's queue.
    for (const event of ['offer_accepted', 'submitted']) {
      try {
        await store.recordEvent({ leadId: offer.lead_id, event, meta: { offerCode: offer.offer_code } });
      } catch (err) {
        console.error(`[offer-accept] recordEvent ${event} failed:`, err && err.message);
      }
    }

    // Respond before emailing — the applicant's screen shouldn't wait on
    // Microsoft Graph, and the acceptance is already durable.
    res.status(200).json({ ok: true, offerCode: offer.offer_code, acceptedAt });

    if (!FROM_MAILBOX || !lead || !lead.email) return;
    try {
      const token = await getAccessToken();
      const name = firstNameOf(lead.first_name);
      await sendMail(
        token, FROM_MAILBOX, lead.email,
        `Signed — your ${money(snapshot.advanceAmount)} agreement (${offer.offer_code})`,
        renderEmail({
          body: acceptedEmailBody({ name, snapshot, acceptedAt }),
          audience: 'lead',
          includeTrustStrip: true,
          recipientEmail: lead.email,
          recipientPhone: lead.phone,
          footerReason: `signed a funding agreement with ${COMPANY.name}`,
          preheader: `Your signed terms for ${offer.offer_code}.`,
        }),
        { from: FROM_MAILBOX, fromName: 'David @ Delt Capital', replyTo: [NOTIFY_TO], bcc: [NOTIFY_TO] }
      );
      await sendMail(
        token, FROM_MAILBOX, NOTIFY_TO,
        `[Delt] Offer accepted — ${lead.business_name || lead.email} — ${money(snapshot.advanceAmount)}`,
        renderEmail({
          body: operatorAcceptedBody({ lead, snapshot, acceptedAt, ip: clientIp(req) }),
          audience: 'operator',
          includeTrustStrip: false,
        }),
        { from: FROM_MAILBOX, fromName: 'Delt Capital Bot' }
      );
    } catch (err) {
      // The signature is recorded; a failed email is a follow-up problem,
      // not a reason to tell the applicant their acceptance failed.
      console.error('[offer-accept] confirmation email failed:', err && err.message);
    }
  } catch (err) {
    console.error('[offer-accept] failed:', err && err.message);
    if (!res.headersSent) res.status(500).json({ error: 'accept_failed' });
  }
};

module.exports.__test = { acceptedEmailBody, operatorAcceptedBody, money, dateLabel, clientIp };
