import { cn } from "@/lib/utils"

// Database 04.6: the four movement classes and the binary relation they map
// to. The diagonal (same leg configuration) is brand-200 on brand-900.
const headClasses =
  "bg-background px-[clamp(10px,3vw,14px)] text-[11px] font-semibold tracking-[.08em] text-neutral-700 uppercase"

function Cell({ label, relation, same }: { label: string; relation: string; same: boolean }) {
  return (
    <div
      className={cn(
        "grid min-w-0 gap-1.5 px-[clamp(10px,3vw,16px)] py-[18px]",
        same ? "bg-brand-200 text-brand-900" : "bg-background"
      )}
    >
      <code className="text-[clamp(13px,3.4vw,15px)] font-bold wrap-anywhere">{label}</code>
      <span className={cn("text-[13px] wrap-anywhere", !same && "text-neutral-700")}>{relation}</span>
    </div>
  )
}

export function LabelMatrix() {
  return (
    <div className="grid max-w-[680px] grid-cols-[minmax(72px,.7fr)_repeat(2,minmax(0,1fr))] gap-0.5 border-2 border-border bg-border">
      <div className="bg-background py-3" />
      <div className={cn(headClasses, "py-3")}>Second token · left</div>
      <div className={cn(headClasses, "py-3")}>Second token · right</div>
      <div className={cn(headClasses, "py-[18px]")}>First token · left</div>
      <Cell label="left_left" relation="same_leg_configuration" same />
      <Cell label="left_right" relation="different_leg_configuration" same={false} />
      <div className={cn(headClasses, "py-[18px]")}>First token · right</div>
      <Cell label="right_left" relation="different_leg_configuration" same={false} />
      <Cell label="right_right" relation="same_leg_configuration" same />
    </div>
  )
}
