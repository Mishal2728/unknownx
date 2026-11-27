import { ArrowRight, Check, ChevronDown, Code2, Globe2, LockKeyhole, Network, Rocket, Server, ShieldCheck, Workflow } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { Prompt, GlitchText } from '@/components/BlackIce';
import { useLanguage } from '@/context/LanguageContext';

const services = [
  { number: 'SERVICE / 01', icon: <Globe2 className="h-8 w-8" />, title: { en: 'Interface Design', ru: 'Дизайн интерфейсов' }, description: { en: 'Distinctive digital experiences designed around your brand and audience.', ru: 'Уникальный цифровой опыт, созданный под ваш бренд и аудиторию.' }, features: { en: ['Brand direction', 'Wireframes and UX flows', 'Responsive UI design', 'Interactive prototypes'], ru: ['Направление бренда', 'Wireframes и UX-сценарии', 'Адаптивный UI-дизайн', 'Интерактивные прототипы'] } },
  { number: 'SERVICE / 02', icon: <Code2 className="h-8 w-8" />, title: { en: 'Web Development', ru: 'Веб-разработка' }, description: { en: 'Fast, accessible websites and applications built to grow with your business.', ru: 'Быстрые и доступные сайты и приложения для развития вашего бизнеса.' }, features: { en: ['React and TypeScript', 'CMS and API integrations', 'Accessible builds', 'Testing and QA'], ru: ['React и TypeScript', 'Интеграции с CMS и API', 'Доступные сборки', 'Тестирование и QA'] } },
  { number: 'SERVICE / 03', icon: <Server className="h-8 w-8" />, title: { en: 'Managed Hosting', ru: 'Управляемый хостинг' }, description: { en: 'Reliable infrastructure that keeps your website available and secure.', ru: 'Надёжная инфраструктура для доступности и безопасности вашего сайта.' }, features: { en: ['Global delivery', 'TLS configuration', 'Backups and monitoring', 'Scaling support'], ru: ['Глобальная доставка', 'Настройка TLS', 'Резервные копии и мониторинг', 'Поддержка масштабирования'] } },
  { number: 'SERVICE / 04', icon: <ShieldCheck className="h-8 w-8" />, title: { en: 'Growth & Support', ru: 'Рост и поддержка' }, description: { en: 'A technical partner for maintenance, improvements, and the next stage of growth.', ru: 'Технический партнёр для обслуживания, улучшений и следующего этапа роста.' }, features: { en: ['Ongoing maintenance', 'Performance improvements', 'Feature development', 'Technical guidance'], ru: ['Постоянное обслуживание', 'Улучшение производительности', 'Разработка функций', 'Техническое сопровождение'] } },
  { number: 'SERVICE / 05', icon: <LockKeyhole className="h-8 w-8" />, title: { en: 'Anonymous Hosting', ru: 'Анонимный хостинг' }, description: { en: 'Hosting solutions designed to minimize unnecessary exposure and reduce publicly collected footprint details.', ru: 'Решения хостинга для минимизации лишней публикации данных и сокращения цифрового следа.' }, features: { en: ['Privacy-focused configuration', 'Least-access administration', 'Protected DNS options', 'Operational guidance'], ru: ['Конфигурация с фокусом на приватность', 'Администрирование по минимальным правам', 'Защищённые варианты DNS', 'Операционные рекомендации'] } },
  { number: 'SERVICE / 06', icon: <Server className="h-8 w-8" />, title: { en: 'Anonymous Servers', ru: 'Анонимные серверы' }, description: { en: 'Dedicated or isolated server environments tailored to a clearly defined use case and threat model.', ru: 'Выделенные или изолированные серверные среды под согласованный сценарий и модель рисков.' }, features: { en: ['Dedicated resources', 'Server hardening', 'Access segmentation', 'Maintenance planning'], ru: ['Выделенные ресурсы', 'Усиление сервера', 'Сегментация доступа', 'План обслуживания'] } },
  { number: 'SERVICE / 07', icon: <Network className="h-8 w-8" />, title: { en: 'Private VPN Tunnel', ru: 'Частный VPN-туннель' }, description: { en: 'A private network tunnel for approved company devices and home offices.', ru: 'Частный сетевой туннель для разрешённых устройств компании и домашних офисов.' }, features: { en: ['Company and home use', 'Device access policies', 'Network segmentation', 'Setup documentation'], ru: ['Для компании и дома', 'Политики устройств', 'Сегментация сети', 'Документация настройки'] } },
  { number: 'SERVICE / 08', icon: <Globe2 className="h-8 w-8" />, title: { en: 'Proxy Infrastructure', ru: 'Прокси-инфраструктура' }, description: { en: 'Managed proxy infrastructure for authorized business workflows and approved use cases.', ru: 'Управляемая прокси-инфраструктура для разрешённых рабочих процессов бизнеса.' }, features: { en: ['Approved use planning', 'Credential controls', 'Usage policies', 'Operational oversight'], ru: ['Планирование разрешённых сценариев', 'Контроль учётных данных', 'Политики использования', 'Операционный контроль'] } },
  { number: 'SERVICE / 09', icon: <Workflow className="h-8 w-8" />, title: { en: 'Business Apps & Automation', ru: 'Бизнес-приложения и автоматизация' }, description: { en: 'Internal applications and integrations that remove repetitive work and simplify operations.', ru: 'Внутренние приложения и интеграции для сокращения рутины и упрощения операций.' }, features: { en: ['Internal dashboards', 'API integrations', 'Workflow automation', 'Deployment and handover'], ru: ['Внутренние панели', 'Интеграции API', 'Автоматизация процессов', 'Запуск и передача'] } },
];

const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function Services() {
  const { language } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const copy = language === 'ru' ? { eyebrow: 'Что мы делаем / Услуги', title1: 'Создаём следующий', title2: 'этап вашего развития.', subtitle: 'От хостинга и частных сетей до внутренних приложений — объединяем инженерию, безопасность и удобство для развития бизнеса.', ready: 'Готовы к запуску?', cta: 'Запланировать консультацию' } : { eyebrow: 'What we do / Services', title1: 'Build the next', title2: 'version of you.', subtitle: 'From hosting and private networks to internal applications, we combine engineering, security, and usability for growing businesses.', ready: 'Ready to launch?', cta: 'Schedule Consultation' };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30"><Starfield /><CursorDot /><Navigation /><main className="relative z-10 pt-20">
      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48"><FadeIn><div className="mb-6 flex items-center gap-4"><Prompt cmd="./services --all" /><span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400/60">{copy.eyebrow}</span></div><h1 className="text-fluid-h1 max-w-5xl font-bold tracking-tighter"><GlitchText>{copy.title1}</GlitchText><br /><span className="bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">{copy.title2}</span></h1><p className="measure text-body-soft mt-10 font-serif text-xl leading-relaxed md:text-2xl">{copy.subtitle}</p></FadeIn></section>
      <section className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md md:py-40"><div className="mx-auto max-w-5xl px-6 md:px-12"><FadeIn><div className="overflow-hidden border border-emerald-300/20 bg-[#030504] font-mono">
        {services.map((service, index) => {
          const num = String(index + 1).padStart(2, '0');
          const isOpen = open === index;
          const cmd = slug(service.title.en);
          return (
            <div key={service.number} className="border-b border-emerald-300/10 last:border-b-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="group flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-emerald-300/[.05] sm:gap-4 sm:px-6"
              >
                <span className="shrink-0 text-emerald-300/60">{isOpen ? '[-]' : '[+]'}</span>
                <span className="shrink-0 text-[11px] tracking-widest text-emerald-300/50">[{num}]</span>
                <span className="shrink-0 text-emerald-300/60 transition-colors group-hover:text-emerald-200">{service.icon}</span>
                <span className="hidden shrink-0 text-sm text-emerald-300/90 sm:inline">{cmd}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-white/90 normal-case">{service.title[language]}</span>
                <span className="hidden shrink-0 items-center gap-1.5 text-[9px] uppercase tracking-[.14em] text-emerald-300/70 sm:inline-flex">
                  <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />active
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-emerald-300/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-4 pb-6 pl-10 sm:px-6 sm:pl-16" style={{ animation: 'rise-fade .28s ease' }}>
                  <div className="mb-1.5 text-[9px] uppercase tracking-[0.22em] text-orange-400/70">description</div>
                  <p className="mb-5 max-w-2xl text-sm normal-case leading-relaxed text-gray-400">{service.description[language]}</p>

                  <div className="mb-2.5 text-[9px] uppercase tracking-[0.22em] text-orange-400/70">options</div>
                  <ul className="mb-5 grid gap-2 text-[13px] sm:grid-cols-2">
                    {service.features[language].map((feature, i) => (
                      <li key={feature} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                        <span className="whitespace-nowrap text-emerald-300/90">--{slug(service.features.en[i])}</span>
                        <span className="min-w-0 text-gray-500 normal-case">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-3 border-t border-emerald-300/10 pt-4">
                    <span className="text-xs text-emerald-300/80"><span className="text-emerald-100/40">$ </span>tonrax {cmd} <span className="text-orange-300/80">--deploy</span></span>
                    <Link href="/contact" className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[.16em] text-emerald-200 transition-colors hover:text-white">run<ArrowRight className="h-3.5 w-3.5" /></Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div></FadeIn></div></section>
      <section className="border-t border-white/5 bg-black/50 py-32 text-center backdrop-blur-md md:py-40"><div className="mx-auto max-w-[1600px] px-6 md:px-12"><FadeIn><Rocket className="mx-auto mb-6 h-8 w-8 text-orange-400" /><h2 className="text-fluid-h2-lg mb-8 font-bold tracking-tight text-orange-200 text-glow-crimson"><GlitchText>{copy.ready}</GlitchText></h2><Link href="/contact" className="btn-cta inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-orange-300 hover:text-black">{copy.cta}<ArrowRight className="h-4 w-4" /></Link></FadeIn></div></section>
    </main></div>
  );
}
