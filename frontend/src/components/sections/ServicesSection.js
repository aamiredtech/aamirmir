import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';

export default function ServicesSection() {
  const { content } = useContent();
  const services = content?.services || [];

  const defaultServices = [
    { number: '01', title: 'Business Strategy & Growth Consulting', problem: 'Growth stalls because strategy stays on slides.', system: 'Execution roadmaps with accountability loops and growth levers.', outcome: 'A repeatable growth system that turns strategy into quarterly results.' },
    { number: '02', title: 'AdTech & Performance Marketing Systems', problem: 'Ad spend increasing, ROI declining. Campaigns without systems.', system: 'End-to-end performance marketing architecture with real-time optimization.', outcome: 'Scalable ad systems that deliver predictable, measurable returns.' },
    { number: '03', title: 'Business Automation & Funnel Systems', problem: 'Manual processes bleeding time. Leads falling through cracks.', system: 'Automated lead capture, nurture sequences, CRM workflows.', outcome: 'A self-running funnel system that captures, nurtures, and converts 24/7.' },
    { number: '04', title: 'Capability Building & L&D', problem: 'Teams lack skills to execute modern strategies.', system: 'Custom capability programs built around actual gaps.', outcome: 'Teams that independently execute complex strategies.' },
    { number: '05', title: 'Execution & Delivery Transformation', problem: 'Projects consistently late, over budget, or misaligned.', system: 'Operating models, delivery frameworks, and governance structures.', outcome: 'Predictable delivery with clear ownership and reduced waste.' },
  ];

  const items = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" data-testid="services-section" className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">SERVICES</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none font-bold font-cabinet max-w-2xl" data-testid="services-heading">
            Systems that execute. Results that scale.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-border">
          {items.map((service, i) => {
            const isLarge = i < 2;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`${isLarge ? 'md:col-span-6' : 'md:col-span-4'} border-b md:border-r border-border p-8 hover:bg-primary/5 transition-colors group`}
                data-testid={`service-card-${i}`}
              >
                <span className="text-4xl font-black font-cabinet text-primary/50 group-hover:text-primary transition-colors">
                  {service.number}
                </span>
                <h3 className="text-xl sm:text-2xl tracking-tight font-bold font-cabinet mt-4 mb-6">
                  {service.title}
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase font-bold text-primary/70 mb-1 font-satoshi">Problem</p>
                    <p className="text-sm text-muted-foreground font-satoshi leading-relaxed">{service.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase font-bold text-primary/70 mb-1 font-satoshi">System</p>
                    <p className="text-sm text-muted-foreground font-satoshi leading-relaxed">{service.system}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase font-bold text-primary/70 mb-1 font-satoshi">Outcome</p>
                    <p className="text-sm text-foreground font-satoshi font-medium leading-relaxed">{service.outcome}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
