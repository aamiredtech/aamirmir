import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link to="/" className="font-cabinet font-black text-2xl tracking-tighter">
              AAMIR<span className="text-primary">MIR</span>
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
            <h4 className="font-cabinet font-bold text-sm mb-4">Admin</h4>
            <Link
              to="/admin/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-satoshi"
              data-testid="footer-admin-link"
            >
              Admin Panel
            </Link>
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
