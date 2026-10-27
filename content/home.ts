// Structured Home lists (README → Screens → Home). Prose stays in app/page.tsx.

export const cycle = [
  { number: "01", name: "Jump.", text: "Both players jump in a tightly coordinated rhythm." },
  { number: "02", name: "Clap.", text: "Claps punctuate the cycle; the cue survives in each clip’s embedded audio." },
  { number: "03", name: "Leg reveal.", text: "Each player reveals a leg. The pair’s configuration is the V1 label." },
] as const

export const representations = [
  {
    number: "01",
    tag: "Source",
    accent: false,
    title: "RGB video + audio",
    text: "Canonical MP4 clips with synchronized embedded audio, retaining clap, step and vocal cues.",
    folder: "videos/",
  },
  {
    number: "02",
    tag: "Model input",
    accent: true,
    title: "Normalized 2D pose",
    text: "Long-form CSV with up to 33 MediaPipe landmarks per player per frame, hip-centered and torso-scaled.",
    folder: "pose/",
  },
  {
    number: "03",
    tag: "Geometry",
    accent: false,
    title: "Skeleton CSV",
    text: "Pixel-space landmark coordinates for visualization and reconstruction.",
    folder: "skeleton/csv/",
  },
  {
    number: "04",
    tag: "Geometry",
    accent: false,
    title: "Skeleton JSON",
    text: "A JSON mirror of the same pixel-space skeleton coordinates.",
    folder: "skeleton/json/",
  },
  {
    number: "05",
    tag: "Visualization",
    accent: false,
    title: "Skeleton MP4",
    text: "Rendered videos for inspection and figures — not a separate ground-truth modality.",
    folder: "skeleton/videos/",
  },
] as const

export const gettingStarted = [
  {
    number: "01",
    title: "Review the terms",
    text: "Read the Terms of Use and the Research Data Use Agreement.",
    link: { href: "/terms", label: "Terms of Use" },
  },
  {
    number: "02",
    title: "Declare, then download",
    text: "Complete the access form stating your intended purpose, then download the dataset free of charge.",
    link: { href: "/getting-the-database#gt_access", label: "Access the dataset" },
  },
  {
    number: "03",
    title: "Take only what you need",
    text: "Download only the package components your research requires.",
    link: { href: "/getting-the-database#gt_receive", label: "What you receive" },
  },
  {
    number: "04",
    title: "Read before writing loaders",
    text: "Read Database Structure, Data Formats and File Naming Rules first.",
    link: { href: "/database#db_structure", label: "Database structure" },
  },
  {
    number: "05",
    title: "Report on the provided splits",
    text: "Use the provided split definitions when reporting Baseline V1 results.",
    link: { href: "/research#rs_protocols", label: "Evaluation protocols" },
  },
  {
    number: "06",
    title: "Cite version and protocol",
    text: "Cite Ampe-DB and state the release version and evaluation protocol used.",
    link: { href: "/#home_cite", label: "Citation" },
  },
] as const

export const recommendedFiles = [
  { file: "README.md", why: "Release-level orientation" },
  { file: "CITATION.cff", why: "Citation metadata" },
  { file: "metadata/ampe_db_v1_manifest.csv", why: "Canonical record inventory and duplicate provenance" },
  { file: "annotations/ampe_db_v1_labels.csv", why: "The two V1 supervised label spaces" },
  { file: "splits/", why: "Locked fixed and pair-held-out partition files" },
] as const
