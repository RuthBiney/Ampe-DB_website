"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, MailIcon } from "lucide-react"

import { Eyebrow } from "@/components/site/eyebrow"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Access declaration (Getting 03.1). Phase 4 builds the visual states —
// form, sending, error and "Check your email". POST /api/declarations
// arrives in Phase 5; until then a submit honestly shows the error state.
// TODO(Phase 5): shared zod schema, react-hook-form, Turnstile widget above
// the submit button.

const intendedUses = [
  "Academic research",
  "Education",
  "Cultural or artistic work",
  "Independent exploration",
  "Other",
] as const

type FieldName = "name" | "email" | "affiliation" | "use" | "description" | "agree"
type Status = "idle" | "sending" | "error"
type Sent = { email: string; expiresAt: string }

const expiryFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function AccessForm() {
  const [sent, setSent] = React.useState<Sent | null>(null)
  // Remounts the form empty after "Submit another declaration".
  const [formKey, setFormKey] = React.useState(0)

  return (
    <div className="grid gap-[18px] bg-surface p-[clamp(20px,3vw,32px)]">
      {sent ? (
        <SentState
          sent={sent}
          onReset={() => {
            setSent(null)
            setFormKey((key) => key + 1)
          }}
        />
      ) : (
        <DeclarationForm key={formKey} onSent={setSent} />
      )}
    </div>
  )
}

function DeclarationForm({ onSent }: { onSent: (sent: Sent) => void }) {
  const [status, setStatus] = React.useState<Status>("idle")
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<FieldName, string>>>({})
  const sending = status === "sending"

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    setStatus("sending")
    setFieldErrors({})
    try {
      const response = await fetch("/api/declarations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          affiliation: data.get("affiliation"),
          use: data.get("use"),
          description: data.get("description"),
          agree: data.get("agree") === "on",
          company_website: data.get("company_website"),
        }),
      })
      const result = await response.json().catch(() => null)
      if (response.ok && result?.ok) {
        onSent({ email: String(data.get("email")), expiresAt: result.expiresAt })
        return
      }
      if (result?.fieldErrors) setFieldErrors(result.fieldErrors)
      setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" aria-busy={sending}>
      <div className="grid gap-1.5">
        <Eyebrow size="sm">Access declaration</Eyebrow>
        <h3 className="m-0 text-[23px] leading-[1.2]">Declare your intended use</h3>
        <p className="m-0 text-[14px] leading-[1.55] text-neutral-700">
          Required before download. Takes about a minute.
        </p>
      </div>

      <Field id="f-name" label="Full name" error={fieldErrors.name}>
        <Input id="f-name" name="name" autoComplete="name" required />
      </Field>
      <Field id="f-email" label="Contact email" error={fieldErrors.email}>
        <Input id="f-email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field id="f-aff" label="Affiliation (optional)" error={fieldErrors.affiliation}>
        <Input
          id="f-aff"
          name="affiliation"
          autoComplete="organization"
          placeholder="University, organization or independent"
        />
      </Field>
      <Field id="f-use" label="Intended use" error={fieldErrors.use}>
        <Select name="use" required>
          <SelectTrigger id="f-use">
            <SelectValue placeholder="Select a purpose" />
          </SelectTrigger>
          <SelectContent>
            {intendedUses.map((use) => (
              <SelectItem key={use} value={use}>
                {use}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field id="f-desc" label="Project or purpose description" error={fieldErrors.description}>
        <Textarea id="f-desc" name="description" rows={3} required />
      </Field>

      {/* TODO(decision open): link the maintainers' privacy notice next to this checkbox. */}
      <div className="grid gap-[5px]">
        <div className="grid grid-cols-[22px_minmax(0,1fr)] items-start gap-2 text-[14px] leading-[1.5]">
          <Checkbox
            id="f-agree"
            name="agree"
            required
            className="mt-0.5"
            aria-invalid={fieldErrors.agree ? true : undefined}
            aria-describedby={fieldErrors.agree ? "f-agree-error" : undefined}
          />
          <label htmlFor="f-agree" className="cursor-pointer">
            I have read and accept the Terms of Use, License and Research Data Use Agreement.
          </label>
        </div>
        <FieldError id="f-agree" error={fieldErrors.agree} />
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="f-company-website">Company website</label>
        <input id="f-company-website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-3">
        <Button
          type="submit"
          disabled={sending}
          className="mt-2 w-full justify-start gap-2.5 px-4 py-[13px] text-[15px]"
        >
          {sending ? (
            "Sending your link…"
          ) : (
            <>
              Submit and get your download link
              <ArrowRightIcon aria-hidden="true" />
            </>
          )}
        </Button>
        {status === "error" && (
          <p role="alert" className="m-0 text-[14px] text-brand-800">
            We couldn’t send your link. Please try again, or{" "}
            <Link href="/contact" className="text-brand-800">
              contact the team
            </Link>
            .
          </p>
        )}
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactElement<{ "aria-invalid"?: boolean; "aria-describedby"?: string }>
}) {
  const control = error
    ? React.cloneElement(children, { "aria-invalid": true, "aria-describedby": `${id}-error` })
    : children
  return (
    <div className="grid gap-[5px]">
      <Label htmlFor={id}>{label}</Label>
      {control}
      <FieldError id={id} error={error} />
    </div>
  )
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null
  return (
    <p id={`${id}-error`} className="m-0 text-[14px] text-brand-800">
      {error}
    </p>
  )
}

function SentState({ sent, onReset }: { sent: Sent; onReset: () => void }) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => headingRef.current?.focus(), [])

  return (
    <div role="status" className="grid gap-3.5">
      <Eyebrow size="sm" className="inline-flex items-center gap-2">
        <MailIcon size={14} aria-hidden="true" />
        Check your email
      </Eyebrow>
      <h3 ref={headingRef} tabIndex={-1} className="m-0 text-[24px] leading-[1.2] outline-none">
        Your download link is on its way.
      </h3>
      <p className="m-0 text-[15px] text-neutral-800">
        We’ve sent a personal link to <strong className="wrap-anywhere">{sent.email}</strong>. It
        works until {expiryFormat.format(new Date(sent.expiresAt))} — download only the packages
        your research needs.
      </p>
      <p className="m-0 text-[14px] leading-[1.55] text-neutral-700">
        Nothing after a few minutes? Check your spam folder, or submit the form again for a new link.
      </p>
      <div>
        <Button type="button" variant="ghost" onClick={onReset}>
          Submit another declaration
        </Button>
      </div>
    </div>
  )
}
