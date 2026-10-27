import Link from "next/link"

import { BrandMark } from "@/components/site/brand"
import { Container } from "@/components/site/container"
import { Eyebrow } from "@/components/site/eyebrow"
import { footer } from "@/content/site"

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-border">
      <Container className="grid gap-12 pt-14 pb-8">
        <div className="flex flex-wrap gap-x-12 gap-y-10">
          <div className="grid flex-[2_1_320px] content-start gap-3.5">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2.5 text-[19px] font-extrabold text-foreground no-underline hover:text-foreground"
            >
              <BrandMark />
              Ampe-DB
            </Link>
            <p className="m-0 max-w-[44ch] text-[14px] leading-[1.6] text-neutral-700">
              {footer.blurb}
            </p>
          </div>
          {footer.columns.map((column) => (
            <div
              key={column.heading}
              className="grid flex-[1_1_160px] content-start gap-2 text-[14px]"
            >
              <Eyebrow size="sm" tone="neutral" className="mb-1">
                {column.heading}
              </Eyebrow>
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-foreground no-underline hover:text-brand-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-1.5 border-t border-border pt-5 text-[13px] text-neutral-700">
          <span>{footer.copyright}</span>
          <span>{footer.edition}</span>
        </div>
      </Container>
    </footer>
  )
}
