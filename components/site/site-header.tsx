import Link from "next/link"

import { Brand } from "@/components/site/brand"
import { DownloadCta } from "@/components/site/download-cta"
import { NavLinks } from "@/components/site/nav-links"
import { SiteMenu } from "@/components/site/site-menu"

// Sticky header. From xl: brand, seven links, "Download dataset". Below xl:
// brand, "Download dataset" (from sm) and the "Menu" button. The side padding
// lines the content up with the container while the 2px rule runs full width.
export function SiteHeader() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-40 flex flex-wrap items-center gap-x-7 gap-y-2.5 border-b-2 border-border bg-background px-[max(clamp(20px,5vw,64px),calc((100%_-_1240px)/2_+_clamp(20px,5vw,64px)))] py-3.5"
    >
      <Link
        href="/"
        className="mr-auto inline-flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-.01em] text-foreground no-underline hover:text-brand"
      >
        <Brand />
      </Link>
      <NavLinks />
      <DownloadCta className="hidden xl:inline-flex" />
      <div className="flex items-center gap-2.5 xl:hidden">
        <DownloadCta className="hidden min-h-11 sm:inline-flex" />
        <SiteMenu />
      </div>
    </nav>
  )
}
