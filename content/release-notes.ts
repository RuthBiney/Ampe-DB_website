// Home → News & updates.

export type ReleaseNote = { year: string; version: string; type: string; text: string }

export const releaseNotes: readonly ReleaseNote[] = [
  {
    year: "2026",
    version: "Ampe-DB V1",
    type: "Documentation",
    text: "Website documentation aligned to the frozen release structure and the Baseline V1 benchmark.",
  },
  {
    year: "2026",
    version: "Baseline V1",
    type: "Benchmark docs",
    text: "Baseline V1 documentation standardized around the duplicate-safe fixed reference split, the 4-fold pair-held-out benchmark and the participant-held-out diagnostic.",
  },
  {
    year: "2026",
    version: "Ampe-DB V1",
    type: "Documentation",
    text: "Documentation updated for the 33-landmark pose representation, non-uniform media properties, duplicate provenance and final RGB, Pose and Fusion benchmark results.",
  },
]
