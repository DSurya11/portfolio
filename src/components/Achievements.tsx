import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './fx/SectionHeading';
import { SlidingNumber } from './fx/SlidingNumber';
import { gsap, useGSAP, reducedMotion } from '../lib/motion';

const achievements = [
  {
    platform: 'LeetCode',
    rank: 'Knight',
    accent: '#f59e0b',
    rating: 1948,
    ratingLabel: 'Contest rating',
    facts: ['789 problems solved · 41 contests', 'Top 3.34% globally', 'Rank 28,200 / 874,349'],
    link: 'https://leetcode.com/u/this_is_surya/',
  },
  {
    platform: 'Codeforces',
    rank: 'Pupil',
    accent: '#00d4ff',
    rating: 1262,
    ratingLabel: 'Rating',
    facts: ['30+ contests', 'Div. 2 rated', 'Active in regular rounds'],
    link: 'https://codeforces.com/profile/_.surya._',
  },
  {
    platform: 'CodeChef',
    rank: '3★',
    accent: '#ec4899',
    rating: 1613,
    ratingLabel: 'Peak rating',
    facts: ['16 contests · 64 problems solved', 'Global rank #15,377', 'Country rank #14,001'],
    link: 'https://www.codechef.com/users/this_is_surya',
  },
];

// A scoreboard: three columns between hairlines, everything readable at once. The only motion
// is the columns rising in and the ratings rolling up like an odometer.
export default function Achievements() {
  const ref = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const inView = useInView(board, { once: true, margin: '-120px' });

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.score-col', {
        y: 36,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: board.current, start: 'top 82%', once: true },
      });
      gsap.from('.score-rule', {
        scaleX: 0,
        transformOrigin: '0% 50%',
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: board.current, start: 'top 82%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section id="achievements" ref={ref} className="relative py-24 pb-36">
      <div className="page-x relative z-10">
        <SectionHeading eyebrow="Competitive programming">
          <span className="text-[#00d4ff]">Achievements</span>
        </SectionHeading>

        <div ref={board}>
          <div className="score-rule h-px bg-white/15" />
          <div className="grid md:grid-cols-3">
            {achievements.map((a, i) => (
              <div
                key={a.platform}
                className={`score-col flex flex-col py-10 md:px-10 ${i > 0 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''} ${
                  i === 0 ? 'md:pl-0' : ''
                } ${i === achievements.length - 1 ? 'md:pr-0' : ''}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">{a.platform}</p>
                  <p className="text-sm font-semibold" style={{ color: a.accent }}>
                    {a.rank}
                  </p>
                </div>

                <div className="mt-8 text-7xl font-black leading-none tracking-tight text-white sm:text-8xl">
                  <SlidingNumber value={a.rating} play={inView} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="h-px w-6" style={{ backgroundColor: a.accent }} />
                  <p className="text-xs uppercase tracking-widest text-slate-500">{a.ratingLabel}</p>
                </div>

                <ul className="mt-8 space-y-2 text-[15px] text-slate-300">
                  {a.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  View profile
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            ))}
          </div>
          <div className="score-rule h-px bg-white/15" />
        </div>
      </div>
    </section>
  );
}
