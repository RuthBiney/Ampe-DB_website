"use client"

import * as React from "react"

import { Eyebrow } from "@/components/site/eyebrow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  isValidId,
  movementTokens,
  recordKey,
  recordPaths,
  sanitizeId,
  type MovementToken,
} from "@/lib/record-path"

// Database 04.4: pick a movement token and type an identifier to see the
// canonical record key and its five file paths.
export function RecordPathBuilder() {
  const [movement, setMovement] = React.useState<MovementToken>("left_right")
  const [id, setId] = React.useState("C003")
  const valid = isValidId(id)
  const key = recordKey(movement, id)

  return (
    <div className="mt-10 grid gap-[22px] bg-surface p-[clamp(20px,3vw,32px)]">
      <div className="grid gap-1.5">
        <Eyebrow size="sm">Record key → file paths</Eyebrow>
        <h4 className="m-0 text-[21px]">Build the paths for any record</h4>
        <p className="m-0 text-[14px] text-neutral-700">
          Paths follow the naming rule. Confirm the record exists in the manifest before loading.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-x-5 gap-y-4">
        <div className="grid max-w-[220px] flex-[1_1_170px] gap-[5px]">
          <Label htmlFor="rec-move">Movement token</Label>
          <Select value={movement} onValueChange={(v) => setMovement(v as MovementToken)}>
            <SelectTrigger id="rec-move">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {movementTokens.map((token) => (
                <SelectItem key={token} value={token}>
                  {token}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid max-w-[160px] flex-[1_1_120px] gap-[5px]">
          <Label htmlFor="rec-id">Identifier</Label>
          <Input
            id="rec-id"
            value={id}
            placeholder="C003"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!valid}
            aria-describedby={valid ? undefined : "rec-id-error"}
            onChange={(e) => setId(sanitizeId(e.target.value))}
            className="font-mono"
          />
        </div>
        <div className="grid flex-[2_1_220px] gap-1 pb-1">
          <span className="text-[12px] text-neutral-700">Canonical record key</span>
          <code aria-live="polite" className="text-[16px] font-bold text-brand-700">
            {key}
          </code>
        </div>
      </div>

      <dl className="m-0 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-7 overflow-x-auto text-[14px]">
        {recordPaths(key).map(({ label, path }) => (
          <React.Fragment key={label}>
            <dt className="border-t border-border py-2.5 font-extrabold [&:nth-last-child(2)]:border-b">
              {label}
            </dt>
            <dd className="m-0 border-t border-border py-2.5 text-[13px] break-all last:border-b">
              <code className="text-[13px]">{path}</code>
            </dd>
          </React.Fragment>
        ))}
      </dl>

      {!valid && (
        <p id="rec-id-error" className="m-0 text-[14px] text-brand-800">
          Enter a three-digit identifier, for example C003.
        </p>
      )}
    </div>
  )
}
