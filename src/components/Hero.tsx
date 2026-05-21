import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Trophy, ExternalLink } from 'lucide-react';

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const typingPhrases = [
  'I build AI-powered systems',
  'I build real-time ML pipelines',
  'I build full-stack applications',
  'LeetCode Knight | Top 3.5% globally',
];

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/DSurya11',
    icon: <GithubIcon />,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/surya-dantuluri-2a2b4a280/',
    icon: <LinkedinIcon />,
  },
  {
    label: 'LeetCode',
    href: 'https://leetcode.com/u/this_is_surya/',
    icon: <Trophy size={20} />,
  },
  {
    label: 'Codeforces',
    href: 'https://codeforces.com/profile/_.surya._',
    icon: <Code2 size={20} />,
  },
  {
    label: 'CodeChef',
    href: 'https://www.codechef.com/users/this_is_surya',
    icon: <ExternalLink size={20} />,
  },
];

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = typingPhrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex <= current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex));
        setCharIndex((c) => c + 1);
      }, 60);
    } else if (!isDeleting && charIndex > current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex));
        setCharIndex((c) => c - 1);
      }, 35);
    } else {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % typingPhrases.length);
      setCharIndex(0);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex items-center justify-center pt-16 pb-12 overflow-hidden"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 60%)' }}
        />
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

          {/* ── LEFT: text ── */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="inline-block text-[#00d4ff] text-sm font-mono tracking-widest uppercase mb-6 px-3 py-1 border border-[#00d4ff55] rounded-full bg-[#00d4ff15]">
                Open to Internships &amp; Full-Time Roles
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Hi, I'm{' '}
              <span className="text-[#00d4ff]" style={{ textShadow: '0 0 30px #00d4ff66' }}>
                Surya
              </span>{' '}
              👋
            </motion.h1>

            {/* Typing animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="h-14 flex items-center justify-center lg:justify-start mb-6"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-mono text-slate-300 min-h-[1.5em]">
                <span>{displayed}</span>
                <span className="inline-block w-0.5 h-9 bg-[#00d4ff] ml-1 animate-pulse align-middle" />
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-slate-400 text-lg mb-10"
            >
              Pre-final year CSE @{' '}
              <span className="text-slate-200 font-medium">IIIT Jabalpur</span> &nbsp;|&nbsp; CPI{' '}
              <span className="text-[#00d4ff] font-semibold">8.1</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <button
                onClick={() => scrollTo('#projects')}
                className="px-8 py-3.5 bg-[#00d4ff] text-[#0a0a0f] font-semibold rounded-lg hover:bg-[#00bbdd] transition-all duration-200 shadow-lg shadow-[#00d4ff33] hover:shadow-[#00d4ff55] hover:-translate-y-0.5 text-sm"
              >
                View Projects
              </button>
              <a
                href="https://drive.google.com/file/d/1im7brBirdHxuf1hUdZLaOUYjAk4Ou3UT/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 border border-[#00d4ff77] text-[#00d4ff] font-semibold rounded-lg hover:bg-[#00d4ff18] transition-all duration-200 hover:-translate-y-0.5 text-sm"
              >
                Download Resume
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-3 flex-wrap"
            >
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ffffff25] bg-[#ffffff0f] text-slate-400 hover:text-[#00d4ff] hover:border-[#00d4ff66] hover:bg-[#00d4ff18] transition-all duration-200 text-sm"
                >
                  {s.icon}
                  <span className="hidden sm:inline">{s.label}</span>
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: photo ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 flex-shrink-0 flex items-center justify-center lg:mr-4"
          >
            <div className="relative">
              {/* Outer ambient glow */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-40 scale-110"
                style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)' }}
              />
              {/* Rotating dashed ring */}
              <div
                className="absolute -inset-3 rounded-full border border-dashed border-[#00d4ff44] animate-spin"
                style={{ animationDuration: '12s' }}
              />
              {/* Photo container */}
              <div
                className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden"
                style={{
                  border: '3px solid #00d4ff',
                  boxShadow: '0 0 30px #00d4ff66, 0 0 60px #00d4ff33, inset 0 0 20px #00d4ff11',
                }}
              >
                <img
                  src="/avatar.jpg"
                  alt="Dantuluri Surya Narayana Raju"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 5%' }}
                />
              </div>
            </div>
          </motion.div>

        </div>

        {/* Scroll indicator — in content flow, always below social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center gap-2 mt-10"
        >
          <span className="text-slate-600 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#00d4ff55] to-transparent animate-pulse" />
        </motion.div>
      </div>

    </section>
  );
}
