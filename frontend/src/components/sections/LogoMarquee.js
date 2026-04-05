import Marquee from 'react-fast-marquee';
import { useTheme } from '@/contexts/ThemeContext';

const CLIENTS = [
  'IBM', 'Standard Chartered', 'Simplilearn', 'EC-Council',
  'EdTech Leaders', 'SaaS Ventures', 'Global Enterprises', 'Growth Founders',
  'Digital Operators', 'Scale Studios',
];

export default function LogoMarquee() {
  const { theme } = useTheme();

  return (
    <section data-testid="logo-marquee-section" className="py-12 border-t border-b border-border overflow-hidden">
      <Marquee
        speed={40}
        gradient={true}
        gradientColor={theme === 'dark' ? '#050505' : '#FAFAFA'}
        gradientWidth={80}
        pauseOnHover={true}
      >
        {CLIENTS.map((client, i) => (
          <div
            key={i}
            className="mx-10 flex items-center gap-3 group"
            data-testid={`marquee-client-${i}`}
          >
            <div className="w-2 h-2 bg-primary/40 group-hover:bg-primary transition-colors" />
            <span className="text-sm sm:text-base font-cabinet font-bold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
              {client}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
