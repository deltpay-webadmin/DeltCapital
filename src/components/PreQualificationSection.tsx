import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { X } from 'lucide-react';
import { PreQualificationGame } from './PreQualificationGame';
import { motion } from 'motion/react';

interface PreQualificationSectionProps {
  onApplyClick?: () => void;
  onApplyFromQuiz?: (data?: any) => void;
  onCalculatorClick?: () => void;
}

export interface PreQualificationSectionRef {
  openQuiz: () => void;
  scrollToSection: () => void;
}

export const PreQualificationSection = forwardRef<
  PreQualificationSectionRef,
  PreQualificationSectionProps
>(({ onApplyClick, onApplyFromQuiz, onCalculatorClick }, ref) => {
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    openQuiz: () => setShowModal(true),
    scrollToSection: () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
  }));

  useEffect(() => {
    if (showModal || showResults) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal, showResults]);

  const handleShowResults = (data?: any) => {
    setQuizData(data);
    setShowModal(false);
    setShowResults(true);
  };

  const handleStartApplication = () => {
    setShowResults(false);
    if (onApplyFromQuiz) onApplyFromQuiz(quizData);
    else if (onApplyClick) onApplyClick();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setShowModal(false);
  };

  const CHECKS = [
    'Soft credit pull — no FICO hit',
    '3 questions, no documents',
    'Range delivered in 60 seconds',
  ];

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          background: 'var(--paper)',
          padding: '120px 0',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
              gap: 56,
              alignItems: 'center',
            }}
          >
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Eyebrow>Prequalify · 60 seconds</Eyebrow>
              <h2
                style={{
                  marginTop: 18,
                  marginBottom: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.25rem, 4.8vw, 3.75rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.03,
                  color: '#0F0E17',
                }}
              >
                Get a funding range
                <br />
                before you ever
                <br />
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: '#4F46E5',
                  }}
                >
                  fill out a form.
                </span>
              </h2>
              <p
                style={{
                  marginTop: 20,
                  marginBottom: 0,
                  maxWidth: 520,
                  fontFamily: 'var(--font-body)',
                  fontSize: 16.5,
                  lineHeight: 1.6,
                  color: 'var(--ink-soft)',
                }}
              >
                Three questions, soft-pull only, no bank upload. You&rsquo;ll see a low / high range and a factor rate — and you decide whether that&rsquo;s worth a full application.
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  margin: '28px 0 0',
                  padding: 0,
                }}
              >
                {CHECKS.map((c) => (
                  <li
                    key={c}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 0',
                      borderBottom: '1px solid var(--line)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 14.5,
                      color: 'var(--ink-soft)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                      <path
                        d="M3.5 8.2L6.4 11 12 5"
                        stroke="#4F46E5"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>

              <div
                className="flex flex-wrap items-center gap-3"
                style={{ marginTop: 32 }}
              >
                <button
                  onClick={() => setShowModal(true)}
                  className="transition-transform"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#0F0E17',
                    color: '#FFFFFF',
                    border: '1px solid #0F0E17',
                    borderRadius: 8,
                    padding: '12px 20px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Start prequal
                  <span aria-hidden>→</span>
                </button>
                <button
                  onClick={onCalculatorClick}
                  style={{
                    background: 'transparent',
                    color: '#0F0E17',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: '12px 18px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Run the full calculator
                </button>
              </div>
            </motion.div>

            {/* Right — prequal card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--line)',
                borderRadius: 20,
                padding: '32px',
                boxShadow:
                  '0 1px 2px rgba(15,14,23,0.03), 0 40px 80px -50px rgba(15,14,23,0.2)',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 22 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10.5,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                    fontWeight: 600,
                  }}
                >
                  Sample estimate
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10.5,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#0F7A5A',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: '#0F7A5A',
                    }}
                  />
                  Live
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  fontWeight: 600,
                }}
              >
                Funding range
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.04em',
                  color: '#0F0E17',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <span style={{ fontSize: 48, fontWeight: 700 }}>$72K</span>
                <span style={{ fontSize: 20, color: 'var(--ink-mute)' }}>—</span>
                <span style={{ fontSize: 48, fontWeight: 700 }}>$108K</span>
              </div>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  marginTop: 28,
                }}
              >
                {[
                  { l: 'Factor', v: '1.18×' },
                  { l: 'Term', v: '6 mo' },
                  { l: 'Weekly debit', v: '$4.2K' },
                ].map((k) => (
                  <div
                    key={k.l}
                    style={{
                      padding: '14px',
                      border: '1px solid var(--line)',
                      borderRadius: 12,
                      background: 'var(--paper-warm)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-mute)',
                        fontWeight: 600,
                      }}
                    >
                      {k.l}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontFamily: 'var(--font-display)',
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#0F0E17',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {k.v}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress / scan bar */}
              <div
                style={{
                  marginTop: 28,
                  height: 4,
                  background: 'var(--line-soft)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.span
                  aria-hidden
                  initial={{ x: '-30%' }}
                  animate={{ x: '120%' }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '30%',
                    background: 'linear-gradient(90deg, transparent, #4F46E5, transparent)',
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: 'var(--font-body)',
                  fontSize: 12.5,
                  color: 'var(--ink-mute)',
                  fontStyle: 'italic',
                }}
              >
                Illustrative range based on $50K/mo revenue, 2+ years in business.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quiz Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={handleBackdropClick}
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="w-full max-w-4xl mb-16 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white hover:bg-gray-100 rounded-full shadow-2xl flex items-center justify-center z-10 transition-all hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <PreQualificationGame
              startWithQuiz={true}
              onShowResults={handleShowResults}
            />
          </div>
        </div>
      )}

      {/* Results Full Page */}
      {showResults && (
        <div
          className="fixed inset-0 bg-[#F7F5F0] z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="w-full max-w-4xl my-auto">
            <PreQualificationGame
              startWithQuiz={true}
              showResultsOnly={true}
              onCloseResults={() => setShowResults(false)}
              onStartApplication={handleStartApplication}
            />
          </div>
        </div>
      )}
    </>
  );
});

PreQualificationSection.displayName = 'PreQualificationSection';

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
