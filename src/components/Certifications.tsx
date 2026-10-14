import { useEffect, useRef, useState } from 'react';
import { ExternalLink, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from './fx/SectionHeading';
import { gsap, useGSAP, reducedMotion } from '../lib/motion';

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

const STEP = 360 / certs.length;

// The certificates stand on a turning cylinder. On desktop the section pins and scrolling turns
// the ring one certificate at a time; anywhere, you can drag it or use the arrows.
export default function Certifications() {
  const section = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const angle = useRef({ scroll: 0, drag: 0, shown: 0 });
  const [front, setFront] = useState(0);
  const [radius, setRadius] = useState(330);

  useEffect(() => {
    const fit = () => setRadius(window.innerWidth < 640 ? 230 : window.innerWidth < 1024 ? 290 : 340);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // One loop eases the shown angle toward scroll + drag and shades each card by how much it faces you.
  useEffect(() => {
    const reduce = reducedMotion();
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '200px' });
    io.observe(ring.current!.parentElement!);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const a = angle.current;
      const target = a.scroll + a.drag;
      a.shown += (target - a.shown) * (reduce ? 1 : 0.1);
      if (!ring.current) return;
      ring.current.style.transform = `translateZ(${-radius}px) rotateY(${a.shown}deg)`;
      const cards = ring.current.children;
      let best = 0;
      let bestFacing = -2;
      for (let i = 0; i < cards.length; i++) {
        const facing = Math.cos(((i * STEP + a.shown) * Math.PI) / 180);
        const el = cards[i] as HTMLElement;
        el.style.opacity = String(0.18 + Math.max(0, facing) * 0.82);
        el.style.filter = facing > 0.92 ? 'none' : `blur(${(1 - Math.max(facing, 0)) * 2.5}px)`;
        el.style.pointerEvents = facing > 0.7 ? 'auto' : 'none';
        if (facing > bestFacing) {
          bestFacing = facing;
          best = i;
        }
      }
      setFront((f) => (f === best ? f : best));
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [radius]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to(angle.current, {
          scroll: -STEP * (certs.length - 1),
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top top', end: '+=160%', pin: true, scrub: 0.6 },
        });
      });
    },
    { scope: section },
  );

  // Drag (mouse or touch) to turn; releasing snaps to the nearest certificate.
  useEffect(() => {
    const el = ring.current!.parentElement!;
    let start: { x: number; drag: number } | null = null;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a')) return;
      start = { x: e.clientX, drag: angle.current.drag };
    };
    const move = (e: PointerEvent) => {
      if (!start) return;
      angle.current.drag = start.drag + (e.clientX - start.x) * 0.35;
    };
    const up = () => {
      if (!start) return;
      start = null;
      const total = angle.current.scroll + angle.current.drag;
      angle.current.drag += Math.round(total / STEP) * STEP - total;
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointercancel', up);
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  const turn = (dir: number) => {
    angle.current.drag -= dir * STEP;
  };

  return (
    <section id="certifications" ref={section} className="relative py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-10">
        <SectionHeading eyebrow="NPTEL & courses" className="lg:mb-6">
          <span className="text-[#00d4ff]">Certifications</span>
        </SectionHeading>

        <div className="relative mx-auto h-[420px] select-none [perspective:1500px] touch-pan-y" data-cursor="grab">
          <div ref={ring} className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]">
            {certs.map((cert, i) => (
              <a
                key={cert.title}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={i === front ? 0 : -1}
                draggable={false}
                className="group absolute -left-[8.5rem] -top-[10.5rem] flex h-[21rem] w-[17rem] flex-col rounded-2xl border border-white/10 bg-[#0d0d15]/95 p-6 sm:-left-[9.5rem] sm:w-[19rem]"
                style={{ transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)`, borderColor: `${cert.badgeColor}55` }}
              >
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: `radial-gradient(ellipse at top right, ${cert.badgeColor}22, transparent 60%)` }} />
                <div className="relative mb-5 flex items-center justify-between">
                  <span
                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: `${cert.badgeColor}26`, border: `1px solid ${cert.badgeColor}55`, color: cert.badgeColor }}
                  >
                    <BadgeCheck size={13} />
                    {cert.badge}
                  </span>
                  <span className="font-mono text-xs text-slate-600">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="relative mb-2 text-lg font-semibold leading-snug text-white group-hover:text-[#00d4ff]">{cert.title}</h3>
                <p className="relative flex items-center gap-1.5 text-xs text-slate-400">
                  <BadgeCheck size={12} className="shrink-0 text-[#00d4ff]" />
                  {cert.issuer}
                </p>
                <div className="relative mt-auto space-y-3">
                  {cert.score && (
                    <div className="flex items-end justify-between">
                      <span className="text-xs text-slate-500">Score</span>
                      <span className="text-4xl font-black" style={{ color: cert.badgeColor }}>
                        {cert.score}
                      </span>
                    </div>
                  )}
                  {cert.rank && (
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">Rank</span>
                      <span className="text-xs font-medium text-[#00d4ff]">{cert.rank}</span>
                    </div>
                  )}
                  {!cert.score && !cert.rank && <p className="text-xs text-slate-500">Self-paced certification course</p>}
                  <span className="flex items-center gap-1.5 border-t border-white/10 pt-3 text-xs text-slate-400 group-hover:text-[#00d4ff]">
                    View certificate <ExternalLink size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-4">
          <button type="button" onClick={() => turn(-1)} aria-label="Previous certificate" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300 hover:border-[#00d4ff] hover:text-[#00d4ff]">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {certs.map((c, i) => (
              <span key={c.title} className={`h-1.5 rounded-full transition-all duration-300 ${i === front ? 'w-6 bg-[#00d4ff]' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
          <button type="button" onClick={() => turn(1)} aria-label="Next certificate" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300 hover:border-[#00d4ff] hover:text-[#00d4ff]">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
