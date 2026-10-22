// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { DEFAULT_ROSBRIDGE_URL } from "@/features/connection/connection.content"
import { useConnectionStore } from "@/features/connection/connection.store"
import { useLinkNotifier } from "@/features/connection/use-link-notifier"
import { INITIAL_ROBOT_STATE } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

vi.mock("sonner", () => ({ toast: { info: vi.fn(), success: vi.fn(), error: vi.fn(), warning: vi.fn() } }))

const setConnected = (connected: boolean) => act(() => useRobotStore.getState().setLink({ connected }))
const connection = () => useConnectionStore.getState()
// Notifications so far, as "kind: title".
const shown = () =>
  (["success", "warning", "info", "error"] as const).flatMap((kind) =>
    vi.mocked(toast[kind]).mock.calls.map(([title]) => `${kind}: ${title}`),
  )

beforeEach(() => {
  vi.clearAllMocks()
  useRobotStore.setState(structuredClone(INITIAL_ROBOT_STATE))
  useConnectionStore.setState({ url: DEFAULT_ROSBRIDGE_URL, enabled: true, attempt: 0, tryingUntil: null, tries: 0 })
  renderHook(() => useLinkNotifier())
})
afterEach(() => cleanup())

describe("useLinkNotifier", () => {
  it("reports a Connect that succeeds, without calling the dropped old link lost", () => {
    setConnected(true)
    vi.clearAllMocks()
    act(() => {
      connection().connect("ws://10.0.0.5:9090")
    })
    setConnected(false) // the feed drops the old link to switch
    setConnected(true)
    act(() => connection().stopTrying())
    expect(shown()).toEqual(["success: Connected to rosbridge"])
  })

  it("reports Not connected once, when the connect window runs out without a link", () => {
    act(() => connection().startTrying())
    expect(shown()).toEqual([])
    act(() => connection().stopTrying())
    expect(shown()).toEqual(["error: Not connected to rosbridge"])
  })

  it("does not report Not connected when Disconnect ends the window", () => {
    act(() => connection().startTrying())
    act(() => connection().disconnect())
    expect(shown()).toEqual([])
  })

  it("warns when a working link drops on its own, and only informs after Disconnect", () => {
    setConnected(true)
    setConnected(false)
    setConnected(true)
    act(() => connection().disconnect())
    setConnected(false)
    expect(shown()).toEqual([
      "success: Connected to rosbridge",
      "success: Connected to rosbridge",
      "warning: rosbridge connection lost",
      "info: Disconnected from rosbridge",
    ])
  })
})
