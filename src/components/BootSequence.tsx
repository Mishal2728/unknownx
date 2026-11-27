import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Starfield } from './Starfield';

const SCRAMBLE = '!<>-_\\/[]{}=+*^?#01ABCDEFXZ';
const COMMAND = 'root@tonrax:~# ./launch --interface';
const DECODE_TARGET = 'establishing secure channel';

const BANNER = [
  ' ████████╗ ██████╗ ███╗   ██╗██████╗  █████╗ ██╗  ██╗',
  ' ╚══██╔══╝██╔═══██╗████╗  ██║██╔══██╗██╔══██╗╚██╗██╔╝',
  '    ██║   ██║   ██║██╔██╗ ██║██████╔╝███████║ ╚███╔╝ ',
  '    ██║   ██║   ██║██║╚██╗██║██╔══██╗██╔══██║ ██╔██╗ ',
  '    ██║   ╚██████╔╝██║ ╚████║██║  ██║██║  ██║██╔╝ ██╗',
  '    ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝',
].join('\n');

const SYS: [string, string][] = [
  ['os', 'tonrax-os 3.2'],
  ['kernel', 'secure-core x86_64'],
  ['node', '0x7F3A · TOR'],
  ['shell', '/bin/secure-sh'],
  ['uptime', '99.9%'],
  ['mem', '64G · aes-256'],
];

export function BootSequence() {
  const [active, setActive] = useState(false);
  const [typed, setTyped] = useState('');
  const [decode, setDecode] = useState('');
  const [showSys, setShowSys] = useState(false);
  const [showDecode, setShowDecode] = useState(false);
  const [progress, setProgress] = useState(-1); // -1 = hidden
  const [granted, setGranted] = useState(false);
  const [reveal, setReveal] = useState<'' | 'crt'>('');
  const [soundOn, setSoundOn] = useState(true);
  const soundRef = useRef(true);
  const audioRef = useRef<AudioContext | null>(null);
  const timers = useRef<number[]>([]);

  const t = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const ensureAudio = () => {
    if (!audioRef.current) {
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioRef.current = new Ctx();
      } catch { audioRef.current = null; }
    }
    audioRef.current?.resume().catch(() => {});
  };

  const toggleSound = () => {
    setSoundOn((v) => {
      const nv = !v;
      soundRef.current = nv;
      if (nv) ensureAudio();
      return nv;
    });
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onHome = window.location.pathname === '/' || window.location.pathname === '';
    if (!onHome || reducedMotion) return;

    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    };
    const unlockScroll = () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };

    setActive(true);
    lockScroll();

    // --- synthesized keystroke sound (Web Audio, no asset / CSP-safe) ---
    if (soundRef.current) ensureAudio();
    const resume = () => { audioRef.current?.resume().catch(() => {}); };
    const gestures = ['pointerdown', 'mousedown', 'click', 'keydown', 'touchstart'];
    resume();
    gestures.forEach((g) => window.addEventListener(g, resume));
    // realistic mechanical keypress: filtered noise "click" + low "thock"
    const playKey = (vol = 0.09) => {
      const audio = audioRef.current;
      if (!soundRef.current || !audio) return;
      if (audio.state !== 'running') { resume(); return; }
      const now = audio.currentTime;

      // click — short filtered noise burst
      const dur = 0.03;
      const frames = Math.max(1, Math.ceil(audio.sampleRate * dur));
      const buffer = audio.createBuffer(1, frames, audio.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
      const noise = audio.createBufferSource();
      noise.buffer = buffer;
      const bp = audio.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1700 + Math.random() * 900;
      bp.Q.value = 0.9;
      const ng = audio.createGain();
      ng.gain.setValueAtTime(0.0001, now);
      ng.gain.exponentialRampToValueAtTime(vol, now + 0.0015);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      noise.connect(bp); bp.connect(ng); ng.connect(audio.destination);
      noise.start(now); noise.stop(now + dur);

      // thock — low body thump
      const osc = audio.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 130 + Math.random() * 45;
      const og = audio.createGain();
      og.gain.setValueAtTime(0.0001, now);
      og.gain.exponentialRampToValueAtTime(vol * 0.7, now + 0.004);
      og.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(og); og.connect(audio.destination);
      osc.start(now); osc.stop(now + 0.06);
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      // CRT power-off: collapse to a bright line, then shrink to a dot
      setReveal('crt');
      // keep scroll locked until the reveal finishes, then release
      t(() => { setActive(false); unlockScroll(); }, 640);
    };
    t(finish, 9000); // failsafe

    // 1) type the command (fast)
    let k = 0;
    const typeNext = () => {
      k += 1;
      setTyped(COMMAND.slice(0, k));
      playKey();
      if (k < COMMAND.length) t(typeNext, 34);
      else { setShowSys(true); t(startDecode, 520); }
    };

    // 2) decode effect
    const startDecode = () => {
      setShowDecode(true);
      const len = DECODE_TARGET.length;
      let frame = 0;
      const run = () => {
        frame += 1;
        const revealed = Math.floor(frame / 2);
        let out = '';
        for (let i = 0; i < len; i += 1) {
          const ch = DECODE_TARGET[i];
          if (ch === ' ') { out += ' '; continue; }
          out += i < revealed ? ch : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
        }
        setDecode(out);
        if (frame % 2 === 0) playKey(0.03);
        if (revealed < len) t(run, 26);
        else { setDecode(DECODE_TARGET); t(startBar, 260); }
      };
      run();
    };

    // 3) progress bar
    const startBar = () => {
      setProgress(0);
      let p = 0;
      const step = () => {
        p += 6;
        setProgress(Math.min(100, p));
        playKey(0.035);
        if (p < 100) t(step, 26);
        else t(() => { setGranted(true); t(finish, 650); }, 260);
      };
      step();
    };

    t(typeNext, 350);

    return () => {
      timers.current.forEach(window.clearTimeout);
      unlockScroll();
      gestures.forEach((g) => window.removeEventListener(g, resume));
      audioRef.current?.close().catch(() => {});
      audioRef.current = null;
    };
  }, []);

  if (!active) return null;

  const filled = progress >= 0 ? Math.floor(progress / 5) : 0;

  return (
    <div
      className={`intro-overlay ${reveal === 'crt' ? 'intro-crtoff' : ''}`}
      role="status"
      aria-label="Terminal intro"
    >
      <Starfield />
      <button
        type="button"
        onClick={toggleSound}
        className="intro-sound absolute right-4 top-4 z-10 inline-flex items-center gap-2 border border-emerald-300/30 bg-black/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/80 transition-colors hover:border-emerald-300/70 hover:text-emerald-200 sm:right-6 sm:top-6"
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Mute typing sound' : 'Enable typing sound'}
      >
        {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        {soundOn ? 'sound: on' : 'sound: off'}
      </button>
      <div className="intro-screen intro-mac normal-case">
        <pre className="intro-banner" aria-hidden="true">{BANNER}</pre>

        <div className="mt-5">
          <span className="text-emerald-400">{typed}</span>
          {!granted && <span className="intro-cursor" aria-hidden="true" />}
        </div>

        {showSys && (
          <div className="intro-line mt-3 grid grid-cols-2 gap-x-6 gap-y-0.5 text-[12px] text-emerald-200/70 sm:max-w-md">
            {SYS.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span className="text-emerald-300/50">{k}</span>
                <span className="text-emerald-200/80">{v}</span>
              </div>
            ))}
          </div>
        )}

        {showDecode && (
          <div className="intro-line mt-2 text-emerald-100/80">
            <span className="text-emerald-100/40">&gt; </span>{decode}
            {decode === DECODE_TARGET && <span className="ml-2 text-emerald-300">[ ok ]</span>}
          </div>
        )}

        {progress >= 0 && (
          <div className="intro-line mt-1 text-emerald-200/80">
            <span className="text-emerald-100/40">&gt; </span>decrypting{' '}
            <span className="intro-bar text-emerald-300">[{'\u2588'.repeat(filled)}{'\u2591'.repeat(20 - filled)}]</span>{' '}
            <span className="text-emerald-200/70">{progress}%</span>
          </div>
        )}

        {granted && (
          <div className="intro-line mt-3 text-base">
            <span className="bg-emerald-400/90 px-2 py-0.5 font-bold text-[#041008]">access granted</span>
          </div>
        )}
      </div>
    </div>
  );
}
