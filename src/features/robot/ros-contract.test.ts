import { describe, expect, it } from "vitest"
import { JOINT_LIMITS } from "@/features/joints/joints.content"
import { JOINT_NAMES, JOINT_SERVOS, SERVO_STALL_NM, TRAJECTORY_TOPIC } from "@/features/robot/robot.content"

// Contract with the ROS side, read from ava_description through the public/robot symlink.
// The symlink only resolves inside the ava-arm checkout; in a standalone dashboard clone (CI)
// these tests are skipped.
const files = import.meta.glob<string>(["/public/robot/urdf/ava.control.xacro", "/public/robot/config/gazebo_controllers.yaml"], {
  query: "?raw",
  import: "default",
  eager: true,
})
const xacro = files["/public/robot/urdf/ava.control.xacro"]
const controllers = files["/public/robot/config/gazebo_controllers.yaml"]

const property = (name: string) => {
  const match = xacro?.match(new RegExp(`<xacro:property name="${name}" value="([^"]+)"`))
  if (!match) throw new Error(`xacro property ${name} not found`)
  return Number(match[1])
}
const deg = (rad: number) => (rad * 180) / Math.PI

describe.skipIf(xacro === undefined)("joint limits vs ava.control.xacro", () => {
  // Slider ends may be rounded inward by up to 0.1°, never outward (1e-3° slack for the rad -> deg conversion).
  it.each(JOINT_NAMES.map((name, i) => [name, i] as const))("%s slider range sits inside the URDF limit", (name, i) => {
    const lower = deg(property(`${name}_lower`))
    const upper = deg(property(`${name}_upper`))
    const { min, max } = JOINT_LIMITS[i]
    expect(min).toBeGreaterThanOrEqual(lower - 1e-3)
    expect(max).toBeLessThanOrEqual(upper + 1e-3)
    expect(min - lower).toBeLessThanOrEqual(0.1 + 1e-3)
    expect(upper - max).toBeLessThanOrEqual(0.1 + 1e-3)
  })

  it.each(JOINT_NAMES.map((name, i) => [name, i] as const))("%s effort % uses the URDF effort limit as stall torque", (name, i) => {
    expect(SERVO_STALL_NM[JOINT_SERVOS[i]]).toBeCloseTo(property(`${name}_effort`), 3)
  })
})

describe.skipIf(controllers === undefined)("trajectory controller vs gazebo_controllers.yaml", () => {
  it("drives exactly the joints the dashboard commands", () => {
    const block = controllers?.split(/^joint_trajectory_controller:/m)[1] ?? ""
    const joints = [...(block.match(/joints:\n((?:\s+- .+\n)+)/)?.[1].matchAll(/- (\S+)/g) ?? [])].map((m) => m[1])
    expect([...joints].sort()).toEqual([...JOINT_NAMES].sort())
  })

  it("is the controller the command topic points at", () => {
    const name = TRAJECTORY_TOPIC.split("/")[1]
    expect(controllers).toMatch(new RegExp(`^${name}:`, "m"))
  })
})
