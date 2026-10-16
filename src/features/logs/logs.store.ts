import { create } from "zustand"
import { SESSION_ID } from "@/features/header/header.content"
import { LOG_SOURCE_LABELS, MAX_LOG_ENTRIES } from "@/features/logs/logs.content"
import type { ILogEntry, ILogStore, LogLevelFilter } from "@/features/logs/logs.interface"

let nextId = 0

export const useLogStore = create<ILogStore>()((set) => ({
  entries: [{ id: nextId++, time: Date.now(), level: "info", source: "session", message: `Session #${SESSION_ID} started` }],
  add: (level, source, message) =>
    set((s) => ({ entries: [...s.entries, { id: nextId++, time: Date.now(), level, source, message }].slice(-MAX_LOG_ENTRIES) })),
}))

/** Entries matching the level filter whose message or source contains the query (case-insensitive). */
export const filterLogs = (entries: ILogEntry[], level: LogLevelFilter, query: string) => {
  const q = query.trim().toLowerCase()
  return entries.filter(
    (e) =>
      (level === "all" || e.level === level) &&
      (q === "" || e.message.toLowerCase().includes(q) || LOG_SOURCE_LABELS[e.source].toLowerCase().includes(q)),
  )
}
