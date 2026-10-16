/** One snapshot of the joint state, in the UI's units (degrees, °/s, % of stall). */
export interface IJointSample {
  /** Epoch milliseconds. */
  t: number
  position: number[]
  velocity: number[]
  /** Null when nothing measures effort (built-in simulation, real arm). */
  effort: number[] | null
}

export interface IHistoryStore {
  /** Oldest first, covering the last HISTORY_WINDOW_MS. */
  samples: IJointSample[]
  push: (sample: IJointSample) => void
}

/** Which joint-state field a chart plots. */
export type JointMetric = "position" | "velocity" | "effort"

export interface IJointChartProps {
  metric: JointMetric
  title: string
  unit: string
}
