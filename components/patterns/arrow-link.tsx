import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

// A text link ending in " →": 15px 800, or 14px 600 for the small variant.
export function ArrowLink({
  href,
  size = "md",
  className,
  children,
}: {
  href: string
  size?: "md" | "sm"
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "w-fit",
        size === "md" ? "text-[15px] font-extrabold" : "text-[14px] font-semibold",
        className
      )}
    >
      {typeof children === "string" ? `${children} →` : <>{children} →</>}
    </Link>
  )
}
