import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './fx/SectionHeading';
import { SplitFlap } from './fx/SplitFlap';
import { gsap, useGSAP, ScrollTrigger, reducedMotion } from '../lib/motion';

const achievements = [
  {
    platform: 'LeetCode',
    rank: 'Knight',
    accent: '#f59e0b',
    rating: 1980,
    ratingLabel: 'Contest rating',
    facts: ['835 problems solved · 48 contests', 'Top 2.93% globally', 'Rank 25,171 / 888,637'],
    link: 'https://leetcode.com/u/this_is_surya/',
  },
  {
    platform: 'Codeforces',
    rank: 'Pupil',
    accent: '#00d4ff',
    rating: 1262,
    ratingLabel: 'Rating',
    facts: ['17 rated contests', 'Div. 2 rated', 'Active in regular rounds'],
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

// A scoreboard in one framed panel. As it comes into view, the panel stands up from lying almost
// flat (rotateX) with its columns coming forward in depth; once it faces you,
// the ratings flip into place on split-flap tiles. Clicking a rating replays its flaps.
export default function Achievements() {
  const ref = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const boardWrap = useRef<HTMLDivElement>(null);
  const [runs, setRuns] = useState<number[]>(() => achievements.map(() => 0));
  const playAll = () => setRuns((r) => r.map((n) => n + 1));
  const replay = (i: number) => setRuns((r) => r.map((n, j) => (j === i ? n + 1 : n)));

  useGSAP(
    () => {
      if (reducedMotion()) return;
      // Plays as a whole once the panel starts to come into view (not tied to scroll position),
      // so it is always fully upright even if the visitor stops scrolling halfway.
      // Phones stack the columns into a tall panel: a gentler tilt, or it looks extreme.
      const tall = window.matchMedia('(max-width: 767px)').matches;
      gsap.set(board.current, {
        rotateX: tall ? 22 : 62,
        y: tall ? 60 : 120,
        opacity: 0.15,
        transformPerspective: 1400,
        transformOrigin: '50% 100%',
      });
      gsap.set('.score-col', { z: -160, opacity: 0, transformPerspective: 1400 });
      // Triggered by the untilted wrapper: the tilted panel's own box sits lower on screen,
      // which made it start late on phones.
      ScrollTrigger.create({
        trigger: boardWrap.current,
        start: 'top 64%',
        once: true,
        onEnter: () => {
          gsap
            .timeline({ onComplete: playAll })
            .to(board.current, { rotateX: 0, y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
            .to('.score-col', { z: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }, 0.2);
        },
      });
    },
    { scope: ref },
  );

  return (
    <section id="achievements" ref={ref} className="relative py-24 pb-36 lg:py-[8.25rem]">
      <div className="page-x relative z-10">
        <SectionHeading eyebrow="Competitive programming">
          <span className="text-[#00d4ff]">Achievements</span>
        </SectionHeading>

        <div ref={boardWrap}>
          <div ref={board} className="rounded-2xl border border-white/15 bg-[#07070b]">
            <div className="grid md:grid-cols-3">
              {achievements.map((a, i) => (
                <div
                  key={a.platform}
                  className={`score-col flex flex-col px-6 py-10 sm:px-10 ${i > 0 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''}`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">{a.platform}</p>
                    <p className="text-sm font-semibold" style={{ color: a.accent }}>
                      {a.rank}
                    </p>
                  </div>

                  <div className="mt-8 text-6xl font-black leading-none text-white sm:text-7xl xl:text-8xl">
                    <SplitFlap value={a.rating} play={runs[i]} onReplay={() => replay(i)} />
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
                    className="group -my-2 mt-6 inline-flex w-fit items-center gap-1.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    View profile
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
