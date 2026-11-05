// "3 November 2026" (en-GB long date). UTC, so the email, the form and the
// download page all name the same day as the token's expiry.
const expiryFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

export function formatExpiry(date: Date | string): string {
  return expiryFormat.format(typeof date === "string" ? new Date(date) : date)
}
