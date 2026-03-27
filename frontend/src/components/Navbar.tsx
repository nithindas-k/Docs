import { Menu, Search, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Theme } from './ui/theme';
import { Input } from './ui/input';

interface NavbarProps {
  setIsOpen: (open: boolean) => void;
  user: any;
  onLogout: () => void;
}

export function Navbar({ setIsOpen, user, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex-1">
        <div className="relative max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="w-full bg-accent/50 pl-9 border-none focus-visible:ring-primary rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Theme variant="tabs" size="sm" />
        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-sm font-medium">{user?.name || 'User'}</div>
            <div className="text-xs text-muted-foreground">{user?.email || ''}</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 cursor-pointer">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
