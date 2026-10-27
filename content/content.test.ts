import { describe, expect, it } from "vitest"

import { acknowledgementText, citationText } from "@/content/citation"
import { clips } from "@/content/clips"
import { faqDefaultOpen, faqTopics } from "@/content/faq"
import { gettingStarted } from "@/content/home"
import { landmarks, torsoLandmarks } from "@/content/landmarks"
import { packages } from "@/content/packages"
import { bestOf, drop, resultFor, results } from "@/content/results"

describe("results", () => {
  // README → Screens → Research → Results (Macro-F1), row by row.
  it("matches the published table", () => {
    expect(results.map(({ rgb, pose, fusion }) => [rgb, pose, fusion])).toEqual([
      ["0.955", "0.957", "0.976"],
      ["0.418", "0.811", "0.824"],
      ["0.384", "0.839", "0.833"],
      ["0.932", "0.981", "0.989"],
      ["0.625", "0.633", "0.630"],
      ["0.472", "0.675", "0.575"],
    ])
  })

  it("bolds the published best value in each row", () => {
    expect(results.map(bestOf)).toEqual(["fusion", "fusion", "pose", "fusion", "pose", "pose"])
  })

  it("derives the Home drops from the results", () => {
    expect(drop("four", "rgb", "fixed", "pair")).toBe("−0.537")
    expect(drop("four", "pose", "fixed", "pair")).toBe("−0.146")
    expect(resultFor("four", "pair").rgb).toBe("0.418")
  })
})

describe("FAQ", () => {
  it("has 15 questions q1–q15 in 4 topics", () => {
    expect(faqTopics.map((t) => t.id)).toEqual(["faq_access", "faq_use", "faq_data", "faq_report"])
    expect(faqTopics.map((t) => t.items.length)).toEqual([4, 3, 5, 3])
    const ids = faqTopics.flatMap((t) => t.items.map((i) => i.id))
    expect(ids).toEqual(Array.from({ length: 15 }, (_, i) => `q${i + 1}`))
    expect(faqDefaultOpen).toEqual(["q1"])
  })
})

describe("landmarks", () => {
  it("lists indices 0–32 with the torso marked", () => {
    expect(landmarks).toHaveLength(33)
    expect(new Set(landmarks).size).toBe(33)
    expect(torsoLandmarks.map((i) => landmarks[i])).toEqual([
      "left_shoulder",
      "right_shoulder",
      "left_hip",
      "right_hip",
    ])
  })
})

describe("packages", () => {
  it("matches the README package ids and env names", () => {
    expect(packages.map((p) => [p.id, p.archive, p.driveFileEnv])).toEqual([
      ["videos", "videos.zip", "DRIVE_FILE_VIDEOS"],
      ["pose", "pose.zip", "DRIVE_FILE_POSE"],
      ["skeleton-videos", "skeleton-videos.zip", "DRIVE_FILE_SKELETON_VIDEOS"],
      ["skeleton-coordinates", "skeleton-coordinates.zip", "DRIVE_FILE_SKELETON_COORDINATES"],
      ["annotations-metadata", "annotations-metadata.zip", "DRIVE_FILE_ANNOTATIONS_METADATA"],
      ["research-docs", "research-docs.zip", "DRIVE_FILE_RESEARCH_DOCS"],
    ])
  })
})

describe("clips", () => {
  it("has six clips and only the skeleton clip is silent", () => {
    expect(Object.keys(clips)).toEqual(["c179", "c179s", "c114", "c189", "c082", "c009"])
    expect(Object.values(clips).filter((c) => !c.hasAudio).map((c) => c.id)).toEqual(["c179s"])
  })
})

describe("citation", () => {
  it("matches the README citation and acknowledgement", () => {
    expect(citationText).toBe(
      "Biney, R. S., & Aboah, I. K. Y. (2026). Ampe-DB: A Dataset for Human Activity and Interaction Analysis Using the Ghanaian Game Ampe. Young Africans Research Academy (YARA)."
    )
    expect(acknowledgementText.startsWith("“")).toBe(true)
    expect(acknowledgementText.endsWith("”")).toBe(true)
  })
})

describe("Home getting started", () => {
  it("links each step to its README target", () => {
    expect(gettingStarted.map((s) => s.link.href)).toEqual([
      "/terms",
      "/getting-the-database#gt_access",
      "/getting-the-database#gt_receive",
      "/database#db_structure",
      "/research#rs_protocols",
      "/#home_cite",
    ])
  })
})
