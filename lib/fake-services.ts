import { appendFile, mkdir } from "node:fs/promises"
import path from "node:path"

// Stand-ins for Google Sheets, Gmail and Turnstile, used only by the
// Playwright tests. They switch on with E2E_FAKE_SERVICES=1 and never in a
// production build, so a stray variable on Vercel can't bypass the real
// services. Each call appends one JSON line to E2E_OUTBOX_DIR/<kind>.jsonl,
// where the test reads the "sent" email and the "appended" rows.

export function fakeServicesEnabled(): boolean {
  return process.env.E2E_FAKE_SERVICES === "1" && process.env.NODE_ENV !== "production"
}

export async function recordFake(kind: "mail" | "declarations" | "downloads", entry: unknown) {
  const dir = process.env.E2E_OUTBOX_DIR
  if (!dir) throw new Error("E2E_OUTBOX_DIR must be set when E2E_FAKE_SERVICES=1")
  await mkdir(dir, { recursive: true })
  await appendFile(path.join(dir, `${kind}.jsonl`), `${JSON.stringify(entry)}\n`)
}
