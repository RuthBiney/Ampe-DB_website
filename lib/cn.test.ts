import { describe, expect, it } from "vitest"

import { cn } from "@/lib/utils"

// The Modernist theme adds custom colour tokens (brand-*, neutral-*, surface).
// Class merging must treat them as colours, not font sizes, or call-site
// overrides would silently drop sizes or colours.
describe("cn with the Modernist tokens", () => {
  it("keeps an arbitrary font size next to a brand colour", () => {
    expect(cn("text-[14px]", "text-brand-700")).toBe("text-[14px] text-brand-700")
  })

  it("lets a later brand colour replace the theme colour", () => {
    expect(cn("bg-primary", "bg-brand-600")).toBe("bg-brand-600")
  })

  it("lets a later font size replace the default", () => {
    expect(cn("text-[14px]", "text-[15px]")).toBe("text-[15px]")
  })

  it("keeps the button line-height when a call site changes the font size", () => {
    expect(cn("[line-height:1.2] text-[14px]", "text-[15px]")).toBe(
      "[line-height:1.2] text-[15px]"
    )
  })
})
