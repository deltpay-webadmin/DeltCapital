import { useState, useEffect } from 'react';

/**
 * Returns a CSS zoom factor that scales the content to fit the viewport width.
 *
 * Design baseline: 1440px  → zoom = 1.0
 * Below that the content shrinks proportionally down to a minimum zoom.
 * Below the mobile breakpoint (768px) zoom resets to 1 so native
 * responsive styles take over.
 */
export function useViewportScale(
  designWidth = 1440,
  minZoom = 0.55,
  mobileBreakpoint = 768,
) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const calculate = () => {
      const vw = window.innerWidth;

      if (vw >= designWidth) {
        setZoom(1);
      } else if (vw <= mobileBreakpoint) {
        // Below mobile breakpoint, let normal responsive CSS handle it
        setZoom(1);
      } else {
        // Scale proportionally between mobileBreakpoint and designWidth
        const raw = vw / designWidth;
        setZoom(Math.max(raw, minZoom));
      }
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, [designWidth, minZoom, mobileBreakpoint]);

  return zoom;
}
