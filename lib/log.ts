// Server logging that never carries form contents (CLAUDE.md → Security):
// only the step that failed and the error's name and status code — library
// errors can embed the request body, so their messages are not logged.

export function logFailure(step: string, error: unknown) {
  const name = error instanceof Error ? error.name : typeof error
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : undefined
  console.error(`[${step}] failed: ${name}${code ? ` (${code})` : ""}`)
}
