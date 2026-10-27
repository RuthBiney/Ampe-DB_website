import * as React from "react"
import { cn } from "@/lib/utils"

const layouts = {
  // Fig. 1: two tiles side by side from about 620px.
  fig1: "grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]",
  // Fig. 2: a 2×2 grid on wide screens, one column on narrow ones.
  fig2: "grid-cols-[repeat(auto-fit,minmax(min(100%,max(340px,calc(50%_-_1px))),1fr))]",
} as const

// A figure of video tiles: the divider-coloured background shows through
// 2px gaps and a 2px border, so the gaps read as rules.
export function VideoFigure({
  layout,
  caption,
  children,
}: {
  layout: keyof typeof layouts
  caption: readonly [string, string]
  children: React.ReactNode
}) {
  return (
    <figure className="m-0 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
      <div className={cn("grid gap-0.5 border-2 border-border bg-border", layouts[layout])}>
        {children}
      </div>
      <figcaption className="m-0 flex flex-wrap justify-between gap-x-6 gap-y-1 text-[12px] tracking-[.07em] text-neutral-700 uppercase">
        <span>{caption[0]}</span>
        <span>{caption[1]}</span>
      </figcaption>
    </figure>
  )
}
