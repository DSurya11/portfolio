import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { projects } from '../data/projects';
import { SectionHeading } from './fx/SectionHeading';
import { Tilt } from './fx/Tilt';
import { ProjectCover } from './ProjectCover';
import { GithubIcon } from './icons';
import { gsap, useGSAP } from '../lib/motion';

// The detail panel (and anime.js for its diagrams) loads the first time a project is opened.
const ProjectDetail = lazy(() => import('./ProjectDetail').then((m) => ({ default: m.ProjectDetail })));

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<{ index: number; rect: DOMRect | null } | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: the section pins and vertical scroll moves the cards sideways through 3D space.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.project-slot');
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const place = () => {
          const vw = window.innerWidth;
          for (const card of cards) {
            const r = card.getBoundingClientRect();
            const offset = (r.left + r.width / 2 - vw / 2) / vw;
            const rot = gsap.utils.clamp(-48, 48, offset * -55);
            const z = -Math.abs(offset) * 320;
            card.style.transform = `perspective(1600px) rotateY(${rot}deg) translateZ(${z}px)`;
            card.style.opacity = String(gsap.utils.clamp(0.3, 1, 1.15 - Math.abs(offset) * 0.9));
          }
        };
        gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: place,
            onRefresh: place,
          },
        });
        place();
        return () => cards.forEach((c) => (c.style.transform = c.style.opacity = ''));
      });
      // Phones and tablets: a vertical stack where each card tips up into place.
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.project-slot').forEach((card) => {
          gsap.from(card, {
            rotateX: 32,
            y: 90,
            opacity: 0,
            transformPerspective: 1000,
            transformOrigin: '50% 0%',
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 60%', scrub: true },
          });
        });
      });
    },
    { scope: section },
  );

  const openAt = (index: number, el: HTMLElement) => setOpen({ index, rect: el.getBoundingClientRect() });

  return (
    <section id="projects" ref={section} className="relative py-24 lg:py-0 motion-reduce:lg:py-24">
      <div className="relative z-10 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden motion-reduce:lg:h-auto motion-reduce:lg:overflow-visible">
        <SectionHeading eyebrow="What I've built" className="lg:mb-10 px-6">
          Featured <span className="text-[#00d4ff]">Projects</span>
        </SectionHeading>

        <div
          ref={track}
          className="flex flex-col gap-8 px-6 lg:w-max lg:flex-row lg:items-stretch lg:gap-12 lg:pl-[max(2.5rem,calc(50vw-12rem))] lg:pr-[calc(50vw-12rem)] motion-reduce:lg:w-auto motion-reduce:lg:flex-wrap motion-reduce:lg:justify-center motion-reduce:lg:px-10"
        >
          {projects.map((project, i) => (
            <div key={project.title} className="project-slot mx-auto w-full max-w-xl lg:w-[24rem] will-change-transform">
              <Tilt max={9} className="h-full">
                <article
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    openAt(i, e.currentTarget);
                  }}
                  className="group flex h-full cursor-pointer flex-col rounded-2xl border border-white/10 bg-[#0d0d15]/90 p-4 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-[#12121c]/95 [transform-style:preserve-3d]"
                >
                  <div className="[transform:translateZ(30px)]">
                    <ProjectCover index={i} accent={project.accent} title={project.title} />
                  </div>
                  <div className="flex flex-1 flex-col px-1 pt-5 [transform:translateZ(45px)]">
                    <h3 className="mb-2 text-lg font-bold leading-snug text-white">{project.title}</h3>
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-400">{project.description}</p>
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 5).map((t) => (
                        <span key={t} className="rounded px-2 py-0.5 font-mono text-[11px]" style={{ color: project.accent, backgroundColor: `${project.accent}1c` }}>
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 5 && <span className="px-1 py-0.5 font-mono text-[11px] text-slate-500">+{project.tech.length - 5}</span>}
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
                        Explore <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
                          style={{ borderColor: `${project.accent}77`, color: project.accent }}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <span className="ml-auto font-mono text-xs text-slate-600">{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
                    </div>
                  </div>
                </article>
              </Tilt>
            </div>
          ))}
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
