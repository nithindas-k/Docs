import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { fetchCategories } from '../features/categorySlice';
import { logout } from '../features/authSlice';
import Lenis from 'lenis';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    // Lenis Smooth Scrolling Initialization
    const lenis = new Lenis({
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
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchCategories());
    }
  }, [token, dispatch]);

  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar categories={categories} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-64">
        <Navbar setIsOpen={setIsSidebarOpen} user={user} onLogout={() => dispatch(logout())} />
        
        <main className="flex-1 overflow-y-auto bg-accent/10 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
