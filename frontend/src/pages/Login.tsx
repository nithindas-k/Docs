import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { loginSuccess } from '../features/authSlice';
import { Button } from '../components/ui/button';
import { Navigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../constants';
import { toast } from 'sonner';
import { Logo } from '../components/ui/Logo';
import { Theme } from '../components/ui/theme';

export function Login() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (tokenParam && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        dispatch(loginSuccess({ user, token: tokenParam }));
        toast.success(`Welcome back, ${user.name}!`);
      } catch (e) {
        toast.error("Authentication failed");
      }
    }
  }, [searchParams, dispatch]);

  if (token) return <Navigate to="/" />;

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#fafafa] dark:bg-[#050505] px-4 relative">
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
         <Theme variant="tabs" size="sm" />
      </div>
      <div className="w-full max-w-[360px] space-y-8">
        {/* Branding */}
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-14 w-14 text-primary" />
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">DOCS</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              Secure Digital Vault
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-[2rem] border bg-card p-8 shadow-sm">
          <div className="space-y-8">
            <Button 
              onClick={handleGoogleLogin}
              variant="outline"
              className="relative h-12 w-full flex items-center justify-center gap-3 rounded-xl border-border bg-background hover:bg-muted font-semibold transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">
                <span className="bg-card px-3">End-to-End Encrypted</span>
              </div>
            </div>

            <p className="text-center text-[10px] font-medium text-muted-foreground/50 leading-relaxed px-2">
              By continuing, you agree to our Terms and Privacy Policy. 
              Your data is secured with AES-256 encryption.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
          Docs Security Suite
        </p>
      </div>
    </div>
  );
}
