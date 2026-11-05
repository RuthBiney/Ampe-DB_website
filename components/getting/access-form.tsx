"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRightIcon, MailIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { Turnstile, type TurnstileHandle } from "@/components/getting/turnstile"
import { Eyebrow } from "@/components/site/eyebrow"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  declarationSchema,
  intendedUses,
  type Declaration,
  type DeclarationField,
  type DeclarationInput,
  type DeclarationResponse,
} from "@/lib/declaration"
import { formatExpiry } from "@/lib/format-expiry"

// Access declaration (Getting 03.1). Native constraint validation first,
// then the shared zod schema here and again on the server. A valid submit
// emails the personal link straight away — the declaration is not an approval.

type Sent = { email: string; expiresAt: string }

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

const emptyDeclaration: Partial<DeclarationInput> = {
  name: "",
  email: "",
  affiliation: "",
  use: undefined,
  description: "",
  agree: false,
}

function DeclarationForm({ onSent }: { onSent: (sent: Sent) => void }) {
  const form = useForm<DeclarationInput, unknown, Declaration>({
    resolver: zodResolver(declarationSchema),
    defaultValues: emptyDeclaration,
  })
  const [failed, setFailed] = React.useState(false)
  const honeypotRef = React.useRef<HTMLInputElement>(null)
  const turnstileRef = React.useRef<TurnstileHandle>(null)
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null)
  const sending = form.formState.isSubmitting

  async function send(declaration: Declaration) {
    setFailed(false)
    try {
      const response = await fetch("/api/declarations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...declaration,
          company_website: honeypotRef.current?.value ?? "",
          turnstileToken: turnstileToken ?? undefined,
        }),
      })
      const result = (await response.json().catch(() => null)) as DeclarationResponse | null
      if (response.ok && result?.ok) {
        onSent({ email: declaration.email, expiresAt: result.expiresAt })
        return
      }
      if (result && !result.ok && result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          form.setError(field as DeclarationField, { message })
        }
      }
      setFailed(true)
    } catch {
      setFailed(true)
    } finally {
      // Turnstile tokens are single-use; get a fresh one for the next try.
      turnstileRef.current?.reset()
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!event.currentTarget.reportValidity()) {
      event.preventDefault()
      return
    }
    void form.handleSubmit(send)(event)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="grid gap-4" aria-busy={sending}>
        <div className="grid gap-1.5">
          <Eyebrow size="sm">Access declaration</Eyebrow>
          <h3 className="m-0 text-[23px] leading-[1.2]">Declare your intended use</h3>
          <p className="m-0 text-[14px] leading-[1.55] text-neutral-700">
            Required before download. Takes about a minute.
          </p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input autoComplete="name" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="affiliation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affiliation (optional)</FormLabel>
              <FormControl>
                <Input
                  autoComplete="organization"
                  placeholder="University, organization or independent"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="use"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intended use</FormLabel>
              <Select
                name={field.name}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                required
              >
                <FormControl>
                  <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {intendedUses.map((use) => (
                    <SelectItem key={use} value={use}>
                      {use}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project or purpose description</FormLabel>
              <FormControl>
                <Textarea rows={3} required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TODO(decision open): link the maintainers' privacy notice next to this checkbox. */}
        <FormField
          control={form.control}
          name="agree"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-[22px_minmax(0,1fr)] items-start gap-2 text-[14px] leading-[1.5]">
                <FormControl>
                  <Checkbox
                    ref={field.ref}
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    onBlur={field.onBlur}
                    required
                    className="mt-0.5"
                  />
                </FormControl>
                <FormLabel className="cursor-pointer text-[14px] leading-[1.5] text-foreground">
                  I have read and accept the Terms of Use, License and Research Data Use Agreement.
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot: hidden from people, filled in by bots. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="f-company-website">Company website</label>
          <input
            ref={honeypotRef}
            id="f-company-website"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-3">
          <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />
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
          {failed && (
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
    </Form>
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
        works until {formatExpiry(sent.expiresAt)} — download only the packages
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
