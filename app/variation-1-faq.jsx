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
        q: 'Is there interest for a loan from Delt?',
        short: 'No ongoing interest. One flat loan fee, locked in upfront.',
        a: (
          <>
            <p>
              No, loans from Delt have no ongoing interest charges. The total
              cost of the loan is simply the loan fee, which is the difference
              between the total owed amount and the initial loan amount you
              apply for on your Dashboard. The total cost of the loan never
              changes.
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
        q: 'How do I repay a loan from Delt?',
        short: 'A fixed percentage of your daily card sales, deducted automatically.',
        a: (
          <>
            <p>
              A fixed percentage of your daily card sales is deducted
              automatically until your loan is repaid. If sales are up one
              day, you pay more; if you have a slow day, you pay less.
            </p>
            <p>
              <a href="#" style={{ color: V1.blue, textDecoration: 'underline' }}>
                Learn more about Delt loan repayment.
              </a>
            </p>
          </>
        ),
      },
      {
        q: 'Does my rate get better on a second draw?',
        short: 'Yes. Repeat borrowers in good standing see the factor step down each renewal.',
        a: (
          <>
            <p>
              Renewal pricing is the cleanest discount we offer, and it isn't a
              promo — it's underwriting. Once we've watched a full repayment
              cycle on your account, the file gets cheaper to underwrite, and
              we pass that back. <b>Repeat borrowers in good standing typically
              see 4–8 basis points off the factor</b> on each renewal, with no
              re-application fee.
            </p>
            <p>
              68% of our book funds with us more than once. The first deal
              proves the relationship; every draw after that is priced like it.
            </p>
            <FaqMath
              rows={[
                ['First draw factor',   '1.20×'],
                ['Second draw factor',  '1.16×'],
                ['Third draw factor',   '1.14×'],
                ['Re-application fee',  '$0'],
                ['Decision time',       '< 6 hours'],
              ]}
              note="Illustrative — your renewal pricing is set by repayment history and current revenue."
            />
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
              <li><b>Minimum monthly revenue:</b> $15,000 (trailing 3 mo avg)</li>
              <li><b>Minimum time in business:</b> 6 months</li>
              <li><b>Minimum average daily balance:</b> $1,500</li>
              <li><b>Max negative days:</b> 5 in trailing 90 days</li>
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
        q: 'How do I request a loan from Delt?',
        short: 'Eligible offers appear automatically in your Dashboard — no request needed.',
        a: (
          <>
            <p>
              If a loan offer is not available in your Delt Dashboard, your
              business is not eligible at this time. Rest assured, we
              automatically review Delt accounts on a daily basis to evaluate
              the many factors about your business that we already have to
              assess your loan eligibility. We will notify you if you become
              eligible for Delt Loans at a later time. You do not need to
              contact us or provide any additional information to become
              eligible for a loan offer.
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
