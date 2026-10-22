import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export interface IAppLayoutProps {
  header: ReactNode
  /** Status chips above the panel grid. */
  toolbar: ReactNode
  /** The panel grid. */
  main: ReactNode
  /** Right column: controls tabs on top, then details and streams. */
  aside: ReactNode
}

/** The movable panels of the grid. */
export type GridPanelId = "viewport" | "robot-state" | "joints" | "logs" | "timeline"

export interface IPanelGridProps {
  /** Every panel by id; the grid places them in the order stored in the layout store. */
  panels: Record<GridPanelId, ReactNode>
}

export interface IPanelLayoutStore {
  /**
   * Every panel in grid order; the open ones fill the grid two per row (an odd last one takes the full width).
   * A closed panel keeps its place in the list.
   */
  order: GridPanelId[]
  /** Closed panels. */
  hidden: GridPanelId[]
  /** Exchange the places of two panels (a panel dropped onto another). */
  swap: (a: GridPanelId, b: GridPanelId) => void
  close: (id: GridPanelId) => void
  /** Reopen a closed panel as the last one in the grid. */
  open: (id: GridPanelId) => void
}

export interface IGridPanelItem {
  label: string
  icon: LucideIcon
}

export interface IPanelSlotProps {
  id: GridPanelId
  children: ReactNode
  className?: string
}
