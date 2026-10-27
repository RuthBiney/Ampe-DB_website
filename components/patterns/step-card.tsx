import * as React from "react"

import { ArrowLink } from "@/components/patterns/arrow-link"
import { cn } from "@/lib/utils"

const sizes = {
  lg: { root: "pt-4", number: "text-[30px]", title: "text-[19px]", text: "text-[15px]" },
  sm: { root: "pt-3.5", number: "text-[24px]", title: "text-[17px]", text: "text-[14px]" },
} as const

// Step card: 2px top rule, big brand number, title, text, optional link.
export function StepCard({
  number,
  title,
  children,
  link,
  size = "lg",
  as: Comp = "li",
  className,
}: {
  number: string
  title: React.ReactNode
  children?: React.ReactNode
  link?: { href: string; label: string }
  size?: keyof typeof sizes
  as?: "li" | "div"
  className?: string
}) {
  const s = sizes[size]
  return (
    <Comp className={cn("grid content-start gap-2 border-t-2 border-border", s.root, className)}>
      <span className={cn(s.number, "leading-none font-extrabold text-brand tabular-nums")}>
        {number}
      </span>
      <h4 className={cn("mt-2.5 mb-0", s.title)}>{title}</h4>
      {children && <p className={cn("m-0 text-neutral-800", s.text)}>{children}</p>}
      {link && (
        <ArrowLink href={link.href} size="sm">
          {link.label}
        </ArrowLink>
      )}
    </Comp>
  )
}
