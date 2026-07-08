// V1 Cookie Consent — a small, self-contained consent "system".
// ─────────────────────────────────────────────────────────────────────────
// Pieces:
//   • Persistence — the choice is stored in localStorage under
//     COOKIE_KEY as { choice: 'accepted' | 'declined', ts }.
//   • Gating — non-essential tracking (the Meta Pixel) is held via Meta's
//     consent API until the visitor accepts. index.html sets the initial
//     grant/revoke at load from the same stored value; this module keeps it
//     in sync when the visitor changes their mind.
//   • Event bus — every decision dispatches a `delt:cookie-consent`
//     CustomEvent (detail: { choice, ts }). `window.DeltConsent` exposes
//     get() / set() / open() / onChange() so any other script can react.
//   • UI — a dismissible bottom-left banner with Accept / Decline and an
//     embedded link to the Cookie & Privacy Policy. A "Cookie preferences"
//     footer link re-opens it via DeltConsent.open().
//
// The policy URL is embedded here — swap COOKIE_POLICY_HREF for an external
// URL if the policy ever moves off-site.
// ─────────────────────────────────────────────────────────────────────────

const COOKIE_KEY = 'deltcap:cookie-consent:v1';
const COOKIE_EVENT = 'delt:cookie-consent';
const COOKIE_OPEN_EVENT = 'delt:cookie-consent:open';
// Embedded policy URL. Internal hash route to the Privacy Policy page; the
// banner both renders it as a real href and SPA-navigates on click.
const COOKIE_POLICY_HREF = '#privacy';
const COOKIE_POLICY_PAGE = 'privacy';

// ─── Storage helpers ─────────────────────────────────────────
function readConsent() {
  try {
    const raw = window.localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || (obj.choice !== 'accepted' && obj.choice !== 'declined')) return null;
    return obj;
  } catch (_) { return null; }
}

function writeConsent(choice) {
  const record = { choice, ts: Date.now() };
  try { window.localStorage.setItem(COOKIE_KEY, JSON.stringify(record)); } catch (_) {}
  return record;
}

// ─── Apply consent to non-essential trackers (Meta Pixel) ────
// `fresh` is true only for a brand-new "accept" click, so we fire the
// PageView that index.html deliberately withheld while consent was unknown.
// On reloads where consent was already 'accepted', index.html already fired
// PageView, so we re-grant idempotently without double-counting.
function applyConsent(choice, fresh) {
  try {
    if (typeof window.fbq === 'function') {
      if (choice === 'accepted') {
        window.fbq('consent', 'grant');
        if (fresh) window.fbq('track', 'PageView');
      } else {
        window.fbq('consent', 'revoke');
      }
    }
  } catch (_) { /* analytics must never throw */ }
}

// ─── window.DeltConsent — the public API + event bus ─────────
(function installConsentApi(window) {
  if (typeof window === 'undefined' || window.DeltConsent) return;

  function decide(choice, fresh) {
    if (choice !== 'accepted' && choice !== 'declined') return null;
    const record = writeConsent(choice);
    applyConsent(choice, fresh);
    try {
      window.dispatchEvent(new CustomEvent(COOKIE_EVENT, { detail: record }));
    } catch (_) {
      // Old browsers without the CustomEvent constructor.
      try {
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(COOKIE_EVENT, false, false, record);
        window.dispatchEvent(evt);
      } catch (__) {}
    }
    return record;
  }

  window.DeltConsent = {
    KEY: COOKIE_KEY,
    EVENT: COOKIE_EVENT,
    /** Current choice: 'accepted' | 'declined' | null (undecided). */
    get: function () { const c = readConsent(); return c ? c.choice : null; },
    /** Programmatically record a decision (fires the event + gating). */
    set: function (choice) { return decide(choice, true); },
    /** Re-open the consent banner so the visitor can change their mind. */
    open: function () {
      try { window.dispatchEvent(new CustomEvent(COOKIE_OPEN_EVENT)); } catch (_) {}
    },
    /** Subscribe to decisions. Returns an unsubscribe fn. */
    onChange: function (cb) {
      if (typeof cb !== 'function') return function () {};
      const handler = (e) => cb((e && e.detail) || readConsent());
      window.addEventListener(COOKIE_EVENT, handler);
      return function () { window.removeEventListener(COOKIE_EVENT, handler); };
    },
    _decide: decide,
  };

  // The system's own listener on accept/deny: keep tracker gating in sync
  // with the visitor's choice on every change (belt-and-suspenders alongside
  // the direct applyConsent call in decide()).
  window.addEventListener(COOKIE_EVENT, function (e) {
    const choice = e && e.detail && e.detail.choice;
    if (choice) applyConsent(choice, false);
  });
})(typeof window !== 'undefined' ? window : this);

// ─── Banner UI ───────────────────────────────────────────────
function V1CookieConsent({ onNav }) {
  useLang(); // re-render banner copy on language toggle
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Decide whether to show on first mount, and re-grant on reload.
  React.useEffect(() => {
    const existing = readConsent();
    if (existing) {
      applyConsent(existing.choice, false); // re-sync gating, no fresh PageView
    } else {
      // Small delay so the banner slides in after the page settles.
      const t = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, []);

  // Animate in whenever `open` flips true.
  React.useEffect(() => {
    if (!open) { setMounted(false); return undefined; }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);

  // Let DeltConsent.open() (e.g. the footer link) re-open the banner.
  React.useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(COOKIE_OPEN_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_OPEN_EVENT, reopen);
  }, []);

  const close = () => { setMounted(false); window.setTimeout(() => setOpen(false), 220); };
  const choose = (choice) => { window.DeltConsent._decide(choice, true); close(); };

  const onPolicy = (e) => {
    // SPA-navigate to the embedded policy URL, but keep it a real href so
    // it's crawlable / right-click-openable.
    if (onNav) { e.preventDefault(); onNav(COOKIE_POLICY_PAGE); }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('cookie.title')}
      data-v1-cookie-banner
      style={{
        position: 'fixed', left: 20, bottom: 20, zIndex: 60,
        width: 'min(420px, calc(100vw - 40px))',
        background: DELT.colors.card || '#FFFFFF',
        border: `1px solid ${DELT.colors.line}`,
        borderRadius: 16,
        boxShadow: '0 24px 60px rgba(4,20,48,0.28), 0 4px 12px rgba(4,20,48,0.12)',
        padding: 22,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 260ms cubic-bezier(0.22,1,0.36,1), transform 260ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span aria-hidden style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: `linear-gradient(135deg, ${DELT.colors.indigo}, #818CF8)`,
          color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${DELT.colors.indigo}44`,
        }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a8 8 0 108 8 3 3 0 01-3-3 3 3 0 01-3-3 3 3 0 01-2-2z" fill="currentColor" opacity="0.9"/>
            <circle cx="8" cy="9" r="1.1" fill="#fff"/>
            <circle cx="12" cy="12" r="1.1" fill="#fff"/>
            <circle cx="7.5" cy="13" r="0.9" fill="#fff"/>
          </svg>
        </span>
        <div style={{ fontFamily: DELT.font.display, fontWeight: 600, fontSize: 16, color: DELT.colors.ink, letterSpacing: '-0.01em' }}>
          {t('cookie.title')}
        </div>
      </div>

      <p style={{
        margin: '0 0 16px', fontFamily: DELT.font.body, fontSize: 13.5,
        lineHeight: 1.55, color: DELT.colors.inkSoft,
      }}>
        {t('cookie.body')}
        <a
          href={COOKIE_POLICY_HREF}
          onClick={onPolicy}
          style={{ color: DELT.colors.indigo, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 2 }}
        >{t('cookie.policy')}</a>.
      </p>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => choose('accepted')}
          style={{
            flex: '1 1 auto', minWidth: 130,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: DELT.colors.indigo, color: '#fff', border: 'none',
            padding: '12px 18px', borderRadius: 10, cursor: 'pointer',
            fontFamily: DELT.font.body, fontSize: 14, fontWeight: 600, lineHeight: 1,
            boxShadow: `0 6px 18px ${DELT.colors.indigo}44`,
            transition: 'transform 180ms, box-shadow 180ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 10px 24px ${DELT.colors.indigo}55`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 18px ${DELT.colors.indigo}44`; }}
        >{t('cookie.accept')}</button>
        <button
          onClick={() => choose('declined')}
          style={{
            flex: '0 1 auto',
            background: 'transparent', color: DELT.colors.ink,
            border: `1px solid ${DELT.colors.line}`,
            padding: '12px 18px', borderRadius: 10, cursor: 'pointer',
            fontFamily: DELT.font.body, fontSize: 14, fontWeight: 500, lineHeight: 1,
            transition: 'background 180ms, border-color 180ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = DELT.colors.paper || '#F5F3EE'; e.currentTarget.style.borderColor = DELT.colors.inkMute; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = DELT.colors.line; }}
        >{t('cookie.decline')}</button>
      </div>
    </div>
  );
}

Object.assign(window, { V1CookieConsent });
