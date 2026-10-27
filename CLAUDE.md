# Ampe-DB V1 website — rules for Claude Code

- Spec: `design-handoff/README.md`. Plan: `design-handoff/BUILD_PLAN.md`.
- Design reference: `design-handoff/reference/Ampe-DB Website (review copy).html` (open it in a browser) and its readable source `design-handoff/reference/Ampe-DB Website.dc.html`. Both are references, not code to ship.

## Stack
- Next.js App Router, TypeScript (strict). Server Components by default; `"use client"` only for the interactive pieces listed in README → Tech stack.
- Tailwind CSS v4 + shadcn/ui, themed to Modernist exactly as README → *shadcn/ui theme and component map* describes. Archivo (400/600/800) comes from `next/font/google`.
- shadcn components live in `components/ui/`. Edit them there to the Modernist specs; don't override their styles at each call site.
- Libraries: `lucide-react`, `zod`, `react-hook-form`, `jose`, `googleapis`, `nodemailer`. Ask before adding others.
- Content lives in typed modules in `content/`. Results, packages, FAQ and landmarks each have one source of truth, used everywhere they appear.

## Visual system (Modernist)
- Use the theme's colours and the spec's sizes; never hard-code a hex or invent a colour. The red is `brand` / `primary`; shadcn's `accent` is only the hover tint.
- Zero border radius. No shadows, gradients, transitions, animations or decorative backgrounds — no `shadow-*`, `rounded-*`, `transition-*` or `animate-*` classes.
- Structure comes from rules: 2px `border` colour between major sections, 1px between rows.
- Everything flush left, including labels inside wide buttons. No centred hero copy.
- Archivo only (400/600/800); headings 800.
- `brand` only for large type, numbers, primary buttons and small marks. Paragraph-size red text uses `brand-700`.
- Lucide icons only.

## Responsive
- Mobile-first. Every page works from 360px to 1440px and wider with no sideways scrolling; only table wrappers scroll horizontally.
- Touch targets are at least 44×44px on touch screens. Follow README → *Responsive behaviour* for the header, rail and grid rules.

## Content accuracy (this is a research dataset)
- Copy and numbers are final. Copy them verbatim from the reference; never round, recompute or paraphrase.
- Never invent a DOI, repository ID, publisher, licence name, URL or download link. Leave a clearly marked TODO instead.
- Use the exact terms: "duplicate-safe fixed split", "pair-held-out", "participant-held-out diagnostic" (never "participant-disjoint").
- Show only pseudonymous participant IDs — never names or identifying details.

## Security and privacy
- Secrets only in environment variables: `.env.local` (git-ignored) and Vercel. Keep `.env.example` current. Never commit keys or the service-account JSON.
- The Sheet ID, Drive file IDs and all credentials stay on the server — never in client components or `NEXT_PUBLIC_*` variables. The Turnstile site key is the only public one.
- Download tokens carry only the reference and the expiry. Verify them on every request.
- Store only the Sheet columns listed in the README — no IP addresses or user agents. Never log form contents.
- `/download` and `/api/*` are dynamic and `noindex`.

## Behaviour that must not regress
- Videos start muted; only one plays sound at a time; sound switches off when the video leaves the screen, the tab is hidden or the page changes.
- The declaration is not an approval: a valid submit emails the link straight away.
- Keep the section IDs listed in the README — other pages link to them.

## Workflow
- Follow BUILD_PLAN.md one phase at a time and stop at each checkpoint.
- Check each page against the reference at 390, 768 and 1440px wide.
- Before calling a phase done, run lint, typecheck, tests and `npm run build`. Commit at the end of each phase.
