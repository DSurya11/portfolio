import { useRef, useState } from 'react';
import { SectionHeading } from './fx/SectionHeading';
import { SplitFlap } from './fx/SplitFlap';
import { gsap, useGSAP, ScrollTrigger, reducedMotion } from '../lib/motion';

// From the internship's mid-term report (Airspan Networks, 15 July 2026 onward). The product is
// described generically on purpose.
const work = [
  {
    tag: 'Kubernetes deployments',
    since: 'Since week 8',
    title: 'Deploying the product on Kubernetes with Helm',
    body: 'I install the product for other teams to test on, from its Helm chart, and check that every service comes up. When one does not start, I find the cause from its events and logs and fix it. I have deployed all three editions of the product this way.',
    points: ['Helm charts and values → running services', 'Diagnosing failed services from Kubernetes events and logs'],
  },
  {
    tag: 'Release runs',
    since: 'Weeks 10–11',
    title: 'Every release build, deployed and regression-tested',
    body: 'During a release, new builds arrived frequently as bugs were fixed. For each one we deployed the build and ran the automated regression suite end to end through Jenkins. I went through every report and traced each failed test to the step where it stopped.',
    points: ['Jenkins runs of the full suite on each build', 'Robot Framework logs and reports read to the failing step'],
  },
  {
    tag: 'Test automation',
    since: 'Since week 5',
    title: '116 automated regression tests, merged to main',
    body: 'Written in Robot Framework with Playwright. The hard ones do not stop at the web page: after a change, the test logs in to the device or server over SSH and confirms the change really happened. Database backups, data-model exports, audit reports, and enabling or disabling LTE and NR cells all take minutes to finish, so each test polls until the result appears or a time limit is reached, and then restores the system so the next test starts clean.',
    points: ['Access control, fault, file and label management, scheduled tasks', 'Verification on the device over SSH, not only in the browser'],
  },
  {
    tag: 'Node simulator',
    since: 'Weeks 1–2',
    title: 'A simulator of 4G and 5G radio nodes',
    body: 'Built in Python (asyncio) with PostgreSQL and Docker. It writes the same files real radio nodes send, on their real schedules: performance counters in 3GPP XML and alarms every 15 minutes, debug logs every 6 minutes, diagnostic bundles every hour. This lets the product be tested, and load-tested with many nodes, without hardware.',
    points: [
      'Alarm state kept in the database, written before each file: restarts lose nothing',
      'Every file written under a temporary name, then renamed: never read half-written',
    ],
  },
];

const tools = ['Kubernetes', 'Helm', 'Docker', 'Jenkins', 'Robot Framework', 'Playwright', 'Python', 'PostgreSQL', 'Linux', 'SSH', 'Git'];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(0);

  useGSAP(
    () => {
      if (reducedMotion()) {
        gsap.set('.xp-node', { opacity: 1 });
        return;
      }
      // The line draws down the work list as you scroll (a transform, so it is only composited);
      // each entry lights up when the line reaches it.
      gsap.fromTo(
        '.xp-line',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.xp-list', start: 'top 70%', end: 'bottom 70%', scrub: 0.5 } },
      );
      gsap.utils.toArray<HTMLElement>('.xp-node').forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0.25, x: 16 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 72%', toggleActions: 'play none none reverse' } },
        );
      });
      ScrollTrigger.create({ trigger: '.xp-stats', start: 'top 80%', once: true, onEnter: () => setRun((r) => r + 1) });
    },
    { scope: ref },
  );

  return (
    <section id="experience" ref={ref} className="relative py-24">
      <div className="page-x relative z-10">
        <SectionHeading eyebrow="Where I work">
          <span className="text-[#00d4ff]">Experience</span>
        </SectionHeading>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Left: the role, sticky on desktop while the work list scrolls past. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">Jul 2026 – present · Bengaluru</p>
            <h3 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
              R&amp;D Intern
              <span className="block text-[#00d4ff]">Airspan Networks</span>
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              On a telecom network-management product: the web system operators use to monitor and control their 4G and 5G radio
              nodes. My work is deploying it on Kubernetes, running its regression suite on every release build, and automating
              its tests.
            </p>

            <div className="xp-stats mt-8 grid grid-cols-2 gap-6">
              <div>
                <div className="text-5xl font-black leading-none text-white sm:text-6xl">
                  <SplitFlap value={116} play={run} onReplay={() => setRun((r) => r + 1)} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-widest text-slate-500">Automated regression tests</p>
              </div>
              <div>
                <div className="text-5xl font-black leading-none text-white sm:text-6xl">
                  <SplitFlap value={3} play={run} onReplay={() => setRun((r) => r + 1)} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-widest text-slate-500">Editions deployed on Kubernetes</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {tools.map((t) => (
                <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: what the work is, joined by a line that draws as you scroll. */}
          <div className="xp-list relative pl-8 sm:pl-10">
            <div aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 sm:left-[9px]" />
            <div aria-hidden className="xp-line absolute left-[7px] top-2 bottom-2 w-px origin-top bg-[#00d4ff] sm:left-[9px]" />
            <ol className="space-y-12">
              {work.map((w) => (
                <li key={w.tag} className="xp-node relative">
                  <span
                    aria-hidden
                    className="absolute -left-8 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-[#00d4ff] bg-black sm:-left-10 sm:h-5 sm:w-5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00d4ff]">{w.tag}</p>
                    <p className="font-mono text-xs text-slate-500">{w.since}</p>
                  </div>
                  <h4 className="mt-2 text-xl font-semibold text-white">{w.title}</h4>
                  <p className="mt-3 leading-relaxed text-slate-300">{w.body}</p>
                  <ul className="mt-4 space-y-1.5">
                    {w.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm text-slate-400">
                        <span className="mt-2 h-1 w-3 shrink-0 bg-slate-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
