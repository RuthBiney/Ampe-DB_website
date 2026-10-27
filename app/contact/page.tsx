import type { Metadata } from "next"
import { MailIcon } from "lucide-react"

import { AutoGrid } from "@/components/patterns/auto-grid"
import { Callout } from "@/components/patterns/callout"
import { NumberedList } from "@/components/patterns/numbered-list"
import { PageHeader } from "@/components/patterns/page-header"
import { Container } from "@/components/site/container"
import { contactTopics, team } from "@/content/contact"

export const metadata: Metadata = { title: "Contact Us" }

function Kicker({ children }: { children: string }) {
  return (
    <span className="text-[13px] font-semibold tracking-[.08em] text-brand-700 tabular-nums">
      {children}
    </span>
  )
}

export default function ContactPage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow="07 — Contact Us"
          lines={["Contact", "the team."]}
          lead="Ampe-DB was developed through the Young Africans Research Academy (YARA) to advance research capacity, culturally grounded data resources and reproducible human interaction research."
        />

        <section className="border-t-2 border-border pt-10 pb-16">
          <Kicker>07.1</Kicker>
          <h2 className="mt-2.5 mb-7">Ampe-DB team</h2>
          <AutoGrid min="320px" className="gap-x-10 gap-y-8">
            {team.map((member) => (
              <article
                key={member.email}
                className="grid content-start gap-2 border-t-2 border-foreground pt-[18px]"
              >
                <h3 className="m-0 text-[clamp(24px,2.4vw,30px)] leading-[1.15]">{member.name}</h3>
                <span className="text-[15px] text-neutral-700">{member.affiliation}</span>
                <a
                  href={`mailto:${member.email}`}
                  className="mt-2.5 inline-flex w-max max-w-full items-center gap-2 font-semibold break-all pointer-coarse:min-h-11"
                >
                  <MailIcon size={16} aria-hidden="true" className="shrink-0" />
                  {member.email}
                </a>
              </article>
            ))}
          </AutoGrid>
        </section>

        <AutoGrid
          as="section"
          min="360px"
          className="items-start gap-x-18 gap-y-12 border-t-2 border-border pt-12 pb-22"
        >
          <div>
            <Kicker>07.2</Kicker>
            <h2 className="mt-2.5 mb-5">What to contact us about</h2>
            <ul className="m-0 grid list-none p-0">
              {contactTopics.map((topic) => (
                <li key={topic} className="border-t border-border py-3.5 last:border-b">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker>07.3</Kicker>
            <h2 className="mt-2.5 mb-5">Reporting a dataset issue</h2>
            <p className="mt-0 mb-2 text-neutral-800">
              Include enough detail for the issue to be reviewed against the source RGB clip and
              release metadata:
            </p>
            <NumberedList
              items={[
                <>
                  The canonical clip ID, for example <code>left_right_C003</code>
                </>,
                "The affected representation or metadata file",
                "Enough detail to reproduce the issue",
              ]}
            />
            <Callout tone="important" label="Privacy" className="mt-6">
              <p>
                Do not send participant-identifying information by email unless specifically
                requested through an approved secure process.
              </p>
            </Callout>
          </div>
        </AutoGrid>
      </Container>
    </main>
  )
}
