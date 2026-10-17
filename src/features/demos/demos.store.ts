import { toast } from "sonner"
import { create } from "zustand"
import { DEMOS, TIMELINE_MAX_TICKS, TIMELINE_TICK_STEPS } from "@/features/demos/demos.content"
import type { IDemoRun, IDemoStep, IDemoStore, ITimeline, ITimelineRow, StepKind } from "@/features/demos/demos.interface"

// Closes the step that is still running (if any) at `now`.
const closeOpenStep = (run: IDemoRun, now: number): IDemoRun => ({
  ...run,
  steps: run.steps.map((s) => (s.end === null ? { ...s, end: now } : s)),
})

export const useDemoStore = create<IDemoStore>()((set, get) => ({
  running: null,
  step: 0,
  run: null,
  start: (id) => {
    set({ running: id, step: 0, run: { demo: id, cycle: 1, startedAt: Date.now(), steps: [], status: "running" } })
    toast.info(`Demo: ${DEMOS[id].label}`)
  },
  stop: () => {
    const { running, run } = get()
    if (!running) return
    set({ running: null, step: 0, run: run && { ...closeOpenStep(run, Date.now()), status: "stopped" } })
    toast.info(`${DEMOS[running].label} stopped`)
  },
  beginStep: (step) =>
    set((s) => {
      if (!s.run) return { step }
      const now = Date.now()
      // Back at step 1 after the last step: a looping demo starts its next cycle with an empty trace.
      if (step === 0 && s.run.steps.length > 0)
        return { step, run: { ...s.run, cycle: s.run.cycle + 1, startedAt: now, steps: [{ start: now, end: null }] } }
      const run = closeOpenStep(s.run, now)
      return { step, run: { ...run, steps: [...run.steps, { start: now, end: null }] } }
    }),
  finish: () => set((s) => ({ running: null, step: 0, run: s.run && { ...closeOpenStep(s.run, Date.now()), status: "finished" } })),
}))

/** Gripper-only step when nothing but the gripper (last joint) changes from the previous pose; otherwise the arm moves. */
export const stepKind = (prev: number[] | undefined, pose: number[]): StepKind =>
  prev !== undefined && pose.slice(0, -1).every((v, i) => v === prev[i]) && pose.at(-1) !== prev.at(-1) ? "gripper" : "motion"

/**
 * The cycle as timeline rows (seconds from the cycle start): executed steps at their real times, the running one up
 * to `now`, and the rest at their planned times (move = `moveS` incl. settle, then the step's hold) after it.
 * Once the run is over, steps it never reached are "skipped". A looping demo's first step comes after its last.
 */
export function buildTimeline(run: IDemoRun, steps: IDemoStep[], loop: boolean, now: number, moveS: number): ITimeline {
  const sec = (t: number) => (t - run.startedAt) / 1000
  const over = run.status !== "running"
  const elapsed = sec(over ? (run.steps.at(-1)?.end ?? run.startedAt) : now)
  let cursor = 0
  const rows = steps.map((step, i): ITimelineRow => {
    const kind = stepKind(i > 0 ? steps[i - 1].pose : loop ? steps.at(-1)?.pose : undefined, step.pose)
    const trace = run.steps[i]
    const planned = moveS + step.hold
    if (!trace) {
      const row = { label: step.label, kind, state: over ? ("skipped" as const) : ("planned" as const), start: cursor }
      cursor += planned
      return { ...row, moveEnd: row.start + moveS, end: cursor }
    }
    const start = sec(trace.start)
    const end = trace.end === null ? Math.max(sec(now), start) : sec(trace.end)
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
