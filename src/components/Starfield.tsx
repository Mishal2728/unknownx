import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; z: number; size: number; alpha: number; warm: boolean };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    let animationFrameId = 0;
    let paused = false;
    const stars: Star[] = [];
    const count = Math.min(520, Math.floor((width * height) / 2600));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.length = 0;
      const nextCount = Math.min(520, Math.floor((width * height) / 2600));
      for (let i = 0; i < nextCount; i++) {
        stars.push({ x: Math.random() * width, y: Math.random() * height, z: Math.random(), size: Math.random() * 1.15 + 0.25, alpha: Math.random() * 0.36 + 0.12, warm: Math.random() > 0.94 });
      }
    };

    const render = () => {
      if (paused) return;
      time += 0.008;
      // Clear completely each frame: no cursor lensing, smearing, or persistent marks.
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = 0.78 + Math.sin(time + star.z * 16) * 0.22;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.fillStyle = star.warm ? '#fca5a5' : '#f1f3f5';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    const onVisibilityChange = () => {
      paused = document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!paused) animationFrameId = requestAnimationFrame(render);
      else cancelAnimationFrame(animationFrameId);
    };

    resize();
    render();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" style={{ background: '#010103' }} />;
}
