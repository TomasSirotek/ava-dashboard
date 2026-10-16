import { describe, expect, it } from "vitest"
import type { ControlMode } from "@/features/control/control.interface"
import { selectLocked, useControlStore } from "@/features/control/control.store"

// The joint sliders lock whenever something other than the user drives the arm.
describe("selectLocked", () => {
  it.each<[ControlMode, boolean, boolean]>([
    ["manual", false, false],
    ["manual", true, true],
    ["auto", false, true],
    ["auto", true, true],
  ])("mode %s, e-stop %s -> locked %s", (mode, estop, locked) => {
    expect(selectLocked({ ...useControlStore.getState(), mode, estop })).toBe(locked)
  })
})
