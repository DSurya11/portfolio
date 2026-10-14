import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { MapPin, Mail, Hand } from 'lucide-react';
import { SectionHeading } from './fx/SectionHeading';
import { makeBadgeFaces, BADGE_COLOR } from './badge';
import { Boundary } from './fx/Boundary';
import { whenCalm } from '../lib/calm';
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/motion';

const Lanyard = lazy(() => import('./vendor/Lanyard'));

// On desktop the badge's canvas covers the whole section (pointer input passes through to the
// text), so the card can be thrown anywhere without being clipped by a box. On phones it
// hangs in its own block under the text.
// The canvas runs well past the top and bottom of its box, so the card can be thrown up or
// pulled down without being cut off at the section edge. It is see-through and ignores pointer
// input. The strap still hangs from the top of the box (anchorDrop).
const OVERHANG = 640;
const OVER_TOP = 420;

function Badge({ section }: { section: React.RefObject<HTMLElement | null> }) {
  const [faces, setFaces] = useState<{ front: string; back: string; strap: string } | null>(null);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const box = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(900);
  // Build the card (artwork, then three.js) only while the page is calm, never mid-scroll.
  useEffect(() => {
    let cancel = () => {};
    let alive = true;
    cancel = whenCalm(() =>
      makeBadgeFaces().then((made) => {
        if (alive) cancel = whenCalm(() => setFaces(made));
      }),
    );
    return () => {
      alive = false;
      cancel();
    };
  }, []);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  // Desktop measures the whole section (padding included); phones measure the badge's own box.
  useEffect(() => {
    const el = wide ? section.current : box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.getBoundingClientRect().height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [wide, section]);

  const canvasH = OVER_TOP + height + OVERHANG;
  // Same card as before the canvas grew: ~340 px tall on desktop (0.6 of the box on phones),
  // with its top resting ~30% down the box.
  const cardPx = wide ? 340 : height * 0.6;
  const restTop = (wide ? 0.306 : 0.285) * height;
  const strapLength = Math.min(1, Math.max(0, ((OVER_TOP + restTop) / canvasH - 0.12) / 0.3));

  const card = faces && (
    <div className="pointer-events-none absolute inset-x-0 z-20" style={{ top: -OVER_TOP, height: canvasH }}>
      <Boundary>
        <Suspense fallback={null}>
          <Lanyard
            frontImage={faces.front}
            backImage={faces.back}
            strapImage={faces.strap}
            finish="glossy"
            cardColor={BADGE_COLOR}
            strapColor="#10141c"
            metal="silver"
            anchor={wide ? 'right' : 'center'}
            anchorDrop={OVER_TOP / canvasH}
            size={Math.min(0.6, cardPx / canvasH)}
            strapLength={strapLength}
            breeze={0.6}
          />
        </Suspense>
      </Boundary>
    </div>
  );

  // The hook the strap hangs from, so lifting the card never shows the strap starting in mid-air.
  const hook = faces && (
    <span
      aria-hidden
      className="pointer-events-none absolute top-0 z-10 h-3.5 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-gradient-to-b from-[#4a505a] to-[#1d2026] shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
      style={{ left: wide ? '73%' : '50%' }}
    />
  );

  if (wide)
    return (
      <>
        {card}
        {hook}
      </>
    );
  return (
    <div ref={box} className="page-x relative mt-4 h-[520px] sm:h-[600px]">
      {card}
      {hook}
      <p className="pointer-events-none absolute left-6 top-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-500">
        <Hand size={14} /> Drag the card
      </p>
    </div>
  );
}

export default function About() {
  const bio = useRef<HTMLParagraphElement>(null);
  const section = useRef<HTMLElement>(null);

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
    <section id="about" ref={section} className="relative py-24">
      <div className="page-x relative z-10">
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

          {/* Desktop: the card hangs over this column; the canvas itself is section-wide. */}
          <div className="relative hidden min-h-[470px] lg:block">
            <p className="pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-slate-500">
              <Hand size={14} /> Drag the card · click to flip
            </p>
          </div>
        </div>
      </div>
      <Badge section={section} />
    </section>
  );
}
