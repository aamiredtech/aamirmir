import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const STATS = [
  { value: '100+', label: 'Clients Served', sublabel: 'Across APAC & Middle East' },
  { value: '100K+', label: 'CertScope Academy', sublabel: 'Learners & professionals' },
  { value: '500', label: 'Mentors On Board', sublabel: 'Industry practitioners' },
  { value: '50+', label: 'Certification Courses', sublabel: 'Via CertScope' },
];

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="relative p-8 sm:p-10 border-r border-b border-border last:border-r-0 group hover:bg-primary/5 transition-colors"
      data-testid={`impact-stat-${index}`}
    >
      <div className="absolute top-4 right-4 w-8 h-8 border border-primary/20 group-hover:border-primary/50 transition-colors flex items-center justify-center">
        <span className="text-xs font-cabinet font-bold text-primary/40 group-hover:text-primary transition-colors">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <p className="text-4xl sm:text-5xl lg:text-6xl font-black font-cabinet text-primary tracking-tighter leading-none">
        {inView ? stat.value : '0'}
      </p>
      <p className="text-base sm:text-lg font-cabinet font-bold text-foreground mt-3 tracking-tight">
        {stat.label}
      </p>
      <p className="text-xs sm:text-sm text-muted-foreground font-satoshi mt-1">
        {stat.sublabel}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section id="impact" data-testid="stats-section" className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">IMPACT</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none font-bold font-cabinet" data-testid="stats-heading">
              Numbers that speak for the systems.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-satoshi max-w-sm">
            Across enterprise consulting, CertScope, and capability building — real outcomes, measured and delivered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border">
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
