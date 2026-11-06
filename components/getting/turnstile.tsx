"use client"

import * as React from "react"
import Script from "next/script"

import { TURNSTILE_ACTION } from "@/lib/turnstile-action"

// Cloudflare Turnstile widget, rendered explicitly so the form can reset it
// after each submit (tokens are single-use). The site key is the only public
// key on the site. Below 300px of width the widget switches to its compact
// size so the form never scrolls sideways at 360px.

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

export type TurnstileHandle = { reset: () => void }

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""

export function Turnstile({
  onToken,
  ref,
}: {
  onToken: (token: string | null) => void
  ref?: React.Ref<TurnstileHandle>
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const widgetId = React.useRef<string | null>(null)
  const [ready, setReady] = React.useState(false)
  const onTokenRef = React.useRef(onToken)
  React.useEffect(() => {
    onTokenRef.current = onToken
  })

  React.useImperativeHandle(ref, () => ({
    reset() {
      onTokenRef.current(null)
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current)
    },
  }))

  React.useEffect(() => {
    const element = containerRef.current
    const api = window.turnstile
    if (!ready || !element || !api || !siteKey) return
    const id = api.render(element, {
      sitekey: siteKey,
      action: TURNSTILE_ACTION,
      size: element.clientWidth >= 300 ? "flexible" : "compact",
      theme: "light",
      callback: (token: string) => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(null),
      "error-callback": () => onTokenRef.current(null),
    })
    widgetId.current = id
    return () => {
      widgetId.current = null
      api.remove(id)
    }
  }, [ready])

  if (!siteKey) {
    // TODO(setup): set NEXT_PUBLIC_TURNSTILE_SITE_KEY — see .env.example.
    return null
  }

  return (
    <>
      <Script
        src={SCRIPT_URL}
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px] w-full" />
    </>
  )
}
