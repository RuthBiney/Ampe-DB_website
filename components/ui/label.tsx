"use client"

import * as React from "react"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

// Modernist .field > label: 12px, ink 70%. The 5px gap to the control comes from FormItem.
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "block text-[12px] text-foreground/70 peer-disabled:cursor-not-allowed peer-disabled:opacity-45",
        className
      )}
      {...props}
    />
  )
}

export { Label }
