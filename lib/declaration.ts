import { z } from "zod"

// The access declaration (Getting 03.1). One schema for the form and for
// POST /api/declarations, so the client and the server agree on every rule.

export const intendedUses = [
  "Academic research",
  "Education",
  "Cultural or artistic work",
  "Independent exploration",
  "Other",
] as const

// No line breaks or other control characters in one-line fields.
const singleLine = /^[^\u0000-\u001f\u007f]*$/

export const declarationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your full name.")
    .max(200, "Use 200 characters or fewer.")
    .regex(singleLine, "Use a single line."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your contact email.")
    .max(254, "Use 254 characters or fewer.")
    .pipe(z.email("Enter a valid email address.")),
  affiliation: z
    .string()
    .trim()
    .max(200, "Use 200 characters or fewer.")
    .regex(singleLine, "Use a single line."),
  use: z.enum(intendedUses, "Select a purpose."),
  description: z
    .string()
    .trim()
    .min(1, "Describe your project or purpose.")
    .max(2000, "Use 2,000 characters or fewer."),
  agree: z
    .boolean()
    .refine((accepted) => accepted, "Accept the Terms of Use, License and Research Data Use Agreement."),
})

export type DeclarationInput = z.input<typeof declarationSchema>
export type Declaration = z.output<typeof declarationSchema>
export type DeclarationField = keyof Declaration

// The request body is these fields plus `company_website` (the honeypot)
// and `turnstileToken`; the response is one of these.
export type DeclarationResponse =
  | { ok: true; expiresAt: string }
  | { ok: false; fieldErrors?: Partial<Record<DeclarationField, string>> }
