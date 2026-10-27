import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { VideoFigure } from "@/components/home/video-figure"
import { ArrowLink } from "@/components/patterns/arrow-link"
import { AutoGrid } from "@/components/patterns/auto-grid"
import { StaticChartPanel } from "@/components/patterns/bar-chart"
import { CopyButton } from "@/components/patterns/copy-button"
import { SectionHeading } from "@/components/patterns/section-heading"
import { Stat } from "@/components/patterns/stat"
import { StepCard } from "@/components/patterns/step-card"
import { VideoTile } from "@/components/patterns/video-tile"
import { Container } from "@/components/site/container"
import { Eyebrow } from "@/components/site/eyebrow"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { acknowledgementText, citation, citationFacts, citationText } from "@/content/citation"
import { clips } from "@/content/clips"
import { cycle, gettingStarted, recommendedFiles, representations } from "@/content/home"
import { releaseNotes } from "@/content/release-notes"
import { drop } from "@/content/results"
import { accessFormHref } from "@/content/site"
import { atAGlance } from "@/content/stats"
import { cn } from "@/lib/utils"

const ruledSection = "border-t-2 border-border py-22"

export default function HomePage() {
  return (
    <main>
      <Container>
        <section className="grid gap-10 pt-[clamp(56px,8vw,104px)] pb-12">
          <h1 className="m-0 ml-[-.058em] text-[clamp(46px,7.6vw,108px)] leading-[.98] tracking-[-.032em]">
            <span className="block">Movement is data.</span>
            <span className="block text-brand">Culture is context.</span>
          </h1>
          <AutoGrid min="380px" className="items-end gap-x-16 gap-y-7">
            <p className="m-0 max-w-[54ch] text-[clamp(17px,1.5vw,20px)] leading-[1.55]">
              Ampe-DB is a multimodal research dataset of two-person interactions from Ampe, a
              traditional Ghanaian game. It is built for human activity recognition, pose research
              and rigorous cross-person generalization studies.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={accessFormHref}>
                  Access the dataset <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/database">
                  Read the documentation <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </AutoGrid>
        </section>

        <VideoFigure
          layout="fig1"
          caption={[
            "Fig. 1 — Canonical record right_right_C179",
            "Original RGB video · rendered skeleton, 33 landmarks per player",
          ]}
        >
          <VideoTile clip={clips.c179} />
          <VideoTile clip={clips.c179s} />
        </VideoFigure>

        <AutoGrid
          as="section"
          min="170px"
          aria-label="Ampe-DB V1 at a glance"
          className="gap-x-6 gap-y-8 pt-16 pb-22"
        >
          {atAGlance.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} size="home" tone="brand" />
          ))}
        </AutoGrid>

        <section className={cn(ruledSection, "grid gap-14")}>
          <AutoGrid min="380px" className="gap-x-16 gap-y-6">
            <SectionHeading eyebrow="Rooted in living tradition" lines={["What is Ampe?"]} />
            <div className="grid content-start gap-4">
              <p className="m-0 text-[19px] leading-[1.6]">
                Ampe is a traditional Ghanaian game played by two people who jump, clap and reveal a
                leg position in a tightly coordinated interaction. Its patterns make it a valuable
                setting for studying paired movement rather than isolated single-person actions.
              </p>
              <p className="m-0 text-neutral-800">
                Ampe-DB turns short, carefully organized segments of natural gameplay into a resource
                for computer vision and human interaction research, while preserving the cultural
                context of the game. It is deliberately compact rather than large-scale.
              </p>
            </div>
          </AutoGrid>
          <VideoFigure
            layout="fig2"
            caption={["Fig. 2 — The four movement classes in V1", "Two different-leg and two same-leg configurations"]}
          >
            {[clips.c114, clips.c189, clips.c082, clips.c009].map((clip) => (
              <VideoTile key={clip.id} clip={clip} preload="metadata" tagClassName="tracking-[.04em]" />
            ))}
          </VideoFigure>
          <AutoGrid as="ol" min="280px" className="m-0 list-none gap-x-6 gap-y-8 p-0">
            {cycle.map((step) => (
              <li
                key={step.number}
                className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-t-2 border-border pt-3 text-[15px] leading-[1.55]"
              >
                <span className="font-extrabold text-brand-700 tabular-nums">{step.number}</span>
                <span>
                  <strong>{step.name}</strong> {step.text}
                </span>
              </li>
            ))}
          </AutoGrid>
        </section>

        <section className={ruledSection}>
          <AutoGrid min="380px" className="items-end gap-x-16 gap-y-6">
            <SectionHeading eyebrow="What’s in the release" lines={["One interaction.", "Five representations."]} />
            <div className="grid justify-items-start gap-3.5">
              <p className="m-0 max-w-[52ch] text-neutral-800">
                Every canonical record identifier maps to five aligned resources. Across 637 records
                that is 3,185 record-level files, before documentation, metadata, splits and paper
                materials.
              </p>
              <ArrowLink href="/database#db_structure">See the folder structure</ArrowLink>
            </div>
          </AutoGrid>
          <AutoGrid min="196px" className="mt-14 gap-x-6 gap-y-8">
            {representations.map((r) => (
              <article key={r.number} className="grid content-start gap-2.5 border-t-2 border-border pt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold tabular-nums">{r.number}</span>
                  <Badge variant={r.accent ? "accent" : "neutral"}>{r.tag}</Badge>
                </div>
                <h4 className="mt-1.5 mb-0 text-[19px]">{r.title}</h4>
                <p className="m-0 text-[14.5px] leading-[1.6] text-neutral-800">{r.text}</p>
                <code className="text-[12.5px] text-neutral-700">{r.folder}</code>
              </article>
            ))}
          </AutoGrid>
        </section>

        <AutoGrid as="section" min="400px" className={cn(ruledSection, "items-start gap-x-[72px] gap-y-14")}>
          <div className="grid content-start gap-5">
            <SectionHeading
              eyebrow="Baseline V1 benchmark"
              lines={["Testing generalization,", "not memorization."]}
              titleClassName="mt-5"
            />
            <p className="m-0 text-[19px] leading-[1.6]">
              The central question: do models learn transferable Ampe interaction patterns, or rely on
              familiarity with the same recordings, player pairings and participants?
            </p>
            <p className="m-0 text-neutral-800">
              Pose-based models transfer substantially better than frozen RGB features once evaluation
              moves from the duplicate-safe fixed split to unseen player pairs and held-out participants.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-6">
              <DropStat
                value={drop("four", "rgb", "fixed", "pair")}
                label="RGB — four-class Macro-F1, fixed split → unseen pairs"
                className="text-neutral-700"
              />
              <DropStat
                value={drop("four", "pose", "fixed", "pair")}
                label="Pose — the same shift, far smaller loss"
                className="text-brand"
              />
            </div>
            <div className="mt-2">
              <Button asChild variant="outline" className="gap-2.5 px-4 py-3 text-[15px]">
                <Link href="/research#rs_results">
                  See Baseline V1 results <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          <StaticChartPanel />
        </AutoGrid>

        <section className={ruledSection}>
          <AutoGrid min="380px" className="items-end gap-x-16 gap-y-6">
            <SectionHeading eyebrow="Getting started" lines={["Six steps for new users."]} />
            <p className="m-0 max-w-[52ch] text-neutral-800">
              From the terms to a reproducible, citable result. Each step links to the page that
              covers it in full.
            </p>
          </AutoGrid>
          <AutoGrid as="ol" min="300px" className="mt-14 mb-0 list-none gap-x-6 gap-y-10 p-0">
            {gettingStarted.map((step) => (
              <StepCard key={step.number} number={step.number} title={step.title} link={step.link}>
                {step.text}
              </StepCard>
            ))}
          </AutoGrid>
          <div className="mt-[72px] flex flex-wrap items-start gap-x-16 gap-y-6">
            <div className="flex-[1_1_240px]">
              <h4 className="m-0 text-[20px]">Recommended first files</h4>
              <p className="mt-2 mb-0 text-[15px] text-neutral-800">Open these before writing any code.</p>
            </div>
            <div className="min-w-0 flex-[3_1_520px]">
              <Table className="min-w-[520px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Why start here</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendedFiles.map((row) => (
                    <TableRow key={row.file}>
                      <TableCell>
                        <code>{row.file}</code>
                      </TableCell>
                      <TableCell>{row.why}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <AutoGrid as="section" min="380px" className={cn(ruledSection, "items-start gap-x-[72px] gap-y-10")}>
          <div className="grid content-start gap-4">
            <SectionHeading eyebrow="News & updates" lines={["Release notes."]} titleClassName="mt-4" />
            <p className="mt-2 mb-0 max-w-[46ch] text-[15px] text-neutral-800">
              Entries name the dataset version affected and separate documentation corrections from
              changes to distributed data or benchmark definitions. Historical benchmark results stay
              reproducible after documentation updates.
            </p>
          </div>
          <ol className="m-0 grid list-none p-0">
            {releaseNotes.map((note, index) => (
              <li
                key={index}
                className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-5 gap-y-2 border-t border-border py-5 first:border-t-2 last:border-b"
              >
                <span className="font-extrabold tabular-nums">{note.year}</span>
                <div className="grid gap-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge>{note.version}</Badge>
                    <Badge variant="accent">{note.type}</Badge>
                  </div>
                  <p className="m-0">{note.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </AutoGrid>

        <AutoGrid
          as="section"
          min="380px"
          id="home_cite"
          className={cn(ruledSection, "items-start gap-x-[72px] gap-y-10")}
        >
          <div className="grid content-start gap-4">
            <SectionHeading eyebrow="Citation & acknowledgements" lines={["Cite Ampe-DB."]} titleClassName="mt-4" />
            <p className="mt-2 mb-0 max-w-[46ch] text-[15px] text-neutral-800">
              The <code>CITATION.cff</code> file at the release root is the source of truth. Do not
              invent a DOI, repository identifier or publisher field that has not been assigned in the
              release.
            </p>
            <dl className="mt-4 mb-0 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 text-[15px] leading-[1.5]">
              {citationFacts.map((fact) => (
                <div key={fact.term} className="contents">
                  <dt className="text-neutral-700">{fact.term}</dt>
                  <dd className="m-0">
                    {fact.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid gap-5">
            <Card className="gap-4 p-7">
              <Eyebrow size="sm" tone="neutral">
                Suggested plain-text citation
              </Eyebrow>
              <p className="m-0 text-[18px] leading-[1.6]">
                {citation.before}
                <em>{citation.title}</em>
                {citation.after}
              </p>
              <div>
                <CopyButton text={citationText} label="Copy citation" />
              </div>
            </Card>
            <Card className="gap-4 p-7">
              <Eyebrow size="sm" tone="neutral">
                Suggested acknowledgement
              </Eyebrow>
              <p className="m-0 text-[16px] leading-[1.65]">{acknowledgementText}</p>
              <div>
                <CopyButton text={acknowledgementText} label="Copy acknowledgement" />
              </div>
            </Card>
          </div>
        </AutoGrid>
      </Container>

      <section className="bg-brand text-background">
        <Container className="py-[clamp(72px,9vw,112px)]">
          <h2 className="m-0 ml-[-.058em] text-[clamp(42px,6vw,84px)] leading-none tracking-[-.03em] text-background">
            <span className="block">Open to everyone.</span>
            <span className="block">Free to download.</span>
          </h2>
          <div className="mt-11">
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border-background text-background hover:bg-background/16"
            >
              <Link href={accessFormHref}>
                Complete the access form <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </main>
  )
}

// Home drop stat: like a Stat, but with a sentence-case label.
function DropStat({ value, label, className }: { value: string; label: string; className: string }) {
  return (
    <div className="border-t-2 border-border pt-3.5">
      <div
        className={cn(
          "text-[clamp(34px,3.4vw,46px)] leading-none font-extrabold tracking-[-.02em] tabular-nums",
          className
        )}
      >
        {value}
      </div>
      <div className="mt-2.5 text-[13px] leading-[1.45] text-neutral-800">{label}</div>
    </div>
  )
}
