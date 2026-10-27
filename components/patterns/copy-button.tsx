"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const COPIED_MS = 2200

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback for browsers or contexts without the async clipboard API.
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.style.position = "fixed"
    area.style.opacity = "0"
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand("copy")
    area.remove()
    if (!ok) throw new Error("Copy failed")
  }
}

// Copies `text` (whitespace collapsed); the label reads "Copied" for 2.2s.
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = async () => {
    try {
      await copyText(text.replace(/\s+/g, " ").trim())
    } catch {
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS)
  }

  return (
    <Button type="button" variant="outline" className="gap-2" onClick={onClick}>
      {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </Button>
  )
}
