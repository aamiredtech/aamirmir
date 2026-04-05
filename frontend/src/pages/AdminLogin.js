import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" data-testid="admin-login-page">
      <div className="w-full max-w-sm p-8 border border-border">
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-3 font-satoshi">ADMIN ACCESS</p>
          <h1 className="text-2xl sm:text-3xl tracking-tight leading-none font-bold font-cabinet">
            Aamir Mir Consulting
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-satoshi">
            Sign in with Google to access the admin panel.
          </p>
        </div>
        <Button
          data-testid="admin-google-login-btn"
          onClick={login}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 font-satoshi rounded-none h-11 flex items-center justify-center gap-2"
        >
          Sign in with Google
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
