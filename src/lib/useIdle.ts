import { useEffect, useState } from 'react';

// Becomes true once the hero's intro has had time to play (`delay` ms after load, then the
// next idle moment), or straight away if the visitor starts scrolling or pressing keys.
// Setting up the rest of the page takes ~300 ms of main-thread work; doing it mid-intro
// made the intro stutter.
export function useIdle(delay = 2100) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let timer = 0;
    let handle = 0;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 50));
    const done = () => setIdle(true);
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown', 'scroll'] as const;
    events.forEach((e) => window.addEventListener(e, done, { once: true, passive: true }));
    const start = () => {
      timer = window.setTimeout(() => (handle = ric(done, { timeout: 600 }) as number), delay);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      events.forEach((e) => window.removeEventListener(e, done));
      window.removeEventListener('load', start);
      window.clearTimeout(timer);
      (window.cancelIdleCallback ?? window.clearTimeout)(handle);
    };
  }, [delay]);
  return idle;
}
