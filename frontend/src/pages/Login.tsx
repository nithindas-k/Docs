import { useAppDispatch, useAppSelector } from '../features/hooks';
import { loginSuccess } from '../features/authSlice';
import { Button } from '../components/ui/button';
import { Navigate } from 'react-router-dom';
import { DEMO_TOKEN } from '../constants';

export function Login() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  if (token) return <Navigate to="/" />;

  const handleMockLogin = () => {
    // In a real app, integrate Google Auth here
    dispatch(loginSuccess({
      user: { _id: 'demo-user-id', name: 'Demo User', email: 'demo@example.com' },
      token: DEMO_TOKEN
    }));
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-mono text-2xl font-bold text-primary-foreground">
            L
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">DB Locker</h1>
          <p className="pt-1 text-sm text-muted-foreground">
            Your secure digital ID and document locker.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            className="h-12 w-full text-base font-medium shadow-sm transition-all hover:scale-[1.02]" 
            onClick={handleMockLogin}
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
