import { describe, expect, it } from "vitest"
import type { SystemStatus } from "@/features/status/status.interface"
import { getSystemStatus } from "@/features/status/use-system-status"

// "All systems nominal" must only show while real /joint_states arrive and the e-stop is off.
describe("getSystemStatus", () => {
  it.each<[boolean, boolean, "ros" | "mock", boolean, SystemStatus]>([
    [false, true, "ros", false, "nominal"],
    [false, true, "mock", false, "no-data"],
    [false, false, "mock", true, "connecting"],
    [false, false, "mock", false, "simulated"],
    [true, true, "ros", false, "estop"],
    [true, false, "mock", true, "estop"],
  ])("e-stop %s, connected %s, source %s, trying %s -> %s", (estop, connected, source, trying, status) => {
    expect(getSystemStatus(estop, { connected, source }, trying)).toBe(status)
  })
})
