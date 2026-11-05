import { jwtVerify, SignJWT } from "jose"

import { REFERENCE_PATTERN } from "@/lib/reference"

// Download token: carries only the reference (`sub`) and the expiry (`exp`) —
// never a name or an email. HS256 with DOWNLOAD_TOKEN_SECRET. Verified on
// every request to /download and /api/download/*.

const ALGORITHM = "HS256"

export async function signDownloadToken(
  reference: string,
  expiresAt: Date,
  secret: Uint8Array
): Promise<string> {
  return new SignJWT()
    .setProtectedHeader({ alg: ALGORITHM, typ: "JWT" })
    .setSubject(reference)
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secret)
}

export type VerifiedToken = { reference: string; expiresAt: Date }

// Returns null for a missing, malformed, edited or expired token.
export async function verifyDownloadToken(
  token: string | null | undefined,
  secret: Uint8Array
): Promise<VerifiedToken | null> {
  if (!token || token.length > 1024) return null
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ALGORITHM],
      requiredClaims: ["sub", "exp"],
    })
    if (typeof payload.sub !== "string" || !REFERENCE_PATTERN.test(payload.sub)) return null
    if (typeof payload.exp !== "number") return null
    return { reference: payload.sub, expiresAt: new Date(payload.exp * 1000) }
  } catch {
    return null
  }
}
