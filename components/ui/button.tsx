import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// Modernist .btn: Archivo 800, 14px / 1.2, padding 8px 14.4px, gap 6px,
// 1px transparent border. Flat and instant: no radius, shadow or transition.
// Line-height is an arbitrary property so a call-site font size (text-[15px])
// doesn't merge it away.
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 border border-transparent px-[14.4px] py-2 text-[14px] [line-height:1.2] font-extrabold no-underline select-none disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:block [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-brand-600 active:bg-brand-700",
        outline:
          "border-border bg-transparent text-foreground hover:bg-foreground/7 active:bg-foreground/14",
        ghost:
          "bg-transparent px-1 text-brand hover:bg-brand/10 active:bg-brand/18",
      },
      size: {
        default: "",
        // Large CTA used across the hero, poster and download pages: 15px, padding 14px 18px, gap 10px.
        lg: "gap-2.5 px-[18px] py-3.5 text-[15px]",
        icon: "size-9 p-0 pointer-coarse:size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
