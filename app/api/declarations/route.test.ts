import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { verifyDownloadToken } from "@/lib/token"

const services = vi.hoisted(() => ({
  verifyTurnstile: vi.fn(),
  appendDeclaration: vi.fn(),
  sendMail: vi.fn(),
}))
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: services.verifyTurnstile }))
vi.mock("@/lib/sheets", () => ({ appendDeclaration: services.appendDeclaration }))
vi.mock("@/lib/mailer", () => ({ sendMail: services.sendMail }))

const { POST } = await import("@/app/api/declarations/route")

const secret = "a-test-secret-that-is-at-least-32-chars"
const valid = {
  name: "Ama Mensah",
  email: "ama@example.org",
  affiliation: "University of Ghana",
  use: "Academic research",
  description: "Pose-based recognition of Ampe movements.",
  agree: true,
  company_website: "",
  turnstileToken: "token",
}

function post(body: unknown) {
  return POST(
    new NextRequest("http://localhost/api/declarations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  )
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(console, "error").mockImplementation(() => {})
  vi.stubEnv("SITE_URL", "https://ampe-db.example")
  vi.stubEnv("DOWNLOAD_TOKEN_SECRET", secret)
  vi.stubEnv("DOWNLOAD_LINK_TTL_DAYS", "7")
  services.verifyTurnstile.mockResolvedValue(true)
  services.appendDeclaration.mockResolvedValue(undefined)
  services.sendMail.mockResolvedValue(undefined)
})

describe("POST /api/declarations", () => {
  it("logs the declaration, emails a working link and reports the expiry", async () => {
    const before = Date.now()
    const response = await post(valid)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.ok).toBe(true)

    const expiresAt = new Date(body.expiresAt).getTime()
    expect(expiresAt - before).toBeGreaterThanOrEqual(7 * 24 * 60 * 60 * 1000)
    expect(expiresAt - before).toBeLessThan(7 * 24 * 60 * 60 * 1000 + 60_000)

    const row = services.appendDeclaration.mock.calls[0][0]
    expect(row).toMatchObject({
      name: "Ama Mensah",
      email: "ama@example.org",
      affiliation: "University of Ghana",
      intendedUse: "Academic research",
      termsAccepted: true,
    })
    expect(row.reference).toMatch(/^AMP-[23456789A-HJKMNP-Z]{6}$/)

    const mail = services.sendMail.mock.calls[0][0]
    expect(mail.to).toBe("ama@example.org")
    expect(mail.subject).toBe("Your Ampe-DB V1 download link")
    const link = mail.text.match(/https:\/\/ampe-db\.example\/download\?token=(\S+)/)
    expect(link).not.toBeNull()
    const verified = await verifyDownloadToken(
      decodeURIComponent(link[1]),
      new TextEncoder().encode(secret)
    )
    expect(verified?.reference).toBe(row.reference)
    expect(mail.text).toContain(`Your reference is ${row.reference}.`)
  })

  it("rejects a filled honeypot without touching any service", async () => {
    const response = await post({ ...valid, company_website: "https://spam.example" })
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ ok: false })
    expect(services.verifyTurnstile).not.toHaveBeenCalled()
    expect(services.appendDeclaration).not.toHaveBeenCalled()
    expect(services.sendMail).not.toHaveBeenCalled()
  })

  it("rejects a failed Turnstile check", async () => {
    services.verifyTurnstile.mockResolvedValue(false)
    const response = await post(valid)
    expect(response.status).toBe(400)
    expect(services.appendDeclaration).not.toHaveBeenCalled()
    expect(services.sendMail).not.toHaveBeenCalled()
  })

  it("returns field errors for invalid input", async () => {
    const response = await post({ ...valid, email: "nope", agree: false })
    expect(response.status).toBe(422)
    const body = await response.json()
    expect(body.ok).toBe(false)
    expect(Object.keys(body.fieldErrors).sort()).toEqual(["agree", "email"])
    expect(services.sendMail).not.toHaveBeenCalled()
  })

  it("rejects malformed and oversized bodies", async () => {
    expect((await post("{not json")).status).toBe(400)
    expect((await post({ ...valid, description: "x".repeat(20_000) })).status).toBe(413)
  })

  it("never reports success when the email wasn't sent", async () => {
    services.sendMail.mockRejectedValue(new Error("smtp down"))
    const response = await post(valid)
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ ok: false })
  })

  it("doesn't email when the sheet can't be written", async () => {
    services.appendDeclaration.mockRejectedValue(new Error("sheets down"))
    const response = await post(valid)
    expect(response.status).toBe(502)
    expect(services.sendMail).not.toHaveBeenCalled()
  })

  it("never logs form contents", async () => {
    services.sendMail.mockRejectedValue(new Error(`failed for ${valid.email}`))
    await post(valid)
    const logged = vi.mocked(console.error).mock.calls.flat().join(" ")
    expect(logged).not.toContain(valid.email)
    expect(logged).not.toContain(valid.name)
  })
})
