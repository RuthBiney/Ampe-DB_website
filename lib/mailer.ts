import { fakeServicesEnabled, recordFake } from "@/lib/fake-services"
import { requireEnv } from "@/lib/server-env"

// Sends mail through the project Gmail account with an app password.

export async function sendMail({ to, subject, text }: { to: string; subject: string; text: string }) {
  if (fakeServicesEnabled()) return recordFake("mail", { to, subject, text })

  const env = requireEnv("GMAIL_USER", "GMAIL_APP_PASSWORD")
  const { createTransport } = await import("nodemailer")
  const transport = createTransport({
    service: "gmail",
    auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
  await transport.sendMail({
    from: { name: "Ampe-DB", address: env.GMAIL_USER },
    to,
    subject,
    text,
  })
}
