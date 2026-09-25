export interface IJointState {
  name: string[]
  position: number[]
  velocity: number[]
  effort: number[]
}

export interface IRobotState {
  jointState: IJointState
  commanded: number[]
  connected: boolean
  latency: number
  rate: number
}

export interface IRobotStore extends IRobotState {
  tick: () => void
}
