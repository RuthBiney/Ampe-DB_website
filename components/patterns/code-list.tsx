import * as React from "react"

import { AutoGrid } from "@/components/patterns/auto-grid"
import { cn } from "@/lib/utils"

// Columns of file names (13px code, 1px top rules), e.g. Database "Core
// metadata files" and "Supporting index files".
export function CodeList({
  files,
  min,
  className,
}: {
  files: readonly string[]
  min: string // column minimum, e.g. "300px"
  className?: string
}) {
  return (
    <AutoGrid as="ul" min={min} className={cn("m-0 list-none gap-x-8 p-0", className)}>
      {files.map((file) => (
        <li key={file} className="border-t border-border py-2.5">
          <code className="block text-[13px]">{file}</code>
        </li>
      ))}
    </AutoGrid>
  )
}

// A one-line code sample on a surface panel that scrolls instead of wrapping.
export function CodeBlock({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "block overflow-x-auto bg-surface px-[18px] py-3.5 text-[13.5px] whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}
