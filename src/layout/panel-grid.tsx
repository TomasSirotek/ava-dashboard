import { PersistentPanelGroup } from "@/components/shared/persistent-panel-group"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import type { IPanelGridProps } from "@/layout/app-layout.interface"
import { LAYOUT_IDS, MOBILE_PANEL_HEIGHTS } from "@/layout/layout.content"
import { usePanelLayoutStore } from "@/layout/layout.store"
import { gapHandle, resizeHandle } from "@/layout/layout.styles"
import { PanelSlot } from "@/layout/panel-slot"
import { useIsDesktop } from "@/layout/use-is-desktop"
import { cn } from "@/lib/utils"

const handle = cn(resizeHandle, gapHandle, "rounded-full")

// Desktop: three resizable rows, two panels on top, two in the middle and one full-width panel at the bottom
// (the demo timeline by default). Row heights and every split can be dragged and are remembered; a panel dragged
// by its header onto another swaps places with it (order remembered too).
// Smaller screens: the panels stack in the same order at fixed heights.
export function PanelGrid({ panels }: IPanelGridProps) {
  const desktop = useIsDesktop()
  const order = usePanelLayoutStore((s) => s.order)
  const slot = (i: number) => (
    <PanelSlot key={order[i]} id={order[i]} className={desktop ? undefined : MOBILE_PANEL_HEIGHTS[order[i]]}>
      {panels[order[i]]}
    </PanelSlot>
  )
  if (!desktop) return <div className="flex flex-col gap-2 p-2">{order.map((_, i) => slot(i))}</div>
  return (
    <PersistentPanelGroup id={LAYOUT_IDS.rows} orientation="vertical" className="min-h-0 flex-1 p-2">
      <ResizablePanel id="top" defaultSize="42%" minSize="15%" className="flex">
        <PersistentPanelGroup id={LAYOUT_IDS.top} orientation="horizontal">
          <ResizablePanel id="slot-0" defaultSize="66%" minSize="20%" className="flex">
            {slot(0)}
          </ResizablePanel>
          <ResizableHandle className={handle} />
          <ResizablePanel id="slot-1" minSize="20%" className="flex">
            {slot(1)}
          </ResizablePanel>
        </PersistentPanelGroup>
      </ResizablePanel>
      <ResizableHandle className={handle} />
      <ResizablePanel id="middle" defaultSize="32%" minSize="15%" className="flex">
        <PersistentPanelGroup id={LAYOUT_IDS.middle} orientation="horizontal">
          <ResizablePanel id="slot-2" minSize={240} className="flex">
            {slot(2)}
          </ResizablePanel>
          <ResizableHandle className={handle} />
          <ResizablePanel id="slot-3" minSize={240} className="flex">
            {slot(3)}
          </ResizablePanel>
        </PersistentPanelGroup>
      </ResizablePanel>
      <ResizableHandle className={handle} />
      <ResizablePanel id="bottom" defaultSize="26%" minSize={72} className="flex">
        {slot(4)}
      </ResizablePanel>
    </PersistentPanelGroup>
  )
}
