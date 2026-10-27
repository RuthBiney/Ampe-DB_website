import * as React from "react"

import { Eyebrow } from "@/components/site/eyebrow"
import { cn } from "@/lib/utils"

// Inner-page header: "0N — Page name" eyebrow, a two-line H1 with optical
// alignment, a lead and optional actions.
export function PageHeader({
  eyebrow,
  lines,
  lead,
  children,
  className,
}: {
  eyebrow: string
  lines: readonly [string, string]
  lead?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn("grid gap-6 pt-[clamp(56px,7vw,88px)] pb-14", className)}>
      <Eyebrow className="block">{eyebrow}</Eyebrow>
      <h1 className="m-0 ml-[-.058em] text-[clamp(42px,6vw,84px)] leading-none tracking-[-.03em]">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      {lead && (
        <p className="m-0 max-w-[62ch] text-[clamp(17px,1.5vw,20px)] leading-[1.55]">{lead}</p>
      )}
      {children}
    </header>
  )
}
