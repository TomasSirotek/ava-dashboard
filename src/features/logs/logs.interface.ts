export type LogLevel = "info" | "success" | "warn" | "error"

export interface ILogEntry {
  id: number
  /** Epoch milliseconds. */
  time: number
  level: LogLevel
  message: string
}

export interface ILogStore {
  entries: ILogEntry[]
  add: (level: LogLevel, message: string) => void
}
