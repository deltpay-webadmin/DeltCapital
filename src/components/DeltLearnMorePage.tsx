import { useState, useEffect, useRef } from 'react';
import {
  Zap, Shield, Check, Star, ClipboardList, RefreshCw, Rocket,
  CreditCard, BarChart3, DollarSign, Monitor, Globe, Headphones,
  ArrowRight, Lock,
} from 'lucide-react';
import { Footer } from './Footer';

// ── Delt brand tokens ──
const C = {
  navy: '#172b4d',
  navyMid: '#0A2D5E',
  purple: '#0c66e4',
  purpleLight: '#7C6BF0',
  purpleDim: 'rgba(73,69,255,0.07)',
  purpleGlow: 'rgba(73,69,255,0.25)',
  blue: '#3B5BF7',
  green: '#22C55E',
  white: '#FFFFFF',
  offWhite: '#f1f2f4',
  gray100: '#F1F3F8',
  gray200: '#e8eaf0',
  gray400: '#94A3B8',
  gray600: '#64748B',
  text: '#172b4d',
  textSub: '#64748B',
};

// ── Scroll-triggered reveal ──
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

function Section({ children, bg = C.white, id, style = {} }: { children: React.ReactNode; bg?: string; id?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ background: bg, padding: '80px 24px', ...style }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

function Label({ children, color = C.purple }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 2.5,
      textTransform: 'uppercase', color, marginBottom: 14,
    }}>{children}</div>
  );
}

function CTAButton({ children, onClick, secondary = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: secondary ? '14px 32px' : '16px 40px',
        borderRadius: 50,
        background: secondary ? 'transparent' : `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
        border: secondary ? `2px solid ${C.gray200}` : 'none',
        color: secondary ? C.text : C.white,
        fontSize: secondary ? 14 : 16, fontWeight: 700,
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && !secondary ? `0 8px 30px ${C.purpleGlow}` : 'none',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
      }}
    >
      {children}
      <ArrowRight className="w-4 h-4" style={{ transition: 'transform 0.2s', transform: hovered ? 'translateX(3px)' : 'none' }} />
    </button>
  );
}

function Stat({ value, label, color = C.purple }: { value: string; label: string; color?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 38, fontWeight: 800, color, lineHeight: 1, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 13, color: C.gray600, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: 220,
        padding: '28px 24px', borderRadius: 16,
        background: hovered ? C.white : C.offWhite,
        border: `1px solid ${hovered ? C.purple + '33' : C.gray200}`,
        boxShadow: hovered ? '0 8px 30px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease', cursor: 'default',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: C.purpleDim,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, color: C.purple,
      }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: 1.5, marginBottom: 6 }}>
        STEP {number}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>{title}</div>
      <div style={{ fontSize: 14, color: C.gray600, lineHeight: 1.55 }}>{description}</div>
    </div>
  );
}

function FeatureRow({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 28 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: C.purpleDim, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.purple,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, color: C.gray600, lineHeight: 1.55 }}>{description}</div>
      </div>
    </div>
  );
}

interface DeltLearnMorePageProps {
  onApplyClick?: () => void;
  onAboutClick?: () => void;
  onHowItWorksClick?: () => void;
  onReviewsClick?: () => void;
  onBlogClick?: () => void;
  onFAQClick?: () => void;
  onSupportClick?: () => void;
  onWinsClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDisclosuresClick?: () => void;
  onResourcesClick?: () => void;
  calculatorData?: {
    monthlyRevenue?: string;
    timeInBusiness?: string;
    creditCardProcessing?: string;
    requestedAmount?: string;
    acceptsCreditCards?: boolean | null;
    deltProcessing?: boolean;
  };
}

export function DeltLearnMorePage({ onApplyClick, onAboutClick, onHowItWorksClick, onReviewsClick, onBlogClick, onFAQClick, onSupportClick, onWinsClick, onPrivacyClick, onTermsClick, onDisclosuresClick, onResourcesClick, calculatorData }: DeltLearnMorePageProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  // Calculate dynamic "Without Delt" and "With Delt" values
  const monthlyRevenue = calculatorData?.monthlyRevenue ? parseInt(calculatorData.monthlyRevenue.replace(/[^0-9]/g, '')) : 100000;
  
  // Map timeInBusiness string back to multiplier
  const timeInBusinessStr = calculatorData?.timeInBusiness || '2-5 years';
  let multiplier = { low: 0.60, high: 0.67 }; // default to 2yr+
  
  if (timeInBusinessStr.includes('Less than 6 months')) {
    multiplier = { low: 0.50, high: 0.56 }; // redirect case, but use 6-12mo multiplier
  } else if (timeInBusinessStr.includes('6-12 months')) {
    multiplier = { low: 0.50, high: 0.56 };
  } else if (timeInBusinessStr.includes('1-2 years')) {
    multiplier = { low: 0.56, high: 0.62 };
  } else if (timeInBusinessStr.includes('2-5 years') || timeInBusinessStr.includes('2+')) {
    multiplier = { low: 0.60, high: 0.67 };
  }
  
  // Calculate base funding (same as calculator baseLow/baseHigh)
  let baseLow = monthlyRevenue * multiplier.low;
  let baseHigh = monthlyRevenue * multiplier.high;
  
  // Calculate WITHOUT DELT (preBoostLow/preBoostHigh from calculator)
  let withoutDeltLow = Math.round(baseLow / 1000) * 1000;
  let withoutDeltHigh = Math.round(baseHigh / 1000) * 1000;
  withoutDeltLow = Math.min(250000, Math.max(5000, withoutDeltLow));
  withoutDeltHigh = Math.min(250000, Math.max(withoutDeltLow + 2000, withoutDeltHigh));
  
  // Calculate WITH DELT (apply 1.75x boost to base values, then round and cap)
  let withDeltLow = baseLow * 1.75;
  let withDeltHigh = baseHigh * 1.75;
  withDeltLow = Math.round(withDeltLow / 1000) * 1000;
  withDeltHigh = Math.round(withDeltHigh / 1000) * 1000;
  withDeltLow = Math.min(500000, Math.max(5000, withDeltLow));
  withDeltHigh = Math.min(500000, Math.max(withDeltLow + 2000, withDeltHigh));
  
  // Format for display
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${Math.round(value / 1000)}K`;
    }
    return `$${value}`;
  };
  
  const withoutDeltDisplay = `${formatCurrency(withoutDeltLow)} - ${formatCurrency(withoutDeltHigh)}`;
  const withDeltDisplay = `${formatCurrency(withDeltLow)} - ${formatCurrency(withDeltHigh)}`;

  return (
    <div style={{ color: C.text, overflowX: 'hidden' }}>

      {/* ═══════ HERO — full viewport, sticky wall ═══════ */}
      <section style={{
        background: C.navy,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 0,
        padding: '80px 24px 60px',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: 720, position: 'relative',
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 50,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            marginBottom: 28,
          }}>
            <Zap className="w-3.5 h-3.5" style={{ color: C.purpleLight }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.purpleLight, letterSpacing: 0.5 }}>
              You just unlocked up to 2x more capital
            </span>
          </div>

          <h1 style={{
            fontSize: 44, fontWeight: 800, color: C.white,
            lineHeight: 1.15, letterSpacing: -1.2,
            margin: '0 0 18px',
          }}>
            One switch. More capital.<br />
            <span style={{ color: C.purpleLight }}>Better everything.</span>
          </h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.6, maxWidth: 540, margin: '0 auto 36px',
          }}>
            When you process payments with Delt, your transaction data becomes your
            strongest asset. We see your real revenue — so we can offer you more capital,
            faster, at better rates.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <CTAButton onClick={onApplyClick}>Get My Delt Offer</CTAButton>
            <CTAButton secondary onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>See how it works</span>
            </CTAButton>
          </div>
        </div>

        {/* Before / After strip */}
        <div style={{
          maxWidth: 520, margin: '50px auto 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
          opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease 0.3s',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, marginBottom: 6 }}>WITHOUT DELT</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: -0.5 }}>{withoutDeltDisplay}</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 20,
            background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.white, flexShrink: 0,
          }}>
            <ArrowRight className="w-5 h-5" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.purpleLight, letterSpacing: 1.5, marginBottom: 6 }}>WITH DELT</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: -0.5 }}>{withDeltDisplay}</div>
          </div>
        </div>
      </section>

      {/* ═══════ SCROLLING CONTENT — rises over the hero ═══════ */}
      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ═══════ TRUST STRIP ═══════ */}
      <Section bg={C.offWhite} style={{ padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            { icon: <Lock className="w-4 h-4" />, text: 'Bank-grade security' },
            { icon: <Zap className="w-4 h-4" />, text: 'No cancellation fees' },
            { icon: <Check className="w-4 h-4" />, text: 'Hassle-free switch' },
            { icon: <Star className="w-4 h-4" />, text: '0% on your first $5K' },
          ].map(t => (
            <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: C.purple }}>{t.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.gray600 }}>{t.text}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════ WHY SWITCH ═══════ */}
      <Section>
        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 360px' }}>
            <Reveal>
              <Label>WHY SWITCH</Label>
              <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, margin: '0 0 18px', letterSpacing: -0.5 }}>
                Your processor doesn't know<br />what you're worth. We do.
              </h2>
              <p style={{ fontSize: 15, color: C.gray600, lineHeight: 1.65, marginBottom: 28 }}>
                Traditional lenders look at your credit score and bank statements from six months ago.
                Delt sees your revenue in real time — every transaction, every trend, every growth signal.
                That's why we can offer up to 2x more capital than what you'd qualify for elsewhere.
              </p>
              <p style={{ fontSize: 15, color: C.gray600, lineHeight: 1.65 }}>
                Processing with Delt isn't just about accepting payments. It's about turning
                every swipe into proof of what your business can do — and getting the capital
                to match.
              </p>
            </Reveal>
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <Reveal delay={150}>
              <div style={{
                background: C.offWhite, borderRadius: 20, padding: 32,
                border: `1px solid ${C.gray200}`,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <Stat value="2x" label="More capital with Delt processing" />
                  <div style={{ height: 1, background: C.gray200 }} />
                  <Stat value="24hr" label="Funding decisions, not weeks" color={C.green} />
                  <div style={{ height: 1, background: C.gray200 }} />
                  <Stat value="$0" label="Fees to switch processors" color={C.text} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ═══════ HOW SWITCHING WORKS ═══════ */}
      <Section bg={C.offWhite} id="how-it-works">
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Label>HOW IT WORKS</Label>
            <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, margin: '0 0 12px', letterSpacing: -0.5 }}>
              Three steps. No interruptions.
            </h2>
            <p style={{ fontSize: 15, color: C.gray600, maxWidth: 480, margin: '0 auto', lineHeight: 1.55 }}>
              We handle the entire switch behind the scenes. Your customers never notice a thing.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            {
              number: '1', icon: <ClipboardList className="w-5 h-5" />, title: 'Apply in 2 minutes',
              description: 'Fill out one application for both capital and processing. No separate forms, no redundant paperwork. We already have your revenue details from the calculator.',
            },
            {
              number: '2', icon: <RefreshCw className="w-5 h-5" />, title: 'We handle the switch',
              description: 'Our team migrates your processing — terminals, integrations, everything. No downtime. No missed transactions. Your current processor is canceled only after Delt is live.',
            },
            {
              number: '3', icon: <Rocket className="w-5 h-5" />, title: 'Funding + processing go live',
              description: 'Capital hits your account within 24 hours. Processing goes live in 3-5 business days. From day one, every transaction builds your Delt profile for better terms on your next round.',
            },
          ].map((s, i) => (
            <Reveal key={s.number} delay={i * 120} style={{ flex: '1 1 260px', display: 'flex' }}>
              <StepCard {...s} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════ WHAT YOU GET ═══════ */}
      <Section>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Label>WHAT YOU GET</Label>
            <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, margin: '0 0 12px', letterSpacing: -0.5 }}>
              Processing is just the beginning.
            </h2>
            <p style={{ fontSize: 15, color: C.gray600, maxWidth: 500, margin: '0 auto', lineHeight: 1.55 }}>
              Every Delt merchant gets the full platform — not just a card reader.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 380px' }}>
            <Reveal delay={0}>
              <FeatureRow icon={<CreditCard className="w-5 h-5" />} title="Interchange-plus pricing"
                description="See exactly what you're paying on every transaction. No bundled rates, no hidden markups. Plus 0% processing on your first $5,000." />
            </Reveal>
            <Reveal delay={80}>
              <FeatureRow icon={<BarChart3 className="w-5 h-5" />} title="Lens AI — real-time business intelligence"
                description="Your transaction data powers AI insights you can't get anywhere else. Revenue trends, cash flow forecasting, and capital readiness scores — all from your daily processing." />
            </Reveal>
            <Reveal delay={160}>
              <FeatureRow icon={<DollarSign className="w-5 h-5" />} title="Priority capital access"
                description="Delt merchants qualify for up to 2x more capital with faster decisions. Your processing history is your credit file — the longer you process, the better your offers get." />
            </Reveal>
          </div>
          <div style={{ flex: '1 1 380px' }}>
            <Reveal delay={60}>
              <FeatureRow icon={<Monitor className="w-5 h-5" />} title="One dashboard for everything"
                description="Transactions, settlements, capital, repayments, insights — all in one place. No toggling between your processor, your lender, and your bank." />
            </Reveal>
            <Reveal delay={140}>
              <FeatureRow icon={<Globe className="w-5 h-5" />} title="Professional website included"
                description="Every Delt merchant gets a professional business website powered by your Delt account. Accept payments online from day one." />
            </Reveal>
            <Reveal delay={220}>
              <FeatureRow icon={<Headphones className="w-5 h-5" />} title="Dedicated support"
                description="Real people, not chatbots. Your dedicated account manager handles onboarding, terminal setup, and anything else you need to go live." />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ═══════ THE MATH ═══════ */}
      <Section bg={C.navy} style={{ textAlign: 'center' }}>
        <Reveal>
          <Label color={C.purpleLight}>THE MATH</Label>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, lineHeight: 1.2, margin: '0 0 16px', letterSpacing: -0.5 }}>
            It pays for itself.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Even if your processing rate is a few basis points higher, the capital benefit
            more than makes up the difference.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div style={{
            display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap',
            maxWidth: 700, margin: '0 auto',
          }}>
            {[
              { label: 'Extra capital from\nprocessing with Delt', value: '+$10K-$21K', color: C.green },
              { label: 'Rate difference on\n$20K monthly volume', value: '~$30/mo', color: 'rgba(255,255,255,0.4)' },
            ].map((item, i) => (
              <div key={i} style={{
                flex: '1 1 260px', padding: '28px 24px', borderRadius: 16,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: item.color, letterSpacing: -1 }}>{item.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 8, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.35)',
            marginTop: 28, fontStyle: 'italic',
          }}>
            Based on $25K monthly revenue, 1-2 years in business, $20K monthly card sales.
            Your actual numbers may vary.
          </p>
        </Reveal>
      </Section>

      {/* ═══════ FAQ ═══════ */}
      <Section>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Label>COMMON QUESTIONS</Label>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Before you switch</h2>
          </div>
        </Reveal>

        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {[
            {
              q: 'Will there be any downtime when I switch?',
              a: 'No. We set up your Delt processing first, test it, and only then transition your transactions. Your old processor isn\'t canceled until Delt is fully live. Zero missed sales.',
            },
            {
              q: 'What about my existing terminals and equipment?',
              a: 'We\'ll provide new Delt terminals at no cost. If your current terminals are compatible, we can reprogram them. Either way, we handle it.',
            },
            {
              q: 'Is there a contract or cancellation fee?',
              a: 'No long-term contracts. No cancellation fees. We keep merchants because the platform is worth it, not because of a contract.',
            },
            {
              q: 'How does processing with Delt get me more capital?',
              a: 'When we process your payments, we see your real-time revenue — not bank statements from months ago. That data lets us underwrite with confidence and offer significantly more capital at better rates. The longer you process, the better your profile gets.',
            },
            {
              q: 'What if I don\'t currently accept credit cards?',
              a: 'Even better. We\'ll set you up from scratch — terminals, online payments, the works. And you\'ll start building your Delt processing history immediately, which means capital access as soon as you hit 6 months.',
            },
          ].map((faq, i) => (
            <Reveal key={i} delay={i * 60}>
              <div style={{
                padding: '20px 0',
                borderBottom: `1px solid ${C.gray200}`,
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: C.gray600, lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════ FINAL CTA ═══════ */}
      <Section bg={C.offWhite} style={{ textAlign: 'center', padding: '80px 24px 100px' }}>
        <Reveal>
          <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, margin: '0 0 16px', letterSpacing: -0.8 }}>
            Ready to see what you qualify for?
          </h2>
          <p style={{ fontSize: 16, color: C.gray600, maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.55 }}>
            One application. Capital and processing together.<br />
            No impact to your credit. Takes 2 minutes.
          </p>
          <CTAButton onClick={onApplyClick}>Get My Delt Offer</CTAButton>
          <div style={{ marginTop: 20 }}>
            <span style={{ fontSize: 13, color: C.gray400 }}>
              Or call us at{' '}
              <a href="tel:+18001234567" style={{ color: C.purple, textDecoration: 'none', fontWeight: 600 }}>
                (800) 123-4567
              </a>
            </span>
          </div>
        </Reveal>
      </Section>

      </div>
      <Footer
        onAboutClick={onAboutClick || (() => {})}
        onHowItWorksClick={onHowItWorksClick || (() => {})}
        onReviewsClick={onReviewsClick || (() => {})}
        onBlogClick={onBlogClick || (() => {})}
        onFAQClick={onFAQClick || (() => {})}
        onSupportClick={onSupportClick || (() => {})}
        onWinsClick={onWinsClick || (() => {})}
        onApplyClick={onApplyClick || (() => {})}
        onPrivacyClick={onPrivacyClick}
        onTermsClick={onTermsClick}
        onDisclosuresClick={onDisclosuresClick}
        onResourcesClick={onResourcesClick}
      />
    </div>
  );
}