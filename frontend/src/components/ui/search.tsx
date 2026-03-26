import * as React from "react"
import { Search as SearchIcon } from "lucide-react"

import { cn } from "../../lib/utils"

export interface SearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <div className={cn("relative w-full", containerClassName)}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
)
Search.displayName = "Search"

export { Search }
