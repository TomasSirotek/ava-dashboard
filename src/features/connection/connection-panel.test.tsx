// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CONNECT_WINDOW_MS, DEFAULT_ROSBRIDGE_URL } from "@/features/connection/connection.content"
import { useConnectionStore } from "@/features/connection/connection.store"
import { ConnectionPanel } from "@/features/connection/connection-panel"
import { INITIAL_ROBOT_STATE } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date"] })
  useRobotStore.setState(structuredClone(INITIAL_ROBOT_STATE))
  useConnectionStore.setState({ url: DEFAULT_ROSBRIDGE_URL, enabled: true, attempt: 0, tryingUntil: null, tries: 0 })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("ConnectionPanel", () => {
  it("while trying: shows Connecting, the attempt, the time left and a filling bar; Connect is busy, Stop is offered", () => {
    useConnectionStore.setState({ tryingUntil: Date.now() + CONNECT_WINDOW_MS, tries: 2 })
    render(<ConnectionPanel />)
    act(() => vi.advanceTimersByTime(10_000))
    expect(screen.getAllByText("Connecting…").length).toBeGreaterThan(0)
    expect(screen.getByText("Attempt 2 · gives up in 20 s")).toBeTruthy()
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("33")
    expect(screen.getByRole("button", { name: /Connecting/ }).hasAttribute("disabled")).toBe(true)
    expect(screen.getByRole("button", { name: "Stop" })).toBeTruthy()
  })

  it("after the window ran out: shows Not connected with what to do, and Connect is available again", () => {
    render(<ConnectionPanel />)
    expect(screen.getByText("Not connected")).toBeTruthy()
    expect(screen.getByRole("alert").textContent).toContain("rosbridge_websocket_launch.xml")
    expect(screen.queryByRole("progressbar")).toBeNull()
    expect(screen.getByRole("button", { name: "Connect" }).hasAttribute("disabled")).toBe(false)
  })

  it("after Disconnect: shows Disconnected without the warning", () => {
    useConnectionStore.setState({ enabled: false })
    render(<ConnectionPanel />)
    expect(screen.getByText("Disconnected")).toBeTruthy()
    expect(screen.queryByRole("alert")).toBeNull()
  })
})
