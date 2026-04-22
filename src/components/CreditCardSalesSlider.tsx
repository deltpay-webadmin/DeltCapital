import { useState, useRef, useCallback, useEffect } from 'react';

const CC_STOPS = [
  2500, 5000, 7500, 10000, 15000, 20000, 25000,
  35000, 50000, 75000, 100000,
  150000, 200000, 250000, 300000,
  400000, 500000, 750000,
];

const TICK_SPACING = 80;
const TOTAL_WIDTH = (CC_STOPS.length - 1) * TICK_SPACING;

function formatCurrency(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
}

function formatHero(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  return `$${val.toLocaleString()}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getValueAtPosition(scrollX: number): number {
  const index = scrollX / TICK_SPACING;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower < 0) return CC_STOPS[0];
  if (upper >= CC_STOPS.length) return CC_STOPS[CC_STOPS.length - 1];
  if (lower === upper) return CC_STOPS[lower];
  const t = index - lower;
  return Math.round(lerp(CC_STOPS[lower], CC_STOPS[upper], t));
}

function getClosestStopIndex(scrollX: number): number {
  return Math.round(scrollX / TICK_SPACING);
}

interface CreditCardSalesSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function CreditCardSalesSlider({ value, onChange }: CreditCardSalesSliderProps) {
  const getInitialIndex = () => {
    if (value === 0) return 4; // Default to $15,000
    const closest = CC_STOPS.reduce((prev, curr, idx) => {
      return Math.abs(curr - value) < Math.abs(CC_STOPS[prev] - value) ? idx : prev;
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

  const ccSales = getValueAtPosition(scrollX);

  useEffect(() => { onChange(ccSales); }, [ccSales, onChange]);

  useEffect(() => {
    if (containerRef.current) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) setContainerWidth(entry.contentRect.width);
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
      const clampedIdx = Math.max(0, Math.min(CC_STOPS.length - 1, idx));
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
      (handleWheel as any)._timeout = setTimeout(() => snapToNearest(newScroll), 150);
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
  const minVal = CC_STOPS[0];
  const maxVal = CC_STOPS[CC_STOPS.length - 1];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ─── Hero value display ─── */}
      <div className="text-center mb-6">
        <div
          className="text-gradient-primary tabular-nums"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.75rem, 7vw, 4.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            transition: isDragging ? 'none' : 'opacity 0.12s ease',
          }}
        >
          {formatHero(ccSales)}
        </div>
        <div
          className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-[#f1f2f4] border border-[#dcdfe4] px-3 py-1 text-[#44546f]"
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0c66e4]" />
          per month · card sales
        </div>
      </div>

      {/* ─── Slider track ─── */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="relative h-28 overflow-hidden select-none rounded-xl"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          background:
            'linear-gradient(180deg, rgba(241,242,244,0) 0%, rgba(241,246,255,0.6) 50%, rgba(241,242,244,0) 100%)',
        }}
      >
        {/* Subtle baseline */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(12,102,228,0.18) 50%, transparent 100%)',
          }}
        />

        {/* Center indicator — gradient pill with glowing top dot */}
        <div
          aria-hidden
          className="absolute left-1/2 top-3 bottom-3 w-[3px] -translate-x-1/2 z-10 rounded-full"
          style={{
            background: '#0c66e4',
            boxShadow:
              '0 0 14px rgba(12,102,228,0.55), 0 0 28px rgba(110,93,198,0.3)',
          }}
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-1.5 z-10 w-2.5 h-2.5 -translate-x-1/2 rounded-full"
          style={{
            background: '#0c66e4',
            boxShadow:
              '0 0 12px rgba(12,102,228,0.7), 0 0 24px rgba(110,93,198,0.45)',
          }}
        />

        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-[5] pointer-events-none"
          style={{ background: 'linear-gradient(to right, #ffffff 30%, transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-[5] pointer-events-none"
          style={{ background: 'linear-gradient(to left, #ffffff 30%, transparent)' }}
        />

        {/* Ticks */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            transform: `translateX(${offset}px)`,
            transition: isDragging ? 'none' : undefined,
          }}
        >
          {CC_STOPS.map((stop, i) => {
            const x = i * TICK_SPACING;
            const distFromCenter = Math.abs(x - scrollX);
            const proximity = Math.max(0, 1 - distFromCenter / (TICK_SPACING * 3));
            const isSelected = i === selectedIndex && !isDragging;
            const isMajor = i % 3 === 0;

            return (
              <div
                key={i}
                onClick={() => handleTickClick(i)}
                className="absolute top-0 h-full flex flex-col items-center justify-center cursor-pointer -translate-x-1/2"
                style={{ left: x }}
              >
                {/* Tick mark */}
                <div
                  className="rounded-full"
                  style={{
                    width: isSelected ? 3 : isMajor ? 1.5 : 1,
                    height: isSelected ? 36 : isMajor ? 28 : 20,
                    background: isSelected
                      ? '#0c66e4'
                      : `rgba(12,102,228,${0.10 + proximity * 0.45})`,
                    transition: isDragging ? 'none' : 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 10px rgba(12,102,228,0.45)' : 'none',
                  }}
                />
                {/* Label */}
                <div
                  className="mt-2 whitespace-nowrap tabular-nums"
                  style={{
                    fontSize: isSelected ? 11 : 10,
                    fontWeight: isSelected ? 700 : 600,
                    letterSpacing: isSelected ? '-0.005em' : '0',
                    color: isSelected
                      ? '#0c66e4'
                      : `rgba(68,84,111,${0.35 + proximity * 0.55})`,
                    transition: isDragging ? 'none' : 'all 0.2s ease',
                  }}
                >
                  {formatCurrency(stop)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Min / max footer ─── */}
      <div className="mt-4 flex items-center justify-between text-[#758195]">
        <span
          className="uppercase"
          style={{ fontSize: 9.5, letterSpacing: '0.28em', fontWeight: 700 }}
        >
          ↤ Drag · scroll · tap
        </span>
        <span
          className="tabular-nums"
          style={{ fontSize: 11, fontWeight: 600 }}
        >
          {formatCurrency(minVal)} – {formatCurrency(maxVal)}
        </span>
      </div>
    </div>
  );
}
