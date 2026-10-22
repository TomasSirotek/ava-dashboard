// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useControlStore } from "@/features/control/control.store"
import { DEMO_SETTLE_S, DEMOS } from "@/features/demos/demos.content"
import type { DemoId } from "@/features/demos/demos.interface"
import { useDemoStore } from "@/features/demos/demos.store"
import { useDemoRunner } from "@/features/demos/use-demo-runner"
import { MOTION_DEFAULTS } from "@/features/motion/motion.content"
import { moveDuration, useMotionStore } from "@/features/motion/motion.store"
import { INITIAL_ROBOT_STATE } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

const commanded = () => useRobotStore.getState().commanded
const running = () => useDemoStore.getState().running
const start = (id: DemoId) =>
  act(() => {
    useDemoStore.getState().select(id)
    useDemoStore.getState().start()
  })
// Time one step occupies: the move itself, the settle pause, then the step's hold.
const finishStep = (id: DemoId, step: number) =>
  act(() => vi.advanceTimersByTime((moveDuration(useMotionStore.getState()) + DEMO_SETTLE_S + DEMOS[id].steps[step].hold) * 1000))

beforeEach(() => {
  vi.useFakeTimers()
  useRobotStore.setState(structuredClone(INITIAL_ROBOT_STATE))
  useMotionStore.setState({ target: "sim", ...MOTION_DEFAULTS })
  useControlStore.setState({ mode: "auto", estop: false, pad: null })
  useDemoStore.setState({ selected: "wave", loop: true, running: null, step: 0, run: null })
  renderHook(() => useDemoRunner())
})
afterEach(() => {
  act(() => useDemoStore.getState().stop())
  cleanup()
  vi.useRealTimers()
})

describe("useDemoRunner", () => {
  it("plays a one-shot demo step by step, then stops", () => {
    start("home-park")
    expect(commanded()).toEqual(DEMOS["home-park"].steps[0].pose)
    finishStep("home-park", 0)
    expect(commanded()).toEqual(DEMOS["home-park"].steps[1].pose)
    finishStep("home-park", 1)
    expect(running()).toBeNull()
  })

  it("loops a looping demo back to its first step", () => {
    start("wave")
    DEMOS.wave.steps.forEach((_, i) => {
      finishStep("wave", i)
    })
    expect(running()).toBe("wave")
    expect(useDemoStore.getState().step).toBe(0)
    expect(commanded()).toEqual(DEMOS.wave.steps[0].pose)
  })

  it("pause holds the arm where it is and stops stepping; resume repeats the interrupted step", () => {
    start("home-park")
    useRobotStore.setState((s) => ({ jointState: { ...s.jointState, position: [1, 2, 3, 4, 5, 6] } }))
    act(() => useDemoStore.getState().pause())
    expect(commanded()).toEqual([1, 2, 3, 4, 5, 6])
    act(() => vi.advanceTimersByTime(60_000))
    expect(commanded()).toEqual([1, 2, 3, 4, 5, 6])
    expect(useDemoStore.getState().step).toBe(0)
    act(() => useDemoStore.getState().resume())
    expect(commanded()).toEqual(DEMOS["home-park"].steps[0].pose)
    finishStep("home-park", 0)
    expect(commanded()).toEqual(DEMOS["home-park"].steps[1].pose)
  })

  it("follows the transport's loop setting, not the demo's default", () => {
    act(() => useDemoStore.getState().select("wave"))
    act(() => useDemoStore.getState().setLoop(false))
    act(() => useDemoStore.getState().start())
    DEMOS.wave.steps.forEach((_, i) => {
      finishStep("wave", i)
    })
    expect(running()).toBeNull()
    expect(useDemoStore.getState().run?.status).toBe("finished")
  })

  it.each([
    ["Stop is pressed", () => useDemoStore.getState().stop()],
    ["the e-stop is engaged", () => useControlStore.getState().toggleEstop()],
    ["the mode leaves Automatic", () => useControlStore.getState().setMode("manual")],
  ])("stops, holding the arm where it is, when %s", (_, interrupt) => {
    start("wave")
    useRobotStore.setState((s) => ({ jointState: { ...s.jointState, position: [1, 2, 3, 4, 5, 6] } }))
    act(interrupt)
    expect(running()).toBeNull()
    const pose = commanded()
    expect(pose).toEqual([1, 2, 3, 4, 5, 6])
    act(() => vi.advanceTimersByTime(60_000))
    expect(commanded()).toEqual(pose)
  })
})
