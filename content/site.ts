// Site-wide navigation and shell copy (README → Global shell). One source of
// truth for the header, the small-screen menu and the footer.

export type NavItem = {
  number: string
  label: string
  href: string
}

export const navItems: readonly NavItem[] = [
  { number: "01", label: "Home", href: "/" },
  { number: "02", label: "Terms of Use", href: "/terms" },
  { number: "03", label: "Getting the Database", href: "/getting-the-database" },
  { number: "04", label: "Database", href: "/database" },
  { number: "05", label: "Research", href: "/research" },
  { number: "06", label: "FAQ", href: "/faq" },
  { number: "07", label: "Contact Us", href: "/contact" },
]

// Every "Access the dataset", "Download dataset" and "Complete the access form" CTA.
export const accessFormHref = "/getting-the-database#gt_access"

export const utilityBar = {
  release: "Ampe-DB V1 · Baseline V1 benchmark · 2026 release",
  academy: "Young Africans Research Academy (YARA)",
}

export const menuFootnote = "Ampe-DB V1 · Young Africans Research Academy (YARA)"

export type FooterLink = { label: string; href: string }

export const footer = {
  blurb:
    "A dataset for human activity and interaction analysis using the Ghanaian game Ampe. Developed through the Young Africans Research Academy (YARA).",
  columns: [
    {
      heading: "Dataset",
      links: [
        { label: "Dataset overview", href: "/database#db_overview" },
        { label: "Database structure", href: "/database#db_structure" },
        { label: "Evaluation protocols", href: "/research#rs_protocols" },
        { label: "Baseline V1 results", href: "/research#rs_results" },
      ],
    },
    {
      heading: "Access",
      links: [
        { label: "Access the dataset", href: "/getting-the-database#gt_access" },
        { label: "What you receive", href: "/getting-the-database#gt_receive" },
        { label: "Verify checksums", href: "/getting-the-database#gt_verify" },
        { label: "Version information", href: "/getting-the-database#gt_version" },
      ],
    },
    {
      heading: "Information",
      links: [
        { label: "Terms of use", href: "/terms" },
        { label: "Ethical use", href: "/terms#tm_warranty" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact us", href: "/contact" },
      ],
    },
  ] satisfies { heading: string; links: FooterLink[] }[],
  copyright: "© 2026 Ampe-DB · Young Africans Research Academy (YARA)",
  edition: "Ampe-DB V1 · Baseline V1 benchmark",
}
