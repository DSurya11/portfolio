import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { finePointer, reducedMotion } from '../../lib/motion';

// Pulls its child toward the cursor when the cursor comes near.
// Adapted from animate-ui "Magnetic" (animate-ui.com/docs/primitives/effects/magnetic, MIT + Commons Clause).
export function Magnetic({
  children,
  strength = 0.35,
  range = 110,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 12, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 150, damping: 12, mass: 0.4 });

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const reach = range + Math.max(r.width, r.height) / 2;
      const dist = Math.hypot(dx, dy);
      if (dist < reach) {
        const f = (1 - dist / reach) * strength;
        rawX.set(dx * f);
        rawY.set(dy * f);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [range, strength, rawX, rawY]);

  return (
    <motion.div ref={ref} style={{ x, y }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
}
