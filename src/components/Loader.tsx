import { useEffect, useState } from 'react';
import { useAppReady } from '../lib/ready';

// Covers the page for at most a second while everything is prepared behind it: the mark and a
// hairline that fills, then a quick fade.
export function Loader() {
  const ready = useAppReady();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setGone(true), 450);
    return () => window.clearTimeout(t);
  }, [ready]);

  if (gone) return null;
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-[450ms] ${
        ready ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-3xl font-bold tracking-tight">
        <span className="text-[#00d4ff]">D</span>
        <span className="text-white">S</span>
      </span>
      <span className="mt-5 block h-px w-28 overflow-hidden bg-white/10">
        <span className="block h-full w-full origin-left animate-[loadbar_1s_cubic-bezier(0.4,0,0.2,1)_forwards] bg-slate-300" />
      </span>
    </div>
  );
}
