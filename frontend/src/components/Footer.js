import { Link } from 'react-router-dom';
import { Linkedin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link to="/" className="group text-2xl tracking-[0.15em] uppercase font-cabinet font-black">
              <span className="text-foreground group-hover:text-primary transition-colors duration-300">AAMIR</span>
              {' '}
              <span className="text-primary group-hover:text-foreground transition-colors duration-300">MIR</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground font-satoshi leading-relaxed max-w-sm">
              Execution & Capability Architect. Building systems that turn strategy into measurable outcomes for business owners, coaches, and executives globally.
            </p>
            <p className="mt-6 text-xs text-muted-foreground font-satoshi">
              Aamir Mir Consulting / CertScope
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-cabinet font-bold text-sm mb-4">Services</h4>
            <div className="flex flex-col gap-2">
              {['Business Strategy', 'AdTech Systems', 'Automation', 'Capability Building', 'Delivery Transformation'].map((s) => (
                <button
                  key={s}
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors font-satoshi"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-cabinet font-bold text-sm mb-4">Navigate</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'About', id: 'about' },
                { label: 'Case Studies', id: 'case-studies' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', id: 'cta' },
              ].map((item) => (
                item.href ? (
                  <Link key={item.label} to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-satoshi">
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors font-satoshi"
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-cabinet font-bold text-sm mb-4">Connect</h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://www.linkedin.com/in/miraamir/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="footer-linkedin-personal"
              >
                <Linkedin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm font-satoshi leading-snug">Connect with me on LinkedIn</span>
              </a>

              <a
                href="https://www.linkedin.com/company/certscope/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="footer-linkedin-certscope"
              >
                <Linkedin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm font-satoshi leading-snug">Follow CertScope on LinkedIn</span>
              </a>

              <a
                href="https://www.certscope.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="footer-certscope-website"
              >
                <ExternalLink className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm font-satoshi leading-snug">Explore CertScope Academy</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-satoshi">
            &copy; {new Date().getFullYear()} Aamir Mir Consulting. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-satoshi">
            Strategy. Execution. Automation.
          </p>
        </div>
      </div>
    </footer>
  );
}
