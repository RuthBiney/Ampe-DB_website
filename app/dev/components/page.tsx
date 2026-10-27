// TODO(Phase 6): remove this page. It shows every shared component once,
// using copy from the reference, so each can be checked at phone and desktop widths.
import type { Metadata } from "next"
import * as React from "react"
import { ArrowRightIcon, DownloadIcon, MailIcon } from "lucide-react"

import { AutoGrid } from "@/components/patterns/auto-grid"
import { ArrowLink } from "@/components/patterns/arrow-link"
import { StaticChartPanel } from "@/components/patterns/bar-chart"
import { Callout } from "@/components/patterns/callout"
import { DocLayout } from "@/components/patterns/doc-layout"
import { DocSection, Lead, Secondary, SubHeading } from "@/components/patterns/doc-section"
import { Legend, LegendSwatch } from "@/components/patterns/legend"
import { NumberedList } from "@/components/patterns/numbered-list"
import { PageHeader } from "@/components/patterns/page-header"
import { ProportionBar } from "@/components/patterns/proportion-bar"
import { SectionHeading } from "@/components/patterns/section-heading"
import { SectionRail } from "@/components/patterns/section-rail"
import { Stat } from "@/components/patterns/stat"
import { StepCard } from "@/components/patterns/step-card"
import { TaskChart } from "@/components/patterns/task-chart"
import { VideoTile } from "@/components/patterns/video-tile"
import { Container } from "@/components/site/container"
import { Eyebrow } from "@/components/site/eyebrow"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { clips } from "@/content/clips"
import { faqDefaultOpen, faqTopics } from "@/content/faq"
import { gettingStarted } from "@/content/home"
import { packages } from "@/content/packages"
import { atAGlance } from "@/content/stats"

export const metadata: Metadata = {
  title: "Components",
  robots: { index: false, follow: false },
}

function Demo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section aria-label={name} className="grid gap-6 border-t-2 border-border py-12">
      <Eyebrow size="sm" tone="neutral">
        {name}
      </Eyebrow>
      {children}
    </section>
  )
}

const termsRail = [
  {
    label: "Terms of use",
    items: [
      { id: "tm_accept", number: "02.1", label: "Acceptance of terms" },
      { id: "tm_use", number: "02.2", label: "Permitted & prohibited use" },
      { id: "tm_attribution", number: "02.3", label: "Attribution" },
    ],
  },
  {
    label: "Disclaimer & ethical use",
    items: [
      { id: "tm_warranty", number: "02.4", label: "No warranty" },
      { id: "tm_privacy", number: "02.5", label: "Participant privacy" },
      { id: "tm_culture", number: "02.6", label: "Cultural responsibility" },
      { id: "tm_derived", number: "02.7", label: "Derived outputs" },
    ],
  },
]

const faqRail = [
  {
    label: "Topics",
    items: faqTopics.map((t) => ({ id: t.id, number: t.number, label: t.title })),
  },
]


export default function ComponentsPage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow="02 — Terms of Use"
          lines={["Open access.", "Responsible use."]}
          lead="By accessing, downloading or using Ampe-DB you agree to the Terms of Use, License and Research Data Use Agreement distributed with the release. This page summarizes them; the release documents remain authoritative."
        />

        <Demo name="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              Download dataset <DownloadIcon aria-hidden="true" />
            </Button>
            <Button variant="outline">Menu</Button>
            <Button variant="ghost">Submit another declaration</Button>
            <Button size="lg">
              Access the dataset <ArrowRightIcon aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline">
              Read the documentation <ArrowRightIcon aria-hidden="true" />
            </Button>
            <Button size="icon" variant="outline" aria-label="Email">
              <MailIcon aria-hidden="true" />
            </Button>
            <Button disabled>Sending your link…</Button>
          </div>
          <div className="max-w-sm">
            <Button className="mt-2 w-full justify-start gap-2.5 px-4 py-[13px] text-[15px]">
              Submit and get your download link <ArrowRightIcon aria-hidden="true" />
            </Button>
          </div>
        </Demo>

        <Demo name="Tags and arrow links">
          <div className="flex flex-wrap gap-1.5">
            <Badge>Source</Badge>
            <Badge variant="accent">Model input</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="outline-muted">Synchronization detection</Badge>
            <Badge mono>left_right</Badge>
            <Badge mono className="px-3 py-[5px] text-[13px]">
              right_right
            </Badge>
          </div>
          <div className="flex flex-wrap gap-6">
            <ArrowLink href="/database#db_structure">See the folder structure</ArrowLink>
            <ArrowLink href="/terms" size="sm">
              Terms of Use
            </ArrowLink>
          </div>
        </Demo>

        <Demo name="Lead and secondary paragraphs">
          <div>
            <Lead>
              By accessing, downloading or using Ampe-DB, users agree to comply with the release Terms
              of Use, License and Research Data Use Agreement distributed with the dataset.
            </Lead>
            <Secondary>
              Ampe-DB is openly downloadable after completion of a short access form declaring the
              intended purpose of use. The form is a required use declaration, not an approval process.
            </Secondary>
          </div>
        </Demo>

        <Demo name="Section heading">
          <SectionHeading eyebrow="Rooted in living tradition" lines={["What is Ampe?"]} />
        </Demo>

        <Demo name="Stats">
          <AutoGrid min="170px" className="gap-x-6 gap-y-8">
            {atAGlance.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} size="home" tone="brand" />
            ))}
          </AutoGrid>
          <AutoGrid min="130px" className="gap-6">
            <Stat value="637" label="Canonical records" />
            <Stat value="15" label="Pseudonymous participants" />
            <Stat value="11" label="Unordered pairs" />
            <Stat value="14" label="Ordered pair configurations" />
            <Stat value="557" label="Unique RGB/audio hashes" />
          </AutoGrid>
        </Demo>

        <Demo name="Proportion bars and legends">
          <ProportionBar
            label="557 unique audiovisual hashes and 80 redundant duplicate records"
            segments={[
              { count: 557, className: "bg-neutral-900" },
              { count: 80, className: "bg-brand" },
            ]}
          />
          <Legend>
            <LegendSwatch size={10} swatchClassName="bg-neutral-900">557 unique complete-file hashes</LegendSwatch>
            <LegendSwatch size={10} swatchClassName="bg-brand">80 redundant records</LegendSwatch>
          </Legend>
          <ProportionBar
            className="h-3.5 max-w-[560px]"
            label="444 train, 97 validation, 96 test"
            segments={[
              { count: 444, className: "bg-neutral-900" },
              { count: 97, className: "bg-neutral-600" },
              { count: 96, className: "bg-brand" },
            ]}
          />
        </Demo>

        <Demo name="Numbered list, step cards, callouts">
          <div className="max-w-[760px]">
            <SubHeading className="mt-0 mb-1">Access process</SubHeading>
            <NumberedList
              items={[
                "Complete the official access form with your name, contact email, affiliation where applicable, intended use and a short description of the project or purpose.",
                "Confirm acceptance of the Terms of Use, License and Research Data Use Agreement.",
                "Submit the form. A personal download link is emailed to you straight away — no separate approval is required.",
              ]}
            />
          </div>
          <AutoGrid min="300px" as="ol" className="m-0 list-none gap-x-6 gap-y-10 p-0">
            {gettingStarted.slice(0, 3).map((step) => (
              <StepCard key={step.number} number={step.number} title={step.title} link={step.link}>
                {step.text}
              </StepCard>
            ))}
          </AutoGrid>
          <Callout tone="important" label="Important">
            Do not use earlier draft checksum lists as authoritative V1 integrity records. Use only
            checksum material distributed with the release package you actually downloaded.
          </Callout>
          <Callout label="Outcome caution">
            Baseline V1 does not use an independently annotated winner label as a separate benchmark
            target. Gameplay outcome can be derived only when the applicable Ampe rule or player role
            is defined.
          </Callout>
        </Demo>

        <Demo name="Table">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h4 className="m-0 text-[20px]">Release packages</h4>
            <span className="inline-flex items-center gap-2 text-[13px] text-neutral-700">
              <MailIcon aria-hidden="true" className="size-3.5" />
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
              {packages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-extrabold whitespace-nowrap">{p.name}</TableCell>
                  <TableCell>{p.contents}</TableCell>
                  <TableCell>
                    <code className="text-[12.5px]">{p.archive}</code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Demo>

        <Demo name="Bar charts (Home, Research)">
          <AutoGrid min="400px" className="items-start gap-x-[72px] gap-y-14">
            <StaticChartPanel />
            <TaskChart />
          </AutoGrid>
        </Demo>

        <Demo name="Video tiles">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-0.5 border-2 border-border bg-border">
            <VideoTile clip={clips.c179} />
            <VideoTile clip={clips.c179s} />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,max(340px,calc(50%_-_1px))),1fr))] gap-0.5 border-2 border-border bg-border">
            <VideoTile clip={clips.c114} preload="metadata" tagClassName="tracking-[.04em]" />
            <VideoTile clip={clips.c189} preload="metadata" tagClassName="tracking-[.04em]" />
          </div>
        </Demo>

        <Demo name="Section rail (Terms groups, static)">
          <div className="max-w-[300px]">
            <SectionRail groups={termsRail} />
          </div>
        </Demo>
      </Container>

      <Container>
        <PageHeader eyebrow="06 — FAQ" lines={["Questions", "researchers ask."]} />
        <DocLayout narrow rail={<SectionRail groups={faqRail} navLabel="Topics" />}>
          {faqTopics.map((topic) => (
            <DocSection key={topic.id} id={topic.id} number={topic.number} title={topic.title}>
              <Accordion type="multiple" defaultValue={faqDefaultOpen}>
                {topic.items.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </DocSection>
          ))}
        </DocLayout>
      </Container>
    </main>
  )
}
