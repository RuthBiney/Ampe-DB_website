import { Container } from "@/components/site/container"
import { utilityBar } from "@/content/site"

// Scrolls away above the sticky header. On phones the items read as one
// "·"-joined line (spread out, they wrap unevenly); from sm up they spread
// across the bar.
export function UtilityBar() {
  return (
    <div className="border-b border-border">
      <Container className="py-[7px] text-[12px] leading-[1.6] tracking-[.07em] text-neutral-700 uppercase">
        <p className="m-0 sm:hidden">{utilityBar.join(" · ")}</p>
        <div className="hidden justify-between gap-x-6 sm:flex">
          {utilityBar.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </Container>
    </div>
  )
}
