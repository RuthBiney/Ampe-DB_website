import { fakeServicesEnabled } from "@/lib/fake-services"
import { requireEnv } from "@/lib/server-env"

// Cloudflare Turnstile server-side check. The visitor's IP is not sent: the
// site stores and forwards no IP addresses.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

// A rejection logs Cloudflare's error codes (fixed strings such as
// "invalid-input-secret"), never the token, so a misconfigured key shows up
// in the logs instead of only as the form's general error.
function logRejection(reason: string) {
  console.warn(`[declarations: turnstile] rejected: ${reason}`)
}

export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  if (!token) {
    logRejection("missing-input-response")
    return false
  }
  if (fakeServicesEnabled()) return token === "e2e-turnstile-pass"

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    body: new URLSearchParams({ secret: requireEnv("TURNSTILE_SECRET_KEY").TURNSTILE_SECRET_KEY, response: token }),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) {
    logRejection(`siteverify HTTP ${response.status}`)
    return false
  }
  const result = (await response.json()) as { success?: boolean; "error-codes"?: unknown }
  if (result.success === true) return true
  const codes = Array.isArray(result["error-codes"])
    ? result["error-codes"].filter((code): code is string => typeof code === "string")
    : []
  logRejection(codes.length ? codes.join(", ") : "unknown")
  return false
}
