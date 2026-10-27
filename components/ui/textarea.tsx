import * as React from "react"
import { cn } from "cn"

import { controlClasses } from "@/components/ui/input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(controlClasses, "block min-h-[90px] resize-y", className)}
      {...props}
    />
  )
}

export { Textarea }
