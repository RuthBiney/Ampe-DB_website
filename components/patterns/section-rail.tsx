"use client"

import * as React from "react"

import { activeSection } from "@/lib/scroll-spy"
import { cn } from "@/lib/utils"

export type RailItem = { id: string; number: string; label: string }
export type RailGroup = { label: string; items: readonly RailItem[] }

// Section rail with scroll-spy: the active item (last section whose top is
// within 160px) shows the 8×8 brand square and aria-current="true".
export function SectionRail({
  groups,
  navLabel = "On this page",
}: {
  groups: readonly RailGroup[]
  navLabel?: string
}) {
  const ids = React.useMemo(() => groups.flatMap((g) => g.items.map((i) => i.id)), [groups])
  const [active, setActive] = React.useState(ids[0])

  React.useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const sections = ids.flatMap((id) => {
        const el = document.getElementById(id)
        return el ? [{ id, top: el.getBoundingClientRect().top }] : []
      })
      const next = activeSection(sections, {
        innerHeight: window.innerHeight,
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
      })
      if (next) setActive(next)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [ids])

  const lastId = ids[ids.length - 1]

  return (
    <nav aria-label={navLabel} className="grid">
      {groups.map((group, groupIndex) => (
        <React.Fragment key={group.label}>
          <span
            className={cn(
              "text-[12px] font-semibold tracking-[.08em] text-neutral-700 uppercase",
              groupIndex === 0 ? "pb-2.5" : "border-t border-border pt-7 pb-2.5"
            )}
          >
            {group.label}
          </span>
          {group.items.map((item) => {
            const current = item.id === active
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "grid grid-cols-[14px_40px_minmax(0,1fr)] items-center border-t border-border py-2 text-[14px] leading-[1.4] text-foreground no-underline hover:text-brand-700 pointer-coarse:min-h-11",
                  item.id === lastId && "border-b"
                )}
              >
                <span className="block size-2">
                  {current && <span className="block size-2 bg-brand" />}
                </span>
                <span className="text-[13px] text-neutral-700 tabular-nums">{item.number}</span>
                <span>{item.label}</span>
              </a>
            )
          })}
        </React.Fragment>
      ))}
    </nav>
  )
}
