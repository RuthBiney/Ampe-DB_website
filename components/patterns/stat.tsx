import * as React from "react"
import { cn } from "@/lib/utils"

const numberSizes = {
  home: "text-[clamp(40px,4.4vw,60px)] tracking-[-.03em]",
  40: "text-[40px] tracking-[-.02em]",
  36: "text-[36px] tracking-[-.02em]",
  34: "text-[34px] tracking-[-.02em]",
} as const

const tones = {
  brand: "text-brand",
  ink: "text-foreground",
  muted: "text-neutral-700",
} as const

// Stat block: 2px top rule, a big tabular number and an uppercase label.
export function Stat({
  value,
  label,
  size = 34,
  tone = "ink",
  className,
}: {
  value: React.ReactNode
  label: React.ReactNode
  size?: keyof typeof numberSizes
  tone?: keyof typeof tones
  className?: string
}) {
  const home = size === "home"
  return (
    <div className={cn("border-t-2 border-border", home ? "pt-4" : "pt-3", className)}>
      <div className={cn(numberSizes[size], "leading-none font-extrabold tabular-nums", tones[tone])}>
        {value}
      </div>
      <div
        className={cn(
          "tracking-[.06em] text-neutral-700 uppercase",
          home ? "mt-3 text-[13px] leading-[1.45]" : "mt-2 text-[12px] leading-[1.4]"
        )}
      >
        {label}
      </div>
    </div>
  )
}
