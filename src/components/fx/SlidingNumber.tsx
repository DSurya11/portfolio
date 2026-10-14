import { motion } from 'framer-motion';
import { reducedMotion } from '../../lib/motion';

// Odometer digits: each place rolls through 0–9 to its value. Idea from animate-ui
// "Sliding Number" (animate-ui.com/docs/primitives/texts/sliding-number); rewritten for this site.
function Digit({ value, delay, play }: { value: number; delay: number; play: boolean }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-top leading-none">
      <motion.span
        className="absolute left-0 top-0 flex w-full flex-col items-center"
        initial={false}
        animate={{ y: `${-(play ? value + 10 : 0)}em` }}
        transition={reducedMotion() ? { duration: 0 } : { duration: 1.6 + delay, delay: 0.1 + delay * 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className="block h-[1em] leading-none">
            {i % 10}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function SlidingNumber({ value, suffix = '', play }: { value: number; suffix?: string; play: boolean }) {
  const digits = String(value).split('').map(Number);
  return (
    <span className="inline-flex tabular-nums">
      <span className="sr-only">{`${value}${suffix}`}</span>
      <span aria-hidden className="inline-flex">
        {digits.map((d, i) => (
          <Digit key={i} value={d} delay={(digits.length - i) * 0.15} play={play} />
        ))}
        {suffix && <span className="leading-none">{suffix}</span>}
      </span>
    </span>
  );
}
