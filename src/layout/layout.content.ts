import { Activity, Box, ListOrdered, ScrollText, Table2 } from "lucide-react"
import type { GridPanelId, IGridPanelItem } from "@/layout/app-layout.interface"

// Below this width (Tailwind's lg) the page stacks in one scrolling column; at and above it the panels are resizable.
export const DESKTOP_QUERY = "(min-width: 64rem)"

// localStorage keys of the resizable groups; each remembers its panel sizes between page loads. The grid's row group
// is saved per grid shape (`rows` for the full grid, `rows-<shape>` otherwise); `rowSplits` are the two-panel rows
// by row index.
export const LAYOUT_IDS = {
  page: "ava-layout-page",
  rows: "ava-layout-rows",
  rowSplits: ["ava-layout-row-top", "ava-layout-row-middle", "ava-layout-row-bottom"],
} as const

// Panel ids of the grid's rows, top to bottom.
export const GRID_ROW_IDS = ["top", "middle", "bottom"] as const

// Default row heights by grid shape (panels per row, e.g. "21" = two panels, then one). A lone panel in the last row
// is kept short: by default it is the full-width demo timeline.
export const FULL_GRID_SHAPE = "221"
export const GRID_ROW_SIZES: Record<string, string[]> = {
  "1": ["100%"],
  "2": ["100%"],
  "21": ["64%", "36%"],
  "22": ["55%", "45%"],
  "221": ["42%", "32%", "26%"],
}

// localStorage key of the panel order and the closed panels.
export const PANEL_ORDER_KEY = "ava-layout-panel-order"

// Default grid: top row left and right, middle row left and right, full-width bottom row.
export const DEFAULT_PANEL_ORDER: GridPanelId[] = ["viewport", "robot-state", "joints", "logs", "timeline"]

// Name and icon of each grid panel in the toolbar's Panels menu.
export const GRID_PANELS: Record<GridPanelId, IGridPanelItem> = {
  viewport: { label: "3D view", icon: Box },
  "robot-state": { label: "Robot state", icon: Activity },
  joints: { label: "Joints", icon: Table2 },
  logs: { label: "Logs", icon: ScrollText },
  timeline: { label: "Demo timeline", icon: ListOrdered },
}

// Height of each panel when the page stacks on small screens.
export const MOBILE_PANEL_HEIGHTS: Record<GridPanelId, string> = {
  viewport: "h-[60svh] min-h-80",
  "robot-state": "h-96",
  joints: "h-80",
  logs: "h-80",
  timeline: "h-96",
}
