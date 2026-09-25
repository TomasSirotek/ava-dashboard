import { Ruler, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { IPartLabelProps } from "@/features/viewport/viewport.interface"

// Floats beside the selected part; PartTracker positions it every frame.
export function PartLabel({ ref, part, onClose }: IPartLabelProps) {
  return (
    <div
      ref={ref}
      hidden
      className="absolute top-0 left-0 flex items-center gap-2 rounded-lg border border-orange-500/40 bg-background/95 py-1 pr-1 pl-2.5 text-sm shadow-md"
    >
      <Ruler className="size-4 shrink-0 text-orange-500" />
      <div className="flex flex-col leading-tight">
        <span className="font-medium">{part.label}</span>
        <span className="font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums">
          part {part.partMm} mm{part.jointMm !== null && ` · joint to joint ${part.jointMm} mm`}
        </span>
      </div>
      <Button size="icon-sm" variant="ghost" title="Clear selection (Esc)" onClick={onClose}>
        <X />
      </Button>
    </div>
  )
}
