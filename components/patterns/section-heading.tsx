import { Eyebrow } from "@/components/site/eyebrow"

// Home section heading: eyebrow, then an H2 at clamp(32px, 3.8vw, 52px) / 1.04
// with explicit lines.
export function SectionHeading({
  eyebrow,
  lines,
  id,
  className,
}: {
  eyebrow: string
  lines: readonly string[]
  id?: string
  className?: string
}) {
  return (
    <div className={className}>
      <Eyebrow className="block">{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="mt-3.5 mb-0 text-[clamp(32px,3.8vw,52px)] leading-[1.04] tracking-[-.025em]"
      >
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  )
}

