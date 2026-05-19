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
    intro: 'How a Delt loan is priced. One flat fee, no APR, no compounding.',
    items: [
      {
        q: 'Is there interest for a loan from Delt?',
        short: 'No ongoing interest. One flat loan fee, locked in upfront.',
        a: (
          <>
            <p>
              No, loans from Delt have no ongoing interest charges. The total
              cost of the loan is simply the loan fee, which is the difference
              between the total owed amount and the initial loan amount you
              apply for on your Dashboard. The total cost of the loan never
              changes and your balance never grows.
            </p>
            <FaqMath
              rows={[
                ['Loan amount',     '$100,000'],
                ['Total owed',      '$118,000'],
                ['Loan fee',        '$18,000'],
                ['Ongoing interest', '$0'],
              ]}
              note="What you see at signing is what you pay — nothing accrues, nothing compounds."
            />
          </>
        ),
      },
      {
        q: "What's the cost of a Delt loan?",
        short: 'One flat fee — the difference between the total owed and the loan amount.',
        a: (
          <>
            <p>
              There is no interest, just one flat fee. The total cost of the
              loan is the loan fee, which is the difference between the total
              owed amount and the initial loan amount you apply for on your
              Dashboard. The total cost of the loan never changes and your
              balance never grows.
            </p>
            <p>
              Actual fees depend on your payment-processing history, loan
              amount, and other eligibility factors. You see the exact fee and
              total owed in the offer, before you sign.
            </p>
          </>
        ),
      },
      {
        q: 'Are there late fees or prepayment penalties?',
        short: 'No late fees. No prepayment penalty. Pay early at no extra cost.',
        a: (
          <>
            <p>
              <b>No late fees.</b> There are no additional late fees added to
              your total amount owed.
            </p>
            <p>
              <b>No prepayment penalty.</b> You can make prepayments at any
              time at no additional cost. The total amount you owe does not
              change due to prepayments — you simply finish the loan sooner.
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
    intro: 'What we look at, what offers look like, and whether applying touches your credit.',
    items: [
      {
        q: "How do you determine my business's loan offer?",
        short: 'Processing volume, account history, and payment frequency — not FICO.',
        a: (
          <>
            <p>
              Loan eligibility is based on a variety of factors related to
              your business, including its payment processing volume, account
              history, and payment frequency.
            </p>
            <ul style={faqUlStyle}>
              <li><b>Card processing volume</b> on your operating account</li>
              <li><b>Time on Delt</b> and overall account history</li>
              <li><b>Sales history and deposit consistency</b></li>
              <li><b>Status of any bankruptcy filings</b></li>
            </ul>
            <p>
              <a href="#" style={{ color: V1.blue, textDecoration: 'underline' }}>
                Learn more about eligibility for Delt business loans.
              </a>
            </p>
          </>
        ),
      },
      {
        q: 'What loan amounts are available through Delt?',
        short: 'Loan offers range from $1,000 to $350,000, based on business performance.',
        a: (
          <>
            <p>
              Loan offers range from <b>$1,000 to $350,000</b>, depending on
              your business performance. We take into account:
            </p>
            <ul style={faqUlStyle}>
              <li>Your time using Delt</li>
              <li>Your processing volume and frequency</li>
              <li>Your customer mix</li>
              <li>Your account history and sales consistency</li>
            </ul>
            <FaqMath
              rows={[
                ['Minimum offer', '$1,000'],
                ['Maximum offer', '$350,000'],
                ['Decision time', '< 6 hours'],
                ['Funding time',  'Next business day'],
              ]}
              note="Your exact offer range is set by underwriting and shown in your Dashboard."
            />
          </>
        ),
      },
      {
        q: 'Does applying for a Delt loan affect my credit score?',
        short: 'No. Applying does not affect your personal or business credit score.',
        a: (
          <>
            <p>
              No, applying for a Delt loan does not affect your personal or
              business credit score, and there is no credit score requirement
              to apply. We don't require a personal guarantee for your business
              to take a loan.
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
        q: 'How do I request a loan from Delt?',
        short: 'Eligible offers appear automatically in your Dashboard — no request needed.',
        a: (
          <>
            <p>
              If a loan offer is not available in your Delt Dashboard, your
              business is not eligible at this time. Rest assured, we
              automatically review Delt accounts on a daily basis to evaluate
              the many factors about your business that we already have to
              assess your loan eligibility.
            </p>
            <p>
              We will notify you if you become eligible for Delt Loans at a
              later time. You do not need to contact us or provide any
              additional information to become eligible for a loan offer.
            </p>
          </>
        ),
      },
      {
        q: 'How quickly are funds deposited?',
        short: 'Next business day after approval. Sometimes same-day.',
        a: (
          <>
            <p>
              Once approved, money is deposited in your account the
              <b> next business day</b>, subject to processing time and
              completion of the loan agreement. To reduce processing time,
              business ownership information on file with Delt should be up to
              date.
            </p>
          </>
        ),
      },
      {
        q: 'What can a Delt loan be used for?',
        short: 'Any legitimate business need — inventory, payroll, expansion, debt refi.',
        a: (
          <>
            <p>Loans can be used for any business need, including:</p>
            <ul style={faqUlStyle}>
              <li>Covering short-term cash flow</li>
              <li>Hiring employees and meeting payroll</li>
              <li>Purchasing inventory and equipment</li>
              <li>Refinancing and paying off existing debt</li>
              <li>Renovating an existing location</li>
              <li>Opening a new location</li>
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
    intro: 'How repayment works day-to-day, the terms available, and what happens on slow days.',
    items: [
      {
        q: 'How do I repay a loan from Delt?',
        short: 'A fixed percentage of your daily card sales, deducted automatically.',
        a: (
          <>
            <p>
              A fixed percentage of your daily card sales is deducted
              automatically until your loan is repaid. The percentage stays
              the same, but the amount adjusts to match your cash flow — if
              sales are up one day, you pay more; if you have a slow day, you
              pay less.
            </p>
            <FaqMath
              rows={[
                ['Daily sales · $3,850', 'Payment · $385'],
                ['Daily sales · $3,550', 'Payment · $355'],
                ['Daily sales · $4,280', 'Payment · $428'],
                ['Daily sales · $5,220', 'Payment · $522'],
                ['Daily sales · $5,890', 'Payment · $589'],
              ]}
              note="Illustrative — repayment flexes with your real sales volume."
            />
          </>
        ),
      },
      {
        q: 'What are the available repayment terms?',
        short: 'Target terms from 90 to 360 days, depending on eligibility.',
        a: (
          <>
            <p>
              Delt Loans offer different target repayment terms ranging from
              <b> 90 days to 360 days</b>, depending on eligibility. The
              maximum repayment term is 60 days following the end of the
              target repayment term. Any outstanding balance due at the end of
              the maximum term will be collected automatically via ACH.
            </p>
            <p>
              A minimum of <b>1/18 of the initial balance</b> must be repaid
              every 60 days to keep the loan in good standing.
            </p>
          </>
        ),
      },
      {
        q: 'What happens if I miss a payment?',
        short: 'We pull the 60-day minimum from your Delt balance or linked bank account.',
        a: (
          <>
            <p>
              If your daily card sales cannot cover the 60-day minimum
              payment, Delt may debit the remaining minimum payment amount due
              from your Delt balance or your Delt-linked bank account.
            </p>
            <p>
              There are no late fees added to the total amount owed. If you
              expect a sustained drop in revenue, call us before a minimum
              comes due — we've restructured ~12% of active books mid-term
              without penalty.
            </p>
          </>
        ),
      },
    ],
  },
  {
    k: 'finep',
    label: 'The fine print',
    eyebrow: '05 · The fine print',
    intro: 'Who issues the loan, what governs it, and where to read the legal terms.',
    items: [
      {
        q: 'Who issues Delt loans?',
        short: 'Delt Capital, a direct lender. Loans subject to credit approval.',
        a: (
          <>
            <p>
              Delt Loans are issued by Delt Capital as a direct lender. Loan
              eligibility is not guaranteed and all loans are subject to
              credit approval. A minimum payment is required and you must
              repay your loan as specified in the loan terms.
            </p>
            <p>
              Loans may not be available to borrowers in certain
              jurisdictions. Delt reserves the right to change or discontinue
              the program without notice. Terms and availability may change
              based on the business's ability to meet applicable credit and
              eligibility criteria.
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
          {['interest', 'repayment', 'eligibility', 'credit score', 'funds', 'late fees'].map((t) => (
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
