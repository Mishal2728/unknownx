import { ArrowRight, Zap, Rocket } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { Prompt, GlitchText } from '@/components/BlackIce';
import { useLanguage } from '@/context/LanguageContext';

const plans = [
  { name: { en: 'Signal', ru: 'Сигнал' }, code: 'TIER / 01', price: '$159', period: { en: 'Project', ru: 'Проект' }, description: { en: 'A clear, high-converting digital presence for an early-stage idea.', ru: 'Чёткое цифровое присутствие для нового проекта.' }, features: { en: ['Custom design', 'Responsive frontend', 'Performance optimization', 'SEO foundation', 'Deployment assistance'], ru: ['Индивидуальный дизайн', 'Адаптивный frontend', 'Оптимизация производительности', 'Базовое SEO', 'Помощь с запуском'] } },
  { name: { en: 'Core', ru: 'Ядро' }, code: 'TIER / 02', price: '$459', period: { en: 'Project', ru: 'Проект' }, description: { en: 'A complete application built to support real business operations.', ru: 'Полноценное приложение для реальных бизнес-процессов.' }, features: { en: ['Everything in Signal', 'Full-stack development', 'Database architecture', 'API integrations', 'Admin dashboard', '3 months support'], ru: ['Всё из Signal', 'Full-stack разработка', 'Архитектура базы данных', 'Интеграции API', 'Админ-панель', '3 месяца поддержки'] }, featured: true },
  { name: { en: 'Orbit', ru: 'Орбита' }, code: 'TIER / 03', price: '$859', period: { en: 'Project', ru: 'Проект' }, description: { en: 'Managed infrastructure and a complete system for continued growth.', ru: 'Управляемая инфраструктура и система для дальнейшего роста.' }, features: { en: ['Everything in Core', 'Hosting setup', 'DDoS protection', 'Monitoring', 'Security review', 'Training and handover'], ru: ['Всё из Core', 'Настройка хостинга', 'Защита от DDoS', 'Мониторинг', 'Проверка безопасности', 'Обучение и передача'] } },
];

const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const VERSIONS = ['1.0.4', '2.4.1', '3.2.0'];

export default function Pricing() {
  const { language } = useLanguage();
  const ru = language === 'ru';
  const featuredIdx = plans.findIndex((p) => p.featured);
  const [sel, setSel] = useState(featuredIdx < 0 ? 0 : featuredIdx);
  const current = plans[sel];
  const pkg = slug(current.name.en);
  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30"><Starfield /><CursorDot /><Navigation /><main className="relative z-10 pt-20">
      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48"><FadeIn><div className="mb-6 flex items-center gap-4"><Prompt cmd="./pricing --tiers" /><span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400/60">{ru ? 'Цены и тарифы' : 'Pricing & Plans'}</span></div><h1 className="text-fluid-h1 max-w-5xl font-bold tracking-tighter"><GlitchText>{ru ? 'Инвестируйте в свою' : 'Invest in Your'}</GlitchText><br /><span className="bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">{ru ? 'цифровую орбиту.' : 'Digital Orbit.'}</span></h1><p className="measure text-body-soft mt-10 font-serif text-xl leading-relaxed md:text-2xl">{ru ? 'Прозрачные пакеты для веб-разработки, приложений и поддержки.' : 'Transparent packages for web development, applications, and ongoing support.'}</p></FadeIn></section>
      <section className="mx-auto max-w-5xl px-6 pb-32 md:px-12"><FadeIn><div className="border border-emerald-300/20 bg-[#030504] font-mono">
        {/* slider control */}
        <div className="border-b border-emerald-300/15 px-6 py-8 sm:px-10">
          <div className="mb-5 flex items-center justify-between text-[9px] uppercase tracking-[.18em] text-emerald-100/40">
            <span>tonrax // allocate tier</span>
            <span className="text-emerald-300/60">{ru ? 'перетащите ползунок' : 'drag the slider'}</span>
          </div>

          {/* tier name labels */}
          <div className="mb-3 flex justify-between text-[11px] uppercase tracking-[.12em]">
            {plans.map((plan, i) => (
              <button
                key={plan.code}
                type="button"
                onClick={() => setSel(i)}
                className={`transition-colors ${sel === i ? 'text-emerald-300' : 'text-emerald-100/40 hover:text-emerald-200/70'}`}
              >
                {plan.name[language]}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={0}
            max={plans.length - 1}
            step={1}
            value={sel}
            onChange={(e) => setSel(parseInt(e.target.value, 10))}
            className="tier-slider"
            aria-label="Select pricing tier"
          />

          {/* price ticks */}
          <div className="mt-3 flex justify-between text-[13px]">
            {plans.map((plan, i) => (
              <span key={plan.code} className={`text-crt font-bold transition-colors ${sel === i ? 'text-white' : 'text-gray-600'}`}>{plan.price}</span>
            ))}
          </div>
        </div>

        {/* detail panel */}
        <div key={sel} className="bg-[#050908] p-6 sm:p-8" style={{ animation: 'rise-fade .28s ease' }}>
          <div className="flex items-center justify-between border-b border-emerald-300/10 pb-4">
            <div className="break-all text-[13px] leading-relaxed text-emerald-300"><span className="text-emerald-100/40">$ </span>tonrax install {pkg} <span className="text-orange-300/80">--save</span></div>
            {current.featured && <span className="inline-flex shrink-0 items-center gap-1 text-[9px] uppercase tracking-widest text-orange-300"><Zap className="h-3 w-3 animate-pulse" />{ru ? 'реком.' : 'recommended'}</span>}
          </div>

          <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
            <div>
              <div className="space-y-1 text-[12px]">
                <div><span className="text-gray-500">package  </span><span className="text-white/90">@tonrax/{pkg}</span></div>
                <div><span className="text-gray-500">version  </span><span className="text-emerald-300/90">v{VERSIONS[sel]}</span></div>
                <div><span className="text-gray-500">license  </span><span className="text-gray-400 normal-case">commercial</span></div>
              </div>
              <p className="mt-5 max-w-md text-sm normal-case leading-relaxed text-gray-400">{current.description[language]}</p>
            </div>
            <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:text-right">
              <span className="text-crt text-5xl font-bold tracking-tight text-white">{current.price}</span>
              <span className="text-[11px] uppercase text-gray-500">/ {current.period[language]}</span>
            </div>
          </div>

          <div className="mb-2 mt-7 text-[10px] text-emerald-100/40">resolving dependencies...</div>
          <div className="mb-7 grid gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-2">
            {current.features[language].map((feature, fi) => (
              <div key={feature} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-emerald-400">+</span>
                <span className="whitespace-nowrap text-emerald-300/90">{slug(current.features.en[fi])}</span>
                <span className="min-w-0 text-gray-500 normal-case">{feature}</span>
              </div>
            ))}
          </div>

          <Link href="/contact#contact-form" className="btn-cta inline-flex w-full items-center justify-center gap-2 border border-white/20 px-6 py-3.5 text-center text-sm uppercase tracking-widest hover:border-orange-400 hover:text-orange-300 sm:w-auto">
            [ {ru ? 'установить' : 'install'} {pkg} ]<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div></FadeIn></section>
      <section className="border-t border-white/5 bg-black/50 py-32 text-center"><FadeIn><Rocket className="mx-auto mb-6 h-8 w-8 text-orange-400" /><h2 className="text-fluid-h1 mb-8 font-bold tracking-tight text-orange-200 text-glow-crimson"><GlitchText>{ru ? 'Готовы к запуску?' : 'Ready to Launch?'}</GlitchText></h2><Link href="/contact" className="btn-cta inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-orange-300 hover:text-black">{ru ? 'Запланировать консультацию' : 'Schedule Consultation'}<ArrowRight className="h-4 w-4" /></Link></FadeIn></section>
    </main></div>
  );
}
