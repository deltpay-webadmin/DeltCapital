function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function V1LegalTOC({
  items,
  activeId,
  onJump
}) {
  return React.createElement("nav", {
    style: {
      paddingTop: 4
    }
  }, React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: V1.muted,
      marginBottom: 18
    }
  }, "On this page"), React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, items.map((it, i) => {
    const isActive = it.id === activeId;
    const isSub = (it.level || 1) >= 2;
    return React.createElement("li", {
      key: it.id,
      style: {
        position: 'relative'
      }
    }, React.createElement("button", {
      onClick: () => onJump(it.id),
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        textAlign: 'left',
        width: '100%',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: isSub ? '6px 0 6px 24px' : '8px 0',
        borderBottom: isSub ? 'none' : `1px solid ${V1.line}`,
        fontFamily: V1.fontBody,
        fontSize: isSub ? 12.5 : 13.5,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? V1.ink : V1.text,
        lineHeight: 1.4,
        transition: 'color 220ms, font-weight 220ms'
      }
    }, !isSub && React.createElement("span", {
      "aria-hidden": true,
      style: {
        flexShrink: 0,
        fontFamily: V1.fontMono,
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: isActive ? V1.blue : V1.muted,
        minWidth: 22,
        transition: 'color 220ms'
      }
    }, String(i + 1).padStart(2, '0')), React.createElement("span", null, it.label)), React.createElement("span", {
      "aria-hidden": true,
      style: {
        position: 'absolute',
        left: -16,
        top: '50%',
        transform: `translateY(-50%) scaleX(${isActive ? 1 : 0})`,
        transformOrigin: 'left center',
        width: 12,
        height: 2,
        background: V1.blue,
        transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }));
  })));
}
function V1LegalLayout({
  title,
  eyebrow,
  effective,
  toc,
  onBack,
  otherLink,
  children
}) {
  const mounted = useV1Mounted(60);
  const [activeId, setActiveId] = React.useState(toc?.[0]?.id || '');
  React.useEffect(() => {
    if (!toc || toc.length === 0) return;
    const els = toc.map(t => document.getElementById(t.id)).filter(Boolean);
    if (els.length === 0) return;
    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) setActiveId(visible[0].target.id);
    }, {
      rootMargin: '-100px 0px -65% 0px',
      threshold: 0
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [toc]);
  const handleJump = React.useCallback(id => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setActiveId(id);
    }
  }, []);
  return React.createElement("section", {
    "data-v1-section": true,
    style: {
      background: V1.bg,
      paddingBottom: 96
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '32px 40px 0',
      display: 'flex',
      justifyContent: 'flex-end',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateX(0)' : 'translateX(12px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 60ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 60ms'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 11,
      letterSpacing: '0.18em',
      color: V1.muted,
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, "Vol. VII \xB7 Legal", React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: V1.muted
    }
  }))), React.createElement("div", {
    "data-v1-grid-2col": true,
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '40px 40px 0',
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      gap: 72,
      alignItems: 'start'
    }
  }, React.createElement("aside", {
    style: {
      position: 'sticky',
      top: 96,
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
      paddingRight: 8,
      opacity: mounted ? 1 : 0,
      transition: 'opacity 800ms cubic-bezier(0.22,1,0.36,1) 200ms'
    }
  }, React.createElement(V1LegalTOC, {
    items: toc,
    activeId: activeId,
    onJump: handleJump
  }), React.createElement("div", {
    style: {
      marginTop: 28,
      paddingTop: 20,
      borderTop: `1px solid ${V1.line}`
    }
  }, React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 13.5,
      fontWeight: 500,
      color: V1.muted,
      padding: 0
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = V1.ink;
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = V1.muted;
    }
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14"
  }, React.createElement("path", {
    d: "M11 7H3M6 4L3 7l3 3",
    stroke: "currentColor",
    strokeWidth: "1.6",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), "Back to site"))), React.createElement("main", {
    style: {
      minWidth: 0
    }
  }, eyebrow && React.createElement("div", {
    style: {
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 60ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 60ms',
      marginBottom: 18
    }
  }, React.createElement(V1Eyebrow, null, eyebrow)), React.createElement("h1", {
    "data-v1-section-title": true,
    style: {
      margin: 0,
      fontFamily: V1.fontDisplay,
      fontSize: 'clamp(2.4rem, 4.6vw, 3rem)',
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: '-0.035em',
      color: V1.ink
    }
  }, React.createElement(V1LineMask, {
    ready: mounted,
    delay: 140,
    duration: 900
  }, title)), effective && React.createElement("div", {
    style: {
      marginTop: 20,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.muted,
      opacity: mounted ? 1 : 0,
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1) 380ms'
    }
  }, React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: V1.muted
    }
  }), "Effective \xB7 ", effective), React.createElement("div", {
    style: {
      marginTop: 36,
      marginBottom: 40,
      height: 1,
      background: V1.line,
      transformOrigin: 'left center',
      transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 1000ms cubic-bezier(0.22,1,0.36,1) 480ms'
    }
  }), children, otherLink && React.createElement("div", {
    style: {
      marginTop: 72,
      paddingTop: 28,
      borderTop: `1px solid ${V1.line}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 14,
      color: V1.text
    }
  }, "Questions? Email ", React.createElement(LegalLink, {
    href: "mailto:privacy@delt.com"
  }, "privacy@delt.com"), "."), React.createElement("button", {
    type: "button",
    onClick: otherLink.onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: V1.fontBody,
      fontSize: 14,
      fontWeight: 600,
      color: V1.blue,
      padding: 0
    }
  }, "Read ", otherLink.label, " \u2192")))));
}
function LegalSection({
  id,
  eyebrow,
  title,
  children
}) {
  const [ref, inView] = useV1InView(0.05, '0px 0px -10% 0px');
  return React.createElement("section", {
    "data-v1-section": true,
    ref: ref,
    id: id,
    style: {
      scrollMarginTop: 96,
      paddingTop: 8,
      paddingBottom: 40,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)'
    }
  }, eyebrow && React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: V1.blue,
      marginBottom: 12
    }
  }, eyebrow), React.createElement("h3", {
    style: {
      margin: '0 0 20px',
      fontFamily: V1.fontDisplay,
      fontSize: 32,
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      color: V1.ink,
      position: 'relative',
      paddingBottom: 14
    }
  }, title, React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: 36,
      height: 2,
      background: V1.blue,
      transformOrigin: 'left center',
      transform: inView ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1) 240ms'
    }
  })), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 16.5,
      lineHeight: 1.7,
      color: V1.text
    }
  }, children));
}
function LegalSubSection({
  id,
  title,
  children
}) {
  return React.createElement("div", {
    id: id,
    style: {
      scrollMarginTop: 96,
      marginTop: 28
    }
  }, React.createElement("h4", {
    style: {
      margin: '0 0 12px',
      fontFamily: V1.fontDisplay,
      fontSize: 20,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
      color: V1.ink
    }
  }, title), children);
}
function LegalP({
  children,
  style
}) {
  return React.createElement("p", {
    style: {
      margin: '0 0 14px',
      fontFamily: V1.fontBody,
      fontSize: 16.5,
      lineHeight: 1.7,
      color: V1.text,
      ...style
    }
  }, children);
}
function LegalList({
  items
}) {
  return React.createElement("ul", {
    style: {
      margin: '0 0 18px',
      padding: 0,
      listStyle: 'none',
      fontFamily: V1.fontBody,
      fontSize: 16.5,
      lineHeight: 1.7,
      color: V1.text
    }
  }, items.map((it, i) => React.createElement("li", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '14px 1fr',
      gap: 12,
      marginBottom: 8
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      color: V1.blue,
      fontWeight: 700,
      lineHeight: 1.7
    }
  }, "\xB7"), React.createElement("span", null, it))));
}
function LegalCallout({
  eyebrow,
  children
}) {
  return React.createElement("aside", {
    style: {
      margin: '20px 0',
      padding: '20px 22px',
      background: '#fff',
      border: `1px solid ${V1.line}`,
      borderLeft: `3px solid ${V1.blue}`,
      borderRadius: 8
    }
  }, eyebrow && React.createElement("div", {
    style: {
      fontFamily: V1.fontMono,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: V1.blue,
      marginBottom: 10
    }
  }, eyebrow), React.createElement("div", {
    style: {
      fontFamily: V1.fontBody,
      fontSize: 15,
      lineHeight: 1.6,
      color: V1.ink
    }
  }, children));
}
function LegalLink({
  href,
  children,
  external
}) {
  const [hover, setHover] = React.useState(false);
  const props = external ? {
    href,
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {
    href
  };
  return React.createElement("a", _extends({}, props, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      color: V1.blue,
      fontWeight: 500,
      textDecoration: 'none'
    }
  }), children, React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -2,
      height: 1,
      background: V1.blue,
      transform: hover ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'left center',
      transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)'
    }
  }));
}
const TERMS_TOC = [{
  id: 'terms-1',
  label: 'Agreement to Terms'
}, {
  id: 'terms-2',
  label: 'Use License'
}, {
  id: 'terms-3',
  label: 'Disclaimer'
}, {
  id: 'terms-4',
  label: 'Limitations'
}, {
  id: 'terms-5',
  label: 'Accuracy of Materials'
}, {
  id: 'terms-6',
  label: 'Links'
}, {
  id: 'terms-7',
  label: 'Governing Law'
}];
function V1TermsOfUse({
  onBack,
  onNavPrivacy
}) {
  return React.createElement(V1LegalLayout, {
    eyebrow: "Terms",
    title: "Terms of Use.",
    effective: "Feb 19, 2026",
    toc: TERMS_TOC,
    onBack: onBack,
    otherLink: {
      label: 'Privacy Policy',
      onClick: onNavPrivacy
    }
  }, React.createElement(LegalSection, {
    id: "terms-1",
    eyebrow: "01",
    title: "Agreement to Terms"
  }, React.createElement(LegalP, null, "By accessing or using the Delt Capital website and services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.")), React.createElement(LegalSection, {
    id: "terms-2",
    eyebrow: "02",
    title: "Use License"
  }, React.createElement(LegalP, null, "Permission is granted to temporarily download one copy of the materials (information or software) on Delt Capital's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:"), React.createElement(LegalList, {
    items: ['modify or copy the materials;', 'use the materials for any commercial purpose, or for any public display (commercial or non-commercial);', "attempt to decompile or reverse engineer any software contained on Delt Capital's website;", 'remove any copyright or other proprietary notations from the materials; or', 'transfer the materials to another person or "mirror" the materials on any other server.']
  })), React.createElement(LegalSection, {
    id: "terms-3",
    eyebrow: "03",
    title: "Disclaimer"
  }, React.createElement(LegalP, null, "The materials on Delt Capital's website are provided on an 'as is' basis. Delt Capital makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.")), React.createElement(LegalSection, {
    id: "terms-4",
    eyebrow: "04",
    title: "Limitations"
  }, React.createElement(LegalP, null, "In no event shall Delt Capital or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Delt Capital's website, even if Delt Capital or a Delt Capital authorized representative has been notified orally or in writing of the possibility of such damage.")), React.createElement(LegalSection, {
    id: "terms-5",
    eyebrow: "05",
    title: "Accuracy of Materials"
  }, React.createElement(LegalP, null, "The materials appearing on Delt Capital's website could include technical, typographical, or photographic errors. Delt Capital does not warrant that any of the materials on its website are accurate, complete or current. Delt Capital may make changes to the materials contained on its website at any time without notice.")), React.createElement(LegalSection, {
    id: "terms-6",
    eyebrow: "06",
    title: "Links"
  }, React.createElement(LegalP, null, "Delt Capital has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Delt Capital of the site. Use of any such linked website is at the user's own risk.")), React.createElement(LegalSection, {
    id: "terms-7",
    eyebrow: "07",
    title: "Governing Law"
  }, React.createElement(LegalP, null, "These terms and conditions are governed by and construed in accordance with the laws of Delaware and you irrevocably submit to the exclusive jurisdiction of the courts in that State.")));
}
const PRIVACY_TOC = [{
  id: 'pp-1',
  label: '1. Introduction'
}, {
  id: 'pp-2',
  label: '2. Who This Applies To'
}, {
  id: 'pp-3',
  label: '3. Information We Collect'
}, {
  id: 'pp-3-1',
  label: '3.1 You Provide Directly',
  level: 2
}, {
  id: 'pp-3-2',
  label: '3.2 Via Plaid',
  level: 2
}, {
  id: 'pp-3-3',
  label: '3.3 Via Plaid CRA',
  level: 2
}, {
  id: 'pp-3-4',
  label: '3.4 Biometric Data',
  level: 2
}, {
  id: 'pp-3-5',
  label: '3.5 Automatically Collected',
  level: 2
}, {
  id: 'pp-3-6',
  label: '3.6 From Third Parties',
  level: 2
}, {
  id: 'pp-4',
  label: '4. How We Use Information'
}, {
  id: 'pp-5',
  label: '5. How We Share Information'
}, {
  id: 'pp-6',
  label: '6. Data Security'
}, {
  id: 'pp-7',
  label: '7. Data Retention'
}, {
  id: 'pp-8',
  label: '8. Your Rights & Choices'
}, {
  id: 'pp-9',
  label: "9. Plaid's Role"
}, {
  id: 'pp-10',
  label: '10. GLBA Privacy Notice'
}, {
  id: 'pp-11',
  label: '11. FCRA Compliance'
}, {
  id: 'pp-12',
  label: '12. California Privacy'
}, {
  id: 'pp-13',
  label: '13. Cookie Policy'
}, {
  id: 'pp-14',
  label: '14. Adverse Action Notices'
}, {
  id: 'pp-15',
  label: '15. Changes to Policy'
}, {
  id: 'pp-16',
  label: '16. Contact Us'
}];
function V1PrivacyPolicy({
  onBack,
  onNavTerms
}) {
  return React.createElement(V1LegalLayout, {
    eyebrow: "Privacy",
    title: "Privacy Policy.",
    effective: "Mar 1, 2026",
    toc: PRIVACY_TOC,
    onBack: onBack,
    otherLink: {
      label: 'Terms of Use',
      onClick: onNavTerms
    }
  }, React.createElement(LegalSection, {
    id: "pp-1",
    eyebrow: "01 \xB7 Introduction",
    title: "Introduction"
  }, React.createElement(LegalP, null, "Delt Pay LLC (\"Delt Pay,\" \"we,\" \"our,\" or \"us\") provides merchant cash advance (\"MCA\") and other credit and lending products to businesses. This Privacy Policy explains how we collect, use, store, and share information \u2014 including personal data about business owners, authorized representatives, and other individuals (\"you\") \u2014 when you use our platform and apply for or manage a financing product with us."), React.createElement(LegalP, null, "Our services are powered in part by Plaid Inc. (\"Plaid\") and Plaid Consumer Reporting Agency, Inc. (\"Plaid CRA\"), third-party financial data and consumer reporting platforms. When you connect a bank account or undergo identity verification through our platform, you interact with Plaid and/or Plaid CRA directly. We encourage you to review the following Plaid policies for a full description of Plaid's own data practices:"), React.createElement(LegalList, {
    items: [React.createElement(React.Fragment, null, "Plaid End User Privacy Policy: ", React.createElement(LegalLink, {
      href: "https://plaid.com/legal",
      external: true
    }, "plaid.com/legal")), React.createElement(React.Fragment, null, "Plaid CRA Privacy Policy: ", React.createElement(LegalLink, {
      href: "https://plaid.com/plaid-check-consumer-report/privacy-policy",
      external: true
    }, "plaid.com/plaid-check-consumer-report/privacy-policy")), React.createElement(React.Fragment, null, "Plaid Biometric Policy and Release: ", React.createElement(LegalLink, {
      href: "https://plaid.com/legal/#biometric-policy",
      external: true
    }, "plaid.com/legal/#biometric-policy"))]
  }), React.createElement(LegalP, null, "This Policy does not govern Plaid's or Plaid CRA's independent processing of your data \u2014 only Delt Pay's.")), React.createElement(LegalSection, {
    id: "pp-2",
    eyebrow: "02 \xB7 Applicability",
    title: "Who This Policy Applies To"
  }, React.createElement(LegalP, null, "This Policy applies to business entities and the individual representatives, owners, officers, or authorized users who interact with Delt Pay on behalf of those businesses. Our services are not directed to, and we do not knowingly collect data from, individuals under 18 years of age. If you are under 18, do not use our services or submit any information to us.")), React.createElement(LegalSection, {
    id: "pp-3",
    eyebrow: "03 \xB7 Data",
    title: "Information We Collect"
  }, React.createElement(LegalP, null, "We collect several categories of information in connection with providing our services:"), React.createElement(LegalSubSection, {
    id: "pp-3-1",
    title: "3.1 Information You Provide Directly"
  }, React.createElement(LegalList, {
    items: [React.createElement(React.Fragment, null, React.createElement("b", null, "Business information:"), " Legal business name, EIN/Tax ID, business address, industry, years in operation, and monthly revenue."), React.createElement(React.Fragment, null, React.createElement("b", null, "Personal identifiers about business representatives:"), " Name, date of birth, Social Security number (for identity verification and credit evaluation), email address, phone number, and mailing address."), React.createElement(React.Fragment, null, React.createElement("b", null, "Financial documents:"), " Bank statements, tax returns, profit and loss statements, or pay stubs you upload or submit to us."), React.createElement(React.Fragment, null, React.createElement("b", null, "Account credentials:"), " If required to connect your financial accounts via Plaid, usernames, passwords, security tokens, or one-time passwords (collected and processed by Plaid on our behalf).")]
  })), React.createElement(LegalSubSection, {
    id: "pp-3-2",
    title: "3.2 Information Collected via Plaid"
  }, React.createElement(LegalP, null, "When you connect your bank account through our platform using Plaid, Plaid collects and transmits financial data to us on your behalf. Depending on the services you use, this may include:"), React.createElement(LegalList, {
    items: [React.createElement(React.Fragment, null, React.createElement("b", null, "Bank account details:"), " Institution name, account name, account type, account and routing numbers, and ownership information."), React.createElement(React.Fragment, null, React.createElement("b", null, "Account balances:"), " Current and available balance."), React.createElement(React.Fragment, null, React.createElement("b", null, "Transaction history:"), " Transaction amounts, dates, payees, types, and descriptions \u2014 used to assess cash flow and creditworthiness."), React.createElement(React.Fragment, null, React.createElement("b", null, "Income and payroll data:"), " Information from connected payroll accounts or uploaded pay stubs and tax forms \u2014 used for income verification in connection with financing decisions."), React.createElement(React.Fragment, null, React.createElement("b", null, "Identity verification data:"), " Information used to confirm the identity of business representatives during onboarding (see Section 3.4 regarding biometric data).")]
  }), React.createElement(LegalP, null, "By connecting your accounts through Plaid, you authorize Plaid to access and transmit this data to Delt Pay for the purposes described in this Policy.")), React.createElement(LegalSubSection, {
    id: "pp-3-3",
    title: "3.3 Information Collected via Plaid CRA (Consumer Reporting Data)"
  }, React.createElement(LegalP, null, "In connection with evaluating your financing application, we may obtain a consumer report about you through Plaid Consumer Reporting Agency, Inc. (\"Plaid CRA\"). Plaid CRA is a consumer reporting agency subject to the Fair Credit Reporting Act (\"FCRA\"). The data obtained through Plaid CRA may include:"), React.createElement(LegalList, {
    items: ['Account and transaction history from your connected financial institutions.', 'Income, employment, and cash flow data derived from your financial accounts, payroll records, or tax documents.', 'Credit-related data, including account balances, repayment history, and credit utilization.', 'Scores and assessments generated by Plaid CRA based on your financial data.']
  }), React.createElement(LegalP, null, "This data is used exclusively for permissible purposes under the FCRA, including evaluating your application for credit and assessing creditworthiness and repayment capacity. For more information about Plaid CRA's practices and your rights under the FCRA, please review the ", React.createElement(LegalLink, {
    href: "https://plaid.com/plaid-check-consumer-report/privacy-policy",
    external: true
  }, "Plaid CRA Privacy Policy"), ".")), React.createElement(LegalSubSection, {
    id: "pp-3-4",
    title: "3.4 Biometric Data (Collected via Plaid Identity Verification)"
  }, React.createElement(LegalP, null, "As part of our onboarding and identity verification process, we use Plaid's Identity Verification (\"IDV\") service. This service may require you to provide a government-issued identity document containing your photograph and/or a photograph or video image of yourself (a \"selfie\"). Plaid and/or its service providers use facial recognition technology to compare the facial geometry derived from your identity document to the facial geometry derived from your selfie in order to verify your identity and help prevent fraud."), React.createElement(LegalP, null, "The images you provide and any derived facial geometry data may be considered biometric data in certain jurisdictions. Plaid processes this biometric data as a service provider on behalf of Delt Pay. Plaid and its service providers store biometric data in encrypted form and do not use it to enhance, improve, or develop their own services."), React.createElement(LegalP, null, "Your biometric data is used solely for the purposes of identity verification and fraud prevention in connection with your financing application."), React.createElement(LegalP, null, "For full details on how Plaid collects, uses, stores, and deletes biometric data, please review ", React.createElement(LegalLink, {
    href: "https://plaid.com/legal/#biometric-policy",
    external: true
  }, "Plaid's Biometric Policy and Release"), "."), React.createElement(LegalCallout, {
    eyebrow: "Special Notice \xB7 Illinois & Texas Residents"
  }, "If you are a resident of Illinois or Texas, the data derived from your face that Plaid and Plaid's service providers collect and process on Delt Pay's behalf may be considered biometric data under applicable state law, including the Illinois Biometric Information Privacy Act (\"BIPA\"). By using our identity verification services, you acknowledge that you have read, understand, and consent to the collection and processing of your biometric data as described in this Section and in Plaid's Biometric Policy and Release. Your biometric data will be stored by Plaid for no longer than three (3) years, unless otherwise required by law. Delt Pay does not directly store biometric data; all biometric data is processed and stored by Plaid on our behalf.")), React.createElement(LegalSubSection, {
    id: "pp-3-5",
    title: "3.5 Information Collected Automatically"
  }, React.createElement(LegalP, null, "When you use our website or platform, we may automatically collect:"), React.createElement(LegalList, {
    items: [React.createElement(React.Fragment, null, React.createElement("b", null, "Device and usage data:"), " IP address, browser type, operating system, device model, and pages visited."), React.createElement(React.Fragment, null, React.createElement("b", null, "Log data:"), " Access times, referring URLs, and other diagnostic data."), React.createElement(React.Fragment, null, React.createElement("b", null, "Cookies and similar technologies:"), " Used for session management, analytics, security, and platform functionality. See Section 13 (Cookie Policy) for more details."), React.createElement(React.Fragment, null, React.createElement("b", null, "Approximate location:"), " Inferred from your IP address or device timezone settings.")]
  })), React.createElement(LegalSubSection, {
    id: "pp-3-6",
    title: "3.6 Information from Third Parties"
  }, React.createElement(LegalP, null, "We may receive information about you or your business from third parties, including identity verification services, fraud prevention providers, consumer reporting agencies (including Plaid CRA), and other data sources, where permitted by law and as necessary to evaluate financing applications."))), React.createElement(LegalSection, {
    id: "pp-4",
    eyebrow: "04 \xB7 Use",
    title: "How We Use Your Information"
  }, React.createElement(LegalP, null, "We use the information we collect for the following purposes:"), React.createElement(LegalList, {
    items: [React.createElement(React.Fragment, null, React.createElement("b", null, "Application processing:"), " To evaluate, underwrite, approve, or decline your application for a merchant cash advance or other financing product, including through the use of consumer reports obtained from Plaid CRA."), React.createElement(React.Fragment, null, React.createElement("b", null, "Identity and bank account verification:"), " To confirm the identity of business representatives (including through biometric verification via Plaid IDV) and verify ownership of connected bank accounts."), React.createElement(React.Fragment, null, React.createElement("b", null, "Income and cash flow assessment:"), " To assess business revenue, cash flow patterns, and repayment capacity using transaction history, balance data, income/payroll information, and consumer report data obtained through Plaid and Plaid CRA."), React.createElement(React.Fragment, null, React.createElement("b", null, "Automated and AI-assisted decision-making:"), " We may use automated tools, algorithms, and artificial intelligence systems to assist in evaluating applications, assessing creditworthiness, and making financing decisions. These tools analyze financial data, transaction history, and other information to generate assessments and recommendations. A human reviewer is involved in final financing decisions."), React.createElement(React.Fragment, null, React.createElement("b", null, "Account management:"), " To manage your financing account, process payments, and communicate with you about your account status."), React.createElement(React.Fragment, null, React.createElement("b", null, "Fraud prevention and security:"), " To detect, investigate, and prevent fraudulent activity, unauthorized access, and other security threats."), React.createElement(React.Fragment, null, React.createElement("b", null, "Legal and regulatory compliance:"), " To comply with applicable federal and state laws, including the Gramm-Leach-Bliley Act (\"GLBA\"), Equal Credit Opportunity Act (\"ECOA\"), Fair Credit Reporting Act (\"FCRA\"), and Bank Secrecy Act (\"BSA\"), and to respond to lawful requests from government authorities."), React.createElement(React.Fragment, null, React.createElement("b", null, "Service improvement:"), " To maintain, improve, and develop our platform and services, including through analytics and usage data."), React.createElement(React.Fragment, null, React.createElement("b", null, "Communications:"), " To send you transaction confirmations, account notices, policy updates, and other service-related communications.")]
  })), React.createElement(LegalSection, {
    id: "pp-5",
    eyebrow: "05 \xB7 Sharing",
    title: "How We Share Your Information"
  }, React.createElement(LegalP, null, "Delt Pay does not sell your personal information. We do not share your information with third-party marketers or advertisers. We share information only in the following limited circumstances:"), React.createElement(LegalSubSection, {
    id: "pp-5-1",
    title: "5.1 Plaid and Plaid CRA"
  }, React.createElement(LegalP, null, "We share information with Plaid to enable bank account connectivity, identity verification (including biometric verification), income verification, transaction data retrieval, and balance checks. We share information with Plaid CRA to obtain consumer reports and scores for credit evaluation purposes. Plaid and Plaid CRA act as service providers and/or data processors on our behalf and under their own agreements with you. Their use of your data is governed by their respective privacy policies.")), React.createElement(LegalSubSection, {
    id: "pp-5-2",
    title: "5.2 Service Providers"
  }, React.createElement(LegalP, null, "We may share information with carefully selected third-party service providers who assist us in operating our platform, processing applications, verifying identity, providing analytics, maintaining security, and fulfilling legal obligations. These providers are contractually required to use your information only as directed by us and in accordance with applicable law.")), React.createElement(LegalSubSection, {
    id: "pp-5-3",
    title: "5.3 Legal and Regulatory Disclosures"
  }, React.createElement(LegalP, null, "We may disclose information when required by law, regulation, court order, or government request, or when we believe in good faith that disclosure is necessary to protect our legal rights, prevent fraud, or protect the safety of any person.")), React.createElement(LegalSubSection, {
    id: "pp-5-4",
    title: "5.4 Business Transfers"
  }, React.createElement(LegalP, null, "If Delt Pay undergoes a merger, acquisition, sale of assets, or similar corporate transaction, your information may be transferred as part of that transaction. We will notify you of any such change as required by applicable law.")), React.createElement(LegalSubSection, {
    id: "pp-5-5",
    title: "5.5 With Your Consent"
  }, React.createElement(LegalP, null, "We may share your information for other purposes with your explicit consent."))), React.createElement(LegalSection, {
    id: "pp-6",
    eyebrow: "06 \xB7 Security",
    title: "Data Security"
  }, React.createElement(LegalP, null, "We implement administrative, technical, and physical safeguards designed to protect your information from unauthorized access, disclosure, alteration, or destruction. These measures include:"), React.createElement(LegalList, {
    items: ['Industry-standard encryption for data in transit and at rest.', 'Access controls limiting data access to personnel with a legitimate business need.', 'Regular monitoring of our systems for unauthorized access or anomalies.', 'Timely patching of known security vulnerabilities.', 'Incident response procedures to address security events promptly.']
  }), React.createElement(LegalP, null, "We comply with the Safeguards Rule under the Gramm-Leach-Bliley Act (\"GLBA\"), which requires us to maintain a comprehensive information security program. While we work hard to protect your information, no system is completely secure. If you believe your information has been compromised, please contact us immediately at ", React.createElement(LegalLink, {
    href: "mailto:privacy@delt.com"
  }, "privacy@delt.com"), ".")), React.createElement(LegalSection, {
    id: "pp-7",
    eyebrow: "07 \xB7 Retention",
    title: "Data Retention"
  }, React.createElement(LegalP, null, "We retain your information for as long as necessary to fulfill the purposes described in this Policy, to maintain your account, and to comply with our legal, regulatory, and contractual obligations."), React.createElement(LegalP, null, "For lending and credit-related records, we retain data for a minimum of seven (7) years following account closure or the end of our business relationship, consistent with requirements under ECOA, GLBA, FCRA, and applicable tax laws."), React.createElement(LegalP, null, "For biometric data, Delt Pay does not directly store biometric information. Biometric data processed through Plaid's Identity Verification service is retained by Plaid for no longer than three (3) years, unless otherwise required by law or by our instructions as a customer. Please see Plaid's Biometric Policy for details."), React.createElement(LegalP, null, "After the applicable retention period, we will securely delete or anonymize your information. If you request deletion of your data, we will honor that request to the extent permitted by law \u2014 certain records may be required to be retained regardless of such a request.")), React.createElement(LegalSection, {
    id: "pp-8",
    eyebrow: "08 \xB7 Rights",
    title: "Your Rights and Choices"
  }, React.createElement(LegalP, null, "Even though our services are directed to businesses, individual representatives who interact with our platform have certain rights with respect to their personal information:"), React.createElement(LegalList, {
    items: [React.createElement(React.Fragment, null, React.createElement("b", null, "Access:"), " You may request a copy of the personal information we hold about you."), React.createElement(React.Fragment, null, React.createElement("b", null, "Correction:"), " You may request that we correct inaccurate or incomplete information."), React.createElement(React.Fragment, null, React.createElement("b", null, "Deletion:"), " You may request deletion of your personal information, subject to our legal retention obligations."), React.createElement(React.Fragment, null, React.createElement("b", null, "Opt-out of non-essential communications:"), " You may opt out of marketing communications at any time by following the unsubscribe instructions in any email or by contacting us directly.")]
  }), React.createElement(LegalCallout, {
    eyebrow: "Your Rights Under the FCRA"
  }, "If Delt Pay has obtained a consumer report about you through Plaid CRA, you have specific rights under the Fair Credit Reporting Act, including the right to access the information in your consumer file, dispute inaccurate or incomplete information and request reinvestigation, be notified if information in your consumer report has been used against you in a credit decision, and request that your information not be used for prescreened offers of credit."), React.createElement(LegalP, null, "To exercise your FCRA rights with Plaid CRA, you may visit ", React.createElement(LegalLink, {
    href: "https://plaid.com/check/consumer-service-center/",
    external: true
  }, "Plaid CRA's Consumer Service Center"), " or contact Plaid CRA at 844-204-5860."), React.createElement(LegalP, null, "To exercise any rights with Delt Pay, please contact us at ", React.createElement(LegalLink, {
    href: "mailto:privacy@delt.com"
  }, "privacy@delt.com"), ". We will respond within a reasonable time and in accordance with applicable law. We may require you to verify your identity before fulfilling a request.")), React.createElement(LegalSection, {
    id: "pp-9",
    eyebrow: "09 \xB7 Plaid",
    title: "Plaid's Role and Your Rights with Plaid"
  }, React.createElement(LegalP, null, "When you connect your financial accounts or undergo identity verification using Plaid, Plaid collects and processes your data as described in Plaid's End User Privacy Policy (", React.createElement(LegalLink, {
    href: "https://plaid.com/legal",
    external: true
  }, "plaid.com/legal"), "). You have rights with respect to Plaid's processing of your data directly with Plaid, including the ability to manage and revoke data connections through the Plaid Portal at ", React.createElement(LegalLink, {
    href: "https://my.plaid.com",
    external: true
  }, "my.plaid.com"), "."), React.createElement(LegalP, null, "Disconnecting your accounts through Plaid's Portal will terminate Plaid's ongoing access to your financial data, but will not affect information already transmitted to and retained by Delt Pay in connection with your application or account.")), React.createElement(LegalSection, {
    id: "pp-10",
    eyebrow: "10 \xB7 GLBA",
    title: "GLBA Privacy Notice"
  }, React.createElement(LegalP, null, "As a financial services company, Delt Pay is subject to the Gramm-Leach-Bliley Act (\"GLBA\"). Under GLBA, we are required to inform you about our information-sharing practices. As stated in this Policy:"), React.createElement(LegalList, {
    items: ['We do not share your nonpublic personal information with non-affiliated third parties for marketing purposes.', 'We share nonpublic personal information only as permitted under GLBA, including with service providers who help us operate our business and as required by law.']
  }), React.createElement(LegalP, null, "You do not need to take any action to limit our sharing, as we already limit sharing to what is described in this Policy. If you have questions about our GLBA practices, contact us at ", React.createElement(LegalLink, {
    href: "mailto:privacy@delt.com"
  }, "privacy@delt.com"), ".")), React.createElement(LegalSection, {
    id: "pp-11",
    eyebrow: "11 \xB7 FCRA",
    title: "FCRA Compliance Notice"
  }, React.createElement(LegalP, null, "When Delt Pay obtains a consumer report about you from Plaid CRA or any other consumer reporting agency, we do so for permissible purposes under the Fair Credit Reporting Act (\"FCRA\"), including evaluating your application for a merchant cash advance or other financing product. We will provide you with any required adverse action notices if a credit decision is based in whole or in part on information contained in a consumer report. You have the right to obtain a free copy of any consumer report used in connection with an adverse action, and to dispute the accuracy or completeness of any information in that report.")), React.createElement(LegalSection, {
    id: "pp-12",
    eyebrow: "12 \xB7 California",
    title: "California Privacy Notice"
  }, React.createElement(LegalP, null, "If you are a California resident, you may have additional rights under the California Consumer Privacy Act (\"CCPA\"), as amended by the California Privacy Rights Act (\"CPRA\"). However, please note that the CCPA provides exemptions for personal information collected, processed, sold, or disclosed pursuant to the Gramm-Leach-Bliley Act and for activities subject to the Fair Credit Reporting Act. To the extent these exemptions apply to your data, CCPA requirements may not apply. Regardless of applicable exemptions, we are committed to transparency about our data practices as described throughout this Policy. If you have questions about your California privacy rights, please contact us at ", React.createElement(LegalLink, {
    href: "mailto:privacy@delt.com"
  }, "privacy@delt.com"), ".")), React.createElement(LegalSection, {
    id: "pp-13",
    eyebrow: "13 \xB7 Cookies",
    title: "Cookie Policy"
  }, React.createElement(LegalP, null, "When you visit the Delt Pay website or platform, we and our third-party partners use cookies and similar tracking technologies to collect information about your browsing activity."), React.createElement(LegalSubSection, {
    title: "What are cookies"
  }, React.createElement(LegalP, null, "Cookies are small data files stored on your browser or device. They may be session cookies (which expire when you close your browser) or persistent cookies (which remain until they expire or you delete them).")), React.createElement(LegalSubSection, {
    title: "Types of cookies we use"
  }, React.createElement(LegalList, {
    items: [React.createElement(React.Fragment, null, React.createElement("b", null, "Strictly necessary cookies:"), " Required for our platform to function properly. These enable core features such as security, authentication, and session management."), React.createElement(React.Fragment, null, React.createElement("b", null, "Analytics and performance cookies:"), " We use third-party analytics services, including Google Analytics, to understand how visitors interact with our website and to improve our platform. These cookies collect information such as pages visited, time spent on pages, and traffic sources."), React.createElement(React.Fragment, null, React.createElement("b", null, "Functional cookies:"), " These enable enhanced functionality and personalization, such as remembering your preferences and settings.")]
  }), React.createElement(LegalP, null, "We do not use advertising or targeting cookies.")), React.createElement(LegalSubSection, {
    title: "Google Analytics"
  }, React.createElement(LegalP, null, "We use Google Analytics to collect anonymized usage data about our website visitors. Google Analytics uses cookies to collect information such as how often users visit our site, what pages they view, and what other sites they visited before coming to ours. Google's ability to use and share information collected by Google Analytics is restricted by the Google Analytics Terms of Service and the Google Privacy Policy. You can opt out of Google Analytics by installing Google's opt-out browser add-on, available at ", React.createElement(LegalLink, {
    href: "https://tools.google.com/dlpage/gaoptout",
    external: true
  }, "tools.google.com/dlpage/gaoptout"), ".")), React.createElement(LegalSubSection, {
    title: "Your choices"
  }, React.createElement(LegalP, null, "Most web browsers allow you to manage cookie preferences through browser settings. You can set your browser to refuse cookies or alert you when cookies are being sent. Please note that disabling cookies may affect the functionality of our platform.")), React.createElement(LegalSubSection, {
    title: "Google reCAPTCHA"
  }, React.createElement(LegalP, null, "When you interact with our platform through Plaid, Google reCAPTCHA may be used to help detect fraud and abuse. Google reCAPTCHA processes certain data, including your IP address and browsing behavior. When reCAPTCHA is used, Google's Privacy Policy and Terms of Use apply."))), React.createElement(LegalSection, {
    id: "pp-14",
    eyebrow: "14 \xB7 Adverse Action",
    title: "Adverse Action Notices"
  }, React.createElement(LegalP, null, "If we take an adverse action regarding your financing application (such as denying your application, offering less favorable terms, or reducing a credit limit) based in whole or in part on information obtained from a consumer report or other third-party source, we will provide you with a notice that includes:"), React.createElement(LegalList, {
    items: ['The name, address, and phone number of the consumer reporting agency that provided the report.', 'A statement that the consumer reporting agency did not make the adverse decision and cannot explain the reasons for it.', 'Your right to obtain a free copy of your consumer report from the reporting agency within 60 days.', 'Your right to dispute the accuracy or completeness of information in the report.']
  })), React.createElement(LegalSection, {
    id: "pp-15",
    eyebrow: "15 \xB7 Changes",
    title: "Changes to This Policy"
  }, React.createElement(LegalP, null, "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the Effective Date at the top of this Policy and notify you through the platform or by email where required. We encourage you to review this Policy periodically.")), React.createElement(LegalSection, {
    id: "pp-16",
    eyebrow: "16 \xB7 Contact",
    title: "Contact Us"
  }, React.createElement(LegalP, null, "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:"), React.createElement(LegalCallout, {
    eyebrow: "Delt Pay LLC \xB7 Attn: Privacy"
  }, "1603 Capitol Ave Ste 415 #644712", React.createElement("br", null), "Cheyenne, Wyoming 82001 USA", React.createElement("br", null), "Email: ", React.createElement(LegalLink, {
    href: "mailto:privacy@delt.com"
  }, "privacy@delt.com")), React.createElement(LegalP, {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "We take privacy concerns seriously and will respond to your inquiry as promptly as possible.")));
}
const ECA_TOC = [{
  id: 'eca-1',
  label: 'Scope of Communications'
}, {
  id: 'eca-2',
  label: 'Method of Providing'
}, {
  id: 'eca-3',
  label: 'How to Withdraw Consent'
}, {
  id: 'eca-4',
  label: 'Updating Contact Info'
}, {
  id: 'eca-5',
  label: 'Hardware & Software'
}];
function V1ElectronicCommunications({
  onBack
}) {
  return React.createElement(V1LegalLayout, {
    eyebrow: "Communications",
    title: "Electronic Communications Agreement.",
    effective: "Feb 19, 2026",
    toc: ECA_TOC,
    onBack: onBack
  }, React.createElement(LegalSection, {
    id: "eca-1",
    eyebrow: "01 \xB7 Scope",
    title: "Scope of Communications to Be Provided in Electronic Form"
  }, React.createElement(LegalP, null, "You agree that we may provide you with any communications that we may be required to send to you by law or regulation in electronic format. These communications include, but are not limited to:"), React.createElement(LegalList, {
    items: ['Terms and conditions and policies you agree to (e.g., the Delt Capital Terms of Use and Privacy Policy), including updates to these agreements or policies;', 'Disclosures and notices associated with your account;', 'Transaction receipts or confirmations;', 'Customer service communications; and', 'Any other communications related to your use of Delt Capital services.']
  })), React.createElement(LegalSection, {
    id: "eca-2",
    eyebrow: "02 \xB7 Method",
    title: "Method of Providing Communications"
  }, React.createElement(LegalP, null, "We may provide communications to you by email or by posting them on the Delt Capital website or mobile application. All communications in either electronic or paper format will be considered to be \"in writing.\"")), React.createElement(LegalSection, {
    id: "eca-3",
    eyebrow: "03 \xB7 Withdrawal",
    title: "How to Withdraw Consent"
  }, React.createElement(LegalP, null, "You may withdraw your consent to receive communications electronically by contacting us in writing. If you withdraw your consent, we reserve the right to close your account or charge you additional fees for paper copies."), React.createElement(LegalCallout, {
    eyebrow: "To withdraw consent"
  }, "Email ", React.createElement(LegalLink, {
    href: "mailto:privacy@delt.com"
  }, "privacy@delt.com"), " with the subject line ", React.createElement("b", null, "\"Electronic Communications \u2014 Withdraw Consent\""), " and include the business name and EIN on file. We will confirm receipt within five (5) business days and process the request within a reasonable time.")), React.createElement(LegalSection, {
    id: "eca-4",
    eyebrow: "04 \xB7 Contact",
    title: "Updating Your Contact Information"
  }, React.createElement(LegalP, null, "It is your responsibility to keep your primary email address up to date so that Delt Capital can communicate with you electronically. You understand and agree that if Delt Capital sends you an electronic communication but you do not receive it because your primary email address on file is incorrect, out of date, blocked by your service provider, or you are otherwise unable to receive electronic communications, Delt Capital will be deemed to have provided the communication to you.")), React.createElement(LegalSection, {
    id: "eca-5",
    eyebrow: "05 \xB7 Requirements",
    title: "Hardware and Software Requirements"
  }, React.createElement(LegalP, null, "In order to access and retain electronic communications, you will need a computer or mobile device with an internet connection, a valid email address, and software that allows you to view and save PDF files."), React.createElement(LegalList, {
    items: [React.createElement(React.Fragment, null, "A current version of a major web browser (Chrome, Safari, Firefox, or Edge \u2014 last two releases)."), React.createElement(React.Fragment, null, "A valid email address you can check regularly, and a mail client that accepts inbound HTML email from ", React.createElement("b", null, "@delt.com"), "."), React.createElement(React.Fragment, null, "A PDF reader that supports PDF 1.7 or later (e.g., Adobe Reader, Apple Preview, or the built-in viewer in most modern browsers)."), React.createElement(React.Fragment, null, "Local storage sufficient to download and retain documents you wish to keep (account disclosures, offer letters, year-end statements).")]
  }), React.createElement(LegalP, null, "If you are unable to meet any of the requirements above, do not consent to receive electronic communications and contact us for an alternative delivery method.")));
}
Object.assign(window, {
  V1TermsOfUse,
  V1PrivacyPolicy,
  V1ElectronicCommunications
});