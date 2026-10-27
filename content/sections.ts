// Section IDs, numbers and rail labels for every doc page (README → Routes
// and section IDs). Other pages link to these IDs — keep them stable.

import type { RailGroup, RailItem } from "@/components/patterns/section-rail"
import { faqTopics } from "@/content/faq"

export const termsRail: readonly RailGroup[] = [
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

export const gettingRail: readonly RailGroup[] = [
  {
    label: "On this page",
    items: [
      { id: "gt_access", number: "03.1", label: "Access the dataset" },
      { id: "gt_receive", number: "03.2", label: "What you receive" },
      { id: "gt_download", number: "03.3", label: "Download instructions" },
      { id: "gt_verify", number: "03.4", label: "Verify download & checksums" },
      { id: "gt_version", number: "03.5", label: "Version information" },
    ],
  },
]

export const databaseRail: readonly RailGroup[] = [
  {
    label: "On this page",
    items: [
      { id: "db_overview", number: "04.1", label: "Dataset overview" },
      { id: "db_structure", number: "04.2", label: "Database structure" },
      { id: "db_formats", number: "04.3", label: "Data formats" },
      { id: "db_naming", number: "04.4", label: "File naming rules" },
      { id: "db_pose", number: "04.5", label: "Pose & skeleton format" },
      { id: "db_labels", number: "04.6", label: "Annotation & metadata" },
      { id: "db_pairs", number: "04.7", label: "Participants & pairs" },
      { id: "db_recording", number: "04.8", label: "Recording conditions" },
      { id: "db_manifest", number: "04.9", label: "Manifest & file index" },
    ],
  },
]

export const researchRail: readonly RailGroup[] = [
  {
    label: "On this page",
    items: [
      { id: "rs_tasks", number: "05.1", label: "Benchmark tasks" },
      { id: "rs_protocols", number: "05.2", label: "Evaluation protocols" },
      { id: "rs_results", number: "05.3", label: "Baseline V1 results" },
      { id: "rs_refine", number: "05.4", label: "Raw video refinement" },
      { id: "rs_extract", number: "05.5", label: "Pose & skeleton extraction" },
      { id: "rs_qc", number: "05.6", label: "Quality control & validation" },
      { id: "rs_limits", number: "05.7", label: "Known limitations" },
      { id: "rs_pubs", number: "05.8", label: "Related publications" },
    ],
  },
]

export const faqRail: readonly RailGroup[] = [
  {
    label: "Topics",
    items: faqTopics.map((topic) => ({ id: topic.id, number: topic.number, label: topic.title })),
  },
]

/** Look up a rail item so a DocSection uses the same id, number and title. */
export function railItem(groups: readonly RailGroup[], id: string): RailItem {
  const item = groups.flatMap((group) => group.items).find((i) => i.id === id)
  if (!item) throw new Error(`Unknown section ${id}`)
  return item
}
