import { useSyncExternalStore } from 'react';

// The page is prepared behind a short loading screen: every heavy part (sections and their
// scroll animations, the ID card's 3D scene, fonts, the hero photo) registers here and marks
// itself done. The page is revealed when all are done (~1.3 s on an Intel Iris Xe laptop, mostly
// compiling the 3D card's shaders), or after MAX_WAIT at the latest, so a
// slow device never waits longer than that (anything unfinished completes in the background).
const MAX_WAIT = 1600;
const MIN_SHOW = 350;

const pending = new Set<string>(['sections', 'badge', 'hero-photo', 'fonts']);
const listeners = new Set<() => void>();
const started = typeof performance !== 'undefined' ? performance.now() : 0;
let ready = false;

function reveal() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
}

function check() {
  if (ready || pending.size > 0) return;
  window.setTimeout(reveal, Math.max(0, MIN_SHOW - (performance.now() - started)));
}

if (typeof window !== 'undefined') {
  window.setTimeout(reveal, MAX_WAIT);
  (document.fonts?.ready ?? Promise.resolve()).then(() => markDone('fonts'));
}

export function markDone(part: string) {
  pending.delete(part);
  check();
}

export function onReady(cb: () => void) {
  if (ready) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useAppReady() {
  return useSyncExternalStore(
    (l) => onReady(l),
    () => ready,
  );
}
