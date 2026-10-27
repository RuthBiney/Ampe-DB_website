import type { Metadata } from "next"
import type * as React from "react"
import Link from "next/link"

import { FeatureEquation } from "@/components/database/feature-equation"
import { FolderTree } from "@/components/database/folder-tree"
import { LabelMatrix } from "@/components/database/label-matrix"
import { LandmarkIndex } from "@/components/database/landmark-index"
import { RecordPathBuilder } from "@/components/database/record-path-builder"
import { AutoGrid } from "@/components/patterns/auto-grid"
import { BulletList } from "@/components/patterns/bullet-list"
import { Callout } from "@/components/patterns/callout"
import { CodeBlock, CodeList } from "@/components/patterns/code-list"
import { DocLayout } from "@/components/patterns/doc-layout"
import { DocSection, Lead, Secondary, SubHeading } from "@/components/patterns/doc-section"
import { LabeledBlock } from "@/components/patterns/labeled-block"
import { Legend, LegendSwatch } from "@/components/patterns/legend"
import { PageHeader } from "@/components/patterns/page-header"
import { ProportionBar } from "@/components/patterns/proportion-bar"
import { SectionRail } from "@/components/patterns/section-rail"
import { Stat } from "@/components/patterns/stat"
import { Container } from "@/components/site/container"
import { Eyebrow } from "@/components/site/eyebrow"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { movementTokens } from "@/lib/record-path"
import { databaseRail, railItem } from "@/content/sections"

export const metadata: Metadata = { title: "Database" }

const section = (id: string) => {
  const { number, label } = railItem(databaseRail, id)
  return { id, number, title: label }
}

const formats = [
  ["RGB video", "MP4 + embedded audio", "Original segmented gameplay"],
  ["Normalized pose", "CSV", "Body-normalized landmarks and visibility"],
  ["Skeleton exports", "CSV and JSON", "Pixel-coordinate landmark geometry"],
  ["Skeleton visualization", "MP4", "Derivative inspection videos"],
  ["Annotations & metadata", "CSV", "Labels, pairs, provenance and statistics"],
  ["Release documentation", "Text / PDF / DOCX", "As distributed with the release"],
] as const

const naming = [
  ["RGB video", "videos/", ".mp4"],
  ["Normalized pose", "pose/", ".csv"],
  ["Skeleton CSV", "skeleton/csv/keypoints_", ".csv"],
  ["Skeleton JSON", "skeleton/json/keypoints_", ".json"],
  ["Skeleton video", "skeleton/videos/skeleton_", ".mp4"],
] as const

const poseColumns = [
  ["frame", "Frame index within the clip"],
  ["player_id", "Player for the row — resolve participant identity through the mapping files"],
  ["landmark_index", "MediaPipe landmark index, 0–32"],
  ["x_norm", "Body-normalized horizontal coordinate"],
  ["y_norm", "Body-normalized vertical coordinate"],
  ["visibility", "Landmark visibility"],
] as const

const pairFiles = [
  ["metadata/participants.csv", "Pseudonymous participant-level release information"],
  ["metadata/participant_pairs.csv", "Pair structure used in the corpus"],
  ["metadata/clip_participant_mapping.csv", "Canonical clip-to-participant and clip-to-pair mapping"],
] as const

const coverage = [
  "RGB video",
  "Normalized pose CSV",
  "Skeleton CSV",
  "Skeleton JSON",
  "Skeleton video",
] as const

const indexFiles = [
  "ampe_db_v1_schema.csv",
  "ampe_db_v1_data_dictionary.csv",
  "participants.csv",
  "participant_pairs.csv",
  "clip_participant_mapping.csv",
  "dataset_statistics.csv",
  "movement_distribution_summary.csv",
] as const

export default function DatabasePage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow="04 — Database"
          lines={["Technical", "documentation."]}
          lead="What was recorded, how records are organized and how each representation should be interpreted — written for researchers building loaders and baselines."
        />
        <DocLayout rail={<SectionRail groups={databaseRail} />}>
          <DocSection {...section("db_overview")}>
            <Lead>
              Ampe-DB captures two-person interactions from Ampe, a Ghanaian game involving
              coordinated jumping, clapping and a leg-position reveal. The benchmark treats each
              segmented clip as a paired movement configuration rather than a solo action.
            </Lead>
            <Secondary>
              The dataset is deliberately compact rather than large-scale. Its contribution is the
              combination of culturally grounded interaction, explicit participant/pair metadata,
              aligned RGB and pose representations, and leakage-aware generalization protocols.
            </Secondary>
            <AutoGrid min="130px" className="mt-10 gap-x-5 gap-y-6">
              <Stat value="637" label="Canonical records" />
              <Stat value="15" label="Pseudonymous participants" />
              <Stat value="11" label="Unordered pairs" />
              <Stat value="14" label="Ordered pair configurations" />
              <Stat value="557" label="Unique RGB/audio hashes" />
            </AutoGrid>
            <div className="mt-11 grid gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h4 className="m-0 text-[19px]">Exact-duplicate provenance</h4>
                <span className="text-[13px] text-neutral-700">637 canonical records</span>
              </div>
              <ProportionBar
                label="557 unique audiovisual hashes and 80 redundant duplicate records"
                segments={[
                  { count: 557, className: "bg-neutral-900" },
                  { count: 80, className: "bg-brand" },
                ]}
              />
              <Legend className="gap-x-6">
                <LegendSwatch swatchClassName="bg-neutral-900" className="gap-2">
                  557 unique complete-file hashes
                </LegendSwatch>
                <LegendSwatch swatchClassName="bg-brand" className="gap-2">
                  80 redundant records
                </LegendSwatch>
              </Legend>
              <Secondary className="mt-1.5 text-[15px]">
                78 exact-duplicate groups involve 158 records, so 80 are redundant beyond one
                representative per group. They are retained for provenance; official splits keep
                each group within a single partition.
              </Secondary>
            </div>
            <SubHeading className="mb-2.5">Movement labels</SubHeading>
            <Secondary>
              Each record carries one of four movement classes — <code>left_left</code>,{" "}
              <code>left_right</code>, <code>right_left</code> or <code>right_right</code> — and a
              binary relation label derived from it. <Link href="#db_labels">Label spaces →</Link>
            </Secondary>
            <Callout label="Outcome caution" className="mt-7">
              Baseline V1 does not use an independently annotated winner label as a separate benchmark
              target. Gameplay outcome can be derived only when the applicable Ampe rule or player
              role is defined.
            </Callout>
          </DocSection>

          <DocSection {...section("db_structure")}>
            <Lead className="mb-7">
              The publication package is organized around eight core folders. The root also holds the
              release README, citation file, research data use agreement and license.
            </Lead>
            <FolderTree />
            <SubHeading className="mb-2.5">Canonical 1:1 record representations</SubHeading>
            <Secondary>
              Each canonical clip identifier maps to five record-level representations. Across 637
              records this produces 3,185 record-level files, before documentation, metadata, split,
              paper and access files are counted.
            </Secondary>
            <SubHeading>Core metadata files</SubHeading>
            <CodeList
              min="300px"
              files={[
                "metadata/ampe_db_v1_manifest.csv",
                "metadata/ampe_db_v1_schema.csv",
                "metadata/ampe_db_v1_data_dictionary.csv",
                "metadata/participants.csv",
                "metadata/participant_pairs.csv",
                "metadata/clip_participant_mapping.csv",
                "metadata/dataset_statistics.csv",
                "metadata/movement_distribution_summary.csv",
              ]}
            />
          </DocSection>

          <DocSection {...section("db_formats")} titleClassName="mb-6">
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formats.map(([component, format, meaning]) => (
                  <TableRow key={component}>
                    <TableCell className="font-extrabold">{component}</TableCell>
                    <TableCell>{format}</TableCell>
                    <TableCell>{meaning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <SubHeading className="mb-2.5">RGB video and audio</SubHeading>
            <Secondary>
              Canonical media are MP4 clips with synchronized embedded audio. Frame rate and codec
              vary across canonical media and are documented in metadata.
            </Secondary>
            <Callout tone="important" label="Important" className="mt-5">
              Do not describe V1 as a uniform 60 FPS dataset. Read frame rate and codec from the
              release metadata for every clip.
            </Callout>
            <SubHeading className="mb-2.5">Normalized pose CSV</SubHeading>
            <Secondary className="mb-3.5">
              The canonical pose representation is long-form, with up to 33 MediaPipe landmarks per
              player per frame:
            </Secondary>
            <CodeBlock>frame, player_id, landmark_index, x_norm, y_norm, visibility</CodeBlock>
            <BulletList className="mt-[18px] max-w-[70ch]">
              <li>
                <code>x_norm</code> and <code>y_norm</code> are body-normalized coordinates, not
                simple [0, 1] image coordinates.
              </li>
              <li>Normalization uses the hip midpoint as origin and a shoulder-to-hip torso scale.</li>
              <li>No rotation or reflection normalization is applied.</li>
              <li>
                Missing detections and incomplete player-frame groups are handled explicitly during
                model preparation using presence indicators.
              </li>
            </BulletList>
            <SubHeading className="mb-2.5">Skeleton exports</SubHeading>
            <Secondary>
              Skeleton CSV and JSON files preserve pixel-space landmark geometry for visualization and
              reconstruction. Skeleton MP4 files are derivative visualizations for inspection,
              debugging, demonstration and publication figures — not a separate ground-truth modality.
            </Secondary>
          </DocSection>

          <DocSection {...section("db_naming")}>
            <Lead className="mb-6">
              The movement token and <code>C###</code> identifier form the canonical record key used
              across all representations.
            </Lead>
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Representation</TableHead>
                  <TableHead>Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {naming.map(([label, prefix, extension]) => (
                  <TableRow key={label}>
                    <TableCell className="font-extrabold">{label}</TableCell>
                    <TableCell>
                      <code>
                        {prefix}
                        <strong className="text-brand-700">left_right_C003</strong>
                        {extension}
                      </code>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <RecordPathBuilder />
            <SubHeading>Movement tokens</SubHeading>
            <div className="flex flex-wrap gap-2">
              {movementTokens.map((token) => (
                <Badge key={token} mono className="px-3 py-[5px] text-[13px]">
                  {token}
                </Badge>
              ))}
            </div>
            <Callout label="Interpretation" className="mt-7">
              Files sharing the same movement token and <code>C###</code> identifier correspond to the
              same canonical record. Obtain participant identity from the mapping files — never from
              filename token order alone.
            </Callout>
          </DocSection>

          <DocSection {...section("db_pose")}>
            <Lead>
              Ampe-DB V1 uses the standard 33-landmark MediaPipe pose representation for each
              represented player.
            </Lead>
            <Secondary>
              The release preserves the full landmark index rather than the 21-keypoint subset
              described in an earlier draft.
            </Secondary>
            <SubHeading className="mb-2">Pose CSV schema</SubHeading>
            <Table className="min-w-[520px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[34%]">Column</TableHead>
                  <TableHead>Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poseColumns.map(([column, meaning]) => (
                  <TableRow key={column}>
                    <TableCell>
                      <code>{column}</code>
                    </TableCell>
                    <TableCell>{meaning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Secondary className="mt-4 text-[15px]">
              A complete frame with two detected players can contain up to 66 landmark rows; missing
              detections mean some frame-player groups may be incomplete.
            </Secondary>
            <SubHeading className="mb-4">Normalization</SubHeading>
            <AutoGrid min="190px" className="gap-6">
              {[
                ["Origin", "Hip midpoint"],
                ["Scale", "Shoulder-to-hip Euclidean distance"],
                ["Not applied", "Rotation or reflection"],
              ].map(([label, value]) => (
                <LabeledBlock
                  key={label}
                  label={label}
                  value={value}
                  valueClassName="text-[18px] leading-[1.3]"
                />
              ))}
            </AutoGrid>
            <SubHeading className="mb-4">Baseline V1 model-ready sequence</SubHeading>
            <FeatureEquation />
            <SubHeading className="mb-1.5">Landmark index</SubHeading>
            <Secondary className="mb-4 text-[15px]">
              The standard MediaPipe pose landmarks, as stored in <code>landmark_index</code>. Marked:
              the shoulder and hip landmarks that define the torso used for normalization.
            </Secondary>
            <LandmarkIndex />
            <SubHeading className="mb-2.5">Skeleton outputs</SubHeading>
            <Secondary>
              Skeleton CSV and JSON expose the pixel-coordinate geometry used for rendered skeleton
              visualization. Skeleton videos are convenient inspection layers, not substitutes for the
              original RGB clip or the canonical pose CSV.
            </Secondary>
          </DocSection>

          <DocSection {...section("db_labels")}>
            <Lead className="mb-7">
              <code>annotations/ampe_db_v1_labels.csv</code> stores the V1 clip-level supervised
              labels: a four-class movement label and a binary movement relation derived from it.
            </Lead>
            <LabelMatrix />
            <p className="mt-3 mb-0 text-[13px] text-neutral-700">
              Four classes (cells) and the binary relation they map to: the diagonal is the same leg
              configuration, the off-diagonal a different one.
            </p>
            <SubHeading className="mb-2.5">Participant and pair mappings</SubHeading>
            <Secondary>
              <code>clip_participant_mapping.csv</code> links each canonical clip to pseudonymous
              player IDs, ordered and unordered pair identifiers, and movement fields. Participant
              identity is distributed separately from the movement label.
            </Secondary>
            <SubHeading className="mb-2.5">Manifest and duplicate provenance</SubHeading>
            <Secondary>
              The 637-row canonical manifest records media properties and complete-file RGB/audio
              SHA-256 values used to identify exact-duplicate groups.
            </Secondary>
            <Callout tone="important" label="Important" className="mt-5">
              Do not silently delete duplicates and then report results as the frozen V1 benchmark.
              Use the provided protocol, or document any alternative preprocessing clearly.
            </Callout>
          </DocSection>

          <DocSection {...section("db_pairs")} titleClassName="mb-7">
            <AutoGrid min="170px" className="gap-6">
              <Stat value="15" label="Pseudonymous participants" size={40} tone="brand" labelClassName="leading-[1.7]" />
              <Stat value="11" label="Unordered participant pairs" size={40} tone="brand" labelClassName="leading-[1.7]" />
              <Stat value="14" label="Ordered pair configurations" size={40} tone="brand" labelClassName="leading-[1.7]" />
            </AutoGrid>
            <SubHeading className="mb-2">Files to use</SubHeading>
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Contents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pairFiles.map(([file, contents]) => (
                  <TableRow key={file}>
                    <TableCell>
                      <code>{file}</code>
                    </TableCell>
                    <TableCell>{contents}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <SubHeading className="mb-2.5">Why pair information matters</SubHeading>
            <Lead className="mb-0">
              Pair identity is essential to the V1 evaluation design. The primary generalization
              benchmark holds out participant pairs as pairs, while individual participants may still
              appear with different partners in training for a given fold.
            </Lead>
            <Callout label="Privacy" className="mt-7">
              Only anonymized information that is part of the approved release is presented. Real
              names, direct identifiers, consent records and anything that could enable
              re-identification are never displayed.
            </Callout>
          </DocSection>

          <DocSection {...section("db_recording")} titleClassName="mb-6">
            <SubHeading className="mt-0">Capture design</SubHeading>
            <BulletList className="max-w-[70ch]">
              <li>Single fixed frontal camera viewpoint.</li>
              <li>Two players visible together within the frame.</li>
              <li>
                Source recordings captured natural Ampe play and were later segmented into canonical
                interactions.
              </li>
              <li>Embedded audio retains clap, step and vocal cues from the source recording.</li>
            </BulletList>
            <SubHeading className="mb-2.5">Camera equipment</SubHeading>
            <Secondary>
              Recording documentation identifies Blackmagic and Sony A7 III cameras in the source
              capture workflow. Rely on per-file media metadata rather than assuming one uniform
              camera profile for every canonical clip.
            </Secondary>
            <SubHeading className="mb-4">Media properties</SubHeading>
            <AutoGrid min="260px" className="gap-6">
              <MediaProperty label="Frame rate">
                <Badge variant="accent" className="font-semibold">
                  30 FPS · most clips
                </Badge>
                <Badge>24 FPS</Badge>
                <Badge>60 FPS</Badge>
              </MediaProperty>
              <MediaProperty label="Video codec">
                <Badge>H.264</Badge>
                <Badge>HEVC</Badge>
              </MediaProperty>
            </AutoGrid>
            <Secondary className="mt-4 text-[15px]">
              V1 media properties are not completely uniform. Read the release metadata instead of
              hard-coding 60 FPS or a single codec.
            </Secondary>
            <SubHeading className="mb-2.5">Why the frontal view matters</SubHeading>
            <Secondary>
              The fixed frontal view keeps both players visible, supports consistent 2D pose
              extraction, and preserves the relative timing and leg-position structure of Ampe without
              a multi-view motion-capture rig.
            </Secondary>
          </DocSection>

          <DocSection {...section("db_manifest")} title="Release manifest & file index">
            <Lead className="mb-7">
              <code>metadata/ampe_db_v1_manifest.csv</code> is the central 637-row record inventory.
              Use it to join canonical clip identifiers, media properties, duplicate provenance and
              release-level record information.
            </Lead>
            <SubHeading className="mt-0 mb-2">Record-level coverage</SubHeading>
            <Table className="min-w-[420px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Representation</TableHead>
                  <TableHead className="text-right">Expected V1 records</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coverage.map((representation) => (
                  <TableRow key={representation}>
                    <TableCell>{representation}</TableCell>
                    <TableCell className="text-right tabular-nums">637</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="border-b-2 font-extrabold">Record-level files</TableCell>
                  <TableCell className="border-b-2 text-right font-extrabold text-brand-700 tabular-nums">
                    3,185
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <SubHeading>Supporting index files</SubHeading>
            <CodeList min="260px" files={indexFiles} />
            <Callout label="Integrity note" className="mt-8">
              The manifest includes the RGB/audio SHA-256 used for exact-duplicate provenance. Use
              separate archive or package checksum files, when supplied with a download, for
              transfer-integrity verification.{" "}
              <Link href="/getting-the-database#gt_verify">Verify download →</Link>
            </Callout>
          </DocSection>
        </DocLayout>
      </Container>
    </main>
  )
}

// Database 04.8: a 2px-ruled label above a row of tags.
function MediaProperty({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid content-start gap-2.5 border-t-2 border-border pt-3.5">
      <Eyebrow size="sm" tone="neutral">
        {label}
      </Eyebrow>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
