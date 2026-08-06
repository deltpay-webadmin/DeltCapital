// GET /admin/leads
// Magic-link gated server-rendered dashboard. Lists recent leads with
// their current funnel position and a one-click "Send SMS via Google
// Voice" affordance. No client framework \u2014 just HTML + a small inline
// script for the copy-to-clipboard button.

const { verifySession } = require('./_admin-auth');
const store = require('./_store');

const SITE_ORIGIN = (() => {
  const explicit = process.env.PUBLIC_SITE_ORIGIN;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return /^https?:\/\//i.test(vercel) ? vercel : `https://${vercel}`;
  return 'https://deltcapital.com';
})();

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]); }

function fmtMoney(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return '\u2014';
  return '$' + Math.round(v).toLocaleString();
}

function fmtRelative(iso) {
  if (!iso) return '\u2014';
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '\u2014';
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

// Mirror api/leads.js#buildApplyDeepLink so the admin link points at
// the same prefilled application the email/SMS deep links use.
function buildApplyDeepLink({ leadId, lead, estimate }) {
  const e = estimate || {};
  const payload = {
    v: 1, t: Date.now(),
    leadId: leadId || undefined,
    firstName: String((lead && lead.first_name) || '').trim(),
    businessName: String((lead && lead.business_name) || '').trim(),
    email: String((lead && lead.email) || '').trim(),
    phone: String((lead && lead.phone) || '').trim(),
    low: Number(e.low) || 0,
    high: Number(e.high) || 0,
    revenue: Number(e.revenue) || 0,
    tib: String(e.tib || ''),
    acceptsCards: e.acceptsCards === true ? 1 : (e.acceptsCards === false ? 0 : null),
    cardSales: Number(e.cardSales) || 0,
    boosted: !!e.boosted,
  };
  const b64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${SITE_ORIGIN.replace(/\/$/, '')}/apply?d=${b64}`;
}

function smsBodyFor(lead, applyUrl) {
  const first = lead.first_name ? `${lead.first_name}, ` : '';
  const e = lead.estimate || {};
  const range = (e.low && e.high)
    ? `$${Number(e.low).toLocaleString()}\u2013$${Number(e.high).toLocaleString()}`
    : 'your funding offer';
  return `${first}this is David at Delt Capital. Your ${range} offer is still open \u2014 takes 2 min to claim: ${applyUrl}`;
}

// Status derived from the latest_event we joined in api/_store.listLeads.
//
// The stage ladder itself lives in store.applyStage so the dashboard and
// the nudge cron can never disagree about where a lead is — this used to be
// a duplicated if-chain, and it silently mislabelled every lead that hit a
// milestone the copy here hadn't been taught about.
const STAGE_LABELS = {
  submitted:       { label: 'Submitted',    tone: 'good' },
  offer_presented: { label: 'Offer sent',   tone: 'mid'  },
  idv_done:        { label: 'IDV done',     tone: 'mid'  },
  bank_linked:     { label: 'Bank linked',  tone: 'mid'  },
  opened:          { label: 'Opened app',   tone: 'mid'  },
};

function statusFor(lead) {
  const known = STAGE_LABELS[store.applyStage(lead)];
  if (known) return known;
  if (lead.nudged_at) return { label: 'Nudged', tone: 'warn' };
  return { label: 'No reply', tone: 'cold' };
}

function googleVoiceLink(phone) {
  const digits = String(phone || '').replace(/\D+/g, '');
  // GV web UI \u2014 lands on conversations, operator types the number in
  // the recipient field. We can't pre-populate body via URL but the
  // Copy button next to this link puts it on the clipboard.
  if (!digits) return 'https://voice.google.com/u/0/messages';
  return `https://voice.google.com/u/0/messages?phone=%2B1${digits}`;
}

function dashboardHtml({ email, leads }) {
  const rows = leads.map((lead) => {
    const applyUrl = buildApplyDeepLink({ leadId: lead.id, lead, estimate: lead.estimate });
    const sms = smsBodyFor(lead, applyUrl);
    const status = statusFor(lead);
    const e = lead.estimate || {};
    return `
      <tr>
        <td>
          <div class="name">${esc(lead.first_name || '\u2014')}${lead.business_name ? ` <span class="biz">/ ${esc(lead.business_name)}</span>` : ''}</div>
          <div class="contact">${esc(lead.email || '')}${lead.phone ? ` \u00b7 ${esc(lead.phone)}` : ''}</div>
        </td>
        <td class="range">${esc(fmtMoney(e.low))}\u2013${esc(fmtMoney(e.high))}</td>
        <td><span class="pill pill-${status.tone}">${esc(status.label)}</span></td>
        <td class="when">${esc(fmtRelative(lead.created_at))}</td>
        <td class="actions">
          ${lead.phone ? `<a class="btn btn-primary" href="${esc(googleVoiceLink(lead.phone))}" target="_blank" rel="noopener">Text in GV</a>` : `<span class="muted">no phone</span>`}
          <button class="btn btn-ghost copy-sms" data-sms="${esc(sms)}">Copy SMS</button>
          <a class="btn btn-ghost" href="${esc(applyUrl)}" target="_blank" rel="noopener">Apply link</a>
        </td>
      </tr>`;
  }).join('');

  return `<!doctype html><html lang="en"><head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Leads \u2014 Delt Capital admin</title>
  <meta name="robots" content="noindex,nofollow" />
  <style>
    *{box-sizing:border-box}
    body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#F8F7FB;color:#1A1A1F}
    header{background:#fff;border-bottom:1px solid #EDEBF2;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:18px}
    header .brand{font-weight:700;letter-spacing:.02em}
    header .who{font-size:13px;color:#6B6877}
    header a.logout{font-size:13px;color:#5B5BD6;text-decoration:none}
    main{padding:24px;max-width:1240px;margin:0 auto}
    h1{font-size:20px;margin:0 0 4px;font-weight:600}
    .sub{color:#6B6877;font-size:13px;margin:0 0 18px}
    table{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 6px 20px -14px rgba(31,28,80,0.18)}
    th,td{text-align:left;padding:14px 14px;font-size:13.5px;vertical-align:top;border-bottom:1px solid #F0EEF6}
    th{background:#FAFAFB;font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:#6B6877;font-weight:600}
    tr:last-child td{border-bottom:none}
    .name{font-weight:600;font-size:14px}
    .biz{color:#6B6877;font-weight:400;font-size:13px}
    .contact{color:#6B6877;font-size:12.5px;margin-top:2px}
    .range{white-space:nowrap;font-variant-numeric:tabular-nums}
    .when{white-space:nowrap;color:#6B6877;font-size:12.5px}
    .actions{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
    .btn{display:inline-flex;align-items:center;padding:7px 11px;border-radius:8px;font-size:12.5px;font-weight:600;text-decoration:none;border:1px solid transparent;cursor:pointer;font-family:inherit;line-height:1.2}
    .btn-primary{background:#1A1A1F;color:#fff}
    .btn-ghost{background:#fff;color:#1A1A1F;border-color:#E2E0EA}
    .btn-ghost:hover{background:#F4F4F8}
    .copy-sms.copied{background:#E7FBEE;border-color:#9CE5B4;color:#0E7C4A}
    .pill{display:inline-block;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:600}
    .pill-good{background:#E7FBEE;color:#0E7C4A}
    .pill-mid{background:#EEF1FF;color:#3D45B5}
    .pill-warn{background:#FFF4E0;color:#8B5A00}
    .pill-cold{background:#F1F0F5;color:#6B6877}
    .muted{color:#9D99AC;font-size:12px}
    .empty{padding:40px;text-align:center;color:#6B6877}
  </style>
  </head><body>
    <header>
      <div class="brand">Delt Capital \u2014 leads</div>
      <div>
        <span class="who">${esc(email)}</span>
        &nbsp;\u00b7&nbsp;
        <a class="logout" href="/api/admin-logout">Sign out</a>
      </div>
    </header>
    <main>
      <h1>Recent leads</h1>
      <p class="sub">${leads.length} most recent. Click \u201cText in GV\u201d to open Google Voice; \u201cCopy SMS\u201d puts a ready-to-send message on your clipboard.</p>
      ${leads.length ? `
      <table>
        <thead><tr>
          <th>Lead</th>
          <th>Range</th>
          <th>Status</th>
          <th>Submitted</th>
          <th>Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>` : `<div class="empty">No leads yet \u2014 submissions to the calculator's lead-gate will show up here.</div>`}
    </main>
    <script>
      document.querySelectorAll('.copy-sms').forEach((btn) => {
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(btn.dataset.sms || '');
            const orig = btn.textContent;
            btn.classList.add('copied');
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.classList.remove('copied'); btn.textContent = orig; }, 1400);
          } catch (e) {
            btn.textContent = 'Copy failed';
          }
        });
      });
    </script>
  </body></html>`;
}

module.exports = async function handler(req, res) {
  const session = verifySession(req.headers.cookie);
  if (!session) {
    res.statusCode = 302;
    res.setHeader('Location', '/admin');
    res.end();
    return;
  }

  let leads = [];
  if (store.ENABLED) {
    try {
      leads = await store.listLeads({ limit: 100 });
    } catch (err) {
      console.error('[admin-leads] listLeads failed:', err && err.message);
    }
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(dashboardHtml({ email: session.email, leads }));
};
