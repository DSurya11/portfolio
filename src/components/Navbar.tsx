import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { scrollToId, lockScroll } from '../lib/scroll';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const mid = window.innerHeight * 0.45;
      let current = '';
      for (const l of navLinks) {
        const el = document.querySelector(l.href);
        if (el && el.getBoundingClientRect().top <= mid) current = l.href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    lockScroll(menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    // Let the menu's lock release before scrolling.
    requestAnimationFrame(() => scrollToId(href));
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-black/90 border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="page-x">
          <div className="flex items-center justify-between h-16">
            <a href="#hero" onClick={(e) => go(e, '#hero')} className="relative z-[60] text-2xl font-bold tracking-tight">
              <span className="text-[#00d4ff]">D</span>
              <span className="text-white">S</span>
            </a>

            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    className={`relative text-sm transition-colors duration-200 ${active === link.href ? 'text-[#00d4ff]' : 'text-slate-400 hover:text-white'}`}
                  >
                    {link.label}
                    {active === link.href && (
                      <motion.span layoutId="nav-active" className="absolute -bottom-1.5 left-0 right-0 h-px bg-[#00d4ff]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <button className="md:hidden relative z-[60] flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>
              <span className={`block w-6 h-0.5 bg-slate-200 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-slate-200 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-slate-200 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="absolute bottom-0 left-0 right-0 h-px origin-left bg-slate-300/50" />
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-[#07070c]/95 px-8 backdrop-blur-xl md:hidden"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="space-y-3 [perspective:800px]">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, rotateX: -90, y: 30 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '50% 100%' }}
                >
                  <a href={link.href} onClick={(e) => go(e, link.href)} className="flex items-baseline gap-4 text-4xl font-bold text-white">
                    <span className="font-mono text-sm text-[#00d4ff]">{String(i + 1).padStart(2, '0')}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
