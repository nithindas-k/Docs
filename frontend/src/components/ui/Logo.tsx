
interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <svg 
        viewBox="0 0 400 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full"
      >
        {/* Sketchy Book Outline */}
        <path 
          d="M100 80 C80 80, 70 90, 70 110 V290 C70 310, 80 320, 100 320 H280 C300 320, 310 310, 310 290 V110 C310 90, 300 80, 280 80 H100" 
          stroke="currentColor" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-primary"
        />
        
        {/* Sketchy Spine Detail */}
        <path 
          d="M310 80 L325 95 V305 L310 320" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          className="text-primary/70"
        />
        <path 
          d="M325 95 L340 110 V320 L325 305" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinecap="round" 
          className="text-primary/40"
        />

        {/* DOCS Text in Sketchy Style */}
        <g className="text-primary" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
          {/* D */}
          <path d="M110 120 V160 H125 C135 160, 140 155, 140 140 V140 C140 125, 135 120, 125 120 H110 Z" />
          {/* O */}
          <ellipse cx="170" cy="140" rx="15" ry="20" />
          {/* C */}
          <path d="M225 125 C215 120, 205 120, 200 130 V150 C205 160, 215 160, 225 155" />
          {/* S */}
          <path d="M260 125 C250 120, 240 125, 240 135 C240 145, 260 140, 260 150 C260 160, 250 160, 240 155" />
        </g>

        {/* Separator Line */}
        <path 
          d="M110 185 H270" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round" 
          className="text-primary/60"
        />

        {/* Hand-drawn Content Lines */}
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-primary/50">
          <path d="M110 215 H250" />
          <path d="M110 240 H270" />
          <path d="M110 265 H230" />
          <path d="M110 290 H260" />
        </g>

        {/* Extra Sketchy Shading lines on the side */}
        <path d="M315 120 L325 130" stroke="currentColor" strokeWidth="4" className="text-primary/30" />
        <path d="M315 160 L325 170" stroke="currentColor" strokeWidth="4" className="text-primary/30" />
        <path d="M315 200 L325 210" stroke="currentColor" strokeWidth="4" className="text-primary/30" />
        <path d="M315 240 L325 250" stroke="currentColor" strokeWidth="4" className="text-primary/30" />
        <path d="M315 280 L325 290" stroke="currentColor" strokeWidth="4" className="text-primary/30" />
      </svg>
    </div>
  );
}
