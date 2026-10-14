import { useEffect, useRef } from 'react';
import { animate, createDrawable, stagger } from 'animejs';
import type { Diagram } from '../data/projects';
import { reducedMotion } from '../lib/motion';

const NODE_W = 124;
const NODE_H = 42;

// The project's architecture, drawn line by line with anime.js (createDrawable), then the
// boxes pop in and a packet of light runs along each connection.
export function ArchDiagram({ diagram, accent }: { diagram: Diagram; accent: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));

  const edgePath = (a: string, b: string) => {
    const p = byId[a];
    const q = byId[b];
    const horizontal = Math.abs(q.x - p.x) >= Math.abs(q.y - p.y) * 0.6;
    if (horizontal) {
      const dir = Math.sign(q.x - p.x) || 1;
      const x1 = p.x + (dir * NODE_W) / 2;
      const x2 = q.x - (dir * NODE_W) / 2;
      const mx = (x1 + x2) / 2;
      return `M ${x1} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${x2} ${q.y}`;
    }
    const dir = Math.sign(q.y - p.y) || 1;
    const y1 = p.y + (dir * NODE_H) / 2;
    const y2 = q.y - (dir * NODE_H) / 2;
    return `M ${p.x} ${y1} C ${p.x} ${(y1 + y2) / 2}, ${q.x} ${(y1 + y2) / 2}, ${q.x} ${y2}`;
  };

  useEffect(() => {
    const svg = ref.current;
    if (!svg || reducedMotion()) return;
    const nodes = svg.querySelectorAll('.arch-node');
    const edges = svg.querySelectorAll<SVGPathElement>('.arch-edge');
    animate(nodes, { opacity: [0, 1], scale: [0.6, 1], duration: 600, delay: stagger(90, { start: 150 }), ease: 'outBack(1.6)' });
    animate(createDrawable(edges, 0, 0), { draw: ['0 0', '0 1'], duration: 900, delay: stagger(140, { start: 450 }), ease: 'inOutQuad' });
    const packets = svg.querySelectorAll<SVGPathElement>('.arch-packet');
    const anim = animate(createDrawable(packets, 0, 0), {
      draw: ['0 0', '0 0.12', '0.88 1', '1 1'],
      duration: 1800,
      delay: stagger(260, { start: 1500 }),
      loop: true,
      loopDelay: 600,
      ease: 'linear',
    });
    return () => {
      anim.revert();
    };
  }, [diagram]);

  return (
    <svg ref={ref} viewBox="0 0 640 250" className={`h-auto w-full ${reducedMotion() ? "" : "arch-anim"}`} role="img" aria-label="Architecture diagram">
      {diagram.edges.map(([a, b]) => (
        <path key={`${a}-${b}`} className="arch-edge" d={edgePath(a, b)} fill="none" stroke={`${accent}88`} strokeWidth={1.5} />
      ))}
      {!reducedMotion() && diagram.edges.map(([a, b]) => (
        <path
          key={`p-${a}-${b}`}
          className="arch-packet"
          d={edgePath(a, b)}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
        />
      ))}
      {diagram.nodes.map((n) => (
        <g key={n.id} className="arch-node" style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: 'view-box' }}>
          <rect
            x={n.x - NODE_W / 2}
            y={n.y - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            rx={9}
            fill="#0b0b12"
            stroke={accent}
            strokeOpacity={0.7}
          />
          <text x={n.x} y={n.sub ? n.y - 3 : n.y + 4} textAnchor="middle" fill="#f1f5f9" fontSize={12} fontWeight={600}>
            {n.label}
          </text>
          {n.sub && (
            <text x={n.x} y={n.y + 12} textAnchor="middle" fill={accent} fontSize={9.5} fontFamily="ui-monospace, monospace">
              {n.sub}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
