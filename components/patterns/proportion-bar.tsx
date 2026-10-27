import { cn } from "@/lib/utils"

// Proportion bar: one flex row, 2px gaps, each segment `flex: <count> 1 0`.
export function ProportionBar({
  segments,
  label,
  className,
}: {
  segments: readonly { count: number; className: string }[]
  label: string // accessible description, e.g. "444 train, 97 validation, 96 test"
  className?: string // height, e.g. "h-[22px]" or "h-3.5"; max-width
}) {
  return (
    <div role="img" aria-label={label} className={cn("flex h-[22px] gap-0.5", className)}>
      {segments.map((segment, index) => (
        <span key={index} className={segment.className} style={{ flex: `${segment.count} 1 0` }} />
      ))}
    </div>
  )
}
