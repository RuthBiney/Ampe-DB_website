"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navItems } from "@/content/site"

// Header links (xl and up). Hover and the current page turn brand.
export function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="hidden flex-wrap items-center gap-x-[22px] gap-y-1.5 xl:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className="text-[14px] text-foreground no-underline hover:text-brand aria-[current=page]:text-brand"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
