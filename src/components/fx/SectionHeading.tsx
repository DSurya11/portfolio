import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP, reducedMotion } from '../../lib/motion';
import { Decrypt } from './Decrypt';

// Section title whose letters flip up into place in 3D as the section scrolls in.
export function SectionHeading({ eyebrow, children, className = '' }: { eyebrow: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      // Split the letters only when the heading is about to arrive, not all at page load.
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom+=200',
        once: true,
        onEnter: () => {
          const h2 = ref.current!.querySelector('h2')!;
          const split = SplitText.create(h2, { type: 'words,chars', tag: 'span', wordsClass: 'split-word', charsClass: 'split-char' });
          gsap.from(split.chars, {
            rotateX: -95,
            yPercent: 55,
            z: -60,
            opacity: 0,
            transformOrigin: '50% 100%',
            stagger: 0.03,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
          });
        },
      });
      gsap.from(ref.current!.querySelector('.heading-rule'), {
        scaleX: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`text-center mb-16 ${className}`}>
      <span className="text-[#00d4ff] font-mono text-sm tracking-widest uppercase">
        <Decrypt text={eyebrow} />
      </span>
      <h2 className="text-4xl md:text-6xl font-bold text-white mt-3 tracking-tight [perspective:700px]">{children}</h2>
      <div className="heading-rule mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent" />
    </div>
  );
}
