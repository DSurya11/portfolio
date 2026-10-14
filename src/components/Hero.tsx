import { useRef, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Code2, Trophy, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { DecryptCycle } from './fx/Decrypt';
import { Magnetic } from './fx/Magnetic';
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/motion';
import { scrollToId } from '../lib/scroll';
import { signalBus } from '../lib/signalBus';

const typingPhrases = [
  'I build AI-powered systems',
  'I build real-time ML pipelines',
  'I build full-stack applications',
  'LeetCode Knight | Top 3.5% globally',
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/DSurya11', icon: <GithubIcon /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/surya-dantuluri-2a2b4a280/', icon: <LinkedinIcon /> },
  { label: 'LeetCode', href: 'https://leetcode.com/u/this_is_surya/', icon: <Trophy size={20} /> },
  { label: 'Codeforces', href: 'https://codeforces.com/profile/_.surya._', icon: <Code2 size={20} /> },
  { label: 'CodeChef', href: 'https://www.codechef.com/users/this_is_surya', icon: <ExternalLink size={20} /> },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const signalFailed = useSyncExternalStore(
    (l) => signalBus.subscribe(l),
    () => signalBus.failed,
  );

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const split = SplitText.create('.hero-name', { type: 'chars', charsClass: 'split-char' });
      gsap.from(split.chars, {
        rotateX: -110,
        yPercent: 80,
        z: -120,
        opacity: 0,
        transformOrigin: '50% 100%',
        stagger: 0.04,
        duration: 1.2,
        delay: 0.15,
        ease: 'expo.out',
      });
      // As you scroll away the headline tips back into the screen.
      gsap.to('.hero-copy', {
        rotateX: 18,
        z: -160,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 15%', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="hero" className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-12 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 [perspective:1200px]">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          <div className="hero-copy flex-1 text-center lg:text-left order-2 lg:order-1 [transform-style:preserve-3d]">
            <motion.div {...fade(0.1)}>
              <span className="inline-flex items-center gap-2 text-[#00d4ff] text-xs sm:text-sm font-mono tracking-widest uppercase mb-6 px-3 py-1 border border-[#00d4ff55] rounded-full bg-[#00d4ff12]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d4ff] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00d4ff]" />
                </span>
                Open to Internships &amp; Full-Time Roles
              </span>
            </motion.div>

            <h1 className="hero-name text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 leading-[0.95] tracking-tight [perspective:600px]">
              Hi, I'm{' '}
              <span className="text-[#00d4ff]" style={{ textShadow: '0 0 40px #00d4ff55' }}>
                Surya
              </span>
            </h1>

            <motion.div {...fade(0.25)} className="h-14 flex items-center justify-center lg:justify-start mb-4">
              <p className="text-xl sm:text-3xl md:text-[2.1rem] font-mono text-slate-300">
                <span className="text-[#00d4ff]">&gt; </span>
                <DecryptCycle phrases={typingPhrases} />
                <span className="inline-block w-[0.55em] h-[1.1em] bg-[#00d4ff] ml-1 align-middle animate-[blink_1s_steps(1)_infinite]" />
              </p>
            </motion.div>

            <motion.p
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-400 text-lg mb-10"
            >
              Pre-final year CSE @ <span className="text-slate-200 font-medium">IIIT Jabalpur</span> &nbsp;|&nbsp; CPI{' '}
              <span className="text-[#00d4ff] font-semibold">8.1</span>
            </motion.p>

            <motion.div {...fade(0.55)} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Magnetic>
                <button
                  onClick={() => scrollToId('#projects')}
                  className="group relative overflow-hidden px-8 py-3.5 bg-[#00d4ff] text-[#0a0a0f] font-semibold rounded-lg shadow-lg shadow-[#00d4ff33] text-sm"
                >
                  <span className="relative z-10">View Projects</span>
                  <span className="absolute inset-0 -translate-x-full bg-white/40 skew-x-12 transition-transform duration-700 group-hover:translate-x-full" />
                </button>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://drive.google.com/file/d/1im7brBirdHxuf1hUdZLaOUYjAk4Ou3UT/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-8 py-3.5 border border-[#00d4ff77] text-[#00d4ff] font-semibold rounded-lg hover:bg-[#00d4ff18] transition-colors duration-200 text-sm backdrop-blur-sm"
                >
                  Download Resume
                </a>
              </Magnetic>
            </motion.div>

            <motion.div {...fade(0.65)} className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ffffff20] bg-[#0a0a0f]/60 backdrop-blur-sm text-slate-400 hover:text-[#00d4ff] hover:border-[#00d4ff66] transition-colors duration-200 text-sm"
                >
                  {s.icon}
                  <span className="hidden sm:inline">{s.label}</span>
                </a>
              ))}
            </motion.div>
          </div>

          {/* The particle portrait assembles inside this box; the photo only shows if WebGL is unavailable. */}
          <div
            id="signal-face-anchor"
            className="order-1 lg:order-2 relative shrink-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-[30rem] lg:h-[30rem]"
          >
            {signalFailed && (
              <img
                src="/avatar.jpg"
                alt="Dantuluri Surya Narayana Raju"
                className="absolute inset-[12%] h-[76%] w-[76%] rounded-full object-cover border-2 border-[#00d4ff]"
                style={{ objectPosition: 'center 5%' }}
              />
            )}
            <span className="sr-only">Portrait of Surya drawn in particles</span>
          </div>
        </div>

        <motion.button
          {...fade(1.2)}
          onClick={() => scrollToId('#about')}
          className="mx-auto mt-10 flex flex-col items-center gap-2"
          aria-label="Scroll to About"
        >
          <span className="text-slate-400 text-xs tracking-[0.3em] uppercase">Scroll</span>
          <span className="relative block h-10 w-6 rounded-full border border-slate-600">
            <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-[#00d4ff] animate-[scrolldot_1.6s_ease-in-out_infinite]" />
          </span>
        </motion.button>
      </div>
    </section>
  );
}
