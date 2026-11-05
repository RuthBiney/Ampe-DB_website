import type { Metadata } from "next"

import { FaqTopics } from "@/components/faq/faq-topics"
import { DocLayout } from "@/components/patterns/doc-layout"
import { PageHeader } from "@/components/patterns/page-header"
import { SectionRail } from "@/components/patterns/section-rail"
import { Container } from "@/components/site/container"
import { faqRail } from "@/content/sections"

const lead =
  "Short answers to common questions. The Terms of Use, License and Research Data Use Agreement distributed with the release remain authoritative."

export const metadata: Metadata = { title: "FAQ", description: lead }

export default function FaqPage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow="06 — FAQ"
          lines={["Questions", "researchers ask."]}
          lead={lead}
        />
        <DocLayout narrow rail={<SectionRail groups={faqRail} navLabel="Topics" />}>
          <FaqTopics />
        </DocLayout>
      </Container>
    </main>
  )
}
