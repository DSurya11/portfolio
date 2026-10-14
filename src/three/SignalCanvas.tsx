import { useEffect, useRef, useState } from 'react';
import { createSignal } from './signal';
import { signalBus } from '../lib/signalBus';

export default function SignalCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Each run gets its own canvas: two engines sharing one WebGL context (React's dev
    // double-mount) would delete each other's shaders on dispose.
    const canvas = document.createElement('canvas');
    canvas.className = 'block h-full w-full';
    ref.current!.appendChild(canvas);
    let dispose: (() => void) | undefined;
    let cancelled = false;
    createSignal(canvas)
      .then((d) => {
        if (cancelled) d();
        else {
          dispose = d;
          setReady(true);
        }
      })
      .catch(() => signalBus.setFailed());
    return () => {
      cancelled = true;
      dispose?.();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-ready={ready}
      className={`signal-layer fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
