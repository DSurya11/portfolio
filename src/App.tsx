import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BelowFold from './BelowFold';
import { Loader } from './components/Loader';
import { startSmoothScroll, lockScroll } from './lib/scroll';
import { onReady } from './lib/ready';

// A refresh always starts at the top: restoring mid-page while pinned sections are still being
// measured lands in the wrong place.
if (typeof window !== 'undefined' && 'scrollRestoration' in history) history.scrollRestoration = 'manual';

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll();
    window.scrollTo(0, 0);
    // No scrolling until the loading screen lifts; everything below is still being prepared.
    lockScroll(true);
    const off = onReady(() => lockScroll(false));
    return () => {
      off();
      stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <Loader />
      <div aria-hidden className="grain" />
      <Navbar />
      <div className="relative z-10">
        <Hero />
      </div>
      <BelowFold />
    </div>
  );
}
