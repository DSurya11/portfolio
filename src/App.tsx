import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { Cursor } from './components/fx/Cursor';
import { startSmoothScroll } from './lib/scroll';
import { useIdle } from './lib/useIdle';

// three.js loads after first paint, so the text is readable before the particles arrive.
const SignalCanvas = lazy(() => import('./three/SignalCanvas'));
const BelowFold = lazy(() => import('./BelowFold'));

export default function App() {
  useEffect(() => startSmoothScroll(), []);
  // The hero paints first; the particle field and the rest of the page follow once the browser is idle.
  const idle = useIdle();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <Suspense fallback={null}>{idle && <SignalCanvas />}</Suspense>
      <div aria-hidden className="grain" />
      <Cursor />
      <Navbar />
      <div className="relative z-10">
        <Hero />
      </div>
      <Suspense fallback={<div className="min-h-screen" />}>{idle ? <BelowFold /> : <div className="min-h-screen" />}</Suspense>
    </div>
  );
}
