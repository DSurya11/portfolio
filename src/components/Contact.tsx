import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FillHeading } from './fx/FillHeading';
import { Decrypt } from './fx/Decrypt';
import { Keyboard } from './Keyboard';

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" ref={ref} className="relative pt-[8.25rem] pb-28 lg:pt-[10.5rem]">
      <div className="page-x relative z-10">
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
          Open to <span className="font-medium text-white">full-time roles from 2027</span>. Let's talk.
        </motion.p>

        <Keyboard />
      </div>
    </section>
  );
}
