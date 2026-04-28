// V1 motion primitives — one IntersectionObserver pattern, reused everywhere.
// Keeps sections snappy: <V1Reveal> fades + rises on scroll, <V1Stagger> cascades
// its direct children, <V1CountUp> animates tabular numbers.
//
// Respects prefers-reduced-motion: everything becomes instant.

const V1_PRM = typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hook: returns [ref, inView] — inView latches true once, doesn't flicker.
function useV1InView(threshold = 0.15, rootMargin = '0px 0px -60px 0px') {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(V1_PRM ? true : false);
  React.useEffect(() => {
    if (V1_PRM || !ref.current || inView) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold, rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [inView, threshold, rootMargin]);
  return [ref, inView];
}

// Generic reveal: fade+rise, optional delay
function V1Reveal({ children, delay = 0, y = 18, duration = 700, as: Tag = 'div', style, ...rest }) {
  const [ref, inView] = useV1InView();
  return (
    <Tag
      ref={ref}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate3d(0,0,0)' : `translate3d(0, ${y}px, 0)`,
        transition: V1_PRM ? 'none' : `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: inView ? 'auto' : 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Stagger: wraps direct children in Reveal with incrementing delay
function V1Stagger({ children, step = 90, start = 0, y = 16, duration = 650, style, ...rest }) {
  const [ref, inView] = useV1InView();
  const arr = React.Children.toArray(children);
  return (
    <div ref={ref} style={style} {...rest}>
      {arr.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translate3d(0,0,0)' : `translate3d(0, ${y}px, 0)`,
            transition: V1_PRM ? 'none' : `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${start + i * step}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${start + i * step}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Count-up for tabular numerics. Handles "$200M+", "24h", "1.18×", "19%" by
// animating the leading numeric run in-place.
function V1CountUp({ value, duration = 1400, start = 0 }) {
  const [ref, inView] = useV1InView();
  const [display, setDisplay] = React.useState(V1_PRM ? value : '');

  React.useEffect(() => {
    if (V1_PRM || !inView) return;
    // Parse a leading number (int or float, with optional thousands separators) plus prefix/suffix.
    const m = String(value).match(/^([^\d\-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) { setDisplay(value); return; }
    const [, prefix, numRaw, suffix] = m;
    const target = parseFloat(numRaw.replace(/,/g, ''));
    const decimals = (numRaw.split('.')[1] || '').length;
    const useCommas = numRaw.includes(',');
    const fmt = (n) => {
      const s = n.toFixed(decimals);
      if (!useCommas) return s;
      const [int, dec] = s.split('.');
      const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return dec !== undefined ? `${withCommas}.${dec}` : withCommas;
    };
    const t0 = performance.now() + start;
    let raf = 0;
    const tick = (now) => {
      const p = Math.max(0, Math.min(1, (now - t0) / duration));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(prefix + fmt(target * eased) + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, start]);

  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{display || '\u00A0'}</span>;
}

// Hook: flips true a tick after mount (gives fonts a frame to load) so
// on-mount animations can be keyed off a React state change. Used for hero
// enter-on-load choreography rather than scroll-triggered reveals.
function useV1Mounted(delay = 40) {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    if (V1_PRM) { setM(true); return; }
    const t = setTimeout(() => setM(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return m;
}

// Hook: smoothed window.scrollY with RAF throttling. Consumers translate this
// into parallax offsets/scales. Returns a number (pixels).
function useV1ScrollY() {
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    if (V1_PRM) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; setY(window.scrollY || 0); });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return y;
}

// Line mask: a single line of text that slides up from behind an
// overflow-hidden edge. `ready` is the trigger (use with useV1Mounted for hero
// or useV1InView for scroll-entering headlines).
function V1LineMask({ children, delay = 0, duration = 900, ready = true, style, ...rest }) {
  // overflow:hidden exists only to mask the pre-animation translate(0,108%)
  // state. Once the slide-up settles, drop it so italic descenders (g/p/q/y/j)
  // and any future glyph overhang aren't clipped.
  const [revealed, setRevealed] = React.useState(V1_PRM);
  React.useEffect(() => {
    if (revealed) return;
    if (V1_PRM) { setRevealed(true); return; }
    if (!ready) return;
    const t = setTimeout(() => setRevealed(true), delay + duration + 40);
    return () => clearTimeout(t);
  }, [ready, delay, duration, revealed]);

  return (
    <span style={{
      display: 'block',
      overflow: revealed ? 'visible' : 'hidden',
      paddingBottom: '0.06em',
      ...style,
    }} {...rest}>
      <span style={{
        display: 'inline-block',
        transform: ready ? 'translate3d(0,0,0)' : 'translate3d(0, 108%, 0)',
        transition: V1_PRM ? 'none' : `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: ready ? 'auto' : 'transform',
      }}>
        {children}
      </span>
    </span>
  );
}

Object.assign(window, { V1Reveal, V1Stagger, V1CountUp, useV1InView, useV1Mounted, useV1ScrollY, V1LineMask });
