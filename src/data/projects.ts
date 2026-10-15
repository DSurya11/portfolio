export type DiagramNode = { id: string; label: string; sub?: string; x: number; y: number };
export type Diagram = { nodes: DiagramNode[]; edges: [string, string][] };

export type Project = {
  title: string;
  description: string;
  tech: string[];
  highlights: string[];
  github: string;
  live: string | null;
  accent: string;
  // How the system fits together, checked against the repository (viewBox 640 × 250).
  diagram: Diagram;
};

// Every claim below was checked against the project's repository (README, code, CI files) on 2026-10-15.
export const projects: Project[] = [
  {
    title: 'Tachyon News — Verified Market News Pipeline',
    description:
      'An hourly pipeline that scrapes US market news from Finviz and reads Indian market RSS feeds, extracts tickers, sentiment and facts with an LLM, checks its evidence quote and every number against the article, and writes a cited daily brief. It runs on a laptop as systemd timers and services, syncs a public subset to Neon, and a Vercel dashboard reaches its API through Tailscale Funnel.',
    tech: ['Python', 'Playwright', 'FastAPI', 'PostgreSQL', 'systemd', 'React', 'Tailscale', 'GitHub Actions'],
    highlights: [
      'Six stages every hour: scrape, fetch, LLM extraction, cited brief, prices, Neon sync',
      'Grounding check: every evidence quote and number is verified against the article body',
      'systemd timers and services, daily pg_dump backups, failure alerts and a doctor command',
      'CI runs lint and 150+ tests, including a real-browser test of the dashboard',
    ],
    github: 'https://github.com/DSurya11/tachyon-news',
    live: 'https://tachyon-news.vercel.app/?demo=1',
    accent: '#10b981',
    diagram: {
      nodes: [
        { id: 'src', label: 'Finviz + RSS', sub: 'US and India', x: 70, y: 35 },
        { id: 'scrape', label: 'Scrape + fetch', sub: 'hourly systemd timer', x: 240, y: 35 },
        { id: 'extract', label: 'LLM extraction', sub: 'quote + number check', x: 410, y: 35 },
        { id: 'db', label: 'PostgreSQL', sub: 'local · daily backups', x: 410, y: 125 },
        { id: 'brief', label: 'Daily brief', sub: 'cited', x: 570, y: 125 },
        { id: 'neon', label: 'Neon', sub: 'public subset', x: 410, y: 215 },
        { id: 'api', label: 'FastAPI', sub: 'Tailscale Funnel', x: 240, y: 215 },
        { id: 'ui', label: 'Dashboard', sub: 'Vercel', x: 70, y: 215 },
      ],
      edges: [
        ['src', 'scrape'],
        ['scrape', 'extract'],
        ['extract', 'db'],
        ['db', 'brief'],
        ['db', 'neon'],
        ['neon', 'api'],
        ['api', 'ui'],
      ],
    },
  },
  {
    title: 'Job Finder — India Job Aggregator',
    description:
      'Pulls open roles from the job boards of 260 companies (most on Workday, Greenhouse, SmartRecruiters, Ashby and Lever, the rest through their own career sites), plus LinkedIn and Internshala. It parses role, level, pay and city, scores each job against a profile, gives every posting a pay verdict, and serves a React app to filter, shortlist and track applications.',
    tech: ['Python', 'FastAPI', 'Playwright', 'SQLite', 'React', 'Vite', 'Tailwind', 'Claude API'],
    highlights: [
      '242 companies on Workday, Greenhouse, SmartRecruiters, Ashby and Lever, 18 career sites with their own fetchers',
      'Pay verdict per job from stated pay, AmbitionBox data or a labelled estimate',
      'Coverage view flags companies whose fetch failed, came back empty or dropped sharply',
      'make up / make down: one command to set up, build and serve',
    ],
    github: 'https://github.com/DSurya11/job-finder',
    live: null,
    accent: '#e11d48',
    diagram: {
      nodes: [
        { id: 'boards', label: 'ATS job boards', sub: '242 companies', x: 70, y: 35 },
        { id: 'sites', label: 'Career sites', sub: '18 own fetchers', x: 70, y: 125 },
        { id: 'agg', label: 'LinkedIn', sub: 'and Internshala', x: 70, y: 215 },
        { id: 'enrich', label: 'Parse + enrich', sub: 'role · level · pay', x: 240, y: 125 },
        { id: 'score', label: 'Fit + pay verdict', sub: 'against a profile', x: 410, y: 60 },
        { id: 'db', label: 'SQLite', x: 410, y: 190 },
        { id: 'api', label: 'FastAPI', sub: 'search · coverage', x: 570, y: 190 },
        { id: 'ui', label: 'React app', sub: 'shortlist · track', x: 570, y: 60 },
      ],
      edges: [
        ['boards', 'enrich'],
        ['sites', 'enrich'],
        ['agg', 'enrich'],
        ['enrich', 'score'],
        ['score', 'db'],
        ['db', 'api'],
        ['api', 'ui'],
      ],
    },
  },
  {
    title: 'MockMate — AI-Powered Mock Interview Platform',
    description:
      'A full-stack interview platform: voice interviews with LLM interviewers, transcription with the Groq Whisper API, resume analysis on a BullMQ worker, and JWT + RBAC authentication. Eight services run under Docker Compose with Prometheus and Grafana, and GitHub Actions type-checks, tests and deploys to Render.',
    tech: ['React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker', 'Prometheus', 'Grafana'],
    highlights: [
      '8 services in Docker Compose, including Prometheus and Grafana',
      'Groq Whisper transcription in about 600 ms after an answer',
      'Resume ATS scoring and skill extraction on a BullMQ worker',
      'GitHub Actions: type check, AI-service tests, lint and build, then deploy to Render',
    ],
    github: 'https://github.com/DSurya11/mockmate',
    live: 'https://mockmate-frontend-b8z6.onrender.com',
    accent: '#00d4ff',
    diagram: {
      nodes: [
        { id: 'ui', label: 'React app', x: 70, y: 125 },
        { id: 'api', label: 'Express API', sub: 'JWT + RBAC', x: 240, y: 125 },
        { id: 'db', label: 'PostgreSQL', sub: 'Prisma', x: 240, y: 35 },
        { id: 'q', label: 'Redis + BullMQ', x: 410, y: 125 },
        { id: 'worker', label: 'Worker', sub: 'resume ATS score', x: 570, y: 125 },
        { id: 'ai', label: 'AI service', sub: 'FastAPI', x: 410, y: 215 },
        { id: 'groq', label: 'Groq', sub: 'LLM + Whisper', x: 570, y: 215 },
      ],
      edges: [
        ['ui', 'api'],
        ['api', 'db'],
        ['api', 'q'],
        ['q', 'worker'],
        ['api', 'ai'],
        ['worker', 'ai'],
        ['ai', 'groq'],
      ],
    },
  },
  {
    title: 'Crypto Momentum Intelligence System',
    description:
      'A live pipeline that ingests GeckoTerminal swap data across Base, BSC, Solana and Ethereum every 5 minutes, builds 29 engineered features per token, and retrains a per-chain stacking ensemble (XGBoost, Random Forest and Extra Trees with a logistic-regression meta-learner) on every tick. Buy and sell thresholds recalibrate from the last 14 days of verified picks.',
    tech: ['Python', 'PostgreSQL', 'XGBoost', 'scikit-learn', 'FastAPI', 'React'],
    highlights: [
      '5-minute ingestion across four chains from GeckoTerminal',
      'Per-chain stacking ensemble retrained every tick on 12K–30K rows',
      'Thresholds self-calibrate from 14 days of verified predictions',
      'Every pick is checked after two hours and its outcome recorded',
    ],
    github: 'https://github.com/DSurya11/crypto-momentum-intelligence',
    live: null,
    accent: '#7c3aed',
    diagram: {
      nodes: [
        { id: 'src', label: 'GeckoTerminal', sub: '4 chains', x: 70, y: 60 },
        { id: 'ingest', label: 'Ingest', sub: 'every 5 min', x: 240, y: 60 },
        { id: 'db', label: 'PostgreSQL', sub: 'swaps · candles', x: 410, y: 60 },
        { id: 'feat', label: 'Features', sub: '29 engineered', x: 570, y: 60 },
        { id: 'model', label: 'Stacking ensemble', sub: 'one per chain', x: 570, y: 190 },
        { id: 'picks', label: 'Top picks', sub: 'checked after 2h', x: 410, y: 190 },
        { id: 'api', label: 'FastAPI', x: 240, y: 190 },
        { id: 'ui', label: 'React dashboard', x: 70, y: 190 },
      ],
      edges: [
        ['src', 'ingest'],
        ['ingest', 'db'],
        ['db', 'feat'],
        ['feat', 'model'],
        ['model', 'picks'],
        ['picks', 'db'],
        ['picks', 'api'],
        ['api', 'ui'],
      ],
    },
  },
  {
    title: 'CineBook — Movie Reservation System',
    description:
      'A full-stack cinema booking platform with transaction-safe seat locking: MySQL transactions and a 5-minute hold on pending reservations stop two people from booking the same seat.',
    tech: ['React', 'Node.js', 'Express', 'MySQL', 'TailwindCSS', 'React Query'],
    highlights: [
      'MySQL transactions eliminate double-booking races',
      'Dynamic seat map rendered directly from DB schema',
      'bcrypt auth + Context API + local storage persistence',
      'TanStack React Query for cached server-state',
    ],
    github: 'https://github.com/DSurya11/cinibook',
    live: null,
    accent: '#f59e0b',
    diagram: {
      nodes: [
        { id: 'ui', label: 'React', sub: 'React Query cache', x: 70, y: 125 },
        { id: 'api', label: 'Express API', sub: 'bcrypt auth', x: 240, y: 125 },
        { id: 'lock', label: 'Seat lock', sub: '5-min hold', x: 410, y: 60 },
        { id: 'map', label: 'Seat map', sub: 'from schema', x: 410, y: 190 },
        { id: 'db', label: 'MySQL', sub: 'transactions', x: 570, y: 125 },
      ],
      edges: [
        ['ui', 'api'],
        ['api', 'lock'],
        ['api', 'map'],
        ['lock', 'db'],
        ['map', 'db'],
      ],
    },
  },
];
