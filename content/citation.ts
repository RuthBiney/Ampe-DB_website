// Suggested citation and acknowledgement (Home citation, Research 05.8).
// CITATION.cff in the release is the source of truth; no DOI is assigned yet.
// TODO: add the DOI or repository identifier once CITATION.cff carries one.

/** Title exactly as in CITATION.cff. */
export const datasetTitle =
  "Ampe-DB: A Dataset for Human Activity and Interaction Analysis Using the Ghanaian Game Ampe"

/** APA 7 dataset reference built from CITATION.cff (version 1.0.0); the title is in sentence case. */
export const citation = {
  before: "Biney, R. S., & Aboah, I. K. Y. (2026). ",
  title: "Ampe-DB: A dataset for human activity and interaction analysis using the Ghanaian game Ampe",
  after: " (Version 1.0.0) [Data set].",
} as const

/** Plain text copied by the "Copy citation" buttons. */
export const citationText = `${citation.before}${citation.title}${citation.after}`

/** Shown and copied in curly quotes. */
export const acknowledgementText =
  "“This work uses Ampe-DB, created by Ruth Senior Biney and presented at the Young Africans Research Academy (YARA) to support research on human activity and interaction analysis using the Ghanaian game Ampe.”"

export const citationFacts = [
  { term: "Authors", lines: ["Ruth Senior Biney", "Isaac Kojo Yedonu Aboah"] },
  { term: "Year", lines: ["2026"] },
] as const
