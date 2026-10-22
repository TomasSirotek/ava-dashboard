import type { IStatusStyle, SystemStatus } from "@/features/status/status.interface"

export const SYSTEM_STATUS: Record<SystemStatus, IStatusStyle> = {
  nominal: {
    label: "ALL SYSTEMS NOMINAL",
    hint: "rosbridge connected and /joint_states arriving",
    className: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  estop: {
    label: "EMERGENCY STOP",
    hint: "E-stop engaged: motion halted and controls locked",
    className: "text-destructive",
    dot: "bg-destructive",
  },
  "no-data": {
    label: "NO JOINT DATA",
    hint: "rosbridge is up, but nothing publishes /joint_states: the built-in simulation runs",
    className: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  connecting: {
    label: "CONNECTING…",
    hint: "Trying to reach rosbridge (see the Link tab); the built-in simulation runs meanwhile",
    className: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500 animate-pulse",
  },
  simulated: {
    label: "SIMULATED",
    hint: "Not connected to rosbridge (see the Link tab): the built-in simulation runs",
    className: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
}
