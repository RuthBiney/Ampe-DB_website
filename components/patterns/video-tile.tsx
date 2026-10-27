"use client"

import * as React from "react"
import { ContrastIcon, PaletteIcon, Volume2Icon, VolumeXIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Clip } from "@/content/clips"
import { cn } from "@/lib/utils"
import { videoSound } from "@/lib/video-sound"

// Video tile (README → Interactions → Video tiles). Sound rules — don't regress:
// 1. every video starts muted; 2. only one has sound (volume 0.5);
// 3. sound switches off below 25% visible, when the tab is hidden, and on
//    page change (unmount, or the page hidden by Next on navigation);
// 4. paused below 25%, resumed muted when visible;
// 5. reduced motion: no autoplay, paused with native controls;
// 6. play() rejections are swallowed.

const VISIBLE = 0.25

function play(video: HTMLVideoElement) {
  video.play()?.catch(() => {})
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function VideoTile({
  clip,
  preload = "auto",
  tagClassName,
  className,
}: {
  clip: Clip
  preload?: "auto" | "metadata"
  tagClassName?: string // letter-spacing differs between Fig. 1 and Fig. 2
  className?: string
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [mono, setMono] = React.useState(false)
  const soundOn = React.useSyncExternalStore(
    videoSound.subscribe,
    () => videoSound.getOwner() === clip.id,
    () => false
  )

  // Start muted, autoplay unless reduced motion, pause and mute out of view.
  // The <video> has no autoPlay attribute, so nothing plays before this runs.
  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.defaultMuted = true
    video.muted = true
    if (prefersReducedMotion()) {
      video.pause()
      video.controls = true
    } else {
      play(video)
    }

    let observer: IntersectionObserver | undefined
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio < VISIBLE) {
            if (!video.paused) video.pause()
            videoSound.release(clip.id)
          } else if (video.paused && !prefersReducedMotion()) {
            play(video)
          }
        },
        { threshold: [0, 0.25, 0.5] }
      )
      observer.observe(video)
    }

    // Runs on unmount and when Next hides the page on navigation (React
    // <Activity> keeps the DOM, so the element must be silenced here; this
    // effect runs again when the page is shown).
    return () => {
      observer?.disconnect()
      videoSound.release(clip.id)
      video.muted = true
      video.pause()
    }
  }, [clip.id])

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !soundOn
    if (soundOn) {
      video.volume = 0.5
      play(video)
    }
  }, [soundOn])

  return (
    <div className={cn("relative aspect-video bg-surface", className)}>
      <video
        ref={videoRef}
        src={clip.src}
        loop
        playsInline
        preload={preload}
        aria-label={clip.label}
        className={cn("absolute inset-0 block size-full object-cover", mono && "grayscale")}
      />
      <Badge
        className={cn(
          "pointer-events-none absolute top-3 left-3 font-semibold tracking-[.06em]",
          tagClassName
        )}
      >
        {clip.tag}
      </Badge>
      <OverlayButton
        className="left-3"
        pressed={mono}
        label={`${mono ? "Color" : "B&W"} ${clip.record}`}
        onClick={() => setMono((m) => !m)}
      >
        {mono ? <PaletteIcon aria-hidden="true" /> : <ContrastIcon aria-hidden="true" />}
        <span>{mono ? "Color" : "B&W"}</span>
      </OverlayButton>
      {clip.hasAudio && (
        <OverlayButton
          className="right-3"
          pressed={soundOn}
          label={`${soundOn ? "Mute" : "Unmute"} ${clip.record}`}
          onClick={() => (soundOn ? videoSound.release(clip.id) : videoSound.claim(clip.id))}
        >
          {soundOn ? <Volume2Icon aria-hidden="true" /> : <VolumeXIcon aria-hidden="true" />}
          <span>{soundOn ? "Mute" : "Unmute"}</span>
        </OverlayButton>
      )}
    </div>
  )
}

// Ink-filled overlay button (a deliberate departure from Modernist, for
// legibility over footage): 36px, 44px on touch screens, 12px insets.
function OverlayButton({
  className,
  pressed,
  label,
  ...props
}: React.ComponentProps<"button"> & { pressed: boolean; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      className={cn(
        "absolute bottom-3 z-[1] inline-flex h-9 cursor-pointer items-center gap-2 bg-foreground px-3 text-[13px] font-semibold text-background hover:bg-brand-600 active:bg-brand-700 pointer-coarse:h-11 [&_svg]:size-4",
        className
      )}
      {...props}
    />
  )
}
