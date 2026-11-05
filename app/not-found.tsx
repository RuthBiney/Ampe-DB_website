import type { Metadata } from "next"
import Link from "next/link"

import { Callout } from "@/components/patterns/callout"
import { PageHeader } from "@/components/patterns/page-header"
import { Container } from "@/components/site/container"
import { RequestedAddress } from "@/components/site/requested-address"
import { accessFormHref } from "@/content/site"

// 404 page (design-handoff/assets/404 Page.dc.html). Next.js serves it with
// status 404 and adds the noindex tag itself.

export const metadata: Metadata = { title: "Page not found" }

const routes = [
  { href: "/", title: "Home", text: "What Ampe-DB is, the headline numbers and how to start." },
  {
    href: "/getting-the-database",
    title: "Getting the Database",
    text: "Complete the use declaration and get your personal download link by email.",
  },
  { href: "/faq", title: "FAQ", text: "Answers on access, permitted use, the data and reporting issues." },
  { href: "/contact", title: "Contact Us", text: "Tell the team about a broken link or a dataset issue." },
] as const

export default function NotFound() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow="404 — Page not found"
          lines={["This page isn’t", "in the dataset."]}
          accent
          lead="The address may be mistyped, or the page may have moved. Everything in Ampe-DB V1 is still here — pick up from one of the pages below."
        >
          <RequestedAddress />
        </PageHeader>

        <section aria-labelledby="nf-next" className="max-w-[860px] border-t-2 border-border pt-10 pb-[88px]">
          <h2
            id="nf-next"
            className="mt-0 mb-2.5 text-[12px] leading-[1.4] font-semibold tracking-[.08em] text-neutral-700 uppercase"
          >
            Where to next
          </h2>
          <ol className="m-0 grid list-none p-0">
            {routes.map((route, index) => (
              <li key={route.href} className="border-t border-border last:border-b">
                <Link
                  href={route.href}
                  className="group grid grid-cols-[48px_minmax(0,1fr)] gap-3 py-[18px] text-foreground no-underline hover:text-foreground"
                >
                  <span className="leading-[1.5] font-extrabold text-brand-700 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="grid gap-1">
                    <span className="text-[clamp(22px,2.4vw,28px)] leading-[1.15] font-extrabold tracking-[-.015em] group-hover:text-brand-700">
                      {route.title} →
                    </span>
                    <span className="text-[15px] leading-[1.6] text-neutral-800">{route.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <Callout label="Came from a download email?" className="mt-8">
            <p>
              Download links are personal and expire. Request a fresh one from{" "}
              <Link href={accessFormHref}>Getting the Database</Link> — it arrives straight away.
            </p>
          </Callout>
        </section>
      </Container>
    </main>
  )
}
