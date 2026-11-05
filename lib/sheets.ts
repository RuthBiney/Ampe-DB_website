import { fakeServicesEnabled, recordFake } from "@/lib/fake-services"
import { requireEnv } from "@/lib/server-env"

// Google Sheets log (README → Google Sheet). Exactly these columns, in this
// order — no IP addresses or user agents. Values are written RAW so text that
// starts with "=" stays text and is never run as a formula.

export const DATASET_VERSION = "Ampe-DB V1"

export type DeclarationRow = {
  submittedAt: Date
  reference: string
  name: string
  email: string
  affiliation: string
  intendedUse: string
  description: string
  termsAccepted: boolean
  linkExpiresAt: Date
}

export type DownloadRow = { downloadedAt: Date; reference: string; packageId: string }

export function declarationValues(row: DeclarationRow): string[] {
  return [
    row.submittedAt.toISOString(),
    row.reference,
    row.name,
    row.email,
    row.affiliation,
    row.intendedUse,
    row.description,
    row.termsAccepted ? "TRUE" : "FALSE",
    DATASET_VERSION,
    row.linkExpiresAt.toISOString(),
  ]
}

export function downloadValues(row: DownloadRow): string[] {
  return [row.downloadedAt.toISOString(), row.reference, row.packageId]
}

export async function appendDeclaration(row: DeclarationRow) {
  await appendRow("declarations", declarationValues(row))
}

export async function appendDownload(row: DownloadRow) {
  await appendRow("downloads", downloadValues(row))
}

async function appendRow(tab: "declarations" | "downloads", values: string[]) {
  if (fakeServicesEnabled()) return recordFake(tab, values)

  const env = requireEnv(
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_PRIVATE_KEY",
    "GOOGLE_SHEET_ID"
  )
  const { google } = await import("googleapis")
  const auth = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
  const sheets = google.sheets({ version: "v4", auth })
  await sheets.spreadsheets.values.append(
    {
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: `${tab}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    },
    { timeout: 10000 }
  )
}
