import { ArrowRight, CheckCircle2, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { language } = useLanguage();
  const [submissionState, setSubmissionState] = useState<'sending' | 'success' | 'validation' | 'rate-limit' | 'failure' | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
  const ru = language === 'ru';
  const copy = ru ? {
    eyebrow: 'Контакт / безопасный первый шаг', title: 'Начнём с вашей задачи.', subtitle: 'Расскажите, что хотите разместить, связать или автоматизировать. Не отправляйте пароли, закрытые ключи, платёжные данные и другую секретную информацию через эту форму.',
    details: 'Как проходит разговор', form: 'Отправить запрос', name: 'Имя', email: 'Электронная почта', phone: 'Телефон (необязательно)', subject: 'Тема', message: 'Что нужно сделать?', submit: 'Отправить сообщение', sending: 'Отправка…', success: 'Сообщение сохранено для обработки. Мы свяжемся с вами после просмотра.', validation: 'Проверьте поля и попробуйте ещё раз.', limit: 'Слишком много попыток. Подождите и повторите позже.', failure: 'Не удалось сохранить сообщение. Попробуйте позже или напишите на hello@tonrax.com.', privacy: 'Мы используем сведения из формы только для обработки запроса. Подробности — в политике конфиденциальности.', steps: ['Мы уточним цели, пользователей и ограничения.', 'Согласуем подход, границы работ и необходимые доступы.', 'До начала работ направим предложение с объёмом и условиями.'], emailTitle: 'Электронная почта', phoneTitle: 'Телефон', remote: 'Формат работы', remoteText: 'Удалённо / по договорённости', response: 'Срок ответа и доступность услуг подтверждаются отдельно; отправка формы не заключает договор.',
  } : {
    eyebrow: 'Contact / a considered first step', title: 'Start with the problem.', subtitle: 'Tell us what you need to host, connect, or automate. Please do not include passwords, private keys, payment details, or other secrets in this form.',
    details: 'What happens next', form: 'Send an inquiry', name: 'Name', email: 'Email address', phone: 'Phone (optional)', subject: 'Subject', message: 'What do you need?', submit: 'Send message', sending: 'Sending…', success: 'Your message has been saved for review. We’ll follow up after we have reviewed it.', validation: 'Please check the fields and try again.', limit: 'Too many attempts. Please wait and try again later.', failure: 'We could not save your message. Please try again later or email hello@tonrax.com.', privacy: 'We use the details you submit to respond to your inquiry. See our Privacy Policy for more information.', steps: ['We clarify goals, users, and constraints.', 'We agree on an approach, scope, and required access.', 'We send a proposal with deliverables and terms before work starts.'], emailTitle: 'Email', phoneTitle: 'Phone', remote: 'Working model', remoteText: 'Remote / by arrangement', response: 'Response times and service availability are confirmed separately; submitting this form does not create a contract.',
  };
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
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
      setSubmissionState('success');
    } catch { setSubmissionState('failure'); }
  };
  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-emerald-400/30"><Starfield /><CursorDot /><Navigation />
      <main className="relative z-10 pt-20">
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-36"><FadeIn><div className="mb-6 font-mono text-xs uppercase tracking-[.2em] text-emerald-300">{copy.eyebrow}</div><h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">{copy.title}</h1><p className="mt-8 max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">{copy.subtitle}</p></FadeIn></section>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 md:px-12 md:pb-32 lg:grid-cols-[.8fr_1.2fr]">
          <FadeIn><div className="font-mono text-xs uppercase tracking-[.2em] text-emerald-300">{copy.details}</div><h2 className="mt-5 text-3xl font-semibold md:text-4xl">{ru ? 'Чётко, конфиденциально, без давления.' : 'Clear, considered, no pressure.'}</h2><div className="mt-9 space-y-6">{copy.steps.map((step, index) => <div key={step} className="flex gap-4 border-t border-white/10 pt-5"><span className="font-mono text-xs text-emerald-300">0{index + 1}</span><p className="leading-relaxed text-gray-300">{step}</p></div>)}</div><div className="mt-10 grid gap-4 sm:grid-cols-2"><a href="mailto:hello@tonrax.com" className="border border-white/10 bg-black/40 p-5 transition-colors hover:border-emerald-300/40"><Mail className="mb-4 h-5 w-5 text-emerald-300" /><div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">{copy.emailTitle}</div><div className="mt-1 text-sm">hello@tonrax.com</div></a><div className="border border-white/10 bg-black/40 p-5"><MapPin className="mb-4 h-5 w-5 text-emerald-300" /><div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">{copy.remote}</div><div className="mt-1 text-sm">{copy.remoteText}</div></div></div><p className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-gray-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{copy.response}</p></FadeIn>
          <FadeIn delay={.1}><form id="contact-form" onSubmit={handleSubmit} className="border border-white/10 bg-[#070a09]/95 p-6 md:p-9"><div className="mb-7 border-b border-white/10 pb-5"><h2 className="text-2xl font-semibold">{copy.form}</h2><p className="mt-2 text-sm text-gray-500">{ru ? 'Поля со звёздочкой обязательны.' : 'Fields marked with * are required.'}</p></div>
            {submissionState && submissionState !== 'sending' && <div role={submissionState === 'success' ? 'status' : 'alert'} className={`mb-6 flex items-start gap-3 border p-4 text-sm leading-relaxed ${submissionState === 'success' ? 'border-emerald-300/30 bg-emerald-300/5 text-emerald-100' : 'border-amber-300/30 bg-amber-300/5 text-amber-100'}`}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{submissionState === 'success' ? copy.success : submissionState === 'validation' ? copy.validation : submissionState === 'rate-limit' ? copy.limit : copy.failure}</div>}
            {submissionState === 'sending' && <p role="status" className="mb-6 border border-emerald-300/20 p-4 font-mono text-xs text-emerald-100">{copy.sending}</p>}
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" /></div>
            <div className="grid gap-5 sm:grid-cols-2"><label className="space-y-2"><span className="block font-mono text-[10px] uppercase tracking-widest text-gray-400">{copy.name} *</span><input required maxLength={120} name="name" value={formData.name} onChange={handleChange} disabled={submissionState === 'sending'} autoComplete="name" className="w-full border border-white/15 bg-black/50 px-4 py-3 text-white outline-none focus:border-emerald-300" /></label><label className="space-y-2"><span className="block font-mono text-[10px] uppercase tracking-widest text-gray-400">{copy.email} *</span><input required type="email" maxLength={254} name="email" value={formData.email} onChange={handleChange} disabled={submissionState === 'sending'} autoComplete="email" className="w-full border border-white/15 bg-black/50 px-4 py-3 text-white outline-none focus:border-emerald-300" /></label><label className="space-y-2"><span className="block font-mono text-[10px] uppercase tracking-widest text-gray-400">{copy.phone}</span><input type="tel" maxLength={40} name="phone" value={formData.phone} onChange={handleChange} disabled={submissionState === 'sending'} autoComplete="tel" className="w-full border border-white/15 bg-black/50 px-4 py-3 text-white outline-none focus:border-emerald-300" /></label><label className="space-y-2"><span className="block font-mono text-[10px] uppercase tracking-widest text-gray-400">{copy.subject} *</span><input required maxLength={160} name="subject" value={formData.subject} onChange={handleChange} disabled={submissionState === 'sending'} className="w-full border border-white/15 bg-black/50 px-4 py-3 text-white outline-none focus:border-emerald-300" /></label></div>
            <label className="mt-5 block space-y-2"><span className="block font-mono text-[10px] uppercase tracking-widest text-gray-400">{copy.message} *</span><textarea required maxLength={8000} rows={6} name="message" value={formData.message} onChange={handleChange} disabled={submissionState === 'sending'} className="w-full resize-y border border-white/15 bg-black/50 px-4 py-3 text-white outline-none focus:border-emerald-300" /></label>
            <p className="mt-5 text-xs leading-relaxed text-gray-500">{copy.privacy} <a href="/privacy" className="text-emerald-200 underline underline-offset-4 hover:text-white">{ru ? 'Политика конфиденциальности' : 'Privacy Policy'}</a>.</p>
            <button type="submit" disabled={submissionState === 'sending'} className="mt-6 flex w-full items-center justify-between bg-emerald-300 px-5 py-4 font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60">{copy.submit}<ArrowRight className="h-4 w-4" /></button>
          </form></FadeIn>
        </section>
      </main>
    </div>
  );
}
