import type { Metadata } from "next"
import Link from "next/link"
import { CheckIcon, XIcon } from "lucide-react"

import { ArrowLink } from "@/components/patterns/arrow-link"
import { AutoGrid } from "@/components/patterns/auto-grid"
import { BulletList } from "@/components/patterns/bullet-list"
import { DocLayout } from "@/components/patterns/doc-layout"
import { DocSection, Lead, Secondary } from "@/components/patterns/doc-section"
import { LabeledBlock } from "@/components/patterns/labeled-block"
import { NumberedList } from "@/components/patterns/numbered-list"
import { PageHeader } from "@/components/patterns/page-header"
import { SectionRail } from "@/components/patterns/section-rail"
import { Container } from "@/components/site/container"
import { railItem, termsRail } from "@/content/sections"

export const metadata: Metadata = { title: "Terms of Use" }

const section = (id: string) => {
  const { number, label } = railItem(termsRail, id)
  return { id, number, title: label }
}

export default function TermsPage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow="02 — Terms of Use"
          lines={["Open access.", "Responsible use."]}
          lead="By accessing, downloading or using Ampe-DB you agree to the Terms of Use, License and Research Data Use Agreement distributed with the release. This page summarizes them; the release documents remain authoritative."
        />
        <DocLayout rail={<SectionRail groups={termsRail} />}>
          <DocSection {...section("tm_accept")}>
            <Lead>
              By accessing, downloading or using Ampe-DB, users agree to comply with the release Terms
              of Use, License and Research Data Use Agreement distributed with the dataset.
            </Lead>
            <Secondary>
              Ampe-DB is openly downloadable after completion of a short access form declaring the
              intended purpose of use. The form is a required use declaration, not an approval process.
            </Secondary>
            <AutoGrid min="200px" className="mt-9 gap-6">
              <LabeledBlock
                label="Agreement"
                value="Research Data Use Agreement"
                detail={
                  <code className="text-[12.5px] break-all text-neutral-700">
                    AMPE_DB_RESEARCH_DATA_USE_AGREEMENT.pdf
                  </code>
                }
              />
              <LabeledBlock
                label="License"
                value="Release license"
                detail={<code className="text-[12.5px] text-neutral-700">License.pdf</code>}
              />
              <LabeledBlock
                label="Terms"
                value="Terms of Use"
                detail={<span className="text-[13px] text-neutral-700">Distributed with the release</span>}
              />
            </AutoGrid>
          </DocSection>

          <DocSection {...section("tm_use")} titleClassName="mb-7">
            <AutoGrid min="300px" className="gap-x-10 gap-y-8">
              <div className="grid content-start gap-3.5 border-t-2 border-foreground pt-[18px]">
                <UseHeading tone="ink" title="Permitted" />
                <p className="m-0">
                  Ampe-DB is intended primarily for non-commercial research, educational, cultural and
                  exploratory use.
                </p>
                <BulletList className="gap-1.5 text-neutral-800">
                  <li>Non-commercial academic research</li>
                  <li>Teaching and education</li>
                  <li>Cultural and artistic work</li>
                  <li>Independent and exploratory study</li>
                </BulletList>
                <p className="mt-1.5 mb-0 bg-surface px-4 py-3.5 text-[14.5px] leading-[1.6]">
                  Commercial use or product integration requires prior written permission from the
                  dataset maintainers. <Link href="/contact">Contact the team →</Link>
                </p>
              </div>
              <div className="grid content-start gap-3.5 border-t-2 border-brand pt-[18px]">
                <UseHeading tone="brand" title="Prohibited" />
                <BulletList className="gap-2.5">
                  <li>
                    Surveillance, biometric identification, law-enforcement profiling or tracking of
                    individual participants.
                  </li>
                  <li>Attempts to re-identify participants or connect pseudonymous IDs with real identities.</li>
                  <li>
                    Unauthorized redistribution of raw videos, audio, pose files, skeleton coordinates or
                    other participant-derived data.
                  </li>
                  <li>Uses that misrepresent or disrespect the cultural practice of Ampe.</li>
                  <li>Claims that the dataset represents all regional forms of Ampe or African movement broadly.</li>
                </BulletList>
              </div>
            </AutoGrid>
          </DocSection>

          <DocSection {...section("tm_attribution")}>
            <Lead>
              Any publication, presentation, demonstration, repository or public output using Ampe-DB
              must cite the dataset.
            </Lead>
            <Secondary className="mb-5">
              The <code>CITATION.cff</code> file distributed with the release is the preferred citation
              source.
            </Secondary>
            <ArrowLink href="/#home_cite">Suggested citation and acknowledgement</ArrowLink>
          </DocSection>

          <DocSection {...section("tm_warranty")}>
            <Lead>
              Ampe-DB is provided as-is. The maintainers do not guarantee that every derived pose or
              skeleton estimate is free of tracking error.
            </Lead>
            <Secondary>
              Users are responsible for selecting appropriate quality thresholds and reporting
              limitations in derived analyses. See <Link href="/research#rs_limits">Known limitations</Link>.
            </Secondary>
          </DocSection>

          <DocSection {...section("tm_privacy")} titleClassName="mb-6">
            <NumberedList
              numberWidth={48}
              rules="top"
              className="max-w-[760px]"
              items={[
                "Use only the pseudonymous identifiers distributed with the release.",
                "Do not attempt participant identification, profiling or linkage to external datasets.",
                "Consent records and personally identifying information are not distributed as analysis metadata.",
              ]}
            />
          </DocSection>

          <DocSection {...section("tm_culture")} titleClassName="mb-6">
            <p className="mt-0 mb-6 max-w-[24ch] text-[clamp(26px,2.8vw,36px)] leading-[1.2] font-extrabold tracking-[-.015em]">
              Ampe is a living Ghanaian cultural practice.
            </p>
            <Secondary>
              Interpret results within the documented scope of the sampled recordings, avoid broad
              claims about African movement generally, and distinguish computational labels from the
              full cultural meaning and rules of the game.
            </Secondary>
          </DocSection>

          <DocSection {...section("tm_derived")}>
            <Lead className="mb-0">
              Published figures, model outputs and aggregate statistics must not enable reconstruction
              of restricted participant-derived data or create a new route to re-identification.
            </Lead>
          </DocSection>
        </DocLayout>
      </Container>
    </main>
  )
}

// 28×28 filled square with a light check or cross, then the H4.
function UseHeading({ tone, title }: { tone: "ink" | "brand"; title: string }) {
  const Icon = tone === "ink" ? CheckIcon : XIcon
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`inline-grid size-7 place-items-center text-background ${tone === "ink" ? "bg-foreground" : "bg-brand"}`}
      >
        <Icon className="size-4" strokeWidth={2.5} />
      </span>
      <h4 className="m-0 text-[20px]">{title}</h4>
    </div>
  )
}
