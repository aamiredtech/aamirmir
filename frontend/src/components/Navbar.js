import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Case Studies', href: '/#case-studies' },
    { label: 'Blog', href: '/blog' },
  ];

  const isHome = location.pathname === '/';

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      if (!isHome) {
        window.location.href = href;
      } else {
        const el = document.getElementById(href.replace('/#', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      data-testid="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 dark:border-white/10"
      style={{ background: theme === 'dark' ? 'rgba(5,5,5,0.8)' : 'rgba(250,250,250,0.8)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl tracking-wide" data-testid="nav-logo" style={{ fontFamily: "'Gadey', sans-serif" }}>
          Aamir <span className="text-primary">Mir</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href.startsWith('/#') ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-satoshi text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-satoshi text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Button
            data-testid="nav-book-call-btn"
            onClick={() => {
              const el = document.getElementById('cta');
              el?.scrollIntoView({ behavior: 'smooth' });
              if (!isHome) window.location.href = '/#cta';
            }}
            className="hidden md:flex bg-primary text-primary-foreground hover:opacity-90 rounded-none text-sm h-9 px-5 font-satoshi"
          >
            Book Strategy Call
          </Button>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
            style={{ background: theme === 'dark' ? 'rgba(5,5,5,0.95)' : 'rgba(250,250,250,0.95)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                link.href.startsWith('/#') ? (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left text-sm font-satoshi text-muted-foreground hover:text-foreground py-2"
                    data-testid={`mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-satoshi text-muted-foreground hover:text-foreground py-2"
                    data-testid={`mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Button
                data-testid="mobile-book-call-btn"
                onClick={() => {
                  setMobileOpen(false);
                  const el = document.getElementById('cta');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-primary text-primary-foreground hover:opacity-90 rounded-none text-sm h-10 font-satoshi mt-2"
              >
                Book Strategy Call
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
