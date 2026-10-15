import { useMemo } from 'react';

const W = 400;
const H = 160;
const SCALE = 2;

// Generative cover art per project: flowing signal lines in the project's colour over its
// number. Deterministic per index, so every visit draws the same picture. Drawn once into a
// bitmap: as vector art, every card entering the sliding row cost the GPU ~80 ms to rasterise.
function drawCover(index: number, accent: string) {
  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = '#07070c';
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.75, H * 0.2, 0, W * 0.75, H * 0.2, W * 0.8);
  glow.addColorStop(0, `${accent}59`);
  glow.addColorStop(1, `${accent}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  let seed = (index + 1) * 7919;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  ctx.strokeStyle = accent;
  for (let i = 0; i < 14; i++) {
    const amp = 10 + rand() * 26;
    const freq = 0.012 + rand() * 0.02;
    const phase = rand() * Math.PI * 2;
    const y0 = 30 + i * 9.5;
    ctx.beginPath();
    ctx.moveTo(-10, y0);
    for (let x = 0; x <= 420; x += 12) ctx.lineTo(x, y0 + Math.sin(x * freq + phase) * amp * Math.sin((x / 420) * Math.PI));
    ctx.globalAlpha = 0.15 + rand() * 0.55;
    ctx.lineWidth = 0.6 + rand() * 1.2;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.font = '900 120px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.lineWidth = 1;
  ctx.strokeStyle = `${accent}88`;
  ctx.strokeText(String(index + 1).padStart(2, '0'), W - 12, H + 18);

  return canvas.toDataURL('image/png');
}

export function ProjectCover({ index, accent, title }: { index: number; accent: string; title: string }) {
  const src = useMemo(() => drawCover(index, accent), [index, accent]);
  const short = title.split(/ — | –/)[0];

  return (
    <div className="project-cover relative h-40 overflow-hidden rounded-xl border border-white/10 bg-[#07070c]">
      <img src={src} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <span className="absolute left-4 top-4 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
        {short}
      </span>
    </div>
  );
}
