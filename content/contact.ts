// Contact Us: the maintainers (README → Screens → Contact Us) and the two lists.

export type TeamMember = { name: string; affiliation: string; email: string }

export const team: readonly TeamMember[] = [
  {
    name: "Ruth Senior Biney",
    affiliation: "Young Africans Research Academy (YARA)",
    email: "ruthbiney148@gmail.com",
  },
  {
    name: "Isaac Kojo Yedonu Aboah",
    affiliation: "Young Africans Research Academy (YARA)",
    email: "isaacaboah@gmail.com",
  },
]

export const contactTopics = [
  "Access-form, download and usage-agreement questions",
  "Citation and release-version questions",
  "Corrections to metadata, annotations or skeleton outputs",
  "Reproducibility questions about the frozen V1 benchmark",
  "Permissions for uses outside the standard non-commercial terms",
] as const
