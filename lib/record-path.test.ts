import { describe, expect, it } from "vitest"

import { isValidId, recordKey, recordPaths, sanitizeId } from "@/lib/record-path"

describe("sanitizeId", () => {
  it("keeps up to three digits after C", () => {
    expect(sanitizeId("C003")).toBe("C003")
    expect(sanitizeId("c12")).toBe("C12")
    expect(sanitizeId("C12345")).toBe("C123")
  })

  it("drops other characters and adds the C", () => {
    expect(sanitizeId("42")).toBe("C42")
    expect(sanitizeId("x-0 0_7")).toBe("C007")
  })

  it("keeps a lone C, otherwise empties", () => {
    expect(sanitizeId("c")).toBe("C")
    expect(sanitizeId("abc")).toBe("C")
    expect(sanitizeId("xyz")).toBe("")
    expect(sanitizeId("")).toBe("")
  })
})

describe("recordKey", () => {
  it("joins the movement and a valid identifier", () => {
    expect(isValidId("C003")).toBe(true)
    expect(recordKey("left_right", "C003")).toBe("left_right_C003")
  })

  it("uses C### while the identifier is incomplete", () => {
    for (const id of ["", "C", "C12"]) {
      expect(isValidId(id)).toBe(false)
      expect(recordKey("right_left", id)).toBe("right_left_C###")
    }
  })
})

describe("recordPaths", () => {
  it("follows the naming table", () => {
    expect(recordPaths("left_right_C003").map((p) => p.path)).toEqual([
      "videos/left_right_C003.mp4",
      "pose/left_right_C003.csv",
      "skeleton/csv/keypoints_left_right_C003.csv",
      "skeleton/json/keypoints_left_right_C003.json",
      "skeleton/videos/skeleton_left_right_C003.mp4",
    ])
  })
})
