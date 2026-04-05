import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, Users, Mail, Settings, LogOut, Sun, Moon, ChevronRight } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Blog Posts', path: '/admin/blog', icon: FileText },
    { label: 'Leads', path: '/admin/leads', icon: Users },
    { label: 'Subscribers', path: '/admin/subscribers', icon: Mail },
    { label: 'Content', path: '/admin/content', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex" data-testid="admin-layout">
      <aside className="w-64 border-r border-border flex flex-col h-screen sticky top-0" data-testid="admin-sidebar">
        <div className="p-6 border-b border-border">
          <Link to="/" className="text-lg tracking-wide" style={{ fontFamily: "'Gadey', sans-serif" }}>
            Aamir <span className="text-primary">Mir</span>
          </Link>
          <p className="text-xs text-muted-foreground font-satoshi mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-satoshi transition-colors ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              data-testid={`admin-nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {isActive(item.path) && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            {user.picture ? (
              <img src={user.picture} alt="" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {user.name?.[0] || 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-satoshi font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground font-satoshi truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border"
              data-testid="admin-theme-toggle"
            >
              {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors border border-border"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
