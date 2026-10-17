import { ListOrdered } from "lucide-react"
import { Panel } from "@/components/shared/panel"
import type { IGridPanelProps } from "@/components/shared/shared.interface"
import { DEMO_SETTLE_S, DEMOS, HOLD_STYLE, RUN_STATUS_STYLES, STEP_KIND_STYLES } from "@/features/demos/demos.content"
import { buildTimeline, formatSeconds, timeTicks, useDemoStore } from "@/features/demos/demos.store"
import { StepBar } from "@/features/demos/step-bar"
import { useNow } from "@/features/demos/use-now"
import { moveDuration, useMotionStore } from "@/features/motion/motion.store"
import { cn } from "@/lib/utils"

const pct = (s: number, total: number) => `${(s / total) * 100}%`

// Monitoring timeline of the current (or last) demo cycle: one row per step on a shared time axis.
// Executed steps sit at the times they really ran, the running one grows up to the playhead, the rest are drawn
// at their planned times from the motion settings. Times are what the dashboard commanded; the arm reports no
// "arrived" signal, so the move segment is the planned move time.
export function DemoTimeline({ className }: IGridPanelProps) {
  const run = useDemoStore((s) => s.run)
  const move = useMotionStore((s) => moveDuration(s)) + DEMO_SETTLE_S
  const now = useNow(run?.status === "running", 250)
  const demo = run ? DEMOS[run.demo] : null
  const timeline = run && demo ? buildTimeline(run, demo.steps, demo.loop, now, move) : null
  const ticks = timeline ? timeTicks(timeline.total) : []
  return (
    <Panel
      title="Demo timeline"
      icon={ListOrdered}
      className={className}
      bodyClassName="flex flex-col"
      meta={
        run && demo && timeline ? (
          <>
            <span className="text-foreground">{demo.label}</span>
            {demo.loop && <span>cycle {run.cycle}</span>}
            <span className={RUN_STATUS_STYLES[run.status].className}>{RUN_STATUS_STYLES[run.status].label}</span>
            <span>
              {formatSeconds(timeline.elapsed)} / {formatSeconds(timeline.total)}
            </span>
            <span className="ml-auto flex flex-wrap gap-x-2.5">
              {[...Object.values(STEP_KIND_STYLES), HOLD_STYLE].map(({ label, className: swatch }) => (
                <span key={label} className="flex items-center gap-1">
                  <span className={cn("size-2 rounded-[2px]", swatch)} />
                  {label}
                </span>
              ))}
            </span>
          </>
        ) : (
          <span>No demo has run yet. Start one in Control → Automatic.</span>
        )
      }
    >
      {timeline && (
        <>
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
              {run?.status === "running" && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-foreground"
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
        </>
      )}
    </Panel>
  )
}
