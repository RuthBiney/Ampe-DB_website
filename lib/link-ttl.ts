// How long a personal download link works (README → Decisions still open,
// 4). Every piece of copy that states the lifetime reads it from here, so the
// token and the words never disagree. Server-side only: pages that show it
// render on the server.

const DEFAULT_TTL_DAYS = 7
const DAY_MS = 24 * 60 * 60 * 1000

export function linkTtlDays(): number {
  const raw = process.env.DOWNLOAD_LINK_TTL_DAYS?.trim()
  if (!raw) return DEFAULT_TTL_DAYS
  const days = Number(raw)
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error("DOWNLOAD_LINK_TTL_DAYS must be a whole number of days from 1 to 365")
  }
  return days
}

export function linkExpiry(from: Date = new Date()): Date {
  return new Date(from.getTime() + linkTtlDays() * DAY_MS)
}

// "7 days", "1 day".
export function linkTtlText(): string {
  const days = linkTtlDays()
  return `${days} ${days === 1 ? "day" : "days"}`
}
