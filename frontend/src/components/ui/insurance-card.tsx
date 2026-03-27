import { motion } from "framer-motion"
import { Clock, ArrowLeft } from "lucide-react"

import { cn } from "../../lib/utils" 
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { Card, CardHeader } from "./card"

interface ProfileHeaderCardProps {
  clientName: string;
  expireDate: string;
  expireDuration: string;
  avatarSrc?: string;
  onBack?: () => void;
  className?: string;
}

export const ProfileHeaderCard = ({
  clientName,
  expireDate,
  expireDuration,
  avatarSrc,
  onBack,
  className,
}: ProfileHeaderCardProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      <Card className="w-full rounded-2xl shadow-sm border-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10 transition-colors sm:hidden">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-20 w-20 sm:h-16 sm:w-16 border-2 border-background shadow-md">
                    <AvatarImage src={avatarSrc} alt={clientName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">{clientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="w-10 sm:hidden" /> {/* Spacer for symmetry on mobile */}
              </div>
              
              <div className="flex flex-col items-center sm:items-start">
                <div className="hidden sm:flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10 transition-colors h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="h-4 w-px bg-border mx-1" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Expiry: {expireDate}</span>
                    </div>
                </div>
                <div className="sm:hidden flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px] font-medium uppercase tracking-widest leading-none">Protection Active</span>
                </div>
                <h1 className="text-3xl sm:text-2xl font-black tracking-tighter text-foreground sm:hidden uppercase">
                    {clientName}
                </h1>
                <div className="hidden sm:block">
                   <span className="text-xs text-muted-foreground font-medium">Locker Active until {expireDate} ({expireDuration})</span>
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0">
                <h2 className="hidden sm:block text-2xl font-black tracking-tighter text-foreground uppercase">{clientName}</h2>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.3em]">Secure Member Identity</p>
                <div className="sm:hidden mt-2 flex justify-center gap-2 text-[10px] font-bold text-primary/60">
                    <span>VAULT ID: #LL-{Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};
