// ============================================================================
// i18n — English / Spanish (neutral Latin-American) toggle
// ----------------------------------------------------------------------------
// Wave 1 scope: hero, top nav, primary CTAs, footer, tagline. Additional
// surfaces are added by extending DELT_I18N.dict and swapping strings to t(key)
// in the corresponding component. The toggle persists in localStorage under
// 'delt.lang' and notifies subscribers via a 'delt:lang' window event so any
// consumer that reads via the useLang() hook re-renders on change.
//
// Spanish rules for this dictionary:
//   • Neutral Latin-American register (no "vosotros", no regionalisms).
//   • Business-friendly (Miami-Florida merchant audience — English is common,
//     but a Spanish-speaking owner should recognize every word).
//   • Numbers, currency, and dollar amounts stay as-is ($5K, $500K, 24h).
//   • Brand words stay untranslated: Delt, Delt Capital, Plaid, FICO, Venmo,
//     Robinhood, Chime.
// ============================================================================

(function () {
  const STORAGE_KEY = 'delt.lang';
  const EVENT_NAME = 'delt:lang';
  const DEFAULT = 'en';

  const dict = {
    // ── Top navigation ────────────────────────────────────────────────────
    'nav.how':          { en: 'How It Works',   es: 'Cómo Funciona' },
    'nav.calc':         { en: 'Calculator',     es: 'Calculadora' },
    'nav.processing':   { en: 'Processing',     es: 'Procesamiento' },
    'nav.about':        { en: 'About',          es: 'Nosotros' },
    'nav.reviews':      { en: 'Operators',      es: 'Clientes' },
    'nav.faq':          { en: 'FAQ',            es: 'Preguntas' },
    'nav.contact':      { en: 'Contact',        es: 'Contacto' },
    'nav.login':        { en: 'Login',          es: 'Iniciar sesión' },

    // ── Primary CTAs ──────────────────────────────────────────────────────
    'cta.getFunded':    { en: 'Get Funded',              es: 'Solicitar fondos' },
    'cta.seePricing':   { en: 'See how pricing works',   es: 'Ver cómo funciona el precio' },
    'cta.talkToUw':     { en: 'Talk to an underwriter',  es: 'Hablar con un analista' },
    'cta.apply':        { en: 'Apply',                    es: 'Aplicar' },
    // Live-agent CTA — number is a real staffed line; keep the digits identical
    // across languages (only the label translates).
    'cta.liveAgent':    { en: 'Speak to a live agent',   es: 'Hablar con un agente en vivo' },
    'cta.liveAgent.aria': { en: 'Speak to a live agent at (864) 729-3358', es: 'Hablar con un agente en vivo al (864) 729-3358' },

    // ── Hero ──────────────────────────────────────────────────────────────
    'hero.line1':       { en: 'You built the',           es: 'Tú creaste el' },
    'hero.line2':       { en: 'business.',                es: 'negocio.' },
    'hero.line3.we':    { en: 'We',                      es: 'Nosotros lo' },
    'hero.line3.fund':  { en: 'fund',                    es: 'financiamos' },
    'hero.line3.it':    { en: 'it.',                     es: '.' },
    'hero.subhead.a':   { en: 'Funding from ',                                      es: 'Financiamiento desde ' },
    'hero.subhead.b':   { en: ', underwritten off your deposits — not only FICO. Wired in ', es: ', evaluado según tus depósitos — no solo por FICO. Transferido en ' },
    'hero.subhead.c':   { en: '.',                                                  es: '.' },
    'hero.24h':         { en: '24 hours',                                           es: '24 horas' },
    'hero.stat.range':  { en: 'Funding range',           es: 'Monto del financiamiento' },
    'hero.stat.range.sub': { en: 'per draw',              es: 'por disposición' },
    'hero.stat.time':   { en: 'Time to funds',           es: 'Tiempo de entrega' },
    'hero.stat.time.sub': { en: 'typical',                es: 'típico' },
    'hero.stat.credit': { en: 'Credit pull',             es: 'Consulta de crédito' },
    'hero.stat.credit.v': { en: 'Soft',                   es: 'Blanda' },
    'hero.stat.credit.sub': { en: 'no impact',            es: 'sin impacto' },

    // ── Footer ────────────────────────────────────────────────────────────
    'foot.tagline':     { en: 'Revenue-based funding for U.S. businesses. Direct lender. Equal-opportunity finance.',
                          es: 'Financiamiento basado en ingresos para empresas en EE. UU. Prestamista directo. Igualdad de acceso al financiamiento.' },
    'foot.col.product': { en: 'Product',                 es: 'Producto' },
    'foot.col.company': { en: 'Company',                 es: 'Empresa' },
    'foot.col.res':     { en: 'Resources',               es: 'Recursos' },
    'foot.link.calc':   { en: 'Calculator',              es: 'Calculadora' },
    'foot.link.how':    { en: 'How it works',            es: 'Cómo funciona' },
    'foot.link.proc':   { en: 'Processing',              es: 'Procesamiento' },
    'foot.link.about':  { en: 'About',                   es: 'Nosotros' },
    'foot.link.reviews':{ en: 'Reviews',                 es: 'Reseñas' },
    'foot.link.faq':    { en: 'FAQ',                     es: 'Preguntas frecuentes' },
    'foot.link.blog':   { en: 'Blog',                    es: 'Blog' },
    'foot.link.support':{ en: 'Support',                 es: 'Soporte' },
    'foot.legal':       { en: '© 2026 Delt Capital, Inc. NMLS #—. California Finance Lender License #—.',
                          es: '© 2026 Delt Capital, Inc. NMLS #—. Licencia de Prestamista Financiero de California #—.' },
    'foot.terms':       { en: 'Terms of Use',            es: 'Términos de uso' },
    'foot.privacy':     { en: 'Privacy Policy',          es: 'Política de privacidad' },
    'foot.eca':         { en: 'Communications',          es: 'Comunicaciones' },
    'foot.cookies':     { en: 'Cookie preferences',      es: 'Preferencias de cookies' },

    // ── Cookie consent ────────────────────────────────────────────────────
    'cookie.title':     { en: 'We use cookies',
                          es: 'Usamos cookies' },
    'cookie.body':      { en: 'We use cookies to run this site, remember your preferences, and measure our marketing. You can accept or decline non-essential cookies. See our ',
                          es: 'Usamos cookies para operar el sitio, recordar tus preferencias y medir nuestro marketing. Puedes aceptar o rechazar las cookies no esenciales. Consulta nuestra ' },
    'cookie.policy':    { en: 'Cookie & Privacy Policy',  es: 'Política de Cookies y Privacidad' },
    'cookie.accept':    { en: 'Accept all',               es: 'Aceptar todo' },
    'cookie.decline':   { en: 'Decline',                  es: 'Rechazar' },
    'cookie.saved.on':  { en: 'Cookies accepted',         es: 'Cookies aceptadas' },
    'cookie.saved.off': { en: 'Only essential cookies',   es: 'Solo cookies esenciales' },

    // ── Language toggle labels (self-referential; do not translate names) ──
    'lang.toggle.aria': { en: 'Change language',         es: 'Cambiar idioma' },
    'lang.en':          { en: 'EN',                      es: 'EN' },
    'lang.es':          { en: 'ES',                      es: 'ES' },
  };

  function getLang() {
    if (typeof window === 'undefined') return DEFAULT;
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      return v === 'es' || v === 'en' ? v : DEFAULT;
    } catch (e) {
      return DEFAULT;
    }
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'es') return;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    try {
      if (document && document.documentElement) document.documentElement.lang = lang;
    } catch (e) { /* ignore */ }
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { lang } }));
  }

  function t(key, lang) {
    const entry = dict[key];
    if (!entry) return key;
    const use = (lang === 'es' || lang === 'en') ? lang : getLang();
    return entry[use] || entry.en || key;
  }

  // Set <html lang> on initial load.
  try {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = getLang();
    }
  } catch (e) { /* ignore */ }

  window.DELT_I18N = { dict, getLang, setLang, t, STORAGE_KEY, EVENT_NAME };
})();

// React hook that returns the current language and re-renders when it changes.
// Consumers call: const [lang, setLang] = useLang();  const text = t('nav.how');
function useLang() {
  const [lang, setLangState] = React.useState(() => window.DELT_I18N.getLang());
  React.useEffect(() => {
    const onChange = (e) => setLangState(e.detail && e.detail.lang ? e.detail.lang : window.DELT_I18N.getLang());
    window.addEventListener(window.DELT_I18N.EVENT_NAME, onChange);
    return () => window.removeEventListener(window.DELT_I18N.EVENT_NAME, onChange);
  }, []);
  return [lang, window.DELT_I18N.setLang];
}

// Convenience wrapper — always uses the current global lang.
function t(key) { return window.DELT_I18N.t(key); }

// ============================================================================
// Wave 2 — DomTranslator
// ----------------------------------------------------------------------------
// Walks live text nodes (and a handful of translatable attributes) across the
// entire page and swaps English → Spanish using window.DELT_PHRASE_DICT.
//
// Why a DOM-level translator instead of per-string t() swaps: the site has
// 1,000+ visible phrases across 14 JSX modules with a lot of copy inside deeply
// nested layout markup. Hand-swapping every literal is fragile and easy to
// regress. A DOM translator lets the JSX stay in English (developer default,
// clean diffs) and only produces Spanish at render time — cached and reversible.
//
// Design notes:
//   • The dictionary lives in variation-1-phrase-dict.js (window.DELT_PHRASE_DICT).
//   • For each translated text node we store the original in a WeakMap so we
//     can perfectly restore EN when the user flips back.
//   • A MutationObserver on <body> catches new nodes rendered by React after
//     route changes, tabs, form transitions, etc.
//   • We also translate translatable attributes: placeholder, aria-label, alt,
//     title, and <input value>/<button value> when it's a static label.
//   • Skips <script>, <style>, <code>, <pre>, <textarea>, contentEditable, and
//     any element carrying data-no-i18n (or inside one).
//   • Skips text nodes inside contentEditable trees so calculator inputs, etc.,
//     are never rewritten.
// ============================================================================
(function () {
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA']);
  const ATTR_TARGETS = ['placeholder', 'aria-label', 'alt', 'title'];
  const originals = new WeakMap();       // Text node -> original EN string
  const attrOriginals = new WeakMap();   // Element -> { attr: originalValue }
  let currentLang = 'en';
  let observer = null;
  let scheduled = false;
  const pendingNodes = new Set();
  const pendingElements = new Set();

  let ciIndex = null; // lowercase(EN) -> ES  (built lazily)

  function dict() {
    return window.DELT_PHRASE_DICT || {};
  }

  function buildCiIndex() {
    if (ciIndex) return ciIndex;
    ciIndex = Object.create(null);
    const d = dict();
    for (const k in d) {
      if (Object.prototype.hasOwnProperty.call(d, k)) {
        ciIndex[k.toLowerCase()] = d[k];
      }
    }
    return ciIndex;
  }

  // Detect the visual casing of the input so we can output ES in the same shape.
  // The site uses `text-transform: uppercase` for many small labels; the underlying
  // JSX often stores them Title Case ("Ready to fund"). We match case-insensitively
  // and preserve the original visual casing on output.
  function detectCase(s) {
    if (!s) return 'other';
    // Consider only letters when deciding.
    const letters = s.replace(/[^A-Za-z\u00C0-\u017F]+/g, '');
    if (!letters) return 'other';
    if (letters === letters.toUpperCase()) return 'upper';
    if (letters === letters.toLowerCase()) return 'lower';
    // Title-case-ish: every whitespace-separated word starts with uppercase.
    const words = s.trim().split(/\s+/).filter(Boolean);
    if (words.length && words.every(w => /^[^A-Za-z\u00C0-\u017F]*[A-Z\u00C0-\u017F]/.test(w))) return 'title';
    return 'other';
  }

  function toCase(s, mode) {
    if (!s) return s;
    if (mode === 'upper') return s.toUpperCase();
    if (mode === 'lower') return s.toLowerCase();
    if (mode === 'title') {
      return s.replace(/([^\s]+)/g, (w) => {
        // Preserve leading punctuation, then upper-case first letter.
        return w.replace(/^([^A-Za-z\u00C0-\u017F]*)([A-Za-z\u00C0-\u017F])/, (m, p, c) => p + c.toUpperCase());
      });
    }
    return s;
  }

  function lookupCore(text) {
    if (!text) return null;
    const d = dict();
    if (Object.prototype.hasOwnProperty.call(d, text)) {
      return { es: d[text], sourceKey: text };
    }
    const ci = buildCiIndex();
    const lower = text.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(ci, lower)) {
      // Case-insensitive hit. Match the case of the input to the output so a
      // page like "READY TO FUND" (which comes through as "Ready to fund" in
      // textContent but is uppercased via CSS) stays displayed correctly if the
      // uppercase transform is removed later.
      const es = ci[lower];
      const inputCase = detectCase(text);
      return { es: toCase(es, inputCase), sourceKey: text };
    }
    return null;
  }

  function lookup(text) {
    if (!text) return null;
    // Try as-is
    let hit = lookupCore(text);
    if (hit) return hit.es;
    // Try trimmed — preserve leading/trailing whitespace on the way back
    const trimmed = text.trim();
    if (trimmed && trimmed !== text) {
      hit = lookupCore(trimmed);
      if (hit) {
        const lead = text.match(/^\s*/)[0];
        const trail = text.match(/\s*$/)[0];
        return lead + hit.es + trail;
      }
    }
    return null;
  }

  function isSkippable(node) {
    let el = node.nodeType === 1 ? node : node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.hasAttribute && el.hasAttribute('data-no-i18n')) return true;
      if (el.isContentEditable) return true;
      el = el.parentElement;
    }
    return false;
  }

  function translateTextNode(node, lang) {
    if (!node || node.nodeType !== 3) return;
    if (isSkippable(node)) return;
    const raw = node.nodeValue;
    if (!raw || !raw.trim()) return;

    if (lang === 'es') {
      // Cache original on first translation attempt (only if we actually change it).
      const translated = lookup(raw);
      if (translated && translated !== raw) {
        if (!originals.has(node)) originals.set(node, raw);
        node.nodeValue = translated;
      }
    } else {
      // Restore.
      if (originals.has(node)) {
        node.nodeValue = originals.get(node);
      }
    }
  }

  function translateAttrs(el, lang) {
    if (!el || el.nodeType !== 1) return;
    if (isSkippable(el)) return;
    for (let i = 0; i < ATTR_TARGETS.length; i++) {
      const attr = ATTR_TARGETS[i];
      if (!el.hasAttribute(attr)) continue;
      const cur = el.getAttribute(attr);
      if (!cur || !cur.trim()) continue;
      if (lang === 'es') {
        const translated = lookup(cur);
        if (translated && translated !== cur) {
          let store = attrOriginals.get(el);
          if (!store) { store = {}; attrOriginals.set(el, store); }
          if (!(attr in store)) store[attr] = cur;
          el.setAttribute(attr, translated);
        }
      } else {
        const store = attrOriginals.get(el);
        if (store && (attr in store)) {
          el.setAttribute(attr, store[attr]);
        }
      }
    }
  }

  function walkAndTranslate(root, lang) {
    if (!root) return;
    if (root.nodeType === 3) {
      translateTextNode(root, lang);
      return;
    }
    if (root.nodeType !== 1) return;
    if (isSkippable(root)) return;

    translateAttrs(root, lang);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType === 3) return NodeFilter.FILTER_ACCEPT;
        if (n.nodeType === 1) {
          if (SKIP_TAGS.has(n.tagName)) return NodeFilter.FILTER_REJECT;
          if (n.hasAttribute && n.hasAttribute('data-no-i18n')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    });
    let cur = walker.nextNode();
    while (cur) {
      if (cur.nodeType === 3) {
        translateTextNode(cur, lang);
      } else if (cur.nodeType === 1) {
        translateAttrs(cur, lang);
      }
      cur = walker.nextNode();
    }
  }

  function flushPending() {
    scheduled = false;
    const lang = currentLang;
    // Elements first (they carry attrs) — then their descendants get walked too.
    pendingElements.forEach(function (el) {
      if (el.isConnected) walkAndTranslate(el, lang);
    });
    pendingElements.clear();
    pendingNodes.forEach(function (n) {
      if (n.isConnected) translateTextNode(n, lang);
    });
    pendingNodes.clear();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    const idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 16); };
    idle(flushPending, { timeout: 100 });
  }

  function retranslateWholePage(lang) {
    currentLang = lang;
    if (document.body) walkAndTranslate(document.body, lang);
  }

  function startObserver() {
    if (observer || !document.body) return;
    observer = new MutationObserver(function (mutations) {
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j++) {
            const n = m.addedNodes[j];
            if (n.nodeType === 1) pendingElements.add(n);
            else if (n.nodeType === 3) pendingNodes.add(n);
          }
        } else if (m.type === 'characterData') {
          if (m.target && m.target.nodeType === 3) {
            // React updated the text content — invalidate cached original so
            // we don't restore stale EN when the user flips back.
            if (originals.has(m.target)) originals.delete(m.target);
            pendingNodes.add(m.target);
          }
        } else if (m.type === 'attributes' && m.target && m.target.nodeType === 1) {
          pendingElements.add(m.target);
        }
      }
      if (currentLang === 'es') schedule();
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTR_TARGETS,
    });
  }

  function boot() {
    const initial = (window.DELT_I18N && window.DELT_I18N.getLang && window.DELT_I18N.getLang()) || 'en';
    currentLang = initial;
    startObserver();
    if (initial === 'es') retranslateWholePage('es');
  }

  window.addEventListener('delt:lang', function (e) {
    const lang = (e && e.detail && e.detail.lang) || 'en';
    retranslateWholePage(lang);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  // Expose small debug surface
  window.DELT_DOM_I18N = {
    retranslate: function () { retranslateWholePage(currentLang); },
    getCurrentLang: function () { return currentLang; },
    dictSize: function () { return Object.keys(dict()).length; },
  };
})();

// ============================================================================
// V1LangToggle — pill-shaped EN | ES switch. Placed in the top nav so a
// Spanish-speaking merchant sees it immediately without hunting.
// ============================================================================
function V1LangToggle({ compact }) {
  const [lang, setLang] = useLang();
  const isEs = lang === 'es';
  const height = compact ? 32 : 34;
  // Full language names read far clearer than the old bare "EN | ES" pill.
  // A leading globe icon signals "language" at a glance, and the active
  // segment is a solid high-contrast fill so which language is selected is
  // never ambiguous.
  return (
    <div
      role="group"
      aria-label={window.DELT_I18N.t('lang.toggle.aria')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(247,245,240,0.06)',
        border: '1px solid rgba(247,245,240,0.28)',
        borderRadius: 999,
        padding: '2px 2px 2px 9px',
        height,
        fontFamily: DELT.font.mono,
        fontSize: 12,
        letterSpacing: '0.06em',
      }}
    >
      {/* Globe glyph — communicates "language selector" without extra copy. */}
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        style={{ flexShrink: 0, color: 'rgba(247,245,240,0.75)' }}
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.1" />
        <path
          d="M8 1.75c1.8 1.6 2.7 3.75 2.7 6.25S9.8 12.65 8 14.25C6.2 12.65 5.3 10.5 5.3 8S6.2 3.35 8 1.75ZM2 8h12"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ display: 'inline-flex', alignItems: 'stretch', height: height - 6 }}>
        {[
          { code: 'en', label: 'EN', full: 'English' },
          { code: 'es', label: 'ES', full: 'Español' },
        ].map((opt) => {
          const active = (opt.code === 'es') === isEs;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLang(opt.code)}
              aria-pressed={active}
              aria-label={opt.full}
              title={opt.full}
              style={{
                border: 'none',
                cursor: 'pointer',
                minWidth: 34,
                padding: '0 11px',
                borderRadius: 999,
                background: active ? '#F7F5F0' : 'transparent',
                color: active ? DELT.colors.ink : 'rgba(247,245,240,0.68)',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                fontWeight: 700,
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.25)' : 'none',
                transition: 'background 160ms ease, color 160ms ease',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
