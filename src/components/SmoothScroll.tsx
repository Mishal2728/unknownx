import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'wouter';

/**
 * Enables Lenis smooth scrolling across the site while respecting
 * reduced-motion preferences and resetting scroll on route changes.
 */
export function SmoothScroll() {
  const [location] = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!window.location.hash) {
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
  }, [location]);

  return null;
}
