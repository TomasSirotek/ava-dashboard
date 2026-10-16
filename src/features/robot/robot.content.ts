import type { IRobotState, JointReadout } from "@/features/robot/robot.interface"

export const JOINT_NAMES = ["shoulder_pan", "shoulder_lift", "elbow_flex", "wrist_flex", "wrist_roll", "gripper"]
// Display names, same order as JOINT_NAMES (which stay the ROS joint ids).
export const JOINT_LABELS = ["Shoulder pan", "Shoulder lift", "Elbow flex", "Wrist flex", "Wrist roll", "Gripper"]
// 3x MG996R carry the arm and the load (shoulder pan, shoulder lift, elbow); the wrist and gripper are SG90s.
// Same layout as the URDF effort limits and tools/torque_monitor.py.
export const JOINT_SERVOS = ["MG996R", "MG996R", "MG996R", "SG90", "SG90", "SG90"]

export const ROBOT_ID = "ava-arm-01"
export const ROBOT_MODEL = "6-DOF · 6 servos"

// Tooltip on the angle next to each joint slider (see selectReadout).
export const READOUT_HINTS: Record<JointReadout, string> = {
  sim: "Built-in simulation: no robot connected",
  live: "Measured joint angle from /joint_states",
  cmd: "Commanded angle: the real servos report no position, so this is where the arm was told to go",
}

// rosbridge websocket (ros2 launch rosbridge_server rosbridge_websocket_launch.xml). Override with VITE_ROSBRIDGE_URL.
export const ROSBRIDGE_URL = import.meta.env.VITE_ROSBRIDGE_URL ?? "ws://localhost:9090"
export const RECONNECT_MS = 3000
// Round-trip latency is measured by timing a rosapi call (started by the rosbridge launch file).
export const LATENCY_PROBE_MS = 2000

// Stall torque per servo model at 6 V (N·m); live effort is shown as a percentage of it. Same values as the URDF.
export const SERVO_STALL_NM: Record<string, number> = { SG90: 0.157, MG996R: 1.079 } // SG90 1.6 kg·cm, MG996R 11 kg·cm

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
    position: [9.4, 43.8, 66.2, -36.1, 19.2, 4.6],
    velocity: [0, 0, 0, 0, 0, 0],
    effort: null,
  },
  commanded: [10, 45, 65, -35, 20, 5],
  commandId: 0,
  connected: false,
  source: "mock",
  latency: null,
  rate: null,
  commandsSent: 0,
  lastCommandAt: null,
}
