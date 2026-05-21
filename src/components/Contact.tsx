import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Trophy, Code2, ExternalLink } from 'lucide-react';

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

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/DSurya11',
    icon: <GithubIcon />,
    color: '#ffffff',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/surya-dantuluri-2a2b4a280/',
    icon: <LinkedinIcon />,
    color: '#0a66c2',
  },
  {
    label: 'LeetCode',
    href: 'https://leetcode.com/u/this_is_surya/',
    icon: <Trophy size={20} />,
    color: '#f59e0b',
  },
  {
    label: 'Codeforces',
    href: 'https://codeforces.com/profile/_.surya._',
    icon: <Code2 size={20} />,
    color: '#00d4ff',
  },
  {
    label: 'CodeChef',
    href: 'https://www.codechef.com/users/this_is_surya',
    icon: <ExternalLink size={20} />,
    color: '#b45309',
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="pt-10 pb-20 bg-[#111118]" ref={ref}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-[#00d4ff] font-mono text-sm tracking-widest uppercase">Say hello</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            Let's <span className="text-[#00d4ff]">Connect</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Currently targeting{' '}
          <span className="text-slate-200 font-medium">Summer 2025 SDE internships</span>.
          Let's talk.
        </motion.p>

        {/* Big email button */}
        <motion.a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=suryadantuluri2005@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#00d4ff] text-[#0a0a0f] font-semibold text-lg shadow-lg shadow-[#00d4ff44] hover:shadow-[#00d4ff66] hover:bg-[#00c4ee] transition-all duration-200 mb-12"
        >
          <Mail size={22} />
          suryadantuluri2005@gmail.com
        </motion.a>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#ffffff15] bg-[#0a0a0f] text-slate-400 hover:text-white hover:border-[#ffffff30] transition-all duration-200 text-sm"
            >
              <span style={{ color: s.color }}>{s.icon}</span>
              {s.label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
