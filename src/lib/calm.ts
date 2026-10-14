// Runs `cb` once the visitor has stopped scrolling for `quiet` ms and the browser is idle, so
// heavy setup (3D scenes, canvas artwork) never lands in the middle of a scroll.
let lastScroll = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => (lastScroll = performance.now()), { passive: true });
}

export function whenCalm(cb: () => void, quiet = 250) {
  let timer = 0;
  let handle = 0;
  const ric = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 40));
  const check = () => {
    const since = performance.now() - lastScroll;
    if (since < quiet) {
      timer = window.setTimeout(check, quiet - since + 20);
      return;
    }
    handle = ric(cb, { timeout: 400 }) as number;
  };
  check();
  return () => {
    window.clearTimeout(timer);
    (window.cancelIdleCallback ?? window.clearTimeout)(handle);
  };
}
