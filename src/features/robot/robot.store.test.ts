import { beforeEach, describe, expect, it } from "vitest"
import { INITIAL_ROBOT_STATE, JOINT_NAMES, MOCK_TICK_MS } from "@/features/robot/robot.content"
import { selectReadout, useRobotStore } from "@/features/robot/robot.store"

// /joint_states arrives in ROS units and in whatever joint order the publisher uses.
const msg = (name: string[], position: number[], effort: number[] = []) => ({ name, position, velocity: position.map(() => 0), effort })
const state = () => useRobotStore.getState().jointState

beforeEach(() => useRobotStore.setState(structuredClone(INITIAL_ROBOT_STATE)))

describe("applyJointState", () => {
  it("reorders by joint name and converts radians to degrees", () => {
    const reversed = [...JOINT_NAMES].reverse()
    useRobotStore.getState().applyJointState(msg(reversed, [0.1, -0.2, 0.3, Math.PI / 4, -Math.PI / 2, Math.PI / 6]))
    // reversed order: gripper, wrist_roll, wrist_flex, elbow_flex, shoulder_lift, shoulder_pan
    const expected = [30, -90, 45, 0.3, -0.2, 0.1].map((v, i) => (i < 3 ? v : (v * 180) / Math.PI))
    state().position.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 6))
  })

  it("shows effort as % of the joint's servo stall torque, sign dropped, capped at 100", () => {
    // MG996R stall 1.079 N·m (shoulder_pan, elbow_flex), SG90 0.157 N·m (wrist_flex, gripper)
    useRobotStore.getState().applyJointState(msg(JOINT_NAMES, [0, 0, 0, 0, 0, 0], [-0.5395, 0, 5, 0.0785, 0, -0.157]))
    const effort = state().effort ?? []
    expect(effort[0]).toBeCloseTo(50)
    expect(effort[2]).toBe(100)
    expect(effort[3]).toBeCloseTo(50)
    expect(effort[5]).toBeCloseTo(100)
  })

  it("keeps the last value of joints missing from the message and ignores unknown joints", () => {
    const before = state().position
    useRobotStore.getState().applyJointState(msg(["elbow_flex", "camera_tilt"], [Math.PI / 2, 1]))
    const after = state().position
    expect(after[2]).toBeCloseTo(90)
    for (const i of [0, 1, 3, 4, 5]) expect(after[i]).toBe(before[i])
  })

  it("has no effort when the publisher sends none (the real arm), so no torque is shown", () => {
    useRobotStore.getState().applyJointState(msg(JOINT_NAMES, [0, 0, 0, 0, 0, 0], [0.5, 0.5, 0.5, 0.1, 0.1, 0.1]))
    useRobotStore.getState().applyJointState(msg(JOINT_NAMES, [0, 0, 0, 0, 0, 0]))
    expect(state().effort).toBeNull()
  })
})

// The velocity chart plots this in simulation, so it must match how far the joints actually moved.
describe("tick (built-in simulation)", () => {
  it("reports velocity as the position change per tick, and joints at their target as still", () => {
    useRobotStore.setState({ commanded: [...INITIAL_ROBOT_STATE.jointState.position] })
    useRobotStore.setState((s) => ({ commanded: s.commanded.map((v, i) => (i === 0 ? v + 10 : v)) }))
    const before = state().position
    useRobotStore.getState().tick()
    const { position, velocity } = state()
    expect(position[0]).toBeGreaterThan(before[0])
    expect(velocity[0]).toBeCloseTo((position[0] - before[0]) / (MOCK_TICK_MS / 1000), 9)
    expect(velocity.slice(1)).toEqual([0, 0, 0, 0, 0])
    expect(position.slice(1)).toEqual(before.slice(1))
  })
})

// The real arm cannot measure its joints: its angles must never be labelled as measured.
describe("selectReadout", () => {
  const apply = (effort: number[]) => {
    useRobotStore.setState({ source: "ros" })
    useRobotStore.getState().applyJointState(msg(JOINT_NAMES, [0, 0, 0, 0, 0, 0], effort))
  }

  it("is sim while the built-in simulation runs", () => {
    expect(selectReadout(useRobotStore.getState())).toBe("sim")
  })

  it("is live when /joint_states carries effort (Gazebo, mock hardware)", () => {
    apply([0.1, 0.1, 0.1, 0.01, 0.01, 0.01])
    expect(selectReadout(useRobotStore.getState())).toBe("live")
  })

  it("is cmd when /joint_states has no effort (real arm: commanded angles)", () => {
    apply([])
    expect(selectReadout(useRobotStore.getState())).toBe("cmd")
  })
})
