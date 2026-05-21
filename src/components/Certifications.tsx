import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, BadgeCheck } from 'lucide-react';

const certs = [
  {
    title: 'Natural Language Processing',
    issuer: 'NPTEL – IIT Kharagpur',
    badge: 'Elite + Silver',
    badgeColor: '#94a3b8',
    score: '85%',
    rank: 'Top 1% of 4,939',
    link: 'https://drive.google.com/file/d/1GMfi-8CMZ67_mQpQT3ZeM-kAYP1Cqbn6/view?usp=sharing',
  },
  {
    title: 'Business Intelligence & Analytics',
    issuer: 'NPTEL – IIT Madras',
    badge: 'Elite + Gold',
    badgeColor: '#f59e0b',
    score: '97%',
    rank: 'Top 2% of 4,256',
    link: 'https://drive.google.com/file/d/1dzX3b7rIQkcKJCN6t145OjtK1HMvL9P3/view?usp=sharing',
  },
  {
    title: 'Ethical Hacking',
    issuer: 'NPTEL – IIT Kharagpur',
    badge: 'Elite + Gold',
    badgeColor: '#f59e0b',
    score: '90%',
    rank: 'Top 2% of 8,443',
    link: 'https://drive.google.com/file/d/1B-FA8aLmyWzpOQKlEzuUv-3zrB7qeEmf/view?usp=sharing',
  },
  {
    title: 'The Joy of Computing Using Python',
    issuer: 'NPTEL – IIT Madras',
    badge: 'Elite + Gold',
    badgeColor: '#f59e0b',
    score: '92%',
    rank: 'Top 5% of 16,472',
    link: 'https://drive.google.com/file/d/1VFg1AC0rA8CO7Wzw3L7T6Wipq3ivnD4X/view?usp=sharing',
  },
  {
    title: 'Complete Machine Learning & Data Science',
    issuer: 'GeeksforGeeks – Skill Up',
    badge: 'Completed',
    badgeColor: '#22c55e',
    score: null,
    rank: null,
    link: 'https://drive.google.com/file/d/128ZKdMLr7Zy0EaqDZPc5rERizCLtGq5S/view',
  },
];

export default function Certifications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="certifications" className="py-20" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00d4ff] font-mono text-sm tracking-widest uppercase">NPTEL &amp; courses</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            <span className="text-[#00d4ff]">Certifications</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert, i) => (
            <motion.a
              key={cert.title}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col rounded-2xl border border-[#ffffff1e] bg-[#111118] p-6 overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#00d4ff55] hover:shadow-[0_16px_48px_#00d4ff28]"
            >
              {/* Glow on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)' }} />

              {/* Verified badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${cert.badgeColor}33`, border: `1px solid ${cert.badgeColor}55`, color: cert.badgeColor }}>
                  <BadgeCheck size={13} />
                  {cert.badge}
                </div>
                <ExternalLink
                  size={14}
                  className="text-slate-600 group-hover:text-[#00d4ff] transition-colors"
                />
              </div>

              {/* Title */}
              <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-[#00d4ff] transition-colors">
                {cert.title}
              </h3>

              {/* Issuer */}
              <p className="text-slate-500 text-xs mb-4 flex items-center gap-1.5">
                <BadgeCheck size={12} className="text-[#00d4ff] shrink-0" />
                {cert.issuer}
              </p>

              {/* Stats */}
              <div className="mt-auto space-y-2">
                {cert.score && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Score</span>
                    <span className="text-sm font-bold" style={{ color: cert.badgeColor }}>
                      {cert.score}
                    </span>
                  </div>
                )}
                {cert.rank && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Rank</span>
                    <span className="text-xs text-[#00d4ff] font-medium">{cert.rank}</span>
                  </div>
                )}
                {!cert.score && !cert.rank && (
                  <p className="text-xs text-slate-500">Self-paced certification course</p>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
