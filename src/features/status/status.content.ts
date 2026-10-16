import type { IStatusStyle, SystemStatus } from "@/features/status/status.interface"

export const SYSTEM_STATUS: Record<SystemStatus, IStatusStyle> = {
  nominal: {
    label: "All systems nominal",
    hint: "rosbridge connected and /joint_states arriving",
    className: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  estop: {
    label: "Emergency stop",
    hint: "E-stop engaged: motion halted and controls locked",
    className: "text-destructive",
    dot: "bg-destructive",
  },
  "no-data": {
    label: "No joint data",
    hint: "rosbridge is up, but nothing publishes /joint_states: the built-in simulation runs",
    className: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  simulated: {
    label: "Simulated · no robot",
    hint: "rosbridge unreachable: the built-in simulation runs",
    className: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
}
