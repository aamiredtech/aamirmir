import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  {
    number: '01',
    title: 'Diagnose',
    tagline: 'Understand before building.',
    description: 'I start by mapping your current systems, bottlenecks, and growth levers. No assumptions. Every engagement begins with a deep diagnostic — understanding how strategy flows through your organisation, where execution breaks down, and what systems are missing.',
    output: 'Diagnostic report, bottleneck map, and a prioritised execution roadmap.',
  },
  {
    number: '02',
    title: 'Architect',
    tagline: 'Design systems that run without you.',
    description: 'Based on the diagnosis, I architect the systems — whether it\'s a performance marketing engine, an automated funnel, a capability framework, or a delivery governance model. Every system is designed to execute independently, not depend on constant oversight.',
    output: 'Execution-ready system blueprints, automation workflows, and team alignment frameworks.',
  },
  {
    number: '03',
    title: 'Deploy & Scale',
    tagline: 'Build it. Run it. Scale it.',
    description: 'I don\'t hand over a deck and walk away. I build the systems inside your organisation, activate your team to run them, and set up the feedback loops for continuous optimisation. The goal: you scale without needing me.',
    output: 'Live systems, trained teams, measurable outcomes, and a scaling playbook.',
  },
];

export default function HowWeWorkSection() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="how-we-work" data-testid="how-we-work-section" className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">HOW I WORK</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none font-bold font-cabinet max-w-2xl" data-testid="how-we-work-heading">
            Three stages from diagnosis to scale.
          </h2>
          <p className="text-base text-muted-foreground font-satoshi mt-4 max-w-xl leading-relaxed">
            Every engagement follows a structured path. I measure before I build. I architect before I deploy. I scale only what works.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Stage tabs */}
          <div className="md:col-span-4 border border-border" data-testid="how-we-work-tabs">
            {STAGES.map((stage, i) => (
              <button
                key={i}
                onClick={() => setActiveStage(i)}
                className={`w-full text-left p-6 border-b border-border last:border-b-0 transition-all duration-300 group ${
                  activeStage === i ? 'bg-primary/10' : 'hover:bg-muted/30'
                }`}
                data-testid={`how-stage-tab-${i}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-3xl font-black font-cabinet transition-colors duration-300 ${
                    activeStage === i ? 'text-primary' : 'text-primary/30'
                  }`}>
                    {stage.number}
                  </span>
                  <div>
                    <p className={`text-lg font-cabinet font-bold tracking-tight transition-colors duration-300 ${
                      activeStage === i ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {stage.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-satoshi mt-0.5">
                      {stage.tagline}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Stage content */}
          <div className="md:col-span-8 border border-border md:border-l-0 p-8 sm:p-10 flex flex-col justify-center min-h-[320px]" data-testid="how-we-work-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-5xl sm:text-6xl font-black font-cabinet text-primary/20">
                    {STAGES[activeStage].number}
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-cabinet font-bold tracking-tight">
                      {STAGES[activeStage].title}
                    </h3>
                    <p className="text-sm text-primary font-satoshi font-medium">
                      {STAGES[activeStage].tagline}
                    </p>
                  </div>
                </div>

                <p className="text-base text-muted-foreground font-satoshi leading-relaxed mb-8" data-testid="how-stage-description">
                  {STAGES[activeStage].description}
                </p>

                <div className="border-l-2 border-primary pl-4">
                  <p className="text-xs tracking-[0.15em] uppercase font-bold text-primary mb-1 font-satoshi">Output</p>
                  <p className="text-sm text-foreground font-satoshi font-medium leading-relaxed">
                    {STAGES[activeStage].output}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
