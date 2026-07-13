// Manual overrides for phrases that translate badly when auto-batched.
// Runs after variation-1-phrase-dict.js. Any key here replaces the generated one.
//
// Reason a phrase lands here:
//   1. It's a sentence broken across multiple <span> or <br> nodes and the
//      concatenated translation reads unnatural. We hand-craft each fragment
//      so the concatenation matches Spanish word order.
//   2. It's a stat/label whose auto-translation is technically right but
//      stylistically off for the target audience (Miami-Florida merchants).
//   3. It's a very short one-word phrase whose auto-translation is wrong out
//      of context (e.g. "Soft" alone).
//
// Keep this file small and audited — every entry here overrides the batched
// LLM output.
(function () {
  if (!window.DELT_PHRASE_DICT) return;
  const D = window.DELT_PHRASE_DICT;

  const overrides = {
    // ── "Built for the / business you / built." hero (plaid-sections)
    // The three spans render on separate lines with a <br/> between; auto
    // translation produced "Diseñado para el / su negocio / construido."
    // which reads as "Designed for the / your business / built." in Spanish.
    // Fix to "Diseñado para el / negocio que / construyó." — natural word order.
    'Built for the': 'Diseñado para el',
    'business you': 'negocio que',
    'built.': 'construyó.',

    // ── Hero credit-pull stat: single word "Soft" (English) becomes "Blanda"
    // in the Wave 1 keyed dictionary; the DOM translator has no entry so it
    // was leaving "Soft" untouched in the network stats card.
    'Soft': 'Blanda',

    // ── "no impact" appears alone under the Soft stat.
    'no impact': 'sin impacto',

    // ── Split-headline overrides ─────────────────────────────────────────
    // Marketing headlines that split across <em>/<br> tags. Auto-batch
    // translated each fragment in isolation, producing bad Spanish word order.
    // We hand-craft each fragment so the concatenation reads naturally.

    // about.jsx <h2>: "Most lenders underwrite the past. Delt underwrites the next 90 days."
    'Most lenders': 'La mayoría de los prestamistas',
    'underwrite the': 'evalúa el',
    'past': 'pasado',
    'Delt underwrites the': 'Delt evalúa los',
    'next 90 days': 'próximos 90 días',

    // calculator.jsx <h1>: "See your funding estimate instantly."
    'See your funding estimate': 'Vea su estimación de financiamiento',
    'instantly.': 'al instante.',

    // faq.jsx <h1>: "What operators actually ask. Answered straight."
    'What operators': 'Lo que los operadores',
    'actually ask.': 'realmente preguntan.',
    'Answered straight.': 'Respondido sin rodeos.',

    // faq.jsx <h2>: "Got a question we didn't answer? Ask an actual person."
    "Got a question we didn't answer?": '¿Tiene una pregunta que no respondimos?',
    'Ask an actual person.': 'Pregúntele a una persona real.',

    // funding-flow.jsx <h1>: "Here's how your offer actually works."
    "Here's how": 'Así es como',
    'your offer': 'su oferta',
    'actually': 'realmente',
    'works.': 'funciona.',

    // howitworks.jsx <h1>: "From application to wire in 24 hours."
    // Actual DOM split: ["From application"] <br> ["to"] [" "] [<em>"wire"</em>] [" in 24 hours."]
    'From application': 'De la solicitud',
    'to': 'al',
    'wire': 'giro',
    'in 24 hours.': 'en 24 horas.',

    // howitworks.jsx subhead: "Four steps. No paperwork. … capital [and] merchant services—one stack, …"
    // Actual DOM split around <em>and</em>: [long lead … capital] [" "] ["and"] [" "] ["merchant services—…"]
    'Four steps. No paperwork. No phone tag. Built so a single review can clear you for capital':
      'Cuatro pasos. Sin papeleo. Sin llamadas de ida y vuelta. Diseñado para que una sola revisión lo apruebe para capital',
    'and': 'y',
    'merchant services—one stack, lower fees, three weeks faster than the bank route.':
      'servicios comerciales—una sola plataforma, comisiones más bajas, tres semanas más rápido que la vía bancaria.',

    // howitworks.jsx <h2>: "Faster because we are the lender."
    // JSX: "Faster because" <br> "we" <em>"are"</em> "the lender."
    'Faster because': 'Más rápido porque',
    'we': 'nosotros',
    'are': 'somos',
    'the lender.': 'el prestamista.',

    // howitworks.jsx <h2>: "One application. Two approvals."
    'One application.': 'Una solicitud.',
    'Two approvals.': 'Dos aprobaciones.',

    // howitworks.jsx <h2>: "Two minutes to apply. 24 hours to funds."
    'Two minutes to apply.': 'Dos minutos para solicitar.',
    '24 hours': '24 horas',
    'to funds.': 'hasta los fondos.',

    // processing.jsx <h1>: "Process payments with Delt Merchant Services. Unlock up to 2× more capital."
    'Process payments with': 'Procese pagos con',
    'Delt Merchant Services.': 'Delt Merchant Services.',
    'Unlock': 'Desbloquee',
    'up to 2× more capital.': 'hasta 2× más capital.',

    // support.jsx <h1>: "How can we help? No ticket queue."
    'How can we help?': '¿Cómo podemos ayudar?',
    'No ticket queue.': 'Sin cola de tickets.',

    // booking.jsx <h1>: "Talk to the underwriter who'd price your deal. Not a call center."
    // Note the JSX has "\n\n          who'd price your deal." (whitespace baked in)
    "Talk to the underwriter\n\n          who'd price your deal.":
      'Hable con el analista\n\n          que fijaría el precio de su operación.',
    'Not a call center.': 'No es un centro de llamadas.',

    // blog.jsx <h1>: "The Ledger. Notes on lending."
    'The Ledger.': 'The Ledger.',
    'Notes on': 'Notas sobre',
    'lending.': 'préstamos.',

    // blog.jsx <h2>: "The Floor Rate. Monthly letters from our lead underwriter."
    'The Floor Rate.': 'The Floor Rate.',
    'Monthly letters': 'Cartas mensuales',
    'from our lead underwriter.': 'de nuestro analista principal.',

    // blog.jsx <h2>: "One long read, a few short ones, most Wednesdays."
    'One long read, a few short ones,': 'Una lectura larga, unas cuantas cortas,',
    'most Wednesdays.': 'casi todos los miércoles.',

    // reviews.jsx <h1> / sections.jsx <h2>: "Straight from funded operators."
    // The reviews-page hero splits it across a <br/> ("Straight from" /
    // "funded operators."); the homepage section renders it as one node.
    'Straight from funded operators.': 'Directo de operadores financiados.',
    'Straight from': 'Directo de',
    'funded operators.': 'operadores financiados.',

    // about.jsx closing CTA buttons (V1CTASection overrides).
    'See my range': 'Ver mi rango',
    'Talk to an expert': 'Hablar con un experto',

    // ── Small caption / helper text the batch missed or got wrong.
    // (This one appears under the calculator's revenue input.)
    'Up to $250,000': 'Hasta $250,000',

    // ── Placeholder attributes (never made it into the batch because the
    // extractor only pulled visible innerText, not form <input placeholder>).
    'Search questions — e.g. factor rate, Plaid, collateral…':
      'Buscar preguntas — p. ej. tasa factor, Plaid, garantía…',
    'Select entity type': 'Seleccione tipo de entidad',
    'Select state': 'Seleccione estado',
    'First name': 'Nombre',
    'Business name': 'Nombre del negocio',
    'Business email': 'Correo empresarial',
    'Mobile number': 'Número móvil',
    'I applied last Tuesday and haven\'t heard back on my offer — can you check the status?':
      'Solicité el martes pasado y no he tenido respuesta sobre mi oferta — ¿podría revisar el estado?',

    // ── Wave 2b: bento hero + comparison + product-grid headline
    // sections.jsx <h2>: "Why Delt beats" <br/> "the bank."
    // Current dict gave "Por qué Delt es mejor / el banco" ("is better the bank").
    // Correct: "Delt le gana al banco" ("Delt beats the bank").
    'Why Delt beats': 'Delt le gana',
    'the bank.': 'al banco.',

    // plaid-sections.jsx <h2> (product grid): urgency headline. Single text node.
    "Don't wait on the bank.": 'No espere al banco.',

    // plaid-sections.jsx intelligent-finance banner — Delt-original copy
    // (was the near-verbatim Plaid "AI infrastructure / Explore intelligent
    // finance" wording). Both are single text nodes.
    'Underwriting that reads your revenue, not your credit.':
      'Evaluación basada en sus ingresos, no en su crédito.',
    'See how we underwrite': 'Vea cómo lo evaluamos',
    "Every day you wait is revenue you don't book. Capital wired in 24 hours — priced off your deposits, not your paperwork.":
      'Cada día que espera son ingresos que no factura. Capital transferido en 24 horas — evaluado por sus depósitos, no por su papeleo.',

    // Comparison intro paragraph (single text node)
    'Ten differences that show up the day you actually need capital — speed, paperwork, collateral, and how you pay it back. Delt terms; typical bank terms.':
      'Diez diferencias que aparecen el día que realmente necesita capital — velocidad, papeleo, garantías y cómo lo devuelve. Condiciones de Delt; condiciones típicas de un banco.',

    // Header subtitle above bank column
    'Typical terms': 'Condiciones típicas',

    // ── Comparison row labels (metric names)
    'Application process': 'Proceso de solicitud',
    'Max funding': 'Financiamiento máximo',
    'Funding term': 'Plazo de financiamiento',
    'Application requirements': 'Requisitos de solicitud',
    'Funding speed': 'Velocidad de financiamiento',
    'Repayment terms': 'Condiciones de pago',
    'Collateral': 'Garantía',
    'Use of funds': 'Uso de los fondos',
    'Cost of capital': 'Costo del capital',
    'Prepayment ability': 'Prepago',

    // ── Comparison row values — Delt column
    'Apply in 5 minutes. Decision in 24–48 hours.':
      'Solicite en 5 minutos. Decisión en 24–48 horas.',
    '$10,000 – $500,000': '$10,000 – $500,000',
    'Flexible, up to 18 months.': 'Flexible, hasta 18 meses.',
    '3–4 months of bank statements.': '3–4 meses de estados de cuenta.',
    'Next-day funding after approval.': 'Financiamiento al día siguiente de la aprobación.',
    'Flexible — a percentage of daily sales.': 'Flexible — un porcentaje de las ventas diarias.',
    'Not required.': 'No se requiere.',
    'No restrictions.': 'Sin restricciones.',
    'Factor rate; typically 0.18×–0.35× of the funded amount.':
      'Tasa factor; normalmente 0.18×–0.35× del monto financiado.',
    'Prepayment incentives; no penalties to prepay.':
      'Incentivos por prepago; sin penalidades por pagar antes.',

    // ── Comparison row values — Bank column
    'Detailed financial review; weeks of back-and-forth.':
      'Revisión financiera detallada; semanas de idas y venidas.',
    'Varies; depends on collateral and profile.':
      'Varía; depende de la garantía y el perfil.',
    'Bank-set; little room to negotiate.':
      'Fijado por el banco; poco margen para negociar.',
    'Bank statements + P&L / balance sheet + tax returns + projections.':
      'Estados de cuenta + estado de resultados / balance + declaraciones de impuestos + proyecciones.',
    'Several days to weeks after approval.':
      'Varios días a semanas después de la aprobación.',
    'Fixed monthly payments regardless of revenue.':
      'Pagos mensuales fijos sin importar los ingresos.',
    'Often required; secured by business or personal assets.':
      'Suele requerirse; garantizado con activos del negocio o personales.',
    'Restricted to specific approved uses.':
      'Restringido a usos específicos aprobados.',
    'Lower interest rates; total cost lower for qualified borrowers.':
      'Tasas de interés más bajas; costo total menor para prestatarios calificados.',
    'Often prepayment fees and penalties.':
      'A menudo con comisiones y penalidades por prepago.',

    // ── Win pills (right side of each Delt row)
    'minutes, not weeks': 'minutos, no semanas',
    'clear ceiling': 'techo claro',
    'you set the pace': 'usted marca el ritmo',
    'no file box': 'sin caja de archivos',
    'days, not weeks': 'días, no semanas',
    'slows when you do': 'baja cuando usted baja',
    'no lien on your life': 'sin gravamen sobre su vida',
    'spend as you see fit': 'gástelo como quiera',
    'priced for speed': 'precio por rapidez',
    'pay early, save': 'pague antes, ahorre',

    // ── Bottom result strip
    'Median time to funds': 'Tiempo mediano a los fondos',
    'vs weeks at a bank': 'vs. semanas en un banco',
    'per draw, revenue-based': 'por disposición, según ingresos',
    'Paperwork required': 'Papeleo requerido',
    'Plaid replaces the file box': 'Plaid reemplaza la caja de archivos',

    // Header cells
    'Metric': 'Métrica',
    'Traditional bank': 'Banco tradicional',
    'MCA · direct funder': 'MCA · financiador directo',
  };

  for (const k in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, k)) {
      D[k] = overrides[k];
    }
  }
})();
