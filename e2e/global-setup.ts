import { rm } from "node:fs/promises"

import { outboxDir } from "../playwright.config"

export default async function globalSetup() {
  await rm(outboxDir, { recursive: true, force: true })
}
