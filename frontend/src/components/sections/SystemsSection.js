import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';

const SYSTEMS_IMG = "https://static.prod-images.emergentagent.com/jobs/7605d654-b47b-47c2-a24c-a2e854ea0b48/images/f45000984ab9bd99eaeccec01b835def743d32e21c46314a564fc3154729316a.png";

export default function SystemsSection() {
  const { content } = useContent();
  const systems = content?.systems_thinking || {};

  const steps = systems.steps || [
    { number: '01', title: 'Strategy', description: 'Define the objective, the market position, and the growth levers.' },
    { number: '02', title: 'Systems', description: 'Architect the processes, tools, and workflows that make strategy executable.' },
    { number: '03', title: 'Execution', description: 'Deploy with clear ownership, accountability, and feedback loops.' },
    { number: '04', title: 'Scale', description: 'Optimize, automate, and expand what works. Remove what doesn\'t.' },
  ];

  return (
    <section id="systems" data-testid="systems-section" className="py-24 sm:py-32 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={SYSTEMS_IMG} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">
            {systems.overline || 'SYSTEMS THINKING'}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none font-bold font-cabinet" data-testid="systems-heading">
            {systems.heading || 'Strategy is worthless without systems. Systems are useless without execution.'}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="border border-border p-8 relative group hover:bg-primary/5 transition-colors"
              data-testid={`system-step-${i}`}
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-background border border-border flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">&rarr;</span>
                </div>
              )}
              <span className="text-5xl font-black font-cabinet text-primary/60 group-hover:text-primary transition-colors">
                {step.number}
              </span>
              <h3 className="text-xl sm:text-2xl tracking-tight font-bold font-cabinet mt-4 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground font-satoshi leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 border-l-2 border-primary pl-6"
        >
          <p className="text-lg sm:text-xl font-cabinet font-bold italic text-foreground" data-testid="systems-quote">
            "{systems.quote || "I don't just advise \u2014 I build systems that execute."}"
          </p>
          <p className="text-sm text-muted-foreground font-satoshi mt-2">&mdash; Aamir Mir</p>
        </motion.div>
      </div>
    </section>
  );
}
