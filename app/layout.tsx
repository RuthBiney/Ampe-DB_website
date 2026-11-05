import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { UtilityBar } from "@/components/site/utility-bar"
import { publicSiteUrl } from "@/lib/server-env"
import "./globals.css"

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
  // Archivo has no arrow glyph (→). Fall back to the system UI font as the
  // design does, not to the size-adjusted Arial next/font inserts by default.
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
})

// Icons and the social image come from app/ (favicon.ico, icon.svg,
// apple-icon.png, opengraph-image.png + .alt.txt). og:title is left to each
// page's <title>, which link previews fall back to.
export const metadata: Metadata = {
  metadataBase: publicSiteUrl(),
  title: {
    default: "Ampe-DB V1 · Human interaction dataset from the Ghanaian game Ampe",
    template: "%s · Ampe-DB V1",
  },
  description:
    "Ampe-DB V1: a dataset for human activity and interaction analysis using the Ghanaian game Ampe.",
  openGraph: { type: "website", siteName: "Ampe-DB V1", locale: "en_GB" },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={archivo.variable}>
      <body>
        <UtilityBar />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
