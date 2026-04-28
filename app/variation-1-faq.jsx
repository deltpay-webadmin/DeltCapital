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
    label: 'Pricing & rates',
    eyebrow: '01 · Pricing',
    intro: 'How the factor rate works, why it\'s a single number, and what you actually pay.',
    items: [
      {
        q: "What's a factor rate, really?",
        short: 'One multiplier. $100K at 1.18× = $118K repaid, total.',
        a: (
          <>
            <p>
              A factor rate is a single multiplier applied to the advance, once.
              Sign for $100,000 at 1.18× and you owe $118,000 — no matter how
              fast or slow you pay it back. No compounding, no APR reset, no
              late-payment fee that cascades into interest on interest.
            </p>
            <p>
              Pay early and we <b>rebate the unearned factor</b>. If you
              retire the balance at month 4 of a 10-month schedule, you get
              roughly 60% of the factor returned to your account. Most lenders
              will quietly collect the full factor. We won't.
            </p>
            <FaqMath
              rows={[
                ['Advance',            '$100,000'],
                ['Factor rate',        '1.18×'],
                ['Total repaid',       '$118,000'],
                ['Term',               '10 months'],
                ['Fixed weekly debit', '$2,724'],
              ]}
              note="Pay early? Retire at month 5 and get ~$5,900 rebated."
            />
          </>
        ),
      },
      {
        q: 'How is repayment structured?',
        short: 'Fixed daily or weekly debit sized to your revenue. 4–10 months.',
        a: (
          <>
            <p>
              A fixed ACH pulled on the schedule you pick — daily (Mon–Fri) or
              weekly. Typical term is 4–10 months. You see the debit amount and
              exact schedule in the offer, before you sign. No variable
              repayment, no "holdback" of card sales, no surprise adjustments.
            </p>
            <p>
              Want to pause? <b>We've restructured ~12% of active books</b>
              {' '}mid-term without penalty. Call us before you miss a debit
              and we'll work it out. Miss three in a row without calling and
              it becomes a collections problem — fair warning.
            </p>
          </>
        ),
      },
      {
        q: 'Do brokers get a different rate?',
        short: "Broker-sourced deals carry the broker's points, not ours.",
        a: (
          <>
            <p>
              Direct applicants always see the lowest published rate. Brokers
              add their own points on top of our buy rate — that's their
              business, not ours. If you applied through a broker and want to
              compare, ask them for the Delt buy-rate sheet (they have it).
            </p>
            <FaqCallout tone="accent">
              <b>Rule of thumb:</b> if your broker quoted you 1.28× and up, you
              can usually apply to us direct and land in the 1.14–1.20× range.
            </FaqCallout>
          </>
        ),
      },
      {
        q: 'What fees are you not showing me?',
        short: 'One origination fee. That\'s it. No junk fees, no closing costs.',
        a: (
          <>
            <p>
              There's a <b>flat $395 origination fee</b> that's already baked
              into the factor rate you see — it's not added on top. No wire
              fees, no ACH fees, no "documentation" fees, no UCC filing fees,
              no closing costs. The number on your offer is the number.
            </p>
            <p>
              If you ever see a line item you don't recognize on a funding
              statement, email <code>compliance@delt.capital</code>. We owe you
              an explanation within 24 hours.
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
    intro: 'What we look at, what we don\'t, and what disqualifies a file fast.',
    items: [
      {
        q: 'What do you actually underwrite on?',
        short: 'Deposit stability over the last 90 days. Not FICO, not collateral.',
        a: (
          <>
            <p>
              We read 90 days of business-deposit flow through Plaid and model
              three things: <b>average daily balance, deposit consistency,</b>
              and <b>negative-day frequency.</b> That's ~80% of the decision.
            </p>
            <ul style={faqUlStyle}>
              <li><b>Minimum monthly revenue:</b> $15,000 (trailing 3 mo avg)</li>
              <li><b>Minimum time in business:</b> 6 months</li>
              <li><b>Minimum average daily balance:</b> $1,500</li>
              <li><b>Max negative days:</b> 5 in trailing 90 days</li>
            </ul>
            <p>
              FICO is a tiebreaker on edge cases. We've funded operators with
              580 scores and declined operators with 780s. The book tells
              us what the score can't.
            </p>
          </>
        ),
      },
      {
        q: 'Do I need collateral?',
        short: 'No UCC-1 filing. No PG beyond standard assurance.',
        a: (
          <>
            <p>
              We don't file UCC-1s against your business. The only guarantee
              we require is a <b>standard personal assurance</b> — you agree
              not to move assets out of the operating entity while the book is
              active. That's enforceable, but it's not a lien.
            </p>
            <p>
              Inventory, receivables, equipment, real estate — we don't touch
              any of it. If a lender is asking for collateral on a $50K–$150K
              revenue-based advance, that's a red flag, not us.
            </p>
          </>
        ),
      },
      {
        q: 'What industries do you avoid?',
        short: 'A short list — mostly regulatory, not judgmental.',
        a: (
          <>
            <p>
              We can't fund: cannabis (state-legal or otherwise), firearms
              retailers, gambling operators, MLM / network marketing, adult
              entertainment, crypto exchanges, or anything on the OFAC SDN list.
            </p>
            <p>
              We <i>can</i> fund: restaurants, retail, logistics, healthcare
              (ex-pharma), construction, trades, e-commerce, services,
              manufacturing, auto, beauty, fitness, and about 80 other NAICS
              codes. If you're not sure, apply — Get Funded tells you in 60s.
            </p>
          </>
        ),
      },
      {
        q: 'I have an open MCA — can I still get funded?',
        short: 'Yes, if the ratios work. We consolidate often.',
        a: (
          <>
            <p>
              About 40% of our book has an existing advance at the time of
              application. We'll often consolidate it into a single Delt
              position at a better rate — especially if you're stacking
              across 3+ lenders. One debit is easier than five.
            </p>
            <p>
              What kills a file: total daily debits &gt;8% of average daily
              deposits. If you're there already, we'll say so and tell you what
              needs to clear first.
            </p>
          </>
        ),
      },
    ],
  },
  {
    k: 'process',
    label: 'Process',
    eyebrow: '03 · How it works',
    intro: 'What happens between "apply" and "funded" and how long each step takes.',
    items: [
      {
        q: 'Will this hurt my credit?',
        short: 'No. Get Funded is a soft pull. Hard pull only on counter-sign.',
        a: (
          <>
            <p>
              Get Funded runs a <b>soft inquiry</b> — no effect on your
              score. A hard pull happens <i>only</i> if you counter-sign an
              offer, and it's on the personal guarantor, not the business EIN.
            </p>
            <p>
              If you apply, get an offer, and decide not to take it, your
              credit is untouched. We don't sell your information or pass your
              application to partners — ever.
            </p>
          </>
        ),
      },
      {
        q: 'How fast is "24 hours", really?',
        short: 'Median time from signed offer to wire: 19 hours.',
        a: (
          <>
            <p>
              Marketing says 24 hours. The actual median across Q4 was{' '}
              <b>19h 14m</b> from signed offer to cleared wire. Here's where
              the time goes on a typical file:
            </p>
            <FaqMath
              rows={[
                ['Get Funded → applied',     '1–3 min'],
                ['Applied → bank connected', '5–10 min'],
                ['Connected → offer issued', '2–6 hours'],
                ['Offer → counter-signed',   'your call'],
                ['Signed → wire cleared',    '4–18 hours'],
              ]}
              note="Same-day funding is available on files submitted before 10am ET."
            />
            <p>
              Files submitted after 3pm ET on Fridays fund Monday — that's the
              one exception we can't bend.
            </p>
          </>
        ),
      },
      {
        q: 'What do I need to apply?',
        short: 'EIN, driver\'s license, and 15 minutes.',
        a: (
          <>
            <p>
              You'll need: your EIN, a driver's license photo, and Plaid
              credentials for your primary operating bank. That's it. No tax
              returns, no P&amp;L, no three months of statements, no voided
              check. If an underwriter asks for more, it's almost always on
              files over $250K or in one of our stricter NAICS codes.
            </p>
          </>
        ),
      },
      {
        q: 'Can I apply if my bookkeeping is a mess?',
        short: 'Yes. We read deposits, not QuickBooks.',
        a: (
          <>
            <p>
              We don't need clean books to underwrite. If the cash is moving
              through your operating account, we can see it. Cash-based
              businesses (laundromats, barbershops, some restaurants) are
              harder — we need to see deposits landing, not just revenue
              reported. But "behind on reconciliation" doesn't kill a file.
            </p>
          </>
        ),
      },
    ],
  },
  {
    k: 'security',
    label: 'Security & data',
    eyebrow: '04 · Security',
    intro: 'What we see, what we don\'t, what we keep, and how to revoke.',
    items: [
      {
        q: 'What can Delt do with my bank connection?',
        short: 'Read-only. We see balances and deposits. We cannot move money.',
        a: (
          <>
            <p>
              Plaid gives us a <b>read-only token</b> scoped to the accounts
              you choose. We see: daily balances, deposits, and withdrawals,
              categorized. We can't initiate transfers, change credentials,
              open accounts, or pull card data. The same security layer runs
              Venmo, Chime, and Robinhood.
            </p>
            <p>
              Revoke access anytime at{' '}
              <code style={{ color: V1.blue }}>my.plaid.com</code> — it kills
              our read token immediately.
            </p>
          </>
        ),
      },
      {
        q: 'What data do you keep, and for how long?',
        short: '90 days of deposit summaries. 7 years of signed contracts.',
        a: (
          <>
            <p>
              If you're approved and funded, we retain aggregate deposit
              summaries (weekly totals, no individual transactions) for the
              life of the book plus 7 years — that's the SBA-equivalent
              retention standard, and it's what our compliance team signs off
              on.
            </p>
            <p>
              If you apply and are declined, or apply and walk, we{' '}
              <b>purge raw bank data within 30 days</b>. You can request
              earlier deletion at any point by emailing{' '}
              <code>privacy@delt.capital</code>.
            </p>
          </>
        ),
      },
      {
        q: 'Do you sell my data?',
        short: 'No.',
        a: (
          <p>
            We don't sell, rent, or share your data with third-party
            marketers, lead-gen networks, data brokers, or "partners." If you
            apply with us and then start getting MCA calls three days later,
            that isn't from us. Forward the call with the number to{' '}
            <code>abuse@delt.capital</code> and we'll investigate — a few
            employees have been terminated over this. We take it seriously.
          </p>
        ),
      },
    ],
  },
  {
    k: 'after',
    label: 'After funding',
    eyebrow: '05 · Once you\'re funded',
    intro: 'Renewals, pay-off, servicing, and what happens if things go sideways.',
    items: [
      {
        q: 'What if revenue drops mid-term?',
        short: 'Call us. ~12% of books get restructured without penalty.',
        a: (
          <>
            <p>
              Revenue drops happen. Seasonal businesses, bad quarters, a
              pandemic — we've seen it. What we ask: <b>call before you miss
              a debit.</b> We'll run a restructure — typically a 30-day
              deferral followed by a smaller debit over a longer term. No
              penalty. No added factor.
            </p>
            <FaqQuote
              who="Elena Morgan, Funding Advisor"
              text="Missed debits without a heads-up are what hurt. A phone call 48 hours ahead is always cheaper than the alternative."
            />
          </>
        ),
      },
      {
        q: 'When can I renew for more?',
        short: 'At 50% paid down. Often at a lower factor.',
        a: (
          <>
            <p>
              Most operators renew at the 50% pay-down mark — we roll the
              remaining balance into a new, larger advance. Repeat clients
              see their factor drop by <b>2–4 basis points</b> on average per
              renewal, up to three renewals. After that you've earned the
              floor rate we publish.
            </p>
          </>
        ),
      },
      {
        q: "What's Delt Boost?",
        short: 'Card-processing switch that unlocks a higher advance ceiling.',
        a: (
          <>
            <p>
              Switching your card processing to Delt gives us a real-time view
              of deposits — not just historical. That lets us responsibly
              extend <b>1.75× the standard advance ceiling</b> and shave 1–3
              basis points off your factor. It's optional; nothing about your
              primary offer depends on it.
            </p>
            <p>
              Fees are standard (interchange + 0.15%). We don't make
              processing a condition of funding, and we don't lock you in —
              cancel anytime without affecting your advance.
            </p>
          </>
        ),
      },
      {
        q: 'Can I pay off early?',
        short: 'Yes — with a rebate on unearned factor. No penalty.',
        a: (
          <>
            <p>
              Pay off at any time. We rebate the <b>unearned portion</b> of
              the factor, pro-rated to how far into the term you are. Most
              competitors collect the full factor regardless — read the fine
              print. We spell it out on page 1 of the contract.
            </p>
            <FaqMath
              rows={[
                ['Original factor cost', '$18,000'],
                ['Term',                 '10 months'],
                ['Paid off at',          'Month 4'],
                ['Factor earned',        '$7,200 (40%)'],
                ['Rebate to you',        '$10,800'],
              ]}
            />
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
    <section id={`faq-${cat.k}`} style={{
      paddingTop: 80, paddingBottom: 8, scrollMarginTop: 90,
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: 60,
        alignItems: 'flex-start',
      }}>
        {/* Left rail — sticky eyebrow + intro */}
        <div style={{ position: 'sticky', top: 110 }}>
          <V1Eyebrow>{cat.eyebrow}</V1Eyebrow>
          <h2 style={{
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
    <section style={{
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
        <h1 style={{
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
          {['factor rate', 'plaid', 'collateral', 'soft pull', 'early payoff', 'renew'].map((t) => (
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
      <section style={{
        background: V1.white, borderTop: `1px solid ${V1.line}`,
        padding: '72px 40px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center',
        }}>
          <div>
            <V1Eyebrow>Still stuck</V1Eyebrow>
            <h2 style={{
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
