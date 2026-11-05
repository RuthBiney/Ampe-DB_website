// Declaration reference: "AMP-" + 6 characters from an alphabet without the
// look-alikes 0/O, 1/I/L (README → Production architecture).

export const REFERENCE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"
export const REFERENCE_PATTERN = /^AMP-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/

export function createReference(): string {
  const alphabet = REFERENCE_ALPHABET
  // Rejection sampling keeps every character equally likely.
  const limit = 256 - (256 % alphabet.length)
  let out = ""
  while (out.length < 6) {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    for (const byte of bytes) {
      if (byte < limit && out.length < 6) out += alphabet[byte % alphabet.length]
    }
  }
  return `AMP-${out}`
}
