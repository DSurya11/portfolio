import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Trophy, Code2, ExternalLink, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { TextPressure } from './fx/TextPressure';
import { Magnetic } from './fx/Magnetic';
import { Decrypt } from './fx/Decrypt';
import { signalBus } from '../lib/signalBus';

const socials = [
  { label: 'GitHub', href: 'https://github.com/DSurya11', icon: <GithubIcon />, color: '#ffffff' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/surya-dantuluri-2a2b4a280/', icon: <LinkedinIcon />, color: '#0a66c2' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/this_is_surya/', icon: <Trophy size={20} />, color: '#f59e0b' },
  { label: 'Codeforces', href: 'https://codeforces.com/profile/_.surya._', icon: <Code2 size={20} />, color: '#00d4ff' },
  { label: 'CodeChef', href: 'https://www.codechef.com/users/this_is_surya', icon: <ExternalLink size={20} />, color: '#b45309' },
];

// The globe itself is the particle field (it forms here as you arrive); this area lets you spin it.
function GlobeDrag() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let last: number | null = null;
    const down = (e: PointerEvent) => {
      last = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (last === null) return;
      signalBus.globeSpin += (e.clientX - last) * 0.006;
      last = e.clientX;
    };
    const up = () => (last = null);
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, []);
  return (
    <div ref={ref} data-cursor="grab" className="relative h-[340px] w-full touch-pan-y sm:h-[440px] lg:h-[520px]" aria-hidden>
      <span className="pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-slate-500">
        <MapPin size={13} className="text-[#7c3aed]" /> Jabalpur, India · drag to spin
      </span>
    </div>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="contact" ref={ref} className="relative pt-24 pb-24">
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        <p className="mb-4 text-center font-mono text-sm uppercase tracking-widest text-[#00d4ff] lg:text-left">
          <Decrypt text="Say hello" />
        </p>
        <TextPressure text="Let's Connect" className="mb-12" />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <motion.p {...reveal(0.1)} className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-300 lg:mx-0">
              Currently targeting <span className="font-medium text-white">Summer 2026 SDE internships, full-time roles</span>. Let's talk.
            </motion.p>

            <motion.div {...reveal(0.25)} className="mb-10">
              <Magnetic strength={0.3}>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=suryadantuluri2005@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-[#00d4ff] px-6 py-4 text-base font-semibold text-[#0a0a0f] shadow-lg shadow-[#00d4ff44] sm:px-8 sm:text-lg"
                >
                  <Mail size={22} className="relative z-10" />
                  <span className="relative z-10 break-all">suryadantuluri2005@gmail.com</span>
                  <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/40 transition-transform duration-700 group-hover:translate-x-full" />
                </a>
              </Magnetic>
            </motion.div>

            <motion.div {...reveal(0.4)} className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-[#ffffff15] bg-[#0a0a0f]/70 px-4 py-2 text-sm text-slate-400 backdrop-blur-sm transition-colors duration-200 hover:border-[#ffffff30] hover:text-white"
                >
                  <span style={{ color: s.color }}>{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </motion.div>
          </div>

          <GlobeDrag />
        </div>
      </div>
    </section>
  );
}
