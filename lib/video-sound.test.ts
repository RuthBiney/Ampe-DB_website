import { describe, expect, it, vi } from "vitest"

import { createVideoSoundStore } from "@/lib/video-sound"

function fakeDocument() {
  const target = new EventTarget()
  return Object.assign(target, { hidden: false })
}

describe("video sound store", () => {
  it("starts with no clip unmuted", () => {
    expect(createVideoSoundStore(() => undefined).getOwner()).toBeNull()
  })

  it("lets only one clip have sound", () => {
    const store = createVideoSoundStore(() => undefined)
    store.claim("c179")
    store.claim("c114")
    expect(store.getOwner()).toBe("c114")
  })

  it("only releases the clip that has the sound", () => {
    const store = createVideoSoundStore(() => undefined)
    store.claim("c114")
    store.release("c179")
    expect(store.getOwner()).toBe("c114")
    store.release("c114")
    expect(store.getOwner()).toBeNull()
  })

  it("mutes everything when the tab is hidden", () => {
    const doc = fakeDocument()
    const store = createVideoSoundStore(() => doc)
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.claim("c189")
    doc.hidden = true
    doc.dispatchEvent(new Event("visibilitychange"))
    expect(store.getOwner()).toBeNull()
    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
  })
})
