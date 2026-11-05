import type { PackageId } from "@/content/packages"
import { driveFileId } from "@/lib/server-env"

// Where a package download goes. Today: Google Drive's direct-download URL,
// whose address does not expire (README → How strict the gate is). To make
// links genuinely expire, swap this one module for presigned object-storage
// URLs (Cloudflare R2 or Amazon S3).

export function packageDownloadUrl(packageId: PackageId): string | null {
  const fileId = driveFileId(packageId)
  if (!fileId) return null
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`
}
