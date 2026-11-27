import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

/**
 * Plays a CRT power-off transition over the screen each time the route
 * changes (client-side navigation). Skips the very first load so it never
 * clashes with the boot intro, and respects reduced-motion.
 */
export function PageTransition() {
  const [location] = useLocation();
  const [playing, setPlaying] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }

    // jump the new page to the top (unless it targets an in-page anchor),
    // bypassing smooth-scroll so the reveal starts cleanly at the top
    if (!window.location.hash) {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setPlaying(true);
    const id = window.setTimeout(() => setPlaying(false), 520);
    return () => window.clearTimeout(id);
  }, [location]);

  if (!playing) return null;
  return <div key={location} className="page-transition" aria-hidden="true" />;
}
