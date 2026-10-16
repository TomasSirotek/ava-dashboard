import { Heading } from "@/components/shared/heading"
import { TORQUE_WARN } from "@/features/overlay/overlay.content"
import { JOINT_LABELS, JOINT_NAMES, JOINT_SERVOS } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"
import { cn } from "@/lib/utils"

// Joint torque as % of the servo's stall torque. Only rendered while /joint_states carries effort (Gazebo):
// the hobby servos cannot measure torque, so on the real arm and in the offline simulation it is hidden.
export function TorqueCard() {
  const effort = useRobotStore((s) => s.jointState.effort)
  if (!effort) return null
  return (
    <section>
      <Heading>Torque</Heading>
      <div className="flex flex-col gap-3">
        {effort.map((value, i) => {
          const warn = value > TORQUE_WARN
          return (
            <div key={JOINT_NAMES[i]}>
              <div className="mb-1.5 flex items-baseline">
                <span className="text-sm font-medium">{JOINT_LABELS[i]}</span>
                <span className="ml-2 text-[11px] text-muted-foreground">{JOINT_SERVOS[i]}</span>
                <span className={cn("ml-auto text-xs tabular-nums", warn && "text-destructive")}>{value.toFixed(0)}%</span>
              </div>
              <div className="h-0.5 overflow-hidden bg-muted">
                <div className={cn("h-full bg-primary transition-[width]", warn && "bg-destructive")} style={{ width: `${value}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
