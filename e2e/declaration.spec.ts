import { readFile } from "node:fs/promises"
import path from "node:path"
import { expect, test, type Page } from "@playwright/test"
import { SignJWT } from "jose"

import { e2eTokenSecret, outboxDir } from "../playwright.config"

// Stub Turnstile: renders nothing and hands the form the token the fake
// server-side check accepts.
const turnstileStub = `
  window.turnstile = {
    render: function (el, options) {
      setTimeout(function () { options.callback("e2e-turnstile-pass") }, 0)
      return "e2e-widget"
    },
    reset: function () {},
    remove: function () {},
  }
`

test.beforeEach(async ({ page }) => {
  await page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
    route.fulfill({ contentType: "text/javascript", body: turnstileStub })
  )
})

async function readOutbox<T>(kind: string): Promise<T[]> {
  const text = await readFile(path.join(outboxDir, `${kind}.jsonl`), "utf8").catch(() => "")
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T)
}

async function fillDeclaration(page: Page, email: string) {
  await page.goto("/getting-the-database#gt_access")
  await page.getByLabel("Full name").fill("Ama Mensah")
  await page.getByLabel("Contact email").fill(email)
  await page.getByLabel("Affiliation (optional)").fill("University of Ghana")
  await page.getByRole("combobox", { name: "Intended use" }).click()
  await page.getByRole("option", { name: "Academic research" }).click()
  await page.getByLabel("Project or purpose description").fill("Pose-based recognition of Ampe.")
  await page.getByRole("checkbox", { name: /I have read and accept/ }).click()
}

const submit = (page: Page) =>
  page.getByRole("button", { name: "Submit and get your download link" })

test("declare, receive the email, download every package", async ({ page, request }, testInfo) => {
  const email = `e2e-${testInfo.project.name}-${Date.now()}@example.org`
  await fillDeclaration(page, email)
  await submit(page).click()

  // The first submit compiles the API route on the dev server; allow for it.
  await expect(page.getByRole("heading", { name: "Your download link is on its way." })).toBeVisible({
    timeout: 60_000,
  })
  await expect(page.getByRole("status")).toContainText(email)

  // The email went out straight away, with the personal link.
  const mail = (await readOutbox<{ to: string; subject: string; text: string }>("mail")).find(
    (entry) => entry.to === email
  )
  expect(mail?.subject).toBe("Your Ampe-DB V1 download link")
  const link = mail!.text.match(/http:\/\/localhost:\d+\/download\?token=\S+/)?.[0]
  expect(link).toBeTruthy()

  // The declaration row holds exactly the README's columns.
  const declaration = (await readOutbox<string[]>("declarations")).find((row) => row[3] === email)
  expect(declaration).toHaveLength(10)
  const reference = declaration![1]
  expect(reference).toMatch(/^AMP-[23456789A-HJKMNP-Z]{6}$/)
  expect(declaration!.slice(2, 9)).toEqual([
    "Ama Mensah",
    email,
    "University of Ghana",
    "Academic research",
    "Pose-based recognition of Ampe.",
    "TRUE",
    "Ampe-DB V1",
  ])
  expect(mail!.text).toContain(`Your reference is ${reference}.`)

  // The personal download page.
  await page.goto(link!)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your downloadis ready.")
  await expect(page.getByText(reference)).toBeVisible()
  const robots = await page.locator('meta[name="robots"]').getAttribute("content")
  expect(robots).toContain("noindex")

  const buttons = page.getByRole("table").getByRole("link", { name: /^Download / })
  await expect(buttons).toHaveCount(6)
  for (const button of await buttons.all()) {
    const href = await button.getAttribute("href")
    const packageId = href!.match(/\/api\/download\/([^?]+)/)![1]
    const response = await request.get(href!, { maxRedirects: 0 })
    expect(response.status()).toBe(302)
    expect(response.headers()["location"]).toBe(
      `https://drive.google.com/uc?export=download&id=e2e-${packageId}`
    )
  }

  const downloads = (await readOutbox<string[]>("downloads")).filter((row) => row[1] === reference)
  expect(downloads.map((row) => row[2]).sort()).toEqual(
    [
      "annotations-metadata",
      "pose",
      "research-docs",
      "skeleton-coordinates",
      "skeleton-videos",
      "videos",
    ]
  )

  // An edited token shows the expired state, and the API refuses it too.
  const edited = link!.replace(/.$/, (last) => (last === "A" ? "B" : "A"))
  await page.goto(edited)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This linkhas expired.")
  await expect(page.getByText("Personal download links work for 7 days.")).toBeVisible()
  const refused = await request.get(`/api/download/pose?token=${new URL(edited).searchParams.get("token")}`, {
    maxRedirects: 0,
  })
  expect(refused.status()).toBe(303)
})

test("an expired or missing token shows the expired state", async ({ page }) => {
  const expired = await new SignJWT()
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject("AMP-7K2QXM")
    .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
    .sign(new TextEncoder().encode(e2eTokenSecret))

  for (const url of [`/download?token=${expired}`, "/download"]) {
    await page.goto(url)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This linkhas expired.")
    await expect(page.getByRole("link", { name: "Request a new link" })).toHaveAttribute(
      "href",
      "/getting-the-database#gt_access"
    )
  }
})

test("a failed send shows the error and keeps what was typed", async ({ page }, testInfo) => {
  const email = `e2e-fail-${testInfo.project.name}-${Date.now()}@example.org`
  await page.route("**/api/declarations", (route) =>
    route.fulfill({ status: 502, json: { ok: false } })
  )
  await fillDeclaration(page, email)
  await submit(page).click()

  await expect(page.getByRole("alert").filter({ hasText: "We couldn’t send your link." })).toHaveText(
    "We couldn’t send your link. Please try again, or contact the team."
  )
  await expect(page.getByLabel("Contact email")).toHaveValue(email)
  await expect(page.getByLabel("Full name")).toHaveValue("Ama Mensah")
  await expect(submit(page)).toBeEnabled()
})

test("the form never scrolls sideways", async ({ page }) => {
  await page.goto("/getting-the-database#gt_access")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
