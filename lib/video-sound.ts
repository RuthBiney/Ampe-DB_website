// Page-wide sound owner for the video tiles (README → Video tiles → Sound
// rules): only one clip can have sound, and sound switches off when the tab
// is hidden. Tiles release sound themselves when they scroll out of view or
// unmount (page change).

type Listener = () => void
type VisibilitySource = Pick<Document, "hidden" | "addEventListener" | "removeEventListener">

export function createVideoSoundStore(getDocument: () => VisibilitySource | undefined) {
  let owner: string | null = null
  const listeners = new Set<Listener>()

  const set = (next: string | null) => {
    if (next === owner) return
    owner = next
    listeners.forEach((listener) => listener())
  }
  const onVisibilityChange = () => {
    if (getDocument()?.hidden) set(null)
  }

  return {
    getOwner: () => owner,
    /** Give this clip the sound; every other clip is muted. */
    claim: (id: string) => set(id),
    /** Mute this clip if it has the sound. */
    release: (id: string) => {
      if (owner === id) set(null)
    },
    subscribe(listener: Listener) {
      if (listeners.size === 0) getDocument()?.addEventListener("visibilitychange", onVisibilityChange)
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) getDocument()?.removeEventListener("visibilitychange", onVisibilityChange)
      }
    },
  }
}

export const videoSound = createVideoSoundStore(() =>
  typeof document === "undefined" ? undefined : document
)
