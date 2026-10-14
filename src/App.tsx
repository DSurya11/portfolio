import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { startSmoothScroll } from './lib/scroll';
import { useIdle } from './lib/useIdle';

const BelowFold = lazy(() => import('./BelowFold'));

export default function App() {
  useEffect(() => startSmoothScroll(), []);
  // The hero paints first; the rest of the page follows once the browser is idle.
  const idle = useIdle();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div aria-hidden className="grain" />
      <Navbar />
      <div className="relative z-10">
        <Hero />
      </div>
      <Suspense fallback={<div className="min-h-screen" />}>{idle ? <BelowFold /> : <div className="min-h-screen" />}</Suspense>
    </div>
  );
}
