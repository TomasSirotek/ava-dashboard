import { createContext, use } from "react"
import type { IThemeContext } from "@/features/theme/theme.interface"

export const ThemeContext = createContext<IThemeContext>({ theme: "light", setTheme: () => null })

export const useTheme = () => use(ThemeContext)
