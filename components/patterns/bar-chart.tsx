import { Legend, LegendSwatch } from "@/components/patterns/legend"
import { Card } from "@/components/ui/card"
import { modalities, protocols, resultFor, type Modality, type Task } from "@/content/results"

// Macro-F1 bar chart (Research 05.3; Home without the toggle). Fill width is
// the value × 100%.

const barColour: Record<Modality, string> = {
  rgb: "bg-neutral-600",
  pose: "bg-brand",
  fusion: "bg-neutral-900",
}

const rowGrid = "grid grid-cols-[78px_minmax(0,1fr)_44px]"

export function ChartLegend({ className }: { className?: string }) {
  return (
    <Legend className={className}>
      {modalities.map((m) => (
        <LegendSwatch key={m.id} swatchClassName={barColour[m.id]}>
          {m.chartLabel}
        </LegendSwatch>
      ))}
    </Legend>
  )
}

export function ChartGroups({ task }: { task: Task }) {
  return (
    <div className="grid gap-[22px]">
      {protocols.map((protocol) => {
        const row = resultFor(task, protocol.id)
        return (
          <div key={protocol.id} className="grid gap-[9px] border-t-2 border-border pt-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <span className="font-extrabold">{protocol.chartLabel}</span>
              <span className="text-[13px] text-neutral-700">{protocol.chartNote}</span>
            </div>
            <div className={`${rowGrid} items-center gap-x-3 gap-y-[7px] text-[13px]`}>
              {modalities.map((m) => (
                <BarRow key={m.id} label={m.chartLabel} value={row[m.id]} colour={barColour[m.id]} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BarRow({ label, value, colour }: { label: string; value: string; colour: string }) {
  // Published to three decimals; thousandths / 10 gives an exact percentage.
  const width = `${Math.round(Number(value) * 1000) / 10}%`
  return (
    <>
      <span className="text-neutral-700">{label}</span>
      <span aria-hidden="true" className="block h-4 bg-background">
        <span className={`block h-full ${colour}`} style={{ width }} />
      </span>
      <span className="text-right font-semibold tabular-nums">{value}</span>
    </>
  )
}

export function ChartAxis() {
  return (
    <div aria-hidden="true" className={`${rowGrid} gap-3 text-[12px] text-neutral-700 tabular-nums`}>
      <span />
      <span className="relative block h-4">
        <span className="absolute left-0">0</span>
        <span className="absolute left-1/2 -translate-x-1/2">0.5</span>
        <span className="absolute right-0">1.0</span>
      </span>
      <span />
    </div>
  )
}

/** Home: the four-class chart without the task toggle. */
export function StaticChartPanel() {
  return (
    <Card className="gap-[22px] p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2.5">
        <span className="text-[13px] font-semibold tracking-[.08em] uppercase">
          Four-class Macro-F1 by protocol
        </span>
        <ChartLegend />
      </div>
      <ChartGroups task="four" />
      <ChartAxis />
    </Card>
  )
}
