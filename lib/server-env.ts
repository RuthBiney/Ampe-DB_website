import type { PackageId } from "@/content/packages"
import { packages } from "@/content/packages"

// Server-only settings (README → Environment variables). Read lazily so the
// build doesn't need secrets; each service asks only for the variables it
// uses, and a missing one fails that request loudly instead of half-working.
// Never import from a client component.

type ServerVariable =
  | "SITE_URL"
  | "DOWNLOAD_TOKEN_SECRET"
  | "GOOGLE_SERVICE_ACCOUNT_EMAIL"
  | "GOOGLE_PRIVATE_KEY"
  | "GOOGLE_SHEET_ID"
  | "GMAIL_USER"
  | "GMAIL_APP_PASSWORD"
  | "TURNSTILE_SECRET_KEY"

export function requireEnv<const Name extends ServerVariable>(
  ...names: Name[]
): Record<Name, string> {
  const values = {} as Record<Name, string>
  const missing: string[] = []
  for (const name of names) {
    const value = process.env[name]?.trim()
    if (value) values[name] = value
    else missing.push(name)
  }
  if (missing.length) throw new Error(`Missing server environment variables: ${missing.join(", ")}`)
  return values
}

export function siteUrl(): string {
  const { SITE_URL } = requireEnv("SITE_URL")
  const url = new URL(SITE_URL)
  return url.origin
}

// Base URL for metadata, the sitemap and robots.txt, read at build time.
// Unlike siteUrl() it never throws: a build without SITE_URL falls back to
// Vercel's production address, then to localhost.
export function publicSiteUrl(): URL {
  const configured = process.env.SITE_URL?.trim()
  if (configured) return new URL(new URL(configured).origin)
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  return new URL(vercel ? `https://${vercel}` : "http://localhost:3000")
}

export function tokenSecret(): Uint8Array {
  const { DOWNLOAD_TOKEN_SECRET } = requireEnv("DOWNLOAD_TOKEN_SECRET")
  if (DOWNLOAD_TOKEN_SECRET.length < 32) {
    throw new Error("DOWNLOAD_TOKEN_SECRET must be at least 32 characters")
  }
  return new TextEncoder().encode(DOWNLOAD_TOKEN_SECRET)
}

// Drive file ID for a package, or undefined when its variable isn't set yet.
export function driveFileId(packageId: PackageId): string | undefined {
  const pkg = packages.find((item) => item.id === packageId)
  const value = pkg ? process.env[pkg.driveFileEnv]?.trim() : undefined
  return value || undefined
}
