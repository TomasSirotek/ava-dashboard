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
const start = (id: DemoId) => act(() => useDemoStore.getState().start(id))
// Time one step occupies: the move itself, the settle pause, then the step's hold.
const finishStep = (id: DemoId, step: number) =>
  act(() => vi.advanceTimersByTime((moveDuration(useMotionStore.getState()) + DEMO_SETTLE_S + DEMOS[id].steps[step].hold) * 1000))

beforeEach(() => {
  vi.useFakeTimers()
  useRobotStore.setState(structuredClone(INITIAL_ROBOT_STATE))
  useMotionStore.setState({ target: "sim", ...MOTION_DEFAULTS })
  useControlStore.setState({ mode: "auto", estop: false, pad: null })
  useDemoStore.setState({ running: null, step: 0, run: null })
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

  it.each([
    ["the e-stop is engaged", () => useControlStore.getState().toggleEstop()],
    ["the mode leaves Automatic", () => useControlStore.getState().setMode("manual")],
  ])("stops and moves the arm no further when %s", (_, interrupt) => {
    start("wave")
    act(interrupt)
    expect(running()).toBeNull()
    const pose = commanded()
    act(() => vi.advanceTimersByTime(60_000))
    expect(commanded()).toEqual(pose)
  })
})
