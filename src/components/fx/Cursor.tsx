import { useEffect, useRef } from 'react';
import { finePointer, reducedMotion } from '../../lib/motion';

// A dot that tracks the pointer exactly and a ring that trails it. The ring grows over
// anything clickable and flattens while the mouse button is held.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    document.documentElement.classList.add('has-cursor');
    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let down = false;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        lag.x = pos.x;
        lag.y = pos.y;
        dot.current!.style.opacity = '1';
        ring.current!.style.opacity = '1';
      }
      const t = e.target as HTMLElement | null;
      const hot = t?.closest('a, button, [role="button"], [data-cursor="grab"]');
      targetScale = hot ? (hot.matches('[data-cursor="grab"]') ? 1.9 : 2.3) : 1;
      ring.current!.classList.toggle('is-hot', Boolean(hot));
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);
    const onLeave = () => {
      visible = false;
      dot.current!.style.opacity = '0';
      ring.current!.style.opacity = '0';
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      lag.x += (pos.x - lag.x) * 0.18;
      lag.y += (pos.y - lag.y) * 0.18;
      scale += ((down ? targetScale * 0.75 : targetScale) - scale) * 0.18;
      dot.current!.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      ring.current!.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0) scale(${scale})`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    tick();
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={dot} aria-hidden className="cursor-dot" />
      <div ref={ring} aria-hidden className="cursor-ring" />
    </>
  );
}
