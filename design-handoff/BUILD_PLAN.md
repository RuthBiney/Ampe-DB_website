# Ampe-DB V1 website — build plan

**Stack:** Next.js (App Router, TypeScript) with Tailwind CSS v4 and shadcn/ui, on Vercel · declarations in a Google Sheet · personal download links emailed from Gmail · archives on Google Drive · Claude Code in VS Code or Cursor.

## 0. One-time setup

### Repository
1. Clone `RuthBiney/Ampe-DB_website` (currently empty) and open it in VS Code or Cursor with the Claude Code extension.
2. Copy `CLAUDE.md` and the `design-handoff/` folder from this package into the repository root.
3. Commit and push: "Add design handoff".

### Accounts
Needed from Phase 5. Set them up while Claude Code builds Phases 1–4.

| Service | What to do | You end up with |
|---|---|---|
| Vercel | Import the GitHub repository (Hobby plan). | A project and a `*.vercel.app` address |
| Google Cloud | Create a project, enable the Google Sheets API, create a service account and download a JSON key. | `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` |
| Google Sheets | Create a sheet with tabs `declarations` and `downloads` and the header rows from README → *Production architecture*. Share it with the service-account email as Editor. | `GOOGLE_SHEET_ID` (from the URL) |
| Gmail | Create a dedicated project address. Turn on 2-Step Verification, then create an app password. | `GMAIL_USER`, `GMAIL_APP_PASSWORD` |
| Cloudflare Turnstile | Add a widget for your `*.vercel.app` hostname. Locally, use Cloudflare's test keys. | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| Google Drive | Upload the six archives (`videos.zip` … `research-docs.zip`) and share each as "Anyone with the link · Viewer". | Six file IDs for the `DRIVE_FILE_*` variables |

Generate `DOWNLOAD_TOKEN_SECRET` with `openssl rand -base64 32`. Never commit the JSON key or any secret.

## Working rhythm
- Paste one phase's prompt into Claude Code. Let it finish, then check the result against the reference at 390, 768 and 1440px wide (browser dev tools → device toolbar).
- Commit and push at each checkpoint, then ask me in this design project to "review phase N". I'll read the repository and compare it with the design.
- Design changes come back here first: I update the design and give you the changed part of the spec to pass to Claude Code.

## Phase 1 — Scaffold, theme and shell
> Read CLAUDE.md and design-handoff/README.md, and open design-handoff/reference/Ampe-DB Website (review copy).html. Scaffold a Next.js App Router + TypeScript app in this repository with Tailwind CSS v4 and ESLint (`app/` at the root). Run `npx shadcn@latest init`, apply the theme from README → *shadcn/ui theme and component map* and the base styles from README → *Global CSS*, and load Archivo with next/font. Add the shadcn components in the component map (button, badge, table, form, input, textarea, label, select, checkbox, tabs, accordion, sheet, separator, card) and edit them to the Modernist specs. Add Vitest and `typecheck` / `test` scripts. Then build the utility bar, the sticky header — full nav from `xl`, "Menu" + full-screen Sheet below — and the footer, with a placeholder route for every page in README → Routes. Before writing the site components, list the ones you plan to build, mapped to README → Shared patterns, and wait for my OK.

**Checkpoint:** header, menu and footer match the reference at 360, 768, 1280 and 1440px; nothing scrolls sideways; `npm run build` passes.

## Phase 2 — Content and shared patterns
> Create the typed content modules in content/ — results (Macro-F1), packages, FAQ (15 items in 4 topics), landmarks (0–32), release notes and the at-a-glance stats — copying every value verbatim from the README and the reference. Then build every component in README → Shared patterns on top of the shadcn components, plus BarChart, VideoTile and SectionRail (with scroll-spy) as specified under Interactions & behaviour, following README → Responsive behaviour. Add a temporary /dev/components page that shows each one.

**Checkpoint:** each component matches the reference at phone and desktop widths, and the video sound rules hold: muted start, one with sound, sound off when out of view or when the tab is hidden.

## Phase 3 — Home
> Build the Home page from README → Screens → Home with the shared components. Copy the six clips from design-handoff/assets/videos into public/videos. Match spacing and type exactly, and check it at 360, 768 and 1440px.

**Checkpoint:** compare Home with the reference section by section, on a phone width and a desktop width.

## Phase 4 — The other pages
> Build Terms of Use, Database, Research, FAQ and Contact Us from README → Screens, one page at a time, and stop after each for my review. Include the record path builder (Database 04.4), the chart's task tabs (Research 05.3), the FAQ accordion and the copy buttons. Then build Getting the Database with the declaration form's visual states only — no backend yet. Check every page at 360, 768 and 1440px.

**Checkpoint:** one per page.

## Phase 5 — Declaration, email and downloads
> Implement README → Production architecture: POST /api/declarations (zod, honeypot, Turnstile, Google Sheets append, signed token with jose, email with nodemailer over Gmail), the /download page with its valid and expired states, and GET /api/download/[packageId] (verify, log to the downloads tab, redirect to Drive). Wire the form's sending, error and success states with shadcn Form and react-hook-form. Add .env.example. Write Vitest tests for the schema and the token, and a Playwright test of the whole flow — at a phone and a desktop viewport — with Google, mail and Turnstile mocked.

**Checkpoint:** with a test sheet and your own email address — submit, receive the email, download each package and see rows in both tabs. An edited or expired token shows the expired state. Try it once on your phone.

## Phase 6 — Launch
> Prepare for launch: page titles and descriptions, a favicon and Open Graph image (ask me for the artwork), a 404 page in the Modernist style, sitemap.xml and robots.txt (exclude /download and /api), poster images for the six videos (first frame, via ffmpeg) with preload="metadata" below the fold, a responsive pass at 360, 390, 768, 1024, 1280 and 1440px, an accessibility pass (axe, keyboard, focus rings, 44px touch targets, aria-pressed on the video toggles) and a Lighthouse check on mobile and desktop. Remove /dev/components. List anything still missing.

Then add every variable in Vercel → Settings → Environment Variables, set `SITE_URL` to the live address, deploy, and repeat the Phase 5 test on the live site from a phone and a computer.

## Still needed
- **From you:** privacy-notice wording for the form; confirmation that participant consent covers public web use of the clips; the six release archives, uploaded to Drive.
- **From the design side:** the 404 page and the favicon. Ask in this design project before Phase 6.
