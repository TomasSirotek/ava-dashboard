import type { IRobotState } from "@/features/robot/robot.interface"

export const JOINT_NAMES = ["shoulder_pan", "shoulder_lift", "elbow_flex", "wrist_flex", "wrist_roll", "gripper"]
export const JOINT_SERVOS = ["SG90", "MG996R", "MG996R", "SG90", "SG90", "SG90"]

export const ROBOT_ID = "ava-arm-01"
export const ROBOT_MODEL = "6-DOF · 6 servos"

// Mock feed rate; replace with the rosbridge /joint_states subscription.
export const MOCK_TICK_MS = 180

export const INITIAL_ROBOT_STATE: IRobotState = {
  jointState: {
    name: JOINT_NAMES,
    position: [12.4, -28.7, 64.2, -11.6, 38.1, 7.5],
    velocity: [0.02, -0.01, 0.04, 0.01, -0.02, 0],
    effort: [42, 94, 88, 34, 18, 7],
  },
  commanded: [14, -30, 62, -10, 40, 8],
  connected: true,
  latency: 18,
  rate: 49.8,
}
