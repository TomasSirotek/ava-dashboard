import type { ReactNode } from "react"

export interface IAppLayoutProps {
  header: ReactNode
  /** Left side panel (telemetry). */
  left: ReactNode
  main: ReactNode
  /** Right side panel (navigation tabs). */
  aside: ReactNode
}
