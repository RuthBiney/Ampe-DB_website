import * as React from "react"

import { ArrowLink } from "@/components/patterns/arrow-link"
import { cn } from "@/lib/utils"

const sizes = {
  lg: { root: "pt-4", number: "text-[30px]", title: "mt-2.5 mb-0 text-[19px]", text: "text-[15px]" },
  // Research 05.4: the title is a bold run-in (not a heading), text at 1.55.
  sm: { root: "pt-3.5", number: "text-[24px]", title: "text-[17px]", text: "text-[14px] leading-[1.55]" },
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
      {size === "lg" ? <h4 className={s.title}>{title}</h4> : <strong className={s.title}>{title}</strong>}
      {children && <p className={cn("m-0 text-neutral-800", s.text)}>{children}</p>}
      {link && (
        <ArrowLink href={link.href} size="sm">
          {link.label}
        </ArrowLink>
      )}
    </Comp>
  )
}
