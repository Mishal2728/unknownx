import { useEffect, useState } from 'react';

export function CursorDot() {
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    setSupportsHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  // Use the browser cursor; the animated overlay used to leave a distracting visual wake.
  return supportsHover ? null : null;
}
