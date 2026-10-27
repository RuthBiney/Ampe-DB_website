import * as React from "react"
import { cn } from "@/lib/utils"

// Legend swatch: a 10–11px square and a 13px neutral-800 label.
export function LegendSwatch({
  swatchClassName,
  size = 11,
  children,
}: {
  swatchClassName: string // a background utility, e.g. "bg-brand"
  size?: 10 | 11
  children: React.ReactNode
}) {
  return (
    <span className={cn("inline-flex items-center", size === 11 ? "gap-[7px]" : "gap-2")}>
      <span
        aria-hidden="true"
        className={cn(size === 11 ? "size-[11px]" : "size-2.5", swatchClassName)}
      />
      {children}
    </span>
  )
}

export function Legend({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-neutral-800", className)}
      {...props}
    />
  )
}
