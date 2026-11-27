import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, CornerDownLeft } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

type Cmd = { id: string; label: string; hint: string; run: () => void };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const ru = language === 'ru';
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Cmd[] = useMemo(() => {
    const go = (p: string) => () => { setLocation(p); setOpen(false); };
    return [
      { id: 'home', label: ru ? 'Главная' : 'Home', hint: 'cd /', run: go('/') },
      { id: 'services', label: ru ? 'Услуги' : 'Services', hint: 'cd /services', run: go('/services') },
      { id: 'pricing', label: ru ? 'Цены' : 'Pricing', hint: 'cd /pricing', run: go('/pricing') },
      { id: 'contact', label: ru ? 'Контакты' : 'Contact', hint: 'cd /contact', run: go('/contact') },
      { id: 'apply', label: ru ? 'Карьера / Заявка' : 'Careers / Apply', hint: 'cd /apply', run: go('/apply') },
      { id: 'terms', label: ru ? 'Условия' : 'Terms', hint: 'cd /terms', run: go('/terms') },
      { id: 'privacy', label: ru ? 'Конфиденциальность' : 'Privacy', hint: 'cd /privacy', run: go('/privacy') },
      { id: 'shell', label: ru ? 'Открыть консоль' : 'Open secure shell', hint: 'exec sh', run: () => { setOpen(false); window.dispatchEvent(new Event('open-shell')); } },
    ];
  }, [ru, setLocation]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => (c.label + ' ' + c.hint + ' ' + c.id).toLowerCase().includes(q));
  }, [query, commands]);

  // open/close hotkeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-command-palette', onOpen); };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => { setActive(0); }, [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); filtered[active]?.run(); }
  };

  return (
    <div className="fixed inset-0 z-[9500] flex items-start justify-center px-4 pt-[14vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="cmdk relative w-full max-w-xl border border-emerald-300/30 bg-[#050908] font-mono shadow-[0_0_60px_rgba(0,0,0,0.7)]">
        {/* input row */}
        <div className="flex items-center gap-3 border-b border-emerald-300/15 px-4 py-3.5">
          <span className="text-emerald-400">&gt;_</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={ru ? 'выполнить команду…' : 'run command…'}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-emerald-100/30"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="hidden shrink-0 border border-emerald-300/20 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-emerald-300/50 sm:block">esc</kbd>
        </div>

        {/* results */}
        <div data-lenis-prevent className="max-h-[52vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-emerald-100/40">{ru ? 'команда не найдена' : 'command not found'}</div>
          )}
          {filtered.map((c, i) => {
            const on = active === i;
            return (
              <button
                key={c.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => c.run()}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${on ? 'bg-emerald-300/[.08]' : ''}`}
              >
                <ArrowRight className={`h-3.5 w-3.5 shrink-0 ${on ? 'text-emerald-300' : 'text-emerald-300/30'}`} />
                <span className={`flex-1 text-sm ${on ? 'text-white' : 'text-white/80'}`}>{c.label}</span>
                <span className="font-mono text-[11px] text-emerald-300/50">{c.hint}</span>
                {on && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-emerald-300/70" />}
              </button>
            );
          })}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-emerald-300/15 px-4 py-2.5 text-[9px] uppercase tracking-[.14em] text-emerald-100/35">
          <span>tonrax // command palette</span>
          <span>↑↓ {ru ? 'выбор' : 'navigate'} · ↵ {ru ? 'запуск' : 'run'} · esc {ru ? 'закрыть' : 'close'}</span>
        </div>
      </div>
    </div>
  );
}
