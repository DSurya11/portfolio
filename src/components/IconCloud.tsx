import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/motion';

// A draggable 3D sphere of tech logos. Based on Magic UI "Icon Cloud"
// (magicui.design/docs/components/icon-cloud, MIT): Fibonacci-sphere layout, drag to spin and
// click a logo to bring it to the front. Rewritten to run on refs (no re-render per frame),
// draw sharp on retina, take touch, and spotlight one skill group at a time.
export type CloudItem = { label: string; group: string; color: string; path?: string };

type Placed = { x: number; y: number; z: number; sprite: Sprite; w: number; h: number; item: CloudItem };

const TILE = 58;

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

type Sprite = { sx: number; sy: number; w: number; h: number };

// Every tile is drawn once into a single atlas canvas; one 2D context instead of one per logo
// (each extra context cost ~40 ms on GPU-backed canvases).
function buildAtlas(items: CloudItem[], groupColors: Record<string, string>, dpr: number) {
  const atlas = document.createElement('canvas');
  const ctx = atlas.getContext('2d')!;
  ctx.font = '600 15px Inter, system-ui, sans-serif';
  const sizes = items.map((item) => (item.path ? { w: TILE, h: TILE } : { w: Math.ceil(ctx.measureText(item.label).width) + 26, h: 34 }));
  const maxW = 640;
  const sprites: Sprite[] = [];
  let x = 0;
  let y = 0;
  let row = 0;
  for (const sz of sizes) {
    if (x + sz.w > maxW) {
      x = 0;
      y += row + 2;
      row = 0;
    }
    sprites.push({ sx: x, sy: y, w: sz.w, h: sz.h });
    x += sz.w + 2;
    row = Math.max(row, sz.h);
  }
  atlas.width = maxW * dpr;
  atlas.height = (y + row) * dpr;
  ctx.scale(dpr, dpr);
  items.forEach((item, i) => {
    const { sx, sy, w, h } = sprites[i];
    const groupColor = groupColors[item.group];
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = '#0d0d16';
    ctx.strokeStyle = `${groupColor}aa`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (item.path) ctx.roundRect(2, 2, w - 4, h - 4, 14);
    else ctx.roundRect(1, 1, w - 2, h - 2, 9);
    ctx.fill();
    ctx.stroke();
    if (item.path) {
      ctx.translate(w / 2 - 15, h / 2 - 15);
      ctx.scale(30 / 24, 30 / 24);
      ctx.fillStyle = luminance(item.color) < 0.28 ? '#e2e8f0' : item.color;
      ctx.fill(new Path2D(item.path));
    } else {
      ctx.font = '600 15px Inter, system-ui, sans-serif';
      ctx.fillStyle = groupColor;
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, 13, h / 2 + 1);
    }
    ctx.restore();
  });
  return { atlas, sprites };
}

export function IconCloud({
  items,
  groupColors,
  highlight,
}: {
  items: CloudItem[];
  groupColors: Record<string, string>;
  highlight: string | null;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const highlightRef = useRef(highlight);
  const focusRef = useRef<((group: string) => void) | null>(null);

  useEffect(() => {
    highlightRef.current = highlight;
    if (highlight) focusRef.current?.(highlight);
  }, [highlight]);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = reducedMotion();
    let size = 400;

    const golden = Math.PI * (3 - Math.sqrt(5));
    const { atlas, sprites } = buildAtlas(items, groupColors, dpr);
    const placed: Placed[] = items.map((item, i) => {
      const y = 1 - (i / (items.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * golden;
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, item, sprite: sprites[i], w: sprites[i].w, h: sprites[i].h };
    });

    const rot = { x: 0.3, y: 0 };
    const vel = { x: 0, y: 0.0035 };
    let target: { x: number; y: number } | null = null;
    let drag: { x: number; y: number; moved: number } | null = null;
    let visible = false;
    let raf = 0;
    const dim = new Map<Placed, number>(placed.map((p) => [p, 1]));

    const resize = () => {
      size = wrap.current!.clientWidth;
      el.width = size * dpr;
      el.height = size * dpr;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap.current!);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const project = (p: Placed) => {
      const cy = Math.cos(rot.y);
      const sy = Math.sin(rot.y);
      const cx = Math.cos(rot.x);
      const sx = Math.sin(rot.x);
      const x1 = p.x * cy + p.z * sy;
      const z1 = -p.x * sy + p.z * cy;
      const y2 = p.y * cx - z1 * sx;
      const z2 = p.y * sx + z1 * cx;
      return { x: x1, y: y2, z: z2 };
    };

    const shortest = (from: number, to: number) => {
      let d = (to - from) % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      return from + d;
    };

    const focusOn = (x: number, y: number, z: number) => {
      const ry = Math.atan2(-x, z);
      const z1 = Math.hypot(x, z);
      const rx = Math.atan2(y, z1);
      target = { x: shortest(rot.x, rx), y: shortest(rot.y, ry) };
    };

    focusRef.current = (group) => {
      const g = placed.filter((p) => p.item.group === group);
      if (!g.length) return;
      const c = g.reduce((s, p) => ({ x: s.x + p.x, y: s.y + p.y, z: s.z + p.z }), { x: 0, y: 0, z: 0 });
      const len = Math.hypot(c.x, c.y, c.z) || 1;
      focusOn(c.x / len, c.y / len, c.z / len);
    };

    const radius = () => size * 0.36;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      if (target) {
        rot.x += (target.x - rot.x) * 0.08;
        rot.y += (target.y - rot.y) * 0.08;
        if (Math.abs(target.x - rot.x) + Math.abs(target.y - rot.y) < 0.002) target = null;
      } else if (!drag && !reduce) {
        rot.x += vel.x;
        rot.y += vel.y;
        vel.x *= 0.95;
        vel.y += (0.0035 - vel.y) * 0.02;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const R = radius();
      const hl = highlightRef.current;
      const list = placed.map((p) => ({ p, q: project(p) })).sort((a, b) => a.q.z - b.q.z);
      for (const { p, q } of list) {
        const want = hl && p.item.group !== hl ? 0.12 : 1;
        const d = dim.get(p)! + (want - dim.get(p)!) * 0.12;
        dim.set(p, d);
        const depth = (q.z + 1) / 2;
        const s = (0.55 + depth * 0.6) * (hl && p.item.group === hl ? 1.18 : 1);
        ctx.globalAlpha = (0.25 + depth * 0.75) * d;
        const w = p.w * s;
        const h = p.h * s;
        const sp = p.sprite;
        ctx.drawImage(atlas, sp.sx * dpr, sp.sy * dpr, sp.w * dpr, sp.h * dpr, size / 2 + q.x * R - w / 2, size / 2 - q.y * R - h / 2, w, h);
      }
      ctx.globalAlpha = 1;
    };
    draw();

    const hit = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      const x = cx - r.left;
      const y = cy - r.top;
      const R = radius();
      let best: Placed | null = null;
      let bestZ = -2;
      for (const p of placed) {
        const q = project(p);
        if (q.z < 0) continue;
        const s = 0.55 + ((q.z + 1) / 2) * 0.6;
        if (Math.abs(x - (size / 2 + q.x * R)) < (p.w * s) / 2 && Math.abs(y - (size / 2 - q.y * R)) < (p.h * s) / 2 && q.z > bestZ) {
          best = p;
          bestZ = q.z;
        }
      }
      return best;
    };

    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, moved: 0 };
      target = null;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) {
        el.style.cursor = hit(e.clientX, e.clientY) ? 'pointer' : 'grab';
        return;
      }
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      vel.y = dx * 0.006;
      vel.x = dy * 0.006;
      rot.y += vel.y;
      rot.x += vel.x;
    };
    const onUp = (e: PointerEvent) => {
      if (drag && drag.moved < 6) {
        const p = hit(e.clientX, e.clientY);
        if (p) focusOn(p.x, p.y, p.z);
      }
      drag = null;
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [items, groupColors]);

  return (
    <div ref={wrap} className="relative aspect-square w-full" data-cursor="grab">
      <canvas
        ref={canvas}
        role="img"
        aria-label={`3D cloud of skills: ${items.map((i) => i.label).join(', ')}`}
        className="touch-pan-y"
      />
    </div>
  );
}
