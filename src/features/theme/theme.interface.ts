import type { ReactNode } from "react"

export type Theme = "dark" | "light" | "system"

export interface IThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export interface IThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}
