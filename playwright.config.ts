import path from "node:path"
import { defineConfig, devices } from "@playwright/test"

// End-to-end test of declaration → email → download. Google Sheets, Gmail and
// Turnstile are faked (lib/fake-services.ts): the dev server writes the "sent"
// email and the "appended" rows to E2E_OUTBOX_DIR, and the browser gets a
// stub Turnstile script. Runs against `next dev`, because the fakes refuse to
// switch on in a production build.

const port = 3100
export const outboxDir = path.join(__dirname, "test-results", "e2e-outbox")
export const e2eTokenSecret = "e2e-only-secret-that-is-at-least-32-characters"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "phone", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `npx next dev --port ${port}`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      E2E_FAKE_SERVICES: "1",
      E2E_OUTBOX_DIR: outboxDir,
      SITE_URL: `http://localhost:${port}`,
      DOWNLOAD_TOKEN_SECRET: e2eTokenSecret,
      DOWNLOAD_LINK_TTL_DAYS: "7",
      GOOGLE_SERVICE_ACCOUNT_EMAIL: "fake@e2e.invalid",
      GOOGLE_PRIVATE_KEY: "fake",
      GOOGLE_SHEET_ID: "fake",
      GMAIL_USER: "fake@e2e.invalid",
      GMAIL_APP_PASSWORD: "fake",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "e2e-site-key",
      TURNSTILE_SECRET_KEY: "fake",
      DRIVE_FILE_VIDEOS: "e2e-videos",
      DRIVE_FILE_POSE: "e2e-pose",
      DRIVE_FILE_SKELETON_VIDEOS: "e2e-skeleton-videos",
      DRIVE_FILE_SKELETON_COORDINATES: "e2e-skeleton-coordinates",
      DRIVE_FILE_ANNOTATIONS_METADATA: "e2e-annotations-metadata",
      DRIVE_FILE_RESEARCH_DOCS: "e2e-research-docs",
    },
  },
})
