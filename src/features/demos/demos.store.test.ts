import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { IDemoRun, IDemoStep } from "@/features/demos/demos.interface"
import { buildTimeline, formatSeconds, stepKind, timeTicks, useDemoStore } from "@/features/demos/demos.store"

vi.mock("sonner", () => ({ toast: { info: vi.fn(), success: vi.fn() } }))

const T0 = 1_000_000
const at = (s: number) => T0 + s * 1000
const step = (label: string, pose: number[], hold = 1): IDemoStep => ({ label, pose, hold })
// Three steps: move, gripper only, move. Planned move 2 s, holds 1 s -> 3 s per step, 9 s per cycle.
const STEPS = [step("Reach", [10, 0, 0, 0, 0, 0]), step("Grip", [10, 0, 0, 0, 0, 10]), step("Back", [0, 0, 0, 0, 0, 10])]
const MOVE_S = 2
const run = (steps: IDemoRun["steps"], status: IDemoRun["status"] = "running"): IDemoRun => ({
  demo: "wave",
  cycle: 1,
  startedAt: T0,
  steps,
  status,
})

describe("stepKind", () => {
  it("is gripper only when nothing but the gripper changes", () => {
    expect(stepKind([1, 2, 3, 4, 5, 0], [1, 2, 3, 4, 5, 10])).toBe("gripper")
    expect(stepKind([1, 2, 3, 4, 5, 0], [1, 2, 3, 4, 6, 10])).toBe("motion")
    expect(stepKind([1, 2, 3, 4, 5, 0], [1, 2, 3, 4, 5, 0])).toBe("motion")
    expect(stepKind(undefined, [1, 2, 3, 4, 5, 0])).toBe("motion")
  })
})

describe("buildTimeline", () => {
  it("places executed steps at their real times, the running one up to now, the rest planned after it", () => {
    const t = buildTimeline(
      run([
        { start: at(0), end: at(4) },
        { start: at(4), end: null },
      ]),
      STEPS,
      false,
      at(5),
      MOVE_S,
    )
    expect(t.rows.map((r) => [r.state, r.kind, r.start, r.moveEnd, r.end])).toEqual([
      ["done", "motion", 0, 2, 4], // took 4 s instead of the planned 3
      ["active", "gripper", 4, 5, 5], // 1 s in, still moving
      ["planned", "motion", 7, 9, 10], // after the running step's planned end (4 + 3)
    ])
    expect(t.elapsed).toBe(5)
    expect(t.total).toBe(10)
  })

  it("marks steps a stopped run never reached as skipped and freezes elapsed at the stop", () => {
    const t = buildTimeline(run([{ start: at(0), end: at(1.5) }], "stopped"), STEPS, false, at(60), MOVE_S)
    expect(t.rows.map((r) => r.state)).toEqual(["done", "skipped", "skipped"])
    expect(t.rows[0]).toMatchObject({ moveEnd: 1.5, end: 1.5 }) // stopped mid-move: no hold drawn
    expect(t.elapsed).toBe(1.5)
  })

  it("treats a looping demo's first step as following its last", () => {
    const loopSteps = [step("Open", [0, 0, 0, 0, 0, 0]), step("Close", [0, 0, 0, 0, 0, 10])]
    const rows = buildTimeline(run([]), loopSteps, true, at(0), MOVE_S).rows
    expect(rows.map((r) => r.kind)).toEqual(["gripper", "gripper"])
  })
})

describe("timeTicks / formatSeconds", () => {
  it("picks the smallest spacing that gives at most 6 intervals", () => {
    expect(timeTicks(9)).toEqual([0, 2, 4, 6, 8])
    expect(timeTicks(31.3)).toEqual([0, 10, 20, 30])
    expect(timeTicks(200)).toEqual([0, 60, 120, 180])
  })

  it("formats m:ss", () => {
    expect(formatSeconds(0)).toBe("0:00")
    expect(formatSeconds(75.9)).toBe("1:15")
  })
})

describe("demo run trace", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(T0)
    useDemoStore.setState({ running: null, step: 0, run: null })
  })
  afterEach(() => vi.useRealTimers())

  it("records step start and end times and starts a new cycle when a loop wraps", () => {
    const { start, beginStep } = useDemoStore.getState()
    start("wave")
    beginStep(0)
    vi.setSystemTime(at(2))
    beginStep(1)
    vi.setSystemTime(at(5))
    expect(useDemoStore.getState().run?.steps).toEqual([
      { start: at(0), end: at(2) },
      { start: at(2), end: null },
    ])
    beginStep(0)
    expect(useDemoStore.getState().run).toMatchObject({ cycle: 2, startedAt: at(5), steps: [{ start: at(5), end: null }] })
  })

  it("keeps the trace after the run ends, closing the open step, as finished or stopped", () => {
    const { start, beginStep, finish, stop } = useDemoStore.getState()
    start("home-park")
    beginStep(0)
    vi.setSystemTime(at(3))
    finish()
    expect(useDemoStore.getState()).toMatchObject({ running: null, run: { status: "finished", steps: [{ start: at(0), end: at(3) }] } })
    start("wave")
    beginStep(0)
    vi.setSystemTime(at(4))
    stop()
    expect(useDemoStore.getState().run).toMatchObject({ demo: "wave", status: "stopped", steps: [{ start: at(3), end: at(4) }] })
  })
})
