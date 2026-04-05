import { useContent } from '@/contexts/ContentContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const HERO_DARK = "https://static.prod-images.emergentagent.com/jobs/7605d654-b47b-47c2-a24c-a2e854ea0b48/images/681dbeb579f274b4205d742bc2d68df4459cc2ddeab998adcf1e599dbd2d6a47.png";
const HERO_LIGHT = "https://static.prod-images.emergentagent.com/jobs/7605d654-b47b-47c2-a24c-a2e854ea0b48/images/2258febc1ae9a877286441700eca82564ac28812a76bdde6adc85c78564a5d93.png";

export default function HeroSection() {
  const { content } = useContent();
  const { theme } = useTheme();
  const hero = content?.hero || {};

  const scrollToCta = () => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToServices = () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${theme === 'dark' ? HERO_DARK : HERO_LIGHT})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-6 font-satoshi" data-testid="hero-overline">
            {hero.overline || 'EXECUTION & CAPABILITY ARCHITECT'}
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-none font-black font-cabinet mb-6" data-testid="hero-heading">
            {hero.heading || 'I build systems that turn strategy into measurable outcomes.'}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-satoshi leading-relaxed max-w-2xl mb-10" data-testid="hero-subheading">
            {hero.subheading || 'Business Strategy. AdTech. Automation. Capability Building. 12+ years of building execution systems across APAC & Middle East.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              data-testid="hero-book-call-btn"
              onClick={scrollToCta}
              className="bg-primary text-primary-foreground hover:opacity-90 rounded-none h-12 px-8 text-sm font-satoshi flex items-center gap-2"
            >
              {hero.cta_primary || 'Book Strategy Call'}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              data-testid="hero-audit-btn"
              variant="outline"
              onClick={scrollToServices}
              className="border-foreground/20 hover:bg-foreground/5 rounded-none h-12 px-8 text-sm font-satoshi flex items-center gap-2"
            >
              {hero.cta_secondary || 'Request Audit'}
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
        >
          {(content?.companies || [
            { name: 'Simplilearn' }, { name: 'EC-Council' }, { name: 'IAL Learning' },
            { name: 'KOViD Group' }, { name: 'IBM' }, { name: 'Standard Chartered' }
          ]).map((c, i) => (
            <div key={i} className="border border-border/50 px-4 py-3 text-center" data-testid={`company-badge-${i}`}>
              <span className="text-xs font-satoshi text-muted-foreground tracking-wide uppercase">{c.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
