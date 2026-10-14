import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { projects } from '../data/projects';
import { SectionHeading } from './fx/SectionHeading';
import { Decrypt } from './fx/Decrypt';
import { ProjectCover } from './ProjectCover';
import { GithubIcon } from './icons';
import { gsap, useGSAP, ScrollTrigger } from '../lib/motion';
import { scrollToY } from '../lib/scroll';

// The detail panel (and anime.js for its diagrams) loads the first time a project is opened.
const ProjectDetail = lazy(() => import('./ProjectDetail').then((m) => ({ default: m.ProjectDetail })));

const shortName = (title: string) => title.split(/ — | –/)[0];
const pad = (n: number) => String(n).padStart(2, '0');

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const bar = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<{
    index: number;
    rect: DOMRect | null;
  } | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: the section pins with an index on the left; scrolling slides the row of cards
      // (which starts right beside the index) to the left. Flat, no rotation.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => {
          const t = track.current!;
          const right = window.innerWidth - Math.max(56, (window.innerWidth - 1440) / 2 + 56);
          return Math.max(0, t.scrollWidth - (right - t.getBoundingClientRect().left - (gsap.getProperty(t, 'x') as number)));
        };
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance() * 1.15}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.04, st.progress)})`;
              setActive(Math.round(st.progress * (projects.length - 1)));
            },
          },
        });
        trigger.current = tween.scrollTrigger ?? null;
        gsap.from('.proj-index li', {
          x: -24,
          opacity: 0,
          stagger: 0.05,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section.current,
            start: 'top 70%',
            once: true,
          },
        });
        return () => {
          trigger.current = null;
        };
      });
      // Phones and tablets: a vertical list; each card rises in as it arrives.
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.project-slot').forEach((card) => {
          gsap.from(card, {
            y: 48,
            opacity: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          });
        });
      });
    },
    { scope: section },
  );

  // Clicking a name scrolls to the point where that project is the one in focus.
  const jumpTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    scrollToY(st.start + ((st.end - st.start) * i) / (projects.length - 1));
  };

  const openAt = (index: number, el: HTMLElement) => setOpen({ index, rect: el.getBoundingClientRect() });

  return (
    <section id="projects" ref={section} className="relative overflow-x-clip py-24 lg:py-0 motion-reduce:lg:py-24">
      <div className="page-x relative z-10 lg:flex lg:h-screen lg:items-center lg:gap-14 motion-reduce:lg:h-auto motion-reduce:lg:block">
        <div className="lg:hidden motion-reduce:lg:block">
          <SectionHeading eyebrow="What I've built">
            Featured <span className="text-[#00d4ff]">Projects</span>
          </SectionHeading>
        </div>

        <aside className="proj-index hidden w-[19rem] shrink-0 flex-col lg:flex motion-reduce:lg:hidden">
          <p className="font-mono text-sm uppercase tracking-widest text-[#00d4ff]">
            <Decrypt text="What I've built" />
          </p>
          <h2 className="mt-3 text-5xl font-bold leading-[1.05] tracking-tight text-white">
            Featured <span className="text-[#00d4ff]">Projects</span>
          </h2>
          <ol className="mt-10 space-y-1">
            {projects.map((p, i) => (
              <li key={p.title}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={`group flex w-full items-baseline gap-4 rounded-md py-1.5 text-left transition-colors duration-300 ${
                    i === active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="w-6 shrink-0 font-mono text-xs" style={{ color: i === active ? p.accent : undefined }}>
                    {pad(i + 1)}
                  </span>
                  <span
                    className={`truncate text-[15px] transition-transform duration-300 ${i === active ? 'translate-x-1 font-semibold' : ''}`}
                  >
                    {shortName(p.title)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex items-center gap-4">
            <span className="relative h-px flex-1 bg-white/10">
              <span ref={bar} className="absolute inset-0 origin-left bg-slate-300" style={{ transform: 'scaleX(0.04)' }} />
            </span>
            <span className="font-mono text-xs text-slate-400">
              {pad(active + 1)} / {pad(projects.length)}
            </span>
          </div>
        </aside>

        {/* Cards slide out of view at the index's edge (clipped and faded on the left only). */}
        <div className="relative min-w-0 flex-1 lg:[clip-path:inset(-40px_-100vw_-40px_0)] motion-reduce:lg:[clip-path:none]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-black to-transparent lg:block motion-reduce:lg:hidden"
          />
          <div
            ref={track}
            className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-7 lg:pl-1 motion-reduce:lg:grid motion-reduce:lg:grid-cols-3"
          >
            {projects.map((project, i) => (
              <div
                key={project.title}
                className="project-slot mx-auto w-full max-w-xl lg:mx-0 lg:w-[23rem] lg:shrink-0 motion-reduce:lg:w-auto"
              >
                <article
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    openAt(i, e.currentTarget);
                  }}
                  className="group flex h-full cursor-pointer flex-col rounded-2xl border border-white/10 bg-[#0d0d15] p-4 transition-colors duration-300 hover:border-white/[0.18] hover:bg-[#11111a]"
                >
                  <ProjectCover index={i} accent={project.accent} title={project.title} />
                  <div className="flex flex-1 flex-col px-1 pt-5">
                    <h3 className="mb-2 text-lg font-bold leading-snug text-white">{project.title}</h3>
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-400">{project.description}</p>
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="rounded px-2 py-0.5 font-mono text-[11px]"
                          style={{
                            color: project.accent,
                            backgroundColor: `${project.accent}1c`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 5 && (
                        <span className="px-1 py-0.5 font-mono text-[11px] text-slate-500">+{project.tech.length - 5}</span>
                      )}
                    </div>
                    <div className="mt-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAt(i, e.currentTarget.closest('article')!);
                        }}
                        className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-[#0a0a0f]"
                        style={{ backgroundColor: project.accent }}
                      >
                        Explore{' '}
                        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-slate-300 hover:border-white/40 hover:text-white"
                      >
                        <GithubIcon size={16} />
                      </a>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live demo`}
                          className="grid h-9 w-9 place-items-center rounded-lg border text-sm"
                          style={{
                            borderColor: `${project.accent}77`,
                            color: project.accent,
                          }}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <span className="ml-auto font-mono text-xs text-slate-600">
                        {pad(i + 1)} / {pad(projects.length)}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>

      {createPortal(
        <Suspense fallback={null}>
          <AnimatePresence>
            {open && <ProjectDetail key={open.index} project={projects[open.index]} origin={open.rect} onClose={close} />}
          </AnimatePresence>
        </Suspense>,
        document.body,
      )}
    </section>
  );
}
