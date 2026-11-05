import { formatExpiry } from "@/lib/format-expiry"

// The download-link email (README → Email). Plain text only; copy verbatim.

export const EMAIL_SUBJECT = "Your Ampe-DB V1 download link"

export function downloadEmailText({
  name,
  link,
  expiresAt,
  reference,
  siteUrl,
}: {
  name: string
  link: string
  expiresAt: Date
  reference: string
  siteUrl: string
}): string {
  return [
    `Hello ${name},`,
    "",
    "Thank you for declaring your intended use of Ampe-DB V1. Your personal download link:",
    link,
    "",
    `It works until ${formatExpiry(expiresAt)}. Please don’t forward it — colleagues who need the data should complete their own declaration.`,
    "",
    `Your reference is ${reference}. Quote it if you contact us.`,
    "",
    "Your use must follow the Terms of Use, License and Research Data Use Agreement. Please cite Ampe-DB and state the dataset version and evaluation protocol in any publication.",
    "",
    `Questions: ${siteUrl}/contact`,
    "",
    "The Ampe-DB team · Young Africans Research Academy (YARA)",
    "",
  ].join("\n")
}
