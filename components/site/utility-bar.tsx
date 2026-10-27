import { Container } from "@/components/site/container"
import { utilityBar } from "@/content/site"

// Scrolls away above the sticky header.
export function UtilityBar() {
  return (
    <div className="border-b border-border">
      <Container className="flex flex-wrap justify-between gap-x-6 gap-y-0.5 py-[7px] text-[12px] leading-[1.6] tracking-[.07em] text-neutral-700 uppercase">
        <span>{utilityBar.release}</span>
        <span>{utilityBar.academy}</span>
      </Container>
    </div>
  )
}
