import * as React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ResourceCardItem {
  iconSrc?: string;
  icon?: React.ReactNode;
  title: string;
  lastUpdated: string;
  href: string;
  actions?: React.ReactNode;
}

interface ResourceCardsGridProps {
  items: ResourceCardItem[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const MotionLink = motion.create(Link);

export const ResourceCardsGrid = ({ items, className }: ResourceCardsGridProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {items.map((item, index) => (
        <MotionLink
          key={index}
          to={item.href}
          variants={itemVariants}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="group relative block w-full outline-none"
        >
          <div className="relative h-full rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <div className="h-full w-full rounded-xl overflow-hidden bg-accent/30 border border-border flex items-center justify-center">
                    {item.iconSrc ? (
                      <img 
                        src={item.iconSrc} 
                        alt={item.title} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="text-primary">{item.icon || <ShieldCheck className="h-6 w-6" />}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="font-bold text-lg tracking-tight text-foreground truncate leading-tight">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
                    {item.lastUpdated}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 {item.actions && (
                    <div className="z-20 relative">{item.actions}</div>
                 )}
                 <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </MotionLink>
      ))}
    </motion.div>
  );
};
