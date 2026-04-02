import { useState, useEffect } from "react";

export default function FundingResult() {
  const [switchOn, setSwitchOn] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showDelta, setShowDelta] = useState(false);

  const handleToggle = () => {
    const next = !switchOn;
    setSwitchOn(next);
    if (next) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
      setTimeout(() => setShowDelta(true), 300);
    } else {
      setShowDelta(false);
    }
  };

  const low = switchOn ? "$36K" : "$18K";
  const high = switchOn ? "$40K" : "$20K";

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      WebkitFontSmoothing: "antialiased",
      background: "#F5F5F8",
      padding: "48px 24px",
      display: "flex", justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes pulseUp {
          0% { transform: scale(1); }
          30% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "44px 48px 36px",
        maxWidth: 520, width: "100%",
        border: switchOn ? "1.5px solid #EDE9FE" : "1px solid #EBEBF0",
        textAlign: "center",
        transition: "border 0.3s, box-shadow 0.3s",
        boxShadow: switchOn ? "0 4px 24px rgba(67,24,255,0.06)" : "none",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 500, letterSpacing: "1.2px",
          textTransform: "uppercase", color: "#A0A0B0", marginBottom: 6,
        }}>Estimated Funding Range</div>
        <div style={{
          fontSize: 14, color: "#8888A0", marginBottom: 28,
        }}>Based on your business profile</div>

        {/* THE NUMBER */}
        <div style={{
          position: "relative",
          marginBottom: 8,
        }}>
          {/* Strikethrough old amount — only visible when toggled */}
          <div style={{
            fontSize: 18, fontWeight: 600,
            color: "#C0C0CC",
            textDecoration: "line-through",
            marginBottom: 6,
            height: switchOn ? 24 : 0,
            opacity: switchOn ? 1 : 0,
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}>
            $18K – $20K
          </div>

          <div style={{
            fontSize: "clamp(48px, 8vw, 64px)",
            fontWeight: 800,
            color: switchOn ? "#4318FF" : "#0B0B18",
            letterSpacing: "-2px", lineHeight: 1,
            transition: "color 0.3s",
            animation: animating ? "pulseUp 0.5s cubic-bezier(0.16,1,0.3,1)" : "none",
          }}>
            {low}<span style={{
              color: "#A0A0B0", fontWeight: 400, margin: "0 4px",
            }}>–</span>{high}
          </div>
        </div>

        {/* Subtitle + delta badge */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginBottom: 28, minHeight: 24,
        }}>
          <span style={{ fontSize: 13, color: "#A0A0B0" }}>
            {switchOn ? "With Delt processing" : "Based on your monthly revenue"}
          </span>
          {showDelta && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, fontWeight: 700,
              color: "#10B981",
              background: "#ECFDF5",
              border: "1px solid #D1FAE5",
              padding: "3px 10px",
              borderRadius: 6,
              animation: "slideDown 0.3s ease",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round">
                <path d="M5 8V2M2.5 4.5L5 2l2.5 2.5"/>
              </svg>
              +$18K
            </span>
          )}
        </div>

        {/* Toggle */}
        <div
          onClick={handleToggle}
          style={{
            display: "flex", alignItems: "center",
            gap: 14, marginBottom: 24,
            padding: "14px 18px",
            background: switchOn ? "#F5F3FF" : "#F9F9FB",
            borderRadius: 10,
            border: switchOn ? "1.5px solid #DDD6FE" : "1.5px solid #EBEBF0",
            transition: "all 0.25s",
            cursor: "pointer",
          }}
        >
          {/* Icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: switchOn ? "#4318FF" : "#EBEBF0",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={switchOn ? "#fff" : "#A0A0B0"} strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 3v10M5 6l3-3 3 3"/>
            </svg>
          </div>

          {/* Label */}
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0B0B18" }}>
              Switch processing to Delt
            </div>
            {switchOn && (
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: "#4318FF", fontWeight: 500, marginTop: 2,
                animation: "slideDown 0.2s ease",
              }}>
                $18K → $36K–$40K
              </div>
            )}
          </div>

          {/* Toggle switch */}
          <div style={{
            width: 46, height: 26, borderRadius: 13,
            background: switchOn ? "#4318FF" : "#D0D0DC",
            padding: 3, transition: "background 0.2s",
            flexShrink: 0,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 10,
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              transform: switchOn ? "translateX(20px)" : "translateX(0)",
              transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}/>
          </div>
        </div>

        {/* Bonus strip — only when toggled */}
        <div style={{
          maxHeight: switchOn ? 52 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
          marginBottom: switchOn ? 20 : 0,
        }}>
          <div style={{
            display: "flex", justifyContent: "center", gap: 16,
          }}>
            {[
              { label: "2x capital", icon: "↑" },
              { label: "Next-day settlement", icon: "⚡" },
              { label: "Free terminal", icon: "◻" },
            ].map((b, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 11.5, fontWeight: 600, color: "#4318FF",
                opacity: switchOn ? 1 : 0,
                transform: switchOn ? "translateY(0)" : "translateY(6px)",
                transition: `all 0.3s ease ${0.1 + i * 0.06}s`,
              }}>
                <span style={{ fontSize: 12 }}>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button style={{
          width: "100%", padding: "16px 0",
          borderRadius: 10, border: "none",
          background: switchOn
            ? "linear-gradient(135deg, #4318FF 0%, #5B3AFF 100%)"
            : "#4318FF",
          color: "#fff",
          fontSize: 16, fontWeight: 700,
          cursor: "pointer", transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: switchOn
            ? "0 4px 16px rgba(67,24,255,0.25)"
            : "0 2px 8px rgba(67,24,255,0.15)",
          marginBottom: 10,
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(67,24,255,0.3)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = switchOn
              ? "0 4px 16px rgba(67,24,255,0.25)"
              : "0 2px 8px rgba(67,24,255,0.15)";
          }}
        >
          Get My Offer
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 7h12M8 2l5 5-5 5"/></svg>
        </button>

        <div style={{ fontSize: 12, color: "#A0A0B0", marginBottom: 24 }}>
          No impact to your credit. Takes 2 minutes.
        </div>

        <div style={{ height: 1, background: "#EBEBF0", marginBottom: 16 }}/>

        <div style={{ fontSize: 11.5, color: "#B0B0BE", lineHeight: 1.5, marginBottom: 12 }}>
          Estimates are approximate and not a guarantee of funding. Final offers are based on a full review of your business.
        </div>

        <a href="/how-it-works" style={{
          fontSize: 13, fontWeight: 600, color: "#4318FF",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5,
        }}>How it Works <span>→</span></a>
      </div>
    </div>
  );
}