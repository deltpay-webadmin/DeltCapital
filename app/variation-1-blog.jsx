// V1 Blog index — "The Ledger", Delt's editorial notebook.
// Structure:
//   Masthead   — Vol / Issue dateline strip, oversized display lockup
//   Featured   — one lead editorial (full-bleed photo placeholder + deck)
//   Categories — sticky filter pills: Underwriting, Operators, Policy, etc
//   Grid       — 6 recent posts in a 3-col editorial grid
//   Series     — a horizontal rail for "The Floor Rate" (underwriter letters)
//   Archive    — compact list of older pieces with issue/vol numbers
//   Newsletter — trailing band; monospaced input, purple accent
//
// Tone: operator-first, direct, no marketing platitudes. Every post has a
// short deck (standfirst), reading time, author, issue label, and a short
// "tl;dr" that a busy founder can scan in 3 seconds.

const BLOG_CATS = [
  { k: 'all',        label: 'All dispatches' },
  { k: 'underwrite', label: 'Underwriting' },
  { k: 'operators',  label: 'Operators' },
  { k: 'pricing',    label: 'Pricing & rates' },
  { k: 'policy',     label: 'Policy' },
  { k: 'field',      label: 'Field notes' },
];

const BLOG_POSTS = [
  {
    id: 'plaid-over-fico',
    cat: 'underwrite',
    issue: 'Vol. VII · No. 14',
    date: 'Mar 18, 2026',
    read: '11 min',
    kicker: 'The case against credit scores',
    title: 'Why we stopped pulling FICO for the first 90% of a file.',
    deck: 'Three years of declined-but-funded data, a stubborn correlation nobody wanted to publish, and the day our chief underwriter tore up the scorecard.',
    tldr: 'Deposit variance predicts repayment 3.4× better than FICO. We stopped leading with credit in 2023 and default rates actually dropped.',
    author: { n: 'Elena Morgan', r: 'Lead Underwriter' },
    tags: ['data', 'policy', 'underwriting'],
    featured: true,
  },
  {
    id: 'factor-math-cfo',
    cat: 'pricing',
    issue: 'Vol. VII · No. 13',
    date: 'Mar 11, 2026',
    read: '7 min',
    kicker: 'Pricing, unpacked',
    title: 'The factor-rate math your CFO wishes you\'d send them.',
    deck: 'A one-page spreadsheet, a signed NDA, and the reason we publish buy rates when every other lender hides them.',
    tldr: '1.18× over 10 months ≈ 36% APR simple. Published, once, so operators stop doing this on the back of a napkin.',
    author: { n: 'Kevin Cheng', r: 'Head of Pricing' },
    tags: ['pricing', 'apr', 'transparency'],
  },
  {
    id: 'restaurant-cash-gap',
    cat: 'operators',
    issue: 'Vol. VII · No. 13',
    date: 'Mar 06, 2026',
    read: '9 min',
    kicker: 'Operator notebook',
    title: 'Bridging the 47-day gap between invoice and deposit.',
    deck: 'Three restaurants, one logistics company, and the cash-flow pattern nobody talks about at the franchise convention.',
    tldr: 'Average B2B deposit lag for SMB operators: 47 days. It\'s getting worse. Here\'s the rolling-advance pattern that fixes it.',
    author: { n: 'Marcus Rivera', r: 'Ops Research' },
    tags: ['operators', 'cash-flow', 'restaurants'],
  },
  {
    id: 'mca-vs-delt',
    cat: 'pricing',
    issue: 'Vol. VII · No. 12',
    date: 'Feb 27, 2026',
    read: '6 min',
    kicker: 'Competitive',
    title: 'The MCA receipt we keep pinned above the underwriting desk.',
    deck: 'A screenshot of a 1.42× "daily" offer, a margin-note from the CEO, and the reason we turned down a $40M warehouse line.',
    tldr: 'A brokered MCA at 1.42× penciled out to 61% APR. We priced the same file at 1.16×. Receipt on file.',
    author: { n: 'Elena Morgan', r: 'Lead Underwriter' },
    tags: ['mca', 'pricing', 'comparison'],
  },
  {
    id: 'restructure-call',
    cat: 'operators',
    issue: 'Vol. VII · No. 12',
    date: 'Feb 21, 2026',
    read: '5 min',
    kicker: 'From the field',
    title: 'How to call us before you miss a debit.',
    deck: 'The 90-second phone script we give every underwriter — and what to say on your side so the restructure is boring.',
    tldr: 'A 48-hour heads-up is always cheaper than a missed debit. Here\'s the exact three-question script our underwriters use.',
    author: { n: 'Priya Shah', r: 'Servicing' },
    tags: ['servicing', 'restructure', 'operators'],
  },
  {
    id: 'cfpb-1071',
    cat: 'policy',
    issue: 'Vol. VII · No. 11',
    date: 'Feb 14, 2026',
    read: '14 min',
    kicker: 'Regulation read',
    title: 'Section 1071 is here. What it actually means for small-biz lending.',
    deck: 'A plain-English walk through what CFPB 1071 obligates lenders to collect — and why we published our disparity data voluntarily.',
    tldr: 'The new rule forces race/gender/revenue disclosure on small-biz apps. We started two years early. Our data is publicly downloadable.',
    author: { n: 'Jordan Kessler', r: 'General Counsel' },
    tags: ['policy', 'cfpb', 'compliance'],
  },
  {
    id: 'plaid-limits',
    cat: 'underwrite',
    issue: 'Vol. VII · No. 11',
    date: 'Feb 09, 2026',
    read: '8 min',
    kicker: 'Underwriting',
    title: 'Five cases where Plaid isn\'t enough (and what we do instead).',
    deck: 'Cash-heavy businesses, deposit-splitting across accounts, and the kind of operator file where we ask for statements the old-fashioned way.',
    tldr: 'Plaid covers ~88% of files. The other 12% — laundromats, some beauty salons, split-account ops — we underwrite on 3mo statements.',
    author: { n: 'Elena Morgan', r: 'Lead Underwriter' },
    tags: ['plaid', 'underwriting', 'edge-cases'],
  },
  {
    id: 'rate-sheet-oct',
    cat: 'pricing',
    issue: 'Vol. VII · No. 10',
    date: 'Feb 03, 2026',
    read: '4 min',
    kicker: 'Rate sheet',
    title: 'Q1 2026 rate sheet, published with a changelog.',
    deck: 'A dry document with one interesting detail: what we changed since October, and why.',
    tldr: 'Floor rate held at 1.12×. Median moved from 1.19 → 1.18. One tier tightened, one expanded. Changelog on page 3.',
    author: { n: 'Kevin Cheng', r: 'Head of Pricing' },
    tags: ['rate-sheet', 'pricing', 'quarterly'],
  },
  {
    id: 'underwriter-letter-01',
    cat: 'underwrite',
    series: 'The Floor Rate',
    issue: 'Letter 01',
    date: 'Jan 26, 2026',
    read: '6 min',
    kicker: 'The Floor Rate',
    title: 'On the files I say no to first.',
    deck: 'A monthly letter from the desk. This month: the three patterns that put a file in the decline pile before I\'ve read page two.',
    tldr: 'Stacking without disclosure, negative-days clustering, and mid-term re-applies. Three patterns, one rule: be honest up front.',
    author: { n: 'Elena Morgan', r: 'Lead Underwriter' },
    tags: ['series', 'underwriting'],
  },
  {
    id: 'underwriter-letter-02',
    cat: 'underwrite',
    series: 'The Floor Rate',
    issue: 'Letter 02',
    date: 'Dec 15, 2025',
    read: '5 min',
    kicker: 'The Floor Rate',
    title: 'The honest conversation about stacking.',
    deck: 'When a second position makes sense, when it doesn\'t, and what we actually see on books with three or more active advances.',
    tldr: 'One position: normal. Two: situational. Three+: call us before you sign anything else. The math stops working at about 11% DSO.',
    author: { n: 'Elena Morgan', r: 'Lead Underwriter' },
    tags: ['series', 'stacking'],
  },
  {
    id: 'underwriter-letter-03',
    cat: 'underwrite',
    series: 'The Floor Rate',
    issue: 'Letter 03',
    date: 'Nov 09, 2025',
    read: '7 min',
    kicker: 'The Floor Rate',
    title: 'A good offer is boring.',
    deck: 'The most valuable thing a lender can do is be predictable. A short argument for restraint in a market addicted to novelty.',
    tldr: 'If our offer surprises you, we failed. Boring offers compound into boring books, which compound into businesses that survive.',
    author: { n: 'Elena Morgan', r: 'Lead Underwriter' },
    tags: ['series', 'philosophy'],
  },
];

// Archive (shown as compact list)
const BLOG_ARCHIVE = [
  { issue: 'Vol. VII · No. 09', date: 'Jan 19, 2026', title: 'Twelve questions we now ask every first-time applicant.', read: '6 min' },
  { issue: 'Vol. VII · No. 08', date: 'Jan 12, 2026', title: 'What a "soft pull" actually is, in language a bureau doesn\'t use.', read: '4 min' },
  { issue: 'Vol. VII · No. 07', date: 'Jan 05, 2026', title: 'The holiday cash-flow gap: three charts, one recommendation.', read: '5 min' },
  { issue: 'Vol. VII · No. 06', date: 'Dec 22, 2025', title: 'We funded $47M in December. Here\'s where it went.', read: '4 min' },
  { issue: 'Vol. VII · No. 05', date: 'Dec 15, 2025', title: 'Reading revenue: how we underwrite off deposits, not FICO.', read: '3 min' },
  { issue: 'Vol. VII · No. 04', date: 'Dec 08, 2025', title: 'A receipt-per-customer dashboard for small-batch operators.', read: '8 min' },
  { issue: 'Vol. VII · No. 03', date: 'Dec 01, 2025', title: 'The renewal conversation: a checklist for the operator side.', read: '6 min' },
  { issue: 'Vol. VII · No. 02', date: 'Nov 24, 2025', title: 'Q4 2025 portfolio snapshot.', read: '9 min' },
];

// ─── Atoms ───

function BlogAvatar({ name, size = 28 }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  // Deterministic hue off of the name
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return (
    <span style={{
      width: size, height: size, borderRadius: 999,
      background: `linear-gradient(135deg, hsl(${h}, 40%, 60%), hsl(${(h + 40) % 360}, 45%, 45%))`,
      color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: V1.fontMono, fontSize: size * 0.4, fontWeight: 600,
      letterSpacing: '0.02em', flexShrink: 0,
    }}>{initials}</span>
  );
}

function BlogMeta({ post, color = V1.muted, onDark = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 500,
      letterSpacing: '0.14em', textTransform: 'uppercase', color,
    }}>
      <span>{post.issue}</span>
      <span aria-hidden style={{ opacity: 0.4 }}>·</span>
      <span>{post.date}</span>
      <span aria-hidden style={{ opacity: 0.4 }}>·</span>
      <span>{post.read}</span>
    </div>
  );
}

// Editorial illustration placeholder — generative abstract "plate" per post
function BlogPlate({ seed = 0, aspect = '16/10', tone = 'light' }) {
  // Deterministic shapes from seed
  const rand = (n) => { const x = Math.sin(n) * 10000; return x - Math.floor(x); };
  const hue = Math.floor(rand(seed * 7.1) * 30) + 250; // purple/violet range
  const sat = 20 + Math.floor(rand(seed * 3.3) * 35);
  const isDark = tone === 'dark';
  const bg = isDark ? V1.ink : `hsl(${hue}, ${sat}%, 96%)`;

  const shapes = [];
  for (let i = 0; i < 3; i++) {
    const s = seed * 11 + i * 7.7;
    shapes.push({
      cx: 20 + rand(s) * 60,
      cy: 20 + rand(s * 2) * 60,
      r: 12 + rand(s * 3) * 22,
      h: hue + (rand(s * 4) - 0.5) * 40,
      l: isDark ? 35 + rand(s * 5) * 15 : 70 + rand(s * 5) * 20,
      a: 0.3 + rand(s * 6) * 0.35,
    });
  }

  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: aspect,
      background: bg, overflow: 'hidden', borderRadius: 4,
    }}>
      <svg viewBox="0 0 100 62.5" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {shapes.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r}
            fill={`hsl(${s.h}, 60%, ${s.l}%)`} opacity={s.a}
            style={{ filter: `blur(${isDark ? 6 : 10}px)` }} />
        ))}
        {/* An editorial "plate mark" */}
        <text x="3" y="59" fontFamily="JetBrains Mono, monospace"
              fontSize="2.4" letterSpacing="0.18em"
              fill={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(10,37,64,0.35)'}
              style={{ textTransform: 'uppercase' }}>
          FIG. {String(seed).padStart(2, '0')}
        </text>
      </svg>
      {/* Subtle grid overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(to right, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(10,37,64,0.03)'} 1px, transparent 1px),
                          linear-gradient(to bottom, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(10,37,64,0.03)'} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── Masthead ───

function BlogMasthead({ accent }) {
  return (
    <section data-v1-section style={{
      background: V1.ink, color: V1.white,
      position: 'relative', overflow: 'hidden',
      padding: '64px 40px 72px',
    }}>
      <div aria-hidden style={{
        position: 'absolute', top: -200, left: '30%', width: 720, height: 720,
        background: `radial-gradient(circle, ${accent}28 0%, transparent 60%)`,
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -240, right: -120, width: 540, height: 540,
        background: `radial-gradient(circle, #4945FF1F 0%, transparent 60%)`,
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        {/* Top rule */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontFamily: V1.fontMono, fontSize: 11, color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}>
          <span>Vol. VII · Q1 2026 · No. 14</span>
          <span>Delt Capital Editorial · Est. 2019</span>
          <span style={{ color: accent, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: accent, boxShadow: `0 0 10px ${accent}` }} />
            Publishing weekly
          </span>
        </div>

        {/* Lockup */}
        <div data-v1-grid-2col style={{ paddingTop: 48, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64, alignItems: 'flex-end' }}>
          <div>
            <V1Eyebrow color={V1.blueSoft}>The Ledger</V1Eyebrow>
            <h1 data-v1-section-title style={{
              fontFamily: V1.fontDisplay,
              fontSize: 'clamp(3.4rem, 8vw, 7rem)',
              fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 0.92,
              color: V1.white, margin: '18px 0 0',
            }}>
              The Ledger.
              <br />
              <em style={{
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontStyle: 'italic', fontWeight: 400, color: accent,
              }}>Published notes</em>
              <br />
              from the desk.
            </h1>
          </div>
          <div style={{
            paddingBottom: 14,
            fontFamily: V1.fontBody, fontSize: 17, lineHeight: 1.55,
            color: 'rgba(255,255,255,0.72)', maxWidth: 440,
          }}>
            Underwriting dispatches, pricing letters, and operator field notes
            from the people who actually size your offer. One long read and a
            few short ones, most Wednesdays.
            <div style={{
              marginTop: 22, display: 'flex', alignItems: 'center', gap: 18,
              fontFamily: V1.fontMono, fontSize: 11, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
            }}>
              <span>{BLOG_POSTS.length + BLOG_ARCHIVE.length} dispatches</span>
              <span aria-hidden style={{ opacity: 0.4 }}>·</span>
              <span>6 authors</span>
              <span aria-hidden style={{ opacity: 0.4 }}>·</span>
              <span>~1,800 readers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Featured lead story ───

function BlogFeatured({ post, accent }) {
  return (
    <article style={{
      background: V1.white, borderBottom: `1px solid ${V1.line}`,
      padding: '72px 40px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <span style={{
            padding: '6px 14px', borderRadius: 999,
            background: `${accent}12`, color: accent,
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <span aria-hidden style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: 999,
              background: accent, boxShadow: `0 0 0 3px ${accent}22`,
            }} />
            This week's lead
          </span>
          <BlogMeta post={post} />
        </div>

        <div data-v1-grid-2col style={{
          display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56,
          alignItems: 'center',
        }}>
          <a style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: accent,
              marginBottom: 14,
            }}>{post.kicker}</div>
            <h2 data-v1-section-title style={{
              fontFamily: V1.fontDisplay,
              fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
              fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05,
              color: V1.ink, margin: 0,
            }}>
              {post.title}
            </h2>
            <p style={{
              fontFamily: '"Source Serif Pro", Georgia, serif',
              fontSize: 20, lineHeight: 1.5, color: V1.text,
              margin: '22px 0 0', maxWidth: 560, fontStyle: 'italic',
            }}>
              {post.deck}
            </p>

            {/* tl;dr pull-box */}
            <div style={{
              marginTop: 24, padding: '14px 18px',
              background: V1.bg, borderLeft: `2px solid ${accent}`,
              borderRadius: '2px 8px 8px 2px',
              fontFamily: V1.fontBody, fontSize: 14.5, lineHeight: 1.55,
              color: V1.ink, maxWidth: 560,
            }}>
              <span style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: accent, marginRight: 10,
              }}>tl;dr</span>
              {post.tldr}
            </div>

            {/* Author row */}
            <div style={{
              marginTop: 28, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <BlogAvatar name={post.author.n} size={34} />
              <div>
                <div style={{
                  fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600, color: V1.ink,
                }}>{post.author.n}</div>
                <div style={{
                  fontFamily: V1.fontMono, fontSize: 10.5, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: V1.muted, marginTop: 2,
                }}>{post.author.r}</div>
              </div>
              <span style={{ flex: 1 }} />
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10,
                background: V1.ink, color: V1.white,
                fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 600,
              }}>
                Read the full piece
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </a>

          {/* Plate */}
          <div style={{
            position: 'relative',
            boxShadow: `0 24px 60px -30px ${V1.ink}66`,
            borderRadius: 8, overflow: 'hidden',
            border: `1px solid ${V1.line}`,
          }}>
            <BlogPlate seed={14} aspect="4/5" tone="dark" />
            <div style={{
              position: 'absolute', bottom: 18, right: 18,
              fontFamily: V1.fontMono, fontSize: 10.5, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
              textAlign: 'right',
            }}>
              Plate 14 —<br/>
              The scorecard,<br/>in pieces
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Category filter ───

function BlogCategoryBar({ activeK, onSelect, counts, accent }) {
  return (
    <div style={{
      // top offset clears the sticky site header (~57px) so the filter bar
      // doesn't slide underneath it on scroll.
      position: 'sticky', top: 57, zIndex: 9,
      background: `${V1.white}F2`, backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${V1.line}`,
      padding: '14px 40px',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: 20, overflowX: 'auto',
      }}>
        <span style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: V1.muted,
          flexShrink: 0,
        }}>Filter</span>
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {BLOG_CATS.map((c) => {
            const active = activeK === c.k;
            const n = counts[c.k] || 0;
            return (
              <button
                key={c.k}
                onClick={() => onSelect(c.k)}
                style={{
                  padding: '8px 14px', borderRadius: 999, border: 'none',
                  background: active ? V1.ink : 'transparent',
                  color: active ? V1.white : V1.ink,
                  fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'background .15s, color .15s',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = V1.bgWarm; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; } }}
              >
                {c.label}
                <span style={{
                  fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                  padding: '2px 6px', borderRadius: 4,
                  background: active ? 'rgba(255,255,255,0.12)' : `${V1.ink}0F`,
                  color: active ? 'rgba(255,255,255,0.75)' : V1.muted,
                  letterSpacing: '0.04em',
                }}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Grid card ───

function BlogCard({ post, seed, accent }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 18,
        textDecoration: 'none', color: 'inherit', cursor: 'pointer',
        padding: 20, borderRadius: 14, border: `1px solid ${hover ? V1.ink : 'transparent'}`,
        background: hover ? V1.white : 'transparent',
        transition: 'border-color .15s, background .15s, transform .15s',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      <BlogPlate seed={seed} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: accent,
        }}>
          <span>{post.kicker}</span>
          <span aria-hidden style={{ opacity: 0.4, color: V1.muted }}>·</span>
          <span style={{ color: V1.muted }}>{post.read}</span>
        </div>

        <h3 style={{
          fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
          letterSpacing: '-0.02em', lineHeight: 1.2, color: V1.ink, margin: 0,
        }}>
          {post.title}
        </h3>
        <p style={{
          fontFamily: V1.fontBody, fontSize: 14.5, lineHeight: 1.55,
          color: V1.text, margin: 0, flex: 1,
        }}>{post.deck}</p>

        <div style={{
          marginTop: 6, display: 'flex', alignItems: 'center', gap: 10,
          paddingTop: 14, borderTop: `1px solid ${V1.line}`,
        }}>
          <BlogAvatar name={post.author.n} size={24} />
          <div style={{
            fontFamily: V1.fontBody, fontSize: 13, fontWeight: 500, color: V1.ink,
          }}>{post.author.n}</div>
          <span style={{ flex: 1 }} />
          <div style={{
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: V1.muted,
          }}>{post.date}</div>
        </div>
      </div>
    </a>
  );
}

// ─── Series rail — "The Floor Rate" ───

function BlogSeriesRail({ posts, accent }) {
  return (
    <section data-v1-section style={{
      background: V1.ink, color: V1.white,
      padding: '80px 40px', position: 'relative', overflow: 'hidden',
    }}>
      <div aria-hidden style={{
        position: 'absolute', top: '-30%', right: '-10%', width: 620, height: 620,
        background: `radial-gradient(circle, ${accent}20 0%, transparent 60%)`,
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div data-v1-grid-2col style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
          alignItems: 'flex-end', marginBottom: 48,
        }}>
          <div>
            <V1Eyebrow color={V1.blueSoft}>Series</V1Eyebrow>
            <h2 data-v1-section-title style={{
              fontFamily: V1.fontDisplay,
              fontSize: 'clamp(2rem, 4.2vw, 3rem)',
              fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05,
              color: V1.white, margin: '18px 0 0',
            }}>
              The Floor Rate.<br/>
              <em style={{
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontStyle: 'italic', fontWeight: 400, color: accent,
              }}>Monthly letters</em> from our lead underwriter.
            </h2>
          </div>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.55,
            color: 'rgba(255,255,255,0.72)', margin: 0, paddingBottom: 8,
          }}>
            A plain-language dispatch from the desk that sizes your offer. No
            marketing review, no comms team — just what she'd say across the
            phone, on the record.
          </p>
        </div>

        <div data-v1-grid-3col style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
        }}>
          {posts.map((p, i) => (
            <a key={p.id} style={{
              display: 'flex', flexDirection: 'column', gap: 16,
              padding: 24, borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              textDecoration: 'none', color: V1.white, cursor: 'pointer',
              transition: 'background .15s, border-color .15s, transform .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: accent,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span>{p.issue}</span>
                <span aria-hidden style={{ opacity: 0.4, color: 'rgba(255,255,255,0.5)' }}>·</span>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{p.read}</span>
              </div>
              <h4 style={{
                fontFamily: V1.fontDisplay, fontSize: 22, fontWeight: 600,
                letterSpacing: '-0.02em', lineHeight: 1.2, color: V1.white, margin: 0,
              }}>{p.title}</h4>
              <p style={{
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontStyle: 'italic', fontSize: 15, lineHeight: 1.55,
                color: 'rgba(255,255,255,0.72)', margin: 0, flex: 1,
              }}>{p.deck}</p>
              <div style={{
                marginTop: 4, paddingTop: 14,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <BlogAvatar name={p.author.n} size={24} />
                <div style={{
                  fontFamily: V1.fontBody, fontSize: 13, fontWeight: 500,
                  color: V1.white,
                }}>{p.author.n}</div>
                <span style={{ flex: 1 }} />
                <span style={{
                  fontFamily: V1.fontMono, fontSize: 10.5,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                }}>{p.date}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Archive list ───

function BlogArchive({ accent }) {
  return (
    <section data-v1-section style={{ background: V1.bg, padding: '80px 40px', borderTop: `1px solid ${V1.line}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div data-v1-grid-2col style={{
          display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48,
          alignItems: 'flex-start',
        }}>
          <div>
            <V1Eyebrow>Archive</V1Eyebrow>
            <h2 data-v1-section-title style={{
              fontFamily: V1.fontDisplay, fontSize: 32, fontWeight: 600,
              letterSpacing: '-0.03em', color: V1.ink, lineHeight: 1.1,
              margin: '14px 0 16px',
            }}>Older dispatches.</h2>
            <p style={{
              fontFamily: V1.fontBody, fontSize: 14.5, lineHeight: 1.55,
              color: V1.muted, margin: 0, maxWidth: 260,
            }}>
              Every piece we've published, by issue. Searchable — and the full
              back-catalog is downloadable as a single PDF for long flights.
            </p>
            <button style={{
              marginTop: 22, padding: '10px 16px', borderRadius: 8,
              border: `1px solid ${V1.line}`, background: V1.white,
              fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
              color: V1.ink, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Download archive (PDF)
              <svg width="13" height="13" viewBox="0 0 14 14">
                <path d="M7 2v8M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div>
            {BLOG_ARCHIVE.map((a, i) => (
              <a key={i} style={{
                display: 'grid', gridTemplateColumns: '180px 1fr auto',
                alignItems: 'center', gap: 24, padding: '18px 0',
                borderBottom: `1px solid ${V1.line}`,
                textDecoration: 'none', color: 'inherit', cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = V1.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  fontFamily: V1.fontMono, fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: V1.muted,
                }}>
                  <div>{a.issue}</div>
                  <div style={{ marginTop: 3, color: V1.muted, opacity: 0.7 }}>{a.date}</div>
                </div>
                <div style={{
                  fontFamily: V1.fontDisplay, fontSize: 17, fontWeight: 500,
                  letterSpacing: '-0.01em', color: V1.ink, lineHeight: 1.35,
                }}>{a.title}</div>
                <div style={{
                  fontFamily: V1.fontMono, fontSize: 10.5,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: V1.muted, display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                  {a.read}
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ───

function BlogNewsletter({ accent, onTalk }) {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <section data-v1-section style={{
      background: V1.white, borderTop: `1px solid ${V1.line}`,
      padding: '72px 40px',
    }}>
      <div data-v1-grid-2col style={{
        maxWidth: 1080, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56,
        alignItems: 'center',
      }}>
        <div>
          <V1Eyebrow>Subscribe</V1Eyebrow>
          <h2 data-v1-section-title style={{
            fontFamily: V1.fontDisplay,
            fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)',
            fontWeight: 600, letterSpacing: '-0.03em', color: V1.ink,
            lineHeight: 1.1, margin: '14px 0 0',
          }}>
            One long read, a few short ones,{' '}
            <em style={{
              fontFamily: '"Source Serif Pro", Georgia, serif',
              fontStyle: 'italic', fontWeight: 400, color: accent,
            }}>most Wednesdays.</em>
          </h2>
          <p style={{
            fontFamily: V1.fontBody, fontSize: 16, lineHeight: 1.55,
            color: V1.text, margin: '20px 0 0', maxWidth: 520,
          }}>
            The Ledger in your inbox. No tracking pixels, no marketing sequences,
            and one single "unsubscribe" button that actually works. If you don't
            like an issue, reply and tell us — a human writes back.
          </p>
          <div style={{
            marginTop: 22, display: 'flex', gap: 16, flexWrap: 'wrap',
            fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
          }}>
            <span>~1,800 readers</span>
            <span aria-hidden style={{ opacity: 0.4 }}>·</span>
            <span>52 issues / year</span>
            <span aria-hidden style={{ opacity: 0.4 }}>·</span>
            <span>No sales mail</span>
          </div>
        </div>

        <div>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubmitted(true); }}
            style={{
              padding: 24, background: V1.bg,
              border: `1px solid ${V1.line}`, borderRadius: 14,
            }}
          >
            {!submitted ? (
              <>
                <label style={{
                  display: 'block',
                  fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: V1.muted, marginBottom: 10,
                }}>
                  Your email
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@yourcompany.com"
                    style={{
                      flex: 1, padding: '14px 16px',
                      background: V1.white,
                      border: `1px solid ${V1.line}`, borderRadius: 10,
                      fontFamily: V1.fontMono, fontSize: 13.5,
                      color: V1.ink, outline: 'none',
                      transition: 'border-color .15s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                    onBlur={(e) => { e.target.style.borderColor = V1.line; }}
                  />
                  <button type="submit" style={{
                    padding: '14px 20px', borderRadius: 10, border: 'none',
                    background: accent, color: V1.white, cursor: 'pointer',
                    fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    transition: 'filter .15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                  >
                    Subscribe
                    <svg width="12" height="12" viewBox="0 0 14 14">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div style={{
                  marginTop: 14, fontFamily: V1.fontBody, fontSize: 12.5,
                  color: V1.muted, lineHeight: 1.5,
                }}>
                  By subscribing you agree to receive 1 email a week from the
                  Delt Capital editorial desk. We don't share your address.
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 8px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 999,
                  background: `${accent}18`, color: accent,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <svg width="22" height="22" viewBox="0 0 22 22">
                    <path d="M4 11l5 5 9-10" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{
                  fontFamily: V1.fontDisplay, fontSize: 20, fontWeight: 600,
                  letterSpacing: '-0.02em', color: V1.ink,
                }}>Subscribed.</div>
                <div style={{
                  marginTop: 6,
                  fontFamily: V1.fontBody, fontSize: 14, color: V1.muted,
                }}>
                  Confirmation on its way to <b style={{ color: V1.ink }}>{email}</b>.
                  Next issue lands Wednesday 6:00am ET.
                </div>
              </div>
            )}
          </form>

          <div style={{
            marginTop: 18, padding: '16px 20px',
            background: V1.white, border: `1px solid ${V1.line}`, borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 999,
              background: `${accent}14`, color: accent,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 4h12v10H3z"/><path d="M3 4l6 5 6-5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: V1.fontBody, fontSize: 14, fontWeight: 500, color: V1.ink,
              }}>Rather talk than read?</div>
              <div style={{
                fontFamily: V1.fontBody, fontSize: 13, color: V1.muted, marginTop: 2,
              }}>30 min with an underwriter, on Teams.</div>
            </div>
            <button
              onClick={onTalk}
              style={{
                padding: '8px 14px', borderRadius: 8,
                border: `1px solid ${V1.line}`, background: V1.white,
                fontFamily: V1.fontBody, fontSize: 13, fontWeight: 500,
                color: V1.ink, cursor: 'pointer', flexShrink: 0,
              }}
            >Book →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main page ───

function V1BlogPage({ accent, onApply, onTalk }) {
  const [activeK, setActiveK] = React.useState('all');
  const accentColor = accent || V1.blue;

  const series = BLOG_POSTS.filter((p) => p.series === 'The Floor Rate');
  const nonSeries = BLOG_POSTS.filter((p) => !p.series);

  // The featured lead is the one marked featured
  const featured = nonSeries.find((p) => p.featured) || nonSeries[0];
  const gridSource = nonSeries.filter((p) => p.id !== featured.id);

  const filtered = activeK === 'all'
    ? gridSource
    : gridSource.filter((p) => p.cat === activeK);

  const counts = React.useMemo(() => {
    const c = { all: gridSource.length };
    for (const cat of BLOG_CATS) {
      if (cat.k === 'all') continue;
      c[cat.k] = gridSource.filter((p) => p.cat === cat.k).length;
    }
    return c;
  }, []);

  return (
    <div style={{ background: V1.bg }}>
      <BlogMasthead accent={accentColor} />
      <BlogFeatured post={featured} accent={accentColor} />
      <BlogCategoryBar activeK={activeK} onSelect={setActiveK} counts={counts} accent={accentColor} />

      {/* Grid of recent posts */}
      <section data-v1-section style={{ background: V1.bg, padding: '56px 40px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 32,
          }}>
            <V1Eyebrow>Recent dispatches</V1Eyebrow>
            <div style={{
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: V1.muted,
            }}>
              Showing {filtered.length} of {gridSource.length}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{
              padding: '80px 0', textAlign: 'center',
              fontFamily: V1.fontBody, color: V1.muted,
            }}>
              <div style={{
                fontFamily: V1.fontDisplay, fontSize: 24, fontWeight: 600,
                color: V1.ink, letterSpacing: '-0.02em', marginBottom: 8,
              }}>Nothing published in this category yet.</div>
              <p style={{ fontSize: 14.5, maxWidth: 420, margin: '0 auto' }}>
                Try another tag, or browse the archive below.
              </p>
            </div>
          ) : (
            <div data-v1-grid-3col style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28,
            }}>
              {filtered.map((p, i) => (
                <BlogCard key={p.id} post={p} seed={i + 1} accent={accentColor} />
              ))}
            </div>
          )}
        </div>
      </section>

      <BlogSeriesRail posts={series} accent={accentColor} />
      <BlogArchive accent={accentColor} />
      <BlogNewsletter accent={accentColor} onTalk={onTalk} />
    </div>
  );
}

Object.assign(window, { V1BlogPage });
