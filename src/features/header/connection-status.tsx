import { OctagonX } from "lucide-react"
import { statusCell } from "@/components/shared/shared.styles"
import { useControlStore } from "@/features/control/control.store"
import { useRobotStore } from "@/features/robot/robot.store"
import { cn } from "@/lib/utils"

// One cell of the status block in the left panel.
export function ConnectionStatus() {
  const estop = useControlStore((s) => s.estop)
  const connected = useRobotStore((s) => s.connected)
  const live = useRobotStore((s) => s.source === "ros")
  if (estop)
    return (
      <span className={cn(statusCell, "text-destructive")}>
        <OctagonX className="size-3.5" /> Stopped
      </span>
    )
  if (!live)
    return (
      <span
        title={
          connected ? "rosbridge is up, but no /joint_states - showing simulated data" : "rosbridge unreachable - showing simulated data"
        }
        className={cn(statusCell, "text-black dark:text-white")}
      >
        <span className="inline-flex size-1.5 rounded-full bg-primary" />
        {connected ? "No joint data" : "Simulated"}
      </span>
    )
  return (
    <span className={cn(statusCell, "text-black dark:text-white")}>
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
      </span>
      Connected
    </span>
  )
}
