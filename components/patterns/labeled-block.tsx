import * as React from "react"

import { Eyebrow } from "@/components/site/eyebrow"
import { cn } from "@/lib/utils"

// A 2px-ruled block: small uppercase label, a bold value and optional detail
// (Terms 02.1 documents, Getting 03.5 versions, Database 04.5 normalization).
export function LabeledBlock({
  label,
  value,
  detail,
  valueClassName = "text-[17px]",
  className,
}: {
  label: string
  value: React.ReactNode
  detail?: React.ReactNode
  valueClassName?: string
  className?: string
}) {
  return (
    <div className={cn("grid content-start gap-1.5 border-t-2 border-border pt-3.5", className)}>
      <Eyebrow size="sm" tone="neutral">
        {label}
      </Eyebrow>
      <strong className={valueClassName}>{value}</strong>
      {detail}
    </div>
  )
}
