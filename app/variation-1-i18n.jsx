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
// V1LangToggle — pill-shaped EN | ES switch. Placed in the top nav so a
// Spanish-speaking merchant sees it immediately without hunting.
// ============================================================================
function V1LangToggle({ compact }) {
  const [lang, setLang] = useLang();
  const isEs = lang === 'es';
  const height = compact ? 30 : 32;
  return (
    <div
      role="group"
      aria-label={window.DELT_I18N.t('lang.toggle.aria')}
      style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        background: 'rgba(247,245,240,0.06)',
        border: '1px solid rgba(247,245,240,0.18)',
        borderRadius: 999,
        padding: 2,
        height,
        fontFamily: DELT.font.mono,
        fontSize: 11,
        letterSpacing: '0.08em',
      }}
    >
      {[
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
      ].map((opt) => {
        const active = (opt.code === 'es') === isEs;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLang(opt.code)}
            aria-pressed={active}
            style={{
              border: 'none',
              cursor: 'pointer',
              minWidth: 32,
              padding: '0 10px',
              borderRadius: 999,
              background: active ? '#F7F5F0' : 'transparent',
              color: active ? DELT.colors.ink : 'rgba(247,245,240,0.75)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              letterSpacing: 'inherit',
              fontWeight: 600,
              transition: 'background 160ms ease, color 160ms ease',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
