import { ArrowRight, EyeOff, Globe2, LockKeyhole, Network, Server, ShieldCheck, Workflow } from 'lucide-react';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

const serviceCards = [
  {
    icon: Server,
    title: { en: 'Privacy-minded hosting', ru: 'Хостинг с заботой о приватности' },
    text: { en: 'Managed hosting and deployment built around clear access controls, sensible hardening, and a footprint you understand.', ru: 'Управляемый хостинг и развёртывание с понятным контролем доступа, базовым усилением защиты и прозрачным цифровым следом.' },
  },
  {
    icon: Network,
    title: { en: 'Private network access', ru: 'Доступ к частной сети' },
    text: { en: 'Plan a private VPN tunnel for approved company devices, locations, and home offices—with access scoped to your needs.', ru: 'Спроектируем частный VPN-туннель для устройств компании, офисов и удалённой работы с доступом по вашим правилам.' },
  },
  {
    icon: Workflow,
    title: { en: 'Apps & automation', ru: 'Приложения и автоматизация' },
    text: { en: 'Practical internal tools and integrations that reduce repetitive work and keep business processes moving.', ru: 'Внутренние инструменты и интеграции, которые сокращают рутину и помогают бизнес-процессам работать слаженно.' },
  },
];

function FootprintMap({ language }: { language: 'en' | 'ru' }) {
  return (
    <div className="relative overflow-hidden border border-emerald-300/20 bg-[#06100f]/90 p-5 shadow-[0_0_70px_rgba(16,185,129,0.07)] sm:p-7" aria-label={language === 'ru' ? 'Схематичная карта цифровой инфраструктуры' : 'Schematic digital infrastructure map'}>
      <div className="mb-5 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-200/70">
        <span>{language === 'ru' ? 'Схема / цифровой периметр' : 'Schematic / digital perimeter'}</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />{language === 'ru' ? 'Концепция' : 'Concept'}</span>
      </div>
      <svg viewBox="0 0 640 330" role="img" aria-label={language === 'ru' ? 'Схематичная сеть узлов и защищённых соединений' : 'Illustrative network of nodes and protected connections'} className="h-auto w-full">
        <defs>
          <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(110,231,183,.08)" strokeWidth="1" /></pattern>
          <radialGradient id="map-glow"><stop stopColor="#34d399" stopOpacity=".23" /><stop offset="1" stopColor="#34d399" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="640" height="330" fill="url(#map-grid)" />
        <ellipse cx="320" cy="165" rx="260" ry="125" fill="url(#map-glow)" />
        <path d="M82 112 202 82 275 130 347 95 467 126 552 88M82 112l69 112 124-94 86 91 106-95 85 81M151 224l126-94 84 91 102 31 85-107M202 82l73 48 72-35 120 31" fill="none" stroke="#34d399" strokeOpacity=".48" strokeWidth="1.3" strokeDasharray="5 7" />
        <path d="M82 112 151 224 275 130 361 221 467 126 552 207" fill="none" stroke="#a7f3d0" strokeOpacity=".65" strokeWidth="1" />
        {[[82,112],[202,82],[275,130],[347,95],[467,126],[552,88],[151,224],[361,221],[552,207],[463,252]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r="11" fill="#34d399" opacity=".1" /><circle cx={cx} cy={cy} r="3.5" fill={i === 2 ? '#fbbf24' : '#a7f3d0'} /><circle cx={cx} cy={cy} r="1.4" fill="#fff" /></g>)}
        <text x="275" y="159" fill="#a7f3d0" fontSize="10" fontFamily="monospace" textAnchor="middle">PRIVATE CORE</text>
        <text x="82" y="139" fill="#6ee7b7" fontSize="9" fontFamily="monospace">EDGE / 01</text>
        <text x="468" y="153" fill="#6ee7b7" fontSize="9" fontFamily="monospace">EDGE / 02</text>
        <text x="361" y="247" fill="#6ee7b7" fontSize="9" fontFamily="monospace">TEAM ACCESS</text>
      </svg>
      <p className="mt-3 border-t border-emerald-300/10 pt-4 font-mono text-[10px] leading-relaxed text-emerald-100/50">{language === 'ru' ? 'Иллюстрация для концепции — не карта реальных серверов и не мониторинг в реальном времени.' : 'Illustrative concept only—not a map of live infrastructure or real-time monitoring.'}</p>
    </div>
  );
}

export default function Home() {
  const { language } = useLanguage();
  const ru = language === 'ru';
  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-emerald-400/30">
      <Starfield /><CursorDot /><Navigation />
      <main className="relative z-10">
        <section className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-14 px-6 pb-20 pt-32 md:px-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <FadeIn>
            <div className="mb-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[.22em] text-emerald-300"><span className="h-px w-9 bg-emerald-300" />{ru ? 'Цифровая инфраструктура / Tonrax' : 'Digital infrastructure / Tonrax'}</div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">{ru ? 'Ваш бизнес в сети.' : 'Your business online.'}<br /><span className="text-emerald-300">{ru ? 'Меньше лишнего следа.' : 'Less unnecessary exposure.'}</span></h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">{ru ? 'Хостинг, частные серверы, защищённые сетевые подключения и программные решения для компаний, которым важны контроль, конфиденциальность и надёжная работа.' : 'Hosting, private servers, secure network connections, and software solutions for organizations that value control, privacy, and dependable operations.'}</p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">{ru ? 'Приватность — это продуманная архитектура и ��розрачные компромиссы, а не обещание полной невидимости.' : 'Privacy is thoughtful architecture and clear trade-offs—not a promise of complete invisibility.'}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="/contact#contact-form" className="inline-flex items-center gap-3 bg-emerald-300 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[.14em] text-black transition-colors hover:bg-white">{ru ? 'Обсудить задачу' : 'Discuss your project'} <ArrowRight className="h-4 w-4" /></a>
              <a href="/services" className="inline-flex items-center gap-3 border border-white/20 px-6 py-4 font-mono text-xs uppercase tracking-[.14em] text-white transition-colors hover:border-emerald-300 hover:text-emerald-200">{ru ? 'Изучить услуги' : 'Explore services'}</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[10px] uppercase tracking-[.14em] text-gray-500"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" />{ru ? 'Безопасность по умолчанию' : 'Security-conscious by design'}</span><span className="flex items-center gap-2"><EyeOff className="h-4 w-4 text-emerald-300" />{ru ? 'Контроль доступа' : 'Access under your control'}</span></div>
          </FadeIn>
          <FadeIn delay={0.15}><FootprintMap language={language} /></FadeIn>
        </section>

        <section className="border-y border-white/10 bg-black/55 py-20 backdrop-blur-md md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <FadeIn><div className="mb-5 font-mono text-xs uppercase tracking-[.2em] text-emerald-300">{ru ? '01 / Подход' : '01 / Our approach'}</div><div className="grid gap-8 md:grid-cols-[.8fr_1.2fr]"><h2 className="text-3xl font-semibold leading-tight md:text-5xl">{ru ? 'Приватность начинается с ясного понимания рисков.' : 'Privacy starts with understanding the risks.'}</h2><p className="max-w-3xl text-lg leading-relaxed text-gray-400">{ru ? 'Мы помогаем уменьшать ненужную публичную экспозицию, грамотно разделять доступы и выбирать подходящую инфраструктуру. Объясняем, что защищается, кто ещё участвует в цепочке и какие ограничения остаются.' : 'We help reduce unnecessary public exposure, separate access sensibly, and choose infrastructure that fits. We explain what is protected, which providers are involved, and what limitations remain.'}</p></div></FadeIn>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <FadeIn><div className="mb-5 font-mono text-xs uppercase tracking-[.2em] text-emerald-300">{ru ? '02 / Системы' : '02 / Systems'}</div><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="max-w-2xl text-4xl font-semibold md:text-6xl">{ru ? 'Технологии, которые снимают трение.' : 'Technology that removes friction.'}</h2><a href="/services" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-200 hover:text-white">{ru ? 'Все услуги' : 'All services'} <ArrowRight className="h-4 w-4" /></a></div></FadeIn>
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">{serviceCards.map(({ icon: Icon, title, text }, i) => <FadeIn key={title.en} delay={i * .08}><article className="h-full bg-[#080b0b] p-7 transition-colors hover:bg-emerald-300/[.04] md:p-9"><Icon className="mb-8 h-7 w-7 text-emerald-300" /><h3 className="mb-4 text-2xl font-semibold">{title[language]}</h3><p className="leading-relaxed text-gray-400">{text[language]}</p></article></FadeIn>)}</div>
        </section>

        <section className="border-y border-white/10 bg-[#07100f]/75 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-12 lg:grid-cols-2 lg:items-center">
            <FadeIn><div className="font-mono text-xs uppercase tracking-[.2em] text-emerald-300">{ru ? '03 / Почему Tonrax' : '03 / Why Tonrax'}</div><h2 className="mt-5 text-4xl font-semibold md:text-5xl">{ru ? 'Без лишнего шума. С ясной ответственностью.' : 'Less noise. Clear accountability.'}</h2><p className="mt-6 max-w-xl leading-relaxed text-gray-400">{ru ? 'Мы начинаем с ваших задач и модели угроз, а не с громких обещаний. Вы получаете понятный объём работ, документацию и согласованные границы поддержки.' : 'We start with your needs and threat model—not sweeping claims. You get a defined scope, useful documentation, and agreed support boundaries.'}</p></FadeIn>
            <div className="grid gap-4 sm:grid-cols-2">{[
              { icon: LockKeyhole, title: { en: 'Least privilege', ru: 'Минимум привилегий' }, text: { en: 'Access is scoped to the people and systems that need it.', ru: 'Доступы ограничиваются людьми и системами, которым они нужны.' } },
              { icon: Globe2, title: { en: 'Know the footprint', ru: 'Понимание следа' }, text: { en: 'Clear view of the services and providers in the design.', ru: 'Понятная схема сервисов и поставщиков в архитектуре.' } },
            ].map(({ icon: Icon, title, text }) => <article key={title.en} className="border border-emerald-200/15 bg-black/30 p-6"><Icon className="mb-5 h-5 w-5 text-emerald-300" /><h3 className="mb-2 font-semibold">{title[language]}</h3><p className="text-sm leading-relaxed text-gray-400">{text[language]}</p></article>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32"><FadeIn><p className="font-mono text-xs uppercase tracking-[.2em] text-emerald-300">{ru ? 'Следующий шаг' : 'Next step'}</p><h2 className="mt-5 text-4xl font-semibold md:text-6xl">{ru ? 'Давайте спроектируем ваш цифровой периметр.' : 'Let’s design your digital perimeter.'}</h2><p className="mx-auto mt-6 max-w-2xl leading-relaxed text-gray-400">{ru ? 'Расскажите о команде, системах и задаче. Мы ответим с уточняющими вопросами и предложим подходящий формат разговора.' : 'Tell us about your team, systems, and goals. We’ll follow up with questions and suggest a practical way to scope the work.'}</p><a href="/contact#contact-form" className="mt-8 inline-flex items-center gap-3 border border-emerald-300 px-7 py-4 font-mono text-xs uppercase tracking-widest text-emerald-200 transition-colors hover:bg-emerald-300 hover:text-black">{ru ? 'Связаться с нами' : 'Contact the team'} <ArrowRight className="h-4 w-4" /></a></FadeIn></section>
      </main>
    </div>
  );
}
