import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  Server,
  LockKeyhole,
  Workflow,
  GripHorizontal,
} from "lucide-react";

import { Prompt, GlitchText } from "@/components/BlackIce";

const ICONS = [Globe2, Server, LockKeyhole, Workflow];
const MESSY_OFFSETS = [
  'self-start md:ml-[6%] -rotate-2',
  'self-end md:mr-[10%] rotate-2 md:-mt-4',
  'self-start md:ml-[18%] rotate-1 md:-mt-2',
  'self-end md:mr-[4%] -rotate-3 md:-mt-4',
];

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function OrbitalSystems({
  cards,
  eyebrow,
  title,
  text,
  ru,
}: {
  cards: string[][];
  eyebrow: string;
  title: string;
  text: string;
  ru: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const noMotion = reduced();

  return (
    <section className="px-6 pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="mx-auto mb-10 max-w-[1600px] md:px-8">
        <div className="mb-14 flex items-center gap-4">
          <Prompt cmd="./systems --orbital" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400/60">
            {eyebrow}
          </span>
        </div>
        <div className="max-w-3xl">
          <h2 className="text-fluid-h2-lg mb-6 font-bold tracking-tight">
            <GlitchText>{title}</GlitchText>
          </h2>
          <p className="measure font-serif text-xl leading-relaxed text-gray-400">
            {text}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/60">
            <GripHorizontal className="h-3.5 w-3.5" />
            {ru ? "перетащите системы" : "drag the systems"}
          </p>
        </div>
      </div>

      {/* space field — bounded to content width so cards stay grouped on wide screens */}
      <div
        ref={ref}
        className="relative mx-auto max-w-[1000px] overflow-hidden px-4 py-6 md:px-10"
      >
        {/* orbital rings */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/[0.08]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/[0.06]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/70 shadow-[0_0_16px_rgba(16,185,129,0.8)]" />

        <div className="relative z-10 flex flex-col gap-6">
          {cards.map(([code, cardTitle, desc], i) => {
            const Icon = ICONS[i % ICONS.length];
            const messyClass = MESSY_OFFSETS[i % MESSY_OFFSETS.length];
            return (
              <motion.div
                key={code}
                drag
                dragConstraints={ref}
                dragElastic={0.08}
                dragMomentum={false}
                whileDrag={{ scale: 1.04, zIndex: 50 }}
                whileHover={{ zIndex: 40 }}
                whileTap={{ scale: 1.02, zIndex: 50 }}
                className={`relative z-10 w-full max-w-[300px] cursor-grab touch-none active:cursor-grabbing ${messyClass}`}
              >
                <motion.div
                  animate={noMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="group select-none rounded-[16px] border border-white/15 bg-gradient-to-b from-[#1b1e21] to-[#0b0c0d] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  {/* device brand bar */}
                  <div className="mb-2 flex items-center justify-between px-1 font-mono text-[8px] uppercase tracking-[0.22em] text-white/40">
                    <span>TONRAX</span>
                    <span className="text-orange-400/80">
                      ↯ orbit {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* dot-matrix LCD screen */}
                  <div className="flipper-screen relative overflow-hidden rounded-[5px] px-3 py-3 text-emerald-300">
                    <div
                      className="relative z-10"
                      style={{
                        textShadow:
                          "0 0 9px rgba(16,185,129,0.65), 0 0 2px rgba(110,231,183,0.9)",
                      }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="font-mono text-[8px] uppercase tracking-[0.16em] opacity-70">
                          {code}
                        </span>
                        <span
                          className="ml-auto flex items-end gap-[2px]"
                          aria-hidden="true"
                        >
                          <i className="h-1.5 w-[2px] bg-emerald-400/80" />
                          <i className="h-2 w-[2px] bg-emerald-400/80" />
                          <i className="h-2.5 w-[2px] bg-emerald-400/80" />
                        </span>
                      </div>
                      <h3 className="font-dot text-[18px] font-bold uppercase leading-tight text-emerald-100">
                        {cardTitle}
                      </h3>
                      <p className="mt-2 font-dot text-[11px] normal-case leading-snug text-emerald-200/90">
                        {desc}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-emerald-300/70">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        online
                      </div>
                    </div>
                  </div>

                  {/* controls: d-pad + OK */}
                  <div className="mt-3 flex items-center justify-between px-2">
                    <div className="relative h-9 w-9" aria-hidden="true">
                      <span className="absolute left-1/2 top-1/2 h-9 w-3 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-white/10" />
                      <span className="absolute left-1/2 top-1/2 h-3 w-9 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-white/10" />
                      <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/80" />
                    </div>
                    <GripHorizontal className="h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-white/40" />
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-400/40 bg-orange-400/15 font-mono text-[8px] uppercase text-orange-300/90"
                      aria-hidden="true"
                    >
                      ok
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
