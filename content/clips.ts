// The six Home clips (README → Assets). Files live in public/videos/.

export type Clip = {
  id: string
  src: string
  label: string // accessible name of the <video>
  record: string // used in the toggle names, e.g. "Unmute right_right_C179"
  tag: string
  hasAudio: boolean
}

export const clips = {
  c179: {
    id: "c179",
    src: "/videos/right_right_C179.mp4",
    label: "Ampe interaction, canonical record right_right_C179",
    record: "right_right_C179",
    tag: "RGB · videos/",
    hasAudio: true,
  },
  c179s: {
    id: "c179s",
    src: "/videos/skeleton_right_right_C179.mp4",
    label: "Rendered skeleton video, canonical record right_right_C179",
    record: "skeleton_right_right_C179",
    tag: "Skeleton · skeleton/videos/",
    hasAudio: false,
  },
  c114: {
    id: "c114",
    src: "/videos/left_right_C114.mp4",
    label: "Ampe interaction, canonical record left_right_C114",
    record: "left_right_C114",
    tag: "left_right_C114 · different legs",
    hasAudio: true,
  },
  c189: {
    id: "c189",
    src: "/videos/right_right_C189.mp4",
    label: "Ampe interaction, canonical record right_right_C189",
    record: "right_right_C189",
    tag: "right_right_C189 · same legs",
    hasAudio: true,
  },
  c082: {
    id: "c082",
    src: "/videos/right_left_C082.mp4",
    label: "Ampe interaction, canonical record right_left_C082",
    record: "right_left_C082",
    tag: "right_left_C082 · different legs",
    hasAudio: true,
  },
  c009: {
    id: "c009",
    src: "/videos/left_left_C009.mp4",
    label: "Ampe interaction, canonical record left_left_C009",
    record: "left_left_C009",
    tag: "left_left_C009 · same legs",
    hasAudio: true,
  },
} as const satisfies Record<string, Clip>

export type ClipId = keyof typeof clips
