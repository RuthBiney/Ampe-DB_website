import * as React from "react"
import { cn } from "@/lib/utils"

// Numbered list: an <ol> without markers; each row is the number (800,
// brand-700, tabular) then the content, separated by 1px rules.
export function NumberedList({
  items,
  numberWidth = 44,
  rules = "bottom",
  className,
}: {
  items: readonly React.ReactNode[]
  numberWidth?: 44 | 48
  rules?: "bottom" | "top" // "top": top rules plus a final bottom rule (Terms 02.5)
  className?: string
}) {
  return (
    <ol className={cn("m-0 grid list-none p-0", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            "grid gap-3 border-border py-3.5",
            numberWidth === 44
              ? "grid-cols-[44px_minmax(0,1fr)]"
              : "grid-cols-[48px_minmax(0,1fr)] gap-4",
            rules === "bottom" ? "border-b" : "border-t last:border-b"
          )}
        >
          <span className="font-extrabold text-brand-700 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">{item}</div>
        </li>
      ))}
    </ol>
  )
}
