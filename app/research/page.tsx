import type { Metadata } from "next"
import type * as React from "react"
import Link from "next/link"

import { AutoGrid } from "@/components/patterns/auto-grid"
import { BulletList } from "@/components/patterns/bullet-list"
import { Callout } from "@/components/patterns/callout"
import { CopyButton } from "@/components/patterns/copy-button"
import { DocLayout } from "@/components/patterns/doc-layout"
import { DocSection, Lead, Secondary, SubHeading } from "@/components/patterns/doc-section"
import { LabeledBlock } from "@/components/patterns/labeled-block"
import { NumberedList } from "@/components/patterns/numbered-list"
import { PageHeader } from "@/components/patterns/page-header"
import { SectionRail } from "@/components/patterns/section-rail"
import { Stat } from "@/components/patterns/stat"
import { StepCard } from "@/components/patterns/step-card"
import { TaskChart } from "@/components/patterns/task-chart"
import { ProtocolLadder } from "@/components/research/protocol-ladder"
import { ResultsTable } from "@/components/research/results-table"
import { Container } from "@/components/site/container"
import { Eyebrow } from "@/components/site/eyebrow"
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
import { citation, citationText } from "@/content/citation"
import { railItem, researchRail } from "@/content/sections"
import { movementTokens } from "@/lib/record-path"

export const metadata: Metadata = { title: "Research" }

const section = (id: string) => {
  const { number, label } = railItem(researchRail, id)
  return { id, number, title: label }
}

const excluded = [
  "Synchronization detection",
  "Temporal lag regression",
  "Winner / outcome classification",
  "Landing-event prediction",
  "Session classification",
  "Event-aligned tasks",
] as const

const lockedModels = [
  ["Majority", "Predict the training-set majority class."],
  [
    "RGB",
    "Frozen Kinetics-400 R(2+1)D-18; 16 deterministic, uniformly sampled RGB frames; 512-D frozen video feature; MLP 512 → 128 → output.",
  ],
  [
    "Pose",
    "32 temporal steps; 200 features per step; 2-layer bidirectional GRU with 128 hidden units per direction.",
  ],
  [
    "RGB + Pose",
    "Probability-level late fusion. Alpha chosen on validation Macro-F1 from {0, 0.25, 0.50, 0.75, 1.0}; ties favor the lower RGB weight.",
  ],
] as const

const refinement = [
  ["Screen", "Check source recordings for usable two-player visibility and stable capture."],
  ["Segment", "Cut continuous play into short clips around the jump–clap–leg reveal cycle."],
  ["Label", "Assign the canonical movement token."],
  ["Trim", "Retain enough temporal context around the interaction."],
] as const

const limitations = [
  ["Scale", "637 canonical clips from 15 participants and 11 unordered pairs is focused rather than large-scale."],
  [
    "Exact duplicates",
    "557 unique complete-file RGB/audio hashes across 637 records. Provenance is transparent and controlled in the fixed split, but duplicate content remains a source-corpus limitation.",
  ],
  ["2D front view", "Pose provides no depth and should not be treated as 3D biomechanics or marker-based motion capture."],
  ["Pose estimation noise", "Fast jumps, overlap and low-confidence detections can produce missing or imperfect landmarks."],
  ["Non-uniform media", "Most clips are 30 FPS, with smaller 24 FPS and 60 FPS subsets; H.264 and HEVC both occur."],
  [
    "Participant-held-out coverage",
    "Only participants with sufficient class coverage are eligible: 6 for the four-class task and 8 for the binary diagnostic.",
  ],
  [
    "Fusion stability",
    "Simple late fusion is not uniformly superior to pose, and some RGB-heavy alpha selections are unstable in diagnostics.",
  ],
  ["Cultural scope", "The corpus does not represent all Ampe variants or African movement broadly."],
  [
    "Skeleton visualizations",
    "Derivative QC artifacts; they do not certify perfect anatomical reconstruction in every frame.",
  ],
] as const

export default function ResearchPage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow="05 — Research"
          lines={["Generalization across", "people and pairings."]}
          lead="Ampe-DB Baseline V1 asks whether models learn transferable interaction patterns rather than familiar recordings, player pairings or individual participants. Tasks, protocols, locked models and results are frozen."
        />
        <DocLayout rail={<SectionRail groups={researchRail} />}>
          <DocSection {...section("rs_tasks")} titleClassName="mb-7">
            <AutoGrid min="300px" className="gap-8">
              <TaskCard
                eyebrow="Task 1"
                title="Four-class movement configuration"
                text="Predict the pair’s leg configuration from a two-person clip."
              >
                {movementTokens.map((token) => (
                  <Badge key={token} mono>
                    {token}
                  </Badge>
                ))}
              </TaskCard>
              <TaskCard
                eyebrow="Task 2"
                title="Binary movement relation"
                text="Predict same versus different leg configuration. The binary target is derived deterministically from the four classes."
              >
                <Badge mono variant="accent">
                  same_leg_configuration
                </Badge>
                <Badge mono>different_leg_configuration</Badge>
              </TaskCard>
            </AutoGrid>
            <AutoGrid
              min="240px"
              className="mt-9 items-baseline gap-x-8 gap-y-4 border-t border-border pt-5"
            >
              <div>
                <Eyebrow size="sm" tone="neutral">
                  Primary metric
                </Eyebrow>
                <div className="mt-1.5 text-[30px] leading-[1.1] font-extrabold tracking-[-.02em]">
                  Macro-F1
                </div>
              </div>
              <Secondary>
                Macro-F1 is the primary V1 metric for both tasks. A majority-class predictor is
                retained as a reference comparator.
              </Secondary>
            </AutoGrid>
            <SubHeading>Not part of frozen Baseline V1</SubHeading>
            <div className="flex flex-wrap gap-1.5">
              {excluded.map((task) => (
                <Badge key={task} variant="outline-muted">
                  {task}
                </Badge>
              ))}
            </div>
            <Secondary className="mt-3.5 text-[15px]">
              These appeared in earlier planning but are not published as frozen Baseline V1
              benchmark results.
            </Secondary>
          </DocSection>

          <DocSection {...section("rs_protocols")} titleClassName="mb-3">
            <Lead className="mb-7">
              A generalization ladder: each step moves the test set further from what the model saw
              in training.
            </Lead>
            <ProtocolLadder />
            <Callout label="Terminology" className="mt-8">
              Say <em>pair-held-out</em> for the primary cross-pair protocol and{" "}
              <em>participant-held-out diagnostic</em> for the unseen-participant analysis. Do not call
              the latter participant-disjoint: the held-out participant can interact at test time
              with partners seen during training.
            </Callout>
            <Secondary className="mt-6">
              The protocols distinguish fitting familiar players from learning movement structure that
              transfers to unseen pairings and participants.
            </Secondary>
          </DocSection>

          <DocSection {...section("rs_results")} titleClassName="mb-6">
            <SubHeading className="mt-0 mb-2">Locked models</SubHeading>
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Model</TableHead>
                  <TableHead>V1 configuration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lockedModels.map(([model, configuration]) => (
                  <TableRow key={model}>
                    <TableCell className="font-extrabold">{model}</TableCell>
                    <TableCell>{configuration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AutoGrid min="220px" className="mt-5 gap-5">
              <LabeledBlock
                label="Seeds"
                value="17 · 29 · 43"
                valueClassName="text-[18px] tabular-nums"
                className="content-normal gap-1 pt-3"
              />
              <LabeledBlock
                label="Horizontal flip"
                value="Disabled — left/right labels are semantic"
                valueClassName="text-[18px]"
                className="content-normal gap-1 pt-3"
              />
            </AutoGrid>
            <div className="mt-11">
              <TaskChart />
            </div>
            <SubHeading className="mb-2">Macro-F1, all protocols</SubHeading>
            <ResultsTable />
            <p className="mt-2.5 mb-0 text-[13px] text-neutral-700">Highest value per row in bold.</p>
            <SubHeading>Interpretation</SubHeading>
            <BulletList className="max-w-[70ch]">
              <li>RGB and pose both perform strongly on the duplicate-safe fixed reference split.</li>
              <li>
                Under pair-held-out evaluation, pose retains substantially more performance than
                frozen RGB.
              </li>
              <li>Under participant-held-out diagnostics, pose again transfers better than RGB.</li>
              <li>Fusion is not consistently better than pose alone, especially on the binary task.</li>
            </BulletList>
            <p className="mt-7 mb-0 max-w-[34ch] text-[clamp(22px,2.2vw,28px)] leading-[1.3] font-extrabold tracking-[-.01em]">
              The headline V1 finding is about generalization across people and pairings — not high
              fixed-split accuracy.
            </p>
          </DocSection>

          <DocSection {...section("rs_refine")}>
            <Lead className="mb-8">
              Source gameplay recordings are refined into short canonical clips that preserve the
              complete Ampe interaction, with consistent record identifiers for annotation, pose
              extraction, skeleton rendering and benchmarking.
            </Lead>
            <AutoGrid as="ol" min="150px" className="m-0 list-none gap-x-5 gap-y-7 p-0">
              {refinement.map(([title, text], index) => (
                <StepCard key={title} size="sm" number={`0${index + 1}`} title={title}>
                  {text}
                </StepCard>
              ))}
              <StepCard size="sm" number="05" title="Verify">
                Review visually; keep the <code>C###</code> identifier across all downstream
                representations.
              </StepCard>
            </AutoGrid>
            <SubHeading className="mb-2.5">Publication principle</SubHeading>
            <Secondary>
              Refinement preserves the natural movement dynamics of the source interaction. This
              documentation describes the published V1 pipeline, not earlier exploratory segmentation
              claims that are not reflected in the frozen release.
            </Secondary>
          </DocSection>

          <DocSection {...section("rs_extract")}>
            <Lead className="mb-6">
              V1 uses 33-landmark MediaPipe pose outputs for each represented player and stores the
              canonical normalized representation as long-form CSV rows.
            </Lead>
            <SubHeading className="mt-0 mb-1">Processing</SubHeading>
            <NumberedList
              numberWidth={48}
              className="max-w-[760px]"
              items={[
                "Process canonical RGB clips frame by frame.",
                "Maintain two-person track identity through the clip using the extraction/tracking pipeline and release mappings.",
                "Store normalized x/y coordinates and visibility values in the canonical pose CSV.",
                "Export corresponding pixel-coordinate skeleton CSV and JSON for rendering.",
                "Generate rendered skeleton MP4 videos for qualitative inspection.",
              ]}
            />
            <Callout tone="important" label="Identity caution" className="mt-8">
              Do not define participant identity only by “leftmost person = Player A” across the
              dataset. Participant and pair IDs in the release mapping files are authoritative.
            </Callout>
            <SubHeading className="mb-2.5">Missing detections</SubHeading>
            <Secondary>
              Pose estimation is imperfect and some frame-player groups are incomplete. Baseline V1
              model preparation includes presence indicators rather than assuming all 66
              player-landmark positions are observed in every frame.
            </Secondary>
          </DocSection>

          <DocSection {...section("rs_qc")} titleClassName="mb-6">
            <SubHeading className="mt-0">Release-level QC goals</SubHeading>
            <BulletList className="max-w-[70ch]">
              <li>
                1:1 identifier coverage across RGB, normalized pose, skeleton CSV, skeleton JSON and
                skeleton video.
              </li>
              <li>Readable RGB media with synchronized embedded audio.</li>
              <li>Pose/skeleton frame, player and landmark schema consistency.</li>
              <li>Participant/pair mappings consistent with canonical clip IDs.</li>
              <li>Exact-duplicate groups documented and kept within fixed benchmark partitions.</li>
              <li>Split definitions and label files validated against the canonical manifest.</li>
            </BulletList>
            <SubHeading className="mb-2.5">Skeleton review</SubHeading>
            <Secondary>
              Rendered skeleton motion is compared with the original RGB footage. Structural checks
              validate frame counts and CSV/JSON consistency, while manual review identifies identity
              swapping, limb misalignment, tracking drift or localized anatomy errors. Repairs are
              localized and revalidated.
            </Secondary>
            <SubHeading className="mb-4">Benchmark freeze</SubHeading>
            <AutoGrid min="150px" className="gap-x-5 gap-y-6">
              <Stat value="35" label="Freeze checks passed" size={36} tone="brand" />
              <Stat value="0" label="Failures" size={36} tone="brand" />
              <Stat value="288" label="Metric rows" size={36} />
              <Stat value="72" label="Prediction runs" size={36} />
              <Stat value="144" label="Trained RGB/pose models" size={36} />
            </AutoGrid>
            <Secondary className="mt-5 text-[15px]">
              Ampe-DB Baseline V1 passed 35 freeze checks with 0 failures, using fixed random seeds 17,
              29 and 43.
            </Secondary>
          </DocSection>

          <DocSection {...section("rs_limits")} titleClassName="mb-3">
            <Lead className="mb-7">
              Documented openly so results can be interpreted within the scope of the release.
            </Lead>
            <dl className="m-0 grid">
              {limitations.map(([term, description], index) => (
                <div
                  key={term}
                  className={`flex flex-wrap gap-x-8 gap-y-1 border-border py-4 ${index === 0 ? "border-t-2" : "border-t last:border-b"}`}
                >
                  <dt className="flex-[1_1_200px] font-extrabold">{term}</dt>
                  <dd className="m-0 flex-[2_1_380px] text-neutral-800">{description}</dd>
                </div>
              ))}
            </dl>
          </DocSection>

          <DocSection {...section("rs_pubs")} titleClassName="mb-7">
            <article className="grid gap-3.5 bg-surface p-[clamp(20px,3vw,32px)]">
              <Eyebrow size="sm">Dataset paper · 2026</Eyebrow>
              <h3 className="m-0 max-w-[36ch] text-[clamp(21px,2.2vw,27px)] leading-[1.25]">
                {citation.title.replace(/\.$/, "")}
              </h3>
              <p className="m-0 text-[15px] text-neutral-800">
                Ruth Senior Biney · Isaac Kojo Yedonu Aboah — Young Africans Research Academy (YARA)
              </p>
              <div className="mt-1 flex flex-wrap gap-2.5">
                <CopyButton text={citationText} label="Copy citation" />
                <Button asChild variant="ghost">
                  <Link href="/#home_cite">Citation guidance</Link>
                </Button>
              </div>
            </article>
            <SubHeading className="mb-2.5">Citation source</SubHeading>
            <Secondary>
              Use the release <code>CITATION.cff</code> file for authoritative citation metadata,
              including any repository or DOI fields once assigned.
            </Secondary>
            <SubHeading className="mb-2.5">Contextual literature</SubHeading>
            <Secondary>
              The research paper situates Ampe-DB alongside established human action, human–human
              interaction, dance and motion, and pose-estimation datasets. Refer to the paper’s
              bibliography for the full reference list.
            </Secondary>
          </DocSection>
        </DocLayout>
      </Container>
    </main>
  )
}

// Research 05.1: a 2px ink-ruled task card with its label tags.
function TaskCard({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string
  title: string
  text: string
  children: React.ReactNode
}) {
  return (
    <article className="grid content-start gap-3 border-t-2 border-foreground pt-[18px]">
      <Eyebrow size="sm">{eyebrow}</Eyebrow>
      <h3 className="m-0 text-[24px] leading-[1.2]">{title}</h3>
      <Secondary>{text}</Secondary>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </article>
  )
}
