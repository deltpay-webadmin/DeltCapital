// GET /admin
// Renders the login form. If the visitor already has a valid session,
// 302 to /admin/leads.

const { verifySession } = require('./_admin-auth');

function loginHtml({ error }) {
  return `<!doctype html><html lang="en"><head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Delt Capital \u2014 Admin</title>
  <meta name="robots" content="noindex,nofollow" />
  <style>
    *{box-sizing:border-box}
    body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#F8F7FB;color:#1A1A1F;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
    .card{background:#fff;border-radius:16px;padding:36px 36px 32px;width:100%;max-width:420px;box-shadow:0 12px 32px -16px rgba(31,28,80,0.22)}
    .eyebrow{font-size:12px;color:#6B6877;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px}
    h1{font-size:22px;margin:0 0 6px;font-weight:600}
    .sub{color:#6B6877;font-size:14px;margin:0 0 22px;line-height:1.5}
    label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
    input[type=email]{width:100%;padding:12px 14px;border:1px solid #E2E0EA;border-radius:10px;font-size:15px;font-family:inherit;background:#FAFAFB;transition:border-color .15s,background .15s}
    input[type=email]:focus{outline:none;border-color:#5B5BD6;background:#fff}
    button{margin-top:14px;width:100%;padding:13px 18px;border-radius:10px;border:none;cursor:pointer;background:linear-gradient(135deg,#5B5BD6 0%,#6366F1 50%,#5B5BD6 100%);color:#fff;font-weight:600;font-size:15px;font-family:inherit}
    button:disabled{opacity:.55;cursor:default}
    .msg{margin-top:14px;font-size:13px;line-height:1.5}
    .msg.ok{color:#0E7C4A}
    .msg.err{color:#B0344E;background:#FDECEF;padding:10px 12px;border-radius:8px}
    .foot{margin-top:22px;font-size:11.5px;color:#9D99AC;line-height:1.5}
  </style>
  </head><body>
    <div class="card">
      <div class="eyebrow">Delt Capital</div>
      <h1>Admin sign-in</h1>
      <p class="sub">Enter your work email. We'll send you a sign-in link that works for 15 minutes.</p>
      ${error === 'expired' ? `<p class="msg err">That sign-in link expired or was already used. Request a new one below.</p>` : ''}
      <form id="f" autocomplete="off">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="you@deltpay.com" />
        <button id="btn" type="submit">Send sign-in link</button>
        <p class="msg" id="msg" style="display:none"></p>
      </form>
      <p class="foot">This page is restricted. Only emails on the allow list will receive a link.</p>
    </div>
    <script>
      const f = document.getElementById('f');
      const btn = document.getElementById('btn');
      const msg = document.getElementById('msg');
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        btn.disabled = true; btn.textContent = 'Sending\u2026';
        msg.style.display = 'none';
        try {
          await fetch('/api/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: document.getElementById('email').value }),
          });
          msg.className = 'msg ok';
          msg.textContent = 'Check your inbox \u2014 a sign-in link is on its way.';
          msg.style.display = 'block';
          btn.textContent = 'Link sent';
        } catch (err) {
          msg.className = 'msg err';
          msg.textContent = 'Something went wrong. Try again in a moment.';
          msg.style.display = 'block';
          btn.disabled = false; btn.textContent = 'Send sign-in link';
        }
      });
    </script>
  </body></html>`;
}

module.exports = async function handler(req, res) {
  const session = verifySession(req.headers.cookie);
  if (session) {
    res.statusCode = 302;
    res.setHeader('Location', '/admin/leads');
    res.end();
    return;
  }
  const url = new URL(req.url || '/', 'http://x');
  const error = url.searchParams.get('error');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(loginHtml({ error }));
};
