import type { Theme } from "@/features/theme/theme.interface"

// Must match the key read by the pre-paint script in index.html.
export const THEME_STORAGE_KEY = "ava-ui-theme"

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]
