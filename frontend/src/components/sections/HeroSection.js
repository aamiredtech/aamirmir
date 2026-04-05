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
          className="mt-24"
          data-testid="hero-credentials"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground font-satoshi">Track Record</span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-border/40">
            {/* CertScope — featured block */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-border/40 p-6 flex flex-col justify-center" data-testid="credential-certscope">
              <p className="text-xs tracking-[0.15em] uppercase font-bold text-primary mb-2 font-satoshi">Co-Founder</p>
              <p className="text-2xl font-black font-cabinet tracking-tighter">CertScope</p>
              <p className="text-xs text-muted-foreground font-satoshi mt-1.5 leading-relaxed">Certification intelligence & capability architecture</p>
            </div>

            {/* Enterprise logos — compact row */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4">
              {[
                { name: 'IBM', role: 'Enterprise Delivery' },
                { name: 'Standard Chartered', role: 'Operating Systems' },
                { name: 'Simplilearn', role: 'Growth & AdTech' },
                { name: 'EC-Council', role: 'Capability Building' },
              ].map((c, i) => (
                <div
                  key={i}
                  className="border-b sm:border-b-0 border-r border-border/40 last:border-r-0 p-5 flex flex-col justify-center group hover:bg-primary/5 transition-colors"
                  data-testid={`company-badge-${i}`}
                >
                  <p className="text-sm font-cabinet font-bold tracking-tight group-hover:text-primary transition-colors">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground font-satoshi mt-0.5 tracking-wide uppercase">{c.role}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
