import { landmarks, torsoLandmarks } from "@/content/landmarks"
import { cn } from "@/lib/utils"

// Database 04.5: landmark_index 0–32, torso landmarks marked with a square.
export function LandmarkIndex() {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,180px),1fr))] gap-x-6 p-0 text-[14px]">
      {landmarks.map((name, index) => {
        const torso = torsoLandmarks.includes(index)
        return (
          <li
            key={name}
            className="grid grid-cols-[32px_12px_minmax(0,1fr)] items-center border-t border-border py-[7px]"
          >
            <span className={cn("font-bold tabular-nums", torso && "text-brand-700")}>{index}</span>
            <span aria-hidden="true" className={cn(torso && "size-[7px] bg-brand")} />
            <code className="text-[12.5px]">{name}</code>
          </li>
        )
      })}
    </ul>
  )
}
