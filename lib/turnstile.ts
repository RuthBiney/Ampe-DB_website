import { fakeServicesEnabled } from "@/lib/fake-services"
import { requireEnv } from "@/lib/server-env"

// Cloudflare Turnstile server-side check. The visitor's IP is not sent: the
// site stores and forwards no IP addresses.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  if (!token) return false
  if (fakeServicesEnabled()) return token === "e2e-turnstile-pass"

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    body: new URLSearchParams({ secret: requireEnv("TURNSTILE_SECRET_KEY").TURNSTILE_SECRET_KEY, response: token }),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) return false
  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}
