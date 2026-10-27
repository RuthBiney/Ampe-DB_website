// Baseline V1 Macro-F1 results (README → Screens → Research → Results).
// Values are strings so they render exactly as published.

export type Task = "four" | "binary"
export type Modality = "rgb" | "pose" | "fusion"
export type ProtocolId = "fixed" | "pair" | "participant"

export const tasks: readonly { id: Task; label: string }[] = [
  { id: "four", label: "Four-class" },
  { id: "binary", label: "Binary relation" },
]

export const protocols: readonly {
  id: ProtocolId
  label: string // results table
  chartLabel: string
  chartNote: string
}[] = [
  { id: "fixed", label: "Duplicate-safe fixed", chartLabel: "Duplicate-safe fixed", chartNote: "Reference split" },
  { id: "pair", label: "Pair-held-out", chartLabel: "Pair-held-out", chartNote: "Primary benchmark · 4 folds" },
  { id: "participant", label: "Participant-held-out diagnostic", chartLabel: "Participant-held-out", chartNote: "Diagnostic" },
]

export const modalities: readonly { id: Modality; label: string; chartLabel: string }[] = [
  { id: "rgb", label: "RGB", chartLabel: "RGB" },
  { id: "pose", label: "Pose", chartLabel: "Pose" },
  { id: "fusion", label: "Fusion", chartLabel: "RGB + Pose" },
]

export type ResultRow = { task: Task; protocol: ProtocolId } & Record<Modality, string>

export const results: readonly ResultRow[] = [
  { task: "four", protocol: "fixed", rgb: "0.955", pose: "0.957", fusion: "0.976" },
  { task: "four", protocol: "pair", rgb: "0.418", pose: "0.811", fusion: "0.824" },
  { task: "four", protocol: "participant", rgb: "0.384", pose: "0.839", fusion: "0.833" },
  { task: "binary", protocol: "fixed", rgb: "0.932", pose: "0.981", fusion: "0.989" },
  { task: "binary", protocol: "pair", rgb: "0.625", pose: "0.633", fusion: "0.630" },
  { task: "binary", protocol: "participant", rgb: "0.472", pose: "0.675", fusion: "0.575" },
]

export function resultFor(task: Task, protocol: ProtocolId): ResultRow {
  const row = results.find((r) => r.task === task && r.protocol === protocol)
  if (!row) throw new Error(`No result for ${task}/${protocol}`)
  return row
}

// Values are published to three decimals, so compare them as integer thousandths.
const thousandths = (value: string) => Math.round(Number(value) * 1000)

/** The modality with the highest value in a row (rendered bold). */
export function bestOf(row: ResultRow): Modality {
  return modalities.reduce((best, m) =>
    thousandths(row[m.id]) > thousandths(row[best.id]) ? m : best
  ).id
}

/**
 * Change between two protocols for one modality, e.g. the Home drops
 * (four-class, fixed split → pair-held-out). Derived, so it always follows
 * the results above. Formatted with a true minus sign.
 */
export function drop(task: Task, modality: Modality, from: ProtocolId, to: ProtocolId): string {
  const delta = thousandths(resultFor(task, to)[modality]) - thousandths(resultFor(task, from)[modality])
  const abs = Math.abs(delta)
  const text = `${Math.floor(abs / 1000)}.${String(abs % 1000).padStart(3, "0")}`
  return delta < 0 ? `−${text}` : `+${text}`
}
