import * as React from "react"
import { cn } from "@/lib/utils"

// Doc layout (Terms, Getting, Database, Research, FAQ): the section rail
// beside the content from lg, stacked above it below.
export function DocLayout({
  rail,
  narrow = false,
  children,
}: {
  rail: React.ReactNode
  narrow?: boolean // FAQ: content max 860px
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start gap-x-16 border-t-2 border-border">
      <aside className="max-w-[300px] flex-[1_1_220px] pt-10 pb-6 lg:sticky lg:top-[84px]">
        {rail}
      </aside>
      <div className={cn("min-w-0 flex-[999_1_560px]", narrow && "max-w-[860px]")}>{children}</div>
    </div>
  )
}
