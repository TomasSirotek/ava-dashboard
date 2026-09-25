import { overlayCard } from "@/components/shared/shared.styles"
import { CONTROL_MODES } from "@/features/control/control.content"
import { useControlStore } from "@/features/control/control.store"
import { ROBOT_ID, ROBOT_MODEL } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"
import { cn } from "@/lib/utils"

export function InfoCard() {
  const estop = useControlStore((s) => s.estop)
  const mode = useControlStore((s) => s.mode)
  const rate = useRobotStore((s) => s.rate)
  const latency = useRobotStore((s) => s.latency)
  const connected = useRobotStore((s) => s.source === "ros")
  const status = estop ? "Stopped" : connected ? "Online" : "Offline"
  const rows = [
    ["ID", ROBOT_ID],
    ["Model", ROBOT_MODEL],
    ["Mode", CONTROL_MODES[mode].label],
  ]
  return (
    <div className={overlayCard}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-semibold tracking-tight">AVA</span>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
            estop && "bg-red-500/10 text-red-700 dark:text-red-300",
            !estop && connected && "bg-green-500/10 text-green-700 dark:text-green-300",
            !estop && !connected && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
          )}
        >
          <span className={cn("size-1.5 rounded-full", estop ? "bg-red-500" : connected ? "bg-green-500" : "bg-amber-500")} />
          {status}
        </span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-mono tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
