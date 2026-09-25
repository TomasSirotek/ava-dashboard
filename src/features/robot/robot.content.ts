import type { IRobotState } from "@/features/robot/robot.interface"

export const JOINT_NAMES = ["shoulder_pan", "shoulder_lift", "elbow_flex", "wrist_flex", "wrist_roll", "gripper"]
export const JOINT_SERVOS = ["SG90", "MG996R", "MG996R", "MG996R", "SG90", "SG90"]

export const ROBOT_ID = "ava-arm-01"
export const ROBOT_MODEL = "6-DOF · 6 servos"

// rosbridge websocket (ros2 launch rosbridge_server rosbridge_websocket_launch.xml). Override with VITE_ROSBRIDGE_URL.
export const ROSBRIDGE_URL = import.meta.env.VITE_ROSBRIDGE_URL ?? "ws://localhost:9090"
export const RECONNECT_MS = 3000
// Round-trip latency is measured by timing a rosapi call (started by the rosbridge launch file).
export const LATENCY_PROBE_MS = 2000

// Stall torque per servo model (N·m); live effort is shown as a percentage of it.
export const SERVO_STALL_NM: Record<string, number> = { SG90: 0.1765, MG996R: 1.079 } // MG996R 11 kg·cm @ 6 V

// ros2_control joint_trajectory_controller command topic (same in Gazebo and on hardware).
export const TRAJECTORY_TOPIC = "/joint_trajectory_controller/joint_trajectory"
// While a slider is dragged, send at most one command per this many ms.
export const COMMAND_THROTTLE_MS = 100
// E-stop: how fast the arm settles onto its current pose.
export const HOLD_S = 0.1

// Simulated telemetry rate, used only while rosbridge is unreachable.
export const MOCK_TICK_MS = 180

export const INITIAL_ROBOT_STATE: IRobotState = {
  jointState: {
    name: JOINT_NAMES,
    position: [12.4, -28.7, 64.2, -11.6, 38.1, 7.5],
    velocity: [0.02, -0.01, 0.04, 0.01, -0.02, 0],
    effort: [42, 94, 88, 34, 18, 7],
  },
  commanded: [14, -30, 62, -10, 40, 8],
  commandId: 0,
  connected: false,
  source: "mock",
  latency: 18,
  rate: 49.8,
}
