import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { reducedMotion } from '../../lib/motion';

// Text that resolves out of random glyphs, left to right. Idea from React Bits "Decrypted Text"
// (reactbits.dev/text-animations/decrypted-text, MIT + Commons Clause); rewritten for this site.
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*<>/[]{}=+';

function scrambleTo(target: string, onFrame: (s: string) => void, duration: number, from = '') {
  if (reducedMotion()) {
    onFrame(target);
    return () => {};
  }
  const length = Math.max(target.length, from.length);
  const start = performance.now();
  let raf = 0;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const revealed = Math.floor(t * length);
    let out = '';
    for (let i = 0; i < length; i++) {
      const ch = target[i] ?? '';
      if (i < revealed) out += ch;
      else if (ch === ' ' || (ch === '' && i >= target.length && t > 0.5)) out += ch;
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    onFrame(out);
    if (t < 1) raf = requestAnimationFrame(step);
    else onFrame(target);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

export function Decrypt({ text, duration = 900, className = '' }: { text: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!inView) return;
    return scrambleTo(text, setShown, duration);
  }, [inView, text, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{inView ? shown : text.replace(/\S/g, ' ')}</span>
    </span>
  );
}

// Cycles through phrases, each one decrypting out of the previous.
export function DecryptCycle({ phrases, hold = 2600, className = '' }: { phrases: string[]; hold?: number; className?: string }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState('');
  const prev = useRef('');

  useEffect(() => {
    const target = phrases[index];
    const stop = scrambleTo(target, setShown, 1100, prev.current);
    prev.current = target;
    const next = window.setTimeout(() => setIndex((i) => (i + 1) % phrases.length), hold + 1100);
    return () => {
      stop();
      window.clearTimeout(next);
    };
  }, [index, phrases, hold]);

  return (
    <span className={className}>
      <span className="sr-only">{phrases.join('. ')}</span>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
