import { useControlStore } from "@/features/control/control.store"
import type { IRobotState } from "@/features/robot/robot.interface"
import { useRobotStore } from "@/features/robot/robot.store"
import type { SystemStatus } from "@/features/status/status.interface"

// E-stop wins over everything; otherwise live /joint_states means nominal, and without it the
// simulation runs, with or without a rosbridge link.
export const getSystemStatus = (estop: boolean, link: Pick<IRobotState, "connected" | "source">): SystemStatus => {
  if (estop) return "estop"
  if (link.source === "ros") return "nominal"
  return link.connected ? "no-data" : "simulated"
}

export function useSystemStatus() {
  const estop = useControlStore((s) => s.estop)
  const connected = useRobotStore((s) => s.connected)
  const source = useRobotStore((s) => s.source)
  return getSystemStatus(estop, { connected, source })
}
