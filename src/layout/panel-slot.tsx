import { ArrowLeftRight } from "lucide-react"
import { useEffect, useState } from "react"
import { PANEL_DRAG_TYPE, PanelDragContext } from "@/components/shared/panel-drag.context"
import type { GridPanelId, IPanelSlotProps } from "@/layout/app-layout.interface"
import { usePanelLayoutStore } from "@/layout/layout.store"
import { cn } from "@/lib/utils"

// One grid cell holding a panel. Its Panel's header is the drag handle and has a close button (via the context); dropping another
// panel here swaps the two. While a panel is dragged over the cell, an accent-coloured placeholder covers it
// to show where the dragged panel will land.
export function PanelSlot({ id, children, className }: IPanelSlotProps) {
  const swap = usePanelLayoutStore((s) => s.swap)
  const close = usePanelLayoutStore((s) => s.close)
  const [over, setOver] = useState(false)
  // A drag can end anywhere (Esc, dropped outside the grid): always clear the placeholder then.
  useEffect(() => {
    if (!over) return
    const clear = () => setOver(false)
    window.addEventListener("dragend", clear)
    window.addEventListener("drop", clear)
    return () => {
      window.removeEventListener("dragend", clear)
      window.removeEventListener("drop", clear)
    }
  }, [over])
  return (
    <PanelDragContext value={{ id, close: () => close(id) }}>
      <div
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes(PANEL_DRAG_TYPE)) return
          e.preventDefault()
          e.dataTransfer.dropEffect = "move"
          setOver(true)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          const dragged = e.dataTransfer.getData(PANEL_DRAG_TYPE) as GridPanelId
          if (dragged) swap(dragged, id)
        }}
        className={cn("relative flex min-h-0 min-w-0 flex-1", className)}
      >
        {children}
        {over && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-md border-2 border-dashed border-primary bg-primary/20 backdrop-blur-[1px]"
          >
            <span className="flex items-center gap-1.5 rounded-sm bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
              <ArrowLeftRight className="size-3.5" /> Swap here
            </span>
          </div>
        )}
      </div>
    </PanelDragContext>
  )
}
