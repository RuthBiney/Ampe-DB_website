// Section rail scroll-spy (README → Interactions → Section rail scroll-spy).

export const SPY_OFFSET = 160
const BOTTOM_SLACK = 4

export type SpySection = { id: string; top: number } // top relative to the viewport
export type SpyViewport = { innerHeight: number; scrollY: number; scrollHeight: number }

/**
 * The active section is the last one whose top is at most 160px from the top
 * of the viewport; when scrolled to the bottom (within 4px) it is the last one.
 */
export function activeSection(sections: readonly SpySection[], viewport: SpyViewport): string | null {
  if (sections.length === 0) return null
  if (viewport.innerHeight + viewport.scrollY >= viewport.scrollHeight - BOTTOM_SLACK) {
    return sections[sections.length - 1].id
  }
  let current = sections[0].id
  for (const section of sections) {
    if (section.top <= SPY_OFFSET) current = section.id
  }
  return current
}
