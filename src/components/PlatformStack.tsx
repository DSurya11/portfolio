import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, reducedMotion } from '../lib/motion';

// The IDP's Terraform layers as an isometric stack, in their real apply order
// (idp-infra/README.md). `make up` drops them into place and Argo CD's sync waves light up;
// `make down` lifts away the per-session layers in reverse order and leaves the permanent ones,
// as scripts/down.sh does. Drawn in SVG with an isometric projection (not CSS 3D), so the
// shapes you see are exactly what you click, and the labels are plain, sharp text.
type Layer = { id: string; name: string; short: string; holds: string[]; life: 'Permanent' | 'Per session'; note: string };

const layers: Layer[] = [
  {
    id: '00',
    name: '00-bootstrap',
    short: 'State bucket · OIDC · CI roles',
    holds: ['Terraform state bucket', 'GitHub OIDC provider', 'Three CI roles', 'Docs bucket'],
    life: 'Permanent',
    note: 'Applied by hand, never destroyed. Local state.',
  },
  {
    id: '10',
    name: '10-network',
    short: 'VPC · 4 subnets',
    holds: ['VPC', '2 public + 2 private subnets', 'Route tables', 'Security groups'],
    life: 'Permanent',
    note: 'Free to keep, so it stays between sessions.',
  },
  {
    id: '15',
    name: '15-registry',
    short: 'ECR',
    holds: ['ECR repositories for the platform images'],
    life: 'Permanent',
    note: 'Storage only. Images survive a teardown.',
  },
  {
    id: '20',
    name: '20-data',
    short: 'RDS PostgreSQL · Secrets Manager',
    holds: ['RDS PostgreSQL 16', 'AWS Secrets Manager'],
    life: 'Per session',
    note: 'Destroyed by make down. Data does not survive a session by design.',
  },
  {
    id: '30',
    name: '30-cluster',
    short: 'EKS · NAT · Valkey',
    holds: ['EKS, 3 × t4g.medium nodes', 'NAT gateway', 'ElastiCache Valkey', 'EKS Pod Identity roles'],
    life: 'Per session',
    note: 'The expensive part: it exists only while someone works on the platform.',
  },
  {
    id: '40',
    name: '40-platform',
    short: 'Argo CD',
    holds: ['Argo CD', 'The root Application (app of apps)'],
    life: 'Per session',
    note: 'Terraform installs Argo CD and stops. Everything else comes from Git.',
  },
];

const waves = [
  { wave: '−3', items: 'AppProjects' },
  { wave: '−2', items: 'AWS Load Balancer Controller' },
  { wave: '−1', items: 'External Secrets Operator' },
  { wave: '0', items: 'Kyverno · DB operator · Prometheus, Grafana · Loki, Alloy, Tempo' },
  { wave: '1', items: 'Image Updater · Flag API · Backstage · golden-path services' },
];

// Isometric geometry, in SVG user units.
const W = 360; // viewBox width of the stack; labels are HTML beside it
const H = 470;
const L = 150; // side of a slab
const T = 14; // slab thickness
const GAP = 52; // rise from one slab to the next
const C30 = Math.cos(Math.PI / 6);
const S30 = 0.5;
const OX = W / 2; // screen x of a slab's back corner
const BASE = H - 2 * L * S30 - T - 8; // screen y of the bottom slab's back corner
const LIFT = 260; // how far a slab rises when it is not there

const iso = (x: number, y: number) => [OX + (x - y) * C30, (x + y) * S30] as const;
const pts = (p: (readonly [number, number])[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const top = pts([iso(0, 0), iso(L, 0), iso(L, L), iso(0, L)]);
const [fx, fy] = iso(L, L); // front corner
const [rx, ry] = iso(L, 0); // right corner
const [lx, ly] = iso(0, L); // left corner
const right = pts([
  [rx, ry],
  [fx, fy],
  [fx, fy + T],
  [rx, ry + T],
]);
const left = pts([
  [lx, ly],
  [fx, fy],
  [fx, fy + T],
  [lx, ly + T],
]);
const restY = (i: number) => BASE - i * GAP;

export function PlatformStack() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState('30');
  const [mode, setMode] = useState<'up' | 'down' | null>(null);
  const [running, setRunning] = useState(false);
  const lifts = useRef(layers.map(() => ({ y: LIFT, o: 0 })));
  const tl = useRef<gsap.core.Timeline | null>(null);
  const layer = layers.find((l) => l.id === selected)!;

  // Moves every slab (SVG) and its label (HTML, so it needs the SVG's current scale).
  const paint = () => {
    const groups = root.current?.querySelectorAll<SVGGElement>('.slab');
    const labels = root.current?.querySelectorAll<HTMLElement>('.slab-label');
    const k = (svg.current?.clientWidth ?? W) / W;
    lifts.current.forEach((s, i) => {
      groups?.[i]?.setAttribute('transform', `translate(0 ${(restY(i) - s.y).toFixed(1)})`);
      groups?.[i]?.setAttribute('opacity', String(s.o));
      if (labels?.[i]) {
        labels[i].style.transform = `translateY(calc(-50% - ${(s.y * k).toFixed(1)}px))`;
        labels[i].style.opacity = String(s.o);
      }
    });
  };

  useEffect(() => {
    const ro = new ResizeObserver(() => paint());
    ro.observe(svg.current!);
    return () => ro.disconnect();
  }, []);

  const play = (to: 'up' | 'down', instant = false) => {
    tl.current?.kill();
    setMode(to);
    // A torn-down layer can't stay selected: show the top layer that remains.
    if (to === 'down') setSelected((id) => (layers.find((l) => l.id === id)?.life === 'Per session' ? '15' : id));
    const session = layers.map((l, i) => (l.life === 'Per session' ? i : -1)).filter((i) => i >= 0);
    const order = to === 'up' ? layers.map((_, i) => i) : [...session].reverse();
    const rows = gsap.utils.toArray<HTMLElement>('.wave-row', root.current);
    setRunning(!instant);
    const t = gsap.timeline({ onUpdate: paint, onComplete: () => setRunning(false) });
    order.forEach((i, n) => {
      const target = to === 'up' ? { y: 0, o: 1 } : { y: LIFT, o: 0 };
      t.to(lifts.current[i], { ...target, duration: instant ? 0 : 0.65, ease: to === 'up' ? 'power3.out' : 'power2.in' }, instant ? 0 : n * 0.16);
    });
    if (to === 'up') t.to(rows, { opacity: 1, x: 0, duration: instant ? 0 : 0.35, stagger: instant ? 0 : 0.12 }, instant ? 0 : '-=0.2');
    else t.to([...rows].reverse(), { opacity: 0.25, x: 8, duration: 0.25, stagger: 0.07 }, 0);
    tl.current = t;
    if (instant) {
      t.progress(1);
      paint();
    }
  };

  useGSAP(
    () => {
      gsap.set('.wave-row', { opacity: 0.25, x: 8 });
      paint();
      if (reducedMotion()) {
        play('up', true);
        return;
      }
      ScrollTrigger.create({ trigger: root.current, start: 'top 75%', once: true, onEnter: () => play('up') });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="min-w-0">
        <div className="relative mx-auto w-full max-w-[600px]">
          <div className="relative w-[62%]">
            <svg
              ref={svg}
              viewBox={`0 0 ${W} ${H}`}
              className="block h-auto w-full overflow-visible"
              role="group"
              aria-label="Terraform layers of the platform"
            >
              {layers.map((l) => {
                const session = l.life === 'Per session';
                const on = selected === l.id;
                return (
                  <g
                    key={l.id}
                    className="slab cursor-pointer outline-none"
                    role="button"
                    tabIndex={0}
                    aria-label={`${l.name}: ${l.holds.join(', ')}`}
                    aria-pressed={on}
                    onClick={() => setSelected(l.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelected(l.id);
                      }
                    }}
                  >
                    <polygon points={left} fill={session ? '#07161b' : '#0b0d12'} stroke={session ? '#0e7490' : '#334155'} strokeWidth={1} />
                    <polygon points={right} fill={session ? '#0a1f26' : '#0f1219'} stroke={session ? '#0e7490' : '#334155'} strokeWidth={1} />
                    <polygon
                      className="slab-top"
                      points={top}
                      fill={on ? (session ? '#145466' : '#2a3242') : session ? '#0d3540' : '#161b25'}
                      stroke={on ? '#e2e8f0' : session ? '#22d3ee' : '#64748b'}
                      strokeWidth={on ? 1.6 : 1}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* One label per layer, beside the stack at the height of the layer's right corner. */}
          {layers.map((l, i) => {
            const on = selected === l.id;
            const session = l.life === 'Per session';
            return (
              <button
                key={l.id}
                type="button"
                tabIndex={-1}
                onClick={() => setSelected(l.id)}
                className="slab-label absolute flex items-center gap-2 text-left"
                style={{ left: `${(rx / W) * 62}%`, top: `${((restY(i) + ry + T / 2) / H) * 100}%`, opacity: 0 }}
              >
                <span aria-hidden className={`h-px w-4 shrink-0 sm:w-8 ${on ? 'bg-slate-200' : session ? 'bg-[#22d3ee]/60' : 'bg-slate-600'}`} />
                <span className="flex flex-col leading-tight">
                  <span className={`font-mono text-[12px] font-semibold sm:text-sm ${on ? 'text-white' : session ? 'text-[#67e8f9]' : 'text-slate-300'}`}>
                    {l.name}
                  </span>
                  <span className="hidden font-mono text-[11px] text-slate-500 sm:block">{l.short}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* One switch: the filled half is the platform's current state; pressing the other half runs it. */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div role="group" aria-label="Platform state" className="inline-flex rounded-xl border border-white/15 bg-[#07070b] p-1">
            {(['up', 'down'] as const).map((m) => {
              const current = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={current}
                  disabled={current && !running}
                  onClick={() => play(m)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm transition-colors duration-200 ${
                    current
                      ? m === 'up'
                        ? 'bg-[#00d4ff] font-semibold text-black'
                        : 'bg-slate-200 font-semibold text-black'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  } disabled:cursor-default`}
                >
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${current ? 'bg-black' : 'bg-slate-600'}`} />
                  make {m}
                </button>
              );
            })}
          </div>
          <p className="min-h-[1.25rem] text-center font-mono text-xs text-slate-400" aria-live="polite">
            {running
              ? mode === 'up'
                ? 'running make up…'
                : 'running make down…'
              : mode === 'down'
                ? 'Platform is down · verify-empty ✓ nothing billable left (about 17 min for real)'
                : mode === 'up'
                  ? 'Platform is up (about 27 min for real) · click a layer'
                  : '\u00a0'}
          </p>
        </div>
        <div className="mt-3 flex justify-center gap-5 font-mono text-[11px] uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 border border-slate-500 bg-[#161b25]" /> Permanent
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 border border-[#22d3ee] bg-[#0d3540]" /> Per session
          </span>
        </div>
      </div>

      <div className="min-w-0 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#0b0b12] p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-lg font-semibold text-white">{layer.name}</p>
            <p className={`font-mono text-xs uppercase tracking-widest ${layer.life === 'Permanent' ? 'text-slate-400' : 'text-[#00d4ff]'}`}>
              {layer.life}
            </p>
          </div>
          <ul className="mt-4 space-y-1.5 text-slate-300">
            {layer.holds.map((h) => (
              <li key={h} className="flex gap-2.5">
                <span className="mt-2.5 h-px w-3 shrink-0 bg-slate-500" />
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-400">{layer.note}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b12] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Then Argo CD installs, in sync waves</p>
          <ol className="mt-4 space-y-2.5">
            {waves.map((w) => (
              <li key={w.wave} className="wave-row flex gap-4">
                <span className="w-8 shrink-0 text-right font-mono text-sm text-[#00d4ff]">{w.wave}</span>
                <span className="text-sm text-slate-300">{w.items}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-slate-500">Each wave must be healthy before the next starts; teardown runs in reverse.</p>
        </div>
      </div>
    </div>
  );
}
