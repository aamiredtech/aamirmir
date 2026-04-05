import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import LogoMarquee from '@/components/sections/LogoMarquee';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import StatsSection from '@/components/sections/StatsSection';
import SystemsSection from '@/components/sections/SystemsSection';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';
import CTASection from '@/components/sections/CTASection';
import FAQSection from '@/components/sections/FAQSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      <Navbar />
      <HeroSection />
      <LogoMarquee />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <SystemsSection />
      <CaseStudiesSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
}
