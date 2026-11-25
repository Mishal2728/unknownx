import React from 'react';
import { SiMonero, SiBitcoin, SiEthereum, SiVisa, SiMastercard } from 'react-icons/si';
import { Link } from 'wouter';

import { useLanguage } from '@/context/LanguageContext';

interface FooterProps { copy?: { footer?: string } }

export const Footer: React.FC<FooterProps> = ({ copy }) => {
  const { language } = useLanguage();
  const ru = language === 'ru';
  return (
    <footer className="border-t border-emerald-300/15 bg-[#020807]/90 px-6 py-12 text-center backdrop-blur-lg md:px-20 md:text-left">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500"><span className="text-emerald-300/70">root@tonrax:~$</span> {copy?.footer || (ru ? '© 2026 Все права защищены.' : '© 2026 All Rights Reserved.')}</div>
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-gray-500"><span className="mr-1 text-gray-400">{ru ? 'Оплата' : 'Payments'}</span><SiMonero className="h-4 w-4 hover:text-emerald-200" title="Monero" /><span className="text-gray-700">/</span><SiBitcoin className="h-4 w-4 hover:text-emerald-200" title="Bitcoin" /><span className="text-gray-700">/</span><SiEthereum className="h-4 w-4 hover:text-emerald-200" title="Ethereum" /><span className="text-gray-700">/</span><SiVisa className="h-5 w-5 hover:text-emerald-200" title="Visa" /><SiMastercard className="h-5 w-5 hover:text-emerald-200" title="Mastercard" /></div>
        <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest text-gray-500"><a href="https://www.instagram.com/root.notfound" className="transition-colors hover:text-emerald-200">Instagram</a><Link href="/terms" className="transition-colors hover:text-emerald-200">{ru ? 'Условия' : 'Terms'}</Link><Link href="/privacy" className="transition-colors hover:text-emerald-200">{ru ? 'Конфиденциальность' : 'Privacy'}</Link></div>
      </div>
    </footer>
  );
};
