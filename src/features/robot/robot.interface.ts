/** Where the shown joint angles come from: built-in simulation, measured (Gazebo), or commanded (real arm). */
export type JointReadout = "sim" | "live" | "cmd"

export interface IJointState {
  name: string[]
  position: number[]
  velocity: number[]
  /**
   * % of stall torque per joint, or null when nothing measures it: the offline simulation and the real
   * arm (hobby servos report no torque). Only Gazebo and ros2_control's mock hardware publish effort.
   */
  effort: number[] | null
}

export interface IRobotState {
  jointState: IJointState
  /** Target pose in degrees, set by the sliders (or synced from the robot). */
  commanded: number[]
  /** Bumped on every user command; the command sender watches it. Syncs do not bump it. */
  commandId: number
  connected: boolean
  /** Where jointState comes from: live rosbridge /joint_states, or the offline simulation. */
  source: "ros" | "mock"
  /** rosbridge round-trip time in ms (rosapi call); null while not connected. */
  latency: number | null
  /** Measured /joint_states rate in Hz; null until live messages arrive. */
  rate: number | null
  /** Trajectory commands published to the controller this session, and when the last one went out (epoch ms). */
  commandsSent: number
  lastCommandAt: number | null
}

/** sensor_msgs/JointState as delivered by rosbridge (radians, rad/s, N·m). */
export interface IJointStateMsg {
  name: string[]
  position: number[]
  velocity: number[]
  effort: number[]
}

export interface IRobotStore extends IRobotState {
  tick: () => void
  applyJointState: (msg: IJointStateMsg) => void
  /** User moved one joint. */
  setCommanded: (index: number, deg: number) => void
  /** Replace the whole target; `fromUser: false` for syncs that must not be sent to the robot. */
  setCommandedAll: (deg: number[], fromUser?: boolean) => void
  setLink: (link: Partial<Pick<IRobotState, "connected" | "source" | "latency" | "rate">>) => void
  /** Called for every trajectory command actually published. */
  countCommand: () => void
}
