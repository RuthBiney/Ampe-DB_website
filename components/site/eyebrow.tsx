import * as React from "react"
import { cn } from "@/lib/utils"

// Eyebrow: 13px / 1.4, letter-spacing .08em, uppercase, 600, brand-700.
// The small variant (panel labels) is 12px with the same treatment, in
// brand-700 or neutral-700.
export function Eyebrow({
  size = "default",
  tone = "brand",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  size?: "default" | "sm"
  tone?: "brand" | "neutral"
}) {
  return (
    <span
      className={cn(
        "font-semibold tracking-[.08em] uppercase",
        size === "default" ? "text-[13px] leading-[1.4]" : "text-[12px]",
        tone === "brand" ? "text-brand-700" : "text-neutral-700",
        className
      )}
      {...props}
    />
  )
}
