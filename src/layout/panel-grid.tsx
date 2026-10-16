import type { IPanelGridProps } from "@/layout/app-layout.interface"

// Dense grid of panels: 3D view + charts on top, two panels in the middle, a thin full-width row at the bottom.
// Each slot is a Panel that fills its cell; below lg the cells stack.
export function PanelGrid({ primary, side, left, right, footer }: IPanelGridProps) {
  return (
    <div className="min-h-0 flex-1 overflow-auto p-2 max-lg:overflow-visible">
      <div className="grid h-full min-h-[680px] grid-cols-12 grid-rows-[minmax(0,3fr)_minmax(0,2fr)_auto] gap-2 max-lg:flex max-lg:h-auto max-lg:flex-col">
        <div className="col-span-8 flex min-h-0">{primary}</div>
        <div className="col-span-4 flex min-h-0 max-lg:h-96">{side}</div>
        <div className="col-span-6 flex min-h-0">{left}</div>
        <div className="col-span-6 flex min-h-0 max-lg:h-80">{right}</div>
        <div className="col-span-12 flex min-h-0">{footer}</div>
      </div>
    </div>
  )
}
