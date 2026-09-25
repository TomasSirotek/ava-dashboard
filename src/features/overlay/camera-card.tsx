import { Maximize2, Minimize2, VideoOff } from "lucide-react"
import { useEffect, useState } from "react"
import { Heading } from "@/components/shared/heading"
import { Button } from "@/components/ui/button"
import type { ICameraCardProps } from "@/features/overlay/overlay.interface"
import { cn } from "@/lib/utils"

// Click-to-expand preview (like picture-in-picture): the tile grows in place, Esc or a second click collapses it.
// The expanded card floats over the 3D view (anchored bottom-left of its slot), so it never shifts layout or scrolls.
export function CameraCard({ src, onReconnect }: ICameraCardProps) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [expanded])
  const toggle = () => setExpanded(!expanded)
  const label = expanded ? "Collapse camera" : "Expand camera"
  return (
    // The slot takes whatever height is left in the column, so the stack always ends at the viewport's bottom edge.
    <div className="relative min-h-32 w-72 flex-1 shrink!">
      <div
        className={cn(
          "absolute bottom-0 left-0 z-10 flex flex-col rounded-xl border bg-background/90 p-4 shadow-sm backdrop-blur transition-[width] duration-300 ease-out",
          expanded ? "w-[min(36rem,calc(100vw-2rem))] shadow-lg" : "top-0 w-72",
        )}
      >
        <Heading
          action={
            <Button size="icon-sm" variant="ghost" aria-label={label} onClick={toggle}>
              {expanded ? <Minimize2 /> : <Maximize2 />}
            </Button>
          }
        >
          Camera
        </Heading>
        <div className={cn("relative w-full overflow-hidden rounded-lg border bg-muted", expanded ? "aspect-video" : "min-h-0 flex-1")}>
          {src ? (
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={label}
              onClick={toggle}
              className="group block size-full cursor-zoom-in aria-expanded:cursor-zoom-out"
            >
              <img src={src} alt="Kinect camera feed" className="size-full object-cover" />
              <span className="absolute right-2 bottom-2 rounded-md bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {expanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              </span>
            </button>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <VideoOff className="size-4" /> No signal
              </span>
              <button
                type="button"
                onClick={onReconnect}
                className="rounded-md border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black shadow-sm hover:bg-neutral-100"
              >
                Reconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
