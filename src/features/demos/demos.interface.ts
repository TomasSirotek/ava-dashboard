import type { LucideIcon } from "lucide-react"

export type DemoId = "wave" | "pick-place" | "joint-sweep" | "home-park"

/** One keyframe: a full pose in degrees (JOINT_NAMES order), held for `hold` seconds after arriving. */
export interface IDemoStep {
  pose: number[]
  hold: number
}

export interface IDemo {
  id: DemoId
  label: string
  description: string
  icon: LucideIcon
  /** Repeat until stopped, or run once. */
  loop: boolean
  steps: IDemoStep[]
}

export interface IDemoStore {
  running: DemoId | null
  /** Index of the step being executed. */
  step: number
  start: (id: DemoId) => void
  stop: () => void
  setStep: (step: number) => void
}
