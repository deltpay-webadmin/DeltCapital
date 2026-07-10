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

    // blog.jsx <h1>: "The Ledger. Published notes from the desk."
    'The Ledger.': 'The Ledger.',
    'Published notes': 'Notas publicadas',
    'from the desk.': 'desde la mesa.',

    // blog.jsx <h2>: "The Floor Rate. Monthly letters from our lead underwriter."
    'The Floor Rate.': 'The Floor Rate.',
    'Monthly letters': 'Cartas mensuales',
    'from our lead underwriter.': 'de nuestro analista principal.',

    // blog.jsx <h2>: "One long read, a few short ones, most Wednesdays."
    'One long read, a few short ones,': 'Una lectura larga, unas cuantas cortas,',
    'most Wednesdays.': 'casi todos los miércoles.',

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
    'Underwriting that reads your revenue, not only your credit.':
      'Evaluación basada en sus ingresos, no solo en su crédito.',
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

    // ── Full ES: Lending / Terminals / Speed / Eligibility pages
    "Vol. X · Lending": "Vol. X · Financiamiento",
    "The whole lending stack": "Toda la estructura de financiamiento",
    "Lines, loans,": "Líneas, préstamos,",
    "and every way to": "y todas las formas de",
    "borrow.": "pedir prestado.",
    "A revolving line for the day-to-day. A": "Una línea revolvente para el día a día. Un",
    "term loan with simple interest": "préstamo a plazo con interés simple",
    "for the big build-out. A revenue-based advance when speed matters most. Equipment and SBA-style financing when you're buying to grow. One desk, every structure — and each priced to beat the bank.": "para la gran expansión. Un adelanto basado en ingresos cuando la rapidez importa más. Financiamiento de equipo y estilo SBA cuando compra para crecer. Un solo escritorio, todas las estructuras — y cada una con precio para superar al banco.",
    "Find my structure": "Encontrar mi estructura",
    "Talk to a specialist →": "Hablar con un especialista →",
    "Products": "Productos",
    "ways to borrow": "formas de pedir prestado",
    "Range": "Rango",
    "across the stack": "en toda la estructura",
    "Up to 18mo": "Hasta 18 meses",
    "Prepay penalty": "Penalización por pago anticipado",
    "on every product": "en todos los productos",
    "Pick your structure": "Elija su estructura",
    "Four ways to borrow. One underwriting desk.": "Cuatro formas de pedir prestado. Un solo escritorio de evaluación.",
    "Not sure which fits? Apply once and we'll range every structure your file qualifies for — you pick.": "¿No sabe cuál le conviene? Solicite una vez y le mostraremos el rango de cada estructura para la que califica su expediente — usted elige.",
    "Revolving": "Revolvente",
    "Line of credit": "Línea de crédito",
    "A revolving limit you draw against on demand and only pay for what you use. Refills as you repay — capital that's always on standby for payroll, inventory, or a slow week.": "Un límite revolvente del que dispone a demanda y solo paga por lo que usa. Se recarga a medida que paga — capital siempre disponible para la nómina, el inventario o una semana floja.",
    "from": "desde",
    "12.5% APR bank line": "línea bancaria 12.5% APR",
    "Draw only what you need": "Disponga solo de lo que necesita",
    "Interest on the drawn balance only": "Interés solo sobre el saldo dispuesto",
    "No covenants, no annual review": "Sin cláusulas restrictivas, sin revisión anual",
    "Limits from $25K to $500K": "Límites de $25K a $500K",
    "Fixed": "Fijo",
    "Term loan": "Préstamo a plazo",
    "A lump sum with simple, fixed interest and a set monthly payment. Best when you know the number and want a predictable payoff — a renovation, an acquisition, a debt consolidation.": "Una suma global con interés simple y fijo y un pago mensual establecido. Ideal cuando conoce la cifra y quiere un pago predecible — una renovación, una adquisición, una consolidación de deuda.",
    "fixed": "fijo",
    "Simple interest": "Interés simple",
    "Variable + origination fees": "Variable + comisiones de originación",
    "One fixed monthly payment": "Un pago mensual fijo",
    "Simple interest — no compounding": "Interés simple — sin capitalización",
    "Terms of 6 to 18 months": "Plazos de 6 a 18 meses",
    "Pay off early, save the unearned interest": "Pague por adelantado y ahorre el interés no devengado",
    "Fastest": "Más rápido",
    "Revenue-based advance": "Adelanto basado en ingresos",
    "Capital priced off your deposits, repaid as a small percentage of daily sales. Repayment flexes with your revenue — slow week, smaller payment. The 24-hour option when speed wins.": "Capital calculado según sus depósitos, que se paga como un pequeño porcentaje de las ventas diarias. El pago se ajusta a sus ingresos — semana floja, pago menor. La opción de 24 horas cuando gana la rapidez.",
    "one flat": "tarifa única",
    "Weeks of underwriting": "Semanas de evaluación",
    "Funded in 24 hours": "Financiado en 24 horas",
    "Repayment flexes with sales": "El pago se ajusta a las ventas",
    "Soft pull, no FICO gate": "Consulta suave, sin filtro de FICO",
    "Renew as you grow": "Renueve a medida que crece",
    "Asset-backed": "Respaldado por activos",
    "Equipment & SBA-style": "Equipo y estilo SBA",
    "Financing secured by what you're buying — terminals, vehicles, kitchen build-outs — or longer-horizon, SBA-style capital for a larger expansion. Lower rates, longer terms, more room.": "Financiamiento garantizado por lo que compra — terminales, vehículos, remodelaciones de cocina — o capital estilo SBA a más largo plazo para una expansión mayor. Tasas más bajas, plazos más largos, más margen.",
    "lower": "más bajo",
    "Asset-secured": "Garantizado por activos",
    "Months at the SBA desk": "Meses en el escritorio de la SBA",
    "Finance the asset you're buying": "Financie el activo que compra",
    "Longer terms for bigger projects": "Plazos más largos para proyectos mayores",
    "Own or lease structures": "Estructuras de compra o arrendamiento",
    "Fast pre-qualification": "Precalificación rápida",
    "Interest vs. factor": "Interés vs. factor",
    "Two ways to price capital. Both plainly stated.": "Dos formas de fijar el precio del capital. Ambas expresadas con claridad.",
    "A term loan charges simple interest on the balance — pay it down and you pay less. An advance uses one flat factor with revenue-based repayment. No product on our sheet compounds, and none carries a prepayment penalty.": "Un préstamo a plazo cobra interés simple sobre el saldo — páguelo y paga menos. Un adelanto usa un factor único con pago basado en ingresos. Ningún producto de nuestra lista capitaliza, y ninguno lleva penalización por pago anticipado.",
    "Loans with interest": "Préstamos con interés",
    "Simple interest, fixed payment": "Interés simple, pago fijo",
    "Priced on": "Calculado sobre",
    "Outstanding balance": "Saldo pendiente",
    "Rate type": "Tipo de tasa",
    "Simple — never compounds": "Simple — nunca capitaliza",
    "Payment": "Pago",
    "Fixed monthly": "Mensual fijo",
    "Early payoff": "Pago anticipado",
    "Saves the unearned interest": "Ahorra el interés no devengado",
    "One factor, flexible repay": "Un factor, pago flexible",
    "Total funded amount": "Monto total financiado",
    "One flat factor rate": "Una tasa de factor única",
    "% of daily sales — flexes": "% de las ventas diarias — se ajusta",
    "Pro-rata rebate on the factor": "Reembolso prorrateado sobre el factor",
    "Which is right for me?": "¿Cuál es la adecuada para mí?",
    "Start with the job to be done.": "Comience por el objetivo a lograr.",
    "Cover payroll or a slow week": "Cubrir la nómina o una semana floja",
    "Fund a renovation or acquisition": "Financiar una renovación o adquisición",
    "Get cash in 24 hours": "Obtener efectivo en 24 horas",
    "Buy terminals, vehicles, or equipment": "Comprar terminales, vehículos o equipo",
    "Equipment / SBA-style": "Equipo / estilo SBA",
    "One application, every option": "Una solicitud, todas las opciones",
    "Tell us the goal. We'll range every structure that fits.": "Díganos su objetivo. Le mostraremos el rango de cada estructura que le convenga.",
    "Apply once, soft pull only. We come back with the line, the loan, and the advance side-by-side — you choose what to draw.": "Solicite una vez, solo consulta suave. Volvemos con la línea, el préstamo y el adelanto lado a lado — usted elige de cuál disponer.",
    "See my options": "Ver mis opciones",
    "$0 down · same-day board": "$0 de entrada · activación el mismo día",
    "Terminals": "Terminales",
    "on the": "en el",
    "counter today.": "mostrador hoy.",
    "Countertop, handheld, and mobile hardware — pre-boarded and shipped, with": "Hardware de mostrador, portátil y móvil — preconfigurado y enviado, con",
    ". Own it or lease it, board same-day, and start taking payments without a compatibility headache.": ". Cómprelo o arriéndelo, actívelo el mismo día y comience a aceptar pagos sin dolores de cabeza de compatibilidad.",
    "Get my terminals": "Obtener mis terminales",
    "Certified": "Certificado",
    "One lineup, every counter": "Una sola gama, todos los mostradores",
    "Hardware for how your business actually runs.": "Hardware para el funcionamiento real de su negocio.",
    "Mix and match across locations — every unit is boarded to the same account and settles to the same next-day deposit.": "Combine entre ubicaciones — cada unidad se configura en la misma cuenta y liquida al mismo depósito del día siguiente.",
    "Countertop": "De mostrador",
    "The front-of-house workhorse.": "El caballo de batalla del área de atención.",
    "A fast, full-size terminal for the register — chip, tap, swipe, and PIN, with a receipt printer and a bright touchscreen. Wired for reliability where the line moves fast.": "Una terminal rápida de tamaño completo para la caja — chip, contacto, banda y PIN, con impresora de recibos y una pantalla táctil brillante. Cableada para la confiabilidad donde la fila avanza rápido.",
    "Handheld": "Portátil",
    "Take payment anywhere in the room.": "Acepte pagos en cualquier parte del local.",
    "A cordless, all-day-battery unit for table-side, curbside, and the sales floor. Wi-Fi and 4G so it works wherever your customers are.": "Una unidad inalámbrica con batería de todo el día para la mesa, la acera y el piso de ventas. Wi-Fi y 4G para que funcione dondequiera que estén sus clientes.",
    "Mobile": "Móvil",
    "A full terminal in your pocket.": "Una terminal completa en su bolsillo.",
    "Compact hardware or a phone-paired reader for pop-ups, markets, and field service. Accept a card the moment the sale happens.": "Hardware compacto o un lector emparejado al teléfono para ferias, mercados y servicio en campo. Acepte una tarjeta en el momento en que ocurre la venta.",
    "Two ways to get the hardware. Both start at zero.": "Dos formas de obtener el hardware. Ambas comienzan en cero.",
    "Buy it and own it, or lease it and stay on the latest models. Either way you're taking payments the same day it lands.": "Cómprelo y sea suyo, o arriéndelo y manténgase en los modelos más recientes. En cualquier caso, acepta pagos el mismo día en que llega.",
    "Own": "Comprar",
    "Buy it outright": "Cómprelo de una vez",
    "One-time purchase, financed at $0 down if you'd rather spread it out. The hardware is yours — no monthly line item once it's paid off.": "Compra única, financiada con $0 de entrada si prefiere distribuirla. El hardware es suyo — sin cargo mensual una vez pagado.",
    "Upfront": "Por adelantado",
    "Ownership": "Propiedad",
    "Yours, day one": "Suyo, desde el primer día",
    "Best for": "Ideal para",
    "Established, steady volume": "Volumen establecido y constante",
    "Upgrades": "Actualizaciones",
    "Trade in anytime": "Cámbielo en cualquier momento",
    "Lease": "Arrendar",
    "Lease month-to-month": "Arriende mes a mes",
    "A low monthly rate that bundles the hardware, warranty, and free replacements. Swap to newer models as they ship and scale units up or down as you grow.": "Una tarifa mensual baja que incluye el hardware, la garantía y los reemplazos gratuitos. Cambie a modelos más nuevos a medida que salen y ajuste las unidades según crece.",
    "Included in service": "Incluido en el servicio",
    "New or seasonal shops": "Comercios nuevos o de temporada",
    "Always current": "Siempre actualizado",
    "Boxed, boarded, and taking payment — same day.": "Embalado, configurado y aceptando pagos — el mismo día.",
    "Step": "Paso",
    "Tell us your setup.": "Díganos su configuración.",
    "Business type, average ticket, and how many stations you need. We pick the right mix of countertop, handheld, and mobile units.": "Tipo de negocio, ticket promedio y cuántas estaciones necesita. Elegimos la combinación correcta de unidades de mostrador, portátiles y móviles.",
    "We pre-board & ship.": "Preconfiguramos y enviamos.",
    "Your terminals are configured to your account before they leave the warehouse — settings, tips, taxes, and receipts already dialed in.": "Sus terminales se configuran en su cuenta antes de salir del almacén — ajustes, propinas, impuestos y recibos ya listos.",
    "Plug in and sell.": "Conecte y venda.",
    "Power on, connect to Wi-Fi or 4G, and take your first payment. Most merchants are live the same day the box arrives.": "Encienda, conéctese a Wi-Fi o 4G y acepte su primer pago. La mayoría de los comercios operan el mismo día en que llega la caja.",
    "No upfront cost to get hardware in the door — own or lease, you start at zero.": "Sin costo inicial para obtener el hardware — compra o arrendamiento, comienza en cero.",
    "PCI-certified": "Certificado PCI",
    "Every unit ships encrypted and PCI-DSS compliant. Tokenized, tamper-evident, and audited.": "Cada unidad se envía cifrada y conforme a PCI-DSS. Tokenizada, a prueba de manipulaciones y auditada.",
    "Free replacements": "Reemplazos gratuitos",
    "A unit fails, we overnight a new one. On lease, warranty and swaps are always included.": "Si una unidad falla, enviamos una nueva de un día para otro. En arrendamiento, la garantía y los cambios siempre están incluidos.",
    "Next-day deposits": "Depósitos al día siguiente",
    "Batches settle to your account next business day — same-day funding available.": "Los lotes se liquidan en su cuenta el siguiente día hábil — financiamiento el mismo día disponible.",
    "Ready when you are": "Listos cuando usted lo esté",
    "New terminals on the counter — with nothing down.": "Terminales nuevas en el mostrador — sin nada de entrada.",
    "Tell us how you sell and we'll spec the lineup, board it to your account, and ship it — same-day live for most merchants.": "Díganos cómo vende y especificaremos la gama, la configuraremos en su cuenta y la enviaremos — operativa el mismo día para la mayoría de los comercios.",
    "Vol. IX · Speed": "Vol. IX · Rapidez",
    "Minutes, not months": "Minutos, no meses",
    "Faster than": "Más rápido que",
    "the": "el",
    "bank.": "banco.",
    "A bank routes you through a loan officer, a committee, and a stack of paperwork — then makes you wait weeks for a maybe. We underwrite live off your deposits and hand back a": "Un banco lo hace pasar por un oficial de préstamos, un comité y una pila de papeleo — y luego lo hace esperar semanas por un tal vez. Nosotros evaluamos en vivo con sus depósitos y le devolvemos una",
    "real, ranged offer in minutes": "oferta real y con rango en minutos",
    ". Soft pull, no callbacks, wire inside 24 hours.": ". Consulta suave, sin devoluciones de llamada, transferencia dentro de 24 horas.",
    "Get my offer in minutes": "Obtener mi oferta en minutos",
    "Try the calculator →": "Probar la calculadora →",
    "Reading deposits…": "Leyendo depósitos…",
    "Your ranged offer": "Su oferta con rango",
    "The difference is the wait": "La diferencia es la espera",
    "Same business. Same numbers. Six weeks apart.": "El mismo negocio. Los mismos números. Con seis semanas de diferencia.",
    "Here's the identical funding request, run through a bank and through Delt.": "Esta es la misma solicitud de financiamiento, procesada por un banco y por Delt.",
    "The bank": "El banco",
    "~6 weeks": "~6 semanas",
    "Day 1": "Día 1",
    "Book a branch appointment. Print the application packet.": "Agende una cita en la sucursal. Imprima el paquete de solicitud.",
    "Week 1": "Semana 1",
    "Hand over tax returns, P&L, balance sheet, projections.": "Entregue declaraciones de impuestos, estado de resultados, balance general, proyecciones.",
    "Week 2–3": "Semana 2–3",
    "Loan officer requests “just one more document.” Twice.": "El oficial de préstamos pide “solo un documento más”. Dos veces.",
    "Week 4–6": "Semana 4–6",
    "File sits with a credit committee that meets weekly.": "El expediente queda con un comité de crédito que se reúne semanalmente.",
    "Week 6+": "Semana 6+",
    "A maybe — often with a covenant and a personal guarantee.": "Un tal vez — a menudo con una cláusula restrictiva y una garantía personal.",
    "Minute 0": "Minuto 0",
    "Three fields on the calculator. Revenue, time in business, processor.": "Tres campos en la calculadora. Ingresos, tiempo en el negocio, procesador.",
    "Minute 2": "Minuto 2",
    "Link your bank read-only via Plaid. No statements to dig up.": "Vincule su banco en modo solo lectura mediante Plaid. Sin estados de cuenta que buscar.",
    "Minute 5": "Minuto 5",
    "A soft-pull, deposit-based approval score and a ranged offer.": "Un puntaje de aprobación con consulta suave, basado en depósitos, y una oferta con rango.",
    "Hour 1–4": "Hora 1–4",
    "A human underwriter confirms the range on your file.": "Un evaluador humano confirma el rango de su expediente.",
    "Hour 24": "Hora 24",
    "Counter-sign and the wire hits your operating account.": "Firma de contraparte y la transferencia llega a su cuenta operativa.",
    "Why we're faster": "Por qué somos más rápidos",
    "Speed isn't a rush job. It's a better process.": "La rapidez no es un trabajo apresurado. Es un mejor proceso.",
    "We read data, not paperwork.": "Leemos datos, no papeleo.",
    "A read-only Plaid link shows us 90 days of real deposits in seconds. There is nothing to print, scan, or re-export — the truth is already in your account.": "Un enlace de Plaid de solo lectura nos muestra 90 días de depósitos reales en segundos. No hay nada que imprimir, escanear o volver a exportar — la verdad ya está en su cuenta.",
    "Soft pull, no score damage.": "Consulta suave, sin daño al puntaje.",
    "The estimate never touches your credit. No hard inquiry, no ding, no callback from a loan officer trying to “restructure” the deal.": "La estimación nunca toca su crédito. Sin consulta dura, sin afectación, sin llamadas de un oficial de préstamos que intenta “reestructurar” el trato.",
    "One desk, one decision.": "Un escritorio, una decisión.",
    "No branch, no broker layer, no committee that meets on Thursdays. Your file goes straight to an underwriter with authority to price and fund it.": "Sin sucursal, sin capa de intermediarios, sin comité que se reúne los jueves. Su expediente va directo a un evaluador con autoridad para fijar el precio y financiarlo.",
    "Stop waiting on a maybe": "Deje de esperar por un tal vez",
    "Get a real offer before the bank picks up the phone.": "Obtenga una oferta real antes de que el banco conteste el teléfono.",
    "Three fields, a soft pull, and a ranged offer in minutes. No callbacks, no committee, no covenants.": "Tres campos, una consulta suave y una oferta con rango en minutos. Sin devoluciones de llamada, sin comité, sin cláusulas restrictivas.",
    "Vol. XII · Eligibility": "Vol. XII · Elegibilidad",
    "Who qualifies": "Quién califica",
    "Funded on your revenue,": "Financiado según sus ingresos,",
    "not your": "no su",
    "credit score.": "puntaje de crédito.",
    "If you run a real U.S. business with steady deposits, you're likely a fit. We underwrite the money that actually moves through your account — so a thin or bruised credit file doesn't count you out. Checking is a": "Si dirige un negocio real en EE. UU. con depósitos constantes, es probable que califique. Evaluamos el dinero que realmente se mueve por su cuenta — de modo que un historial de crédito escaso o dañado no lo descarta. Verificar es una",
    "and takes about two minutes.": "y toma unos dos minutos.",
    "Check my eligibility": "Verificar mi elegibilidad",
    "6+ mo": "6+ meses",
    "minimum": "mínimo",
    "in deposits": "en depósitos",
    "no score impact": "sin impacto al puntaje",
    "per draw": "por disposición",
    "The basics": "Lo básico",
    "Four things that make you a fit.": "Cuatro cosas que lo hacen apto.",
    "Meet these and you're almost certainly eligible for an offer. The rest is what your deposits say about your business.": "Cumpla con estas y es casi seguro que califica para una oferta. El resto es lo que sus depósitos dicen sobre su negocio.",
    "A U.S. business": "Un negocio en EE. UU.",
    "Registered and operating in the United States, with a valid EIN. Sole props, LLCs, S-corps, and C-corps all qualify.": "Registrado y operando en los Estados Unidos, con un EIN válido. Empresas unipersonales, LLC, S-corps y C-corps califican todas.",
    "6+ months operating": "6+ meses operando",
    "Enough history for us to read a real deposit pattern. Newer businesses that process card payments with Delt can qualify sooner.": "Suficiente historial para que leamos un patrón de depósitos real. Los negocios más nuevos que procesan pagos con tarjeta con Delt pueden calificar antes.",
    "$10K+ monthly revenue": "$10K+ de ingresos mensuales",
    "Roughly ten thousand dollars a month or more flowing through your account. Consistency matters more than a single big month.": "Aproximadamente diez mil dólares al mes o más pasando por su cuenta. La constancia importa más que un solo mes grande.",
    "A business bank account": "Una cuenta bancaria comercial",
    "A primary operating account we can link read-only through Plaid. No statements to dig up, print, or upload.": "Una cuenta operativa principal que podamos vincular en modo solo lectura mediante Plaid. Sin estados de cuenta que buscar, imprimir o subir.",
    "Deposits, not FICO": "Depósitos, no FICO",
    "We read your revenue. We skip the paperwork.": "Leemos sus ingresos. Nos saltamos el papeleo.",
    "Underwriting looks at the ledger of your business, not a three-year-old bureau file. Here's exactly what's in — and what you'll never be asked for.": "La evaluación observa el libro contable de su negocio, no un archivo de buró de hace tres años. Esto es exactamente lo que se incluye — y lo que nunca se le pedirá.",
    "What we underwrite": "Lo que evaluamos",
    "Deposit volume and cadence — the real money moving through your account.": "Volumen y cadencia de depósitos — el dinero real que se mueve por su cuenta.",
    "Card-processing volume, if you accept cards (more if you process with Delt).": "Volumen de procesamiento de tarjetas, si acepta tarjetas (más si procesa con Delt).",
    "Sales consistency and average daily balance — how steady the business runs.": "Constancia de ventas y saldo diario promedio — qué tan estable funciona el negocio.",
    "Time in business and account history — the track record behind the numbers.": "Tiempo en el negocio e historial de la cuenta — la trayectoria detrás de los números.",
    "What we never ask for": "Lo que nunca pedimos",
    "A perfect (or even good) credit score": "Un puntaje de crédito perfecto (ni siquiera bueno)",
    "Collateral or a personal-asset lien": "Garantía o un gravamen sobre bienes personales",
    "Tax returns, P&L, or a balance sheet": "Declaraciones de impuestos, estado de resultados o balance general",
    "A business plan or projections deck": "Un plan de negocio o presentación de proyecciones",
    "Who we fund": "A quién financiamos",
    "Main-street operators, across the map.": "Negocios de barrio, en todo el mapa.",
    "If your business takes deposits, we've probably funded one like it. A few of the industries we work with every day:": "Si su negocio recibe depósitos, probablemente hemos financiado uno como el suyo. Algunas de las industrias con las que trabajamos todos los días:",
    "Restaurants & QSR": "Restaurantes y comida rápida",
    "Retail & e-commerce": "Comercio minorista y e-commerce",
    "Auto & repair": "Automotriz y reparación",
    "Salons & spas": "Salones y spas",
    "Construction & trades": "Construcción y oficios",
    "Healthcare & dental": "Salud y odontología",
    "Logistics & trucking": "Logística y transporte",
    "Professional services": "Servicios profesionales",
    "Fitness & wellness": "Fitness y bienestar",
    "Hospitality": "Hostelería",
    "Don't see yours? It's not an exhaustive list — check the calculator or ask a specialist. We fund a handful of restricted categories case-by-case.": "¿No ve el suyo? No es una lista exhaustiva — consulte la calculadora o pregunte a un especialista. Financiamos algunas categorías restringidas caso por caso.",
    "Two-minute soft check": "Verificación suave de dos minutos",
    "See what you qualify for — no score impact.": "Vea para qué califica — sin impacto al puntaje.",
    "Answer three quick questions, link your bank read-only, and see a real ranged offer. Soft pull only — nothing touches your credit.": "Responda tres preguntas rápidas, vincule su banco en modo solo lectura y vea una oferta real con rango. Solo consulta suave — nada toca su crédito.",

  };

  for (const k in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, k)) {
      D[k] = overrides[k];
    }
  }
})();
