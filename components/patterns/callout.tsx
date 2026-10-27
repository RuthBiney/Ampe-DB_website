import * as React from "react"
import { cn } from "@/lib/utils"

// Flat callout (no radius, no side stripe). Note: surface on ink.
// Important: brand-200 on brand-900.
export function Callout({
  tone = "note",
  label,
  children,
  className,
}: {
  tone?: "note" | "important"
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid max-w-[760px] gap-1.5 px-5 py-[18px]",
        tone === "note" ? "bg-surface text-foreground" : "bg-brand-200 text-brand-900",
        className
      )}
    >
      <strong className="text-[12px] tracking-[.08em] uppercase">{label}</strong>
      <div className="text-[15px] leading-[1.6] [&_p]:m-0">{children}</div>
    </div>
  )
}
