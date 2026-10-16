import { ListOrdered } from "lucide-react"
import { Panel } from "@/components/shared/panel"
import type { IGridPanelProps } from "@/components/shared/shared.interface"
import { DEMO_SETTLE_S, DEMOS } from "@/features/demos/demos.content"
import { useDemoStore } from "@/features/demos/demos.store"
import { moveDuration, useMotionStore } from "@/features/motion/motion.store"
import { cn } from "@/lib/utils"

// The running demo as one track of steps, each as wide as the time it takes (move + settle + hold):
// done steps dimmed, the current one in the accent colour. Idle when no demo runs.
export function DemoTimeline({ className }: IGridPanelProps) {
  const running = useDemoStore((s) => s.running)
  const step = useDemoStore((s) => s.step)
  const move = useMotionStore((s) => moveDuration(s))
  const demo = running ? DEMOS[running] : null
  const total = demo?.steps.reduce((sum, s) => sum + move + DEMO_SETTLE_S + s.hold, 0) ?? 0
  return (
    <Panel
      title="Demo timeline"
      icon={ListOrdered}
      className={className}
      bodyClassName="px-3 py-2"
      meta={
        demo ? (
          <>
            <span className="text-foreground">{demo.label}</span>
            <span>
              Step {step + 1}/{demo.steps.length}: {demo.steps[step].label}
            </span>
            <span>
              {total.toFixed(1)} s per {demo.loop ? "loop" : "run"}
            </span>
          </>
        ) : (
          <span>No demo running. Start one in Control → Automatic.</span>
        )
      }
    >
      <ol className="flex h-6 gap-0.5" aria-label="Demo steps">
        {demo
          ? demo.steps.map((s, i) => (
              <li
                key={`${i}-${s.label}`}
                title={`${i + 1}. ${s.label}`}
                style={{ flexGrow: move + DEMO_SETTLE_S + s.hold }}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "min-w-1 basis-0 truncate rounded-sm px-1 text-[10px] leading-6",
                  i < step && "bg-primary/25 text-foreground/70",
                  i === step && "bg-primary text-primary-foreground",
                  i > step && "bg-muted text-muted-foreground",
                )}
              >
                {s.label}
              </li>
            ))
          : null}
        {!demo && <li className="flex-1 rounded-sm border border-dashed" />}
      </ol>
    </Panel>
  )
}
