import type { MetadataRoute } from "next"

import { publicSiteUrl } from "@/lib/server-env"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/download", "/api/"] },
    sitemap: new URL("/sitemap.xml", publicSiteUrl()).href,
  }
}
