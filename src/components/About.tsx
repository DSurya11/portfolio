import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { MapPin, Mail, Hand } from 'lucide-react';
import { SectionHeading } from './fx/SectionHeading';
import { makeBadgeFaces } from './badge';
import { Boundary } from './fx/Boundary';
import { useNear } from '../lib/useNear';
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/motion';

const Lanyard = lazy(() => import('./vendor/Lanyard'));

function Badge() {
  const ref = useRef<HTMLDivElement>(null);
  const [faces, setFaces] = useState<{ front: string; back: string } | null>(null);
  // Only build the card (and load three.js for it) once the section is close to the screen.
  const near = useNear(ref, '200px');
  useEffect(() => {
    if (near) makeBadgeFaces().then(setFaces);
  }, [near]);

  return (
    <div ref={ref} className="relative h-[520px] sm:h-[600px] w-full" data-cursor="grab">
      {faces && (
        <Boundary>
          <Suspense fallback={null}>
            <Lanyard
              frontImage={faces.front}
              backImage={faces.back}
              finish="holographic"
              cardColor="#0b0b12"
              strapColor="#0e7490"
              metal="silver"
              size={0.64}
              strapLength={0.55}
              breeze={0.6}
            />
          </Suspense>
        </Boundary>
      )}
      <p className="pointer-events-none absolute left-0 top-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-500">
        <Hand size={14} /> Drag the card
      </p>
    </div>
  );
}

export default function About() {
  const bio = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (reducedMotion()) return;
    const split = SplitText.create(bio.current!, { type: 'words', wordsClass: 'bio-word', aria: 'none' });
    gsap.fromTo(
      split.words,
      { opacity: 0.22 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: bio.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
      },
    );
  });

  return (
    <section id="about" className="relative py-24">
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow="Get to know me">
          About <span className="text-[#00d4ff]">Me</span>
        </SectionHeading>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p ref={bio} className="text-slate-200 text-xl md:text-2xl leading-relaxed mb-8">
              I'm a pre-final year Computer Science student at <span className="text-[#00d4ff] font-medium">IIIT Jabalpur</span> with
              a CPI of <span className="text-[#00d4ff] font-semibold">8.1</span>. I specialize in building production-grade AI
              systems, real-time ML pipelines, and full-stack applications. Passionate about backend engineering, machine
              learning, and competitive programming.
            </p>

            <dl className="mb-8 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0b0b12]/70 backdrop-blur-sm">
              {[
                ['Institute', 'Indian Institute of Information Technology Jabalpur'],
                ['Degree', 'B.Tech – CSE'],
                ['CPI', '8.1 / 10'],
                ['Duration', 'Aug 2023 – May 2027'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 px-5 py-3">
                  <dt className="text-sm text-slate-500">{k}</dt>
                  <dd className={`text-right text-sm font-medium ${k === 'CPI' ? 'text-[#00d4ff] text-base font-bold' : 'text-slate-200'}`}>{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={16} className="text-[#00d4ff] shrink-0" />
                <span>Jabalpur, MP, India</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail size={16} className="text-[#00d4ff] shrink-0" />
                <a href="mailto:suryadantuluri2005@gmail.com" className="hover:text-[#00d4ff] transition-colors">
                  suryadantuluri2005@gmail.com
                </a>
              </div>
            </div>
          </div>

          <Badge />
        </div>
      </div>
    </section>
  );
}
