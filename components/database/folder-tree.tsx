import * as React from "react"

// Database 04.2: the release folder tree, with descriptions and record counts.
const rows: readonly { path: string; description?: string; count?: string }[] = [
  { path: "├── videos/", description: "RGB MP4 with embedded audio", count: "637" },
  { path: "├── pose/", description: "Normalized pose CSV", count: "637" },
  { path: "├── skeleton/" },
  { path: "│   ├── csv/", description: "Pixel-space skeleton CSV", count: "637" },
  { path: "│   ├── json/", description: "Skeleton JSON mirror", count: "637" },
  { path: "│   └── videos/", description: "Rendered skeleton MP4", count: "637" },
  { path: "├── annotations/", description: "Canonical clip-level labels" },
  { path: "├── metadata/", description: "Manifest, schema, mappings, statistics" },
  { path: "├── splits/", description: "Locked evaluation partitions" },
  { path: "├── docs/", description: "Release documentation" },
  { path: "├── paper/", description: "Paper materials" },
  { path: "├── README.md", description: "Release orientation" },
  { path: "├── CITATION.cff", description: "Citation metadata" },
  { path: "├── AMPE_DB_RESEARCH_DATA_USE_AGREEMENT.pdf", description: "Research data use agreement" },
  { path: "└── License.pdf", description: "License" },
]

const pathClasses = "font-mono text-[13.5px] whitespace-pre"

export function FolderTree() {
  return (
    <div className="overflow-x-auto bg-surface px-6 py-5">
      <div className="grid min-w-[620px] grid-cols-[max-content_minmax(200px,1fr)_max-content] items-baseline gap-x-8 leading-[2.1]">
        <span className={`${pathClasses} font-bold`}>Ampe-DB_V1/</span>
        <span />
        <span className="text-[11px] tracking-[.08em] text-neutral-700 uppercase">Records</span>
        {rows.map((row) => (
          <React.Fragment key={row.path}>
            <span className={pathClasses}>{row.path}</span>
            <span className="text-[14px] text-neutral-800">{row.description}</span>
            <span className="text-right text-[13px] font-bold text-brand-700 tabular-nums">
              {row.count}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
