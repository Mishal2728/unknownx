import { ReactNode, useEffect, useRef, useState } from 'react';

import { Prompt, GlitchText } from '@/components/BlackIce';

type Card = { icon: ReactNode; title: string; text: string };

export function CapabilitiesScroll({
  cards,
  eyebrow,
  title,
  intro,
}: {
  cards: Card[];
  eyebrow: string;
  title: string;
  intro: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (i: number) => refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <section id="services" className="border-t border-white/5 bg-black/50 py-28 backdrop-blur-md md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* left — sticky heading + index */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-5 flex items-center gap-4">
            <Prompt cmd="./capabilities --list" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400/60">{eyebrow}</span>
          </div>
          <h2 className="text-fluid-h2 mb-5 max-w-xl font-bold tracking-tight"><GlitchText>{title}</GlitchText></h2>
          <p className="measure mb-10 font-serif leading-relaxed text-gray-400">{intro}</p>

          <div className="space-y-1 border-t border-white/10 pt-6">
            {cards.map((c, i) => (
              <button
                key={c.title}
                type="button"
                onClick={() => scrollTo(i)}
                className={`flex w-full items-center gap-4 py-2 text-left transition-colors ${active === i ? 'text-emerald-300' : 'text-gray-600 hover:text-gray-400'}`}
              >
                <span className="font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className={`h-px flex-none transition-all duration-300 ${active === i ? 'w-8 bg-emerald-400' : 'w-4 bg-gray-700'}`} />
                <span className="font-mono text-xs uppercase tracking-[0.1em]">{c.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* right — focus-on-scroll items */}
        <div className="space-y-24 lg:space-y-36">
          {cards.map((c, i) => (
            <div
              key={c.title}
              data-index={i}
              ref={(el) => { refs.current[i] = el; }}
              className="transition-all duration-500"
              style={{ opacity: active === i ? 1 : 0.28, filter: active === i ? 'none' : 'blur(0.5px)' }}
            >
              <div className="mb-6 flex items-center gap-4">
                <span className="font-mono text-sm tabular-nums text-emerald-300/70">{String(i + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</span>
                <span className={`h-px flex-1 transition-colors duration-500 ${active === i ? 'bg-emerald-400/50' : 'bg-white/10'}`} />
                <span className={`transition-colors duration-500 ${active === i ? 'text-emerald-300' : 'text-gray-600'}`}>{c.icon}</span>
              </div>
              <h3 className="text-fluid-h2-lg mb-6 font-bold leading-[0.95]">{c.title}</h3>
              <p className="max-w-xl font-serif text-lg normal-case leading-relaxed text-gray-400 md:text-xl">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
