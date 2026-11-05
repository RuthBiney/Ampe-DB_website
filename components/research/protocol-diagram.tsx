import { cn } from "@/lib/utils"

// Research 05.2: conceptual comparison of the three evaluation protocols,
// redrawn in the site's style from Figure 4 of the research manuscript.
// Pseudonymous IDs only; the pairs and clip IDs are the figure's examples.
// Neutral marks were seen in development; brand marks are held out.

type Item = {
  pair: string
  clip?: string
  heldOut?: "pair" | "first"
  note?: string
}

type Protocol = {
  letter: string
  title: string
  subtitle: string
  partitions: readonly [Item[], Item[], Item[]]
  caption: string
  detail: string
  mark?: string
}

const partitionLabels = ["Train", "Validation", "Test"] as const

const protocols: Protocol[] = [
  {
    letter: "A",
    title: "Duplicate-safe fixed",
    subtitle: "Participants and pairs may recur",
    partitions: [
      [
        { pair: "P01–P02", clip: "C014" },
        { pair: "P01–P03", clip: "C021" },
      ],
      [
        { pair: "P01–P02", clip: "C087" },
        { pair: "P01–P03", clip: "C099" },
      ],
      [
        { pair: "P01–P02", clip: "C143" },
        { pair: "P01–P03", clip: "C152" },
      ],
    ],
    caption: "Same participants/pairs may appear across partitions,",
    detail: "but identical audiovisual content cannot.",
    mark: "exact duplicate",
  },
  {
    letter: "B",
    title: "Pair-held-out",
    subtitle: "Unseen participant-pair combination",
    partitions: [
      [{ pair: "P01–P02" }, { pair: "P03–P04" }, { pair: "P01–P05" }],
      [{ pair: "P03–P04" }, { pair: "P01–P05" }, { pair: "P01–P02" }],
      [{ pair: "P02–P05", heldOut: "pair", note: "held-out pair" }],
    ],
    caption: "P02 and P05 may appear individually during development,",
    detail: "but P02–P05 is absent from Train and Validation.",
  },
  {
    letter: "C",
    title: "Participant-held-out diagnostic",
    subtitle: "One completely unseen participant",
    partitions: [
      [{ pair: "P01–P02" }, { pair: "P01–P04" }],
      [{ pair: "P02–P04" }, { pair: "P01–P02" }],
      [{ pair: "P03–P02", heldOut: "first", note: "P03 held out from development" }],
    ],
    caption: "P03 is absent from Train and Validation",
    detail: "and appears only in Test interactions.",
  },
]

// Two participants joined by their interaction.
function PairMark({ heldOut }: { heldOut?: Item["heldOut"] }) {
  const first = heldOut ? "fill-brand" : "fill-neutral-900"
  const second = heldOut === "pair" ? "fill-brand" : "fill-neutral-900"
  const line = heldOut === "pair" ? "stroke-brand" : "stroke-neutral-900"
  return (
    <svg viewBox="0 0 56 14" className="h-3.5 w-14" aria-hidden="true">
      <line x1="7" y1="7" x2="49" y2="7" strokeWidth="2" className={line} />
      <circle cx="7" cy="7" r={heldOut === "first" ? 7 : 5} className={first} />
      <circle cx="49" cy="7" r="5" className={second} />
    </svg>
  )
}

function PartitionItem({ item }: { item: Item }) {
  return (
    <li
      className={cn(
        "grid justify-items-start gap-1.5",
        item.heldOut && "border-2 border-dashed border-brand p-2.5"
      )}
    >
      <PairMark heldOut={item.heldOut} />
      <span className="text-[13px] leading-[1.3] font-semibold tabular-nums">
        {item.pair}
        {item.clip && (
          <span className="block font-normal text-neutral-700">{item.clip}</span>
        )}
      </span>
      {item.note && <span className="text-[12px] leading-[1.35] text-brand-700">{item.note}</span>}
    </li>
  )
}

export function ProtocolDiagram() {
  return (
    <figure className="m-0 grid gap-4">
      <div className="grid border-t-2 border-border">
        {protocols.map((protocol) => (
          <section
            key={protocol.letter}
            aria-label={`${protocol.letter}. ${protocol.title}`}
            className="grid gap-x-8 gap-y-4 border-b border-border py-6 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
          >
            <div className="grid content-start gap-1.5">
              <h5 className="m-0 text-[18px] leading-[1.25]">
                <span className="text-brand">{protocol.letter}.</span> {protocol.title}
              </h5>
              <p className="m-0 text-[14px] text-neutral-700">{protocol.subtitle}</p>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 border-t border-border">
                {protocol.partitions.map((items, index) => (
                  <div
                    key={partitionLabels[index]}
                    className={cn("grid content-start gap-3 pt-3 pr-3", index > 0 && "border-l border-border pl-3")}
                  >
                    <p className="m-0 text-[12px] font-semibold tracking-[.08em] text-neutral-700 uppercase">
                      {partitionLabels[index]}
                    </p>
                    <ul className="m-0 grid list-none gap-3.5 p-0">
                      {items.map((item) => (
                        <PartitionItem key={`${item.pair}-${item.clip ?? ""}`} item={item} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="m-0 max-w-[60ch] text-[14px] leading-[1.5] text-neutral-800">
                {protocol.caption} {protocol.detail}
                {protocol.mark && (
                  <span className="mt-1 block text-[13px] text-neutral-700">
                    <span className="mr-1.5 font-extrabold text-brand" aria-hidden="true">
                      ≠
                    </span>
                    {protocol.mark}
                  </span>
                )}
              </p>
            </div>
          </section>
        ))}
      </div>
      <figcaption className="m-0 grid gap-1 text-[13px] leading-[1.5] text-neutral-700">
        <span>
          Each protocol defines a different boundary on what information can recur across
          development and test partitions.
        </span>
        <span>Redrawn from Figure 4 of the Ampe-DB research manuscript.</span>
      </figcaption>
    </figure>
  )
}
