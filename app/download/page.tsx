import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { ArrowRightIcon, DownloadIcon } from "lucide-react"

import { ArrowLink } from "@/components/patterns/arrow-link"
import { Callout } from "@/components/patterns/callout"
import { NumberedList } from "@/components/patterns/numbered-list"
import { PageHeader } from "@/components/patterns/page-header"
import { Container } from "@/components/site/container"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { packages } from "@/content/packages"
import { accessFormHref } from "@/content/site"
import { formatExpiry } from "@/lib/format-expiry"
import { linkTtlText } from "@/lib/link-ttl"
import { tokenSecret } from "@/lib/server-env"
import { DATASET_VERSION } from "@/lib/sheets"
import { verifyDownloadToken, type VerifiedToken } from "@/lib/token"
import { cn } from "@/lib/utils"

// Personal download page (README → Screens → Personal download page). Reached
// only from the emailed link; rendered per request and never indexed. The
// token alone decides the state: valid → packages, anything else → expired.

export const metadata: Metadata = {
  title: "Your download",
  robots: { index: false, follow: false },
}

export default function DownloadPage({ searchParams }: PageProps<"/download">) {
  return (
    <main>
      <Container>
        <Suspense>
          <DownloadState searchParams={searchParams} />
        </Suspense>
      </Container>
    </main>
  )
}

async function DownloadState({ searchParams }: Pick<PageProps<"/download">, "searchParams">) {
  const { token } = await searchParams
  const raw = typeof token === "string" ? token : undefined
  const verified = await verifyDownloadToken(raw, tokenSecret())
  return verified && raw ? <ValidLink verified={verified} token={raw} /> : <ExpiredLink />
}

const eyebrow = "Personal download link"

function ValidLink({ verified, token }: { verified: VerifiedToken; token: string }) {
  const facts = [
    { label: "Reference", value: verified.reference, numeric: true },
    { label: "Link expires", value: formatExpiry(verified.expiresAt) },
    { label: "Dataset", value: DATASET_VERSION },
  ]

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        lines={["Your download", "is ready."]}
        lead="This page is personal to you. Please don’t forward the link — colleagues who need the data should complete their own declaration."
      />

      <dl className="m-0 mb-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
        {facts.map((fact) => (
          <div key={fact.label} className="grid content-start gap-1.5 border-t-2 border-border pt-3.5">
            <dt className="text-[12px] font-semibold tracking-[.08em] text-neutral-700 uppercase">
              {fact.label}
            </dt>
            <dd className={cn("m-0 text-[22px] leading-[1.2] font-extrabold", fact.numeric && "tabular-nums")}>
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="dl-packages" className="border-t-2 border-border pt-10 pb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="dl-packages" className="m-0">
            Release packages
          </h2>
          <ArrowLink href="/getting-the-database#gt_receive" size="sm">
            Which packages do I need?
          </ArrowLink>
        </div>
        <Table className="min-w-[680px]">
          <TableHeader>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Contents</TableHead>
              <TableHead>Archive</TableHead>
              <TableHead className="w-[140px]">
                <span className="sr-only">Download</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-extrabold whitespace-nowrap">{pkg.name}</TableCell>
                <TableCell>{pkg.contents}</TableCell>
                <TableCell>
                  <code className="text-[12.5px]">{pkg.archive}</code>
                </TableCell>
                <TableCell>
                  <Button asChild className="gap-2 pointer-coarse:min-h-11">
                    <a
                      href={`/api/download/${pkg.id}?token=${encodeURIComponent(token)}`}
                      rel="nofollow"
                      aria-label={`Download ${pkg.name} (${pkg.archive})`}
                    >
                      Download
                      <DownloadIcon className="size-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Callout label="Large archives" className="mt-7">
          <p>
            Google Drive may warn that it can’t scan a large file for viruses. Choose{" "}
            <em>Download anyway</em> to continue.
          </p>
        </Callout>
      </section>

      <section aria-labelledby="dl-start" className="border-t-2 border-border pt-10 pb-[88px]">
        <h2 id="dl-start" className="mt-0 mb-3">
          Before you start
        </h2>
        <NumberedList
          numberWidth={48}
          className="max-w-[760px]"
          items={[
            <>
              Keep canonical filenames and the folder structure unchanged.{" "}
              <Link href="/getting-the-database#gt_download">Download instructions →</Link>
            </>,
            <>
              Verify the archives and check that all 637 records are present.{" "}
              <Link href="/getting-the-database#gt_verify">Verify download →</Link>
            </>,
            <>
              Read the database structure before writing loaders.{" "}
              <Link href="/database#db_structure">Database structure →</Link>
            </>,
            <>
              Cite Ampe-DB and state the dataset version and evaluation protocol.{" "}
              <Link href="/#home_cite">Citation →</Link>
            </>,
          ]}
        />
      </section>
    </>
  )
}

function ExpiredLink() {
  return (
    <PageHeader
      eyebrow={eyebrow}
      lines={["This link", "has expired."]}
      lead={`Personal download links work for ${linkTtlText()}. Submit the access form again and we’ll email you a new one straight away.`}
      className="pb-[clamp(72px,9vw,112px)]"
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href={accessFormHref}>
            Request a new link
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">Contact the team</Link>
        </Button>
      </div>
    </PageHeader>
  )
}
