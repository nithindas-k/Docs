import * as React from "react";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "./button";

export interface Profile {
  id: string;
  label: string;
  icon: string | React.ReactNode;
  badge?: string;
}

interface ProfileSelectorProps {
  title?: string;
  profiles: Profile[];
  onProfileSelect: (id: string) => void;
  onProfileEdit?: (id: string) => void;
  onProfileDelete?: (id: string) => void;
  onAddProfile?: () => void;
  className?: string;
}

export const ProfileSelector = ({
  title = "Choose a person",
  profiles,
  onProfileSelect,
  onProfileEdit,
  onProfileDelete,
  onAddProfile,
  className,
}: ProfileSelectorProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center pt-8 pb-12 px-4",
        className
      )}
    >
      <div className="flex flex-col items-center w-full max-w-7xl">
        <h1 className="mb-10 text-2xl font-bold tracking-tight text-foreground md:text-4xl opacity-90">
          {title}
        </h1>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-5 animate-in fade-in zoom-in duration-500">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex flex-col items-center gap-3 group relative">
              <div className="relative">
                <button
                  onClick={() => onProfileSelect(profile.id)}
                  aria-label={`Select profile: ${profile.label}`}
                  className="group relative h-24 w-24 rounded-full transition-all duration-300 ease-out hover:scale-110 active:scale-95 focus:outline-none md:h-32 md:w-32 overflow-hidden border-4 border-transparent hover:border-primary/40 shadow-sm"
                >
                  <div className="absolute inset-0 bg-muted transition-all duration-300 group-hover:bg-muted/50"></div>
                  <div className="relative flex h-full w-full items-center justify-center">
                    {typeof profile.icon === 'string' ? (
                      <img
                        src={profile.icon}
                        alt={`${profile.label} profile`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      profile.icon
                    )}
                  </div>
                </button>

                {/* Badge (e.g. "Linked") */}
                {profile.badge && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm z-10">
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary leading-none">
                      {profile.badge}
                    </p>
                  </div>
                )}

                {/* Management Toolbar - Appears on Hover */}
                {(onProfileEdit || onProfileDelete) && (
                  <div className="absolute -top-1 -right-1 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 z-10">
                    {onProfileEdit && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 rounded-full shadow-md border border-border bg-background hover:bg-primary hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProfileEdit(profile.id);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                    {onProfileDelete && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 rounded-full shadow-md border border-border bg-background hover:text-destructive transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProfileDelete(profile.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              <p className="text-base font-bold text-muted-foreground transition-all group-hover:text-foreground tracking-tight lowercase first-letter:uppercase">
                {profile.label}
              </p>
            </div>
          ))}

          {/* Add Profile Button */}
          {onAddProfile && (
            <div className="flex flex-col items-center gap-3 group">
              <button
                onClick={onAddProfile}
                className="group relative h-24 w-24 rounded-full border-4 border-dashed border-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-2 flex items-center justify-center md:h-32 md:w-32"
              >
                <Plus className="h-10 w-10 text-muted-foreground transition-all group-hover:text-primary group-hover:scale-110" />
              </button>
              <p className="text-base font-bold text-muted-foreground transition-all group-hover:text-foreground tracking-tight">
                Add Profile
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProfileIcon = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex h-full w-full items-center justify-center text-4xl text-foreground/80 md:text-5xl",
      className
    )}
  >
    {children}
  </div>
);
