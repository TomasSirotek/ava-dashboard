// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useControlStore } from "@/features/control/control.store"
import { useDemoStore } from "@/features/demos/demos.store"
import { useLogStore } from "@/features/logs/logs.store"
import { useSystemLog } from "@/features/logs/use-system-log"
import { INITIAL_ROBOT_STATE } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

vi.mock("sonner", () => ({ toast: { info: vi.fn(), success: vi.fn(), error: vi.fn(), warning: vi.fn() } }))

// Entries added after the session entry, as [level, source, message].
const logged = () => useLogStore.getState().entries.map((e) => [e.level, e.source, e.message])

beforeEach(() => {
  useLogStore.setState({ entries: [] })
  useRobotStore.setState(structuredClone(INITIAL_ROBOT_STATE))
  useControlStore.setState({ mode: "manual", estop: false, pad: null })
  useDemoStore.setState({ running: null, step: 0, run: null })
  renderHook(() => useSystemLog())
})
afterEach(() => cleanup())

describe("useSystemLog", () => {
  it("logs the link going up, live data arriving and the link dropping back to the simulation", () => {
    act(() => useRobotStore.getState().setLink({ connected: true }))
    act(() => useRobotStore.getState().setLink({ source: "ros" }))
    act(() => useRobotStore.getState().setLink({ connected: false, source: "mock" }))
    expect(logged().map(([level, source]) => `${level}/${source}`)).toEqual(["info/link", "success/link", "warn/link", "warn/link"])
  })

  it("logs the e-stop as an error and its release", () => {
    act(() => useControlStore.getState().toggleEstop())
    act(() => useControlStore.getState().toggleEstop())
    expect(logged()).toEqual([
      ["error", "control", "Emergency stop engaged"],
      ["success", "control", "E-stop released"],
    ])
  })

  it("tells a finished demo from a stopped one", () => {
    act(() => useDemoStore.getState().start("home-park"))
    act(() => useDemoStore.getState().finish())
    act(() => useDemoStore.getState().start("wave"))
    act(() => useDemoStore.getState().stop())
    expect(logged()).toEqual([
      ["info", "demo", "Demo started: Home & park"],
      ["success", "demo", "Demo finished: Home & park"],
      ["info", "demo", "Demo started: Wave"],
      ["info", "demo", "Demo stopped: Wave"],
    ])
  })
})
