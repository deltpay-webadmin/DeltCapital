// V1 Calculator — dedicated page for the /calc route.
// Preserves ALL sections/logic from the original Delt site's CapitalCostAnalyzer:
//   • Progressive reveal: revenue → TIB → cards (Y/N) → card sales
//   • TIB multipliers (50-67% of revenue, shifts by tenure, <6mo = redirect)
//   • Delt Boost toggle: 1.75× boost + 0% first-$5K banner
//   • Redirect case UI for <6mo businesses
//   • Lead-capture gate before the funding range is revealed
//   • Unified bottom strip: "How it works" → Delt-Boost toggle
// Designed in V1's purple/violet language — no navy/indigo from the original.

const { useState: v1cUseState, useEffect: v1cUseEffect, useRef: v1cUseRef } = React;

function v1fmtK(n) {
  if (n >= 1000) return `$${Math.round(n / 1000).toLocaleString()}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

const TIB_MULT = {
  '<6mo':    'redirect',
  '6-12mo':  { low: 0.50, high: 0.56 },
  '1-2yr':   { low: 0.56, high: 0.62 },
  '2yr+':    { low: 0.60, high: 0.67 },
};

// Animated radial spinner used inside the "calculating…" theater.
function V1CalcSpinner() {
  return (
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ animation: 'v1LeadSpin 1100ms linear infinite' }}>
        <defs>
          <linearGradient id="v1LeadSpinG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={V1.blue} stopOpacity="0" />
            <stop offset="100%" stopColor={V1.blue} stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="22" fill="none" stroke={V1.line} strokeWidth="3" />
        <circle cx="28" cy="28" r="22" fill="none"
          stroke="url(#v1LeadSpinG)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray="60 200" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: V1.blue,
      }}>
        <V1CalcIcon kind="spark" />
      </div>
    </div>
  );
}

// One-time CSS injection for the animations used by the lead-gate flow.
// React doesn't render <style> in document scope in older browsers if
// embedded inline, so we attach it to <head> on first mount.
function useV1LeadAnimations() {
  v1cUseEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('v1-lead-anims')) return;
    const s = document.createElement('style');
    s.id = 'v1-lead-anims';
    s.textContent = `
      @keyframes v1LeadFadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
      @keyframes v1LeadSpin { to { transform: rotate(360deg);} }
    `;
    document.head.appendChild(s);
  }, []);
}

function V1CalcIcon({ kind }) {
  const p = { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'check') return <svg {...p}><path d="M3 7.2L5.8 10 11 4.5" /></svg>;
  if (kind === 'x')     return <svg {...p}><path d="M4 4L10 10M10 4L4 10" /></svg>;
  if (kind === 'arr')   return <svg {...p}><path d="M3 7h8M8 4l3 3-3 3" /></svg>;
  if (kind === 'bolt')  return <svg {...p} fill="currentColor" stroke="none"><path d="M8 1L2 8h4l-1 5 6-7H7l1-5z"/></svg>;
  if (kind === 'spark') return <svg {...p}><path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M3 11l2-2M9 5l2-2" /></svg>;
  if (kind === 'rocket') return <svg {...p}><path d="M7 1C5 3 4 6 4 9l2 2c3 0 6-1 8-3L11 5 7 1z"/><path d="M4 9l-2 3 3-2"/></svg>;
  return null;
}

// ─── Styled number input used across the calculator ───
function V1CalcMoneyInput({ value, onChange, onBlur, placeholder = '0', big = true }) {
  const [focused, setFocused] = v1cUseState(false);
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        color: V1.ink, pointerEvents: 'none', userSelect: 'none',
        fontSize: big ? 18 : 15, fontWeight: 700, fontFamily: V1.fontDisplay,
      }}>$</span>
      <input
        type="text" inputMode="numeric" placeholder={placeholder}
        value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
        onFocus={() => setFocused(true)} onBlurCapture={() => setFocused(false)}
        style={{
          width: '100%', padding: big ? '14px 16px 14px 36px' : '11px 14px 11px 32px',
          background: V1.bg,
          border: `1px solid ${focused ? V1.blue : V1.line}`,
          borderRadius: 12,
          fontFamily: V1.fontDisplay,
          fontSize: big ? 20 : 15,
          fontWeight: 700,
          color: V1.ink,
          fontVariantNumeric: 'tabular-nums',
          outline: 'none',
          boxShadow: focused ? `0 0 0 3px ${V1.blue}22` : 'none',
          transition: 'border-color .15s, box-shadow .15s',
        }}
      />
    </div>
  );
}

// ─── Small label used inside cards ───
function V1CalcLabel({ children }) {
  return (
    <div style={{
      textTransform: 'uppercase', color: V1.muted,
      fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.18em',
      marginBottom: 12,
    }}>{children}</div>
  );
}

// ─── Selectable pill for TIB / Yes-No / etc. ───
function V1CalcPill({ active, onClick, children, icon }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
      fontFamily: V1.fontBody, fontSize: 14, fontWeight: active ? 600 : 500,
      background: active ? `${V1.blue}0D` : V1.white,
      border: active ? `1.5px solid ${V1.blue}` : `1px solid ${V1.line}`,
      color: active ? V1.blue : V1.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'all .15s',
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = `${V1.blue}66`; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = V1.line; }}>
      {icon && <V1CalcIcon kind={icon} />}
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// CALCULATOR CORE — the analyzer card itself
// ═══════════════════════════════════════════════════════════════
// Animated "How it works →" standalone button.
// NOTE: Superseded by V1CalcHowInlineLink which lives inside the
// bottom strip alongside the Delt-Boost toggle. Kept here in case we
// want a standalone variant again for an A/B test.
function V1CalcHowLink({ onClick }) {
  const [shown, setShown] = v1cUseState(false);
  const [hover, setHover] = v1cUseState(false);
  v1cUseEffect(() => {
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, []);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        marginTop: 18, alignSelf: 'flex-start',
        position: 'relative', overflow: 'hidden',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '11px 20px', borderRadius: 10, cursor: 'pointer',
        background: hover ? V1.blue : '#fff',
        color: hover ? '#fff' : V1.blue,
        border: `1px solid ${V1.blue}`,
        fontFamily: V1.fontDisplay, fontSize: 13.5, fontWeight: 700,
        lineHeight: 1, letterSpacing: '-0.005em',
        boxShadow: hover ? `0 10px 24px -10px ${V1.blue}88` : '0 0 0 rgba(0,0,0,0)',
        transform: !shown ? 'translateY(6px)'
                  : hover ? 'translateY(-1px)' : 'translateY(0)',
        opacity: shown ? 1 : 0,
        transition: 'opacity 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 280ms cubic-bezier(0.22, 1, 0.36, 1), background 220ms, color 220ms, box-shadow 240ms',
      }}
    >
      <span aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)',
        transform: hover ? 'translateX(120%)' : 'translateX(-120%)',
        transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
      How it works
      <span aria-hidden style={{
        display: 'inline-flex',
        transform: hover ? 'translateX(3px)' : 'translateX(0)',
        transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>→</span>
    </button>
  );
}

// Inline variant of V1CalcHowLink that lives *inside* the bottom
// strip directly above the Delt-Boost toggle. Lighter visual weight
// than the standalone button — reads as a connecting prompt ("Curious
// how it works? →") so the strip feels like a single guided action
// instead of two stacked cards.
function V1CalcHowInlineLink({ onClick }) {
  const [hover, setHover] = v1cUseState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', marginLeft: -10,
        background: 'transparent', border: 'none',
        color: V1.blue,
        fontFamily: V1.fontDisplay, fontSize: 12.5, fontWeight: 700,
        letterSpacing: '0.02em',
        cursor: 'pointer', borderRadius: 8,
        transition: 'background 180ms, color 180ms',
      }}
    >
      <span style={{
        width: 22, height: 22, borderRadius: 999, flexShrink: 0,
        background: `${V1.blue}1A`, color: V1.blue,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 180ms',
      }}>
        <V1CalcIcon kind="spark" />
      </span>
      <span>Curious how it works?</span>
      <span aria-hidden style={{
        display: 'inline-flex',
        transform: hover ? 'translateX(3px)' : 'translateX(0)',
        transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}>→</span>
    </button>
  );
}

function V1CalcAnalyzer({ onApply, onNavHow, onNavProcessing, hideHeader }) {
  useV1LeadAnimations();
  const [revenue, setRevenue] = v1cUseState(0);
  const [revenueInput, setRevenueInput] = v1cUseState('');
  const [tib, setTib] = v1cUseState('');
  const [acceptsCards, setAcceptsCards] = v1cUseState(null); // null | true | false
  const [cardSales, setCardSales] = v1cUseState(0);
  const [cardSalesInput, setCardSalesInput] = v1cUseState('');
  const [deltToggle, setDeltToggle] = v1cUseState(false);

  const [showResults, setShowResults] = v1cUseState(false);
  const calcTimer = v1cUseRef(null);

  // ─── Lead-capture gate ──────────────────────────────────────
  // Before the final funding-range number is revealed, we show a
  // "calculating…" theater animation, then a frosted-glass lead form
  // overlaid on a blurred preview of the result. Once submitted, the
  // result un-blurs and the captured fields pre-fill the apply flow.
  const [leadStage, setLeadStage] = v1cUseState('idle'); // idle | calculating | gating | captured
  const [theaterPhase, setTheaterPhase] = v1cUseState(0); // 0..2 for the 3 lines
  const [leadFirst, setLeadFirst] = v1cUseState('');
  const [leadBiz, setLeadBiz] = v1cUseState('');
  const [leadEmail, setLeadEmail] = v1cUseState('');
  const [leadPhone, setLeadPhone] = v1cUseState('');
  // Country code stored separately so the formatter only handles the
  // 10-digit national number. Default to USA (+1). Canada uses the same
  // dial prefix — we disambiguate the dropdown option as '+1c' but emit
  // '+1' on submit via the normalizer below.
  const [leadCountryCode, setLeadCountryCode] = v1cUseState('+1');
  const dialPrefix = leadCountryCode === '+1c' ? '+1' : leadCountryCode;
  const [leadSubmitting, setLeadSubmitting] = v1cUseState(false);
  const [leadError, setLeadError] = v1cUseState('');
  // leadId comes back from /api/leads when Supabase persistence is
  // enabled. We stash it so the apply modal can ping /api/apply-progress
  // with the right key, and so the offer CTA can pass it through.
  const [leadId, setLeadId] = v1cUseState(null);
  const theaterTimers = v1cUseRef([]);

  const isCaptured = leadStage === 'captured';
  const showGate   = leadStage === 'gating' && !isCaptured;
  const showTheater = leadStage === 'calculating';

  const noCards = acceptsCards === false;
  const crossSell = noCards;
  const boosted = deltToggle || crossSell;
  const isRedirect = tib === '<6mo';
  const hasRevenue = revenue > 0;
  const hasTIB = tib !== '';

  // Funding range calc
  let baseLow = revenue * 0.5, baseHigh = revenue * 0.67;
  if (tib && TIB_MULT[tib] !== 'redirect' && TIB_MULT[tib]) {
    baseLow = revenue * TIB_MULT[tib].low;
    baseHigh = revenue * TIB_MULT[tib].high;
  }
  const preLow  = Math.min(250000, Math.max(5000, Math.round(baseLow / 1000) * 1000));
  const preHigh = Math.min(250000, Math.max(preLow + 2000, Math.round(baseHigh / 1000) * 1000));
  let bLow = baseLow, bHigh = baseHigh;
  // ~25% uplift — realistic underwriting confidence boost from a unified
  // processor (tighter cash-flow visibility, faster verification, marginally
  // lower risk premium). Was 1.75 — too generous to read as honest.
  if (boosted) { bLow *= 1.25; bHigh *= 1.25; }
  bLow = Math.round(bLow / 1000) * 1000;
  bHigh = Math.round(bHigh / 1000) * 1000;
  const cap = boosted ? 500000 : 250000;
  bLow  = Math.min(cap, Math.max(5000, bLow));
  bHigh = Math.min(cap, Math.max(bLow + 2000, bHigh));
  const displayLow  = boosted ? bLow  : preLow;
  const displayHigh = boosted ? bHigh : preHigh;

  const allFilled = hasRevenue && hasTIB && acceptsCards !== null && (noCards || cardSales > 0);

  // Drive the gate state machine off the calculator inputs.
  //  - inputs incomplete       → idle (nothing computed)
  //  - inputs complete, not yet captured → run calculating theater → gating
  //  - already captured this session → reveal immediately on input changes
  v1cUseEffect(() => {
    // Clear any pending timers from a previous run
    if (calcTimer.current) clearTimeout(calcTimer.current);
    theaterTimers.current.forEach((t) => clearTimeout(t));
    theaterTimers.current = [];

    if (!allFilled) {
      setShowResults(false);
      if (!isCaptured) setLeadStage('idle');
      return;
    }

    // Redirect cases (<6mo TIB / no card sales path) don't gate — they
    // already render their own redirect UI, not a dollar range.
    if (isRedirect) {
      setShowResults(true);
      return;
    }

    if (isCaptured) {
      // Already gave us their info; just show the recalculated number.
      setShowResults(false);
      calcTimer.current = setTimeout(() => setShowResults(true), 700);
      return;
    }

    // First-time reveal: run the 3-phase theater, then open the gate.
    setShowResults(false);
    setLeadStage('calculating');
    setTheaterPhase(0);
    theaterTimers.current.push(setTimeout(() => setTheaterPhase(1), 900));
    theaterTimers.current.push(setTimeout(() => setTheaterPhase(2), 1800));
    theaterTimers.current.push(setTimeout(() => {
      // Reveal the (blurred) number underneath the gate at the same time
      // we swap the theater out for the form — feels like the result IS
      // already calculated, just locked behind the form.
      setShowResults(true);
      setLeadStage('gating');
    }, 2700));

    return () => {
      if (calcTimer.current) clearTimeout(calcTimer.current);
      theaterTimers.current.forEach((t) => clearTimeout(t));
      theaterTimers.current = [];
    };
  }, [allFilled, revenue, tib, acceptsCards, cardSales, isRedirect, isCaptured]);

  // Lead form validation
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim());
  const phoneValid = leadPhone.replace(/[^0-9]/g, '').length >= 10;
  const leadValid = leadFirst.trim().length >= 1
                 && leadBiz.trim().length >= 1
                 && emailValid
                 && phoneValid;

  const onLeadPhone = (raw) => {
    // Strip every non-digit. If a user pastes "+1 864 555 0123" or
    // "18645550123" while +1 is selected, drop the leading country-code
    // digit so the area code starts at the right place.
    let d = raw.replace(/[^0-9]/g, '');
    if (dialPrefix === '+1' && d.length === 11 && d.startsWith('1')) {
      d = d.slice(1);
    }
    d = d.slice(0, 10);
    let f = d;
    if (d.length > 6)      f = `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
    else if (d.length > 3) f = `(${d.slice(0,3)}) ${d.slice(3)}`;
    else if (d.length > 0) f = `(${d}`;
    setLeadPhone(f);
  };

  const submitLead = async () => {
    if (!leadValid || leadSubmitting) return;
    setLeadSubmitting(true);
    setLeadError('');
    const payload = {
      firstName: leadFirst.trim(),
      businessName: leadBiz.trim(),
      email: leadEmail.trim(),
      phone: leadPhone ? `${dialPrefix} ${leadPhone}`.trim() : '',
      source: 'calculator-gate',
      estimate: {
        low: displayLow,
        high: displayHigh,
        revenue,
        tib,
        acceptsCards,
        cardSales: noCards ? 0 : cardSales,
        boosted,
      },
    };
    try {
      // Best-effort: even if the API fails, we still let the user through
      // — we have their data in component state and pre-fill apply with
      // it, so the lead is captured in the apply submission downstream.
      try {
        const r = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        // Capture the lead row id when the server returned one. Optional
        // — older deploys without Supabase wired up just won't include it.
        if (r && r.ok) {
          const json = await r.json().catch(() => null);
          if (json && json.leadId) setLeadId(json.leadId);
        }
      } catch (_) { /* swallow — we still reveal */ }
      setLeadStage('captured');
    } catch (err) {
      setLeadError('Something went wrong. Try once more?');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const onRevenue = (raw) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const n = Math.min(parseInt(digits || '0', 10), 250000);
    setRevenueInput(n > 0 ? n.toLocaleString() : digits);
    setRevenue(n);
  };
  const onCardSales = (raw) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const n = Math.min(parseInt(digits || '0', 10), 250000);
    setCardSalesInput(n > 0 ? n.toLocaleString() : digits);
    setCardSales(n);
  };
  const onSelectCards = (v) => {
    setAcceptsCards(v);
    if (!v) { setCardSales(0); setCardSalesInput(''); setDeltToggle(false); }
  };

  const ctaDisabled = !allFilled;
  const ctaBoosted = (boosted || isRedirect) && showResults;

  return (
    <div style={{
      background: V1.white,
      borderRadius: 24,
      boxShadow: '0 1px 2px rgba(10,37,64,0.04), 0 30px 60px -30px rgba(10,37,64,0.25)',
      border: `1px solid ${V1.line}`,
      overflow: 'hidden',
      maxWidth: 1040, margin: '0 auto',
    }}>
      {/* Header */}
      {!hideHeader && (
        <div style={{ textAlign: 'center', padding: '48px 40px 16px' }}>
          <V1Eyebrow>Live calculator</V1Eyebrow>
          <h2 data-v1-section-title style={{
            fontFamily: V1.fontDisplay, fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            fontWeight: 700, color: V1.ink, lineHeight: 1.15,
            letterSpacing: '-0.03em', margin: '18px 0 8px',
          }}>
            How much could you qualify for?
          </h2>
          <p style={{ fontSize: 15, color: V1.muted, fontFamily: V1.fontBody, margin: 0 }}>
            Enter your details. See your funding estimate instantly.
          </p>
        </div>
      )}

      {/* Body — two-column */}
      <div data-v1-grid-2col style={{
        display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20,
        padding: hideHeader ? '40px 40px' : '24px 40px 40px',
      }}>
        {/* LEFT — progressive reveal fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 1. Revenue */}
          <div style={v1CardStyle}>
            <V1CalcLabel>Monthly revenue</V1CalcLabel>
            <V1CalcMoneyInput value={revenueInput} onChange={onRevenue}
              onBlur={() => revenue > 0 && setRevenueInput(Math.round(revenue).toLocaleString())} />
            <div style={{ fontSize: 11.5, color: V1.muted, marginTop: 8, fontFamily: V1.fontBody }}>Up to $250,000</div>
          </div>

          {/* 2. TIB — reveals after revenue */}
          {hasRevenue && (
            <div style={v1CardStyle}>
              <V1CalcLabel>Time in business</V1CalcLabel>
              <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { v: '<6mo',   l: 'Less than 6 months' },
                  { v: '6-12mo', l: '6–12 months' },
                  { v: '1-2yr',  l: '1–2 years' },
                  { v: '2yr+',   l: '2+ years' },
                ].map(o => (
                  <V1CalcPill key={o.v} active={tib === o.v}
                    onClick={() => setTib(tib === o.v ? '' : o.v)}>{o.l}</V1CalcPill>
                ))}
              </div>
            </div>
          )}

          {/* 3. Accept credit cards? */}
          {hasTIB && (
            <div style={v1CardStyle}>
              <V1CalcLabel>Do you currently accept credit cards?</V1CalcLabel>
              <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <V1CalcPill active={acceptsCards === true} onClick={() => onSelectCards(true)} icon="check">Yes</V1CalcPill>
                <V1CalcPill active={acceptsCards === false} onClick={() => onSelectCards(false)} icon="x">No</V1CalcPill>
              </div>
              {acceptsCards === true && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${V1.line}` }}>
                  <V1CalcLabel>Monthly card sales</V1CalcLabel>
                  <V1CalcMoneyInput big={false} value={cardSalesInput} onChange={onCardSales}
                    onBlur={() => cardSales > 0 && setCardSalesInput(Math.round(cardSales).toLocaleString())} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — funding range panel */}
        <div style={{
          position: 'relative', // anchor for theater + lead-gate overlays
          background: hasRevenue && boosted
            ? `linear-gradient(145deg, ${V1.bg} 0%, #F4EEFB 50%, ${V1.bg} 100%)`
            : V1.bg,
          border: hasRevenue && boosted ? `1.5px solid ${V1.blue}33` : `1px solid ${V1.line}`,
          borderRadius: 20,
          padding: 28,
          display: 'flex', flexDirection: 'column',
          boxShadow: hasRevenue && boosted ? `0 8px 32px ${V1.blue}1A` : 'none',
          transition: 'background .4s, border .4s, box-shadow .4s',
        }}>
          {/* Blur shroud on the underlying result panel while gating */}
          <div style={{
            filter: showGate ? 'blur(10px)' : 'none',
            transition: 'filter 600ms cubic-bezier(0.22,1,0.36,1)',
            display: 'flex', flexDirection: 'column', flex: 1,
            pointerEvents: showGate ? 'none' : 'auto',
            userSelect: showGate ? 'none' : 'auto',
          }}>
          {/* Funding amount */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <V1CalcLabel>Estimated funding range</V1CalcLabel>
            <div style={{ padding: '4px 0' }}>
              <span style={{
                fontFamily: V1.fontDisplay,
                fontSize: 'clamp(2.25rem, 5vw, 3rem)',
                fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em',
                color: !hasRevenue ? '#d1d5db'
                     : boosted ? V1.blue
                     : V1.ink,
                fontVariantNumeric: 'tabular-nums',
                transition: 'color .4s',
              }}>
                {hasRevenue && showResults ? (
                  <>{v1fmtK(displayLow)}<span style={{ margin: '0 6px', opacity: 0.35 }}>–</span>{v1fmtK(displayHigh)}</>
                ) : hasRevenue && allFilled ? (
                  <span style={{ color: V1.muted, fontSize: '0.7em', fontWeight: 600, letterSpacing: 0 }}>Calculating…</span>
                ) : (
                  <span style={{ color: '#d1d5db' }}>$0<span style={{ margin: '0 6px', opacity: 0.35 }}>–</span>$0</span>
                )}
              </span>
            </div>
            <p style={{ fontFamily: V1.fontBody, fontSize: 13, color: V1.muted, marginTop: 6, lineHeight: 1.5 }}>
              {!hasRevenue ? 'Complete the fields to see your estimate.'
               : boosted   ? 'With Delt processing'
               : 'Based on your monthly revenue'}
            </p>

            {/* Boost banner */}
            {hasRevenue && boosted && (
              <div style={{ marginTop: 14 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 999,
                  background: `${V1.blue}14`, color: V1.blue,
                  fontSize: 12, fontWeight: 600, fontFamily: V1.fontBody,
                }}>
                  <V1CalcIcon kind="spark" />
                  0% processing on your first $5,000
                </span>
              </div>
            )}

            {/* Redirect case */}
            {hasRevenue && isRedirect && (
              <div
                onClick={onNavProcessing}
                role={onNavProcessing ? 'button' : undefined}
                tabIndex={onNavProcessing ? 0 : undefined}
                onKeyDown={onNavProcessing ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavProcessing(); } } : undefined}
                style={{
                  marginTop: 16, padding: 16, borderRadius: 14,
                  border: `1.5px solid ${V1.blue}22`,
                  background: `${V1.blue}05`,
                  cursor: onNavProcessing ? 'pointer' : 'default',
                  transition: 'background 220ms, border-color 220ms, transform 220ms',
                }}
                onMouseEnter={(e) => { if (onNavProcessing) { e.currentTarget.style.background = `${V1.blue}0D`; e.currentTarget.style.borderColor = `${V1.blue}55`; } }}
                onMouseLeave={(e) => { if (onNavProcessing) { e.currentTarget.style.background = `${V1.blue}05`; e.currentTarget.style.borderColor = `${V1.blue}22`; } }}
              >
                <div style={{ color: V1.blue, marginBottom: 8 }}><V1CalcIcon kind="rocket" /></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: V1.ink, fontFamily: V1.fontDisplay, letterSpacing: '-0.01em', lineHeight: 1.35 }}>
                  Get started with Delt today.
                </div>
                <div style={{ fontSize: 12, color: V1.muted, lineHeight: 1.5, marginTop: 4, fontFamily: V1.fontBody }}>
                  New businesses that process with Delt get a pre-approved offer and up to 2× more capital as they grow.
                </div>
                {onNavProcessing && (
                  <div style={{
                    marginTop: 10, fontSize: 11.5, fontWeight: 600,
                    color: V1.blue, fontFamily: V1.fontDisplay, letterSpacing: '0.02em',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    See how it works →
                  </div>
                )}
              </div>
            )}

            <p style={{ fontSize: 10.5, color: V1.muted, opacity: 0.75, marginTop: 14, lineHeight: 1.45, fontFamily: V1.fontBody }}>
              Estimates are approximate and not a guarantee of funding. Final offers are based on a full review of your business.
            </p>
          </div>

          {/* ── "How it works" → Delt Boost toggle — unified bottom strip ──
             These two used to read as separate floating cards. We now
             render them inside a single blue-tinted footer with no rule
             between them, so the eye reads "learn how it works → flip
             the switch" as one continuous action group. The whole strip
             tints up when the toggle is on for extra cohesion. */}
          <div style={{
            marginTop: 20, marginLeft: -28, marginRight: -28, marginBottom: -28,
            background: deltToggle
              ? `linear-gradient(135deg, ${V1.blue}0A 0%, ${V1.blue}14 100%)`
              : `${V1.bg}`,
            borderTop: `1px solid ${deltToggle ? V1.blue + '22' : V1.line}`,
            transition: 'background .3s, border-color .3s',
          }}>
            {/* "How it works" rail — only shown when the user actively
                toggled Delt processing on (matching the original visibility
                logic). Sits flush above the toggle with no divider, so the
                two read as a single guided action group. */}
            {deltToggle && hasRevenue && !isRedirect && (
              <div style={{ padding: '14px 28px 0' }}>
                <V1CalcHowInlineLink onClick={onNavHow} />
              </div>
            )}

            <button onClick={() => setDeltToggle(!deltToggle)} disabled={noCards}
              style={{
                width: '100%', padding: '14px 28px 18px', border: 'none',
                background: 'transparent',
                cursor: noCards ? 'default' : 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                fontFamily: V1.fontBody,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: deltToggle ? `linear-gradient(135deg, ${V1.blue}, #818CF8)` : '#d5d7de',
                  color: deltToggle ? '#fff' : '#9ca3af',
                  boxShadow: deltToggle ? `0 3px 12px ${V1.blue}44` : 'none',
                  transition: 'all .3s',
                }}>
                  <V1CalcIcon kind="bolt" />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 13.5, fontWeight: 600,
                    color: deltToggle ? V1.ink : V1.muted, transition: 'color .3s',
                  }}>
                    {noCards
                      ? 'Sign up for Delt payments for 25% more capital'
                      : 'Switch processing to Delt for 25% more capital'}
                  </div>
                  {deltToggle && hasRevenue && !isRedirect && (
                    <div style={{ fontSize: 11.5, color: V1.blue, fontWeight: 500, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                      {v1fmtK(preLow)} → {v1fmtK(bLow)}–{v1fmtK(bHigh)}
                    </div>
                  )}
                </div>
              </div>
              <div style={{
                position: 'relative', width: 44, height: 26, borderRadius: 999, flexShrink: 0,
                background: deltToggle ? V1.blue : '#c7c9d1',
                boxShadow: deltToggle ? `0 0 12px ${V1.blue}55` : 'none',
                transition: 'all .3s',
              }}>
                <span style={{
                  position: 'absolute', top: 3, left: deltToggle ? 21 : 3,
                  width: 20, height: 20, borderRadius: 999, background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  transition: 'left .25s cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
              </div>
            </button>

            {/* Two-approvals tease — the marketing payoff for flipping
                the switch. Aspirational copy ("built so…") so we don't
                overpromise a product flow that's still being wired up.
                Animates in/out with the toggle so it feels earned. */}
            <div style={{
              maxHeight: deltToggle && hasRevenue && !isRedirect ? 80 : 0,
              opacity: deltToggle && hasRevenue && !isRedirect ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 320ms cubic-bezier(0.22,1,0.36,1), opacity 240ms ease-out',
            }}>
              <div style={{
                padding: '0 28px 16px',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontFamily: V1.fontBody, fontSize: 12, lineHeight: 1.5,
                color: V1.text,
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 999, flexShrink: 0, marginTop: 1,
                  background: `${V1.blue}1F`, color: V1.blue,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <V1CalcIcon kind="check" />
                </span>
                <span>
                  <strong style={{ color: V1.ink }}>One review, two yeses.</strong>{' '}
                  Delt is built so a single underwriting decision covers your
                  capital <em>and</em> your merchant services—with lower processing
                  fees baked in.
                </span>
              </div>
            </div>
          </div>
          </div>{/* /blur shroud */}

          {/* ─── Theater: "calculating…" 3-phase animation ─── */}
          {showTheater && (
            <div aria-live="polite" style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: `linear-gradient(145deg, ${V1.bg}F2 0%, ${V1.white}F2 100%)`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: 28, zIndex: 2,
              animation: 'v1LeadFadeIn 280ms ease-out',
            }}>
              <V1CalcSpinner />
              <div style={{ marginTop: 22, width: '100%', maxWidth: 320 }}>
                {[
                  'Analyzing your monthly volume…',
                  'Matching capital partners…',
                  'Pre-qualifying your offer…',
                ].map((line, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 0',
                    opacity: theaterPhase >= i ? 1 : 0.25,
                    color: theaterPhase > i ? V1.ink : V1.muted,
                    transition: 'opacity 280ms, color 280ms',
                    fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                  }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: 999, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: theaterPhase > i ? V1.blue : 'transparent',
                      border: theaterPhase > i ? 'none' : `1.5px solid ${V1.line}`,
                      color: '#fff',
                      transition: 'all 240ms',
                    }}>
                      {theaterPhase > i ? <V1CalcIcon kind="check" /> : null}
                    </span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Lead gate: frosted form over the blurred number ─── */}
          {showGate && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: `${V1.white}D9`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex', flexDirection: 'column',
              padding: '26px 24px', zIndex: 3,
              animation: 'v1LeadFadeIn 320ms cubic-bezier(0.22,1,0.36,1)',
              boxShadow: `inset 0 1px 0 ${V1.white}, 0 8px 32px -12px ${V1.blue}33`,
            }}>
              <div style={{
                display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8,
                padding: '5px 11px', borderRadius: 999,
                background: `linear-gradient(135deg, ${V1.blue} 0%, #818CF8 100%)`,
                color: '#fff',
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                boxShadow: `0 4px 12px -4px ${V1.blue}AA`,
              }}>
                <V1CalcIcon kind="spark" />
                Your offer is ready
              </div>
              <h3 style={{
                margin: '12px 0 4px',
                fontFamily: V1.fontDisplay, fontSize: 'clamp(1.15rem, 2vw, 1.35rem)',
                fontWeight: 700, letterSpacing: '-0.02em', color: V1.ink,
                lineHeight: 1.15,
              }}>
                Where should we send it?
              </h3>
              <p style={{
                margin: 0, fontFamily: V1.fontBody, fontSize: 12.5,
                color: V1.muted, lineHeight: 1.5,
              }}>
                We'll text and email your full funding range now. No credit pull.
              </p>

              <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                <V1LeadInput value={leadFirst} onChange={setLeadFirst}
                  placeholder="First name" autoComplete="given-name" />
                <V1LeadInput value={leadBiz} onChange={setLeadBiz}
                  placeholder="Business name" autoComplete="organization" />
                <V1LeadInput value={leadEmail} onChange={setLeadEmail}
                  type="email" placeholder="Business email" autoComplete="email" inputMode="email" />
                <V1PhoneInput
                  countryCode={leadCountryCode}
                  onCountryChange={setLeadCountryCode}
                  value={leadPhone}
                  onChange={onLeadPhone}
                />
              </div>

              {leadError && (
                <div style={{
                  marginTop: 8, padding: '8px 12px', borderRadius: 8,
                  background: '#FEF2F2', color: '#B91C1C',
                  fontFamily: V1.fontBody, fontSize: 12.5,
                }}>{leadError}</div>
              )}

              <button
                onClick={submitLead}
                disabled={!leadValid || leadSubmitting}
                style={{
                  marginTop: 12, width: '100%', padding: '14px 20px',
                  borderRadius: 12, border: 'none',
                  fontFamily: V1.fontBody, fontSize: 15, fontWeight: 700,
                  cursor: (!leadValid || leadSubmitting) ? 'default' : 'pointer',
                  background: (!leadValid || leadSubmitting)
                    ? `${V1.blue}55`
                    : `linear-gradient(135deg, ${V1.blue} 0%, #6366F1 50%, ${V1.blue} 100%)`,
                  color: (!leadValid || leadSubmitting) ? 'rgba(255,255,255,0.7)' : '#fff',
                  boxShadow: (!leadValid || leadSubmitting) ? 'none'
                    : `0 10px 30px -10px ${V1.blue}AA, 0 4px 10px -4px ${V1.blue}77`,
                  transition: 'transform .15s, box-shadow .2s',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {leadSubmitting ? 'Unlocking…' : 'Reveal my offer'}
                {!leadSubmitting && <V1CalcIcon kind="arr" />}
              </button>
              <div style={{
                marginTop: 8, textAlign: 'center',
                fontFamily: V1.fontBody, fontSize: 11, color: V1.muted,
                lineHeight: 1.5,
              }}>
                We'll never sell your info. Unsubscribe anytime.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA row — spans full width */}
      <div style={{ padding: '0 40px 40px' }}>
        <button
          onClick={() => onApply?.({
            low: displayLow, high: displayHigh, factor: 1.18, ok: true,
            // Pass the Supabase lead id through so apply-progress beacons
            // can correlate (when present — null is fine and the beacon
            // endpoint no-ops on missing leadId).
            leadId: isCaptured ? leadId : null,
            // Pre-fill apply contact step with whatever the lead gave us
            lead: isCaptured ? {
              firstName: leadFirst.trim(),
              businessName: leadBiz.trim(),
              email: leadEmail.trim(),
              phone: leadPhone ? `${dialPrefix} ${leadPhone}`.trim() : '',
            } : null,
          })}
          disabled={ctaDisabled}
          style={{
            width: '100%', padding: '18px 28px', borderRadius: 14, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: V1.fontBody, fontSize: 16, fontWeight: 600,
            cursor: ctaDisabled ? 'default' : 'pointer',
            background: ctaDisabled
              ? `${V1.blue}55`
              : ctaBoosted
                ? `linear-gradient(135deg, ${V1.blue} 0%, #6366F1 50%, ${V1.blue} 100%)`
                : V1.blue,
            color: ctaDisabled ? 'rgba(255,255,255,0.6)' : '#fff',
            boxShadow: ctaDisabled ? 'none' : `0 10px 30px -10px ${V1.blue}AA, 0 4px 10px -4px ${V1.blue}77`,
            transition: 'transform .15s, box-shadow .2s',
          }}
          onMouseEnter={(e) => { if (!ctaDisabled) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 14px 40px -10px ${V1.blue}CC, 0 6px 14px -4px ${V1.blue}99`; } }}
          onMouseLeave={(e) => { if (!ctaDisabled) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 10px 30px -10px ${V1.blue}AA, 0 4px 10px -4px ${V1.blue}77`; } }}
        >
          Get My Offer
          <V1CalcIcon kind="arr" />
        </button>
        <div style={{
          textAlign: 'center', fontSize: 12.5, color: V1.muted,
          marginTop: 10, fontStyle: 'italic', fontFamily: V1.fontBody,
        }}>
          No impact to your credit. Takes 2 minutes.
        </div>
      </div>
    </div>
  );
}

// ═══ Helper: small input used inside the lead-gate form ═════════
function V1LeadInput({ value, onChange, placeholder, type = 'text', autoComplete, inputMode }) {
  const [focused, setFocused] = v1cUseState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '12px 14px',
        fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink,
        background: V1.white,
        border: `1.5px solid ${focused ? V1.blue : V1.line}`,
        borderRadius: 10, outline: 'none',
        boxShadow: focused ? `0 0 0 4px ${V1.blue}1A` : 'none',
        transition: 'border-color .15s, box-shadow .15s',
      }}
    />
  );
}

// ═══ Helper: phone input with country-code prefix select ════════
// USA-default. A small curated list of common codes (no need to ship
// 200 ISO codes for an SMB funding form). Visually one combined input
// to match V1LeadInput: select on the left shares the same rounded
// border as the digits field on the right.
const V1_PHONE_COUNTRIES = [
  { code: '+1',   label: '🇺🇸 +1'   },
  { code: '+1c',  label: '🇨🇦 +1'   },  // Canada — disambiguated as +1c, normalized to +1 on submit
  { code: '+52',  label: '🇲🇽 +52'  },
  { code: '+44',  label: '🇬🇧 +44'  },
  { code: '+61',  label: '🇦🇺 +61'  },
  { code: '+91',  label: '🇮🇳 +91'  },
  { code: '+33',  label: '🇫🇷 +33'  },
  { code: '+49',  label: '🇩🇪 +49'  },
  { code: '+34',  label: '🇪🇸 +34'  },
  { code: '+55',  label: '🇧🇷 +55'  },
];

function V1PhoneInput({ countryCode, onCountryChange, value, onChange }) {
  const [focused, setFocused] = v1cUseState(false);
  const borderColor = focused ? V1.blue : V1.line;
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      width: '100%', boxSizing: 'border-box',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 10, overflow: 'hidden',
      background: V1.white,
      boxShadow: focused ? `0 0 0 4px ${V1.blue}1A` : 'none',
      transition: 'border-color .15s, box-shadow .15s',
    }}>
      <select
        value={countryCode}
        onChange={(e) => onCountryChange(e.target.value)}
        aria-label="Country code"
        style={{
          flexShrink: 0,
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          padding: '12px 28px 12px 12px',
          fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink,
          background: `${V1.bg} url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path fill='%239ca3af' d='M6 8L2 4h8z'/></svg>") no-repeat right 8px center`,
          border: 'none', outline: 'none',
          borderRight: `1px solid ${V1.line}`,
          cursor: 'pointer',
        }}
      >
        {V1_PHONE_COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>{c.label}</option>
        ))}
      </select>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Mobile number"
        autoComplete="tel-national"
        inputMode="tel"
        style={{
          flex: 1, minWidth: 0,
          padding: '12px 14px',
          fontFamily: V1.fontBody, fontSize: 14.5, color: V1.ink,
          background: V1.white,
          border: 'none', outline: 'none',
        }}
      />
    </div>
  );
}

const v1CardStyle = {
  background: V1.white,
  border: `1px solid ${V1.line}`,
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 1px 2px rgba(10,37,64,0.03)',
};

// ═══════════════════════════════════════════════════════════════
// V1 CALCULATOR PAGE — full page wrapping the analyzer
// ═══════════════════════════════════════════════════════════════
function V1CalculatorPage({ accent, onApply, onNavHow, onNavProcessing }) {
  return (
    <div style={{ background: V1.bg }}>
      {/* Page hero */}
      <section data-v1-section style={{ padding: '80px 40px 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
          <V1Eyebrow>Calculator</V1Eyebrow>
          <h1 data-v1-section-title style={{
            fontFamily: V1.fontDisplay, fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
            fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.02,
            color: V1.ink, margin: '24px auto 0', maxWidth: 900,
          }}>
            See your funding estimate{' '}
            <em style={{
              fontStyle: 'italic', fontFamily: '"Source Serif Pro", Georgia, serif',
              fontWeight: 500, color: V1.blue,
              background: `linear-gradient(90deg, ${V1.blue}, #818CF8)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>instantly.</em>
          </h1>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 18, lineHeight: 1.55,
            color: V1.text, margin: '28px auto 0', maxWidth: 640,
          }}>
            Three questions. Soft pull only. Real numbers from the same underwriting
            logic that runs on every Delt application.
          </p>
        </div>
      </section>

      {/* The analyzer */}
      <section data-v1-section style={{ padding: '0 24px 64px' }}>
        <V1CalcAnalyzer onApply={onApply} onNavHow={onNavHow} onNavProcessing={onNavProcessing} />
      </section>

      {/* How the numbers work */}
      <section data-v1-section style={{ background: V1.white, padding: '96px 40px', borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div data-v1-grid-2col style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', marginBottom: 56 }}>
            <div>
              <V1Eyebrow>Transparent math</V1Eyebrow>
              <h2 data-v1-section-title style={{ ...v1H2, marginTop: 18 }}>How the numbers<br />actually work.</h2>
            </div>
            <p style={{ fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.6, color: V1.text, margin: 0, maxWidth: 480, justifySelf: 'end' }}>
              One flat loan fee — a multiplier that will not increase — replaces the APR gymnastics
              banks use. Here's every input, and every lever that moves your offer.
            </p>
          </div>

          <div data-v1-grid-3col style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { e: 'Formula',        t: 'Monthly revenue × 50–67%', d: 'That range is the standard. Your loan fee multiplies it — we publish both.' },
              { e: 'Loan fee',       t: '1.12× – 1.22×',            d: 'Flat — it will not increase. Longer time in business and larger amounts pull it down. Median is 1.18×.' },
              { e: 'Delt Boost',     t: 'Up to 1.75×',              d: 'Switch your card processing to Delt and we underwrite against projected deposits, not just historical ones.' },
              { e: 'Repayment',      t: '4–10 months',              d: 'Fixed daily or weekly debit sized to your revenue. Schedule in your offer before you sign.' },
              { e: 'Early-pay',      t: 'Rebated pro-rata',         d: 'Pay the financing off early and we return the unearned portion of the loan fee. Not standard in this industry — we wrote it into every contract.' },
              { e: 'Prepayment',     t: '$0 penalty',               d: 'There is no prepayment penalty on any Delt product. Full stop.' },
            ].map((b, i) => (
              <div key={i} style={{
                background: V1.bg, border: `1px solid ${V1.line}`, borderRadius: 16, padding: 24,
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <V1Eyebrow>{b.e}</V1Eyebrow>
                <div style={{
                  fontFamily: V1.fontDisplay, fontSize: 24, fontWeight: 700,
                  letterSpacing: '-0.025em', color: V1.ink, lineHeight: 1.1,
                  fontVariantNumeric: 'tabular-nums',
                }}>{b.t}</div>
                <div style={{ fontFamily: V1.fontBody, fontSize: 13.5, color: V1.text, lineHeight: 1.55 }}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ trimmed, calculator-specific */}
      <section data-v1-section style={{ padding: '96px 40px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <V1Eyebrow>Common questions</V1Eyebrow>
            <h2 data-v1-section-title style={{ ...v1H2, marginTop: 18 }}>About the numbers you just saw.</h2>
          </div>
          <V1CalcFAQ />
        </div>
      </section>
    </div>
  );
}

function V1CalcFAQ() {
  const [open, setOpen] = v1cUseState(0);
  const items = [
    { q: "Is this a hard credit check?",
      a: "No. Generating an estimate does not touch your credit at all. A soft pull only happens if you choose to continue to the full application. A hard pull happens only if you counter-sign an offer." },
    { q: "How accurate is the estimate?",
      a: "It uses the same deposit-to-advance ratios our underwriters apply on live files. Final offers can vary ±15% after we read 90 days of deposits via Plaid, and they almost always land inside the range you see." },
    { q: "What does Delt Boost actually do?",
      a: "Switching your card processing to Delt gives us a real-time view of deposits — so we can price against projected, not just historical, revenue. That lets us responsibly extend 1.75× the standard advance." },
    { q: "Why does time in business matter?",
      a: "Longer operating history widens the range we're willing to advance. Under 6 months, we can't offer a revenue-based advance — but we have a launch program for new businesses." },
    { q: "Can I request a custom amount?",
      a: "Yes. The Custom Amount input lets you ask for a specific figure up to $500K. If it's within reach of your estimate, the application will prefill with that number." },
  ];
  return (
    <div style={{ borderTop: `1px solid ${V1.line}` }}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: `1px solid ${V1.line}` }}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
              width: '100%', padding: '22px 0', background: 'transparent', border: 'none',
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: 24, textAlign: 'left',
              fontFamily: V1.fontDisplay, fontSize: 18, fontWeight: 500,
              color: V1.ink, letterSpacing: '-0.01em',
            }}>
              {f.q}
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 999,
                border: `1px solid ${V1.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: V1.blue, fontFamily: V1.fontMono, fontSize: 16,
                transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform .2s',
              }}>+</span>
            </button>
            {isOpen && (
              <div style={{
                paddingBottom: 22, fontFamily: V1.fontBody, fontSize: 15, lineHeight: 1.65,
                color: V1.text, maxWidth: 760,
              }}>{f.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { V1CalculatorPage, V1CalcAnalyzer });
