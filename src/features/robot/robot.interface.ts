export interface IJointState {
  name: string[]
  position: number[]
  velocity: number[]
  effort: number[]
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
  latency: number
  rate: number
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
}
