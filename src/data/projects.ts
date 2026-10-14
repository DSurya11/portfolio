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
  // How the system fits together, drawn from the description above (viewBox 640 × 250).
  diagram: Diagram;
};

export const projects: Project[] = [
  {
    title: 'MockMate — AI-Powered Mock Interview Platform',
    description:
      'Full-stack AI interview platform with 8-service Docker Compose architecture, real-time voice pipeline using Faster-Whisper + Groq LLM achieving <2s latency, async resume analysis via BullMQ workers, and JWT + RBAC authentication across 15+ REST endpoints.',
    tech: ['React', 'FastAPI', 'Node.js', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker', 'Prometheus'],
    highlights: [
      '8-service Docker Compose with health monitoring',
      'Real-time voice pipeline — under 2s response latency',
      'ATS scoring + skill extraction via BullMQ + Redis',
      'JWT + RBAC + HTTP-only cookies security',
    ],
    github: 'https://github.com/DSurya11/mockmate',
    live: 'https://mockmate-frontend-b8z6.onrender.com',
    accent: '#00d4ff',
    diagram: {
      nodes: [
        { id: 'ui', label: 'React app', x: 70, y: 125 },
        { id: 'api', label: 'Node API', sub: 'JWT + RBAC', x: 230, y: 60 },
        { id: 'voice', label: 'Voice pipeline', sub: '< 2s', x: 230, y: 190 },
        { id: 'db', label: 'PostgreSQL', x: 400, y: 30 },
        { id: 'q', label: 'Redis + BullMQ', x: 400, y: 100 },
        { id: 'stt', label: 'Faster-Whisper', x: 400, y: 190 },
        { id: 'work', label: 'Resume workers', sub: 'ATS scoring', x: 570, y: 100 },
        { id: 'llm', label: 'Groq LLM', x: 570, y: 190 },
      ],
      edges: [
        ['ui', 'api'],
        ['ui', 'voice'],
        ['api', 'db'],
        ['api', 'q'],
        ['q', 'work'],
        ['voice', 'stt'],
        ['stt', 'llm'],
      ],
    },
  },
  {
    title: 'Crypto Momentum Intelligence System',
    description:
      'Real-time ETL pipeline ingesting 1,000+ swap events/hour from GeckoTerminal, training per-chain stacking ensemble models (XGBoost + Random Forest + Extra Trees) on 12K–30K samples with 20+ technical indicators and 500K+ time-series records in PostgreSQL.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'XGBoost', 'React', 'Docker'],
    highlights: [
      '1,000+ swap events/hour ETL pipeline',
      'Stacking ensemble: XGBoost + RF + Extra Trees',
      '20+ technical indicators with adaptive calibration',
      '500K+ time-series records in PostgreSQL',
    ],
    github: 'https://github.com/DSurya11/crypto-momentum-intelligence',
    live: null,
    accent: '#7c3aed',
    diagram: {
      nodes: [
        { id: 'src', label: 'GeckoTerminal', sub: 'swap events', x: 70, y: 60 },
        { id: 'etl', label: 'ETL', sub: '1,000+ / hour', x: 230, y: 60 },
        { id: 'db', label: 'PostgreSQL', sub: '500K+ rows', x: 400, y: 60 },
        { id: 'feat', label: 'Indicators', sub: '20+ features', x: 570, y: 60 },
        { id: 'model', label: 'Stacking ensemble', sub: 'XGB + RF + ET', x: 570, y: 190 },
        { id: 'api', label: 'FastAPI', x: 400, y: 190 },
        { id: 'ui', label: 'React dashboard', x: 230, y: 190 },
      ],
      edges: [
        ['src', 'etl'],
        ['etl', 'db'],
        ['db', 'feat'],
        ['feat', 'model'],
        ['model', 'api'],
        ['api', 'ui'],
      ],
    },
  },
  {
    title: 'Credit Risk Prediction API',
    description:
      'ML-powered loan approval API with Random Forest classifier achieving 98.1% accuracy and 98% F1-score, full prediction auditability via SQLAlchemy ORM, deployed to Render with live Swagger/OpenAPI docs.',
    tech: ['FastAPI', 'PostgreSQL', 'Scikit-learn', 'SQLAlchemy', 'Docker'],
    highlights: ['98.1% accuracy | 98% F1-score Random Forest', '100% prediction auditability', 'Live Swagger/OpenAPI documentation'],
    github: 'https://github.com/DSurya11/credit-risk-api',
    live: 'https://credit-risk-api-wpam.onrender.com/docs',
    accent: '#059669',
    diagram: {
      nodes: [
        { id: 'client', label: 'Loan request', x: 70, y: 125 },
        { id: 'api', label: 'FastAPI', sub: 'Swagger docs', x: 230, y: 125 },
        { id: 'model', label: 'Random Forest', sub: '98.1% accuracy', x: 400, y: 60 },
        { id: 'orm', label: 'SQLAlchemy', sub: 'audit trail', x: 400, y: 190 },
        { id: 'db', label: 'PostgreSQL', x: 570, y: 190 },
        { id: 'out', label: 'Decision', x: 570, y: 60 },
      ],
      edges: [
        ['client', 'api'],
        ['api', 'model'],
        ['model', 'out'],
        ['api', 'orm'],
        ['orm', 'db'],
      ],
    },
  },
  {
    title: 'CineBook — Movie Reservation System',
    description:
      'Full-stack cinema booking platform with transaction-safe seat locking using MySQL transactions and 5-minute pending reservation guards to prevent double-booking race conditions.',
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
        { id: 'api', label: 'Express API', sub: 'bcrypt auth', x: 230, y: 125 },
        { id: 'lock', label: 'Seat lock', sub: '5-min hold', x: 400, y: 60 },
        { id: 'map', label: 'Seat map', sub: 'from schema', x: 400, y: 190 },
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
  {
    title: 'AI Job Search Assistant',
    description:
      'Intelligent job scraper using Playwright to crawl multiple job boards, scores postings against a PDF resume with sentence-transformer embeddings (all-MiniLM-L6-v2), and exports ranked matches to CSV.',
    tech: ['Python', 'Playwright', 'Sentence-Transformers', 'NLP', 'PyMuPDF'],
    highlights: [
      'Multi-board scraping with Playwright automation',
      'Resume–JD cosine similarity via sentence embeddings',
      'Fully configurable via environment variables',
      'Ranked job matches exported to CSV',
    ],
    github: 'https://github.com/DSurya11/job-finder',
    live: null,
    accent: '#e11d48',
    diagram: {
      nodes: [
        { id: 'boards', label: 'Job boards', x: 70, y: 60 },
        { id: 'pw', label: 'Playwright', sub: 'scraper', x: 230, y: 60 },
        { id: 'pdf', label: 'Resume PDF', x: 70, y: 190 },
        { id: 'mu', label: 'PyMuPDF', x: 230, y: 190 },
        { id: 'emb', label: 'MiniLM-L6-v2', sub: 'embeddings', x: 400, y: 125 },
        { id: 'csv', label: 'Ranked CSV', sub: 'cosine score', x: 570, y: 125 },
      ],
      edges: [
        ['boards', 'pw'],
        ['pw', 'emb'],
        ['pdf', 'mu'],
        ['mu', 'emb'],
        ['emb', 'csv'],
      ],
    },
  },
  {
    title: 'Event Management System',
    description:
      'Multi-role event platform for college/org events with role-based access control, full event CRUD, registration workflows, and participant management. Team collaboration with 4 contributors.',
    tech: ['React', 'Node.js', 'Express', 'MySQL', 'REST API'],
    highlights: [
      'RBAC: User, Organizer, and Admin roles',
      'Full event lifecycle — create, edit, manage registrations',
      'Participant list management for organizers',
      'Team project — 4 contributors',
    ],
    github: 'https://github.com/DSurya11/Event-Management-System',
    live: null,
    accent: '#f97316',
    diagram: {
      nodes: [
        { id: 'ui', label: 'React', x: 70, y: 125 },
        { id: 'api', label: 'Express REST', sub: 'RBAC', x: 230, y: 125 },
        { id: 'ev', label: 'Events', sub: 'CRUD', x: 400, y: 60 },
        { id: 'reg', label: 'Registrations', sub: 'participants', x: 400, y: 190 },
        { id: 'db', label: 'MySQL', x: 570, y: 125 },
      ],
      edges: [
        ['ui', 'api'],
        ['api', 'ev'],
        ['api', 'reg'],
        ['ev', 'db'],
        ['reg', 'db'],
      ],
    },
  },
  {
    title: 'VibeNest — Music Streaming Platform',
    description:
      'Music streaming web app with in-browser song playback, playlist management, user authentication, and an admin panel for catalog management built on React, Node.js, and MySQL.',
    tech: ['React', 'Node.js', 'Express', 'MySQL', 'Vite'],
    highlights: [
      'In-browser music player with playback controls',
      'User playlists and song library management',
      'Admin panel for catalog and user management',
      'bcrypt-secured authentication',
    ],
    github: 'https://github.com/DSurya11/music-Streaming-platform',
    live: null,
    accent: '#a855f7',
    diagram: {
      nodes: [
        { id: 'player', label: 'Player', sub: 'React + Vite', x: 70, y: 60 },
        { id: 'admin', label: 'Admin panel', x: 70, y: 190 },
        { id: 'api', label: 'Express API', sub: 'bcrypt auth', x: 300, y: 125 },
        { id: 'lib', label: 'Playlists', sub: 'library', x: 520, y: 60 },
        { id: 'db', label: 'MySQL', sub: 'catalog', x: 520, y: 190 },
      ],
      edges: [
        ['player', 'api'],
        ['admin', 'api'],
        ['api', 'lib'],
        ['api', 'db'],
      ],
    },
  },
];
