import { ArrowRight, ArrowLeft } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useLocation } from 'wouter';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { GlitchText } from '@/components/BlackIce';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { language } = useLanguage();
  const ru = language === 'ru';
  const [, setLocation] = useLocation();
  const goBack = () => { if (window.history.length > 1) window.history.back(); else setLocation('/'); };
  const [submissionState, setSubmissionState] = useState<'sending' | 'success' | 'validation' | 'rate-limit' | 'failure' | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '', website: '' });

  useEffect(() => { if (window.location.hash === '#contact-form') document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (submissionState !== 'sending') setSubmissionState(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionState === 'sending') return;
    setSubmissionState('sending');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (response.status === 429) { setSubmissionState('rate-limit'); return; }
      if ([400, 413, 415].includes(response.status)) { setSubmissionState('validation'); return; }
      if (response.status !== 202) { setSubmissionState('failure'); return; }
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !('status' in result) || result.status !== 'queued') { setSubmissionState('failure'); return; }
      setSubmissionState('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
    } catch { setSubmissionState('failure'); }
  };

  const details = [
    { label: ru ? 'Почта' : 'Email', value: 'hello@tonrax.com' },
    { label: ru ? 'Телефон' : 'Phone', value: '+7 (988) 532-1121' },
    { label: ru ? 'База' : 'Base', value: ru ? 'Глобально · удалённо' : 'Global · Remote' },
  ];

  const field = (name: keyof typeof formData, label: string, opts: { type?: string; required?: boolean; area?: boolean; placeholder?: string } = {}) => (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">{label}{opts.required && <span className="text-orange-400"> *</span>}</span>
      {opts.area ? (
        <textarea required={opts.required} name={name} rows={4} value={formData[name]} onChange={handleChange} disabled={submissionState === 'sending'} placeholder={opts.placeholder}
          className="w-full resize-none border-0 border-b border-white/15 bg-transparent px-0 py-3 text-base text-white outline-none transition-colors placeholder:text-gray-700 focus:border-orange-400" />
      ) : (
        <input required={opts.required} type={opts.type || 'text'} name={name} value={formData[name]} onChange={handleChange} disabled={submissionState === 'sending'} placeholder={opts.placeholder}
          className="w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-base text-white outline-none transition-colors placeholder:text-gray-700 focus:border-orange-400" />
      )}
    </label>
  );

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Starfield />
      <CursorDot />
      <Navigation />
      <main className="relative z-10 pt-28">
        <section id="contact-form" className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12">
          <FadeIn>
            <button type="button" onClick={goBack} className="btn-cta mb-10 inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 hover:text-orange-300">
              <ArrowLeft className="h-3.5 w-3.5" />{ru ? 'Назад' : 'Back'}
            </button>
          </FadeIn>

          <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* left — editorial statement */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <FadeIn>
                <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.35em] text-orange-400/80">{ru ? '— Свяжитесь' : '— Get in touch'}</div>
                <h1 className="text-[clamp(3.5rem,13vw,10rem)] font-bold leading-[0.82] tracking-tighter">
                  <GlitchText>{ru ? 'НА' : "LET'S"}</GlitchText><br />
                  <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-red-500 bg-clip-text text-transparent">{ru ? 'СВЯЗИ.' : 'TALK.'}</span>
                </h1>
                <p className="mt-10 max-w-md text-base normal-case leading-relaxed text-gray-400">
                  {ru
                    ? 'Расскажите о проекте, идее или инфраструктуре. Мы ответим и предложим следующий шаг.'
                    : 'Tell us about a project, an idea, or the infrastructure you need. We will reply with a clear next step.'}
                </p>

                <div className="mt-14 space-y-6 border-t border-white/10 pt-10">
                  {details.map((d) => (
                    <div key={d.label} className="flex items-baseline justify-between gap-6 border-b border-white/[0.06] pb-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">{d.label}</span>
                      <span className="font-mono text-sm text-orange-200/90">{d.value}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* right — clean form */}
            <FadeIn delay={0.1}>
              <form onSubmit={handleSubmit} className="lg:pt-4">
                {submissionState && submissionState !== 'sending' && (
                  <div role={submissionState === 'success' ? 'status' : 'alert'} className={`mb-8 border-l-2 py-3 pl-4 text-sm normal-case ${submissionState === 'success' ? 'border-emerald-400 text-emerald-200' : 'border-orange-400 text-orange-200'}`}>
                    {submissionState === 'success' ? (ru ? 'Сообщение надёжно сохранено. Мы свяжемся с вами.' : 'Your message is safely saved. We will be in touch.')
                      : submissionState === 'validation' ? (ru ? 'Проверьте, пожалуйста, данные.' : 'Please check your details.')
                        : submissionState === 'rate-limit' ? (ru ? 'Слишком много попыток. Повторите позже.' : 'Too many attempts. Please try again later.')
                          : (ru ? 'Не удалось отправить сообщение.' : 'We could not send your message.')}
                  </div>
                )}

                <div aria-hidden="true" className="absolute -left-[10000px]"><input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} /></div>

                <div className="space-y-9">
                  <div className="grid gap-9 sm:grid-cols-2">
                    {field('name', ru ? 'Имя' : 'Name', { required: true, placeholder: ru ? 'Джейн Доу' : 'Jane Doe' })}
                    {field('email', ru ? 'Почта' : 'Email', { type: 'email', required: true, placeholder: 'you@company.com' })}
                  </div>
                  <div className="grid gap-9 sm:grid-cols-2">
                    {field('phone', ru ? 'Телефон' : 'Phone', { placeholder: '+1 555 0100' })}
                    {field('subject', ru ? 'Тема' : 'Subject', { required: true, placeholder: ru ? 'Новый проект' : 'New project' })}
                  </div>
                  {field('message', ru ? 'Сообщение' : 'Message', { required: true, area: true, placeholder: ru ? 'Расскажите подробнее…' : 'Tell us more…' })}
                </div>

                <button type="submit" disabled={submissionState === 'sending'} className="btn-cta group mt-12 inline-flex items-center gap-3 rounded-full border border-white/20 px-9 py-4 font-mono text-sm uppercase tracking-widest hover:bg-orange-300 hover:text-black">
                  {submissionState === 'sending' ? (ru ? 'Отправка…' : 'Sending…') : (ru ? 'Отправить' : 'Send message')}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}
