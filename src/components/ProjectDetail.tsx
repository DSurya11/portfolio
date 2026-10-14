import { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import type { Project } from '../data/projects';
import { ArchDiagram } from './ArchDiagram';
import { GithubIcon } from './icons';
import { EASE_OUT, reducedMotion } from '../lib/motion';
import { lockScroll } from '../lib/scroll';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } };

// Opens centred over the dimmed page, unfolding out of the card that was clicked with a clip
// (never a scale, so text stays crisp), then folds shut toward its right edge.
export function ProjectDetail({ project, origin, onClose }: { project: Project; origin: DOMRect | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useLayoutEffect(() => {
    const el = panel.current;
    if (!el || reducedMotion()) return;
    const r = el.getBoundingClientRect();
    if (origin) {
      const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), Math.max(max, 0));
      const top = clamp(origin.top - r.top, r.height - 12);
      const bottom = clamp(r.bottom - origin.bottom, r.height - top - 12);
      const left = clamp(origin.left - r.left, r.width - 12);
      const right = clamp(r.right - origin.right, r.width - left - 12);
      animate(el, { clipPath: [`inset(${top}px ${right}px ${bottom}px ${left}px round 18px)`, 'inset(0px 0px 0px 0px round 18px)'] }, { duration: 0.7, ease: EASE_OUT });
    } else {
      animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.45, ease: EASE_OUT });
    }
  }, [origin]);

  useEffect(() => {
    opener.current = document.activeElement;
    lockScroll(true);
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <motion.div
        className="absolute inset-0 bg-[#05050a]/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        onClick={onClose}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        tabIndex={-1}
        data-lenis-prevent
        exit={
          reducedMotion()
            ? { opacity: 0 }
            : { clipPath: ['inset(0px 0px 0px 0% round 18px)', 'inset(0px 0px 0px 100% round 18px)'], opacity: [1, 0], transition: { duration: 0.34, ease: [0.4, 0, 1, 1] } }
        }
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-[18px] border border-white/10 bg-[#0b0b12] outline-none shadow-2xl shadow-black/60"
      >
        <span aria-hidden className="panel-sweep" style={{ ['--sweep' as string]: project.accent }} />
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-[#0b0b12]/95 px-5 py-3 backdrop-blur">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.accent }} />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Project</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project"
            className="group ml-auto grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7 p-5 sm:p-8">
          <motion.h3 variants={item} className="text-2xl font-bold leading-tight text-white sm:text-3xl">
            {project.title}
          </motion.h3>
          <motion.p variants={item} className="leading-relaxed text-slate-300">
            {project.description}
          </motion.p>

          <motion.div variants={item} className="rounded-xl border border-white/10 bg-[#07070c] p-3 sm:p-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">How it fits together</p>
            <div className="-mx-1 overflow-x-auto px-1" data-lenis-prevent>
              <div className="min-w-[540px]">
                <ArchDiagram diagram={project.diagram} accent={project.accent} />
              </div>
            </div>
          </motion.div>

          <motion.ul variants={item} className="grid gap-2 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
                {h}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-md px-2.5 py-1 font-mono text-xs"
                style={{ color: project.accent, backgroundColor: `${project.accent}1f`, border: `1px solid ${project.accent}55` }}
              >
                {t}
              </span>
            ))}
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-slate-200 hover:border-white/40 hover:text-white"
            >
              <GithubIcon size={16} />
              Source on GitHub
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0a0a0f]"
                style={{ backgroundColor: project.accent }}
              >
                <ExternalLink size={15} />
                Live Demo
              </a>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
