import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { loginSuccess } from '../features/authSlice';
import { Button } from '../components/ui/button';
import { Navigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../constants';
import { toast } from 'sonner';
import { Logo } from '../components/ui/Logo';

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
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-primary/10 mb-4 border-2 border-primary/5 shadow-sm transition-all duration-700 hover:scale-105">
            <Logo className="h-32 w-32 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Docs</h1>
          <p className="pt-1 text-sm text-muted-foreground">
            Your secure digital ID and document locker.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            className="h-12 w-full text-base font-medium shadow-sm transition-all hover:scale-[1.02] bg-primary hover:bg-primary/90 text-primary-foreground" 
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
          <div className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
