import { describe, expect, it } from "vitest"

import { declarationSchema, intendedUses } from "@/lib/declaration"

const valid = {
  name: "Ama Mensah",
  email: "ama@example.org",
  affiliation: "",
  use: "Academic research",
  description: "Pose-based recognition of Ampe movements.",
  agree: true,
}

describe("declarationSchema", () => {
  it("accepts a complete declaration and trims the text", () => {
    const result = declarationSchema.parse({ ...valid, name: "  Ama Mensah  " })
    expect(result.name).toBe("Ama Mensah")
    expect(result.affiliation).toBe("")
  })

  it("offers exactly the five purposes from the design", () => {
    expect(intendedUses).toEqual([
      "Academic research",
      "Education",
      "Cultural or artistic work",
      "Independent exploration",
      "Other",
    ])
  })

  it.each([
    ["name", { name: "   " }],
    ["email", { email: "not-an-email" }],
    ["email", { email: "" }],
    ["use", { use: "Surveillance" }],
    ["use", { use: "" }],
    ["description", { description: "" }],
    ["agree", { agree: false }],
    ["name", { name: "Ama\nBcc: x@example.org" }],
    ["affiliation", { affiliation: "x".repeat(201) }],
    ["description", { description: "x".repeat(2001) }],
  ])("rejects a bad %s", (field, override) => {
    const result = declarationSchema.safeParse({ ...valid, ...override })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path[0]).toBe(field)
  })

  it("drops fields it doesn't know", () => {
    const result = declarationSchema.parse({ ...valid, ip: "203.0.113.7" })
    expect(result).not.toHaveProperty("ip")
  })

  it("allows line breaks in the description", () => {
    expect(declarationSchema.safeParse({ ...valid, description: "One.\nTwo." }).success).toBe(true)
  })
})
