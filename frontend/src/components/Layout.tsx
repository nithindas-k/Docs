import { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { fetchCategories } from '../features/categorySlice';
import { fetchPersons } from '../features/personSlice';
import { logout, fetchProfile } from '../features/authSlice';
import Lenis from 'lenis';
import { Toaster } from 'sonner';
import { LogoutConfirmDialog } from './LogoutConfirmDialog';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [scrollRef.current]);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCategories());
      dispatch(fetchPersons());
    }
  }, [token, dispatch]);

  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar categories={categories} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-64">
        <Navbar setIsOpen={setIsSidebarOpen} user={user} onLogout={() => setIsLogoutDialogOpen(true)} />
        
        <main 
          ref={scrollRef}
          className="flex-1 overflow-hidden bg-accent/10 outline-none relative"
        >
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <LogoutConfirmDialog 
        open={isLogoutDialogOpen} 
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={() => {
          setIsLogoutDialogOpen(false);
          dispatch(logout());
        }}
      />
      <Toaster position="top-right" richColors />
    </div>
  );
}
