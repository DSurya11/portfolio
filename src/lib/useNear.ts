import { useEffect, useState, type RefObject } from 'react';

// True once the element is within `margin` of the viewport; heavy widgets wait for this.
export function useNear(ref: RefObject<Element | null>, margin = '300px') {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, near]);
  return near;
}
