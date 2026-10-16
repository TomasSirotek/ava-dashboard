import { capsLabel, statusCell } from "@/components/shared/shared.styles"
import { CONTROL_MODES } from "@/features/control/control.content"
import { useControlStore } from "@/features/control/control.store"
import { ModeBadge } from "@/features/control/mode-badge"
import { ConnectionStatus } from "@/features/header/connection-status"
import { ROBOT_ID, ROBOT_MODEL } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"
import { cn } from "@/lib/utils"

export function InfoCard() {
  const estop = useControlStore((s) => s.estop)
  const mode = useControlStore((s) => s.mode)
  const connected = useRobotStore((s) => s.source === "ros")
  const status = estop ? "Stopped" : connected ? "Online" : "Offline"
  const rows = [
    ["ID", ROBOT_ID],
    ["Model", ROBOT_MODEL],
    ["Mode", CONTROL_MODES[mode].label],
  ]
  return (
    <section>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className={cn(capsLabel, "text-muted-foreground")}>{k}</dt>
            <dd className="text-right text-xs tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-sm border *:min-w-0">
        <ConnectionStatus />
        <span
          className={cn(
            statusCell,
            "gap-1.5 border-l",
            estop && "text-destructive",
            !estop && connected && "text-green-600 dark:text-green-400",
            !estop && !connected && "text-destructive",
          )}
        >
          <span className={cn("size-1.5 rounded-full", estop ? "bg-destructive" : connected ? "bg-green-500" : "bg-destructive")} />
          {status}
        </span>
        <div className="col-span-2 border-t">
          <ModeBadge />
        </div>
      </div>
    </section>
  )
}
