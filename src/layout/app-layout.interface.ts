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

export interface IPanelGridProps {
  /** Top row: large 3D view and the charts next to it. */
  primary: ReactNode
  side: ReactNode
  /** Middle row, left and right. */
  left: ReactNode
  right: ReactNode
  /** Thin full-width bottom row. */
  footer: ReactNode
}
