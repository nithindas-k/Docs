import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shield, User, Car, Award } from "lucide-react";

export type AnimatedIDType = "aadhar" | "pan" | "driving" | "certificate";

export interface AnimatedIDCardProps {
  type: AnimatedIDType;
  className?: string;
  onClick?: () => void;
}

const variantClasses = {
  aadhar: "border-t-pink-500",
  pan: "border-t-blue-500",
  driving: "border-t-yellow-500",
  certificate: "border-t-purple-500",
};

export const AnimatedIDCard = ({
  type,
  className,
  onClick,
}: AnimatedIDCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cardRef = React.useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left - width / 2);
    mouseY.set(e.clientY - top - height / 2);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);

  const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const renderContent = () => {
    switch (type) {
      case "aadhar":
        return (
          <>
            <div className="flex items-center space-x-3 mb-3 border-b border-border pb-2 shrink-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-500">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-muted-foreground uppercase text-[8px] tracking-widest leading-tight">Government of India</span>
                <h3 className="text-sm font-bold text-card-foreground leading-tight">Aadhar Card</h3>
              </div>
            </div>
            <div className="flex gap-4 flex-1">
              <div className="w-16 h-20 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                <User className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center space-y-3 w-full">
                <div className="space-y-1">
                   <div className="text-[8px] font-bold text-muted-foreground uppercase text-left leading-none tracking-wider">Name</div>
                   <div className="h-2 w-full bg-muted rounded"></div>
                </div>
                <div className="space-y-1">
                   <div className="text-[8px] font-bold text-muted-foreground uppercase text-left leading-none tracking-wider">DOB</div>
                   <div className="h-2 w-1/2 bg-muted rounded"></div>
                </div>
              </div>
            </div>
            <div className="mt-auto border-t border-border pt-2 shrink-0 text-center">
              <span className="font-mono text-[16px] tracking-[0.2em] text-foreground font-bold leading-none">XXXX XXXX 1234</span>
            </div>
          </>
        );
      case "pan":
        return (
          <>
            <div className="flex items-center space-x-3 mb-3 border-b border-border pb-2 shrink-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <Award className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-muted-foreground uppercase text-[8px] tracking-widest leading-tight">Income Tax Department</span>
                <h3 className="text-sm font-bold text-card-foreground leading-tight">PAN Card</h3>
              </div>
            </div>
            <div className="flex gap-4 flex-1">
              <div className="flex flex-col justify-center space-y-3 w-full flex-1">
                <div className="space-y-1">
                   <div className="text-[8px] font-bold text-muted-foreground uppercase text-left leading-none tracking-wider">Name</div>
                   <div className="h-2 w-full bg-muted rounded"></div>
                </div>
                <div className="space-y-1">
                   <div className="text-[8px] font-bold text-muted-foreground uppercase text-left leading-none tracking-wider">Father's Name</div>
                   <div className="h-2 w-4/5 bg-muted rounded"></div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0">
                <div className="w-14 h-20 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                  <User className="h-6 w-6" />
                </div>
                <div className="mt-auto">
                   <span className="font-mono text-[10px] tracking-widest text-foreground font-bold">ABCDE1234F</span>
                </div>
              </div>
            </div>
          </>
        );
      case "driving":
        return (
          <>
            <div className="flex items-center space-x-3 mb-3 border-b border-border pb-2 shrink-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                <Car className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-muted-foreground uppercase text-[8px] tracking-widest leading-tight">Union of India</span>
                <h3 className="text-sm font-bold text-card-foreground leading-tight">Driving Licence</h3>
              </div>
            </div>
            <div className="flex gap-4 flex-1 items-center">
              <div className="w-14 h-20 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                <User className="h-6 w-6" />
              </div>
              <div className="space-y-2.5 w-full flex flex-col justify-center">
                <div className="flex justify-between items-end border-b border-border pb-1">
                   <span className="text-[8px] font-bold text-muted-foreground uppercase leading-none tracking-wider">DL No.</span>
                   <span className="font-mono text-[10px] tracking-[0.1em] text-foreground font-bold leading-none">MH01 202400123</span>
                </div>
                <div className="h-2 w-full bg-muted rounded mt-2"></div>
                <div className="h-2 w-2/3 bg-muted rounded"></div>
                <div className="flex gap-2 pt-1">
                  <span className="rounded bg-muted border border-border px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground uppercase leading-none">MCWG</span>
                  <span className="rounded bg-muted border border-border px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground uppercase leading-none">LMV</span>
                </div>
              </div>
            </div>
          </>
        );
      case "certificate":
      default:
        return (
          <>
            <div className="flex items-center space-x-3 mb-3 border-b border-border pb-2 shrink-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                <Award className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-muted-foreground uppercase text-[8px] tracking-widest leading-tight">Digital Vault</span>
                <h3 className="text-sm font-bold text-card-foreground leading-tight">Verified Document</h3>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-3 pt-1">
              <div className="h-2 w-3/4 bg-muted rounded mx-auto"></div>
              <div className="h-2 w-full bg-muted rounded"></div>
              <div className="h-2 w-5/6 bg-muted rounded mx-auto"></div>
              <div className="flex gap-4 justify-center w-full pt-3 border-t border-border mt-auto">
                 <div className="h-5 w-16 bg-muted rounded"></div>
                 <div className="h-5 w-16 bg-muted rounded"></div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative w-full h-full shrink-0 transform-gpu cursor-pointer overflow-hidden rounded-[1.5rem] bg-card p-4 md:p-5 transition-shadow duration-300 flex flex-col border border-border/50",
        "border-t-[4px]",
        variantClasses[type],
        className
      )}
    >
      <div style={{ transform: "translateZ(25px)" }} className="flex flex-col h-full w-full relative">
        {renderContent()}
      </div>
    </motion.div>
  );
};
