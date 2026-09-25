import { useEffect, useState } from "react"
import { THEME_STORAGE_KEY } from "@/features/theme/theme.content"
import { ThemeContext } from "@/features/theme/theme.context"
import type { IThemeProviderProps, Theme } from "@/features/theme/theme.interface"

export function ThemeProvider({ children, defaultTheme = "light", storageKey = THEME_STORAGE_KEY }: IThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme)

  useEffect(() => {
    const root = document.documentElement
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const resolved = theme === "system" ? (mq.matches ? "dark" : "light") : theme
      root.classList.remove("light", "dark")
      root.classList.add(resolved)
    }
    apply()
    if (theme !== "system") return
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [theme])

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next)
    setThemeState(next)
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}
