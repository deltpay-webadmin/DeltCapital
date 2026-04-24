// V1-style Terms / Privacy / Communications pages.
// Editorial spread: sticky scroll-spy TOC on the left, oversized title +
// section content on the right. Content text preserved verbatim from the
// main branch's src/components/legal/LegalPages.tsx — only the visual
// shell is recut in V1's Ledger aesthetic (Codec Pro display, Inter body,
// Electric Indigo accent, hairline rules, mono eyebrows).

// ─── Scroll-spy TOC ──────────────────────────────────────────────
// Sticky is applied by the parent column wrapper (see V1LegalLayout) so
// the TOC and the "Back to site" sibling below pin together and don't
// overlap as the page scrolls.
function V1LegalTOC({ items, activeId, onJump }) {
  return (
    <nav style={{ paddingTop: 4 }}>
      <div style={{
        fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.2em', textTransform: 'uppercase', color: V1.muted,
        marginBottom: 18,
      }}>
        On this page
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((it, i) => {
          const isActive = it.id === activeId;
          const isSub = (it.level || 1) >= 2;
          return (
            <li key={it.id} style={{ position: 'relative' }}>
              <button
                onClick={() => onJump(it.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  textAlign: 'left', width: '100%',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: isSub ? '6px 0 6px 24px' : '8px 0',
                  borderBottom: isSub ? 'none' : `1px solid ${V1.line}`,
                  fontFamily: V1.fontBody,
                  fontSize: isSub ? 12.5 : 13.5,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? V1.ink : V1.text,
                  lineHeight: 1.4,
                  transition: 'color 220ms, font-weight 220ms',
                }}
              >
                {!isSub && (
                  <span aria-hidden style={{
                    flexShrink: 0,
                    fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: isActive ? V1.blue : V1.muted,
                    minWidth: 22,
                    transition: 'color 220ms',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
                <span>{it.label}</span>
              </button>
              {/* Active accent left bar */}
              <span aria-hidden style={{
                position: 'absolute', left: -16, top: '50%',
                transform: `translateY(-50%) scaleX(${isActive ? 1 : 0})`,
                transformOrigin: 'left center',
                width: 12, height: 2, background: V1.blue,
                transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
              }} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Layout frame ──────────────────────────────────────────────
function V1LegalLayout({ title, eyebrow, effective, toc, onBack, otherLink, children }) {
  const mounted = useV1Mounted(60);
  const [activeId, setActiveId] = React.useState(toc?.[0]?.id || '');

  React.useEffect(() => {
    if (!toc || toc.length === 0) return;
    const els = toc.map(t => document.getElementById(t.id)).filter(Boolean);
    if (els.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) setActiveId(visible[0].target.id);
    }, { rootMargin: '-100px 0px -65% 0px', threshold: 0 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [toc]);

  const handleJump = React.useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  }, []);

  return (
    <section style={{ background: V1.bg, paddingBottom: 96 }}>
      {/* Corner dateline */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '32px 40px 0',
        display: 'flex', justifyContent: 'flex-end',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(12px)',
        transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 60ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 60ms',
      }}>
        <span style={{
          fontFamily: V1.fontMono, fontSize: 11, letterSpacing: '0.18em',
          color: V1.muted, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          Vol. VII · Legal
          <span style={{ width: 18, height: 1, background: V1.muted }} />
        </span>
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '40px 40px 0',
        display: 'grid', gridTemplateColumns: '260px 1fr',
        gap: 72, alignItems: 'start',
      }}>
        {/* ─── LEFT: sticky TOC column (pin TOC + Back button as one) ─── */}
        <aside style={{
          position: 'sticky',
          // Sits just below the sticky nav header (ticker ≈ 30px + nav ≈ 52px + breathing room).
          top: 96,
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          paddingRight: 8,
          // Only opacity for the entrance — any non-none transform would
          // create a new containing block and break sticky positioning.
          opacity: mounted ? 1 : 0,
          transition: 'opacity 800ms cubic-bezier(0.22,1,0.36,1) 200ms',
        }}>
          <V1LegalTOC items={toc} activeId={activeId} onJump={handleJump} />
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${V1.line}` }}>
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: V1.fontBody, fontSize: 13.5, fontWeight: 500,
                color: V1.muted, padding: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = V1.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = V1.muted; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to site
            </button>
          </div>
        </aside>

        {/* ─── RIGHT: content ─── */}
        <main style={{ minWidth: 0 }}>
          {eyebrow && (
            <div style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 60ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 60ms',
              marginBottom: 18,
            }}>
              <V1Eyebrow>{eyebrow}</V1Eyebrow>
            </div>
          )}
          <h1 style={{
            margin: 0,
            fontFamily: V1.fontDisplay,
            // Brand §4.3 H2: Codec Pro Heavy 900 / 48px / LH 1.05
            fontSize: 'clamp(2.4rem, 4.6vw, 3rem)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.035em',
            color: V1.ink,
          }}>
            <V1LineMask ready={mounted} delay={140} duration={900}>{title}</V1LineMask>
          </h1>
          {effective && (
            <div style={{
              marginTop: 20,
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.muted,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 380ms',
            }}>
              <span style={{ width: 18, height: 1, background: V1.muted }} />
              Effective · {effective}
            </div>
          )}
          {/* Hairline */}
          <div style={{
            marginTop: 36, marginBottom: 40, height: 1, background: V1.line,
            transformOrigin: 'left center',
            transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1000ms cubic-bezier(0.22,1,0.36,1) 480ms',
          }} />

          {children}

          {/* Bottom cross-link */}
          {otherLink && (
            <div style={{
              marginTop: 72, paddingTop: 28,
              borderTop: `1px solid ${V1.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16, flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: V1.fontBody, fontSize: 14, color: V1.text,
              }}>
                Questions? Email <LegalLink href="mailto:privacy@delt.com">privacy@delt.com</LegalLink>.
              </span>
              <button
                type="button"
                onClick={otherLink.onClick}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: V1.fontBody, fontSize: 14, fontWeight: 600,
                  color: V1.blue, padding: 0,
                }}
              >
                Read {otherLink.label} →
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

// ─── Section helpers ──────────────────────────────────────────────
function LegalSection({ id, eyebrow, title, children }) {
  const [ref, inView] = useV1InView(0.05, '0px 0px -10% 0px');
  return (
    <section ref={ref} id={id} style={{
      scrollMarginTop: 96,
      paddingTop: 8, paddingBottom: 40,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      {eyebrow && (
        <div style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: V1.blue,
          marginBottom: 12,
        }}>
          {eyebrow}
        </div>
      )}
      <h3 style={{
        margin: '0 0 20px',
        fontFamily: V1.fontDisplay,
        // Brand §4.3 H3: Codec Pro Extra Bold 800 / 40px / LH 1.05
        fontSize: 32, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em',
        color: V1.ink,
        position: 'relative',
        paddingBottom: 14,
      }}>
        {title}
        <span aria-hidden style={{
          position: 'absolute', left: 0, bottom: 0,
          width: 36, height: 2, background: V1.blue,
          transformOrigin: 'left center',
          transform: inView ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1) 240ms',
        }} />
      </h3>
      <div style={{
        fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.7, color: V1.text,
      }}>
        {children}
      </div>
    </section>
  );
}

function LegalSubSection({ id, title, children }) {
  return (
    <div id={id} style={{ scrollMarginTop: 96, marginTop: 28 }}>
      <h4 style={{
        margin: '0 0 12px',
        fontFamily: V1.fontDisplay,
        // Brand §4.3 H4: Codec Pro Bold 700 / 32px / LH 1.1 — used at 22px here for sub-section weight
        fontSize: 20, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.015em',
        color: V1.ink,
      }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function LegalP({ children, style }) {
  return (
    <p style={{
      margin: '0 0 14px',
      fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.7, color: V1.text,
      ...style,
    }}>
      {children}
    </p>
  );
}

function LegalList({ items }) {
  return (
    <ul style={{
      margin: '0 0 18px', padding: 0, listStyle: 'none',
      fontFamily: V1.fontBody, fontSize: 16.5, lineHeight: 1.7, color: V1.text,
    }}>
      {items.map((it, i) => (
        <li key={i} style={{
          display: 'grid', gridTemplateColumns: '14px 1fr', gap: 12,
          marginBottom: 8,
        }}>
          <span aria-hidden style={{
            color: V1.blue, fontWeight: 700, lineHeight: 1.7,
          }}>·</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function LegalCallout({ eyebrow, children }) {
  return (
    <aside style={{
      margin: '20px 0',
      padding: '20px 22px',
      background: '#fff',
      border: `1px solid ${V1.line}`,
      borderLeft: `3px solid ${V1.blue}`,
      borderRadius: 8,
    }}>
      {eyebrow && (
        <div style={{
          fontFamily: V1.fontMono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: V1.blue,
          marginBottom: 10,
        }}>
          {eyebrow}
        </div>
      )}
      <div style={{
        fontFamily: V1.fontBody, fontSize: 15, lineHeight: 1.6, color: V1.ink,
      }}>
        {children}
      </div>
    </aside>
  );
}

function LegalLink({ href, children, external }) {
  const [hover, setHover] = React.useState(false);
  const props = external
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href };
  return (
    <a
      {...props}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        color: V1.blue, fontWeight: 500,
        textDecoration: 'none',
      }}
    >
      {children}
      <span aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: -2,
        height: 1, background: V1.blue,
        transform: hover ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left center',
        transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
    </a>
  );
}

// ═════════════════════════════════════════════════════════════════
// TERMS OF USE
// ═════════════════════════════════════════════════════════════════
const TERMS_TOC = [
  { id: 'terms-1', label: 'Agreement to Terms' },
  { id: 'terms-2', label: 'Use License' },
  { id: 'terms-3', label: 'Disclaimer' },
  { id: 'terms-4', label: 'Limitations' },
  { id: 'terms-5', label: 'Accuracy of Materials' },
  { id: 'terms-6', label: 'Links' },
  { id: 'terms-7', label: 'Governing Law' },
];

function V1TermsOfUse({ onBack, onNavPrivacy }) {
  return (
    <V1LegalLayout
      eyebrow="Terms"
      title="Terms of Use."
      effective="Feb 19, 2026"
      toc={TERMS_TOC}
      onBack={onBack}
      otherLink={{ label: 'Privacy Policy', onClick: onNavPrivacy }}
    >
      <LegalSection id="terms-1" eyebrow="01" title="Agreement to Terms">
        <LegalP>By accessing or using the Delt Capital website and services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</LegalP>
      </LegalSection>

      <LegalSection id="terms-2" eyebrow="02" title="Use License">
        <LegalP>Permission is granted to temporarily download one copy of the materials (information or software) on Delt Capital's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</LegalP>
        <LegalList items={[
          'modify or copy the materials;',
          'use the materials for any commercial purpose, or for any public display (commercial or non-commercial);',
          "attempt to decompile or reverse engineer any software contained on Delt Capital's website;",
          'remove any copyright or other proprietary notations from the materials; or',
          'transfer the materials to another person or "mirror" the materials on any other server.',
        ]} />
      </LegalSection>

      <LegalSection id="terms-3" eyebrow="03" title="Disclaimer">
        <LegalP>The materials on Delt Capital's website are provided on an 'as is' basis. Delt Capital makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</LegalP>
      </LegalSection>

      <LegalSection id="terms-4" eyebrow="04" title="Limitations">
        <LegalP>In no event shall Delt Capital or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Delt Capital's website, even if Delt Capital or a Delt Capital authorized representative has been notified orally or in writing of the possibility of such damage.</LegalP>
      </LegalSection>

      <LegalSection id="terms-5" eyebrow="05" title="Accuracy of Materials">
        <LegalP>The materials appearing on Delt Capital's website could include technical, typographical, or photographic errors. Delt Capital does not warrant that any of the materials on its website are accurate, complete or current. Delt Capital may make changes to the materials contained on its website at any time without notice.</LegalP>
      </LegalSection>

      <LegalSection id="terms-6" eyebrow="06" title="Links">
        <LegalP>Delt Capital has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Delt Capital of the site. Use of any such linked website is at the user's own risk.</LegalP>
      </LegalSection>

      <LegalSection id="terms-7" eyebrow="07" title="Governing Law">
        <LegalP>These terms and conditions are governed by and construed in accordance with the laws of Delaware and you irrevocably submit to the exclusive jurisdiction of the courts in that State.</LegalP>
      </LegalSection>
    </V1LegalLayout>
  );
}

// ═════════════════════════════════════════════════════════════════
// PRIVACY POLICY
// ═════════════════════════════════════════════════════════════════
const PRIVACY_TOC = [
  { id: 'pp-1',    label: '1. Introduction' },
  { id: 'pp-2',    label: '2. Who This Applies To' },
  { id: 'pp-3',    label: '3. Information We Collect' },
  { id: 'pp-3-1',  label: '3.1 You Provide Directly',   level: 2 },
  { id: 'pp-3-2',  label: '3.2 Via Plaid',              level: 2 },
  { id: 'pp-3-3',  label: '3.3 Via Plaid CRA',          level: 2 },
  { id: 'pp-3-4',  label: '3.4 Biometric Data',         level: 2 },
  { id: 'pp-3-5',  label: '3.5 Automatically Collected', level: 2 },
  { id: 'pp-3-6',  label: '3.6 From Third Parties',     level: 2 },
  { id: 'pp-4',    label: '4. How We Use Information' },
  { id: 'pp-5',    label: '5. How We Share Information' },
  { id: 'pp-6',    label: '6. Data Security' },
  { id: 'pp-7',    label: '7. Data Retention' },
  { id: 'pp-8',    label: '8. Your Rights & Choices' },
  { id: 'pp-9',    label: "9. Plaid's Role" },
  { id: 'pp-10',   label: '10. GLBA Privacy Notice' },
  { id: 'pp-11',   label: '11. FCRA Compliance' },
  { id: 'pp-12',   label: '12. California Privacy' },
  { id: 'pp-13',   label: '13. Cookie Policy' },
  { id: 'pp-14',   label: '14. Adverse Action Notices' },
  { id: 'pp-15',   label: '15. Changes to Policy' },
  { id: 'pp-16',   label: '16. Contact Us' },
];

function V1PrivacyPolicy({ onBack, onNavTerms }) {
  return (
    <V1LegalLayout
      eyebrow="Privacy"
      title="Privacy Policy."
      effective="Mar 1, 2026"
      toc={PRIVACY_TOC}
      onBack={onBack}
      otherLink={{ label: 'Terms of Use', onClick: onNavTerms }}
    >
      <LegalSection id="pp-1" eyebrow="01 · Introduction" title="Introduction">
        <LegalP>Delt Pay LLC ("Delt Pay," "we," "our," or "us") provides merchant cash advance ("MCA") and other credit and lending products to businesses. This Privacy Policy explains how we collect, use, store, and share information — including personal data about business owners, authorized representatives, and other individuals ("you") — when you use our platform and apply for or manage a financing product with us.</LegalP>
        <LegalP>Our services are powered in part by Plaid Inc. ("Plaid") and Plaid Consumer Reporting Agency, Inc. ("Plaid CRA"), third-party financial data and consumer reporting platforms. When you connect a bank account or undergo identity verification through our platform, you interact with Plaid and/or Plaid CRA directly. We encourage you to review the following Plaid policies for a full description of Plaid's own data practices:</LegalP>
        <LegalList items={[
          <>Plaid End User Privacy Policy: <LegalLink href="https://plaid.com/legal" external>plaid.com/legal</LegalLink></>,
          <>Plaid CRA Privacy Policy: <LegalLink href="https://plaid.com/plaid-check-consumer-report/privacy-policy" external>plaid.com/plaid-check-consumer-report/privacy-policy</LegalLink></>,
          <>Plaid Biometric Policy and Release: <LegalLink href="https://plaid.com/legal/#biometric-policy" external>plaid.com/legal/#biometric-policy</LegalLink></>,
        ]} />
        <LegalP>This Policy does not govern Plaid's or Plaid CRA's independent processing of your data — only Delt Pay's.</LegalP>
      </LegalSection>

      <LegalSection id="pp-2" eyebrow="02 · Applicability" title="Who This Policy Applies To">
        <LegalP>This Policy applies to business entities and the individual representatives, owners, officers, or authorized users who interact with Delt Pay on behalf of those businesses. Our services are not directed to, and we do not knowingly collect data from, individuals under 18 years of age. If you are under 18, do not use our services or submit any information to us.</LegalP>
      </LegalSection>

      <LegalSection id="pp-3" eyebrow="03 · Data" title="Information We Collect">
        <LegalP>We collect several categories of information in connection with providing our services:</LegalP>

        <LegalSubSection id="pp-3-1" title="3.1 Information You Provide Directly">
          <LegalList items={[
            <><b>Business information:</b> Legal business name, EIN/Tax ID, business address, industry, years in operation, and monthly revenue.</>,
            <><b>Personal identifiers about business representatives:</b> Name, date of birth, Social Security number (for identity verification and credit evaluation), email address, phone number, and mailing address.</>,
            <><b>Financial documents:</b> Bank statements, tax returns, profit and loss statements, or pay stubs you upload or submit to us.</>,
            <><b>Account credentials:</b> If required to connect your financial accounts via Plaid, usernames, passwords, security tokens, or one-time passwords (collected and processed by Plaid on our behalf).</>,
          ]} />
        </LegalSubSection>

        <LegalSubSection id="pp-3-2" title="3.2 Information Collected via Plaid">
          <LegalP>When you connect your bank account through our platform using Plaid, Plaid collects and transmits financial data to us on your behalf. Depending on the services you use, this may include:</LegalP>
          <LegalList items={[
            <><b>Bank account details:</b> Institution name, account name, account type, account and routing numbers, and ownership information.</>,
            <><b>Account balances:</b> Current and available balance.</>,
            <><b>Transaction history:</b> Transaction amounts, dates, payees, types, and descriptions — used to assess cash flow and creditworthiness.</>,
            <><b>Income and payroll data:</b> Information from connected payroll accounts or uploaded pay stubs and tax forms — used for income verification in connection with financing decisions.</>,
            <><b>Identity verification data:</b> Information used to confirm the identity of business representatives during onboarding (see Section 3.4 regarding biometric data).</>,
          ]} />
          <LegalP>By connecting your accounts through Plaid, you authorize Plaid to access and transmit this data to Delt Pay for the purposes described in this Policy.</LegalP>
        </LegalSubSection>

        <LegalSubSection id="pp-3-3" title="3.3 Information Collected via Plaid CRA (Consumer Reporting Data)">
          <LegalP>In connection with evaluating your financing application, we may obtain a consumer report about you through Plaid Consumer Reporting Agency, Inc. ("Plaid CRA"). Plaid CRA is a consumer reporting agency subject to the Fair Credit Reporting Act ("FCRA"). The data obtained through Plaid CRA may include:</LegalP>
          <LegalList items={[
            'Account and transaction history from your connected financial institutions.',
            'Income, employment, and cash flow data derived from your financial accounts, payroll records, or tax documents.',
            'Credit-related data, including account balances, repayment history, and credit utilization.',
            'Scores and assessments generated by Plaid CRA based on your financial data.',
          ]} />
          <LegalP>This data is used exclusively for permissible purposes under the FCRA, including evaluating your application for credit and assessing creditworthiness and repayment capacity. For more information about Plaid CRA's practices and your rights under the FCRA, please review the <LegalLink href="https://plaid.com/plaid-check-consumer-report/privacy-policy" external>Plaid CRA Privacy Policy</LegalLink>.</LegalP>
        </LegalSubSection>

        <LegalSubSection id="pp-3-4" title="3.4 Biometric Data (Collected via Plaid Identity Verification)">
          <LegalP>As part of our onboarding and identity verification process, we use Plaid's Identity Verification ("IDV") service. This service may require you to provide a government-issued identity document containing your photograph and/or a photograph or video image of yourself (a "selfie"). Plaid and/or its service providers use facial recognition technology to compare the facial geometry derived from your identity document to the facial geometry derived from your selfie in order to verify your identity and help prevent fraud.</LegalP>
          <LegalP>The images you provide and any derived facial geometry data may be considered biometric data in certain jurisdictions. Plaid processes this biometric data as a service provider on behalf of Delt Pay. Plaid and its service providers store biometric data in encrypted form and do not use it to enhance, improve, or develop their own services.</LegalP>
          <LegalP>Your biometric data is used solely for the purposes of identity verification and fraud prevention in connection with your financing application.</LegalP>
          <LegalP>For full details on how Plaid collects, uses, stores, and deletes biometric data, please review <LegalLink href="https://plaid.com/legal/#biometric-policy" external>Plaid's Biometric Policy and Release</LegalLink>.</LegalP>
          <LegalCallout eyebrow="Special Notice · Illinois & Texas Residents">
            If you are a resident of Illinois or Texas, the data derived from your face that Plaid and Plaid's service providers collect and process on Delt Pay's behalf may be considered biometric data under applicable state law, including the Illinois Biometric Information Privacy Act ("BIPA"). By using our identity verification services, you acknowledge that you have read, understand, and consent to the collection and processing of your biometric data as described in this Section and in Plaid's Biometric Policy and Release. Your biometric data will be stored by Plaid for no longer than three (3) years, unless otherwise required by law. Delt Pay does not directly store biometric data; all biometric data is processed and stored by Plaid on our behalf.
          </LegalCallout>
        </LegalSubSection>

        <LegalSubSection id="pp-3-5" title="3.5 Information Collected Automatically">
          <LegalP>When you use our website or platform, we may automatically collect:</LegalP>
          <LegalList items={[
            <><b>Device and usage data:</b> IP address, browser type, operating system, device model, and pages visited.</>,
            <><b>Log data:</b> Access times, referring URLs, and other diagnostic data.</>,
            <><b>Cookies and similar technologies:</b> Used for session management, analytics, security, and platform functionality. See Section 13 (Cookie Policy) for more details.</>,
            <><b>Approximate location:</b> Inferred from your IP address or device timezone settings.</>,
          ]} />
        </LegalSubSection>

        <LegalSubSection id="pp-3-6" title="3.6 Information from Third Parties">
          <LegalP>We may receive information about you or your business from third parties, including identity verification services, fraud prevention providers, consumer reporting agencies (including Plaid CRA), and other data sources, where permitted by law and as necessary to evaluate financing applications.</LegalP>
        </LegalSubSection>
      </LegalSection>

      <LegalSection id="pp-4" eyebrow="04 · Use" title="How We Use Your Information">
        <LegalP>We use the information we collect for the following purposes:</LegalP>
        <LegalList items={[
          <><b>Application processing:</b> To evaluate, underwrite, approve, or decline your application for a merchant cash advance or other financing product, including through the use of consumer reports obtained from Plaid CRA.</>,
          <><b>Identity and bank account verification:</b> To confirm the identity of business representatives (including through biometric verification via Plaid IDV) and verify ownership of connected bank accounts.</>,
          <><b>Income and cash flow assessment:</b> To assess business revenue, cash flow patterns, and repayment capacity using transaction history, balance data, income/payroll information, and consumer report data obtained through Plaid and Plaid CRA.</>,
          <><b>Automated and AI-assisted decision-making:</b> We may use automated tools, algorithms, and artificial intelligence systems to assist in evaluating applications, assessing creditworthiness, and making financing decisions. These tools analyze financial data, transaction history, and other information to generate assessments and recommendations. A human reviewer is involved in final financing decisions.</>,
          <><b>Account management:</b> To manage your financing account, process payments, and communicate with you about your account status.</>,
          <><b>Fraud prevention and security:</b> To detect, investigate, and prevent fraudulent activity, unauthorized access, and other security threats.</>,
          <><b>Legal and regulatory compliance:</b> To comply with applicable federal and state laws, including the Gramm-Leach-Bliley Act ("GLBA"), Equal Credit Opportunity Act ("ECOA"), Fair Credit Reporting Act ("FCRA"), and Bank Secrecy Act ("BSA"), and to respond to lawful requests from government authorities.</>,
          <><b>Service improvement:</b> To maintain, improve, and develop our platform and services, including through analytics and usage data.</>,
          <><b>Communications:</b> To send you transaction confirmations, account notices, policy updates, and other service-related communications.</>,
        ]} />
      </LegalSection>

      <LegalSection id="pp-5" eyebrow="05 · Sharing" title="How We Share Your Information">
        <LegalP>Delt Pay does not sell your personal information. We do not share your information with third-party marketers or advertisers. We share information only in the following limited circumstances:</LegalP>

        <LegalSubSection id="pp-5-1" title="5.1 Plaid and Plaid CRA">
          <LegalP>We share information with Plaid to enable bank account connectivity, identity verification (including biometric verification), income verification, transaction data retrieval, and balance checks. We share information with Plaid CRA to obtain consumer reports and scores for credit evaluation purposes. Plaid and Plaid CRA act as service providers and/or data processors on our behalf and under their own agreements with you. Their use of your data is governed by their respective privacy policies.</LegalP>
        </LegalSubSection>

        <LegalSubSection id="pp-5-2" title="5.2 Service Providers">
          <LegalP>We may share information with carefully selected third-party service providers who assist us in operating our platform, processing applications, verifying identity, providing analytics, maintaining security, and fulfilling legal obligations. These providers are contractually required to use your information only as directed by us and in accordance with applicable law.</LegalP>
        </LegalSubSection>

        <LegalSubSection id="pp-5-3" title="5.3 Legal and Regulatory Disclosures">
          <LegalP>We may disclose information when required by law, regulation, court order, or government request, or when we believe in good faith that disclosure is necessary to protect our legal rights, prevent fraud, or protect the safety of any person.</LegalP>
        </LegalSubSection>

        <LegalSubSection id="pp-5-4" title="5.4 Business Transfers">
          <LegalP>If Delt Pay undergoes a merger, acquisition, sale of assets, or similar corporate transaction, your information may be transferred as part of that transaction. We will notify you of any such change as required by applicable law.</LegalP>
        </LegalSubSection>

        <LegalSubSection id="pp-5-5" title="5.5 With Your Consent">
          <LegalP>We may share your information for other purposes with your explicit consent.</LegalP>
        </LegalSubSection>
      </LegalSection>

      <LegalSection id="pp-6" eyebrow="06 · Security" title="Data Security">
        <LegalP>We implement administrative, technical, and physical safeguards designed to protect your information from unauthorized access, disclosure, alteration, or destruction. These measures include:</LegalP>
        <LegalList items={[
          'Industry-standard encryption for data in transit and at rest.',
          'Access controls limiting data access to personnel with a legitimate business need.',
          'Regular monitoring of our systems for unauthorized access or anomalies.',
          'Timely patching of known security vulnerabilities.',
          'Incident response procedures to address security events promptly.',
        ]} />
        <LegalP>We comply with the Safeguards Rule under the Gramm-Leach-Bliley Act ("GLBA"), which requires us to maintain a comprehensive information security program. While we work hard to protect your information, no system is completely secure. If you believe your information has been compromised, please contact us immediately at <LegalLink href="mailto:privacy@delt.com">privacy@delt.com</LegalLink>.</LegalP>
      </LegalSection>

      <LegalSection id="pp-7" eyebrow="07 · Retention" title="Data Retention">
        <LegalP>We retain your information for as long as necessary to fulfill the purposes described in this Policy, to maintain your account, and to comply with our legal, regulatory, and contractual obligations.</LegalP>
        <LegalP>For lending and credit-related records, we retain data for a minimum of seven (7) years following account closure or the end of our business relationship, consistent with requirements under ECOA, GLBA, FCRA, and applicable tax laws.</LegalP>
        <LegalP>For biometric data, Delt Pay does not directly store biometric information. Biometric data processed through Plaid's Identity Verification service is retained by Plaid for no longer than three (3) years, unless otherwise required by law or by our instructions as a customer. Please see Plaid's Biometric Policy for details.</LegalP>
        <LegalP>After the applicable retention period, we will securely delete or anonymize your information. If you request deletion of your data, we will honor that request to the extent permitted by law — certain records may be required to be retained regardless of such a request.</LegalP>
      </LegalSection>

      <LegalSection id="pp-8" eyebrow="08 · Rights" title="Your Rights and Choices">
        <LegalP>Even though our services are directed to businesses, individual representatives who interact with our platform have certain rights with respect to their personal information:</LegalP>
        <LegalList items={[
          <><b>Access:</b> You may request a copy of the personal information we hold about you.</>,
          <><b>Correction:</b> You may request that we correct inaccurate or incomplete information.</>,
          <><b>Deletion:</b> You may request deletion of your personal information, subject to our legal retention obligations.</>,
          <><b>Opt-out of non-essential communications:</b> You may opt out of marketing communications at any time by following the unsubscribe instructions in any email or by contacting us directly.</>,
        ]} />
        <LegalCallout eyebrow="Your Rights Under the FCRA">
          If Delt Pay has obtained a consumer report about you through Plaid CRA, you have specific rights under the Fair Credit Reporting Act, including the right to access the information in your consumer file, dispute inaccurate or incomplete information and request reinvestigation, be notified if information in your consumer report has been used against you in a credit decision, and request that your information not be used for prescreened offers of credit.
        </LegalCallout>
        <LegalP>To exercise your FCRA rights with Plaid CRA, you may visit <LegalLink href="https://plaid.com/check/consumer-service-center/" external>Plaid CRA's Consumer Service Center</LegalLink> or contact Plaid CRA at 844-204-5860.</LegalP>
        <LegalP>To exercise any rights with Delt Pay, please contact us at <LegalLink href="mailto:privacy@delt.com">privacy@delt.com</LegalLink>. We will respond within a reasonable time and in accordance with applicable law. We may require you to verify your identity before fulfilling a request.</LegalP>
      </LegalSection>

      <LegalSection id="pp-9" eyebrow="09 · Plaid" title="Plaid's Role and Your Rights with Plaid">
        <LegalP>When you connect your financial accounts or undergo identity verification using Plaid, Plaid collects and processes your data as described in Plaid's End User Privacy Policy (<LegalLink href="https://plaid.com/legal" external>plaid.com/legal</LegalLink>). You have rights with respect to Plaid's processing of your data directly with Plaid, including the ability to manage and revoke data connections through the Plaid Portal at <LegalLink href="https://my.plaid.com" external>my.plaid.com</LegalLink>.</LegalP>
        <LegalP>Disconnecting your accounts through Plaid's Portal will terminate Plaid's ongoing access to your financial data, but will not affect information already transmitted to and retained by Delt Pay in connection with your application or account.</LegalP>
      </LegalSection>

      <LegalSection id="pp-10" eyebrow="10 · GLBA" title="GLBA Privacy Notice">
        <LegalP>As a financial services company, Delt Pay is subject to the Gramm-Leach-Bliley Act ("GLBA"). Under GLBA, we are required to inform you about our information-sharing practices. As stated in this Policy:</LegalP>
        <LegalList items={[
          'We do not share your nonpublic personal information with non-affiliated third parties for marketing purposes.',
          'We share nonpublic personal information only as permitted under GLBA, including with service providers who help us operate our business and as required by law.',
        ]} />
        <LegalP>You do not need to take any action to limit our sharing, as we already limit sharing to what is described in this Policy. If you have questions about our GLBA practices, contact us at <LegalLink href="mailto:privacy@delt.com">privacy@delt.com</LegalLink>.</LegalP>
      </LegalSection>

      <LegalSection id="pp-11" eyebrow="11 · FCRA" title="FCRA Compliance Notice">
        <LegalP>When Delt Pay obtains a consumer report about you from Plaid CRA or any other consumer reporting agency, we do so for permissible purposes under the Fair Credit Reporting Act ("FCRA"), including evaluating your application for a merchant cash advance or other financing product. We will provide you with any required adverse action notices if a credit decision is based in whole or in part on information contained in a consumer report. You have the right to obtain a free copy of any consumer report used in connection with an adverse action, and to dispute the accuracy or completeness of any information in that report.</LegalP>
      </LegalSection>

      <LegalSection id="pp-12" eyebrow="12 · California" title="California Privacy Notice">
        <LegalP>If you are a California resident, you may have additional rights under the California Consumer Privacy Act ("CCPA"), as amended by the California Privacy Rights Act ("CPRA"). However, please note that the CCPA provides exemptions for personal information collected, processed, sold, or disclosed pursuant to the Gramm-Leach-Bliley Act and for activities subject to the Fair Credit Reporting Act. To the extent these exemptions apply to your data, CCPA requirements may not apply. Regardless of applicable exemptions, we are committed to transparency about our data practices as described throughout this Policy. If you have questions about your California privacy rights, please contact us at <LegalLink href="mailto:privacy@delt.com">privacy@delt.com</LegalLink>.</LegalP>
      </LegalSection>

      <LegalSection id="pp-13" eyebrow="13 · Cookies" title="Cookie Policy">
        <LegalP>When you visit the Delt Pay website or platform, we and our third-party partners use cookies and similar tracking technologies to collect information about your browsing activity.</LegalP>
        <LegalSubSection title="What are cookies">
          <LegalP>Cookies are small data files stored on your browser or device. They may be session cookies (which expire when you close your browser) or persistent cookies (which remain until they expire or you delete them).</LegalP>
        </LegalSubSection>
        <LegalSubSection title="Types of cookies we use">
          <LegalList items={[
            <><b>Strictly necessary cookies:</b> Required for our platform to function properly. These enable core features such as security, authentication, and session management.</>,
            <><b>Analytics and performance cookies:</b> We use third-party analytics services, including Google Analytics, to understand how visitors interact with our website and to improve our platform. These cookies collect information such as pages visited, time spent on pages, and traffic sources.</>,
            <><b>Functional cookies:</b> These enable enhanced functionality and personalization, such as remembering your preferences and settings.</>,
          ]} />
          <LegalP>We do not use advertising or targeting cookies.</LegalP>
        </LegalSubSection>
        <LegalSubSection title="Google Analytics">
          <LegalP>We use Google Analytics to collect anonymized usage data about our website visitors. Google Analytics uses cookies to collect information such as how often users visit our site, what pages they view, and what other sites they visited before coming to ours. Google's ability to use and share information collected by Google Analytics is restricted by the Google Analytics Terms of Service and the Google Privacy Policy. You can opt out of Google Analytics by installing Google's opt-out browser add-on, available at <LegalLink href="https://tools.google.com/dlpage/gaoptout" external>tools.google.com/dlpage/gaoptout</LegalLink>.</LegalP>
        </LegalSubSection>
        <LegalSubSection title="Your choices">
          <LegalP>Most web browsers allow you to manage cookie preferences through browser settings. You can set your browser to refuse cookies or alert you when cookies are being sent. Please note that disabling cookies may affect the functionality of our platform.</LegalP>
        </LegalSubSection>
        <LegalSubSection title="Google reCAPTCHA">
          <LegalP>When you interact with our platform through Plaid, Google reCAPTCHA may be used to help detect fraud and abuse. Google reCAPTCHA processes certain data, including your IP address and browsing behavior. When reCAPTCHA is used, Google's Privacy Policy and Terms of Use apply.</LegalP>
        </LegalSubSection>
      </LegalSection>

      <LegalSection id="pp-14" eyebrow="14 · Adverse Action" title="Adverse Action Notices">
        <LegalP>If we take an adverse action regarding your financing application (such as denying your application, offering less favorable terms, or reducing a credit limit) based in whole or in part on information obtained from a consumer report or other third-party source, we will provide you with a notice that includes:</LegalP>
        <LegalList items={[
          'The name, address, and phone number of the consumer reporting agency that provided the report.',
          'A statement that the consumer reporting agency did not make the adverse decision and cannot explain the reasons for it.',
          'Your right to obtain a free copy of your consumer report from the reporting agency within 60 days.',
          'Your right to dispute the accuracy or completeness of information in the report.',
        ]} />
      </LegalSection>

      <LegalSection id="pp-15" eyebrow="15 · Changes" title="Changes to This Policy">
        <LegalP>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the Effective Date at the top of this Policy and notify you through the platform or by email where required. We encourage you to review this Policy periodically.</LegalP>
      </LegalSection>

      <LegalSection id="pp-16" eyebrow="16 · Contact" title="Contact Us">
        <LegalP>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</LegalP>
        <LegalCallout eyebrow="Delt Pay LLC · Attn: Privacy">
          1603 Capitol Ave Ste 415 #644712<br/>
          Cheyenne, Wyoming 82001 USA<br/>
          Email: <LegalLink href="mailto:privacy@delt.com">privacy@delt.com</LegalLink>
        </LegalCallout>
        <LegalP style={{ fontStyle: 'italic', fontWeight: 500 }}>We take privacy concerns seriously and will respond to your inquiry as promptly as possible.</LegalP>
      </LegalSection>
    </V1LegalLayout>
  );
}

// ═════════════════════════════════════════════════════════════════
// ELECTRONIC COMMUNICATIONS AGREEMENT  (added in next pass)
// ═════════════════════════════════════════════════════════════════
function V1ElectronicCommunications({ onBack }) {
  return (
    <V1LegalLayout
      eyebrow="Communications"
      title="Electronic Communications Agreement."
      effective="Feb 19, 2026"
      toc={[{ id: 'eca-stub', label: 'Coming next pass' }]}
      onBack={onBack}
    >
      <LegalSection id="eca-stub" eyebrow="—" title="Loading…">
        <LegalP>ECA content loads in the next edit pass.</LegalP>
      </LegalSection>
    </V1LegalLayout>
  );
}

Object.assign(window, { V1TermsOfUse, V1PrivacyPolicy, V1ElectronicCommunications });
