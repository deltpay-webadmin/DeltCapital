import { useState, useRef, useCallback, useEffect } from 'react';

const REVENUE_STOPS = [
  5000, 10000, 15000, 20000, 25000,
  35000, 50000, 75000, 100000,
  150000, 200000, 250000, 300000,
  400000, 500000,
  750000, 1000000,
];

const TICK_SPACING = 80;
const TOTAL_WIDTH = (REVENUE_STOPS.length - 1) * TICK_SPACING;

function formatCurrency(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getRevenueAtPosition(scrollX: number): number {
  const index = scrollX / TICK_SPACING;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower < 0) return REVENUE_STOPS[0];
  if (upper >= REVENUE_STOPS.length) return REVENUE_STOPS[REVENUE_STOPS.length - 1];
  if (lower === upper) return REVENUE_STOPS[lower];
  const t = index - lower;
  return Math.round(lerp(REVENUE_STOPS[lower], REVENUE_STOPS[upper], t));
}

function getClosestStopIndex(scrollX: number): number {
  return Math.round(scrollX / TICK_SPACING);
}

interface MonthlyRevenueSliderProps {
  value: number;
  onChange: (value: number) => void;
  onContinue?: () => void;
}

export function MonthlyRevenueSlider({ value, onChange, onContinue }: MonthlyRevenueSliderProps) {
  // Find initial index based on value
  const getInitialIndex = () => {
    if (value === 0) return 4; // Default to $25,000
    const closest = REVENUE_STOPS.reduce((prev, curr, idx) => {
      return Math.abs(curr - value) < Math.abs(REVENUE_STOPS[prev] - value) ? idx : prev;
    }, 0);
    return closest;
  };

  const [scrollX, setScrollX] = useState(getInitialIndex() * TICK_SPACING);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(getInitialIndex());
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, scroll: 0 });
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(400);

  const revenue = getRevenueAtPosition(scrollX);

  // Update parent when revenue changes
  useEffect(() => {
    onChange(revenue);
  }, [revenue, onChange]);

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

  const clampScroll = useCallback((val: number) => {
    return Math.max(0, Math.min(TOTAL_WIDTH, val));
  }, []);

  const snapToNearest = useCallback(
    (currentScroll: number, vel = 0) => {
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
    (e: React.PointerEvent) => {
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
    (e: React.PointerEvent) => {
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
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      const newScroll = clampScroll(scrollX + e.deltaY * 0.8);
      setScrollX(newScroll);

      clearTimeout((handleWheel as any)._timeout);
      (handleWheel as any)._timeout = setTimeout(() => {
        snapToNearest(newScroll);
      }, 150);
    },
    [scrollX, clampScroll, snapToNearest]
  );

  const handleTickClick = useCallback(
    (idx: number) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      snapToNearest(idx * TICK_SPACING);
    },
    [snapToNearest]
  );

  const offset = containerWidth / 2 - scrollX;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Revenue Display */}
      <div className="text-center mb-8">
        <div
          className="text-5xl font-bold text-[#172b4d] tabular-nums tracking-tight"
          style={{
            transition: isDragging ? 'none' : 'all 0.08s ease',
          }}
        >
          {revenue >= 1000000
            ? `$${(revenue / 1000000).toFixed(1)}M`
            : `$${revenue.toLocaleString()}`}
        </div>
        <div className="mt-2 text-sm text-[#9CA3AF] font-medium">
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
        className="relative h-24 overflow-hidden select-none"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        {/* Center indicator line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 z-10 bg-[#0c66e4]"
          style={{
            boxShadow: '0 0 12px rgba(73,69,255,0.4)',
          }}
        />
        {/* Center glow */}
        <div
          className="absolute left-1/2 top-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 z-[9] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(73,69,255,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-[5] pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #ffffff, transparent)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-[5] pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #ffffff, transparent)',
          }}
        />

        {/* Ticks */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            transform: `translateX(${offset}px)`,
            transition: isDragging ? 'none' : undefined,
          }}
        >
          {REVENUE_STOPS.map((stop, i) => {
            const x = i * TICK_SPACING;
            const distFromCenter = Math.abs(x - scrollX);
            const proximity = Math.max(0, 1 - distFromCenter / (TICK_SPACING * 3));
            const isSelected = i === selectedIndex && !isDragging;

            return (
              <div
                key={i}
                onClick={() => handleTickClick(i)}
                className="absolute top-0 h-full flex flex-col items-center justify-center cursor-pointer -translate-x-1/2"
                style={{
                  left: x,
                }}
              >
                {/* Tick mark */}
                <div
                  className="rounded-sm"
                  style={{
                    width: isSelected ? 2 : 1,
                    height: 28,
                    background: isSelected
                      ? '#0c66e4'
                      : `rgba(73,69,255,${0.08 + proximity * 0.35})`,
                    transition: isDragging ? 'none' : 'all 0.2s ease',
                  }}
                />
                {/* Label */}
                <div
                  className="mt-2 text-[10px] font-medium whitespace-nowrap tabular-nums"
                  style={{
                    color: `rgba(73,69,255,${0.20 + proximity * 0.60})`,
                    transition: isDragging ? 'none' : 'color 0.2s ease',
                  }}
                >
                  {formatCurrency(stop)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}