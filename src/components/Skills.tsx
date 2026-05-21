import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const skillGroups = [
  {
    category: 'Languages',
    color: '#00d4ff',
    skills: ['C++', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    category: 'Frontend',
    color: '#7c3aed',
    skills: ['React.js', 'HTML/CSS', 'Socket.IO'],
  },
  {
    category: 'Backend',
    color: '#059669',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'WebSockets', 'BullMQ', 'Microservices'],
  },
  {
    category: 'Databases & Cache',
    color: '#f59e0b',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma ORM', 'SQLAlchemy'],
  },
  {
    category: 'ML / AI',
    color: '#ec4899',
    skills: ['NumPy', 'Pandas', 'Scikit-learn', 'XGBoost', 'TensorFlow', 'Keras', 'Sentence Transformers', 'LLM APIs'],
  },
  {
    category: 'DevOps & Tools',
    color: '#f97316',
    skills: ['Docker', 'Docker Compose', 'Git', 'Postman'],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="py-20 bg-[#111118]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00d4ff] font-mono text-sm tracking-widest uppercase">What I work with</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            Tech <span className="text-[#00d4ff]">Stack</span>
          </h2>
        </motion.div>

        <div className="space-y-10">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                <h3 className="text-sm font-semibold tracking-widest uppercase" style={{ color: group.color }}>
                  {group.category}
                </h3>
                <div className="flex-1 h-px bg-[#ffffff20]" />
              </div>

              <motion.div
                className="flex flex-wrap gap-3"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                {group.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={badgeVariants}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-default"
                    style={{
                      backgroundColor: `${group.color}28`,
                      border: `1px solid ${group.color}77`,
                      color: group.color,
                    }}
                    whileHover={{
                      backgroundColor: `${group.color}44`,
                      border: `1px solid ${group.color}bb`,
                      scale: 1.05,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
