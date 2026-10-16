import { describe, expect, it } from "vitest"
import type { ILogEntry } from "@/features/logs/logs.interface"
import { filterLogs } from "@/features/logs/logs.store"

const entries: ILogEntry[] = [
  { id: 0, time: 0, level: "info", source: "session", message: "Session #ABC123 started" },
  { id: 1, time: 1, level: "warn", source: "link", message: "rosbridge unreachable, simulating" },
  { id: 2, time: 2, level: "error", source: "control", message: "Emergency stop engaged" },
  { id: 3, time: 3, level: "info", source: "demo", message: "Demo started: Wave" },
]
const ids = (level: Parameters<typeof filterLogs>[1], query: string) => filterLogs(entries, level, query).map((e) => e.id)

describe("filterLogs", () => {
  it("shows everything with no level and an empty or blank query", () => {
    expect(ids("all", "")).toEqual([0, 1, 2, 3])
    expect(ids("all", "   ")).toEqual([0, 1, 2, 3])
  })

  it("narrows to one level", () => {
    expect(ids("info", "")).toEqual([0, 3])
    expect(ids("error", "")).toEqual([2])
  })

  it("matches the message or the source label, ignoring case", () => {
    expect(ids("all", "EMERGENCY")).toEqual([2])
    expect(ids("all", "link")).toEqual([1])
  })

  it("combines level and search", () => {
    expect(ids("info", "demo")).toEqual([3])
    expect(ids("warn", "demo")).toEqual([])
  })
})
