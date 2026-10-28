import type { Metadata } from "next"
import * as React from "react"
import Link from "next/link"
import { MailIcon } from "lucide-react"

import { AccessForm } from "@/components/getting/access-form"
import { AutoGrid } from "@/components/patterns/auto-grid"
import { BulletList } from "@/components/patterns/bullet-list"
import { Callout } from "@/components/patterns/callout"
import { DocLayout } from "@/components/patterns/doc-layout"
import { DocSection, Lead, Secondary, SubHeading } from "@/components/patterns/doc-section"
import { LabeledBlock } from "@/components/patterns/labeled-block"
import { NumberedList } from "@/components/patterns/numbered-list"
import { PageHeader } from "@/components/patterns/page-header"
import { SectionRail } from "@/components/patterns/section-rail"
import { Container } from "@/components/site/container"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { packages } from "@/content/packages"
import { gettingRail, railItem } from "@/content/sections"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Getting the Database" }

const section = (id: string) => {
  const { number, label } = railItem(gettingRail, id)
  return { id, number, title: label }
}

// 03.2 — the first tag (accent) is the primary modality.
const researchNeeds: readonly [string, readonly string[]][] = [
  ["RGB action recognition", ["videos", "annotations", "metadata", "splits"]],
  ["Pose sequence modeling", ["pose", "annotations", "metadata", "splits"]],
  ["Skeleton inspection / visualization", ["skeleton", "videos", "metadata"]],
  [
    "Benchmark reproduction",
    ["required modality", "annotations", "metadata", "splits", "benchmark documentation"],
  ],
]

// 03.4 — canonical coverage: 637 × 5 = 3,185.
const coverage = [
  { value: "637", label: "Canonical IDs" },
  { op: "×", value: "5", label: "Representations" },
  { op: "=", value: "3,185", label: "Record-level files", result: true },
] as const

export default function GettingPage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow="03 — Getting the Database"
          lines={["From declaration", "to download."]}
          lead="Ampe-DB is openly available to everyone and free of charge. Before downloading, each user completes a short access form stating their intended purpose. It is a required use declaration — not an approval process — and there is no waiting period."
        />
        <DocLayout rail={<SectionRail groups={gettingRail} />}>
          <DocSection {...section("gt_access")} titleClassName="mb-7">
            <AutoGrid min="320px" className="items-start gap-x-12 gap-y-10">
              <div className="grid content-start gap-7">
                <div>
                  <h4 className="mt-0 mb-1 text-[19px]">Access process</h4>
                  <NumberedList
                    items={[
                      "Complete the official access form with your name, contact email, affiliation where applicable, intended use and a short description of the project or purpose.",
                      "Confirm acceptance of the Terms of Use, License and Research Data Use Agreement.",
                      "Submit the form. A personal download link is emailed to you straight away — no separate approval is required.",
                    ]}
                  />
                </div>
                <div>
                  <h4 className="mt-0 mb-3 text-[19px]">Who may download</h4>
                  <BulletList className="text-neutral-800">
                    <li>Anyone, after completing the access form and agreeing to the release terms.</li>
                    <li>
                      Academic, educational, independent, cultural, artistic and exploratory uses are
                      welcome when they comply with the Terms of Use.
                    </li>
                    <li>There is no download fee, and institutional affiliation is not required.</li>
                  </BulletList>
                </div>
                <p className="m-0 bg-surface px-[18px] py-4 text-[14.5px] leading-[1.6]">
                  Open download access does not waive the Terms of Use. Restrictions on
                  redistribution, re-identification, surveillance, prohibited commercial use and
                  misuse of participant-derived data still apply.
                </p>
              </div>
              <AccessForm />
            </AutoGrid>

            <div className="mt-14 grid gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h4 className="m-0 text-[20px]">Release packages</h4>
                <span className="inline-flex items-center gap-2 text-[13px] text-neutral-700">
                  <MailIcon size={14} aria-hidden="true" className="shrink-0" />
                  Download links are emailed after the declaration
                </span>
              </div>
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Contents</TableHead>
                    <TableHead>Archive</TableHead>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DocSection>

          <DocSection {...section("gt_receive")} titleClassName="mb-6">
            <h4 className="mt-0 mb-3 text-[19px]">Approved V1 components</h4>
            <BulletList className="max-w-[70ch]">
              <li>Canonical RGB MP4 clips with synchronized embedded audio.</li>
              <li>Normalized 2D pose CSV files.</li>
              <li>Skeleton coordinate exports in CSV and JSON.</li>
              <li>Rendered skeleton MP4 visualizations.</li>
              <li>Canonical movement labels and participant/pair mapping metadata.</li>
              <li>Duplicate provenance and media metadata.</li>
              <li>
                Locked split definitions, release documentation, paper materials, citation file, and
                access and licensing documents.
              </li>
            </BulletList>
            <SubHeading className="mt-10">Download by research need</SubHeading>
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Use case</TableHead>
                  <TableHead>Minimum useful components</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {researchNeeds.map(([useCase, tags]) => (
                  <TableRow key={useCase}>
                    <TableCell className="font-extrabold">{useCase}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag, index) => (
                          <Badge key={tag} variant={index === 0 ? "accent" : "neutral"}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DocSection>

          <DocSection {...section("gt_download")}>
            <Lead>
              After completing the access form, open the personal link we email you and download
              Ampe-DB free of charge. The link works for 7 days; if it expires, submit the form again
              for a new one. No separate approval is required.
            </Lead>
            <Secondary>
              Preserve the directory structure: filenames and relative paths are used to align
              representations and metadata.
            </Secondary>
            <SubHeading className="mt-10 mb-1">After download</SubHeading>
            <NumberedList
              numberWidth={48}
              className="max-w-[760px]"
              items={[
                "Keep canonical filenames unchanged.",
                "Confirm the expected top-level folders and metadata files are present.",
                "Check canonical identifier coverage before analysis.",
                "Verify package-level checksums when checksum material is supplied with the release.",
                "Record the dataset version in your experiment configuration.",
              ]}
            />
            <Callout tone="important" label="Important" className="mt-8">
              <p>
                Do not use earlier draft checksum lists as authoritative V1 integrity records. Use only
                checksum material distributed with the release package you actually downloaded.
              </p>
            </Callout>
          </DocSection>

          <DocSection {...section("gt_verify")} titleClassName="mb-6">
            <h4 className="mt-0 mb-2 text-[19px]">Two levels of verification</h4>
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[34%]">Level</TableHead>
                  <TableHead>What to verify</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-extrabold">Release / package integrity</TableCell>
                  <TableCell>
                    Use the checksum file supplied with the specific download package, when
                    provided, to confirm that transferred archives or files are complete.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-extrabold">Dataset record integrity</TableCell>
                  <TableCell>
                    Use <code className="wrap-anywhere">metadata/ampe_db_v1_manifest.csv</code> to
                    confirm canonical clip IDs, media properties and the complete-file RGB/audio
                    SHA-256 values used for duplicate provenance.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <SubHeading className="mb-5">Canonical coverage checks</SubHeading>
            <div className="flex flex-wrap items-end gap-x-7 gap-y-4">
              {coverage.map((term) => (
                <React.Fragment key={term.label}>
                  {"op" in term && (
                    <div
                      aria-hidden="true"
                      className="pb-[26px] text-[clamp(28px,3vw,40px)] leading-[1.2] font-normal text-neutral-700"
                    >
                      {term.op}
                    </div>
                  )}
                  <div>
                    <div
                      className={cn(
                        "text-[clamp(40px,4.4vw,56px)] leading-none font-extrabold tracking-[-.03em] tabular-nums",
                        "result" in term && "text-brand"
                      )}
                    >
                      {term.value}
                    </div>
                    <div className="mt-2 text-[12px] tracking-[.07em] text-neutral-700 uppercase">
                      {term.label}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <BulletList className="mt-7 max-w-[70ch]">
              <li>
                Each of the 637 canonical IDs should be represented in all five record-level
                representations: RGB video, normalized pose CSV, skeleton CSV, skeleton JSON and
                skeleton video.
              </li>
              <li>
                A matching movement token + <code>C###</code> identifier denotes the same canonical
                record across representations.
              </li>
              <li>
                The 3,185 count excludes release documentation, metadata, split, paper and access
                files.
              </li>
            </BulletList>

            <SubHeading>Duplicate provenance</SubHeading>
            <Secondary>
              V1 contains 557 unique complete-file RGB/audio SHA-256 hashes across 637 canonical
              records. Exact duplicates are retained for provenance and record correspondence;
              duplicate-safe splitting prevents them from crossing the fixed train, validation and
              test partitions. <Link href="/database#db_overview">Dataset overview →</Link>
            </Secondary>
          </DocSection>

          <DocSection {...section("gt_version")} titleClassName="mb-7">
            <AutoGrid min="190px" className="gap-6">
              <LabeledBlock label="Dataset" value="Ampe-DB V1" valueClassName="text-[22px] leading-[1.2]" />
              <LabeledBlock
                label="Benchmark"
                value="Ampe-DB Baseline V1"
                valueClassName="text-[22px] leading-[1.2]"
              />
              <LabeledBlock label="Release year" value="2026" valueClassName="text-[22px] leading-[1.2]" />
            </AutoGrid>
            <SubHeading>Version reporting</SubHeading>
            <BulletList className="max-w-[70ch]">
              <li>Always name the dataset version used.</li>
              <li>State the exact evaluation protocol used.</li>
              <li>
                Do not compare fixed-split results directly with pair-held-out or
                participant-held-out results without identifying the protocol.
              </li>
              <li>
                Documentation-only corrections should not silently change frozen benchmark
                definitions or historical results.
              </li>
            </BulletList>
          </DocSection>
        </DocLayout>
      </Container>
    </main>
  )
}
