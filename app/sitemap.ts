import type { MetadataRoute } from "next"

import { navItems } from "@/content/site"
import { publicSiteUrl } from "@/lib/server-env"

// The seven pages in the nav. /download and /api/* stay out (README → Routes).

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl()
  return navItems.map((item) => ({ url: new URL(item.href, base).href }))
}
