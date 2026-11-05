import { type NextRequest } from "next/server"

import {
  declarationSchema,
  type DeclarationField,
  type DeclarationResponse,
} from "@/lib/declaration"
import { downloadEmailText, EMAIL_SUBJECT } from "@/lib/email"
import { linkExpiry } from "@/lib/link-ttl"
import { logFailure } from "@/lib/log"
import { sendMail } from "@/lib/mailer"
import { createReference } from "@/lib/reference"
import { siteUrl, tokenSecret } from "@/lib/server-env"
import { appendDeclaration } from "@/lib/sheets"
import { signDownloadToken } from "@/lib/token"
import { verifyTurnstile } from "@/lib/turnstile"

// POST /api/declarations (README → Production architecture). The declaration
// is not an approval: a valid submit emails the personal link straight away.
// Success is reported only once the email has been handed to Gmail.

const MAX_BODY_BYTES = 16 * 1024

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }

function reply(body: DeclarationResponse, status: number) {
  return Response.json(body, { status, headers })
}

export async function POST(request: NextRequest) {
  const raw = await request.text().catch(() => null)
  if (raw === null || raw.length > MAX_BODY_BYTES) return reply({ ok: false }, 413)

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return reply({ ok: false }, 400)
  }

  const body: Record<string, unknown> =
    typeof json === "object" && json !== null ? (json as Record<string, unknown>) : {}

  // Honeypot: people never see this field, bots fill it in.
  if (typeof body.company_website === "string" && body.company_website.trim() !== "") {
    return reply({ ok: false }, 400)
  }

  const turnstileToken =
    typeof body.turnstileToken === "string" && body.turnstileToken.length <= 2048
      ? body.turnstileToken
      : undefined
  let human = false
  try {
    human = await verifyTurnstile(turnstileToken)
  } catch (error) {
    logFailure("declarations: turnstile", error)
    return reply({ ok: false }, 502)
  }
  if (!human) return reply({ ok: false }, 400)

  const parsed = declarationSchema.safeParse(json)
  if (!parsed.success) {
    const fieldErrors: Partial<Record<DeclarationField, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as DeclarationField | undefined
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
    }
    return reply({ ok: false, fieldErrors }, 422)
  }
  const declaration = parsed.data

  const submittedAt = new Date()
  const expiresAt = linkExpiry(submittedAt)
  const reference = createReference()

  try {
    await appendDeclaration({
      submittedAt,
      reference,
      name: declaration.name,
      email: declaration.email,
      affiliation: declaration.affiliation,
      intendedUse: declaration.use,
      description: declaration.description,
      termsAccepted: declaration.agree,
      linkExpiresAt: expiresAt,
    })
  } catch (error) {
    logFailure("declarations: sheet append", error)
    return reply({ ok: false }, 502)
  }

  try {
    const token = await signDownloadToken(reference, expiresAt, tokenSecret())
    const base = siteUrl()
    const link = `${base}/download?token=${encodeURIComponent(token)}`
    await sendMail({
      to: declaration.email,
      subject: EMAIL_SUBJECT,
      text: downloadEmailText({
        name: declaration.name,
        link,
        expiresAt,
        reference,
        siteUrl: base,
      }),
    })
  } catch (error) {
    logFailure("declarations: email", error)
    return reply({ ok: false }, 502)
  }

  return reply({ ok: true, expiresAt: expiresAt.toISOString() }, 200)
}
