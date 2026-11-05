import { decodeJwt, SignJWT } from "jose"
import { describe, expect, it } from "vitest"

import { createReference, REFERENCE_PATTERN } from "@/lib/reference"
import { signDownloadToken, verifyDownloadToken } from "@/lib/token"

const secret = new TextEncoder().encode("a-test-secret-that-is-at-least-32-chars")
const otherSecret = new TextEncoder().encode("another-secret-that-is-at-least-32-chars")
const inAWeek = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

describe("download token", () => {
  it("round-trips the reference and the expiry", async () => {
    const expiresAt = inAWeek()
    const token = await signDownloadToken("AMP-7K2QXM", expiresAt, secret)
    const verified = await verifyDownloadToken(token, secret)
    expect(verified?.reference).toBe("AMP-7K2QXM")
    expect(verified?.expiresAt.getTime()).toBe(Math.floor(expiresAt.getTime() / 1000) * 1000)
  })

  it("carries only the reference and the expiry", async () => {
    const token = await signDownloadToken("AMP-7K2QXM", inAWeek(), secret)
    expect(Object.keys(decodeJwt(token)).sort()).toEqual(["exp", "sub"])
  })

  it("rejects an expired token", async () => {
    const token = await signDownloadToken("AMP-7K2QXM", new Date(Date.now() - 1000), secret)
    expect(await verifyDownloadToken(token, secret)).toBeNull()
  })

  it("rejects an edited token", async () => {
    const token = await signDownloadToken("AMP-7K2QXM", inAWeek(), secret)
    const [header, payload, signature] = token.split(".")
    const forged = Buffer.from(
      JSON.stringify({ ...decodeJwt(token), sub: "AMP-ZZZZZZ" })
    ).toString("base64url")
    expect(await verifyDownloadToken(`${header}.${forged}.${signature}`, secret)).toBeNull()
    expect(await verifyDownloadToken(`${header}.${payload}.${signature}x`, secret)).toBeNull()
  })

  it("rejects a token signed with another secret", async () => {
    const token = await signDownloadToken("AMP-7K2QXM", inAWeek(), otherSecret)
    expect(await verifyDownloadToken(token, secret)).toBeNull()
  })

  it("rejects a token without an expiry or with a foreign subject", async () => {
    const noExpiry = await new SignJWT().setProtectedHeader({ alg: "HS256" }).setSubject("AMP-7K2QXM").sign(secret)
    expect(await verifyDownloadToken(noExpiry, secret)).toBeNull()
    const foreign = await new SignJWT()
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("ama@example.org")
      .setExpirationTime("1h")
      .sign(secret)
    expect(await verifyDownloadToken(foreign, secret)).toBeNull()
  })

  it("rejects missing and garbage tokens", async () => {
    expect(await verifyDownloadToken(undefined, secret)).toBeNull()
    expect(await verifyDownloadToken("", secret)).toBeNull()
    expect(await verifyDownloadToken("not.a.token", secret)).toBeNull()
  })
})

describe("createReference", () => {
  it("makes AMP- plus six characters from the unambiguous alphabet", () => {
    for (let i = 0; i < 200; i++) expect(createReference()).toMatch(REFERENCE_PATTERN)
  })
})
