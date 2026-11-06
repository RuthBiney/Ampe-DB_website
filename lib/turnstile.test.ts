import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { verifyTurnstile } from "@/lib/turnstile"

function siteverify(body: Record<string, unknown>) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body)))
}

beforeEach(() => {
  vi.stubEnv("TURNSTILE_SECRET_KEY", "secret")
  vi.stubEnv("E2E_FAKE_SERVICES", "")
  vi.spyOn(console, "warn").mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("verifyTurnstile", () => {
  it("accepts a token for the declaration action", async () => {
    siteverify({ success: true, action: "declaration", hostname: "ampe.yarafrica.org" })
    await expect(verifyTurnstile("token")).resolves.toBe(true)
  })

  it("rejects a missing token without calling Cloudflare", async () => {
    siteverify({ success: true, action: "declaration" })
    await expect(verifyTurnstile(undefined)).resolves.toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })

  it("rejects a token issued for another action", async () => {
    siteverify({ success: true, action: "login", hostname: "ampe.yarafrica.org" })
    await expect(verifyTurnstile("token")).resolves.toBe(false)
  })

  it("rejects a hostname outside TURNSTILE_HOSTNAMES", async () => {
    vi.stubEnv("TURNSTILE_HOSTNAMES", "ampe-db-website.vercel.app, ampe.yarafrica.org")
    siteverify({ success: true, action: "declaration", hostname: "evil.example" })
    await expect(verifyTurnstile("token")).resolves.toBe(false)
    siteverify({ success: true, action: "declaration", hostname: "Ampe.YARAfrica.org" })
    await expect(verifyTurnstile("token")).resolves.toBe(true)
  })

  it("rejects a failed or replayed token", async () => {
    siteverify({ success: false, "error-codes": ["timeout-or-duplicate"] })
    await expect(verifyTurnstile("token")).resolves.toBe(false)
  })
})
