import { useEffect, useRef, type ReactNode } from 'react';
import { Code2, ExternalLink, FileText, Mail, Trophy } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { gsap, useGSAP, finePointer, reducedMotion } from '../lib/motion';

type Key = { id: string; label: string; legend: string; href: string; icon: ReactNode };

const EMAIL = 'suryadantuluri2005@gmail.com';

const keys: Key[] = [
  { id: 'github', label: 'GitHub', legend: 'G', href: 'https://github.com/DSurya11', icon: <GithubIcon size={20} /> },
  { id: 'linkedin', label: 'LinkedIn', legend: 'I', href: 'https://www.linkedin.com/in/surya-dantuluri-2a2b4a280/', icon: <LinkedinIcon size={20} /> },
  { id: 'leetcode', label: 'LeetCode', legend: 'L', href: 'https://leetcode.com/u/this_is_surya/', icon: <Trophy size={20} /> },
  { id: 'codeforces', label: 'Codeforces', legend: 'F', href: 'https://codeforces.com/profile/_.surya._', icon: <Code2 size={20} /> },
  { id: 'codechef', label: 'CodeChef', legend: 'C', href: 'https://www.codechef.com/users/this_is_surya', icon: <ExternalLink size={20} /> },
  { id: 'resume', label: 'Resume', legend: 'R', href: 'https://drive.google.com/file/d/1im7brBirdHxuf1hUdZLaOUYjAk4Ou3UT/view?usp=sharing', icon: <FileText size={20} /> },
];
const emailKey: Key = { id: 'email', label: EMAIL, legend: 'E', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`, icon: <Mail size={20} /> };

// Every way to reach Surya, as keys on a keyboard. Click a key and it travels down; on a
// computer, typing a key's letter presses it (and focuses it, so Enter opens it).
export function Keyboard() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.keycap-slot', {
        y: -46,
        opacity: 0,
        stagger: { each: 0.05, from: 'start' },
        duration: 0.8,
        ease: 'bounce.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (!finePointer()) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root.current!);
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const key = [...keys, emailKey].find((k) => k.legend === e.key.toUpperCase());
      if (!key) return;
      const el = root.current!.querySelector<HTMLAnchorElement>(`[data-key="${key.id}"]`);
      if (!el) return;
      el.classList.add('is-down');
      el.focus({ preventScroll: true });
      window.setTimeout(() => el.classList.remove('is-down'), 160);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      io.disconnect();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const cap = (k: Key, accent = false) => (
    <a
      key={k.id}
      data-key={k.id}
      href={k.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={k.id === 'email' ? `Email ${EMAIL}` : k.label}
      className={`keycap ${accent ? 'keycap-accent' : ''} group`}
    >
      <span className="keycap-top">
        <span className="keycap-legend">{k.legend}</span>
        <span className={`flex items-center justify-center gap-2.5 ${accent ? 'text-[#06303a]' : 'text-slate-200'}`}>
          <span className={accent ? '' : 'text-slate-400 transition-colors group-hover:text-[#00d4ff]'}>{k.icon}</span>
          <span className={`font-semibold ${accent ? 'break-all text-sm sm:text-base' : 'text-sm'}`}>{k.label}</span>
        </span>
      </span>
    </a>
  );

  return (
    <div ref={root} className="mx-auto w-full max-w-4xl [perspective:1400px]">
      <div className="keyboard-plate">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
          {keys.map((k) => (
            <div key={k.id} className="keycap-slot">
              {cap(k)}
            </div>
          ))}
          <div className="keycap-slot col-span-2 sm:col-span-3 lg:col-span-6">{cap(emailKey, true)}</div>
        </div>
      </div>
      <p className="mt-6 hidden text-center font-mono text-xs uppercase tracking-widest text-slate-500 [@media(pointer:fine)]:block">
        Type a key's letter to press it · Enter opens it
      </p>
    </div>
  );
}
