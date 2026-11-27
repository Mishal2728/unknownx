import { LucideIcon, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';

type Localized = { en: string; ru: string };
export type RackService = {
  id: string;
  icon: LucideIcon;
  command: string;
  title: Localized;
  text: Localized;
};

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function telemetry(id: string) {
  const n = parseInt(id, 10) || 1;
  const latency = 6 + ((n * 7) % 24);
  const uptime = (99.7 + ((n * 3) % 3) / 10).toFixed(1);
  return { latency, uptime };
}

export function ServiceRack({
  services,
  language,
  ru,
  copy,
}: {
  services: RackService[];
  language: 'en' | 'ru';
  ru: boolean;
  copy: { terminalNote: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const n = services.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) { setShown(n); return; }
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      let c = 0;
      const id = window.setInterval(() => {
        c += 1;
        setShown(c);
        if (c >= n) window.clearInterval(id);
      }, 130);
    };
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) start(); }),
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [n]);

  const current = active !== null ? services[active] : null;

  return (
    <div
      ref={ref}
      className="mt-10 grid gap-8 overflow-hidden border border-emerald-300/25 bg-black/90 p-5 shadow-[0_0_70px_rgba(16,185,129,.08)] sm:p-8 lg:grid-cols-[1fr_320px]"
    >
      {/* rack scene */}
      <div className="rack-scene flex items-center justify-center py-4">
        <div className="rack-3d w-full max-w-[420px]">
          {/* top cap */}
          <div className="flex items-center justify-between border border-emerald-300/30 bg-[#0a0f0d] px-4 py-2 font-mono text-[9px] uppercase tracking-[.18em] text-emerald-300/70">
            <span>TONRAX // RACK-01</span>
            <span className="inline-flex items-center gap-1.5">
              <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {ru ? 'ПИТАНИЕ' : 'PWR'}
            </span>
          </div>

          {/* rack units */}
          <div className="space-y-1.5 border-x border-emerald-300/20 bg-[#030504] px-2.5 py-2.5">
            {services.map(({ id, icon: Icon, command, title }, i) => {
              const on = active === i;
              const revealed = shown > i;
              return (
                <button
                  key={id}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`rack-unit ${on ? 'on' : ''} group flex w-full items-center gap-3 border bg-gradient-to-r from-[#0a110e] to-[#060a08] px-3 py-2.5 text-left ${
                    on
                      ? 'border-emerald-300/70 shadow-[0_0_26px_rgba(16,185,129,0.4)]'
                      : 'border-emerald-300/15 hover:border-emerald-300/40'
                  }`}
                  style={{
                    opacity: revealed ? 1 : 0,
                    transitionProperty: 'transform, box-shadow, border-color, background-color, opacity',
                  }}
                  aria-label={title[language]}
                >
                  {/* LED cluster */}
                  <span className="flex shrink-0 items-center gap-1">
                    <i className={`led h-1.5 w-1.5 rounded-full ${on ? 'bg-emerald-300' : 'bg-emerald-400/70'}`} style={{ animationDelay: `${i * 0.2}s` }} />
                    <i className="led h-1.5 w-1.5 rounded-full bg-yellow-300/70" style={{ animationDelay: `${i * 0.2 + 0.4}s` }} />
                    <i className="led h-1.5 w-1.5 rounded-full bg-red-400/60" style={{ animationDelay: `${i * 0.2 + 0.8}s` }} />
                  </span>

                  {/* id + icon */}
                  <span className="shrink-0 font-mono text-[9px] tracking-widest text-emerald-300/50">[{id}]</span>
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${on ? 'text-emerald-200' : 'text-emerald-300/60'}`} />

                  {/* label */}
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-emerald-200/90">{command}</span>

                  {/* vents */}
                  <span className="hidden shrink-0 items-center gap-[2px] sm:flex" aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, v) => (
                      <i key={v} className="h-3.5 w-[2px] bg-emerald-300/15" />
                    ))}
                  </span>

                  {/* status */}
                  <span className="shrink-0 font-mono text-[8px] uppercase tracking-[.1em] text-emerald-300/70">{ru ? 'РАБ' : 'RUN'}</span>
                </button>
              );
            })}
          </div>

          {/* base / PSU */}
          <div className="flex items-center justify-between border border-emerald-300/30 bg-[#0a0f0d] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[.16em] text-emerald-100/40">
            <span>PSU · 2×750W</span>
            <span className="flex items-center gap-2" aria-hidden="true">
              <i className="h-3 w-3 rounded-full border border-emerald-300/30" />
              <i className="h-3 w-3 rounded-full border border-emerald-300/30" />
            </span>
          </div>
        </div>
      </div>

      {/* detail panel */}
      <div className="flex min-h-[220px] flex-col border border-emerald-300/15 bg-[#050908] p-5">
        <div className="mb-4 flex items-center justify-between border-b border-emerald-300/10 pb-3 font-mono text-[9px] uppercase tracking-[.18em] text-emerald-300/60">
          <span>{ru ? 'Юнит' : 'Unit'} {current ? `[${current.id}]` : '[--]'}</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-300/80">
            <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {ru ? 'В СЕТИ' : 'ONLINE'}
          </span>
        </div>

        {current ? (
          <div className="flex-1">
            <div className="mb-3 break-all font-mono text-[11px] text-emerald-300">
              <span className="text-emerald-100/40">$ </span>{current.command}
            </div>
            <h3 className="mb-3 text-lg font-semibold normal-case text-white">{current.title[language]}</h3>
            <p className="text-sm normal-case leading-relaxed text-gray-400">{current.text[language]}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-emerald-300/10 pt-3 font-mono text-[9px] uppercase tracking-[.14em] text-emerald-100/40">
              <span>~{telemetry(current.id).latency}ms</span>
              <span>{telemetry(current.id).uptime}%</span>
              <span className="text-emerald-300/50">[AES-256]</span>
              <span>PID:{(parseInt(current.id, 10) || 1) * 1033}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center font-mono text-xs leading-relaxed text-emerald-100/45">
            <p className="mb-2 text-emerald-300/70">RACK-01 // {n} {ru ? 'ЮНИТОВ' : 'UNITS'}</p>
            <p>{ru ? 'Наведите на юнит для просмотра сервиса.' : 'Hover a rack unit to inspect a service.'}</p>
          </div>
        )}

        <div className="mt-4 border-t border-emerald-300/10 pt-4 font-mono text-[9px] normal-case leading-relaxed text-emerald-100/40">
          {copy.terminalNote}
        </div>

        <Link
          href="/services"
          className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-200 transition-colors hover:text-white"
        >
          {ru ? 'Открыть полный каталог' : 'Open full catalog'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
