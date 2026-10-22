import { useConnectionStore } from "@/features/connection/connection.store"
import { useControlStore } from "@/features/control/control.store"
import type { IRobotState } from "@/features/robot/robot.interface"
import { useRobotStore } from "@/features/robot/robot.store"
import type { SystemStatus } from "@/features/status/status.interface"

// E-stop wins over everything; otherwise live /joint_states means nominal, and without it the
// simulation runs: with a link but no data, while trying to connect, or not connected.
export const getSystemStatus = (estop: boolean, link: Pick<IRobotState, "connected" | "source">, trying: boolean): SystemStatus => {
  if (estop) return "estop"
  if (link.source === "ros") return "nominal"
  if (link.connected) return "no-data"
  return trying ? "connecting" : "simulated"
}

export function useSystemStatus() {
  const estop = useControlStore((s) => s.estop)
  const connected = useRobotStore((s) => s.connected)
  const source = useRobotStore((s) => s.source)
  const trying = useConnectionStore((s) => s.tryingUntil !== null)
  return getSystemStatus(estop, { connected, source }, trying)
}
