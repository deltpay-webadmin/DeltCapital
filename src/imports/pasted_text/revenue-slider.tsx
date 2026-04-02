import React, { useState, useRef, useCallback, useEffect } from "react";

const REVENUE_STOPS = [
  5000, 10000, 15000, 20000, 25000,
  35000, 50000, 75000, 100000,
  150000, 200000, 250000, 300000,
  400000, 500000,
  750000, 1000000,
];

const TICK_SPACING = 80;
const TOTAL_WIDTH = (REVENUE_STOPS.length - 1) * TICK_SPACING;

function formatCurrency(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getRevenueAtPosition(scrollX) {
  const index = scrollX / TICK_SPACING;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower < 0) return REVENUE_STOPS[0];
  if (upper >= REVENUE_STOPS.length) return REVENUE_STOPS[REVENUE_STOPS.length - 1];
  if (lower === upper) return REVENUE_STOPS[lower];
  const t = index - lower;
  return Math.round(lerp(REVENUE_STOPS[lower], REVENUE_STOPS[upper], t));
}

function getClosestStopIndex(scrollX) {
  return Math.round(scrollX / TICK_SPACING);
}

export default function RevenueSlider() {
  const [scrollX, setScrollX] = useState(4 * TICK_SPACING);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(4);
  const containerRef = useRef(null);
  const dragStart = useRef({ x: 0, scroll: 0 });
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(400);

  const revenue = getRevenueAtPosition(scrollX);

  useEffect(() => {
    if (containerRef.current) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }
  }, []);

  const clampScroll = useCallback((val) => {
    return Math.max(0, Math.min(TOTAL_WIDTH, val));
  }, []);

  const snapToNearest = useCallback(
    (currentScroll, vel = 0) => {
      let targetScroll = currentScroll + vel * 12;
      targetScroll = clampScroll(targetScroll);
      const idx = getClosestStopIndex(targetScroll);
      const clampedIdx = Math.max(0, Math.min(REVENUE_STOPS.length - 1, idx));
      const target = clampedIdx * TICK_SPACING;
      setSelectedIndex(clampedIdx);

      let current = currentScroll;
      const animate = () => {
        const diff = target - current;
        if (Math.abs(diff) < 0.5) {
          setScrollX(target);
          return;
        }
        current += diff * 0.15;
        setScrollX(current);
        animFrameRef.current = requestAnimationFrame(animate);
      };
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    },
    [clampScroll]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsDragging(true);
      dragStart.current = { x: e.clientX, scroll: scrollX };
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [scrollX]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const now = performance.now();
      const dt = now - lastTimeRef.current;
      const dx = e.clientX - lastXRef.current;
      if (dt > 0) velocityRef.current = -dx / dt;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;

      const delta = dragStart.current.x - e.clientX;
      setScrollX(clampScroll(dragStart.current.scroll + delta));
    },
    [isDragging, clampScroll]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToNearest(scrollX, velocityRef.current);
  }, [isDragging, scrollX, snapToNearest]);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      const newScroll = clampScroll(scrollX + e.deltaY * 0.8);
      setScrollX(newScroll);

      clearTimeout(handleWheel._timeout);
      handleWheel._timeout = setTimeout(() => {
        snapToNearest(newScroll);
      }, 150);
    },
    [scrollX, clampScroll, snapToNearest]
  );

  const handleTickClick = useCallback(
    (idx) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      snapToNearest(idx * TICK_SPACING);
    },
    [snapToNearest]
  );

  const offset = containerWidth / 2 - scrollX;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
        padding: "20px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "linear-gradient(165deg, #111113 0%, #0a0a0c 100%)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03), 0 20px 60px -10px rgba(0,0,0,0.7), 0 0 120px -40px rgba(99,102,241,0.08)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "28px 28px 0 28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#6366f1",
                boxShadow: "0 0 8px rgba(99,102,241,0.6)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Delt Capital
            </span>
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.4,
            }}
          >
            What's your average monthly revenue?
          </h2>
        </div>

        {/* Revenue Display */}
        <div
          style={{
            padding: "24px 28px 16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 48,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              transition: isDragging ? "none" : "all 0.08s ease",
            }}
          >
            {revenue >= 1000000
              ? `$${(revenue / 1000000).toFixed(1)}M`
              : `$${revenue.toLocaleString()}`}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "rgba(255,255,255,0.3)",
              fontWeight: 400,
            }}
          >
            per month
          </div>
        </div>

        {/* Slider Track */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          style={{
            position: "relative",
            height: 100,
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
            userSelect: "none",
            overflow: "hidden",
          }}
        >
          {/* Center indicator line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 2,
              transform: "translateX(-50%)",
              background: "#6366f1",
              zIndex: 10,
              boxShadow: "0 0 12px rgba(99,102,241,0.5)",
            }}
          />
          {/* Center glow */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 40,
              height: 40,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
              zIndex: 9,
              pointerEvents: "none",
            }}
          />

          {/* Fade edges */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 80,
              background: "linear-gradient(to right, #0a0a0c, transparent)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 80,
              background: "linear-gradient(to left, #0a0a0c, transparent)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />

          {/* Ticks */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              transform: `translateX(${offset}px)`,
              transition: isDragging ? "none" : undefined,
            }}
          >
            {REVENUE_STOPS.map((stop, i) => {
              const x = i * TICK_SPACING;
              const distFromCenter = Math.abs(x - scrollX);
              const proximity = Math.max(
                0,
                1 - distFromCenter / (TICK_SPACING * 3)
              );
              const isSelected = i === selectedIndex && !isDragging;

              return (
                <div
                  key={i}
                  onClick={() => handleTickClick(i)}
                  style={{
                    position: "absolute",
                    left: x,
                    top: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transform: "translateX(-50%)",
                  }}
                >
                  {/* Tick mark */}
                  <div
                    style={{
                      width: isSelected ? 2 : 1,
                      height: 28,
                      borderRadius: 1,
                      background: isSelected
                        ? "#6366f1"
                        : `rgba(255,255,255,${0.08 + proximity * 0.25})`,
                      transition: isDragging ? "none" : "all 0.2s ease",
                    }}
                  />
                  {/* Label */}
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 10,
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontWeight: 400,
                      color: `rgba(255,255,255,${0.15 + proximity * 0.45})`,
                      whiteSpace: "nowrap",
                      transition: isDragging ? "none" : "color 0.2s ease",
                    }}
                  >
                    {formatCurrency(stop)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom padding */}
        <div style={{ height: 12 }} />
      </div>
    </div>
  );
}