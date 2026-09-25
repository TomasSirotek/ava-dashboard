import type { ReactNode } from "react"

export interface INavItem {
  value: string
  label: string
  content: ReactNode
  /** Extra classes for the tab panel. */
  className?: string
}

export interface INavigationStore {
  /** Value of the open sidebar tab. */
  active: string
  setActive: (value: string) => void
  /** Switches to a tab and scrolls the sidebar into view. */
  open: (value: string) => void
}
