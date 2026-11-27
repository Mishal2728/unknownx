import { ReactNode, useEffect, useRef, useState } from 'react';

const SCRAMBLE = '!<>-_\\/[]{}=+*^?#@%01ABCDEFXZ';
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Command-prompt style eyebrow: root@tonrax:~# ./command --flag */
export function Prompt({ cmd, path = '~' }: { cmd: string; path?: string }) {
  return (
    <div className="bi-prompt">
      <span className="u">root@tonrax</span>
      <span className="s">:</span>
      <span className="p">{path}</span>
      <span className="s"># </span>
      <span className="c">{cmd}</span>
      <span className="bi-caret" aria-hidden="true" />
    </div>
  );
}

/** ASCII-style divider with a centered node label. */
export function AsciiRule({ label }: { label: string }) {
  return (
    <div className="bi-rule" aria-hidden="true">
      <span className="node">[+]</span>
      <span>{label}</span>
      <span className="node">[+]</span>
    </div>
  );
}

/**
 * Decode-on-reveal heading: scrambles from random glyphs to the real text the
 * first time it scrolls into view, then keeps the glitch-on-hover effect.
 * Pass plain text once; it is mirrored into data-text for the hover layers.
 */
export function GlitchText({ children, className = '' }: { children: string; className?: string }) {
  const final = children;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(final);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setDisplay(final);
      return;
    }
    setDisplay(final); // fallback until observed

    const run = () => {
      if (started.current) return;
      started.current = true;
      const total = final.length;
      let frame = 0;
      const framesPerChar = 2;
      const id = window.setInterval(() => {
        frame += 1;
        const revealed = Math.floor(frame / framesPerChar);
        let out = '';
        for (let i = 0; i < total; i += 1) {
          const ch = final[i];
          if (ch === ' ') { out += ' '; continue; }
          out += i < revealed ? ch : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
        }
        setDisplay(out);
        if (revealed >= total) {
          window.clearInterval(id);
          setDisplay(final);
        }
      }, 28);
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) run(); }),
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [final]);

  return (
    <span ref={ref} className={`bi-glitch ${className}`} data-text={final}>
      {display}
    </span>
  );
}

/** Monospace status tag, e.g. [ ONLINE ]. */
export function Tag({ children }: { children: ReactNode }) {
  return <span className="bi-tag">{children}</span>;
}
