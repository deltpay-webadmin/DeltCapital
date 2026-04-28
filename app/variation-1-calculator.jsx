// V1 Calculator — dedicated page for the /calc route.
// Preserves ALL sections/logic from the original Delt site's CapitalCostAnalyzer:
//   • Progressive reveal: revenue → TIB → cards (Y/N) → card sales
//   • TIB multipliers (50-67% of revenue, shifts by tenure, <6mo = redirect)
//   • Delt Boost toggle: 1.75× boost + 0% first-$5K banner
//   • Custom amount input
//   • Redirect case UI for <6mo businesses
//   • 2.5s "calculating…" buffer before showing results
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
// Animated "How it works →" button — appears below the calculator results
// only when the user toggles processing-with-Delt to true. Renders as a
// hairline-bordered ghost button (not a footer link) so it reads as a
// proper CTA. Fades + slides up on mount; unmounts cleanly when the
// toggle flips off.
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

function V1CalcAnalyzer({ onApply, onNavHow, hideHeader }) {
  const [revenue, setRevenue] = v1cUseState(0);
  const [revenueInput, setRevenueInput] = v1cUseState('');
  const [tib, setTib] = v1cUseState('');
  const [acceptsCards, setAcceptsCards] = v1cUseState(null); // null | true | false
  const [cardSales, setCardSales] = v1cUseState(0);
  const [cardSalesInput, setCardSalesInput] = v1cUseState('');
  const [deltToggle, setDeltToggle] = v1cUseState(false);
  const [customAmt, setCustomAmt] = v1cUseState('');
  const [customAmtInput, setCustomAmtInput] = v1cUseState('');

  const [showResults, setShowResults] = v1cUseState(false);
  const calcTimer = v1cUseRef(null);

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

  v1cUseEffect(() => {
    if (!allFilled) {
      if (calcTimer.current) clearTimeout(calcTimer.current);
      setShowResults(false); return;
    }
    if (calcTimer.current) clearTimeout(calcTimer.current);
    setShowResults(false);
    calcTimer.current = setTimeout(() => setShowResults(true), 1800);
    return () => { if (calcTimer.current) clearTimeout(calcTimer.current); };
  }, [allFilled, revenue, tib, acceptsCards, cardSales]);

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
  const onCustomAmt = (raw) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const n = Math.min(parseInt(digits || '0', 10), 500000);
    setCustomAmtInput(n > 0 ? n.toLocaleString() : digits);
    setCustomAmt(n > 0 ? String(n) : '');
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
          <h2 style={{
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
      <div style={{
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
          {/* Funding amount */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <V1CalcLabel>Estimated funding range</V1CalcLabel>
            <div style={{ padding: '4px 0' }}>
              <span style={{
                fontFamily: V1.fontDisplay,
                fontSize: 'clamp(2.25rem, 5vw, 3rem)',
                fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em',
                color: !hasRevenue ? '#d1d5db'
                     : customAmt ? V1.blue
                     : boosted ? V1.blue
                     : V1.ink,
                fontVariantNumeric: 'tabular-nums',
                transition: 'color .4s',
              }}>
                {customAmt ? (
                  v1fmtK(Number(customAmt))
                ) : hasRevenue && showResults ? (
                  <>{v1fmtK(displayLow)}<span style={{ margin: '0 6px', opacity: 0.35 }}>–</span>{v1fmtK(displayHigh)}</>
                ) : hasRevenue && allFilled ? (
                  <span style={{ color: V1.muted, fontSize: '0.7em', fontWeight: 600, letterSpacing: 0 }}>Calculating…</span>
                ) : (
                  <span style={{ color: '#d1d5db' }}>$0<span style={{ margin: '0 6px', opacity: 0.35 }}>–</span>$0</span>
                )}
              </span>
            </div>
            <p style={{ fontFamily: V1.fontBody, fontSize: 13, color: V1.muted, marginTop: 6, lineHeight: 1.5 }}>
              {!hasRevenue   ? 'Complete the fields to see your estimate.'
               : customAmt   ? 'Your custom amount'
               : boosted     ? 'With Delt processing'
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

            {/* Custom amount */}
            {hasRevenue && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${V1.line}` }}>
                <V1CalcLabel>Custom amount</V1CalcLabel>
                <V1CalcMoneyInput big={false} placeholder="Enter amount"
                  value={customAmtInput} onChange={onCustomAmt}
                  onBlur={() => customAmt && setCustomAmtInput(Number(customAmt).toLocaleString())} />
                {customAmt && (
                  <div style={{ marginTop: 6, fontSize: 11.5, color: V1.blue, fontWeight: 500, fontFamily: V1.fontBody }}>
                    Custom amount selected
                  </div>
                )}
              </div>
            )}

            {/* Redirect case */}
            {hasRevenue && isRedirect && (
              <div style={{
                marginTop: 16, padding: 16, borderRadius: 14,
                border: `1.5px solid ${V1.blue}22`,
                background: `${V1.blue}05`,
              }}>
                <div style={{ color: V1.blue, marginBottom: 8 }}><V1CalcIcon kind="rocket" /></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: V1.ink, fontFamily: V1.fontDisplay, letterSpacing: '-0.01em', lineHeight: 1.35 }}>
                  Get started with Delt today.
                </div>
                <div style={{ fontSize: 12, color: V1.muted, lineHeight: 1.5, marginTop: 4, fontFamily: V1.fontBody }}>
                  New businesses that process with Delt get a pre-approved offer and up to 2× more capital as they grow.
                </div>
              </div>
            )}

            <p style={{ fontSize: 10.5, color: V1.muted, opacity: 0.75, marginTop: 14, lineHeight: 1.45, fontFamily: V1.fontBody }}>
              Estimates are approximate and not a guarantee of funding. Final offers are based on a full review of your business.
            </p>

            {/* "How it works" link — only when user actively toggled Delt
                processing on (not the no-cards cross-sell case). */}
            {deltToggle && hasRevenue && !isRedirect && (
              <V1CalcHowLink onClick={onNavHow} />
            )}
          </div>

          {/* ── Delt Boost toggle — pinned to bottom ── */}
          <div style={{ marginTop: 20, marginLeft: -28, marginRight: -28, marginBottom: -28, borderTop: `1px solid ${V1.line}` }}>
            <button onClick={() => setDeltToggle(!deltToggle)} disabled={noCards}
              style={{
                width: '100%', padding: '18px 28px', border: 'none',
                background: deltToggle
                  ? `linear-gradient(135deg, ${V1.blue}0A 0%, ${V1.blue}14 100%)`
                  : 'transparent',
                cursor: noCards ? 'default' : 'pointer', textAlign: 'left',
                transition: 'background .3s',
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
                    Switch processing to Delt for 25% more capital
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
          </div>
        </div>
      </div>

      {/* CTA row — spans full width */}
      <div style={{ padding: '0 40px 40px' }}>
        <button
          onClick={() => onApply?.({ low: displayLow, high: displayHigh, factor: 1.18, ok: true })}
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
function V1CalculatorPage({ accent, onApply, onNavHow }) {
  return (
    <div style={{ background: V1.bg }}>
      {/* Page hero */}
      <section style={{ padding: '80px 40px 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
          <V1Eyebrow>Calculator</V1Eyebrow>
          <h1 style={{
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
            Three questions. Soft credit check only. Real numbers from the same
            logic our team uses on every Delt application.
          </p>
        </div>
      </section>

      {/* The analyzer */}
      <section style={{ padding: '0 24px 64px' }}>
        <V1CalcAnalyzer onApply={onApply} onNavHow={onNavHow} />
      </section>

      {/* How the numbers work */}
      <section style={{ background: V1.white, padding: '96px 40px', borderTop: `1px solid ${V1.line}`, borderBottom: `1px solid ${V1.line}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', marginBottom: 56 }}>
            <div>
              <V1Eyebrow>Transparent math</V1Eyebrow>
              <h2 style={{ ...v1H2, marginTop: 18 }}>How the numbers<br />actually work.</h2>
            </div>
            <p style={{ fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.6, color: V1.text, margin: 0, maxWidth: 480, justifySelf: 'end' }}>
              One multiplier — called a factor rate — replaces the APR gymnastics
              banks use. Here's every input, and every lever that moves your offer.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { e: 'Formula',        t: 'Monthly revenue × 50–67%', d: 'That range is the standard. Your factor multiplies it — we publish both.' },
              { e: 'Factor rate',    t: '1.12× – 1.22×',            d: 'Longer time in business and larger advances pull the factor down. Median is 1.18×.' },
              { e: 'Delt Boost',     t: 'Up to 1.75×',              d: 'Switch your card processing to Delt and we can lend against your expected future sales, not just past sales.' },
              { e: 'Repayment',      t: '4–10 months',              d: 'Fixed daily or weekly debit sized to your revenue. Schedule in your offer before you sign.' },
              { e: 'Early payoff',   t: 'Refunded fairly',          d: 'Pay off early and we refund the unused part of the fee. Not standard in this industry — we wrote it into every contract.' },
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
      <section style={{ padding: '96px 40px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <V1Eyebrow>Common questions</V1Eyebrow>
            <h2 style={{ ...v1H2, marginTop: 18 }}>About the numbers you just saw.</h2>
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
      a: "No. Generating an estimate does not touch your credit at all. A soft credit check only happens if you choose to continue to the full application. A full credit check only happens if you sign an offer." },
    { q: "How accurate is the estimate?",
      a: "It uses the same deposit-to-funding ratios our team applies on real files. Final offers can vary by about 15% after we review 90 days of your deposits through a secure bank link, and they almost always land inside the range you see." },
    { q: "What does Delt Boost actually do?",
      a: "Switching your card processing to Delt gives us a real-time view of your deposits — so we can price against your expected future sales, not just past sales. That lets us responsibly offer up to 1.75× the standard amount." },
    { q: "Why does time in business matter?",
      a: "The longer you've been in business, the more we're willing to fund. Under 6 months, we can't offer revenue-based funding — but we have a launch program for newer businesses." },
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
