import { create } from "zustand"
import { SESSION_ID } from "@/features/header/header.content"
import { MAX_LOG_ENTRIES } from "@/features/logs/logs.content"
import type { ILogStore } from "@/features/logs/logs.interface"

let nextId = 0

export const useLogStore = create<ILogStore>()((set) => ({
  entries: [{ id: nextId++, time: Date.now(), level: "info", message: `Session #${SESSION_ID} started` }],
  add: (level, message) =>
    set((s) => ({ entries: [...s.entries, { id: nextId++, time: Date.now(), level, message }].slice(-MAX_LOG_ENTRIES) })),
}))
