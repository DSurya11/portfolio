import { useRef, useState } from 'react';
import {
  siCplusplus, siPython, siJavascript, siTypescript, siMysql, siReact, siHtml5, siSocketdotio, siNodedotjs,
  siExpress, siFastapi, siPostgresql, siMongodb, siRedis, siPrisma, siSqlalchemy, siNumpy, siPandas,
  siScikitlearn, siTensorflow, siKeras, siDocker, siGit, siPostman,
} from 'simple-icons';
import { IconCloud, type CloudItem } from './IconCloud';
import { SectionHeading } from './fx/SectionHeading';
import { useNear } from '../lib/useNear';

const skillGroups = [
  { category: 'Languages', color: '#00d4ff', skills: ['C++', 'Python', 'JavaScript', 'TypeScript', 'SQL'] },
  { category: 'Frontend', color: '#a78bfa', skills: ['React.js', 'HTML/CSS', 'Socket.IO'] },
  { category: 'Backend', color: '#10b981', skills: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'WebSockets', 'BullMQ', 'Microservices'] },
  { category: 'Databases & Cache', color: '#f59e0b', skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma ORM', 'SQLAlchemy'] },
  { category: 'ML / AI', color: '#ec4899', skills: ['NumPy', 'Pandas', 'Scikit-learn', 'XGBoost', 'TensorFlow', 'Keras', 'Sentence Transformers', 'LLM APIs'] },
  { category: 'DevOps & Tools', color: '#f97316', skills: ['Docker', 'Docker Compose', 'Git', 'Postman'] },
];

// Logos from Simple Icons (CC0). Skills without their own logo appear in the cloud as text tags.
const logos: Record<string, { path: string; hex: string }> = {
  'C++': siCplusplus, Python: siPython, JavaScript: siJavascript, TypeScript: siTypescript,
  'React.js': siReact, 'HTML/CSS': siHtml5, 'Socket.IO': siSocketdotio, 'Node.js': siNodedotjs,
  'Express.js': siExpress, FastAPI: siFastapi, PostgreSQL: siPostgresql, MySQL: siMysql, MongoDB: siMongodb,
  Redis: siRedis, 'Prisma ORM': siPrisma, SQLAlchemy: siSqlalchemy, NumPy: siNumpy, Pandas: siPandas,
  'Scikit-learn': siScikitlearn, TensorFlow: siTensorflow, Keras: siKeras,
  Docker: siDocker, Git: siGit, Postman: siPostman,
};

const groupColors = Object.fromEntries(skillGroups.map((g) => [g.category, g.color]));
const cloudItems: CloudItem[] = skillGroups.flatMap((g) =>
  g.skills.map((s) => ({
    label: s,
    group: g.category,
    color: logos[s] ? `#${logos[s].hex}` : g.color,
    path: logos[s]?.path,
  })),
);

export default function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const near = useNear(cloudRef);

  return (
    <section id="skills" className="relative py-24">
      <div className="page-x relative z-10">
        <SectionHeading eyebrow="What I work with">
          Tech <span className="text-[#00d4ff]">Stack</span>
        </SectionHeading>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
          <div ref={cloudRef} className="relative mx-auto w-full max-w-[680px]">
            {near ? <IconCloud items={cloudItems} groupColors={groupColors} highlight={active} /> : <div className="aspect-square w-full" />}
            <p className="mt-2 text-center font-mono text-xs uppercase tracking-widest text-slate-500">Drag to spin · tap a logo</p>
          </div>

          <div className="space-y-2" onMouseLeave={() => setActive(null)}>
            {skillGroups.map((group) => {
              const on = active === group.category;
              return (
                <button
                  key={group.category}
                  type="button"
                  onMouseEnter={() => setActive(group.category)}
                  onFocus={() => setActive(group.category)}
                  onClick={() => setActive(on ? null : group.category)}
                  aria-pressed={on}
                  className="group block w-full rounded-xl border px-5 py-4 text-left transition-all duration-300"
                  style={{
                    borderColor: on ? `${group.color}88` : 'rgba(255,255,255,0.08)',
                    backgroundColor: on ? `${group.color}14` : 'rgba(11,11,18,0.6)',
                    transform: on ? 'translateX(8px)' : 'none',
                  }}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: group.color }} />
                    <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: group.color }}>
                      {group.category}
                    </h3>
                    <span className="ml-auto font-mono text-xs text-slate-600">{String(group.skills.length).padStart(2, '0')}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{group.skills.join(' · ')}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
