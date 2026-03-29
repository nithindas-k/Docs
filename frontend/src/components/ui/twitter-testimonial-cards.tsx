"use client";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface TestimonialCardProps {
  className?: string;
  avatar?: string;
  username?: string;
  handle?: string;
  verified?: boolean;
}

function VerifiedBadge() {
  return (
    <svg
      className="size-4 text-[#1d9bf0]"
      viewBox="0 0 22 22"
      fill="currentColor"
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

interface TestimonialsProps {
  cards?: TestimonialCardProps[];
}

export function Testimonials({ cards }: TestimonialsProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden shadow-sm animate-in fade-in duration-700">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Vault Member</TableHead>
            <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Role & Access</TableHead>
            <TableHead className="py-4 px-6 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card, index) => (
            <TableRow 
              key={index} 
              className="group border-border/30 hover:bg-primary/[0.03] transition-colors"
            >
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {card.avatar ? (
                      <img src={card.avatar} alt={card.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground text-sm">{card.username}</span>
                      {card.verified && <VerifiedBadge />}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4 px-6">
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.handle}
                </span>
              </TableCell>
              <TableCell className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                   <div className={cn(
                     "size-1.5 rounded-full animate-pulse",
                     card.verified ? "bg-blue-400" : "bg-emerald-400"
                   )} />
                   <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">
                     Active
                   </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
