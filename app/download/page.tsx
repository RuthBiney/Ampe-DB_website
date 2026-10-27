import type { Metadata } from "next"
import { Suspense } from "react"
import { connection } from "next/server"

export const metadata: Metadata = {
  title: "Your download",
  robots: { index: false, follow: false },
}

// TODO(Phase 5): verify the token and render the valid or expired state.
async function DownloadState() {
  await connection()
  return null
}

export default function DownloadPage() {
  return (
    <main>
      <Suspense>
        <DownloadState />
      </Suspense>
    </main>
  )
}
