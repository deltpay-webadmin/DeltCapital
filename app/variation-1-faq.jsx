// V1 FAQ page — dedicated, richer than the old homepage accordion.
// Structure:
//   Hero      — oversized headline + search bar + "ask an underwriter" chip
//   Jumpstack — 5 category nav pills (sticky) → scroll to section
//   Sections  — each category has an eyebrow, a short intro blurb, then
//                open-by-default Q&As with more depth (tables, callouts,
//                math examples, signed pull-quotes from specialists).
//   Still stuck? — bottom band routing to /talk booking.
//
// Tone: direct, operator-first, no marketing fluff. Every answer tries to
// include a concrete number or example where possible. Uses the same V1
// violet/navy/paper system as the rest of the site.

const FAQ_CATS = [
  {
    k: 'pricing',
    label: 'Pricing & cost',
    eyebrow: '01 · Pricing',
    intro: 'How Delt funding is priced. One flat fee, no APR, no compounding, no surprises.',
    items: [
      {
        q: 'Is there interest on Delt funding?',
        short: 'No interest. No compounding. One flat fee, locked in upfront.',
        a: (
          <>
            <p>
              No. Delt funding has no ongoing interest charges. The total cost
              is simply the funding fee — the difference between the total
              owed amount and the initial advance amount you see in your
              Dashboard. <b>The total cost never changes and your balance
              never grows.</b>
            </p>
            <FaqMath
              rows={[
                ['Advance amount',  '$100,000'],
                ['Total owed',      '$118,000'],
                ['Funding fee',     '$18,000'],
                ['Ongoing interest', '$0'],
              ]}
              note="What you see at signing is what you pay — nothing accrues, nothing compounds."
            />
          </>
        ),
      },
      {
        q: "What's the cost of Delt funding?",
        short: 'One flat fee — the difference between the total owed and the advance amount.',
        a: (
          <>
            <p>
              There's no interest, just one flat fee. The total cost is the
              funding fee, which is the difference between the total owed
              amount and the initial advance amount you see in your Dashboard.
              The total cost never changes and your balance never grows.
            </p>
            <p>
              Your exact fee is tailored to your business — based on
              processing history, advance amount, and account performance.
              You see the full number, in dollars, in the offer before you
              accept.
            </p>
          </>
        ),
      },
      {
        q: 'Are there late fees or prepayment penalties?',
        short: 'No late fees. No prepayment penalty. Pay early and you finish sooner — same cost.',
        a: (
          <>
            <p>
              <b>No late fees.</b> Nothing is ever added to your total amount
              owed. The number on your offer is the number — full stop.
            </p>
            <p>
              <b>No prepayment penalty.</b> Pay ahead any time at no extra
              cost. The total amount you owe doesn't change due to
              prepayments; you simply finish the advance sooner and free up
              your card sales.
            </p>
          </>
        ),
      },
    ],
  },
  {
    k: 'eligibility',
    label: 'Eligibility',
    eyebrow: '02 · Who qualifies',
    intro: "What we look at, what offers look like, and why applying won't touch your credit.",
    items: [
      {
        q: "How do you determine my business's offer?",
        short: 'Processing volume, account history, and payment frequency — not FICO.',
        a: (
          <>
            <p>
              Offers are based on a variety of factors related to your
              business, including its payment processing volume, account
              history, and payment frequency. We underwrite the cash flow
              that actually runs your business — not a credit score from
              three years ago.
            </p>
            <ul style={faqUlStyle}>
              <li><b>Card processing volume</b> through your operating account</li>
              <li><b>Time in business</b> and account history with Delt</li>
              <li><b>Sales consistency</b> and deposit patterns</li>
              <li><b>Customer mix</b> and revenue stability</li>
            </ul>
            <p>
              <a href="#" style={{ color: V1.blue, textDecoration: 'underline' }}>
                Learn more about eligibility for Delt funding.
              </a>
            </p>
          </>
        ),
      },
      {
        q: 'How much funding can I receive through Delt?',
        short: 'Offers are customized to your business performance — up to $350K.',
        a: (
          <>
            <p>
              Offers are <b>customized to your business</b> and can range up
              to <b>$350,000</b>, depending on performance. We take into
              account:
            </p>
            <ul style={faqUlStyle}>
              <li>Your processing volume and frequency</li>
              <li>Your time using Delt and account history</li>
              <li>Your customer mix and sales consistency</li>
            </ul>
            <FaqMath
              rows={[
                ['Maximum offer',  '$350,000'],
                ['Decision time',  '< 6 hours'],
                ['Funding time',   'Next business day'],
                ['Renewal pricing','Steps down each cycle'],
              ]}
              note="Your exact offer is set by underwriting and shown in your Dashboard."
            />
          </>
        ),
      },
      {
        q: 'Does applying for Delt funding affect my credit score?',
        short: 'No. Applying does not affect your personal or business credit.',
        a: (
          <>
            <p>
              No — applying for Delt funding doesn't affect your personal or
              business credit score, and <b>there is no credit score
              requirement to apply</b>. We don't require a personal guarantee
              for your business to take an advance, and we don't report to
              third-party credit bureaus.
            </p>
          </>
        ),
      },
    ],
  },
  {
    k: 'process',
    label: 'Process',
    eyebrow: '03 · Getting funded',
    intro: 'How offers appear, how fast funds land, and what the money can be used for.',
    items: [
      {
        q: 'How do I request funding from Delt?',
        short: 'Eligible offers appear automatically in your Dashboard — no application required.',
        a: (
          <>
            <p>
              If a funding offer is available in your Delt Dashboard, you can
              accept it in a few clicks — no long application, no paperwork
              pile. If you don't see an offer yet, <b>we review your account
              daily</b> against the same data we already have, so you don't
              need to contact us or submit anything extra.
            </p>
            <p>
              The moment you're eligible, we'll surface the offer in your
              Dashboard and notify you. It's that simple — funding finds you.
            </p>
          </>
        ),
      },
      {
        q: 'How quickly are funds deposited?',
        short: 'As soon as the next business day after approval.',
        a: (
          <>
            <p>
              Once approved, funds are deposited in your account <b>as soon
              as the next business day</b>, subject to processing time and
              completion of your funding agreement. Keeping your business
              ownership info on file with Delt up to date keeps things
              moving fast.
            </p>
          </>
        ),
      },
      {
        q: 'What can Delt funding be used for?',
        short: 'Any legitimate business need — inventory, payroll, marketing, expansion, debt refi.',
        a: (
          <>
            <p>Use it for anything that grows the business:</p>
            <ul style={faqUlStyle}>
              <li>Covering short-term cash flow</li>
              <li>Hiring employees and meeting payroll</li>
              <li>Purchasing inventory and equipment</li>
              <li>Investing in marketing and ad spend</li>
              <li>Refinancing higher-cost debt</li>
              <li>Renovating or opening a new location</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    k: 'repayment',
    label: 'Repayment',
    eyebrow: '04 · Repayment',
    intro: 'How repayment works day-to-day — and why it always moves with your business.',
    items: [
      {
        q: 'How do I pay back Delt funding?',
        short: 'A fixed percentage of your daily card sales — automatically, no invoice to chase.',
        a: (
          <>
            <p>
              You don't pay it back — your card sales do. A <b>fixed
              percentage of your daily card sales is deducted
              automatically</b> until the advance is complete. The percentage
              stays the same; the dollar amount moves with your business.
            </p>
            <ul style={faqUlStyle}>
              <li><b>Slow day?</b> You pay less. Repayment flexes down with you.</li>
              <li><b>Busy day?</b> You pay more — and finish the advance sooner.</li>
              <li><b>Zero-sale day?</b> Nothing comes out. We only pull from what you actually earn.</li>
            </ul>
            <FaqMath
              rows={[
                ['Daily sales · $3,550', 'Payment · $355'],
                ['Daily sales · $3,850', 'Payment · $385'],
                ['Daily sales · $4,280', 'Payment · $428'],
                ['Daily sales · $5,220', 'Payment · $522'],
                ['Daily sales · $5,890', 'Payment · $589'],
              ]}
              note="Illustrative at a 10% rate — repayment scales with your real sales volume."
            />
          </>
        ),
      },
      {
        q: 'How long does repayment take?',
        short: 'It depends on your sales. Busier months finish faster — and that\u2019s the point.',
        a: (
          <>
            <p>
              Because repayment is a percentage of card sales, the timeline
              is driven by your volume. Most advances complete in <b>roughly
              4 to 12 months</b>, with stronger sales months pulling the
              finish line forward. There's no monthly minimum that punishes a
              slow week.
            </p>
            <p>
              When you're ready for more, eligible businesses see <b>renewal
              offers with better pricing</b> as the relationship deepens — the
              first advance proves the fit; every advance after that is
              priced like it.
            </p>
          </>
        ),
      },
      {
        q: 'What if my sales drop mid-term?',
        short: 'Payments drop with them. That\u2019s the whole point of the model.',
        a: (
          <>
            <p>
              <b>Your payment moves with your sales — that's the point.</b>
              If revenue dips, the daily debit dips with it. You don't get
              stuck with a fixed monthly bill when the business is having a
              quiet week.
            </p>
            <p>
              If you're navigating a sustained change in revenue, just call
              us. We've worked with operators through seasonality, build-outs,
              and slow stretches — and we'd rather have the conversation
              early than not at all.
            </p>
          </>
        ),
      },
    ],
  },
];

// ─── UI bits ───

const faqUlStyle = {
  margin: '12px 0',
  paddingLeft: 20,
  fontFamily: V1.fontBody,
  fontSize: 15,
  color: V1.text,
  lineHeight: 1.7,
};

function FaqMath({ rows, note }) {
  return (
    <div style={{
      marginTop: 16, padding: '16px 20px',
      background: V1.bg, border: `1px solid ${V1.line}`, borderRadius: 10,
      fontFamily: V1.fontMono, fontSize: 13.5,
      color: V1.ink, lineHeight: 1.8, fontVariantNumeric: 'tabular-nums',
    }}>
      {rows.map(([k, v], i) => (
        <div key={k} style={{
          display: 'flex', justifyContent: 'space-between', gap: 16,
          padding: '2px 0',
          borderTop: i > 0 ? `1px dashed ${V1.line}` : 'none',
          paddingTop: i > 0 ? 6 : 0,
          marginTop: i > 0 ? 6 : 0,
        }}>
          <span style={{ color: V1.muted, letterSpacing: '0.04em' }}>{k}</span>
          <span style={{ fontWeight: 600 }}>{v}</span>
        </div>
      ))}
      {note && (
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${V1.line}`,
          fontFamily: V1.fontBody, fontSize: 13, color: V1.muted, fontStyle: 'italic',
        }}>{note}</div>
      )}
    </div>
  );
}

function FaqCallout({ children, tone = 'accent' }) {
  const col = tone === 'accent' ? V1.blue : V1.ink;
  return (
    <div style={{
      marginTop: 14, padding: '14px 18px',
      background: `${col}08`,
      borderLeft: `2px solid ${col}`, borderRadius: '2px 8px 8px 2px',
      fontFamily: V1.fontBody, fontSize: 14.5, lineHeight: 1.55,
      color: V1.ink,
    }}>{children}</div>
  );
}

function FaqQuote({ who, text }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        flexShrink: 0, width: 28, height: 28, borderRadius: 999,
        background: `${V1.blue}14`, color: V1.blue,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 2,
      }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 9V5h2v2h1.5L6 10H4zm5 0V5h2v2h1.5L11 10H9z"/></svg>
      </div>
      <div>
        <div style={{
          fontFamily: '"Source Serif Pro", Georgia, serif',
          fontStyle: 'italic', fontSize: 15.5, lineHeight: 1.5,
          color: V1.ink,
        }}>"{text}"</div>
        <div style={{
          marginTop: 4, fontFamily: V1.fontMono, fontSize: 10.5,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: V1.muted,
        }}>— {who}</div>
      </div>
    </div>
  );
}

function FaqItem({ item, open, onToggle, accent }) {
  const bodyRef = React.useRef(null);
  const [h, setH] = React.useState(0);
  React.useLayoutEffect(() => {
    if (bodyRef.current) setH(bodyRef.current.scrollHeight);
  }, [item, open]);

  return (
    <div style={{
      borderBottom: `1px solid ${V1.line}`,
      background: 'transparent',
    }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: '22px 0', border: 'none', background: 'transparent',
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'flex-start', gap: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: V1.fontDisplay, fontSize: 19, fontWeight: 600,
            letterSpacing: '-0.015em', color: V1.ink, lineHeight: 1.35,
          }}>{item.q}</div>
          {!open && item.short && (
            <div style={{
              marginTop: 6, fontFamily: V1.fontBody, fontSize: 14.5,
              color: V1.muted, lineHeight: 1.5,
            }}>{item.short}</div>
          )}
        </div>
        <div style={{
          flexShrink: 0, marginTop: 4,
          width: 30, height: 30, borderRadius: 999,
          border: `1px solid ${open ? accent : V1.line}`,
          background: open ? accent : 'transparent',
          color: open ? V1.white : accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
              style={{ transition: 'transform .2s', transformOrigin: 'center',
                transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}/>
          </svg>
        </div>
      </button>
      <div style={{
        overflow: 'hidden', transition: 'max-height .28s cubic-bezier(.2,.7,.3,1), opacity .2s',
        maxHeight: open ? h + 8 : 0, opacity: open ? 1 : 0,
      }}>
        <div ref={bodyRef} style={{
          paddingBottom: 26, paddingRight: 50,
          fontFamily: V1.fontBody, fontSize: 15.5, lineHeight: 1.65,
          color: V1.text,
        }}>
          {item.a}
        </div>
      </div>
    </div>
  );
}

function FaqCategorySection({ cat, openMap, setOpenMap, accent }) {
  return (
    <section data-v1-section id={`faq-${cat.k}`} style={{
      paddingTop: 80, paddingBottom: 8, scrollMarginTop: 90,
    }}>
      <div data-v1-grid-2col style={{
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: 60,
        alignItems: 'flex-start',
      }}>
        {/* Left rail — sticky eyebrow + intro */}
        <div style={{ position: 'sticky', top: 110 }}>
          <V1Eyebrow>{cat.eyebrow}</V1Eyebrow>
          <h2 data-v1-section-title style={{
            fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 600,
            letterSpacing: '-0.03em', color: V1.ink, lineHeight: 1.1,
            margin: '14px 0 16px',
          }}>{cat.label}.</h2>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 14.5, lineHeight: 1.55,
            color: V1.muted, margin: 0, maxWidth: 260,
          }}>{cat.intro}</p>
          <div style={{
            marginTop: 20, fontFamily: V1.fontMono, fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
          }}>
            {cat.items.length} question{cat.items.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Right — questions */}
        <div>
          {cat.items.map((item, i) => {
            const key = `${cat.k}-${i}`;
            const open = !!openMap[key];
            return (
              <FaqItem
                key={key}
                item={item}
                open={open}
                onToggle={() => setOpenMap((m) => ({ ...m, [key]: !m[key] }))}
                accent={accent}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqHero({ accent, query, setQuery, totalCount, filteredCount }) {
  return (
    <section data-v1-section style={{
      background: V1.ink, color: V1.white, position: 'relative', overflow: 'hidden',
      padding: '88px 40px 88px',
    }}>
      <div aria-hidden style={{
        position: 'absolute', top: -220, right: -160, width: 560, height: 560,
        background: `radial-gradient(circle, ${accent}33 0%, transparent 60%)`,
        filter: 'blur(20px)', pointerEvents: 'none',
      }}/>
      <div aria-hidden style={{
        position: 'absolute', bottom: -240, left: -120, width: 480, height: 480,
        background: `radial-gradient(circle, #4945FF22 0%, transparent 60%)`,
        filter: 'blur(20px)', pointerEvents: 'none',
      }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <V1Eyebrow color={V1.blueSoft}>Questions</V1Eyebrow>
        <h1 data-v1-section-title style={{
          fontFamily: V1.fontDisplay,
          fontSize: 'clamp(2.6rem, 6vw, 5rem)',
          fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1,
          color: V1.white, margin: '22px 0 0', maxWidth: 900,
        }}>
          What operators<br/>
          actually ask.{' '}
          <em style={{
            fontFamily: '"Source Serif Pro", Georgia, serif',
            fontStyle: 'italic', fontWeight: 400, color: accent,
          }}>Answered straight.</em>
        </h1>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 19, color: 'rgba(255,255,255,0.72)',
          lineHeight: 1.55, margin: '26px 0 0', maxWidth: 620,
        }}>
          No deflection, no "speak to a specialist." If a real operator asks it,
          we write the answer out and publish it — with numbers where we have them.
        </p>

        {/* Search */}
        <div style={{
          marginTop: 36, maxWidth: 640,
          position: 'relative',
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions — e.g. factor rate, Plaid, collateral…"
            style={{
              width: '100%', padding: '16px 20px 16px 50px',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid rgba(255,255,255,0.14)`,
              borderRadius: 12, color: V1.white,
              fontFamily: V1.fontBody, fontSize: 15, fontWeight: 400,
              outline: 'none', transition: 'border-color .15s, background .15s',
            }}
            onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.14)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
          />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeLinecap="round"
            style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="7.5" cy="7.5" r="5.5"/><path d="M12 12l4 4"/>
          </svg>
          {query && (
            <div style={{
              position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
              fontFamily: V1.fontMono, fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
            }}>
              {filteredCount}/{totalCount}
            </div>
          )}
        </div>

        {/* Hint chips */}
        <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)', padding: '7px 0',
          }}>Try —</span>
          {['cost', 'card sales', 'credit score', 'funding speed', 'slow days', 'renewals'].map((t) => (
            <button
              key={t}
              onClick={() => setQuery(t)}
              style={{
                padding: '6px 12px', borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'transparent', color: 'rgba(255,255,255,0.85)',
                fontFamily: V1.fontBody, fontSize: 12.5, cursor: 'pointer',
                transition: 'background .15s, border-color .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}
            >{t}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqCategoryNav({ cats, activeK, onJump, accent }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 9,
      background: `${V1.bg}F2`, backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${V1.line}`,
      padding: '14px 40px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: 24, overflowX: 'auto',
      }}>
        <span style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
          flexShrink: 0,
        }}>Jump to</span>
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {cats.map((c) => {
            const active = activeK === c.k;
            return (
              <button
                key={c.k}
                onClick={() => onJump(c.k)}
                style={{
                  padding: '8px 14px', borderRadius: 999, border: 'none',
                  background: active ? V1.ink : 'transparent',
                  color: active ? V1.white : V1.ink,
                  fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'background .15s, color .15s',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = V1.bgWarm; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; } }}
              >{c.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function V1FAQPage({ accent, onApply, onTalk }) {
  const [openMap, setOpenMap] = React.useState({ 'pricing-0': true }); // first one open
  const [query, setQuery] = React.useState('');
  const [activeK, setActiveK] = React.useState('pricing');

  // Filter categories by query — match on q + short
  const filteredCats = React.useMemo(() => {
    if (!query.trim()) return FAQ_CATS;
    const q = query.toLowerCase();
    return FAQ_CATS.map((c) => ({
      ...c,
      items: c.items.filter((it) =>
        it.q.toLowerCase().includes(q) ||
        (it.short && it.short.toLowerCase().includes(q)) ||
        c.label.toLowerCase().includes(q)
      ),
    })).filter((c) => c.items.length > 0);
  }, [query]);

  const totalCount = FAQ_CATS.reduce((n, c) => n + c.items.length, 0);
  const filteredCount = filteredCats.reduce((n, c) => n + c.items.length, 0);

  // Open all matches on active search
  React.useEffect(() => {
    if (!query.trim()) return;
    const next = {};
    filteredCats.forEach((c) => c.items.forEach((_, i) => { next[`${c.k}-${i}`] = true; }));
    setOpenMap(next);
  }, [query]);

  // Track scroll → active category for the sticky nav
  React.useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.28;
      let best = FAQ_CATS[0].k, bestDist = Infinity;
      for (const c of FAQ_CATS) {
        const el = document.getElementById(`faq-${c.k}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const d = Math.abs(top - mid);
        if (top <= mid + 100 && d < bestDist) { bestDist = d; best = c.k; }
      }
      setActiveK(best);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [filteredCats]);

  const jumpTo = (k) => {
    const el = document.getElementById(`faq-${k}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  return (
    <>
      <FaqHero accent={accent} query={query} setQuery={setQuery} totalCount={totalCount} filteredCount={filteredCount} />

      {!query.trim() && (
        <FaqCategoryNav cats={FAQ_CATS} activeK={activeK} onJump={jumpTo} accent={accent} />
      )}

      <div style={{ background: V1.bg, padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {filteredCats.length === 0 ? (
            <div style={{
              padding: '120px 0', textAlign: 'center',
              fontFamily: V1.fontBody, color: V1.muted,
            }}>
              <div style={{
                fontFamily: V1.fontDisplay, fontSize: 28, fontWeight: 600,
                color: V1.ink, letterSpacing: '-0.02em', marginBottom: 10,
              }}>No match for "{query}".</div>
              <p style={{ fontSize: 15, maxWidth: 420, margin: '0 auto 20px' }}>
                We probably haven't been asked this one yet. Ask it directly below —
                we'll write the answer and publish it.
              </p>
              <button
                onClick={onTalk}
                style={{
                  padding: '12px 22px', borderRadius: 10, border: 'none',
                  background: accent, color: V1.white, cursor: 'pointer',
                  fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
                }}
              >Ask an underwriter →</button>
            </div>
          ) : (
            filteredCats.map((cat) => (
              <FaqCategorySection
                key={cat.k}
                cat={cat}
                openMap={openMap}
                setOpenMap={setOpenMap}
                accent={accent}
              />
            ))
          )}
        </div>
      </div>

      {/* Closing band — still stuck? */}
      <section data-v1-section style={{
        background: V1.white, borderTop: `1px solid ${V1.line}`,
        padding: '72px 40px',
      }}>
        <div data-v1-grid-2col style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center',
        }}>
          <div>
            <V1Eyebrow>Still stuck</V1Eyebrow>
            <h2 data-v1-section-title style={{
              fontFamily: V1.fontDisplay, fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
              fontWeight: 600, letterSpacing: '-0.03em', color: V1.ink,
              margin: '14px 0 0', lineHeight: 1.1,
            }}>
              Got a question we didn't answer?{' '}
              <em style={{
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontStyle: 'italic', fontWeight: 400, color: accent,
              }}>Ask an actual person.</em>
            </h2>
            <p style={{
              fontFamily: V1.fontBody, fontSize: 16, color: V1.text,
              lineHeight: 1.55, margin: '20px 0 0', maxWidth: 540,
            }}>
              30 minutes on Teams with one of three underwriters. They own their
              book — no handoffs, no call center. Bring any question; if we
              can't answer it on the call, we'll come back within 24 hours.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={onTalk}
              style={{
                padding: '15px 22px', borderRadius: 12, border: 'none',
                background: accent, color: V1.white,
                fontFamily: V1.fontBody, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', gap: 10,
                transition: 'filter .15s, transform .1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Talk to an underwriter
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              onClick={onApply}
              style={{
                padding: '14px 22px', borderRadius: 12,
                border: `1px solid ${V1.line}`, background: V1.white, color: V1.ink,
                fontFamily: V1.fontBody, fontSize: 14.5, fontWeight: 500,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'background .15s, border-color .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = V1.bg; e.currentTarget.style.borderColor = V1.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = V1.white; e.currentTarget.style.borderColor = V1.line; }}
            >
              Or Get Funded
            </button>
            <div style={{
              marginTop: 4,
              fontFamily: V1.fontMono, fontSize: 10.5,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: V1.muted, textAlign: 'center',
            }}>
              30 min · Teams · No credit pull
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, { V1FAQPage });
