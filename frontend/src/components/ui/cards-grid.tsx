import * as React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="group relative">
          <MotionLink
            to={item.href}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="block h-full"
          >
            <div className="flex h-full flex-col justify-between rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {item.iconSrc ? (
                      <img src={item.iconSrc} alt={`${item.title} icon`} className="h-10 w-10 object-contain" />
                    ) : item.icon ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                    ) : null}
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {item.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </MotionLink>
          {item.actions && (
            <div className="absolute top-4 right-10 z-10">
              {item.actions}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};
