import type { LogLevel, LogLevelFilter, LogSource } from "@/features/logs/logs.interface"

// Oldest entries are dropped beyond this many.
export const MAX_LOG_ENTRIES = 200

export const LOG_LEVEL_STYLES: Record<LogLevel, { label: string; className: string }> = {
  info: { label: "INFO", className: "text-sky-500 dark:text-sky-400" },
  success: { label: "OK", className: "text-green-600 dark:text-green-400" },
  warn: { label: "WARN", className: "text-amber-600 dark:text-amber-400" },
  error: { label: "ERROR", className: "text-destructive" },
}

export const LOG_SOURCE_LABELS: Record<LogSource, string> = {
  session: "Session",
  link: "Link",
  control: "Control",
  demo: "Demo",
}

export const LOG_LEVEL_FILTERS: { value: LogLevelFilter; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "info", label: "Info" },
  { value: "success", label: "OK" },
  { value: "warn", label: "Warnings" },
  { value: "error", label: "Errors" },
]
