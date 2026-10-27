// Suggested citation and acknowledgement (Home citation, Research 05.8).
// CITATION.cff in the release is the source of truth; no DOI is assigned yet.
// TODO: add the DOI or repository identifier once CITATION.cff carries one.

export const citation = {
  before: "Biney, R. S., & Aboah, I. K. Y. (2026). ",
  title: "Ampe-DB: A Dataset for Human Activity and Interaction Analysis Using the Ghanaian Game Ampe.",
  after: " Young Africans Research Academy (YARA).",
} as const

/** Plain text copied by the "Copy citation" buttons. */
export const citationText = `${citation.before}${citation.title}${citation.after}`

/** Shown and copied in curly quotes. */
export const acknowledgementText =
  "“This work uses Ampe-DB, developed through the Young Africans Research Academy (YARA) to support research on human activity and interaction analysis using the Ghanaian game Ampe.”"

export const citationFacts = [
  { term: "Authors", lines: ["Ruth Senior Biney", "Isaac Kojo Yedonu Aboah"] },
  { term: "Developed through", lines: ["Young Africans Research Academy (YARA)"] },
  { term: "Year", lines: ["2026"] },
] as const
