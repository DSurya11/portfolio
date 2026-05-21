import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, MapPin, Mail } from 'lucide-react';

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-20" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00d4ff] font-mono text-sm tracking-widest uppercase">Get to know me</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            About <span className="text-[#00d4ff]">Me</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left: Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              I'm a pre-final year Computer Science student at{' '}
              <span className="text-[#00d4ff] font-medium">IIIT Jabalpur</span> with a CPI of{' '}
              <span className="text-[#00d4ff] font-semibold">8.1</span>. I specialize in building
              production-grade AI systems, real-time ML pipelines, and full-stack applications.
              Passionate about backend engineering, machine learning, and competitive programming.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={16} className="text-[#00d4ff] shrink-0" />
                <span>Jabalpur, MP, India</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail size={16} className="text-[#00d4ff] shrink-0" />
                <a
                  href="mailto:suryadantuluri2005@gmail.com"
                  className="hover:text-[#00d4ff] transition-colors"
                >
                  suryadantuluri2005@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Education card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="rounded-2xl border border-[#00d4ff44] bg-[#111118] p-8 relative overflow-hidden card-hover">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
                style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)' }} />

              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[#00d4ff22] border border-[#00d4ff55]">
                  <GraduationCap size={24} className="text-[#00d4ff]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    Indian Institute of Information Technology Jabalpur
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">IIIT Jabalpur</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#ffffff18]">
                  <span className="text-slate-400 text-sm">Degree</span>
                  <span className="text-slate-200 text-sm font-medium">B.Tech – CSE</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#ffffff18]">
                  <span className="text-slate-400 text-sm">CPI</span>
                  <span className="text-[#00d4ff] font-bold text-lg">8.1 / 10</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 text-sm">Duration</span>
                  <span className="text-slate-200 text-sm font-medium">Aug 2023 – May 2027</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
