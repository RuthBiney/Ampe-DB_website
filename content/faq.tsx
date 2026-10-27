import type { ReactNode } from "react"
import Link from "next/link"

// FAQ (README → Screens → FAQ): 15 questions in 4 topics; q1 starts open.

export type FaqItem = { id: string; question: string; answer: ReactNode }
export type FaqTopic = { id: string; number: string; title: string; items: readonly FaqItem[] }

export const faqTopics: readonly FaqTopic[] = [
  {
    id: "faq_access",
    number: "06.1",
    title: "Access",
    items: [
      {
        id: "q1",
        question: "Can I use Ampe-DB for academic research?",
        answer:
          "Yes. Complete the required access form stating your intended purpose, accept the release Terms of Use, License and Research Data Use Agreement, and we’ll email you a personal link to download the dataset free of charge. No separate approval is required.",
      },
      {
        id: "q2",
        question: "Do I need approval before downloading Ampe-DB?",
        answer:
          "No. The access form is mandatory, but it is a use declaration rather than an approval application. After you submit it, a personal download link is emailed to you straight away.",
      },
      {
        id: "q3",
        question: "Is there a fee to download Ampe-DB?",
        answer: "No. Ampe-DB can be downloaded free of charge after the required access form is completed.",
      },
      {
        id: "q4",
        question: "Do I need an institutional affiliation?",
        answer:
          "No. Institutional affiliation is not required. Academic, educational, independent, cultural, artistic and exploratory uses are welcome when they comply with the Terms of Use.",
      },
    ],
  },
  {
    id: "faq_use",
    number: "06.2",
    title: "Use & sharing",
    items: [
      {
        id: "q5",
        question: "Can I redistribute the raw videos or pose files?",
        answer: "No. Raw participant-derived material should not be redistributed without authorization.",
      },
      {
        id: "q6",
        question: "Can I use screenshots or examples in a paper or presentation?",
        answer:
          "Use should remain consistent with the purpose declared in the access form, cite Ampe-DB, and respect participant privacy and the release terms. Do not turn illustrative use into redistribution of the underlying dataset.",
      },
      {
        id: "q7",
        question: "Can I use Ampe-DB commercially?",
        answer: (
          <>
            Commercial use or product integration requires prior written permission from the dataset
            maintainers. Review the release agreement and <Link href="/contact">contact the team</Link>{" "}
            before any commercial use.
          </>
        ),
      },
    ],
  },
  {
    id: "faq_data",
    number: "06.3",
    title: "Working with the data",
    items: [
      {
        id: "q8",
        question: "Do I need the RGB videos to use the pose data?",
        answer:
          "No. Pose-only modeling is supported. The RGB clips remain useful for provenance, qualitative interpretation and pose/skeleton validation.",
      },
      {
        id: "q9",
        question: "Are skeleton videos used for Baseline V1 model training?",
        answer:
          "No. The skeleton MP4 files are visualization and QC artifacts. Baseline V1 pose models use the canonical normalized pose CSV representation.",
      },
      {
        id: "q10",
        question: "What is the difference between pose CSV and skeleton CSV/JSON?",
        answer:
          "The pose CSV is the canonical normalized, model-oriented representation. Skeleton CSV/JSON retain the pixel-space geometry used to reconstruct and render the skeleton visualization.",
      },
      {
        id: "q11",
        question: "Why are there 637 canonical records if only 557 RGB/audio hashes are unique?",
        answer:
          "The release preserves canonical record provenance and 1:1 cross-representation correspondence. Exact duplicates are documented rather than silently removed, and the duplicate-safe split ensures they do not cross fixed train, validation and test boundaries.",
      },
      {
        id: "q12",
        question: "Does the dataset contain audio?",
        answer:
          "Yes. The canonical RGB MP4 clips retain synchronized embedded audio, including clap, step and vocal cues. Audio is not used in the frozen Baseline V1 experiments.",
      },
    ],
  },
  {
    id: "faq_report",
    number: "06.4",
    title: "Splits, citation & reporting",
    items: [
      {
        id: "q13",
        question: "Which split should I report?",
        answer: (
          <>
            State the exact protocol. Use the duplicate-safe fixed split for the locked reference
            benchmark, the 4-fold pair-held-out protocol for the primary unseen-pair generalization
            benchmark, and the participant-held-out diagnostic when analyzing unseen-participant
            transfer. <Link href="/research#rs_protocols">Evaluation protocols →</Link>
          </>
        ),
      },
      {
        id: "q14",
        question: "How should I cite the dataset?",
        answer: (
          <>
            Use <code>CITATION.cff</code> as the source of truth, name the dataset version, and state
            the evaluation protocol used in your work. <Link href="/#home_cite">Suggested citation →</Link>
          </>
        ),
      },
      {
        id: "q15",
        question: "How do I report an incorrect skeleton, annotation or metadata entry?",
        answer: (
          <>
            Contact the maintainers with the canonical clip ID, the representation affected and a
            concise description of the issue, so it can be reviewed against the source RGB clip and
            release metadata. <Link href="/contact">Contact →</Link>
          </>
        ),
      },
    ],
  },
]

/** Open by default. */
export const faqDefaultOpen = ["q1"]
