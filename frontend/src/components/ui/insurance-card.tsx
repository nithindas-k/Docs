import * as React from "react"
import { ChevronLeft } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"

interface InsuranceCardProps {
  clientName: string;
  avatarSrc?: string;
  onBack: () => void;
  rightActions?: React.ReactNode;
  children?: React.ReactNode;
}

export function InsuranceCard({
  clientName,
  avatarSrc,
  onBack,
  rightActions,
  children
}: InsuranceCardProps) {
  return (
    <div className="w-full flex flex-col gap-10">
      {/* Dashboard Header - Balanced Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="hover:bg-accent -ml-2 h-9 w-9 p-0 rounded-full text-muted-foreground hover:text-foreground transition-all shrink-0 border"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-4 bg-muted/40 border p-2 pr-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarImage src={avatarSrc} alt={clientName} className="object-cover" />
              <AvatarFallback className="bg-primary/5 text-primary text-sm font-bold">
                {clientName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-foreground/90 leading-none">
                {clientName}
              </h1>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1.5 leading-none">
                Private Archive
              </span>
            </div>
          </div>
        </div>

        {/* The "Right Side" Layout Slot */}
        <div className="flex items-center gap-4">
          {rightActions}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
