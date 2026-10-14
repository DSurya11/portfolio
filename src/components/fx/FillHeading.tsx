import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion } from '../../lib/motion';

// Big type drawn as an outline that fills in solid, left to right, as the section scrolls
// into view. Driven by scroll only.
export function FillHeading({ lead, accent }: { lead: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        '.fill-layer',
        { clipPath: 'inset(0% 100% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'clamp(top 85%)', end: 'clamp(top 40%)', scrub: 0.4 },
        },
      );
    },
    { scope: ref },
  );

  const text = (outline: boolean) => (
    <>
      <span className={outline ? '' : 'text-white'}>{lead}</span>{' '}
      <span className={outline ? '' : 'text-[#00d4ff]'}>{accent}</span>
    </>
  );
  const type = 'whitespace-nowrap font-black uppercase leading-[0.9] tracking-[-0.03em] text-[10.6vw] lg:text-[8.8rem]';

  return (
    <div ref={ref} className="text-center">
      {/* Shrink-wraps the text so the fill layer is exactly as wide as the letters. */}
      <div className="relative inline-block">
        <p aria-hidden className={`${type} text-transparent [-webkit-text-stroke:1.5px_#334155]`}>
          {text(true)}
        </p>
        <h2 className={`fill-layer absolute inset-0 ${type}`}>{text(false)}</h2>
      </div>
    </div>
  );
}
