import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; z: number; size: number; baseAlpha: number };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let animationFrameId = 0;
    let resizeTimeout: number | undefined;
    let scrollY = window.scrollY;
    let targetScrollY = scrollY;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let time = 0;
    let paused = false;
    let hasPointer = false;
    const stars: Star[] = [];
    const starCount = 1200;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width * 2 - width,
          y: Math.random() * height * 2 - height,
          z: Math.random() * 1000,
          size: Math.random() * 1.2 + 0.3,
          baseAlpha: Math.random() * 0.8 + 0.2,
        });
      }
    };

    const handleScroll = () => { targetScrollY = window.scrollY; };
    const handleMouseMove = (event: MouseEvent) => {
      hasPointer = true;
      targetMouseX = event.clientX;
      targetMouseY = event.clientY;
    };
    const handlePointerLeave = () => { hasPointer = false; };
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

      // Paint an opaque black frame every time to prevent any trails or cursor marks.
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#010103';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const holeX = hasPointer ? mouseX : centerX;
      const holeY = hasPointer ? mouseY : centerY;
      const eventHorizon = 24;
      const lensingRadius = 190;

      for (const star of stars) {
        let z = star.z - scrollY * 0.8 - time * 50;
        while (z < 1) z += 1000;
        while (z > 1000) z -= 1000;

        const perspective = 1000 / z;
        let x = star.x * perspective + centerX;
        let y = star.y * perspective + centerY;
        let size = star.size * perspective * 0.6;
        const alpha = star.baseAlpha * Math.min(1, z / 200) * Math.min(1, (1000 - z) / 200);
        const dx = x - holeX;
        const dy = y - holeY;
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
          ctx.fillStyle = '#f4f4f5';
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Event horizon and subtle accretion glow follow the pointer, without painting a wake.
      const glow = ctx.createRadialGradient(holeX, holeY, eventHorizon * 0.8, holeX, holeY, eventHorizon * 2.5);
      glow.addColorStop(0, 'rgba(0,0,0,1)');
      glow.addColorStop(0.3, 'rgba(248,113,113,0.22)');
      glow.addColorStop(0.62, 'rgba(248,113,113,0.08)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(holeX, holeY, eventHorizon * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#010103';
      ctx.beginPath();
      ctx.arc(holeX, holeY, eventHorizon * 0.95, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 120);
    }, { passive: true });
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" style={{ background: '#010103' }} />;
}
