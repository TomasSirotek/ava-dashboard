import type { GridPanelId } from "@/layout/app-layout.interface"

// Below this width (Tailwind's lg) the page stacks in one scrolling column; at and above it the panels are resizable.
export const DESKTOP_QUERY = "(min-width: 64rem)"

// localStorage keys of the resizable groups; each remembers its panel sizes between page loads.
export const LAYOUT_IDS = {
  page: "ava-layout-page",
  rows: "ava-layout-rows",
  top: "ava-layout-row-top",
  middle: "ava-layout-row-middle",
} as const

// localStorage key of the panel order (which panel sits in which slot).
export const PANEL_ORDER_KEY = "ava-layout-panel-order"

// Slots: top row left and right, middle row left and right, full-width bottom row.
export const DEFAULT_PANEL_ORDER: GridPanelId[] = ["viewport", "robot-state", "joints", "logs", "timeline"]

// Height of each panel when the page stacks on small screens.
export const MOBILE_PANEL_HEIGHTS: Record<GridPanelId, string> = {
  viewport: "h-[60svh] min-h-80",
  "robot-state": "h-96",
  joints: "h-80",
  logs: "h-80",
  timeline: "h-96",
}
