import { useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, reducedMotion } from '../lib/motion';

// The IDP's Terraform layers as an isometric 3D stack, in their real apply order
// (idp-infra/README.md). `make up` drops them into place and Argo CD's sync waves light up;
// `make down` deletes the Argo CD applications, lifts away the per-session layers in reverse
// order, and leaves the permanent ones, exactly as scripts/down.sh does.
type Layer = { id: string; name: string; holds: string[]; life: 'Permanent' | 'Per session'; note: string };

const layers: Layer[] = [
  {
    id: '00',
    name: '00-bootstrap',
    holds: ['Terraform state bucket', 'GitHub OIDC provider', 'Three CI roles', 'Docs bucket'],
    life: 'Permanent',
    note: 'Applied by hand, never destroyed. Local state.',
  },
  {
    id: '10',
    name: '10-network',
    holds: ['VPC', '2 public + 2 private subnets', 'Route tables', 'Security groups'],
    life: 'Permanent',
    note: 'Free to keep, so it stays between sessions.',
  },
  {
    id: '15',
    name: '15-registry',
    holds: ['ECR repositories for the platform images'],
    life: 'Permanent',
    note: 'Storage only. Images survive a teardown.',
  },
  {
    id: '20',
    name: '20-data',
    holds: ['RDS PostgreSQL 16', 'AWS Secrets Manager'],
    life: 'Per session',
    note: 'Destroyed by make down. Data does not survive a session by design.',
  },
  {
    id: '30',
    name: '30-cluster',
    holds: ['EKS, 3 × t4g.medium nodes', 'NAT gateway', 'ElastiCache Valkey', 'EKS Pod Identity roles'],
    life: 'Per session',
    note: 'The expensive part: it exists only while someone works on the platform.',
  },
  {
    id: '40',
    name: '40-platform',
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

const GAP = 62; // vertical spacing between slabs, px
const LIFT = 300; // how far a slab falls from

export function PlatformStack() {
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState('30');
  const [state, setState] = useState<'idle' | 'up' | 'down' | 'busy'>('idle');
  const layer = layers.find((l) => l.id === selected)!;

  const slabs = () => gsap.utils.toArray<HTMLElement>('.iso-slab', root.current);
  const waveRows = () => gsap.utils.toArray<HTMLElement>('.wave-row', root.current);

  const buildUp = (instant = false) => {
    setState('busy');
    const session = slabs().filter((s) => s.dataset.life === 'Per session');
    const targets = instant ? slabs() : session.length && state === 'down' ? session : slabs();
    const tl = gsap.timeline({ onComplete: () => setState('up') });
    tl.to(targets, {
      z: (_i: number, el: HTMLElement) => Number(el.dataset.index) * GAP,
      opacity: 1,
      duration: instant ? 0 : 0.7,
      ease: 'power3.out',
      stagger: instant ? 0 : 0.18,
    });
    tl.to(waveRows(), { opacity: 1, x: 0, duration: instant ? 0 : 0.4, stagger: instant ? 0 : 0.14, ease: 'power2.out' }, instant ? 0 : '-=0.1');
  };

  const tearDown = () => {
    setState('busy');
    const session = slabs()
      .filter((s) => s.dataset.life === 'Per session')
      .reverse();
    gsap
      .timeline({ onComplete: () => setState('down') })
      .to(waveRows().reverse(), { opacity: 0.2, x: 8, duration: 0.25, stagger: 0.08 })
      .to(session, {
        z: (_i: number, el: HTMLElement) => Number(el.dataset.index) * GAP + LIFT,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.2,
      });
  };

  useGSAP(
    () => {
      gsap.set(slabs(), { z: (i: number) => i * GAP + LIFT, opacity: 0 });
      gsap.set(waveRows(), { opacity: 0.2, x: 8 });
      if (reducedMotion()) {
        buildUp(true);
        return;
      }
      ScrollTrigger.create({ trigger: root.current, start: 'top 75%', once: true, onEnter: () => buildUp() });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div>
        {/* The isometric scene. Each slab is a top face plus two side faces for thickness. */}
        <div className="relative mx-auto h-[440px] w-full max-w-[520px] sm:h-[560px]">
          <div className="iso-scene absolute left-1/2 top-[72%]">
            {layers.map((l, i) => (
              <button
                key={l.id}
                type="button"
                data-index={i}
                data-life={l.life}
                onClick={() => setSelected(l.id)}
                aria-pressed={selected === l.id}
                aria-label={`${l.name}: ${l.holds.join(', ')}`}
                className={`iso-slab ${l.life === 'Permanent' ? 'is-permanent' : 'is-session'} ${selected === l.id ? 'is-selected' : ''}`}
              >
                <span className="iso-top">
                  <span className="iso-label">
                    <span className="iso-name">{l.name}</span>
                    <span className="iso-sub">{l.holds[0]}</span>
                  </span>
                </span>
                <span aria-hidden className="iso-front" />
                <span aria-hidden className="iso-side" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={state === 'busy' || state === 'up' || state === 'idle'}
            onClick={() => buildUp()}
            className="rounded-lg border border-white/15 px-4 py-2 font-mono text-sm text-slate-200 transition-colors enabled:hover:border-[#00d4ff] enabled:hover:text-[#00d4ff] disabled:opacity-35"
          >
            make up
          </button>
          <button
            type="button"
            disabled={state !== 'up'}
            onClick={tearDown}
            className="rounded-lg border border-white/15 px-4 py-2 font-mono text-sm text-slate-200 transition-colors enabled:hover:border-[#00d4ff] enabled:hover:text-[#00d4ff] disabled:opacity-35"
          >
            make down
          </button>
          <p className="w-full text-center font-mono text-xs text-slate-500 sm:w-auto" aria-live="polite">
            {state === 'down'
              ? 'verify-empty ✓  nothing billable left · about 17 min for real'
              : state === 'up'
                ? 'platform up · about 27 min for real'
                : ' '}
          </p>
        </div>
        <div className="mt-4 flex justify-center gap-5 font-mono text-[11px] uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 border border-slate-500 bg-[#141821]" /> Permanent
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 border border-[#00d4ff] bg-[#0c2a33]" /> Per session
          </span>
          <span className="text-slate-600">Click a layer</span>
        </div>
      </div>

      <div className="space-y-6">
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
