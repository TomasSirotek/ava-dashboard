import { Gamepad2 } from "lucide-react"
import { whiteButton } from "@/components/shared/shared.styles"
import { Button } from "@/components/ui/button"
import { PAD_HINT } from "@/features/control/control.content"
import { useControlStore } from "@/features/control/control.store"
import { cn } from "@/lib/utils"

export function ControllerStatus() {
  const pad = useControlStore((s) => s.pad)
  const rescanPads = useControlStore((s) => s.rescanPads)
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/40 px-4 py-6 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-background shadow-xs ring-1 ring-foreground/10">
        <Gamepad2 className="size-5" />
      </span>
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className={cn("size-2 rounded-full", pad ? "bg-green-500" : "bg-muted-foreground/50")} />
        {pad ? "Controller connected" : "Controller not connected"}
      </div>
      <p className="max-w-full truncate text-xs text-muted-foreground">{pad ?? PAD_HINT}</p>
      {!pad && (
        <Button size="sm" variant="outline" className={whiteButton} onClick={rescanPads}>
          Reconnect
        </Button>
      )}
    </div>
  )
}
