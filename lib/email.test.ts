import { describe, expect, it } from "vitest"

import { downloadEmailText, EMAIL_SUBJECT } from "@/lib/email"
import { declarationValues, downloadValues } from "@/lib/sheets"

describe("download email", () => {
  it("matches the copy in the README", () => {
    expect(EMAIL_SUBJECT).toBe("Your Ampe-DB V1 download link")
    const text = downloadEmailText({
      name: "Ama Mensah",
      link: "https://ampe-db.example/download?token=abc",
      expiresAt: new Date("2026-11-03T10:00:00Z"),
      reference: "AMP-7K2QXM",
      siteUrl: "https://ampe-db.example",
    })
    expect(text).toBe(
      [
        "Hello Ama Mensah,",
        "",
        "Thank you for declaring your intended use of Ampe-DB V1. Your personal download link:",
        "https://ampe-db.example/download?token=abc",
        "",
        "It works until 3 November 2026. Please don’t forward it — colleagues who need the data should complete their own declaration.",
        "",
        "Your reference is AMP-7K2QXM. Quote it if you contact us.",
        "",
        "Your use must follow the Terms of Use, License and Research Data Use Agreement. Please cite Ampe-DB and state the dataset version and evaluation protocol in any publication.",
        "",
        "Questions: https://ampe-db.example/contact",
        "",
        "The Ampe-DB team",
        "",
      ].join("\n")
    )
  })
})

describe("sheet rows", () => {
  it("writes exactly the declaration columns, in order", () => {
    expect(
      declarationValues({
        submittedAt: new Date("2026-10-27T09:30:00Z"),
        reference: "AMP-7K2QXM",
        name: "Ama Mensah",
        email: "ama@example.org",
        affiliation: "",
        intendedUse: "Education",
        description: "=HYPERLINK(\"x\")",
        termsAccepted: true,
        linkExpiresAt: new Date("2026-11-03T09:30:00Z"),
      })
    ).toEqual([
      "2026-10-27T09:30:00.000Z",
      "AMP-7K2QXM",
      "Ama Mensah",
      "ama@example.org",
      "",
      "Education",
      "=HYPERLINK(\"x\")",
      "TRUE",
      "Ampe-DB V1",
      "2026-11-03T09:30:00.000Z",
    ])
  })

  it("writes exactly the download columns, in order", () => {
    expect(
      downloadValues({
        downloadedAt: new Date("2026-10-28T12:00:00Z"),
        reference: "AMP-7K2QXM",
        packageId: "pose",
      })
    ).toEqual(["2026-10-28T12:00:00.000Z", "AMP-7K2QXM", "pose"])
  })
})
