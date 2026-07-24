// Shared email chrome: header (logo) + trust strip + CAN-SPAM footer.
//
// Every outbound email we send wraps its body in `renderEmail(...)` so
// the brand signals stay consistent and we have one place to update
// addresses, phone numbers, or badge artwork.
//
// Trust signals are real:
//   - BBB Accredited A+ (Delt Capital confirmed)
//   - PCI DSS compliant   (Delt Capital confirmed)
//   - Plaid bank-link partner (used in the apply flow)
//
// All images are served from the same origin as the site (no off-domain
// hotlinking). Spam filters and Gmail's clipping heuristics treat
// same-origin imagery much more kindly than third-party CDNs.

const { SITE_ORIGIN } = require('./_deeplink');

const ORIGIN = SITE_ORIGIN.replace(/\/$/, '');

const ASSETS = {
  logoWordmark: `${ORIGIN}/app/assets/logo-wordmark-email.png`,
  logoMark:     `${ORIGIN}/app/assets/logo-mark.png`,
  badges: {
    bbb:    `${ORIGIN}/app/assets/badges/bbb-aplus.png`,
    pci:    `${ORIGIN}/app/assets/badges/pci-dss.png`,
    plaid:  `${ORIGIN}/app/assets/badges/plaid-verified.png`,
    ssl:    `${ORIGIN}/app/assets/badges/ssl-secure.png`,
  },
};

const COMPANY = {
  name: 'Delt Capital',
  legalName: 'Delt Capital',
  phone: '(864) 729-3358',
  // tel: links want digits only
  phoneTel: '+18647293358',
  supportEmail: 'david@deltpay.com',
  site: 'deltcapital.com',
  siteUrl: ORIGIN,
};

// HTML-escape helper (same set used elsewhere in /api)
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]); }

// The trust strip — three official brand seals centered under the main
// content. Rendered as a single-row table so it doesn't reflow into a
// stacked column on narrow Outlook clients (which mangle CSS flexbox).
//
// We pin the height in both the HTML attribute AND the inline style so
// Outlook (which respects attributes more than CSS) and Gmail (vice
// versa) both render at the same size.
function trustStrip() {
  const cell = (src, alt, h = 32) => `
    <td align="center" valign="middle" style="padding:0 18px;">
      <img src="${src}" alt="${alt}" height="${h}"
           style="height:${h}px;width:auto;display:block;border:0;outline:none;text-decoration:none;opacity:0.85;" />
    </td>`;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto 4px;border-top:1px solid #E7E3DA;padding-top:20px;">
      <tr>
        ${cell(ASSETS.badges.bbb,   'BBB Accredited Business — A+ Rating')}
        ${cell(ASSETS.badges.pci,   'PCI DSS Compliant')}
        ${cell(ASSETS.badges.plaid, 'Bank verification powered by Plaid')}
      </tr>
      <tr>
        <td colspan="3" align="center" style="padding:12px 0 0;">
          <p style="margin:0;font-size:10.5px;line-height:1.5;color:#A4A0B0;letter-spacing:0.01em;">
            Accredited, compliant, and bank-grade secure. All connections encrypted with 256-bit TLS.
          </p>
        </td>
      </tr>
    </table>`;
}

// Lead-facing footer. Includes:
//   • Unsubscribe instruction (reply to opt out — we have <2k volume)
//   • Disclaimers customers expect from a funding company
//   • Phone + support email + site link
function leadFooter({ recipientEmail, recipientPhone } = {}) {
  const safeEmail = recipientEmail ? esc(recipientEmail) : null;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;border-top:1px solid #E7E3DA;">
      <tr><td style="padding:18px 4px 6px;">
        <p style="margin:0 0 10px;font-size:12px;line-height:1.55;color:#5A6577;">
          <strong style="color:#0A1133;">${esc(COMPANY.name)}</strong>
          &nbsp;&middot;&nbsp;
          <a href="tel:${esc(COMPANY.phoneTel)}" style="color:#5A6577;text-decoration:none;">${esc(COMPANY.phone)}</a>
          &nbsp;&middot;&nbsp;
          <a href="mailto:${esc(COMPANY.supportEmail)}" style="color:#5A6577;text-decoration:none;">${esc(COMPANY.supportEmail)}</a>
          &nbsp;&middot;&nbsp;
          <a href="${esc(COMPANY.siteUrl)}" style="color:#5A6577;text-decoration:none;">${esc(COMPANY.site)}</a>
        </p>
        <p style="margin:0 0 10px;font-size:11px;line-height:1.55;color:#8A8693;">
          Funding offers presented on this email are subject to underwriting and final
          verification. Not all applicants will qualify. Approval timing, fee structure,
          and total payback amounts vary by offer. Reviewing your offer does not impact
          your credit score &mdash; soft pull only until you accept terms in writing.
        </p>
        <p style="margin:0;font-size:10.5px;line-height:1.55;color:#A4A0B0;">
          You're receiving this because${safeEmail ? ` <span style="color:#8A8693;">${safeEmail}</span>` : ' you'} used the funding calculator on ${esc(COMPANY.site)}.
          Reply <strong>STOP</strong> or <strong>unsubscribe</strong> to opt out of future emails from this address.
          ${recipientPhone ? `<br/>SMS messages will only be sent to ${esc(recipientPhone)} regarding your active funding inquiry. Reply STOP to that number to opt out of texts.` : ''}
        </p>
      </td></tr>
    </table>`;
}

// Operator-facing footer (internal emails to david@deltpay.com).
// Slim, no CAN-SPAM boilerplate needed since this is transactional B2B.
function operatorFooter() {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;border-top:1px solid #E7E3DA;">
      <tr><td style="padding:14px 4px 0;">
        <p style="margin:0;font-size:11px;line-height:1.5;color:#9aa3ad;">
          Internal notification from the Delt Capital lead pipeline. Do not forward.
        </p>
      </td></tr>
    </table>`;
}

// Outer email shell. Renders a centered card on a tinted background — same
// visual language as the site. Body HTML is injected as-is.
function renderEmail({ body, includeTrustStrip = true, audience = 'lead', recipientEmail, recipientPhone, preheader, openPixelUrl }) {
  const footer = audience === 'operator' ? operatorFooter() : leadFooter({ recipientEmail, recipientPhone });
  const strip = includeTrustStrip ? trustStrip() : '';
  // Preheader text — shows in the inbox preview pane. Only the lead
  // emails set this; we hide it visually via the standard inbox-preview
  // trick (zero-height, off-screen).
  const preheaderHtml = preheader ? `
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F8F7FB;">
      ${esc(preheader)}
    </div>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${esc(COMPANY.name)}</title>
</head>
<body style="margin:0;padding:0;background:#F8F7FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0F0E17;">
  ${preheaderHtml}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F7FB;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="padding:36px 40px 24px;">
          <div style="margin:0 0 28px;padding-bottom:24px;border-bottom:2px solid #0A1133;">
            <a href="${esc(COMPANY.siteUrl)}" style="text-decoration:none;border:0;outline:none;">
              <img src="${ASSETS.logoWordmark}" alt="${esc(COMPANY.name)}" width="119"
                   style="height:36px;width:auto;display:block;border:0;outline:none;text-decoration:none;" />
            </a>
          </div>
          ${body}
          ${strip}
        </td></tr>
        <tr><td style="padding:0 40px 32px;">
          ${footer}
        </td></tr>
      </table>
    </td></tr>
  </table>
  ${openPixelUrl ? `<img src="${esc(openPixelUrl)}" alt="" width="1" height="1" style="display:block;width:1px;height:1px;border:0;" />` : ''}
</body>
</html>`;
}

module.exports = {
  renderEmail,
  trustStrip,
  COMPANY,
  ASSETS,
  esc,
};
