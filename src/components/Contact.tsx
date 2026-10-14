import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FillHeading } from './fx/FillHeading';
import { Decrypt } from './fx/Decrypt';
import { Keyboard } from './Keyboard';

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" ref={ref} className="relative pt-24 pb-28">
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        <p className="mb-4 text-center font-mono text-sm uppercase tracking-widest text-[#00d4ff]">
          <Decrypt text="Say hello" />
        </p>
        <div className="mb-10">
          <FillHeading lead="Let's" accent="Connect" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-xl text-center text-lg leading-relaxed text-slate-300"
        >
          Currently targeting <span className="font-medium text-white">Summer 2026 SDE internships, full-time roles</span>. Let's talk.
        </motion.p>

        <Keyboard />
      </div>
    </section>
  );
}
