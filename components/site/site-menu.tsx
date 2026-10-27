"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { Brand } from "@/components/site/brand"
import { DownloadCta } from "@/components/site/download-cta"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { menuFootnote, navItems } from "@/content/site"

// Small-screen menu (below xl): a full-screen sheet. Opening moves focus to
// "Close" and locks page scroll; Escape, "Close" or any link closes it.
export function SiteMenu() {
  const [open, setOpen] = React.useState(false)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // The trigger disappears from xl, so don't leave the menu open behind it.
  React.useEffect(() => {
    if (!open) return
    const wide = window.matchMedia("(min-width: 80rem)")
    const onChange = () => wide.matches && setOpen(false)
    onChange()
    wide.addEventListener("change", onChange)
    return () => wide.removeEventListener("change", onChange)
  }, [open])

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" aria-controls="site-menu" className="min-h-11 gap-2">
          <MenuIcon aria-hidden="true" />
          <span>Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        id="site-menu"
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          closeRef.current?.focus()
        }}
      >
        <SheetTitle className="sr-only">Site menu</SheetTitle>
        <div className="flex items-center gap-4 border-b-2 border-border px-[clamp(20px,5vw,64px)] py-3.5">
          <Link
            href="/"
            onClick={close}
            className="mr-auto inline-flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-.01em] text-foreground no-underline hover:text-foreground"
          >
            <Brand />
          </Link>
          <SheetClose asChild>
            <Button ref={closeRef} variant="outline" className="min-h-11 gap-2">
              <XIcon aria-hidden="true" />
              <span>Close</span>
            </Button>
          </SheetClose>
        </div>
        <nav aria-label="Main menu" className="grid px-[clamp(20px,5vw,64px)] pt-2 pb-8">
          {navItems.map((item) => {
            const current = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={current ? "page" : undefined}
                className="grid grid-cols-[16px_40px_minmax(0,1fr)] items-center border-b border-border py-4 text-foreground no-underline hover:text-brand-700"
              >
                <span className="block size-2.5">
                  {current && <span className="block size-2.5 bg-brand" />}
                </span>
                <span className="text-[13px] font-semibold text-brand-700 tabular-nums">
                  {item.number}
                </span>
                <span className="text-[clamp(24px,6vw,34px)] leading-[1.1] font-extrabold tracking-[-.02em]">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
        <div className="px-[clamp(20px,5vw,64px)] pb-10">
          <DownloadCta
            onClick={close}
            className="min-h-12 w-full justify-start gap-2.5 px-4 py-3.5 text-[15px]"
          />
        </div>
        <p className="mt-auto mb-0 border-t border-border px-[clamp(20px,5vw,64px)] py-5 text-[12px] leading-[1.6] tracking-[.07em] text-neutral-700 uppercase">
          {menuFootnote}
        </p>
      </SheetContent>
    </Sheet>
  )
}
