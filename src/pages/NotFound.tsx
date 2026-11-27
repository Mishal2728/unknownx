import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

import { CursorDot } from '@/components/CursorDot';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { GlitchText } from '@/components/BlackIce';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();
  const ru = language === 'ru';

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Starfield />
      <CursorDot />
      <Navigation />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-red-300/70">
          <AlertTriangle className="h-4 w-4" />
          {ru ? 'Сигнал потерян / 404' : 'Signal lost / 404'}
        </div>

        <h1 className="text-fluid-hero font-bold text-glow-crimson"><GlitchText>404</GlitchText></h1>

        <p className="measure-tight text-body-soft mx-auto mt-6 font-serif text-lg leading-relaxed md:text-xl">
          {ru
            ? 'Эта координата вне зоны приёма. Страница сместилась с орбиты или никогда не существовала.'
            : 'This coordinate is outside the reception zone. The page drifted off orbit or never existed.'}
        </p>

        <div className="mt-6 inline-block border border-red-400/20 bg-black/60 px-5 py-3 font-mono text-xs tracking-widest text-red-300/80">
          <span className="text-red-300/50">ops@tonrax:~$</span>{' '}
          {ru ? 'маршрут не найден' : 'route not found'}
        </div>

        <Link
          href="/"
          className="btn-cta mt-12 inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-orange-300 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          {ru ? 'Вернуться на орбиту' : 'Return to orbit'}
        </Link>
      </main>
    </div>
  );
}
