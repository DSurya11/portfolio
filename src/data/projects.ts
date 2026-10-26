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

// Every claim below was checked against the project's repository (README, code, CI files); the first three on 2026-10-26.
// Ordered by complexity.
export const projects: Project[] = [
  {
    title: 'MockMate — AI Mock Interview Platform',
    description:
      'Voice mock interviews run by an interviewer agent. After each answer the model chooses to follow up, repeat the question or move on, and code enforces the rules: one question per turn, at most two follow-ups, the prepared question word for word. The server keeps its own transcript, so a transcript sent from the browser is ignored. Every score in the report has to quote the candidate\'s own words, and code drops any quote that is not in the transcript. Eight services run under Docker Compose with Prometheus and Grafana, and GitHub Actions tests and deploys to Render.',
    tech: ['React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker', 'Prometheus', 'Grafana', 'Groq'],
    highlights: [
      'Interviewer agent: the model decides follow up, repeat or next question; code enforces the limits',
      'Every rubric score quotes the transcript; quotes that are not there are dropped, lines aimed at the grader excluded',
      '5 simulated candidates, one trying prompt injection, run full interviews; their first run caught 4 bugs',
      'Groq Whisper with silence filtering and auto-send after 5 s; free models from 4 providers with per-key fallback',
      'Prometheus metrics for model calls, interviewer decisions and evidence quotes, on a Grafana dashboard',
    ],
    github: 'https://github.com/DSurya11/mockmate',
    live: 'https://mockmate-frontend-b8z6.onrender.com',
    accent: '#00d4ff',
    diagram: {
      nodes: [
        { id: 'ui', label: 'React app', sub: 'voice · auto-send', x: 70, y: 125 },
        { id: 'api', label: 'Express API', sub: 'records every turn', x: 240, y: 125 },
        { id: 'db', label: 'PostgreSQL', sub: 'Prisma', x: 240, y: 35 },
        { id: 'q', label: 'Redis + BullMQ', sub: 'scoring retries', x: 410, y: 35 },
        { id: 'ai', label: 'AI service', sub: 'interviewer + scorer', x: 410, y: 215 },
        { id: 'llm', label: 'Groq · Gemini', sub: 'OpenRouter · Mistral', x: 570, y: 215 },
        { id: 'mon', label: 'Prometheus', sub: 'Grafana', x: 570, y: 125 },
      ],
      edges: [
        ['ui', 'api'],
        ['api', 'db'],
        ['api', 'q'],
        ['api', 'ai'],
        ['q', 'ai'],
        ['ai', 'llm'],
        ['ai', 'mon'],
      ],
    },
  },
  {
    title: 'Job Finder — Job Search with AI Agents',
    description:
      'Collects about 8,000 open roles from the job boards of 260+ companies (Workday, Greenhouse, SmartRecruiters, Ashby, Lever and their own career sites), plus LinkedIn and Internshala, scores each against a profile and checks the pay. Three agents work on that data. A search agent answers plain-English questions, and code checks every job it names. A daily agent finds the new job board when a company\'s source breaks and waits for approval before changing anything. A research agent writes a fit report for one job in which every line quotes the posting, the resume or the company\'s own site.',
    tech: ['Python', 'FastAPI', 'SQLite', 'React', 'Playwright', 'LangGraph', 'MCP', 'systemd'],
    highlights: [
      'Search agent: 95% on a 22-question eval suite; the same agent rebuilt in LangGraph scored 77%',
      'Daily repair agent proposes a new job board, proves it with a live fetch and waits for approval (ServiceNow: 1 job to 68)',
      'Research agent: every strength, gap and resume bullet must quote its source, or code drops it',
      'The search tools are also served over MCP, so other AI clients can use them',
      'Refreshed daily by systemd timers; a coverage view flags sources that failed, came back empty or dropped',
    ],
    github: 'https://github.com/DSurya11/job-finder',
    live: null,
    accent: '#e11d48',
    diagram: {
      nodes: [
        { id: 'boards', label: 'Job boards', sub: '260+ companies', x: 70, y: 35 },
        { id: 'agg', label: 'LinkedIn', sub: 'and Internshala', x: 70, y: 125 },
        { id: 'enrich', label: 'Fetch + parse', sub: 'daily timer', x: 240, y: 80 },
        { id: 'db', label: 'SQLite', sub: '~8,000 roles', x: 410, y: 80 },
        { id: 'ui', label: 'React app', sub: 'FastAPI', x: 570, y: 80 },
        { id: 'ask', label: 'Search agent', sub: 'ids checked', x: 570, y: 200 },
        { id: 'repair', label: 'Repair agent', sub: 'you approve', x: 240, y: 200 },
        { id: 'deep', label: 'Research agent', sub: 'quotes checked', x: 410, y: 200 },
      ],
      edges: [
        ['boards', 'enrich'],
        ['agg', 'enrich'],
        ['enrich', 'db'],
        ['db', 'ui'],
        ['enrich', 'repair'],
        ['db', 'deep'],
        ['ui', 'ask'],
      ],
    },
  },
  {
    title: 'Tachyon News — Verified Market News Pipeline',
    description:
      'An hourly pipeline that scrapes US market news from Finviz and reads Indian market RSS feeds, extracts tickers, sentiment and facts with an LLM, checks its evidence quote and every number against the article, and writes a cited daily brief. An "Ask the news" agent answers questions over the stories and stored prices; code checks that every story it cites came from its own searches and every percentage from the data, and it refuses buy or sell advice. It runs on a laptop as systemd timers and services, and a Vercel dashboard reaches its API through Tailscale Funnel.',
    tech: ['Python', 'Playwright', 'FastAPI', 'PostgreSQL', 'systemd', 'React', 'Tailscale', 'GitHub Actions'],
    highlights: [
      'Six stages every hour: scrape, fetch, LLM extraction, cited brief, prices, Neon sync',
      'Grounding check: every evidence quote and number is verified against the article body',
      '"Ask the news" agent: cited stories and percentages checked in code; 9 of 10 on its eval set',
      'systemd timers and services, failure alerts and a doctor command that checks every part',
      'CI runs lint and 180+ tests, including a real-browser test of the dashboard',
    ],
    github: 'https://github.com/DSurya11/tachyon-news',
    live: 'https://tachyon-news.vercel.app/?demo=1',
    accent: '#10b981',
    diagram: {
      nodes: [
        { id: 'src', label: 'Finviz + RSS', sub: 'US and India', x: 70, y: 35 },
        { id: 'scrape', label: 'Scrape + fetch', sub: 'hourly systemd timer', x: 240, y: 35 },
        { id: 'extract', label: 'LLM extraction', sub: 'quote + number check', x: 410, y: 35 },
        { id: 'db', label: 'PostgreSQL', sub: 'stories + prices', x: 410, y: 125 },
        { id: 'brief', label: 'Daily brief', sub: 'cited', x: 570, y: 125 },
        { id: 'ask', label: 'Ask agent', sub: 'answers checked', x: 240, y: 125 },
        { id: 'api', label: 'FastAPI', sub: 'Tailscale Funnel', x: 240, y: 215 },
        { id: 'ui', label: 'Dashboard', sub: 'Vercel', x: 70, y: 215 },
      ],
      edges: [
        ['src', 'scrape'],
        ['scrape', 'extract'],
        ['extract', 'db'],
        ['db', 'brief'],
        ['db', 'ask'],
        ['ask', 'api'],
        ['api', 'ui'],
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
