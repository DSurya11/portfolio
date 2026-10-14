import { useRef, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { finePointer, reducedMotion } from '../../lib/motion';

// Leans toward the cursor in 3D with a soft light that follows it. The tilting element is one
// flat, clipped surface: no preserve-3d layers or backdrop blur inside it, because stacked 3D
// layers cut through the card's border and drew it as broken light and dark segments.
// Adapted from animate-ui "Tilt" (animate-ui.com/docs/primitives/effects/tilt, MIT + Commons Clause).
export function Tilt({
  children,
  max = 12,
  perspective = 900,
  glare = true,
  radius = '1rem',
  className = '',
}: {
  children: ReactNode;
  max?: number;
  perspective?: number;
  glare?: boolean;
  radius?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 260, damping: 22, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.07), transparent 60%)`;
  const glareOpacity = useSpring(0, spring);
  const live = typeof window !== 'undefined' && finePointer() && !reducedMotion();

  return (
    <div style={{ perspective }} className={className}>
      <motion.div
        ref={ref}
        style={{
          rotateX: live ? rotateX : 0,
          rotateY: live ? rotateY : 0,
          borderRadius: radius,
          // Keeps the rotated edges anti-aliased in Chrome and Safari.
          backfaceVisibility: 'hidden',
          outline: '1px solid transparent',
          willChange: 'transform',
        }}
        onMouseMove={(e) => {
          if (!live) return;
          const r = ref.current!.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
          glareOpacity.set(1);
        }}
        onMouseLeave={() => {
          px.set(0.5);
          py.set(0.5);
          glareOpacity.set(0);
        }}
        className="relative h-full overflow-hidden"
      >
        {children}
        {glare && live && (
          <motion.div aria-hidden style={{ background: glareBg, opacity: glareOpacity }} className="pointer-events-none absolute inset-0" />
        )}
      </motion.div>
    </div>
  );
}
