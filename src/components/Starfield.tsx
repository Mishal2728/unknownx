import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; z: number; size: number; baseAlpha: number };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    let animationFrameId = 0;
    let resizeTimeout: number | undefined;
    let paused = false;
    const stars: Star[] = [];
    const numStars = 1200;
    let scrollY = window.scrollY;
    let targetScrollY = scrollY;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const populateStars = () => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width * 2 - width,
          y: Math.random() * height * 2 - height,
          z: Math.random() * 1000,
          size: Math.random() * 1.2 + 0.3,
          baseAlpha: Math.random() * 0.8 + 0.2,
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      populateStars();
    };
    const handleResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 120);
    };
    const handleScroll = () => { targetScrollY = window.scrollY; };
    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = event.clientX;
      targetMouseY = event.clientY;
    };
    const handleVisibility = () => {
      paused = document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (paused) cancelAnimationFrame(animationFrameId);
      else animationFrameId = requestAnimationFrame(render);
    };

    const render = () => {
      if (paused) return;
      time += 0.005;
      scrollY += (targetScrollY - scrollY) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.15;
      mouseY += (targetMouseY - mouseY) * 0.15;

      // Opaque repaint each frame preserves the original lensing effect without trails.
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#010103';
      ctx.fillRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const eventHorizon = 24;
      const lensingRadius = 190;

      for (const star of stars) {
        let z = star.z - scrollY * 0.8 - time * 50;
        while (z < 1) z += 1000;
        while (z > 1000) z -= 1000;

        const perspective = 1000 / z;
        let x = star.x * perspective + cx;
        let y = star.y * perspective + cy;
        let size = star.size * perspective * 0.6;
        const alpha = star.baseAlpha * Math.min(1, z / 200) * Math.min(1, (1000 - z) / 200);
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.hypot(dx, dy);

        if (distance < lensingRadius && distance > 1) {
          const force = ((lensingRadius - distance) / lensingRadius) ** 2;
          const angle = Math.atan2(dy, dx);
          const swirl = force * 0.8;
          const pushOut = distance < eventHorizon * 1.5 ? (eventHorizon * 1.5 - distance) * 0.8 : 0;
          x += Math.cos(angle + swirl) * pushOut + Math.cos(angle + Math.PI / 2) * (force * 60);
          y += Math.sin(angle + swirl) * pushOut + Math.sin(angle + Math.PI / 2) * (force * 60);
          if (distance < eventHorizon * 2.5) size *= 1.5;
        }

        if (distance > eventHorizon * 0.8 && x >= 0 && x <= width && y >= 0 && y <= height) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const glow = ctx.createRadialGradient(mouseX, mouseY, eventHorizon * 0.8, mouseX, mouseY, eventHorizon * 2.5);
      glow.addColorStop(0, 'rgba(0,0,0,1)');
      glow.addColorStop(0.3, 'rgba(255,255,255,0.24)');
      glow.addColorStop(0.6, 'rgba(255,255,255,0.08)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, eventHorizon * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, eventHorizon * 0.95, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" style={{ background: '#010103' }} />;
}
