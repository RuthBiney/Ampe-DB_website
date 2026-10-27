import { Legend, LegendSwatch } from "@/components/patterns/legend"
import { ProportionBar } from "@/components/patterns/proportion-bar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Research 05.2: the generalization ladder, one row per protocol.
const steps = [
  {
    title: "Duplicate-safe fixed",
    role: "Reference benchmark",
    text: "Locked split of 444 train / 97 validation / 96 test records. Exact-duplicate audiovisual groups stay within one partition, removing duplicate leakage.",
    split: true,
  },
  {
    title: "Pair-held-out",
    role: "Primary benchmark",
    primary: true,
    text: "Four folds. Test participant pairs do not appear as pairs in training for that fold; individual participants may still be seen with different partners. The primary benchmark for unseen pair combinations.",
  },
  {
    title: "Participant-held-out diagnostic",
    role: "Diagnostic",
    text: "One participant is absent from training and validation and appears only in diagnostic test interactions. Six participants are eligible for four-class evaluation and eight for binary evaluation. A complementary check on unseen-participant transfer.",
  },
] as const

export function ProtocolLadder() {
  return (
    <ol className="m-0 grid list-none p-0">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={cn(
            "grid grid-cols-[64px_minmax(0,1fr)] gap-x-5 gap-y-3 border-border py-[22px]",
            index === 0 ? "border-t-2" : "border-t last:border-b"
          )}
        >
          <span className="text-[32px] leading-none font-extrabold text-brand tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="grid gap-2.5">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
              <h4 className="m-0 text-[20px]">{step.title}</h4>
              <Badge variant={"primary" in step ? "accent" : "neutral"} className="font-semibold">
                {step.role}
              </Badge>
            </div>
            <p className="m-0 max-w-[64ch]">{step.text}</p>
            {"split" in step && (
              <div className="mt-1.5 grid max-w-[560px] gap-2">
                <ProportionBar
                  className="h-3.5"
                  label="444 train, 97 validation, 96 test"
                  segments={[
                    { count: 444, className: "bg-neutral-900" },
                    { count: 97, className: "bg-neutral-600" },
                    { count: 96, className: "bg-brand" },
                  ]}
                />
                <Legend className="gap-x-[18px] gap-y-1 tabular-nums">
                  <LegendSwatch size={10} swatchClassName="bg-neutral-900" className="gap-[7px]">
                    444 train
                  </LegendSwatch>
                  <LegendSwatch size={10} swatchClassName="bg-neutral-600" className="gap-[7px]">
                    97 validation
                  </LegendSwatch>
                  <LegendSwatch size={10} swatchClassName="bg-brand" className="gap-[7px]">
                    96 test
                  </LegendSwatch>
                </Legend>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
