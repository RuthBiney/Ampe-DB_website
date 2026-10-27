import * as React from "react"
import { cn } from "@/lib/utils"

// Database 04.5: 2 × 33 × 3 + 2 = 200 features per step.
const terms = [
  { value: "2", label: "Players" },
  { op: "×", value: "33", label: "Landmarks" },
  { op: "×", value: "3", label: "x, y, visibility" },
  { op: "+", value: "2", label: "Presence flags" },
  { op: "=", value: "200", label: "Features per step", result: true },
] as const

export function FeatureEquation() {
  return (
    <div className="grid gap-5 bg-surface p-[clamp(20px,3vw,32px)]">
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3.5">
        {terms.map((term) => (
          <React.Fragment key={term.label}>
            {"op" in term && (
              <div aria-hidden="true" className="pb-7 text-[26px] leading-none text-neutral-700">
                {term.op}
              </div>
            )}
            <div>
              <div
                className={cn(
                  "text-[clamp(30px,3.4vw,44px)] leading-none font-extrabold tabular-nums",
                  "result" in term && "text-brand"
                )}
              >
                {term.value}
              </div>
              <div className="mt-2 text-[12px] tracking-[.06em] text-neutral-700 uppercase">
                {term.label}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <p className="m-0 border-t border-border pt-3.5 text-[15px]">
        Pose clips are temporally sampled to <strong>32 steps</strong>, giving a 32 × 200 input
        sequence per clip.
      </p>
    </div>
  )
}
