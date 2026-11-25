import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; z: number; size: number; alpha: number };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let frame = 0;
    let time = 0;
    let paused = false;
    const particles: Particle[] = [];
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, active: false };
    const particleCount = () => Math.min(780, Math.max(220, Math.floor((width * height) / 1900)));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      for (let i = 0; i < particleCount(); i++) {
        particles.push({
          x: Math.random() * width * 2 - width / 2,
          y: Math.random() * height * 2 - height / 2,
          z: Math.random() * 900 + 100,
          size: Math.random() * 1.15 + 0.25,
          alpha: Math.random() * 0.6 + 0.2,
        });
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.targetX = event.clientX;
      mouse.targetY = event.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => { mouse.active = false; };

    const render = () => {
      if (paused) return;
      time += 0.35;
      mouse.x += (mouse.targetX - mouse.x) * 0.16;
      mouse.y += (mouse.targetY - mouse.y) * 0.16;

      // Clear to transparent every frame so neither particles nor the black hole leave trails.
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const horizon = 18;
      const lensRadius = mouse.active ? 145 : 0;

      for (const particle of particles) {
        particle.z -= 0.75;
        if (particle.z < 45) {
          particle.x = Math.random() * width * 2 - width / 2;
          particle.y = Math.random() * height * 2 - height / 2;
          particle.z = 900;
        }

        const scale = 520 / particle.z;
        let x = particle.x * scale + cx;
        let y = particle.y * scale + cy;
        const radiusX = x - mouse.x;
        const radiusY = y - mouse.y;
        const distance = Math.hypot(radiusX, radiusY);

        if (distance < lensRadius && distance > 0.5) {
          const force = ((lensRadius - distance) / lensRadius) ** 2;
          const angle = Math.atan2(radiusY, radiusX);
          const bend = force * 0.6;
          const tangent = force * 34;
          x += Math.cos(angle + bend) * force * 18 + Math.cos(angle + Math.PI / 2) * tangent;
          y += Math.sin(angle + bend) * force * 18 + Math.sin(angle + Math.PI / 2) * tangent;
        }

        if (distance > horizon && x >= -4 && x <= width + 4 && y >= -4 && y <= height + 4) {
          const fade = Math.max(0, Math.min(1, (900 - particle.z) / 150, (particle.z - 45) / 100));
          ctx.globalAlpha = particle.alpha * fade * (0.75 + Math.sin(time / 25 + particle.z) * 0.25);
          ctx.fillStyle = '#f4f4f5';
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.35, particle.size * scale * 0.55), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Cursor-following black hole: a clean event horizon and subtle red accretion ring.
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, horizon * 0.85, mouse.x, mouse.y, horizon * 2.4);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.5, 'rgba(127,29,29,0.12)');
      gradient.addColorStop(0.78, 'rgba(248,113,113,0.2)');
      gradient.addColorStop(1, 'rgba(127,29,29,0)');
      ctx.globalAlpha = mouse.active ? 1 : 0.68;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, horizon * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#010103';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, horizon, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(248,113,113,0.42)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, horizon * 1.18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(render);
    };

    const onVisibilityChange = () => {
      paused = document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (paused) cancelAnimationFrame(frame);
      else frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('blur', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('blur', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
