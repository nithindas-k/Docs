import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { LogOut } from 'lucide-react';

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <LogOut className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">Log Out?</DialogTitle>
          </div>

          <DialogDescription className="mt-3 text-sm leading-relaxed">
            Are you sure you want to log out of Your <span className="font-bold text-foreground">Docs</span>? You will need to sign in again to access your secure documents.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-4 sm:flex-row flex-col">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl flex-1 font-bold text-xs uppercase tracking-widest order-2 sm:order-1"
          >
            Stay Logged In
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="rounded-xl flex-1 font-bold text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 order-1 sm:order-2"
          >
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
