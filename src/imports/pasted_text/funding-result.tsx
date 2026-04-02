import { useState } from "react";

export default function FundingResult() {
  const [switchOn, setSwitchOn] = useState(false);

  const low = switchOn ? "$40K" : "$20K";
  const high = switchOn ? "$44K" : "$22K";

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      WebkitFontSmoothing: "antialiased",
      background: "#F5F5F8",
      padding: "48px 24px",
      display: "flex", justifyContent: "center",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');`}</style>

      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "44px 48px 36px",
        maxWidth: 520, width: "100%",
        border: "1px solid #EBEBF0",
        textAlign: "center",
      }}>
        {/* Header */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 500, letterSpacing: "1.2px",
          textTransform: "uppercase", color: "#A0A0B0", marginBottom: 6,
        }}>Estimated Funding Range</div>
        <div style={{
          fontSize: 14, color: "#8888A0", marginBottom: 32,
        }}>Based on your business profile</div>

        {/* THE NUMBER — this is the hero */}
        <div style={{
          fontSize: "clamp(48px, 8vw, 64px)",
          fontWeight: 800, color: "#0B0B18",
          letterSpacing: "-2px", lineHeight: 1,
          marginBottom: 6,
          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {low}<span style={{ color: "#A0A0B0", fontWeight: 400, margin: "0 4px" }}>–</span>{high}
        </div>
        <div style={{
          fontSize: 13, color: "#A0A0B0", marginBottom: 32,
        }}>Based on your monthly revenue</div>

        {/* Switch processing toggle */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, marginBottom: 28,
          padding: "12px 20px",
          background: switchOn ? "#F5F3FF" : "#F9F9FB",
          borderRadius: 10,
          border: switchOn ? "1px solid #EDE9FE" : "1px solid #EBEBF0",
          transition: "all 0.2s",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: switchOn ? "#4318FF" : "#EBEBF0",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s", flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={switchOn ? "#fff" : "#A0A0B0"} strokeWidth="1.5" strokeLinecap="round">
              <path d="M7 2v10M4 5l3-3 3 3"/>
            </svg>
          </div>
          <div style={{ textAlign: "left", flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0B0B18" }}>
              Switch processing to Delt for 2x more capital
            </div>
          </div>
          {/* Toggle */}
          <div
            onClick={() => setSwitchOn(!switchOn)}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: switchOn ? "#4318FF" : "#D0D0DC",
              padding: 2, cursor: "pointer",
              transition: "background 0.2s",
              display: "flex", alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 10,
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              transform: switchOn ? "translateX(20px)" : "translateX(0)",
              transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}/>
          </div>
        </div>

        {/* CTA */}
        <button style={{
          width: "100%", padding: "16px 0",
          borderRadius: 10, border: "none",
          background: "#4318FF", color: "#fff",
          fontSize: 16, fontWeight: 700,
          cursor: "pointer", transition: "all 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 2px 8px rgba(67,24,255,0.2)",
          marginBottom: 10,
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#3610E0";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(67,24,255,0.25)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#4318FF";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(67,24,255,0.2)";
          }}
        >
          Get My Offer
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 7h12M8 2l5 5-5 5"/></svg>
        </button>

        <div style={{ fontSize: 12, color: "#A0A0B0", marginBottom: 24 }}>
          No impact to your credit. Takes 2 minutes.
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#EBEBF0", marginBottom: 16 }}/>

        {/* Disclaimer + link */}
        <div style={{
          fontSize: 11.5, color: "#B0B0BE", lineHeight: 1.5, marginBottom: 12,
        }}>
          Estimates are approximate and not a guarantee of funding. Final offers are based on a full review of your business.
        </div>

        <a href="/how-it-works" style={{
          fontSize: 13, fontWeight: 600, color: "#4318FF",
          textDecoration: "none", display: "inline-flex",
          alignItems: "center", gap: 5,
        }}>
          How it Works <span>→</span>
        </a>
      </div>
    </div>
  );
}