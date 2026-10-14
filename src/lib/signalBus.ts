// Shared state between the page and the lazily loaded particle canvas.
type Listener = () => void;

export const signalBus = {
  failed: false,
  dim: false,
  globeSpin: 0,
  listeners: new Set<Listener>(),
  setFailed() {
    this.failed = true;
    this.listeners.forEach((l) => l());
  },
  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  },
};

// The order the particle field morphs through as the page scrolls.
export const SIGNAL_SECTIONS = [
  'hero',
  'about',
  'skills',
  'projects',
  'achievements',
  'certifications',
  'contact',
] as const;
