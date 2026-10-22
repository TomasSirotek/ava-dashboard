import { LayoutGrid } from "lucide-react"
import { Fragment } from "react"
import { PersistentPanelGroup } from "@/components/shared/persistent-panel-group"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import type { GridPanelId, IPanelGridProps } from "@/layout/app-layout.interface"
import { FULL_GRID_SHAPE, GRID_ROW_IDS, GRID_ROW_SIZES, LAYOUT_IDS, MOBILE_PANEL_HEIGHTS } from "@/layout/layout.content"
import { gridRows, usePanelLayoutStore } from "@/layout/layout.store"
import { gapHandle, resizeHandle } from "@/layout/layout.styles"
import { PanelSlot } from "@/layout/panel-slot"
import { useIsDesktop } from "@/layout/use-is-desktop"
import { cn } from "@/lib/utils"

const handle = cn(resizeHandle, gapHandle, "rounded-full")

// Desktop: the open panels fill the grid two per row in their stored order; an odd last panel takes the full width
// (by default: 3D view and robot state, joints and logs, then the demo timeline). Closing a panel reflows the rest.
// Row heights and splits can be dragged and are remembered (row heights per grid shape); a panel dragged by its header onto
// another swaps places with it.
// Smaller screens: the open panels stack in the same order at fixed heights.
export function PanelGrid({ panels }: IPanelGridProps) {
  const desktop = useIsDesktop()
  const order = usePanelLayoutStore((s) => s.order)
  const hidden = usePanelLayoutStore((s) => s.hidden)
  const rows = gridRows(order, hidden)
  const slot = (id: GridPanelId) => (
    <PanelSlot key={id} id={id} className={desktop ? undefined : MOBILE_PANEL_HEIGHTS[id]}>
      {panels[id]}
    </PanelSlot>
  )
  if (rows.length === 0)
    return (
      <div className="grid min-h-0 flex-1 place-items-center p-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <LayoutGrid className="size-4" /> All panels are closed. Open one from the Panels menu.
        </p>
      </div>
    )
  if (!desktop) return <div className="flex flex-col gap-2 p-2">{rows.flat().map(slot)}</div>
  // A new shape mounts a fresh group with its own saved sizes.
  const shape = rows.map((row) => row.length).join("")
  return (
    <PersistentPanelGroup
      key={shape}
      id={shape === FULL_GRID_SHAPE ? LAYOUT_IDS.rows : `${LAYOUT_IDS.rows}-${shape}`}
      orientation="vertical"
      className="min-h-0 flex-1 p-2"
    >
      {rows.map((row, r) => (
        <Fragment key={GRID_ROW_IDS[r]}>
          {r > 0 && <ResizableHandle className={handle} />}
          <ResizablePanel
            id={GRID_ROW_IDS[r]}
            defaultSize={GRID_ROW_SIZES[shape][r]}
            minSize={row.length === 1 ? 72 : "15%"}
            className="flex"
          >
            {row.length === 1 ? (
              slot(row[0])
            ) : (
              <PersistentPanelGroup id={LAYOUT_IDS.rowSplits[r]} orientation="horizontal">
                <ResizablePanel id={`slot-${r * 2}`} defaultSize={r === 0 ? "66%" : "50%"} minSize={240} className="flex">
                  {slot(row[0])}
                </ResizablePanel>
                <ResizableHandle className={handle} />
                <ResizablePanel id={`slot-${r * 2 + 1}`} minSize={240} className="flex">
                  {slot(row[1])}
                </ResizablePanel>
              </PersistentPanelGroup>
            )}
          </ResizablePanel>
        </Fragment>
      ))}
    </PersistentPanelGroup>
  )
}
