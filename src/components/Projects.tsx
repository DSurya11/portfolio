import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const projects = [
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
  },
  {
    title: 'Credit Risk Prediction API',
    description:
      'ML-powered loan approval API with Random Forest classifier achieving 98.1% accuracy and 98% F1-score, full prediction auditability via SQLAlchemy ORM, deployed to Render with live Swagger/OpenAPI docs.',
    tech: ['FastAPI', 'PostgreSQL', 'Scikit-learn', 'SQLAlchemy', 'Docker'],
    highlights: [
      '98.1% accuracy | 98% F1-score Random Forest',
      '100% prediction auditability',
      'Live Swagger/OpenAPI documentation',
    ],
    github: 'https://github.com/DSurya11/credit-risk-api',
    live: 'https://credit-risk-api-wpam.onrender.com/docs',
    accent: '#059669',
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
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" className="py-20" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00d4ff] font-mono text-sm tracking-widest uppercase">What I've built</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            Featured <span className="text-[#00d4ff]">Projects</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group flex flex-col rounded-2xl border border-[#ffffff1e] bg-[#111118] overflow-hidden transition-all duration-300 hover:border-[#00d4ff66] hover:shadow-[0_20px_60px_#00d4ff30]"
            >
              {/* Top accent bar */}
              <div className="h-1 w-full" style={{ backgroundColor: project.accent }} />

              <div className="flex flex-col flex-1 p-6">
                {/* Title */}
                <h3 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-[#00d4ff] transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Highlights */}
                <ul className="mb-5 space-y-1.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-slate-400">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: project.accent }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md text-xs font-mono"
                      style={{
                        color: project.accent,
                        backgroundColor: `${project.accent}28`,
                        border: `1px solid ${project.accent}66`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-auto">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffffff10] border border-[#ffffff28] text-slate-300 text-sm hover:text-white hover:border-[#ffffff55] transition-all duration-200"
                  >
                    <GithubIcon />
                    GitHub
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: `${project.accent}28`,
                        border: `1px solid ${project.accent}77`,
                        color: project.accent,
                      }}
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
