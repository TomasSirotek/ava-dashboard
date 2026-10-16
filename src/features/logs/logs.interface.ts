export type LogLevel = "info" | "success" | "warn" | "error"

/** What produced the entry: the session itself, the rosbridge link, the control store (e-stop, mode) or the demo runner. */
export type LogSource = "session" | "link" | "control" | "demo"

export interface ILogEntry {
  id: number
  /** Epoch milliseconds. */
  time: number
  level: LogLevel
  source: LogSource
  message: string
}

/** Level filter of the logs panel: one level, or all of them. */
export type LogLevelFilter = LogLevel | "all"

export interface ILogStore {
  entries: ILogEntry[]
  add: (level: LogLevel, source: LogSource, message: string) => void
}
