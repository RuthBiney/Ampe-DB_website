// Record path builder rules (README → Interactions → Record path builder).

export const movementTokens = ["left_left", "left_right", "right_left", "right_right"] as const
export type MovementToken = (typeof movementTokens)[number]

/**
 * Sanitise the identifier on every change: uppercase; keep up to 3 digits and
 * prefix "C". With no digits, "C" if the user typed a C, otherwise empty.
 */
export function sanitizeId(raw: string): string {
  const upper = raw.toUpperCase()
  const digits = upper.replace(/[^0-9]/g, "").slice(0, 3)
  if (digits) return `C${digits}`
  return upper.includes("C") ? "C" : ""
}

export function isValidId(id: string): boolean {
  return /^C\d{3}$/.test(id)
}

/** Canonical record key, with a C### placeholder while the identifier is incomplete. */
export function recordKey(movement: MovementToken, id: string): string {
  return `${movement}_${isValidId(id) ? id : "C###"}`
}

/** The five record-level paths for a key, in naming-table order. */
export function recordPaths(key: string) {
  return [
    { label: "RGB video", path: `videos/${key}.mp4` },
    { label: "Normalized pose", path: `pose/${key}.csv` },
    { label: "Skeleton CSV", path: `skeleton/csv/keypoints_${key}.csv` },
    { label: "Skeleton JSON", path: `skeleton/json/keypoints_${key}.json` },
    { label: "Skeleton video", path: `skeleton/videos/skeleton_${key}.mp4` },
  ] as const
}
