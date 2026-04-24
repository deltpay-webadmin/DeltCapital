import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';

interface FooterProps {
  onAboutClick: () => void;
  onHowItWorksClick: () => void;
  onReviewsClick: () => void;
  onBlogClick: () => void;
  onFAQClick: () => void;
  onSupportClick: () => void;
  onWinsClick: () => void;
  onApplyClick: () => void;
  onQuizClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
  onResourcesClick?: () => void;
  hideCTA?: boolean;
}

export function Footer({
  onAboutClick,
  onHowItWorksClick,
  onReviewsClick,
  onBlogClick,
  onFAQClick,
  onSupportClick,
  onWinsClick,
  onApplyClick,
  onQuizClick,
  onPrivacyClick,
  onTermsClick,
  onDisclosuresClick,
  onResourcesClick,
  hideCTA,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#0F0E17',
        color: '#F7F5F0',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* CTA band */}
      {!hideCTA && (
        <section
          style={{
            borderBottom: '1px solid rgba(231,227,218,0.08)',
            padding: '88px 0',
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            <div
              className="grid items-center"
              style={{ gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 48 }}
            >
              <div>
                <Eyebrow color="#C4B5FD">Next move</Eyebrow>
                <h2
                  style={{
                    marginTop: 20,
                    marginBottom: 0,
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.03,
                    color: '#F7F5F0',
                  }}
                >
                  See your rate in 60 seconds.
                  <br />
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    No credit hit.
                  </span>
                </h2>
              </div>
              <div
                className="flex flex-wrap items-center gap-3"
                style={{ justifySelf: 'end' }}
              >
                <button
                  onClick={onApplyClick}
                  className="transition-transform"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '14px 24px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 10px 24px -8px rgba(124,58,237,0.5)',
                  }}
                >
                  Get funded →
                </button>
                <button
                  onClick={onQuizClick}
                  style={{
                    background: 'transparent',
                    color: '#F7F5F0',
                    border: '1px solid rgba(231,227,218,0.28)',
                    borderRadius: 8,
                    padding: '14px 22px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Run prequal
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main footer grid */}
      <section style={{ padding: '72px 0 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))',
              gap: 48,
            }}
          >
            {/* Brand block */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#F7F5F0',
                }}
              >
                Delt<span style={{ color: '#7C3AED' }}>.</span>
              </div>
              <p
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  maxWidth: 340,
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'rgba(231,227,218,0.65)',
                }}
              >
                Revenue-based capital for operators who don&rsquo;t overpay. Direct lender, no brokers, no games — one factor rate, priced on your trailing book.
              </p>
              <div
                className="flex flex-col gap-2"
                style={{ marginTop: 24 }}
              >
                <ContactRow icon={<Mail size={14} />} text="hello@delt.capital" />
                <ContactRow icon={<Phone size={14} />} text="(800) 555-0147 · Mon–Fri, 8am–8pm ET" />
                <ContactRow icon={<MapPin size={14} />} text="New York · Miami · Austin" />
              </div>
            </div>

            <LinkColumn title="Product">
              <FooterLink onClick={onHowItWorksClick}>How it works</FooterLink>
              <FooterLink onClick={onApplyClick}>Calculator</FooterLink>
              <FooterLink onClick={onApplyClick}>Apply</FooterLink>
              <FooterLink onClick={onResourcesClick}>Resources</FooterLink>
            </LinkColumn>

            <LinkColumn title="Company">
              <FooterLink onClick={onAboutClick}>About</FooterLink>
              <FooterLink onClick={onReviewsClick}>Operators</FooterLink>
              <FooterLink onClick={onWinsClick}>Case files</FooterLink>
              <FooterLink onClick={onBlogClick}>Ledger (blog)</FooterLink>
            </LinkColumn>

            <LinkColumn title="Support">
              <FooterLink onClick={onFAQClick}>FAQ</FooterLink>
              <FooterLink onClick={onSupportClick}>Contact support</FooterLink>
              <FooterLink onClick={onPrivacyClick}>Privacy policy</FooterLink>
              <FooterLink onClick={onTermsClick}>Terms of use</FooterLink>
              <FooterLink onClick={onDisclosuresClick}>Disclosures</FooterLink>
            </LinkColumn>
          </div>

          {/* Divider */}
          <div
            style={{
              marginTop: 56,
              height: 1,
              background: 'rgba(231,227,218,0.08)',
            }}
          />

          {/* Bottom row */}
          <div
            className="flex flex-wrap items-center justify-between gap-6"
            style={{ marginTop: 28 }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(231,227,218,0.45)',
              }}
            >
              © {currentYear} Delt Capital · Est. 2019
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: <Linkedin size={14} />, label: 'LinkedIn' },
                { icon: <Twitter size={14} />, label: 'Twitter' },
                { icon: <Instagram size={14} />, label: 'Instagram' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    color: 'rgba(231,227,218,0.65)',
                    border: '1px solid rgba(231,227,218,0.14)',
                    background: 'transparent',
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(231,227,218,0.06)';
                    e.currentTarget.style.color = '#F7F5F0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(231,227,218,0.65)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Compliance */}
          <p
            style={{
              marginTop: 20,
              marginBottom: 0,
              maxWidth: 920,
              fontFamily: 'var(--font-body)',
              fontSize: 11.5,
              fontStyle: 'italic',
              color: 'rgba(231,227,218,0.42)',
              lineHeight: 1.55,
            }}
          >
            Delt Capital provides commercial funding solutions, including merchant cash advances. Funding may be provided directly by Delt or through third-party funding partners. Offers are subject to underwriting. This is not an offer of credit; equal opportunity funder.
          </p>
        </div>
      </section>
    </footer>
  );
}

function LinkColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(231,227,218,0.5)',
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </ul>
    </div>
  );
}

function FooterLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'rgba(231,227,218,0.75)',
          textAlign: 'left',
          transition: 'color 150ms ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#F7F5F0')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(231,227,218,0.75)')}
      >
        {children}
      </button>
    </li>
  );
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'rgba(231,227,218,0.7)',
      }}
    >
      <span style={{ color: 'rgba(231,227,218,0.45)', display: 'inline-flex' }}>{icon}</span>
      {text}
    </div>
  );
}

function Eyebrow({ children, color = '#4F46E5' }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color,
      }}
    >
      <span
        aria-hidden
        style={{ display: 'inline-block', width: 18, height: 1, background: color }}
      />
      {children}
    </span>
  );
}
