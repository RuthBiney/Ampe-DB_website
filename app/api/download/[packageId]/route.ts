import { type NextRequest } from "next/server"

import { packages, type PackageId } from "@/content/packages"
import { packageDownloadUrl } from "@/lib/downloads"
import { logFailure } from "@/lib/log"
import { tokenSecret } from "@/lib/server-env"
import { appendDownload } from "@/lib/sheets"
import { verifyDownloadToken } from "@/lib/token"

// GET /api/download/<packageId>?token=… — verify the token again, log the
// download, then redirect to the file. The file ID never reaches the browser
// except as this redirect's Location.

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }

function isPackageId(value: string): value is PackageId {
  return packages.some((pkg) => pkg.id === value)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  const { packageId } = await params
  const token = request.nextUrl.searchParams.get("token")

  const verified = await verifyDownloadToken(token, tokenSecret())
  if (!verified) {
    // Back to the personal download page, which shows the expired state.
    return Response.redirect(new URL("/download", request.nextUrl), 303)
  }

  if (!isPackageId(packageId)) {
    return new Response("Unknown package", { status: 404, headers })
  }

  const target = packageDownloadUrl(packageId)
  if (!target) {
    logFailure(`download: ${packageId}`, new Error("Drive file ID not configured"))
    return new Response("This package isn’t available yet. Please contact the team.", {
      status: 503,
      headers,
    })
  }

  // A logging outage shouldn't stop someone holding a valid link: record the
  // failure and still send them to the file.
  try {
    await appendDownload({ downloadedAt: new Date(), reference: verified.reference, packageId })
  } catch (error) {
    logFailure("download: sheet append", error)
  }

  return new Response(null, { status: 302, headers: { ...headers, Location: target } })
}
