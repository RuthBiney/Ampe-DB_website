"use client"

import * as React from "react"
import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { MinusIcon, PlusIcon } from "lucide-react"

// FAQ accordion: items stacked with 1px rules (the last also has a bottom
// rule); plus/minus in a 28×28 bordered box; no height animation.
function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("grid w-full", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-t border-border last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="m-0 text-[17px] leading-[1.4] font-extrabold tracking-normal">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_28px] items-center gap-4 py-[18px] text-left text-foreground hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-45",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          className="grid size-7 place-items-center border border-border"
        >
          <PlusIcon className="size-3.5 group-data-[state=open]:hidden" strokeWidth={2.5} />
          <MinusIcon className="hidden size-3.5 group-data-[state=open]:block" strokeWidth={2.5} />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content data-slot="accordion-content" {...props}>
      <div className={cn("max-w-[70ch] pr-11 pb-[22px] text-neutral-800", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
