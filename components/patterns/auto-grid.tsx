import * as React from "react"
import { cn } from "@/lib/utils"

// The prototype's `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` columns:
// they collapse to one column on narrow screens without breakpoints.
export function AutoGrid({
  min,
  as: Comp = "div",
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  min: string
  as?: "div" | "ol" | "ul" | "section" | "dl"
}) {
  return (
    <Comp
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--grid-min)),1fr))]",
        className
      )}
      style={{ "--grid-min": min, ...style } as React.CSSProperties}
      {...props}
    />
  )
}
