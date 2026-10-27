import { describe, expect, it } from "vitest"

import { activeSection } from "@/lib/scroll-spy"

const viewport = { innerHeight: 800, scrollY: 0, scrollHeight: 4000 }

describe("activeSection", () => {
  it("returns null without sections", () => {
    expect(activeSection([], viewport)).toBeNull()
  })

  it("defaults to the first section at the top of the page", () => {
    const sections = [
      { id: "a", top: 400 },
      { id: "b", top: 1200 },
    ]
    expect(activeSection(sections, viewport)).toBe("a")
  })

  it("picks the last section whose top is within 160px", () => {
    const sections = [
      { id: "a", top: -900 },
      { id: "b", top: 160 },
      { id: "c", top: 161 },
    ]
    expect(activeSection(sections, { ...viewport, scrollY: 1500 })).toBe("b")
  })

  it("snaps to the last section within 4px of the bottom", () => {
    const sections = [
      { id: "a", top: -2000 },
      { id: "b", top: 100 },
      { id: "c", top: 500 },
    ]
    expect(activeSection(sections, { ...viewport, scrollY: 3196 })).toBe("c")
    expect(activeSection(sections, { ...viewport, scrollY: 3195 })).toBe("b")
  })
})
