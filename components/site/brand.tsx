import { Badge } from "@/components/ui/badge"

// Brand mark: two 9×9px squares, brand then ink, gap 3px.
export function BrandMark() {
  return (
    <span aria-hidden="true" className="inline-flex gap-[3px]">
      <span className="size-[9px] bg-brand" />
      <span className="size-[9px] bg-foreground" />
    </span>
  )
}

// Brand lockup used in the header and the menu: mark, "Ampe-DB", "V1" tag.
// The link around it sets the colour.
export function Brand() {
  return (
    <>
      <BrandMark />
      <span>Ampe-DB</span>
      <Badge
        variant="accent"
        className="px-1.5 py-px text-[10.5px] font-semibold tracking-[.06em]"
      >
        V1
      </Badge>
    </>
  )
}
