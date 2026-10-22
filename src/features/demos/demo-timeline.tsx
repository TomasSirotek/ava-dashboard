import { ListOrdered } from "lucide-react"
import { Panel } from "@/components/shared/panel"
import type { IGridPanelProps } from "@/components/shared/shared.interface"
import { DemoPicker } from "@/features/demos/demo-picker"
import { DemoTransport } from "@/features/demos/demo-transport"
import { DEMO_SETTLE_S, DEMOS, HOLD_STYLE, RUN_STATUS_STYLES, STEP_KIND_STYLES } from "@/features/demos/demos.content"
import { buildTimeline, formatSeconds, timeTicks, useDemoStore } from "@/features/demos/demos.store"
import { StepBar } from "@/features/demos/step-bar"
import { useNow } from "@/features/demos/use-now"
import { moveDuration, useMotionStore } from "@/features/motion/motion.store"
import { cn } from "@/lib/utils"

const pct = (s: number, total: number) => `${(s / total) * 100}%`

// Demo player: pick a demo, then Play / Pause / Stop / Loop. One row per step on a shared time axis with a playhead.
// Before a run the selected demo's plan is shown; during and after it, executed steps sit at the times they really ran
// (pauses excluded) and the rest at their planned times. Times are what the dashboard commanded: the arm reports no
// "arrived" signal, so the move segment is the planned move time.
export function DemoTimeline({ className }: IGridPanelProps) {
  const selected = useDemoStore((s) => s.selected)
  const loop = useDemoStore((s) => s.loop)
  const storedRun = useDemoStore((s) => s.run)
  const move = useMotionStore((s) => moveDuration(s)) + DEMO_SETTLE_S
  // The last run is shown while its demo is selected; picking another demo shows that one's plan.
  const run = storedRun?.demo === selected ? storedRun : null
  const now = useNow(run?.status === "running", 100)
  const demo = DEMOS[selected]
  const timeline = buildTimeline(run, demo.steps, run?.loop ?? loop, now, move)
  const ticks = timeTicks(timeline.total)
  const status = RUN_STATUS_STYLES[run?.status ?? "ready"]
  const showHead = run !== null && (run.status === "running" || run.status === "paused")
  return (
    <Panel
      title="Demo timeline"
      icon={ListOrdered}
      className={className}
      bodyClassName="flex flex-col"
      meta={
        <>
          <span className={status.className}>{status.label}</span>
          <span className="text-foreground">
            {formatSeconds(timeline.elapsed)} / {formatSeconds(timeline.total)}
          </span>
          {run && (run.loop || run.cycle > 1) && <span>cycle {run.cycle}</span>}
          <span className="max-w-64 truncate">{demo.description}</span>
          <span className="ml-auto flex flex-wrap gap-x-2.5">
            {[...Object.values(STEP_KIND_STYLES), HOLD_STYLE].map(({ label, className: swatch }) => (
              <span key={label} className="flex items-center gap-1">
                <span className={cn("size-2 rounded-[2px]", swatch)} />
                {label}
              </span>
            ))}
          </span>
        </>
      }
    >
      <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-card px-3 py-1.5">
        <DemoPicker />
        <DemoTransport />
      </div>
      <div className="flex min-h-0 flex-1 px-3 pt-2">
        <ol className="w-20 shrink-0 pr-2 text-[11px] @sm:w-28">
          {timeline.rows.map((row, i) => (
            <li
              key={`${i}-${row.label}`}
              className={cn("h-6 truncate leading-6", row.state === "active" ? "text-foreground" : "text-muted-foreground")}
            >
              {row.label}
            </li>
          ))}
        </ol>
        <div className="relative min-w-0 flex-1">
          {ticks.map((t) => (
            <span key={t} aria-hidden className="absolute inset-y-0 w-px bg-border" style={{ left: pct(t, timeline.total) }} />
          ))}
          <ol aria-label="Demo steps" className="relative">
            {timeline.rows.map((row, i) => (
              <li key={`${i}-${row.label}`} aria-current={row.state === "active" ? "step" : undefined} className="relative h-6">
                <StepBar row={row} total={timeline.total} />
              </li>
            ))}
          </ol>
          {showHead && (
            <span
              aria-hidden
              data-testid="playhead"
              className={cn("absolute inset-y-0 w-0.5 -translate-x-1/2", run?.status === "paused" ? "bg-amber-500" : "bg-foreground")}
              style={{ left: pct(timeline.elapsed, timeline.total) }}
            />
          )}
        </div>
      </div>
      <div className="sticky bottom-0 flex shrink-0 border-t bg-card px-3 py-1 text-[10px] text-muted-foreground tabular-nums">
        <span className="w-20 shrink-0 @sm:w-28" />
        <div className="relative h-4 min-w-0 flex-1">
          {ticks.map((t, i) => (
            <span key={t} className={cn("absolute top-0", i > 0 && "-translate-x-1/2")} style={{ left: pct(t, timeline.total) }}>
              {formatSeconds(t)}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  )
}
