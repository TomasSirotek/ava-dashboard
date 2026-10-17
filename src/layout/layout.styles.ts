// Drag handle between resizable panels: invisible until hovered or dragged, then tinted with the accent.
// The library's own hit area (wider than the line) makes it easy to grab, also on touch.
export const resizeHandle =
  "transition-colors hover:bg-primary/60 data-[separator=active]:bg-primary data-[separator=focus]:bg-primary focus-visible:ring-0"

// Gap between grid panels that doubles as the handle (8 px, the same gap the panels had before).
export const gapHandle = "w-2 bg-transparent aria-[orientation=horizontal]:h-2 aria-[orientation=horizontal]:w-full"
