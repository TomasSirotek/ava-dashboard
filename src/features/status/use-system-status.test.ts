import { describe, expect, it } from "vitest"
import type { SystemStatus } from "@/features/status/status.interface"
import { getSystemStatus } from "@/features/status/use-system-status"

// "All systems nominal" must only show while real /joint_states arrive and the e-stop is off.
describe("getSystemStatus", () => {
  it.each<[boolean, boolean, "ros" | "mock", SystemStatus]>([
    [false, true, "ros", "nominal"],
    [false, true, "mock", "no-data"],
    [false, false, "mock", "simulated"],
    [true, true, "ros", "estop"],
    [true, false, "mock", "estop"],
  ])("e-stop %s, connected %s, source %s -> %s", (estop, connected, source, status) => {
    expect(getSystemStatus(estop, { connected, source })).toBe(status)
  })
})
