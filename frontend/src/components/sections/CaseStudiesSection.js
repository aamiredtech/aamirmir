import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';

export default function CaseStudiesSection() {
  const { content } = useContent();
  const caseStudies = content?.case_studies || [];

  const defaultCases = [
    { title: 'EdTech Growth Engine', client: 'Leading EdTech Platform', metric: '+240%', metric_label: 'Revenue Growth', description: 'Built an end-to-end performance marketing system that transformed scattered campaigns into a predictable growth engine.', tags: ['AdTech', 'Strategy', 'Automation'] },
    { title: 'Enterprise Delivery Transformation', client: 'Global Financial Services', metric: '40%', metric_label: 'Faster Delivery', description: 'Redesigned the operating model and delivery governance for a 200+ person technology team across 3 countries.', tags: ['Execution', 'Strategy'] },
    { title: 'Automation-First Sales System', client: 'B2B SaaS Company', metric: '3x', metric_label: 'Lead Conversion', description: 'Designed and deployed automated funnel systems that tripled conversion rates while reducing manual effort by 60%.', tags: ['Automation', 'Strategy'] },
  ];

  const items = caseStudies.length > 0 ? caseStudies : defaultCases;

  return (
    <section id="case-studies" data-testid="case-studies-section" className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">CASE STUDIES</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none font-bold font-cabinet max-w-2xl" data-testid="case-studies-heading">
            Real systems. Measurable outcomes.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
          {items.map((cs, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="border-b md:border-r border-border p-8 hover:bg-primary/5 transition-colors group"
              data-testid={`case-study-card-${i}`}
            >
              <div className="mb-6">
                <p className="text-5xl sm:text-6xl font-black font-cabinet text-primary tracking-tighter">
                  {cs.metric}
                </p>
                <p className="text-sm text-muted-foreground font-satoshi mt-1">{cs.metric_label}</p>
              </div>

              <h3 className="text-xl sm:text-2xl tracking-tight font-bold font-cabinet mb-2">
                {cs.title}
              </h3>
              <p className="text-xs text-muted-foreground font-satoshi mb-4">{cs.client}</p>
              <p className="text-sm text-muted-foreground font-satoshi leading-relaxed mb-6">
                {cs.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {(cs.tags || []).map((tag, j) => (
                  <span
                    key={j}
                    className="text-xs px-3 py-1 border border-border font-satoshi text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
