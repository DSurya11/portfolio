import { useRef, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { finePointer, reducedMotion } from '../../lib/motion';

// Leans toward the cursor in 3D with a light glare that follows it. Children can float above
// the surface with the `depth-*` helpers (translateZ). Adapted from animate-ui "Tilt"
// (animate-ui.com/docs/primitives/effects/tilt, MIT + Commons Clause).
export function Tilt({
  children,
  max = 12,
  perspective = 900,
  glare = true,
  className = '',
}: {
  children: ReactNode;
  max?: number;
  perspective?: number;
  glare?: boolean;
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
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.16), transparent 55%)`;
  const glareOpacity = useSpring(0, spring);
  const live = typeof window !== 'undefined' && finePointer() && !reducedMotion();

  return (
    <div style={{ perspective }} className={className}>
      <motion.div
        ref={ref}
        style={{ rotateX: live ? rotateX : 0, rotateY: live ? rotateY : 0, transformStyle: 'preserve-3d' }}
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
        className="relative h-full"
      >
        {children}
        {glare && live && (
          <motion.div
            aria-hidden
            style={{ background: glareBg, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen"
          />
        )}
      </motion.div>
    </div>
  );
}
