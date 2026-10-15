import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion } from '../../lib/motion';

// Big type drawn as an outline that fills in solid, left to right, as the section scrolls
// into view. Driven by scroll only.
export function FillHeading({ lead, accent }: { lead: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      // A window slides right over the solid text while the text slides the opposite way inside
      // it, so the letters stay put and are revealed left to right. Both are transforms, so the
      // browser only moves layers (animating a clip shape repainted the text every frame).
      const scrollTrigger = { trigger: ref.current, start: 'clamp(top 85%)', end: 'clamp(top 40%)', scrub: 0.4 };
      gsap.fromTo('.fill-window', { xPercent: -100 }, { xPercent: 0, ease: 'none', scrollTrigger });
      gsap.fromTo('.fill-layer', { xPercent: 100 }, { xPercent: 0, ease: 'none', scrollTrigger });
    },
    { scope: ref },
  );

  const text = (outline: boolean) => (
    <>
      <span className={outline ? '' : 'text-white'}>{lead}</span>{' '}
      <span className={outline ? '' : 'text-[#00d4ff]'}>{accent}</span>
    </>
  );
  const type = 'whitespace-nowrap font-black uppercase leading-[0.9] tracking-[-0.03em] text-[10.6vw] xl:text-[8.8rem]';

  return (
    <div ref={ref} className="text-center">
      {/* Shrink-wraps the text so the fill layer is exactly as wide as the letters. */}
      <div className="relative inline-block">
        <p aria-hidden className={`${type} text-transparent [-webkit-text-stroke:1.5px_#334155]`}>
          {text(true)}
        </p>
        <div className="fill-window absolute inset-0 overflow-hidden will-change-transform">
          <h2 className={`fill-layer will-change-transform ${type}`}>{text(false)}</h2>
        </div>
      </div>
    </div>
  );
}
