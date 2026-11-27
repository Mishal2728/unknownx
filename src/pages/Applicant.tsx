import { ArrowRight, ArrowLeft, Check, Upload } from 'lucide-react';
import { useLocation } from 'wouter';
import { ChangeEvent, FormEvent, useState } from 'react';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { GlitchText } from '@/components/BlackIce';
import { useLanguage } from '@/context/LanguageContext';

const roles = ['Frontend engineer', 'Backend engineer', 'Platform engineer'];
const MAX_UPLOAD_FILES = 3;
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set(['pdf', 'doc', 'docx', 'zip']);

export default function Applicant() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const goBack = () => { if (window.history.length > 1) window.history.back(); else setLocation('/'); };
  const [uploadError, setUploadError] = useState('');
  const [submissionState, setSubmissionState] = useState<'sending' | 'success' | 'validation' | 'rate-limit' | 'failure' | null>(null);

  const copy =
    language === 'ru'
      ? {
          headline: ['В', 'КОМАНДУ.'],
          remote: 'Удалённая команда / набор открыт',
          subtitle: 'Расскажите, что вы строите, как думаете и где ваши сильные стороны. Мы работаем удалённо, асинхронно и с большим вниманием к деталям.',
          points: ['Глобальная удалённая команда', 'Асинхронный формат по умолчанию', 'Глубокая работа защищена'],
          fullName: 'Полное имя', email: 'Электронная почта', role: 'Роль / орбита', select: 'Выберите позицию',
          portfolio: 'Портфолио / ссылка', message: 'Краткое сообщение', upload: 'Загрузите до 3 файлов',
          uploadHint: 'PDF, DOC, DOCX или ZIP · до 10 МБ каждый', pending: 'Анкета и файлы будут сохранены для обработки.',
          submit: 'Отправить заявку', sending: 'Отправка…', successEyebrow: 'Заявка отправлена',
          successTitle: 'Ваши координаты готовы.', successText: 'Ваша заявка и файлы надёжно сохранены. Мы свяжемся с вами после обработки.',
          backHome: 'Вернуться домой',
          uploadError: 'Выберите до 3 файлов PDF, DOC, DOCX или ZIP, каждый не более 10 МБ.',
          validationError: 'Проверьте данные заявки и выбранные файлы.',
          rateLimitError: 'Слишком много попыток. Повторите позже.',
          submissionError: 'Не удалось отправить заявку. Попробуйте позже.',
        }
      : {
          headline: ['JOIN THE', 'CREW.'],
          remote: 'Remote crew / intake open',
          subtitle: 'Tell us what you build, how you think, and where your signal is strongest. We work remotely, asynchronously, and with a lot of care.',
          points: ['Global remote team', 'Async by default', 'Deep work protected'],
          fullName: 'Name', email: 'Email', role: 'Role', select: 'Select a position',
          portfolio: 'Portfolio / link', message: 'Short message', upload: 'Upload up to 3 files',
          uploadHint: 'PDF, DOC, DOCX, or ZIP · 10 MB each', pending: 'Your application and files will be saved for processing.',
          submit: 'Submit application', sending: 'Sending…', successEyebrow: 'Application submitted',
          successTitle: 'Your coordinates are ready.', successText: 'Your application and files are safely saved. We will be in touch after processing.',
          backHome: 'Return home',
          uploadError: 'Please choose up to 3 files in PDF, DOC, DOCX, or ZIP format, each no larger than 10 MB.',
          validationError: 'Please check your application details and selected files.',
          rateLimitError: 'Too many attempts. Please wait a while before submitting again.',
          submissionError: 'We could not submit your application. Please try again later.',
        };

  const validateFiles = (files: FileList | null) => {
    const list = Array.from(files ?? []);
    if (!list.length) { setUploadError(''); return true; }
    if (list.length > MAX_UPLOAD_FILES) { setUploadError(copy.uploadError); return false; }
    for (const file of list) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !ALLOWED_UPLOAD_TYPES.has(extension)) { setUploadError(copy.uploadError); return false; }
      if (file.size > MAX_UPLOAD_SIZE_BYTES) { setUploadError(copy.uploadError); return false; }
    }
    setUploadError('');
    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => { validateFiles(event.target.files); };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionState === 'sending') return;
    const form = event.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    if (!validateFiles(fileInput?.files ?? null)) { setSubmissionState('validation'); return; }
    setSubmissionState('sending');
    try {
      const response = await fetch('/api/application', { method: 'POST', body: new FormData(form) });
      if (response.status === 429) { setSubmissionState('rate-limit'); return; }
      if (response.status === 400 || response.status === 413 || response.status === 415) { setSubmissionState('validation'); return; }
      if (response.status !== 202) { setSubmissionState('failure'); return; }
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !('status' in result) || result.status !== 'queued') { setSubmissionState('failure'); return; }
      form.reset();
      setUploadError('');
      setSubmissionState('success');
    } catch { setSubmissionState('failure'); }
  };

  const inputCls = 'w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-base text-white outline-none transition-colors placeholder:text-gray-700 focus:border-orange-400 disabled:opacity-60';
  const labelCls = 'mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500';

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Starfield />
      <CursorDot />
      <Navigation />
      <main className="relative z-10 pt-28">
        <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12">
          <FadeIn>
            <button type="button" onClick={goBack} className="btn-cta mb-10 inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 hover:text-orange-300">
              <ArrowLeft className="h-3.5 w-3.5" />{language === 'ru' ? 'Назад' : 'Back'}
            </button>
          </FadeIn>

          <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* left — editorial statement */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <FadeIn>
                <div className="mb-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-orange-400/80">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{copy.remote}
                </div>
                <h1 className="text-[clamp(3.5rem,13vw,10rem)] font-bold leading-[0.82] tracking-tighter">
                  <GlitchText>{copy.headline[0]}</GlitchText><br />
                  <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-red-500 bg-clip-text text-transparent">{copy.headline[1]}</span>
                </h1>
                <p className="mt-10 max-w-md text-base normal-case leading-relaxed text-gray-400">{copy.subtitle}</p>

                <div className="mt-14 space-y-4 border-t border-white/10 pt-10">
                  {copy.points.map((point) => (
                    <div key={point} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                      <Check className="h-3.5 w-3.5 shrink-0 text-orange-400" />{point}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* right — clean form / success */}
            <FadeIn delay={0.1}>
              {submissionState === 'success' ? (
                <div className="flex min-h-[420px] flex-col justify-center lg:pt-4">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/40 text-emerald-300">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">{copy.successEyebrow}</p>
                  <h2 className="mt-4 text-fluid-h2-lg font-bold">{copy.successTitle}</h2>
                  <p className="mt-5 max-w-md text-base normal-case leading-relaxed text-gray-400">{copy.successText}</p>
                  <button type="button" onClick={() => setLocation('/')} className="btn-cta group mt-10 inline-flex w-fit items-center gap-3 rounded-full border border-white/20 px-8 py-3.5 font-mono text-sm uppercase tracking-widest hover:bg-orange-300 hover:text-black">
                    {copy.backHome}<ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} onChange={() => { if (submissionState !== 'sending') setSubmissionState(null); }} className="lg:pt-4">
                  {submissionState && submissionState !== 'sending' && (
                    <div role="alert" className="mb-8 border-l-2 border-orange-400 py-3 pl-4 text-sm normal-case text-orange-200">
                      {submissionState === 'validation' ? copy.validationError : submissionState === 'rate-limit' ? copy.rateLimitError : copy.submissionError}
                    </div>
                  )}

                  {/* honeypot */}
                  <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                    <label htmlFor="application-website">Website</label>
                    <input id="application-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="space-y-9">
                    <div className="grid gap-9 sm:grid-cols-2">
                      <label className="block"><span className={labelCls}>{copy.fullName} <span className="text-orange-400">*</span></span>
                        <input required name="name" disabled={submissionState === 'sending'} placeholder="Jane Doe" className={inputCls} /></label>
                      <label className="block"><span className={labelCls}>{copy.email} <span className="text-orange-400">*</span></span>
                        <input required type="email" name="email" disabled={submissionState === 'sending'} placeholder="you@example.com" className={inputCls} /></label>
                    </div>

                    <div className="grid gap-9 sm:grid-cols-2">
                      <label className="block"><span className={labelCls}>{copy.role} <span className="text-orange-400">*</span></span>
                        <select required name="role" defaultValue="" disabled={submissionState === 'sending'} className={`${inputCls} appearance-none`}>
                          <option value="" disabled className="bg-black">{copy.select}</option>
                          {roles.map((r) => <option key={r} value={r} className="bg-black">{r}</option>)}
                        </select></label>
                      <label className="block"><span className={labelCls}>{copy.portfolio} <span className="text-orange-400">*</span></span>
                        <input required type="url" name="portfolio" disabled={submissionState === 'sending'} placeholder="https://" className={inputCls} /></label>
                    </div>

                    <label className="block"><span className={labelCls}>{copy.message} <span className="text-orange-400">*</span></span>
                      <textarea required name="message" rows={4} disabled={submissionState === 'sending'} placeholder={language === 'ru' ? 'Расскажите о себе…' : 'Tell us about your work…'} className={`${inputCls} resize-none`} /></label>

                    {/* file upload — minimal */}
                    <div>
                      <span className={labelCls}>{copy.upload}</span>
                      <label className="group flex cursor-pointer items-center gap-4 border border-dashed border-white/20 bg-white/[0.02] px-5 py-5 transition-colors hover:border-orange-400/50">
                        <Upload className="h-5 w-5 shrink-0 text-orange-400" />
                        <span>
                          <span className="block font-mono text-xs uppercase tracking-[0.14em] text-white/80">{copy.upload}</span>
                          <span className="mt-1 block text-sm normal-case text-gray-500">{copy.uploadHint}</span>
                        </span>
                        <input type="file" name="attachments" multiple disabled={submissionState === 'sending'} accept=".pdf,.doc,.docx,.zip" className="sr-only" onChange={handleFileChange} />
                      </label>
                      {uploadError && <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-red-300">{uploadError}</p>}
                    </div>
                  </div>

                  <p className="mt-8 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-gray-600">{copy.pending}</p>

                  <button type="submit" disabled={submissionState === 'sending'} className="btn-cta group mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 px-9 py-4 font-mono text-sm uppercase tracking-widest hover:bg-orange-300 hover:text-black disabled:cursor-wait disabled:opacity-70">
                    {submissionState === 'sending' ? copy.sending : copy.submit}<ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}
