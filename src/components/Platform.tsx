import { lazy, Suspense, useRef } from 'react';
import { useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './fx/SectionHeading';
import { PlatformStack } from './PlatformStack';
import { GithubIcon } from './icons';
import type { Diagram } from '../data/projects';
import { gsap, useGSAP, reducedMotion } from '../lib/motion';

const ArchDiagram = lazy(() => import('./ArchDiagram').then((m) => ({ default: m.ArchDiagram })));

// Facts in this section come from the READMEs of the five surya-idp repositories and from the
// verification log in idp-infra/HANDOVER_DOC.md.
const repos = [
  { name: 'idp-infra', role: 'Terraform for AWS, make up / make down, end-to-end tests' },
  { name: 'idp-gitops', role: 'Everything that runs in the cluster; Argo CD deploys from it' },
  { name: 'idp-portal', role: 'Backstage, the software templates, eleven custom actions' },
  { name: 'idp-platform', role: 'The shared CI workflow every service calls' },
  { name: 'feature-flag-service', role: 'The first application: a feature flag API' },
];

const delivery: Diagram = {
  nodes: [
    { id: 'push', label: 'git push', sub: 'service repo', x: 70, y: 60 },
    { id: 'ci', label: 'Shared CI', sub: 'lint · test · Trivy', x: 240, y: 60 },
    { id: 'ecr', label: 'Amazon ECR', sub: 'SLSA + SBOM signed', x: 410, y: 60 },
    { id: 'upd', label: 'Image Updater', sub: 'checks every minute', x: 570, y: 60 },
    { id: 'git', label: 'idp-gitops', sub: 'tag commit, bot', x: 570, y: 190 },
    { id: 'argo', label: 'Argo CD', sub: 'sync', x: 410, y: 190 },
    { id: 'pods', label: 'Rolling update', sub: 'zero downtime', x: 240, y: 190 },
  ],
  edges: [
    ['push', 'ci'],
    ['ci', 'ecr'],
    ['ecr', 'upd'],
    ['upd', 'git'],
    ['git', 'argo'],
    ['argo', 'pods'],
  ],
};

const templates = [
  { name: 'python-service', what: 'A FastAPI service: repo, CI, deploy files, route on the shared load balancer, docs, catalog entry' },
  { name: 'add-postgres-database', what: 'Gives an existing service its own database and login' },
  { name: 'add-feature-flag', what: 'Creates a flag for a service in the flag API' },
  { name: 'decommission-service', what: 'Removes a service everywhere: deployment, route, database, images, flags, docs' },
];

const numbers = [
  { big: '28,800', unit: 'requests · 0 failed', what: 'k6 load through a GitOps rollout, a node surge and a node drain (p95 43.8 ms)' },
  { big: '42/42', unit: 'end-to-end checks', what: 'make e2e against the running platform' },
  { big: '970 → 20', unit: 'ms p95', what: 'flag API latency after moving the database into the VPC, one variable changed' },
  { big: '8', unit: 'admission policies', what: 'Kyverno; each has a manifest it must reject' },
  { big: '0', unit: 'long-lived AWS keys', what: 'SSO for people, GitHub OIDC for CI, Pod Identity for pods' },
  { big: '~27 / ~17', unit: 'min up / down', what: 'make down ends by checking that nothing billable is left' },
];

export default function Platform() {
  const ref = useRef<HTMLElement>(null);
  const flow = useRef<HTMLDivElement>(null);
  const flowInView = useInView(flow, { once: true, margin: '-15% 0px' });

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.idp-num', {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.idp-nums', start: 'top 82%', once: true },
      });
      gsap.from('.idp-tpl', {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.idp-tpls', start: 'top 82%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section id="platform" ref={ref} className="relative py-24 lg:py-[8.25rem]">
      <div className="page-x relative z-10">
        <SectionHeading eyebrow="Flagship project">
          Internal Developer <span className="text-[#00d4ff]">Platform</span>
        </SectionHeading>

        <p className="mx-auto -mt-6 mb-16 max-w-3xl text-center text-lg leading-relaxed text-slate-300">
          A self-service platform on AWS. A developer fills in a form in Backstage and gets a tested, deployed service a few minutes
          later, without touching AWS, Kubernetes or the deploy repository. Built across five repositories: Terraform, GitOps, a
          developer portal, a shared CI workflow and a first application.
        </p>

        <PlatformStack />

        {/* How a change reaches the cluster */}
        <div className="mt-28 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#00d4ff]">Delivery</p>
            <h3 className="mt-3 text-3xl font-bold leading-tight text-white">No pipeline holds a deploy credential</h3>
            <p className="mt-4 leading-relaxed text-slate-300">
              CI only builds, scans and pushes an image; the shared workflow also signs it with build provenance and an SBOM through
              Sigstore, keyless. The cluster pulls: Argo CD Image Updater commits the new tag to the GitOps repo and Argo CD rolls it
              out. An image is pushed only for the newest commit of main, so the older of two quick merges can never end up deployed.
            </p>
          </div>
          <div ref={flow} className="min-w-0 rounded-2xl border border-white/10 bg-[#07070b] p-4 sm:p-6">
            <div className="-mx-1 overflow-x-auto px-1">
              <div className="min-w-[540px]">
                {flowInView ? (
                  <Suspense fallback={<div className="aspect-[640/250]" />}>
                    <ArchDiagram diagram={delivery} accent="#00d4ff" />
                  </Suspense>
                ) : (
                  <div className="aspect-[640/250]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* The golden path */}
        <div className="mt-28">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#00d4ff]">Golden path</p>
          <h3 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-white">A form in Backstage, then a running service</h3>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
            Four software templates, backed by eleven custom scaffolder actions and 102 unit tests. Every template change is tested
            end to end before merge: the template is rendered, the generated service is built and tested, and its deploy files are
            validated against the cluster's admission policies.
          </p>
          <div className="idp-tpls mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((t) => (
              <div key={t.name} className="idp-tpl rounded-xl border border-white/10 bg-[#0b0b12] p-5">
                <p className="font-mono text-sm font-semibold text-white">{t.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.what}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Measured, not claimed */}
        <div className="idp-nums mt-28 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {numbers.map((n) => (
            <div key={n.unit} className="idp-num bg-[#07070b] p-6">
              <p className="text-4xl font-black tracking-tight text-white">{n.big}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#00d4ff]">{n.unit}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{n.what}</p>
            </div>
          ))}
        </div>

        {/* The repositories */}
        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {repos.map((r) => (
            <a
              key={r.name}
              href={`https://github.com/surya-idp/${r.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-white/10 bg-[#0b0b12] p-4 transition-colors hover:border-white/25"
            >
              <span className="flex items-center gap-2 font-mono text-sm text-white">
                <GithubIcon size={15} />
                {r.name}
                <ArrowUpRight size={14} className="ml-auto text-slate-500 transition-colors group-hover:text-white" />
              </span>
              <span className="mt-2 text-xs leading-relaxed text-slate-400">{r.role}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
