import type { IPart, IPartReading } from "@/features/parts/parts.interface"
import { useRobotStore } from "@/features/robot/robot.store"

// Mock electrical readings: joint parts follow that joint's effort, the rest idle with a little jitter.
// Replace with the real current/voltage sensor topics.
export function usePartReading(part: IPart): IPartReading {
  const load = useRobotStore((s) => (part.joint === undefined ? 0 : s.jointState.effort[part.joint]))
  const jitter = useRobotStore((s) => (s.latency % 7) / 7) // changes every tick
  const drive = part.joint === undefined ? 0.3 + jitter * 0.4 : load / 100
  const current = part.idleCurrent + drive * (part.maxCurrent - part.idleCurrent)
  return {
    load,
    current,
    voltage: part.nominalVoltage - current * 0.12, // supply sags under load
    temperature: 28 + drive * 25,
  }
}
