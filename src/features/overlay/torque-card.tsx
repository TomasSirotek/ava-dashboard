import { Heading } from "@/components/shared/heading"
import { overlayCard } from "@/components/shared/shared.styles"
import { TORQUE_WARN } from "@/features/overlay/overlay.content"
import { JOINT_NAMES, JOINT_SERVOS } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"
import { cn } from "@/lib/utils"

export function TorqueCard() {
  const effort = useRobotStore((s) => s.jointState.effort)
  return (
    <div className={overlayCard}>
      <Heading>Torque</Heading>
      <div className="flex flex-col gap-2">
        {effort.map((value, i) => {
          const warn = value > TORQUE_WARN
          return (
            <div key={JOINT_NAMES[i]}>
              <div className="mb-1 flex items-baseline text-sm">
                <span>{JOINT_NAMES[i]}</span>
                <span className="ml-2 text-xs text-muted-foreground">{JOINT_SERVOS[i]}</span>
                <span className={cn("ml-auto font-mono tabular-nums", warn && "text-destructive")}>{value.toFixed(0)}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full bg-foreground transition-[width]", warn && "bg-destructive")}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
