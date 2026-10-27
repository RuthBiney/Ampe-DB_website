import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// Modernist .tag: 11px, letter-spacing .02em, padding 3px 10px.
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 px-2.5 py-[3px] text-[11px] tracking-[.02em] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        accent: "bg-brand-100 text-brand-800",
        neutral: "bg-neutral-100 text-neutral-800",
        outline: "border border-brand text-brand",
        // Research "Not part of frozen Baseline V1" tags.
        "outline-muted": "border border-border text-neutral-800",
      },
      // Label tokens such as left_right.
      mono: {
        true: "font-mono",
        false: "",
      },
    },
    defaultVariants: {
      variant: "neutral",
      mono: false,
    },
  }
)

function Badge({
  className,
  variant = "neutral",
  mono = false,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, mono }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
