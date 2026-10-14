import { useCallback, useEffect, useRef, useState } from 'react';
import '@fontsource-variable/roboto-flex/wdth.css';
import { finePointer, reducedMotion } from '../../lib/motion';

// Giant letters that swell (weight + width) toward the cursor. Adapted from React Bits
// "Text Pressure" (reactbits.dev/text-animations/text-pressure, MIT + Commons Clause),
// itself ported from codepen.io/JuanFuentes/full/rgXKGQ. Uses a self-hosted Roboto Flex.
const attr = (distance: number, maxDist: number, min: number, max: number) =>
  Math.max(min, max - Math.abs((max * distance) / maxDist) + min);

export function TextPressure({ text, className = '' }: { text: string; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(48);
  const chars = text.split('');

  const fit = useCallback(() => {
    const w = container.current?.getBoundingClientRect().width ?? 600;
    setFontSize(Math.max(40, w / (chars.length * 0.62)));
  }, [chars.length]);

  useEffect(() => {
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(container.current!);
    return () => ro.disconnect();
  }, [fit]);

  useEffect(() => {
    if (reducedMotion()) return;
    const onMove = (e: MouseEvent) => {
      cursor.current.x = e.clientX;
      cursor.current.y = e.clientY;
    };
    const onTouch = (e: TouchEvent) => {
      cursor.current.x = e.touches[0].clientX;
      cursor.current.y = e.touches[0].clientY;
    };
    const r = container.current!.getBoundingClientRect();
    mouse.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    cursor.current = { ...mouse.current };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    let raf = 0;
    let visible = false;
    // Without a mouse, a slow wave sweeps across the letters until the visitor touches the screen.
    const fine = finePointer();
    let touched = false;
    window.addEventListener('touchstart', () => (touched = true), { passive: true, once: true });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(container.current!);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || !title.current) return;
      if (!fine && !touched) {
        const tr = title.current.getBoundingClientRect();
        cursor.current.x = tr.left + (Math.sin(performance.now() / 900) * 0.5 + 0.5) * tr.width;
        cursor.current.y = tr.top + tr.height / 2;
      }
      mouse.current.x += (cursor.current.x - mouse.current.x) / 12;
      mouse.current.y += (cursor.current.y - mouse.current.y) / 12;
      const maxDist = title.current.getBoundingClientRect().width / 2;
      for (const span of spans.current) {
        if (!span) continue;
        const b = span.getBoundingClientRect();
        const d = Math.hypot(mouse.current.x - (b.x + b.width / 2), mouse.current.y - (b.y + b.height / 2));
        const settings = `'wght' ${Math.floor(attr(d, maxDist, 100, 1000))}, 'wdth' ${Math.floor(attr(d, maxDist, 25, 151))}`;
        if (span.style.fontVariationSettings !== settings) span.style.fontVariationSettings = settings;
      }
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <div ref={container} className={`relative w-full overflow-hidden ${className}`}>
      <h2
        ref={title}
        aria-label={text}
        className="flex justify-between uppercase text-white select-none"
        style={{ fontFamily: "'Roboto Flex Variable', Inter, sans-serif", fontSize, lineHeight: 1, fontWeight: 400 }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            aria-hidden
            ref={(el) => {
              spans.current[i] = el;
            }}
            className={`inline-block ${c === ' ' ? 'w-[0.25em]' : ''} ${i >= text.indexOf(' ') + 1 ? 'text-[#00d4ff]' : ''}`}
            style={{ fontVariationSettings: "'wght' 400, 'wdth' 100" }}
          >
            {c === ' ' ? ' ' : c}
          </span>
        ))}
      </h2>
    </div>
  );
}
