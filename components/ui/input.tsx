import * as React from "react"
import { cn } from "cn"

// Modernist .input: min-height 36px (44px on touch), padding 6px 10px, 14px,
// surface background, 1px border; hover ink 45%; focus border brand.
const controlClasses =
  "w-full min-w-0 min-h-9 border border-input bg-surface px-2.5 py-1.5 text-[14px] text-foreground caret-brand pointer-coarse:min-h-11 hover:border-foreground/45 focus-visible:border-brand focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-destructive"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(controlClasses, className)}
      {...props}
    />
  )
}

export { Input, controlClasses }
