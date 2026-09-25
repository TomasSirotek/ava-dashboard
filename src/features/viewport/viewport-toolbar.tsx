import { Grid3X3, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { IViewportToolbarProps } from "@/features/viewport/viewport.interface"
import { ViewportHelp } from "@/features/viewport/viewport-help"

export function ViewportToolbar({ grid, onResetCamera, onToggleGrid }: IViewportToolbarProps) {
  return (
    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
      <div className="flex gap-1 rounded-lg border bg-background p-1 shadow-sm">
        <Button size="icon-sm" variant="ghost" title="Reset camera" onClick={onResetCamera}>
          <RotateCcw />
        </Button>
        <Button size="icon-sm" variant={grid ? "secondary" : "ghost"} title="Toggle grid" onClick={onToggleGrid}>
          <Grid3X3 />
        </Button>
      </div>
      <ViewportHelp />
    </div>
  )
}
