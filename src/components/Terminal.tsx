import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { TerminalSquare, X } from 'lucide-react';

type Entry = { kind: 'in' | 'out' | 'sys'; text: string };

const BANNER: Entry[] = [
  { kind: 'sys', text: 'TONRAX SECURE SHELL v2.6' },
  { kind: 'out', text: 'type "help" for commands · "sys" for full site readout' },
];

const ROUTES: Record<string, string> = {
  home: '/',
  services: '/services',
  pricing: '/pricing',
  contact: '/contact',
  apply: '/apply',
  terms: '/terms',
  privacy: '/privacy',
};

// --- site data, exposed through the shell -----------------------------------
const SERVICES = [
  'onion-service        private tor onion endpoint',
  'crypto-node          customer-controlled full node',
  'hosting              privacy-minded hosting & servers',
  'vpn-tunnel           private vpn for company & home',
  'proxy                business proxy infrastructure',
  'automation           internal apps & automation',
  'interface-design     distinctive ui / ux design',
  'web-development       react / typescript builds',
  'growth-support       maintenance & improvements',
];

const PRICING = [
  'signal   $159   early-stage digital presence',
  'core     $459   full application  [most popular]',
  'orbit    $859   managed infrastructure & growth',
];

const CONTACT = [
  'email    hello@tonrax.com',
  'phone    +7 (988) 532-1121',
  'base     global · remote',
  'social   instagram.com/root.notfound',
  'pgp      0x9F2A·4C11·EDe7',
  'tor      tonrax7f3a.onion',
];

const ABOUT = [
  'TONRAX — web development & privacy-minded hosting.',
  'We design fast, resilient digital systems: sites, apps,',
  'onion services, crypto nodes, vpn, proxy & automation.',
  'stack: react · typescript · go · tailwind',
  'crew:  global, remote, async by default',
];

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Entry[]>(BANNER);
  const [value, setValue] = useState('');
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpenShell = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-shell', onOpenShell);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-shell', onOpenShell); };
  }, []);

  const push = (entries: Entry[]) => setHistory((h) => [...h, ...entries]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    push([{ kind: 'in', text: raw }]);
    if (!cmd) return;

    const out = (lines: string[]) => push(lines.map((text) => ({ kind: 'out' as const, text })));

    if (cmd === 'help' || cmd === '?') {
      out([
        'AVAILABLE COMMANDS:',
        '  about | whoami     who we are',
        '  services           list all services',
        '  pricing            list plans & prices',
        '  contact            contact channels',
        '  social             social links',
        '  sys | info         full site readout',
        '  status             node telemetry',
        '  ls | sitemap       list routes',
        '  cd <node>          navigate (e.g. cd pricing)',
        '  open <node>        navigate to a route',
        '  date               current time',
        '  clear              wipe the console',
        '  exit               close shell',
      ]);
      return;
    }
    if (cmd === 'about') { out(ABOUT); return; }
    if (cmd === 'whoami') {
      out(['anon@tonrax · clearance: GUEST · channel: ENCRYPTED', 'tip: type "sys" for the full readout']);
      return;
    }
    if (cmd === 'services' || cmd === 'services --list') {
      out(['SERVICES // 9 active', ...SERVICES.map((s) => '  ' + s), 'run: cd services']);
      return;
    }
    if (cmd === 'pricing' || cmd === 'plans') {
      out(['PRICING // tiers', ...PRICING.map((p) => '  ' + p), 'run: cd pricing']);
      return;
    }
    if (cmd === 'contact') {
      out(['CONTACT // channels', ...CONTACT.map((c) => '  ' + c), 'run: cd contact']);
      return;
    }
    if (cmd === 'social') {
      out(['instagram  instagram.com/root.notfound']);
      return;
    }
    if (cmd === 'sys' || cmd === 'info' || cmd === 'neofetch') {
      push([
        { kind: 'sys', text: '┌─ TONRAX // SYSTEM READOUT ────────────────' },
        { kind: 'out', text: 'host......... tonrax.secure.node' },
        { kind: 'out', text: 'status....... ONLINE · TOR · AES-256' },
        { kind: 'out', text: `services..... ${SERVICES.length} active` },
        { kind: 'out', text: 'tiers........ signal $159 · core $459 · orbit $859' },
        { kind: 'out', text: 'contact...... hello@tonrax.com' },
        { kind: 'out', text: 'routes....... ' + Object.keys(ROUTES).map((r) => '/' + (r === 'home' ? '' : r)).join(' ') },
        { kind: 'out', text: 'stack........ react · typescript · go · tailwind' },
        { kind: 'sys', text: '└───────────────────────────────────────────' },
        { kind: 'out', text: 'type: services | pricing | contact | about' },
      ]);
      return;
    }
    if (cmd === 'status') {
      out(['NODE......... ONLINE', 'ROUTING...... TOR RELAY ACTIVE', 'ENCRYPTION... AES-256 / VERIFIED', 'THREATS...... 0 DETECTED']);
      return;
    }
    if (cmd === 'ls' || cmd === 'nav' || cmd === 'sitemap') {
      out([Object.keys(ROUTES).map((r) => `/${r === 'home' ? '' : r}`).join('   ')]);
      return;
    }
    if (cmd === 'date' || cmd === 'time') { out([new Date().toString()]); return; }
    if (cmd === 'clear' || cmd === 'cls') { setHistory([]); return; }
    if (cmd === 'exit' || cmd === 'quit') { setOpen(false); return; }

    const cdMatch = cmd.match(/^(?:cd|open|goto)\s+\/?(\w+)/);
    const target = cdMatch ? cdMatch[1] : cmd;
    if (ROUTES[target] !== undefined) {
      push([{ kind: 'sys', text: `> routing to /${target === 'home' ? '' : target} ... ACCESS GRANTED` }]);
      setTimeout(() => { setLocation(ROUTES[target]); setOpen(false); }, 450);
      return;
    }

    push([{ kind: 'out', text: `command not found: ${cmd} — type "help"` }]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(value);
    setValue('');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="term-launcher"
        aria-label="Open secure shell"
      >
        {open ? <X className="h-4 w-4" /> : <TerminalSquare className="h-4 w-4" />}
        <span>{open ? 'CLOSE' : 'SHELL'}</span>
      </button>

      {open && (
        <div className="term-panel" role="dialog" aria-label="Secure shell">
          <div className="term-bar">
            <div className="term-dots" aria-hidden="true">
              <i className="bg-red-400/80" /><i className="bg-yellow-300/80" /><i className="bg-emerald-300/80" />
            </div>
            <span className="term-title">anon@tonrax — secure shell</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X className="h-3.5 w-3.5" /></button>
          </div>
          <div className="term-body" ref={bodyRef}>
            {history.map((e, i) => (
              <div key={i} className={`term-row term-${e.kind}`}>
                {e.kind === 'in' && <span className="term-ps">anon@tonrax:~$ </span>}
                <span>{e.text}</span>
              </div>
            ))}
          </div>
          <form className="term-input" onSubmit={onSubmit}>
            <span className="term-ps">anon@tonrax:~$</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(ev) => setValue(ev.target.value)}
              spellCheck={false}
              autoComplete="off"
              aria-label="shell input"
            />
          </form>
        </div>
      )}
    </>
  );
}
