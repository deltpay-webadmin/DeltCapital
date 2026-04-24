import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, List } from 'lucide-react';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';

interface TocItem {
  id: string;
  label: string;
  level?: number; // 1 = top-level section, 2 = sub-section
}

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  tocItems?: TocItem[];
}

/* ─── Scroll-Spy TOC ─────────────────────────────────────── */
function TableOfContents({ items, activeId, onItemClick }: {
  items: TocItem[];
  activeId: string;
  onItemClick: (id: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="xl:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/30 flex items-center justify-center hover:bg-[#1510d9] transition-colors"
        aria-label="Table of contents"
      >
        <List className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-80 max-w-[85vw] bg-white dark:bg-[#1A1923] h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-[#1A1923] border-b border-gray-100 dark:border-gray-700 px-5 py-4 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">On this page</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <nav className="px-3 py-3">
              {items.map((item) => (
                <TocLink
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => { onItemClick(item.id); setMobileOpen(false); }}
                />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-[73px] max-h-[calc(100vh-90px)] overflow-y-auto">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1A1923] shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">On this page</span>
            </div>
            <nav className="px-3 py-2">
              {items.map((item) => (
                <TocLink
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => onItemClick(item.id)}
                />
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

function TocLink({ item, isActive, onClick }: { item: TocItem; isActive: boolean; onClick: () => void }) {
  const isSubLevel = (item.level ?? 1) >= 2;
  return (
    <button
      onClick={onClick}
      className={`
        group w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-200 flex items-start gap-2
        ${isSubLevel ? 'pl-7' : ''}
        ${isActive
          ? 'bg-[#4F46E5]/8 text-[#4F46E5] font-semibold'
          : 'text-gray-500 dark:text-gray-400 hover:text-[#0F0E17] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
      `}
    >
      <span
        className={`
          mt-[3px] w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200
          ${isActive ? 'bg-[#4F46E5] scale-100' : 'bg-transparent scale-0 group-hover:bg-gray-300 group-hover:scale-100'}
        `}
      />
      <span className="leading-snug">{item.label}</span>
    </button>
  );
}

/* ─── Layout ──────────────────────────────────────────────── */
export function LegalPageLayout({ title, children, onClose, tocItems }: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState(tocItems?.[0]?.id ?? '');
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    if (!tocItems || tocItems.length === 0) return;

    const headings = tocItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to the top
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [tocItems]);

  const handleTocClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  }, []);

  const hasToc = tocItems && tocItems.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0E17]">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-[#0F0E17] border-b border-gray-200 dark:border-gray-800">
        <div className={`${hasToc ? 'max-w-6xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center`}>
          <div className="flex items-center gap-0 h-10 w-auto">
            <img src={logoImg} alt="Delt Capital" className="h-full w-auto object-contain" />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className={`${hasToc ? 'max-w-6xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
        {hasToc ? (
          <div className="flex gap-10">
            {/* Content */}
            <div className="flex-1 min-w-0 [&_h3]:scroll-mt-24 [&_h4]:scroll-mt-24" ref={contentRef}>
              <h1 className="text-3xl font-bold text-[#0F0E17] dark:text-white mb-8">{title}</h1>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {children}
              </div>
            </div>
            {/* TOC */}
            <TableOfContents items={tocItems!} activeId={activeId} onItemClick={handleTocClick} />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[#0F0E17] dark:text-white mb-8">{title}</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TERMS OF USE
   ══════════════════════════════════════════════════════════════ */
const termsToc: TocItem[] = [
  { id: 'terms-1', label: 'Agreement to Terms' },
  { id: 'terms-2', label: 'Use License' },
  { id: 'terms-3', label: 'Disclaimer' },
  { id: 'terms-4', label: 'Limitations' },
  { id: 'terms-5', label: 'Accuracy of Materials' },
  { id: 'terms-6', label: 'Links' },
  { id: 'terms-7', label: 'Governing Law' },
];

export function TermsOfUse({ onClose }: { onClose?: () => void }) {
  return (
    <LegalPageLayout title="Terms of Use" onClose={onClose} tocItems={termsToc}>
      <p>Last updated: February 19, 2026</p>

      <h3 id="terms-1">1. Agreement to Terms</h3>
      <p>By accessing or using the Delt Capital website and services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

      <h3 id="terms-2">2. Use License</h3>
      <p>Permission is granted to temporarily download one copy of the materials (information or software) on Delt Capital's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
      <ul>
        <li>modify or copy the materials;</li>
        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
        <li>attempt to decompile or reverse engineer any software contained on Delt Capital's website;</li>
        <li>remove any copyright or other proprietary notations from the materials; or</li>
        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
      </ul>

      <h3 id="terms-3">3. Disclaimer</h3>
      <p>The materials on Delt Capital's website are provided on an 'as is' basis. Delt Capital makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

      <h3 id="terms-4">4. Limitations</h3>
      <p>In no event shall Delt Capital or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Delt Capital's website, even if Delt Capital or a Delt Capital authorized representative has been notified orally or in writing of the possibility of such damage.</p>

      <h3 id="terms-5">5. Accuracy of Materials</h3>
      <p>The materials appearing on Delt Capital's website could include technical, typographical, or photographic errors. Delt Capital does not warrant that any of the materials on its website are accurate, complete or current. Delt Capital may make changes to the materials contained on its website at any time without notice.</p>

      <h3 id="terms-6">6. Links</h3>
      <p>Delt Capital has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Delt Capital of the site. Use of any such linked website is at the user's own risk.</p>

      <h3 id="terms-7">7. Governing Law</h3>
      <p>These terms and conditions are governed by and construed in accordance with the laws of Delaware and you irrevocably submit to the exclusive jurisdiction of the courts in that State.</p>
    </LegalPageLayout>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRIVACY POLICY
   ══════════════════════════════════════════════════════════════ */
const privacyToc: TocItem[] = [
  { id: 'pp-1', label: '1. Introduction' },
  { id: 'pp-2', label: '2. Who This Policy Applies To' },
  { id: 'pp-3', label: '3. Information We Collect' },
  { id: 'pp-3-1', label: '3.1 You Provide Directly', level: 2 },
  { id: 'pp-3-2', label: '3.2 Collected via Plaid', level: 2 },
  { id: 'pp-3-3', label: '3.3 Via Plaid CRA', level: 2 },
  { id: 'pp-3-4', label: '3.4 Biometric Data', level: 2 },
  { id: 'pp-3-5', label: '3.5 Collected Automatically', level: 2 },
  { id: 'pp-3-6', label: '3.6 From Third Parties', level: 2 },
  { id: 'pp-4', label: '4. How We Use Your Information' },
  { id: 'pp-5', label: '5. How We Share Your Information' },
  { id: 'pp-5-1', label: '5.1 Plaid and Plaid CRA', level: 2 },
  { id: 'pp-5-2', label: '5.2 Service Providers', level: 2 },
  { id: 'pp-5-3', label: '5.3 Legal & Regulatory', level: 2 },
  { id: 'pp-5-4', label: '5.4 Business Transfers', level: 2 },
  { id: 'pp-5-5', label: '5.5 With Your Consent', level: 2 },
  { id: 'pp-6', label: '6. Data Security' },
  { id: 'pp-7', label: '7. Data Retention' },
  { id: 'pp-8', label: '8. Your Rights and Choices' },
  { id: 'pp-9', label: "9. Plaid's Role & Your Rights" },
  { id: 'pp-10', label: '10. GLBA Privacy Notice' },
  { id: 'pp-11', label: '11. FCRA Compliance Notice' },
  { id: 'pp-12', label: '12. California Privacy Notice' },
  { id: 'pp-13', label: '13. Cookie Policy' },
  { id: 'pp-14', label: '14. Adverse Action Notices' },
  { id: 'pp-15', label: '15. Changes to This Policy' },
  { id: 'pp-16', label: '16. Contact Us' },
];

export function PrivacyPolicy({ onClose }: { onClose?: () => void }) {
  return (
    <LegalPageLayout title="Privacy Policy" onClose={onClose} tocItems={privacyToc}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#0F0E17] dark:text-white">DELT PAY LLC</h2>
        <p className="text-lg font-semibold text-[#0F0E17] dark:text-white">Privacy Policy</p>
        <p className="text-sm italic text-gray-500">Effective Date: March 1, 2026</p>
      </div>

      <h3 id="pp-1" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">1. Introduction</h3>
      <p>Delt Pay LLC ("Delt Pay," "we," "our," or "us") provides merchant cash advance ("MCA") and other credit and lending products to businesses. This Privacy Policy explains how we collect, use, store, and share information — including personal data about business owners, authorized representatives, and other individuals ("you") — when you use our platform and apply for or manage a financing product with us.</p>
      <p>Our services are powered in part by Plaid Inc. ("Plaid") and Plaid Consumer Reporting Agency, Inc. ("Plaid CRA"), third-party financial data and consumer reporting platforms. When you connect a bank account or undergo identity verification through our platform, you interact with Plaid and/or Plaid CRA directly. We encourage you to review the following Plaid policies for a full description of Plaid's own data practices:</p>
      <ul>
        <li>Plaid End User Privacy Policy: <a href="https://plaid.com/legal" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">https://plaid.com/legal</a></li>
        <li>Plaid CRA Privacy Policy: <a href="https://plaid.com/plaid-check-consumer-report/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">https://plaid.com/plaid-check-consumer-report/privacy-policy</a></li>
        <li>Plaid Biometric Policy and Release: <a href="https://plaid.com/legal/#biometric-policy" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">https://plaid.com/legal/#biometric-policy</a></li>
      </ul>
      <p>This Policy does not govern Plaid's or Plaid CRA's independent processing of your data — only Delt Pay's.</p>

      <h3 id="pp-2" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">2. Who This Policy Applies To</h3>
      <p>This Policy applies to business entities and the individual representatives, owners, officers, or authorized users who interact with Delt Pay on behalf of those businesses. Our services are not directed to, and we do not knowingly collect data from, individuals under 18 years of age. If you are under 18, do not use our services or submit any information to us.</p>

      <h3 id="pp-3" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">3. Information We Collect</h3>
      <p>We collect several categories of information in connection with providing our services:</p>

      <h4 id="pp-3-1" className="font-bold text-[#0F0E17] dark:text-white">3.1 Information You Provide Directly</h4>
      <ul>
        <li><strong>Business information:</strong> Legal business name, EIN/Tax ID, business address, industry, years in operation, and monthly revenue.</li>
        <li><strong>Personal identifiers about business representatives:</strong> Name, date of birth, Social Security number (for identity verification and credit evaluation), email address, phone number, and mailing address.</li>
        <li><strong>Financial documents:</strong> Bank statements, tax returns, profit and loss statements, or pay stubs you upload or submit to us.</li>
        <li><strong>Account credentials:</strong> If required to connect your financial accounts via Plaid, usernames, passwords, security tokens, or one-time passwords (collected and processed by Plaid on our behalf).</li>
      </ul>

      <h4 id="pp-3-2" className="font-bold text-[#0F0E17] dark:text-white">3.2 Information Collected via Plaid</h4>
      <p>When you connect your bank account through our platform using Plaid, Plaid collects and transmits financial data to us on your behalf. Depending on the services you use, this may include:</p>
      <ul>
        <li><strong>Bank account details:</strong> Institution name, account name, account type, account and routing numbers, and ownership information.</li>
        <li><strong>Account balances:</strong> Current and available balance.</li>
        <li><strong>Transaction history:</strong> Transaction amounts, dates, payees, types, and descriptions — used to assess cash flow and creditworthiness.</li>
        <li><strong>Income and payroll data:</strong> Information from connected payroll accounts or uploaded pay stubs and tax forms — used for income verification in connection with financing decisions.</li>
        <li><strong>Identity verification data:</strong> Information used to confirm the identity of business representatives during onboarding (see Section 3.4 regarding biometric data).</li>
      </ul>
      <p>By connecting your accounts through Plaid, you authorize Plaid to access and transmit this data to Delt Pay for the purposes described in this Policy.</p>

      <h4 id="pp-3-3" className="font-bold text-[#0F0E17] dark:text-white">3.3 Information Collected via Plaid CRA (Consumer Reporting Data)</h4>
      <p>In connection with evaluating your financing application, we may obtain a consumer report about you through Plaid Consumer Reporting Agency, Inc. ("Plaid CRA"). Plaid CRA is a consumer reporting agency subject to the Fair Credit Reporting Act ("FCRA"). The data obtained through Plaid CRA may include:</p>
      <ul>
        <li>Account and transaction history from your connected financial institutions.</li>
        <li>Income, employment, and cash flow data derived from your financial accounts, payroll records, or tax documents.</li>
        <li>Credit-related data, including account balances, repayment history, and credit utilization.</li>
        <li>Scores and assessments generated by Plaid CRA based on your financial data.</li>
      </ul>
      <p>This data is used exclusively for permissible purposes under the FCRA, including evaluating your application for credit and assessing creditworthiness and repayment capacity. For more information about Plaid CRA's practices and your rights under the FCRA, please review the <a href="https://plaid.com/plaid-check-consumer-report/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">Plaid CRA Privacy Policy</a>.</p>

      <h4 id="pp-3-4" className="font-bold text-[#0F0E17] dark:text-white">3.4 Biometric Data (Collected via Plaid Identity Verification)</h4>
      <p>As part of our onboarding and identity verification process, we use Plaid's Identity Verification ("IDV") service. This service may require you to provide a government-issued identity document containing your photograph and/or a photograph or video image of yourself (a "selfie"). Plaid and/or its service providers use facial recognition technology to compare the facial geometry derived from your identity document to the facial geometry derived from your selfie in order to verify your identity and help prevent fraud.</p>
      <p>The images you provide and any derived facial geometry data may be considered biometric data in certain jurisdictions. Plaid processes this biometric data as a service provider on behalf of Delt Pay. Plaid and its service providers store biometric data in encrypted form and do not use it to enhance, improve, or develop their own services.</p>
      <p>Your biometric data is used solely for the purposes of identity verification and fraud prevention in connection with your financing application.</p>
      <p>For full details on how Plaid collects, uses, stores, and deletes biometric data, please review <a href="https://plaid.com/legal/#biometric-policy" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">Plaid's Biometric Policy and Release</a>.</p>
      <div className="bg-[#FFF8E1] border border-[#FFD54F] rounded-lg p-4 my-4">
        <p className="font-bold text-[#0F0E17] mb-1">Special Notice for Illinois and Texas Residents:</p>
        <p className="mb-0">If you are a resident of Illinois or Texas, the data derived from your face that Plaid and Plaid's service providers collect and process on Delt Pay's behalf may be considered biometric data under applicable state law, including the Illinois Biometric Information Privacy Act ("BIPA"). By using our identity verification services, you acknowledge that you have read, understand, and consent to the collection and processing of your biometric data as described in this Section and in Plaid's Biometric Policy and Release. Your biometric data will be stored by Plaid for no longer than three (3) years, unless otherwise required by law. Delt Pay does not directly store biometric data; all biometric data is processed and stored by Plaid on our behalf.</p>
      </div>

      <h4 id="pp-3-5" className="font-bold text-[#0F0E17] dark:text-white">3.5 Information Collected Automatically</h4>
      <p>When you use our website or platform, we may automatically collect:</p>
      <ul>
        <li><strong>Device and usage data:</strong> IP address, browser type, operating system, device model, and pages visited.</li>
        <li><strong>Log data:</strong> Access times, referring URLs, and other diagnostic data.</li>
        <li><strong>Cookies and similar technologies:</strong> Used for session management, analytics, security, and platform functionality. See Section 13 (Cookie Policy) for more details.</li>
        <li><strong>Approximate location:</strong> Inferred from your IP address or device timezone settings.</li>
      </ul>

      <h4 id="pp-3-6" className="font-bold text-[#0F0E17] dark:text-white">3.6 Information from Third Parties</h4>
      <p>We may receive information about you or your business from third parties, including identity verification services, fraud prevention providers, consumer reporting agencies (including Plaid CRA), and other data sources, where permitted by law and as necessary to evaluate financing applications.</p>

      <h3 id="pp-4" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">4. How We Use Your Information</h3>
      <p>We use the information we collect for the following purposes:</p>
      <ul>
        <li><strong>Application processing:</strong> To evaluate, underwrite, approve, or decline your application for a merchant cash advance or other financing product, including through the use of consumer reports obtained from Plaid CRA.</li>
        <li><strong>Identity and bank account verification:</strong> To confirm the identity of business representatives (including through biometric verification via Plaid IDV) and verify ownership of connected bank accounts.</li>
        <li><strong>Income and cash flow assessment:</strong> To assess business revenue, cash flow patterns, and repayment capacity using transaction history, balance data, income/payroll information, and consumer report data obtained through Plaid and Plaid CRA.</li>
        <li><strong>Automated and AI-assisted decision-making:</strong> We may use automated tools, algorithms, and artificial intelligence systems to assist in evaluating applications, assessing creditworthiness, and making financing decisions. These tools analyze financial data, transaction history, and other information to generate assessments and recommendations. A human reviewer is involved in final financing decisions.</li>
        <li><strong>Account management:</strong> To manage your financing account, process payments, and communicate with you about your account status.</li>
        <li><strong>Fraud prevention and security:</strong> To detect, investigate, and prevent fraudulent activity, unauthorized access, and other security threats.</li>
        <li><strong>Legal and regulatory compliance:</strong> To comply with applicable federal and state laws, including the Gramm-Leach-Bliley Act ("GLBA"), Equal Credit Opportunity Act ("ECOA"), Fair Credit Reporting Act ("FCRA"), and Bank Secrecy Act ("BSA"), and to respond to lawful requests from government authorities.</li>
        <li><strong>Service improvement:</strong> To maintain, improve, and develop our platform and services, including through analytics and usage data.</li>
        <li><strong>Communications:</strong> To send you transaction confirmations, account notices, policy updates, and other service-related communications.</li>
      </ul>

      <h3 id="pp-5" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">5. How We Share Your Information</h3>
      <p>Delt Pay does not sell your personal information. We do not share your information with third-party marketers or advertisers. We share information only in the following limited circumstances:</p>

      <h4 id="pp-5-1" className="font-bold text-[#0F0E17] dark:text-white">5.1 Plaid and Plaid CRA</h4>
      <p>We share information with Plaid to enable bank account connectivity, identity verification (including biometric verification), income verification, transaction data retrieval, and balance checks. We share information with Plaid CRA to obtain consumer reports and scores for credit evaluation purposes. Plaid and Plaid CRA act as service providers and/or data processors on our behalf and under their own agreements with you. Their use of your data is governed by their respective privacy policies.</p>

      <h4 id="pp-5-2" className="font-bold text-[#0F0E17] dark:text-white">5.2 Service Providers</h4>
      <p>We may share information with carefully selected third-party service providers who assist us in operating our platform, processing applications, verifying identity, providing analytics, maintaining security, and fulfilling legal obligations. These providers are contractually required to use your information only as directed by us and in accordance with applicable law.</p>

      <h4 id="pp-5-3" className="font-bold text-[#0F0E17] dark:text-white">5.3 Legal and Regulatory Disclosures</h4>
      <p>We may disclose information when required by law, regulation, court order, or government request, or when we believe in good faith that disclosure is necessary to protect our legal rights, prevent fraud, or protect the safety of any person.</p>

      <h4 id="pp-5-4" className="font-bold text-[#0F0E17] dark:text-white">5.4 Business Transfers</h4>
      <p>If Delt Pay undergoes a merger, acquisition, sale of assets, or similar corporate transaction, your information may be transferred as part of that transaction. We will notify you of any such change as required by applicable law.</p>

      <h4 id="pp-5-5" className="font-bold text-[#0F0E17] dark:text-white">5.5 With Your Consent</h4>
      <p>We may share your information for other purposes with your explicit consent.</p>

      <h3 id="pp-6" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">6. Data Security</h3>
      <p>We implement administrative, technical, and physical safeguards designed to protect your information from unauthorized access, disclosure, alteration, or destruction. These measures include:</p>
      <ul>
        <li>Industry-standard encryption for data in transit and at rest.</li>
        <li>Access controls limiting data access to personnel with a legitimate business need.</li>
        <li>Regular monitoring of our systems for unauthorized access or anomalies.</li>
        <li>Timely patching of known security vulnerabilities.</li>
        <li>Incident response procedures to address security events promptly.</li>
      </ul>
      <p>We comply with the Safeguards Rule under the Gramm-Leach-Bliley Act ("GLBA"), which requires us to maintain a comprehensive information security program. While we work hard to protect your information, no system is completely secure. If you believe your information has been compromised, please contact us immediately at <a href="mailto:privacy@delt.com" className="text-[#4F46E5] underline">privacy@delt.com</a>.</p>

      <h3 id="pp-7" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">7. Data Retention</h3>
      <p>We retain your information for as long as necessary to fulfill the purposes described in this Policy, to maintain your account, and to comply with our legal, regulatory, and contractual obligations.</p>
      <p>For lending and credit-related records, we retain data for a minimum of seven (7) years following account closure or the end of our business relationship, consistent with requirements under ECOA, GLBA, FCRA, and applicable tax laws.</p>
      <p>For biometric data, Delt Pay does not directly store biometric information. Biometric data processed through Plaid's Identity Verification service is retained by Plaid for no longer than three (3) years, unless otherwise required by law or by our instructions as a customer. Please see Plaid's Biometric Policy for details.</p>
      <p>After the applicable retention period, we will securely delete or anonymize your information. If you request deletion of your data, we will honor that request to the extent permitted by law — certain records may be required to be retained regardless of such a request.</p>

      <h3 id="pp-8" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">8. Your Rights and Choices</h3>
      <p>Even though our services are directed to businesses, individual representatives who interact with our platform have certain rights with respect to their personal information:</p>
      <ul>
        <li><strong>Access:</strong> You may request a copy of the personal information we hold about you.</li>
        <li><strong>Correction:</strong> You may request that we correct inaccurate or incomplete information.</li>
        <li><strong>Deletion:</strong> You may request deletion of your personal information, subject to our legal retention obligations.</li>
        <li><strong>Opt-out of non-essential communications:</strong> You may opt out of marketing communications at any time by following the unsubscribe instructions in any email or by contacting us directly.</li>
      </ul>
      <p className="font-bold text-[#0F0E17] dark:text-white mt-4">Your Rights Under the FCRA</p>
      <p>If Delt Pay has obtained a consumer report about you through Plaid CRA, you have specific rights under the Fair Credit Reporting Act, including the right to:</p>
      <ul>
        <li>Access the information in your consumer file.</li>
        <li>Dispute inaccurate or incomplete information and request reinvestigation.</li>
        <li>Be notified if information in your consumer report has been used against you in a credit decision.</li>
        <li>Request that your information not be used for prescreened offers of credit.</li>
      </ul>
      <p>To exercise your FCRA rights with Plaid CRA, you may visit <a href="https://plaid.com/check/consumer-service-center/" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">Plaid CRA's Consumer Service Center</a> or contact Plaid CRA at 844-204-5860.</p>
      <p>To exercise any rights with Delt Pay, please contact us at <a href="mailto:privacy@delt.com" className="text-[#4F46E5] underline">privacy@delt.com</a>. We will respond within a reasonable time and in accordance with applicable law. We may require you to verify your identity before fulfilling a request.</p>

      <h3 id="pp-9" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">9. Plaid's Role and Your Rights with Plaid</h3>
      <p>When you connect your financial accounts or undergo identity verification using Plaid, Plaid collects and processes your data as described in Plaid's End User Privacy Policy (<a href="https://plaid.com/legal" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">https://plaid.com/legal</a>). You have rights with respect to Plaid's processing of your data directly with Plaid, including the ability to manage and revoke data connections through the Plaid Portal at <a href="https://my.plaid.com" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">my.plaid.com</a>.</p>
      <p>Disconnecting your accounts through Plaid's Portal will terminate Plaid's ongoing access to your financial data, but will not affect information already transmitted to and retained by Delt Pay in connection with your application or account.</p>

      <h3 id="pp-10" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">10. GLBA Privacy Notice</h3>
      <p>As a financial services company, Delt Pay is subject to the Gramm-Leach-Bliley Act ("GLBA"). Under GLBA, we are required to inform you about our information-sharing practices. As stated in this Policy:</p>
      <ul>
        <li>We do not share your nonpublic personal information with non-affiliated third parties for marketing purposes.</li>
        <li>We share nonpublic personal information only as permitted under GLBA, including with service providers who help us operate our business and as required by law.</li>
      </ul>
      <p>You do not need to take any action to limit our sharing, as we already limit sharing to what is described in this Policy. If you have questions about our GLBA practices, contact us at <a href="mailto:privacy@delt.com" className="text-[#4F46E5] underline">privacy@delt.com</a>.</p>

      <h3 id="pp-11" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">11. FCRA Compliance Notice</h3>
      <p>When Delt Pay obtains a consumer report about you from Plaid CRA or any other consumer reporting agency, we do so for permissible purposes under the Fair Credit Reporting Act ("FCRA"), including evaluating your application for a merchant cash advance or other financing product. We will provide you with any required adverse action notices if a credit decision is based in whole or in part on information contained in a consumer report. You have the right to obtain a free copy of any consumer report used in connection with an adverse action, and to dispute the accuracy or completeness of any information in that report.</p>

      <h3 id="pp-12" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">12. California Privacy Notice</h3>
      <p>If you are a California resident, you may have additional rights under the California Consumer Privacy Act ("CCPA"), as amended by the California Privacy Rights Act ("CPRA"). However, please note that the CCPA provides exemptions for personal information collected, processed, sold, or disclosed pursuant to the Gramm-Leach-Bliley Act and for activities subject to the Fair Credit Reporting Act. To the extent these exemptions apply to your data, CCPA requirements may not apply. Regardless of applicable exemptions, we are committed to transparency about our data practices as described throughout this Policy. If you have questions about your California privacy rights, please contact us at <a href="mailto:privacy@delt.com" className="text-[#4F46E5] underline">privacy@delt.com</a>.</p>

      <h3 id="pp-13" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">13. Cookie Policy</h3>
      <p>When you visit the Delt Pay website or platform, we and our third-party partners use cookies and similar tracking technologies to collect information about your browsing activity.</p>
      <p className="font-bold text-[#0F0E17] dark:text-white mt-4">What Are Cookies</p>
      <p>Cookies are small data files stored on your browser or device. They may be session cookies (which expire when you close your browser) or persistent cookies (which remain until they expire or you delete them).</p>
      <p className="font-bold text-[#0F0E17] dark:text-white mt-4">Types of Cookies We Use</p>
      <ul>
        <li><strong>Strictly Necessary Cookies:</strong> Required for our platform to function properly. These enable core features such as security, authentication, and session management.</li>
        <li><strong>Analytics and Performance Cookies:</strong> We use third-party analytics services, including Google Analytics, to understand how visitors interact with our website and to improve our platform. These cookies collect information such as pages visited, time spent on pages, and traffic sources.</li>
        <li><strong>Functional Cookies:</strong> These enable enhanced functionality and personalization, such as remembering your preferences and settings.</li>
      </ul>
      <p>We do not use advertising or targeting cookies.</p>
      <p className="font-bold text-[#0F0E17] dark:text-white mt-4">Google Analytics</p>
      <p>We use Google Analytics to collect anonymized usage data about our website visitors. Google Analytics uses cookies to collect information such as how often users visit our site, what pages they view, and what other sites they visited before coming to ours. Google's ability to use and share information collected by Google Analytics is restricted by the Google Analytics Terms of Service and the Google Privacy Policy. You can opt out of Google Analytics by installing Google's opt-out browser add-on, available at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">https://tools.google.com/dlpage/gaoptout</a>.</p>
      <p className="font-bold text-[#0F0E17] dark:text-white mt-4">Your Choices</p>
      <p>Most web browsers allow you to manage cookie preferences through browser settings. You can set your browser to refuse cookies or alert you when cookies are being sent. Please note that disabling cookies may affect the functionality of our platform.</p>
      <p className="font-bold text-[#0F0E17] dark:text-white mt-4">Google reCAPTCHA</p>
      <p>When you interact with our platform through Plaid, Google reCAPTCHA may be used to help detect fraud and abuse. Google reCAPTCHA processes certain data, including your IP address and browsing behavior. When reCAPTCHA is used, Google's Privacy Policy and Terms of Use apply.</p>

      <h3 id="pp-14" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">14. Adverse Action Notices</h3>
      <p>If we take an adverse action regarding your financing application (such as denying your application, offering less favorable terms, or reducing a credit limit) based in whole or in part on information obtained from a consumer report or other third-party source, we will provide you with a notice that includes:</p>
      <ul>
        <li>The name, address, and phone number of the consumer reporting agency that provided the report.</li>
        <li>A statement that the consumer reporting agency did not make the adverse decision and cannot explain the reasons for it.</li>
        <li>Your right to obtain a free copy of your consumer report from the reporting agency within 60 days.</li>
        <li>Your right to dispute the accuracy or completeness of information in the report.</li>
      </ul>

      <h3 id="pp-15" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">15. Changes to This Policy</h3>
      <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the Effective Date at the top of this Policy and notify you through the platform or by email where required. We encourage you to review this Policy periodically.</p>

      <h3 id="pp-16" className="text-xl font-bold text-[#2B3674] dark:text-blue-300 border-b border-gray-300 pb-1">16. Contact Us</h3>
      <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
      <div className="mt-4 mb-4">
        <p className="font-bold text-[#0F0E17] dark:text-white">Delt Pay LLC</p>
        <p>Attn: Privacy</p>
        <p>1603 Capitol Ave Ste 415 #644712</p>
        <p>Cheyenne, Wyoming 82001 USA</p>
        <p>Email: <a href="mailto:privacy@delt.com" className="text-[#4F46E5] underline">privacy@delt.com</a></p>
      </div>
      <p className="italic font-semibold">We take privacy concerns seriously and will respond to your inquiry as promptly as possible.</p>
    </LegalPageLayout>
  );
}

/* ══════════════════════════════════════════════════════════════
   ELECTRONIC COMMUNICATIONS AGREEMENT
   ══════════════════════════════════════════════════════════════ */
const ecaToc: TocItem[] = [
  { id: 'eca-1', label: 'Scope of Communications' },
  { id: 'eca-2', label: 'Method of Providing' },
  { id: 'eca-3', label: 'How to Withdraw Consent' },
  { id: 'eca-4', label: 'Updating Contact Info' },
  { id: 'eca-5', label: 'Hardware & Software Requirements' },
];

export function ElectronicCommunicationsAgreement({ onClose }: { onClose?: () => void }) {
  return (
    <LegalPageLayout title="Electronic Communications Agreement" onClose={onClose} tocItems={ecaToc}>
      <p>Last updated: February 19, 2026</p>

      <h3 id="eca-1">1. Scope of Communications to Be Provided in Electronic Form</h3>
      <p>You agree that we may provide you with any communications that we may be required to send to you by law or regulation in electronic format. These communications include, but are not limited to:</p>
      <ul>
        <li>Terms and conditions and policies you agree to (e.g., the Delt Capital Terms of Use and Privacy Policy), including updates to these agreements or policies;</li>
        <li>Disclosures and notices associated with your account;</li>
        <li>Transaction receipts or confirmations;</li>
        <li>Customer service communications; and</li>
        <li>Any other communications related to your use of Delt Capital services.</li>
      </ul>

      <h3 id="eca-2">2. Method of Providing Communications</h3>
      <p>We may provide communications to you by email or by posting them on the Delt Capital website or mobile application. All communications in either electronic or paper format will be considered to be "in writing."</p>

      <h3 id="eca-3">3. How to Withdraw Consent</h3>
      <p>You may withdraw your consent to receive communications electronically by contacting us in writing. If you withdraw your consent, we reserve the right to close your account or charge you additional fees for paper copies.</p>

      <h3 id="eca-4">4. Updating Your Contact Information</h3>
      <p>It is your responsibility to keep your primary email address up to date so that Delt Capital can communicate with you electronically. You understand and agree that if Delt Capital sends you an electronic communication but you do not receive it because your primary email address on file is incorrect, out of date, blocked by your service provider, or you are otherwise unable to receive electronic communications, Delt Capital will be deemed to have provided the communication to you.</p>

      <h3 id="eca-5">5. Hardware and Software Requirements</h3>
      <p>In order to access and retain electronic communications, you will need a computer or mobile device with an internet connection, a valid email address, and software that allows you to view and save PDF files.</p>
    </LegalPageLayout>
  );
}