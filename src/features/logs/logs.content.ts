import type { LogLevel } from "@/features/logs/logs.interface"

// Oldest entries are dropped beyond this many.
export const MAX_LOG_ENTRIES = 200

export const LOG_LEVEL_STYLES: Record<LogLevel, { label: string; className: string }> = {
  info: { label: "INFO", className: "text-sky-500 dark:text-sky-400" },
  success: { label: "OK", className: "text-green-600 dark:text-green-400" },
  warn: { label: "WARN", className: "text-amber-600 dark:text-amber-400" },
  error: { label: "ERROR", className: "text-destructive" },
}
