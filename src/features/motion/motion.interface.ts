export type MotionTarget = "sim" | "real"

export interface IMotionTargetItem {
  value: MotionTarget
  label: string
}

export interface IMotionSettings {
  target: MotionTarget
  /** % of full speed; stretches the move duration. */
  velocity: number
  /** % - shown for MoveIt later; direct joint commands do not use it yet. */
  accel: number
  /** Seconds a move takes at 100% velocity. */
  duration: number
}

export interface IMotionStore extends IMotionSettings {
  update: (patch: Partial<IMotionSettings>) => void
}
