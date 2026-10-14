import { useEffect, useState } from 'react';
import { reducedMotion } from '../../lib/motion';

// One split-flap tile, like an airport departures board. Each step, the top half of the
// current digit folds down (rotateX around the middle hinge) and the bottom half of the next
// digit drops into place. It runs through `spins` steps and lands on `target`.
const STEP_MS = 90;

// Remounted (new key) for every run, so it starts from (target - spins) and counts up.
function Tile({ target, delay, active, spins }: { target: number; delay: number; active: boolean; spins: number }) {
  const [cur, setCur] = useState(() => (active ? (((target - spins) % 10) + 10) % 10 : target));
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setLeft(spins), delay);
    return () => window.clearTimeout(t);
  }, [active, spins, delay]);

  const flipping = left > 0;
  const next = (cur + 1) % 10;
  // The last step slows down and settles.
  const dur = left === 1 ? STEP_MS * 3.2 : STEP_MS;

  // Steps are timed here rather than on animationend, which some browsers don't fire reliably
  // for elements that are replaced every step. A step is the fold plus the drop.
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => {
      setCur((c) => (c + 1) % 10);
      setLeft((l) => l - 1);
    }, dur * 2);
    return () => window.clearTimeout(t);
  }, [left, dur]);

  const half = (side: 'top' | 'bottom', digit: number, extra = '') => (
    <span className={`flap-half flap-${side} ${extra}`}>
      <span>{digit}</span>
    </span>
  );

  return (
    <span className="flap" aria-hidden>
      {/* Static layers: next digit's top waits behind; current digit's bottom stays until covered. */}
      {half('top', flipping ? next : cur)}
      {half('bottom', cur)}
      {flipping && (
        <span key={left} style={{ ['--flap-ms' as string]: `${dur}ms` }} className="contents">
          {half('top', cur, 'flap-fold')}
          {half('bottom', next, 'flap-drop')}
        </span>
      )}
    </span>
  );
}

export function SplitFlap({ value, play, onReplay }: { value: number; play: number; onReplay?: () => void }) {
  const digits = String(value).split('').map(Number);
  const still = reducedMotion();
  return (
    <button
      type="button"
      onClick={onReplay}
      className="inline-flex cursor-pointer gap-[0.06em] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
      aria-label={`${value}. Replay`}
      title="Replay"
    >
      {digits.map((d, i) => (
        <Tile key={`${i}-${play}`} target={d} delay={i * 140} active={!still && play > 0} spins={10} />
      ))}
    </button>
  );
}
