import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { signDownloadToken } from "@/lib/token"

const sheets = vi.hoisted(() => ({ appendDownload: vi.fn() }))
vi.mock("@/lib/sheets", () => ({ appendDownload: sheets.appendDownload }))

const { GET } = await import("@/app/api/download/[packageId]/route")

const secret = "a-test-secret-that-is-at-least-32-chars"
const key = new TextEncoder().encode(secret)

async function validToken() {
  return signDownloadToken("AMP-7K2QXM", new Date(Date.now() + 60 * 60 * 1000), key)
}

function get(packageId: string, token?: string) {
  const url = new URL(`http://localhost/api/download/${packageId}`)
  if (token) url.searchParams.set("token", token)
  return GET(new NextRequest(url), { params: Promise.resolve({ packageId }) })
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(console, "error").mockImplementation(() => {})
  vi.stubEnv("DOWNLOAD_TOKEN_SECRET", secret)
  vi.stubEnv("DRIVE_FILE_POSE", "drive-file-id-pose")
  vi.stubEnv("DRIVE_FILE_VIDEOS", "")
  sheets.appendDownload.mockResolvedValue(undefined)
})

describe("GET /api/download/[packageId]", () => {
  it("logs the download and redirects to Drive", async () => {
    const response = await get("pose", await validToken())
    expect(response.status).toBe(302)
    expect(response.headers.get("Location")).toBe(
      "https://drive.google.com/uc?export=download&id=drive-file-id-pose"
    )
    expect(sheets.appendDownload).toHaveBeenCalledWith(
      expect.objectContaining({ reference: "AMP-7K2QXM", packageId: "pose" })
    )
  })

  it("sends a missing or bad token back to the expired page without logging", async () => {
    for (const token of [undefined, "edited.token.value"]) {
      const response = await get("pose", token)
      expect(response.status).toBe(303)
      expect(new URL(response.headers.get("Location")!).pathname).toBe("/download")
    }
    const expired = await signDownloadToken("AMP-7K2QXM", new Date(Date.now() - 1000), key)
    expect((await get("pose", expired)).status).toBe(303)
    expect(sheets.appendDownload).not.toHaveBeenCalled()
  })

  it("404s an unknown package", async () => {
    expect((await get("secrets", await validToken())).status).toBe(404)
  })

  it("503s a package whose Drive file isn't configured", async () => {
    expect((await get("videos", await validToken())).status).toBe(503)
  })

  it("still redirects when the download log can't be written", async () => {
    sheets.appendDownload.mockRejectedValue(new Error("sheets down"))
    expect((await get("pose", await validToken())).status).toBe(302)
  })
})
