import { useEffect, useState } from 'react';

// Becomes true once the page has loaded and the browser has a quiet moment (or after `timeout`).
export function useIdle(timeout = 1200) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let handle = 0;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const go = () => (handle = ric(() => setIdle(true), { timeout }) as number);
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      (window.cancelIdleCallback ?? window.clearTimeout)(handle);
    };
  }, [timeout]);
  return idle;
}
