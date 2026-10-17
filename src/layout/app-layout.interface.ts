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
  /** Panel shown in each grid slot: top row left and right, middle row left and right, then the full-width bottom row. */
  order: GridPanelId[]
  /** Exchange the slots of two panels (a panel dropped onto another). */
  swap: (a: GridPanelId, b: GridPanelId) => void
}

export interface IPanelSlotProps {
  id: GridPanelId
  children: ReactNode
  className?: string
}
