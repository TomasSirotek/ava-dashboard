// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useControlStore } from "@/features/control/control.store"
import { COMMAND_THROTTLE_MS, HOLD_S, INITIAL_ROBOT_STATE } from "@/features/robot/robot.content"
import { publishJointTarget } from "@/features/robot/robot.ros"
import { useRobotStore } from "@/features/robot/robot.store"
import { useCommandSender } from "@/features/robot/use-command-sender"

vi.mock("@/features/robot/robot.ros", () => ({ publishJointTarget: vi.fn(() => true) }))
const publish = vi.mocked(publishJointTarget)
const sentPoses = () => publish.mock.calls.map(([pose]) => pose)
const drag = (deg: number) => act(() => useRobotStore.getState().setCommanded(0, deg))

beforeEach(() => {
  vi.useFakeTimers()
  publish.mockClear()
  useRobotStore.setState({ ...structuredClone(INITIAL_ROBOT_STATE), source: "ros", connected: true })
  useControlStore.setState({ mode: "manual", estop: false, pad: null })
  renderHook(() => useCommandSender())
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
describe("useCommandSender", () => {
  it("sends the first slider change at once, then throttles and always ends on the latest value", () => {
    drag(10)
    drag(11)
    drag(12)
    expect(sentPoses().map((p) => p[0])).toEqual([10])
    act(() => vi.advanceTimersByTime(COMMAND_THROTTLE_MS))
    expect(sentPoses().map((p) => p[0])).toEqual([10, 12])
    act(() => vi.advanceTimersByTime(COMMAND_THROTTLE_MS * 5))
    expect(publish).toHaveBeenCalledTimes(2)
  })

  it("sends nothing while offline: the built-in simulation follows the target itself", () => {
    useRobotStore.setState({ source: "mock" })
    drag(10)
    act(() => vi.advanceTimersByTime(COMMAND_THROTTLE_MS * 2))
    expect(publish).not.toHaveBeenCalled()
  })

  it("on e-stop drops the pending command and holds the arm where it is", () => {
    drag(10)
    drag(20) // pending, would go out after the throttle window
    act(() => useControlStore.getState().toggleEstop())
    const here = useRobotStore.getState().jointState.position
    expect(publish).toHaveBeenLastCalledWith(here, HOLD_S)
    expect(useRobotStore.getState().commanded).toEqual(here)
    act(() => vi.advanceTimersByTime(COMMAND_THROTTLE_MS * 5))
    expect(sentPoses().map((p) => p[0])).toEqual([10, here[0]])
  })

  it("sends no commands while the e-stop is engaged", () => {
    act(() => useControlStore.getState().toggleEstop())
    publish.mockClear()
    drag(30)
    act(() => vi.advanceTimersByTime(COMMAND_THROTTLE_MS * 2))
    expect(publish).not.toHaveBeenCalled()
  })
})
