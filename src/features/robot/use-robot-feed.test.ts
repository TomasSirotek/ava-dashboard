// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { INITIAL_ROBOT_STATE, JOINT_NAMES, LATENCY_PROBE_MS, MOCK_TICK_MS, RECONNECT_MS } from "@/features/robot/robot.content"
import type { IJointStateMsg } from "@/features/robot/robot.interface"
import { attachRos } from "@/features/robot/robot.ros"
import { useRobotStore } from "@/features/robot/robot.store"
import { useRobotFeed } from "@/features/robot/use-robot-feed"

// A fake rosbridge: each `new Ros()` is one connection attempt whose events and messages the test drives.
const fake = vi.hoisted(() => {
  type Handler = () => void
  class FakeRos {
    handlers: Record<string, Handler> = {}
    jointStates: ((msg: unknown) => void) | null = null
    serviceReplies: (() => void)[] = []
    closed = false
    constructor() {
      fake.connections.push(this)
    }
    on(event: string, handler: Handler) {
      this.handlers[event] = handler
    }
    connect() {
      return Promise.resolve()
    }
    close() {
      this.closed = true
    }
    emit(event: string) {
      this.handlers[event]?.()
    }
  }
  return { FakeRos, connections: [] as InstanceType<typeof FakeRos>[] }
})
vi.mock("roslib", () => ({
  Ros: fake.FakeRos,
  Topic: class {
    ros: InstanceType<typeof fake.FakeRos>
    constructor({ ros }: { ros: InstanceType<typeof fake.FakeRos> }) {
      this.ros = ros
    }
    subscribe(cb: (msg: unknown) => void) {
      this.ros.jointStates = cb
    }
  },
  Service: class {
    ros: InstanceType<typeof fake.FakeRos>
    constructor({ ros }: { ros: InstanceType<typeof fake.FakeRos> }) {
      this.ros = ros
    }
    callService(_: unknown, reply: () => void) {
      this.ros.serviceReplies.push(reply)
    }
  },
}))
vi.mock("@/features/robot/robot.ros", () => ({ attachRos: vi.fn() }))

const latest = () => fake.connections.at(-1) as InstanceType<typeof fake.FakeRos>
const link = () => useRobotStore.getState()
const msg: IJointStateMsg = { name: JOINT_NAMES, position: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6], velocity: [], effort: [] }
const receive = (n = 1) => act(() => Array.from({ length: n }, () => latest().jointStates?.(msg)))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date", "performance"] })
  vi.mocked(attachRos).mockClear()
  fake.connections.length = 0
  useRobotStore.setState(structuredClone(INITIAL_ROBOT_STATE))
  renderHook(() => useRobotFeed())
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("useRobotFeed", () => {
  it("simulates and retries while rosbridge is unreachable", () => {
    useRobotStore.setState({ commanded: INITIAL_ROBOT_STATE.commanded.map((v) => v + 10) })
    act(() => latest().emit("close"))
    expect(link()).toMatchObject({ connected: false, source: "mock", rate: null, latency: null })
    const before = link().jointState.position[0]
    act(() => vi.advanceTimersByTime(MOCK_TICK_MS))
    expect(link().jointState.position[0]).toBeGreaterThan(before) // the simulation follows the target
    act(() => vi.advanceTimersByTime(RECONNECT_MS))
    expect(fake.connections).toHaveLength(2)
  })

  it("stays simulated after connecting until the first /joint_states, then goes live from the robot's pose", () => {
    act(() => latest().emit("connection"))
    expect(link()).toMatchObject({ connected: true, source: "mock" })
    expect(attachRos).toHaveBeenLastCalledWith(latest())
    const commandId = link().commandId
    receive()
    expect(link().source).toBe("ros")
    expect(link().jointState.position[0]).toBeCloseTo((0.1 * 180) / Math.PI)
    // The sliders start from the real pose, without sending it back as a command.
    expect(link().commanded).toEqual(link().jointState.position)
    expect(link().commandId).toBe(commandId)
    // The simulation no longer moves the joints.
    const live = link().jointState.position
    act(() => vi.advanceTimersByTime(MOCK_TICK_MS * 5))
    expect(link().jointState.position).toBe(live)
  })

  it("measures the /joint_states rate as messages per probe window and the rosbridge round trip", () => {
    act(() => latest().emit("connection"))
    receive() // first message only opens the window
    act(() => vi.advanceTimersByTime(LATENCY_PROBE_MS / 2))
    receive(10)
    act(() => vi.advanceTimersByTime(LATENCY_PROBE_MS / 2))
    expect(link().rate).toBeCloseTo(5) // 10 messages in 2 s
    act(() => vi.advanceTimersByTime(40))
    act(() => latest().serviceReplies.at(-1)?.())
    expect(link().latency).toBe(40)
  })

  it("drops the link stats and falls back to the simulation when the connection closes", () => {
    act(() => latest().emit("connection"))
    receive()
    act(() => vi.advanceTimersByTime(LATENCY_PROBE_MS))
    act(() => latest().emit("close"))
    expect(link()).toMatchObject({ connected: false, source: "mock", rate: null, latency: null })
    expect(attachRos).toHaveBeenLastCalledWith(null)
  })

  it("ignores events from a connection that was replaced or unmounted", () => {
    const first = latest()
    act(() => first.emit("close"))
    act(() => vi.advanceTimersByTime(RECONNECT_MS))
    act(() => first.emit("connection")) // late event from the dead attempt
    expect(link().connected).toBe(false)
    cleanup()
    expect(latest().closed).toBe(true)
    act(() => latest().emit("connection"))
    expect(link().connected).toBe(false)
  })
})
