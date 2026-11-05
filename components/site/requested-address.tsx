"use client"

import { usePathname } from "next/navigation"

// The 404 page's "Requested address" line. Client-only because the not-found
// page doesn't receive the URL; renders nothing until the path is known.
export function RequestedAddress() {
  const pathname = usePathname()
  if (!pathname) return null
  return (
    <p className="m-0 text-[13px] leading-[1.5] text-neutral-700 [overflow-wrap:anywhere]">
      Requested address: <code className="text-foreground">{pathname}</code>
    </p>
  )
}
