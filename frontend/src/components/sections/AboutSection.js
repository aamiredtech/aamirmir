import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useRef } from 'react';

const PORTRAIT = "https://images.unsplash.com/photo-1685375421073-4dae366f8e84?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwyfHxleGVjdXRpdmUlMjBvcGVyYXRvciUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzc1NDA5ODA1fDA&ixlib=rb-4.1.0&q=85";

function AnimatedCounter({ value, label }) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} className="text-center sm:text-left">
      <p className="text-3xl sm:text-4xl font-black font-cabinet text-primary tracking-tighter">
        {inView ? value : '0'}
      </p>
      <p className="text-xs sm:text-sm text-muted-foreground font-satoshi mt-1">{label}</p>
    </div>
  );
}

export default function AboutSection() {
  const { content } = useContent();
  const about = content?.about || {};

  const paragraphs = about.paragraphs || [
    "I've spent 12+ years inside the machine\u2014not advising from the outside.",
    "Today, through Aamir Mir Consulting and CertScope Labs, I help business owners build the systems that actually drive growth.",
    "My approach is simple: Strategy without execution is a hobby. I build systems that execute."
  ];

  const stats = about.stats || [
    { value: '12+', label: 'Years of Enterprise Execution' },
    { value: '50+', label: 'Systems Built & Deployed' },
    { value: '6', label: 'Countries Operated In' },
    { value: '100M+', label: 'Revenue Influenced' }
  ];

  return (
    <section id="about" data-testid="about-section" className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <div className="relative aspect-[3/4] overflow-hidden border border-border">
              <img
                src={PORTRAIT}
                alt="Aamir Mir"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                data-testid="about-portrait"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-satoshi">Aamir Mir</p>
                <p className="text-white/60 text-xs font-satoshi">Execution & Capability Architect</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7"
          >
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">
              {about.overline || 'ABOUT'}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none font-bold font-cabinet mb-8" data-testid="about-heading">
              {about.heading || 'Operator. Execution Leader. Capability Architect.'}
            </h2>

            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-muted-foreground font-satoshi" data-testid={`about-paragraph-${i}`}>
                  {p}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-border">
              {stats.map((stat, i) => (
                <AnimatedCounter key={i} value={stat.value} label={stat.label} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
