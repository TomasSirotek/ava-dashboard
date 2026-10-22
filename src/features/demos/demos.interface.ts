import type { LucideIcon } from "lucide-react"

export type DemoId = "wave" | "pick-place" | "joint-sweep" | "home-park"

/** One keyframe: a full pose in degrees (JOINT_NAMES order), held for `hold` seconds after arriving. */
export interface IDemoStep {
  /** Short name shown in the demo timeline, e.g. "Grip". */
  label: string
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

/** When one step of the current cycle ran, in run time: ms since the cycle start, pauses excluded. `end` is null while it runs. */
export interface IStepTrace {
  start: number
  end: number | null
}

export type RunStatus = "running" | "paused" | "finished" | "stopped"

/** The current or last demo run, as executed: what the timeline draws. */
export interface IDemoRun {
  demo: DemoId
  /** Repeat after the last step (the transport's loop setting when the run started). */
  loop: boolean
  /** 1-based; a looping run starts a new cycle each time it wraps to step 1. */
  cycle: number
  /** Wall time (epoch ms) the current cycle started. */
  startedAt: number
  /** Paused time within the current cycle so far (ms), and since when it is paused (epoch ms) while paused. */
  pausedMs: number
  pausedAt: number | null
  /** One entry per step started in this cycle, in order. */
  steps: IStepTrace[]
  status: RunStatus
}

export interface IDemoStore {
  /** Demo picked in the timeline; Play runs it. */
  selected: DemoId
  /** Transport loop setting; defaults to the selected demo's own. */
  loop: boolean
  running: DemoId | null
  /** Index of the step being executed. */
  step: number
  /** Kept after the demo ends so the timeline still shows how it went; replaced by the next start. */
  run: IDemoRun | null
  /** Pick a demo (ignored while one is running). */
  select: (id: DemoId) => void
  setLoop: (loop: boolean) => void
  /** Run the selected demo from its first step. */
  start: () => void
  /** Hold the arm where it is; resume repeats the interrupted step. */
  pause: () => void
  resume: () => void
  /** Interrupt the running demo (Stop, e-stop, leaving Automatic). */
  stop: () => void
  /** The runner moved on to `step` (0 after the last step of a looping run starts a new cycle). */
  beginStep: (step: number) => void
  /** A one-shot run completed its last step. */
  finish: () => void
}

/** What a step does, from how its pose differs from the one before: move the arm or only the gripper. */
export type StepKind = "motion" | "gripper"

/** One row of the timeline, in seconds from the cycle start. */
export interface ITimelineRow {
  label: string
  kind: StepKind
  /** done/active: executed (active still running); planned: still to come; skipped: the run stopped before it. */
  state: "done" | "active" | "planned" | "skipped"
  start: number
  /** End of the move (move time + settle); the hold follows until `end`. */
  moveEnd: number
  end: number
}

export interface ITimeline {
  rows: ITimelineRow[]
  /** Length of the time axis (s): the planned cycle, or longer if the run took longer. */
  total: number
  /** Seconds since the cycle start (up to the end of the run once it is over). */
  elapsed: number
}

export interface IStepBarProps {
  row: ITimelineRow
  /** Length of the time axis (s); bars are placed as a share of it. */
  total: number
}
