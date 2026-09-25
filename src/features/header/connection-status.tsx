import { OctagonX } from "lucide-react"
import { useControlStore } from "@/features/control/control.store"
import { useRobotStore } from "@/features/robot/robot.store"

export function ConnectionStatus() {
  const estop = useControlStore((s) => s.estop)
  const connected = useRobotStore((s) => s.connected)
  const live = useRobotStore((s) => s.source === "ros")
  if (estop)
    return (
      <span className="flex h-8 items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 text-sm font-medium text-red-700 dark:text-red-300">
        <OctagonX className="size-4" /> Stopped
      </span>
    )
  // Not live: rosbridge unreachable, or reachable but nothing publishes /joint_states.
  // Either way the numbers on screen are simulated, so say so.
  if (!live)
    return (
      <span
        title={
          connected ? "rosbridge is up, but no /joint_states - showing simulated data" : "rosbridge unreachable - showing simulated data"
        }
        className="flex h-8 items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 text-sm font-medium text-amber-700 dark:text-amber-300"
      >
        <span className="inline-flex size-2 rounded-full bg-amber-500" />
        {connected ? "No joint data" : "Simulated"}
      </span>
    )
  return (
    <span className="flex h-8 items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-2.5 text-sm font-medium text-green-700 dark:text-green-300">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-green-600" />
      </span>
      Connected
    </span>
  )
}
