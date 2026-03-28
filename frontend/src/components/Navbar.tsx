import { Menu, Search, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Theme } from './ui/theme';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Logo } from './ui/Logo';

interface NavbarProps {
  setIsOpen: (open: boolean) => void;
  user: any;
  onLogout: () => void;
}

export function Navbar({ setIsOpen, user, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-6 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex lg:hidden items-center gap-2 font-bold text-lg text-primary font-mono tracking-tight shrink-0 mr-auto">
        <Logo className="h-9 w-9 text-primary shrink-0" />
        Docs
      </div>

      <div className="flex-1">
        <div className="relative max-w-sm hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="w-full bg-muted/40 pl-10 border-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center">
          <Theme variant="tabs" size="sm" />
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <Avatar className="h-10 w-10 border border-primary/20 shadow-sm transition-all hover:scale-105 cursor-pointer">
            <AvatarImage src={user?.picture} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onLogout} 
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
