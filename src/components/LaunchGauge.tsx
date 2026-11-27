import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { Flame } from 'lucide-react';

import { Prompt } from '@/components/BlackIce';

type Step = { num: string; title: string; text: string };

export function LaunchGauge({ steps, eyebrow, ru }: { steps: Step[]; eyebrow: string; ru: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72%', 'end 55%'] });
  const [stage, setStage] = useState(-1);

  // smooth the scroll value so the flame glides instead of jumping
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.35 });

  const sparkTop = useTransform(smooth, [0, 1], ['0%', '100%']);
  const burnt = useTransform(smooth, [0, 1], ['0%', '100%']);
  const burstOpacity = useTransform(smooth, [0.86, 0.97, 1], [0, 0.9, 0.5]);
  const burstScale = useTransform(smooth, [0.86, 1], [0.3, 1.5]);

  useMotionValueEvent(smooth, 'change', (v) => {
    setStage(v <= 0 ? -1 : Math.min(steps.length - 1, Math.floor(v * steps.length)));
  });

  const lifted = stage >= steps.length - 1;

  return (
    <section className="border-t border-white/5 bg-black/50 py-28 backdrop-blur-md md:py-36">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <div className="mb-14 flex flex-wrap items-center gap-4">
          <Prompt cmd="./launch --fuse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400/60">{eyebrow}</span>
          <span className={`ml-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${lifted ? 'text-orange-300' : 'text-emerald-300/60'}`}>
            <Flame className={`h-3.5 w-3.5 ${lifted ? 'animate-pulse' : ''}`} />
            {lifted ? (ru ? 'запуск' : 'ignition') : (ru ? 'горит' : 'fuse lit')}
          </span>
        </div>

        <div ref={ref} className="relative pl-12">
          {/* intact fuse rope */}
          <div className="fuse-rope absolute bottom-0 left-4 top-0 w-[3px] -translate-x-1/2" />
          {/* burnt (charred) portion trailing the spark */}
          <motion.div className="fuse-burnt absolute left-4 top-0 w-[3px] -translate-x-1/2" style={{ height: burnt }} />
          {/* travelling spark */}
          <motion.div className="absolute left-4 z-10 -translate-x-1/2" style={{ top: sparkTop }}>
            <span className="fuse-spark" />
          </motion.div>
          {/* ignition burst at the end */}
          <motion.div
            className="pointer-events-none absolute -bottom-6 left-4 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-t from-orange-500 via-orange-400/60 to-transparent blur-2xl"
            style={{ opacity: burstOpacity, scale: burstScale }}
          />

          {steps.map((step, i) => {
            const on = stage === i;
            const done = stage > i;
            const reached = stage >= i;
            return (
              <div key={step.num} className="relative mb-12 transition-all duration-300"
                style={{ opacity: reached ? 1 : 0.4 }}>
                {/* fuse node on the rope */}
                <span
                  className="absolute top-2 z-20 h-3.5 w-3.5 -translate-y-1/2 rounded-full border transition-all duration-300"
                  style={{
                    left: '-2rem',
                    borderColor: reached ? 'rgba(251,146,60,0.9)' : 'rgba(255,255,255,0.25)',
                    background: on ? '#fb923c' : reached ? '#3a1a0a' : '#050505',
                    boxShadow: on ? '0 0 16px rgba(251,146,60,0.8)' : 'none',
                  }}
                  aria-hidden="true"
                />
                {on && <span className="box-smoke" aria-hidden="true" />}
                {/* firelight cast onto the background around the text */}
                {on && <span className="flame-bg" aria-hidden="true" />}

                {/* open text — moved right, lit by the fire on the line */}
                <div className={`relative z-10 pl-10 sm:pl-16 ${on ? 'text-flame' : done ? 'text-charred' : ''}`}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className={`font-mono text-sm tracking-widest ${on ? 'text-orange-300' : done ? 'text-emerald-300/70' : 'text-gray-500'}`}>{step.num}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-gray-600">
                      {done ? (ru ? 'сгорело' : 'burned') : on ? (ru ? 'горит' : 'burning') : (ru ? 'ожидание' : 'unlit')}
                    </span>
                  </div>
                  <h3 className="mb-3 text-fluid-h2 font-bold">{step.title}</h3>
                  <p className="max-w-2xl font-serif normal-case leading-relaxed text-gray-400">{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
