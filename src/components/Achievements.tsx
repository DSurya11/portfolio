import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Code2, ExternalLink, RotateCw } from 'lucide-react';
import { SectionHeading } from './fx/SectionHeading';
import { SlidingNumber } from './fx/SlidingNumber';
import { gsap, useGSAP, reducedMotion } from '../lib/motion';

const achievements = [
  {
    title: 'LeetCode Knight',
    icon: <Trophy size={26} />,
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
    icon: <Code2 size={26} />,
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
    icon: <Trophy size={26} />,
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

type Achievement = (typeof achievements)[number];

// Turns over on hover (or tap on touch screens, or the flip button from the keyboard).
// Pattern from animate-ui "Flip Card" (animate-ui.com/docs/components/community/flip-card).
function Front({ ach, play }: { ach: Achievement; play: boolean }) {
  const main = ach.stats[0];
  return (
    <>
      <div className="relative mb-4 rounded-2xl p-3.5" style={{ backgroundColor: `${ach.accent}26`, color: ach.accent }}>
        {ach.icon}
      </div>
      <h3 className="relative text-xl font-bold" style={{ color: ach.accent }}>
        {ach.title}
      </h3>
      <span className="relative mt-2 rounded-full px-3 py-1 font-mono text-xs" style={{ backgroundColor: `${ach.accent}26`, color: ach.accent }}>
        {ach.badge}
      </span>
      <div className="relative mt-auto text-6xl font-black tracking-tight text-white sm:text-7xl">
        <SlidingNumber value={main.value} suffix={main.suffix} play={play} />
      </div>
      <span className="relative mt-2 text-xs uppercase tracking-widest text-slate-500">{main.label}</span>
      <span className="relative mt-5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-slate-600">
        <RotateCw size={12} /> Flip for details
      </span>
    </>
  );
}

function Back({ ach }: { ach: Achievement }) {
  return (
    <>
      <p className="relative mb-6 font-mono text-xs uppercase tracking-[0.25em]" style={{ color: ach.accent }}>
        {ach.platform}
      </p>
      <div className="relative mb-6 grid w-full grid-cols-2 gap-4">
        {ach.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] py-4">
            <div className="text-3xl font-bold text-white">
              {s.value}
              {s.suffix}
            </div>
            <div className="mt-1 text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="relative mb-6 text-sm leading-relaxed text-slate-300">{ach.details}</p>
      <a
        href={ach.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-[#0a0a0f]"
        style={{ backgroundColor: ach.accent }}
      >
        View Profile <ExternalLink size={13} />
      </a>
    </>
  );
}

// The other side, seen "through the glass": a mirrored, blurred, faint copy painted inside this
// face. Each face is a plain flat panel with one border (no z-offsets, clips or filters on the
// face itself), so it renders identically in Chrome, Safari and Firefox-based browsers.
function Ghost({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      aria-hidden
      inert
      className={`pointer-events-none absolute inset-0 flex flex-col items-center p-7 text-center opacity-[0.35] blur-[4.5px] [transform:scaleX(-1)] ${center ? 'justify-center' : ''}`}
    >
      {children}
    </div>
  );
}

// Turns over on hover (or tap on touch screens, or the flip button from the keyboard).
// Pattern from animate-ui "Flip Card" (animate-ui.com/docs/components/community/flip-card).
function FlipCard({ ach, play }: { ach: Achievement; play: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const face =
    'absolute inset-0 flex flex-col items-center overflow-hidden rounded-2xl border bg-[#0b0b12] p-7 text-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden]';

  return (
    <div
      className="ach-card relative h-[380px] [perspective:1300px]"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setFlipped(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setFlipped(false)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) return;
        setFlipped((f) => !f);
      }}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reducedMotion() ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 16 }}
      >
        <div className={face} style={{ borderColor: `${ach.accent}55` }}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse at top, ${ach.accent}26 0%, transparent 65%)` }}
          />
          <Ghost center>
            <Back ach={ach} />
          </Ghost>
          <Front ach={ach} play={play} />
        </div>

        <div className={`${face} justify-center [transform:rotateY(180deg)]`} style={{ borderColor: `${ach.accent}88` }}>
          <Ghost>
            <Front ach={ach} play={play} />
          </Ghost>
          <Back ach={ach} />
        </div>
      </motion.div>
      <button
        type="button"
        className="sr-only focus:not-sr-only focus:absolute focus:right-3 focus:top-3 focus:z-10 focus:rounded focus:bg-white focus:px-2 focus:py-1 focus:text-xs focus:text-black"
        onClick={(e) => {
          e.stopPropagation();
          setFlipped((f) => !f);
        }}
      >
        Flip {ach.title} card
      </button>
    </div>
  );
}

export default function Achievements() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.ach-card', {
        rotateY: -75,
        rotateX: 12,
        z: -200,
        opacity: 0,
        transformPerspective: 1200,
        transformOrigin: '0% 50%',
        stagger: 0.16,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ach-grid', start: 'top 82%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section id="achievements" ref={ref} className="relative py-24 pb-40">
      <div className="page-x relative z-10">
        <SectionHeading eyebrow="Competitive programming">
          <span className="text-[#00d4ff]">Achievements</span>
        </SectionHeading>
        <div className="ach-grid grid gap-6 md:grid-cols-3">
          {achievements.map((ach) => (
            <FlipCard key={ach.title} ach={ach} play={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
