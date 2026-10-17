import { createContext } from "react"
import type { IPanelDrag } from "@/components/shared/shared.interface"

// dataTransfer type of a dragged panel; its value is the panel id.
export const PANEL_DRAG_TYPE = "application/x-ava-panel"

// Set by the grid slot around a Panel: makes the Panel's header a drag handle carrying `id`. Panels outside
// the grid (none today) get null and stay fixed.
export const PanelDragContext = createContext<IPanelDrag | null>(null)
