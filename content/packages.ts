// Release packages (README → Production architecture → Packages and
// Screens → Getting the Database). `driveFileEnv` names the server-only
// environment variable that holds the Drive file ID — never the ID itself.

export const packages = [
  {
    id: "videos",
    name: "Raw RGB videos",
    contents: "637 canonical MP4 clips with synchronized embedded audio",
    archive: "videos.zip",
    driveFileEnv: "DRIVE_FILE_VIDEOS",
  },
  {
    id: "pose",
    name: "Normalized pose",
    contents: "Two-player, 33-landmark normalized pose CSV for model inputs",
    archive: "pose.zip",
    driveFileEnv: "DRIVE_FILE_POSE",
  },
  {
    id: "skeleton-videos",
    name: "Skeleton videos",
    contents: "Rendered skeleton MP4 files for visual inspection",
    archive: "skeleton-videos.zip",
    driveFileEnv: "DRIVE_FILE_SKELETON_VIDEOS",
  },
  {
    id: "skeleton-coordinates",
    name: "Skeleton coordinates",
    contents: "Pixel-space landmark exports in CSV and JSON",
    archive: "skeleton-coordinates.zip",
    driveFileEnv: "DRIVE_FILE_SKELETON_COORDINATES",
  },
  {
    id: "annotations-metadata",
    name: "Annotations & metadata",
    contents: "Movement labels, manifest, participant–pair mapping and schemas",
    archive: "annotations-metadata.zip",
    driveFileEnv: "DRIVE_FILE_ANNOTATIONS_METADATA",
  },
  {
    id: "research-docs",
    name: "Splits & documentation",
    contents: "Frozen evaluation partitions, paper, README, citation file and release documentation",
    archive: "research-docs.zip",
    driveFileEnv: "DRIVE_FILE_RESEARCH_DOCS",
  },
] as const

export type Package = (typeof packages)[number]
export type PackageId = Package["id"]
