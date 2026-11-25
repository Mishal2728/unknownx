import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Code, Cpu, Globe, LockKeyhole, Network, Rocket, Server, Shield, ShieldCheck, Terminal, Workflow, Zap } from 'lucide-react';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

const terminalServices = [
  { id: '01', icon: Globe, command: 'onion-service --provision', title: { en: 'Private onion service', ru: 'Частный onion-сервис' }, text: { en: 'Your own Tor onion endpoint for privacy-conscious publishing and private service access. Availability and anonymity depend on the full operating environment.', ru: 'Собственный onion-адрес Tor для публикации с фокусом на приватность и частного доступа к сервисам. Доступность и анонимность зависят от всей среды эксплуатации.' } },
  { id: '02', icon: Network, command: 'crypto-node --deploy', title: { en: 'Your own crypto node', ru: 'Собственный криптоузел' }, text: { en: 'A customer-controlled full node for independent blockchain access, validation, and application connectivity. Chain, storage, and operating requirements are scoped first.', ru: 'Полный узел под вашим контролем для независимого доступа к блокчейну, проверки данных и подключения приложений. Сеть, хранилище и требования согласуются заранее.' } },
  { id: '03', icon: Server, command: 'hosting --harden', title: { en: 'Privacy-minded hosting & servers', ru: 'Хостинг и серверы с фокусом на приватность' }, text: { en: 'Managed hosting and isolated server environments with access controls, updates, backups, and clear provider boundaries.', ru: 'Управляемый хостинг и изолированные серверы с контролем доступа, обновлениями, резервными копиями и понятными границами ответственности провайдеров.' } },
  { id: '04', icon: LockKeyhole, command: 'vpn-tunnel --configure', title: { en: 'Private VPN tunnel', ru: 'Частный VPN-туннель' }, text: { en: 'Private connectivity for authorized company devices and home offices, with access scoped to your organization.', ru: 'Частное подключение корпоративных устройств и домашних офисов с доступом, ограниченным потребностями вашей организации.' } },
  { id: '05', icon: Shield, command: 'proxy --configure-policy', title: { en: 'Business proxy infrastructure', ru: 'Прокси-инфраструктура для бизнеса' }, text: { en: 'Proxy setups for approved business workflows, with clear ownership, access policy, and operating limits.', ru: 'Прокси для разрешённых бизнес-процессов с понятными владельцами, политиками доступа и рабочими ограничениями.' } },
  { id: '06', icon: Workflow, command: 'automation --build', title: { en: 'Apps & automation', ru: 'Приложения и автоматизация' }, text: { en: 'Purpose-built internal apps, integrations, and automations that reduce repetitive work and make operations easier.', ru: 'Внутренние приложения, интеграции и автоматизация для сокращения рутины и упрощения рабочих процессов.' } },
];

export default function Home() {
  const { language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, 100]);
  const sequenceRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sequenceProgress } = useScroll({ target: sequenceRef, offset: ['start 75%', 'end 25%'] });
  const asteroidY = useTransform(sequenceProgress, [0, 1], ['0%', '100%']);
  const ru = language === 'ru';

  const copy = ru ? {
    eyebrow: 'Разработка сайтов и хостинг', title: 'Создайте свой бизнес', highlight: 'с нами.',
    description: 'Полный цикл услуг — от дизайна до запуска. Мы создаём быстрые и качественные сайты, а также надёжную инфраструктуру, чтобы вы могли сосредоточиться на своём бизнесе.',
    cta: 'Начать', introTitle: 'Вне горизонта событий.',
    introP1: 'Интернет огромен, шумен и постоянно меняется. Чтобы выделиться, нужен не шаблон, а продуманная цифровая система.',
    introP2: 'Tonrax работает на стыке инженерии и дизайна, создавая быстрые, надёжные и масштабируемые цифровые продукты.',
    capabilities: '01 / Возможности', infra: '02 / Инфраструктура', sequence: '03 / Последовательность запуска', work: '04 / Системы', crew: '05 / Удалённая команда',
    terminalEyebrow: 'Системный каталог / доступен для настройки', terminalTitle: 'Ваша инфраструктура. Ваши правила.', terminalIntro: 'От собственного onion-сервиса и криптоузла до серверов, VPN и автоматизации — спроектируем рабочую систему под ваши задачи.', terminalPrompt: 'tonrax@control:~$ services --list', terminalNote: 'Это презентационный каталог, а не работающая консоль. Каждая услуга предоставляется в согласованном объёме.',
  } : {
    eyebrow: 'Web Development & Hosting Solutions', title: 'Build Your Business', highlight: 'With Us.',
    description: 'Complete web services from design to deployment. We build stunning, high-performance websites and provide reliable hosting so you can focus on your business.',
    cta: 'Get Started', introTitle: 'Beyond the Event Horizon.',
    introP1: 'The internet is vast, noisy, and constantly changing. Standing out requires more than a template—it requires a complete digital system.',
    introP2: 'Tonrax operates at the intersection of high-performance engineering and thoughtful design, creating fast, resilient, and scalable digital experiences.',
    capabilities: '01 / Capabilities', infra: '02 / Infrastructure', sequence: '03 / Launch Sequence', work: '04 / Orbital Systems', crew: '05 / Remote Crew',
    terminalEyebrow: 'Systems catalog / available to scope', terminalTitle: 'Your infrastructure. Your rules.', terminalIntro: 'From your own onion service and crypto node to private servers, VPN, and automation—we design systems around the way you work.', terminalPrompt: 'tonrax@control:~$ services --list', terminalNote: 'This is a presentation catalog, not an interactive shell. Each service is delivered within an agreed scope.',
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Starfield /><CursorDot /><Navigation />
      <main className="relative z-10">
        <section className="relative flex h-[100dvh] flex-col items-center justify-center px-4 text-center">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="mx-auto mt-20 max-w-5xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="mb-6 font-mono text-sm uppercase tracking-[0.3em] text-orange-400 md:text-base">{copy.eyebrow}</div>
              <h1 className="mb-8 text-6xl font-bold leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl">{copy.title}<br /><span className="bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">{copy.highlight}</span></h1>
              <p className="mx-auto mb-12 max-w-2xl font-serif text-lg leading-relaxed text-gray-400 md:text-xl">{copy.description}</p>
              <a href="/contact" className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-mono text-sm uppercase tracking-widest transition-colors hover:bg-orange-300 hover:text-black">{copy.cta}<ArrowRight className="h-4 w-4" /></a>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3" aria-hidden="true"><span className="h-12 w-px bg-gradient-to-b from-gray-500 to-transparent" /></motion.div>
        </section>

        <section id="systems" className="border-y border-emerald-400/20 bg-[#030706]/95 py-20 backdrop-blur-md md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <FadeIn>
              <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-emerald-300"><Terminal className="h-4 w-4" />{copy.terminalEyebrow}</div>
              <h2 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">{copy.terminalTitle}</h2>
              <p className="mt-5 max-w-3xl font-serif text-lg leading-relaxed text-gray-400">{copy.terminalIntro}</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="mt-10 overflow-hidden border border-emerald-300/25 bg-black/90 shadow-[0_0_70px_rgba(16,185,129,.08)]">
                <div className="flex items-center justify-between border-b border-emerald-300/15 bg-emerald-300/[.04] px-4 py-3"><div className="flex items-center gap-2" aria-hidden="true"><i className="h-2.5 w-2.5 rounded-full bg-red-400/80" /><i className="h-2.5 w-2.5 rounded-full bg-yellow-300/80" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" /></div><span className="font-mono text-[9px] uppercase tracking-[.18em] text-emerald-100/50">TONRAX / SERVICE CONSOLE</span><span className="w-10" /></div>
                <div className="p-5 sm:p-8">
                  <div className="mb-7 font-mono text-xs leading-relaxed text-emerald-200 sm:text-sm"><span className="text-emerald-400">{copy.terminalPrompt}</span><br /><span className="text-emerald-100/50">{ru ? 'Загрузка каталога сервисов...' : 'Loading service catalog...'}</span></div>
                  <div className="grid gap-px border border-emerald-300/10 bg-emerald-300/10 md:grid-cols-2 lg:grid-cols-3">
                    {terminalServices.map(({ id, icon: Icon, command, title, text }) => <article key={id} className="group bg-[#050908] p-5 transition-colors hover:bg-emerald-300/[.04] sm:p-6"><div className="mb-5 flex items-center justify-between"><span className="font-mono text-[10px] tracking-widest text-emerald-300/60">[{id}]</span><Icon className="h-4 w-4 text-emerald-300/70 transition-colors group-hover:text-emerald-200" /></div><div className="mb-3 break-all font-mono text-[10px] text-emerald-300 sm:text-xs"><span className="text-emerald-100/40">$ </span>{command}</div><h3 className="mb-3 text-lg font-semibold text-white">{title[language]}</h3><p className="text-sm leading-relaxed text-gray-400">{text[language]}</p></article>)}
                  </div>
                  <div className="mt-6 flex items-start gap-3 border-t border-emerald-300/10 pt-5 font-mono text-[10px] leading-relaxed text-emerald-100/50"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/70" />{copy.terminalNote}</div>
                  <a href="/services" className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-200 transition-colors hover:text-white">{ru ? 'Открыть полный каталог услуг' : 'Open the full service catalog'}<ArrowRight className="h-4 w-4" /></a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-32 md:px-20 md:py-48">
          <div className="grid items-center gap-16 md:grid-cols-2"><FadeIn><h2 className="text-4xl font-bold tracking-tight md:text-6xl">{copy.introTitle}</h2></FadeIn><FadeIn delay={0.2}><div className="space-y-6 font-serif text-xl leading-relaxed text-gray-400 md:text-2xl"><p>{copy.introP1}</p><p>{copy.introP2}</p></div></FadeIn></div>
        </section>

        <section id="services" className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6 md:px-20"><FadeIn><div className="mb-16 font-mono text-sm uppercase tracking-widest text-orange-400">{copy.capabilities}</div></FadeIn><div className="grid gap-12 md:grid-cols-3">{[
          { icon: <Globe className="h-8 w-8" />, title: ru ? 'Дизайн интерфейсов' : 'Interface Design', text: ru ? 'Визуальные системы и интерфейсы, которые естественно работают для пользователей.' : 'Visual systems and interfaces that feel native to the human touch.' },
          { icon: <Code className="h-8 w-8" />, title: ru ? 'Frontend-инжиниринг' : 'Frontend Engineering', text: ru ? 'Быстрые и адаптивные сайты на современных технологиях.' : 'High-performance websites built with modern frameworks.' },
          { icon: <Rocket className="h-8 w-8" />, title: ru ? 'Цифровая стратегия' : 'Digital Strategy', text: ru ? 'Архитектура, пользовательские сценарии и план развития продукта.' : 'Architecture, user flows, and a clear path for product growth.' },
        ].map((item, i) => <FadeIn key={item.title} delay={i * 0.2}><div className="h-full border border-white/10 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.05]"><div className="mb-6 text-gray-500">{item.icon}</div><h3 className="mb-4 text-2xl font-bold">{item.title}</h3><p className="font-serif leading-relaxed text-gray-400">{item.text}</p></div></FadeIn>)}</div></div></section>

        <section id="hosting" className="relative overflow-hidden px-6 py-32 md:px-20 md:py-48"><div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/20 blur-[120px]" /><div className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2"><div><FadeIn><div className="mb-6 font-mono text-sm uppercase tracking-widest text-orange-400">{copy.infra}</div><h2 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl">Tonrax Hosting.</h2><p className="mb-10 font-serif text-xl leading-relaxed text-gray-400">{ru ? 'Надёжная инфраструктура с низкой задержкой, резервным копированием и продуманной безопасностью.' : 'Reliable infrastructure with low-latency delivery, backups, and practical security.'}</p><ul className="space-y-4 font-mono text-sm tracking-wide text-gray-300"><li className="flex items-center gap-3"><Zap className="h-4 w-4 text-orange-400" />{ru ? 'Глобальная доставка' : 'Global delivery'}</li><li className="flex items-center gap-3"><Shield className="h-4 w-4 text-orange-400" />{ru ? 'Защита от DDoS' : 'DDoS protection'}</li><li className="flex items-center gap-3"><Cpu className="h-4 w-4 text-orange-400" />{ru ? 'Выделенные ресурсы' : 'Dedicated resources'}</li></ul></FadeIn></div><FadeIn delay={0.3}><div className="relative flex aspect-square items-center justify-center rounded-full border border-white/10 bg-black/50"><div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border border-orange-500/30" /><div className="absolute inset-4 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-blue-500/20" /><div className="flex h-32 w-32 items-center justify-center rounded-full bg-black text-center shadow-[0_0_50px_rgba(255,150,0,0.5)]"><span className="font-mono text-xs tracking-widest text-orange-400">99.999%<br />UPTIME</span></div></div></FadeIn></div></section>

        <section ref={sequenceRef} className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6 md:px-20"><FadeIn><div className="mb-16 font-mono text-sm uppercase tracking-widest text-orange-400">{copy.sequence}</div></FadeIn><div className="relative pl-14 md:pl-20"><div className="absolute bottom-3 left-[0.65rem] top-1 w-px bg-white/20 md:left-[1.15rem]"><motion.div className="absolute inset-0 origin-top bg-white/80" style={{ scaleY: sequenceProgress }} /><motion.div className="absolute h-4 w-4 -translate-x-1.5 rounded-full border border-white bg-black" style={{ top: asteroidY }} /></div>{[
          { num: 'T-MINUS 04', title: ru ? 'Изучение' : 'Discovery', text: ru ? 'Уточняем цели, аудиторию и требования.' : 'We clarify goals, audience, and requirements.' },
          { num: 'T-MINUS 03', title: ru ? 'Дизайн' : 'Design', text: ru ? 'Создаём визуальную и пользовательскую систему.' : 'We shape the visual and user experience.' },
          { num: 'T-MINUS 02', title: ru ? 'Инжиниринг' : 'Engineering', text: ru ? 'Реализуем frontend, backend и инфраструктуру.' : 'We build the frontend, backend, and infrastructure.' },
          { num: 'T-MINUS 01', title: ru ? 'Тестирование' : 'Testing', text: ru ? 'Проверяем качество, производительность и безопасность.' : 'We verify quality, performance, and security.' },
          { num: ru ? 'СТАРТ' : 'LIFTOFF', title: ru ? 'Запуск' : 'Deployment', text: ru ? 'Разворачиваем и сопровождаем результат.' : 'We deploy and support the finished system.' },
        ].map((step, i) => <FadeIn key={step.num} delay={i * 0.1}><div className="mb-12 border-b border-white/10 pb-12"><div className="mb-4 font-mono text-sm tracking-widest text-orange-200">{step.num}</div><h3 className="mb-3 text-2xl font-bold">{step.title}</h3><p className="max-w-2xl font-serif leading-relaxed text-gray-400">{step.text}</p></div></FadeIn>)}</div></div></section>

        <section className="mx-auto max-w-7xl px-6 py-32 md:px-20 md:py-48"><FadeIn><div className="mb-16 font-mono text-sm uppercase tracking-widest text-orange-400">{copy.work}</div><div className="mb-20 max-w-3xl"><h2 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">{ru ? 'Всё для запуска.' : 'Everything for launch.'}</h2><p className="font-serif text-xl leading-relaxed text-gray-400">{ru ? 'Цифровая система, спроектированная как единое целое.' : 'A complete digital system designed as one connected whole.'}</p></div></FadeIn><div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">{[
          ru ? ['Сигнал', 'Чёткая брендовая и пользовательская система'] : ['Signal', 'Clear brand and user experience'],
          ru ? ['Ядро', 'Надёжная frontend/backend-разработка'] : ['Core', 'Reliable frontend and backend engineering'],
          ru ? ['Орбита', 'Хостинг, безопасность и сопровождение'] : ['Orbit', 'Hosting, security, and ongoing support'],
        ].map((item) => <div key={item[0]} className="min-h-72 bg-black/70 p-8 md:p-10"><h3 className="mb-5 text-4xl font-bold text-orange-200">{item[0]}</h3><p className="font-serif text-lg leading-relaxed text-gray-400">{item[1]}</p></div>)}</div></section>

        <section id="careers" className="border-t border-white/5 bg-black/40 px-6 py-32 md:px-20 md:py-44"><div className="mx-auto max-w-7xl"><FadeIn><div className="mb-16 font-mono text-sm uppercase tracking-widest text-orange-400">{copy.crew}</div></FadeIn><div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]"><FadeIn><div><span className="mb-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-orange-200"><i className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{ru ? 'Набор открыт' : 'Hiring remotely'}</span><h2 className="mb-7 text-5xl font-bold tracking-tight md:text-7xl">{ru ? 'Стройте из любой точки.' : 'Build from any orbit.'}</h2><p className="max-w-xl font-serif text-xl leading-relaxed text-gray-400">{ru ? 'Мы ищем внимательных удалённых специалистов, которым важны качество и детали.' : 'We are looking for thoughtful remote builders who care about quality and detail.'}</p><a href="/apply" className="mt-10 inline-flex items-center gap-4 border-b border-white/40 pb-3 font-mono text-xs uppercase tracking-[0.2em] text-orange-200">{ru ? 'Отправить координаты' : 'Send your coordinates'}<ArrowRight className="h-4 w-4" /></a></div></FadeIn><FadeIn><div className="border border-white/10 bg-black/70 p-7 font-mono md:p-9"><div className="mb-6 flex justify-between border-b border-white/10 pb-5 text-xs text-gray-500"><span>{ru ? 'Открытые роли' : 'Open positions'}</span><span className="text-emerald-300">{ru ? 'Удалённо' : 'Remote'}</span></div>{(ru ? ['Frontend-инженер', 'Backend-инженер', 'Platform-инженер'] : ['Frontend engineer', 'Backend engineer', 'Platform engineer']).map((role) => <div key={role} className="mb-5 text-lg text-orange-200">{role}</div>)}</div></FadeIn></div></div></section>

        <section className="border-t border-white/5 bg-black/50 py-32 text-center backdrop-blur-md"><FadeIn><Rocket className="mx-auto mb-6 h-8 w-8 text-orange-400" /><h2 className="mb-8 text-5xl font-bold tracking-tight text-orange-200 md:text-8xl">{ru ? 'Готовы к запуску?' : 'Ready to Launch?'}</h2><p className="mx-auto mb-12 max-w-2xl font-serif text-xl text-gray-400">{ru ? 'Давайте обсудим, как мы можем помочь вашему проекту.' : 'Let’s discuss how we can help your project.'}</p><a href="/contact" className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-orange-300 hover:text-black">{ru ? 'Запланировать консультацию' : 'Schedule Consultation'}<ArrowRight className="h-4 w-4" /></a></FadeIn></section>
      </main>
    </div>
  );
}
