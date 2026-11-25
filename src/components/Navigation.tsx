import { useState } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, DollarSign, Mail, Wrench } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import cosmicLogo from '@/pages/logo/logo.png';

export function Navigation() {
  const [location] = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path: string) => path === '/' ? location === '/' : location.startsWith(path);
  const labels = language === 'ru' ? { services: 'Услуги', pricing: 'Цены', contact: 'Контакты' } : { services: 'Services', pricing: 'Pricing', contact: 'Contact' };
  const navLinks = [
    { href: '/services', label: labels.services, Icon: Wrench },
    { href: '/pricing', label: labels.pricing, Icon: DollarSign },
    { href: '/contact', label: labels.contact, Icon: Mail },
  ];
  const languageToggle = <button type="button" onClick={toggleLanguage} className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white transition-colors hover:border-red-400/50" aria-label={language === 'ru' ? 'Переключить язык' : 'Toggle language'}><span className={language === 'en' ? 'text-red-300' : 'text-white/70'}>EN</span><span className="text-white/40">/</span><span className={language === 'ru' ? 'text-red-300' : 'text-white/70'}>RU</span></button>;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-red-400/15 bg-[#010103]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <a href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-80"><img src={cosmicLogo} alt="Tonrax" className="h-10 w-auto sm:h-14" /></a>
        <div className="hidden items-center gap-6 md:flex"><span className="font-mono text-[9px] uppercase tracking-[.18em] text-red-300/50">ops@tonrax:~$</span><div className="flex items-center gap-5 sm:gap-8">{navLinks.map((link) => <a key={link.href} href={link.href} className={`font-mono text-xs uppercase tracking-[0.18em] transition-colors ${isActive(link.href) ? 'text-red-300' : 'text-white/80 hover:text-red-300'}`}>{link.label}</a>)}</div>{languageToggle}</div>
        <div className="flex items-center gap-3 md:hidden">{languageToggle}<button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center rounded-full border border-red-400/20 bg-black/50 p-2 text-white transition-colors hover:border-red-400/50" aria-label={language === 'ru' ? 'Открыть меню' : 'Toggle menu'}>{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
      </div>
      {mobileMenuOpen && <div className="border-t border-red-400/15 bg-[#010103]/98 backdrop-blur-xl md:hidden"><div className="px-4 py-3"><div className="mb-2 px-3 font-mono text-[9px] uppercase tracking-[.18em] text-red-300/50">ops@tonrax:~$</div>{navLinks.map(({ href, label, Icon }) => <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 rounded px-3 py-3 font-mono text-sm uppercase tracking-[.15em] transition-colors ${isActive(href) ? 'bg-red-400/10 text-red-300' : 'text-white/80 hover:bg-white/5 hover:text-red-300'}`}><Icon className="h-4 w-4" />{label}</a>)}</div></div>}
    </nav>
  );
}
