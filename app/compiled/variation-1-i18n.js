(function () {
  const STORAGE_KEY = 'delt.lang';
  const EVENT_NAME = 'delt:lang';
  const DEFAULT = 'en';
  const dict = {
    'nav.how': {
      en: 'How It Works',
      es: 'Cómo Funciona'
    },
    'nav.calc': {
      en: 'Calculator',
      es: 'Calculadora'
    },
    'nav.processing': {
      en: 'Processing',
      es: 'Procesamiento'
    },
    'nav.about': {
      en: 'About',
      es: 'Nosotros'
    },
    'nav.reviews': {
      en: 'Operators',
      es: 'Clientes'
    },
    'nav.faq': {
      en: 'FAQ',
      es: 'Preguntas'
    },
    'nav.contact': {
      en: 'Contact',
      es: 'Contacto'
    },
    'nav.login': {
      en: 'Login',
      es: 'Iniciar sesión'
    },
    'cta.getFunded': {
      en: 'Get Funded',
      es: 'Solicitar fondos'
    },
    'cta.seePricing': {
      en: 'See how pricing works',
      es: 'Ver cómo funciona el precio'
    },
    'cta.talkToUw': {
      en: 'Talk to an underwriter',
      es: 'Hablar con un analista'
    },
    'cta.apply': {
      en: 'Apply',
      es: 'Aplicar'
    },
    'hero.line1': {
      en: 'You built the',
      es: 'Tú creaste el'
    },
    'hero.line2': {
      en: 'business.',
      es: 'negocio.'
    },
    'hero.line3.we': {
      en: 'We',
      es: 'Nosotros lo'
    },
    'hero.line3.fund': {
      en: 'fund',
      es: 'financiamos'
    },
    'hero.line3.it': {
      en: 'it.',
      es: '.'
    },
    'hero.subhead.a': {
      en: 'Funding from ',
      es: 'Financiamiento desde '
    },
    'hero.subhead.b': {
      en: ', underwritten off your deposits — not only FICO. Wired in ',
      es: ', evaluado según tus depósitos — no solo por FICO. Transferido en '
    },
    'hero.subhead.c': {
      en: '.',
      es: '.'
    },
    'hero.24h': {
      en: '24 hours',
      es: '24 horas'
    },
    'hero.stat.range': {
      en: 'Funding range',
      es: 'Monto del financiamiento'
    },
    'hero.stat.range.sub': {
      en: 'per draw',
      es: 'por disposición'
    },
    'hero.stat.time': {
      en: 'Time to funds',
      es: 'Tiempo de entrega'
    },
    'hero.stat.time.sub': {
      en: 'typical',
      es: 'típico'
    },
    'hero.stat.credit': {
      en: 'Credit pull',
      es: 'Consulta de crédito'
    },
    'hero.stat.credit.v': {
      en: 'Soft',
      es: 'Blanda'
    },
    'hero.stat.credit.sub': {
      en: 'no impact',
      es: 'sin impacto'
    },
    'foot.tagline': {
      en: 'Revenue-based funding for U.S. businesses. Direct lender. Equal-opportunity finance.',
      es: 'Financiamiento basado en ingresos para empresas en EE. UU. Prestamista directo. Igualdad de acceso al financiamiento.'
    },
    'foot.col.product': {
      en: 'Product',
      es: 'Producto'
    },
    'foot.col.company': {
      en: 'Company',
      es: 'Empresa'
    },
    'foot.col.res': {
      en: 'Resources',
      es: 'Recursos'
    },
    'foot.link.calc': {
      en: 'Calculator',
      es: 'Calculadora'
    },
    'foot.link.how': {
      en: 'How it works',
      es: 'Cómo funciona'
    },
    'foot.link.proc': {
      en: 'Processing',
      es: 'Procesamiento'
    },
    'foot.link.about': {
      en: 'About',
      es: 'Nosotros'
    },
    'foot.link.reviews': {
      en: 'Reviews',
      es: 'Reseñas'
    },
    'foot.link.faq': {
      en: 'FAQ',
      es: 'Preguntas frecuentes'
    },
    'foot.link.blog': {
      en: 'Blog',
      es: 'Blog'
    },
    'foot.link.support': {
      en: 'Support',
      es: 'Soporte'
    },
    'foot.legal': {
      en: '© 2026 Delt Capital, Inc. NMLS #—. California Finance Lender License #—.',
      es: '© 2026 Delt Capital, Inc. NMLS #—. Licencia de Prestamista Financiero de California #—.'
    },
    'foot.terms': {
      en: 'Terms of Use',
      es: 'Términos de uso'
    },
    'foot.privacy': {
      en: 'Privacy Policy',
      es: 'Política de privacidad'
    },
    'foot.eca': {
      en: 'Communications',
      es: 'Comunicaciones'
    },
    'foot.cookies': {
      en: 'Cookie preferences',
      es: 'Preferencias de cookies'
    },
    'cookie.title': {
      en: 'We use cookies',
      es: 'Usamos cookies'
    },
    'cookie.body': {
      en: 'We use cookies to run this site, remember your preferences, and measure our marketing. You can accept or decline non-essential cookies. See our ',
      es: 'Usamos cookies para operar el sitio, recordar tus preferencias y medir nuestro marketing. Puedes aceptar o rechazar las cookies no esenciales. Consulta nuestra '
    },
    'cookie.policy': {
      en: 'Cookie & Privacy Policy',
      es: 'Política de Cookies y Privacidad'
    },
    'cookie.accept': {
      en: 'Accept all',
      es: 'Aceptar todo'
    },
    'cookie.decline': {
      en: 'Decline',
      es: 'Rechazar'
    },
    'cookie.saved.on': {
      en: 'Cookies accepted',
      es: 'Cookies aceptadas'
    },
    'cookie.saved.off': {
      en: 'Only essential cookies',
      es: 'Solo cookies esenciales'
    },
    'lang.toggle.aria': {
      en: 'Change language',
      es: 'Cambiar idioma'
    },
    'lang.en': {
      en: 'EN',
      es: 'EN'
    },
    'lang.es': {
      en: 'ES',
      es: 'ES'
    }
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
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    try {
      if (document && document.documentElement) document.documentElement.lang = lang;
    } catch (e) {}
    window.dispatchEvent(new CustomEvent(EVENT_NAME, {
      detail: {
        lang
      }
    }));
  }
  function t(key, lang) {
    const entry = dict[key];
    if (!entry) return key;
    const use = lang === 'es' || lang === 'en' ? lang : getLang();
    return entry[use] || entry.en || key;
  }
  try {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = getLang();
    }
  } catch (e) {}
  window.DELT_I18N = {
    dict,
    getLang,
    setLang,
    t,
    STORAGE_KEY,
    EVENT_NAME
  };
})();
function useLang() {
  const [lang, setLangState] = React.useState(() => window.DELT_I18N.getLang());
  React.useEffect(() => {
    const onChange = e => setLangState(e.detail && e.detail.lang ? e.detail.lang : window.DELT_I18N.getLang());
    window.addEventListener(window.DELT_I18N.EVENT_NAME, onChange);
    return () => window.removeEventListener(window.DELT_I18N.EVENT_NAME, onChange);
  }, []);
  return [lang, window.DELT_I18N.setLang];
}
function t(key) {
  return window.DELT_I18N.t(key);
}
(function () {
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA']);
  const ATTR_TARGETS = ['placeholder', 'aria-label', 'alt', 'title'];
  const originals = new WeakMap();
  const attrOriginals = new WeakMap();
  let currentLang = 'en';
  let observer = null;
  let scheduled = false;
  const pendingNodes = new Set();
  const pendingElements = new Set();
  let ciIndex = null;
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
  function detectCase(s) {
    if (!s) return 'other';
    const letters = s.replace(/[^A-Za-z\u00C0-\u017F]+/g, '');
    if (!letters) return 'other';
    if (letters === letters.toUpperCase()) return 'upper';
    if (letters === letters.toLowerCase()) return 'lower';
    const words = s.trim().split(/\s+/).filter(Boolean);
    if (words.length && words.every(w => /^[^A-Za-z\u00C0-\u017F]*[A-Z\u00C0-\u017F]/.test(w))) return 'title';
    return 'other';
  }
  function toCase(s, mode) {
    if (!s) return s;
    if (mode === 'upper') return s.toUpperCase();
    if (mode === 'lower') return s.toLowerCase();
    if (mode === 'title') {
      return s.replace(/([^\s]+)/g, w => {
        return w.replace(/^([^A-Za-z\u00C0-\u017F]*)([A-Za-z\u00C0-\u017F])/, (m, p, c) => p + c.toUpperCase());
      });
    }
    return s;
  }
  function lookupCore(text) {
    if (!text) return null;
    const d = dict();
    if (Object.prototype.hasOwnProperty.call(d, text)) {
      return {
        es: d[text],
        sourceKey: text
      };
    }
    const ci = buildCiIndex();
    const lower = text.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(ci, lower)) {
      const es = ci[lower];
      const inputCase = detectCase(text);
      return {
        es: toCase(es, inputCase),
        sourceKey: text
      };
    }
    return null;
  }
  function lookup(text) {
    if (!text) return null;
    let hit = lookupCore(text);
    if (hit) return hit.es;
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
      const translated = lookup(raw);
      if (translated && translated !== raw) {
        if (!originals.has(node)) originals.set(node, raw);
        node.nodeValue = translated;
      }
    } else {
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
          if (!store) {
            store = {};
            attrOriginals.set(el, store);
          }
          if (!(attr in store)) store[attr] = cur;
          el.setAttribute(attr, translated);
        }
      } else {
        const store = attrOriginals.get(el);
        if (store && attr in store) {
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
      }
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
    const idle = window.requestIdleCallback || function (fn) {
      return setTimeout(fn, 16);
    };
    idle(flushPending, {
      timeout: 100
    });
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
            if (n.nodeType === 1) pendingElements.add(n);else if (n.nodeType === 3) pendingNodes.add(n);
          }
        } else if (m.type === 'characterData') {
          if (m.target && m.target.nodeType === 3) {
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
      attributeFilter: ATTR_TARGETS
    });
  }
  function boot() {
    const initial = window.DELT_I18N && window.DELT_I18N.getLang && window.DELT_I18N.getLang() || 'en';
    currentLang = initial;
    startObserver();
    if (initial === 'es') retranslateWholePage('es');
  }
  window.addEventListener('delt:lang', function (e) {
    const lang = e && e.detail && e.detail.lang || 'en';
    retranslateWholePage(lang);
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, {
      once: true
    });
  } else {
    boot();
  }
  window.DELT_DOM_I18N = {
    retranslate: function () {
      retranslateWholePage(currentLang);
    },
    getCurrentLang: function () {
      return currentLang;
    },
    dictSize: function () {
      return Object.keys(dict()).length;
    }
  };
})();
function V1LangToggle({
  compact
}) {
  const [lang, setLang] = useLang();
  const isEs = lang === 'es';
  const height = compact ? 30 : 32;
  return React.createElement("div", {
    role: "group",
    "aria-label": window.DELT_I18N.t('lang.toggle.aria'),
    style: {
      display: 'inline-flex',
      alignItems: 'stretch',
      background: 'rgba(247,245,240,0.06)',
      border: '1px solid rgba(247,245,240,0.18)',
      borderRadius: 999,
      padding: 2,
      height,
      fontFamily: DELT.font.mono,
      fontSize: 11,
      letterSpacing: '0.08em'
    }
  }, [{
    code: 'en',
    label: 'EN'
  }, {
    code: 'es',
    label: 'ES'
  }].map(opt => {
    const active = opt.code === 'es' === isEs;
    return React.createElement("button", {
      key: opt.code,
      type: "button",
      onClick: () => setLang(opt.code),
      "aria-pressed": active,
      style: {
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
        transition: 'background 160ms ease, color 160ms ease'
      }
    }, opt.label);
  }));
}