import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Trophy, Code2, ExternalLink } from 'lucide-react';

interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  inView: boolean;
}

function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1800, inView }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
}

const achievements = [
  {
    title: 'LeetCode Knight',
    icon: <Trophy size={28} />,
    accent: '#f59e0b',
    badge: '🏆 Knight',
    stats: [
      { label: 'Contest Rating', value: 1948, suffix: '' },
      { label: 'Problems Solved', value: 789, suffix: '' },
    ],
    details: 'Top 3.34% globally · Rank 28,200 / 874,349 · 41 contests',
    link: 'https://leetcode.com/u/this_is_surya/',
    platform: 'LeetCode',
  },
  {
    title: 'Codeforces Pupil',
    icon: <Code2 size={28} />,
    accent: '#00d4ff',
    badge: '⚡ Pupil',
    stats: [
      { label: 'Rating', value: 1262, suffix: '' },
      { label: 'Contests', value: 30, suffix: '+' },
    ],
    details: 'Div. 2 rated · active in regular rounds',
    link: 'https://codeforces.com/profile/_.surya._',
    platform: 'Codeforces',
  },
  {
    title: 'CodeChef 3★',
    icon: <Trophy size={28} />,
    accent: '#ec4899',
    badge: '⭐⭐⭐ 3-Star',
    stats: [
      { label: 'Peak Rating', value: 1613, suffix: '' },
      { label: 'Contests', value: 16, suffix: '' },
    ],
    details: 'Global Rank #15,377 · Country Rank #14,001 · 64 problems solved',
    link: 'https://www.codechef.com/users/this_is_surya',
    platform: 'CodeChef',
  },
];

export default function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="achievements" className="py-20 bg-[#111118]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00d4ff] font-mono text-sm tracking-widest uppercase">Competitive programming</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            <span className="text-[#00d4ff]">Achievements</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((ach, i) => (
            <motion.a
              key={ach.title}
              href={ach.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl bg-[#0a0a0f] p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-300 cursor-pointer"
              style={{ border: `1px solid ${ach.accent}55` }}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at top, ${ach.accent}30 0%, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <div
                className="relative z-10 p-4 rounded-2xl mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${ach.accent}33`, color: ach.accent }}
              >
                {ach.icon}
              </div>

              {/* Title */}
              <h3
                className="relative z-10 text-xl font-bold mb-1 transition-colors duration-300"
                style={{ color: ach.accent }}
              >
                {ach.title}
              </h3>

              <span
                className="relative z-10 text-xs font-mono px-3 py-1 rounded-full mb-6"
                style={{ backgroundColor: `${ach.accent}30`, color: ach.accent }}
              >
                {ach.badge}
              </span>

              {/* Stats */}
              <div className="relative z-10 grid grid-cols-2 gap-4 w-full mb-5">
                {ach.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        inView={inView}
                        duration={1500}
                      />
                    </span>
                    <span className="text-xs text-slate-500 mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Details */}
              <p className="relative z-10 text-slate-400 text-sm mb-4">{ach.details}</p>

              <div
                className="relative z-10 flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 group-hover:underline"
                style={{ color: ach.accent }}
              >
                View Profile <ExternalLink size={12} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
