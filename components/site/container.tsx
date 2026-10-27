import * as React from "react"
import { cn } from "@/lib/utils"

// Global shell container: max-width 1240px, side padding clamp(20px, 5vw, 64px).
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto max-w-[1240px] px-[clamp(20px,5vw,64px)]", className)}
      {...props}
    />
  )
}
