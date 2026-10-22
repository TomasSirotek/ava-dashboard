import { toast } from "sonner"
import { create } from "zustand"
import { DEMOS, TIMELINE_MAX_TICKS, TIMELINE_TICK_STEPS } from "@/features/demos/demos.content"
import type { DemoId, IDemoRun, IDemoStep, IDemoStore, ITimeline, ITimelineRow, StepKind } from "@/features/demos/demos.interface"

const FIRST_DEMO = Object.keys(DEMOS)[0] as DemoId

/** Run time of the current cycle at `now` (ms since the cycle start, pauses excluded). */
export const runTime = (run: IDemoRun, now: number) => now - run.startedAt - run.pausedMs - (run.pausedAt === null ? 0 : now - run.pausedAt)

// Closes the step that is still running (if any) at `now`.
const closeOpenStep = (run: IDemoRun, now: number): IDemoRun => {
  const t = runTime(run, now)
  return { ...run, steps: run.steps.map((s) => (s.end === null ? { ...s, end: t } : s)) }
}

// Ends a run: the open step closes at the current run time (a pause in progress does not count).
const endRun = (run: IDemoRun, now: number, status: "finished" | "stopped"): IDemoRun => ({ ...closeOpenStep(run, now), status })

export const useDemoStore = create<IDemoStore>()((set, get) => ({
  selected: FIRST_DEMO,
  loop: DEMOS[FIRST_DEMO].loop,
  running: null,
  step: 0,
  run: null,
  select: (id) => {
    if (get().running) return
    set({ selected: id, loop: DEMOS[id].loop })
  },
  setLoop: (loop) => set((s) => ({ loop, run: s.run && s.running ? { ...s.run, loop } : s.run })),
  start: () => {
    const { selected, loop } = get()
    const run: IDemoRun = {
      demo: selected,
      loop,
      cycle: 1,
      startedAt: Date.now(),
      pausedMs: 0,
      pausedAt: null,
      steps: [],
      status: "running",
    }
    set({ running: selected, step: 0, run })
    toast.info(`Demo: ${DEMOS[selected].label}`)
  },
  pause: () => {
    const { run } = get()
    if (run?.status !== "running") return
    set({ run: { ...run, status: "paused", pausedAt: Date.now() } })
  },
  resume: () => {
    const { run } = get()
    if (run?.status !== "paused" || run.pausedAt === null) return
    const now = Date.now()
    set({ run: { ...run, status: "running", pausedMs: run.pausedMs + now - run.pausedAt, pausedAt: null } })
  },
  stop: () => {
    const { running, run } = get()
    if (!running) return
    set({ running: null, step: 0, run: run && endRun(run, Date.now(), "stopped") })
    toast.info(`${DEMOS[running].label} stopped`)
  },
  beginStep: (step) =>
    set((s) => {
      if (!s.run) return { step }
      const now = Date.now()
      // Back at step 1 after the last step: a looping run starts its next cycle with an empty trace.
      if (step === 0 && s.run.steps.length > 0)
        return {
          step,
          run: { ...s.run, cycle: s.run.cycle + 1, startedAt: now, pausedMs: 0, pausedAt: null, steps: [{ start: 0, end: null }] },
        }
      const run = closeOpenStep(s.run, now)
      return { step, run: { ...run, steps: [...run.steps, { start: runTime(run, now), end: null }] } }
    }),
  finish: () => set((s) => ({ running: null, step: 0, run: s.run && endRun(s.run, Date.now(), "finished") })),
}))

/** Gripper-only step when nothing but the gripper (last joint) changes from the previous pose; otherwise the arm moves. */
export const stepKind = (prev: number[] | undefined, pose: number[]): StepKind =>
  prev !== undefined && pose.slice(0, -1).every((v, i) => v === prev[i]) && pose.at(-1) !== prev.at(-1) ? "gripper" : "motion"

/**
 * The cycle as timeline rows (seconds of run time from the cycle start): executed steps at their real times, the running
 * one up to `now`, and the rest at their planned times (move = `moveS` incl. settle, then the step's hold) after it.
 * Once the run is over, steps it never reached are "skipped". Without a run (nothing played yet) every step is planned.
 * A looping demo's first step comes after its last.
 */
export function buildTimeline(run: IDemoRun | null, steps: IDemoStep[], loop: boolean, now: number, moveS: number): ITimeline {
  const over = run !== null && (run.status === "finished" || run.status === "stopped")
  const elapsed = run === null ? 0 : (over ? (run.steps.at(-1)?.end ?? 0) : runTime(run, now)) / 1000
  let cursor = 0
  const rows = steps.map((step, i): ITimelineRow => {
    const kind = stepKind(i > 0 ? steps[i - 1].pose : loop ? steps.at(-1)?.pose : undefined, step.pose)
    const trace = run?.steps[i]
    const planned = moveS + step.hold
    if (!trace) {
      const row = { label: step.label, kind, state: over ? ("skipped" as const) : ("planned" as const), start: cursor }
      cursor += planned
      return { ...row, moveEnd: row.start + moveS, end: cursor }
    }
    const start = trace.start / 1000
    const end = trace.end === null ? Math.max(elapsed, start) : trace.end / 1000
    // A running step reserves its planned length, so the steps after it start where it is due to end.
    cursor = trace.end === null ? Math.max(end, start + planned) : end
    return { label: step.label, kind, state: trace.end === null ? "active" : "done", start, moveEnd: Math.min(start + moveS, end), end }
  })
  return { rows, total: Math.max(cursor, elapsed, 1), elapsed }
}

/** Evenly spaced axis ticks (s) from 0 to `total`, at most TIMELINE_MAX_TICKS intervals. */
export function timeTicks(total: number) {
  const step = TIMELINE_TICK_STEPS.find((s) => total / s <= TIMELINE_MAX_TICKS) ?? TIMELINE_TICK_STEPS.at(-1) ?? 60
  return Array.from({ length: Math.floor(total / step) + 1 }, (_, i) => i * step)
}

/** Seconds as m:ss, e.g. 75 -> "1:15". */
export const formatSeconds = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
