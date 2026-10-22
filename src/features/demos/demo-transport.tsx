import { Pause, Play, Repeat, Square } from "lucide-react"
import { useState } from "react"
import { invertedFill, secondaryButton } from "@/components/shared/shared.styles"
import { Button } from "@/components/ui/button"
import { AutoModeConfirm } from "@/features/control/auto-mode-confirm"
import { useControlStore } from "@/features/control/control.store"
import { useDemoStore } from "@/features/demos/demos.store"
import { cn } from "@/lib/utils"

const icon = "size-8 p-0"

// Transport: Play / Pause, Stop, Loop. Play in Manual mode asks to switch to Automatic first.
export function DemoTransport() {
  const status = useDemoStore((s) => (s.running ? s.run?.status : null))
  const loop = useDemoStore((s) => s.loop)
  const { start, pause, resume, stop, setLoop } = useDemoStore.getState()
  const estop = useControlStore((s) => s.estop)
  const mode = useControlStore((s) => s.mode)
  const [confirming, setConfirming] = useState(false)
  const playing = status === "running"
  const play = () => {
    if (status === "paused") resume()
    else if (mode !== "auto") setConfirming(true)
    else start()
  }
  return (
    <div role="group" aria-label="Demo transport" className="flex items-center gap-1">
      <Button
        size="sm"
        className={cn(icon, invertedFill)}
        disabled={estop}
        aria-label={playing ? "Pause" : status === "paused" ? "Resume" : "Play"}
        title={estop ? "Release the e-stop to play" : playing ? "Pause: the arm holds where it is" : "Play"}
        onClick={playing ? pause : play}
      >
        {playing ? <Pause /> : <Play />}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className={cn(icon, secondaryButton)}
        disabled={!status}
        aria-label="Stop"
        title="Stop"
        onClick={stop}
      >
        <Square />
      </Button>
      <Button
        size="sm"
        variant="outline"
        aria-pressed={loop}
        aria-label="Loop"
        title={loop ? "Loop: on" : "Loop: off"}
        className={cn(
          icon,
          secondaryButton,
          "aria-pressed:bg-foreground! aria-pressed:text-background! aria-pressed:hover:bg-foreground/90!",
        )}
        onClick={() => setLoop(!loop)}
      >
        <Repeat />
      </Button>
      <AutoModeConfirm
        open={confirming}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false)
          useControlStore.getState().setMode("auto")
          start()
        }}
      />
    </div>
  )
}
