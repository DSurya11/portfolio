import { useMemo } from 'react';

function coverLines(index: number) {
  let seed = (index + 1) * 7919;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 14 }, (_, i) => {
    const amp = 10 + rand() * 26;
    const freq = 0.012 + rand() * 0.02;
    const phase = rand() * Math.PI * 2;
    const y0 = 30 + i * 9.5;
    let d = `M -10 ${y0}`;
    for (let x = 0; x <= 420; x += 12) d += ` L ${x} ${(y0 + Math.sin(x * freq + phase) * amp * Math.sin((x / 420) * Math.PI)).toFixed(1)}`;
    return { d, o: 0.15 + rand() * 0.55, w: 0.6 + rand() * 1.2 };
  });
}

// Generative cover art per project: flowing signal lines in the project's colour over its
// number. Deterministic per index, so every visit draws the same picture.
export function ProjectCover({ index, accent, title }: { index: number; accent: string; title: string }) {
  const lines = useMemo(() => coverLines(index), [index]);

  const short = title.split(/ — | –/)[0];

  return (
    <div className="project-cover relative h-40 overflow-hidden rounded-xl border border-white/10 bg-[#07070c]">
      <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`pg-${index}`} cx="75%" cy="20%" r="80%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="160" fill={`url(#pg-${index})`} />
        <g className="cover-lines">
          {lines.map((l, i) => (
            <path key={i} d={l.d} fill="none" stroke={accent} strokeOpacity={l.o} strokeWidth={l.w} />
          ))}
        </g>
      </svg>
      <span
        className="absolute -bottom-6 right-3 font-mono text-[7.5rem] font-black leading-none tracking-tighter text-transparent"
        style={{ WebkitTextStroke: `1px ${accent}88` }}
        aria-hidden
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="absolute left-4 top-4 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
        {short}
      </span>
    </div>
  );
}
