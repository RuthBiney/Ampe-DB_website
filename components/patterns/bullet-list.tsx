import * as React from "react"
import { cn } from "@/lib/utils"

// The prototype's square-bullet lists (markers in brand via the base styles).
export function BulletList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("m-0 grid list-[square] gap-2 pl-5", className)} {...props} />
}
