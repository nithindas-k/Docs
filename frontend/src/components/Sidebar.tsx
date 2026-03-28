import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { CreditCard, Car, FileText, Landmark, GraduationCap, UserCheck, Book, Plus, LayoutDashboard, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Theme } from './ui/theme';

const STYLED_ICONS: Record<string, ReactNode> = {
  'credit-card': <CreditCard className="w-5 h-5" />,
  'car': <Car className="w-5 h-5" />,
  'file-text': <FileText className="w-5 h-5" />,
  'landmark': <Landmark className="w-5 h-5" />,
  'graduation-cap': <GraduationCap className="w-5 h-5" />,
  'user-check': <UserCheck className="w-5 h-5" />,
  'book': <Book className="w-5 h-5" />,
};

interface SidebarProps {
  categories: any[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ categories, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card shadow-lg transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary font-mono tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">D</div>
            Docs
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Menu</div>
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-muted-foreground"
                )
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </NavLink>
            <NavLink
              to="/persons"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-muted-foreground"
                )
              }
            >
              <Users className="w-5 h-5" />
              Family Profiles
            </NavLink>
          </nav>

          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mt-4">Categories</div>
          <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
            {categories?.map((cat) => (
              <NavLink
                key={cat._id}
                to={`/category/${cat._id}`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-muted-foreground"
                  )
                }
              >
                {STYLED_ICONS[cat.icon] || <FileText className="w-5 h-5" />}
                {cat.name}
              </NavLink>
            ))}

            <Button 
              variant="ghost" 
              className="mt-2 w-full justify-start gap-3 border border-dashed border-border" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t lg:hidden">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">Theme</div>
          <Theme variant="tabs" size="sm" className="w-full" />
        </div>
      </aside>
    </>
  );
}
