import * as React from "react"
import { cn } from "@/lib/utils"

// Doc section: number kicker + H2, separated by 2px rules. The first section
// has no rule and 40px top padding; the last ends with 88px bottom padding.
export function DocSection({
  id,
  number,
  title,
  titleClassName,
  className,
  children,
}: {
  id: string
  number: string
  title: React.ReactNode
  titleClassName?: string // e.g. "mb-6" when a grid follows
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      data-spy=""
      className={cn(
        "border-t-2 border-border pt-12 pb-14 first:border-t-0 first:pt-10 last:pb-22",
        className
      )}
    >
      <span className="text-[13px] font-semibold tracking-[.08em] text-brand-700 tabular-nums">
        {number}
      </span>
      <h2 className={cn("mt-2.5 mb-5", titleClassName)}>{title}</h2>
      {children}
    </section>
  )
}

/** Lead paragraph: 18px / 1.65, max 66ch. */
export function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("mt-0 mb-4 max-w-[66ch] text-[18px] leading-[1.65]", className)} {...props} />
  )
}

/** Secondary paragraph: 16px, neutral-800, max 66ch. */
export function Secondary({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("m-0 max-w-[66ch] text-neutral-800", className)} {...props} />
}

/** Sub-heading H4: 19px, margin 44px 0 8–16px. */
export function SubHeading({ className, ...props }: React.ComponentProps<"h4">) {
  return <h4 className={cn("mt-11 mb-3 text-[19px]", className)} {...props} />
}
