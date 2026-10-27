# Handoff: Ampe-DB V1 website

## Overview
A seven-page public website, plus a personal download page, for **Ampe-DB V1** — a research dataset of two-person interactions from Ampe, a traditional Ghanaian game — developed through the Young Africans Research Academy (YARA) by Ruth Senior Biney and Isaac Kojo Yedonu Aboah. Audience: computer-vision, pose-estimation and human-activity-recognition researchers.

| Page | Job |
|---|---|
| Home | Explain the dataset and its cultural context; headline numbers; the benchmark finding; how to start; citation |
| Terms of Use | Summarise the release terms: permitted and prohibited use, attribution, privacy, cultural responsibility |
| Getting the Database | Collect a **mandatory use declaration**, then email a personal, expiring download link straight away (a declaration, not an approval) |
| Database | Technical documentation: structure, formats, naming, pose format, labels, participants, recording, manifest |
| Research | The frozen Baseline V1 benchmark: tasks, protocols, results, pipeline, QC, limitations, publication |
| FAQ | 15 questions in 4 topics |
| Contact Us | Team contacts and how to report a dataset issue |
| Download | Not in the nav. Opened from the emailed link: the packages with download buttons, or an expired state |

## About the design files
The files in `reference/` are **design references created in HTML** — a working prototype of the intended look, content and behaviour, not production code. Recreate the design in a real codebase using that codebase's normal patterns. The stack is decided: see *Tech stack (decided)*.

## Fidelity
**High-fidelity.** Colours, type, spacing, layout, copy and interactions are final; recreate them faithfully. All copy and every number comes from the dataset's release documentation — copy text verbatim from the reference. Don't paraphrase, round or recompute figures.

## Start here
1. Follow `BUILD_PLAN.md` (next to this file): one-time setup, then six phases, each with a prompt to paste into Claude Code and a checkpoint.
2. `CLAUDE.md` sits at the repository root and holds the standing rules; Claude Code reads it automatically.
3. Build from this README; use the reference to check the result.

## Reading the reference
- **`reference/Ampe-DB Website (review copy).html`** — open in any browser; self-contained, works offline. Use the header nav. Sections deep-link as `#/<page>/<sectionId>`, e.g. `#/research/rs_results`.
- **`reference/Ampe-DB Website.dc.html`** — the readable source and the canonical spec for exact values. Read it in an editor; it does not run on its own (it needs the design tool's runtime, which isn't included).
  - The template sits between `<x-dc>` and `</x-dc>`. The logic class is the `<script type="text/x-dc" data-dc-script>` at the end; `renderVals()` returns the values the template reads.
  - `{{ name }}` = a value from `renderVals()`. `<sc-if value="{{ x }}">…</sc-if>` = render only when `x` is truthy. `style-hover="…"` / `style-active="…"` = `:hover` / `:active` styles. `onClick="{{ fn }}"`, `onChange`, `onSubmit` = event handlers.
  - Each page is one block: `<sc-if value="{{ on.home }}">`, then `on.terms`, `on.getting`, `on.database`, `on.research`, `on.faq`, `on.contact`, `on.download`.
  - Everything is styled inline, so an element's `style` attribute is its spec. Repeated patterns reuse identical style strings — turn them into components.
  - Ignore design-tool plumbing: `<helmet>` (except the global CSS below), `support.js`, `_ds_bundle.js`, `image-slot.js`, `<template id="__bundler_thumbnail">`, `data-props` and every `hint-*` attribute.

## Tech stack (decided)
| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js, App Router, TypeScript (strict) | Content pages render statically; the form and downloads use Route Handlers |
| Styling | Tailwind CSS v4 + shadcn/ui, themed to Modernist | See *shadcn/ui theme and component map*. Archivo (400/600/800) via `next/font/google`, exposed as `--font-archivo` |
| Icons | `lucide-react` (shadcn's default) | |
| Content | Typed modules in `content/` (results, packages, FAQ, landmarks, release notes, stats) + JSX for prose | No CMS — changes go through Claude Code |
| Hosting | Vercel, free `*.vercel.app` address for now | The Hobby plan is for non-commercial use, which fits a free research dataset; team access needs Pro |
| Declarations | Google Sheet, written through the Sheets API with a Google Cloud service account | Share the sheet with the service-account email |
| Email | `nodemailer` over Gmail SMTP with an app password, from a dedicated project Gmail account | Works without a custom domain. Gmail caps daily sends; move to a provider such as Resend once you have a domain |
| Download links | Signed token (`jose`, HS256), 7 days by default, emailed to the user | |
| Dataset files | Google Drive, one archive per package | The site checks the token, then redirects to Drive |
| Spam protection | Honeypot field + Cloudflare Turnstile | The form sends email, so it must not become a spam relay |
| Validation | `zod` — one schema shared by the form and the API | |
| Forms | shadcn `Form` (react-hook-form + zod) | |
| Tests | Vitest (schema, token); Playwright (form → email → download, with Google, mail and Turnstile mocked) | |

JavaScript runs in the browser only for: video controls, the section-rail scroll-spy, the declaration form, the research chart toggle, the record path builder, the FAQ accordion, the copy buttons and the small-screen menu. Everything else is a Server Component.

## shadcn/ui theme and component map
shadcn/ui copies component source into `components/ui/`. Theme it once in `app/globals.css`, then edit the copied components to the Modernist specs below — don't restyle them at each call site.

### Theme (`app/globals.css`)
```css
@import "tailwindcss";

:root {
  --radius: 0rem;
  --background: #f3f2f2;            /* Modernist --color-bg */
  --foreground: #201e1d;            /* --color-text */
  --card: #eae9e9;                  /* --color-surface */
  --card-foreground: #201e1d;
  --popover: #f3f2f2;
  --popover-foreground: #201e1d;
  --primary: #ec3013;               /* --color-accent */
  --primary-foreground: #f3f2f2;
  --secondary: transparent;
  --secondary-foreground: #201e1d;
  --muted: #eae9e9;
  --muted-foreground: #605d5d;      /* neutral-700 */
  --accent: color-mix(in srgb, #201e1d 7%, transparent);   /* shadcn's hover tint, not the brand red */
  --accent-foreground: #201e1d;
  --destructive: #ae1800;           /* accent-700 */
  --border: color-mix(in srgb, #201e1d 40%, transparent);  /* --color-divider */
  --input: color-mix(in srgb, #201e1d 40%, transparent);
  --ring: #ec3013;
}

@theme inline {
  /* keep the --color-* mappings `shadcn init` generates, then add: */
  --font-sans: var(--font-archivo), system-ui, sans-serif;
  --radius-sm: 0; --radius-md: 0; --radius-lg: 0; --radius-xl: 0;
}

@theme {
  --color-brand: #ec3013;
  --color-brand-100: #fff2ef; --color-brand-200: #ffe0d9; --color-brand-300: #ffc4b8;
  --color-brand-400: #ff9783; --color-brand-500: #ff563c; --color-brand-600: #dd2b0f;
  --color-brand-700: #ae1800; --color-brand-800: #7c1405; --color-brand-900: #4d170e;
  --color-neutral-100: #f8f4f4; --color-neutral-200: #eae7e7; --color-neutral-300: #d7d3d3;
  --color-neutral-400: #bab6b6; --color-neutral-500: #9b9797; --color-neutral-600: #7d7979;
  --color-neutral-700: #605d5d; --color-neutral-800: #444141; --color-neutral-900: #2d2b2b;
  --color-surface: #eae9e9;
  --color-divider: color-mix(in srgb, #201e1d 40%, transparent);
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --drop-shadow-*: initial;
}
```
Prototype → code names: `--color-accent` → `brand` / `primary` · `--color-accent-N` → `brand-N` · `--color-neutral-N` → `neutral-N` · `--color-surface` → `surface` / `muted` · `--color-divider` → `border` / `divider` · `--color-bg` → `background` · `--color-text` → `foreground`. In this codebase "accent" means shadcn's hover tint; the red is always `brand` or `primary`.

### Rules for every copied component
- Delete `shadow-*`, `rounded-*` (except `rounded-none`), `transition-*`, `duration-*`, `animate-*` and `data-[state=…]:animate-*` classes. Modernist is flat and instant.
- Focus: a 2px `brand` outline with a 2px offset, replacing shadcn's `focus-visible:ring-[3px]` treatment.
- Disabled: 45% opacity, `not-allowed` cursor.
- Full-width buttons put their label flush left (`justify-start`).

### Component map
| Prototype pattern | shadcn component | Modernist spec |
|---|---|---|
| `.btn.btn-primary` | `Button` (default) | Archivo 800, 14px / 1.2, padding 8px 14.4px, gap 6px, 1px transparent border; `bg-primary text-primary-foreground`, hover `brand-600`, active `brand-700` |
| `.btn.btn-secondary` | `Button` `variant="outline"` | 1px `border`, transparent; hover ink 7%, active ink 14% |
| `.btn.btn-ghost` | `Button` `variant="ghost"` | `brand` text, padding-inline 4px; hover brand 10%, active brand 18% |
| `.btn-icon` | `Button` `size="icon"` | 36×36; 44×44 on touch screens |
| `.btn-block` | `Button className="w-full justify-start"` | margin-top 8px |
| `.tag.tag-accent` / `.tag-neutral` / `.tag-outline` | `Badge` variants `accent` / `neutral` / `outline` | 11px, letter-spacing .02em, padding 3px 10px. Accent: `brand-100` bg, `brand-800` text. Neutral: `neutral-100`, `neutral-800`. Outline: 1px `brand` border, `brand` text |
| `.table` | `Table` | 14px. `th`: 11px, .08em, uppercase, ink 60%, padding 8px, 2px bottom `border`. `td`: padding 8px, 1px bottom `border`. Row hover ink 4% |
| `.field` + `.input` | `Form`, `Label`, `Input`, `Textarea`, `Select` | Label 12px, ink 70%, margin-bottom 5px. Control: min-height 36px (44px on touch), padding 6px 10px, 14px, `surface` bg, 1px `border`; hover border ink 45%; focus border `brand`. Textarea min-height 90px. Select content: `background` bg, 1px `border`, no shadow |
| Checkbox | `Checkbox` | 16px square, 1px `border`; checked: `brand` fill with a light check |
| `.seg` + `.seg-opt` | `Tabs`, `TabsList`, `TabsTrigger` | 1px `border` around; triggers 13px, padding 7px 12px, 1px divider between; active `brand` bg + `background` text; hover ink 7% |
| FAQ items | `Accordion type="multiple" defaultValue={["q1"]}` | Trigger as under *FAQ accordion*: plus/minus in a 28×28 bordered box instead of the chevron; no height animation |
| Small-screen menu | `Sheet` (full screen) | See *Global shell → Small screens*. No slide animation |
| `.hr` | `Separator` | 2px, `border` colour |
| Surface panel | `Card` | `surface` bg, no border or shadow, padding as specified per panel |

Custom components (no shadcn equivalent), built with Tailwind and the components above: VideoTile, SectionRail, BarChart, ProportionBar, RecordPathBuilder, CopyButton, Stat, Callout, NumberedList, StepCard, PageHeader.

## Responsive behaviour
Mobile-first, using Tailwind's default breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. Check every page at 360, 390, 768, 1024, 1280 and 1440px wide; the page must never scroll sideways.

| Area | Below the breakpoint | From the breakpoint |
|---|---|---|
| Header (`xl`) | Brand, "Download dataset" (from `sm`), "Menu" button → full-screen menu | Brand, seven links, "Download dataset" |
| Section rail (`lg`) | Plain list of sections above the content | Sticky column beside the content (`top: 84px`) |
| Home Fig. 2 (about 750px) | One column | 2×2 grid |

- **Grids:** keep the prototype's `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` columns as Tailwind arbitrary values; they collapse to one column without breakpoints. Flex rows wrap.
- **Type:** keep the spec's `clamp()` sizes. Body text never goes below 13px; only uppercase labels use 11–12px.
- **Tables:** inside `overflow-x-auto` with the listed `min-width`, so they scroll sideways on phones instead of squashing.
- **Touch targets:** at least 44×44px on touch screens (Tailwind `pointer-coarse:`): video overlay buttons, rail links, form controls, the menu button.
- **Long tokens** — `different_leg_configuration`, file paths, email addresses — use `overflow-wrap: anywhere`. The label matrix also scales its cell padding and code size with `clamp()`.
- **Video tiles** stay 16:9 at every width; overlay buttons keep their 12px insets.

## Production architecture

### Declaration → email → download
1. The visitor submits the form at `/getting-the-database#gt_access`. The client validates with the shared schema and posts JSON (plus the Turnstile token) to `POST /api/declarations`.
2. The handler rejects the request if the honeypot is filled or Turnstile fails. Otherwise it validates the input, then:
   - creates a reference: `AMP-` + 6 characters from `23456789ABCDEFGHJKMNPQRSTUVWXYZ`;
   - appends a row to the `declarations` tab;
   - signs a token `{ sub: reference, exp: now + DOWNLOAD_LINK_TTL_DAYS }` with `DOWNLOAD_TOKEN_SECRET`;
   - emails the link `SITE_URL/download?token=<token>`;
   - returns `{ ok: true, expiresAt }`. If any step fails it returns an error the form can show — never report success when the email wasn't sent.
3. The form shows the "Check your email" state (see *Access declaration*).
4. `/download?token=…` is dynamic and `noindex`. It verifies the token on the server: valid → the packages page; missing, edited or expired → the expired state.
5. Each Download button links to `GET /api/download/<packageId>?token=…`. The handler verifies the token again, appends a row to the `downloads` tab and answers `302` to `https://drive.google.com/uc?export=download&id=<fileId>`. File IDs come from server environment variables and never reach the browser.

The token carries only the reference and the expiry — no name or email in URLs.

### How strict the gate is
The emailed link expires, but it redirects to a Drive link that doesn't: anyone who copies the Drive address can reuse or share it. For links that genuinely expire, move the archives to object storage with presigned URLs (Cloudflare R2 or Amazon S3). Keep that swap to one module, `lib/downloads.ts`.

### Google Sheet
- Tab `declarations`, header row: `submitted_at`, `reference`, `name`, `email`, `affiliation`, `intended_use`, `description`, `terms_accepted`, `dataset_version`, `link_expires_at`.
- Tab `downloads`, header row: `downloaded_at`, `reference`, `package_id`.
- Timestamps in ISO 8601 UTC; `dataset_version` is "Ampe-DB V1". Store nothing else — no IP addresses or user agents.

### Packages (`content/packages.ts`)
| id | Name | Archive | Drive file ID variable |
|---|---|---|---|
| `videos` | Raw RGB videos | videos.zip | `DRIVE_FILE_VIDEOS` |
| `pose` | Normalized pose | pose.zip | `DRIVE_FILE_POSE` |
| `skeleton-videos` | Skeleton videos | skeleton-videos.zip | `DRIVE_FILE_SKELETON_VIDEOS` |
| `skeleton-coordinates` | Skeleton coordinates | skeleton-coordinates.zip | `DRIVE_FILE_SKELETON_COORDINATES` |
| `annotations-metadata` | Annotations & metadata | annotations-metadata.zip | `DRIVE_FILE_ANNOTATIONS_METADATA` |
| `research-docs` | Splits & documentation | research-docs.zip | `DRIVE_FILE_RESEARCH_DOCS` |

The contents text for each package is under *Screens → Getting the Database*.

### Email
Plain text first; a simple HTML version is optional (flat, no images).
- From: "Ampe-DB" `<GMAIL_USER>` · Subject: "Your Ampe-DB V1 download link"
- Body:
  > Hello {name},
  >
  > Thank you for declaring your intended use of Ampe-DB V1. Your personal download link:
  > {link}
  >
  > It works until {expiry date, e.g. 3 November 2026}. Please don’t forward it — colleagues who need the data should complete their own declaration.
  >
  > Your reference is {reference}. Quote it if you contact us.
  >
  > Your use must follow the Terms of Use, License and Research Data Use Agreement. Please cite Ampe-DB and state the dataset version and evaluation protocol in any publication.
  >
  > Questions: {SITE_URL}/contact
  >
  > The Ampe-DB team · Young Africans Research Academy (YARA)

### Environment variables
| Variable | Value |
|---|---|
| `SITE_URL` | `https://<project>.vercel.app` (`http://localhost:3000` locally) |
| `DOWNLOAD_TOKEN_SECRET` | `openssl rand -base64 32` |
| `DOWNLOAD_LINK_TTL_DAYS` | `7` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | from the service-account key |
| `GOOGLE_PRIVATE_KEY` | from the key; stored with literal `\n`, so restore newlines with `.replace(/\\n/g, "\n")` |
| `GOOGLE_SHEET_ID` | from the sheet's URL |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | the project Gmail account and its app password |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | the Cloudflare Turnstile widget |
| `DRIVE_FILE_*` (six) | Drive file IDs, see *Packages* |

Keep real values in `.env.local` (git-ignored) and in Vercel → Settings → Environment Variables. Commit `.env.example` with every name and no values.

## Routes and section IDs
The prototype uses a hash router. Use real routes, and keep the section IDs — pages link to them.

| Prototype | Route | Section IDs |
|---|---|---|
| `#/home` | `/` | `home_cite` |
| `#/terms` | `/terms` | `tm_accept`, `tm_use`, `tm_attribution`, `tm_warranty`, `tm_privacy`, `tm_culture`, `tm_derived` |
| `#/getting` | `/getting-the-database` | `gt_access`, `gt_receive`, `gt_download`, `gt_verify`, `gt_version` |
| `#/database` | `/database` | `db_overview`, `db_structure`, `db_formats`, `db_naming`, `db_pose`, `db_labels`, `db_pairs`, `db_recording`, `db_manifest` |
| `#/research` | `/research` | `rs_tasks`, `rs_protocols`, `rs_results`, `rs_refine`, `rs_extract`, `rs_qc`, `rs_limits`, `rs_pubs` |
| `#/faq` | `/faq` | `faq_access`, `faq_use`, `faq_data`, `faq_report` |
| `#/contact` | `/contact` | — |
| `#/download` | `/download?token=…` | — (dynamic, `noindex`, not in the nav or sitemap) |

API routes: `POST /api/declarations` and `GET /api/download/[packageId]?token=…`.

`#/research/rs_results` becomes `/research#rs_results`. Site title: "Ampe-DB V1 · Human interaction dataset from the Ghanaian game Ampe"; meta description: "Ampe-DB V1: a dataset for human activity and interaction analysis using the Ghanaian game Ampe." Give inner pages their own titles, e.g. "Research · Ampe-DB V1".

## Decisions still open
1. **Privacy notice** for the form: what is stored (the Sheet columns), why, for how long and who to contact. Link it next to the form's checkbox. The wording must come from the maintainers.
2. **Footage consent.** Home publishes six clips of participants. Confirm the consent covers public web use.
3. **DOI or repository identifier.** None is assigned. Never invent one; add it once `CITATION.cff` carries it.
4. **Link lifetime.** 7 days by default (`DOWNLOAD_LINK_TTL_DAYS`). Copy that mentions "7 days" must read from the same setting.
5. **Not designed yet:** a small-screen nav menu (the prototype just wraps the links), a 404 page, favicon and social preview image. Ask the designer before building them.

**Prototype toggles.** Fix these at build time; don't build a settings UI.

| Toggle | Value | Effect |
|---|---|---|
| `downloadLink` | `valid` | Which state the prototype's download page shows. In production the token decides |
| `colorFootage` | `true` | Clips start in colour (each tile can still switch to B&W) |
| `accentHeadline` | `true` | Second line of the Home H1 in accent red |
| `posterClose` | `true` | Home ends with the red "Open to everyone." banner |

## Global CSS
Add to `app/globals.css` after the theme. It combines the prototype's `<helmet>` rules with the Modernist base styles:
```css
@layer base {
  body { background: var(--background); color: var(--foreground); font-size: 16px; line-height: 1.7; text-wrap: pretty; -webkit-font-smoothing: antialiased; }
  h1, h2, h3, h4, h5, h6 { font-weight: 800; line-height: 1.12; letter-spacing: -0.015em; margin: 0 0 8px; }
  h1 { font-size: 42px; } h2 { font-size: 32px; } h3 { font-size: 25px; } h4 { font-size: 20px; }
  p { margin: 0 0 12px; }
  a:not([data-slot]) { color: var(--color-brand-700); text-underline-offset: 3px; }
  a:not([data-slot]):hover { color: var(--color-brand-800); }
  li::marker { color: var(--color-brand); font-weight: 800; font-variant-numeric: tabular-nums; }
  ol > li::marker { color: var(--color-brand-700); }
  code, pre { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: .88em; }
  :focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
  ::selection { background: color-mix(in srgb, var(--color-brand) 30%, transparent); }
}
.grayscale { filter: grayscale(1) contrast(1.08); }
```
Nav, footer and button links set their own colours with utilities. Tailwind's preflight removes list styles, so the prototype's square bullets become `list-[square] pl-5`.

## Global shell
**Container:** `max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px)`.

**Utility bar** (scrolls away): full width with a 1px bottom border in `--color-divider`. Inner container: padding 7px vertical; flex, `space-between`, wrap, gap 2px 24px; 12px / 1.6, letter-spacing .07em, uppercase, `--color-neutral-700`. Left: "Ampe-DB V1 · Baseline V1 benchmark · 2026 release". Right: "Young Africans Research Academy (YARA)".

**Header, `xl` and up** (`<nav class="nav" aria-label="Main">`): `position: sticky; top: 0; z-index: 40; background: var(--color-bg)`; the 2px bottom rule comes from `.nav`. Padding 14px vertical. Horizontal padding is `max(clamp(20px,5vw,64px), calc((100% - 1240px) / 2 + clamp(20px,5vw,64px)))`, so the content lines up with the container while the rule runs full width. Flex, wrap, row-gap 10px, column-gap 28px.
- **Brand** (`.nav-brand`, `margin-right: auto`, inline-flex, gap 10px, links to `/`): the mark is two 9×9px squares, `--color-accent` then `--color-text`, gap 3px; then "Ampe-DB" in Archivo 800 19px, letter-spacing -.01em; then a "V1" tag (`.tag.tag-accent`, 10.5px, padding 1px 6px, letter-spacing .06em, weight 600).
- **Links** (flex, wrap, gap 6px 22px): Home · Terms of Use · Getting the Database · Database · Research · FAQ · Contact Us. 14px, inherited colour, no underline. Hover and `aria-current="page"` turn `--color-accent` (from `.nav`).
- **CTA:** `.btn.btn-primary`, 14px, gap 8px: "Download dataset" + Lucide `download` 16px → `/getting-the-database#gt_access`.

**Small screens (below `xl`, 1280px)**
- Header row: brand on the left; then "Download dataset" (from `sm`, 44px tall); then a "Menu" button — secondary style, Lucide `menu` 16px + "Menu", 44px tall, `aria-expanded`, `aria-controls="site-menu"`.
- Menu: a full-screen panel over the page (`background`, scrolls if taller than the screen), built with shadcn `Sheet` without its slide animation. Opening moves focus to "Close" and locks page scroll; Escape, "Close" or any link closes it.
  - Top row: brand + "Close" button (Lucide `x`), padding 14px vertical with the container's side padding, 2px bottom rule.
  - Links: Home, Terms of Use, Getting the Database, Database, Research, FAQ, Contact Us. Each row is a grid `16px 40px 1fr`, padding 16px 0, 1px bottom rule: a 10×10 `brand` square on the current page; the number "01"–"07" (13px, 600, `brand-700`, tabular); the label in 800 at `clamp(24px, 6vw, 34px)` / 1.1, letter-spacing -.02em, ink, hover `brand-700`.
  - Then "Download dataset" as a full-width primary button (label flush left, 48px tall), and a 12px uppercase `neutral-700` line pinned to the bottom above a 1px rule: "Ampe-DB V1 · Young Africans Research Academy (YARA)".

**Footer:** 2px top rule. Container padding 56px top and 32px bottom; grid gap 48px.
- Row 1 (flex, wrap, gap 40px 48px):
  - Brand column (`flex: 2 1 320px`, grid gap 14px): mark + "Ampe-DB" 800 19px (ink, no underline); a 14px / 1.6 `--color-neutral-700` line, max 44ch: "A dataset for human activity and interaction analysis using the Ghanaian game Ampe. Developed through the Young Africans Research Academy (YARA)."
  - Three link columns (`flex: 1 1 160px`, grid gap 8px, 14px). Heading: 12px, .08em, uppercase, 600, `--color-neutral-700`, margin-bottom 4px. Links: ink, no underline, hover `--color-accent-700`.
    - **Dataset:** Dataset overview `/database#db_overview` · Database structure `/database#db_structure` · Evaluation protocols `/research#rs_protocols` · Baseline V1 results `/research#rs_results`
    - **Access** (all on `/getting-the-database`): Access the dataset `#gt_access` · What you receive `#gt_receive` · Verify checksums `#gt_verify` · Version information `#gt_version`
    - **Information:** Terms of use `/terms` · Ethical use `/terms#tm_warranty` · FAQ `/faq` · Contact us `/contact`
- Row 2: 1px top rule, padding-top 20px; flex, `space-between`, wrap, gap 6px 24px; 13px `--color-neutral-700`. Left: "© 2026 Ampe-DB · Young Africans Research Academy (YARA)". Right: "Ampe-DB V1 · Baseline V1 benchmark".

## Shared patterns
Build these once; every page is composed from them. Class names (`.tag-neutral`, `.table`, …) refer to the prototype — build them with the shadcn components in *Component map*.

- **Eyebrow:** 13px / 1.4, letter-spacing .08em, uppercase, weight 600, `--color-accent-700`. The small variant for panel labels is 12px with the same treatment, in `--color-accent-700` or `--color-neutral-700`.
- **Home section heading:** an eyebrow, then an H2 at `clamp(32px, 3.8vw, 52px)` / 1.04, letter-spacing -.025em, margin-top 14px. Multi-line headings are explicit lines (`display: block` spans); keep the breaks.
- **Page header (inner pages):** padding `clamp(56px, 7vw, 88px) 0 56px`, grid gap 24px. Eyebrow "0N — Page name"; H1 at `clamp(42px, 6vw, 84px)` / 1, letter-spacing -.03em, `margin-left: -.058em` (optical alignment), on two explicit lines; lead at `clamp(17px, 1.5vw, 20px)` / 1.55, max-width 62ch.
- **Doc layout** (Terms, Getting, Database, Research, FAQ): a 2px top rule, then `display: flex; flex-wrap: wrap; gap: 0 64px; align-items: flex-start`.
  - **Section rail** `<aside>`: `flex: 1 1 220px; max-width: 300px; padding: 40px 0 24px`. It is `position: sticky; top: 84px` from `lg` (1024px) and static below. Inside is `<nav aria-label="On this page">` ("Topics" on FAQ), starting with a group label: 12px, .08em, uppercase, 600, `--color-neutral-700`, padding-bottom 10px.
  - **Rail items:** grid `14px 40px minmax(0,1fr)`, align center, padding 8px 0, 1px top rule (the last item also has a 1px bottom rule), 14px / 1.4, ink, no underline, hover `--color-accent-700`. Column 1 is an 8×8 accent square shown only on the active section; column 2 is the number ("02.1", 13px tabular `--color-neutral-700`); column 3 is the label.
  - **Terms rail** has a second group label, "Disclaimer & ethical use", before 02.4 (padding 28px 0 10px, 1px top rule).
  - **Content column:** `flex: 999 1 560px; min-width: 0`. FAQ adds `max-width: 860px`.
- **Doc section:** a `<section id>` holding a number kicker ("04.3": 13px, .08em, 600, `--color-accent-700`, tabular) and an H2 (styles.css h2: 32px / 1.12, -.015em) with margin `10px 0 20px` (24–28px when a grid follows). Sections are separated by a 2px top rule and padded `48px 0 56px`. The first section is `40px 0 56px` with no rule; the last ends with 88px bottom padding.
  - Lead paragraph: 18px / 1.65, max 66ch. Secondary paragraph: 16px, `--color-neutral-800`, max 66ch. Sub-heading H4: 19px, margin `44px 0 8–16px`.
- **Stat block:** 2px top rule, padding-top 12–16px. Number: weight 800, line-height 1, letter-spacing -.02 to -.03em, tabular, in `--color-accent` (or ink). Label: 12–13px / 1.4, .06em, uppercase, `--color-neutral-700`, margin-top 8–12px. Number size is `clamp(40px, 4.4vw, 60px)` on Home and 34–40px on doc pages. Stat blocks sit in `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` grids.
- **Numbered list:** an `<ol>` with no markers. Each row is a grid of `44px` (or `48px`) then `minmax(0,1fr)`, gap 12–16px, padding 14px 0, 1px bottom rule (Terms 02.5 uses top rules plus a final bottom rule). The number ("01") is weight 800, `--color-accent-700`, tabular.
- **Step card:** 2px top rule, padding-top 14–16px, grid gap 8px. Number 24–30px, 800, `--color-accent`; title 17–19px 800; text 14–15px `--color-neutral-800`; optional link 14px 600.
- **Callout** (flat: no radius, no side stripe): padding 18px 20px, max-width 760px, grid gap 6px. A `<strong>` label (12px, .08em, uppercase), then the body at 15px / 1.6.
  - *Note:* background `--color-surface`, ink text. Labels: Outcome caution, Interpretation, Privacy (Database), Terminology, Integrity note.
  - *Important:* background `--color-accent-200`, text `--color-accent-900`. Labels: Important, Identity caution, Privacy (Contact).
- **Surface panel:** background `--color-surface`, padding 28px or `clamp(20px, 3vw, 32px)`. Used for charts, the access form, the path builder, citation boxes, the folder tree and the equations.
- **Table:** `.table` inside a wrapper with `overflow-x: auto`. The table gets a `min-width` (420–680px) so it scrolls on phones instead of squashing. First-column labels are often weight 800; file paths go in `<code>`; numeric columns are right-aligned and tabular.
- **Tags:** `.tag-neutral` and `.tag-accent`, plus a monospace variant for label tokens. The outline variant on Research ("Not part of frozen Baseline V1") uses a divider-coloured border and `--color-neutral-800` text.
- **Arrow link:** a text link ending in " →", 15px 800 (or 14px 600).
- **Legend swatch:** a 10–11px square plus a 13px `--color-neutral-800` label, gap 7–8px.
- **Proportion bar:** a flex row, height 14–22px, gap 2px, each segment `flex: <count> 1 0`.
- **Video tile** and **bar chart:** see *Interactions & behaviour*.

## Screens

### Home `/`
Inside the container, top to bottom:

1. **Hero** — padding `clamp(56px, 8vw, 104px) 0 48px`, grid gap 40px.
   - H1 on two lines, "Movement is data." / "Culture is context.": `clamp(46px, 7.6vw, 108px)` / .98, letter-spacing -.032em, `margin-left: -.058em`. Line 2 is `--color-accent`.
   - Below it, a grid `repeat(auto-fit, minmax(min(100%, 380px), 1fr))`, gap 28px 64px, `align-items: end`. Left: the lead (`clamp(17px, 1.5vw, 20px)` / 1.55, max 54ch). Right: two buttons (flex, wrap, gap 12px), both 15px, padding 14px 18px, gap 10px, with Lucide `arrow-right` 16px — primary "Access the dataset" → `#gt_access`, and secondary "Read the documentation" → `/database`.
2. **Fig. 1** — a figure with grid gap 12px.
   - Tile frame: grid `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`, gap 2px, background `--color-divider`, 2px `--color-divider` border, so the gaps read as 2px rules.
   - Tiles: RGB `right_right_C179.mp4` (tag "RGB · videos/") and skeleton `skeleton_right_right_C179.mp4` (tag "Skeleton · skeleton/videos/").
   - Caption: flex, `space-between`, wrap, gap 4px 24px; 12px, .07em, uppercase, `--color-neutral-700`. Left: "Fig. 1 — Canonical record right_right_C179". Right: "Original RGB video · rendered skeleton, 33 landmarks per player".
3. **At a glance** — 5 stat blocks in a grid (min 170px, gap 32px 24px, padding `64px 0 88px`): 637 Canonical two-person clips · 15 Pseudonymous participants · 11 Unordered player pairs · 4 Movement classes · 5 Aligned representations.
4. **What is Ampe?** — 2px top rule, padding 88px 0, grid gap 56px.
   - Intro in 2 columns (min 380px, gap 24px 64px): eyebrow "Rooted in living tradition" + H2; on the right, a 19px / 1.6 paragraph and a `--color-neutral-800` paragraph.
   - Fig. 2: the same tile frame as a 2×2 grid, columns `repeat(auto-fit, minmax(min(100%, max(340px, calc(50% - 1px))), 1fr))` — two columns on wide screens, one on narrow. Top row: `left_right_C114.mp4` (tag "left_right_C114 · different legs") and `right_right_C189.mp4` ("right_right_C189 · same legs"). Bottom row: `right_left_C082.mp4` ("right_left_C082 · different legs") and `left_left_C009.mp4` ("left_left_C009 · same legs"). Caption: "Fig. 2 — The four movement classes in V1" / "Two different-leg and two same-leg configurations".
   - Cycle: 3 columns (min 280px, gap 32px 24px). Each has a 2px top rule, padding-top 12px, grid `44px 1fr`, 15px / 1.55: "01 Jump." / "02 Clap." / "03 Leg reveal." (step names bold).
5. **What's in the release** — 2px top rule, padding 88px 0.
   - Intro: eyebrow + H2 "One interaction." / "Five representations."; on the right, a paragraph and the arrow link "See the folder structure" → `/database#db_structure`.
   - Five cards (min 196px, gap 32px 24px, margin-top 56px), each with a 2px top rule and padding-top 16px. Top row: number (800) + tag (Source, **Model input** in accent, Geometry, Geometry, Visualization). Then an H4 at 19px, text at 14.5px / 1.6 `--color-neutral-800`, and the folder name in `<code>` 12.5px `--color-neutral-700`.
6. **Baseline V1 benchmark** — 2px top rule, padding 88px 0, 2 columns (min 400px, gap 56px 72px).
   - Left (grid gap 20px): eyebrow, H2 "Testing generalization," / "not memorization.", a 19px lead and a secondary paragraph.
   - Two drop stats in a 2-column grid (gap 24px, numbers at `clamp(34px, 3.4vw, 46px)`): "−0.537" in `--color-neutral-700` ("RGB — four-class Macro-F1, fixed split → unseen pairs") and "−0.146" in `--color-accent` ("Pose — the same shift, far smaller loss"). Then a secondary button, "See Baseline V1 results" → `/research#rs_results`.
   - The drops are derived, not quoted: 0.955 → 0.418 (RGB) and 0.957 → 0.811 (Pose), four-class, fixed split → pair-held-out. Recompute them if the results ever change.
   - Right: a surface panel (padding 28px, gap 22px) with the title "Four-class Macro-F1 by protocol" (13px, .08em, uppercase, 600), the legend, the three protocol groups (four-class values) and the axis. It is the same chart as on Research, without the toggle.
7. **Getting started** — 2px top rule, padding 88px 0. Eyebrow + H2 "Six steps for new users."; a paragraph on the right.
   - 6 step cards (min 300px, gap 40px 24px, margin-top 56px, number 30px). Links: Terms of Use → `/terms` · Access the dataset → `#gt_access` · What you receive → `#gt_receive` · Database structure → `/database#db_structure` · Evaluation protocols → `/research#rs_protocols` · Citation → `/#home_cite`.
   - Then "Recommended first files" (margin-top 72px; flex, wrap, gap 24px 64px). Heading column `flex: 1 1 240px`: H4 20px + a 15px note. Table column `flex: 3 1 520px` (table min-width 520px), columns File | Why start here: `README.md`, `CITATION.cff`, `metadata/ampe_db_v1_manifest.csv`, `annotations/ampe_db_v1_labels.csv`, `splits/`.
8. **News & updates** — 2 columns (min 380px, gap 40px 72px).
   - Left: eyebrow, H2 "Release notes.", a 15px note (max 46ch).
   - Right: an `<ol>` of 3 entries. Each is a grid `64px 1fr`, gap 8px 20px, padding 20px 0. The first has a 2px top rule, the rest 1px, and the last also a 1px bottom rule. Each shows "2026" (800, tabular), a tag row (neutral version tag + accent type tag) and the text.
9. **Citation** (`id="home_cite"`) — 2 columns.
   - Left: eyebrow "Citation & acknowledgements", H2 "Cite Ampe-DB.", the CITATION.cff note, then a `<dl>` (grid `max-content 1fr`, gap 10px 24px, 15px / 1.5, terms in `--color-neutral-700`): Authors — Ruth Senior Biney, Isaac Kojo Yedonu Aboah; Developed through — Young Africans Research Academy (YARA); Year — 2026.
   - Right: two surface panels (padding 28px, gap 16px). Each has a 12px uppercase label, the text (citation 18px / 1.6 with the title in italics; acknowledgement 16px / 1.65) and a secondary copy button.
10. **Poster close** — full width, outside the container. Background `--color-accent`; inner container padding `clamp(72px, 9vw, 112px)` vertical.
    - H2 at `clamp(42px, 6vw, 84px)` / 1, letter-spacing -.03em, `margin-left: -.058em`, colour `--color-bg`: "Open to everyone." / "Free to download."
    - Button (margin-top 44px): `.btn.btn-ghost` overridden to `--color-bg` text, a 1px solid `--color-bg` border, 15px, padding 14px 18px, gap 10px; hover background `color-mix(in srgb, var(--color-bg) 16%, transparent)`. Label "Complete the access form →", links to `#gt_access`.

### Terms of Use `/terms`
Header: "02 — Terms of Use" / "Open access." "Responsible use."

Rail: *Terms of use* — 02.1 Acceptance of terms, 02.2 Permitted & prohibited use, 02.3 Attribution. *Disclaimer & ethical use* — 02.4 No warranty, 02.5 Participant privacy, 02.6 Cultural responsibility, 02.7 Derived outputs.
- **02.1:** three document blocks (min 200px), each a label, a 17px 800 title and the file name in 12.5px code: Research Data Use Agreement `AMPE_DB_RESEARCH_DATA_USE_AGREEMENT.pdf`; Release license `License.pdf`; Terms of Use "Distributed with the release".
- **02.2:** two columns (min 300px, gap 32px 40px).
  - *Permitted:* 2px top rule in ink, a 28×28 ink square with a light Lucide `check` (stroke 2.5), an H4 at 20px, an intro, a 4-item list, then a surface note on commercial use ending "Contact the team →".
  - *Prohibited:* 2px top rule in `--color-accent`, a 28×28 accent square with `x`, and a 5-item list.
- **02.5:** numbered list of 3 rows, max-width 760px.
- **02.6:** pull statement in weight 800, `clamp(26px, 2.8vw, 36px)` / 1.2, -.015em, max 24ch: "Ampe is a living Ghanaian cultural practice."

### Getting the Database `/getting-the-database`
Header: "03 — Getting the Database" / "From declaration" "to download."

Rail: 03.1 Access the dataset, 03.2 What you receive, 03.3 Download instructions, 03.4 Verify download & checksums, 03.5 Version information.
- **03.1** — 2 columns (min 320px, gap 40px 48px).
  - Left: an "Access process" numbered list (3 rows), a "Who may download" list, and a surface note on what open access doesn't waive.
  - Right: the **access form panel** (see *Interactions*).
  - **Release packages** (margin-top 56px): a heading row (H4 20px + Lucide `mail` 14px and "Download links are emailed after the declaration", 13px `--color-neutral-700`), then a table (min-width 600px): Package (800, nowrap) | Contents | Archive (12.5px code). No download buttons here — they are on the personal download page.

    | Package | Contents | Archive |
    |---|---|---|
    | Raw RGB videos | 637 canonical MP4 clips with synchronized embedded audio | videos.zip |
    | Normalized pose | Two-player, 33-landmark normalized pose CSV for model inputs | pose.zip |
    | Skeleton videos | Rendered skeleton MP4 files for visual inspection | skeleton-videos.zip |
    | Skeleton coordinates | Pixel-space landmark exports in CSV and JSON | skeleton-coordinates.zip |
    | Annotations & metadata | Movement labels, manifest, participant–pair mapping and schemas | annotations-metadata.zip |
    | Splits & documentation | Frozen evaluation partitions, paper, README, citation file and release documentation | research-docs.zip |

- **03.2** — the component list, then a "Download by research need" table whose second column is a row of tags (the first tag, in accent, is the primary modality).
- **03.3** — two paragraphs, an "After download" numbered list (5 rows) and an *Important* callout about checksums.
- **03.4** — the two-level verification table, then the coverage equation **637 × 5 = 3,185**: numbers at `clamp(40px, 4.4vw, 56px)` 800, operators at weight 400 `--color-neutral-700`, the result in accent, labels 12px uppercase. Then a 3-item list and the duplicate-provenance paragraph linking to `/database#db_overview`.
- **03.5** — three version blocks (value 22px 800): Dataset "Ampe-DB V1" · Benchmark "Ampe-DB Baseline V1" · Release year "2026". Then the "Version reporting" list.

### Database `/database`
Header: "04 — Database" / "Technical" "documentation."

Rail: 04.1–04.9 — Dataset overview, Database structure, Data formats, File naming rules, Pose & skeleton format, Annotation & metadata, Participants & pairs, Recording conditions, Manifest & file index.
- **04.1**
  - 5 stats (min 130px, 34px, ink): 637 Canonical records · 15 Pseudonymous participants · 11 Unordered pairs · 14 Ordered pair configurations · 557 Unique RGB/audio hashes.
  - **Duplicate-provenance bar** (height 22px): 557 in `--color-neutral-900` | 80 in `--color-accent`, with a legend and the note "78 exact-duplicate groups involve 158 records…".
  - The movement-labels paragraph and an *Outcome caution* note.
- **04.2**
  - **Folder tree** in a surface panel (padding 20px 24px, `overflow-x: auto`): grid `max-content minmax(200px,1fr) max-content`, gap 0 32px, line-height 2.1, min-width 620px.
  - Tree column 1: the monospace path at 13.5px with `white-space: pre` and box-drawing characters (`├──`, `│`, `└──`); the root `Ampe-DB_V1/` is bold.
  - Tree column 2: the description, 14px `--color-neutral-800`.
  - Tree column 3: the record count "637" (13px 700 `--color-accent-700`, right-aligned), for the five record folders only, under an 11px uppercase "Records" header.
  - Then the 1:1 paragraph and "Core metadata files" (2 columns of 13px code, 1px top rules, padding 10px 0).
- **04.3**
  - The formats table (6 rows), then the RGB paragraph with an *Important* callout ("Do not describe V1 as a uniform 60 FPS dataset…").
  - The pose CSV header in a surface code block: `frame, player_id, landmark_index, x_norm, y_norm, visibility` (13.5px, padding 14px 18px, `white-space: nowrap`, scrolls).
  - A 4-item list and the skeleton-exports paragraph.
- **04.4** — the naming table, where the record key inside each path is `<strong>` in `--color-accent-700`; the **record path builder** (see *Interactions*); movement-token chips (monospace tags, 13px, padding 5px 12px); an *Interpretation* note.
- **04.5**
  - The pose schema table, then three normalization blocks (value 18px 800): Origin — Hip midpoint · Scale — Shoulder-to-hip Euclidean distance · Not applied — Rotation or reflection.
  - **Feature equation** in a surface panel: 2 Players × 33 Landmarks × 3 (x, y, visibility) + 2 Presence flags = **200** Features per step. Numbers at `clamp(30px, 3.4vw, 44px)` 800, the result in accent, operators at 26px `--color-neutral-700`. Below a 1px top rule: "Pose clips are temporally sampled to 32 steps, giving a 32 × 200 input sequence per clip."
  - **Landmark index:** grid `repeat(auto-fill, minmax(min(100%, 180px), 1fr))`, gap 0 24px, 14px. Each row is a grid `32px 12px 1fr`, padding 7px 0, with a 1px top rule: the index (700, tabular), then a 7×7 accent square on the torso landmarks 11, 12, 23 and 24 (whose index is also `--color-accent-700`), then the name in 12.5px code.
  - Landmark names 0–32: nose, left_eye_inner, left_eye, left_eye_outer, right_eye_inner, right_eye, right_eye_outer, left_ear, right_ear, mouth_left, mouth_right, left_shoulder, right_shoulder, left_elbow, right_elbow, left_wrist, right_wrist, left_pinky, right_pinky, left_index, right_index, left_thumb, right_thumb, left_hip, right_hip, left_knee, right_knee, left_ankle, right_ankle, left_heel, right_heel, left_foot_index, right_foot_index. *These are the standard MediaPipe Pose names, added during design; check them against the release's data dictionary.*
- **04.6**
  - **Label matrix**, max-width 680px: grid `minmax(96px, auto) 1fr 1fr`, gap 2px on a `--color-divider` background, with a 2px divider border.
  - Header cells: 11px, .08em, uppercase, 600, `--color-neutral-700` ("Second token · left / right", "First token · left / right").
  - Value cells: padding 18px 16px, holding the token in 15px 700 code and the relation at 13px.
  - The diagonal (`left_left`, `right_right` = `same_leg_configuration`) has a `--color-accent-200` background and `--color-accent-900` text. The off-diagonal (`left_right`, `right_left` = `different_leg_configuration`) is `--color-bg`.
  - Then a 13px `--color-neutral-700` caption, the mappings and manifest paragraphs, and an *Important* callout.
- **04.7** — 3 stats (40px, accent): 15 / 11 / 14. Then the files table, "Why pair information matters" and a *Privacy* note.
- **04.8** — the capture-design list, camera equipment, and media property chips. Frame rate: "30 FPS · most clips" (accent), "24 FPS", "60 FPS". Video codec: "H.264", "HEVC". Then the frontal-view paragraph.
- **04.9** — the coverage table: 5 rows of 637, then "Record-level files" / "3,185" in 800 `--color-accent-700` with a 2px bottom rule; numbers right-aligned and tabular. Then the supporting index files and an *Integrity note* linking to `#gt_verify`.

### Research `/research`
Header: "05 — Research" / "Generalization across" "people and pairings."

Rail: 05.1–05.8 — Benchmark tasks, Evaluation protocols, Baseline V1 results, Raw video refinement, Pose & skeleton extraction, Quality control & validation, Known limitations, Related publications.
- **05.1** — two task cards (2px ink top rule; "Task 1" / "Task 2" eyebrow at 12px; H3 24px / 1.2; label tags in monospace). Then the "Primary metric" row with "Macro-F1" at 30px 800, and "Not part of frozen Baseline V1" with 6 outline tags.
- **05.2** — the **protocol ladder**, 3 rows.
  - Each row: grid `64px 1fr`, gap 12px 20px, padding 22px 0. The first has a 2px top rule, the rest 1px, and the last also a 1px bottom rule.
  - Row content: the number at 32px 800 accent, an H4 at 20px with a role tag (Reference benchmark · **Primary benchmark** in accent · Diagnostic), and text at max 64ch.
  - Row 1 adds the split bar (height 14px, max-width 560px): 444 train `--color-neutral-900` | 97 validation `--color-neutral-600` | 96 test `--color-accent`, with a legend.
  - Then a *Terminology* note.
- **05.3** — the locked-models table (Majority, RGB, Pose, RGB + Pose); two facts (Seeds "17 · 29 · 43"; Horizontal flip "Disabled — left/right labels are semantic"); the **Macro-F1 chart** (see *Interactions*); the full results table with the note "Highest value per row in bold."; the interpretation list; and a closing statement in 800 at `clamp(22px, 2.2vw, 28px)` / 1.3, max 34ch.
- **05.4** — 5 step cards (min 150px): Screen, Segment, Label, Trim, Verify.
- **05.5** — the processing numbered list (5 rows), an *Identity caution* (Important style) and the missing-detections paragraph.
- **05.6** — the QC list, the skeleton-review paragraph and the freeze stats (min 150px, 36px): **35** Freeze checks passed (accent) · **0** Failures (accent) · 288 Metric rows · 72 Prediction runs · 144 Trained RGB/pose models.
- **05.7** — the limitations `<dl>`, 9 rows. Each is a flex row (wrap, gap 4px 32px, padding 16px 0); the first has a 2px top rule, the others 1px, and the last also a 1px bottom rule. `dt`: 800, `flex: 1 1 200px`. `dd`: `--color-neutral-800`, `flex: 2 1 380px`.
- **05.8** — the publication card (surface): eyebrow "Dataset paper · 2026"; H3 at `clamp(21px, 2.2vw, 27px)` / 1.25, max 36ch; authors at 15px; a secondary "Copy citation" button and a ghost "Citation guidance" button → `/#home_cite`. Then "Citation source" and "Contextual literature".

**Results (Macro-F1).** The highest value in each row (bold) renders in 800 `--color-accent-700`; a 2px bottom rule separates the two task groups.

| Task | Protocol | RGB | Pose | Fusion |
|---|---|---|---|---|
| Four-class | Duplicate-safe fixed | 0.955 | 0.957 | **0.976** |
| Four-class | Pair-held-out | 0.418 | 0.811 | **0.824** |
| Four-class | Participant-held-out diagnostic | 0.384 | **0.839** | 0.833 |
| Binary relation | Duplicate-safe fixed | 0.932 | 0.981 | **0.989** |
| Binary relation | Pair-held-out | 0.625 | **0.633** | 0.630 |
| Binary relation | Participant-held-out diagnostic | 0.472 | **0.675** | 0.575 |

### FAQ `/faq`
Header: "06 — FAQ" / "Questions" "researchers ask."

Rail label "Topics": 06.1 Access (q1–q4), 06.2 Use & sharing (q5–q7), 06.3 Working with the data (q8–q12), 06.4 Splits, citation & reporting (q13–q15). 15 accordion items in total; q1 starts open.

### Contact Us `/contact`
No rail. Header: "07 — Contact Us" / "Contact" "the team."
- **07.1 Ampe-DB team:** two person blocks (min 320px, gap 32px 40px), each with a 2px ink top rule and padding-top 18px. Name: H3 at `clamp(24px, 2.4vw, 30px)` / 1.15. Affiliation: 15px `--color-neutral-700`. A mailto link (600, Lucide `mail` 16px, margin-top 10px). Ruth Senior Biney — ruthbiney148@gmail.com · Isaac Kojo Yedonu Aboah — isaacaboah@gmail.com.
- **07.2 and 07.3** side by side (min 360px, gap 48px 72px): a 5-row topics list (padding 14px 0, 1px rules), and a 3-step issue-report list plus a *Privacy* callout (Important style).

### Personal download page `/download`
Not in the nav; reached only from the emailed link. No rail. Rendered on the server per request. Two states, decided by the token.

**Valid**
- Page header: eyebrow "Personal download link"; H1 "Your download" / "is ready."; lead "This page is personal to you. Please don’t forward the link — colleagues who need the data should complete their own declaration."
- Facts (`<dl>`, columns min 220px, gap 24px, margin-bottom 56px): Reference "AMP-XXXXXX" · Link expires "3 November 2026" (en-GB long date) · Dataset "Ampe-DB V1". Each has a 2px top rule and padding-top 14px; label 12px, .08em, uppercase, 600, `--color-neutral-700`; value 22px / 1.2, 800.
- **Release packages** (2px top rule, padding 40px 0 56px): H2 "Release packages" with the arrow link "Which packages do I need?" → `/getting-the-database#gt_receive` (flex, `space-between`, wrap, margin-bottom 20px). Then the packages table (min-width 680px) with a fourth, 140px column of `.btn.btn-primary` "Download" + Lucide `download` 14px, each linking to `/api/download/<packageId>?token=…`. Then a note callout, "Large archives": "Google Drive may warn that it can’t scan a large file for viruses. Choose *Download anyway* to continue."
- **Before you start** (2px top rule, padding 40px 0 88px): H2 (margin-bottom 12px) and a numbered list of 4 rows (max-width 760px), each ending in an arrow link: keep filenames → `#gt_download`; verify the archives → `#gt_verify`; read the structure → `/database#db_structure`; cite → `/#home_cite`. Copy is in the reference.

**Expired, missing or edited token**
- Page header only (bottom padding `clamp(72px, 9vw, 112px)`): eyebrow "Personal download link"; H1 "This link" / "has expired."; lead "Personal download links work for 7 days. Submit the access form again and we’ll email you a new one straight away."; buttons (15px, padding 14px 18px): primary "Request a new link" + `arrow-right` → `/getting-the-database#gt_access`, secondary "Contact the team" → `/contact`.

## Interactions & behaviour

### Video tiles (Home, 6 clips)
- **Tile:** `position: relative; aspect-ratio: 16/9; background: var(--color-surface)`. The `<video>` fills it absolutely (`object-fit: cover`) with `muted loop autoplay playsinline preload="auto"` and a descriptive `aria-label` ("Ampe interaction, canonical record right_right_C179").
- **Overlays**, 12px from the edges: the tag top-left (`.tag.tag-neutral`, 600, `pointer-events: none`), the colour toggle bottom-left, the sound toggle bottom-right.
- **Overlay buttons:** height 36px (44px on touch screens), padding 0 12px, no border, background `--color-text`, text `--color-bg`, 13px 600, gap 8px, Lucide icon 16px. Hover `--color-accent-600`; active `--color-accent-700`; focus is the global 2px accent ring.
  - *Colour toggle:* in colour it shows `contrast` + "B&W"; in B&W it shows `palette` + "Color". B&W means `.grayscale` on the `<video>` (`filter: grayscale(1) contrast(1.08)`). State is per tile, and all tiles start in colour.
  - *Sound toggle:* when muted it shows `volume-x` + "Unmute"; with sound on it shows `volume-2` + "Mute". The skeleton tile has **no** sound toggle, because its file has no audio track.
- **Sound rules — don't regress; unexpected clapping was a real complaint:**
  1. Every video starts muted.
  2. Only one video can have sound; unmuting one mutes the others. Unmuted volume is 0.5.
  3. Sound switches off, and the button resets, when the tile drops below 25% visible (IntersectionObserver, thresholds `[0, .25, .5]`), when the tab is hidden (`visibilitychange`), and when the user navigates to another page.
  4. Videos pause below 25% visible and resume, muted, when visible again.
  5. With `prefers-reduced-motion: reduce`, nothing autoplays; videos stay paused with native controls.
  6. Swallow `play()` promise rejections (browser autoplay policies).
- **Accessibility to add** (not in the prototype): `aria-pressed` on both toggles, and an accessible name that includes the clip ("Unmute right_right_C179"). Identical "Unmute" buttons are ambiguous to screen readers.
- **Performance:** the six clips total about 5.4 MB. Add `poster` stills, and use `preload="metadata"` for the Fig. 2 clips below the fold.

### Section rail scroll-spy
- The active section is the last section whose top is ≤ 160px from the top of the viewport. When scrolled to the bottom (within 4px), it is the last section. Recompute on scroll, throttled with `requestAnimationFrame`.
- The active item shows the 8×8 accent square. Also set `aria-current="true"` on it (not in the prototype).
- Anchor jumps land 88px above the section (`scroll-margin-top: 88px`) to clear the sticky header. Scroll smoothly within a page, but respect reduced motion.
- The rail is sticky (`top: 84px`) only from `lg` (1024px).

### Access declaration (03.1)
- **Panel:** surface, padding `clamp(20px, 3vw, 32px)`, grid gap 18px. Header: eyebrow "Access declaration" (12px); H3 23px / 1.2 "Declare your intended use"; a 14px `--color-neutral-700` helper, "Required before download. Takes about a minute."
- **Fields** (`.field` > `label` + `.input`), gap 16px:

  | Label | Control | Rule |
  |---|---|---|
  | Full name | text | required |
  | Contact email | email | required |
  | Affiliation (optional) | text, placeholder "University, organization or independent" | — |
  | Intended use | select: "Select a purpose" (empty), Academic research, Education, Cultural or artistic work, Independent exploration, Other | required |
  | Project or purpose description | textarea, 3 rows | required |
  | "I have read and accept the Terms of Use, License and Research Data Use Agreement." | checkbox, 16px, `accent-color: var(--color-accent)`, in a grid `22px 1fr` | required |

  Add (not in the prototype): a visually hidden honeypot input (`name="company_website"`, `tabindex="-1"`, `autocomplete="off"`) and the Turnstile widget above the submit button.
- **Submit:** `.btn.btn-primary.btn-block`, 15px, padding 13px 16px, label flush left: "Submit and get your download link" + `arrow-right`. While sending: disabled, label "Sending your link…".
- **Validation:** native constraint validation first (`reportValidity()`), then the shared zod schema on the server. Field errors: 14px `--color-accent-800` under the field. A general failure goes under the button: "We couldn’t send your link. Please try again, or contact the team." Keep everything the user typed.
- **Success state** (replaces the form; `role="status"`): Lucide `mail` + "Check your email" (12px eyebrow, `--color-accent-700`); H3 24px "Your download link is on its way."; a 15px `--color-neutral-800` paragraph, "We’ve sent a personal link to **{email}**. It works until {expiry date} — download only the packages your research needs."; a 14px `--color-neutral-700` line, "Nothing after a few minutes? Check your spam folder, or submit the form again for a new link."; a ghost button "Submit another declaration" (back to an empty form).
- The prototype adds a "Prototype · Open the emailed link →" row under the success state so reviewers can reach the download page. Don't build it.
- **No persistence.** Each visit starts with the form; returning visitors use their emailed link or submit again.
- The packages table on this page has no download buttons. Its heading row shows Lucide `mail` 14px + "Download links are emailed after the declaration" (13px `--color-neutral-700`).
- Every "Access the dataset", "Download dataset" and "Complete the access form" CTA links to `#gt_access`.
- **Copy updated for the email flow** (already in the reference): 03.1 step 03, the submit label, 03.3's first paragraph, FAQ q1 and q2.

### Macro-F1 bar chart (Research 05.3; Home without the toggle)
- **Panel:** surface, padding `clamp(20px, 3vw, 32px)` (Home: 28px), gap 22px.
- **Header:** H4 19px "Macro-F1 by protocol" + a `.seg` segmented control (`role="radiogroup"`, `aria-label="Task"`) with "Four-class" (default) | "Binary relation".
- **Legend:** RGB `--color-neutral-600` · Pose `--color-accent` · RGB + Pose `--color-neutral-900`.
- **Groups:** three, gap 22px, each with a 2px top rule and padding-top 14px. The title row is the protocol name (800) plus a 13px `--color-neutral-700` note: "Duplicate-safe fixed" / "Reference split"; "Pair-held-out" / "Primary benchmark · 4 folds"; "Participant-held-out" / "Diagnostic".
- **Bar rows:** grid `78px minmax(0,1fr) 44px`, gap 7px 12px, 13px. Label in `--color-neutral-700`; a 16px-high track with background `--color-bg`; the value right-aligned, tabular, 600. Fill width = value × 100%.
- **Axis row:** the same grid, with "0" left, "0.5" centred and "1.0" right, 12px `--color-neutral-700`.
- No animation in the prototype. Optional: 300ms ease-out on width when switching task, off under reduced motion.

### Record path builder (Database 04.4)
- **Panel:** surface, padding `clamp(20px, 3vw, 32px)`, gap 22px. Eyebrow "Record key → file paths"; H4 21px "Build the paths for any record"; a 14px helper, "Paths follow the naming rule. Confirm the record exists in the manifest before loading."
- **Inputs** (flex, wrap, gap 16px 20px, `align-items: flex-end`):
  - "Movement token" select (`flex: 1 1 170px; max-width: 220px`): left_left, left_right (default), right_left, right_right.
  - "Identifier" text input (`flex: 1 1 120px; max-width: 160px`, monospace, placeholder and default "C003").
  - "Canonical record key" readout: a 12px label and the key in 16px 700 code, `--color-accent-700`.
- **Sanitising** on every change: uppercase; keep the digits, up to 3; the value becomes "C" + digits. With no digits, the value is "C" if the user typed a C, otherwise empty.
- **Key:** valid when `/^C\d{3}$/`; key = `${movement}_${valid ? id : 'C###'}`.
- **Output:** grid `max-content 1fr`, gap 0 28px, 14px. Each row has an 800 label and the path in 13px code (`word-break: break-all`), padding 10px 0, with 1px top rules (the last also bottom):
  - RGB video — `videos/{key}.mp4`
  - Normalized pose — `pose/{key}.csv`
  - Skeleton CSV — `skeleton/csv/keypoints_{key}.csv`
  - Skeleton JSON — `skeleton/json/keypoints_{key}.json`
  - Skeleton video — `skeleton/videos/skeleton_{key}.mp4`
- **Invalid:** a 14px `--color-accent-800` message, "Enter a three-digit identifier, for example C003."

### FAQ accordion
- Items are stacked with 1px rules (the last also has a bottom rule).
- The question is a full-width `<button aria-expanded>`: grid `1fr 28px`, gap 16px, padding 18px 0, 17px / 1.4, 800, ink, hover `--color-accent-700`. The icon box is 28×28 with a 1px divider border, showing Lucide `plus` when closed and `minus` when open (14px, stroke 2.5).
- The answer is `--color-neutral-800`, max 70ch, padding `0 44px 22px 0`.
- Items open independently; q1 starts open; no animation. Add `aria-controls` / `id` pairs (not in the prototype).

### Copy buttons
- Copy the target text (whitespace collapsed) with `navigator.clipboard.writeText`, falling back to a hidden textarea + `document.execCommand('copy')`.
- The label changes from Lucide `copy` + "Copy citation" / "Copy acknowledgement" to `check` + "Copied" for 2.2s.
- Three instances: Home citation, Home acknowledgement, Research publication.
- Citation: Biney, R. S., & Aboah, I. K. Y. (2026). *Ampe-DB: A Dataset for Human Activity and Interaction Analysis Using the Ghanaian Game Ampe.* Young Africans Research Academy (YARA).
- Acknowledgement (shown in curly quotes): This work uses Ampe-DB, developed through the Young Africans Research Academy (YARA) to support research on human activity and interaction analysis using the Ghanaian game Ampe.

### Global states
- **Buttons** (from styles.css): primary hover `--color-accent-600`, active `--color-accent-700`; secondary hover ink 7%, active 14%; ghost hover accent 10%, active 18%.
- **Focus** everywhere: `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`.
- **Table rows** hover with ink 4%.
- No transitions, shadows or rounded corners anywhere; Modernist is flat and instant.

### Responsive
See *Responsive behaviour*.

## State
| State | Values | Default | Notes |
|---|---|---|---|
| Active section | section id | first section | per doc page, from scroll-spy |
| FAQ open items | set of q1–q15 | q1 | |
| Declared | boolean | false | shows the "Check your email" state; resets on reload |
| Copied key | none, cite, ack, pub | none | clears after 2200ms |
| Chart task | four, binary | four | Research only |
| Path builder | movement, identifier | left_right, C003 | |
| Sound owner | one clip id, or none | none | page-wide: only one clip at a time |
| B&W per clip | boolean per clip | false (colour) | |
| Download link | valid, expired | from the token | `/download` only |

Clip ids: `c179` (RGB), `c179s` (skeleton), `c114`, `c189`, `c082`, `c009`. Content is static; the only server calls are the declaration submit and the download redirects.

## Design tokens
Everything comes from `design-system/styles.css`, ported into the Tailwind theme (see *shadcn/ui theme and component map*). Use the theme names; never hard-code the values.

**Colours**

| Token | Value | Used for |
|---|---|---|
| `--color-bg` | #f3f2f2 | page; text on accent and ink |
| `--color-surface` | #eae9e9 | panels, inputs, notes |
| `--color-text` | #201e1d | ink; overlay buttons |
| `--color-accent` | #ec3013 | primary buttons, big numbers, marks, Pose bars, the poster |
| `--color-divider` | #201e1d at 40% (`color-mix`) | every rule |
| neutral 100–900 | #f8f4f4, #eae7e7, #d7d3d3, #bab6b6, #9b9797, #7d7979, #605d5d, #444141, #2d2b2b | 600 RGB bars; 700 meta and captions; 800 secondary text; 900 fusion bars |
| accent 100–900 | #fff2ef, #ffe0d9, #ffc4b8, #ff9783, #ff563c, #dd2b0f, #ae1800, #7c1405, #4d170e | 100/800 accent tags; 200/900 important callouts; 600 hover; 700 kickers, list numbers, links, pressed; 800 link hover, errors |

Accent on the page background is about 3:1 contrast: fine for large type, numbers and UI marks, not body text. Red text at paragraph size uses `--color-accent-700`.

**Type:** Archivo (Google Fonts, weights 400/600/800, loaded by styles.css; consider self-hosting) for everything; headings are 800. Code uses `ui-monospace, "SF Mono", Menlo, Consolas, monospace` at .88em.

| Role | Size / line-height | Tracking |
|---|---|---|
| Home H1 | clamp(46px, 7.6vw, 108px) / .98 | -.032em |
| Page H1, poster H2 | clamp(42px, 6vw, 84px) / 1 | -.03em |
| Home H2 | clamp(32px, 3.8vw, 52px) / 1.04 | -.025em |
| Doc H2 | 32px / 1.12 | -.015em |
| H3 | 23–30px / 1.15–1.25 | — |
| H4 | 19–21px | — |
| Lead | clamp(17px, 1.5vw, 20px) / 1.55; 18–19px / 1.6–1.65 | — |
| Body | 16px / 1.7 | — |
| Small | 13–15px | — |
| Meta, eyebrow | 12–13px uppercase | .06–.08em |
| Stat number | clamp(40px, 4.4vw, 60px) on Home; 30–44px on doc pages | -.02 to -.03em |

**Spacing:** `--space-1` to `--space-8` = 4, 8, 12, 16, 24, 32px. Layout rhythm: 88px section padding on Home; 48/56px for doc sections; 44px above H4 sub-sections; 24–72px column gaps.

**Radius** 0 everywhere. **Shadows:** none. **Rules:** 2px for major divisions and 1px for rows, always `--color-divider`.

**Deliberate departures from the Modernist guide** (the owner's choices): footage plays in colour by default, with a per-clip B&W toggle, where Modernist prints imagery in B&W; and the video overlay buttons are custom ink-filled buttons, for legibility over footage.

## Assets
| File | Use | Format |
|---|---|---|
| `assets/videos/right_right_C179.mp4` | Home Fig. 1, left | 1920×1080, 2.27s, H.264 with audio, 1.16 MB |
| `assets/videos/skeleton_right_right_C179.mp4` | Home Fig. 1, right | 1280×720, 2.27s, H.264, no audio, 0.21 MB, re-encoded from mp4v |
| `assets/videos/left_right_C114.mp4` | Home Fig. 2, top left | 1920×1080, 2.00s, H.264 with audio, 0.87 MB |
| `assets/videos/right_right_C189.mp4` | Home Fig. 2, top right | 1920×1080, 2.27s, H.264 with audio, 1.17 MB |
| `assets/videos/right_left_C082.mp4` | Home Fig. 2, bottom left | 1920×1080, 1.90s, H.264 with audio, 0.90 MB |
| `assets/videos/left_left_C009.mp4` | Home Fig. 2, bottom right | 1920×1080, 1.20s, H.264 with audio, 1.06 MB, re-encoded from HEVC |

- **Source:** the owner's Ampe-DB_V1 release folder. These are recordings of participants; see *Decisions* (footage consent).
- **Browser-safe encoding:** serve only H.264 MP4s. The dataset's skeleton videos are MPEG-4 Part 2 (`mp4v`) and some source clips are HEVC (H.265); many browsers play neither. `skeleton_right_right_C179` and `left_left_C009` were re-encoded. Check any clip you add:
  `ffmpeg -i in.mp4 -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a copy -movflags +faststart out.mp4` (use `-an` instead of `-c:a copy` for files without audio).
- **Icons:** Lucide (24-unit viewBox, stroke 2 — 2.5 for the Terms check/x and the FAQ plus/minus — round caps and joins, shown at 14–16px): `download`, `arrow-right`, `copy`, `check`, `x`, `mail`, `plus`, `minus`, `volume-x`, `volume-2`, `contrast`, `palette`.
- **Brand mark:** two squares (accent, ink), drawn in CSS with no image file. There are no photographs or other raster images.

## Files
Copy both top-level items into the repository root:
```
CLAUDE.md                        standing rules for Claude Code
design-handoff/
├── README.md                    this spec
├── BUILD_PLAN.md                setup checklist and phased prompts for Claude Code
├── reference/
│   ├── Ampe-DB Website (review copy).html   open in a browser — self-contained, works offline
│   └── Ampe-DB Website.dc.html              readable prototype source: markup, inline styles, logic
├── design-system/
│   ├── styles.css               Modernist tokens and component styles (source for the Tailwind theme)
│   └── readme.md                the Modernist design-system guide
└── assets/videos/               the six clips used on Home (web-ready)
```
