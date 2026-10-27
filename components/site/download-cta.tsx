import Link from "next/link"
import { DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { accessFormHref } from "@/content/site"
import { cn } from "@/lib/utils"

// "Download dataset" primary button → the access form.
export function DownloadCta({
  className,
  onClick,
}: {
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  return (
    <Button asChild className={cn("gap-2", className)}>
      <Link href={accessFormHref} onClick={onClick}>
        Download dataset <DownloadIcon aria-hidden="true" />
      </Link>
    </Button>
  )
}
