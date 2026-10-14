import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Code2, Trophy, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { DecryptCycle } from './fx/Decrypt';
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/motion';
import { scrollToId } from '../lib/scroll';
import { onReady, useAppReady, markDone } from '../lib/ready';

const typingPhrases = [
  'I build AI-powered systems',
  'I build real-time ML pipelines',
  'I build full-stack applications',
  'LeetCode Knight | Top 3.5% globally',
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/DSurya11', icon: <GithubIcon size={18} /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/surya-dantuluri-2a2b4a280/', icon: <LinkedinIcon size={18} /> },
  { label: 'LeetCode', href: 'https://leetcode.com/u/this_is_surya/', icon: <Trophy size={18} /> },
  { label: 'Codeforces', href: 'https://codeforces.com/profile/_.surya._', icon: <Code2 size={18} /> },
  { label: 'CodeChef', href: 'https://www.codechef.com/users/this_is_surya', icon: <ExternalLink size={18} /> },
];

const rise = (delay: number, ready: boolean) => ({
  initial: { opacity: 0, y: 20 },
  animate: ready ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// Editorial cover: the real photo stands in front of a giant name. Depth comes from scrolling
// (name and photo travel at different speeds), never from the mouse.
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = useAppReady();

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const split = SplitText.create('.hero-name', { type: 'chars', charsClass: 'split-char', aria: 'none' });
      // Motion starts a beat after setup, once the page's startup work has finished.
      const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      intro
        .from(split.chars, { yPercent: 105, rotateX: -80, transformOrigin: '50% 100%', stagger: 0.06, duration: 1.4 }, 0.35)
        .fromTo('.hero-person', { clipPath: 'inset(100% 0% 0% 0%)', y: 60 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.6 }, 0.6);
      // Plays once the loading screen lifts.
      const off = onReady(() => intro.play());

      const out = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-name', { yPercent: -18, letterSpacing: '0.04em', ease: 'none', scrollTrigger: out });
      gsap.to('.hero-person', { yPercent: -14, scale: 1.04, ease: 'none', scrollTrigger: out });
      gsap.to('.hero-copy', { y: -60, opacity: 0, ease: 'none', scrollTrigger: { ...out, end: '60% top' } });
      return off;
    },
    { scope: root },
  );

  return (
    <section ref={root} id="hero" className="relative overflow-hidden pt-24 lg:h-[100svh] lg:min-h-[680px] lg:pt-0">
      {/* A soft pool of light behind the subject, like a studio backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 45% 55% at 64% 55%, rgba(226,232,240,0.07), transparent 70%)' }}
      />

      {/* Layer 1 (back): the name. */}
      <div className="pointer-events-none relative z-0 flex select-none justify-center lg:absolute lg:inset-x-0 lg:top-[11svh]">
        <p className="hero-name font-black uppercase leading-[0.78] tracking-[-0.045em] text-[#e9edf2] text-[26.5vw] lg:text-[21vw] [perspective:800px]" aria-hidden>
          Surya
        </p>
      </div>

      {/* Layer 2: the photo, overlapping the bottom of the letters. */}
      <img
        src="/surya-cutout.webp"
        alt="Surya Dantuluri"
        width={715}
        height={1100}
        fetchPriority="high"
        ref={(img) => {
          if (img?.complete) markDone('hero-photo');
        }}
        onLoad={() => markDone('hero-photo')}
        onError={() => markDone('hero-photo')}
        className="hero-person relative z-10 mx-auto -mt-[13vw] block h-[64svh] w-auto max-w-none origin-bottom lg:absolute lg:bottom-0 lg:left-[64%] lg:mt-0 lg:h-[86svh] lg:-translate-x-1/2"
        style={{ maskImage: 'linear-gradient(to bottom, #000 72%, transparent 98%)', WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent 98%)' }}
      />

      {/* Layer 3 (front): the words and actions. */}
      <div className="hero-copy page-x relative z-20 -mt-24 pb-14 text-center lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:pb-16 lg:text-left">
        <div className="lg:max-w-[34rem]">
          <motion.div {...rise(0.6, ready)}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00d4ff55] bg-black/80 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#00d4ff] backdrop-blur sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d4ff] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00d4ff]" />
              </span>
              Open to Internships &amp; Full-Time Roles
            </span>
          </motion.div>

          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Hi, I'm Surya
          </h1>
          <motion.p {...rise(0.7, ready)} className="mt-2 flex min-h-[2.6em] items-start justify-center font-mono text-lg text-slate-300 sm:text-2xl lg:justify-start">
            <span>
              <span className="text-[#00d4ff]">&gt; </span>
              <DecryptCycle phrases={typingPhrases} />
              <span className="ml-1 inline-block h-[1.05em] w-[0.5em] animate-[blink_1s_steps(1)_infinite] bg-[#00d4ff] align-middle" />
            </span>
          </motion.p>
          <p className="mb-8 mt-1 text-slate-400 sm:text-lg">
            Final year CSE @ <span className="font-medium text-slate-200">IIIT Jabalpur</span> &nbsp;|&nbsp; CPI{' '}
            <span className="font-semibold text-[#00d4ff]">8.1</span>
          </p>

          <motion.div {...rise(0.85, ready)} className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              onClick={() => scrollToId('#projects')}
              className="group relative overflow-hidden rounded-lg bg-[#00d4ff] px-7 py-3.5 text-sm font-semibold text-[#0a0a0f] transition-colors hover:bg-[#33ddff]"
            >
              <span className="relative z-10">View Projects</span>
              <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/40 transition-transform duration-700 group-hover:translate-x-full" />
            </button>
            <a
              href="https://drive.google.com/file/d/1im7brBirdHxuf1hUdZLaOUYjAk4Ou3UT/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#00d4ff77] bg-black/70 px-7 py-3.5 text-sm font-semibold text-[#00d4ff] backdrop-blur transition-colors duration-200 hover:bg-[#00d4ff18]"
            >
              Download Resume
            </a>
          </motion.div>

          <motion.div {...rise(1, ready)} className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="flex items-center gap-2 rounded-lg border border-[#ffffff20] bg-black/75 px-3.5 py-2 text-sm text-slate-400 backdrop-blur transition-colors duration-200 hover:border-[#00d4ff66] hover:text-[#00d4ff]"
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
